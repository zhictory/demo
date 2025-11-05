// DOM元素获取
const demoToggles = document.querySelectorAll('.demo-toggle');
const demoContents = document.querySelectorAll('.demo-content');

// Badge控制元素
const badgeTypeSelect = document.getElementById('badge-type');
const badgeColorSelect = document.getElementById('badge-color');
const badgePosHSelect = document.getElementById('badge-posh');
const badgePosVSelect = document.getElementById('badge-posv');
const badgeTextInput = document.getElementById('badge-text');
const productItems = document.querySelectorAll('.product-item');

// 当前活跃的演示
let currentDemo = 'accordion-bem';

// 初始化所有功能
function init() {
    console.log('初始化 Data Attributes vs BEM 组件...');
    
    initDemoToggles();
    initBadgeControls();
    initCodeCopy();
    initScrollAnimations();
    
    // 显示欢迎消息
    setTimeout(() => {
        showNotification('欢迎使用 CMS组件定制场景演示！', 'success');
    }, 1000);
    
    console.log('组件初始化完成');
}

// 演示切换功能
function initDemoToggles() {
    demoToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const target = toggle.getAttribute('data-target');
            switchDemo(target);
        });
    });
}

function switchDemo(targetDemo) {
    // 更新按钮状态
    demoToggles.forEach(toggle => {
        toggle.classList.remove('active');
        if (toggle.getAttribute('data-target') === targetDemo) {
            toggle.classList.add('active');
        }
    });
    
    // 更新演示内容
    demoContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === targetDemo) {
            content.classList.add('active');
        }
    });
    
    currentDemo = targetDemo;
    console.log(`切换到演示: ${targetDemo}`);
    
    showNotification(`切换到 ${targetDemo.includes('bem') ? 'BEM' : 'Data Attributes'} 方式`, 'info');
}

// Badge控制功能
function initBadgeControls() {
    [badgeTypeSelect, badgeColorSelect, badgePosHSelect, badgePosVSelect].forEach(select => {
        select.addEventListener('change', updateBadgeDemo);
    });
    
    badgeTextInput.addEventListener('input', updateBadgeDemo);
    
    // 为第一个产品项目添加示例样式
    updateBadgeDemo();
}

function updateBadgeDemo() {
    const type = badgeTypeSelect.value;
    const color = badgeColorSelect.value;
    const posH = badgePosHSelect.value;
    const posV = badgePosVSelect.value;
    const text = badgeTextInput.value || 'NEW';
    
    // 更新第一个产品项目
    const firstProduct = productItems[0];
    if (firstProduct) {
        firstProduct.setAttribute('data-text', text);
        firstProduct.setAttribute('data-text-type', `${color} ${type} ${posV} ${posH}`);
    }
    
    // 更新示例HTML
    updateExampleHTML(type, color, posH, posV, text);
    
    console.log('更新Badge演示:', { type, color, posH, posV, text });
}

function updateExampleHTML(type, color, posH, posV, text) {
    // 更新BEM示例
    const bemButton = document.querySelector('.comparison-card__example .c-txt');
    if (bemButton) {
        bemButton.className = `c-txt c-txt--${type} c-txt--color-${color} c-txt--posv-${posV} c-txt--posh-${posH}`;
        bemButton.setAttribute('data-text', text);
        bemButton.textContent = '示例产品';
    }
    
    // 更新Data Attributes示例
    const dataButton = document.querySelector('.comparison-card__example button[data-text-type]');
    if (dataButton) {
        dataButton.setAttribute('data-text-type', `${color} ${type} ${posV} ${posH}`);
        dataButton.setAttribute('data-text', text);
        dataButton.textContent = '示例产品';
    }
}

