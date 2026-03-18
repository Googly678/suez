import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, Search, Filter, Plus, Upload, FileText, AlertCircle, Check, ClipboardList, Building2, Trash2, Calculator, CheckCircle2 } from 'lucide-react';

const mockAppraisalData = [
  { 
    id: 'CLM-20260301-001', 
    customerCode: 'SF001',
    policyNo: 'POL-2026-8899001', 
    company: '平安财险', 
    type: '物流责任险', 
    insured: '顺丰速运, 顺丰航空', 
    startTime: '2026-01-01', 
    endTime: '2026-12-31',
    status: '待理算', 
    reporter: '张三', 
    reportTime: '2026-03-15 10:00' 
  },
  { 
    id: 'CLM-20260302-002', 
    customerCode: 'KY003',
    policyNo: 'POL-2026-8899002', 
    company: '太平洋产险', 
    type: '物流责任险', 
    insured: '跨越速运', 
    startTime: '2026-02-15', 
    endTime: '2027-02-14',
    status: '理算中', 
    reporter: '李四', 
    reportTime: '2026-03-14 15:30' 
  },
];

export default function AppraisalClaims({ claimsPool, onAppraisalSubmit }: { claimsPool: any[], onAppraisalSubmit: (claimId: string, appraisalData: any) => void }) {
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const displayData = [...mockAppraisalData, ...claimsPool];

  if (selectedCase) {
    return (
      <div className="flex flex-col h-full relative flex-1">
        {/* Header */}
        <div className="sticky top-0 -mx-6 -mt-6 lg:-mx-8 lg:-mt-6 pt-6 px-6 lg:px-8 bg-slate-50 z-40 pb-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-3 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3 min-w-0">
              <button 
                onClick={() => setSelectedCase(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">案件编号</div>
                <div className="text-sm font-bold text-slate-900 truncate">{selectedCase.id}</div>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            <div className="hidden md:grid grid-cols-3 gap-x-8 gap-y-1 flex-1">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">保单号</div>
                <div className="text-xs font-medium text-slate-900 truncate">{selectedCase.policyNo}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">被保险人</div>
                <div className="text-xs font-bold text-slate-900 truncate">{selectedCase.insured}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">报案时间</div>
                <div className="text-xs font-bold text-slate-900">{selectedCase.reportTime}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                selectedCase.status === '待理算' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {selectedCase.status}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 pb-24 mt-4">
          <div className="bg-[#f5f3ff] rounded-2xl border border-purple-100 p-4 shadow-sm mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-900 font-medium">以下理赔协助信息来自业务端录入，当前页面仅供公估理算参考（只读）。</span>
          </div>

          {/* 1. 基础信息 (Read-only) */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-500"></span>
                基础信息
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50/80 p-6 rounded-xl border border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">客户唯一编码</div>
                  <div className="text-sm text-slate-900 font-bold">{selectedCase.customerCode || '--'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">保单号</div>
                  <div className="text-sm text-slate-900 font-bold">{selectedCase.policyNo}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">保险公司</div>
                  <div className="text-sm text-slate-900 font-bold">{selectedCase.company}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">险种</div>
                  <div className="text-sm text-slate-900 font-bold">{selectedCase.type}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">被保险人 / 投保人</div>
                  <div className="text-sm text-slate-900 font-bold">{selectedCase.insured}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">保险期限</div>
                  <div className="text-sm text-slate-900 font-bold">{selectedCase.startTime} 至 {selectedCase.endTime}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">赔偿限额</div>
                  <div className="text-sm text-slate-900 font-bold">¥5,000,000.00</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">免赔条件</div>
                  <div className="text-sm text-slate-900 font-bold">每次事故绝对免赔额为人民币5000元或损失金额的10%</div>
                </div>
                <div className="md:col-span-4">
                  <div className="text-xs text-slate-500 mb-1 font-bold">特约条款</div>
                  <div className="text-sm text-slate-900 font-bold">1. 扩展承保冷链运输风险；2. 扩展承保装卸过程中的意外损失...</div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. 事故信息 (Read-only) */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-500"></span>
                事故信息
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">出险时间</div>
                  <div className="text-sm text-slate-900 font-bold">2026-03-12 14:30</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">报案时间</div>
                  <div className="text-sm text-slate-900 font-bold">{selectedCase.reportTime}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">报案号 (保司)</div>
                  <div className="text-sm text-slate-900 font-bold">RPT-20260312-001</div>
                </div>
                <div className="md:col-span-1">
                  <div className="text-xs text-slate-500 mb-1 font-bold">出险地点</div>
                  <div className="text-sm text-slate-900 font-bold">湖南省长沙市长沙县某高速路段</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs text-slate-500 mb-1 font-bold">事故原因</div>
                  <div className="text-sm text-slate-900 font-bold">交通事故 - 追尾</div>
                </div>
                <div className="md:col-span-3">
                  <div className="text-xs text-slate-500 mb-1 font-bold">事故情况说明</div>
                  <div className="text-sm text-slate-900 font-bold">车辆在高速行驶过程中，因前方车辆紧急刹车，导致本车追尾，造成车上货物受损。现场无人员伤亡。</div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. 承托关系 (Read-only) */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-500"></span>
                承托关系
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50/50 p-4 rounded-lg border border-slate-100 mb-6">
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">发货人</div>
                  <div className="text-sm text-slate-900 font-bold">深圳某电子厂</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">物流公司 (一级)</div>
                  <div className="text-sm text-slate-900 font-bold">信丰物流</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">实际承运人</div>
                  <div className="text-sm text-slate-900 font-bold">张师傅车队</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">承托关系凭证</div>
                  <div className="text-sm text-blue-600 font-bold cursor-pointer hover:underline flex items-center gap-1">
                    <FileText className="w-4 h-4" /> 查看运单/合同
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">启运地</div>
                  <div className="text-sm text-slate-900 font-bold">广东省深圳市</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">目的地</div>
                  <div className="text-sm text-slate-900 font-bold">北京市朝阳区</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm font-bold text-slate-700">
                <Building2 className="w-4 h-4 text-blue-500" />
                车辆信息
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50/50 p-4 rounded-lg border border-slate-100 mt-2">
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">车牌号</div>
                  <div className="text-sm text-slate-900 font-bold">粤B·12345</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">驾驶员姓名</div>
                  <div className="text-sm text-slate-900 font-bold">王大明</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">联系电话</div>
                  <div className="text-sm text-slate-900 font-bold">138****0000</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-bold">车辆资料</div>
                  <div className="text-sm text-blue-600 font-bold cursor-pointer hover:underline flex items-center gap-1">
                    <FileText className="w-4 h-4" /> 查看证件
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. 损失情况 (Read-only) */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-500"></span>
                损失情况
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">受损货物清单 (直接损失)</h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                        <th className="px-4 py-2 w-16">序号</th>
                        <th className="px-4 py-2">品名</th>
                        <th className="px-4 py-2 w-24">数量</th>
                        <th className="px-4 py-2 w-32">包装</th>
                        <th className="px-4 py-2 w-32">单价</th>
                        <th className="px-4 py-2 w-40">损失类型</th>
                        <th className="px-4 py-2 w-32 text-right">损失金额</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="px-4 py-2 text-slate-500">1</td>
                        <td className="px-4 py-2 font-medium">某品牌电子设备机箱</td>
                        <td className="px-4 py-2">50</td>
                        <td className="px-4 py-2">纸箱</td>
                        <td className="px-4 py-2">¥1,000.00</td>
                        <td className="px-4 py-2">报废</td>
                        <td className="px-4 py-2 text-right font-medium text-rose-600">¥50,000.00</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
                        <td colSpan={6} className="px-4 py-2 text-right">直接损失合计:</td>
                        <td className="px-4 py-2 text-right text-rose-600">¥50,000.00</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="text-sm text-blue-600 font-bold cursor-pointer hover:underline flex items-center gap-1">
                    <FileText className="w-4 h-4" /> 查看货物损失凭证
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">间接损失</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                  <div>
                    <div className="text-xs text-slate-500 mb-1 font-bold">人工费用</div>
                    <div className="text-sm text-slate-900 font-bold">¥1,200.00</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1 font-bold">额外运费</div>
                    <div className="text-sm text-slate-900 font-bold">¥800.00</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs text-slate-500 mb-1 font-bold">费用说明</div>
                    <div className="text-sm text-slate-900 font-bold">事故现场的残骸清理及转运。</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. 现场照片 (Read-only) */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-500"></span>
                现场照片
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden group relative">
                    <img 
                      src={`https://picsum.photos/seed/accident${i}/400/300`} 
                      alt={`现场照片 ${i}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="text-white text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">查看大图</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. 公估理算录入 (Editable) */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-500"></span>
                公估理算录入
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">公估公司</label>
                  <input type="text" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-500 outline-none" value="泛华公估" readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">公估师</label>
                  <input type="text" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-500 outline-none" value="张三" readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">联系电话</label>
                  <input type="text" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-500 outline-none" value="13800138000" readOnly />
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-500" />
                  理算金额核定
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">损失金额 (A)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">¥</span>
                      <input 
                        type="number" 
                        className="w-full pl-7 pr-3 py-2 text-sm font-bold border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500/20 outline-none" 
                        defaultValue="50000.00" 
                        max={5000000}
                        onBlur={(e) => {
                          if (parseFloat(e.target.value) > 5000000) {
                            e.target.value = "5000000.00";
                            alert("理算金额不能超过保单限额 ¥5,000,000.00");
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">免赔额/率 (B)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">¥</span>
                      <input type="number" className="w-full pl-7 pr-3 py-2 text-sm font-bold border border-slate-300 rounded-md bg-white" defaultValue="500.00" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">残值扣除 (C)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">¥</span>
                      <input type="number" className="w-full pl-7 pr-3 py-2 text-sm font-bold border border-slate-300 rounded-md bg-white" defaultValue="0.00" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">赔付金额 (A-B-C)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-xs font-bold">¥</span>
                      <input type="number" className="w-full pl-7 pr-3 py-2 text-sm font-bold border border-blue-200 rounded-md bg-blue-50 text-blue-700" value="49500.00" readOnly />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">公估报告及附件</label>
                  <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline">
                    <Plus className="w-3 h-3" />
                    添加附件
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg group">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-[10px] text-slate-600 truncate">初步公估报告.pdf</span>
                    </div>
                    <button className="text-slate-400 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. 理算审核 */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-emerald-500"></span>
                理算审核
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">审核意见历史</label>
                  <button className="text-[10px] font-bold text-blue-600 hover:underline">导出审核记录</button>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-[10px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="px-3 py-2">日期</th>
                        <th className="px-3 py-2">审核意见</th>
                        <th className="px-3 py-2">备注记录</th>
                        <th className="px-3 py-2 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-3 py-2 text-slate-500">2026-03-13</td>
                        <td className="px-3 py-2">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 font-bold">同意赔付</span>
                        </td>
                        <td className="px-3 py-2 text-slate-600">资料齐全，核定金额无误。</td>
                        <td className="px-3 py-2 text-center">
                          <button className="text-blue-600 font-bold hover:underline">详情</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  理算审核操作
                </h4>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">审核结论</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="audit_result" 
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                      onChange={() => setSelectedCase({ ...selectedCase, nextStatus: '理赔通过', isReturned: false })}
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">同意赔付</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="audit_result" 
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                      onChange={() => setSelectedCase({ ...selectedCase, nextStatus: '理赔通过', isReturned: true })}
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">退回补充资料</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="audit_result" 
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                      onChange={() => setSelectedCase({ ...selectedCase, nextStatus: '赔付通过', isReturned: false })}
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">支付到账</span>
                  </label>
                </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">审核意见</label>
                  <textarea rows={3} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="请详细输入审核意见..."></textarea>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Toolbar */}
        <div className="sticky bottom-0 -mx-6 -mb-6 lg:-mx-8 lg:-mb-6 mt-auto bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-end items-center px-6 lg:px-8 gap-4">
          <button className="px-6 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            保存草稿
          </button>
          <button 
            onClick={() => {
              if (selectedCase.nextStatus) {
                onAppraisalSubmit(selectedCase.id, { 
                  status: selectedCase.nextStatus, 
                  isReturned: selectedCase.isReturned 
                });
                setSelectedCase(null);
              } else {
                alert('请选择审核结论');
              }
            }}
            className="px-6 py-2 bg-blue-600 shadow-sm rounded-md text-white font-medium hover:bg-blue-700 transition-colors"
          >
            提交理算结果
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
              placeholder="案件编号/保单号" 
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
            />
          </div>
          
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">案件状态</label>
            <select className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option value="">全部</option>
              <option value="待理算">待理算</option>
              <option value="理算中">理算中</option>
              <option value="已审核">已审核</option>
            </select>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[280px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">报案日期</label>
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
          <div className="text-sm text-slate-500">共找到 <span className="font-medium text-slate-900">{displayData.length}</span> 条公估理赔记录</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-y border-slate-200 text-xs uppercase tracking-wider text-slate-600 font-semibold">
                <th className="px-4 py-3">案件编号</th>
                <th className="px-4 py-3">保单号</th>
                <th className="px-4 py-3">被保险人</th>
                <th className="px-4 py-3">报案人</th>
                <th className="px-4 py-3">报案时间</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {displayData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setSelectedCase(row)}>
                  <td className="px-4 py-3 font-mono text-slate-600 text-xs">{row.id}</td>
                  <td className="px-4 py-3 font-mono text-slate-600 text-xs">{row.policyNo}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.insured}</td>
                  <td className="px-4 py-3 text-slate-800">{row.reporter}</td>
                  <td className="px-4 py-3 text-slate-600">{row.reportTime}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      row.status === '待理算' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs transition-colors p-1 rounded hover:bg-blue-50">
                      开始理算
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
