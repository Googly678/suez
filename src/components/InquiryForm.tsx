import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check, AlertCircle, Save, Send, Info } from 'lucide-react';

interface InquiryFormProps {
  onClose: () => void;
  customerName?: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ onClose, customerName }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    // Section 1
    companyName: customerName || '',
    orgCode: '',
    address: '',
    employeeCount: '',
    ownVehicleCount: '',
    // Section 2
    lastYearRevenue: '',
    expectedRevenue: '',
    // Section 3
    singleLimit: '100',
    totalLimit: '500',
    startDate: '',
    expandCold: false,
    expandRegions: false,
    expandSpecialVehicle: false,
    otherNeeds: '',
    // Section 4.1
    shippers: [
      { name: '货主（包括：工厂、贸易公司等对货物具有物权的单位）', checked: false, ratio: '' },
      { name: '物流公司', checked: false, ratio: '' },
      { name: '网络货运平台', checked: false, ratio: '' }
    ],
    // Section 4.2
    carriers: [
      { name: '物流公司', checked: false, ratio: '' },
      { name: '外包合作司机', checked: false, ratio: '' },
      { name: '网络货运平台找的司机', checked: false, ratio: '' },
      { name: '自有车辆（无承托人）', checked: false, ratio: '' }
    ],
    // Section 4.3
    boxTruckRatio: '',
    // Section 6
    useTMS: false,
    useADAS: false
  });

  useEffect(() => {
    if (currentStep === 0 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, countdown]);

  const SectionTitle = ({ title, number }: { title: string, number: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-6">
      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
        {number}
      </div>
      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
  );

  const InputField = ({ label, placeholder, value, onChange, type = "text", disabled = false }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${disabled ? 'opacity-70 cursor-not-allowed bg-slate-100' : ''}`}
      />
    </div>
  );

  const CheckboxField = ({ label, checked, onChange, disabled = false }: any) => (
    <label className={`flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-3 transition-colors ${disabled ? 'opacity-70 cursor-not-allowed bg-slate-100' : 'active:bg-slate-100 cursor-pointer'}`}>
      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
        {checked && <Check className="w-4 h-4 text-white" />}
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} disabled={disabled} />
    </label>
  );

  const renderDeclaration = () => (
    <div className="mt-6 p-5 bg-blue-50 rounded-2xl border border-blue-100">
      <div className="flex items-center gap-2 mb-3 text-blue-700">
        <AlertCircle className="w-5 h-5" />
        <h4 className="font-bold">投保人/被保险人声明</h4>
      </div>
      <p className="text-sm text-blue-700/80 leading-relaxed font-medium">
        投保人声明本投保单的所有由本公司填写的陈述/信息均为真实、准确的，没有不实陈述，也没有隐瞒重要事实。
        根据保险法等相关法律规定，投保人如未履行如实告知义务，可能引起的法律后果包括：保险人有权解除合同，且对于合同解除前发生的事故，不承担赔偿或者给付保险金的责任。
      </p>
    </div>
  );

  const renderStep1 = (isReadOnly = false) => (
    <div className={isReadOnly ? 'pointer-events-none' : ''}>
      <SectionTitle number="1" title="投保人/被保险人基本信息" />
      <InputField disabled={isReadOnly} label="企业名称" placeholder="请输入企业名称" value={formData.companyName} onChange={(e: any) => setFormData({...formData, companyName: e.target.value})} />
      <InputField disabled={isReadOnly} label="组织机构代码" placeholder="请输入组织机构代码" value={formData.orgCode} onChange={(e: any) => setFormData({...formData, orgCode: e.target.value})} />
      <InputField disabled={isReadOnly} label="主要营业场所地址" placeholder="请输入详细地址" value={formData.address} onChange={(e: any) => setFormData({...formData, address: e.target.value})} />
      <div className="grid grid-cols-2 gap-4">
        <InputField disabled={isReadOnly} label="在职员工人数" placeholder="人数" type="number" value={formData.employeeCount} onChange={(e: any) => setFormData({...formData, employeeCount: e.target.value})} />
        <InputField disabled={isReadOnly} label="自有车辆数" placeholder="台数" type="number" value={formData.ownVehicleCount} onChange={(e: any) => setFormData({...formData, ownVehicleCount: e.target.value})} />
      </div>

      <SectionTitle number="2" title="营业收入" />
      <InputField disabled={isReadOnly} label="上年度营业收入 (万元)" placeholder="请输入金额" type="number" value={formData.lastYearRevenue} onChange={(e: any) => setFormData({...formData, lastYearRevenue: e.target.value})} />
      <InputField disabled={isReadOnly} label="预计保险区间内营业收入 (万元)" placeholder="请输入金额" type="number" value={formData.expectedRevenue} onChange={(e: any) => setFormData({...formData, expectedRevenue: e.target.value})} />

      <SectionTitle number="3" title="保险需求" />
      <div className="grid grid-cols-2 gap-4">
        <InputField disabled={isReadOnly} label="单次事故限额 (万元)" placeholder="金额" value={formData.singleLimit} onChange={(e: any) => setFormData({...formData, singleLimit: e.target.value})} />
        <InputField disabled={isReadOnly} label="累计事故限额 (万元)" placeholder="金额" value={formData.totalLimit} onChange={(e: any) => setFormData({...formData, totalLimit: e.target.value})} />
      </div>
      <InputField disabled={isReadOnly} label="预计起保日期" type="date" value={formData.startDate} onChange={(e: any) => setFormData({...formData, startDate: e.target.value})} />
      
      <div className="mt-4">
        <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">扩展保障需求</p>
        <CheckboxField disabled={isReadOnly} label="扩展冷藏 (需加费)" checked={formData.expandCold} onChange={() => setFormData({...formData, expandCold: !formData.expandCold})} />
        <CheckboxField disabled={isReadOnly} label="扩展新疆、青海、西藏地区" checked={formData.expandRegions} onChange={() => setFormData({...formData, expandRegions: !formData.expandRegions})} />
        <CheckboxField disabled={isReadOnly} label="扩展临牌、超牌车型" checked={formData.expandSpecialVehicle} onChange={() => setFormData({...formData, expandSpecialVehicle: !formData.expandSpecialVehicle})} />
      </div>
    </div>
  );

  const renderStep2 = (isReadOnly = false) => (
    <div className={isReadOnly ? 'pointer-events-none' : ''}>
      <SectionTitle number="4" title="经营情况" />
      
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">托运人信息录入</label>
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          {formData.shippers.map((shipper, index) => (
            <div key={index} className={`p-3 flex items-center gap-3 ${index !== formData.shippers.length - 1 ? 'border-b border-slate-200' : ''}`}>
              <div 
                onClick={() => {
                  if(isReadOnly) return;
                  const newShippers = [...formData.shippers];
                  newShippers[index].checked = !newShippers[index].checked;
                  setFormData({...formData, shippers: newShippers});
                }}
                className={`w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${isReadOnly ? 'cursor-not-allowed opacity-70' : ''} ${shipper.checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}
              >
                {shipper.checked && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="text-sm font-medium text-slate-700 flex-1 leading-snug">{shipper.name}</span>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-slate-500 break-keep">业务占比:</span>
                <input 
                  type="number"
                  disabled={isReadOnly || !shipper.checked}
                  value={shipper.ratio}
                  onChange={(e) => {
                    const newShippers = [...formData.shippers];
                    newShippers[index].ratio = e.target.value;
                    setFormData({...formData, shippers: newShippers});
                  }}
                  className={`w-14 px-1 py-1 text-center border rounded font-medium text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${(!shipper.checked || isReadOnly) ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white border-slate-300 text-slate-700'}`}
                />
                <span className="text-xs text-slate-500">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">承托人（下家）信息录入</label>
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          {formData.carriers.map((carrier, index) => (
            <div key={index} className={`p-3 flex items-center gap-3 ${index !== formData.carriers.length - 1 ? 'border-b border-slate-200' : ''}`}>
              <div 
                onClick={() => {
                  if(isReadOnly) return;
                  const newCarriers = [...formData.carriers];
                  newCarriers[index].checked = !newCarriers[index].checked;
                  setFormData({...formData, carriers: newCarriers});
                }}
                className={`w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${isReadOnly ? 'cursor-not-allowed opacity-70' : ''} ${carrier.checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}
              >
                {carrier.checked && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="text-sm font-medium text-slate-700 flex-1 leading-snug">{carrier.name}</span>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-slate-500 break-keep">业务占比:</span>
                <input 
                  type="number"
                  disabled={isReadOnly || !carrier.checked}
                  value={carrier.ratio}
                  onChange={(e) => {
                    const newCarriers = [...formData.carriers];
                    newCarriers[index].ratio = e.target.value;
                    setFormData({...formData, carriers: newCarriers});
                  }}
                  className={`w-14 px-1 py-1 text-center border rounded font-medium text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${(!carrier.checked || isReadOnly) ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white border-slate-300 text-slate-700'}`}
                />
                <span className="text-xs text-slate-500">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InputField disabled={isReadOnly} label="箱车运输占比 (%)" placeholder="请输入百分比" type="number" value={formData.boxTruckRatio} onChange={(e: any) => setFormData({...formData, boxTruckRatio: e.target.value})} />

      <div className="mt-4">
        <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">涉及以下货物或运输方式</p>
        <div className="grid grid-cols-1 gap-2">
          {['易碎品', '冷链运输', '机械设备', '各类钢卷', '食品饮料', '电子设备', '半导体零配件'].map(item => (
            <CheckboxField disabled={isReadOnly} key={item} label={item} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">涉及以下运输路线</p>
        <div className="grid grid-cols-2 gap-2">
          {['港澳台', '新青藏', '云贵', '甘宁', '内蒙古', '吉黑', '海南', '川渝'].map(item => (
            <CheckboxField disabled={isReadOnly} key={item} label={item} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = (isReadOnly = false) => (
    <div className={isReadOnly ? 'pointer-events-none' : ''}>
      <SectionTitle number="5" title="出险及保险情况" />
      <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center py-8 ${isReadOnly ? 'opacity-70 bg-slate-100' : ''}`}>
        <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-500">过往三年出险情况 (如未填写，视作未投保或未发生保险索赔)</p>
        {!isReadOnly && (
          <button className="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
            添加记录
          </button>
        )}
      </div>

      <SectionTitle number="6" title="其它补充" />
      <CheckboxField disabled={isReadOnly} label="有使用 TMS 软件" checked={formData.useTMS} onChange={() => setFormData({...formData, useTMS: !formData.useTMS})} />
      <CheckboxField disabled={isReadOnly} label="有使用 ADAS 驾驶安全管理系统" checked={formData.useADAS} onChange={() => setFormData({...formData, useADAS: !formData.useADAS})} />
    </div>
  );

  const handleSubmit = () => {
    onClose();
    setTimeout(() => alert('询价单已提交！'), 100);
    setShowConfirmModal(false);
  };

  const getStepProgress = () => {
    if (currentStep === 0) return '声明';
    if (currentStep === 4) return '全量信息';
    return `(${currentStep}/3)`;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
      {/* Mobile Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between shrink-0">
        <button onClick={() => {
            if (currentStep > 0 && currentStep < 4) setCurrentStep(currentStep - 1);
            else if (currentStep === 4) setCurrentStep(3);
            else onClose();
        }} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="text-lg font-bold text-slate-900">
          物流责任险询价单 {getStepProgress()}
        </h2>
        <div className="w-10"></div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {currentStep === 0 && renderDeclaration()}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && (
          <div className="mt-4 animate-in fade-in duration-300">
             <div className="text-center mb-6 mt-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">已完成所有信息录入</span>
                <p className="text-sm text-green-700 font-medium">请核对以下信息是否准确，确认无误可提交</p>
             </div>
             {renderStep1(true)}
             <hr className="my-8 border-slate-200" />
             {renderStep2(true)}
             <hr className="my-8 border-slate-200" />
             {renderStep3(true)}
          </div>
        )}
        <div className="h-10"></div>
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5 flex gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        {currentStep === 0 && (
          <button 
            disabled={countdown > 0}
            onClick={() => setCurrentStep(1)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${countdown > 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-lg shadow-blue-200 active:scale-95'}`}
          >
            我已知晓 {countdown > 0 ? `(${countdown}s)` : ''}
          </button>
        )}
        {currentStep === 1 && (
          <button onClick={() => setCurrentStep(2)} className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
            下一步
          </button>
        )}
        {currentStep === 2 && (
          <>
            <button onClick={() => setCurrentStep(1)} className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold transition-all active:scale-95">
              上一步
            </button>
            <button onClick={() => setCurrentStep(3)} className="flex-[2] flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
              下一步
            </button>
          </>
        )}
        {currentStep === 3 && (
          <>
            <button onClick={() => setCurrentStep(2)} className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold transition-all active:scale-95">
              上一步
            </button>
            <button onClick={() => setCurrentStep(4)} className="flex-[2] flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
              下一步
            </button>
          </>
        )}
        {currentStep === 4 && (
          <button onClick={() => setShowConfirmModal(true)} className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
            <Send className="w-5 h-5" />
            提交
          </button>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col animate-in zoom-in-95 duration-200">
            {renderDeclaration()}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold">
                取消
              </button>
              <button onClick={handleSubmit} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryForm;