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
const saveLibraryBtn = document.getElementById('save-library-btn');
const libraryBtn = document.getElementById('library-btn');
const btnLibraryBack = document.getElementById('btn-library-back');
const libraryFolderBtn = document.getElementById('library-folder-btn');
const libraryImportBtn = document.getElementById('library-import-btn');
const libraryFullExportBtn = document.getElementById('library-full-export-btn');
const libraryList = document.getElementById('library-list');
const libraryEmpty = document.getElementById('library-empty');
const librarySection = document.getElementById('library-section');
const saveColorModal = document.getElementById('save-color-modal');
const saveColorClose = document.getElementById('save-color-close');
const saveColorDot = document.getElementById('save-color-dot');
const saveColorHex = document.getElementById('save-color-hex');
const saveColorAutoName = document.getElementById('save-color-auto-name');
const saveColorNameInput = document.getElementById('save-color-name-input');
const saveColorFolderSelect = document.getElementById('save-color-folder-select');
const saveColorFolderPicker = document.getElementById('save-color-folder-picker');
const saveColorFolderTrigger = document.getElementById('save-color-folder-trigger');
const saveColorFolderLabel = document.getElementById('save-color-folder-label');
const saveColorFolderMenu = document.getElementById('save-color-folder-menu');
const saveColorConfirm = document.getElementById('save-color-confirm');
const saveColorNewFolder = document.getElementById('save-color-new-folder');
const folderModal = document.getElementById('folder-modal');
const folderModalTitle = document.getElementById('folder-modal-title');
const folderClose = document.getElementById('folder-close');
const folderNameInput = document.getElementById('folder-name-input');
const folderConfirm = document.getElementById('folder-confirm');
const confirmModal = document.getElementById('confirm-modal');
const confirmTitle = document.getElementById('confirm-title');
const confirmMessage = document.getElementById('confirm-message');
const confirmClose = document.getElementById('confirm-close');
const confirmCancel = document.getElementById('confirm-cancel');
const confirmAction = document.getElementById('confirm-action');
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
const btnSettings = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const btnSettingsClose = document.getElementById('settings-close');
const themeButtons = document.querySelectorAll('.theme-btn');
const shortcutInput = document.getElementById('shortcut-input');
const bgShortcutInput = document.getElementById('bg-shortcut-input');
const startupToggle = document.getElementById('startup-toggle');
const scaleStripe = document.getElementById('scale-stripe');
const scaleFormatToggle = document.getElementById('scale-format-toggle');
const btnScaleBack = document.getElementById('btn-scale-back');
const scaleSection = document.getElementById('scale-section');
const scaleContent = document.getElementById('scale-content');
const accessibilityBtn = document.getElementById('accessibility-btn');
const btnAccessibilityBack = document.getElementById('btn-accessibility-back');
const accessibilitySection = document.getElementById('accessibility-section');
const accessibilityContent = document.getElementById('accessibility-content');
const simulatorGrid = document.getElementById('vision-simulator-grid');
const accessColorCircle = document.getElementById('access-color-circle');
const accessColorName = document.getElementById('access-color-name');
const accessColorHex = document.getElementById('access-color-hex');
const accessWcagWhiteRatio = document.getElementById('wcag-ratio-white');
const accessWcagWhiteGrades = document.getElementById('wcag-grades-white');
const accessWcagBlackRatio = document.getElementById('wcag-ratio-black');
const accessWcagBlackGrades = document.getElementById('wcag-grades-black');

const wcagWhiteText = document.querySelector('#wcag-white .wcag-text');
const wcagWhiteRatio = document.getElementById('wcag-white-ratio');
const wcagBlackText = document.querySelector('#wcag-black .wcag-text');
const wcagBlackRatio = document.getElementById('wcag-black-ratio');
let savedColors = JSON.parse(localStorage.getItem('iris-colors') || '[]');
let currentColor = null;
let currentScaleFormat = 'hex';
let colorLibrary = loadColorLibrary();
let currentLibraryFolderId = localStorage.getItem('iris-library-folder') || '';
let draggingLibraryColorId = null;
let suppressLibraryColorClick = false;
let libraryPointerDrag = null;
const UNFILED_FOLDER_ID = '__unfiled__';
const UNFILED_PREVIEW_LIMIT = 6;
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
btnClose.addEventListener('click', () => {
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
function showView(viewId) {
    const sections = ['harmonics-section', 'scale-section', 'accessibility-section', 'library-section'];
    Array.from(mainContainer.children).forEach(child => {
        child.style.display = 'none';
    });

    if (viewId === 'main') {
        Array.from(mainContainer.children).forEach(child => {
            if (!sections.includes(child.id)) {
                child.style.display = '';
            }
        });
    } else {
        const target = document.getElementById(viewId);
        if (target) {
            target.style.display = 'flex';
            if (viewId === 'harmonics-section') generateHarmonics();
            if (viewId === 'scale-section') generateScale();
            if (viewId === 'accessibility-section') generateAccessibility();
            if (viewId === 'library-section') renderLibrary();
        }
    }
}

harmonicsBtn.addEventListener('click', () => showView('harmonics-section'));
accessibilityBtn.addEventListener('click', () => showView('accessibility-section'));
libraryBtn.addEventListener('click', () => showView('library-section'));
scaleStripe.addEventListener('click', () => showView('scale-section'));

btnHarmonicsBack.addEventListener('click', () => showView('main'));
btnScaleBack.addEventListener('click', () => showView('main'));
btnAccessibilityBack.addEventListener('click', () => showView('main'));
btnLibraryBack.addEventListener('click', () => showView('main'));
if (window.electronAPI && window.electronAPI.getStartupStatus) {
    window.electronAPI.getStartupStatus().then(status => {
        startupToggle.checked = status;
    }).catch(err => {
        console.error('Startup status failed:', err);
        startupToggle.checked = false;
    });
    if (window.electronAPI._isDevMode && window.electronAPI._isDevMode()) {
        startupToggle.disabled = true;
        startupToggle.closest('.setting-item').title = 'Autostart disabled in dev mode';
    }

    startupToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        window.electronAPI.toggleStartup(enabled).then(() => {
            showToast(enabled ? "Enabled Auto-Start" : "Disabled Auto-Start");
        }).catch(err => {
            console.error('Startup toggle failed:', err);
            e.target.checked = !enabled;
            showToast('Startup setting failed');
        });
    });
}
function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return { r, g, b };
}

function rgbToHsl(r, g, b) {
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

function hexToHsl(hex) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHsl(r, g, b);
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

function loadColorLibrary() {
    try {
        const parsed = JSON.parse(localStorage.getItem('iris-library') || 'null');
        return normalizeColorLibrary(parsed);
    } catch (err) {
        console.error('Failed to load color library:', err);
        return createEmptyColorLibrary();
    }
}

function saveColorLibrary() {
    const normalized = normalizeColorLibrary(colorLibrary);
    colorLibrary = normalized;

    const serialized = JSON.stringify(normalized, null, 2);
    localStorage.setItem('iris-library', serialized);
    localStorage.setItem('iris-library-folder', currentLibraryFolderId);

    if (window.electronAPI && window.electronAPI.writeLibraryFile) {
        window.electronAPI.writeLibraryFile(serialized).catch(err => {
            console.error('Failed to persist library file:', err);
            showToast('Library file save failed');
        });
    }
}

function createEmptyColorLibrary() {
    return {
        folders: [],
        colors: []
    };
}

function normalizeColorLibrary(value) {
    if (!value || !Array.isArray(value.folders) || !Array.isArray(value.colors)) {
        return createEmptyColorLibrary();
    }

    const folderIds = new Set();
    const folders = value.folders
        .filter(folder => folder && folder.id && folder.id !== 'default')
        .map(folder => {
            const normalizedFolder = {
                id: String(folder.id),
                name: String(folder.name || 'Folder').trim() || 'Folder',
                favorite: !!folder.favorite
            };
            folderIds.add(normalizedFolder.id);
            return normalizedFolder;
        });

    const colors = value.colors
        .filter(color => color && color.id && /^#[0-9A-F]{6}$/i.test(String(color.hex)))
        .map(color => {
            const hex = String(color.hex).toUpperCase();
            let folderId = color.folderId === 'default' ? UNFILED_FOLDER_ID : color.folderId;
            folderId = folderId && folderIds.has(folderId) ? folderId : UNFILED_FOLDER_ID;

            return {
                id: String(color.id),
                folderId,
                name: String(color.name || color.autoName || hex).trim() || hex,
                hex,
                autoName: String(color.autoName || color.name || 'Color').trim() || 'Color',
                createdAt: color.createdAt || new Date().toISOString()
            };
        });

    return { folders, colors };
}

async function hydrateLibraryFromAppData() {
    if (!window.electronAPI || !window.electronAPI.readLibraryFile) return;

    try {
        const persisted = await window.electronAPI.readLibraryFile();
        if (!persisted) {
            saveColorLibrary();
            return;
        }

        const parsed = JSON.parse(persisted);
        colorLibrary = normalizeColorLibrary(parsed);
        localStorage.setItem('iris-library', JSON.stringify(colorLibrary, null, 2));
        renderLibraryFolders();
        renderLibrary();
    } catch (err) {
        console.error('Failed to load app data library:', err);
        showToast('Using local library backup');
    }
}

function createLibraryId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function getCurrentLibraryFolder() {
    let folder = colorLibrary.folders.find(item => item.id === currentLibraryFolderId);
    if (!folder) {
        folder = colorLibrary.folders[0] || null;
        currentLibraryFolderId = folder ? folder.id : '';
    }
    return folder;
}

function getDefaultFolderId() {
    return UNFILED_FOLDER_ID;
}

function isUnfiledColor(item) {
    return !item.folderId || item.folderId === UNFILED_FOLDER_ID;
}

function getFolderColors(folderId) {
    return colorLibrary.colors.filter(item => (
        folderId === UNFILED_FOLDER_ID
            ? isUnfiledColor(item)
            : item.folderId === folderId
    ));
}

function getFolderName(folderId) {
    if (folderId === UNFILED_FOLDER_ID) return 'No folder';
    return colorLibrary.folders.find(item => item.id === folderId)?.name || 'Folder';
}

function getFolderLatestTime(folderId) {
    const times = colorLibrary.colors
        .filter(item => folderId === UNFILED_FOLDER_ID ? isUnfiledColor(item) : item.folderId === folderId)
        .map(item => Date.parse(item.createdAt || '') || 0);
    return times.length ? Math.max(...times) : 0;
}

function getSortedLibraryFolders() {
    return [...colorLibrary.folders].sort((a, b) => {
        if (!!a.favorite !== !!b.favorite) return a.favorite ? -1 : 1;
        const latestDiff = getFolderLatestTime(b.id) - getFolderLatestTime(a.id);
        if (latestDiff !== 0) return latestDiff;
        return a.name.localeCompare(b.name);
    });
}

function createStarIcon(className = 'library-star-icon') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '12');
    svg.setAttribute('height', '12');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.classList.add(className);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z');
    svg.appendChild(path);
    return svg;
}

function renderFolderTitle(title, folder) {
    title.textContent = '';
    if (folder.favorite) {
        title.appendChild(createStarIcon());
    }

    const name = document.createElement('span');
    name.textContent = folder.name;
    title.appendChild(name);
}

function downloadJson(filename, data) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = filename;
    a.click();
}

function getFileExtensionForMime(mimeType) {
    if (mimeType === 'application/json') return '.json';
    if (mimeType === 'text/plain') return '.txt';
    return '.md';
}

async function downloadText(filename, text, mimeType = 'text/markdown') {
    if (window.showSaveFilePicker) {
        try {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [{
                    description: mimeType === 'application/json' ? 'JSON' : 'Markdown',
                    accept: { [mimeType]: [getFileExtensionForMime(mimeType)] }
                }]
            });
            const writable = await fileHandle.createWritable();
            await writable.write(text);
            await writable.close();
            return true;
        } catch (err) {
            if (err && err.name === 'AbortError') return false;
            console.error('Save picker failed:', err);
        }
    }

    const dataStr = `data:${mimeType};charset=utf-8,` + encodeURIComponent(text);
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = filename;
    a.click();
    return true;
}
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

let pendingConfirmAction = null;

function openConfirmModal({ title, message, confirmText = 'Delete', onConfirm }) {
    pendingConfirmAction = onConfirm;
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmAction.textContent = confirmText;
    confirmModal.classList.add('show');
}

function closeConfirmModal() {
    confirmModal.classList.remove('show');
    pendingConfirmAction = null;
}

if (confirmClose) {
    confirmClose.addEventListener('click', closeConfirmModal);
}

if (confirmCancel) {
    confirmCancel.addEventListener('click', closeConfirmModal);
}

if (confirmModal) {
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) closeConfirmModal();
    });
}

if (confirmAction) {
    confirmAction.addEventListener('click', () => {
        const action = pendingConfirmAction;
        closeConfirmModal();
        if (action) action();
    });
}

function getDescriptiveColorName(h, s, l) {
    let lightnessDesc = "";
    if (l <= 3) lightnessDesc = "Black";
    else if (l < 10) lightnessDesc = "Near Black ";
    else if (l < 20) lightnessDesc = "Very Dark ";
    else if (l < 35) lightnessDesc = "Dark ";
    else if (l > 97) lightnessDesc = "White";
    else if (l > 90) lightnessDesc = "Near White ";
    else if (l > 80) lightnessDesc = "Very Light ";
    else if (l > 65) lightnessDesc = "Light ";
    if (lightnessDesc === "Black") return "Black";
    if (lightnessDesc === "White") return "White";
    if (s < 5) {
        return (lightnessDesc + "Grey").trim();
    }
    if (s < 12) {
        const tintHue = getHueName(h);
        return (lightnessDesc + tintHue + "ish Grey").trim();
    }
    const isWarm = (h < 80 || h >= 320);
    const tempDesc = isWarm ? "Warm " : "Cool ";
    let satDesc = "";
    if (s < 20) satDesc = "Greyish ";
    else if (s < 40) satDesc = "Muted ";
    else if (s < 60) satDesc = "";  // normal — no descriptor needed
    else if (s < 80) satDesc = "Rich ";
    else satDesc = "Vivid ";
    const hueDesc = getHueName(h);

    return (lightnessDesc + satDesc + tempDesc + hueDesc).trim();
}

function getHueName(h) {
    if (h < 10 || h >= 350) return "Red";
    if (h < 25) return "Vermilion";
    if (h < 40) return "Orange";
    if (h < 52) return "Amber";
    if (h < 68) return "Yellow";
    if (h < 82) return "Chartreuse";
    if (h < 150) return "Green";
    if (h < 170) return "Teal";
    if (h < 190) return "Cyan";
    if (h < 215) return "Sky Blue";
    if (h < 250) return "Blue";
    if (h < 270) return "Indigo";
    if (h < 290) return "Purple";
    if (h < 320) return "Magenta";
    return "Rose";
}

function getNearestColorName(r, g, b, justName = false) {
    const colorDB = (typeof XKCD_COLORS !== 'undefined') ? XKCD_COLORS : [];
    let minDistance = Infinity;
    let closestName = "unknown";

    for (const color of colorDB) {
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
        }
    }
    const formattedName = closestName.replace(/\b\w/g, c => c.toUpperCase());

    const { h, s, l } = rgbToHsl(r, g, b);
    const descriptiveName = getDescriptiveColorName(h, s, l);
    const maxDistance = 764;
    const matchPercent = Math.round(Math.max(0, 100 - (minDistance / maxDistance * 100)));

    if (justName) return formattedName;
    const xkcdLower = formattedName.toLowerCase();
    const descLower = descriptiveName.toLowerCase();
    if (xkcdLower === descLower || descLower.length <= 5) {
        return `${formattedName} (${matchPercent}%)`;
    }

    return `${formattedName} (${matchPercent}%) · ${descriptiveName}`;
}
function getLuminance(r, g, b) {
    const a = [r, g, b].map(srgbToLinearChannel);
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function srgbToLinearChannel(value) {
    const normalized = value / 255;
    return normalized <= 0.04045
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function linearToSrgbChannel(value) {
    const clamped = Math.max(0, Math.min(1, value));
    const encoded = clamped <= 0.0031308
        ? clamped * 12.92
        : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
    return Math.round(Math.max(0, Math.min(1, encoded)) * 255);
}

function getContrastRatio(r, g, b, bgR, bgG, bgB) {
    const l1 = getLuminance(r, g, b);
    const l2 = getLuminance(bgR, bgG, bgB);
    const lightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (lightest + 0.05) / (darkest + 0.05);
}
function setCurrentColor(hex, skipVariationsUpdate = false) {
    currentColor = hex.toUpperCase();

    const { r, g, b } = hexToRgb(currentColor);
    const { h, s, l } = hexToHsl(currentColor);
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
    if (!skipVariationsUpdate) {
        if (harmonicsSection.style.display === 'flex') {
            generateHarmonics();
        }
        if (scaleSection && scaleSection.style.display === 'flex') {
            generateScale();
        }
        if (accessibilitySection && accessibilitySection.style.display === 'flex') {
            generateAccessibility();
        }
    }
}
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

function isShortcutClearKey(e) {
    return e.key === 'Backspace' || e.key === 'Delete';
}

function normalizeShortcutKey(key) {
    if (key === ' ') return 'Space';
    if (key.length === 1) return key.toUpperCase();
    return key;
}

function isValidShortcut(keys, key) {
    const hasModifier = keys.length > 1;
    const isFunctionKey = /^F([1-9]|1[0-2])$/.test(key);
    return hasModifier || isFunctionKey;
}

function clearShortcut(inputEl, storageKey, apiMethod) {
    inputEl.value = '';
    localStorage.setItem(storageKey, '');

    if (!window.electronAPI || !window.electronAPI[apiMethod]) {
        showToast('Shortcut cleared');
        return;
    }

    window.electronAPI[apiMethod]('').then(() => {
        showToast('Shortcut cleared');
    }).catch(err => {
        console.error('Shortcut clear failed:', err);
        showToast('Shortcut clear failed');
    });
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

        if (isShortcutClearKey(e)) {
            clearShortcut(inputEl, storageKey, apiMethod);
            inputEl.blur();
            return;
        }

        if (['Alt', 'Control', 'Shift', 'Meta'].includes(e.key)) return;

        let keys = [];
        if (e.ctrlKey || e.metaKey) keys.push('CommandOrControl');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');

        let key = normalizeShortcutKey(e.key);
        keys.push(key);

        if (!isValidShortcut(keys, key)) {
            showToast('Use Ctrl, Alt, or Shift with a key');
            return;
        }

        const shortcutStr = keys.join('+');
        const previousShortcut = localStorage.getItem(storageKey) || '';
        inputEl.value = formatShortcutForDisplay(shortcutStr);

        if (window.electronAPI && window.electronAPI[apiMethod]) {
            window.electronAPI[apiMethod](shortcutStr).then(() => {
                localStorage.setItem(storageKey, shortcutStr);
                showToast(`Shortcut set to ${formatShortcutForDisplay(shortcutStr)}`);
            }).catch(err => {
                console.error('Shortcut registration failed:', err);
                inputEl.value = formatShortcutForDisplay(previousShortcut);
                showToast('Shortcut unavailable');
            });
        } else {
            localStorage.setItem(storageKey, shortcutStr);
            showToast(`Shortcut set to ${formatShortcutForDisplay(shortcutStr)}`);
        }

        inputEl.blur();
    });
}

if (shortcutInput) {
    handleShortcutInput(shortcutInput, 'iris-shortcut', 'registerShortcut');
}

if (bgShortcutInput) {
    handleShortcutInput(bgShortcutInput, 'iris-bg-shortcut', 'registerBgShortcut');
}
if (window.electronAPI) {
    if (window.electronAPI.onTriggerPicker) {
        window.electronAPI.onTriggerPicker(async () => {
            try {
                const hex = await window.electronAPI.pickColor();
                if (hex) {
                    setCurrentColor(hex);

                    if (window.electronAPI && window.electronAPI.writeTextToClipboard) {
                        await window.electronAPI.writeTextToClipboard(hex);
                    } else {
                        await navigator.clipboard.writeText(hex);
                    }

                    savedColors.unshift(hex);
                    saveColors();
                    renderGallery();
                    showToast(`Picked & Copied ${hex}`);
                }
            } catch (_) {}
        });
    }

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

                    savedColors.unshift(hex);
                    saveColors();
                    renderGallery();
                    showToast(`Copied ${hex}`);
                }
            } catch (_) {}
            if (window.electronAPI.close) {
                window.electronAPI.close();
            }
        });
    }
}
let previewInterval = null;
let isPreviewMode = false;

function startPreviewMode() {
    if (isPreviewMode) return;

    const hasLivePreview = window.electronAPI && window.electronAPI.getPixelAtCursor;
    const hasEyeDropper = window.EyeDropper;

    if (!hasLivePreview && !hasEyeDropper) {
        fallbackPick();
        return;
    }
    if (hasLivePreview) {
        isPreviewMode = true;
        pickBtn.classList.add('preview-active');

        previewInterval = setInterval(async () => {
            if (!isPreviewMode) return;
            try {
                const hex = await window.electronAPI.getPixelAtCursor();
                if (hex && isPreviewMode) {
                    setCurrentColor(hex, true);
                }
            } catch (e) { }
        }, 50);
    }

    if (hasEyeDropper) {
        const dropper = new EyeDropper();
        dropper.open().then(result => {
            stopPreviewMode(false);
            const hex = result.sRGBHex;
            setCurrentColor(hex);
            confirmPick(hex);
        }).catch(() => {
            stopPreviewMode(false);
        });
    } else {
        document.addEventListener('keydown', previewKeyHandler);
        window.addEventListener('blur', previewConfirmHandler);
    }
}

function previewKeyHandler(e) {
    if (e.key === 'Escape') {
        stopPreviewMode(false);
    }
}

function previewConfirmHandler() {
    if (isPreviewMode) {
        stopPreviewMode(true);
    }
}

function stopPreviewMode(confirm) {
    if (!isPreviewMode && !pickBtn.classList.contains('preview-active')) return;
    isPreviewMode = false;
    clearInterval(previewInterval);
    previewInterval = null;

    pickBtn.classList.remove('preview-active');

    document.removeEventListener('keydown', previewKeyHandler);
    window.removeEventListener('blur', previewConfirmHandler);

    if (confirm && currentColor) {
        confirmPick(currentColor);
    }
}

function confirmPick(hex) {
    const copyPromise = (window.electronAPI && window.electronAPI.writeTextToClipboard)
        ? window.electronAPI.writeTextToClipboard(hex)
        : navigator.clipboard.writeText(hex);

    copyPromise.then(() => {
        savedColors.unshift(hex);
        saveColors();
        renderGallery();
        showToast(`Picked & Copied ${hex}`);
    }).catch(err => {
        console.error("Failed to copy:", err);
        showToast("Failed to copy");
    });
}

async function fallbackPick() {
    try {
        const hex = await window.electronAPI.pickColor();
        if (!hex) return;
        setCurrentColor(hex);
        confirmPick(hex);
    } catch (_) {}
}

pickBtn.addEventListener('click', () => {
    if (isPreviewMode) {
        stopPreviewMode(false);
    } else {
        startPreviewMode();
    }
});
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
document.addEventListener('click', (e) => {
    if (!e.target.closest('.folder-menu')) {
        document.querySelectorAll('.folder-menu.open').forEach(item => item.classList.remove('open'));
    }

    if (!e.target.closest('.folder-select')) {
        closeSaveFolderDropdown();
    }
});

function renderLibraryFolders() {
    getCurrentLibraryFolder();

    if (!saveColorFolderSelect) return;

    if (!saveColorFolderMenu) {
        saveColorFolderSelect.value = currentLibraryFolderId;
        return;
    }

    saveColorFolderMenu.innerHTML = '';

    const noFolderOption = document.createElement('button');
    noFolderOption.type = 'button';
    noFolderOption.className = 'folder-select-option';
    noFolderOption.dataset.folderId = UNFILED_FOLDER_ID;
    noFolderOption.setAttribute('role', 'option');

    const noFolderLabel = document.createElement('span');
    noFolderLabel.textContent = 'No folder';
    noFolderOption.appendChild(noFolderLabel);

    noFolderOption.addEventListener('click', (e) => {
        e.stopPropagation();
        setSaveFolderValue(UNFILED_FOLDER_ID);
        closeSaveFolderDropdown();
    });

    saveColorFolderMenu.appendChild(noFolderOption);

    getSortedLibraryFolders().forEach(folder => {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'folder-select-option';
        option.dataset.folderId = folder.id;
        option.setAttribute('role', 'option');

        if (folder.favorite) {
            option.appendChild(createStarIcon('folder-select-star'));
        }

        const label = document.createElement('span');
        label.textContent = folder.name;
        option.appendChild(label);

        option.addEventListener('click', (e) => {
            e.stopPropagation();
            setSaveFolderValue(folder.id);
            closeSaveFolderDropdown();
        });

        saveColorFolderMenu.appendChild(option);
    });

    setSaveFolderValue(saveColorFolderSelect.value || currentLibraryFolderId || getDefaultFolderId());
}

function setSaveFolderValue(folderId) {
    if (!saveColorFolderSelect) return;

    const folder = folderId === UNFILED_FOLDER_ID
        ? null
        : colorLibrary.folders.find(item => item.id === folderId);

    saveColorFolderSelect.value = folder ? folder.id : UNFILED_FOLDER_ID;
    if (saveColorFolderLabel) saveColorFolderLabel.textContent = folder ? folder.name : 'No folder';

    if (saveColorFolderMenu) {
        saveColorFolderMenu.querySelectorAll('.folder-select-option').forEach(option => {
            const active = option.dataset.folderId === saveColorFolderSelect.value;
            option.classList.toggle('active', active);
            option.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    }
}

function closeSaveFolderDropdown() {
    if (!saveColorFolderPicker) return;
    saveColorFolderPicker.classList.remove('open');
    if (saveColorFolderTrigger) saveColorFolderTrigger.setAttribute('aria-expanded', 'false');
}

function toggleSaveFolderDropdown() {
    if (!saveColorFolderPicker) return;
    const isOpen = saveColorFolderPicker.classList.toggle('open');
    if (saveColorFolderTrigger) saveColorFolderTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function moveLibraryColor(colorId, folderId, beforeColorId = null) {
    const fromIndex = colorLibrary.colors.findIndex(item => item.id === colorId);
    if (fromIndex === -1) return false;

    const color = colorLibrary.colors[fromIndex];
    const targetFolderId = folderId === UNFILED_FOLDER_ID ? UNFILED_FOLDER_ID : folderId;
    const folderExists = targetFolderId === UNFILED_FOLDER_ID || colorLibrary.folders.some(item => item.id === targetFolderId);
    if (!folderExists) return false;
    const sourceFolderId = isUnfiledColor(color) ? UNFILED_FOLDER_ID : color.folderId;

    colorLibrary.colors.splice(fromIndex, 1);
    color.folderId = targetFolderId;

    let insertIndex = colorLibrary.colors.length;
    if (beforeColorId && beforeColorId !== colorId) {
        const beforeIndex = colorLibrary.colors.findIndex(item => item.id === beforeColorId);
        if (beforeIndex !== -1) insertIndex = beforeIndex;
    } else {
        const folderColorIndexes = colorLibrary.colors
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => targetFolderId === UNFILED_FOLDER_ID ? isUnfiledColor(item) : item.folderId === targetFolderId)
            .map(({ index }) => index);
        if (folderColorIndexes.length) insertIndex = Math.max(...folderColorIndexes) + 1;
    }

    colorLibrary.colors.splice(insertIndex, 0, color);
    currentLibraryFolderId = targetFolderId === UNFILED_FOLDER_ID ? '' : targetFolderId;
    saveColorLibrary();
    renderLibraryFolders();
    renderLibrary();
    showToast(sourceFolderId === targetFolderId ? `Sorted ${color.name}` : `Moved ${color.name} to ${getFolderName(targetFolderId)}`);
    return true;
}

function getDropBeforeColorId(container, pointerY) {
    const rows = [...container.querySelectorAll('[data-library-color-id]:not(.is-dragging)')];
    const next = rows.find(row => pointerY < row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2);
    return next ? next.dataset.libraryColorId : null;
}

function attachLibraryDropTarget(element, folderId, options = {}) {
    element.dataset.libraryDropFolderId = folderId;
    if (options.sortable) element.dataset.librarySortable = 'true';

    element.addEventListener('dragover', (e) => {
        if (!draggingLibraryColorId) return;
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        element.classList.add('is-drop-target');
    });

    element.addEventListener('dragleave', (e) => {
        e.stopPropagation();
        element.classList.remove('is-drop-target');
    });

    element.addEventListener('drop', (e) => {
        if (!draggingLibraryColorId) return;
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('is-drop-target');
        const beforeColorId = options.sortable ? getDropBeforeColorId(element, e.clientY) : null;
        moveLibraryColor(draggingLibraryColorId, folderId, beforeColorId);
        draggingLibraryColorId = null;
    });
}

function getNextFolderColorId(folderId, colorId, excludeColorId = null) {
    const colors = getFolderColors(folderId).filter(item => item.id !== excludeColorId);
    const index = colors.findIndex(item => item.id === colorId);
    return index === -1 ? null : (colors[index + 1]?.id || null);
}

function clearLibraryDropMarkers() {
    document.querySelectorAll('.is-drop-target, .drop-before, .drop-after').forEach(el => {
        el.classList.remove('is-drop-target', 'drop-before', 'drop-after');
    });
}

function getPointerDropTarget(clientX, clientY, draggedColorId) {
    const element = document.elementFromPoint(clientX, clientY);
    if (!element) return null;

    const colorTarget = element.closest('[data-library-color-id]');
    if (colorTarget && colorTarget.dataset.libraryColorId !== draggedColorId) {
        const folderId = colorTarget.dataset.libraryFolderId || UNFILED_FOLDER_ID;
        const rect = colorTarget.getBoundingClientRect();
        const isGridCard = colorTarget.classList.contains('library-unfiled-card');
        const isAfter = isGridCard
            ? clientY > rect.top + rect.height / 2 || (Math.abs(clientY - (rect.top + rect.height / 2)) < 8 && clientX > rect.left + rect.width / 2)
            : clientY > rect.top + rect.height / 2;

        return {
            element: colorTarget,
            folderId,
            beforeColorId: isAfter ? getNextFolderColorId(folderId, colorTarget.dataset.libraryColorId, draggedColorId) : colorTarget.dataset.libraryColorId,
            markerClass: isAfter ? 'drop-after' : 'drop-before'
        };
    }

    const dropTarget = element.closest('[data-library-drop-folder-id]');
    if (dropTarget) {
        const folderId = dropTarget.dataset.libraryDropFolderId;
        const beforeColorId = dropTarget.dataset.librarySortable === 'true'
            ? getDropBeforeColorId(dropTarget, clientY)
            : null;
        return { element: dropTarget, folderId, beforeColorId, markerClass: 'is-drop-target' };
    }

    return null;
}

function createLibraryDragGhost(sourceElement, item) {
    const ghost = document.createElement('div');
    ghost.className = 'library-drag-ghost';
    ghost.innerHTML = `
        <span class="library-drag-ghost-dot" style="background:${item.hex}"></span>
        <span>${item.name}</span>
    `;
    document.body.appendChild(ghost);
    return ghost;
}

function positionLibraryDragGhost(ghost, clientX, clientY) {
    ghost.style.transform = `translate(${clientX + 10}px, ${clientY + 10}px)`;
}

function updateLibraryPointerDrop(clientX, clientY) {
    if (!libraryPointerDrag || !libraryPointerDrag.active) return null;

    clearLibraryDropMarkers();
    const target = getPointerDropTarget(clientX, clientY, libraryPointerDrag.colorId);
    if (!target) {
        libraryPointerDrag.dropTarget = null;
        return null;
    }

    target.element.classList.add(target.markerClass);
    libraryPointerDrag.dropTarget = target;
    return target;
}

function startLibraryPointerDrag(e, element, item) {
    if (e.button !== 0 || e.target.closest('.library-icon-btn, .folder-menu, .library-see-more, .library-unfiled-delete')) return;

    libraryPointerDrag = {
        colorId: item.id,
        item,
        sourceElement: element,
        startX: e.clientX,
        startY: e.clientY,
        active: false,
        ghost: null,
        dropTarget: null
    };

    const handlePointerMove = (moveEvent) => {
        if (!libraryPointerDrag) return;
        const dx = moveEvent.clientX - libraryPointerDrag.startX;
        const dy = moveEvent.clientY - libraryPointerDrag.startY;

        if (!libraryPointerDrag.active && Math.hypot(dx, dy) < 5) return;

        moveEvent.preventDefault();

        if (!libraryPointerDrag.active) {
            libraryPointerDrag.active = true;
            draggingLibraryColorId = item.id;
            suppressLibraryColorClick = true;
            element.classList.add('is-dragging');
            document.body.classList.add('library-dragging');
            libraryPointerDrag.ghost = createLibraryDragGhost(element, item);
        }

        positionLibraryDragGhost(libraryPointerDrag.ghost, moveEvent.clientX, moveEvent.clientY);
        updateLibraryPointerDrop(moveEvent.clientX, moveEvent.clientY);
    };

    const finishPointerDrag = (upEvent) => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', finishPointerDrag);
        document.removeEventListener('pointercancel', cancelPointerDrag);

        if (!libraryPointerDrag) return;

        if (libraryPointerDrag.active) {
            upEvent.preventDefault();
            const target = updateLibraryPointerDrop(upEvent.clientX, upEvent.clientY) || libraryPointerDrag.dropTarget;
            if (target) moveLibraryColor(libraryPointerDrag.colorId, target.folderId, target.beforeColorId);
        }

        cleanupLibraryPointerDrag();
    };

    const cancelPointerDrag = () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', finishPointerDrag);
        document.removeEventListener('pointercancel', cancelPointerDrag);
        cleanupLibraryPointerDrag();
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', finishPointerDrag);
    document.addEventListener('pointercancel', cancelPointerDrag);
}

function cleanupLibraryPointerDrag() {
    if (!libraryPointerDrag) return;

    if (libraryPointerDrag.ghost) libraryPointerDrag.ghost.remove();
    if (libraryPointerDrag.sourceElement) libraryPointerDrag.sourceElement.classList.remove('is-dragging');
    clearLibraryDropMarkers();
    document.body.classList.remove('library-dragging');
    draggingLibraryColorId = null;
    libraryPointerDrag = null;

    setTimeout(() => {
        suppressLibraryColorClick = false;
    }, 0);
}

function attachLibraryColorDropTarget(element, item) {
    const folderId = isUnfiledColor(item) ? UNFILED_FOLDER_ID : item.folderId;
    element.dataset.libraryFolderId = folderId;

    element.addEventListener('dragover', (e) => {
        if (!draggingLibraryColorId || draggingLibraryColorId === item.id) return;
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        const isAfter = e.clientY > element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2;
        element.classList.toggle('drop-after', isAfter);
        element.classList.toggle('drop-before', !isAfter);
    });

    element.addEventListener('dragleave', (e) => {
        e.stopPropagation();
        element.classList.remove('drop-before', 'drop-after');
    });

    element.addEventListener('drop', (e) => {
        if (!draggingLibraryColorId || draggingLibraryColorId === item.id) return;
        e.preventDefault();
        e.stopPropagation();
        const isAfter = e.clientY > element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2;
        const beforeColorId = isAfter ? getNextFolderColorId(folderId, item.id, draggingLibraryColorId) : item.id;
        element.classList.remove('drop-before', 'drop-after');
        moveLibraryColor(draggingLibraryColorId, folderId, beforeColorId);
        draggingLibraryColorId = null;
    });
}

function makeLibraryColorDraggable(element, item) {
    element.draggable = false;
    element.dataset.libraryColorId = item.id;
    element.dataset.libraryFolderId = isUnfiledColor(item) ? UNFILED_FOLDER_ID : item.folderId;
    element.addEventListener('pointerdown', (e) => startLibraryPointerDrag(e, element, item));
    element.addEventListener('dragstart', (e) => {
        e.preventDefault();
        draggingLibraryColorId = item.id;
        suppressLibraryColorClick = true;
        element.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.id);
    });

    element.addEventListener('dragend', () => {
        draggingLibraryColorId = null;
        element.classList.remove('is-dragging');
        document.querySelectorAll('.is-drop-target').forEach(el => el.classList.remove('is-drop-target'));
        setTimeout(() => {
            suppressLibraryColorClick = false;
        }, 0);
    });
}

