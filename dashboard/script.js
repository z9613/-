// ----------------------------------------------------
// 1. 初始化 Supabase (请替换你的 API KEY)
// ----------------------------------------------------
const SUPABASE_URL = 'https://kcejohayjyfhpyzommmf.supabase.co';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = typeof supabase !== 'undefined' ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ----------------------------------------------------
// 2. 权限与安全
// ----------------------------------------------------
const CORRECT_PASSWORD = "11";
function safeBtoa(str) { return btoa(unescape(encodeURIComponent(str))); }

function checkAuthorization() {
    const token = sessionStorage.getItem('workbench_auth_token');
    if (token !== safeBtoa(CORRECT_PASSWORD)) {
        const inlineLock = document.getElementById('inline-lock-screen');
        if (inlineLock) inlineLock.classList.remove('hidden');
    }
}

// ----------------------------------------------------
// 3. 数据持久化 (LocalStorage -> Supabase)
// ----------------------------------------------------
// 备忘录自动保存
const memoTextarea = document.getElementById('memo-textarea');
const memoStatus = document.getElementById('memo-status');

memoTextarea.addEventListener('input', async (e) => {
    const text = e.target.value;
    memoStatus.textContent = "同步中...";
    
    // 如果你有 Supabase，执行云端保存
    if (supabase) {
        await supabase.from('memos').upsert({ id: 1, content: text });
    }
    // 同时存本地备用
    localStorage.setItem('apple_dashboard_memo', text);
    memoStatus.textContent = "已保存";
});

// ----------------------------------------------------
// 4. UI 交互逻辑 (背景、时钟、Dock)
// ----------------------------------------------------
const wallpaperPresets = {
    sequoia: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    aurora: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80'
};

let currentSettings = JSON.parse(localStorage.getItem('apple_dashboard_settings')) || { blur: 20, opacity: 20, wallpaper: 'sequoia' };

function applySettings() {
    document.documentElement.style.setProperty('--glass-blur', `${currentSettings.blur}px`);
    document.documentElement.style.setProperty('--glass-opacity', currentSettings.opacity / 100);
    document.body.style.backgroundImage = `url('${wallpaperPresets[currentSettings.wallpaper]}')`;
}

// 初始化
window.onload = () => {
    checkAuthorization();
    applySettings();
    lucide.createIcons();
};
