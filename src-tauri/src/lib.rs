use device_query::{DeviceQuery, DeviceState};
use screenshots::Screen;
use std::fs;
use std::path::PathBuf;
use std::str::FromStr;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    AppHandle, Emitter, Manager, State,
};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

#[cfg(windows)]
use windows::Win32::Foundation::POINT;
#[cfg(windows)]
use windows::Win32::Graphics::Gdi::{GetDC, GetPixel, ReleaseDC};
#[cfg(windows)]
use windows::Win32::UI::WindowsAndMessaging::GetCursorPos;

static QUITTING: AtomicBool = AtomicBool::new(false);
const LIBRARY_FILE_NAME: &str = "iris-library.json";

fn library_file_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|err| format!("Failed to resolve app data directory: {err}"))?;

    fs::create_dir_all(&app_data_dir)
        .map_err(|err| format!("Failed to create app data directory: {err}"))?;

    Ok(app_data_dir.join(LIBRARY_FILE_NAME))
}

#[tauri::command]
fn get_library_file_path(app: AppHandle) -> Result<String, String> {
    Ok(library_file_path(&app)?.to_string_lossy().to_string())
}

#[tauri::command]
fn read_library_file(app: AppHandle) -> Result<Option<String>, String> {
    let path = library_file_path(&app)?;
    if !path.exists() {
        return Ok(None);
    }

    fs::read_to_string(path)
        .map(Some)
        .map_err(|err| format!("Failed to read library file: {err}"))
}

#[tauri::command]
fn write_library_file(app: AppHandle, contents: String) -> Result<(), String> {
    let path = library_file_path(&app)?;
    let temp_path = path.with_extension("json.tmp");
    let backup_path = path.with_extension("json.bak");

    fs::write(&temp_path, contents)
        .map_err(|err| format!("Failed to write temporary library file: {err}"))?;

    if path.exists() {
        fs::copy(&path, &backup_path)
            .map_err(|err| format!("Failed to back up existing library file: {err}"))?;
        fs::remove_file(&path)
            .map_err(|err| format!("Failed to replace existing library file: {err}"))?;
    }

    if let Err(err) = fs::rename(&temp_path, &path) {
        if backup_path.exists() {
            let _ = fs::copy(&backup_path, &path);
        }
        return Err(format!("Failed to replace library file: {err}"));
    }

    if backup_path.exists() {
        let _ = fs::remove_file(&backup_path);
    }

    Ok(())
}

#[tauri::command]
async fn pick_color() -> Option<String> {
    let device_state = DeviceState::new();
    let mouse = device_state.get_mouse();
    let (x, y) = mouse.coords;
    let screens = Screen::all().unwrap_or_default();

    for screen in screens {
        if x >= screen.display_info.x
            && x < screen.display_info.x + screen.display_info.width as i32
            && y >= screen.display_info.y
            && y < screen.display_info.y + screen.display_info.height as i32
        {
            let relative_x = x - screen.display_info.x;
            let relative_y = y - screen.display_info.y;

            if let Ok(image) = screen.capture_area(relative_x, relative_y, 1, 1) {
                let rgba = image.get_pixel(0, 0);
                return Some(format!("#{:02X}{:02X}{:02X}", rgba[0], rgba[1], rgba[2]));
            }
        }
    }
    None
}

#[cfg(windows)]
#[tauri::command]
fn get_pixel_at_cursor() -> Option<String> {
    unsafe {
        let mut pt = POINT::default();
        if GetCursorPos(&mut pt).is_ok() {
            let hdc = GetDC(None);
            if !hdc.is_invalid() {
                let color = GetPixel(hdc, pt.x, pt.y);
                let _ = ReleaseDC(None, hdc);
                if color.0 != 0xFFFFFFFF {
                    let r = (color.0 & 0xFF) as u8;
                    let g = ((color.0 >> 8) & 0xFF) as u8;
                    let b = ((color.0 >> 16) & 0xFF) as u8;
                    return Some(format!("#{:02X}{:02X}{:02X}", r, g, b));
                }
            }
        }
    }
    None
}