function createUnfiledColorCard(item) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'library-unfiled-card';
    card.setAttribute('aria-label', `${item.name} - ${item.hex}`);

    const dot = document.createElement('span');
    dot.className = 'library-unfiled-dot';
    dot.style.background = item.hex;

    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'library-unfiled-delete';
    deleteIcon.textContent = '×';
    deleteIcon.setAttribute('aria-hidden', 'true');
    dot.appendChild(deleteIcon);

    const label = document.createElement('span');
    label.className = 'library-unfiled-name';
    label.textContent = item.name;

    card.appendChild(dot);
    card.appendChild(label);
    makeLibraryColorDraggable(card, item);
    attachLibraryColorDropTarget(card, item);

    card.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.closest('.library-unfiled-delete')) {
            e.stopPropagation();
            openConfirmModal({
                title: 'Delete Color',
                message: `Delete ${item.name}?`,
                confirmText: 'Delete',
                onConfirm: () => {
                    colorLibrary.colors = colorLibrary.colors.filter(color => color.id !== item.id);
                    saveColorLibrary();
                    renderLibrary();
                    showToast('Removed saved color');
                }
            });
            return;
        }
        if (suppressLibraryColorClick) return;
        selectLibraryColor(item);
    });

    card.addEventListener('dblclick', (e) => {
        e.preventDefault();
        openSaveColorModal(item);
    });

    return card;
}

