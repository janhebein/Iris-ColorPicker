// ── DOM Elements ─────────────────────────────────────
const colorPreview = document.getElementById('color-preview');
const colorPreviewInner = document.getElementById('color-preview-inner');
const colorNameOutput = document.getElementById('color-name');
const hexValue = document.getElementById('hex-value');
const rgbValue = document.getElementById('rgb-value');
const hslValue = document.getElementById('hsl-value');
const coolorsBtn = document.getElementById('coolors-btn');
const pickBtn = document.getElementById('pick-btn');
const gallery = document.getElementById('gallery');
const galleryEmpty = document.getElementById('gallery-empty');
const clearBtn = document.getElementById('clear-btn');
const btnMinimize = document.getElementById('btn-minimize');
const btnClose = document.getElementById('btn-close');
const pinBtn = document.getElementById('pin-btn');
const exportBtn = document.getElementById('export-btn');

// Harmonics Elements
const harmonicsBtn = document.getElementById('harmonics-btn');
const btnHarmonicsBack = document.getElementById('btn-harmonics-back');
const harmonicsSection = document.getElementById('harmonics-section');
const mainContainer = document.querySelector('.container');
const palComplementary = document.getElementById('palette-complementary').querySelector('.palette-colors');
const palAnalogous = document.getElementById('palette-analogous').querySelector('.palette-colors');
const palTriadic = document.getElementById('palette-triadic').querySelector('.palette-colors');
const harmonicsPreviewColor = document.getElementById('harmonics-preview-color');
const harmonicsHex = document.getElementById('harmonics-hex');
const harmonicsRgb = document.getElementById('harmonics-rgb');

// Settings DOM
const btnSettings = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const btnSettingsClose = document.getElementById('settings-close');
const themeButtons = document.querySelectorAll('.theme-btn');
const shortcutInput = document.getElementById('shortcut-input');
const bgShortcutInput = document.getElementById('bg-shortcut-input');
const startupToggle = document.getElementById('startup-toggle');

// Scale Elements
const scaleStripe = document.getElementById('scale-stripe');
const scaleFormatToggle = document.getElementById('scale-format-toggle');
const btnScaleBack = document.getElementById('btn-scale-back');
const scaleSection = document.getElementById('scale-section');
const scaleContent = document.getElementById('scale-content');

// Accessibility Elements
const accessibilityBtn = document.getElementById('accessibility-btn');
const btnAccessibilityBack = document.getElementById('btn-accessibility-back');
const accessibilitySection = document.getElementById('accessibility-section');
const accessibilityContent = document.getElementById('accessibility-content');
const simulatorGrid = document.getElementById('vision-simulator-grid');

// Accessibility Hero Elements
const accessColorCircle = document.getElementById('access-color-circle');
const accessColorName = document.getElementById('access-color-name');
const accessColorHex = document.getElementById('access-color-hex');

// Accessibility WCAG Elements
const accessWcagWhiteRatio = document.getElementById('wcag-ratio-white');
const accessWcagWhiteGrades = document.getElementById('wcag-grades-white');
const accessWcagBlackRatio = document.getElementById('wcag-ratio-black');
const accessWcagBlackGrades = document.getElementById('wcag-grades-black');

const wcagWhiteText = document.querySelector('#wcag-white .wcag-text');
const wcagWhiteRatio = document.getElementById('wcag-white-ratio');
const wcagBlackText = document.querySelector('#wcag-black .wcag-text');
const wcagBlackRatio = document.getElementById('wcag-black-ratio');

// ── State ────────────────────────────────────────────
let savedColors = JSON.parse(localStorage.getItem('iris-colors') || '[]');
let currentColor = null;
let currentScaleFormat = 'hex';

// Format Toggle Setup
if (scaleFormatToggle) {
    const formatBtns = scaleFormatToggle.querySelectorAll('.format-btn');
    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            formatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentScaleFormat = btn.dataset.format;
            if (scaleSection.style.display === 'flex') {
                generateScale();
            }
        });
    });
}

// ── Theming ──────────────────────────────────────────
let currentTheme = localStorage.getItem('iris-theme') || 'dark';

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }

    themeButtons.forEach(btn => {
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}
applyTheme(currentTheme);

themeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentTheme = e.target.dataset.theme;
        localStorage.setItem('iris-theme', currentTheme);
        applyTheme(currentTheme);
    });
});

// ── Settings Modal ───────────────────────────────────
btnSettings.addEventListener('click', () => {
    settingsModal.classList.add('show');
});

btnSettingsClose.addEventListener('click', () => {
    settingsModal.classList.remove('show');
});

settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.remove('show');
    }
});

// ── Title bar controls ───────────────────────────────
btnClose.addEventListener('click', () => {
    console.log("X button clicked");
    if (window.electronAPI) window.electronAPI.close();
    else window.close();
});
btnMinimize.addEventListener('click', () => {
    if (window.electronAPI) window.electronAPI.minimize();
});

