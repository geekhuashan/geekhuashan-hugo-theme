// 页面滚动效果
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    
    if (header) {
        // 检查初始滚动位置
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
        
        // 监听滚动事件
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});