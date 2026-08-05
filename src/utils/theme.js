const STORAGE_KEY = 'anime_board_theme'

export function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'dark'
}

export function setTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme)
    document.documentElement.setAttribute('data-theme', theme)
}