let isPinned = true;
if (pinBtn) {
    const pinIcon = pinBtn.querySelector('svg');
    pinIcon.setAttribute('fill', 'currentColor');
    pinBtn.style.color = 'var(--text)';

    pinBtn.addEventListener('click', () => {
        isPinned = !isPinned;
        pinIcon.setAttribute('fill', isPinned ? 'currentColor' : 'none');
        pinBtn.style.color = isPinned ? 'var(--text)' : 'var(--text-dim)';
        if (window.electronAPI) window.electronAPI.setAlwaysOnTop(isPinned);
        showToast(isPinned ? 'Always on Top: ON' : 'Always on Top: OFF');
    });
}

// ── Navigation ───────────────────────────────────────
function showView(viewId) {
    const sections = ['harmonics-section', 'scale-section', 'accessibility-section'];

    // Hide all sub-sections and main sections
    Array.from(mainContainer.children).forEach(child => {
        child.style.display = 'none';
    });

    if (viewId === 'main') {
        // Show only main sections
        Array.from(mainContainer.children).forEach(child => {
            if (!sections.includes(child.id)) {
                child.style.display = '';
            }
        });
    } else {
        // Show specific sub-section
        const target = document.getElementById(viewId);
        if (target) {
            target.style.display = 'flex';
            if (viewId === 'harmonics-section') generateHarmonics();
            if (viewId === 'scale-section') generateScale();
            if (viewId === 'accessibility-section') generateAccessibility();
        }
    }
}

harmonicsBtn.addEventListener('click', () => showView('harmonics-section'));
accessibilityBtn.addEventListener('click', () => showView('accessibility-section'));
scaleStripe.addEventListener('click', () => showView('scale-section'));

btnHarmonicsBack.addEventListener('click', () => showView('main'));
btnScaleBack.addEventListener('click', () => showView('main'));
btnAccessibilityBack.addEventListener('click', () => showView('main'));

// ── Startup Toggle ───────────────────────────────────
if (window.electronAPI && window.electronAPI.getStartupStatus) {
    window.electronAPI.getStartupStatus().then(status => {
        startupToggle.checked = status;
    });

    // Disable toggle in dev mode
    if (window.electronAPI._isDevMode && window.electronAPI._isDevMode()) {
        startupToggle.disabled = true;
        startupToggle.closest('.setting-item').title = 'Autostart disabled in dev mode';
    }

    startupToggle.addEventListener('change', (e) => {
        window.electronAPI.toggleStartup(e.target.checked);
        showToast(e.target.checked ? "Enabled Auto-Start" : "Disabled Auto-Start");
    });
}

// ── Helpers ──────────────────────────────────────────
function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return { r, g, b };
}

function hexToHsl(hex) {
    let { r, g, b } = hexToRgb(hex);
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function saveColors() {
    localStorage.setItem('iris-colors', JSON.stringify(savedColors));
}

// ── Toast notification ───────────────────────────────
let toastEl = null;
let toastTimeout = null;

function showToast(msg) {
    if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.classList.add('toast');
        document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 1800);
}

