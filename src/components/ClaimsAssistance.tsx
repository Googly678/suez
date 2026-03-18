import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronDown, Search, Filter, MoreHorizontal, Plus, Upload, FileText, AlertCircle, Check, ClipboardList, Building2, Trash2 } from 'lucide-react';

const mockClaimsData = [
  { id: 'CLM-20260301-001', customerCode: 'SF001', policyNo: 'POL-2026-8899001', company: '平安财险', type: '物流责任险', insured: '顺丰速运, 顺丰航空', startTime: '2026-01-01', endTime: '2026-12-31', status: '待处理' },
  { id: 'CLM-20260302-002', customerCode: 'KY003', policyNo: 'POL-2026-8899002', company: '太平洋产险', type: '物流责任险', insured: '跨越速运', startTime: '2026-02-15', endTime: '2027-02-14', status: '处理中' },
  { id: 'CLM-20260305-003', customerCode: 'DD002', policyNo: 'POL-2026-8899003', company: '人保财险', type: '物流责任险', insured: '滴滴货运', startTime: '2025-06-01', endTime: '2026-05-31', status: '已结案' },
];

import { locationData } from '../constants/locations';

export default function ClaimsAssistance({ selectedOrder, onSubmit }: { selectedOrder?: any, onSubmit: (claim: any) => void }) {
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  // If a selectedOrder is passed, pre-fill it as a new claim
  useEffect(() => {
    if (selectedOrder) {
      setSelectedClaim({
        id: 'NEW-CLAIM',
        customerCode: selectedOrder.customerCode,
        policyNo: selectedOrder.policyNo,
        company: '平安财险', // Default or from order
        type: '物流责任险',
        insured: selectedOrder.customer,
        startTime: '2026-01-01',
        endTime: '2026-12-31',
        status: '理赔申请'
      });
    }
  }, [selectedOrder]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showIndirectLoss, setShowIndirectLoss] = useState(false);
  const [cargoList, setCargoList] = useState([{ id: 1, name: '', quantity: '', unit: '', price: '', amount: '', type: '' }]);
  const [accidentInfo, setAccidentInfo] = useState({
    time: '',
    reportTime: '',
    reportNo: '',
    province: '',
    city: '',
    district: '',
    address: '',
    reason1: '',
    reason2: '',
    description: ''
  });

  const availableCities = accidentInfo.province ? Object.keys(locationData[accidentInfo.province] || {}) : [];
  const availableDistricts = (accidentInfo.province && accidentInfo.city) ? locationData[accidentInfo.province][accidentInfo.city] : [];

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
    setCargoList([...cargoList, { id: Date.now(), name: '', quantity: '', unit: '', price: '', amount: '', type: '' }]);
  };

  const removeCargo = (id: number) => {
    if (cargoList.length > 1) {
      setCargoList(cargoList.filter(item => item.id !== id));
    }
  };

  const updateCargo = (id: number, field: string, value: string) => {
    setCargoList(cargoList.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  if (selectedClaim) {
    return (
      <div className="flex flex-col h-full relative flex-1">
        {/* Compact Fixed Top Area (Basic Info) */}
        <div ref={headerRef} className="sticky top-0 -mx-6 -mt-6 lg:-mx-8 lg:-mt-6 pt-6 px-6 lg:px-8 bg-slate-50 z-40 pb-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-3 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">客户名称</div>
                <div className="text-sm font-bold text-slate-900 truncate">{selectedClaim.insured.split(',')[0]}</div>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            <div className="hidden md:grid grid-cols-4 gap-x-8 gap-y-1 flex-1">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">保单号</div>
                <div className="text-xs font-medium text-slate-900 truncate">{selectedClaim.policyNo}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">累计理赔/总保额</div>
                <div className="text-xs font-bold text-slate-900">
                  <span className="text-rose-600">¥62.5万</span> / <span className="text-slate-400">¥500万</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">理赔案件总数</div>
                <div className="text-xs font-bold text-slate-900">24 <span className="text-[10px] font-normal text-slate-400 ml-1">(已结 18)</span></div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">剩余保额占比</div>
                <div className="text-xs font-bold text-emerald-600">87.5%</div>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden lg:block"></div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">当前累计理赔</div>
                <div className="text-sm font-bold text-rose-600">¥625,000.00</div>
              </div>
              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden xl:block">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '12.5%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-start flex-1">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6 pb-24">
            {/* 案件处理进度 */}
            <div className="bg-[#f5f3ff] rounded-2xl border border-purple-100 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-12">案件处理进度</h3>
              <div className="relative flex justify-between items-center px-12">
                {/* Connecting Line */}
                <div className="absolute left-12 right-12 h-1 bg-blue-400 top-1/2 -translate-y-1/2"></div>
                
                {/* Steps */}
                {[
                  { title: '理赔申请', detail: '申请人：', name: '顺丰客户', statusKey: '理赔申请' },
                  { title: '理赔审核', detail: '审核人：', name: '太平洋保险', statusKey: '理赔审核' },
                  { title: '理赔通过', detail: '申请人：', name: '顺丰客户', statusKey: '理赔通过' },
                  { title: '赔付通过', detail: '申请人：', name: '顺丰客户', statusKey: '赔付通过' },
                ].map((step, index) => {
                  const isActive = selectedClaim.status === step.statusKey;
                  const isCompleted = ['理赔申请', '理赔审核', '理赔通过', '赔付通过'].indexOf(selectedClaim.status) > index;
                  const isRed = selectedClaim.status === '理赔通过' && selectedClaim.isReturned && step.statusKey === '理赔通过';

                  return (
                    <div key={index} className="relative flex flex-col items-center z-10">
                      {/* Title above dot */}
                      <div className={`absolute -top-8 whitespace-nowrap text-sm font-medium ${
                        isActive || isCompleted ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        {step.title}
                      </div>
                      
                      {/* Dot */}
                      <div className={`w-5 h-5 rounded-full border-4 border-white shadow-sm transition-colors ${
                        isRed ? 'bg-red-500' :
                        isActive ? 'bg-blue-500 ring-4 ring-blue-500/20' : 
                        isCompleted ? 'bg-blue-500' : 'bg-slate-200'
                      }`}></div>
                      
                      {/* Detail below dot */}
                      <div className="absolute top-8 whitespace-nowrap text-center text-xs text-slate-500 leading-tight">
                        <div>{step.detail}</div>
                        <div className="font-medium">{step.name}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="h-10"></div> {/* Spacer for the details below */}
            </div>

            {/* 最新审核意见 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  最新审核意见
                </h4>
                <button className="text-[10px] font-bold text-blue-600 hover:underline">历史记录</button>
              </div>
              <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100">
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "初步审核通过，请补充上传事故现场的高清照片以及驾驶员的从业资格证扫描件。"
                </p>
                <div className="mt-2 text-[10px] text-slate-400 text-right">— 审核员 王五 2026-03-13</div>
              </div>
            </div>

            {/* 1. 基础信息 */}
            <section id="step-1" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-32">
            <div className="w-full px-6 py-4 flex items-center justify-between bg-white">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-6 rounded-full bg-blue-500"></span>
                基础信息
              </h3>
            </div>
            <div className="px-6 pb-6">
              <div className="h-px bg-slate-200 mb-6"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6 bg-slate-50/80 p-8 rounded-2xl border border-slate-100">
                  <div>
                    <div className="text-sm text-slate-500 mb-1">客户唯一编码</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedClaim.customerCode || '--'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">保单号</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedClaim.policyNo}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">保险公司</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedClaim.company}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">险种</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedClaim.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">被保险人</div>
                    <div className="text-sm text-slate-900 font-medium">
                      <div className="flex flex-col gap-1">
                        {selectedClaim.insured.split(',').map((name: string, i: number) => (
                          <span key={i}>{name.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">投保人</div>
                    <div className="text-sm text-slate-900 font-medium">
                      <div className="flex flex-col gap-1">
                        {selectedClaim.insured.split(',').map((name: string, i: number) => (
                          <span key={i}>{name.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">保险期限</div>
                    <div className="text-sm text-slate-900 font-medium">{selectedClaim.startTime} 至 {selectedClaim.endTime}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">赔偿限额</div>
                    <div className="text-sm text-slate-900 font-medium">¥5,000,000.00</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">营业收入</div>
                    <div className="text-sm text-slate-900 font-medium">¥50,000,000.00</div>
                  </div>
                  <div className="col-span-2 md:col-span-3 lg:col-span-4">
                    <div className="text-sm text-slate-500 mb-1">免赔条件</div>
                    <div className="text-sm text-slate-900">每次事故绝对免赔额为人民币5000元或损失金额的10%，两者以高者为准。</div>
                  </div>
                  <div className="col-span-2 md:col-span-3 lg:col-span-4">
                    <div className="text-sm text-slate-500 mb-1">特约条款</div>
                    <div className="text-sm text-slate-900 flex items-center gap-2">
                      <span className="truncate max-w-2xl">1. 扩展承保冷链运输风险；2. 扩展承保装卸过程中的意外损失...</span>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-3 lg:col-span-4 flex justify-end gap-4 mt-4">
                    <button className="px-6 py-2 text-xs font-bold text-blue-500 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all shadow-sm">
                      查看保单
                    </button>
                    <button className="px-6 py-2 text-xs font-bold text-blue-500 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all shadow-sm">
                      查看报案材料
                    </button>
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
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">出险时间</label>
                    <input type="datetime-local" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">报案时间</label>
                    <input type="datetime-local" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">报案号 (保司)</label>
                    <input type="text" placeholder="请输入保险公司报案号" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  
                  <div className="space-y-1.5 lg:col-span-3">
                    <label className="text-sm font-medium text-slate-700">出险地点</label>
                    <div className="flex gap-2">
                      <select 
                        value={accidentInfo.province}
                        onChange={(e) => setAccidentInfo({ ...accidentInfo, province: e.target.value, city: '', district: '' })}
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                      >
                        <option value="">选择省份</option>
                        {Object.keys(locationData).map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <select 
                        value={accidentInfo.city}
                        onChange={(e) => setAccidentInfo({ ...accidentInfo, city: e.target.value, district: '' })}
                        disabled={!accidentInfo.province}
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white disabled:bg-slate-50"
                      >
                        <option value="">选择城市</option>
                        {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select 
                        value={accidentInfo.district}
                        onChange={(e) => setAccidentInfo({ ...accidentInfo, district: e.target.value })}
                        disabled={!accidentInfo.city}
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white disabled:bg-slate-50"
                      >
                        <option value="">选择区县</option>
                        {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <input 
                        type="text" 
                        placeholder="详细地址" 
                        value={accidentInfo.address}
                        onChange={(e) => setAccidentInfo({ ...accidentInfo, address: e.target.value })}
                        className="flex-[2] px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 lg:col-span-3">
                    <label className="text-sm font-medium text-slate-700">事故原因</label>
                    <div className="flex gap-2">
                      <select className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="">一级目录</option>
                        <option value="交通事故">交通事故</option>
                        <option value="自然灾害">自然灾害</option>
                        <option value="意外事故">意外事故</option>
                      </select>
                      <select className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="">二级目录</option>
                        <option value="追尾">追尾</option>
                        <option value="侧翻">侧翻</option>
                        <option value="碰撞">碰撞</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 lg:col-span-3">
                    <label className="text-sm font-medium text-slate-700">事故情况说明</label>
                    <textarea rows={3} placeholder="请详细描述事故发生的过程..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"></textarea>
                  </div>
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
            
            <div className="p-6">
              <div className="py-8">
                  <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                    <div className="w-full sm:w-auto sm:flex-1 max-w-[180px] space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center relative">
                        <div className="text-[10px] font-bold text-blue-600 mb-1">发货人</div>
                        <input type="text" placeholder="输入名称" className="w-full text-xs text-center bg-transparent border-b border-blue-200 focus:border-blue-500 outline-none" />
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border border-blue-200 rounded-full flex items-center justify-center z-10">
                          <Check className="w-2.5 h-2.5 text-blue-600" />
                        </div>
                      </div>
                      <button className="w-full py-1 border border-dashed border-slate-300 rounded text-[10px] text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-1">
                        <Upload className="w-3 h-3" /> 上传凭证
                      </button>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-px bg-slate-300"></div>
                      <button className="w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                        <Plus className="w-3 h-3" />
                      </button>
                      <div className="w-6 h-px bg-slate-300"></div>
                    </div>

                    <div className="w-full sm:w-auto sm:flex-1 max-w-[180px] space-y-3">
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center relative">
                        <div className="text-[10px] font-bold text-indigo-600 mb-1">物流公司 (一级)</div>
                        <input type="text" placeholder="输入名称" className="w-full text-xs text-center bg-transparent border-b border-indigo-200 focus:border-indigo-500 outline-none" />
                      </div>
                      <button className="w-full py-1 border border-dashed border-slate-300 rounded text-[10px] text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-1">
                        <Upload className="w-3 h-3" /> 上传凭证
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-px bg-slate-300"></div>
                      <button className="w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                        <Plus className="w-3 h-3" />
                      </button>
                      <div className="w-6 h-px bg-slate-300"></div>
                    </div>

                    <div className="w-full sm:w-auto sm:flex-1 max-w-[180px] space-y-3">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center relative">
                        <div className="text-[10px] font-bold text-emerald-600 mb-1">承运车辆</div>
                        <input type="text" placeholder="输入名称/车牌" className="w-full text-xs text-center bg-transparent border-b border-emerald-200 focus:border-emerald-500 outline-none" />
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border border-emerald-200 rounded-full flex items-center justify-center z-10">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                        </div>
                      </div>
                      <button className="w-full py-1 border border-dashed border-slate-300 rounded text-[10px] text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-1">
                        <Upload className="w-3 h-3" /> 上传凭证
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 text-center text-[10px] text-slate-400 font-medium">
                    提示：点击中间的 "+" 号可增加多级分包关系
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">启运地</label>
                    <div className="flex gap-2">
                      <select className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="">省</option>
                        <option value="广东">广东省</option>
                      </select>
                      <select className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="">市</option>
                        <option value="深圳">深圳市</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">目的地</label>
                    <div className="flex gap-2">
                      <select className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="">省</option>
                        <option value="北京">北京市</option>
                      </select>
                      <select className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="">市</option>
                        <option value="北京">北京市</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 lg:col-span-2">
                    <label className="text-sm font-medium text-slate-700">承托关系凭证 (运单、运输合同等)</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 mb-2 text-slate-400" />
                      <span className="text-sm">点击或拖拽文件上传</span>
                    </div>
                  </div>
                </div>
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
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">车牌号</label>
                    <input type="text" placeholder="车牌号" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">驾驶员姓名</label>
                    <input type="text" placeholder="驾驶员姓名" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">联系电话</label>
                    <input type="text" placeholder="联系电话" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>

                  <div className="space-y-1.5 lg:col-span-3">
                    <label className="text-sm font-medium text-slate-700">车辆资料 (驾驶证、车辆行驶证、装车清单等)</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 mb-2 text-slate-400" />
                      <span className="text-sm">点击或拖拽文件上传</span>
                    </div>
                  </div>
                </div>
              </div>
          </section>

          {/* 5. 直接损失 */}
          <section id="step-5" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-32">
            <div className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-500"></span>
                直接损失
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">受损货物清单</label>
                      <button 
                        onClick={addCargo}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> 添加货物
                      </button>
                    </div>
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                            <th className="px-4 py-2 w-16">序号</th>
                            <th className="px-4 py-2">品名</th>
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
                                  className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
                                  placeholder="输入品名" 
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input 
                                  type="number" 
                                  value={item.quantity}
                                  onChange={(e) => updateCargo(item.id, 'quantity', e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
                                  placeholder="数量" 
                                />
                              </td>
                              <td className="px-4 py-2">
                                <select 
                                  value={item.unit}
                                  onChange={(e) => updateCargo(item.id, 'unit', e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                >
                                  <option value="">选择包装</option>
                                  <option value="木箱">木箱</option>
                                  <option value="纸箱">纸箱</option>
                                  <option value="托盘">托盘</option>
                                  <option value="裸装">裸装 (包括缠绕膜)</option>
                                </select>
                              </td>
                              <td className="px-4 py-2">
                                <input 
                                  type="number" 
                                  value={item.price}
                                  onChange={(e) => updateCargo(item.id, 'price', e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
                                  placeholder="单价" 
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input 
                                  type="number" 
                                  value={item.amount}
                                  onChange={(e) => updateCargo(item.id, 'amount', e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
                                  placeholder="金额" 
                                />
                              </td>
                              <td className="px-4 py-2">
                                <select 
                                  value={item.type}
                                  onChange={(e) => updateCargo(item.id, 'type', e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                >
                                  <option value="">选择类型</option>
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
                                  className={`p-1 rounded transition-colors ${cargoList.length === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-rose-500 hover:bg-rose-50 hover:text-rose-700'}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
                            <td colSpan={5} className="px-4 py-2 text-right">合计损失金额:</td>
                            <td className="px-4 py-2 text-rose-600">¥{cargoList.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2)}</td>
                            <td colSpan={2}></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">货物损失凭证 (销售合同、发票、维修清单、维修发票等)</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 mb-2 text-slate-400" />
                      <span className="text-sm">点击或拖拽文件上传</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">间接损失</h4>
                      <p className="text-xs text-slate-500 mt-0.5">如涉及人工费、运输费等额外支出，请开启录入</p>
                    </div>
                    <button 
                      onClick={() => {
                        const newState = !showIndirectLoss;
                        setShowIndirectLoss(newState);
                        if (newState) {
                          setTimeout(() => scrollToStep(6), 100);
                        }
                      }}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        showIndirectLoss 
                          ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100' 
                          : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      {showIndirectLoss ? '取消间接损失' : '添加间接损失'}
                    </button>
                  </div>
                </div>
              </div>
          </section>
          
          {showIndirectLoss && (
            <section id="step-6" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-32">
              <div className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-rose-500"></span>
                  间接损失
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">人工费用</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                      <input type="number" className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">额外运费</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                      <input type="number" className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">费用说明</label>
                    <textarea rows={3} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="请详细说明间接损失的构成及计算依据..."></textarea>
                  </div>
                </div>
              </div>
            </section>
          )}
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
        <div className="sticky bottom-0 -mx-6 -mb-6 lg:-mx-8 lg:-mb-6 mt-auto bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-end items-center px-6 lg:px-8 gap-4">
          <button className="px-6 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            暂存
          </button>
          <button 
            onClick={() => {
              onSubmit(selectedClaim);
              setSelectedClaim(null);
            }}
            className="px-6 py-2 bg-blue-600 shadow-sm rounded-md text-white font-medium hover:bg-blue-700 transition-colors"
          >
            提交
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filter Section */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <div className="flex flex-wrap gap-x-6 gap-y-5">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">综合搜索</label>
            <input 
              type="text" 
              placeholder="保单号/被保险人" 
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
            />
          </div>
          
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">保险公司</label>
            <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option value="">全部</option>
              <option value="平安财险">平安财险</option>
              <option value="太平洋产险">太平洋产险</option>
              <option value="人保财险">人保财险</option>
            </select>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[280px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">保险期限</label>
            <div className="flex items-center w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
              <input type="date" className="bg-transparent border-none focus:outline-none text-slate-700 w-full flex-1 cursor-pointer" />
              <span className="text-slate-300 mx-2 text-xs">至</span>
              <input type="date" className="bg-transparent border-none focus:outline-none text-slate-700 w-full flex-1 cursor-pointer" />
            </div>
          </div>
        </div>
        
        <div className="mt-5 flex justify-end gap-3">
          <button className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 hover:text-slate-900 transition-colors">重置</button>
          <button className="px-4 py-1.5 text-sm font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">查询</button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        <div className="pb-4 flex justify-between items-center">
          <div className="text-sm text-slate-500">共找到 <span className="font-medium text-slate-900">{mockClaimsData.length}</span> 条理赔协助记录</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-y border-slate-200 text-xs uppercase tracking-wider text-slate-600 font-semibold">
                <th className="px-4 py-3">保单号</th>
                <th className="px-4 py-3">保险公司</th>
                <th className="px-4 py-3">险种</th>
                <th className="px-4 py-3">被保险人(客户名称)</th>
                <th className="px-4 py-3">开始时间</th>
                <th className="px-4 py-3">结束时间</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {mockClaimsData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setSelectedClaim({ ...row, status: row.status === '待处理' ? '理赔申请' : row.status })}>
                  <td className="px-4 py-3 font-mono text-slate-600 text-xs">{row.policyNo}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.company}</td>
                  <td className="px-4 py-3 text-slate-800">{row.type}</td>
                  <td className="px-4 py-3 text-slate-800">
                    <div className="flex flex-col gap-1">
                      {row.insured.split(',').map((name, i) => (
                        <span key={i}>{name.trim()}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.startTime}</td>
                  <td className="px-4 py-3 text-slate-600">{row.endTime}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      row.status === '待处理' ? 'bg-amber-100/50 text-amber-800' :
                      row.status === '处理中' ? 'bg-blue-100/50 text-blue-800' :
                      'bg-emerald-100/50 text-emerald-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs transition-colors p-1 rounded hover:bg-blue-50">
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
