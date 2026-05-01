import React from 'react';

/**
 * 共用標題元件
 *
 * 此元件接受 `title` prop 並渲染為頁面標題。若之後需要在
 * 多個畫面重複使用標題樣式，可利用此元件統一管理。
 */
const ScreenTitle = ({ title }) => {
  return (
    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
      {title}
    </h2>
  );
};

export default ScreenTitle;