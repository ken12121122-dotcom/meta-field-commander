# 元場域指揮官 – 正式開發專案

本專案是《元場域指揮官》遊戲的正式開發骨架，根據早期 Canvas 原型整理而來。

## 安裝與啟動

此專案使用 [Vite](https://vitejs.dev/) 做為開發伺服器與建置工具，並使用 React 18 為前端框架。以下步驟供開發代理使用：

1. 確認已安裝 Node.js (建議使用 LTS 版本)。
2. 安裝依賴套件：
   ```bash
   npm install
   ```
3. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

> **注意**：由於本專案在離線環境下建立，尚未安裝任何 npm 套件。開發代理需自行執行 `npm install` 以下載所需依賴。

## 專案結構

以下為此專案的預期資料夾與檔案結構：

```text
my-game/
├─ index.html           # 網頁入口
├─ package.json         # 套件設定與 scripts
├─ tailwind.config.js   # Tailwind CSS 設定
├─ postcss.config.js    # PostCSS 設定
├─ README.md            # 本檔案
└─ src/                 # 程式碼根目錄
   ├─ main.jsx          # React 進入點
   ├─ App.jsx           # 頁面容器
   ├─ components/       # 通用 React 元件
   ├─ screens/          # 畫面頁面元件
   ├─ data/             # 資料設定
   │   ├─ statsConfig.js
   │   ├─ fieldsConfig.js
   │   ├─ buildingsConfig.js
   │   ├─ bossConfig.js
   │   ├─ charactersConfig.js
   │   └─ questsConfig.js
   └─ logic/            # 遊戲邏輯層
       ├─ recommendationEngine.js
       ├─ combatEngine.js
       ├─ saveSystem.js
       └─ diagnostics.js
```

目前這些檔案大多僅包含框架與註解，待開發代理根據遊戲規格填入完整實作。

## 核心規格摘要

《元場域指揮官》是一款結合現實任務、資安治理與 AI 拆解的 RPG 模擬遊戲。遊戲循環包含：

1. **輸入現實任務** – 玩家輸入今日的工作、學習、生活任務。
2. **AI 任務拆解** – 系統將模糊任務拆成可執行步驟，形成任務包。
3. **完成任務與每日結算** – 完成步驟後可獲得能力值、資本等資源，結算每日成長。
4. **場域管理與建築升級** – 玩家可以投入資本升級各場域建築，提升資安上限與產出效率。
5. **角色劇情與 Boss 戰** – 根據任務行為觸發角色事件，對抗壓力源頭，例如主管追問、資安稽核等。
6. **任務推薦與指引** – 系統根據玩家狀態推薦下一步最佳行動。

完整遊戲規格、拆檔規劃、交接提示詞以及 PRD 已包含於先前規格文件，可由對應資料模組載入。

## 下一步

本專案僅提供開發骨架，實際邏輯請參考 v1.4–v2.0 的規格說明，並按分批任務 (v1.9) 逐步拆解 `/data` 資料並實作邏輯層。
