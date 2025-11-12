// 移动端导航菜单交互
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.nav');
    const menu = document.getElementById('menu');

    if (!nav || !menu) {
        return;
    }

    let menuToggle = nav.querySelector('.menu-toggle');

    if (!menuToggle) {
        menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.setAttribute('type', 'button');
        menuToggle.setAttribute('aria-label', '切换导航菜单');
        menuToggle.setAttribute('aria-controls', 'menu');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = `
            <span class="hamburger">
                <span class="line"></span>
                <span class="line"></span>
                <span class="line"></span>
            </span>
        `;
        nav.insertBefore(menuToggle, menu);
    }

    // 创建独立的遮罩层元素（完全透明）
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 240px;
        bottom: 0;
        background: transparent;
        z-index: 999;
        display: none;
        pointer-events: auto;
    `;
    document.body.appendChild(overlay);

    const closeMenu = () => {
        menu.classList.remove('show');
        menuToggle.classList.remove('active');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
        menu.classList.add('show');
        menuToggle.classList.add('active');
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        menuToggle.setAttribute('aria-expanded', 'true');
    };

    menuToggle.addEventListener('click', function () {
        if (menu.classList.contains('show')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // 键盘辅助支持
    menuToggle.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            menu.classList.contains('show') ? closeMenu() : openMenu();
        }
    });

    // 点击菜单项时允许正常导航
    const menuItems = menu.querySelectorAll('a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // 不阻止默认导航行为，让链接正常跳转
            // 移动端立即关闭菜单（移除延迟以避免干扰导航）
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    // Esc 键关闭菜单
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menu.classList.contains('show')) {
            closeMenu();
        }
    });

    // 窗口大小变化时处理
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // 点击遮罩层关闭菜单
    overlay.addEventListener('click', closeMenu);
});