// ── Color Blindness Assistant (Color Naming) ───────────────
const colorMapping = [
    { name: "Red", rgb: [255, 0, 0], cat: "Red" }, { name: "Crimson", rgb: [220, 20, 60], cat: "Red" },
    { name: "FireBrick", rgb: [178, 34, 34], cat: "Red" }, { name: "DarkRed", rgb: [139, 0, 0], cat: "Red" },
    { name: "Pink", rgb: [255, 192, 203], cat: "Pink" }, { name: "HotPink", rgb: [255, 105, 180], cat: "Pink" },
    { name: "DeepPink", rgb: [255, 20, 147], cat: "Pink" }, { name: "Coral", rgb: [255, 127, 80], cat: "Orange" },
    { name: "Tomato", rgb: [255, 99, 71], cat: "Red" }, { name: "OrangeRed", rgb: [255, 69, 0], cat: "Orange" },
    { name: "DarkOrange", rgb: [255, 140, 0], cat: "Orange" }, { name: "Orange", rgb: [255, 165, 0], cat: "Orange" },
    { name: "Gold", rgb: [255, 215, 0], cat: "Yellow" }, { name: "Yellow", rgb: [255, 255, 0], cat: "Yellow" },
    { name: "Khaki", rgb: [240, 230, 140], cat: "Yellow" }, { name: "Plum", rgb: [221, 160, 221], cat: "Purple" },
    { name: "Magenta", rgb: [255, 0, 255], cat: "Purple" }, { name: "Purple", rgb: [128, 0, 128], cat: "Purple" },
    { name: "Indigo", rgb: [75, 0, 130], cat: "Purple" }, { name: "SlateBlue", rgb: [106, 90, 205], cat: "Purple" },
    { name: "GreenYellow", rgb: [173, 255, 47], cat: "Green" }, { name: "Lime", rgb: [0, 255, 0], cat: "Green" },
    { name: "LimeGreen", rgb: [50, 205, 50], cat: "Green" }, { name: "PaleGreen", rgb: [152, 251, 152], cat: "Green" },
    { name: "SpringGreen", rgb: [0, 255, 127], cat: "Green" }, { name: "SeaGreen", rgb: [46, 139, 87], cat: "Green" },
    { name: "ForestGreen", rgb: [34, 139, 34], cat: "Green" }, { name: "Green", rgb: [0, 128, 0], cat: "Green" },
    { name: "DarkGreen", rgb: [0, 100, 0], cat: "Green" }, { name: "OliveDrab", rgb: [107, 142, 35], cat: "Green" },
    { name: "Olive", rgb: [128, 128, 0], cat: "Green" }, { name: "Teal", rgb: [0, 128, 128], cat: "Cyan" },
    { name: "Cyan", rgb: [0, 255, 255], cat: "Cyan" }, { name: "Turquoise", rgb: [64, 224, 208], cat: "Cyan" },
    { name: "SteelBlue", rgb: [70, 130, 180], cat: "Blue" }, { name: "SkyBlue", rgb: [135, 206, 235], cat: "Blue" },
    { name: "DeepSkyBlue", rgb: [0, 191, 255], cat: "Blue" }, { name: "DodgerBlue", rgb: [30, 144, 255], cat: "Blue" },
    { name: "RoyalBlue", rgb: [65, 105, 225], cat: "Blue" }, { name: "Blue", rgb: [0, 0, 255], cat: "Blue" },
    { name: "Navy", rgb: [0, 0, 128], cat: "Blue" }, { name: "MidnightBlue", rgb: [25, 25, 112], cat: "Blue" },
    { name: "Cornsilk", rgb: [255, 248, 220], cat: "Yellow" }, { name: "Bisque", rgb: [255, 228, 196], cat: "Brown" },
    { name: "NavajoWhite", rgb: [255, 222, 173], cat: "Brown" }, { name: "Wheat", rgb: [245, 222, 179], cat: "Brown" },
    { name: "BurlyWood", rgb: [222, 184, 135], cat: "Brown" }, { name: "Tan", rgb: [210, 180, 140], cat: "Brown" },
    { name: "RosyBrown", rgb: [188, 143, 143], cat: "Brown" }, { name: "SandyBrown", rgb: [244, 164, 96], cat: "Brown" },
    { name: "Goldenrod", rgb: [218, 165, 32], cat: "Yellow" }, { name: "Peru", rgb: [205, 133, 63], cat: "Brown" },
    { name: "Chocolate", rgb: [210, 105, 30], cat: "Brown" }, { name: "SaddleBrown", rgb: [139, 69, 19], cat: "Brown" },
    { name: "Sienna", rgb: [160, 82, 45], cat: "Brown" }, { name: "Brown", rgb: [165, 42, 42], cat: "Brown" },
    { name: "Maroon", rgb: [128, 0, 0], cat: "Red" }, { name: "White", rgb: [255, 255, 255], cat: "White" },
    { name: "Snow", rgb: [255, 250, 250], cat: "White" }, { name: "Honeydew", rgb: [240, 255, 240], cat: "White" },
    { name: "MintCream", rgb: [245, 255, 250], cat: "White" }, { name: "Azure", rgb: [240, 255, 255], cat: "White" },
    { name: "AliceBlue", rgb: [240, 248, 255], cat: "Blue" }, { name: "GhostWhite", rgb: [248, 248, 255], cat: "White" },
    { name: "WhiteSmoke", rgb: [245, 245, 245], cat: "White" }, { name: "Seashell", rgb: [255, 245, 238], cat: "White" },
    { name: "Beige", rgb: [245, 245, 220], cat: "Brown" }, { name: "OldLace", rgb: [253, 245, 230], cat: "White" },
    { name: "FloralWhite", rgb: [255, 250, 240], cat: "White" }, { name: "Ivory", rgb: [255, 255, 240], cat: "White" },
    { name: "AntiqueWhite", rgb: [250, 235, 215], cat: "White" }, { name: "Linen", rgb: [250, 240, 230], cat: "Brown" },
    { name: "LavenderBlush", rgb: [255, 240, 245], cat: "Pink" }, { name: "MistyRose", rgb: [255, 228, 225], cat: "Pink" },
    { name: "Gainsboro", rgb: [220, 220, 220], cat: "Gray" }, { name: "LightGray", rgb: [211, 211, 211], cat: "Gray" },
    { name: "Silver", rgb: [192, 192, 192], cat: "Gray" }, { name: "DarkGray", rgb: [169, 169, 169], cat: "Gray" },
    { name: "Gray", rgb: [128, 128, 128], cat: "Gray" }, { name: "DimGray", rgb: [105, 105, 105], cat: "Gray" },
    { name: "LightSlateGray", rgb: [119, 136, 153], cat: "Gray" }, { name: "SlateGray", rgb: [112, 128, 144], cat: "Gray" },
    { name: "DarkSlateGray", rgb: [47, 79, 79], cat: "Gray" }, { name: "Black", rgb: [0, 0, 0], cat: "Black" }
];

