/* ============================================
   代码块复制功能 - Simple Version
   用途: 替代原有的code-copy.js
   特点: 无MutationObserver,避免网页崩溃
   ============================================ */

(function() {
    'use strict';

    // 初始化函数 - 页面加载完成后执行一次
    function initCodeCopy() {
        // 查找两种类型的代码块:
        // 1. 有语法高亮的代码块 (.highlight 容器)
        // 2. 没有语法高亮的普通代码块 (直接的 pre 标签)

        // 处理有 .highlight 类的代码块
        const highlightBlocks = document.querySelectorAll('.highlight');
        highlightBlocks.forEach(function(highlightDiv) {
            // 防止重复添加按钮
            if (highlightDiv.querySelector('.copy-code-button')) {
                return;
            }

            // 查找代码内容
            const codeElement = highlightDiv.querySelector('pre code');
            if (!codeElement) {
                return;
            }

            // 创建并添加复制按钮
            addCopyButton(highlightDiv, codeElement);
        });

        // 处理没有 .highlight 类的普通 pre 标签
        const plainPreBlocks = document.querySelectorAll('pre:not(.highlight pre)');
        plainPreBlocks.forEach(function(preElement) {
            // 防止重复添加按钮
            if (preElement.querySelector('.copy-code-button')) {
                return;
            }

            // 如果 pre 已经在 .highlight 容器内，跳过
            if (preElement.closest('.highlight')) {
                return;
            }

            // 查找代码内容
            const codeElement = preElement.querySelector('code') || preElement;

            // 为 pre 创建一个包装容器（模拟 .highlight 结构）
            const wrapper = document.createElement('div');
            wrapper.className = 'highlight';
            preElement.parentNode.insertBefore(wrapper, preElement);
            wrapper.appendChild(preElement);

            // 创建并添加复制按钮
            addCopyButton(wrapper, codeElement);
        });
    }

    // 创建并添加复制按钮的辅助函数
    function addCopyButton(container, codeElement) {
        const button = document.createElement('button');
        button.className = 'copy-code-button';
        button.textContent = '📋 复制';
        button.setAttribute('aria-label', '复制代码');
        button.setAttribute('type', 'button');

        // 点击事件
        button.addEventListener('click', function(e) {
            e.preventDefault();
            copyCodeToClipboard(codeElement, button);
        });

        // 将按钮添加到容器
        container.appendChild(button);
    }

    // 复制代码到剪贴板
    function copyCodeToClipboard(codeElement, button) {
        let textToCopy = codeElement.textContent || codeElement.innerText;

        // 清理文本: 移除多余的空行
        textToCopy = textToCopy.trim();

        // 使用现代Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy)
                .then(function() {
                    showCopySuccess(button);
                })
                .catch(function(err) {
                    console.error('复制失败:', err);
                    fallbackCopy(textToCopy, button);
                });
        } else {
            // 降级方案
            fallbackCopy(textToCopy, button);
        }
    }

    // 降级复制方案 (兼容旧浏览器)
    function fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopySuccess(button);
            } else {
                console.error('降级复制失败');
            }
        } catch (err) {
            console.error('降级复制出错:', err);
        }

        document.body.removeChild(textArea);
    }

    // 显示复制成功反馈
    function showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = '✓ 已复制';
        button.classList.add('copied');

        // 2秒后恢复原状
        setTimeout(function() {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCodeCopy);
    } else {
        // DOM已经加载完成
        initCodeCopy();
    }

    // 如果需要支持动态加载的内容,可以暴露一个全局函数
    // 但避免使用MutationObserver
    window.reinitCodeCopy = initCodeCopy;

})();
