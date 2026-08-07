// app.js — App Shell + 路由 + 全部视图 + 弹窗 + 交互 (单文件 SPA)
// App Shell 只渲染一次（侧边栏/顶栏），仅 #view 内容随 hash 路由切换
(function () {
  'use strict';

  // ============ 内联 SVG 图标库 (Lucide 风格，无 emoji、无 CDN) ============
  const I = {
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    'map-pin': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>',
    'clipboard-list': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    'layout-dashboard': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1-5h16l1 5"/><path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M9 21v-6h6v6"/></svg>',
    'user-check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>',
    'hard-hat': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a8 8 0 0 1 16 0v3"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.9" y1="4.9" x2="19.1" y2="19.1"/></svg>',
    'check-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    'chevron-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    unlink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.84 12.25l1.72-1.71a4 4 0 0 0-5.66-5.66l-1.71 1.72"/><path d="M5.16 11.75l-1.72 1.71a4 4 0 0 0 5.66 5.66l1.71-1.72"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
    smartphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    qrcode: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14h1v1h-1zM14 20h1v1h-1zM20 20h1v1h-1z"/></svg>',
  };

  // ============ 导航配置（冻结，所有页面一致） ============
  const NAV = [
    { title: 'G端作业管理', icon: 'shield', items: [
      { label: '首页', icon: 'home', route: '#/' },
      { label: '作业区域', icon: 'map-pin', route: '#/areas' },
      { label: '企业管理', icon: 'building', route: '#/enterprises' },
      { label: '作业管理', icon: 'clipboard-list', route: '#/tasks' },
    ]},
    { title: '企业端作业管理', icon: 'briefcase', items: [
      { label: '企业首页', icon: 'layout-dashboard', route: '#/zone/home' },
      { label: '门店管理', icon: 'store', route: '#/zone/stores' },
      { label: '安管员管理', icon: 'user-check', route: '#/zone/officers' },
      { label: '企业作业管理', icon: 'clipboard-list', route: '#/zone/tasks' },
    ]},
    { title: '小程序端安管员', icon: 'smartphone', items: [
      { label: '安管员首页', icon: 'home', route: '#/officer/mini' },
      { label: '作业列表', icon: 'clipboard-list', route: '#/officer/mini/detail' },
    ]},
    { title: '小程序端作业人员', icon: 'smartphone', items: [
      { label: '小程序首页', icon: 'home', route: '#/worker/mini' },
      { label: '作业列表', icon: 'clipboard-list', route: '#/worker/mini/detail' },
      { label: '作业详情', icon: 'file-text', route: '#/worker/mini/work-info' },
    ]},
  ];

  // ============ 路由表 ============
  const ROUTES = {
    '#/': { view: viewHome, group: 0, crumb: ['G端作业管理', '首页'] },
    '#/areas': { view: viewAreas, group: 0, crumb: ['G端作业管理', '作业区域'] },
    '#/enterprises': { view: viewEnterprises, group: 0, crumb: ['G端作业管理', '企业管理'] },
    '#/tasks': { view: viewTasks, group: 0, crumb: ['G端作业管理', '作业管理'] },
    '#/zone/home': { view: viewZoneHome, group: 1, crumb: ['企业端作业管理', '企业首页'] },
    '#/zone/stores': { view: viewStores, group: 1, crumb: ['企业端作业管理', '门店管理'] },
    '#/zone/officers': { view: viewOfficers, group: 1, crumb: ['企业端作业管理', '安管员管理'] },
    '#/zone/tasks': { view: viewZoneTasks, group: 1, crumb: ['企业端作业管理', '企业作业管理'] },
    '#/officer/mini': { view: viewOfficerMini, group: 3, crumb: ['小程序端安管员', '小程序首页'] },
    '#/officer/mini/detail': { view: viewOfficerMiniDetail, group: 3, crumb: ['小程序端安管员', '作业列表'] },
    '#/officer/mini/work-detail': { view: viewOfficerMiniWorkDetail, group: 3, crumb: ['小程序端安管员', '作业详情'] },
    '#/officer/mini/area-work-detail': { view: viewOfficerMiniAreaWorkDetail, group: 3, crumb: ['小程序端安管员', '作业详情'] },
    '#/worker/mini': { view: viewWorkerMini, group: 4, crumb: ['小程序端作业人员', '小程序首页'] },
    '#/worker/mini/detail': { view: viewWorkerMiniDetail, group: 4, crumb: ['小程序端作业人员', '作业列表'] },
    '#/worker/mini/work-detail': { view: viewWorkerMiniWorkDetail, group: 4, crumb: ['小程序端作业人员', '作业详情'] },
    '#/worker/mini/area-work-detail': { view: viewWorkerMiniAreaWorkDetail, group: 4, crumb: ['小程序端作业人员', '作业详情'] },
    '#/worker/mini/work-info': { view: viewWorkerMiniWorkInfo, group: 4, crumb: ['小程序端作业人员', '作业详情'] },
  };

  // ============ 工具函数 ============
  const $ = (sel, root = document) => root.querySelector(sel);
  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name) => I[name] || '';

  function toast(msg, type = 'success') {
    const wrap = $('#toasts');
    const t = h(`<div class="toast ${type}">${icon(type === 'success' ? 'check-circle' : type === 'error' ? 'alert' : 'bell')}<span>${esc(msg)}</span></div>`);
    wrap.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 2200);
  }

  function confirmDialog(message, onOk) {
    const node = h(`<div class="overlay confirm"><div class="modal"><div class="modal-head"><span class="mt">提示</span><span class="close">${icon('x')}</span></div><div class="modal-body">${icon('alert')}<span>${esc(message)}</span></div><div class="modal-foot"><button class="btn">取消</button><button class="btn btn-primary">确定</button></div></div></div>`);
    document.body.appendChild(node);
    const close = () => node.remove();
    node.querySelector('.close').onclick = close;
    node.querySelectorAll('.btn')[0].onclick = close;
    node.querySelectorAll('.btn')[1].onclick = () => { close(); onOk && onOk(); };
    node.addEventListener('click', (e) => { if (e.target === node) close(); });
  }

  function openModal(title, bodyHtml, footHtml, wide) {
    const node = h(`<div class="overlay"><div class="modal ${wide ? 'wide' : ''}"><div class="modal-head"><span class="mt">${esc(title)}</span><span class="close">${icon('x')}</span></div><div class="modal-body">${bodyHtml}</div>${footHtml ? `<div class="modal-foot">${footHtml}</div>` : ''}</div></div>`);
    document.body.appendChild(node);
    const close = () => node.remove();
    node.querySelector('.close').onclick = close;
    node.addEventListener('click', (e) => { if (e.target === node) close(); });
    return { node, close };
  }

  // 状态标签
  function statusTag(status) {
    const map = { '启用': 'success', '进行中': 'success', '禁用': 'danger', '已完成': 'info', '待审核': 'warning', '通过': 'success', '未通过': 'danger', '未核查': 'info', '待开始': 'info', '已拒绝': 'danger', '已结束': 'info' };
    const cls = map[status] || 'info';
    return `<span class="tag tag-${cls}">${esc(status)}</span>`;
  }
  // 作业类型标签
  function typeTag(type) {
    const colors = { '动火作业': '#F56C6C', '高处作业': '#E6A23C', '临时用电': '#409EFF' };
    const c = colors[type] || '#909399';
    return `<span><span class="type-dot" style="background:${c}"></span>${esc(type)}</span>`;
  }

  // 通用分页表格渲染
  function renderTable({ columns, rows, page, pageSize, onAction, emptyText = '暂无数据' }) {
    const total = rows.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const cur = Math.min(page, pages);
    const pageRows = rows.slice((cur - 1) * pageSize, cur * pageSize);
    const ths = columns.map((c) => `<th>${c.titleHtml != null ? c.titleHtml : esc(c.title)}</th>`).join('');
    let trs;
    if (!pageRows.length) {
      trs = `<tr><td colspan="${columns.length}" class="empty">${emptyText}</td></tr>`;
    } else {
      trs = pageRows.map((r) => {
        const tds = columns.map((c) => {
          let v = c.render ? c.render(r) : esc(r[c.key]);
          return `<td>${v}</td>`;
        }).join('');
        return `<tr data-id="${r.id}">${tds}</tr>`;
      }).join('');
    }
    // 分页
    let pagerHtml = '';
    if (total > 0) {
      const btns = [];
      btns.push(`<span class="pg-total">共 ${total} 条</span>`);
      btns.push(`<button class="pg-btn ${cur === 1 ? 'disabled' : ''}" data-pg="prev">${icon('chevron')}</button>`);
      const range = [];
      for (let i = 1; i <= pages; i++) range.push(i);
      range.forEach((i) => btns.push(`<button class="pg-btn ${i === cur ? 'active' : ''}" data-pg="${i}">${i}</button>`));
      btns.push(`<button class="pg-btn ${cur === pages ? 'disabled' : ''}" data-pg="next">${icon('chevron')}</button>`);
      pagerHtml = `<div class="pager">${btns.join('')}</div>`;
    }
    const node = h(`<div><div class="table-wrap"><table class="tbl"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>${pagerHtml}</div>`);
    // 行内操作
    node.querySelectorAll('[data-act]').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const tr = btn.closest('tr');
        const id = Number(tr.dataset.id);
        const act = btn.dataset.act;
        onAction && onAction(act, id, r => r.id === id ? pageRows.find(x => x.id === id) : null);
      };
    });
    return { node, goto: (p) => { const np = p === 'prev' ? cur - 1 : p === 'next' ? cur + 1 : Number(p); return np; } };
  }

  // 柱状图（内联 SVG）
  function barChart(data) {
    const W = 560, H = 280, pad = 40, bw = 80, gap = 60;
    const max = Math.max(1, ...data.map((d) => d.count));
    const baseY = H - pad;
    const totalW = pad * 2 + data.length * (bw + gap) - gap;
    let bars = '';
    data.forEach((d, i) => {
      const bh = (d.count / max) * (H - pad * 2);
      const x = pad + i * (bw + gap);
      const y = baseY - bh;
      bars += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="4" fill="#409EFF"><title>${d.type}: ${d.count}</title></rect>`;
      bars += `<text x="${x + bw / 2}" y="${y - 8}" text-anchor="middle" font-size="14" font-weight="600" fill="#303133">${d.count}</text>`;
      bars += `<text x="${x + bw / 2}" y="${baseY + 22}" text-anchor="middle" font-size="13" fill="#606266">${d.type}</text>`;
    });
    // y 轴刻度
    let yAxis = '';
    for (let k = 0; k <= max; k++) {
      const y = baseY - (k / max) * (H - pad * 2);
      yAxis += `<line x1="${pad - 6}" y1="${y}" x2="${totalW}" y2="${y}" stroke="#ebeef5" stroke-dasharray="3 3"/>`;
      yAxis += `<text x="${pad - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#909399">${k}</text>`;
    }
    return `<svg class="bar-chart" viewBox="0 0 ${totalW + 20} ${H}" preserveAspectRatio="xMidYMid meet"><line x1="${pad}" y1="${baseY}" x2="${totalW}" y2="${baseY}" stroke="#dcdfe6"/>${yAxis}${bars}</svg>`;
  }

  // 仪表盘视图（G端/企业端/安管员 复用）
  function dashboardView(scope) {
    const view = $('#view');
    view.innerHTML = `<div class="loading">加载中…</div>`;
    API.dashboardStats({ scope }).then((res) => {
      const d = res.data;
      const cols = scope === 'g' ? '' : 'cols-2';
      const cards = d.cards.map((c, i) => `
        <div class="stat-card" style="animation-delay:${i * 60}ms">
          ${scope === 'g' ? `<span class="pin-num pin-abs"><span>${i + 1}</span></span>` : ''}
          <div class="stat-icon" style="background:${c.color}">${icon(c.icon)}</div>
          <div class="stat-body"><div class="label">${esc(c.label)}</div><div class="value">${c.value}</div></div>
        </div>`).join('');
      const descPanel = scope === 'g' ? `
        <div class="card desc-panel">
          <div class="card-title">指标说明</div>
          <ul>
            <li><b>1·区域数量：</b>数据来源于作业区域绘制的区域数量总计；</li>
            <li><b>2·企业数量：</b>企业管理数据总计；</li>
            <li><b>3·作业数量：</b>作业管理数据总计；</li>
            <li><b>4·进行中的作业：</b>作业管理所有数据状态为进行中的总计；</li>
            <li><b>5·作业按类型统计：</b>所有作业数量按作业类型进行统计。</li>
          </ul>
        </div>` : '';
      const enterpriseDesc = scope === 'enterprise' ? `
        <div class="card desc-panel desc-panel-sm">
          <div class="card-title">字段说明</div>
          <ul>
            <li><b>1·作业数量：</b>企业作业管理中所有审核通过的任务；</li>
            <li><b>2·进行中的任务：</b>企业作业中状态为【进行中】的任务；</li>
            <li><b>3·作业按类型统计：</b>目前只有动火作业，以后可能会拓展。</li>
          </ul>
          <div style="margin-top:8px;padding-top:8px;border-top:1px dashed #FFE58F;font-size:12px;color:#909399">企业端登录账号为管理总台已认证且被打上特种作业标记的企业账号。</div>
        </div>` : '';
      view.innerHTML = `
        <div class="stat-grid ${cols}">${cards}</div>
        <div class="chart-card">
          <div class="chart-title">${scope === 'g' ? '<span class="pin-num pin-inline"><span>5</span></span>' : ''}${scope === 'officer' ? '审核的作业按类型统计' : '作业按类型统计'}</div>
          ${barChart(d.types)}
        </div>
        ${descPanel}
        ${enterpriseDesc}`;
    });
  }
  function viewHome() { dashboardView('g'); }
  function viewZoneHome() { dashboardView('enterprise'); }

  // ============ 小程序端安管员 ============
  function viewOfficerMini() {
    const view = $('#view');
    view.innerHTML = `
      <div class="mini-office-wrap">
        <div class="mini-phone">
          <div class="mini-statusbar">
            <span>15:17</span>
            <span class="sb-right">
              <span class="sig"></span>
              <span class="wifi"></span>
              <span class="batt">88</span>
            </span>
          </div>
          <div class="mini-banner">
            <div class="mini-vconsol">vConsole<span class="vc-preview">PREVIEW</span></div>
            <div class="mini-header">
              <div class="mini-avatar">
                <div class="avatar-cat">🐱</div>
                <div class="avatar-bag">🧰</div>
              </div>
              <div class="mini-info">
                <div class="mini-name">李浩</div>
              </div>
            </div>
            <div class="mini-icons">
              <span>💬<span class="badge-dot">7</span></span>
              <span>🎧</span>
            </div>
          </div>
          <div class="mini-stats">
            <div class="ms-item"><div class="ms-num">0</div><div class="ms-label">发单余额</div></div>
            <div class="ms-item"><div class="ms-num">3799.00</div><div class="ms-label">费用发放</div></div>
            <div class="ms-item"><div class="ms-num">12499.00</div><div class="ms-label">结算收入</div></div>
            <div class="ms-item"><div class="ms-num">0</div><div class="ms-label">冻结金额</div></div>
          </div>
          <div class="mini-wallet">
            <div class="wallet-top">
              <div class="wt-left"><b>可提现(元)</b><span class="wt-safe">安全保障中</span></div>
              <div class="wt-right">进入钱包 ›</div>
            </div>
            <div class="wallet-big">18498.00</div>
            <div class="wallet-foot">
              <span>汇总收益 ¥ 3799</span>
              <span>汇总收益为您的结算收入加邀请收益</span>
            </div>
          </div>
          <div class="mini-card mini-card-auth">
            <div class="mc-row">
              <div class="mc-left">
                <div class="mc-title">实名认证</div>
                <div class="mc-sub">认证后可参加培训、考试、接发任务</div>
              </div>
              <div class="mc-auth-badge">已认证</div>
            </div>
          </div>
          <div class="mini-card">
            <div class="mc-title" style="margin-bottom:14px">常用功能</div>
            <div class="mc-grid">
              <div class="mc-item"><div class="mc-icon">📋</div><div class="mc-label">我的任务</div></div>
              <div class="mc-item"><div class="mc-icon">📑</div><div class="mc-label">订单中心</div></div>
              <div class="mc-item"><div class="mc-icon">🏢</div><div class="mc-label">我的企业</div></div>
              <div class="mc-item"><div class="mc-icon">📜</div><div class="mc-label">我的证书</div></div>
              <div class="mc-item"><div class="mc-icon">💬</div><div class="mc-label">意见反馈</div></div>
              <div class="mc-item"><div class="mc-icon">🔏</div><div class="mc-label">隐私协议</div></div>
              <div class="mc-item"><div class="mc-icon">🤝</div><div class="mc-label">保险理赔</div></div>
              <div class="mc-item"><div class="mc-icon">✅</div><div class="mc-label">任务签到</div></div>
              <div class="mc-item" onclick="location.hash='#/officer/mini/detail'" style="cursor:pointer"><div class="mc-icon">👷</div><div class="mc-label">安管员</div></div>
            </div>
          </div>
          <div class="mini-footer">
            <div>客服电话 400-158-7877  工作时间 9:00-18:00</div>
            <div><a>ICP证书号 浙B2-20240405</a>   <a>营业执照</a></div>
            <div><a>人力资源服务许可证</a>   <a>广播电视节目制作经营许可证</a></div>
            <div>杭州市钱塘区人社局监督电话：0571-89537370</div>
            <div>中央网信办(国家互联网信息办公室)违法和不良举报中心 <a>12377</a></div>
          </div>
          <div class="mini-tabbar">
            <div class="tab-item">
              <div class="tab-ico">🏠</div>
              <div class="tab-txt">首页</div>
            </div>
            <div class="tab-item">
              <div class="tab-ico">⭐</div>
              <div class="tab-txt">任务大厅</div>
            </div>
            <div class="tab-item active">
              <div class="tab-ico">👤</div>
              <div class="tab-txt">我的<span class="tab-badge">7</span></div>
            </div>
          </div>
        </div>
        <div class="side-desc-panel mini-side-panel">
          <div class="sdp-title">账号权限和作用</div>
          <ul>
            <li><b>1·账号来源：</b>当前登录账号为企业端或G端手动添加的账号，该账号可直接登录小程序，不需认证，默认进入作业列表页面。</li>
            <li><b>2·身份与权限：</b>该账号是安管员身份，在小程序主要功能是审核作业人员的作业提交、核查现场数据、拍照取证等。</li>
            <li><b>3·二维码与作业区域：</b>安管员二维码包含企业名称和作业区域，G端未绑定企业时作业区域为空，作业信息仅存在于企业端。</li>
            <li><b>4·后台管理：</b>安管员的新增、修改、删除均在企业端「安管员管理」页面操作，删除需谨慎，会影响历史审核记录。</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ============ 小程序端作业人员 - 首页 ============
  function viewWorkerMini() {
    const view = $('#view');
    view.innerHTML = `
      <div class="mini-office-wrap">
        <div class="mini-phone">
          <div class="mini-statusbar">
            <span>15:17</span>
            <span class="sb-right">
              <span class="sig"></span>
              <span class="wifi"></span>
              <span class="batt">88</span>
            </span>
          </div>
          <div class="mini-banner">
            <div class="mini-vconsol">vConsole<span class="vc-preview">PREVIEW</span></div>
            <div class="mini-header">
              <div class="mini-avatar">
                <div class="avatar-cat">🐱</div>
                <div class="avatar-bag">🧰</div>
              </div>
              <div class="mini-info">
                <div class="mini-name">李浩</div>
                <div class="mini-auth">
                  <span>🛡️</span>
                  <span>任务实名已认证</span>
                </div>
              </div>
              <div class="mini-switch">
                <span>👤</span>
                <span>切换身份</span>
              </div>
            </div>
            <div class="mini-icons">
              <span>💬<span class="badge-dot">7</span></span>
              <span>🎧</span>
            </div>
          </div>
          <div class="mini-stats">
            <div class="ms-item"><div class="ms-num">0</div><div class="ms-label">发单余额</div></div>
            <div class="ms-item"><div class="ms-num">3799.00</div><div class="ms-label">费用发放</div></div>
            <div class="ms-item"><div class="ms-num">12499.00</div><div class="ms-label">结算收入</div></div>
            <div class="ms-item"><div class="ms-num">0</div><div class="ms-label">冻结金额</div></div>
          </div>
          <div class="mini-wallet">
            <div class="wallet-top">
              <div class="wt-left"><b>可提现(元)</b><span class="wt-safe">安全保障中</span></div>
              <div class="wt-right">进入钱包 ›</div>
            </div>
            <div class="wallet-big">18498.00</div>
            <div class="wallet-foot">
              <span>汇总收益 ¥ 3799</span>
              <span>汇总收益为您的结算收入加邀请收益</span>
            </div>
          </div>
          <div class="mini-card mini-card-auth">
            <div class="mc-row">
              <div class="mc-left">
                <div class="mc-title">实名认证</div>
                <div class="mc-sub">认证后可参加培训、考试、接发任务</div>
              </div>
              <div class="mc-auth-badge">已认证</div>
            </div>
          </div>
          <div class="mini-card">
            <div class="mc-title" style="margin-bottom:14px">常用功能</div>
            <div class="mc-grid">
              <div class="mc-item"><div class="mc-icon">📋</div><div class="mc-label">我的任务</div></div>
              <div class="mc-item"><div class="mc-icon">📑</div><div class="mc-label">订单中心</div></div>
              <div class="mc-item"><div class="mc-icon">🏢</div><div class="mc-label">我的企业</div></div>
              <div class="mc-item"><div class="mc-icon">📜</div><div class="mc-label">我的证书</div></div>
              <div class="mc-item"><div class="mc-icon">💬</div><div class="mc-label">意见反馈</div></div>
              <div class="mc-item"><div class="mc-icon">🔏</div><div class="mc-label">隐私协议</div></div>
              <div class="mc-item"><div class="mc-icon">🤝</div><div class="mc-label">保险理赔</div></div>
              <div class="mc-item"><div class="mc-icon">✅</div><div class="mc-label">任务签到</div></div>
              <div class="mc-item" onclick="location.hash='#/worker/mini/detail'" style="cursor:pointer"><div class="mc-icon">👷</div><div class="mc-label">特种作业</div></div>
            </div>
          </div>
          <div class="mini-footer">
            <div>客服电话 400-158-7877  工作时间 9:00-18:00</div>
            <div><a>ICP证书号 浙B2-20240405</a>   <a>营业执照</a></div>
            <div><a>人力资源服务许可证</a>   <a>广播电视节目制作经营许可证</a></div>
            <div>杭州市钱塘区人社局监督电话：0571-89537370</div>
            <div>中央网信办(国家互联网信息办公室)违法和不良举报中心 <a>12377</a></div>
          </div>
          <div class="mini-tabbar">
            <div class="tab-item">
              <div class="tab-ico">🏠</div>
              <div class="tab-txt">首页</div>
            </div>
            <div class="tab-item">
              <div class="tab-ico">⭐</div>
              <div class="tab-txt">任务大厅</div>
            </div>
            <div class="tab-item active">
              <div class="tab-ico">👤</div>
              <div class="tab-txt">我的<span class="tab-badge">7</span></div>
            </div>
          </div>
        </div>
        <div class="side-desc-panel mini-side-panel">
          <div class="sdp-title">账号说明</div>
          <ul>
            <li>当前登录账号为个人账号，如果作业人员扫描二维码后进入小程序是新号，则进行注册认证流程，完成该流程后自动跳转至作业详情，已认证的账号扫码登录后直接跳作业详情，如果首次填写未提交就返回则不产生任何记录，需要重新扫码进入。</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ============ 小程序端安管员 - 安管员详情（两个tab） ============
  // 小程序端安管员 - 待审核作业数据
  const MINI_PENDING_WORKS = [
    {
      id: 1, name: '未来科技城A栋动火作业', type: '动火作业', enterprise: '中建八局第一建设有限公司',
      store: 'A栋3楼装修门店', constructionUnit: '杭州鑫达建筑工程有限公司', address: '杭州市余杭区未来科技城A栋3楼',
      leader: '张伟', leaderPhone: '13800138000',
      startTime: '2026-08-06 09:00', endTime: '2026-08-06 18:00', status: '待审核', fireCert: '已上传',
      workers: [
        { name: '张伟', phone: '13800138000', idCard: '3301**********0011', task: '动火焊接', needCert: '是', hasCert: '是', certImg: 'assets/cert-fire-1.jpg' },
        { name: '李明', phone: '13800138001', idCard: '3301**********0022', task: '现场监护', needCert: '否', hasCert: '否', certImg: '' },
      ],
      audit: [
        { time: '2026-08-06 08:50', name: '张伟', content: '动火浓度检测合格,火焰清理到位,现场防护措施已布置', photos: 3, videos: 1, status: '待审核', reason: '', fireTicket: '动火票编号:DH20260806001' },
        { time: '2026-08-06 14:30', name: '张伟', content: '午后复测浓度合格,作业状态良好', photos: 2, videos: 0, status: '已拒绝', reason: '现场监护人员临时脱岗,安全防护措施未持续到位', fireTicket: '动火票编号:DH20260806001' },
      ],
      verify: [
        { time: '2026-08-06 10:00', name: '赵安管', phone: '13800138001', area: 'A区商业广场', photos: 2, videos: 1, status: '未通过', reason: '现场动火点附近易燃物清理不彻底', content: '需清理动火点5米范围内所有易燃物' },
        { time: '2026-08-06 15:00', name: '赵安管', phone: '13800138001', area: 'A区商业广场', photos: 1, videos: 0, status: '通过', reason: '', content: '整改后复核通过,现场安全状态良好' },
      ],
    },
    {
      id: 2, name: '紫荆花路B座高处作业', type: '高处作业', enterprise: '浙江华东工程建设有限公司',
      store: 'B座外墙施工门店', constructionUnit: '浙江宏盛建设有限公司', address: '杭州市西湖区紫荆花路88号B座',
      leader: '李强', leaderPhone: '13900139000',
      startTime: '2026-08-07 08:30', endTime: '2026-08-07 17:00', status: '待审核', fireCert: '未上传',
      workers: [
        { name: '李强', phone: '13900139000', idCard: '3301**********0033', task: '高空安装', needCert: '是', hasCert: '是', certImg: 'assets/cert-photo-1.jpg' },
      ],
      audit: [
        { time: '2026-08-07 08:20', name: '李强', content: '安全带、安全帽佩戴齐全,脚手架搭建合格', photos: 2, videos: 1, status: '待审核', reason: '', fireTicket: '—' },
      ],
      verify: [
        { time: '2026-08-07 09:00', name: '孙安管', phone: '13900139002', area: 'B座外墙施工区域', photos: 3, videos: 1, status: '通过', reason: '', content: '安全带系挂规范,脚手架验收合格' },
      ],
    },
    {
      id: 3, name: '半山路厂区临时用电作业', type: '临时用电作业', enterprise: '中铁建工集团有限公司',
      store: '厂区配电改造门店', constructionUnit: '杭州万通机电安装有限公司', address: '杭州市拱墅区半山路122号厂区',
      leader: '王磊', leaderPhone: '13700137000',
      startTime: '2026-08-08 14:00', endTime: '2026-08-08 20:00', status: '待审核', fireCert: '未上传',
      workers: [
        { name: '王磊', phone: '13700137000', idCard: '3301**********0044', task: '电路布线', needCert: '是', hasCert: '是', certImg: 'assets/cert-photo-2.jpg' },
        { name: '赵刚', phone: '13700137001', idCard: '3301**********0055', task: '辅助作业', needCert: '否', hasCert: '否', certImg: '' },
      ],
      audit: [
        { time: '2026-08-08 13:50', name: '王磊', content: '漏电保护器检测合格,绝缘电阻测试达标', photos: 2, videos: 0, status: '待审核', reason: '', fireTicket: '—' },
        { time: '2026-08-08 17:00', name: '王磊', content: '布线完成,通电测试正常', photos: 3, videos: 1, status: '已拒绝', reason: '通电测试时发现部分线路接线不规范,存在安全隐患', fireTicket: '—' },
      ],
      verify: [
        { time: '2026-08-08 15:00', name: '吴安管', phone: '13700137003', area: '厂区配电房区域', photos: 2, videos: 0, status: '未通过', reason: '配电箱接地不规范', content: '需重新做接地处理,确保用电安全' },
        { time: '2026-08-08 18:00', name: '吴安管', phone: '13700137003', area: '厂区配电房区域', photos: 1, videos: 1, status: '未通过', reason: '部分线路接线不规范', content: '需重新整理接线,确保绝缘包裹到位' },
      ],
    },
  ];

  // 小程序端安管员 - 区域作业数据（状态：待开始/进行中/已完成/已拒绝/已结束）
  const MINI_AREA_WORKS = [
    {
      id: 1, name: '未来科技城A栋动火作业', type: '动火作业', enterprise: '中建八局第一建设有限公司',
      store: 'A栋3楼装修门店', constructionUnit: '杭州鑫达建筑工程有限公司', address: '杭州市余杭区未来科技城A栋3楼',
      leader: '张伟', leaderPhone: '13800138000',
      startTime: '2026-08-06 09:00', endTime: '2026-08-06 18:00', status: '待开始', fireCert: '已上传',
      workers: [
        { name: '张伟', phone: '13800138000', idCard: '3301**********0011', task: '动火焊接', needCert: '是', hasCert: '是', certImg: 'assets/cert-fire-1.jpg' },
        { name: '李明', phone: '13800138001', idCard: '3301**********0022', task: '现场监护', needCert: '否', hasCert: '否', certImg: '' },
      ],
      audit: [
        { time: '2026-08-06 08:50', name: '张伟', content: '动火前检查,现场防护措施已布置', photos: 3, videos: 1, status: '通过', reason: '', fireTicket: '动火票编号:DH20260806001' },
      ],
      verify: [
        { time: '2026-08-06 09:30', name: '赵安管', phone: '13800138001', area: 'A栋3楼装修区域', photos: 2, videos: 1, status: '通过', reason: '', content: '现场防护到位,动火票据齐全' },
      ],
      reason: '',
    },
    {
      id: 2, name: '紫荆花路B座高处作业', type: '高处作业', enterprise: '浙江华东工程建设有限公司',
      store: 'B座外墙施工门店', constructionUnit: '浙江宏盛建设有限公司', address: '杭州市西湖区紫荆花路88号B座',
      leader: '李强', leaderPhone: '13900139000',
      startTime: '2026-08-07 08:30', endTime: '2026-08-07 17:00', status: '进行中', fireCert: '未上传',
      workers: [
        { name: '李强', phone: '13900139000', idCard: '3301**********0033', task: '高空安装', needCert: '是', hasCert: '是', certImg: 'assets/cert-photo-1.jpg' },
      ],
      audit: [
        { time: '2026-08-07 08:20', name: '李强', content: '安全带、安全帽佩戴齐全,脚手架搭建合格', photos: 2, videos: 1, status: '通过', reason: '', fireTicket: '—' },
        { time: '2026-08-07 12:30', name: '李强', content: '午后安全复查,作业状态正常', photos: 1, videos: 0, status: '已拒绝', reason: '复查时发现安全带挂钩松动,存在高空坠落风险', fireTicket: '—' },
      ],
      verify: [
        { time: '2026-08-07 09:00', name: '孙安管', phone: '13900139002', area: 'B座外墙施工区域', photos: 3, videos: 1, status: '通过', reason: '', content: '安全带系挂规范,脚手架验收合格' },
        { time: '2026-08-07 13:00', name: '孙安管', phone: '13900139002', area: 'B座外墙施工区域', photos: 2, videos: 0, status: '未通过', reason: '安全带挂钩松动', content: '需重新紧固安全带挂钩,确保安全' },
      ],
      reason: '',
    },
    {
      id: 3, name: '半山路厂区临时用电作业', type: '临时用电作业', enterprise: '中铁建工集团有限公司',
      store: '厂区配电改造门店', constructionUnit: '杭州万通机电安装有限公司', address: '杭州市拱墅区半山路122号厂区',
      leader: '王磊', leaderPhone: '13700137000',
      startTime: '2026-08-04 14:00', endTime: '2026-08-05 20:00', status: '已完成', fireCert: '未上传',
      workers: [
        { name: '王磊', phone: '13700137000', idCard: '3301**********0044', task: '电路布线', needCert: '是', hasCert: '是', certImg: 'assets/cert-photo-2.jpg' },
        { name: '赵刚', phone: '13700137001', idCard: '3301**********0055', task: '辅助作业', needCert: '否', hasCert: '否', certImg: '' },
      ],
      audit: [
        { time: '2026-08-04 13:50', name: '王磊', content: '漏电保护器检测合格,绝缘电阻测试达标', photos: 2, videos: 0, status: '通过', reason: '', fireTicket: '—' },
        { time: '2026-08-05 19:00', name: '王磊', content: '布线完成,通电测试正常,作业完工', photos: 2, videos: 0, status: '已拒绝', reason: '完工核查时发现部分线缆未做标识,不符合规范要求', fireTicket: '—' },
      ],
      verify: [
        { time: '2026-08-04 15:00', name: '吴安管', phone: '13700137003', area: '厂区配电房区域', photos: 2, videos: 0, status: '通过', reason: '', content: '配电改造区域安全防护到位' },
      ],
      reason: '',
    },
    {
      id: 4, name: '钱江新城动火切割作业', type: '动火作业', enterprise: '中建八局第一建设有限公司',
      store: '钱江新城B栋施工门店', constructionUnit: '浙江东方建设工程有限公司', address: '杭州市江干区钱江新城B栋',
      leader: '陈刚', leaderPhone: '13600136000',
      startTime: '2026-08-03 09:00', endTime: '2026-08-03 18:00', status: '已拒绝', fireCert: '已上传',
      workers: [
        { name: '陈刚', phone: '13600136000', idCard: '3301**********0066', task: '动火切割', needCert: '是', hasCert: '否', certImg: '' },
      ],
      audit: [
        { time: '2026-08-03 08:30', name: '陈刚', content: '动火前现场环境检查,防护措施初步到位', photos: 2, videos: 0, status: '通过', reason: '', fireTicket: '动火票编号:DH20260803001' },
        { time: '2026-08-03 08:40', name: '陈刚', content: '动火前资质审核,施工人员未持有效动火作业证', photos: 1, videos: 0, status: '已拒绝', reason: '施工人员未持有效动火作业证,不具备动火作业资格', fireTicket: '动火票编号:DH20260803001' },
      ],
      verify: [
        { time: '2026-08-03 08:45', name: '郑安管', phone: '13600136004', area: '钱江新城B栋施工区域', photos: 2, videos: 0, status: '未通过', reason: '施工人员未持有效动火作业证', content: '立即停止作业,待人员资质审核通过后方可恢复' },
      ],
      reason: '施工人员未持有效动火作业证',
    },
    {
      id: 5, name: '西湖文化广场临时用电作业', type: '临时用电作业', enterprise: '浙江华东工程建设有限公司',
      store: '文化广场配电房门店', constructionUnit: '杭州光华电力工程有限公司', address: '杭州市下城区西湖文化广场',
      leader: '刘洋', leaderPhone: '13500135000',
      startTime: '2026-07-28 08:00', endTime: '2026-07-30 18:00', status: '已结束', fireCert: '未上传',
      workers: [
        { name: '刘洋', phone: '13500135000', idCard: '3301**********0077', task: '配电改造', needCert: '是', hasCert: '是', certImg: 'assets/cert-photo-3.jpg' },
        { name: '周强', phone: '13500135001', idCard: '3301**********0088', task: '辅助作业', needCert: '否', hasCert: '否', certImg: '' },
      ],
      audit: [
        { time: '2026-07-28 07:50', name: '刘洋', content: '配电改造前安全检查,符合开工条件', photos: 2, videos: 1, status: '通过', reason: '', fireTicket: '—' },
        { time: '2026-07-30 17:30', name: '刘洋', content: '改造完工验收,设备运行正常', photos: 3, videos: 1, status: '已拒绝', reason: '验收时发现接地线连接不牢固,需整改后复检', fireTicket: '—' },
      ],
      verify: [
        { time: '2026-07-28 09:00', name: '冯安管', phone: '13500135005', area: '文化广场配电房区域', photos: 2, videos: 1, status: '通过', reason: '', content: '配电改造区域隔离到位,警示标志齐全' },
        { time: '2026-07-30 16:00', name: '冯安管', phone: '13500135005', area: '文化广场配电房区域', photos: 3, videos: 0, status: '通过', reason: '', content: '接地线整改完成,复检通过' },
      ],
      reason: '',
    },
  ];

  // 小程序端安管员 - 区域作业状态样式映射
  function miniAreaStatusClass(status) {
    return { '待开始': 'todo', '进行中': 'doing', '已完成': 'done', '已拒绝': 'rejected', '已结束': 'ended' }[status] || 'todo';
  }

  // 小程序端安管员 - 审核记录卡片渲染（支持多条，第一条展开其余折叠）
  const MINI_PHOTO_POOL = ['assets/work-hot-1.jpg', 'assets/work-hot-2.jpg', 'assets/work-hot-3.jpg', 'assets/work-high-1.jpg', 'assets/work-electric-1.jpg'];
  function renderMiniAuditCards(audits, workId, showFireTicket = true) {
    if (!audits || audits.length === 0) return '<div class="mini-rec-empty">暂无审核记录</div>';
    return audits.map((a, i) => {
      const isOpen = i === 0;
      const statusIcon = a.status === '已拒绝' ? '✕' : a.status === '通过' ? '✓' : '●';
      const statusCls = a.status === '已拒绝' ? 'rejected' : a.status === '通过' ? 'passed' : 'pending';
      const photoHtml = a.photos > 0 ? Array.from({ length: a.photos }).map((_, pi) => {
        const src = MINI_PHOTO_POOL[(workId * 3 + i + pi) % MINI_PHOTO_POOL.length];
        return `<div class="mini-photo-item" style="background-image:url('${src}')" onclick="window.open('${src}','_blank')"></div>`;
      }).join('') : '';
      const videoHtml = a.videos > 0 ? `<div class="mini-video-item">${icon('play')}<span>点击播放</span></div>` : '';
      const reasonHtml = a.status === '已拒绝' && a.reason ? `<div class="mini-li-row"><span class="mini-li-label">拒绝原因</span><span class="mini-li-val">${esc(a.reason)}</span></div>` : '';
      const fireTicketHtml = (showFireTicket && a.fireTicket) ? `<div class="mini-li-row"><span class="mini-li-label">动火票</span><span class="mini-li-val"><span class="fire-ticket-tag">${esc(a.fireTicket)}</span></span></div>` : '';
      return `<div class="mini-rec-card ${isOpen ? 'open' : ''}" data-idx="${i}">
        <div class="mini-rec-head">
          <div class="mini-rec-summary">
            <span class="mini-rec-idx">${i + 1}</span>
            <span class="mini-rec-name">${esc(a.name)}</span>
            <span class="mini-rec-time">${esc(a.time)}</span>
            <span class="mini-rec-status ${statusCls}">${statusIcon} ${esc(a.status)}</span>
          </div>
          <span class="mini-rec-arrow">${icon('chevron-down')}</span>
        </div>
        <div class="mini-rec-body">
          <div class="mini-li-row"><span class="mini-li-label">检测记录</span><span class="mini-li-val">${esc(a.content)}</span></div>
          ${fireTicketHtml}
          ${reasonHtml}
          ${a.photos > 0 ? `<div class="mini-sub-title">现场图片 <span class="mini-count">${a.photos}张</span></div><div class="mini-photo-grid">${photoHtml}</div>` : ''}
          ${a.videos > 0 ? `<div class="mini-sub-title">现场视频 <span class="mini-count">${a.videos}个</span></div>${videoHtml}` : ''}
        </div>
      </div>`;
    }).join('');
  }
  function bindMiniAuditToggle(container) {
    container.querySelectorAll('.mini-rec-card .mini-rec-head').forEach(head => {
      head.addEventListener('click', () => {
        head.parentElement.classList.toggle('open');
      });
    });
  }

  function bindMiniAddVerify(container) {
    const btn = container.querySelector('[data-add-verify]');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const body = `<div class="mini-worker-form">
        <div class="mini-form-row"><label class="mini-li-label">作业区域<span class="mini-req">*</span></label><input class="mini-form-input" type="text" id="vf-area" placeholder="请输入作业区域"></div>
        <div class="mini-form-row"><label class="mini-li-label">现场图片</label>
          <div class="mini-upload-box" id="vf-img-upload">点击上传图片</div>
        </div>
        <div class="mini-form-row"><label class="mini-li-label">现场视频</label>
          <div class="mini-upload-box" id="vf-video-upload">点击上传视频</div>
        </div>
      </div>`;
      const foot = `<button class="btn" id="vf-cancel" style="flex:1">取消</button><button class="btn btn-primary" id="vf-ok" style="flex:1">提交</button>`;
      const { node, close } = openModal('现场核查上传', body, foot);
      let imgUploaded = false;
      let videoUploaded = false;
      node.querySelector('#vf-img-upload').addEventListener('click', () => {
        imgUploaded = true;
        node.querySelector('#vf-img-upload').textContent = '已上传 ✓';
      });
      node.querySelector('#vf-video-upload').addEventListener('click', () => {
        videoUploaded = true;
        node.querySelector('#vf-video-upload').textContent = '已上传 ✓';
      });
      node.querySelector('#vf-cancel').onclick = close;
      node.querySelector('#vf-ok').onclick = () => {
        const area = node.querySelector('#vf-area').value.trim();
        if (!area) { toast('请输入作业区域', 'error'); return; }
        close();
        toast('核查记录已上传，AI判定中...', 'success');
      };
    });
  }

  function renderMiniVerifyCards(verifies, workId) {
    if (!verifies || verifies.length === 0) return '<div class="mini-rec-empty">暂无核查记录</div>';
    return verifies.map((v, i) => {
      const isOpen = i === 0;
      const statusIcon = v.status === '未通过' ? '✕' : '✓';
      const statusCls = v.status === '未通过' ? 'rejected' : 'passed';
      const photoHtml = v.photos > 0 ? Array.from({ length: v.photos }).map((_, pi) => {
        const src = MINI_PHOTO_POOL[(workId * 3 + i + pi + 5) % MINI_PHOTO_POOL.length];
        return `<div class="mini-photo-item" style="background-image:url('${src}')" onclick="window.open('${src}','_blank')"></div>`;
      }).join('') : '';
      const videoHtml = v.videos > 0 ? `<div class="mini-video-item">${icon('play')}<span>点击播放</span></div>` : '';
      const reasonHtml = v.status === '未通过' && v.reason ? `<div class="mini-li-row"><span class="mini-li-label">不通过原因</span><span class="mini-li-val">${esc(v.reason)}</span></div>` : '';
      return `<div class="mini-rec-card ${isOpen ? 'open' : ''}" data-idx="${i}">
        <div class="mini-rec-head">
          <div class="mini-rec-summary">
            <span class="mini-rec-idx">${i + 1}</span>
            <span class="mini-rec-name">${esc(v.name)}</span>
            <span class="mini-rec-time">${esc(v.time)}</span>
            <span class="mini-rec-status ${statusCls}">${statusIcon} ${esc(v.status)}</span>
          </div>
          <span class="mini-rec-arrow">${icon('chevron-down')}</span>
        </div>
        <div class="mini-rec-body">
          <div class="mini-li-row"><span class="mini-li-label">作业区域</span><span class="mini-li-val">${esc(v.area)}</span></div>
          <div class="mini-li-row"><span class="mini-li-label">检测记录</span><span class="mini-li-val">${esc(v.content)}</span></div>
          ${reasonHtml}
          ${v.photos > 0 ? `<div class="mini-sub-title">现场图片 <span class="mini-count">${v.photos}张</span></div><div class="mini-photo-grid">${photoHtml}</div>` : ''}
          ${v.videos > 0 ? `<div class="mini-sub-title">现场视频 <span class="mini-count">${v.videos}个</span></div>${videoHtml}` : ''}
        </div>
      </div>`;
    }).join('');
  }

  function viewOfficerMiniDetail() {
    const view = $('#view');
    let areaFilter = '全部';
    const renderAreaItems = () => {
      const list = areaFilter === '全部' ? MINI_AREA_WORKS : MINI_AREA_WORKS.filter((w) => w.status === areaFilter);
      const html = list.map((w) => `
        <div class="mini-list-item" data-id="${w.id}">
          <div class="mini-li-top"><span class="mini-li-type">${esc(w.type)}</span><span class="mini-li-status ${miniAreaStatusClass(w.status)}">${esc(w.status)}</span></div>
          <div class="mini-li-row"><span class="mini-li-label">作业名称</span><span class="mini-li-val">${esc(w.name)}</span></div>
          <div class="mini-li-row"><span class="mini-li-label">企业名称</span><span class="mini-li-val">${esc(w.enterprise)}</span></div>
          <div class="mini-li-row"><span class="mini-li-label">施工单位</span><span class="mini-li-val">${esc(w.constructionUnit || '')}</span></div>
          <div class="mini-li-row"><span class="mini-li-label">施工地址</span><span class="mini-li-val">${esc(w.address)}</span></div>
          <div class="mini-li-row"><span class="mini-li-label">施工负责人</span><span class="mini-li-val">${esc(w.leader)}</span></div>
          <div class="mini-li-row"><span class="mini-li-label">负责人手机号</span><span class="mini-li-val">${esc(w.leaderPhone)}</span></div>
          <div class="mini-li-row"><span class="mini-li-label">作业开始时间</span><span class="mini-li-val">${esc(w.startTime)}</span></div>
          <div class="mini-li-row"><span class="mini-li-label">作业结束时间</span><span class="mini-li-val">${esc(w.endTime)}</span></div>
          <div class="mini-li-arrow">${icon('chevron')}</div>
        </div>`).join('') || '<div class="mini-rec-empty">暂无数据</div>';
      const listBox = view.querySelector('#officerTab1 .mini-list');
      if (listBox) listBox.innerHTML = html;
      view.querySelectorAll('#officerTab1 .mini-list-item').forEach(item => {
        item.addEventListener('click', () => {
          location.hash = '#/officer/mini/area-work-detail?id=' + item.dataset.id;
        });
      });
    };
    const items = MINI_PENDING_WORKS.map((w) => `
      <div class="mini-list-item" data-id="${w.id}">
        <div class="mini-li-top"><span class="mini-li-type">${esc(w.type)}</span><span class="mini-li-status pending">待审核</span></div>
        <div class="mini-li-row"><span class="mini-li-label">作业名称</span><span class="mini-li-val">${esc(w.name)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">企业名称</span><span class="mini-li-val">${esc(w.enterprise)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">施工单位</span><span class="mini-li-val">${esc(w.constructionUnit || '')}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">施工地址</span><span class="mini-li-val">${esc(w.address)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">施工负责人</span><span class="mini-li-val">${esc(w.leader)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">负责人手机号</span><span class="mini-li-val">${esc(w.leaderPhone)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">作业开始时间</span><span class="mini-li-val">${esc(w.startTime)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">作业结束时间</span><span class="mini-li-val">${esc(w.endTime)}</span></div>
        <div class="mini-li-arrow">${icon('chevron')}</div>
      </div>`).join('');
    view.innerHTML = `
      <div class="mini-office-wrap">
        <div class="mini-phone">
          <div class="mini-statusbar">
            <span>15:17</span>
            <span class="sb-right">
              <span class="sig"></span>
              <span class="wifi"></span>
              <span class="batt">88</span>
            </span>
          </div>
          <div class="mini-navheader">
            <span class="back-btn" onclick="location.hash='#/officer/mini'">‹</span>
            <span class="nav-title">安管员</span>
            <span></span>
          </div>
          <div class="mini-tabs">
            <div class="tab active" data-idx="0">待审核作业</div>
            <div class="tab" data-idx="1">区域作业</div>
          </div>
          <div class="mini-tab-content" id="officerTab0">
            <div class="mini-list">${items}</div>
          </div>
          <div class="mini-tab-content hidden" id="officerTab1">
            <div class="mini-filter-bar">
              <select class="mini-filter-select" id="areaStatusFilter">
                <option value="全部">全部状态</option>
                <option value="待开始">待开始</option>
                <option value="进行中">进行中</option>
                <option value="已完成">已完成</option>
                <option value="已拒绝">已拒绝</option>
                <option value="已结束">已结束</option>
              </select>
            </div>
            <div class="mini-list"></div>
          </div>
        </div>
        <div class="side-desc-panel mini-side-panel">
          <div class="sdp-title">作业列表说明</div>
          <ul>
            <li><b>1·待审核作业：</b>展示所有扫描该企业二维码上传的作业信息。状态全部为待审核，根据上传时间倒序。</li>
            <li><b>2·区域作业：</b>展示所有已审核的作业信息，该列表数据状态包括：待开始、进行中、已完成、已结束、已拒绝。该列表排序规则为：进行中、待开始、已完成、已拒绝、已结束，然后每个状态里又按上传时间倒序。</li>
            <li><b>3·作业区域：</b>支持状态搜索。</li>
          </ul>
        </div>
      </div>
    `;
    view.querySelectorAll('.mini-tabs .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = parseInt(tab.dataset.idx);
        view.querySelectorAll('.mini-tabs .tab').forEach((t,i) => t.classList.toggle('active', i === idx));
        view.querySelector('#officerTab0').classList.toggle('hidden', idx !== 0);
        view.querySelector('#officerTab1').classList.toggle('hidden', idx !== 1);
      });
    });
    view.querySelectorAll('#officerTab0 .mini-list-item').forEach(item => {
      item.addEventListener('click', () => {
        location.hash = '#/officer/mini/work-detail?id=' + item.dataset.id;
      });
    });
    const filterSel = view.querySelector('#areaStatusFilter');
    filterSel.value = areaFilter;
    filterSel.addEventListener('change', () => {
      areaFilter = filterSel.value;
      renderAreaItems();
    });
    renderAreaItems();
  }

  // 小程序端安管员 - 作业详情页
  function viewOfficerMiniWorkDetail() {
    const view = $('#view');
    const id = parseInt((location.hash.split('?')[1] || '').replace('id=', '')) || 1;
    const w = MINI_PENDING_WORKS.find((x) => x.id === id) || MINI_PENDING_WORKS[0];
    // 施工人列表行（表格形式，标记施工负责人）
    const wrows = w.workers.map((p) => {
      const isLeader = p.name === w.leader;
      const certCell = p.certImg
        ? `<img src="${p.certImg}" alt="证件照" class="mini-cert-img" onclick="window.open('${p.certImg}','_blank')">`
        : '—';
      return `<tr class="${isLeader ? 'is-leader' : ''}">
        <td>${esc(p.name)}${isLeader ? '<span class="leader-tag">负责人</span>' : ''}</td>
        <td>${esc(p.phone)}</td>
        <td class="mono">${esc(p.idCard)}</td>
        <td>${esc(p.task)}</td>
        <td>${esc(p.needCert)}</td>
        <td>${p.hasCert === '否' ? '—' : esc(p.hasCert)}</td>
        <td>${certCell}</td>
      </tr>`;
    }).join('');
    const auditCardsHtml = renderMiniAuditCards(w.audit, w.id, false);
    const verifyCardsHtml = renderMiniVerifyCards(w.verify, w.id);
    view.innerHTML = `
      <div class="mini-office-wrap">
        <div class="mini-phone">
          <div class="mini-statusbar">
            <span>15:17</span>
            <span class="sb-right">
              <span class="sig"></span>
              <span class="wifi"></span>
              <span class="batt">88</span>
            </span>
          </div>
          <div class="mini-navheader">
            <span class="back-btn" onclick="location.hash='#/officer/mini/detail'">‹</span>
            <span class="nav-title">作业详情</span>
            <span></span>
          </div>
          <div class="mini-tab-content mini-detail-content">
            <div class="mini-status-banner pending">
              <span class="mini-status-text">${esc(w.status)}</span>
              <span class="mini-status-tip">请尽快审核</span>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">作业信息</div>
              <div class="mini-li-row"><span class="mini-li-label">作业名称</span><span class="mini-li-val">${esc(w.name)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">作业类型</span><span class="mini-li-val">${typeTag(w.type)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">企业名称</span><span class="mini-li-val">${esc(w.enterprise)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">施工单位</span><span class="mini-li-val">${esc(w.constructionUnit || '')}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">门店名称</span><span class="mini-li-val">${esc(w.store)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">施工地址</span><span class="mini-li-val">${esc(w.address)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">施工负责人</span><span class="mini-li-val">${esc(w.leader)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">负责人手机号</span><span class="mini-li-val">${esc(w.leaderPhone)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">开始时间</span><span class="mini-li-val">${esc(w.startTime)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">结束时间</span><span class="mini-li-val">${esc(w.endTime)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">作业状态</span><span class="mini-li-val">${statusTag(w.status)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">动火作业证书</span><span class="mini-li-val">${w.fireCert === '已上传' ? '<span class="fire-cert-tag uploaded">已上传</span>' : '<span class="fire-cert-tag not-uploaded">未上传</span>'}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">动火票</span><span class="mini-li-val">${w.fireCert === '已上传' ? '<img src="assets/fire-ticket.jpg" alt="动火票" class="mini-cert-img">' : '<span class="fire-cert-tag not-uploaded">未上传</span>'}</span></div>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">施工人列表 <span class="mini-count">${w.workers.length}人</span></div>
              <div class="mini-tbl-wrap">
                <table class="mini-tbl">
                  <thead><tr><th>姓名</th><th>手机号</th><th>身份证号</th><th>工作内容</th><th>是否需要持证</th><th>是否持证</th><th>证件照</th></tr></thead>
                  <tbody>${wrows}</tbody>
                </table>
              </div>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">审核记录 <span class="mini-count">${w.audit.length}条</span></div>
              ${auditCardsHtml}
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">现场核查记录 <span class="mini-count">${w.verify.length}条</span>
                <span class="mini-add-btn" data-add-verify>+</span>
              </div>
              ${verifyCardsHtml}
            </div>
          </div>
          <div class="mini-action-bar">
            <button class="mini-btn reject" id="btn-reject">拒绝</button>
            <button class="mini-btn pass" id="btn-pass">通过</button>
          </div>
        </div>
        <div class="side-desc-panel mini-side-panel">
          <div class="sdp-title">作业详情说明</div>
          <ul>
            <li><b>1·作业信息和施工人列表：</b>数据为作业人员扫描二维码填写的信息。</li>
            <li><b>2·动火作业证书：</b>施工人列表会上传作业所需的工种作业证书的证件照，当【是否需要持证】为是时，所有对应的人员全部都需要上传，全部上传则【动火作业证书】自动显示为已上传，只要有人未上传则【动火作业证书】自动显示未上传。</li>
            <li><b>3·施工负责人：</b>这里填写的人名在施工人列表一定存在，且在列表中会自动标记为负责人。</li>
            <li><b>4·审核记录：</b>现场图片和现场视频来源为作业人员上传的；检测记录回填ai识别结果，审核通过时如果填写了内容则展示输入内容，未填写则展示ai结果；拒绝原因展示审核拒绝时填写的内容。</li>
            <li><b>5·现场核查记录：</b>作业区域为安管员现场核查时手动输入的具体地址，检测记录和不通过原因都是ai结果，因为安管员上传现场照片视频后，交由ai评判，没有后续的人为操作。</li>
            <li><b>6·多条记录：</b>审核记录和现场核查记录都可能存在多条，默认展开第一条，其余折叠，按上传时间倒序。</li>
            <li><b>7·时间：</b>审核记录里的时间是作业人员上传作业信息提交时间；现场核查记录里的时间是安管员点击加号上传现场照片视频后提交的时间。</li>
          </ul>
        </div>
      </div>
    `;
    bindMiniAuditToggle(view);
    bindMiniAddVerify(view);
    // 通过/拒绝都需填写理由
    const openReasonDialog = (type) => {
      const isPass = type === 'pass';
      const title = isPass ? '审核通过' : '审核拒绝';
      const placeholder = isPass ? '请输入通过理由（选填）' : '请输入拒绝理由（必填）';
      const body = `<div class="mini-reason-wrap"><textarea class="mini-reason-input" id="reason-input" placeholder="${placeholder}" rows="4"></textarea></div>`;
      const foot = `<button class="btn" id="r-cancel">取消</button><button class="btn ${isPass ? 'btn-primary' : 'btn-danger'}" id="r-ok">确定</button>`;
      const { node, close } = openModal(title, body, foot);
      node.querySelector('#r-cancel').onclick = close;
      node.querySelector('#r-ok').onclick = () => {
        const reason = node.querySelector('#reason-input').value.trim();
        if (!isPass && !reason) { toast('请输入拒绝理由', 'error'); return; }
        close();
        toast(isPass ? '审核通过' : '已拒绝该作业', isPass ? 'success' : 'error');
        setTimeout(() => { location.hash = '#/officer/mini/detail'; }, 800);
      };
    };
    view.querySelector('#btn-pass').onclick = () => openReasonDialog('pass');
    view.querySelector('#btn-reject').onclick = () => openReasonDialog('reject');
  }

  // 小程序端安管员 - 区域作业详情页（无待审核状态，无通过/拒绝按钮）
  function viewOfficerMiniAreaWorkDetail() {
    const view = $('#view');
    const id = parseInt((location.hash.split('?')[1] || '').replace('id=', '')) || 1;
    const w = MINI_AREA_WORKS.find((x) => x.id === id) || MINI_AREA_WORKS[0];
    const statusCls = miniAreaStatusClass(w.status);
    // 施工人列表行（表格形式，标记施工负责人）
    const wrows = w.workers.map((p) => {
      const isLeader = p.name === w.leader;
      const certCell = p.certImg
        ? `<img src="${p.certImg}" alt="证件照" class="mini-cert-img" onclick="window.open('${p.certImg}','_blank')">`
        : '—';
      return `<tr class="${isLeader ? 'is-leader' : ''}">
        <td>${esc(p.name)}${isLeader ? '<span class="leader-tag">负责人</span>' : ''}</td>
        <td>${esc(p.phone)}</td>
        <td class="mono">${esc(p.idCard)}</td>
        <td>${esc(p.task)}</td>
        <td>${esc(p.needCert)}</td>
        <td>${p.hasCert === '否' ? '—' : esc(p.hasCert)}</td>
        <td>${certCell}</td>
      </tr>`;
    }).join('');
    const auditCardsHtml = renderMiniAuditCards(w.audit, w.id, false);
    const verifyCardsHtml = renderMiniVerifyCards(w.verify, w.id);
    // 状态横幅提示文案
    const statusTip = { '待开始': '作业即将开始', '进行中': '作业进行中', '已完成': '作业已完成', '已拒绝': '作业已被拒绝', '已结束': '作业已结束' }[w.status] || '';
    view.innerHTML = `
      <div class="mini-office-wrap">
        <div class="mini-phone">
          <div class="mini-statusbar">
            <span>15:17</span>
            <span class="sb-right">
              <span class="sig"></span>
              <span class="wifi"></span>
              <span class="batt">88</span>
            </span>
          </div>
          <div class="mini-navheader">
            <span class="back-btn" onclick="location.hash='#/officer/mini/detail'">‹</span>
            <span class="nav-title">作业详情</span>
            <span></span>
          </div>
          <div class="mini-tab-content mini-detail-content">
            <div class="mini-status-banner ${statusCls}">
              <span class="mini-status-text">${esc(w.status)}</span>
              <span class="mini-status-tip">${esc(statusTip)}</span>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">作业信息</div>
              <div class="mini-li-row"><span class="mini-li-label">作业名称</span><span class="mini-li-val">${esc(w.name)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">作业类型</span><span class="mini-li-val">${typeTag(w.type)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">企业名称</span><span class="mini-li-val">${esc(w.enterprise)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">施工单位</span><span class="mini-li-val">${esc(w.constructionUnit || '')}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">门店名称</span><span class="mini-li-val">${esc(w.store)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">施工地址</span><span class="mini-li-val">${esc(w.address)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">施工负责人</span><span class="mini-li-val">${esc(w.leader)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">负责人手机号</span><span class="mini-li-val">${esc(w.leaderPhone)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">开始时间</span><span class="mini-li-val">${esc(w.startTime)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">结束时间</span><span class="mini-li-val">${esc(w.endTime)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">作业状态</span><span class="mini-li-val">${statusTag(w.status)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">动火作业证书</span><span class="mini-li-val">${w.fireCert === '已上传' ? '<span class="fire-cert-tag uploaded">已上传</span>' : '<span class="fire-cert-tag not-uploaded">未上传</span>'}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">动火票</span><span class="mini-li-val">${w.fireCert === '已上传' ? '<img src="assets/fire-ticket.jpg" alt="动火票" class="mini-cert-img">' : '<span class="fire-cert-tag not-uploaded">未上传</span>'}</span></div>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">施工人列表 <span class="mini-count">${w.workers.length}人</span></div>
              <div class="mini-tbl-wrap">
                <table class="mini-tbl">
                  <thead><tr><th>姓名</th><th>手机号</th><th>身份证号</th><th>工作内容</th><th>是否需要持证</th><th>是否持证</th><th>证件照</th></tr></thead>
                  <tbody>${wrows}</tbody>
                </table>
              </div>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">审核记录 <span class="mini-count">${w.audit.length}条</span></div>
              ${auditCardsHtml}
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">现场核查记录 <span class="mini-count">${w.verify.length}条</span>${(w.status === '待开始' || w.status === '进行中') ? '<span class="mini-add-btn" data-add-verify>+</span>' : ''}</div>
              ${verifyCardsHtml}
            </div>
          </div>
        </div>
        <div class="side-desc-panel mini-side-panel">
          <div class="sdp-title">作业详情说明</div>
          <ul>
            <li><b>1·数据来源：</b>所有审核过的作业都在区域作业列表，作业详情展示所有的作业人员提交的信息和审核记录与现场核查记录。</li>
            <li><b>2·现场核查记录：</b>在待审核、待开始、进行中这三个状态时会有加号按钮出现，支持随时点击加号打开核查上传界面，功能为手动填写作业区域和上传照片视频，上传后自动调用ai对图片视频进行风险判定，通过则展示绿色通过标记，识别出风险则展示红色未通过标记，检测记录和不通过原因都为ai返回的结果。</li>
          </ul>
        </div>
      </div>
    `;
    bindMiniAuditToggle(view);
    if (w.status === '待开始' || w.status === '进行中') bindMiniAddVerify(view);
  }

  // ============ 小程序端作业人员 - 作业列表（两个tab） ============
  function viewWorkerMiniDetail() {
    const view = $('#view');
    const items = MINI_PENDING_WORKS.map((w) => `
      <div class="mini-list-item" data-id="${w.id}">
        <div class="mini-li-top"><span class="mini-li-type">${esc(w.type)}</span><span class="mini-li-status pending">待审核</span></div>
        <div class="mini-li-row"><span class="mini-li-label">作业名称</span><span class="mini-li-val">${esc(w.name)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">企业名称</span><span class="mini-li-val">${esc(w.enterprise)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">施工单位</span><span class="mini-li-val">${esc(w.constructionUnit || '')}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">施工地址</span><span class="mini-li-val">${esc(w.address)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">施工负责人</span><span class="mini-li-val">${esc(w.leader)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">负责人手机号</span><span class="mini-li-val">${esc(w.leaderPhone)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">作业开始时间</span><span class="mini-li-val">${esc(w.startTime)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">作业结束时间</span><span class="mini-li-val">${esc(w.endTime)}</span></div>
        <div class="mini-li-actions">
          <button class="mini-btn-mini resubmit" data-id="${w.id}">重新提交</button>
        </div>
        <div class="mini-li-arrow">${icon('chevron')}</div>
      </div>`).join('');
    const areaStatuses = ['全部', '待开始', '进行中', '已完成', '已拒绝', '已结束'];
    const areaItems = MINI_AREA_WORKS.map((w) => `
      <div class="mini-list-item" data-id="${w.id}" data-status="${esc(w.status)}">
        <div class="mini-li-top"><span class="mini-li-type">${esc(w.type)}</span><span class="mini-li-status ${miniAreaStatusClass(w.status)}">${esc(w.status)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">作业名称</span><span class="mini-li-val">${esc(w.name)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">企业名称</span><span class="mini-li-val">${esc(w.enterprise)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">施工单位</span><span class="mini-li-val">${esc(w.constructionUnit || '')}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">施工地址</span><span class="mini-li-val">${esc(w.address)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">施工负责人</span><span class="mini-li-val">${esc(w.leader)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">负责人手机号</span><span class="mini-li-val">${esc(w.leaderPhone)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">作业开始时间</span><span class="mini-li-val">${esc(w.startTime)}</span></div>
        <div class="mini-li-row"><span class="mini-li-label">作业结束时间</span><span class="mini-li-val">${esc(w.endTime)}</span></div>
        ${w.status === '已拒绝' ? `<div class="mini-li-actions"><button class="mini-btn-mini resubmit" data-id="${w.id}">重新提交</button></div>` : ''}
        <div class="mini-li-arrow">${icon('chevron')}</div>
      </div>`).join('');
    const areaStatusOptions = areaStatuses.map((s) => `<option value="${s}">${s}</option>`).join('');
    view.innerHTML = `
      <div class="mini-office-wrap">
        <div class="mini-phone">
          <div class="mini-statusbar">
            <span>15:17</span>
            <span class="sb-right">
              <span class="sig"></span>
              <span class="wifi"></span>
              <span class="batt">88</span>
            </span>
          </div>
          <div class="mini-navheader">
            <span class="back-btn" onclick="location.hash='#/worker/mini'">‹</span>
            <span class="nav-title">特种作业</span>
            <span></span>
          </div>
          <div class="mini-tabs">
            <div class="tab active" data-idx="0">待审核作业</div>
            <div class="tab" data-idx="1">区域作业</div>
          </div>
          <div class="mini-tab-content" id="workerTab0">
            <div class="mini-list">${items}</div>
          </div>
          <div class="mini-tab-content hidden" id="workerTab1">
            <div class="mini-filter-bar"><select class="mini-filter-select" id="areaStatusFilter">${areaStatusOptions}</select></div>
            <div class="mini-list" id="areaListContainer">${areaItems}</div>
          </div>
        </div>
      </div>
      <div class="mini-side-panel">
        <div class="mspd-title">待审核作业列表说明</div>
        <ul>
          <li><b>1·</b>扫码进入作业详情提交的作业信息全都展示在这里，都是待审核状态。</li>
          <li><b>2·</b>重新提交：点击按钮跳转至作业详情编辑页，所有数据回填。</li>
          <li><b>3·</b>列表页点击列表数据进入详情页，详情页展示所有上传的作业信息。</li>
        </ul>
      </div>
      <div class="mini-side-panel">
        <div class="mspd-title">区域作业列表说明</div>
        <ul>
          <li><b>1·</b>列表有状态搜索。</li>
          <li><b>2·</b>状态有：待开始，进行中，已完成，已拒绝，已结束；排序为已拒绝，待开始，进行中，已完成，已结束，然后每个状态又按上传时间倒序。</li>
          <li><b>3·</b>每个作业都有上传时间，上传时间即作业详情点击提交按钮时间，但该时间不在页面展示。</li>
        </ul>
      </div>
    `;
    view.querySelectorAll('.mini-tabs .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = parseInt(tab.dataset.idx);
        view.querySelectorAll('.mini-tabs .tab').forEach((t,i) => t.classList.toggle('active', i === idx));
        view.querySelector('#workerTab0').classList.toggle('hidden', idx !== 0);
        view.querySelector('#workerTab1').classList.toggle('hidden', idx !== 1);
      });
    });
    view.querySelectorAll('#workerTab0 .mini-list-item').forEach(item => {
      item.addEventListener('click', () => {
        location.hash = '#/worker/mini/work-detail?id=' + item.dataset.id;
      });
    });
    view.querySelectorAll('#workerTab0 .resubmit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        location.hash = '#/worker/mini/work-info?id=' + btn.dataset.id;
      });
    });
    view.querySelectorAll('#workerTab1 .mini-list-item').forEach(item => {
      item.addEventListener('click', () => {
        location.hash = '#/worker/mini/area-work-detail?id=' + item.dataset.id;
      });
    });
    view.querySelectorAll('#workerTab1 .resubmit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        location.hash = '#/worker/mini/work-info?id=' + btn.dataset.id;
      });
    });
    const statusFilter = view.querySelector('#areaStatusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', () => {
        const val = statusFilter.value;
        view.querySelectorAll('#areaListContainer .mini-list-item').forEach(item => {
          item.style.display = (val === '全部' || item.dataset.status === val) ? '' : 'none';
        });
      });
    }
  }

  // ============ 小程序端作业人员 - 待审核作业详情页 ============
  function viewWorkerMiniWorkDetail() {
    const view = $('#view');
    const id = parseInt((location.hash.split('?')[1] || '').replace('id=', '')) || 1;
    const w = MINI_PENDING_WORKS.find((x) => x.id === id) || MINI_PENDING_WORKS[0];
    const wrows = w.workers.map((p) => {
      const isLeader = p.name === w.leader;
      const certCell = p.certImg
        ? `<img src="${p.certImg}" alt="证件照" class="mini-cert-img" onclick="window.open('${p.certImg}','_blank')">`
        : '—';
      return `<tr class="${isLeader ? 'is-leader' : ''}">
        <td>${esc(p.name)}${isLeader ? '<span class="leader-tag">负责人</span>' : ''}</td>
        <td>${esc(p.phone)}</td>
        <td class="mono">${esc(p.idCard)}</td>
        <td>${esc(p.task)}</td>
        <td>${esc(p.needCert)}</td>
        <td>${p.hasCert === '否' ? '—' : esc(p.hasCert)}</td>
        <td>${certCell}</td>
      </tr>`;
    }).join('');
    const auditCardsHtml = renderMiniAuditCards(w.audit, w.id);
    const verifyCardsHtml = renderMiniVerifyCards(w.verify, w.id);
    const sitePhotoCount = 2;
    const siteVideoCount = 1;
    const sitePhotoHtml = Array.from({ length: sitePhotoCount }).map((_, pi) => {
      const src = MINI_PHOTO_POOL[(w.id * 3 + pi) % MINI_PHOTO_POOL.length];
      return `<div class="mini-photo-item" style="background-image:url('${src}')" onclick="window.open('${src}','_blank')"></div>`;
    }).join('');
    view.innerHTML = `
      <div class="mini-office-wrap">
        <div class="mini-phone">
          <div class="mini-statusbar">
            <span>15:17</span>
            <span class="sb-right">
              <span class="sig"></span>
              <span class="wifi"></span>
              <span class="batt">88</span>
            </span>
          </div>
          <div class="mini-navheader">
            <span class="back-btn" onclick="location.hash='#/worker/mini/detail'">‹</span>
            <span class="nav-title">作业详情</span>
            <span></span>
          </div>
          <div class="mini-tab-content mini-detail-content">
            <div class="mini-status-banner pending">
              <span class="mini-status-text">${esc(w.status)}</span>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">作业信息</div>
              <div class="mini-li-row"><span class="mini-li-label">作业名称</span><span class="mini-li-val">${esc(w.name)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">作业类型</span><span class="mini-li-val">${typeTag(w.type)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">企业名称</span><span class="mini-li-val">${esc(w.enterprise)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">门店名称</span><span class="mini-li-val">${esc(w.store)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">施工单位</span><span class="mini-li-val">${esc(w.constructionUnit || '')}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">施工地址</span><span class="mini-li-val">${esc(w.address)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">施工负责人</span><span class="mini-li-val">${esc(w.leader)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">负责人手机号</span><span class="mini-li-val">${esc(w.leaderPhone)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">开始时间</span><span class="mini-li-val">${esc(w.startTime)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">结束时间</span><span class="mini-li-val">${esc(w.endTime)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">作业状态</span><span class="mini-li-val">${statusTag(w.status)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">动火票</span><span class="mini-li-val">${w.fireCert === '已上传' ? '<img src="assets/fire-ticket.jpg" alt="动火票" class="mini-cert-img">' : '<span class="fire-cert-tag not-uploaded">未上传</span>'}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">动火作业证书</span><span class="mini-li-val">${w.fireCert === '已上传' ? '<span class="fire-cert-tag uploaded">已上传</span>' : '<span class="fire-cert-tag not-uploaded">未上传</span>'}</span></div>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">施工人列表 <span class="mini-count">${w.workers.length}人</span></div>
              <div class="mini-tbl-wrap">
                <table class="mini-tbl">
                  <thead><tr><th>姓名</th><th>手机号</th><th>身份证号</th><th>工作内容</th><th>是否需要持证</th><th>是否持证</th><th>证件照</th></tr></thead>
                  <tbody>${wrows}</tbody>
                </table>
              </div>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">作业现场</div>
              <div class="mini-sub-title">现场照片 <span class="mini-count">${sitePhotoCount}张</span></div>
              <div class="mini-photo-grid">${sitePhotoHtml}</div>
              <div class="mini-sub-title">现场视频 <span class="mini-count">${siteVideoCount}个</span></div>
              <div class="mini-video-item">${icon('play')}<span>点击播放</span></div>
            </div>
          </div>
        </div>
        <div class="side-desc-panel mini-side-panel">
          <div class="sdp-title">作业详情说明</div>
          <ul>
            <li>展示作业人员扫码录入的全部作业信息。</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ============ 小程序端作业人员 - 区域作业详情页 ============
  function viewWorkerMiniAreaWorkDetail() {
    const view = $('#view');
    const id = parseInt((location.hash.split('?')[1] || '').replace('id=', '')) || 1;
    const w = MINI_AREA_WORKS.find((x) => x.id === id) || MINI_AREA_WORKS[0];
    const statusCls = miniAreaStatusClass(w.status);
    const wrows = w.workers.map((p) => {
      const isLeader = p.name === w.leader;
      const certCell = p.certImg
        ? `<img src="${p.certImg}" alt="证件照" class="mini-cert-img" onclick="window.open('${p.certImg}','_blank')">`
        : '—';
      return `<tr class="${isLeader ? 'is-leader' : ''}">
        <td>${esc(p.name)}${isLeader ? '<span class="leader-tag">负责人</span>' : ''}</td>
        <td>${esc(p.phone)}</td>
        <td class="mono">${esc(p.idCard)}</td>
        <td>${esc(p.task)}</td>
        <td>${esc(p.needCert)}</td>
        <td>${p.hasCert === '否' ? '—' : esc(p.hasCert)}</td>
        <td>${certCell}</td>
      </tr>`;
    }).join('');
    const auditCardsHtml = renderMiniAuditCards(w.audit, w.id, false);
    const verifyCardsHtml = renderMiniVerifyCards(w.verify, w.id);
    const statusTip = { '待开始': '作业即将开始', '进行中': '作业进行中', '已完成': '作业已完成', '已拒绝': '作业已被拒绝', '已结束': '作业已结束' }[w.status] || '';
    view.innerHTML = `
      <div class="mini-office-wrap">
        <div class="mini-phone">
          <div class="mini-statusbar">
            <span>15:17</span>
            <span class="sb-right">
              <span class="sig"></span>
              <span class="wifi"></span>
              <span class="batt">88</span>
            </span>
          </div>
          <div class="mini-navheader">
            <span class="back-btn" onclick="location.hash='#/worker/mini/detail'">‹</span>
            <span class="nav-title">作业详情</span>
            <span></span>
          </div>
          <div class="mini-tab-content mini-detail-content">
            <div class="mini-status-banner ${statusCls}">
              <span class="mini-status-text">${esc(w.status)}</span>
              <span class="mini-status-tip">${esc(statusTip)}</span>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">作业信息</div>
              <div class="mini-li-row"><span class="mini-li-label">作业名称</span><span class="mini-li-val">${esc(w.name)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">作业类型</span><span class="mini-li-val">${typeTag(w.type)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">企业名称</span><span class="mini-li-val">${esc(w.enterprise)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">门店名称</span><span class="mini-li-val">${esc(w.store)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">施工单位</span><span class="mini-li-val">${esc(w.constructionUnit || '')}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">施工地址</span><span class="mini-li-val">${esc(w.address)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">施工负责人</span><span class="mini-li-val">${esc(w.leader)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">负责人手机号</span><span class="mini-li-val">${esc(w.leaderPhone)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">开始时间</span><span class="mini-li-val">${esc(w.startTime)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">结束时间</span><span class="mini-li-val">${esc(w.endTime)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">作业状态</span><span class="mini-li-val">${statusTag(w.status)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">动火作业证书</span><span class="mini-li-val">${w.fireCert === '已上传' ? '<span class="fire-cert-tag uploaded">已上传</span>' : '<span class="fire-cert-tag not-uploaded">未上传</span>'}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">动火票</span><span class="mini-li-val">${w.fireCert === '已上传' ? '<img src="assets/fire-ticket.jpg" alt="动火票" class="mini-cert-img">' : '<span class="fire-cert-tag not-uploaded">未上传</span>'}</span></div>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">施工人列表 <span class="mini-count">${w.workers.length}人</span></div>
              <div class="mini-tbl-wrap">
                <table class="mini-tbl">
                  <thead><tr><th>姓名</th><th>手机号</th><th>身份证号</th><th>工作内容</th><th>是否需要持证</th><th>是否持证</th><th>证件照</th></tr></thead>
                  <tbody>${wrows}</tbody>
                </table>
              </div>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">审核记录 <span class="mini-count">${w.audit.length}条</span></div>
              ${auditCardsHtml}
            </div>
            ${(w.verify && w.verify.length > 0) ? `<div class="mini-detail-card">
              <div class="mini-card-title">现场核查记录 <span class="mini-count">${w.verify.length}条</span></div>
              ${verifyCardsHtml}
            </div>` : ''}
          </div>
        </div>
        <div class="side-desc-panel mini-side-panel">
          <div class="sdp-title">作业详情说明</div>
          <ul>
            <li><b>1·</b>展示作业人员扫码录入的全部作业信息和安管员现场核查上传的信息，现场核查记录可能有多条，默认展示第一条，其余折叠。</li>
            <li><b>2·</b>所有地方的现场核查记录全都设计为，有才展示，没有则不展示这个模块，后期可能会做成每个物业单独设置核查规则去上传现场照片视频，同时也支持不需要上传。</li>
          </ul>
        </div>
      </div>
    `;
    bindMiniAuditToggle(view);
  }

  // ============ 小程序端作业人员 - 作业详情（待填写，无交互） ============
  function viewWorkerMiniWorkInfo() {
    const view = $('#view');
    const w = MINI_PENDING_WORKS[0];
    const wrows = w.workers.map((p, idx) => {
      const isLeader = p.name === w.leader;
      const certCell = p.certImg
        ? `<img src="${p.certImg}" alt="证件照" class="mini-cert-img">`
        : '—';
      return `<tr class="${isLeader ? 'is-leader' : ''}" data-idx="${idx}">
        <td>${esc(p.name)}${isLeader ? '<span class="leader-tag">负责人</span>' : ''}</td>
        <td>${esc(p.phone)}</td>
        <td class="mono">${esc(p.idCard)}</td>
        <td>${esc(p.task)}</td>
        <td>${esc(p.needCert)}</td>
        <td>${p.hasCert === '否' ? '—' : esc(p.hasCert)}</td>
        <td>${certCell}</td>
        <td class="mini-tbl-actions">
          <span class="mini-tbl-edit" data-edit-idx="${idx}">编辑</span>
          <span class="mini-tbl-del" data-del-idx="${idx}">删除</span>
        </td>
      </tr>`;
    }).join('');
    view.innerHTML = `
      <div class="mini-office-wrap">
        <div class="mini-phone">
          <div class="mini-statusbar">
            <span>15:17</span>
            <span class="sb-right">
              <span class="sig"></span>
              <span class="wifi"></span>
              <span class="batt">88</span>
            </span>
          </div>
          <div class="mini-navheader">
            <span class="back-btn" onclick="location.hash='#/worker/mini/detail'">‹</span>
            <span class="nav-title">作业详情</span>
            <span></span>
          </div>
          <div class="mini-tab-content mini-detail-content">
            <div class="mini-detail-card">
              <div class="mini-card-title">作业信息</div>
              <div class="mini-form-row"><label class="mini-li-label">作业名称</label><input class="mini-form-input" type="text" value="${esc(w.name)}"></div>
              <div class="mini-form-row"><label class="mini-li-label">作业类型</label>
                <select class="mini-form-select">
                  <option value="动火作业" ${w.type === '动火作业' ? 'selected' : ''}>动火作业</option>
                  <option value="高处作业" ${w.type === '高处作业' ? 'selected' : ''}>高处作业</option>
                  <option value="临时用电作业" ${w.type === '临时用电作业' ? 'selected' : ''}>临时用电作业</option>
                  <option value="受限空间作业" ${w.type === '受限空间作业' ? 'selected' : ''}>受限空间作业</option>
                  <option value="吊装作业" ${w.type === '吊装作业' ? 'selected' : ''}>吊装作业</option>
                </select>
              </div>
              <div class="mini-form-row"><label class="mini-li-label">企业名称</label><input class="mini-form-input disabled" type="text" value="${esc(w.enterprise)}" disabled></div>
              <div class="mini-form-row"><label class="mini-li-label">门店名称</label>
                <select class="mini-form-select">
                  <option value="${esc(w.store)}" selected>${esc(w.store)}</option>
                  <option value="A栋1楼装修门店">A栋1楼装修门店</option>
                  <option value="A栋2楼装修门店">A栋2楼装修门店</option>
                  <option value="B栋3楼装修门店">B栋3楼装修门店</option>
                </select>
              </div>
              <div class="mini-form-row"><label class="mini-li-label">施工单位</label><input class="mini-form-input" type="text" value="${esc(w.constructionUnit || '')}" placeholder="请输入施工单位"></div>
              <div class="mini-form-row"><label class="mini-li-label">施工地址</label><input class="mini-form-input" type="text" value="${esc(w.address)}"></div>
              <div class="mini-form-row"><label class="mini-li-label">施工负责人</label><input class="mini-form-input" type="text" value="${esc(w.leader)}"></div>
              <div class="mini-form-row"><label class="mini-li-label">负责人手机号</label><input class="mini-form-input" type="text" value="${esc(w.leaderPhone)}"></div>
              <div class="mini-form-row"><label class="mini-li-label">开始时间</label><input class="mini-form-input" type="text" value="${esc(w.startTime)}"></div>
              <div class="mini-form-row"><label class="mini-li-label">结束时间</label><input class="mini-form-input" type="text" value="${esc(w.endTime)}"></div>
              <div class="mini-li-row"><span class="mini-li-label">作业状态</span><span class="mini-li-val">${statusTag(w.status)}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">动火作业证书</span><span class="mini-li-val">${w.fireCert === '已上传' ? '<span class="fire-cert-tag uploaded">已上传</span>' : '<span class="fire-cert-tag not-uploaded">未上传</span>'}</span></div>
              <div class="mini-li-row"><span class="mini-li-label">动火票</span><span class="mini-li-val">${w.fireCert === '已上传' ? '<img src="assets/fire-ticket.jpg" alt="动火票" class="mini-cert-img">' : '<span class="fire-cert-tag not-uploaded">未上传</span>'}</span></div>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">施工人列表 <span class="mini-count">${w.workers.length}人</span>
                <span class="mini-add-btn" data-add-worker>+</span>
              </div>
              <div class="mini-tbl-wrap">
                <table class="mini-tbl">
                  <thead><tr><th>姓名</th><th>手机号</th><th>身份证号</th><th>工作内容</th><th>是否需要持证</th><th>是否持证</th><th>证件照</th><th>操作</th></tr></thead>
                  <tbody>${wrows}</tbody>
                </table>
              </div>
            </div>
            <div class="mini-detail-card">
              <div class="mini-card-title">作业现场</div>
              <div class="mini-form-row">
                <div class="mini-upload-box" data-upload-site-photo>点击上传现场照片</div>
              </div>
              <div class="mini-form-row">
                <div class="mini-upload-box" data-upload-site-video>点击上传现场视频</div>
              </div>
            </div>
          </div>
          <div class="mini-action-bar">
            <button class="mini-btn pass" style="flex:1">提交</button>
          </div>
        </div>
        <div class="side-desc-panel mini-side-panel">
          <div class="sdp-title">作业详情说明</div>
          <ul>
            <li><b>1·作业名称：</b>文本框。</li>
            <li><b>2·作业类型：</b>下拉框，选项为动火作业、高处作业、临时用电作业（暂时只会选动火作业，但可以先三个都展示）。</li>
            <li><b>3·企业名称：</b>置灰，由二维码带过来的企业名称。</li>
            <li><b>4·门店名称：</b>下拉框，数据为该企业下的所有门店数据。</li>
            <li><b>5·施工单位：</b>文本框，自由填写，没有校验。若不填写，所有该字段的展示都给横杠。</li>
            <li><b>6·施工地址：</b>自动回填门店的施工地址，但支持修改，非必填，这个页面只有这一个字段是非必填。</li>
            <li><b>7·施工负责人和负责人手机号：</b>两个信息自动回填当前登录的个人且姓名手机号身份证号自动填入施工人列表的第一行，标记为负责人。</li>
            <li><b>8·开始时间/结束时间：</b>时间表格选取时间。</li>
            <li><b>9·作业状态：</b>此处为作业人员上传作业信息的作业详情页面，状态一定为待审核。</li>
            <li><b>10·动火作业证书：</b>状态标记，由施工人员列表在需要持证的前提下是否全部上传证件照判定，只要有人未上传，则直接显示未上传，全部上传则显示已上传。</li>
            <li><b>11·动火票：</b>上传按钮，点击上传图片。</li>
            <li><b>12·施工人列表：</b>统计总人数，点击加号可录入人员，操作列有编辑和删除，点击编辑按钮打开添加施工人页面但数据回填，点击删除直接删除整条该人员信息；是否持证如果在编辑时选的否，则此处展示横杠。</li>
            <li><b>13·负责人：</b>作业信息里填写了施工负责人，这个人必须填写在施工人列表，且自动标记为负责人（以姓名加手机号判定，防重名）。</li>
            <li><b>14·作业现场：</b>支持仅照片或仅视频或照片和视频，属于必填但至少有一项，都没有则无法提交。</li>
            <li><b>15·提交校验：</b>点击提交按钮，需要判断除施工单位所有数据全部必填是否有未填，否则点击提交按钮页面提示存在未填信息。</li>
          </ul>
        </div>
      </div>
    `;
    const addBtn = view.querySelector('[data-add-worker]');
    if (addBtn) addBtn.addEventListener('click', () => openWorkerForm(null));
    // 编辑施工人
    view.querySelectorAll('.mini-tbl-edit').forEach(el => {
      el.addEventListener('click', () => openWorkerForm(parseInt(el.dataset.editIdx, 10)));
    });
    // 删除施工人
    view.querySelectorAll('.mini-tbl-del').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.delIdx, 10);
        const target = w.workers[idx];
        if (!target) return;
        const delBody = `<div style="text-align:center;padding:10px 0;font-size:14px;color:#606266">确定要删除施工人「${esc(target.name)}」吗？此操作不可撤销。</div>`;
        const delFoot = `<button class="btn" id="del-cancel" style="flex:1">取消</button><button class="btn btn-danger" id="del-ok" style="flex:1">删除</button>`;
        const { node, close } = openModal('删除施工人', delBody, delFoot);
        node.querySelector('#del-cancel').onclick = close;
        node.querySelector('#del-ok').onclick = () => {
          w.workers.splice(idx, 1);
          close();
          toast('施工人已删除', 'success');
          viewWorkerMiniWorkInfo();
        };
      });
    });
    // 作业现场上传
    const sitePhotoBox = view.querySelector('[data-upload-site-photo]');
    if (sitePhotoBox) sitePhotoBox.addEventListener('click', () => {
      toast('现场照片已上传', 'success');
      sitePhotoBox.textContent = '已上传 ✓';
      sitePhotoBox.classList.add('uploaded');
    });
    const siteVideoBox = view.querySelector('[data-upload-site-video]');
    if (siteVideoBox) siteVideoBox.addEventListener('click', () => {
      toast('现场视频已上传', 'success');
      siteVideoBox.textContent = '已上传 ✓';
      siteVideoBox.classList.add('uploaded');
    });

    function openWorkerForm(editIdx) {
      const editing = typeof editIdx === 'number';
      const p = editing ? w.workers[editIdx] : null;
      const wasLeader = editing && p.name === w.leader;
      const body = `<div class="mini-worker-form">
          <div class="mini-form-row"><label class="mini-li-label">姓名<span class="mini-req">*</span></label><input class="mini-form-input" type="text" id="wk-name" placeholder="请输入姓名" value="${p ? esc(p.name) : ''}"></div>
          <div class="mini-form-row"><label class="mini-li-label">手机号<span class="mini-req">*</span></label><input class="mini-form-input" type="tel" id="wk-phone" placeholder="请输入手机号" value="${p ? esc(p.phone) : ''}"></div>
          <div class="mini-form-row"><label class="mini-li-label">身份证号<span class="mini-req">*</span></label><input class="mini-form-input" type="text" id="wk-idcard" placeholder="请输入身份证号" value="${p ? esc(p.idCard) : ''}"></div>
          <div class="mini-form-row"><label class="mini-li-label">工作内容<span class="mini-req">*</span></label><input class="mini-form-input" type="text" id="wk-task" placeholder="请输入工作内容" value="${p ? esc(p.task) : ''}"></div>
          <div class="mini-form-row"><label class="mini-li-label">是否需要持证<span class="mini-req">*</span></label>
            <select class="mini-form-select" id="wk-needcert">
              <option value="是" ${!p || p.needCert === '是' ? 'selected' : ''}>是</option>
              <option value="否" ${p && p.needCert === '否' ? 'selected' : ''}>否</option>
            </select>
          </div>
          <div class="mini-form-row"><label class="mini-li-label">是否持证<span class="mini-req">*</span></label>
            <select class="mini-form-select" id="wk-hascert">
              <option value="" ${!p || !p.hasCert ? 'selected' : ''}>请选择</option>
              <option value="是" ${p && p.hasCert === '是' ? 'selected' : ''}>是</option>
              <option value="否" ${p && p.hasCert === '否' ? 'selected' : ''}>否</option>
            </select>
          </div>
          <div class="mini-form-row" id="wk-cert-row" style="display:${p && p.hasCert === '是' ? 'flex' : 'none'}">
            <label class="mini-li-label">证件照<span class="mini-req">*</span></label>
            <div class="mini-upload-box" id="wk-upload">${p && p.certImg ? '已上传 ✓' : '点击上传图片'}</div>
          </div>
        </div>`;
      const foot = `<button class="btn btn-primary" id="wk-ok" style="width:100%">确认</button>`;
      const desc = `<div class="modal-desc">
          <div class="md-title">添加施工人说明</div>
          <ul>
            <li><b>1·</b>所有信息都是必填。</li>
            <li><b>2·</b>身份证号填写完后再列表展示为脱敏。</li>
            <li><b>3·</b>是否需要持证默认为是。</li>
            <li><b>4·</b>是否持证：没有默认值，选是则出现证件照上传图片，必填，如果选否或未选择，都不展示证件照字段。</li>
          </ul>
        </div>`;
      const overlayNode = h(`<div class="overlay"><div class="modal wide modal-with-desc">
        <div class="modal-main">
          <div class="modal-head"><span class="mt">${esc(editing ? '编辑施工人' : '添加施工人')}</span><span class="close">${icon('x')}</span></div>
          <div class="modal-body">${body}</div>
          <div class="modal-foot">${foot}</div>
        </div>
        ${desc}
      </div></div>`);
      document.body.appendChild(overlayNode);
      const close = () => overlayNode.remove();
      overlayNode.querySelector('.close').onclick = close;
      overlayNode.addEventListener('click', (e) => { if (e.target === overlayNode) close(); });
      const node = overlayNode;
      const hasCertSelect = node.querySelector('#wk-hascert');
      const certRow = node.querySelector('#wk-cert-row');
      let certUploaded = editing ? !!(p && p.certImg) : false;
      hasCertSelect.addEventListener('change', () => {
        const show = hasCertSelect.value === '是';
        certRow.style.display = show ? 'flex' : 'none';
        if (!show) certUploaded = false;
        node.querySelector('#wk-upload').textContent = (show && p && p.certImg) ? '已上传 ✓' : '点击上传图片';
        if (show && p && p.certImg) certUploaded = true;
      });
      node.querySelector('#wk-upload').addEventListener('click', () => {
        certUploaded = true;
        node.querySelector('#wk-upload').textContent = '已上传 ✓';
      });
      node.querySelector('#wk-ok').onclick = () => {
        const name = node.querySelector('#wk-name').value.trim();
        if (!name) { toast('请输入姓名', 'error'); return; }
        const phone = node.querySelector('#wk-phone').value.trim();
        if (!phone) { toast('请输入手机号', 'error'); return; }
        const idcard = node.querySelector('#wk-idcard').value.trim();
        if (!idcard) { toast('请输入身份证号', 'error'); return; }
        const task = node.querySelector('#wk-task').value.trim();
        if (!task) { toast('请输入工作内容', 'error'); return; }
        const needcert = node.querySelector('#wk-needcert').value;
        if (!needcert) { toast('请选择是否需要持证', 'error'); return; }
        const hascert = node.querySelector('#wk-hascert').value;
        if (!hascert) { toast('请选择是否持证', 'error'); return; }
        if (hascert === '是' && !certUploaded) { toast('请上传证件照', 'error'); return; }
        const data = { name, phone, idCard: idcard, task, needCert: needcert, hasCert: hascert, certImg: certUploaded ? (p && p.certImg ? p.certImg : 'assets/cert-sample.jpg') : '' };
        if (editing) {
          w.workers[editIdx] = data;
          if (wasLeader) w.leader = name;
          toast('施工人已更新', 'success');
        } else {
          w.workers.push(data);
          toast('施工人已添加', 'success');
        }
        close();
        viewWorkerMiniWorkInfo();
      };
    }
  }

  // ============ 作业区域 ============
  function viewAreas() {
    const view = $('#view');
    let state = { status: '全部', page: 1, pageSize: 10 };
    function load() {
      view.innerHTML = `
        <div class="card">
          <div class="toolbar">
            <div class="field"><span class="label">状态</span>
              <select class="select" id="f-status">
                <option>全部</option><option>启用</option><option>禁用</option>
              </select></div>
            <div class="spacer"></div>
            <button class="btn btn-primary" id="btn-add">${icon('plus')}新增区域</button>
          </div>
          <div id="tbl"></div>
        </div>`;
      $('#f-status').value = state.status;
      $('#f-status').onchange = (e) => { state.status = e.target.value; state.page = 1; render(); };
      $('#btn-add').onclick = () => modalArea(null, render);
      render();
    }
    function render() {
      API.listAreas({ status: state.status }).then((res) => {
        const rows = res.data;
        const columns = [
          { title: '名称', key: 'name' },
          { title: '所属区域', key: 'region' },
          { title: '区域安管员', key: 'officer' },
          { title: '联系方式', key: 'phone' },
          { title: '状态', titleHtml: '<span class="pin-num pin-inline"><span>1</span></span>状态', render: (r) => statusTag(r.status) },
          { title: '作业数量', titleHtml: '<span class="pin-num pin-inline"><span>2</span></span>作业数量', key: 'workCount' },
          { title: '操作', render: (r) => `
            <div class="actions">
              <button class="btn-text" data-act="view">查看</button>
              <button class="btn-text" data-act="edit">编辑</button>
              <button class="btn-text" data-act="toggle">${r.status === '启用' ? '禁用' : '启用'}</button>
              <button class="btn-text danger" data-act="delete">删除</button>
            </div>` },
        ];
        const { node } = renderTable({
          columns, rows, page: state.page, pageSize: state.pageSize,
          onAction: (act, id) => {
            const r = rows.find((x) => x.id === id);
            if (act === 'view') modalAreaView(r);
            else if (act === 'edit') modalArea(r, render);
            else if (act === 'toggle') confirmDialog(`确定${r.status === '启用' ? '禁用' : '启用'}该区域吗？`, () => API.toggleArea(id).then(() => { toast('操作成功'); render(); }));
            else if (act === 'delete') confirmDialog(`确定删除区域「${r.name}」吗？`, () => API.deleteArea(id).then(() => { toast('删除成功'); render(); }));
          },
        });
        node.querySelectorAll('[data-pg]').forEach((b) => b.onclick = () => { const p = b.dataset.pg; state.page = (p === 'prev' ? state.page - 1 : p === 'next' ? state.page + 1 : Number(p)); if (state.page >= 1) render(); });
        const slot = $('#tbl'); slot.innerHTML = ''; slot.appendChild(node);
        // 红框位置：字段说明
        const desc = h(`<div class="card desc-panel desc-panel-sm">
          <div class="card-title">首页</div>
          <ul>
            <li><b>1·状态：</b>启动/禁用搜索；</li>
            <li><b>2·作业数量：</b>当前区域内所有作业数量合计；</li>
          </ul>
        </div>`);
        slot.parentElement.appendChild(desc);
        // 新增区域：字段说明
        const descAdd = h(`<div class="card desc-panel desc-panel-sm">
          <div class="card-title">新增区域</div>
          <ul>
            <li><b>1·区域名称：</b>必填，30字符串长度；</li>
            <li><b>2·所属区域：</b>必填，非手输，选择地图定位后自动识别区域回填；</li>
            <li><b>3·姓名、手机号：</b>选填；</li>
            <li><b>4·地图定位：</b>和现有的地图范围选点的方式一样，选完地图区域范围后自动识别省市区回填，置灰，不支持修改省市区。</li>
          </ul>
        </div>`);
        slot.parentElement.appendChild(descAdd);
        // 查看：字段说明
        const descView = h(`<div class="card desc-panel desc-panel-sm">
          <div class="card-title">查看</div>
          <ul>
            <li><b>查看：</b>和列表展示数据全部一致并展示地图信息，不需要展示经纬度。</li>
          </ul>
        </div>`);
        slot.parentElement.appendChild(descView);
        // 编辑：字段说明
        const descEdit = h(`<div class="card desc-panel desc-panel-sm">
          <div class="card-title">编辑</div>
          <ul>
            <li><b>编辑：</b>和新增页面完全一致，数据回填，修改提交后更新信息。</li>
          </ul>
        </div>`);
        slot.parentElement.appendChild(descEdit);
        // 禁用/删除：字段说明
        const descDisable = h(`<div class="card desc-panel desc-panel-sm">
          <div class="card-title">禁用/删除</div>
          <ul>
            <li><b>禁用/删除：</b>操作时需判断当前区域下是否有进行中的作业，如果有，则不能禁止或删除并给出提示。</li>
          </ul>
        </div>`);
        slot.parentElement.appendChild(descDisable);
      });
    }
    load();
  }

  // 新增/编辑区域弹窗
  function modalArea(area, onDone) {
    const isEdit = !!area;
    const a = area || { name: '', region: '', province: '湖北省', city: '武汉市', district: '江汉区', officer: '', phone: '', bounds: { north: 30.59, south: 30.58, east: 114.31, west: 114.29 } };
    const body = `
      <div class="form-row"><div class="fl"><span class="pin-num pin-inline"><span>1</span></span>区域名称<span class="req">*</span></div><div class="fr"><input class="input" id="m-name" value="${esc(a.name)}" placeholder="请输入区域名称"></div></div>
      <div class="form-row"><div class="fl"><span class="pin-num pin-inline"><span>2</span></span>所属区域<span class="req">*</span></div><div class="fr">
        <div class="cascader">
          <select class="select" id="m-prov"><option>湖北省</option><option>湖南省</option><option>河南省</option></select>
          <select class="select" id="m-city"><option>武汉市</option><option>宜昌市</option><option>襄阳市</option></select>
          <select class="select" id="m-dist"><option>江汉区</option><option>武昌区</option><option>洪山区</option><option>江岸区</option></select>
        </div></div></div>
      <div class="form-row"><div class="fl"><span class="pin-num pin-inline"><span>3</span></span>安管员姓名</div><div class="fr"><input class="input" id="m-officer" value="${esc(a.officer)}" placeholder="请输入安管员姓名（选填）"></div></div>
      <div class="form-row"><div class="fl"><span class="pin-num pin-inline"><span>3</span></span>联系方式</div><div class="fr"><input class="input" id="m-phone" value="${esc(a.phone)}" placeholder="请输入联系方式（选填）"></div></div>
      <div class="form-row"><div class="fl"><span class="pin-num pin-inline"><span>4</span></span>地图定位</div><div class="fr">
        <div class="map-box"><div class="grid"></div><div class="road" style="left:0;top:55%;width:100%;height:6px;transform:rotate(-8deg)"></div><div class="road" style="left:40%;top:0;width:6px;height:100%;transform:rotate(6deg)"></div><div class="pin">${icon('map-pin')}</div><div class="scale">500m</div></div>
        <div class="coord-row">
          <div class="coord"><div class="cl">北纬</div><input class="input" id="m-north" value="${a.bounds.north}"></div>
          <div class="coord"><div class="cl">南纬</div><input class="input" id="m-south" value="${a.bounds.south}"></div>
          <div class="coord"><div class="cl">东经</div><input class="input" id="m-east" value="${a.bounds.east}"></div>
          <div class="coord"><div class="cl">西经</div><input class="input" id="m-west" value="${a.bounds.west}"></div>
        </div>
        <div class="form-tip">支持矩形绘制，点击地图确定左上角和右下角</div>
      </div></div>`;
    const foot = `<button class="btn">取消</button><button class="btn btn-primary" id="m-ok">确定</button>`;
    const { node, close } = openModal(isEdit ? '编辑区域' : '新增区域', body, foot);
    $('#m-prov').value = a.province; $('#m-city').value = a.city; $('#m-dist').value = a.district;
    node.querySelectorAll('.btn')[0].onclick = close;
    $('#m-ok').onclick = () => {
      const name = $('#m-name').value.trim();
      if (!name) { toast('请输入区域名称', 'error'); return; }
      const data = {
        id: a.id, name,
        province: $('#m-prov').value, city: $('#m-city').value, district: $('#m-dist').value,
        region: `${$('#m-prov').value}${$('#m-city').value}${$('#m-dist').value}`,
        officer: $('#m-officer').value.trim(), phone: $('#m-phone').value.trim(),
        bounds: { north: +$('#m-north').value, south: +$('#m-south').value, east: +$('#m-east').value, west: +$('#m-west').value },
      };
      const fn = isEdit ? API.updateArea(data) : API.createArea(data);
      fn.then(() => { close(); toast(isEdit ? '编辑成功' : '新增成功'); onDone && onDone(); });
    };
  }
  // 区域查看弹窗
  function modalAreaView(a) {
    let boundExpanded = false;
    const renderBound = () => {
      const bound = DB.enterprises.filter((e) => e.areaId === a.id);
      if (!bound.length) return '<span style="color:#999">暂无</span>';
      const tags = bound.map((e) => `<span class="tag tag-blue" style="margin:2px 4px 2px 0">${esc(e.name)}<span style="margin-left:4px;cursor:pointer" data-remove="${e.id}">×</span></span>`).join('');
      const wrapStyle = boundExpanded ? '' : 'max-height:28px;overflow:hidden;position:relative;';
      const btn = `<div style="text-align:right;margin-top:4px"><button class="btn" id="bound-toggle" style="font-size:12px;padding:2px 8px">${boundExpanded ? '收起' : '展开'}</button></div>`;
      return `<div id="bound-wrap" style="${wrapStyle}">${tags}</div>${btn}`;
    };
    const bindUnbindHandlers = () => {
      node.querySelectorAll('[data-remove]').forEach((el) => {
        el.onclick = () => {
          const rid = Number(el.dataset.remove);
          const target = DB.enterprises.find((e) => e.id === rid);
          if (target) target.areaId = null;
          $('#bound-list').innerHTML = renderBound();
          bindUnbindHandlers();
          refreshSelect();
        };
      });
      const toggleBtn = $('#bound-toggle');
      if (toggleBtn) {
        toggleBtn.onclick = () => {
          boundExpanded = !boundExpanded;
          $('#bound-list').innerHTML = renderBound();
          bindUnbindHandlers();
        };
      }
    };
    const body = `
      <div class="detail-grid">
        <div class="detail-item"><div class="dk">区域名称</div><div class="dv">${esc(a.name)}</div></div>
        <div class="detail-item"><div class="dk">所属区域</div><div class="dv">${esc(a.region)}</div></div>
        <div class="detail-item"><div class="dk">区域安管员</div><div class="dv">${esc(a.officer)}</div></div>
        <div class="detail-item"><div class="dk">联系方式</div><div class="dv">${esc(a.phone)}</div></div>
        <div class="detail-item"><div class="dk">状态</div><div class="dv">${statusTag(a.status)}</div></div>
        <div class="detail-item"><div class="dk">作业数量</div><div class="dv">${a.workCount}</div></div>
      </div>
      <div style="margin-top:12px">
        <div class="dk" style="font-size:13px;color:#606266;margin-bottom:4px">绑定企业</div>
        <div id="bound-list">${renderBound()}</div>
        <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
          <input class="input" id="bind-search" placeholder="输入企业名称搜索" style="flex:1">
          <select class="select" id="bind-select" style="flex:1;min-width:140px"></select>
          <button class="btn btn-primary" id="bind-confirm" style="flex-shrink:0">绑定</button>
        </div>
      </div>
      <div style="margin-top:16px"><div class="map-box" style="height:180px"><div class="grid"></div><div class="road" style="left:0;top:55%;width:100%;height:6px;transform:rotate(-8deg)"></div><div class="road" style="left:40%;top:0;width:6px;height:100%;transform:rotate(6deg)"></div><div class="pin">${icon('map-pin')}</div><div class="scale">500m</div></div></div>`;
    const foot = `<button class="btn btn-primary" id="area-close">关闭</button>`;
    const { node, close } = openModal('区域详情', body, foot);

    // 右侧黄底说明面板
    const sidePanel = h(`<div class="side-desc-panel">
      <div class="sdp-title">绑定企业</div>
      <ul>
        <li><b>1·绑定企业展示：</b>该区域绑定的所有企业，展示一行，超出一行则变成折叠层，点击展开按钮显示所有企业。</li>
        <li><b>2·搜索与绑定：</b>支持搜索企业和下拉框选择企业进行选定企业绑定（企业数据源为：管理总台所有已认证企业中打上动火标记的企业，本期为试点，可手动给部分企业在库里打上标签）。</li>
      </ul>
    </div>`);
    document.body.appendChild(sidePanel);
    // 关闭时移除侧边面板
    const removePanel = () => sidePanel.remove();
    $('#area-close').onclick = () => { removePanel(); close(); };
    node.querySelector('.close').addEventListener('click', removePanel);
    node.addEventListener('click', (e) => { if (e.target === node) removePanel(); });

    const searchInput = $('#bind-search');
    const selectEl = $('#bind-select');
    const refreshSelect = (kw = '') => {
      const list = DB.enterprises.filter((e) => e.areaId !== a.id && (!kw || e.name.includes(kw)));
      selectEl.innerHTML = '<option value="">请选择企业</option>' + list.map((e) => `<option value="${e.id}">${esc(e.name)}</option>`).join('');
    };
    refreshSelect();
    searchInput.oninput = () => refreshSelect(searchInput.value.trim());
    bindUnbindHandlers();

    $('#bind-confirm').onclick = () => {
      const kw = searchInput.value.trim();
      let eid = selectEl.value;
      if (!eid && kw) {
        const match = DB.enterprises.find((e) => e.name === kw && e.areaId !== a.id);
        if (match) eid = match.id;
      }
      if (!eid) { toast('请选择或输入要绑定的企业', 'error'); return; }
      const ent = DB.enterprises.find((e) => e.id === Number(eid));
      API.bindEnterprise({ areaId: a.id, enterpriseId: Number(eid) }).then(() => {
        ent.areaId = a.id;
        toast('绑定成功');
        $('#bound-list').innerHTML = renderBound();
        searchInput.value = '';
        refreshSelect();
        bindUnbindHandlers();
      });
    };
  }

  // ============ 企业管理 ============
  function viewEnterprises() {
    const view = $('#view');
    let state = { areaId: '全部', page: 1, pageSize: 10 };
    function render() {
      view.innerHTML = `
        <div class="card">
          <div class="toolbar">
            <div class="field"><span class="label">作业区域</span>
              <select class="select" id="f-area"><option>全部</option></select></div>
            <div class="spacer"></div>
            <button class="btn btn-primary" id="btn-add">${icon('plus')}新增</button>
          </div>
          <div id="tbl"></div>
        </div>`;
      const sel = $('#f-area');
      DB.areas.forEach((a) => sel.add(new Option(a.name, a.id)));
      sel.value = state.areaId;
      sel.onchange = (e) => { state.areaId = e.target.value; state.page = 1; renderTable2(); };
      $('#btn-add').onclick = () => modalBindEnterprise(render);
      renderTable2();
    }
    function renderTable2() {
      API.listEnterprises({ areaId: state.areaId }).then((res) => {
        const rows = res.data;
        const columns = [
          { title: '企业名称', key: 'name' },
          { title: '所属区域', render: (r) => esc((DB.areas.find((a) => a.id === r.areaId) || {}).name || '—') },
          { title: '法人名称', key: 'legalPerson' },
          { title: '企业地址', key: 'address' },
          { title: '操作', render: () => `<div class="actions"><button class="btn-text danger" data-act="unbind">解绑</button></div>` },
        ];
        const { node } = renderTable({
          columns, rows, page: state.page, pageSize: state.pageSize,
          onAction: (act, id) => {
            const r = rows.find((x) => x.id === id);
            if (act === 'unbind') {
              confirmDialog(`确定解绑企业「${r.name}」吗？`, () => API.unbindEnterprise(id).then(() => { toast('解绑成功'); render(); }));
            }
          },
        });
        node.querySelectorAll('[data-pg]').forEach((b) => b.onclick = () => { const p = b.dataset.pg; state.page = (p === 'prev' ? state.page - 1 : p === 'next' ? state.page + 1 : Number(p)); if (state.page >= 1) renderTable2(); });
        const slot = $('#tbl'); slot.innerHTML = ''; slot.appendChild(node);
        // 字段说明
        const desc = h(`<div class="card desc-panel desc-panel-sm">
          <div class="card-title">字段说明</div>
          <ul>
            <li><b>1·作业区域搜索：</b>下拉框展示当前G端所有区域数据和全部，选择后立即生效出现搜索结果，搜索框里加上叉号，点击叉号清除搜索条件立即还原数据。</li>
            <li><b>2·列表数据：</b>数据来源为G端手动新增。</li>
            <li><b>3·解绑：</b>解绑时需判断当前企业是否有进行中的作业，若有则无法解绑并给出提示。</li>
          </ul>
        </div>`);
        slot.parentElement.appendChild(desc);
        // 新增：字段说明
        const descAdd = h(`<div class="card desc-panel desc-panel-sm">
          <div class="card-title">新增</div>
          <ul>
            <li><b>新增：</b>选择区域和企业后提交，即可完成该企业与该区域的绑定。</li>
          </ul>
        </div>`);
        slot.parentElement.appendChild(descAdd);
      });
    }
    render();
  }
  // 新增绑定企业弹窗
  function modalBindEnterprise(onDone) {
    const areaOpts = DB.areas.map((a) => `<option value="${a.id}">${esc(a.name)}</option>`).join('');
    const entOpts = DB.enterprises.map((e) => `<option value="${e.id}">${esc(e.name)}</option>`).join('');
    const body = `
      <div class="form-row"><div class="fl">区域选择<span class="req">*</span></div><div class="fr"><select class="select" id="b-area">${areaOpts}</select></div></div>
      <div class="form-row"><div class="fl">企业选择<span class="req">*</span></div><div class="fr"><select class="select" id="b-ent"><option value="">请选择企业</option>${entOpts}</select></div></div>`;
    const foot = `<button class="btn">取消</button><button class="btn btn-primary" id="b-ok">确认绑定</button>`;
    const { node, close } = openModal('新增绑定', body, foot);
    node.querySelectorAll('.btn')[0].onclick = close;
    $('#b-ok').onclick = () => {
      const areaId = $('#b-area').value; const enterpriseId = $('#b-ent').value;
      if (!enterpriseId) { toast('请选择企业', 'error'); return; }
      API.bindEnterprise({ areaId, enterpriseId }).then(() => { close(); toast('绑定成功'); onDone && onDone(); });
    };
  }
  // 企业二维码弹窗
  function modalEnterpriseQR(ent) {
    const areaName = (DB.areas.find((a) => a.id === ent.areaId) || {}).name || '—';
    // 基于 id 生成确定性伪二维码矩阵（21x21）
    const N = 21, cell = 12, size = N * cell;
    let seed = ent.id * 2654435761 % 2147483647;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const isFinder = (r, c) => {
      const inBox = (br, bc) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
      return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
    };
    let cells = '';
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (isFinder(r, c)) continue;
        if (rnd() > 0.5) cells += `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}" fill="#000"/>`;
      }
    }
    // 三个定位角
    const finder = (br, bc) => {
      const x = bc * cell, y = br * cell;
      return `<rect x="${x}" y="${y}" width="${7 * cell}" height="${7 * cell}" fill="#000"/>
        <rect x="${x + cell}" y="${y + cell}" width="${5 * cell}" height="${5 * cell}" fill="#fff"/>
        <rect x="${x + 2 * cell}" y="${y + 2 * cell}" width="${3 * cell}" height="${3 * cell}" fill="#000"/>`;
    };
    const qrSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="background:#fff">
      ${cells}${finder(0, 0)}${finder(0, N - 7)}${finder(N - 7, 0)}</svg>`;
    const body = `
      <div style="text-align:center">
        <div style="display:inline-block;padding:16px;background:#fff;border:1px solid #ebeef5;border-radius:8px">${qrSvg}</div>
        <div style="margin-top:16px;font-size:16px;font-weight:600;color:#303133">${esc(ent.name)}</div>
        <div style="margin-top:4px;font-size:13px;color:#909399">所属区域：${esc(areaName)} · 法人：${esc(ent.legalPerson)}</div>
        <div style="margin-top:4px;font-size:13px;color:#909399">地址：${esc(ent.address)}</div>
      </div>`;
    const foot = `<button class="btn">关闭</button><button class="btn btn-primary" id="qr-save">下载二维码</button>`;
    const { node, close } = openModal('企业二维码', body, foot);
    node.querySelectorAll('.btn')[0].onclick = close;
    $('#qr-save').onclick = () => {
      const link = document.createElement('a');
      link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(qrSvg);
      link.download = `企业二维码_${ent.name}.svg`;
      link.click();
      toast('二维码已下载');
    };
  }

  // ============ 作业管理（G端） ============
  function viewTasks() {
    worksView({ scope: 'g', filters: ['enterprise', 'area', 'type', 'status'] });
  }
  function viewZoneTasks() {
    worksView({ scope: 'enterprise', filters: ['type', 'status'] });
  }
  function worksView(opt) {
    const view = $('#view');
    let state = { enterprise: '全部', area: '全部', type: '全部', status: '全部', page: 1, pageSize: 10 };
    function render() {
      const filtersHtml = [];
      if (opt.filters.includes('enterprise')) filtersHtml.push(`<div class="field"><span class="label">企业</span><select class="select" id="f-ent"><option>全部</option></select></div>`);
      if (opt.filters.includes('area')) filtersHtml.push(`<div class="field"><span class="label">作业区域</span><select class="select" id="f-area"><option>全部</option></select></div>`);
      if (opt.filters.includes('type')) filtersHtml.push(`<div class="field"><span class="label">作业类型</span><select class="select" id="f-type"><option>全部</option><option>动火</option><option>高处</option><option>临电</option></select></div>`);
      if (opt.filters.includes('status')) filtersHtml.push(`<div class="field"><span class="label">作业状态</span><select class="select" id="f-status"><option>全部</option><option>待审核</option><option>待开始</option><option>进行中</option><option>已完成</option><option>已拒绝</option><option>已结束</option></select></div>`);
      view.innerHTML = `<div class="card"><div class="toolbar">${filtersHtml.join('')}<div class="spacer"></div><button class="btn" id="f-reset">${icon('refresh')}重置</button></div><div id="tbl"></div></div>`;
      if (opt.filters.includes('enterprise')) { const s = $('#f-ent'); DB.enterprises.forEach((e) => s.add(new Option(e.name, e.id))); s.value = state.enterprise; s.onchange = (e) => { state.enterprise = e.target.value; state.page = 1; renderTbl(); }; }
      if (opt.filters.includes('area')) { const s = $('#f-area'); DB.areas.forEach((a) => s.add(new Option(a.name, a.id))); s.value = state.area; s.onchange = (e) => { state.area = e.target.value; state.page = 1; renderTbl(); }; }
      if (opt.filters.includes('type')) { const s = $('#f-type'); s.value = state.type; s.onchange = (e) => { state.type = e.target.value; state.page = 1; renderTbl(); }; }
      if (opt.filters.includes('status')) { const s = $('#f-status'); s.value = state.status; s.onchange = (e) => { state.status = e.target.value; state.page = 1; renderTbl(); }; }
      $('#f-reset').onclick = () => { state = { enterprise: '全部', area: '全部', type: '全部', status: '全部', page: 1, pageSize: 10 }; render(); };
      renderTbl();
    }
    function renderTbl() {
      API.listWorks({ enterpriseId: state.enterprise, areaId: state.area, type: state.type, status: state.status }).then((res) => {
        const rows = res.data;
        const entName = (id) => (DB.enterprises.find((e) => e.id === id) || {}).name || '—';
        const areaName = (id) => (DB.areas.find((a) => a.id === id) || {}).name || '—';
        const storeName = (id) => (DB.stores.find((s) => s.id === id) || {}).name || '—';
        const columns = [
          { title: '作业名称', key: 'name' },
          { title: '作业类型', render: (r) => typeTag(r.type) },
          { title: '企业', render: (r) => esc(entName(r.enterpriseId)) },
          { title: '作业区域', render: (r) => esc(areaName(r.areaId)) },
          { title: '门店名称', render: (r) => esc(storeName(r.storeId)) },
          { title: '施工地址', key: 'address' },
          { title: '施工单位', key: 'contractor' },
          { title: '施工负责人', key: 'leader' },
          { title: '施工人数', key: 'workerCount' },
          { title: '开始时间', key: 'startTime' },
          { title: '结束时间', key: 'endTime' },
          { title: '作业状态', render: (r) => statusTag(r.status) },
          { title: '操作', render: () => `<div class="actions"><button class="btn-text" data-act="view">查看</button></div>` },
        ];
        const { node } = renderTable({
          columns, rows, page: state.page, pageSize: state.pageSize,
          onAction: (act, id) => { const r = rows.find((x) => x.id === id); if (act === 'view') modalWorkDetail(r, opt.scope); },
        });
        node.querySelectorAll('[data-pg]').forEach((b) => b.onclick = () => { const p = b.dataset.pg; state.page = (p === 'prev' ? state.page - 1 : p === 'next' ? state.page + 1 : Number(p)); if (state.page >= 1) renderTbl(); });
        const slot = $('#tbl'); slot.innerHTML = ''; slot.appendChild(node);
        // G端作业管理字段说明
        if (opt.scope === 'g') {
          const desc = h(`<div class="card desc-panel desc-panel-sm">
            <div class="card-title">字段说明</div>
            <ul>
              <li><b>1·搜索条件：</b>企业/作业区域取G端的所有企业和区域数据；选择作业后，企业只展示该区域下的数据。作业类型固定展示全部、动火、高处、临电，目前无配置入口；所有框选择内容后立即生效，点击叉号清除搜索条件且立即生效。</li>
              <li><b>2·列表数据来源：</b>所有数据信息全部都是作业人员扫描二维码录入的作业信息产生，作业人员提交完信息后，在G端和企业端都会展示。</li>
              <li><b>3·状态：</b>待审核、待开始、进行中、已完成、已拒绝、已结束。</li>
            </ul>
          </div>`);
          slot.parentElement.appendChild(desc);
        }
        // 企业端作业管理字段说明
        if (opt.scope === 'enterprise') {
          const desc = h(`<div class="card desc-panel desc-panel-sm">
            <div class="card-title">字段说明</div>
            <ul>
              <li><b>作业管理所有数据来源都是作业人员扫描二维码录入的信息上传。</b></li>
              <li><b>1·作业类型条件搜索：</b>作业类型有动火，高处，临电，但目前只有动火可以三个都放进去。</li>
              <li><b>2·作业状态条件搜索：</b>待审核，待开始，进行中，已完成，已拒绝，已结束。</li>
              <li><b>待审核：</b>作业人员上传的作业信息初始为待审核状态。</li>
              <li><b>待开始：</b>审核通过但未到作业开始时间。</li>
              <li><b>进行中：</b>作业已处于开始时间和结束时间之间。</li>
              <li><b>已完成：</b>作业已超过了结束时间。</li>
              <li><b>已拒绝：</b>审核不通过和不通过且持续到在作业结束时间之前。</li>
              <li><b>已结束：</b>审核不通过或待审核且超过了作业结束时间了。</li>
              <li><b>搜索方式都是选择后立即生效，搜索框有叉号，点击叉号清除搜索条件且立即生效。</li>
            </ul>
          </div>`);
          slot.parentElement.appendChild(desc);
        }
      });
    }
    render();
  }

  // 作业详情弹窗（含 施工人列表 / 审核记录 / 现场核查记录）
  const PHOTO_POOL = {
    '动火作业': ['assets/work-hot-1.jpg', 'assets/work-hot-2.jpg', 'assets/work-hot-3.jpg'],
    '高处作业': ['assets/work-high-1.jpg', 'assets/work-high-2.jpg'],
    '临时用电': ['assets/work-electric-1.jpg', 'assets/work-electric-2.jpg'],
  };
  const VERIFY_POOL = ['assets/work-verify-1.jpg', 'assets/work-verify-2.jpg'];
  function renderPhotoGallery(workType, count, pool) {
    if (!count) return '<div class="photo-gallery-empty">暂无图片</div>';
    const images = pool || PHOTO_POOL[workType] || VERIFY_POOL;
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(`<div class="photo-item" onclick="window.open('${images[i % images.length]}','_blank')"><img src="${images[i % images.length]}" alt="现场图片${i + 1}"></div>`);
    }
    return `<div class="photo-gallery">${items.join('')}</div>`;
  }
  function modalWorkDetail(w, scope) {
    const entName = (DB.enterprises.find((e) => e.id === w.enterpriseId) || {}).name || '—';
    const storeName = (DB.stores.find((s) => s.id === w.storeId) || {}).name || '—';
    const base = `
      <div class="detail-section">
        <div class="ds-title">作业信息</div>
        <div class="detail-grid">
          <div class="detail-item"><div class="dk">作业名称</div><div class="dv">${esc(w.name)}</div></div>
          <div class="detail-item"><div class="dk">作业类型</div><div class="dv">${typeTag(w.type)}</div></div>
          <div class="detail-item"><div class="dk">企业名称</div><div class="dv">${esc(entName)}</div></div>
          <div class="detail-item"><div class="dk">门店名称</div><div class="dv">${esc(storeName)}</div></div>
          <div class="detail-item"><div class="dk">施工地址</div><div class="dv">${esc(w.address)}</div></div>
          <div class="detail-item"><div class="dk">施工单位</div><div class="dv">${esc(w.contractor)}</div></div>
          <div class="detail-item"><div class="dk">施工负责人</div><div class="dv">${esc(w.leader)}</div></div>
          <div class="detail-item"><div class="dk">负责人手机号</div><div class="dv">${esc(w.leaderPhone)}</div></div>
          <div class="detail-item"><div class="dk">开始时间</div><div class="dv">${esc(w.startTime)}</div></div>
          <div class="detail-item"><div class="dk">结束时间</div><div class="dv">${esc(w.endTime)}</div></div>
          <div class="detail-item"><div class="dk">作业状态</div><div class="dv">${statusTag(w.status)}</div></div>
          <div class="detail-item"><div class="dk">动火票</div><div class="dv">${(() => { const ft = Array.isArray(w.audit) ? w.audit.find(a => a.fireTicket && a.fireTicket !== '—') : null; return ft ? '<img class="fire-ticket-img" src="assets/work-fireticket.jpg" onclick="window.open(\'assets/work-fireticket.jpg\',\'_blank\')">' : '<span class="tag tag-danger">未上传</span>'; })()}</div></div>
        </div>
      </div>`;
    const wcols = ['姓名', '手机号', '身份证号', '工作内容', '是否需要持证', '是否持证', '证件照'];
    const CERT_PHOTOS = ['assets/cert-photo-1.jpg', 'assets/cert-photo-2.jpg', 'assets/cert-photo-3.jpg'];
    const wrows = w.workers.map((p, i) => {
      let certCell;
      if (p.hasCert === '是') {
        const certImg = p.name === '张师傅' ? 'assets/cert-fire-1.jpg' : CERT_PHOTOS[i % CERT_PHOTOS.length];
        certCell = `<img src="${certImg}" alt="证件照" style="width:40px;height:48px;object-fit:cover;border-radius:4px;cursor:pointer" onclick="window.open('${certImg}','_blank')">`;
      } else {
        certCell = '—';
      }
      return `<tr><td>${esc(p.name)}</td><td>${esc(p.phone)}</td><td class="mono">${esc(p.idCard)}</td><td>${esc(p.task)}</td><td>${esc(p.needCert)}</td><td>${p.hasCert === '否' ? '—' : esc(p.hasCert)}</td><td>${certCell}</td></tr>`;
    }).join('');
    const workers = `
      <div class="detail-section">
        <div class="ds-title">施工人列表</div>
        <div class="table-wrap"><table class="tbl"><thead><tr>${wcols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${wrows}</tbody></table></div>
      </div>`;
    const audits = Array.isArray(w.audit) ? w.audit : (w.audit ? [w.audit] : []);
    const audit = `
      <div class="detail-section">
        <div class="ds-title">审核记录 <span class="rec-count">${audits.length}条</span></div>
        ${audits.length === 0 ? '<div class="rec-empty">暂无审核记录</div>' : audits.map((a, i) => `
          <div class="rec-card ${i === 0 ? 'open' : ''}">
            <div class="rec-head">
              <div class="rec-summary"><span class="rec-idx">第${i + 1}条</span>${statusTag(a.status)}<span class="rec-time">${esc(a.time || '—')}</span><span class="rec-name">${esc(a.name)}</span></div>
              <span class="rec-arrow">${icon('chevron-down')}</span>
            </div>
            <div class="rec-body">
              <div class="detail-grid">
                <div class="detail-item"><div class="dk">审核时间</div><div class="dv">${esc(a.time || '—')}</div></div>
                <div class="detail-item"><div class="dk">安全员姓名</div><div class="dv">${esc(a.name)}</div></div>
                <div class="detail-item"><div class="dk">手机号</div><div class="dv">${esc(a.phone)}</div></div>
                <div class="detail-item"><div class="dk">作业区域</div><div class="dv">${esc(a.org)}</div></div>
                <div class="detail-item"><div class="dk">现场图片</div><div class="dv">${renderPhotoGallery(w.type, a.photos)}</div></div>
                <div class="detail-item"><div class="dk">现场视频</div><div class="dv">${icon('video')} ${a.videos} 个</div></div>
                <div class="detail-item"><div class="dk">动火作业证书</div><div class="dv">${esc(a.fireCert)}</div></div>
                <div class="detail-item"><div class="dk">审核状态</div><div class="dv">${statusTag(a.status)}</div></div>
                <div class="detail-item"><div class="dk">不通过原因</div><div class="dv">${esc(a.reason || '—')}</div></div>
                <div class="detail-item"><div class="dk">检测记录</div><div class="dv">${esc(a.records)}</div></div>
              </div>
            </div>
          </div>`).join('')}
      </div>`;
    const verifies = Array.isArray(w.verify) ? w.verify : (w.verify ? [w.verify] : []);
    const verify = `
      <div class="detail-section">
        <div class="ds-title">现场核查记录 <span class="rec-count">${verifies.length}条</span></div>
        ${verifies.length === 0 ? '<div class="rec-empty">暂无核查记录</div>' : verifies.map((v, i) => `
          <div class="rec-card ${i === 0 ? 'open' : ''}">
            <div class="rec-head">
              <div class="rec-summary"><span class="rec-idx">第${i + 1}条</span>${statusTag(v.status)}<span class="rec-time">${esc(v.time || '—')}</span><span class="rec-name">${esc(v.name)}</span></div>
              <span class="rec-arrow">${icon('chevron-down')}</span>
            </div>
            <div class="rec-body">
              <div class="detail-grid">
                <div class="detail-item"><div class="dk">核查时间</div><div class="dv">${esc(v.time || '—')}</div></div>
                <div class="detail-item"><div class="dk">核查人姓名</div><div class="dv">${esc(v.name)}</div></div>
                <div class="detail-item"><div class="dk">手机号</div><div class="dv">${esc(v.phone)}</div></div>
                <div class="detail-item"><div class="dk">作业区域</div><div class="dv">${esc(v.org)}</div></div>
                <div class="detail-item"><div class="dk">现场图片</div><div class="dv">${renderPhotoGallery(w.type, v.photos, VERIFY_POOL)}</div></div>
                <div class="detail-item"><div class="dk">现场视频</div><div class="dv">${icon('video')} ${v.videos} 个</div></div>
                <div class="detail-item"><div class="dk">核查状态</div><div class="dv">${statusTag(v.status)}</div></div>
                <div class="detail-item"><div class="dk">不通过原因</div><div class="dv">${esc(v.reason || '—')}</div></div>
                <div class="detail-item"><div class="dk">检测记录</div><div class="dv">${esc(v.records)}</div></div>
              </div>
            </div>
          </div>`).join('')}
      </div>`;
    const { node } = openModal('作业详情', base + workers + audit + verify, `<button class="btn btn-primary" onclick="this.closest('.overlay').remove()">关闭</button>`, true);
    node.querySelectorAll('.rec-card .rec-head').forEach((head) => {
      head.onclick = () => head.parentElement.classList.toggle('open');
    });
    // 右侧浮动说明面板
    const aiItems = scope === 'enterprise' ? `
        <li><b>3·审核记录：</b>小程序上传过来的数据，其中现场图片和现场视频调用智慧应急，先由AI判断是否存在违规，如果有直接判定为审核不通过，折叠行的状态标记和审核状态都自动显示为已拒绝，且自动回填AI返回的拒绝原因在【不通过原因】字段，检测记录回填ai识别结果，审核通过时如果填写了内容则展示输入内容，未填写则展示ai结果；拒绝原因展示审核拒绝时填写的内容，若因为ai检测被判定的不通过则展示ai结果。</li>
        <li><b>4·现场核查记录：</b>同审核记录，AI识别图片视频，返回不通过原因，状态标记为【异常】，目前仅展示异常不做后续处理，后续可能会增加异常告警之类的功能，字段【检测记录】由安管员输入信息上传。</li>` : '';
    const sidePanel = h(`<div class="side-desc-panel">
      <div class="sdp-title">查看</div>
      <ul>
        <li><b>1·作业信息/施工人列表：</b>作业信息全部来自作业人员扫描二维码上传的数据。</li>
        <li><b>2·审核和核查记录：</b>审核和核查记录展示安管员审核结果和现场核查结果，安管员可以是企业安管员也可以是G端安管员，基本都是企业安管员，G端只是有这个安管员而已。审核/核查记录都可以有多条，点击查看按钮，默认展示第一条，其余记录自动折叠。</li>
        ${aiItems}
      </ul>
    </div>`);
    document.body.appendChild(sidePanel);
    const closeFn = () => sidePanel.remove();
    node.addEventListener('click', (e) => { if (e.target === node || e.target.classList.contains('close')) closeFn(); });
    // 扩展原关闭按钮
    const closeBtn = node.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeFn);
    }
    const closeFooterBtn = node.querySelector('.modal-foot .btn');
    if (closeFooterBtn) {
      closeFooterBtn.addEventListener('click', closeFn);
    }
  }

  // ============ 门店管理 ============
  function viewStores() {
    const view = $('#view');
    let state = { page: 1, pageSize: 10 };
    function render() {
      view.innerHTML = `<div class="card"><div class="toolbar"><div class="spacer"></div><button class="btn btn-primary" id="btn-add">${icon('plus')}新增</button></div><div id="tbl"></div></div>`;
      $('#btn-add').onclick = () => modalStore(null, render);
      renderTbl();
    }
    function renderTbl() {
      API.listStores().then((res) => {
        const rows = res.data;
        const columns = [
          { title: '门店名称', key: 'name' },
          { title: '门店地址', key: 'address' },
          { title: '门店管理员', key: 'manager' },
          { title: '门店联系方式', key: 'phone' },
          { title: '门店描述', key: 'desc' },
          { title: '操作', render: () => `<div class="actions"><button class="btn-text" data-act="view">查看</button><button class="btn-text" data-act="edit">修改</button><button class="btn-text danger" data-act="delete">删除</button></div>` },
        ];
        const { node } = renderTable({
          columns, rows, page: state.page, pageSize: state.pageSize,
          onAction: (act, id) => {
            const r = rows.find((x) => x.id === id);
            if (act === 'view' || act === 'edit') modalStore(r, render);
            else if (act === 'delete') confirmDialog(`确定删除门店「${r.name}」吗？`, () => API.deleteStore(id).then(() => { toast('删除成功'); render(); }));
          },
        });
        node.querySelectorAll('[data-pg]').forEach((b) => b.onclick = () => { const p = b.dataset.pg; state.page = (p === 'prev' ? state.page - 1 : p === 'next' ? state.page + 1 : Number(p)); if (state.page >= 1) renderTbl(); });
        const slot = $('#tbl'); slot.innerHTML = ''; slot.appendChild(node);
        // 门店管理：字段说明
        const desc = h(`<div class="card desc-panel desc-panel-sm">
          <div class="card-title">门店管理</div>
          <ul>
            <li><b>门店管理是在当前企业下，创建具体作业位置。</b></li>
            <li><b>1·新增：</b>所属企业自动回填当前登录的企业，置灰；门店名称、地址为必填；点击查看和修改数据回填与新增页面完全一致。</li>
            <li><b>2·删除：</b>删除时需判断当前门店是否有对应进行中的作业，如果有则无法删除。</li>
          </ul>
        </div>`);
        slot.parentElement.appendChild(desc);
      });
    }
    render();
  }
  function modalStore(s, onDone) {
    const isEdit = !!s;
    const d = s || { name: '', address: '', manager: '', phone: '', enterpriseId: '', desc: '' };
    const entOpts = DB.enterprises.map((e) => `<option value="${e.id}" ${d.enterpriseId === e.id ? 'selected' : ''}>${esc(e.name)}</option>`).join('');
    const body = `
      <div class="form-row"><div class="fl">门店名称<span class="req">*</span></div><div class="fr"><input class="input" id="s-name" value="${esc(d.name)}" placeholder="请输入门店名称"></div></div>
      <div class="form-row"><div class="fl">门店地址<span class="req">*</span></div><div class="fr"><input class="input" id="s-addr" value="${esc(d.address)}" placeholder="请输入门店地址"></div></div>
      <div class="form-row"><div class="fl">门店管理员</div><div class="fr"><input class="input" id="s-mgr" value="${esc(d.manager)}" placeholder="请输入门店管理员"></div></div>
      <div class="form-row"><div class="fl">门店联系方式</div><div class="fr"><input class="input" id="s-phone" value="${esc(d.phone)}" placeholder="请输入联系方式"></div></div>
      <div class="form-row"><div class="fl">所属企业<span class="req">*</span></div><div class="fr"><select class="select" id="s-ent"><option value="">请选择企业</option>${entOpts}</select></div></div>
      <div class="form-row"><div class="fl">门店描述</div><div class="fr"><textarea class="input" id="s-desc" placeholder="请输入门店描述">${esc(d.desc)}</textarea></div></div>`;
    const foot = `<button class="btn">取消</button><button class="btn btn-primary" id="s-ok">确定</button>`;
    const { node, close } = openModal(isEdit ? '修改门店' : '新增门店', body, foot);
    node.querySelectorAll('.btn')[0].onclick = close;
    $('#s-ok').onclick = () => {
      const data = {
        id: d.id, name: $('#s-name').value.trim(), address: $('#s-addr').value.trim(),
        manager: $('#s-mgr').value.trim(), phone: $('#s-phone').value.trim(),
        enterpriseId: Number($('#s-ent').value), desc: $('#s-desc').value.trim(),
      };
      if (!data.name || !data.address || !data.enterpriseId) { toast('请填写必填项', 'error'); return; }
      const fn = isEdit ? API.updateStore(data) : API.createStore(data);
      fn.then(() => { close(); toast(isEdit ? '修改成功' : '新增成功'); onDone && onDone(); });
    };
  }

  // ============ 安管员管理 ============
  function viewOfficers() {
    const view = $('#view');
    let state = { page: 1, pageSize: 10 };
    function render() {
      view.innerHTML = `<div class="card"><div class="toolbar"><div class="spacer"></div><button class="btn" id="btn-qr">${icon('qrcode')}生成二维码</button><button class="btn btn-primary" id="btn-add">${icon('plus')}新增</button></div><div id="tbl"></div></div>`;
      $('#btn-qr').onclick = () => modalOfficerQR();
      $('#btn-add').onclick = () => modalOfficer(render);
      renderTbl();
    }
    function renderTbl() {
      API.listOfficers().then((res) => {
        const rows = res.data;
        const columns = [
          { title: '姓名', key: 'name' },
          { title: '手机号', key: 'phone' },
          { title: '创建时间', key: 'createdAt' },
          { title: '操作', render: () => `<div class="actions"><button class="btn-text" data-act="view">查看</button><button class="btn-text" data-act="edit">修改</button><button class="btn-text danger" data-act="delete">删除</button></div>` },
        ];
        const { node } = renderTable({
          columns, rows, page: state.page, pageSize: state.pageSize,
          onAction: (act, id) => {
            const r = rows.find((x) => x.id === id);
            if (act === 'view') { openModal('安管员详情', `<div class="detail-grid"><div class="detail-item"><div class="dk">姓名</div><div class="dv">${esc(r.name)}</div></div><div class="detail-item"><div class="dk">手机号</div><div class="dv">${esc(r.phone)}</div></div><div class="detail-item"><div class="dk">创建时间</div><div class="dv">${esc(r.createdAt)}</div></div></div>`, `<button class="btn btn-primary" onclick="this.closest('.overlay').remove()">关闭</button>`); }
            else if (act === 'edit') modalOfficerEdit(r, render);
            else if (act === 'delete') confirmDialog(`确定删除安管员「${r.name}」吗？`, () => API.deleteOfficer(id).then(() => { toast('删除成功'); render(); }));
          },
        });
        node.querySelectorAll('[data-pg]').forEach((b) => b.onclick = () => { const p = b.dataset.pg; state.page = (p === 'prev' ? state.page - 1 : p === 'next' ? state.page + 1 : Number(p)); if (state.page >= 1) renderTbl(); });
        const slot = $('#tbl'); slot.innerHTML = ''; slot.appendChild(node);
        // 安管员管理：字段说明
        const desc = h(`<div class="card desc-panel desc-panel-sm">
          <div class="card-title">安管员管理</div>
          <ul>
            <li><b>安管员是用来登录小程序端，审核作业人员上传作业内容的。</b></li>
            <li><b>1·新增：</b>只需要录入姓名和手机号即可，必填，无限限配置，所有安管员功能相同，全部可以登录小程序查看所有作业，审核，上传照片视频。</li>
            <li><b>2·修改和查看：</b>修改和新增页面一致，内容回填；查看多展示一个创建时间。</li>
            <li><b>3·删除：</b>删除按钮默认不开放，因为涉及到该安管员审核和核查的历史记录，如果同意删除该安管员同时也删除该人的操作历史记录，则可以开放删除按钮。</li>
            <li><b>4·生成二维码：</b>点击后生成二维码，携带企业名称，作业区域，用于给作业人员扫描进入小程序上传作业信息。</li>
            <li><b>5·二维码与作业区域：</b>该二维码需要判断是否有作业区域，如果G端未绑定该企业，则作业区域为空，此时仍可以扫描二维码进行作业，但该条作业信息只存在于企业端，不会同步到G端的作业列表，在小程序上也只有企业的安管员能看到，G端安管员没有该作业信息。</li>
          </ul>
        </div>`);
        slot.parentElement.appendChild(desc);
      });
    }
    render();
  }
  // 安管员二维码弹窗
  function modalOfficerQR() {
    const ent = DB.enterprises[0] || {};
    const areaName = (DB.areas.find((a) => a.id === ent.areaId) || {}).name || '—';
    // 基于企业 id 生成确定性伪二维码矩阵（21x21）
    const N = 21, cell = 12, size = N * cell;
    let seed = (ent.id || 1) * 2654435761 % 2147483647;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const isFinder = (r, c) => {
      const inBox = (br, bc) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
      return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
    };
    let cells = '';
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (isFinder(r, c)) continue;
        if (rnd() > 0.5) cells += `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}" fill="#000"/>`;
      }
    }
    const finder = (br, bc) => {
      const x = bc * cell, y = br * cell;
      return `<rect x="${x}" y="${y}" width="${7 * cell}" height="${7 * cell}" fill="#000"/>
        <rect x="${x + cell}" y="${y + cell}" width="${5 * cell}" height="${5 * cell}" fill="#fff"/>
        <rect x="${x + 2 * cell}" y="${y + 2 * cell}" width="${3 * cell}" height="${3 * cell}" fill="#000"/>`;
    };
    const qrSvg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="background:#fff">
      ${cells}${finder(0, 0)}${finder(0, N - 7)}${finder(N - 7, 0)}</svg>`;
    const body = `
      <div style="text-align:center;padding:8px 0">
        <div style="display:inline-block;padding:16px;background:#fff;border:1px solid #ebeef5;border-radius:8px">${qrSvg}</div>
        <div style="margin-top:20px;font-size:16px;font-weight:600;color:#303133">${esc(ent.name || '当前企业')}</div>
      </div>`;
    const foot = `<button class="btn">关闭</button><button class="btn btn-primary" id="qr-save">下载二维码</button>`;
    const { node, close } = openModal('安管员二维码', body, foot);
    node.querySelectorAll('.btn')[0].onclick = close;
    $('#qr-save').onclick = () => {
      const link = document.createElement('a');
      link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(qrSvg);
      link.download = `安管员二维码_${ent.name || '企业'}.svg`;
      link.click();
      toast('二维码已下载');
    };
  }
  function modalOfficer(onDone) {
    const body = `
      <div class="form-row"><div class="fl">姓名<span class="req">*</span></div><div class="fr"><input class="input" id="o-name" placeholder="请输入姓名"></div></div>
      <div class="form-row"><div class="fl">手机号<span class="req">*</span></div><div class="fr"><input class="input" id="o-phone" placeholder="请输入手机号"></div></div>`;
    const foot = `<button class="btn">取消</button><button class="btn btn-primary" id="o-ok">确定</button>`;
    const { node, close } = openModal('新增安管员', body, foot);
    node.querySelectorAll('.btn')[0].onclick = close;
    $('#o-ok').onclick = () => {
      const data = { name: $('#o-name').value.trim(), phone: $('#o-phone').value.trim() };
      if (!data.name || !data.phone) { toast('请填写必填项', 'error'); return; }
      API.createOfficer(data).then(() => { close(); toast('新增成功'); onDone && onDone(); });
    };
  }
  function modalOfficerEdit(o, onDone) {
    const body = `
      <div class="form-row"><div class="fl">姓名<span class="req">*</span></div><div class="fr"><input class="input" id="o-name" value="${esc(o.name)}"></div></div>
      <div class="form-row"><div class="fl">手机号<span class="req">*</span></div><div class="fr"><input class="input" id="o-phone" value="${esc(o.phone)}"></div></div>`;
    const foot = `<button class="btn">取消</button><button class="btn btn-primary" id="o-ok">确定</button>`;
    const { node, close } = openModal('修改安管员', body, foot);
    node.querySelectorAll('.btn')[0].onclick = close;
    $('#o-ok').onclick = () => {
      const idx = DB.officers.findIndex((x) => x.id === o.id);
      DB.officers[idx] = { ...DB.officers[idx], name: $('#o-name').value.trim(), phone: $('#o-phone').value.trim() };
      close(); toast('修改成功'); onDone && onDone();
    };
  }

  // ============ App Shell 渲染（只渲染一次） ============
  function renderShell() {
    const cur = (location.hash || '#/').split('?')[0];
    const activeGroup = (ROUTES[cur] || ROUTES['#/']).group;
    const navHtml = NAV.map((g, gi) => {
      const expanded = gi === activeGroup ? 'expanded' : '';
      const items = g.items.map((it) => {
        const active = it.route === cur ? 'active' : '';
        return `<a class="nav-item ${active}" href="${it.route}" data-route="${it.route}">${icon(it.icon)}<span>${it.label}</span></a>`;
      }).join('');
      return `<div class="nav-group ${expanded}" data-group="${gi}">
        <div class="nav-group-title"><span class="gt-left">${icon(g.icon)}<span>${g.title}</span></span>${icon('chevron').replace('<svg', '<svg class="arrow')}</div>
        <div class="nav-sub">${items}</div>
      </div>`;
    }).join('');
    $('#sidebar').innerHTML = `<div class="logo">${icon('shield')}<span>特种作业管理</span></div>${navHtml}`;
    // 分组展开/折叠
    $('#sidebar').querySelectorAll('.nav-group-title').forEach((t) => {
      t.onclick = () => t.parentElement.classList.toggle('expanded');
    });
    // 顶栏
    const crumb = (ROUTES[cur] || ROUTES['#/']).crumb;
    $('#topbar').innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <span class="menu-toggle" id="menu-toggle">${icon('menu')}</span>
        <div class="breadcrumb"><span class="muted">${esc(crumb[0])}</span><span class="sep">/</span><span class="cur">${esc(crumb[1])}</span></div>
      </div>
      <div class="topbar-right">
        <span style="cursor:pointer">${icon('bell')}</span>
        <div class="user"><span class="avatar">管</span><span>管理员</span></div>
      </div>`;
    const mt = $('#menu-toggle');
    if (mt) mt.onclick = () => $('#sidebar').classList.toggle('open');
  }

  // ============ 路由 ============
  function router() {
    const cur = (location.hash || '#/').split('?')[0];
    const route = ROUTES[cur] || ROUTES['#/'];
    renderShell();
    const view = $('#view');
    view.innerHTML = `<div class="loading">加载中…</div>`;
    route.view();
    window.scrollTo(0, 0);
  }

  // 初始化
  window.addEventListener('hashchange', router);
  window.addEventListener('DOMContentLoaded', router);
})();