function getNearestColorName(r, g, b, justName = false) {
    let minDistance = Infinity;
    let closestName = "Unknown";
    let closestCat = "Unknown";

    for (const color of colorMapping) {
        // Human-perceptually weighted RGB distance
        const rmean = (r + color.rgb[0]) / 2;
        const rDif = r - color.rgb[0];
        const gDif = g - color.rgb[1];
        const bDif = b - color.rgb[2];
        const weightR = 2 + rmean / 256;
        const weightG = 4.0;
        const weightB = 2 + (255 - rmean) / 256;

        const distance = Math.sqrt(weightR * rDif * rDif + weightG * gDif * gDif + weightB * bDif * bDif);

        if (distance < minDistance) {
            minDistance = distance;
            closestName = color.name;
            closestCat = color.cat;
        }
    }

    // Format e.g. "Dark Slate Gray"
    const formattedName = closestName.replace(/([A-Z])/g, ' $1').trim();

    if (justName) return formattedName;
    return `${formattedName} (${closestCat})`;
}

// ── WCAG Math ─────────────────────────────────────────
function getLuminance(r, g, b) {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(r, g, b, bgR, bgG, bgB) {
    const l1 = getLuminance(r, g, b);
    const l2 = getLuminance(bgR, bgG, bgB);
    const lightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (lightest + 0.05) / (darkest + 0.05);
}

// ── Set current color ────────────────────────────────
function setCurrentColor(hex, skipVariationsUpdate = false) {
    currentColor = hex.toUpperCase();

    const { r, g, b } = hexToRgb(currentColor);
    const { h, s, l } = hexToHsl(currentColor);

    // Update UI Scale Stripe Preview
    if (scaleStripe) {
        scaleStripe.innerHTML = '';
        const lightnessSteps = [95, 85, 75, 65, 50, 40, 30, 20, 10, 5];
        lightnessSteps.forEach(lv => {
            const stripeStep = document.createElement('div');
            stripeStep.className = 'scale-stripe-step';
            stripeStep.style.background = hslToHex(h, s, lv);
            scaleStripe.appendChild(stripeStep);
        });
    }

    // Update Color Name Assistant
    if (colorNameOutput) {
        colorNameOutput.textContent = getNearestColorName(r, g, b);
    }

    colorPreview.classList.add('has-color');
    colorPreviewInner.style.background = currentColor;
    colorPreview.style.borderColor = currentColor + '44';

    if (coolorsBtn) {
        coolorsBtn.style.display = 'flex';
    }

    hexValue.innerHTML = `<span class="clickable-value" data-tooltip="Copy HEX">${currentColor}</span>`;
    rgbValue.innerHTML = `rgb(<span class="clickable-value" data-tooltip="Copy R">${r}</span>, <span class="clickable-value" data-tooltip="Copy G">${g}</span>, <span class="clickable-value" data-tooltip="Copy B">${b}</span>)`;
    hslValue.innerHTML = `hsl(<span class="clickable-value" data-tooltip="Copy H">${h}</span>, <span class="clickable-value" data-tooltip="Copy S">${s}%</span>, <span class="clickable-value" data-tooltip="Copy L">${l}%</span>)`;

    // Update WCAG
    if (wcagWhiteText) wcagWhiteText.style.color = currentColor;
    if (wcagBlackText) wcagBlackText.style.color = currentColor;

    const cw = getContrastRatio(r, g, b, 255, 255, 255).toFixed(2);
    const cb = getContrastRatio(r, g, b, 0, 0, 0).toFixed(2);

    if (wcagWhiteRatio) {
        wcagWhiteRatio.textContent = `${cw}:1`;
        wcagWhiteRatio.className = `wcag-ratio ${cw >= 4.5 ? 'pass' : 'fail'}`;
    }

    if (wcagBlackRatio) {
        wcagBlackRatio.textContent = `${cb}:1`;
        wcagBlackRatio.className = `wcag-ratio ${cb >= 4.5 ? 'pass' : 'fail'}`;
    }

    // Update Variations (Tints + Shades)
    if (!skipVariationsUpdate) {
        // If Harmonics page is visible, refresh it
        if (harmonicsSection.style.display === 'flex') {
            generateHarmonics();
        }
        // If UI Scale page is visible, refresh it
        if (scaleSection && scaleSection.style.display === 'flex') {
            generateScale();
        }

        // If Accessibility page is visible, refresh it
        if (accessibilitySection && accessibilitySection.style.display === 'flex') {
            generateAccessibility();
        }
    }
}

// ── Clickable Values ─────────────────────────────────
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('clickable-value')) {
        const textToCopy = e.target.textContent.replace('%', '');

        const copyPromise = (window.electronAPI && window.electronAPI.writeTextToClipboard)
            ? window.electronAPI.writeTextToClipboard(textToCopy)
            : navigator.clipboard.writeText(textToCopy);

        copyPromise.then(() => {
            showToast(`Copied ${textToCopy}`);
            const origColor = e.target.style.color;
            e.target.style.color = 'var(--accent)';
            setTimeout(() => { e.target.style.color = origColor; }, 1200);
        }).catch(err => {
            console.error("Failed to copy:", err);
            showToast("Failed to copy");
        });
    }
});