function createUnfiledLibrarySection(unfiledColors) {
    const section = document.createElement('div');
    section.className = 'library-unfiled-section';
    if (unfiledColors.length === 0) section.classList.add('is-empty');

    const grid = document.createElement('div');
    grid.className = 'library-unfiled-grid';
    if (unfiledColors.length === 0) grid.classList.add('is-empty');
    attachLibraryDropTarget(grid, UNFILED_FOLDER_ID, { sortable: true });

    const visibleColors = unfiledColors.slice(0, UNFILED_PREVIEW_LIMIT);
    visibleColors.forEach(item => {
        grid.appendChild(createUnfiledColorCard(item));
    });

    if (unfiledColors.length === 0) {
        const hint = document.createElement('div');
        hint.className = 'library-unfiled-drop-hint';
        hint.textContent = 'Drop here';
        grid.appendChild(hint);
    }

    section.appendChild(grid);

    if (unfiledColors.length > UNFILED_PREVIEW_LIMIT) {
        const more = document.createElement('button');
        more.type = 'button';
        more.className = 'library-see-more';
        more.textContent = `See ${unfiledColors.length - UNFILED_PREVIEW_LIMIT} more`;
        more.addEventListener('click', () => {
            const expanded = section.classList.toggle('is-expanded');
            grid.innerHTML = '';
            const colors = expanded ? unfiledColors : visibleColors;
            colors.forEach(item => grid.appendChild(createUnfiledColorCard(item)));
            more.textContent = expanded ? 'Show less' : `See ${unfiledColors.length - UNFILED_PREVIEW_LIMIT} more`;
        });
        section.appendChild(more);
    }

    return section;
}

function selectLibraryColor(item) {
    setCurrentColor(item.hex);
    currentLibraryFolderId = isUnfiledColor(item) ? '' : item.folderId;
    saveColorLibrary();
    showView('main');
    showToast(`Selected ${item.name}`);
}

function renderLibrary() {
    if (!libraryList || !libraryEmpty) return;

    libraryList.querySelectorAll('.library-folder, .library-unfiled-section').forEach(el => el.remove());

    const unfiledColors = getFolderColors(UNFILED_FOLDER_ID);

    if (colorLibrary.folders.length === 0 && unfiledColors.length === 0) {
        libraryEmpty.style.display = '';
        libraryEmpty.innerHTML = '<p>No folders yet.<br />Create a folder to start your library.</p>';
        return;
    }

    libraryEmpty.style.display = 'none';

    if (unfiledColors.length > 0 || colorLibrary.colors.length > 0) {
        libraryList.appendChild(createUnfiledLibrarySection(unfiledColors));
    }

    getSortedLibraryFolders().forEach(folder => {
        const folderColors = getFolderColors(folder.id);

        if (folderColors.length === 0) {
            libraryList.appendChild(createLibraryFolderRow(folder, []));
            return;
        }

        const details = document.createElement('details');
        details.className = 'library-folder';
        details.open = folder.id === currentLibraryFolderId || colorLibrary.folders.length === 1;
        attachLibraryDropTarget(details, folder.id);

        const summary = document.createElement('summary');
        summary.className = 'library-folder-summary';
        attachLibraryDropTarget(summary, folder.id);

        const title = document.createElement('span');
        title.className = 'library-folder-title';
        renderFolderTitle(title, folder);
        title.title = 'Double-click to rename';
        title.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openFolderModal(folder);
        });

        const count = document.createElement('span');
        count.className = 'library-folder-count';
        count.textContent = folderColors.length;

        const menu = createFolderMenu(folder, folderColors);

        summary.appendChild(title);
        summary.appendChild(count);
        summary.appendChild(menu);
        details.appendChild(summary);

        summary.addEventListener('click', (e) => {
            if (e.target.closest('.folder-menu')) return;
            currentLibraryFolderId = folder.id;
            saveColorLibrary();
        });

        const colorsWrap = document.createElement('div');
        colorsWrap.className = 'library-folder-colors';
        attachLibraryDropTarget(colorsWrap, folder.id, { sortable: true });

        folderColors.forEach(item => {
            colorsWrap.appendChild(createLibraryColorRow(item));
        });

        details.appendChild(colorsWrap);
        libraryList.appendChild(details);
    });
}

function createLibraryFolderRow(folder, folderColors) {
    const row = document.createElement('div');
    row.className = 'library-folder library-folder-flat';
    attachLibraryDropTarget(row, folder.id);

    const title = document.createElement('span');
    title.className = 'library-folder-title';
    renderFolderTitle(title, folder);
    title.title = 'Double-click to rename';
    title.addEventListener('dblclick', () => openFolderModal(folder));

    const count = document.createElement('span');
    count.className = 'library-folder-count';
    count.textContent = folderColors.length;

    row.appendChild(title);
    row.appendChild(count);
    row.appendChild(createFolderMenu(folder, folderColors));
    return row;
}

function createFolderMenu(folder, folderColors) {
    const wrap = document.createElement('div');
    wrap.className = 'folder-menu';

    const button = document.createElement('button');
    button.className = 'folder-menu-btn';
    button.type = 'button';
    button.title = 'Folder actions';
    button.setAttribute('aria-label', 'Folder actions');

    const menu = document.createElement('div');
    menu.className = 'folder-menu-popover';

    const rename = document.createElement('button');
    rename.textContent = 'Rename';
    rename.addEventListener('click', (e) => {
        e.stopPropagation();
        wrap.classList.remove('open');
        openFolderModal(folder);
    });

    const favorite = document.createElement('button');
    favorite.className = 'folder-menu-action';
    favorite.appendChild(createStarIcon('folder-menu-star'));
    favorite.appendChild(document.createTextNode(folder.favorite ? 'Unstar' : 'Star'));
    favorite.addEventListener('click', (e) => {
        e.stopPropagation();
        wrap.classList.remove('open');
        toggleFolderFavorite(folder.id);
    });

    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Markdown';
    exportBtn.disabled = folderColors.length === 0;
    exportBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        wrap.classList.remove('open');
        const didExport = await exportLibraryFolderMarkdown(folder.id);
        if (didExport) showToast(`Exported ${folder.name}`);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'danger';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        wrap.classList.remove('open');
        deleteLibraryFolder(folder.id);
    });

    menu.appendChild(favorite);
    menu.appendChild(rename);
    menu.appendChild(exportBtn);
    menu.appendChild(deleteBtn);

    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.querySelectorAll('.folder-menu.open').forEach(item => {
            if (item !== wrap) item.classList.remove('open');
        });
        wrap.classList.toggle('open');
    });

    wrap.appendChild(button);
    wrap.appendChild(menu);
    return wrap;
}

function createLibraryColorRow(item) {
    const row = document.createElement('div');
    row.className = 'library-color-row';
    makeLibraryColorDraggable(row, item);
    attachLibraryColorDropTarget(row, item);

    const colorDot = document.createElement('div');
    colorDot.className = 'library-color-dot';
    colorDot.style.background = item.hex;

    const info = document.createElement('div');
    info.className = 'library-color-info';

    const label = document.createElement('div');
    label.className = 'library-color-name';
    label.textContent = item.name;

    const meta = document.createElement('div');
    meta.className = 'library-color-meta';
    meta.textContent = `${item.hex} - ${item.autoName}`;

    info.appendChild(label);
    info.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'library-color-actions';

    const renameBtn = document.createElement('button');
    renameBtn.className = 'library-icon-btn';
    renameBtn.textContent = 'Edit';
    renameBtn.title = 'Edit saved color';
    renameBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSaveColorModal(item);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'library-icon-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.title = 'Delete saved color';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openConfirmModal({
            title: 'Delete Color',
            message: `Delete ${item.name}?`,
            confirmText: 'Delete',
            onConfirm: () => {
                colorLibrary.colors = colorLibrary.colors.filter(color => color.id !== item.id);
                saveColorLibrary();
                renderLibrary();
                showToast('Removed saved color');
            }
        });
    });

    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);

    row.appendChild(colorDot);
    row.appendChild(info);
    row.appendChild(actions);

    row.addEventListener('click', () => {
        if (suppressLibraryColorClick) return;
        selectLibraryColor(item);
    });

    return row;
}

