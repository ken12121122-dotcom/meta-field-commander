import React from 'react';

/**
 * App 元件 – 遊戲入口容器
 *
 * 目前此元件僅顯示歡迎畫面以及導覽提示。請開發代理根據
 * v1.0–v2.0 規格及拆檔計畫，將 Canvas 原型拆成各個獨立
 * 畫面與元件後，導入於此。建議使用 React Router 處理路由。
 */
function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">元場域指揮官</h1>
      <p className="text-gray-600 mb-8 max-w-prose text-center">
        歡迎來到正式開發專案骨架。請參考 README 中的說明安裝依賴後，
        按照拆檔規劃逐步將遊戲原型代碼導入。此頁面僅為佔位符。
      </p>
      <div className="space-x-4">
        <button className="px-4 py-2 rounded-md bg-indigo-600 text-white shadow hover:bg-indigo-500" disabled>
          開始遊戲
        </button>
        <button className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 shadow" disabled>
          查看文件
        </button>
      </div>
    </div>
  );
}

export default App;