#[cfg(not(windows))]
#[tauri::command]
fn get_pixel_at_cursor() -> Option<String> {
    let device_state = DeviceState::new();
    let mouse = device_state.get_mouse();
    let (x, y) = mouse.coords;
    let screens = Screen::all().unwrap_or_default();
    for screen in screens {
        if x >= screen.display_info.x
            && x < screen.display_info.x + screen.display_info.width as i32
            && y >= screen.display_info.y
            && y < screen.display_info.y + screen.display_info.height as i32
        {
            let rx = x - screen.display_info.x;
            let ry = y - screen.display_info.y;
            if let Ok(image) = screen.capture_area(rx, ry, 1, 1) {
                let rgba = image.get_pixel(0, 0);
                return Some(format!("#{:02X}{:02X}{:02X}", rgba[0], rgba[1], rgba[2]));
            }
        }
    }
    None
}

struct AppShortcuts {
    picker: Mutex<Option<String>>,
    bg_copy: Mutex<Option<String>>,
}

#[tauri::command(rename_all = "snake_case")]
fn update_shortcut(
    app: AppHandle,
    state: State<'_, AppShortcuts>,
    old_keys: String,
    new_keys: String,
    shortcut_type: String,
) -> Result<(), String> {
    if !old_keys.is_empty() {
        if let Ok(shortcut) = Shortcut::from_str(&old_keys) {
            let _ = app.global_shortcut().unregister(shortcut);
        }
    }

    if !new_keys.is_empty() {
        match Shortcut::from_str(&new_keys) {
            Ok(shortcut) => match app.global_shortcut().register(shortcut) {
                Ok(_) => {
                    let normalized_keys = shortcut.to_string();
                    if shortcut_type == "picker" {
                        *state.picker.lock().unwrap() = Some(normalized_keys);
                    } else if shortcut_type == "bg_copy" {
                        *state.bg_copy.lock().unwrap() = Some(normalized_keys);
                    }
                }
                Err(err) => return Err(format!("Failed to register shortcut: {err}")),
            },
            Err(e) => {
                return Err(format!("Invalid shortcut format: {e}"));
            }
        }
    } else {
        if shortcut_type == "picker" {
            *state.picker.lock().unwrap() = None;
        } else if shortcut_type == "bg_copy" {
            *state.bg_copy.lock().unwrap() = None;
        }
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppShortcuts {
            picker: Mutex::new(None),
            bg_copy: Mutex::new(None),
        })
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--minimized"]),
        ))
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        let app_handle = app.clone();
                        let shortcut_str = shortcut.to_string();

                        let state = app_handle.state::<AppShortcuts>();

                        let is_picker = {
                            let lock = state.picker.lock().unwrap();
                            lock.as_deref() == Some(shortcut_str.as_str())
                        };

                        let is_bg_copy = {
                            let lock = state.bg_copy.lock().unwrap();
                            lock.as_deref() == Some(shortcut_str.as_str())
                        };

                        if is_picker {
                            if let Some(window) = app_handle.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                            let _ = app_handle.emit("trigger-ui-picker", ());
                        } else if is_bg_copy {
                            if let Some(window) = app_handle.get_webview_window("main") {
                                let _ = window.show();
                            }
                            let _ = app_handle.emit("trigger-bg-picker", ());
                        }
                    }
                })
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            pick_color,
            update_shortcut,
            get_pixel_at_cursor,
            read_library_file,
            write_library_file,
            get_library_file_path
        ])
        .setup(|app| {
            let show_i = MenuItem::with_id(app, "show", "Show Iris", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .icon(app.default_window_icon().unwrap().clone())
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        QUITTING.store(true, Ordering::SeqCst);
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let tauri::tray::TrayIconEvent::Click {
                        button: tauri::tray::MouseButton::Left,
                        ..
                    } = event
                    {
                        if let Some(window) = tray.app_handle().get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            if std::env::args().any(|arg| arg == "--minimized") {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.hide();
                }
            }

            Ok(())
        })
        .plugin(tauri_plugin_clipboard_manager::init())
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                if !QUITTING.load(Ordering::SeqCst) {
                    let _ = window.hide();
                    api.prevent_close();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
