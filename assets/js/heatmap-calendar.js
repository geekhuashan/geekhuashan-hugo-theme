/**
 * GitHub 风格贡献热力图
 * 纯 JavaScript 实现,无第三方依赖
 * 功能:展示近一年文章发布频率,支持悬停提示和点击查看详情
 */

(function() {
  'use strict';

  // 配置常量
  const CONFIG = {
    containerId: 'heatmap-container',
    dataId: 'heatmap-data',
    months: 12,
    cellSize: 12,
    cellGap: 2,
    colors: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
    weekdays: ['日', '一', '二', '三', '四', '五', '六']
  };

  /**
   * 初始化热力图
   */
  function initHeatmap() {
    const container = document.getElementById(CONFIG.containerId);

    if (!container) {
      console.debug('[Heatmap] 容器不存在,跳过初始化');
      return;
    }

    // 从全局变量获取数据
    if (!window.HEATMAP_DATA) {
      console.debug('[Heatmap] 数据不存在,跳过初始化');
      return;
    }

    try {
      // 使用全局变量中的数据
      const rawData = window.HEATMAP_DATA;
      if (!rawData || rawData.length === 0) {
        renderEmptyState(container);
        return;
      }

      // 生成日期范围
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - CONFIG.months);
      startDate.setHours(0, 0, 0, 0);

      // 准备数据映射
      const dataMap = createDataMap(rawData);

      // 渲染热力图
      renderHeatmap(container, dataMap, startDate, endDate);

    } catch (error) {
      console.error('[Heatmap] 初始化失败:', error);
      renderErrorState(container, error);
    }
  }

  /**
   * 创建日期到数据的映射
   */
  function createDataMap(rawData) {
    const map = new Map();
    rawData.forEach(item => {
      map.set(item.date, item);
    });
    return map;
  }

  /**
   * 渲染热力图主体
   */
  function renderHeatmap(container, dataMap, startDate, endDate) {
    // 计算需要显示的周数
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const weeks = Math.ceil(days / 7);

    // 创建容器
    const wrapper = document.createElement('div');
    wrapper.className = 'heatmap-wrapper';

    // 创建网格容器
    const grid = document.createElement('div');
    grid.className = 'heatmap-grid';
    grid.style.gridTemplateColumns = `repeat(${weeks}, ${CONFIG.cellSize}px)`;

    // 生成所有日期单元格
    const cells = [];
    let currentDate = new Date(startDate);

    // 从第一周的星期天开始
    const firstDayOfWeek = currentDate.getDay();
    currentDate.setDate(currentDate.getDate() - firstDayOfWeek);

    for (let i = 0; i < weeks * 7; i++) {
      const dateStr = formatDate(currentDate);
      const data = dataMap.get(dateStr);
      const isInRange = currentDate >= startDate && currentDate <= endDate;

      // 创建新的 Date 对象副本，避免引用同一个对象
      const cellDate = new Date(currentDate);
      const cell = createCell(cellDate, data, isInRange);
      cells.push(cell);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 按列排列(每列7天)
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < 7; day++) {
        const index = week * 7 + day;
        if (cells[index]) {
          grid.appendChild(cells[index]);
        }
      }
    }

    wrapper.appendChild(grid);

    // 添加图例
    const legend = createLegend();
    wrapper.appendChild(legend);

    // 清空容器并渲染
    container.innerHTML = '';
    container.appendChild(wrapper);
  }

  /**
   * 创建星期标签列
   */
  function createWeekdayLabels() {
    const labels = document.createElement('div');
    labels.className = 'heatmap-weekdays';

    // 只显示周一、周三、周五
    [1, 3, 5].forEach(day => {
      const label = document.createElement('div');
      label.className = 'heatmap-weekday';
      label.textContent = CONFIG.weekdays[day];
      label.style.height = `${CONFIG.cellSize}px`;
      label.style.lineHeight = `${CONFIG.cellSize}px`;

      // 添加占位符保持对齐
      if (day === 1) {
        labels.appendChild(createWeekdayPlaceholder());
      }
      labels.appendChild(label);
      if (day === 3) {
        labels.appendChild(createWeekdayPlaceholder());
      }
    });

    return labels;
  }

  /**
   * 创建星期标签占位符
   */
  function createWeekdayPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'heatmap-weekday-placeholder';
    placeholder.style.height = `${CONFIG.cellSize}px`;
    return placeholder;
  }

  /**
   * 创建单个日期单元格
   */
  function createCell(date, data, isInRange) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';

    if (!isInRange) {
      cell.classList.add('out-of-range');
      return cell;
    }

    const count = data ? data.count : 0;
    const level = getColorLevel(count);

    cell.style.backgroundColor = CONFIG.colors[level];
    cell.setAttribute('data-date', formatDate(date));
    cell.setAttribute('data-count', count);
    cell.setAttribute('data-level', level);

    // 添加提示信息
    if (data) {
      cell.setAttribute('data-titles', JSON.stringify(data.titles));
      cell.setAttribute('data-urls', JSON.stringify(data.urls));
    }

    // 设置 title 提示
    const dateStr = formatDateChinese(date);
    cell.title = data
      ? `${dateStr}\n${count} 篇文章\n${data.titles.slice(0, 3).join('\n')}`
      : `${dateStr}\n暂无文章`;

    // 添加事件监听
    cell.addEventListener('click', () => handleCellClick(date, data));
    cell.addEventListener('mouseenter', (e) => showTooltip(e, date, data));
    cell.addEventListener('mouseleave', hideTooltip);

    return cell;
  }

  /**
   * 根据文章数量计算颜色等级(0-4)
   */
  function getColorLevel(count) {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4; // 4+
  }

  /**
   * 创建图例
   */
  function createLegend() {
    const legend = document.createElement('div');
    legend.className = 'heatmap-legend';

    const label = document.createElement('span');
    label.className = 'heatmap-legend-label';
    label.textContent = '少';
    legend.appendChild(label);

    CONFIG.colors.forEach((color, index) => {
      const item = document.createElement('div');
      item.className = 'heatmap-legend-item';
      item.style.backgroundColor = color;
      item.title = index === 0 ? '0 篇' : index === 4 ? '4+ 篇' : `${index} 篇`;
      legend.appendChild(item);
    });

    const labelMore = document.createElement('span');
    labelMore.className = 'heatmap-legend-label';
    labelMore.textContent = '多';
    legend.appendChild(labelMore);

    return legend;
  }

  /**
   * 显示悬停提示
   */
  function showTooltip(event, date, data) {
    // 移除已存在的提示框
    hideTooltip();

    const tooltip = document.createElement('div');
    tooltip.className = 'heatmap-tooltip';
    tooltip.id = 'heatmap-tooltip';

    const dateStr = formatDateChinese(date);
    const count = data ? data.count : 0;

    let content = `<div class="tooltip-date">${dateStr}</div>`;
    content += `<div class="tooltip-count">${count} 篇文章</div>`;

    if (data && data.titles.length > 0) {
      content += '<div class="tooltip-titles">';
      data.titles.slice(0, 3).forEach(title => {
        content += `<div class="tooltip-title">• ${title}</div>`;
      });
      if (data.titles.length > 3) {
        content += `<div class="tooltip-more">还有 ${data.titles.length - 3} 篇...</div>`;
      }
      content += '</div>';
    }

    tooltip.innerHTML = content;
    document.body.appendChild(tooltip);

    // 定位提示框
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.top - tooltipRect.height - 8;

    // 边界检测
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
      top = rect.bottom + 8;
      tooltip.classList.add('below');
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  /**
   * 隐藏提示框
   */
  function hideTooltip() {
    const tooltip = document.getElementById('heatmap-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  /**
   * 处理单元格点击事件
   */
  function handleCellClick(date, data) {
    if (!data || data.titles.length === 0) return;

    // 创建并显示 Modal
    showModal(date, data);
  }

  /**
   * 显示文章列表 Modal
   */
  function showModal(date, data) {
    // 移除已存在的 Modal
    const existingModal = document.getElementById('heatmap-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'heatmap-modal';
    modal.id = 'heatmap-modal';

    const dateStr = formatDateChinese(date);
    let content = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>${dateStr} 发布的文章 (${data.count} 篇)</h3>
          <button class="modal-close" aria-label="关闭">×</button>
        </div>
        <div class="modal-body">
          <ul class="post-list">
    `;

    data.titles.forEach((title, index) => {
      const url = data.urls[index];
      content += `<li><a href="${url}">${title}</a></li>`;
    });

    content += `
          </ul>
        </div>
      </div>
    `;

    modal.innerHTML = content;
    document.body.appendChild(modal);

    // 添加关闭事件
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // ESC 键关闭
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // 防止背景滚动
    document.body.style.overflow = 'hidden';
  }

  /**
   * 关闭 Modal
   */
  function closeModal() {
    const modal = document.getElementById('heatmap-modal');
    if (modal) {
      modal.remove();
    }
    document.body.style.overflow = '';
  }

  /**
   * 渲染空状态
   */
  function renderEmptyState(container) {
    container.innerHTML = `
      <div class="heatmap-empty">
        <p>暂无发布记录</p>
      </div>
    `;
  }

  /**
   * 渲染错误状态
   */
  function renderErrorState(container, error) {
    container.innerHTML = `
      <div class="heatmap-error">
        <p>热力图加载失败: ${error.message}</p>
      </div>
    `;
  }

  /**
   * 格式化日期 (YYYY-MM-DD)
   */
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 格式化日期 (中文)
   */
  function formatDateChinese(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  }

  // 页面加载完成后初始化
  // 使用 setTimeout 确保数据脚本已加载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initHeatmap, 100);
    });
  } else {
    setTimeout(initHeatmap, 100);
  }

  // 暴露全局接口用于调试
  window.HeatmapCalendar = {
    init: initHeatmap,
    config: CONFIG
  };

})();