// ── Shortcut Recording ───────────────────────────────
let currentShortcut = localStorage.getItem('iris-shortcut') || '';
shortcutInput.value = formatShortcutForDisplay(currentShortcut);
function formatShortcutForDisplay(shortcut) {
    if (!shortcut) return '';
    return shortcut.replace('CommandOrControl', 'Ctrl');
}

if (currentShortcut && window.electronAPI) {
    window.electronAPI.registerShortcut(currentShortcut);
}

let currentBgShortcut = localStorage.getItem('iris-bg-shortcut') || '';
if (bgShortcutInput) {
    bgShortcutInput.value = formatShortcutForDisplay(currentBgShortcut);
    if (currentBgShortcut && window.electronAPI) {
        window.electronAPI.registerBgShortcut(currentBgShortcut);
    }
}

function handleShortcutInput(inputEl, storageKey, apiMethod) {
    const savedValue = localStorage.getItem(storageKey) || '';
    inputEl.value = formatShortcutForDisplay(savedValue);

    inputEl.addEventListener('keydown', (e) => {
        e.preventDefault();
        if (e.key === 'Escape') {
            inputEl.blur();
            return;
        }

        if (['Alt', 'Control', 'Shift', 'Meta'].includes(e.key)) return;

        let keys = [];
        if (e.ctrlKey || e.metaKey) keys.push('CommandOrControl');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');

        let key = e.key.toUpperCase();
        if (key === ' ') key = 'Space';
        keys.push(key);

        const shortcutStr = keys.join('+');
        inputEl.value = formatShortcutForDisplay(shortcutStr);
        localStorage.setItem(storageKey, shortcutStr);

        if (window.electronAPI && window.electronAPI[apiMethod]) {
            window.electronAPI[apiMethod](shortcutStr);
            showToast(`Shortcut set to ${formatShortcutForDisplay(shortcutStr)}`);
        }
        inputEl.blur();
    });

    inputEl.addEventListener('keyup', (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            inputEl.value = '';
            localStorage.setItem(storageKey, '');
            if (window.electronAPI && window.electronAPI[apiMethod]) {
                window.electronAPI[apiMethod]('');
            }
        }
    });
}

if (shortcutInput) {
    handleShortcutInput(shortcutInput, 'iris-shortcut', 'registerShortcut');
}

if (bgShortcutInput) {
    handleShortcutInput(bgShortcutInput, 'iris-bg-shortcut', 'registerBgShortcut');
}

// Global shortcut activated callbacks
if (window.electronAPI) {
    // Shortcut 1: Open window + start picker immediately
    if (window.electronAPI.onTriggerPicker) {
        window.electronAPI.onTriggerPicker(async () => {
            // Window is already shown by Rust. Now trigger the picker.
            try {
                const hex = await window.electronAPI.pickColor();
                if (hex) {
                    setCurrentColor(hex);

                    if (window.electronAPI && window.electronAPI.writeTextToClipboard) {
                        await window.electronAPI.writeTextToClipboard(hex);
                    } else {
                        await navigator.clipboard.writeText(hex);
                    }

                    if (!savedColors.includes(hex)) {
                        savedColors.unshift(hex);
                        saveColors();
                        renderGallery();
                        showToast(`Picked & Copied ${hex}`);
                    } else {
                        showToast(`Copied ${hex}`);
                    }
                }
            } catch (err) {
                console.log('Picker shortcut error:', err);
            }
        });
    }

    // Shortcut 2: Show picker without window, copy color, then hide window
    if (window.electronAPI.onTriggerBgPicker) {
        window.electronAPI.onTriggerBgPicker(async () => {
            try {
                const hex = await window.electronAPI.pickColor();
                if (hex) {
                    setCurrentColor(hex);

                    if (window.electronAPI && window.electronAPI.writeTextToClipboard) {
                        await window.electronAPI.writeTextToClipboard(hex);
                    } else {
                        await navigator.clipboard.writeText(hex);
                    }

                    if (!savedColors.includes(hex)) {
                        savedColors.unshift(hex);
                        saveColors();
                        renderGallery();
                    }
                    showToast(`Copied ${hex}`);
                }
            } catch (err) {
                console.log('BG picker shortcut error:', err);
            }
            // Hide window after picking (shortcut 2 = no window)
            if (window.electronAPI.close) {
                window.electronAPI.close();
            }
        });
    }
}

