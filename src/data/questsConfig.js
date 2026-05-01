/**
 * 任務與經驗設定
 *
 * 定義遊戲中的任務列表，以及每個任務完成後的獎勵與成本。
 * 包含學習任務、治理任務、資安任務、投資任務等。可參照
 * v1.0 以後的任務資料結構進行填寫。
 */

export const quests = [
  // e.g. { id: 'learn_crypto', domain: 'learning', description: '學習密碼學 30 分鐘', rewards: { power: 3, ability: 5 } },
];

// 任務獎勵與成本可以根據場域分類進行更細致的定義
export const domainRewards = {
  // e.g. learning: { power: 0, ability: 1, security: 0 },
};

export const domainCosts = {
  // e.g. learning: { power: 1, ability: 0, security: 0 },
};