// 图片懒加载实现
document.addEventListener('DOMContentLoaded', function() {
    // 检查浏览器是否原生支持懒加载
    if ('loading' in HTMLImageElement.prototype) {
        // 浏览器支持懒加载
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            // 确保非关键图片有懒加载属性
            if (!img.hasAttribute('loading') && !img.classList.contains('critical')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    } else {
        // 浏览器不支持懒加载，加载polyfill
        // 注意：这是一个简化的版本，实际生产中可能需要更复杂的实现
        const images = document.querySelectorAll('img:not(.critical)');
        const config = {
            rootMargin: '50px 0px',
            threshold: 0.01
        };

        let observer = new IntersectionObserver(function(entries, self) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                    }
                    lazyImage.classList.remove('lazy');
                    self.unobserve(lazyImage);
                }
            });
        }, config);

        images.forEach(image => {
            observer.observe(image);
        });
    }
});