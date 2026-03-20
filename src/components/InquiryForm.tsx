import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, ChevronLeft, Send } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface InquiryFormProps {
  onClose: () => void;
  customerName?: string;
  inquiryNo?: string;
  onSubmitData?: (data: any) => void;
}

const getTodayStr = () => new Date().toISOString().split('T')[0];
const normalizeDigits = (value: string) => value.replace(/[^\d]/g, '');

function SectionTitle({ title, number }: { title: string; number: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-6">
      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
        {number}
      </div>
      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  required = false,
}: any) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
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
}

function NumberField({ label, value, onChange, disabled = false, required = false, suffix = '' }: any) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(normalizeDigits(e.target.value))}
          disabled={disabled}
          className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${disabled ? 'opacity-70 cursor-not-allowed bg-slate-100' : ''}`}
        />
        {suffix ? <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">{suffix}</span> : null}
      </div>
    </div>
  );
}

function CheckboxField({ label, checked, onChange, disabled = false }: any) {
  return (
    <label className={`flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-3 transition-colors ${disabled ? 'opacity-70 cursor-not-allowed bg-slate-100' : 'active:bg-slate-100 cursor-pointer'}`}>
      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
        {checked && <Check className="w-4 h-4 text-white" />}
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} disabled={disabled} />
    </label>
  );
}

const InquiryForm: React.FC<InquiryFormProps> = ({ onClose, customerName, inquiryNo, onSubmitData }) => {
  const getEmptyFormData = (companyName: string) => ({
    companyName: companyName || '',
    employeeCount: '0',
    ownVehicleCount: '0',
    lastYearRevenue: '0',
    expectedRevenue: '0',
    singleLimit: '0',
    startDate: getTodayStr(),
    expandCold: false,
    coldRevenue: '0',
    expandXinjiang: false,
    xinjiangRevenue: '0',
    expandQinghai: false,
    qinghaiRevenue: '0',
    expandTibet: false,
    tibetRevenue: '0',
    expandSpecialVehicle: false,
    otherNeeds: '',
    shippers: [
      { name: '货主（工厂/贸易公司等物权单位）', checked: false, ratio: '0' },
      { name: '物流公司', checked: false, ratio: '0' },
      { name: '网络货运平台', checked: false, ratio: '0' },
    ],
    carriers: [
      { name: '物流公司', checked: false, ratio: '0' },
      { name: '外包合作司机', checked: false, ratio: '0' },
      { name: '网络货运平台找的司机', checked: false, ratio: '0' },
      { name: '自有车辆（无承托人）', checked: false, ratio: '0' },
    ],
    boxTruckRatio: '0',
    fragile: false,
    fragileRevenue: '0',
    autoParts: false,
    autoPartsRevenue: '0',
    machinery: false,
    machineryRevenue: '0',
    steel: false,
    steelRevenue: '0',
    food: false,
    foodRevenue: '0',
    electronics: false,
    electronicsRevenue: '0',
    semiconductor: false,
    semiconductorRevenue: '0',
    yunGui: false,
    yunGuiRevenue: '0',
    ganNing: false,
    ganNingRevenue: '0',
    innerMongolia: false,
    innerMongoliaRevenue: '0',
    jiHei: false,
    jiHeiRevenue: '0',
    hainan: false,
    hainanRevenue: '0',
    chuanYu: false,
    chuanYuRevenue: '0',
    claims: [
      { year: '2023', policyNo: '', insurer: '', count: '0', amount: '0' },
      { year: '2024', policyNo: '', insurer: '', count: '0', amount: '0' },
      { year: '2025', policyNo: '', insurer: '', count: '0', amount: '0' },
    ],
    useTMS: false,
    useADAS: false,
    declarationConfirmed: false,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<any>(getEmptyFormData(customerName || ''));

  // 倒计时 useEffect（驱动声明页 5 秒等待）
  useEffect(() => {
    if (currentStep === 0 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, currentStep]);

  // 监听询价单编号变化，从后端或 localStorage 加载对应数据或初始化新表单
  useEffect(() => {
    if (inquiryNo) {
      // 先尝试从后端 API 获取
      fetch(`/api/inquiries/${inquiryNo}`, {
        headers: {
          'X-User-Id': localStorage.getItem('suez_user_id') || 'USER-001',
        },
      })
        .then(async (res) => {
          if (res.ok) {
            const { data } = await res.json();
            setFormData(data.formData || getEmptyFormData(customerName || ''));
            return;
          }
          // 后端没有数据，尝试从 localStorage
          const storageKey = `inquiry_${inquiryNo}`;
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            try {
              setFormData(JSON.parse(saved));
            } catch (e) {
              setFormData(getEmptyFormData(customerName || ''));
            }
          } else {
            setFormData(getEmptyFormData(customerName || ''));
          }
        })
        .catch(() => {
          // 后端请求失败，从 localStorage 加载
          const storageKey = `inquiry_${inquiryNo}`;
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            try {
              setFormData(JSON.parse(saved));
            } catch (e) {
              setFormData(getEmptyFormData(customerName || ''));
            }
          } else {
            setFormData(getEmptyFormData(customerName || ''));
          }
        });
    } else {
      setFormData(getEmptyFormData(customerName || ''));
    }
  }, [inquiryNo, customerName]);

  const renderDeclaration = () => (
    <div className="mt-6 p-5 bg-blue-50 rounded-2xl border border-blue-100">
      <div className="flex items-center gap-2 mb-3 text-blue-700">
        <AlertCircle className="w-5 h-5" />
        <h4 className="font-bold">投保人/被保险人声明</h4>
      </div>
      <p className="text-sm text-blue-700/80 leading-relaxed font-medium">
        本人声明本问询单填写的所有陈述/信息均为真实、准确的，没有不实陈述，也没有隐瞒重要事实。
        根据保险法等相关法律规定，如未履行如实告知义务，保险人有权解除合同，且对于合同解除前发生的事故，
        不承担赔偿或者给付保险金的责任。
      </p>
    </div>
  );

  const toggleShare = (key: 'shippers' | 'carriers', index: number) => {
    const next = [...formData[key]];
    next[index].checked = !next[index].checked;
    if (!next[index].checked) next[index].ratio = '0';
    setFormData((prev: any) => ({ ...prev, [key]: next }));
  };

  const changeShareRatio = (key: 'shippers' | 'carriers', index: number, value: string) => {
    const next = [...formData[key]];
    next[index].ratio = normalizeDigits(value);
    setFormData((prev: any) => ({ ...prev, [key]: next }));
  };

  const renderShareList = (title: string, key: 'shippers' | 'carriers', readOnly = false) => (
    <div className="mb-6">
      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">{title}</label>
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        {formData[key].map((item: any, index: number) => (
          <div key={`${key}-${index}`} className={`p-3 ${index !== formData[key].length - 1 ? 'border-b border-slate-200' : ''}`}>
            <div className="flex items-center gap-3">
              <div
                onClick={() => {
                  if (readOnly) return;
                  toggleShare(key, index);
                }}
                className={`w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${readOnly ? 'cursor-not-allowed opacity-70' : ''} ${item.checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}
              >
                {item.checked && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="text-sm font-medium text-slate-700 flex-1 leading-snug">{item.name}</span>
            </div>
            {item.checked && (
              <div className="mt-3 pl-9">
                <NumberField
                  label="业务占比（%）"
                  value={item.ratio}
                  onChange={(v: string) => changeShareRatio(key, index, v)}
                  disabled={readOnly}
                  suffix="%"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderToggleWithRevenue = (
    label: string,
    checkedKey: string,
    revenueKey: string,
    revenueLabel: string,
    readOnly = false
  ) => (
    <div className="mb-2">
      <CheckboxField
        disabled={readOnly}
        label={label}
        checked={formData[checkedKey]}
        onChange={() =>
          setFormData((prev: any) => ({
            ...prev,
            [checkedKey]: !prev[checkedKey],
            [revenueKey]: prev[checkedKey] ? '0' : prev[revenueKey],
          }))
        }
      />
      {formData[checkedKey] && (
        <div className="pl-4">
          <NumberField
            disabled={readOnly}
            label={revenueLabel}
            value={formData[revenueKey]}
            onChange={(v: string) => setFormData((prev: any) => ({ ...prev, [revenueKey]: v }))}
          />
        </div>
      )}
    </div>
  );

  const renderStep1 = (isReadOnly = false) => (
    <div className={isReadOnly ? 'pointer-events-none' : ''}>
      <SectionTitle number="1" title="投保人/被保险人基本信息" />
      <InputField
        disabled={isReadOnly}
        required
        label="投保人/被保险人及其子公司名称"
        placeholder="请输入企业名称"
        value={formData.companyName}
        onChange={(e: any) => setFormData((prev: any) => ({ ...prev, companyName: e.target.value }))}
      />
      <div className="grid grid-cols-2 gap-4">
        <NumberField
          disabled={isReadOnly}
          required
          label="在职员工人数"
          value={formData.employeeCount}
          onChange={(v: string) => setFormData((prev: any) => ({ ...prev, employeeCount: v }))}
        />
        <NumberField
          disabled={isReadOnly}
          required
          label="自有车辆数"
          value={formData.ownVehicleCount}
          onChange={(v: string) => setFormData((prev: any) => ({ ...prev, ownVehicleCount: v }))}
        />
      </div>
      <NumberField
        disabled={isReadOnly}
        required
        label="上年度营业收入（单位：万元）"
        value={formData.lastYearRevenue}
        onChange={(v: string) => setFormData((prev: any) => ({ ...prev, lastYearRevenue: v }))}
      />
      <NumberField
        disabled={isReadOnly}
        required
        label="预计保险区间内营业收入（单位：万元）"
        value={formData.expectedRevenue}
        onChange={(v: string) => setFormData((prev: any) => ({ ...prev, expectedRevenue: v }))}
      />

      <SectionTitle number="2" title="核心保险需求" />
      <NumberField
        disabled={isReadOnly}
        required
        label="每次事故赔偿限额（单位：万元）"
        value={formData.singleLimit}
        onChange={(v: string) => setFormData((prev: any) => ({ ...prev, singleLimit: v }))}
      />
      <InputField
        disabled={isReadOnly}
        required
        label="预计/期望起保日期"
        type="date"
        value={formData.startDate}
        onChange={(e: any) => setFormData((prev: any) => ({ ...prev, startDate: e.target.value }))}
      />

      <div className="mt-4">
        <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">扩展责任勾选</p>
        {renderToggleWithRevenue('是否扩展冷藏运输', 'expandCold', 'coldRevenue', '预计冷藏运输业务营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否扩展新疆地区承保', 'expandXinjiang', 'xinjiangRevenue', '新疆业务营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否扩展青海地区承保', 'expandQinghai', 'qinghaiRevenue', '青海业务营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否扩展西藏地区承保', 'expandTibet', 'tibetRevenue', '西藏业务营收（万元）', isReadOnly)}
        <CheckboxField
          disabled={isReadOnly}
          label="是否扩展临牌/超牌/仅承运不可拆卸货物车型"
          checked={formData.expandSpecialVehicle}
          onChange={() => setFormData((prev: any) => ({ ...prev, expandSpecialVehicle: !prev.expandSpecialVehicle }))}
        />
      </div>

      <div className="mt-4">
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">其他保险需求</label>
        <textarea
          value={formData.otherNeeds}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, otherNeeds: e.target.value }))}
          disabled={isReadOnly}
          placeholder="填写个性化需求"
          rows={4}
          className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none ${isReadOnly ? 'opacity-70 cursor-not-allowed bg-slate-100' : ''}`}
        />
      </div>
    </div>
  );

  const renderStep2 = (isReadOnly = false) => (
    <div className={isReadOnly ? 'pointer-events-none' : ''}>
      <SectionTitle number="3" title="被保险人经营情况" />
      {renderShareList('托运人信息录入', 'shippers', isReadOnly)}
      {renderShareList('承托人（下家）信息录入', 'carriers', isReadOnly)}

      <NumberField
        disabled={isReadOnly}
        required
        label="集装箱/箱式货车运输业务占比（按次数，%）"
        value={formData.boxTruckRatio}
        onChange={(v: string) => setFormData((prev: any) => ({ ...prev, boxTruckRatio: v }))}
        suffix="%"
      />

      <div className="mt-4">
        <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">运输货物品类</p>
        {renderToggleWithRevenue('是否运输易碎品（石材/玻璃制品/光伏组件/瓶装酒等）', 'fragile', 'fragileRevenue', '易碎品运输全年预计营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否运输汽车配件类货物', 'autoParts', 'autoPartsRevenue', '汽车配件全年营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否运输机械设备（非精密、非超大件）', 'machinery', 'machineryRevenue', '机械设备运输全年营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否运输各类钢材（钢卷、钢结构等）', 'steel', 'steelRevenue', '钢材运输全年营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否运输常温食品/饮料（袋/盒/罐/箱装）', 'food', 'foodRevenue', '常温食品饮料全年营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否运输电子设备（液晶电视/数码产品等）', 'electronics', 'electronicsRevenue', '电子设备运输全年营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否运输半导体零配件', 'semiconductor', 'semiconductorRevenue', '半导体零配件全年营收（万元）', isReadOnly)}
      </div>

      <div className="mt-6">
        <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">运输路线</p>
        {renderToggleWithRevenue('是否运输至云南/贵州', 'yunGui', 'yunGuiRevenue', '云贵运输全年营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否运输至甘肃/宁夏', 'ganNing', 'ganNingRevenue', '甘宁运输全年营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否运输至内蒙古', 'innerMongolia', 'innerMongoliaRevenue', '内蒙古运输全年营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否运输至吉林/黑龙江', 'jiHei', 'jiHeiRevenue', '吉黑运输全年营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否运输至海南', 'hainan', 'hainanRevenue', '海南运输全年营收（万元）', isReadOnly)}
        {renderToggleWithRevenue('是否运输至四川/重庆', 'chuanYu', 'chuanYuRevenue', '川渝运输全年营收（万元）', isReadOnly)}
      </div>
    </div>
  );

  const renderStep3 = (isReadOnly = false) => (
    <div className={isReadOnly ? 'pointer-events-none' : ''}>
      <SectionTitle number="4" title="出险及保险情况（2023-2025）" />
      {formData.claims.map((claim: any, idx: number) => (
        <div key={claim.year} className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <p className="text-sm font-bold text-slate-700 mb-3">{claim.year} 年</p>
          <InputField
            disabled={isReadOnly}
            label={`${claim.year}年保单号`}
            placeholder="未投保可不填"
            value={claim.policyNo}
            onChange={(e: any) => {
              const next = [...formData.claims];
              next[idx].policyNo = e.target.value;
              setFormData((prev: any) => ({ ...prev, claims: next }));
            }}
          />
          <InputField
            disabled={isReadOnly}
            label={`${claim.year}年承保保险公司`}
            placeholder="未投保可不填"
            value={claim.insurer}
            onChange={(e: any) => {
              const next = [...formData.claims];
              next[idx].insurer = e.target.value;
              setFormData((prev: any) => ({ ...prev, claims: next }));
            }}
          />
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              disabled={isReadOnly}
              required
              label={`${claim.year}年出险次数`}
              value={claim.count}
              onChange={(v: string) => {
                const next = [...formData.claims];
                next[idx].count = v;
                setFormData((prev: any) => ({ ...prev, claims: next }));
              }}
            />
            <NumberField
              disabled={isReadOnly}
              required
              label={`${claim.year}年总索赔金额（万元）`}
              value={claim.amount}
              onChange={(v: string) => {
                const next = [...formData.claims];
                next[idx].amount = v;
                setFormData((prev: any) => ({ ...prev, claims: next }));
              }}
            />
          </div>
        </div>
      ))}

      <SectionTitle number="5" title="其他补充信息" />
      <CheckboxField
        disabled={isReadOnly}
        label="是否使用 TMS 软件"
        checked={formData.useTMS}
        onChange={() => setFormData((prev: any) => ({ ...prev, useTMS: !prev.useTMS }))}
      />
      <CheckboxField
        disabled={isReadOnly}
        label="是否使用 ADAS 等安全管理系统"
        checked={formData.useADAS}
        onChange={() => setFormData((prev: any) => ({ ...prev, useADAS: !prev.useADAS }))}
      />

      <SectionTitle number="6" title="投保人声明确认" />
      <CheckboxField
        disabled={isReadOnly}
        label="我已阅读并确认投保人声明内容，填写信息真实准确"
        checked={formData.declarationConfirmed}
        onChange={() => setFormData((prev: any) => ({ ...prev, declarationConfirmed: !prev.declarationConfirmed }))}
      />
    </div>
  );

  const validateStep1 = () => {
    if (!formData.companyName.trim()) return '请填写投保人/被保险人及其子公司名称';
    const requiredNumberFields = ['employeeCount', 'ownVehicleCount', 'lastYearRevenue', 'expectedRevenue', 'singleLimit'];
    for (const field of requiredNumberFields) {
      if (formData[field] === '') return '请完整填写基本信息与核心保险需求中的必填数字项';
    }
    if (!formData.startDate) return '请选择预计/期望起保日期';
    return '';
  };

  const validateStep2 = () => {
    if (formData.boxTruckRatio === '') return '请填写集装箱/箱式货车运输业务占比';
    return '';
  };

  const validateStep3 = () => {
    for (const claim of formData.claims) {
      if (claim.count === '' || claim.amount === '') {
        return '请填写 2023-2025 年的出险次数和总索赔金额';
      }
    }
    if (!formData.declarationConfirmed) return '提交前请先勾选声明确认';
    return '';
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const e1 = validateStep1();
    const e2 = validateStep2();
    const e3 = validateStep3();
    const err = e1 || e2 || e3;
    if (err) {
      alert(err);
      return;
    }

    setIsSubmitting(true);

    const attachmentName = `询价单_${inquiryNo || customerName || '未命名'}_${new Date().toISOString().split('T')[0]}.pdf`;
    let pdfDataUri = '';

    try {
      const element = document.getElementById('inquiry-form-print');
      if (element) {
        const opt = {
          margin: 10,
          filename: attachmentName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
        };

        pdfDataUri = await html2pdf().set(opt).from(element).toPdf().output('datauristring');

        if (pdfDataUri) {
          const link = document.createElement('a');
          link.href = pdfDataUri;
          link.download = attachmentName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (error) {
      console.error('Failed to generate inquiry PDF:', error);
    }

    try {
      // 先保存到后端数据库
      const userId = localStorage.getItem('suez_user_id') || 'USER-001';
      const saveResponse = await fetch(`/api/inquiries/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
        },
        body: JSON.stringify({
          inquiryNo: inquiryNo,
          customerName: customerName,
          formData: formData,
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        console.error('Failed to save inquiry:', errorData);
        alert('保存询价单失败: ' + (errorData.error || '未知错误'));
        return;
      }

      console.log('[InquiryForm] Inquiry saved successfully:', inquiryNo);

      // 然后标记为已提交
      const submitResponse = await fetch(`/api/inquiries/${inquiryNo}/submit`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
        },
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        console.error('Failed to submit inquiry:', errorData);
      }

      if (onSubmitData) {
        onSubmitData({
          inquiryNo: inquiryNo,
          customerName: customerName,
          submittedAt: new Date().toISOString(),
          formData: formData,
          status: '已回填',
          attachmentName,
          attachmentType: 'application/pdf',
          attachmentData: pdfDataUri,
        });
      }

      setShowConfirmModal(false);
      onClose();
      setTimeout(() => alert(`询价单 ${inquiryNo} 已提交！相关信息已保存。`), 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgress = () => {
    if (currentStep === 0) return '声明';
    if (currentStep === 4) return '全量信息';
    return `(${currentStep}/3)`;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
      <div className="bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            if (currentStep > 0 && currentStep < 4) setCurrentStep(currentStep - 1);
            else if (currentStep === 4) setCurrentStep(3);
            else onClose();
          }}
          className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="text-lg font-bold text-slate-900">物流责任险询价单 {getStepProgress()}</h2>
        <div className="w-10"></div>
      </div>

      <div id="inquiry-form-print" className="flex-1 overflow-y-auto px-5 pb-32">
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
          <button
            onClick={() => {
              const err = validateStep1();
              if (err) {
                alert(err);
                return;
              }
              setCurrentStep(2);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            下一步
          </button>
        )}

        {currentStep === 2 && (
          <>
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold transition-all active:scale-95"
            >
              上一步
            </button>
            <button
              onClick={() => {
                const err = validateStep2();
                if (err) {
                  alert(err);
                  return;
                }
                setCurrentStep(3);
              }}
              className="flex-[2] flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              下一步
            </button>
          </>
        )}

        {currentStep === 3 && (
          <>
            <button
              onClick={() => setCurrentStep(2)}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold transition-all active:scale-95"
            >
              上一步
            </button>
            <button
              onClick={() => {
                const err = validateStep3();
                if (err) {
                  alert(err);
                  return;
                }
                setCurrentStep(4);
              }}
              className="flex-[2] flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              下一步
            </button>
          </>
        )}

        {currentStep === 4 && (
          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
            提交
          </button>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col animate-in zoom-in-95 duration-200">
            {renderDeclaration()}
            <div className="flex gap-3 mt-6">
              <button disabled={isSubmitting} onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold disabled:opacity-60 disabled:cursor-not-allowed">
                取消
              </button>
              <button disabled={isSubmitting} onClick={handleSubmit} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-60 disabled:cursor-not-allowed">
                {isSubmitting ? '提交中...' : '确认提交'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryForm;
