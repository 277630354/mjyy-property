// api.js — 异步服务层 (API stubs)
// 形态即未来真实 API；内部返回 mock，带 delay 以呈现 loading 态
// TODO: 接入真实后端时，将各函数实现替换为 fetch('/api/...')，保持函数签名与返回结构不变
(function () {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const ok = (data) => ({ code: 0, data, total: Array.isArray(data) ? data.length : undefined });

  // ---- 作业区域 ----
  // GET /api/areas?status=
  async function listAreas({ status } = {}) {
    await delay(300);
    let list = DB.areas;
    if (status && status !== '全部') list = list.filter((a) => a.status === status);
    return ok(list.map((a) => ({ ...a })));
  }
  // POST /api/areas
  async function createArea(data) {
    await delay(300);
    const id = Math.max(0, ...DB.areas.map((a) => a.id)) + 1;
    const area = { id, workCount: 0, status: '启用', ...data };
    DB.areas.push(area);
    return ok(area);
  }
  // PUT /api/areas/:id
  async function updateArea(data) {
    await delay(300);
    const idx = DB.areas.findIndex((a) => a.id === data.id);
    if (idx > -1) DB.areas[idx] = { ...DB.areas[idx], ...data };
    return ok(DB.areas[idx]);
  }
  // PATCH /api/areas/:id/toggle
  async function toggleArea(id) {
    await delay(300);
    const a = DB.areas.find((x) => x.id === id);
    if (a) a.status = a.status === '启用' ? '禁用' : '启用';
    return ok(a);
  }
  // DELETE /api/areas/:id
  async function deleteArea(id) {
    await delay(300);
    DB.areas = DB.areas.filter((a) => a.id !== id);
    return ok({ id });
  }

  // ---- 企业 ----
  // GET /api/enterprises?areaId=
  async function listEnterprises({ areaId } = {}) {
    await delay(300);
    let list = DB.enterprises;
    if (areaId && areaId !== '全部') list = list.filter((e) => e.areaId === Number(areaId));
    return ok(list.map((e) => ({ ...e })));
  }
  // POST /api/enterprises/bind
  async function bindEnterprise({ areaId, enterpriseId }) {
    await delay(300);
    const e = DB.enterprises.find((x) => x.id === Number(enterpriseId));
    if (e) { e.areaId = Number(areaId); }
    return ok(e);
  }
  // DELETE /api/enterprises/:id/unbind
  async function unbindEnterprise(id) {
    await delay(300);
    const e = DB.enterprises.find((x) => x.id === id);
    if (e) e.areaId = null;
    return ok({ id });
  }

  // ---- 门店 ----
  // GET /api/stores
  async function listStores() {
    await delay(300);
    return ok(DB.stores.map((s) => ({ ...s })));
  }
  // POST /api/stores
  async function createStore(data) {
    await delay(300);
    const id = Math.max(0, ...DB.stores.map((s) => s.id)) + 1;
    const store = { id, ...data };
    DB.stores.push(store);
    return ok(store);
  }
  // PUT /api/stores/:id
  async function updateStore(data) {
    await delay(300);
    const idx = DB.stores.findIndex((s) => s.id === data.id);
    if (idx > -1) DB.stores[idx] = { ...DB.stores[idx], ...data };
    return ok(DB.stores[idx]);
  }
  // DELETE /api/stores/:id
  async function deleteStore(id) {
    await delay(300);
    DB.stores = DB.stores.filter((s) => s.id !== id);
    return ok({ id });
  }

  // ---- 安管员 ----
  // GET /api/officers
  async function listOfficers() {
    await delay(300);
    return ok(DB.officers.map((o) => ({ ...o })));
  }
  // POST /api/officers
  async function createOfficer(data) {
    await delay(300);
    const id = Math.max(0, ...DB.officers.map((o) => o.id)) + 1;
    const o = { id, createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '), ...data };
    DB.officers.push(o);
    return ok(o);
  }
  // DELETE /api/officers/:id
  async function deleteOfficer(id) {
    await delay(300);
    DB.officers = DB.officers.filter((o) => o.id !== id);
    return ok({ id });
  }

  // ---- 作业 ----
  // GET /api/works?enterpriseId=&areaId=&type=&status=
  async function listWorks({ enterpriseId, areaId, type, status } = {}) {
    await delay(300);
    let list = DB.works.map((w) => ({ ...w }));
    if (enterpriseId && enterpriseId !== '全部') list = list.filter((w) => w.enterpriseId === Number(enterpriseId));
    if (areaId && areaId !== '全部') list = list.filter((w) => w.areaId === Number(areaId));
    if (type && type !== '全部') {
      const map = { 动火: '动火作业', 高处: '高处作业', 临电: '临时用电' };
      list = list.filter((w) => w.type === (map[type] || type));
    }
    if (status && status !== '全部') list = list.filter((w) => w.status === status);
    return ok(list);
  }
  // GET /api/works/:id
  async function getWorkDetail(id) {
    await delay(300);
    const w = DB.works.find((x) => x.id === Number(id));
    return ok(w ? { ...w } : null);
  }

  // ---- 仪表盘 ----
  // GET /api/dashboard?scope=g|enterprise|officer
  async function dashboardStats({ scope } = {}) {
    await delay(300);
    const works = DB.works;
    const byType = (list) => ([
      { type: '动火作业', count: list.filter((w) => w.type === '动火作业').length },
      { type: '高处作业', count: list.filter((w) => w.type === '高处作业').length },
      { type: '临时用电', count: list.filter((w) => w.type === '临时用电').length },
    ]);
    if (scope === 'enterprise') {
      return ok({ cards: [
        { label: '作业数量', value: works.length, icon: 'clipboard-list', color: '#409EFF' },
        { label: '进行中的作业数量', value: works.filter((w) => w.status === '进行中').length, icon: 'play', color: '#67C23A' },
      ], types: byType(works) });
    }
    if (scope === 'officer') {
      // 安管员：审核的作业(已审核=已通过审核) 与 待审核
      const reviewed = works.filter((w) => w.audit && w.audit.status !== '待审核');
      const pending = works.filter((w) => w.status === '待审核');
      return ok({ cards: [
        { label: '审核的作业数量', value: reviewed.length, icon: 'check-circle', color: '#409EFF' },
        { label: '待审核的作业数量', value: pending.length, icon: 'clock', color: '#E6A23C' },
      ], types: byType(reviewed) });
    }
    // G端默认
    return ok({ cards: [
      { label: '区域数量', value: DB.areas.length, icon: 'map-pin', color: '#409EFF' },
      { label: '企业数量', value: DB.enterprises.length, icon: 'building', color: '#67C23A' },
      { label: '作业数量', value: works.length, icon: 'clipboard-list', color: '#E6A23C' },
      { label: '进行中作业', value: works.filter((w) => w.status === '进行中').length, icon: 'play', color: '#F56C6C' },
    ], types: byType(works) });
  }

  window.API = {
    listAreas, createArea, updateArea, toggleArea, deleteArea,
    listEnterprises, bindEnterprise, unbindEnterprise,
    listStores, createStore, updateStore, deleteStore,
    listOfficers, createOfficer, deleteOfficer,
    listWorks, getWorkDetail,
    dashboardStats,
  };
})();
