// 浏览器兼容性修复和检测脚本
document.addEventListener('DOMContentLoaded', function() {
    // 检测浏览器功能并添加特性类
    const html = document.documentElement;
    
    // 检查CSS Grid支持
    if (window.CSS && CSS.supports && CSS.supports('display', 'grid')) {
        html.classList.add('supports-grid');
    } else {
        html.classList.add('no-grid');
    }
    
    // 检查Flexbox支持
    if (CSS.supports && CSS.supports('display', 'flex')) {
        html.classList.add('supports-flex');
    } else {
        html.classList.add('no-flex');
    }
    
    // 检查粘性定位支持
    if (CSS.supports && (CSS.supports('position', 'sticky') || CSS.supports('position', '-webkit-sticky'))) {
        html.classList.add('supports-sticky');
    } else {
        html.classList.add('no-sticky');
    }
    
    // 检查浏览器
    const ua = navigator.userAgent;
    let browserClasses = [];
    
    if (/MSIE|Trident/.test(ua)) {
        browserClasses.push('is-ie');
        
        // IE特定修复
        const ieVersion = ua.indexOf('MSIE ') > -1 ? parseInt(ua.substring(ua.indexOf('MSIE ') + 5, ua.indexOf('.', ua.indexOf('MSIE '))), 10) : 11;
        browserClasses.push(`is-ie-${ieVersion}`);
    }
    
    if (/Edge\//.test(ua)) {
        browserClasses.push('is-edge');
    }
    
    if (/Firefox\//.test(ua)) {
        browserClasses.push('is-firefox');
    }
    
    if (/Chrome\//.test(ua) && !/Edge\//.test(ua)) {
        browserClasses.push('is-chrome');
    }
    
    if (/Safari\//.test(ua) && !/Chrome\//.test(ua) && !/Edge\//.test(ua)) {
        browserClasses.push('is-safari');
    }
    
    if (/iPhone|iPad|iPod/.test(ua)) {
        browserClasses.push('is-ios');
    }
    
    if (/Android/.test(ua)) {
        browserClasses.push('is-android');
    }
    
    // 把所有浏览器类添加到HTML元素
    html.classList.add(...browserClasses);
});