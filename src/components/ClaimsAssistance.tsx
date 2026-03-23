import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronDown, Search, MoreHorizontal, Plus, Upload, AlertCircle, Check, ClipboardList, Building2, Trash2 } from 'lucide-react';

import { locationData } from '../constants/locations';

const ACCIDENT_CAUSE_MAP: Record<string, string[]> = {
  交通事故: [
    '单车事故碰撞',
    '单车事故翻覆',
    '单车事故仅货损',
    '两车或多车事故',
    '其他',
  ],
  火灾事故: [
    '货物自燃',
    '外来原因',
    '车辆油脂起火',
    '交通事故引起',
    '仓库火灾',
    '其他',
  ],
  水湿: [
    '运输中未盖雨布雨淋',
    '运输中已盖雨布雨淋',
    '稀车运输中雨淋',
    '非运输途中雨淋',
    '非雨林水浸',
    '其他',
  ],
  碰损: [
    '运输中货物摔落',
    '运输中货物相互或与车厢碰撞',
    '非运输中碰损',
    '其他',
  ],
  装卸事故: [
    '叉车装卸事故',
    '人工搬运事故',
    '吊装设备装卸事故',
    '其他',
  ],
  丢失: [
    '运输途中丢失（包括停车服务区或加油站）',
    '中转站丢失',
    '收货人处丢失',
    '其他',
  ],
  其他: [
    '运输车辆失联',
    '哄抢',
    '其他',
  ],
};