function createLibraryFolder(name) {
    const trimmedName = name.trim();
    if (!trimmedName) return { folder: null, created: false };

    const existing = colorLibrary.folders.find(folder => folder.name.toLowerCase() === trimmedName.toLowerCase());
    if (existing) {
        currentLibraryFolderId = existing.id;
        saveColorLibrary();
        renderLibraryFolders();
        renderLibrary();
        return { folder: existing, created: false };
    }

    const folder = {
        id: createLibraryId(),
        name: trimmedName,
        favorite: false
    };

    colorLibrary.folders.push(folder);
    currentLibraryFolderId = folder.id;
    saveColorLibrary();
    renderLibraryFolders();
    renderLibrary();
    return { folder, created: true };
}

function renameLibraryFolder(folderId, name) {
    const folder = colorLibrary.folders.find(item => item.id === folderId);
    const trimmedName = name.trim();
    if (!folder || !trimmedName) return null;

    folder.name = trimmedName;
    currentLibraryFolderId = folder.id;
    saveColorLibrary();
    renderLibraryFolders();
    renderLibrary();
    return folder;
}

function toggleFolderFavorite(folderId) {
    const folder = colorLibrary.folders.find(item => item.id === folderId);
    if (!folder) return;

    folder.favorite = !folder.favorite;
    currentLibraryFolderId = folder.id;
    saveColorLibrary();
    renderLibraryFolders();
    renderLibrary();
    showToast(folder.favorite ? `Starred ${folder.name}` : `Unstarred ${folder.name}`);
}

function deleteLibraryFolder(folderId) {
    const folder = colorLibrary.folders.find(item => item.id === folderId);
    if (!folder) return;

    const folderColors = colorLibrary.colors.filter(item => item.folderId === folderId);
    const message = folderColors.length === 0
        ? `Delete ${folder.name}?`
        : `Delete ${folder.name} and ${folderColors.length} saved color${folderColors.length === 1 ? '' : 's'}?`;

    openConfirmModal({
        title: 'Delete Folder',
        message,
        confirmText: 'Delete',
        onConfirm: () => {
            colorLibrary.folders = colorLibrary.folders.filter(item => item.id !== folderId);
            colorLibrary.colors = colorLibrary.colors.filter(item => item.folderId !== folderId);

            currentLibraryFolderId = colorLibrary.folders[0]?.id || '';
            saveColorLibrary();
            renderLibraryFolders();
            renderLibrary();
            showToast(`Deleted ${folder.name}`);
        }
    });
}

function openFolderModal(folder = null) {
    folderModal.dataset.editingId = folder ? folder.id : '';
    folderModalTitle.textContent = folder ? 'Rename Folder' : 'New Folder';
    folderConfirm.textContent = folder ? 'Rename Folder' : 'Create Folder';
    folderModal.classList.add('show');
    folderNameInput.value = folder ? folder.name : '';
    folderNameInput.focus();
    folderNameInput.select();
}

function closeFolderModal() {
    folderModal.classList.remove('show');
    folderModal.dataset.editingId = '';
}

if (libraryFolderBtn) {
    libraryFolderBtn.addEventListener('click', () => openFolderModal());
}

if (saveColorNewFolder) {
    saveColorNewFolder.addEventListener('click', () => openFolderModal());
}

if (folderClose) {
    folderClose.addEventListener('click', closeFolderModal);
}

if (folderModal) {
    folderModal.addEventListener('click', (e) => {
        if (e.target === folderModal) closeFolderModal();
    });
}

if (folderConfirm) {
    folderConfirm.addEventListener('click', () => {
        const editingId = folderModal.dataset.editingId;
        const result = editingId
            ? { folder: renameLibraryFolder(editingId, folderNameInput.value), created: false }
            : createLibraryFolder(folderNameInput.value);
        const folder = result.folder;
        if (!folder) return;

        if (saveColorModal && saveColorModal.classList.contains('show')) {
            setSaveFolderValue(folder.id);
        }

        closeFolderModal();
        showToast(result.created ? `Created ${folder.name}` : `Updated ${folder.name}`);
    });
}

if (saveColorFolderTrigger) {
    saveColorFolderTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSaveFolderDropdown();
    });
}

if (folderNameInput) {
    folderNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') folderConfirm.click();
        if (e.key === 'Escape') closeFolderModal();
    });
}

if (saveLibraryBtn) {
    saveLibraryBtn.addEventListener('click', () => openSaveColorModal());
}

function openSaveColorModal(existingItem = null, colorOverride = null) {
    if (!currentColor && !existingItem && !colorOverride) {
        showToast('Pick a color first');
        return;
    }

    const hex = existingItem ? existingItem.hex : (colorOverride || currentColor);
    const { r, g, b } = hexToRgb(hex);
    const autoName = existingItem ? existingItem.autoName : getNearestColorName(r, g, b, true);

    renderLibraryFolders();
    saveColorModal.dataset.editingId = existingItem ? existingItem.id : '';
    saveColorModal.dataset.hex = hex;
    saveColorDot.style.background = hex;
    saveColorHex.textContent = hex;
    saveColorAutoName.textContent = autoName;
    saveColorNameInput.value = existingItem ? existingItem.name : autoName;
    setSaveFolderValue(existingItem ? existingItem.folderId : getDefaultFolderId());
    saveColorConfirm.textContent = existingItem ? 'Update Color' : 'Save Color';
    saveColorModal.classList.add('show');
    saveColorNameInput.focus();
    saveColorNameInput.select();
}

function closeSaveColorModal() {
    saveColorModal.classList.remove('show');
    saveColorModal.dataset.editingId = '';
    saveColorModal.dataset.hex = '';
    closeSaveFolderDropdown();
}

if (saveColorClose) {
    saveColorClose.addEventListener('click', closeSaveColorModal);
}

if (saveColorModal) {
    saveColorModal.addEventListener('click', (e) => {
        if (e.target === saveColorModal) closeSaveColorModal();
    });
}

if (saveColorConfirm) {
    saveColorConfirm.addEventListener('click', () => {
        const name = saveColorNameInput.value.trim();
        const folderId = saveColorFolderSelect.value;
        const editingId = saveColorModal.dataset.editingId;
        const hex = editingId
            ? colorLibrary.colors.find(item => item.id === editingId)?.hex
            : saveColorModal.dataset.hex;

        if (!name || !folderId || !hex) return;

        const { r, g, b } = hexToRgb(hex);
        const autoName = getNearestColorName(r, g, b, true);
        const existing = colorLibrary.colors.find(item => item.id === editingId);
        const targetFolderId = folderId === UNFILED_FOLDER_ID ? UNFILED_FOLDER_ID : folderId;
        const duplicate = colorLibrary.colors.find(item => {
            if (item.id === editingId || item.hex !== hex) return false;
            return targetFolderId === UNFILED_FOLDER_ID ? isUnfiledColor(item) : item.folderId === targetFolderId;
        });

        if (duplicate) {
            duplicate.name = name;
            duplicate.folderId = targetFolderId;
            currentLibraryFolderId = targetFolderId === UNFILED_FOLDER_ID ? '' : targetFolderId;
            showToast('Updated saved color');
        } else if (existing) {
            existing.name = name;
            existing.folderId = targetFolderId;
            currentLibraryFolderId = targetFolderId === UNFILED_FOLDER_ID ? '' : targetFolderId;
            showToast('Updated saved color');
        } else {
            colorLibrary.colors.unshift({
                id: createLibraryId(),
                folderId: targetFolderId,
                name,
                hex,
                autoName,
                createdAt: new Date().toISOString()
            });
            currentLibraryFolderId = targetFolderId === UNFILED_FOLDER_ID ? '' : targetFolderId;
            showToast(`Saved ${name}`);
        }

        saveColorLibrary();
        renderLibrary();
        closeSaveColorModal();
    });
}

if (saveColorNameInput) {
    saveColorNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveColorConfirm.click();
        }
        if (e.key === 'Escape') {
            closeSaveColorModal();
        }
    });
}

function slugifyFilename(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'colors';
}

function getFolderExportFilename(folderName) {
    return `${slugifyFilename(folderName)}.md`;
}