// ── EyeDropper ───────────────────────────────────────
pickBtn.addEventListener('click', async () => {
    try {
        const hex = await window.electronAPI.pickColor();

        if (!hex) return; // user cancelled

        setCurrentColor(hex);

        // Auto-Copy to clipboard
        const copyPromise = (window.electronAPI && window.electronAPI.writeTextToClipboard)
            ? window.electronAPI.writeTextToClipboard(hex)
            : navigator.clipboard.writeText(hex);

        copyPromise.then(() => {
            // Auto-add to gallery if not duplicate
            if (!savedColors.includes(hex)) {
                savedColors.unshift(hex);
                saveColors();
                renderGallery();
                showToast(`Picked & Copied ${hex}`);
            } else {
                showToast(`Copied ${hex}`);
            }
        }).catch(err => {
            console.error("Failed to copy:", err);
            showToast("Failed to copy");
        });
    } catch (err) {
        // user may cancel EyeDropper, which throws an abort error. Ignore.
        console.log('Picker cancelled or error:', err);
    }
});

// ── Copy buttons ─────────────────────────────────────
if (coolorsBtn) {
    coolorsBtn.addEventListener('click', () => {
        if (!currentColor || !window.electronAPI) return;
        const hex = currentColor.replace('#', '');
        window.electronAPI.openExternal(`https://coolors.co/${hex}`);
    });
}

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        let text = '';
        if (target === 'hex') text = hexValue.textContent;
        if (target === 'rgb') text = rgbValue.textContent;
        if (target === 'hsl') text = hslValue.textContent;

        if (!text || text.includes('—')) return;

        const copyPromise = (window.electronAPI && window.electronAPI.writeTextToClipboard)
            ? window.electronAPI.writeTextToClipboard(text)
            : navigator.clipboard.writeText(text);

        copyPromise.then(() => {
            btn.classList.add('copied');
            showToast(`Copied ${text}`);
            setTimeout(() => btn.classList.remove('copied'), 1200);
        }).catch(err => {
            console.error("Failed to copy:", err);
            showToast("Failed to copy");
        });
    });
});

// ── Gallery rendering ────────────────────────────────
function renderGallery() {
    // Remove all swatches (keep the empty message)
    gallery.querySelectorAll('.swatch, .swatch-palette').forEach(el => el.remove());

    if (savedColors.length === 0) {
        galleryEmpty.style.display = '';
        galleryEmpty.innerHTML = '<p>History is empty.<br />Pick a color to get started!</p>';
        return;
    }

    galleryEmpty.style.display = 'none';

    // Filter out any previously saved 'palette' objects
    savedColors = savedColors.filter(item => typeof item === 'string');
    saveColors();

    if (savedColors.length === 0) {
        galleryEmpty.style.display = '';
        galleryEmpty.innerHTML = '<p>History is empty.<br />Pick a color to get started!</p>';
        return;
    }

    savedColors.forEach((hex, index) => {
        const swatch = document.createElement('div');
        swatch.classList.add('swatch');

        const colorDiv = document.createElement('div');
        colorDiv.classList.add('swatch-color');
        colorDiv.style.background = hex;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('swatch-delete');
        deleteBtn.textContent = '✕';
        deleteBtn.title = 'Remove color';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            savedColors.splice(index, 1);
            saveColors();
            renderGallery();
            showToast(`Removed color`);
        });
        colorDiv.appendChild(deleteBtn);

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('swatch-info');

        const label = document.createElement('span');
        label.classList.add('swatch-label');
        label.textContent = hex;

        const name = document.createElement('span');
        name.classList.add('swatch-name');
        const { r, g, b } = hexToRgb(hex);
        name.textContent = getNearestColorName(r, g, b, true);

        infoDiv.appendChild(label);
        infoDiv.appendChild(name);

        swatch.appendChild(colorDiv);
        swatch.appendChild(infoDiv);

        // Click swatch to set as current
        swatch.addEventListener('click', () => {
            setCurrentColor(hex);
            showToast(`Selected ${hex}`);
        });

        gallery.appendChild(swatch);
    });
}

// ── Clear all ────────────────────────────────────────
clearBtn.addEventListener('click', () => {
    if (savedColors.length === 0) return;
    savedColors = [];
    saveColors();
    renderGallery();
    showToast('All colors cleared');
});

// ── Export ───────────────────────────────────────────
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        if (savedColors.length === 0) {
            showToast("Nothing to export");
            return;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedColors, null, 2));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = "iris-history.json";
        a.click();
        showToast("Exported history");
    });
}

// ── Harmonic Palette Logic ─────────────────────────────
function updateHarmonicsPreview(hex) {
    const { r, g, b } = hexToRgb(hex);
    if (harmonicsPreviewColor) harmonicsPreviewColor.style.background = hex;
    if (harmonicsHex) harmonicsHex.textContent = hex;
    if (harmonicsRgb) harmonicsRgb.textContent = `rgb( ${r} , ${g} , ${b} )`;
}

