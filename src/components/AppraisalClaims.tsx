import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronDown, Search, Plus, Upload, FileText, AlertCircle, Check, ClipboardList, Building2, Trash2, Calculator, CheckCircle2 } from 'lucide-react';

export default function AppraisalClaims({
  claimsPool,
  onCaseOpen,
  onAppraisalSubmit,
  initialSelectedCase,
  onInitialSelectedCaseConsumed,
  reviewStage = 'appraisal',
  canReview,
}: {
  claimsPool: any[];
  onCaseOpen: (claimCase: any, reviewStage?: 'appraisal' | 'insurer') => void;
  onAppraisalSubmit: (claimId: string, appraisalData: any, reviewStage?: 'appraisal' | 'insurer') => void;
  initialSelectedCase?: any;
  onInitialSelectedCaseConsumed?: () => void;
  reviewStage?: 'appraisal' | 'insurer';
  canReview: boolean;
}) {
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewConfirm, setShowReviewConfirm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [draftFilter, setDraftFilter] = useState({
    search: '',
    status: '',
    reportDateFrom: '',
    reportDateTo: '',
  });
  const [appliedFilter, setAppliedFilter] = useState({
    search: '',
    status: '',
    reportDateFrom: '',
    reportDateTo: '',
  });
  const [surveyRows, setSurveyRows] = useState([
    { id: 1, itemName: '', quantity: '', packageType: '', unitPrice: '', lossDesc: '', voucher: '' },
  ]);
  const [claimRows] = useState([
    { id: 1, itemName: '电子设备', quantity: '50', packageType: '纸箱', unitPrice: '1000', claimAmount: '50000', claimType: '报废', appraisalOpinion: '同意按报废核损' },
  ]);
  const [surveySummary, setSurveySummary] = useState('');
  const [surveyPeriod, setSurveyPeriod] = useState('');
  const [surveyInitiator, setSurveyInitiator] = useState('');
  const [surveyContact, setSurveyContact] = useState('');
  const [surveyLocation, setSurveyLocation] = useState('');
  const [surveyEvidenceCount, setSurveyEvidenceCount] = useState(0);
  const [surveySummaryEvidenceCount, setSurveySummaryEvidenceCount] = useState(0);
  const [insurerOpinion, setInsurerOpinion] = useState('');
  const [guideRows, setGuideRows] = useState([
    { id: 1, date: '', feedback: '', note: '' },
  ]);
  const [insurerAuditRows, setInsurerAuditRows] = useState([
    { id: 1, date: '', opinion: '', note: '' },
  ]);
  const surveyEvidenceInputRef = React.useRef<HTMLInputElement>(null);
  const surveySummaryEvidenceInputRef = React.useRef<HTMLInputElement>(null);
  const stageConfig =
    reviewStage === 'insurer'
      ? {
          pageTitle: '保司审核',
          introText: '以下理赔协助信息与公估理算结果仅供保司审核参考，当前页面用于保司审核处理。',
          openableStatus: '定损中',
          inProgressStatus: '审核中',
          approvedStatus: '定损协议通过',
          rejectedStatus: '审核退回',
          openActionText: '认领案件',
          continueActionText: '继续审核',
          submitButtonText: '提交审核结果',
          approveLabel: '通过',
          rejectLabel: '退回',
          rejectedHint: '当前案件已被保司退回，等待补充资料后再次进入保司审核。',
          statusOptions: ['定损中', '审核中', '审核退回', '定损协议通过'],
        }
      : {
          pageTitle: '公估理赔',
          introText: '以下理赔协助信息来自业务端录入，当前页面仅供公估理算参考（只读）。',
          openableStatus: '已提交',
          inProgressStatus: '公估中',
          approvedStatus: '定损中',
          rejectedStatus: '已退回',
          openActionText: '开始公估',
          continueActionText: '继续公估',
          submitButtonText: '提交理算结果',
          approveLabel: '同意',
          rejectLabel: '退回',
          rejectedHint: '当前案件已退回，等待理赔协助补充并再次提交后，再进入公估审核。',
          statusOptions: ['已提交', '公估中', '定损中', '已退回'],
        };
  const isReviewEditable = selectedCase?.status === stageConfig.inProgressStatus && canReview;

  const displayData = [...claimsPool]
    .filter((item, index, arr) => arr.findIndex((other) => other.id === item.id) === index)
    .filter((item) => (reviewStage === 'insurer' ? stageConfig.statusOptions.includes(item.status) : true));

  const parseTime = (value: string) => {
    const time = new Date(value || '').getTime();
    return Number.isNaN(time) ? null : time;
  };

  const filteredDisplayData = displayData.filter((row) => {
    const keyword = appliedFilter.search.trim();
    const matchesSearch =
      !keyword ||
      row.id?.includes(keyword) ||
      row.policyNo?.includes(keyword) ||
      row.insured?.includes(keyword);

    const matchesStatus = !appliedFilter.status || row.status === appliedFilter.status;

    const rowTime = parseTime(row.reportTime || '');
    const fromTime = appliedFilter.reportDateFrom ? parseTime(`${appliedFilter.reportDateFrom} 00:00:00`) : null;
    const toTime = appliedFilter.reportDateTo ? parseTime(`${appliedFilter.reportDateTo} 23:59:59`) : null;

    const matchesDateFrom = fromTime === null || rowTime === null || rowTime >= fromTime;
    const matchesDateTo = toTime === null || rowTime === null || rowTime <= toTime;

    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const handleApplyFilter = () => {
    setAppliedFilter(draftFilter);
  };

  const handleResetFilter = () => {
    const empty = { search: '', status: '', reportDateFrom: '', reportDateTo: '' };
    setDraftFilter(empty);
    setAppliedFilter(empty);
  };

  const getStatusTone = (status: string) => {
    if (status === stageConfig.openableStatus) return 'bg-amber-100 text-amber-700';
    if (status === stageConfig.inProgressStatus) return 'bg-blue-100 text-blue-700';
    if (status === stageConfig.approvedStatus) return 'bg-emerald-100 text-emerald-700';
    if (status === stageConfig.rejectedStatus || status === '已退回') return 'bg-rose-100 text-rose-700';
    return 'bg-slate-100 text-slate-700';
  };

  const addSurveyRow = () => {
    setSurveyRows((prev) => [...prev, { id: Date.now(), itemName: '', quantity: '', packageType: '', unitPrice: '', lossDesc: '', voucher: '' }]);
  };

  const updateSurveyRow = (id: number, field: string, value: string) => {
    setSurveyRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const appendSurveyEvidence = (event: React.ChangeEvent<HTMLInputElement>, setCount: React.Dispatch<React.SetStateAction<number>>) => {
    const count = event.target.files?.length || 0;
    if (count > 0) {
      setCount((prev) => prev + count);
    }
    event.target.value = '';
  };

  const addGuideRow = () => {
    setGuideRows((prev) => [...prev, { id: Date.now(), date: '', feedback: '', note: '' }]);
  };

  const updateGuideRow = (id: number, field: 'date' | 'feedback' | 'note', value: string) => {
    setGuideRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const updateInsurerAuditRow = (id: number, field: 'date' | 'opinion' | 'note', value: string) => {
    setInsurerAuditRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  useEffect(() => {
    if (initialSelectedCase) {
      setSelectedCase(initialSelectedCase);
      setReviewComment(initialSelectedCase.reviewComment || '');
      onInitialSelectedCaseConsumed?.();
    }
  }, [initialSelectedCase, onInitialSelectedCaseConsumed]);

  if (selectedCase && reviewStage === 'insurer') {
    return (
      <div className="flex flex-col h-full relative flex-1">
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
            <span className={`px-2 py-1 rounded text-[10px] font-bold ${getStatusTone(selectedCase.status)}`}>
              {selectedCase.status}
            </span>
          </div>
        </div>

        <div className="flex-1 mt-4 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 pb-24">
          <div className="space-y-6">
            <div className="text-sm text-rose-600">页面可以汇总查看案件得失和理赔录入信息，以及查勘新信息。</div>

            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-900">审核意见</h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                        <th className="px-4 py-2 w-40">日期</th>
                        <th className="px-4 py-2">审核意见</th>
                        <th className="px-4 py-2">备注登记</th>
                        <th className="px-4 py-2 w-28 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {insurerAuditRows.map((row) => (
                        <tr key={row.id}>
                          <td className="px-4 py-2">
                            <input
                              type="date"
                              value={row.date}
                              onChange={(e) => updateInsurerAuditRow(row.id, 'date', e.target.value)}
                              disabled={!isReviewEditable}
                              className="w-full px-2 py-1 border border-slate-200 rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={row.opinion}
                              onChange={(e) => updateInsurerAuditRow(row.id, 'opinion', e.target.value)}
                              disabled={!isReviewEditable}
                              placeholder="审核意见"
                              className="w-full px-2 py-1 border border-slate-200 rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={row.note}
                              onChange={(e) => updateInsurerAuditRow(row.id, 'note', e.target.value)}
                              disabled={!isReviewEditable}
                              placeholder="备注"
                              className="w-full px-2 py-1 border border-slate-200 rounded"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                disabled={!isReviewEditable}
                                onClick={() => {
                                  setSelectedCase({ ...selectedCase, reviewDecision: 'approve' });
                                  setReviewComment(row.opinion || reviewComment);
                                  setShowReviewConfirm(true);
                                }}
                                className="px-2 py-1 text-xs border border-emerald-300 text-emerald-700 rounded hover:bg-emerald-50 disabled:opacity-50"
                              >
                                同意
                              </button>
                              <button
                                type="button"
                                disabled={!isReviewEditable}
                                onClick={() => {
                                  setSelectedCase({ ...selectedCase, reviewDecision: 'reject' });
                                  setReviewComment(row.opinion || reviewComment);
                                  setShowReviewConfirm(true);
                                }}
                                className="px-2 py-1 text-xs border border-rose-300 text-rose-700 rounded hover:bg-rose-50 disabled:opacity-50"
                              >
                                退回
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <button
              type="button"
              disabled={!isReviewEditable}
              className="px-6 py-2 border border-slate-300 bg-white rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              一键生成理赔报告
            </button>
          </div>

          <aside className="rounded-xl border border-rose-300 bg-white p-4 text-sm text-slate-600 min-h-[220px]">
            理赔员请填写完整案件报告
          </aside>
        </div>

        {showReviewConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">确认提交</h3>
              <p className="text-sm text-slate-600 mb-6">
                确认提交本次审核结论吗？提交后状态将更新为{selectedCase.reviewDecision === 'approve' ? stageConfig.approvedStatus : stageConfig.rejectedStatus}。
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowReviewConfirm(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    onAppraisalSubmit(selectedCase.id, {
                      reviewDecision: selectedCase.reviewDecision,
                      reviewComment,
                    }, reviewStage);
                    setShowReviewConfirm(false);
                    setSelectedCase(null);
                  }}
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
                getStatusTone(selectedCase.status)
              }`}>
                {selectedCase.status}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 pb-24 mt-4">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">查勘分</h3>
              <button
                type="button"
                onClick={addSurveyRow}
                disabled={!isReviewEditable}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> 添加查勘
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">查勘日期</label>
                  <input
                    type="text"
                    value={surveyPeriod}
                    onChange={(e) => setSurveyPeriod(e.target.value)}
                    placeholder="例如 2026-03-20"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                    disabled={!isReviewEditable}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">现场查勘人</label>
                  <input
                    type="text"
                    value={surveyInitiator}
                    onChange={(e) => setSurveyInitiator(e.target.value)}
                    placeholder="姓名"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                    disabled={!isReviewEditable}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">联系方式</label>
                  <input
                    type="text"
                    value={surveyContact}
                    onChange={(e) => setSurveyContact(e.target.value)}
                    placeholder="手机号"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                    disabled={!isReviewEditable}
                  />
                </div>
                <div className="md:col-span-2 xl:col-span-2">
                  <label className="block text-xs text-slate-600 mb-1">查勘地点</label>
                  <input
                    type="text"
                    value={surveyLocation}
                    onChange={(e) => setSurveyLocation(e.target.value)}
                    placeholder="详细地点"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                    disabled={!isReviewEditable}
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                      <th className="px-4 py-2 w-14">序号</th>
                      <th className="px-4 py-2">品名</th>
                      <th className="px-4 py-2 w-24">数量</th>
                      <th className="px-4 py-2 w-32">包装</th>
                      <th className="px-4 py-2 w-32">货损状态说明</th>
                      <th className="px-4 py-2 w-28">佐证</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {surveyRows.map((row, index) => (
                      <tr key={row.id}>
                        <td className="px-4 py-2 text-slate-500">{index + 1}</td>
                        <td className="px-4 py-2">
                          <input value={row.itemName} onChange={(e) => updateSurveyRow(row.id, 'itemName', e.target.value)} disabled={!isReviewEditable} className="w-full px-2 py-1 border border-slate-200 rounded" />
                        </td>
                        <td className="px-4 py-2">
                          <input value={row.quantity} onChange={(e) => updateSurveyRow(row.id, 'quantity', e.target.value)} disabled={!isReviewEditable} className="w-full px-2 py-1 border border-slate-200 rounded" />
                        </td>
                        <td className="px-4 py-2">
                          <input value={row.packageType} onChange={(e) => updateSurveyRow(row.id, 'packageType', e.target.value)} disabled={!isReviewEditable} className="w-full px-2 py-1 border border-slate-200 rounded" />
                        </td>
                        <td className="px-4 py-2">
                          <input value={row.lossDesc} onChange={(e) => updateSurveyRow(row.id, 'lossDesc', e.target.value)} disabled={!isReviewEditable} className="w-full px-2 py-1 border border-slate-200 rounded" />
                        </td>
                        <td className="px-4 py-2">
                          <input value={row.voucher} onChange={(e) => updateSurveyRow(row.id, 'voucher', e.target.value)} disabled={!isReviewEditable} className="w-full px-2 py-1 border border-slate-200 rounded" placeholder="文件名" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-slate-600 mb-1">查勘已况</label>
                  <textarea
                    rows={4}
                    value={surveySummary}
                    onChange={(e) => setSurveySummary(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                    disabled={!isReviewEditable}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => surveySummaryEvidenceInputRef.current?.click()}
                  disabled={!isReviewEditable}
                  className="px-4 py-2 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  上传勘办笔录
                </button>
                <input
                  ref={surveySummaryEvidenceInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => appendSurveyEvidence(e, setSurveySummaryEvidenceCount)}
                />
              </div>

              <div className="flex items-center justify-end gap-4 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => surveyEvidenceInputRef.current?.click()}
                  disabled={!isReviewEditable}
                  className="px-3 py-1.5 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  图片上传
                </button>
                <input
                  ref={surveyEvidenceInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => appendSurveyEvidence(e, setSurveyEvidenceCount)}
                />
                <span>图片 {surveyEvidenceCount} 份</span>
                <span>勘办笔录 {surveySummaryEvidenceCount} 份</span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">理赔分</h3>
              <span className="text-xs text-slate-500">仅供查看保单得失和理赔录入信息</span>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                      <th className="px-4 py-2 w-14">序号</th>
                      <th className="px-4 py-2">品名</th>
                      <th className="px-4 py-2 w-20">数量</th>
                      <th className="px-4 py-2 w-20">包装</th>
                      <th className="px-4 py-2 w-24">单价</th>
                      <th className="px-4 py-2 w-28">报损金额</th>
                      <th className="px-4 py-2 w-28">报损类型</th>
                      <th className="px-4 py-2">核定意见</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {claimRows.map((row) => (
                      <tr key={row.id}>
                        <td className="px-4 py-2 text-slate-500">{row.id}</td>
                        <td className="px-4 py-2 text-slate-800">{row.itemName}</td>
                        <td className="px-4 py-2 text-slate-700">{row.quantity}</td>
                        <td className="px-4 py-2 text-slate-700">{row.packageType}</td>
                        <td className="px-4 py-2 text-slate-700">{row.unitPrice}</td>
                        <td className="px-4 py-2 text-rose-600">{row.claimAmount}</td>
                        <td className="px-4 py-2 text-slate-700">{row.claimType}</td>
                        <td className="px-4 py-2 text-slate-700">{row.appraisalOpinion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">保险公司认定意见</h3>
            </div>
            <div className="p-6">
              <textarea
                rows={4}
                value={insurerOpinion}
                onChange={(e) => setInsurerOpinion(e.target.value)}
                disabled={!isReviewEditable}
                placeholder="录入保险公司认定意见"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
              />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">理赔引导录入</h3>
              <button
                type="button"
                onClick={addGuideRow}
                disabled={!isReviewEditable}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> 添加
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                      <th className="px-4 py-2 w-40">日期</th>
                      <th className="px-4 py-2">回退意见</th>
                      <th className="px-4 py-2">备注记录</th>
                      <th className="px-4 py-2 w-28 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {guideRows.map((row) => (
                      <tr key={row.id}>
                        <td className="px-4 py-2">
                          <input
                            type="date"
                            value={row.date}
                            onChange={(e) => updateGuideRow(row.id, 'date', e.target.value)}
                            disabled={!isReviewEditable}
                            className="w-full px-2 py-1 border border-slate-200 rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.feedback}
                            onChange={(e) => updateGuideRow(row.id, 'feedback', e.target.value)}
                            disabled={!isReviewEditable}
                            placeholder="回退意见"
                            className="w-full px-2 py-1 border border-slate-200 rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.note}
                            onChange={(e) => updateGuideRow(row.id, 'note', e.target.value)}
                            disabled={!isReviewEditable}
                            placeholder="备注"
                            className="w-full px-2 py-1 border border-slate-200 rounded"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button className="px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50" disabled={!isReviewEditable}>
                            发送回函
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Toolbar */}
        <div className="sticky bottom-0 -mx-6 -mb-6 lg:-mx-8 lg:-mb-6 mt-auto bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-between items-center px-6 lg:px-8 gap-4">
          <button
            type="button"
            onClick={() => {
              setSelectedCase({ ...selectedCase, reviewDecision: selectedCase.reviewDecision || 'approve' });
              setShowReviewConfirm(true);
            }}
            disabled={!isReviewEditable}
            className="px-6 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            提交
          </button>
          <button
            type="button"
            disabled={!isReviewEditable}
            className="px-6 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            一键生成公估报告
          </button>
        </div>

        {showReviewConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">确认提交</h3>
              <p className="text-sm text-slate-600 mb-6">
                确认提交本次审核结论吗？提交后状态将更新为{selectedCase.reviewDecision === 'approve' ? stageConfig.approvedStatus : stageConfig.rejectedStatus}。
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowReviewConfirm(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    onAppraisalSubmit(selectedCase.id, {
                      reviewDecision: selectedCase.reviewDecision,
                      reviewComment,
                    }, reviewStage);
                    setShowReviewConfirm(false);
                    setSelectedCase(null);
                  }}
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
      {/* Filter Section */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex flex-wrap gap-x-6 gap-y-5">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">综合搜索</label>
            <input 
              type="text" 
              placeholder="案件编号/保单号" 
              value={draftFilter.search}
              onChange={(event) => setDraftFilter((prev) => ({ ...prev, search: event.target.value }))}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
            />
          </div>
          
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">案件状态</label>
            <select
              value={draftFilter.status}
              onChange={(event) => setDraftFilter((prev) => ({ ...prev, status: event.target.value }))}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">全部</option>
              {stageConfig.statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[280px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">报案日期</label>
            <div className="flex items-center w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
              <input
                type="date"
                value={draftFilter.reportDateFrom}
                onChange={(event) => setDraftFilter((prev) => ({ ...prev, reportDateFrom: event.target.value }))}
                className="bg-transparent border-none focus:outline-none text-slate-700 w-full flex-1 cursor-pointer"
              />
              <span className="text-slate-300 mx-2 text-xs">至</span>
              <input
                type="date"
                value={draftFilter.reportDateTo}
                onChange={(event) => setDraftFilter((prev) => ({ ...prev, reportDateTo: event.target.value }))}
                className="bg-transparent border-none focus:outline-none text-slate-700 w-full flex-1 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-end gap-2 min-w-[220px]">
            <button
              type="button"
              onClick={handleApplyFilter}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              查询
            </button>
            <button
              type="button"
              onClick={handleResetFilter}
              className="px-4 py-1.5 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors"
            >
              重置
            </button>
          </div>
        </div>
        
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        <div className="pb-4 flex justify-between items-center">
          <div className="text-sm text-slate-500">共找到 <span className="font-medium text-slate-900">{filteredDisplayData.length}</span> 条{stageConfig.pageTitle}记录</div>
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
              {filteredDisplayData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                  onClick={() => {
                    if (row.status === stageConfig.openableStatus) {
                      if (!canReview) {
                        setSelectedCase(row);
                      } else {
                        onCaseOpen(row, reviewStage);
                        setSelectedCase({ ...row, status: stageConfig.inProgressStatus });
                      }
                    } else {
                      setSelectedCase(row);
                    }
                    setReviewComment(row.reviewComment || '');
                  }}
                >
                  <td className="px-4 py-3 font-mono text-slate-600 text-xs">{row.id}</td>
                  <td className="px-4 py-3 font-mono text-slate-600 text-xs">{row.policyNo}</td>
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-[220px]">
                    <span className="block truncate" title={row.insured}>{row.insured}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-800">{row.reporter}</td>
                  <td className="px-4 py-3 text-slate-600">{row.reportTime}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusTone(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs transition-colors p-1 rounded hover:bg-blue-50 disabled:text-slate-400 disabled:hover:bg-transparent" disabled={row.status === stageConfig.openableStatus && !canReview}>
                      {row.status === stageConfig.openableStatus ? stageConfig.openActionText : row.status === stageConfig.inProgressStatus ? stageConfig.continueActionText : '查看详情'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDisplayData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    当前筛选条件下暂无案件记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