// 代码复制功能
function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(block => {
        // 添加复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.textContent = '复制';
        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
        `;
        
        // 包装代码块
        const wrapper = block.parentNode;
        if (!wrapper.style.position) {
            wrapper.style.position = 'relative';
        }
        wrapper.appendChild(copyButton);
        
        // 复制功能
        copyButton.addEventListener('click', async () => {
            try {
                const text = block.textContent;
                await navigator.clipboard.writeText(text);
                copyButton.textContent = '已复制!';
                copyButton.style.background = 'rgba(40, 167, 69, 0.8)';
                
                setTimeout(() => {
                    copyButton.textContent = '复制';
                    copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 2000);
                
                showNotification('代码已复制到剪贴板', 'success');
            } catch (err) {
                showNotification('复制失败，请手动选择代码', 'error');
            }
        });
        
        // 悬停效果
        copyButton.addEventListener('mouseenter', () => {
            copyButton.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        copyButton.addEventListener('mouseleave', () => {
            if (copyButton.textContent === '复制') {
                copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // 为所有需要动画的元素添加观察
    const animatedElements = document.querySelectorAll('.background__content, .comparison-card, .css-comparison, .interactive-demo, .badge-selector, .advantage-card, .summary');
    animatedElements.forEach(el => {
        el.classList.add('animated');
        observer.observe(el);
    });
}

// 通知系统
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // 样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-size: 14px;
        font-weight: 500;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 动画进入
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationColor(type) {
    switch (type) {
        case 'success':
            return '#28a745';
        case 'error':
            return '#dc3545';
        case 'warning':
            return '#ffc107';
        case 'info':
        default:
            return '#007bff';
    }
}

// 键盘导航支持
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // 使用数字键快速切换演示
        if (e.key === '1') {
            switchDemo('accordion-bem');
        } else if (e.key === '2') {
            switchDemo('accordion-data');
        }
        
        // 使用左右箭头键切换演示
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            if (currentDemo === 'accordion-bem') {
                switchDemo('accordion-data');
            } else {
                switchDemo('accordion-bem');
            }
        }
    });
}

// Accordion项目交互
function initAccordionInteractions() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        item.addEventListener('click', function() {
            // 添加点击效果
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // 获取图标类型
            let iconType = '';
            if (this.hasAttribute('data-icon')) {
                iconType = this.getAttribute('data-icon');
            } else if (this.classList.contains('accordion-item--icon-down')) {
                iconType = 'down-arrow';
            } else if (this.classList.contains('accordion-item--icon-right')) {
                iconType = 'right-arrow';
            } else if (this.classList.contains('accordion-item--icon-plus')) {
                iconType = 'plus';
            }
            
            showNotification(`点击了图标: ${iconType}`, 'info');
        });
    });
}

// 产品项目交互
function initProductInteractions() {
    productItems.forEach(item => {
        item.addEventListener('click', function() {
            // 添加点击效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // 获取徽章信息
            const text = this.getAttribute('data-text') || '';
            const types = this.getAttribute('data-text-type') || '';
            
            showNotification(`产品: ${this.textContent.trim()} | 徽章: ${text} (${types})`, 'info');
        });
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 响应式处理
function initResponsiveFeatures() {
    const handleResize = debounce(() => {
        const isMobile = window.innerWidth <= 768;
        
        // 在移动设备上调整布局
        if (isMobile) {
            // 调整卡片布局
            const comparisonCards = document.querySelectorAll('.comparison-card');
            comparisonCards.forEach(card => {
                card.style.marginBottom = '20px';
            });
            
            // 调整演示按钮
            const demoButtons = document.querySelectorAll('.demo-toggle');
            demoButtons.forEach(button => {
                button.style.width = '100%';
                button.style.maxWidth = '200px';
            });
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
    handleResize();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// 页面加载完成后添加其他功能
document.addEventListener('DOMContentLoaded', () => {
    initKeyboardNavigation();
    initAccordionInteractions();
    initProductInteractions();
    initResponsiveFeatures();
});

// 导出功能供外部使用
window.CMSComponentDemo = {
    switchDemo,
    showNotification,
    updateBadgeDemo,
    currentDemo: () => currentDemo
};

// 添加一些调试信息
console.log('CMS组件定制演示已加载');
console.log('快捷键: 1=切换到BEM, 2=切换到Data Attributes, ←/→=切换演示');