function createHarmonicSwatch(hex) {
    const swatch = document.createElement('div');
    swatch.classList.add('harmonic-swatch');
    swatch.style.background = hex;
    swatch.title = hex;
    swatch.addEventListener('click', () => {
        updateHarmonicsPreview(hex);
        // Do not update global color!
    });
    return swatch;
}

function generateHarmonics() {
    palComplementary.innerHTML = '';
    palAnalogous.innerHTML = '';
    palTriadic.innerHTML = '';

    if (!currentColor) return;

    updateHarmonicsPreview(currentColor);

    const { h, s, l } = hexToHsl(currentColor);

    // Main color always shown first
    palComplementary.appendChild(createHarmonicSwatch(currentColor));
    palAnalogous.appendChild(createHarmonicSwatch(currentColor));
    palTriadic.appendChild(createHarmonicSwatch(currentColor));

    // Complementary (180deg)
    palComplementary.appendChild(createHarmonicSwatch(hslToHex((h + 180) % 360, s, l)));

    // Analogous (+30, -30deg)
    palAnalogous.appendChild(createHarmonicSwatch(hslToHex((h + 30) % 360, s, l)));
    palAnalogous.appendChild(createHarmonicSwatch(hslToHex((h + 330) % 360, s, l))); // -30 is same as +330

    // Triadic (120, 240deg)
    palTriadic.appendChild(createHarmonicSwatch(hslToHex((h + 120) % 360, s, l)));
    palTriadic.appendChild(createHarmonicSwatch(hslToHex((h + 240) % 360, s, l)));
}

// ── UI Scale Logic ────────────────────────────────────
function generateScale() {
    scaleContent.innerHTML = '';
    if (!currentColor) return;

    const { h, s } = hexToHsl(currentColor);
    // 10 steps from lightness 95% down to 5%
    const lightnessSteps = [95, 85, 75, 65, 50, 40, 30, 20, 10, 5];
    const labels = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    lightnessSteps.forEach((l, i) => {
        const hex = hslToHex(h, s, l);
        const { r, g, b } = hexToRgb(hex);
        // Determine text color based on contrast
        const luma = getLuminance(r, g, b);
        const textColor = luma > 0.3 ? '#000000' : '#ffffff';

        const stepDiv = document.createElement('div');
        stepDiv.className = 'scale-step';
        stepDiv.style.background = hex;
        stepDiv.style.color = textColor;

        const labelSpan = document.createElement('span');
        labelSpan.className = 'scale-label';
        labelSpan.textContent = labels[i];

        let formatValue = hex;
        if (currentScaleFormat === 'rgb') {
            formatValue = `rgb( ${r} , ${g} , ${b} )`;
        } else if (currentScaleFormat === 'hsl') {
            formatValue = `hsl( ${Math.round(h)} , ${Math.round(s)}% , ${Math.round(l)}% )`;
        }

        const hexSpan = document.createElement('span');
        hexSpan.className = 'scale-hex clickable-value';
        hexSpan.setAttribute('data-tooltip', 'Copy Value');
        hexSpan.textContent = formatValue;

        stepDiv.appendChild(labelSpan);
        stepDiv.appendChild(hexSpan);

        stepDiv.addEventListener('click', () => {
            setCurrentColor(hex, false);
            btnScaleBack.click();
        });

        scaleContent.appendChild(stepDiv);
    });
}

// ── Save Palette Logic ──────────────────────────────
if (savePaletteBtn) {
    savePaletteBtn.addEventListener('click', () => {
        if (!currentColor) return;
        const { h, s } = hexToHsl(currentColor);
        const lightnessSteps = [95, 85, 75, 65, 50, 40, 30, 20, 10, 5];
        const colors = lightnessSteps.map(lv => hslToHex(h, s, lv));

        const paletteObj = {
            type: 'palette',
            base: currentColor,
            colors: colors
        };

        // Check if a palette with the same base color already exists
        const exists = savedColors.some(item => typeof item === 'object' && item.type === 'palette' && item.base === currentColor);

        if (!exists) {
            savedColors.unshift(paletteObj);
            saveColors();
            renderGallery(); // Re-render gallery to show the new palette (if gallery supported palettes)
            showToast('Palette Saved!');
        } else {
            showToast('Palette already saved');
        }
    });
}

// ── Color Blindness Simulator Logic ────────────────────

