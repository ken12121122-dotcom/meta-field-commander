export const taskTypes = [
  "學習",
  "工作",
  "資安",
  "治理",
  "健身",
  "生活",
  "創作",
];

export const rewardMap = {
  學習: { 能力: 4, 自由: 1 },
  工作: { 資本: 3, 治理: 2 },
  資安: { 資安: 5, 治理: 1 },
  治理: { 治理: 4, 信任: 2 },
  健身: { 體力: 5, 自由: 1 },
  生活: { 體力: 2, 自由: 3 },
  創作: { 能力: 3, 信任: 1 },
};

export function getTaskReward(type) {
  return rewardMap[type] ?? {};
}
