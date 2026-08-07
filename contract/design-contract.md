# Design Contract — 民匠有约 · 特种作业管理 (1:1 recreation of https://mjyy.pages.dev/property/)

## Tech Stack & Delivery Type
- stack: vanilla HTML + CSS + JS, single-page app with hash routing (faithful to original Vue+Element-UI SPA behavior)
- delivery: pure-static, zero external dependency, offline-openable by double-clicking index.html
- charts: inline SVG bar charts (no external chart lib)
- icons: inline SVG (Lucide-style strokes), no emoji, no CDN
- map: CSS/SVG placeholder (no external tiles, stays offline)

## Style Tier & Aesthetic
- style: business-international (Element UI admin aesthetic — steady blue primary, clear hierarchy, high data density, tidy grid)
- aesthetic: clean enterprise admin (Element UI 2.x look): dark sidebar, light gray canvas, white cards, rectangular tables, small radius, restrained shadows
- tone keywords: calm / data-dense / functional / trustworthy

## Design Tokens (Element UI 2.x aligned)
- color.primary: #409EFF   color.primary-hover: #66b1ff   color.primary-active: #3a8ee6
- color.success: #67C23A   color.warning: #E6A23C   color.danger: #F56C6C   color.info: #909399
- color.bg: #f0f2f5 (canvas)   color.surface: #ffffff (cards/tables)
- color.sidebar-bg: #304156 (dark slate)   color.sidebar-bg-hover: #263445   color.sidebar-text: #bfcbd9   color.sidebar-text-active: #ffffff   color.sidebar-active-bar: #409EFF (or #1f2d3d active item bg)
- color.border: #ebeef5   color.text: #303133   color.text-regular: #606266   color.text-secondary: #909399   color.text-placeholder: #c0c4cc
- font.body: "PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif
- font.mono: "SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace
- font.scale: 12 / 13 / 14 / 16 / 18 / 20 / 24 (px) — Element uses 14 base
- radius: sm 2px / md 4px / lg 8px (Element is mostly 4px)
- shadow: sm 0 0 0 0 transparent; card-shadow 0 2px 12px 0 rgba(0,0,0,.1); modal-shadow 0 1px 3px rgba(0,0,0,.3)
- spacing.unit: 4px base (4/8/12/16/20/24/32)
- layout: sidebar width 210px fixed; top bar 50px; main padding 20px; table row height 48px
- icon.size: 14/16/18   icon.stroke: 2   icon.color: currentColor
- motion: page fade-in 200ms; modal scale-in 200ms; nav active slide; staggered card reveal on dashboards (delay 60ms steps)

