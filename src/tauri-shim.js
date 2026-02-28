// tauri-shim.js
// This shim provides the same electronAPI expected by renderer.js, but mapped to Tauri globals

if (window.__TAURI__) {
    console.log("Tauri API detected");
    const invoke = window.__TAURI__.core.invoke;
    const listen = window.__TAURI__.event.listen;

    // In Tauri 2.0, getCurrentWindow is often the method
    const tWindow = window.__TAURI__.window.getCurrentWindow ?
        window.__TAURI__.window.getCurrentWindow() :
        window.__TAURI__.window.getCurrent();

    window.electronAPI = {
        minimize: async () => {
            console.log("Minimize called");
            return tWindow.minimize();
        },
        close: async () => {
            console.log("Close/hide called");
            return tWindow.hide();
        },
        setAlwaysOnTop: async (flag) => tWindow.setAlwaysOnTop(flag),
        pickColor: async (forceRust = false) => {
            if (!forceRust && window.EyeDropper) {
                try {
                    const dropper = new EyeDropper();
                    const result = await dropper.open();
                    return result.sRGBHex;
                } catch (e) {
                    console.log('EyeDropper unavailable, falling back to Rust picker:', e.message);
                    // Fall through to Rust native picker
                }
            }
            return invoke('pick_color');
        },

        // Tauri 2.0 expects "CmdOrCtrl" not "CommandOrControl"
        _toTauriKeys: (keys) => keys.replace('CommandOrControl', 'CmdOrCtrl'),

        registerShortcut: (keys) => {
            const tauriKeys = window.electronAPI._toTauriKeys(keys);
            console.log('registerShortcut:', keys, '->', tauriKeys);
            return invoke('update_shortcut', {
                old_keys: window.electronAPI._toTauriKeys(localStorage.getItem('iris-shortcut-backend') || ''),
                new_keys: tauriKeys,
                shortcut_type: 'picker'
            }).then(() => localStorage.setItem('iris-shortcut-backend', keys))
                .catch(e => console.error('registerShortcut error:', e));
        },

        registerBgShortcut: (keys) => {
            const tauriKeys = window.electronAPI._toTauriKeys(keys);
            console.log('registerBgShortcut:', keys, '->', tauriKeys);
            return invoke('update_shortcut', {
                old_keys: window.electronAPI._toTauriKeys(localStorage.getItem('iris-bg-shortcut-backend') || ''),
                new_keys: tauriKeys,
                shortcut_type: 'bg_copy'
            }).then(() => localStorage.setItem('iris-bg-shortcut-backend', keys))
                .catch(e => console.error('registerBgShortcut error:', e));
        },

        onTriggerPicker: (callback) => {
            listen('trigger-ui-picker', () => {
                callback();
            });
        },
        onTriggerBgPicker: (callback) => {
            listen('trigger-bg-picker', () => {
                callback();
            });
        },
        onShortcutPicked: (callback) => {
            listen('shortcut-color-picked', (event) => {
                callback(event.payload);
            });
        },

        getStartupStatus: () => invoke('plugin:autostart|is_enabled'),
        toggleStartup: (enable) => enable
            ? invoke('plugin:autostart|enable')
            : invoke('plugin:autostart|disable'),

        openExternal: (url) => invoke('plugin:shell|open', { path: url })
    };
}
