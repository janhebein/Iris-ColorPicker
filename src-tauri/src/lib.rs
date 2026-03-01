use device_query::{DeviceQuery, DeviceState};
use screenshots::Screen;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager, AppHandle, State, Emitter
};
use std::sync::Mutex;
use std::sync::atomic::{AtomicBool, Ordering};
use std::str::FromStr;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState, Shortcut};

static QUITTING: AtomicBool = AtomicBool::new(false);

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
    shortcut_type: String
) -> Result<(), String> {
    eprintln!("update_shortcut [{}]: old='{}' new='{}'", shortcut_type, old_keys, new_keys);
    
    if !old_keys.is_empty() {
        if let Ok(shortcut) = Shortcut::from_str(&old_keys) {
            let _ = app.global_shortcut().unregister(shortcut);
        }
    }
    
    if !new_keys.is_empty() {
        match Shortcut::from_str(&new_keys) {
            Ok(shortcut) => {
                match app.global_shortcut().register(shortcut) {
                    Ok(_) => {
                        let normalized_keys = shortcut.to_string();
                        eprintln!("Registered shortcut [{}]: {} (raw: {})", shortcut_type, normalized_keys, new_keys);
                        if shortcut_type == "picker" {
                            *state.picker.lock().unwrap() = Some(normalized_keys);
                        } else if shortcut_type == "bg_copy" {
                            *state.bg_copy.lock().unwrap() = Some(normalized_keys);
                        }
                    },
                    Err(e) => eprintln!("Failed to register shortcut '{}': {:?}", new_keys, e),
                }
            }
            Err(e) => {
                eprintln!("Failed to parse new shortcut '{}': {:?}", new_keys, e);
                return Err(format!("Invalid shortcut format: {}", new_keys));
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
        .plugin(tauri_plugin_autostart::init(tauri_plugin_autostart::MacosLauncher::LaunchAgent, Some(vec!["--minimized"])))
        .plugin(tauri_plugin_global_shortcut::Builder::new().with_handler(|app, shortcut, event| {
            if event.state() == ShortcutState::Pressed {
                let app_handle = app.clone();
                let shortcut_str = shortcut.to_string();
                eprintln!("Shortcut triggered: {}", shortcut_str);
                
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
                    eprintln!("Shortcut 1: Open window + start picker");
                    if let Some(window) = app_handle.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                    let _ = app_handle.emit("trigger-ui-picker", ());
                } else if is_bg_copy {
                    eprintln!("Shortcut 2: Pick, copy, and close");
                    if let Some(window) = app_handle.get_webview_window("main") {
                        let _ = window.show();
                    }
                    let _ = app_handle.emit("trigger-bg-picker", ());
                }
            }
        }).build())
        .invoke_handler(tauri::generate_handler![pick_color, update_shortcut])
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
                    if let tauri::tray::TrayIconEvent::Click { button: tauri::tray::MouseButton::Left, .. } = event {
                        if let Some(window) = tray.app_handle().get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .plugin(tauri_plugin_clipboard_manager::init())
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                if QUITTING.load(Ordering::SeqCst) {
                    // Allow the close — app is exiting
                } else {
                    // Hide to tray instead
                    let _ = window.hide();
                    api.prevent_close();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

