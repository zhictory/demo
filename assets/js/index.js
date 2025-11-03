// 创建时钟元素并插入到body最前面
function createClock() {
  // 创建时钟容器
  const clockElement = document.createElement("div");
  clockElement.id = "clock";
  clockElement.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        font-size: 18px;
        z-index: 9999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;

  // 将时钟插入到body最前面
  document.body.insertBefore(clockElement, document.body.firstChild);

  // 更新时钟显示
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  }

  // 初始化显示并每秒更新
  updateClock();
  setInterval(updateClock, 1000);
}

// 页面加载完成后创建时钟
document.addEventListener("DOMContentLoaded", createClock);