function simulateColorBlindness(r, g, b, type) {
    let matrix;
    if (type === 'protanopia') {
        matrix = [
            0.56667, 0.43333, 0.00000,
            0.55833, 0.44167, 0.00000,
            0.00000, 0.24167, 0.75833
        ];
    } else if (type === 'deuteranopia') {
        matrix = [
            0.625, 0.375, 0.000,
            0.700, 0.300, 0.000,
            0.000, 0.300, 0.700
        ];
    } else if (type === 'tritanopia') {
        matrix = [
            0.95, 0.05, 0.00,
            0.00, 0.43333, 0.56667,
            0.00, 0.475, 0.525
        ];
    }

    // Linearize RGB approx (gamma 2.2 decoding)
    let lr = Math.pow(r / 255, 2.2);
    let lg = Math.pow(g / 255, 2.2);
    let lb = Math.pow(b / 255, 2.2);

    // Apply matrix
    let sr = (lr * matrix[0] + lg * matrix[1] + lb * matrix[2]);
    let sg = (lr * matrix[3] + lg * matrix[4] + lb * matrix[5]);
    let sb = (lr * matrix[6] + lg * matrix[7] + lb * matrix[8]);

    // Gamma encode
    sr = Math.max(0, Math.min(1, Math.pow(sr, 1 / 2.2))) * 255;
    sg = Math.max(0, Math.min(1, Math.pow(sg, 1 / 2.2))) * 255;
    sb = Math.max(0, Math.min(1, Math.pow(sb, 1 / 2.2))) * 255;

    return [Math.round(sr), Math.round(sg), Math.round(sb)];
}

function rgbArrToHex([r, g, b]) {
    const toHex = (c) => {
        const h = c.toString(16);
        return h.length === 1 ? '0' + h : h;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function createSimRow(label, hexOriginal, hexSimulated) {
    const row = document.createElement('div');
    row.className = 'sim-row';

    const labelDiv = document.createElement('div');
    labelDiv.className = 'sim-label';
    labelDiv.textContent = label;

    const colorsDiv = document.createElement('div');
    colorsDiv.className = 'sim-colors';

    const origSwatch = document.createElement('div');
    origSwatch.className = 'sim-swatch';
    origSwatch.style.background = hexOriginal;
    origSwatch.setAttribute('data-label', 'Original');

    const simSwatch = document.createElement('div');
    simSwatch.className = 'sim-swatch';
    simSwatch.style.background = hexSimulated;
    simSwatch.setAttribute('data-label', 'Simulated');

    colorsDiv.appendChild(origSwatch);
    colorsDiv.appendChild(simSwatch);

    row.appendChild(labelDiv);
    row.appendChild(colorsDiv);

    return row;
}

function getWcagGrades(ratio) {
    const normalAAA = ratio >= 7 ? 'AAA' : (ratio >= 4.5 ? 'AA' : 'Fail');
    const largeAAA = ratio >= 4.5 ? 'AAA' : (ratio >= 3 ? 'AA' : 'Fail');
    return `Normal: ${normalAAA} | Large: ${largeAAA}`;
}

function generateAccessibility() {
    simulatorGrid.innerHTML = '';
    if (!currentColor) return;

    const { r, g, b } = hexToRgb(currentColor);

    // Update Hero Block
    accessColorCircle.style.background = currentColor;
    accessColorName.textContent = getNearestColorName(r, g, b, true);
    accessColorHex.textContent = currentColor;

    // Update WCAG Contrast Breakdown
    document.querySelector('#access-wcag-white .wcag-card-bg').style.color = currentColor;
    document.querySelector('#access-wcag-black .wcag-card-bg').style.color = currentColor;

    const cw = getContrastRatio(r, g, b, 255, 255, 255);
    const cb = getContrastRatio(r, g, b, 0, 0, 0);

    accessWcagWhiteRatio.textContent = `${cw.toFixed(2)}:1`;
    accessWcagWhiteRatio.className = `wcag-ratio ${cw >= 4.5 ? 'pass' : 'fail'}`;
    accessWcagWhiteGrades.textContent = getWcagGrades(cw);

    accessWcagBlackRatio.textContent = `${cb.toFixed(2)}:1`;
    accessWcagBlackRatio.className = `wcag-ratio ${cb >= 4.5 ? 'pass' : 'fail'}`;
    accessWcagBlackGrades.textContent = getWcagGrades(cb);

    // Update Vision Simulator
    const pro = rgbArrToHex(simulateColorBlindness(r, g, b, 'protanopia'));
    const deu = rgbArrToHex(simulateColorBlindness(r, g, b, 'deuteranopia'));
    const tri = rgbArrToHex(simulateColorBlindness(r, g, b, 'tritanopia'));

    simulatorGrid.appendChild(createSimRow('Protanopia\n(Red-Blind)', currentColor, pro));
    simulatorGrid.appendChild(createSimRow('Deuteranopia\n(Green-Blind)', currentColor, deu));
    simulatorGrid.appendChild(createSimRow('Tritanopia\n(Blue-Blind)', currentColor, tri));
}

// accessibilityBtn listeners moved to Navigation section

// ── Init ─────────────────────────────────────────────
renderGallery();

// Restore last picked color if exists
if (savedColors.length > 0) {
    setCurrentColor(savedColors[0]);
}
