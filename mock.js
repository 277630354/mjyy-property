// mock.js — 单一数据源 (single source of mock data)
// 所有页面从此读取数据；跨页数据保持一致（同一企业/作业在所有页面一致）
// TODO: 接入真实后端时，将本文件替换为接口返回数据，保持字段结构不变

window.DB = (function () {
  // ---- 作业区域 ----
  const areas = [
    { id: 1, name: 'A区商业广场', region: '湖北省武汉市江汉区', province: '湖北省', city: '武汉市', district: '江汉区', officer: '张安管', phone: '13800138001', status: '启用', workCount: 2, bounds: { north: 30.59, south: 30.58, east: 114.31, west: 114.29 } },
    { id: 2, name: 'B区住宅小区', region: '湖北省武汉市武昌区', province: '湖北省', city: '武汉市', district: '武昌区', officer: '李安管', phone: '13800138002', status: '启用', workCount: 2, bounds: { north: 30.60, south: 30.57, east: 114.34, west: 114.31 } },
    { id: 3, name: 'C区工业园区', region: '湖北省武汉市洪山区', province: '湖北省', city: '武汉市', district: '洪山区', officer: '王安管', phone: '13800138003', status: '启用', workCount: 2, bounds: { north: 30.62, south: 30.59, east: 114.36, west: 114.33 } },
    { id: 4, name: 'D区写字楼群', region: '湖北省武汉市江岸区', province: '湖北省', city: '武汉市', district: '江岸区', officer: '赵安管', phone: '13800138004', status: '禁用', workCount: 0, bounds: { north: 30.63, south: 30.61, east: 114.32, west: 114.30 } },
  ];

  // ---- 企业 ----
  const enterprises = [
    { id: 1, name: '某某建设集团', areaId: 1, legalPerson: '张三', province: '湖北省', city: '武汉市', district: '江汉区', street: '北湖街道', address: '江汉区建设大道100号' },
    { id: 2, name: '某某装饰公司', areaId: 1, legalPerson: '李四', province: '湖北省', city: '武汉市', district: '江汉区', street: '万松街道', address: '江汉区解放大道200号' },
    { id: 3, name: '某某电力公司', areaId: 2, legalPerson: '王五', province: '湖北省', city: '武汉市', district: '武昌区', street: '中南路街道', address: '武昌区中南路300号' },
    { id: 4, name: '某某消防工程', areaId: 3, legalPerson: '赵六', province: '湖北省', city: '武汉市', district: '洪山区', street: '珞南街道', address: '洪山区珞喻路400号' },
    { id: 5, name: '某某机电安装', areaId: 3, legalPerson: '孙七', province: '湖北省', city: '武汉市', district: '洪山区', street: '关东街道', address: '洪山区关山大道500号' },
  ];

  // ---- 门店 ----
  const stores = [
    { id: 1, name: '一号楼', address: '江汉区建设大道100号1栋', manager: '王店长', phone: '13800138001', enterpriseId: 1, desc: 'A区商业广场一号楼门店' },
    { id: 2, name: '二期工程', address: '武昌区中南路300号2栋', manager: '李店长', phone: '13800138002', enterpriseId: 3, desc: 'B区住宅小区二期工程门店' },
    { id: 3, name: '三号厂房', address: '洪山区珞喻路400号3栋', manager: '赵店长', phone: '13800138003', enterpriseId: 4, desc: 'C区工业园区三号厂房门店' },
    { id: 4, name: '消防通道', address: '江汉区解放大道200号B1', manager: '钱店长', phone: '13800138004', enterpriseId: 2, desc: 'A区商业广场消防通道门店' },
    { id: 5, name: '配电房', address: '武昌区中南路300号地库', manager: '孙店长', phone: '13800138005', enterpriseId: 3, desc: 'B区住宅小区配电房门店' },
    { id: 6, name: '三号车间', address: '洪山区关山大道500号3车间', manager: '周店长', phone: '13800138006', enterpriseId: 5, desc: 'C区工业园区三号车间门店' },
  ];

  // ---- 安管员 ----
  const officers = [
    { id: 1, name: '张安全员', phone: '13700137001', createdAt: '2026-06-01 09:00' },
    { id: 2, name: '李安全员', phone: '13700137002', createdAt: '2026-06-02 10:30' },
    { id: 3, name: '王安全员', phone: '13700137003', createdAt: '2026-06-03 14:00' },
    { id: 4, name: '刘安全员', phone: '13700137004', createdAt: '2026-06-05 11:20' },
    { id: 5, name: '陈安全员', phone: '13700137005', createdAt: '2026-06-08 15:45' },
  ];

  // ---- 监护人 ----
  const guardians = [
    { id: 1, name: '张监护', phone: '13600136001', createdAt: '2026-06-01 09:30' },
    { id: 2, name: '李监护', phone: '13600136002', createdAt: '2026-06-02 11:00' },
    { id: 3, name: '王监护', phone: '13600136003', createdAt: '2026-06-03 15:20' },
    { id: 4, name: '刘监护', phone: '13600136004', createdAt: '2026-06-06 10:10' },
  ];

  // ---- 作业 ----
  const works = [
    {
      id: 1, name: 'A区一号楼外墙动火作业', type: '动火作业', enterpriseId: 1, areaId: 1, storeId: 1,
      address: '江汉区建设大道100号', contractor: '某某建设集团', leader: '张师傅', workerCount: 3,
      startTime: '2026-08-04 08:00', endTime: '2026-08-10 18:00', status: '进行中',
      fireTicket: true, fireTicketImg: 'assets/work-fireticket.jpg', fireCert: '已上传', fireCertImg: 'assets/cert-fire-1.jpg', aiStatus: '通过',
      insuranceCert: '已上传',
      workerPhoto: '已上传', workerPhotoImg: 'assets/worker-photo-1.jpg',
      guardianPhoto: '已上传', guardianPhotoImg: 'assets/guardian-photo-1.jpg',
      workers: [
        { name: '张师傅', phone: '13900000001', idCard: '4201**********0011', task: '动火焊接', needCert: '是', hasCert: '是' },
        { name: '李师傅', phone: '13900000002', idCard: '4201**********0022', task: '现场监护', needCert: '否', hasCert: '否' },
        { name: '王师傅', phone: '13900000003', idCard: '4201**********0033', task: '辅助作业', needCert: '否', hasCert: '否' },
      ],
      audit: [
        { time: '2026-08-04 07:50', name: '张安管', phone: '13800138001', org: 'A区商业广场', photos: 3, videos: 1, fireTicket: '已上传', fireCert: '已上传', status: '通过', reason: '', records: '动火浓度检测合格' },
        { time: '2026-08-05 12:30', name: '张安管', phone: '13800138001', org: 'A区商业广场', photos: 2, videos: 0, fireTicket: '已上传', fireCert: '已上传', status: '通过', reason: '', records: '午后复测浓度合格' },
      ],
      verify: [
        { time: '2026-08-04 10:15', name: '张安管', phone: '13800138001', org: 'A区商业广场', location: '杭州市上城区', photos: 3, videos: 1, status: '通过', reason: '', workerPhoto: '已上传', workerPhotoImg: 'assets/worker-photo-1.jpg', guardianPhoto: '已上传', guardianPhotoImg: 'assets/guardian-photo-1.jpg', records: '现场核查通过' },
        { time: '2026-08-05 15:20', name: '张安管', phone: '13800138001', org: 'A区商业广场', location: '杭州市上城区', photos: 2, videos: 1, status: '异常', reason: '安全带挂钩松动', workerPhoto: '已上传', workerPhotoImg: 'assets/worker-photo-1.jpg', guardianPhoto: '已上传', guardianPhotoImg: 'assets/guardian-photo-1.jpg', records: '安全带挂钩松动，需整改' },
      ],
    },
    {
      id: 2, name: 'B区二期高处作业', type: '高处作业', enterpriseId: 3, areaId: 2, storeId: 2,
      address: '武昌区中南路300号', contractor: '某某电力公司', leader: '李师傅', workerCount: 2,
      startTime: '2026-08-05 09:00', endTime: '2026-08-09 17:00', status: '进行中',
      fireTicket: false, fireCert: '已上传', fireCertImg: 'assets/cert-photo-1.jpg', aiStatus: '通过',
      insuranceCert: '已上传',
      workerPhoto: '已上传', workerPhotoImg: 'assets/worker-photo-2.jpg',
      guardianPhoto: '已上传', guardianPhotoImg: 'assets/guardian-photo-2.jpg',
      workers: [
        { name: '李师傅', phone: '13900000004', idCard: '4201**********0044', task: '高空安装', needCert: '是', hasCert: '是' },
        { name: '赵师傅', phone: '13900000005', idCard: '4201**********0055', task: '地面配合', needCert: '否', hasCert: '否' },
      ],
      audit: [
        { time: '2026-08-05 08:30', name: '李安管', phone: '13800138002', org: 'B区住宅小区', photos: 2, videos: 1, fireTicket: '—', fireCert: '—', status: '通过', reason: '', records: '安全带、安全帽佩戴齐全' },
      ],
      verify: [
        { time: '2026-08-05 11:00', name: '李安管', phone: '13800138002', org: 'B区住宅小区', location: '杭州市拱墅区', photos: 2, videos: 1, status: '通过', reason: '', workerPhoto: '已上传', workerPhotoImg: 'assets/worker-photo-2.jpg', guardianPhoto: '已上传', guardianPhotoImg: 'assets/guardian-photo-2.jpg', records: '现场核查通过' },
      ],
    },
    {
      id: 3, name: 'C区临时用电布线', type: '临时用电', enterpriseId: 4, areaId: 3, storeId: 3,
      address: '洪山区珞喻路400号', contractor: '某某消防工程', leader: '王师傅', workerCount: 2,
      startTime: '2026-08-01 08:00', endTime: '2026-08-03 18:00', status: '已完成',
      fireTicket: false, fireCert: '未上传', aiStatus: '异常',
      insuranceCert: '未上传',
      workerPhoto: '未上传', guardianPhoto: '未上传',
      workers: [
        { name: '王师傅', phone: '13900000006', idCard: '4201**********0066', task: '电路布线', needCert: '是', hasCert: '是' },
        { name: '钱师傅', phone: '13900000007', idCard: '4201**********0077', task: '辅助作业', needCert: '否', hasCert: '否' },
      ],
      audit: [
        { time: '2026-08-01 07:40', name: '王安管', phone: '13800138003', org: 'C区工业园区', photos: 2, videos: 0, fireTicket: '—', fireCert: '—', status: '通过', reason: '', records: '漏电保护器检测合格' },
        { time: '2026-08-02 14:00', name: '王安管', phone: '13800138003', org: 'C区工业园区', photos: 1, videos: 0, fireTicket: '—', fireCert: '—', status: '通过', reason: '', records: '绝缘复测合格' },
      ],
      verify: [
        { time: '2026-08-01 10:30', name: '王安管', phone: '13800138003', org: 'C区工业园区', location: '杭州市余杭区', photos: 2, videos: 0, status: '通过', reason: '', workerPhoto: '未上传', guardianPhoto: '未上传', records: '现场核查通过' },
        { time: '2026-08-03 16:45', name: '王安管', phone: '13800138003', org: 'C区工业园区', location: '杭州市余杭区', photos: 1, videos: 0, status: '通过', reason: '', workerPhoto: '未上传', guardianPhoto: '未上传', records: '完工核查通过' },
      ],
    },
    {
      id: 4, name: 'A区消防改造动火作业', type: '动火作业', enterpriseId: 2, areaId: 1, storeId: 4,
      address: '江汉区解放大道200号', contractor: '某某装饰公司', leader: '赵师傅', workerCount: 1,
      startTime: '2026-08-05 08:00', endTime: '2026-08-09 18:00', status: '待审核',
      fireTicket: false, fireCert: '已上传', fireCertImg: 'assets/cert-fire-1.jpg', aiStatus: '通过',
      insuranceCert: '已上传',
      workerPhoto: '未上传', guardianPhoto: '未上传',
      workers: [
        { name: '赵师傅', phone: '13900000008', idCard: '4201**********0088', task: '动火切割', needCert: '是', hasCert: '是' },
      ],
      audit: [
        { time: '2026-08-05 07:55', name: '张安管', phone: '13800138001', org: 'A区商业广场', photos: 1, videos: 0, fireTicket: '待上传', fireCert: '已上传', status: '待审核', reason: '', records: '—' },
      ],
      verify: [],
    },
    {
      id: 5, name: 'B区配电房临电作业', type: '临时用电', enterpriseId: 3, areaId: 2, storeId: 5,
      address: '武昌区中南路300号', contractor: '某某电力公司', leader: '刘师傅', workerCount: 2,
      startTime: '2026-08-03 14:00', endTime: '2026-08-08 20:00', status: '进行中',
      fireTicket: false, fireCert: '未上传', aiStatus: '异常',
      insuranceCert: '已上传',
      workerPhoto: '已上传', workerPhotoImg: 'assets/worker-photo-3.jpg',
      guardianPhoto: '未上传',
      workers: [
        { name: '刘师傅', phone: '13900000009', idCard: '4201**********0099', task: '配电改造', needCert: '是', hasCert: '是' },
        { name: '孙师傅', phone: '13900000010', idCard: '4201**********0100', task: '辅助作业', needCert: '否', hasCert: '否' },
      ],
      audit: [
        { time: '2026-08-03 13:30', name: '李安管', phone: '13800138002', org: 'B区住宅小区', photos: 2, videos: 1, fireTicket: '—', fireCert: '—', status: '通过', reason: '', records: '绝缘检测合格' },
      ],
      verify: [
        { time: '2026-08-04 16:00', name: '李安管', phone: '13800138002', org: 'B区住宅小区', photos: 2, videos: 1, status: '异常', reason: '配电箱防护缺失', workerPhoto: '已上传', workerPhotoImg: 'assets/worker-photo-3.jpg', guardianPhoto: '未上传', records: '配电箱防护缺失，需整改' },
      ],
    },
    {
      id: 6, name: 'C区车间高处作业', type: '高处作业', enterpriseId: 5, areaId: 3, storeId: 6,
      address: '洪山区关山大道500号', contractor: '某某机电安装', leader: '陈师傅', workerCount: 1,
      startTime: '2026-08-06 08:00', endTime: '2026-08-08 18:00', status: '待审核',
      fireTicket: false, fireCert: '未上传', aiStatus: '异常',
      insuranceCert: '未上传',
      workerPhoto: '未上传', guardianPhoto: '未上传',
      workers: [
        { name: '陈师傅', phone: '13900000011', idCard: '4201**********0111', task: '设备高空安装', needCert: '是', hasCert: '是' },
      ],
      audit: [
        { time: '2026-08-06 07:50', name: '王安管', phone: '13800138003', org: 'C区工业园区', photos: 1, videos: 0, fireTicket: '—', fireCert: '—', status: '待审核', reason: '', records: '—' },
      ],
      verify: [],
    },
    {
      id: 7, name: 'A区冷却塔检修作业', type: '高处作业', enterpriseId: 1, areaId: 1, storeId: 1,
      address: '江汉区建设大道100号', contractor: '某某建设集团', leader: '吴师傅', workerCount: 2,
      startTime: '2026-08-10 08:00', endTime: '2026-08-12 18:00', status: '待开始',
      fireTicket: true, fireTicketImg: 'assets/work-fireticket.jpg', fireCert: '已上传', fireCertImg: 'assets/cert-photo-2.jpg', aiStatus: '通过',
      insuranceCert: '已上传',
      workerPhoto: '已上传', workerPhotoImg: 'assets/worker-photo-1.jpg',
      guardianPhoto: '已上传', guardianPhotoImg: 'assets/guardian-photo-1.jpg',
      workers: [
        { name: '吴师傅', phone: '13900000012', idCard: '4201**********0122', task: '冷却塔检修', needCert: '是', hasCert: '是' },
        { name: '郑师傅', phone: '13900000013', idCard: '4201**********0133', task: '辅助作业', needCert: '否', hasCert: '否' },
      ],
      audit: [
        { time: '2026-08-05 16:00', name: '张安管', phone: '13800138001', org: 'A区商业广场', photos: 2, videos: 0, fireTicket: '已上传', fireCert: '已上传', status: '通过', reason: '', records: '作业前准备已确认' },
      ],
      verify: [],
    },
    {
      id: 8, name: 'B区地下车库焊接作业', type: '动火作业', enterpriseId: 2, areaId: 2, storeId: 2,
      address: '武昌区中南路300号', contractor: '某某装饰公司', leader: '冯师傅', workerCount: 2,
      startTime: '2026-08-06 09:00', endTime: '2026-08-12 17:00', status: '已拒绝',
      fireTicket: true, fireTicketImg: 'assets/work-fireticket.jpg', fireCert: '未上传', aiStatus: '异常',
      insuranceCert: '未上传',
      workerPhoto: '已上传', workerPhotoImg: 'assets/worker-photo-2.jpg',
      guardianPhoto: '已上传', guardianPhotoImg: 'assets/guardian-photo-2.jpg',
      workers: [
        { name: '冯师傅', phone: '13900000014', idCard: '4201**********0144', task: '管道焊接', needCert: '是', hasCert: '是' },
        { name: '何师傅', phone: '13900000015', idCard: '4201**********0155', task: '现场监护', needCert: '否', hasCert: '否' },
      ],
      audit: [
        { time: '2026-08-06 08:00', name: '李安管', phone: '13800138002', org: 'B区住宅小区', photos: 1, videos: 0, fireTicket: '已上传', fireCert: '未上传', status: '未通过', reason: '动火证过期，请重新办理', records: '—' },
      ],
      verify: [],
    },
    {
      id: 9, name: 'C区仓库清理作业', type: '临时用电', enterpriseId: 4, areaId: 3, storeId: 3,
      address: '洪山区珞喻路400号', contractor: '某某消防工程', leader: '许师傅', workerCount: 3,
      startTime: '2026-08-01 08:00', endTime: '2026-08-04 18:00', status: '已结束',
      fireTicket: false, fireCert: '未上传', aiStatus: '异常',
      insuranceCert: '未上传',
      workerPhoto: '未上传', guardianPhoto: '未上传',
      workers: [
        { name: '许师傅', phone: '13900000016', idCard: '4201**********0166', task: '仓库清理', needCert: '否', hasCert: '否' },
        { name: '马师傅', phone: '13900000017', idCard: '4201**********0177', task: '设备搬运', needCert: '否', hasCert: '否' },
        { name: '朱师傅', phone: '13900000018', idCard: '4201**********0188', task: '垃圾清运', needCert: '否', hasCert: '否' },
      ],
      audit: [
        { time: '2026-08-01 07:40', name: '王安管', phone: '13800138003', org: 'C区工业园区', photos: 2, videos: 1, fireTicket: '—', fireCert: '—', status: '未通过', reason: '现场材料堆放混乱，整改不达标', records: '—' },
      ],
      verify: [],
    },
  ];

  return { areas, enterprises, stores, officers, guardians, works };
})();
