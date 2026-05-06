if (window.__TAURI__) {
    const invoke = window.__TAURI__.core.invoke;
    const listen = window.__TAURI__.event.listen;

    const tWindow = window.__TAURI__.window.getCurrentWindow ?
        window.__TAURI__.window.getCurrentWindow() :
        window.__TAURI__.window.getCurrent();

    window.electronAPI = {
        minimize: async () => {
            return tWindow.minimize();
        },
        close: async () => {
            return tWindow.hide();
        },
        setAlwaysOnTop: async (flag) => tWindow.setAlwaysOnTop(flag),
        pickColor: async (forceRust = false) => {
            if (!forceRust && window.EyeDropper) {
                try {
                    const dropper = new EyeDropper();
                    const result = await dropper.open();
                    return result.sRGBHex;
                } catch (_) {}
            }
            return invoke('pick_color');
        },

        _toTauriKeys: (keys) => keys.replace('CommandOrControl', 'CmdOrCtrl'),

        registerShortcut: (keys) => {
            const tauriKeys = window.electronAPI._toTauriKeys(keys);
            return invoke('update_shortcut', {
                old_keys: window.electronAPI._toTauriKeys(localStorage.getItem('iris-shortcut-backend') || ''),
                new_keys: tauriKeys,
                shortcut_type: 'picker'
            }).then(() => localStorage.setItem('iris-shortcut-backend', keys))
                .catch(e => {
                    console.error('registerShortcut error:', e);
                    throw e;
                });
        },

        registerBgShortcut: (keys) => {
            const tauriKeys = window.electronAPI._toTauriKeys(keys);
            return invoke('update_shortcut', {
                old_keys: window.electronAPI._toTauriKeys(localStorage.getItem('iris-bg-shortcut-backend') || ''),
                new_keys: tauriKeys,
                shortcut_type: 'bg_copy'
            }).then(() => localStorage.setItem('iris-bg-shortcut-backend', keys))
                .catch(e => {
                    console.error('registerBgShortcut error:', e);
                    throw e;
                });
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

        _isDevMode: () => window.location.protocol === 'http:',

        getStartupStatus: () => {
            if (window.electronAPI._isDevMode()) return Promise.resolve(false);
            return invoke('plugin:autostart|is_enabled');
        },
        toggleStartup: (enable) => {
            if (window.electronAPI._isDevMode()) {
                return Promise.resolve();
            }
            return enable
                ? invoke('plugin:autostart|enable')
                : invoke('plugin:autostart|disable');
        },

        openExternal: (url) => invoke('plugin:shell|open', { path: url }),

        writeTextToClipboard: (text) => invoke('plugin:clipboard-manager|write_text', { text }),

        getPixelAtCursor: () => invoke('get_pixel_at_cursor'),

        readLibraryFile: () => invoke('read_library_file'),
        writeLibraryFile: (contents) => invoke('write_library_file', { contents }),
        getLibraryFilePath: () => invoke('get_library_file_path')
    };
}