function escapeMarkdownText(value) {
    return String(value || '')
        .replace(/\\/g, '\\\\')
        .replace(/^([#>*_`-])/gm, '\\$1')
        .replace(/\r?\n/g, ' ');
}

function formatExportDate(date = new Date()) {
    return date.toISOString().slice(0, 10);
}

async function exportLibraryFolderMarkdown(folderId) {
    const folder = colorLibrary.folders.find(item => item.id === folderId);
    if (!folder) {
        showToast('Folder not found');
        return false;
    }

    const colors = getFolderColors(folder.id);
    if (colors.length === 0) {
        showToast('Folder is empty');
        return false;
    }

    const lines = [
        `# ${folder.name}`,
        '',
        `Exported from Iris on ${formatExportDate()}.`,
        ''
    ];

    colors.forEach((item, index) => {
        const { r, g, b } = hexToRgb(item.hex);
        const { h, s, l } = hexToHsl(item.hex);
        lines.push(`## ${escapeMarkdownText(item.name)}`);
        lines.push('');
        lines.push(`Original name: ${escapeMarkdownText(item.autoName)}`);
        lines.push(`HEX: ${item.hex}`);
        lines.push(`RGB: rgb(${r}, ${g}, ${b})`);
        lines.push(`HSL: hsl(${h}, ${s}%, ${l}%)`);
        if (index < colors.length - 1) lines.push('');
    });

    lines.push('');
    return downloadText(getFolderExportFilename(folder.name), lines.join('\n'));
}

function getFullLibraryExportFilename() {
    return `iris-library-${formatExportDate()}.json`;
}

async function exportFullLibraryJson() {
    const data = {
        version: 1,
        exportedAt: new Date().toISOString(),
        library: normalizeColorLibrary(colorLibrary)
    };

    const didExport = await downloadText(
        getFullLibraryExportFilename(),
        JSON.stringify(data, null, 2),
        'application/json'
    );

    if (didExport) showToast('Exported library backup');
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

async function importFullLibraryJsonFile(file) {
    try {
        const text = await readFileAsText(file);
        const parsed = JSON.parse(text);
        const importedLibrary = parsed.library ? parsed.library : parsed;
        const normalized = normalizeColorLibrary(importedLibrary);

        if (normalized.folders.length === 0 && normalized.colors.length === 0) {
            showToast('No library data found');
            return;
        }

        openConfirmModal({
            title: 'Import Library',
            message: 'Replace the current library with this backup?',
            confirmText: 'Import',
            onConfirm: () => {
                colorLibrary = normalized;
                currentLibraryFolderId = normalized.folders[0]?.id || '';
                saveColorLibrary();
                renderLibraryFolders();
                renderLibrary();
                showToast('Imported library backup');
            }
        });
    } catch (err) {
        console.error('Library import failed:', err);
        showToast('Library import failed');
    }
}

function openLibraryImportPicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        if (file) importFullLibraryJsonFile(file);
    }, { once: true });
    input.click();
}

if (libraryFullExportBtn) {
    libraryFullExportBtn.addEventListener('click', exportFullLibraryJson);
}

if (libraryImportBtn) {
    libraryImportBtn.addEventListener('click', openLibraryImportPicker);
}

function renderGallery() {
    gallery.querySelectorAll('.swatch, .swatch-palette').forEach(el => el.remove());

    if (savedColors.length === 0) {
        galleryEmpty.style.display = '';
        galleryEmpty.innerHTML = '<p>History is empty.<br />Pick a color to get started!</p>';
        return;
    }

    galleryEmpty.style.display = 'none';
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

        const actions = document.createElement('div');
        actions.className = 'history-actions';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'library-icon-btn';
        saveBtn.textContent = 'Save';
        saveBtn.title = 'Save color to library';
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setCurrentColor(hex);
            openSaveColorModal(null, hex);
        });

        actions.appendChild(saveBtn);
        swatch.appendChild(actions);
        swatch.addEventListener('click', () => {
            setCurrentColor(hex);
            showToast(`Selected ${hex}`);
        });

        gallery.appendChild(swatch);
    });
}
clearBtn.addEventListener('click', () => {
    if (savedColors.length === 0) return;
    savedColors = [];
    saveColors();
    renderGallery();
    showToast('All colors cleared');
});
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        if (savedColors.length === 0) {
            showToast("Nothing to export");
            return;
        }
        downloadJson('iris-history.json', savedColors);
        showToast("Exported history");
    });
}
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
    palComplementary.appendChild(createHarmonicSwatch(currentColor));
    palAnalogous.appendChild(createHarmonicSwatch(currentColor));
    palTriadic.appendChild(createHarmonicSwatch(currentColor));
    palComplementary.appendChild(createHarmonicSwatch(hslToHex((h + 180) % 360, s, l)));
    palAnalogous.appendChild(createHarmonicSwatch(hslToHex((h + 30) % 360, s, l)));
    palAnalogous.appendChild(createHarmonicSwatch(hslToHex((h + 330) % 360, s, l))); // -30 is same as +330
    palTriadic.appendChild(createHarmonicSwatch(hslToHex((h + 120) % 360, s, l)));
    palTriadic.appendChild(createHarmonicSwatch(hslToHex((h + 240) % 360, s, l)));
}
function generateScale() {
    scaleContent.innerHTML = '';
    if (!currentColor) return;

    const { h, s } = hexToHsl(currentColor);
    const lightnessSteps = [95, 85, 75, 65, 50, 40, 30, 20, 10, 5];
    const labels = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    lightnessSteps.forEach((l, i) => {
        const hex = hslToHex(h, s, l);
        const { r, g, b } = hexToRgb(hex);
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

const COLOR_VISION_DEFICIENCY_MATRICES = {
    protanopia: [
        0.152286, 1.052583, -0.204868,
        0.114503, 0.786281, 0.099216,
        -0.003882, -0.048116, 1.051998
    ],
    deuteranopia: [
        0.367322, 0.860646, -0.227968,
        0.280085, 0.672501, 0.047413,
        -0.011820, 0.042940, 0.968881
    ],
    tritanopia: [
        1.255528, -0.076749, -0.178779,
        -0.078411, 0.930809, 0.147602,
        0.004733, 0.691367, 0.303900
    ]
};

function simulateColorBlindness(r, g, b, type) {
    const matrix = COLOR_VISION_DEFICIENCY_MATRICES[type];
    if (!matrix) return [r, g, b];

    const lr = srgbToLinearChannel(r);
    const lg = srgbToLinearChannel(g);
    const lb = srgbToLinearChannel(b);

    const sr = lr * matrix[0] + lg * matrix[1] + lb * matrix[2];
    const sg = lr * matrix[3] + lg * matrix[4] + lb * matrix[5];
    const sb = lr * matrix[6] + lg * matrix[7] + lb * matrix[8];

    return [
        linearToSrgbChannel(sr),
        linearToSrgbChannel(sg),
        linearToSrgbChannel(sb)
    ];
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
    accessColorCircle.style.background = currentColor;
    accessColorName.textContent = getNearestColorName(r, g, b, true);
    accessColorHex.textContent = currentColor;
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
    const pro = rgbArrToHex(simulateColorBlindness(r, g, b, 'protanopia'));
    const deu = rgbArrToHex(simulateColorBlindness(r, g, b, 'deuteranopia'));
    const tri = rgbArrToHex(simulateColorBlindness(r, g, b, 'tritanopia'));

    simulatorGrid.appendChild(createSimRow('Protanopia\n(Red-Blind)', currentColor, pro));
    simulatorGrid.appendChild(createSimRow('Deuteranopia\n(Green-Blind)', currentColor, deu));
    simulatorGrid.appendChild(createSimRow('Tritanopia\n(Blue-Blind)', currentColor, tri));
}
renderLibrary();
hydrateLibraryFromAppData();
renderGallery();
if (savedColors.length > 0) {
    setCurrentColor(savedColors[0]);
}