## Component Spec
- button: height 32px (small) / 36px (default); padding 12px 20px; radius 4px; primary(#409EFF white text), default(white border #dcdfe6 text #606266), text(no bg), danger(#F56C6C). hover lighten.
- input: height 36px; border #dcdfe6 radius 4px; focus border #409EFF; placeholder #c0c4cc
- select: like input + dropdown chevron; native <select> styled or custom dropdown
- table: white bg; header bg #fafafa text #909399 weight 500; row border-bottom #ebeef5; row hover #f5f7fa; cell padding 12px 10px; font 14px #606266
- tag/status: height 24px; padding 0 8px; radius 4px; success(#f0f9eb bg #67C23A text #67c23a→ use light bg solid text), warning(#fdf6ec/#e6a23c), danger(#fef0f0/#f56c6c), info(#f4f4f5/#909399). Plain style.
- card: white bg; radius 4px; box-shadow 0 2px 12px 0 rgba(0,0,0,.1); padding 20px; header 16px bold #303133 + bottom border #ebeef5 optional
- modal: overlay rgba(0,0,0,.5); dialog white radius 4px; width 480px (forms) / 720px (detail); header 18px #303133 + close X; body padding 20px; footer right-aligned buttons
- pagination: Element style — prev/next + page numbers; active #409EFF
- stat card: white card; icon circle left (colored bg); label 14px #909399; number 28px bold #303133
- bar chart: vertical bars; bar fill #409EFF; axis #909399; value labels above bars

## App Shell + Canonical Nav (mandatory, frozen)
- shell skeleton: `<div class="app">` > `<aside class="sidebar">` (logo + nav) + `<div class="main">` > `<header class="topbar">` (breadcrumb + user) + `<section class="content" id="view">` (router outlet) `</div>`. Nav is fixed width 210px, content margin-left 210px — identical on every view (rendered once by JS).
- nav groups (frozen, exact order/labels/icons):
  1. G端作业管理 (icon: shield) → [首页(home|#/) , 作业区域(map-pin|#/areas) , 企业管理(building|#/enterprises) , 作业管理(clipboard-list|#/tasks)]
  2. 企业端作业管理 (icon: briefcase) → [企业首页(layout-dashboard|#/zone/home) , 门店管理(store|#/zone/stores) , 安管员管理(user-check|#/zone/officers) , 企业作业管理(clipboard-list|#/zone/tasks)]
  3. 安管员页面 (icon: hard-hat) → [安管员首页(layout-dashboard|#/officer/home) , 作业管理(clipboard-list|#/officer/tasks)]
- active rule: the `<a>` whose href hash matches current route gets `.active`; group containing active item is `.expanded`. Determined from `location.hash` on render.
- mount: shell injected once by app.js on load; only `#view` content swaps per route.

## Page List
| route | page | surface | responsibility | key components |
|---|---|---|---|---|
| #/ | G端首页 | G端 | overview dashboard | 4 stat cards + type bar chart |
| #/areas | 作业区域 | G端 | manage work zones | filter(状态) + table + 新增/编辑/查看/禁用/删除 |
| #/enterprises | 企业管理 | G端 | bind enterprises to zones | filter(作业区域) + table + 新增绑定/解绑 |
| #/tasks | 作业管理 | G端 | all special-ops works | filters(企业/作业区域/作业类型) + table + 查看 detail |
| #/zone/home | 企业首页 | 企业端 | enterprise overview | 2 stat cards + type bar chart |
| #/zone/stores | 门店管理 | 企业端 | manage stores | table + 新增/查看/修改/删除 |
| #/zone/officers | 安管员管理 | 企业端 | manage safety officers | table + 新增/查看/修改/删除 |
| #/zone/tasks | 企业作业管理 | 企业端 | enterprise's works | filters(作业类型/作业状态) + table + 查看 detail |
| #/officer/home | 安管员首页 | 安管员 | officer overview | 2 stat cards + type bar chart |
| #/officer/tasks | 作业管理 | 安管员 | audit + zone works | tabs(待审核作业/区域作业) + tables + 查看 detail |

## Mock Schema (single source in mock.js)
- areas: {id, name, region(full addr), officer, phone, status(启用/禁用), workCount}
- enterprises: {id, name, areaId, legalPerson, address}
- stores: {id, name, address, manager, phone, enterpriseId, desc}
- officers: {id, name, phone, createdAt}
- works: {id, name, type(动火作业/高处作业/临时用电), enterpriseId, areaId, storeId, address, contractor, leader, workerCount, startTime, endTime, status(进行中/已完成/待审核), workers[], audit{}, verify{}}
- counts derived from works/areas/enterprises for dashboards.

## API stubs (api.js — async, delay 300ms, // TODO replace with fetch)
- listAreas({status}), createArea(data), updateArea(data), toggleArea(id), deleteArea(id)
- listEnterprises({areaId}), bindEnterprise({areaId,enterpriseId}), unbindEnterprise(id)
- listStores(), createStore(data), deleteStore(id)
- listOfficers(), createOfficer(data), deleteOfficer(id)
- listWorks({enterpriseId,areaId,type,status}), getWorkDetail(id)
- dashboardStats({scope}) → stat cards + type distribution

## Interactions to wire
- hash routing + active nav + group expand
- dropdown filters actually filter mock tables; reset
- 新增/编辑 open form modals with validation + submit success toast + list refresh
- 查看 opens detail modal (work detail with 施工人列表/审核记录/现场核查记录 sections)
- 禁用/启用 toggle status; 解绑/删除 confirm dialog then remove row
- tabs on #/officer/tasks
- pagination on long tables
