const STORAGE_KEY = 'anime_board_user_id'

export function getUserId() {
    let id = localStorage.getItem(STORAGE_KEY)
    if (!id) {
        id = 'user_' + Math.random().toString(36).slice(2, 9)
        localStorage.setItem(STORAGE_KEY, id)
    }
    return id
}