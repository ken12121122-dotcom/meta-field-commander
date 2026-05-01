/**
 * 存檔系統
 *
 * 此模組負責將遊戲狀態保存到 localStorage，並於重新載入
 * 時還原。同時可提供重置功能。實作應依照 v1.1 規格。
 */

const STORAGE_KEY = 'yuanFieldCommanderSave';

/**
 * 從 localStorage 讀取遊戲狀態。
 * @returns {Object|null} 遊戲狀態或 null
 */
export function loadGame() {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('載入存檔失敗', err);
    return null;
  }
}

/**
 * 將遊戲狀態保存至 localStorage。
 * @param {Object} state - 遊戲狀態
 */
export function saveGame(state) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('保存存檔失敗', err);
  }
}

/**
 * 重置存檔。
 */
export function resetGame() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}