if (window.__TAURI__) {
    const invoke = window.__TAURI__.core.invoke;
    const listen = window.__TAURI__.event.listen;
    const globalShortcut = window.__TAURI__.globalShortcut;
    const autostart = window.__TAURI__.autostart;

    const tWindow = window.__TAURI__.window.getCurrentWindow ?
        window.__TAURI__.window.getCurrentWindow() :
        window.__TAURI__.window.getCurrent();

    const pickerShortcutHandlers = [];
    const bgShortcutHandlers = [];

    const isPressedShortcut = (event) => event && event.state === 'Pressed';
    const isDevMode = () => {
        const host = window.location.hostname;
        return (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]') && window.location.port !== '';
    };

    async function refreshShortcut(storageKey, keys, handler) {
        const previous = localStorage.getItem(storageKey) || '';

        if (previous) {
            await globalShortcut.unregister(previous).catch(() => {});
        }

        if (!keys) {
            localStorage.setItem(storageKey, '');
            return;
        }

        await globalShortcut.register(keys, handler);
        localStorage.setItem(storageKey, keys);
    }

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

        _toTauriKeys: (keys) => keys,

        registerShortcut: (keys) => {
            return refreshShortcut('iris-shortcut-backend', keys, async (event) => {
                if (!isPressedShortcut(event)) return;
                await tWindow.show();
                await tWindow.setFocus();
                pickerShortcutHandlers.forEach(callback => {
                    callback();
                });
            });
        },

        registerBgShortcut: (keys) => {
            return refreshShortcut('iris-bg-shortcut-backend', keys, async (event) => {
                if (!isPressedShortcut(event)) return;
                await tWindow.show();
                bgShortcutHandlers.forEach(callback => {
                    callback();
                });
            });
        },

        onTriggerPicker: (callback) => {
            pickerShortcutHandlers.push(callback);
            listen('trigger-ui-picker', () => {
                callback();
            });
        },
        onTriggerBgPicker: (callback) => {
            bgShortcutHandlers.push(callback);
            listen('trigger-bg-picker', () => {
                callback();
            });
        },
        onShortcutPicked: (callback) => {
            listen('shortcut-color-picked', (event) => {
                callback(event.payload);
            });
        },

        _isDevMode: isDevMode,

        getStartupStatus: () => {
            if (window.electronAPI._isDevMode()) return Promise.resolve(false);
            if (autostart && autostart.isEnabled) return autostart.isEnabled();
            return invoke('plugin:autostart|is_enabled');
        },
        toggleStartup: (enable) => {
            if (window.electronAPI._isDevMode()) {
                return Promise.resolve();
            }
            if (autostart && autostart.enable && autostart.disable) {
                return enable ? autostart.enable() : autostart.disable();
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