export default function ClaimsAssistance({
  selectedOrder,
  claimAssistPool,
  appraisalCases,
  onDraftSave,
  onSubmit,
  canManage,
  canSubmit,
}: {
  selectedOrder?: any;
  claimAssistPool?: any[];
  appraisalCases?: any[];
  onDraftSave: (claim: any) => void;
  onSubmit: (claim: any) => void;
  canManage: boolean;
  canSubmit: boolean;
}) {
  const emptyListFilter = {
    policyNo: '',
    reportNo: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    claimAmountMin: '',
    claimAmountMax: '',
    accidentType: '',
  };
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [draftListFilter, setDraftListFilter] = useState(emptyListFilter);
  const [listFilter, setListFilter] = useState(emptyListFilter);

  // If a selectedOrder is passed, pre-fill it as a new claim
  useEffect(() => {
    if (selectedOrder) {
      const fallbackAssistNo = `LAS-${Date.now()}`;
      setSelectedClaim({
        id: selectedOrder.id || selectedOrder.assistNo,
        assistNo: selectedOrder.assistNo || fallbackAssistNo,
        customerCode: selectedOrder.customerCode,
        policyNo: selectedOrder.policyNo,
        company: '平安财险', // Default or from order
        type: '物流责任险',
        insured: selectedOrder.customer,
        startTime: '2026-01-01',
        endTime: '2026-12-31',
      });
    }
  }, [selectedOrder]);

  // 当 claimAssistPool 更新时，同步 selectedClaim 的状态
  useEffect(() => {
    if (selectedClaim && claimAssistPool) {
      const updated = claimAssistPool.find(
        (item) => item.assistNo === selectedClaim.assistNo || item.id === selectedClaim.id
      );
      if (updated) {
        setSelectedClaim((prev: any) => ({
          ...prev,
          status: updated.status,
          latestReviewComment: updated.latestReviewComment,
          updatedAt: updated.updatedAt,
        }));
      }
    }
  }, [claimAssistPool]);
  const displayClaimsData = [
    ...(claimAssistPool || []).map((row) => ({
      ...row,
      id: row.id || row.assistNo,
      relatedCaseNo: row.relatedCaseNo || appraisalCases?.find((item) => item.assistNo === row.assistNo)?.id || '--',
      reportTime: row.reportTime || row.updatedAt || '--',
      reporter: row.reporter || '理赔协助',
    })),
  ].filter((item, index, arr) => arr.findIndex((other) => other.assistNo === item.assistNo) === index);
  const [currentStep, setCurrentStep] = useState(1);
  const [showIndirectLoss, setShowIndirectLoss] = useState(false);
  const [cargoList, setCargoList] = useState([{ id: 1, name: '', model: '', quantity: '', unit: '', price: '', amount: '', type: '' }]);
  const [logisticsCompanies, setLogisticsCompanies] = useState([{ id: 1, name: '' }]);
  const [accidentInfo, setAccidentInfo] = useState({
    time: '',
    reportTime: '',
    reportNo: '',
    departureProvince: '',
    departureCity: '',
    destinationProvince: '',
    destinationCity: '',
    province: '',
    city: '',
    district: '',
    address: '',
    reason1: '',
    reason2: '',
    description: ''
  });
  const [truckPlateNo, setTruckPlateNo] = useState('');
  const [ownerName, setOwnerName] = useState('');

  const [accidentEvidenceFiles, setAccidentEvidenceFiles] = useState<string[]>([]);
  const [relationEvidenceFiles, setRelationEvidenceFiles] = useState<string[]>([]);
  const [vehicleEvidenceFiles, setVehicleEvidenceFiles] = useState<string[]>([]);
  const [directLossEvidenceFiles, setDirectLossEvidenceFiles] = useState<string[]>([]);
  const [indirectLossEvidenceFiles, setIndirectLossEvidenceFiles] = useState<string[]>([]);
  const [remarkEvidenceFiles, setRemarkEvidenceFiles] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [indirectLossList, setIndirectLossList] = useState([
    { id: 1, amount: '', item: '', note: '' },
  ]);

  const accidentEvidenceInputRef = useRef<HTMLInputElement>(null);
  const relationEvidenceInputRef = useRef<HTMLInputElement>(null);
  const vehicleEvidenceInputRef = useRef<HTMLInputElement>(null);
  const directLossEvidenceInputRef = useRef<HTMLInputElement>(null);
  const indirectLossEvidenceInputRef = useRef<HTMLInputElement>(null);
  const remarkEvidenceInputRef = useRef<HTMLInputElement>(null);

  const availableCities = accidentInfo.province ? Object.keys(locationData[accidentInfo.province] || {}) : [];
  const availableDistricts = (accidentInfo.province && accidentInfo.city) ? locationData[accidentInfo.province][accidentInfo.city] : [];
  const availableDepartureCities = accidentInfo.departureProvince ? Object.keys(locationData[accidentInfo.departureProvince] || {}) : [];
  const availableDestinationCities = accidentInfo.destinationProvince ? Object.keys(locationData[accidentInfo.destinationProvince] || {}) : [];

  const headerRef = useRef<HTMLDivElement>(null);

  const steps = [
    { id: 1, name: '基础信息', icon: true },
    { id: 2, name: '事故信息' },
    { id: 3, name: '承托关系' },
    { id: 4, name: '车辆信息' },
    { id: 5, name: '直接损失' },
    ...(showIndirectLoss ? [{ id: 6, name: '间接损失' }] : [])
  ];

  // Add scroll listener to update current step based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const stepIds = [1, 2, 3, 4, 5];
      if (showIndirectLoss) stepIds.push(6);

      // Check from bottom to top to find the current active section
      for (const id of [...stepIds].reverse()) {
        const element = document.getElementById(`step-${id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          // 150px is a buffer for the sticky header and some padding
          if (rect.top <= 150) {
            setCurrentStep(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [showIndirectLoss]);

  const scrollToStep = (stepId: number) => {
    setCurrentStep(stepId);
    const element = document.getElementById(`step-${stepId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const addCargo = () => {
    setCargoList([...cargoList, { id: Date.now(), name: '', model: '', quantity: '', unit: '', price: '', amount: '', type: '' }]);
  };

  const removeCargo = (id: number) => {
    if (cargoList.length > 1) {
      setCargoList(cargoList.filter(item => item.id !== id));
    }
  };

  const updateCargo = (id: number, field: string, value: string) => {
    setCargoList(cargoList.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addLogisticsCompany = () => {
    setLogisticsCompanies((prev) => [...prev, { id: Date.now(), name: '' }]);
  };

  const updateLogisticsCompany = (id: number, value: string) => {
    setLogisticsCompanies((prev) => prev.map((item) => (item.id === id ? { ...item, name: value } : item)));
  };

  const addIndirectLoss = () => {
    setIndirectLossList((prev) => [...prev, { id: Date.now(), amount: '', item: '', note: '' }]);
  };

  const removeIndirectLoss = (id: number) => {
    if (indirectLossList.length <= 1) {
      return;
    }
    setIndirectLossList((prev) => prev.filter((item) => item.id !== id));
  };

  const updateIndirectLoss = (id: number, field: 'amount' | 'item' | 'note', value: string) => {
    setIndirectLossList((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // 只在已提交、审核中、已通过时锁定。退回状态允许继续编辑和重新提交
  const isLocked = ['已提交', '审核中', '已通过'].includes(selectedClaim?.status || '') || !canManage;

  const handleSubmitConfirm = () => {
    setShowSubmitConfirm(false);
    onSubmit({
      ...selectedClaim,
      // 将所有录入表单的详情数据随提交一起传出，供公估/保司汇总页读取
      cargoList,
      accidentInfo,
      logisticsCompanies,
      ownerName,
      truckPlateNo,
      indirectLossList,
      showIndirectLoss,
      remarks,
      accidentEvidenceFiles,
      relationEvidenceFiles,
      vehicleEvidenceFiles,
      directLossEvidenceFiles,
      indirectLossEvidenceFiles,
      remarkEvidenceFiles,
      status: '已提交',
    });
    setTimeout(() => setSelectedClaim(null), 300);
  };

  const appendEvidenceFiles = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const names = Array.from(event.target.files || []).map((file) => file.name);
    if (names.length > 0) {
      setFiles((prev) => [...prev, ...names]);
    }
    event.target.value = '';
  };

  const parseMoneyValue = (value: any) => {
    const text = String(value || '').replace(/[¥,\s]/g, '');
    const num = Number(text);
    return Number.isFinite(num) ? num : 0;
  };

  const formatMoney = (value: number) => `¥${value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const calcReviewAging = (startText: string, endText: string) => {
    const start = new Date(startText);
    const end = new Date(endText || Date.now());
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return '--';
    }
    const day = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return `${day}天`;
  };

  const tableRows = useMemo(
    () =>
      displayClaimsData.map((row) => ({
        ...row,
        accidentTime: row.accidentTime || row.reportTime || row.updatedAt || '--',
        reportNo: row.reportNo || row.relatedCaseNo || '--',
        claimAmount: row.claimAmount || row.lossAmount || '--',
        accidentType: row.accidentType || row.reason1 || '--',
        claimHandler: row.claimHandler || row.reviewer || row.reporter || '--',
        reviewAging: row.reviewAging || calcReviewAging(row.reportTime || row.updatedAt || '', row.updatedAt || ''),
      })),
    [displayClaimsData],
  );

  const accidentTypeOptions = useMemo(
    () => Array.from(new Set(tableRows.map((item) => item.accidentType).filter((item) => item && item !== '--'))),
    [tableRows],
  );

  const filteredRows = useMemo(() => {
    return tableRows.filter((item) => {
      const policyNo = String(item.policyNo || '');
      const reportNo = String(item.reportNo || '');
      const accidentTime = String(item.accidentTime || '');
      const claimAmount = parseMoneyValue(item.claimAmount);

      const matchesPolicyNo = !listFilter.policyNo || policyNo.includes(listFilter.policyNo);
      const matchesReportNo = !listFilter.reportNo || reportNo.includes(listFilter.reportNo);
      const matchesStatus = !listFilter.status || item.status === listFilter.status;
      const matchesAccidentType = !listFilter.accidentType || item.accidentType === listFilter.accidentType;
      const matchesDateFrom = !listFilter.dateFrom || accidentTime >= listFilter.dateFrom;
      const matchesDateTo = !listFilter.dateTo || accidentTime <= listFilter.dateTo;
      const matchesAmountMin = !listFilter.claimAmountMin || claimAmount >= Number(listFilter.claimAmountMin);
      const matchesAmountMax = !listFilter.claimAmountMax || claimAmount <= Number(listFilter.claimAmountMax);

      return (
        matchesPolicyNo &&
        matchesReportNo &&
        matchesStatus &&
        matchesAccidentType &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesAmountMin &&
        matchesAmountMax
      );
    });
  }, [tableRows, listFilter]);

  const listTotals = useMemo(
    () =>
      filteredRows.reduce(
        (acc, item) => {
          acc.claimAmount += parseMoneyValue(item.claimAmount);
          acc.count += 1;
          return acc;
        },
        { claimAmount: 0, count: 0 },
      ),
    [filteredRows],
  );

  const exportRows = () => {
    const headers = ['出险时间', '险种', '保险公司', '保单号', '报案号', '索赔金额', '事故类型', '状态', '审核时效', '理赔员'];
    const lines = filteredRows.map((item) => [
      item.accidentTime || '--',
      item.type || '--',
      item.company || '--',
      item.policyNo || '--',
      item.reportNo || '--',
      item.claimAmount || '--',
      item.accidentType || '--',
      item.status || '--',
      item.reviewAging || '--',
      item.claimHandler || '--',
    ]);
    const csv = [headers, ...lines]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `理赔工作台_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (selectedClaim) {
    return (
      <div className="flex flex-col h-full relative flex-1">
        <div className={`flex gap-6 items-start flex-1 ${isLocked ? 'pointer-events-none' : ''}`}>
          {/* Main Content Area */}
          <div className="flex-1 space-y-6 pb-24">
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="text-base font-semibold text-slate-900 mb-4">案件跟踪</div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">公估</label>
                  <input
                    type="text"
                    defaultValue={selectedClaim.appraiserCompany || ''}
                    placeholder="公估公司"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">联系方式</label>
                  <input
                    type="text"
                    defaultValue={selectedClaim.appraiserContact || ''}
                    placeholder="联系人"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">电话</label>
                  <input
                    type="text"
                    defaultValue={selectedClaim.appraiserPhone || ''}
                    placeholder="电话"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
                <div className="text-xs text-rose-600 flex items-end">理赔分公司正在协调中</div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">理赔</label>
                  <input
                    type="text"
                    defaultValue={selectedClaim.claimDept || ''}
                    placeholder="理赔部门"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">联系方式</label>
                  <input
                    type="text"
                    defaultValue={selectedClaim.claimContact || ''}
                    placeholder="联系人"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">电话</label>
                  <input
                    type="text"
                    defaultValue={selectedClaim.claimPhone || ''}
                    placeholder="电话"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-slate-600 mb-1">当前审核意见</label>
                  <textarea
                    rows={3}
                    defaultValue={selectedClaim.latestReviewComment || ''}
                    placeholder="暂无审核意见"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
                <button className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50">
                  查看历史
                </button>
              </div>
            </section>

            <section id="step-1" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-32">
              <div className="w-full px-6 py-4 bg-white border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-900">保单信息</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">保单号</label>
                    <input type="text" value={selectedClaim.policyNo || ''} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">保险公司</label>
                    <input type="text" value={selectedClaim.company || ''} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">险种</label>
                    <input type="text" value={selectedClaim.type || ''} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">被保险人</label>
                    <input type="text" value={selectedClaim.insured || ''} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">投保人</label>
                    <input type="text" value={selectedClaim.applicant || selectedClaim.insured || ''} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">保险期限</label>
                    <div className="flex items-center gap-2">
                      <input type="text" value={selectedClaim.startTime || ''} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50" />
                      <span className="text-slate-400 text-xs">-</span>
                      <input type="text" value={selectedClaim.endTime || ''} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">营业收入</label>
                    <input type="text" value={selectedClaim.businessIncome || '¥50,000,000.00'} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">赔偿限额</label>
                    <input type="text" value={selectedClaim.compLimit || '¥5,000,000.00'} readOnly className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50" />
                  </div>
                  <div className="md:col-span-2 xl:col-span-4">
                    <label className="block text-xs text-slate-600 mb-1">免赔条件</label>
                    <textarea
                      rows={2}
                      value={selectedClaim.deductibleClause || '每次事故绝对免赔额为人民币5000元或损失金额的10%，两者以高者为准。'}
                      readOnly
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50"
                    />
                  </div>
                  <div className="md:col-span-2 xl:col-span-4">
                    <label className="block text-xs text-slate-600 mb-1">特约条款</label>
                    <textarea
                      rows={2}
                      value={selectedClaim.specialClause || '1. 扩展承保冷链运输风险；2. 扩展承保装卸过程中的意外损失。'}
                      readOnly
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50"
                    />
                  </div>
                  <div className="md:col-span-2 xl:col-span-4">
                    <label className="block text-xs text-slate-600 mb-1">批改信息</label>
                    <textarea
                      rows={2}
                      value={selectedClaim.endorsement || ''}
                      readOnly
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            </section>

          {/* 2. 报案信息 */}
          <section id="step-2" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-32">
            <div className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-500"></span>
                事故信息
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">出险时间</label>
                  <input
                    type="datetime-local"
                    value={accidentInfo.time}
                    onChange={(e) => setAccidentInfo((prev) => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">启运地</label>
                  <div className="flex gap-2">
                    <select
                      value={accidentInfo.departureProvince}
                      onChange={(e) => setAccidentInfo((prev) => ({ ...prev, departureProvince: e.target.value, departureCity: '' }))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
                    >
                      <option value="">省</option>
                      {Object.keys(locationData).map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select
                      value={accidentInfo.departureCity}
                      onChange={(e) => setAccidentInfo((prev) => ({ ...prev, departureCity: e.target.value }))}
                      disabled={!accidentInfo.departureProvince}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white disabled:bg-slate-50"
                    >
                      <option value="">市</option>
                      {availableDepartureCities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">目的地</label>
                  <div className="flex gap-2">
                    <select
                      value={accidentInfo.destinationProvince}
                      onChange={(e) => setAccidentInfo((prev) => ({ ...prev, destinationProvince: e.target.value, destinationCity: '' }))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
                    >
                      <option value="">省</option>
                      {Object.keys(locationData).map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select
                      value={accidentInfo.destinationCity}
                      onChange={(e) => setAccidentInfo((prev) => ({ ...prev, destinationCity: e.target.value }))}
                      disabled={!accidentInfo.destinationProvince}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white disabled:bg-slate-50"
                    >
                      <option value="">市</option>
                      {availableDestinationCities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">出险地点</label>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={accidentInfo.province}
                    onChange={(e) => setAccidentInfo({ ...accidentInfo, province: e.target.value, city: '', district: '' })}
                    className="w-full md:w-[150px] px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
                  >
                    <option value="">省</option>
                    {Object.keys(locationData).map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select
                    value={accidentInfo.city}
                    onChange={(e) => setAccidentInfo({ ...accidentInfo, city: e.target.value, district: '' })}
                    disabled={!accidentInfo.province}
                    className="w-full md:w-[150px] px-3 py-2 text-sm border border-slate-300 rounded-md bg-white disabled:bg-slate-50"
                  >
                    <option value="">市</option>
                    {availableCities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    type="text"
                    value={accidentInfo.address}
                    onChange={(e) => setAccidentInfo({ ...accidentInfo, address: e.target.value })}
                    placeholder="详细地点"
                    className="flex-1 min-w-[240px] px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">报案时间</label>
                  <input
                    type="datetime-local"
                    value={accidentInfo.reportTime}
                    onChange={(e) => setAccidentInfo((prev) => ({ ...prev, reportTime: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">报案号</label>
                  <input
                    type="text"
                    value={accidentInfo.reportNo}
                    onChange={(e) => setAccidentInfo((prev) => ({ ...prev, reportNo: e.target.value }))}
                    placeholder="录入保司报案号"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">事故原因</label>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-500">一级</span>
                  <select
                    value={accidentInfo.reason1}
                    disabled={isLocked}
                    onChange={(e) => setAccidentInfo((prev) => ({ ...prev, reason1: e.target.value, reason2: '' }))}
                    className="w-full md:w-[220px] px-3 py-2 text-sm border border-slate-300 rounded-md bg-white disabled:bg-slate-50"
                  >
                    <option value="">请选择</option>
                    {Object.keys(ACCIDENT_CAUSE_MAP).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <span className="text-sm text-slate-500">二级</span>
                  <select
                    value={accidentInfo.reason2}
                    disabled={isLocked || !accidentInfo.reason1}
                    onChange={(e) => setAccidentInfo((prev) => ({ ...prev, reason2: e.target.value }))}
                    className="w-full md:w-[280px] px-3 py-2 text-sm border border-slate-300 rounded-md bg-white disabled:bg-slate-50"
                  >
                    <option value="">请选择</option>
                    {(ACCIDENT_CAUSE_MAP[accidentInfo.reason1] || []).map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">详细事故经过</label>
                <div className="flex items-end gap-3">
                  <textarea
                    rows={4}
                    value={accidentInfo.description}
                    onChange={(e) => setAccidentInfo((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="请按时间线描述事故经过"
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => accidentEvidenceInputRef.current?.click()}
                    className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                  >
                    上传佐证
                  </button>
                  <input
                    ref={accidentEvidenceInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) => appendEvidenceFiles(event, setAccidentEvidenceFiles)}
                  />
                </div>
                <div className="mt-1 text-xs text-slate-500">已上传 {accidentEvidenceFiles.length} 份佐证</div>
              </div>
            </div>
          </section>

          {/* 3. 承托关系 */}
          <section id="step-3" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-32">
            <div className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-500"></span>
                承托关系
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-end gap-2">
                <div className="w-full md:w-[220px]">
                  <label className="block text-xs text-slate-600 mb-1">货主</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="货主名称"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
                <span className="text-slate-400 pb-2">→</span>
                {logisticsCompanies.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <div className="w-full md:w-[220px]">
                      <label className="block text-xs text-slate-600 mb-1">物流公司{logisticsCompanies.length > 1 ? ` ${index + 1}` : ''}</label>
                      <input
                        type="text"
                        placeholder="物流公司"
                        value={item.name}
                        onChange={(e) => updateLogisticsCompany(item.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                      />
                    </div>
                    {index < logisticsCompanies.length - 1 && <span className="text-slate-400 pb-2">→</span>}
                  </React.Fragment>
                ))}
                <button
                  type="button"
                  onClick={addLogisticsCompany}
                  className="h-9 w-9 mt-5 shrink-0 rounded-full border border-dashed border-slate-300 bg-white text-slate-500 hover:border-blue-400 hover:text-blue-600"
                  title="可增加物流公司"
                >
                  <Plus className="w-4 h-4 mx-auto" />
                </button>
                <span className="text-slate-400 pb-2">→</span>
                <div className="w-full md:w-[220px]">
                  <label className="block text-xs text-slate-600 mb-1">承运车辆</label>
                  <input
                    type="text"
                    value={truckPlateNo}
                    onChange={(e) => setTruckPlateNo(e.target.value)}
                    placeholder="车牌号"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => relationEvidenceInputRef.current?.click()}
                  className="mt-5 px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  上传佐证
                </button>
                <input
                  ref={relationEvidenceInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) => appendEvidenceFiles(event, setRelationEvidenceFiles)}
                />
              </div>
              <div className="text-xs text-slate-500">已上传 {relationEvidenceFiles.length} 份承托关系材料</div>
            </div>
          </section>

          {/* 4. 车辆信息 */}
          <section id="step-4" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-32">
            <div className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-500"></span>
                车辆信息
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">车辆车牌</label>
                  <input
                    type="text"
                    value={truckPlateNo}
                    onChange={(e) => setTruckPlateNo(e.target.value)}
                    placeholder="例如：粤B12345"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => vehicleEvidenceInputRef.current?.click()}
                  className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  上传佐证
                </button>
                <input
                  ref={vehicleEvidenceInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) => appendEvidenceFiles(event, setVehicleEvidenceFiles)}
                />
                <span className="text-xs text-slate-500">已上传 {vehicleEvidenceFiles.length} 份（行驶证、驾驶证等）</span>
              </div>
            </div>
          </section>

          {/* 5. 货损情况 */}
          <section id="step-5" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-32">
            <div className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">货损情况</h3>
              <button
                type="button"
                onClick={() => directLossEvidenceInputRef.current?.click()}
                className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
              >
                上传佐证
              </button>
              <input
                ref={directLossEvidenceInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(event) => appendEvidenceFiles(event, setDirectLossEvidenceFiles)}
              />
            </div>

            <div className="p-6 space-y-4">
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full min-w-[1120px] table-fixed text-left border-collapse whitespace-nowrap text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                      <th className="px-4 py-2 w-16">序号</th>
                      <th className="px-4 py-2 w-[24%]">品名</th>
                      <th className="px-4 py-2 w-[16%]">型号</th>
                      <th className="px-4 py-2 w-24">数量</th>
                      <th className="px-4 py-2 w-32">包装</th>
                      <th className="px-4 py-2 w-32">单价</th>
                      <th className="px-4 py-2 w-32">损失金额</th>
                      <th className="px-4 py-2 w-40">损失类型</th>
                      <th className="px-4 py-2 w-16 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cargoList.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-slate-500">{index + 1}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateCargo(item.id, 'name', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded outline-none"
                            placeholder="品名"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={(item as any).model || ''}
                            onChange={(e) => updateCargo(item.id, 'model', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded outline-none"
                            placeholder="型号"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateCargo(item.id, 'quantity', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded outline-none"
                            placeholder="数量"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={item.unit}
                            onChange={(e) => updateCargo(item.id, 'unit', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded outline-none bg-white"
                          >
                            <option value="">包装</option>
                            <option value="木箱">木箱</option>
                            <option value="纸箱">纸箱</option>
                            <option value="编织袋">编织袋</option>
                            <option value="裸装">裸装(含缠绕膜)</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateCargo(item.id, 'price', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded outline-none"
                            placeholder="单价"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => updateCargo(item.id, 'amount', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded outline-none"
                            placeholder="损失金额"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={item.type}
                            onChange={(e) => updateCargo(item.id, 'type', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded outline-none bg-white"
                          >
                            <option value="">损失类型</option>
                            <option value="报废">报废</option>
                            <option value="更换包装">更换包装</option>
                            <option value="清洗或再加工">清洗或再加工</option>
                            <option value="贬值折价">贬值折价</option>
                            <option value="维修费">维修费</option>
                          </select>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => removeCargo(item.id)}
                            disabled={cargoList.length === 1}
                            className={`p-1 rounded ${cargoList.length === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-rose-500 hover:bg-rose-50'}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={addCargo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="w-4 h-4" />
                  新增货损
                </button>
                <div className="text-xs text-slate-500">已上传 {directLossEvidenceFiles.length} 份货损佐证</div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    const next = !showIndirectLoss;
                    setShowIndirectLoss(next);
                    if (next) {
                      setTimeout(() => scrollToStep(6), 80);
                    }
                  }}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50"
                >
                  {showIndirectLoss ? '收起间接损失' : '添加间接损失'}
                </button>
              </div>
            </div>
          </section>

          {showIndirectLoss && (
            <section id="step-6" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-32">
              <div className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900">间接损失</h3>
                <button
                  type="button"
                  onClick={() => indirectLossEvidenceInputRef.current?.click()}
                  className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  上传佐证
                </button>
                <input
                  ref={indirectLossEvidenceInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) => appendEvidenceFiles(event, setIndirectLossEvidenceFiles)}
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                        <th className="px-4 py-2 w-16">序号</th>
                        <th className="px-4 py-2 w-40">损失金额</th>
                        <th className="px-4 py-2 w-48">损失项目</th>
                        <th className="px-4 py-2">损失说明</th>
                        <th className="px-4 py-2 w-16 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {indirectLossList.map((item, index) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-slate-500">{index + 1}</td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={item.amount}
                              onChange={(e) => updateIndirectLoss(item.id, 'amount', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded outline-none"
                              placeholder="损失金额"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={item.item}
                              onChange={(e) => updateIndirectLoss(item.id, 'item', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded outline-none bg-white"
                            >
                              <option value="">请选择</option>
                              <option value="人工费">人工费</option>
                              <option value="提运费">提运费</option>
                              <option value="设备使用费">设备使用费</option>
                              <option value="其他">其他</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={item.note}
                              onChange={(e) => updateIndirectLoss(item.id, 'note', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded outline-none"
                              placeholder="损失说明"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => removeIndirectLoss(item.id)}
                              disabled={indirectLossList.length === 1}
                              className={`p-1 rounded ${indirectLossList.length === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-rose-500 hover:bg-rose-50'}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={addIndirectLoss}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
                  >
                    <Plus className="w-4 h-4" />
                    新增间接损失
                  </button>
                  <div className="text-xs text-slate-500">已上传 {indirectLossEvidenceFiles.length} 份间接损失佐证</div>
                </div>
              </div>
            </section>
          )}

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">备注</label>
            <div className="flex items-end gap-3">
              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="备注说明..."
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => remarkEvidenceInputRef.current?.click()}
                className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
              >
                上传佐证
              </button>
              <input
                ref={remarkEvidenceInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(event) => appendEvidenceFiles(event, setRemarkEvidenceFiles)}
              />
            </div>
            <div className="mt-1 text-xs text-slate-500">已上传 {remarkEvidenceFiles.length} 份备注附件</div>
          </section>
        </div>

        {/* Right Side Stepper Sidebar */}
        <div className="w-48 shrink-0 sticky top-[84px] hidden lg:block">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">理赔进度</div>
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              
              return (
                <button 
                  key={step.id}
                  onClick={() => scrollToStep(step.id)}
                  className={`
                    w-full flex items-center gap-3 p-2 rounded-lg transition-all group text-left
                    ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600'}
                  `}
                >
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shrink-0
                    ${isCompleted ? 'bg-emerald-500 text-white' : 
                      isActive ? 'bg-blue-600 text-white' : 
                      'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}
                  `}>
                    {isCompleted ? (
                      <Check className="w-3 h-3" />
                    ) : step.icon ? (
                      <ClipboardList className="w-3 h-3" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-xs font-medium truncate">
                    {step.name}
                  </span>
                  {isActive && (
                    <div className="w-1 h-4 bg-blue-600 rounded-full ml-auto"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Toolbar */}
        <div className="sticky bottom-0 -mx-6 -mb-6 lg:-mx-8 lg:-mb-6 mt-auto bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex flex-wrap justify-between items-center px-6 lg:px-8 gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const attachmentUrl = new URL(window.location.href);
                attachmentUrl.searchParams.set('page', 'attachments');
                attachmentUrl.searchParams.set('assistNo', selectedClaim.assistNo || '');
                attachmentUrl.searchParams.set('mode', 'upload');
                window.open(attachmentUrl.toString(), '_blank');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              上传附件
            </button>
            <button
              type="button"
              onClick={() => {
                const attachmentUrl = new URL(window.location.href);
                attachmentUrl.searchParams.set('page', 'attachments');
                attachmentUrl.searchParams.set('assistNo', selectedClaim.assistNo || '');
                attachmentUrl.searchParams.set('mode', 'view');
                window.open(attachmentUrl.toString(), '_blank');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              查看附件
            </button>
          </div>
          <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedClaim(null)}
            className="px-6 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            返回列表
          </button>
          <button
            onClick={() => {
              onDraftSave({
                ...selectedClaim,
                status: '已暂存',
              });
              setSelectedClaim(null);
            }}
            disabled={isLocked}
            className="px-6 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            暂存
          </button>
          <button 
            onClick={() => {
              setShowSubmitConfirm(true);
            }}
            disabled={isLocked || !canSubmit}
            className="px-6 py-2 bg-blue-600 shadow-sm rounded-md text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            提交
          </button>
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                确认提交
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                提交后理赔协助将进入审批流程，页面变为只读，确定提交吗？
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowSubmitConfirm(false);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitConfirm}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="mb-4 text-sm font-semibold text-slate-900">查询条件</div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs text-slate-600 mb-1">保单号</label>
            <input
              type="text"
              value={draftListFilter.policyNo}
              onChange={(event) => setDraftListFilter((prev) => ({ ...prev, policyNo: event.target.value }))}
              placeholder="按保单号模糊搜索"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">报案号</label>
            <input
              type="text"
              value={draftListFilter.reportNo}
              onChange={(event) => setDraftListFilter((prev) => ({ ...prev, reportNo: event.target.value }))}
              placeholder="按报案号搜索"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">出险时间</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={draftListFilter.dateFrom}
                onChange={(event) => setDraftListFilter((prev) => ({ ...prev, dateFrom: event.target.value }))}
                className="w-full px-2 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="date"
                value={draftListFilter.dateTo}
                onChange={(event) => setDraftListFilter((prev) => ({ ...prev, dateTo: event.target.value }))}
                className="w-full px-2 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">目前状态</label>
            <select
              value={draftListFilter.status}
              onChange={(event) => setDraftListFilter((prev) => ({ ...prev, status: event.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">全部</option>
              <option value="已暂存">暂存</option>
              <option value="已提交">待审核</option>
              <option value="审核中">审核中</option>
              <option value="已退回">退回</option>
              <option value="已通过">通过</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">事故类型</label>
            <select
              value={draftListFilter.accidentType}
              onChange={(event) => setDraftListFilter((prev) => ({ ...prev, accidentType: event.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">全部</option>
              {accidentTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">索赔金额</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={draftListFilter.claimAmountMin}
                onChange={(event) => setDraftListFilter((prev) => ({ ...prev, claimAmountMin: event.target.value }))}
                placeholder="最小"
                className="w-full px-2 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                value={draftListFilter.claimAmountMax}
                onChange={(event) => setDraftListFilter((prev) => ({ ...prev, claimAmountMax: event.target.value }))}
                placeholder="最大"
                className="w-full px-2 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setListFilter(draftListFilter)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Search className="w-4 h-4" />
            查询
          </button>
          <button
            type="button"
            onClick={exportRows}
            className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
          >
            导出
          </button>
          <button
            type="button"
            onClick={() => {
              setDraftListFilter(emptyListFilter);
              setListFilter(emptyListFilter);
            }}
            className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
          >
            重置
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="pb-4 flex justify-between items-center">
          <div className="text-sm text-slate-500">共找到 <span className="font-medium text-slate-900">{filteredRows.length}</span> 条理赔记录</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/60 border-y border-slate-200 text-xs uppercase tracking-wider text-slate-600 font-semibold">
                <th className="px-4 py-3">出险时间</th>
                <th className="px-4 py-3">险种</th>
                <th className="px-4 py-3">保险公司</th>
                <th className="px-4 py-3">保单号</th>
                <th className="px-4 py-3">报案号</th>
                <th className="px-4 py-3">索赔金额</th>
                <th className="px-4 py-3">事故类型</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3">审核时效</th>
                <th className="px-4 py-3">理赔员</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setSelectedClaim(row)}>
                  <td className="px-4 py-3 text-slate-600">{row.accidentTime || '--'}</td>
                  <td className="px-4 py-3 text-slate-800">{row.type || '--'}</td>
                  <td className="px-4 py-3 text-slate-900">{row.company || '--'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{row.policyNo || '--'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{row.reportNo || '--'}</td>
                  <td className="px-4 py-3 text-rose-600">{row.claimAmount || '--'}</td>
                  <td className="px-4 py-3 text-slate-700">{row.accidentType || '--'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      row.status === '' ? 'bg-slate-100 text-slate-600' :
                      row.status === '已暂存' ? 'bg-slate-100 text-slate-700' :
                      row.status === '已提交' ? 'bg-blue-100 text-blue-700' :
                      row.status === '审核中' ? 'bg-amber-100 text-amber-700' :
                      row.status === '已通过' ? 'bg-emerald-100 text-emerald-700' :
                      row.status === '已退回' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {row.status === '' ? '草稿' : (row.status || '--')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.reviewAging || '--'}</td>
                  <td className="px-4 py-3 text-slate-700">{row.claimHandler || '--'}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs transition-colors p-1 rounded hover:bg-blue-50">
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center text-sm text-slate-500">
                    当前筛选条件下暂无理赔记录
                  </td>
                </tr>
              )}
            </tbody>
            {filteredRows.length > 0 && (
              <tfoot>
                <tr className="border-t border-slate-300 bg-slate-50 text-sm font-semibold text-slate-800">
                  <td className="px-4 py-3" colSpan={5}>合计</td>
                  <td className="px-4 py-3 text-rose-600">{formatMoney(listTotals.claimAmount)}</td>
                  <td className="px-4 py-3" colSpan={4}>案件数：{listTotals.count}</td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
