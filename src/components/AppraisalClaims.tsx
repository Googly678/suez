import React, { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, ChevronDown, Search, Plus, FileText, AlertCircle, Check, ClipboardList, Building2, Trash2, Calculator, CheckCircle2, ExternalLink } from 'lucide-react';
import { getCompensationLimitDisplay } from '../constants/policyDisplay';

export default function AppraisalClaims({
  claimsPool,
  onCaseOpen,
  onAppraisalSubmit,
  initialSelectedCase,
  onInitialSelectedCaseConsumed,
  reviewStage = 'appraisal',
  canReview,
  onNavigateToClaimsAssistance,
  onOpenAttachmentViewer,
}: {
  claimsPool: any[];
  onCaseOpen: (claimCase: any, reviewStage?: 'appraisal' | 'insurer') => void;
  onAppraisalSubmit: (claimId: string, appraisalData: any, reviewStage?: 'appraisal' | 'insurer') => void;
  initialSelectedCase?: any;
  onInitialSelectedCaseConsumed?: () => void;
  reviewStage?: 'appraisal' | 'insurer';
  canReview: boolean;
  onNavigateToClaimsAssistance?: (assistNo: string) => void;
  onOpenAttachmentViewer?: (assistNo: string, folder?: string) => void;
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
  const [surveyBlocks, setSurveyBlocks] = useState([
    {
      id: 1,
      period: '',
      initiator: '',
      contact: '',
      location: '',
      rows: [{ id: 1, itemName: '', model: '', quantity: '', packageType: '', lossDesc: '', voucher: '' }],
      summary: '',
      imageCount: 0,
      notebookCount: 0,
      images: [] as Array<{ id: string; name: string; dataUrl: string }>,
    },
  ]);
  const [claimRows] = useState([
    { id: 1, itemName: '电子设备', model: 'XH-001', quantity: '50', packageType: '纸箱', unitPrice: '1000', claimAmount: '50000', claimType: '报废', appraisalOpinion: '同意按报废核损' },
  ]);
  const [appraisalCargoList, setAppraisalCargoList] = useState([
    { id: 1, name: '', model: '', quantity: '', unit: '', price: '', amount: '', type: '' },
  ]);
  const [appraisalIndirectLossList, setAppraisalIndirectLossList] = useState([
    { id: 1, amount: '', item: '', note: '' },
  ]);
  const [insurerOpinion, setInsurerOpinion] = useState('');
  const [guideRows, setGuideRows] = useState([
    { id: 1, date: '', feedback: '', note: '' },
  ]);
  const [insurerAuditRows, setInsurerAuditRows] = useState([
    { id: 1, date: '', opinion: '', note: '' },
  ]);
  const [reportPreview, setReportPreview] = useState('');
  const [claimLogText, setClaimLogText] = useState('');
  const [insurerActionMessage, setInsurerActionMessage] = useState('');
  const [appraisalReportPreview, setAppraisalReportPreview] = useState('');
  const [appraisalReportHtml, setAppraisalReportHtml] = useState('');
  const [appraisalActionMessage, setAppraisalActionMessage] = useState('');
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

  const endorsementTimeline = useMemo(() => {
    if (Array.isArray(selectedCase?.endorsementRecords) && selectedCase.endorsementRecords.length > 0) {
      return selectedCase.endorsementRecords.map((item: any, index: number) => ({
        id: String(item.id || `endorsement-${index + 1}`),
        time: String(item.time || item.date || selectedCase?.updatedAt || '--'),
        content: String(item.content || item.record || item.note || '--'),
      }));
    }

    const text = String(selectedCase?.endorsement || '').trim();
    if (!text) {
      return [];
    }

    return text
      .split(/\r?\n+/)
      .map((line: string, index: number) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        const matched = trimmed.match(/^(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)\s*[-:：\s]\s*(.+)$/);
        if (matched) {
          return { id: `endorsement-${index + 1}`, time: matched[1], content: matched[2] };
        }
        return { id: `endorsement-${index + 1}`, time: selectedCase?.updatedAt || '--', content: trimmed };
      })
      .filter(Boolean) as Array<{ id: string; time: string; content: string }>;
  }, [selectedCase]);

  useEffect(() => {
    if (!selectedCase?.policyNo) return;
    localStorage.setItem(`policy_endorsements_${selectedCase.policyNo}`, JSON.stringify(endorsementTimeline));
  }, [selectedCase?.policyNo, endorsementTimeline]);

  const openPolicyAttachment = (policyNo: string) => {
    if (!policyNo) return;
    const url = new URL(window.location.href);
    url.searchParams.set('page', 'policy-attachments');
    url.searchParams.set('policyNo', policyNo);
    window.open(url.toString(), '_blank');
  };

  const openClaimAttachmentFolder = (folder: string) => {
    const assistNo = selectedCase?.assistNo || '';
    if (!assistNo) return;
    onOpenAttachmentViewer?.(assistNo, folder);
  };

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

  const createEmptySurveyBlock = (id: number) => ({
    id,
    period: '',
    initiator: '',
    contact: '',
    location: '',
    rows: [{ id: Date.now(), itemName: '', model: '', quantity: '', packageType: '', lossDesc: '', voucher: '' }],
    summary: '',
    imageCount: 0,
    notebookCount: 0,
    images: [] as Array<{ id: string; name: string; dataUrl: string }>,
  });

  const addSurveyBlock = () => {
    setSurveyBlocks((prev) => [...prev, createEmptySurveyBlock(Date.now())]);
  };

  const removeSurveyBlock = (blockId: number) => {
    setSurveyBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  const updateBlock = (blockId: number, field: string, value: string) => {
    setSurveyBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, [field]: value } : b)));
  };

  const addRowToBlock = (blockId: number) => {
    setSurveyBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? { ...b, rows: [...b.rows, { id: Date.now(), itemName: '', model: '', quantity: '', packageType: '', lossDesc: '', voucher: '' }] }
          : b,
      ),
    );
  };

  const updateRowInBlock = (blockId: number, rowId: number, field: string, value: string) => {
    setSurveyBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, rows: b.rows.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)) } : b,
      ),
    );
  };

  const addGuideRow = () => {
    setGuideRows((prev) => [...prev, { id: Date.now(), date: '', feedback: '', note: '' }]);
  };

  const addAppraisalCargoRow = () => {
    setAppraisalCargoList((prev) => [...prev, { id: Date.now(), name: '', model: '', quantity: '', unit: '', price: '', amount: '', type: '' }]);
  };

  const removeAppraisalCargoRow = (id: number) => {
    if (appraisalCargoList.length <= 1) return;
    setAppraisalCargoList((prev) => prev.filter((row) => row.id !== id));
  };

  const updateAppraisalCargoRow = (id: number, field: string, value: string) => {
    setAppraisalCargoList((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, [field]: value } as any;
        if (field === 'quantity' || field === 'price') {
          const qty = Number(next.quantity) || 0;
          const price = Number(next.price) || 0;
          next.amount = qty > 0 && price >= 0 ? (qty * price).toFixed(2).replace(/\.00$/, '') : '';
        }
        return next;
      }),
    );
  };

  const addAppraisalIndirectLossRow = () => {
    setAppraisalIndirectLossList((prev) => [...prev, { id: Date.now(), amount: '', item: '', note: '' }]);
  };

  const removeAppraisalIndirectLossRow = (id: number) => {
    if (appraisalIndirectLossList.length <= 1) return;
    setAppraisalIndirectLossList((prev) => prev.filter((row) => row.id !== id));
  };

  const updateAppraisalIndirectLossRow = (id: number, field: 'amount' | 'item' | 'note', value: string) => {
    setAppraisalIndirectLossList((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const updateGuideRow = (id: number, field: 'date' | 'feedback' | 'note', value: string) => {
    setGuideRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const updateInsurerAuditRow = (id: number, field: 'date' | 'opinion' | 'note', value: string) => {
    setInsurerAuditRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const getToday = () => new Date().toISOString().slice(0, 10);

  const getAssistAttachmentGroups = (claimCase: any) => {
    const groups = [
      { label: '事故佐证', files: claimCase?.accidentEvidenceFiles || [] },
      { label: '承托关系佐证', files: claimCase?.relationEvidenceFiles || [] },
      { label: '车辆信息佐证', files: claimCase?.vehicleEvidenceFiles || [] },
      { label: '直接损失佐证', files: claimCase?.directLossEvidenceFiles || [] },
      { label: '间接损失佐证', files: claimCase?.indirectLossEvidenceFiles || [] },
      { label: '备注附件', files: claimCase?.remarkEvidenceFiles || [] },
    ];

    return groups.filter((group) => Array.isArray(group.files) && group.files.length > 0);
  };

  const buildClaimLog = () => {
    const header = [
      '理赔日志',
      `案件编号：${selectedCase?.id || '--'}`,
      `保单号：${selectedCase?.policyNo || '--'}`,
      `被保险人：${selectedCase?.insured || '--'}`,
      `保险公司：${selectedCase?.company || '--'}`,
      `生成日期：${getToday()}`,
      '',
      `保险公司认定意见：${insurerOpinion || '--'}`,
      '',
      '审核记录：',
    ];

    const rowLines = insurerAuditRows.map((row, idx) => {
      return `${idx + 1}. 日期:${row.date || '--'} | 审核意见:${row.opinion || '--'} | 备注:${row.note || '--'}`;
    });

    return [...header, ...rowLines, '', `最终结论：${selectedCase?.reviewDecision === 'reject' ? '退回' : '同意'}`, `审核意见：${reviewComment || '--'}`].join('\n');
  };

  const handleGenerateClaimLog = () => {
    const content = buildClaimLog();
    setReportPreview(content);
    setClaimLogText(content);
    setInsurerActionMessage('已生成理赔日志预览。请确认内容后点击“下载理赔日志”。');
  };

  const handleDownloadClaimLog = () => {
    if (!claimLogText) {
      setInsurerActionMessage('请先生成预览，再下载日志。');
      return;
    }
    const blob = new Blob([claimLogText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `理赔日志_${selectedCase?.id || '未命名'}.txt`;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    setInsurerActionMessage('理赔日志已下载。');
  };

  const buildAppraisalReportHtml = () => {
    const today = getToday();

    // 从 AttachmentManager localStorage 读取附件（以 assistNo 为键）
    const assistNo: string = selectedCase?.assistNo || selectedCase?.id || '';
    let storageAttachments: Record<string, Array<{ id: string; name: string; type: string; dataUrl: string; uploadedAt: string }>> = {};
    if (assistNo) {
      try {
        const raw = localStorage.getItem(`claim_attachments_${assistNo}`);
        if (raw) storageAttachments = JSON.parse(raw);
      } catch {
        storageAttachments = {};
      }
    }
    const attachmentFolders = ['个人身份证明', '车辆证明', '发票', '损失证明', '其他'] as const;
    const hasStorageImages = attachmentFolders.some((f) => (storageAttachments[f] || []).some((a) => a.type?.startsWith('image/')));

    const escHtml = (str: string) => String(str || '--').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const surveyBlocksHtml = surveyBlocks.map((block, blockIdx) => {
      const rowsHtml = block.rows.filter((r) => r.itemName).map((row, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${escHtml(row.itemName)}</td>
          <td>${escHtml((row as any).model)}</td>
          <td>${escHtml(row.quantity)}</td>
          <td>${escHtml(row.packageType)}</td>
          <td>${escHtml(row.lossDesc)}</td>
          <td>${escHtml(row.voucher)}</td>
        </tr>`).join('');
      const noRows = block.rows.every((r) => !r.itemName);

      const imagesHtml = (block.images || []).length > 0
        ? `<div class="img-grid">${(block.images || []).map((img) => `
            <figure>
              <img src="${img.dataUrl}" alt="${escHtml(img.name)}" />
              <figcaption>${escHtml(img.name)}</figcaption>
            </figure>`).join('')}</div>`
        : '';

      return `
        <div class="block">
          <div class="block-title">查勘记录 #${blockIdx + 1}</div>
          <table class="info-table">
            <tr><th>查勘日期</th><td>${escHtml(block.period)}</td><th>现场查勘人</th><td>${escHtml(block.initiator)}</td></tr>
            <tr><th>联系方式</th><td>${escHtml(block.contact)}</td><th>查勘地点</th><td colspan="3">${escHtml(block.location)}</td></tr>
          </table>
          <div class="sub-title">货损明细</div>
          ${noRows ? '<p class="empty">暂无明细</p>' : `
          <table class="data-table">
            <thead><tr><th>序号</th><th>品名</th><th>型号</th><th>数量</th><th>包装</th><th>货损状态说明</th><th>佐证</th></tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>`}
          ${block.summary ? `<div class="summary"><span>查勘已况：</span>${escHtml(block.summary)}</div>` : ''}
          ${imagesHtml ? `<div class="sub-title">现场图片</div>${imagesHtml}` : ''}
          <p class="stats">图片 ${block.imageCount} 份 &nbsp;|&nbsp; 勘办笔录 ${block.notebookCount} 份</p>
        </div>`;
    }).join('');

    const claimRowsHtml = claimRows.map((row, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${escHtml(row.itemName)}</td>
        <td>${escHtml((row as any).model)}</td>
        <td>${escHtml(row.quantity)}</td>
        <td>${escHtml(row.packageType)}</td>
        <td>${escHtml(row.unitPrice)}</td>
        <td class="amount">${escHtml(row.claimAmount)}</td>
        <td>${escHtml(row.claimType)}</td>
        <td>${escHtml(row.appraisalOpinion)}</td>
      </tr>`).join('');

    const guideRowsHtml = guideRows.filter((r) => r.date || r.feedback).map((row, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${escHtml(row.date)}</td>
        <td>${escHtml(row.feedback)}</td>
        <td>${escHtml(row.note)}</td>
      </tr>`).join('');

    const attachmentsSection = hasStorageImages ? `
      <section>
        <h2>理赔附件（附件管理器图片）</h2>
        ${attachmentFolders.map((folder) => {
          const imgs = (storageAttachments[folder] || []).filter((a) => a.type?.startsWith('image/'));
          if (!imgs.length) return '';
          return `
            <div class="block">
              <div class="block-title">${escHtml(folder)}</div>
              <div class="img-grid">${imgs.map((img) => `
                <figure>
                  <img src="${img.dataUrl}" alt="${escHtml(img.name)}" />
                  <figcaption>${escHtml(img.name)}<br/><span style="font-size:10px;color:#888">${escHtml(img.uploadedAt)}</span></figcaption>
                </figure>`).join('')}
              </div>
            </div>`;
        }).join('')}
      </section>` : '';

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<title>公估理赔报告 · ${escHtml(selectedCase?.id || '未命名')}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:"SimSun","Noto Serif SC","Times New Roman",serif;font-size:13px;color:#1a1a1a;background:#fff;padding:30px 40px}
  @media print{body{padding:0}}
  .report-header{text-align:center;padding-bottom:20px;border-bottom:2px solid #1a4fa8;margin-bottom:24px}
  .report-header h1{font-size:22px;letter-spacing:6px;color:#1a4fa8;margin-bottom:6px}
  .report-header .meta{font-size:12px;color:#555;letter-spacing:1px}
  h2{font-size:14px;font-weight:bold;color:#1a4fa8;border-left:4px solid #1a4fa8;padding-left:8px;margin:20px 0 10px}
  .block{border:1px solid #dde3ef;border-radius:6px;padding:14px;margin-bottom:14px}
  .block-title{font-size:13px;font-weight:bold;color:#333;border-bottom:1px solid #eee;padding-bottom:6px;margin-bottom:10px}
  .sub-title{font-size:12px;font-weight:bold;color:#555;margin:10px 0 6px}
  .info-table{width:100%;border-collapse:collapse;margin-bottom:10px;font-size:12px}
  .info-table th{background:#f4f7fb;color:#444;font-weight:600;padding:5px 8px;border:1px solid #d5dce8;width:90px;white-space:nowrap}
  .info-table td{padding:5px 8px;border:1px solid #d5dce8}
  .data-table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:8px}
  .data-table thead tr{background:#f4f7fb}
  .data-table th,.data-table td{padding:5px 8px;border:1px solid #d5dce8;white-space:nowrap}
  .data-table td.amount{color:#c0392b;font-weight:600}
  .summary{font-size:12px;background:#fafafa;border:1px solid #eee;border-radius:4px;padding:6px 10px;margin-top:8px;line-height:1.6}
  .summary span{font-weight:600;color:#555}
  .stats{font-size:11px;color:#888;margin-top:8px}
  .img-grid{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}
  .img-grid figure{flex:0 0 auto;max-width:240px;border:1px solid #dde;border-radius:4px;overflow:hidden;background:#fafafa}
  .img-grid img{width:240px;height:180px;object-fit:cover;display:block}
  .img-grid figcaption{font-size:10px;color:#666;padding:4px 6px;text-align:center;word-break:break-all}
  .empty{font-size:12px;color:#999;text-align:center;padding:10px 0}
  .opinion{font-size:13px;line-height:1.8;padding:10px 14px;background:#fafcff;border:1px solid #d5dce8;border-radius:4px;white-space:pre-wrap}
  .footer{margin-top:40px;padding-top:16px;border-top:1px solid #ddd;font-size:11px;color:#999;text-align:right}
  @media print{.img-grid img{max-height:180px}}
</style>
</head>
<body>
<div class="report-header">
  <h1>公 估 理 赔 报 告</h1>
  <div class="meta">报告日期：${today} &nbsp;|&nbsp; 案件编号：${escHtml(selectedCase?.id)} &nbsp;|&nbsp; 保单号：${escHtml(selectedCase?.policyNo)}</div>
</div>

<section>
  <h2>一、案件基本信息</h2>
  <table class="info-table">
    <tr><th>案件编号</th><td>${escHtml(selectedCase?.id)}</td><th>保单号</th><td>${escHtml(selectedCase?.policyNo)}</td></tr>
    <tr><th>被保险人</th><td>${escHtml(selectedCase?.insured)}</td><th>保险公司</th><td>${escHtml(selectedCase?.company)}</td></tr>
    <tr><th>险种</th><td>${escHtml(selectedCase?.type)}</td><th>报案时间</th><td>${escHtml(selectedCase?.reportTime)}</td></tr>
    <tr><th>当前状态</th><td>${escHtml(selectedCase?.status)}</td><th>报案人</th><td>${escHtml(selectedCase?.reporter)}</td></tr>
  </table>
</section>

<section>
  <h2>二、查勘历史</h2>
  ${surveyBlocksHtml || '<p class="empty">暂无查勘记录</p>'}
</section>

<section>
  <h2>三、理赔分（货损明细）</h2>
  <table class="data-table">
    <thead><tr><th>序号</th><th>品名</th><th>型号</th><th>数量</th><th>包装</th><th>单价</th><th>报损金额</th><th>报损类型</th><th>核定意见</th></tr></thead>
    <tbody>${claimRowsHtml || '<tr><td colspan="9" style="text-align:center;color:#999;padding:10px">暂无数据</td></tr>'}</tbody>
  </table>
</section>

<section>
  <h2>四、保险公司认定意见</h2>
  <div class="opinion">${escHtml(insurerOpinion) || '<span style="color:#999">（暂未填写）</span>'}</div>
</section>

${guideRowsHtml ? `
<section>
  <h2>五、理赔引导记录</h2>
  <table class="data-table">
    <thead><tr><th>序号</th><th>日期</th><th>回退意见</th><th>备注</th></tr></thead>
    <tbody>${guideRowsHtml}</tbody>
  </table>
</section>` : ''}

${attachmentsSection}

<div class="footer">本报告由系统自动生成，仅供参考 &nbsp;·&nbsp; 生成时间：${new Date().toLocaleString('zh-CN')}</div>
</body>
</html>`;
    return html;
  };

  const buildAppraisalReport = () => {
    const today = getToday();
    const lines: string[] = [];
    lines.push('═══════════════════════════════════════════');
    lines.push('            公  估  理  赔  报  告');
    lines.push('═══════════════════════════════════════════');
    lines.push(`报告日期：${today}`);
    lines.push('');
    lines.push('【案件基本信息】');
    lines.push(`案件编号：${selectedCase?.id || '--'}`);
    lines.push(`保单号：${selectedCase?.policyNo || '--'}`);
    lines.push(`被保险人：${selectedCase?.insured || '--'}`);
    lines.push(`保险公司：${selectedCase?.company || '--'}`);
    lines.push(`险种：${selectedCase?.type || '--'}`);
    lines.push(`报案时间：${selectedCase?.reportTime || '--'}`);
    lines.push('');

    surveyBlocks.forEach((block, blockIdx) => {
      lines.push(`【查勘历史 第${blockIdx + 1}次】`);
      lines.push(`查勘日期：${block.period || '--'}`);
      lines.push(`现场查勘人：${block.initiator || '--'}`);
      lines.push(`联系方式：${block.contact || '--'}`);
      lines.push(`查勘地点：${block.location || '--'}`);
      lines.push('  货损明细：');
      const hasRows = block.rows.some((r) => r.itemName);
      if (!hasRows) {
        lines.push('  （暂无明细）');
      } else {
        block.rows.forEach((row, idx) => {
          if (!row.itemName) return;
          lines.push(`    ${idx + 1}. 品名：${row.itemName}  型号：${(row as any).model || '--'}  数量：${row.quantity || '--'}  包装：${row.packageType || '--'}`);
          lines.push(`       货损状态：${row.lossDesc || '--'}`);
          if (row.voucher) lines.push(`       佐证：${row.voucher}`);
        });
      }
      lines.push(`  查勘已况：${block.summary || '（暂未填写）'}`);
      lines.push(`  图片佐证：${block.imageCount} 份  勘办笔录：${block.notebookCount} 份`);
      lines.push('');
    });

    lines.push('【保险公司认定意见】');
    lines.push(insurerOpinion || '（暂未填写）');
    lines.push('');
    const hasGuide = guideRows.some((r) => r.date || r.feedback);
    if (hasGuide) {
      lines.push('【理赔引导记录】');
      guideRows.forEach((row, idx) => {
        if (row.date || row.feedback) {
          lines.push(`  ${idx + 1}. ${row.date || '--'}  ${row.feedback || '--'}${row.note ? '  备注：' + row.note : ''}`);
        }
      });
      lines.push('');
    }
    lines.push('═══════════════════════════════════════════');
    return lines.join('\n');
  };

  const handleGenerateAppraisalReport = () => {
    const content = buildAppraisalReport();
    setAppraisalReportPreview(content);
    const htmlContent = buildAppraisalReportHtml();
    setAppraisalReportHtml(htmlContent);
    setAppraisalActionMessage('已生成公估报告预览。请确认内容后点击“下载图文报告”。');
  };

  const handleDownloadAppraisalReport = () => {
    if (!appraisalReportHtml) {
      setAppraisalActionMessage('请先生成预览，再下载报告。');
      return;
    }

    const htmlBlob = new Blob([appraisalReportHtml], { type: 'text/html;charset=utf-8' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = `公估理赔报告_${selectedCase?.id || '未命名'}.html`;
    document.body.appendChild(htmlLink);
    htmlLink.click();
    htmlLink.remove();
    URL.revokeObjectURL(htmlUrl);
    setAppraisalActionMessage('报告已下载。');
  };

  useEffect(() => {
    if (initialSelectedCase) {
      setSelectedCase(initialSelectedCase);
      setReviewComment(initialSelectedCase.reviewComment || '');
      setAppraisalReportPreview('');
      setAppraisalReportHtml('');
      setAppraisalActionMessage('');
      setClaimLogText('');
      setReportPreview('');
      // 同步查勘历史数据
      if (initialSelectedCase.surveyBlocks?.length) {
        setSurveyBlocks(initialSelectedCase.surveyBlocks);
      } else if (initialSelectedCase.surveyPeriod || initialSelectedCase.surveyRows?.length) {
        // 兼容旧格式：将旧字段转为一个查勘块
        setSurveyBlocks([{
          id: 1,
          period: initialSelectedCase.surveyPeriod || '',
          initiator: initialSelectedCase.surveyInitiator || '',
          contact: initialSelectedCase.surveyContact || '',
          location: initialSelectedCase.surveyLocation || '',
          rows: (initialSelectedCase.surveyRows || []).map((r: any, i: number) => ({
            id: r.id || i + 1,
            itemName: r.itemName || '',
            model: r.model || '',
            quantity: r.quantity || '',
            packageType: r.packageType || '',
            lossDesc: r.lossDesc || '',
            voucher: r.voucher || '',
          })),
          summary: initialSelectedCase.surveySummary || '',
          imageCount: 0,
          notebookCount: 0,
        }]);
      }
      if (initialSelectedCase.guideRows?.length) setGuideRows(initialSelectedCase.guideRows);
      const incomingAppraisalCargo = Array.isArray(initialSelectedCase.appraisalCargoList)
        ? initialSelectedCase.appraisalCargoList
        : [];
      const incomingAssistCargo = Array.isArray(initialSelectedCase.cargoList)
        ? initialSelectedCase.cargoList
        : [];
      const sourceCargoRows = incomingAppraisalCargo.length > 0 ? incomingAppraisalCargo : incomingAssistCargo;
      setAppraisalCargoList(
        sourceCargoRows.length > 0
          ? sourceCargoRows.map((row: any, index: number) => ({
              id: Number(row.id) || Date.now() + index,
              name: String(row.name || row.itemName || ''),
              model: String(row.model || ''),
              quantity: String(row.quantity || ''),
              unit: String(row.unit || row.packageType || ''),
              price: String(row.price || row.unitPrice || ''),
              amount: String(row.amount || row.claimAmount || ''),
              type: String(row.type || row.claimType || ''),
            }))
          : [{ id: 1, name: '', model: '', quantity: '', unit: '', price: '', amount: '', type: '' }],
      );

      const incomingAppraisalIndirect = Array.isArray(initialSelectedCase.appraisalIndirectLossList)
        ? initialSelectedCase.appraisalIndirectLossList
        : [];
      const incomingAssistIndirect = Array.isArray(initialSelectedCase.indirectLossList)
        ? initialSelectedCase.indirectLossList
        : [];
      const sourceIndirectRows = incomingAppraisalIndirect.length > 0 ? incomingAppraisalIndirect : incomingAssistIndirect;
      setAppraisalIndirectLossList(
        sourceIndirectRows.length > 0
          ? sourceIndirectRows.map((row: any, index: number) => ({
              id: Number(row.id) || Date.now() + 1000 + index,
              amount: String(row.amount || ''),
              item: String(row.item || ''),
              note: String(row.note || ''),
            }))
          : [{ id: 1, amount: '', item: '', note: '' }],
      );
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

            {selectedCase?.status === '审核退回' && (
              <section className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-amber-900 mb-1">案件已被驳回，需要重新提交</h4>
                    <p className="text-sm text-amber-800 mb-3">
                      保险公司要求补充以下信息。请返回【理赔协助】重新填写并提交。
                    </p>
                    <div className="text-sm text-amber-800 mb-3 pl-4 border-l-2 border-amber-300">
                      {selectedCase?.reviewComment || '暂无具体说明'}
                    </div>
                    <button
                      onClick={() => onNavigateToClaimsAssistance?.(selectedCase?.assistNo)}
                      className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                    >
                      返回理赔协助重新提交
                    </button>
                  </div>
                </div>
              </section>
            )}

            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-900">理赔协助录入详情（只读）</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-3">基础信息</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                    <div><div className="text-xs text-slate-500 mb-1">案件号</div><div className="font-medium text-slate-900">{selectedCase.id || '--'}</div></div>
                    <div><div className="text-xs text-slate-500 mb-1">关联协助号</div><div className="font-medium text-slate-900">{selectedCase.assistNo || '--'}</div></div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">保单号</div>
                      {selectedCase.policyNo ? (
                        <button
                          type="button"
                          onClick={() => openPolicyAttachment(selectedCase.policyNo || '')}
                          className="font-medium text-sky-500 hover:text-sky-600 inline-flex items-center gap-1"
                        >
                          {selectedCase.policyNo}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="font-medium text-slate-900">--</div>
                      )}
                    </div>
                    <div><div className="text-xs text-slate-500 mb-1">客户编码</div><div className="font-medium text-slate-900">{selectedCase.customerCode || '--'}</div></div>
                    <div><div className="text-xs text-slate-500 mb-1">被保险人</div><div className="font-medium text-slate-900">{selectedCase.insured || '--'}</div></div>
                    <div><div className="text-xs text-slate-500 mb-1">保险公司</div><div className="font-medium text-slate-900">{selectedCase.company || '--'}</div></div>
                    <div><div className="text-xs text-slate-500 mb-1">险种</div><div className="font-medium text-slate-900">{selectedCase.type || '--'}</div></div>
                    <div><div className="text-xs text-slate-500 mb-1">报案时间</div><div className="font-medium text-slate-900">{selectedCase.reportTime || '--'}</div></div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-3">保单及批改信息</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm mb-6">
                    <div><div className="text-xs text-slate-500 mb-1">营业收入</div><div className="font-medium text-slate-900">{selectedCase.businessIncome || '¥50,000,000.00'}</div></div>
                    <div><div className="text-xs text-slate-500 mb-1">保费</div><div className="font-medium text-slate-900">{selectedCase.premium || '--'}</div></div>
                    <div className="md:col-span-2 xl:col-span-4"><div className="text-xs text-slate-500 mb-1">赔偿限额</div><div className="font-medium text-slate-900 whitespace-pre-wrap">{getCompensationLimitDisplay(selectedCase.compLimit)}</div></div>
                    <div className="md:col-span-2 xl:col-span-4"><div className="text-xs text-slate-500 mb-1">免赔条件</div><div className="font-medium text-slate-900">{selectedCase.deductibleClause || '每次事故绝对免赔额为人民币5000元或损失金额的10%，两者以高者为准。'}</div></div>
                    <div className="md:col-span-2 xl:col-span-4"><div className="text-xs text-slate-500 mb-1">特约条款</div><div className="font-medium text-slate-900">{selectedCase.specialClause || '1. 扩展承保冷链运输风险；2. 扩展承保装卸过程中的意外损失。'}</div></div>
                    <div className="md:col-span-2 xl:col-span-4">
                      <div className="text-xs text-slate-500 mb-2">批单信息</div>
                      {endorsementTimeline.length === 0 ? (
                        <div className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-50/50 text-slate-500">暂无批单记录</div>
                      ) : (
                        <ol className="relative border-l border-slate-200 pl-4 space-y-3 ml-2">
                          {endorsementTimeline.map((item: any, index: number) => (
                            <li key={item.id} className="relative">
                              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500" />
                              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                                <div className="text-xs text-slate-500">{item.time}</div>
                                <div className="mt-1 text-sm text-slate-800 whitespace-pre-wrap">{item.content}</div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const url = new URL(window.location.href);
                                    url.searchParams.set('page', 'policy-endorsements');
                                    url.searchParams.set('policyNo', selectedCase.policyNo || '');
                                    url.searchParams.set('index', String(index));
                                    window.open(url.toString(), '_blank');
                                  }}
                                  className="mt-2 text-xs text-blue-500 hover:text-blue-600 underline underline-offset-2"
                                >
                                  批单记录
                                </button>
                              </div>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-slate-600">事故信息</div>
                    <button
                      type="button"
                      onClick={() => openClaimAttachmentFolder('事故证明')}
                      className="px-3 py-1.5 text-xs border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                    >
                      上传佐证
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                    <div><div className="text-xs text-slate-500 mb-1">出险时间</div><div className="font-medium text-slate-900">{selectedCase.accidentInfo?.time || '--'}</div></div>
                    <div><div className="text-xs text-slate-500 mb-1">报案时间</div><div className="font-medium text-slate-900">{selectedCase.accidentInfo?.reportTime || '--'}</div></div>
                    <div><div className="text-xs text-slate-500 mb-1">报案号</div><div className="font-medium text-slate-900">{selectedCase.accidentInfo?.reportNo || '--'}</div></div>
                    <div><div className="text-xs text-slate-500 mb-1">事故原因</div><div className="font-medium text-slate-900">{[selectedCase.accidentInfo?.reason1, selectedCase.accidentInfo?.reason2].filter(Boolean).join(' / ') || '--'}</div></div>
                    <div><div className="text-xs text-slate-500 mb-1">启运地</div><div className="font-medium text-slate-900">{[selectedCase.accidentInfo?.departureProvince, selectedCase.accidentInfo?.departureCity].filter(Boolean).join(' ') || '--'}</div></div>
                    <div><div className="text-xs text-slate-500 mb-1">目的地</div><div className="font-medium text-slate-900">{[selectedCase.accidentInfo?.destinationProvince, selectedCase.accidentInfo?.destinationCity].filter(Boolean).join(' ') || '--'}</div></div>
                    <div className="md:col-span-2 xl:col-span-2"><div className="text-xs text-slate-500 mb-1">出险地点</div><div className="font-medium text-slate-900">{[selectedCase.accidentInfo?.province, selectedCase.accidentInfo?.city, selectedCase.accidentInfo?.district, selectedCase.accidentInfo?.address].filter(Boolean).join(' ') || '--'}</div></div>
                    <div className="md:col-span-2 xl:col-span-4"><div className="text-xs text-slate-500 mb-1">事故描述</div><div className="font-medium text-slate-900 whitespace-pre-wrap">{selectedCase.accidentInfo?.description || '--'}</div></div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-slate-600">承托关系</div>
                    <button
                      type="button"
                      onClick={() => openClaimAttachmentFolder('委托证明')}
                      className="px-3 py-1.5 text-xs border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                    >
                      上传佐证
                    </button>
                  </div>
                  {(selectedCase.logisticsCompanies || []).length === 0 ? (
                    <div className="text-sm text-slate-400 text-center py-4 border border-slate-200 rounded-lg">暂无承托关系信息</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(selectedCase.logisticsCompanies || []).map((row: any, index: number) => (
                        <div key={row.id || index} className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-700">{row.name || '--'}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-slate-600">车辆信息</div>
                    <button
                      type="button"
                      onClick={() => openClaimAttachmentFolder('车辆证明')}
                      className="px-3 py-1.5 text-xs border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                    >
                      上传佐证
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                    <div><div className="text-xs text-slate-500 mb-1">货主</div><div className="font-medium text-slate-900">{selectedCase.ownerName || '--'}</div></div>
                    <div><div className="text-xs text-slate-500 mb-1">车牌号</div><div className="font-medium text-slate-900">{selectedCase.truckPlateNo || '--'}</div></div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-slate-600">直接损失（货损明细）</div>
                    <button
                      type="button"
                      onClick={() => openClaimAttachmentFolder('损失证明')}
                      className="px-3 py-1.5 text-xs border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                    >
                      上传佐证
                    </button>
                  </div>
                  {(selectedCase.cargoList || []).length === 0 ? (
                    <div className="text-sm text-slate-400 text-center py-4 border border-slate-200 rounded-lg">暂无货损明细</div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full min-w-[1120px] table-fixed text-left border-collapse whitespace-nowrap text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                            <th className="px-4 py-2 w-14">序号</th>
                            <th className="px-4 py-2 w-[22%]">品名</th>
                            <th className="px-4 py-2 w-[16%]">型号</th>
                            <th className="px-4 py-2 w-20">数量</th>
                            <th className="px-4 py-2 w-20">包装</th>
                            <th className="px-4 py-2 w-24">单价</th>
                            <th className="px-4 py-2 w-28">报损金额</th>
                            <th className="px-4 py-2 w-28">报损类型</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(selectedCase.cargoList || []).map((row: any, index: number) => (
                            <tr key={row.id || index}>
                              <td className="px-4 py-2 text-slate-500">{index + 1}</td>
                              <td className="px-4 py-2 text-slate-800">{row.name || '--'}</td>
                              <td className="px-4 py-2 text-slate-700">{row.model || '--'}</td>
                              <td className="px-4 py-2 text-slate-700">{row.quantity || '--'}</td>
                              <td className="px-4 py-2 text-slate-700">{row.unit || '--'}</td>
                              <td className="px-4 py-2 text-slate-700">{row.price || '--'}</td>
                              <td className="px-4 py-2 text-rose-600">{row.amount || '--'}</td>
                              <td className="px-4 py-2 text-slate-700">{row.type || '--'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 text-right">
                        <span className="text-sm font-medium text-slate-700">合计报损金额：</span>
                        <span className="text-base font-bold text-rose-600">
                          ¥{(selectedCase.cargoList || []).reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-3">间接损失</div>
                  {(selectedCase.indirectLossList || []).length === 0 ? (
                    <div className="text-sm text-slate-400 text-center py-4 border border-slate-200 rounded-lg">无间接损失</div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                            <th className="px-4 py-2 w-14">序号</th>
                            <th className="px-4 py-2 w-40">损失金额</th>
                            <th className="px-4 py-2 w-40">损失项目</th>
                            <th className="px-4 py-2">损失说明</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(selectedCase.indirectLossList || []).map((row: any, index: number) => (
                            <tr key={row.id || index}>
                              <td className="px-4 py-2 text-slate-500">{index + 1}</td>
                              <td className="px-4 py-2 text-slate-700">{row.amount || '--'}</td>
                              <td className="px-4 py-2 text-slate-700">{row.item || '--'}</td>
                              <td className="px-4 py-2 text-slate-700">{row.note || '--'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-3">理赔协助附件与证据（只读）</div>
                  <div className="space-y-3">
                    {getAssistAttachmentGroups(selectedCase).length === 0 ? (
                      <div className="text-sm text-slate-400 text-center py-4 border border-slate-200 rounded-lg">暂无附件记录</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getAssistAttachmentGroups(selectedCase).map((group) => (
                          <div key={group.label} className="rounded-lg border border-slate-200 p-3 bg-slate-50/60">
                            <div className="text-xs font-semibold text-slate-700 mb-2">{group.label}（{group.files.length}）</div>
                            <div className="space-y-1">
                              {group.files.map((file: string, idx: number) => (
                                <div key={`${group.label}-${idx}`} className="text-xs text-slate-600 truncate">{file}</div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { label: '事故证明', files: selectedCase.accidentEvidenceFiles || [] },
                        { label: '承托关系证明', files: selectedCase.relationEvidenceFiles || [] },
                        { label: '车辆证据', files: selectedCase.vehicleEvidenceFiles || [] },
                        { label: '直接损失证据', files: selectedCase.directLossEvidenceFiles || [] },
                        { label: '间接损失证据', files: selectedCase.indirectLossEvidenceFiles || [] },
                        { label: '备注附件', files: selectedCase.remarkEvidenceFiles || [] },
                      ].map((group) => (
                        <div key={group.label} className="rounded-lg border border-slate-200 p-3 bg-slate-50/60">
                          <div className="text-xs font-semibold text-slate-700 mb-2">{group.label}（{group.files.length}）</div>
                          {group.files.length === 0 ? (
                            <div className="text-xs text-slate-400">暂无</div>
                          ) : (
                            <div className="space-y-1">
                              {group.files.map((file: string, idx: number) => (
                                <div key={`${group.label}-${idx}`} className="text-xs text-slate-600 truncate">{file}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">理赔协助备注</div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-700 whitespace-pre-wrap">{selectedCase.remarks || '--'}</div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* 公估理赔录入详情（只读）：优先读取 surveyBlocks，兼容旧格式 */}
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-semibold text-slate-900">公估理赔录入详情（只读）</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">公估录入状态</div>
                    <div className="font-medium text-slate-900">{selectedCase.status || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">公估结论</div>
                    <div className="font-medium text-slate-900">{selectedCase.reviewDecision || '--'}</div>
                  </div>
                  <div className="md:col-span-2 xl:col-span-2">
                    <div className="text-xs text-slate-500 mb-1">公估备注</div>
                    <div className="font-medium text-slate-900 whitespace-pre-wrap">{selectedCase.reviewComment || '--'}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">查勘历史（只读）</div>
                {(() => {
                  // 兼容：优先 surveyBlocks；兼容旧字段
                  const displayBlocks: Array<{
                    id: number; period: string; initiator: string; contact: string;
                    location: string; rows: any[]; summary: string; imageCount: number; notebookCount: number;
                  }> = selectedCase.surveyBlocks?.length
                    ? selectedCase.surveyBlocks
                    : (selectedCase.surveyPeriod || selectedCase.surveyRows?.length)
                      ? [{
                          id: 1,
                          period: selectedCase.surveyPeriod || '',
                          initiator: selectedCase.surveyInitiator || '',
                          contact: selectedCase.surveyContact || '',
                          location: selectedCase.surveyLocation || '',
                          rows: selectedCase.surveyRows || [],
                          summary: selectedCase.surveySummary || '',
                          imageCount: 0,
                          notebookCount: 0,
                        }]
                      : [];
                  if (displayBlocks.length === 0) {
                    return <div className="text-sm text-slate-400 text-center py-4">暂无查勘记录</div>;
                  }
                  return displayBlocks.map((block, blockIdx) => (
                    <div key={block.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="flex items-center px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                        <span className="text-sm font-semibold text-slate-700">查勘记录 #{blockIdx + 1}</span>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-xs text-slate-500 mb-1">查勘日期</div>
                            <div className="font-medium text-slate-900">{block.period || '--'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">现场查勘人</div>
                            <div className="font-medium text-slate-900">{block.initiator || '--'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">联系方式</div>
                            <div className="font-medium text-slate-900">{block.contact || '--'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">查勘地点</div>
                            <div className="font-medium text-slate-900">{block.location || '--'}</div>
                          </div>
                        </div>
                        {(block.rows || []).length === 0 ? (
                          <div className="text-sm text-slate-400 text-center py-3">暂无货损明细</div>
                        ) : (
                          <div className="overflow-x-auto border border-slate-200 rounded-lg">
                            <table className="w-full min-w-[1080px] table-fixed text-left border-collapse whitespace-nowrap text-sm">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                                  <th className="px-4 py-2 w-14">序号</th>
                                  <th className="px-4 py-2 w-[22%]">品名</th>
                                  <th className="px-4 py-2 w-[16%]">型号</th>
                                  <th className="px-4 py-2 w-24">数量</th>
                                  <th className="px-4 py-2 w-32">包装</th>
                                  <th className="px-4 py-2 w-40">货损状态说明</th>
                                  <th className="px-4 py-2 w-28">佐证</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {block.rows.map((row: any, rowIdx: number) => (
                                  <tr key={row.id || rowIdx}>
                                    <td className="px-4 py-2 text-slate-500">{rowIdx + 1}</td>
                                    <td className="px-4 py-2 text-slate-800">{row.itemName || '--'}</td>
                                    <td className="px-4 py-2 text-slate-700">{row.model || '--'}</td>
                                    <td className="px-4 py-2 text-slate-700">{row.quantity || '--'}</td>
                                    <td className="px-4 py-2 text-slate-700">{row.packageType || '--'}</td>
                                    <td className="px-4 py-2 text-slate-700">{row.lossDesc || '--'}</td>
                                    <td className="px-4 py-2 text-slate-700">{row.voucher || '--'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        {block.summary && (
                          <div className="text-xs text-slate-500">查勘已况：{block.summary}</div>
                        )}
                        <div className="text-xs text-slate-500">图片 {block.imageCount} 份  勘办笔录 {block.notebookCount} 份</div>
                      </div>
                    </div>
                  ));
                })()}
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">保险公司认定意见（公估录入，仅读）</div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedCase.insurerOpinion || insurerOpinion || '--'}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">引导与跟进记录（只读）</div>
                  {(selectedCase.guideRows || guideRows || []).length === 0 ? (
                    <div className="text-sm text-slate-400 text-center py-4 border border-slate-200 rounded-lg">暂无引导记录</div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                            <th className="px-4 py-2 w-14">序号</th>
                            <th className="px-4 py-2 w-40">日期</th>
                            <th className="px-4 py-2">反馈信息</th>
                            <th className="px-4 py-2">备注</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(selectedCase.guideRows || guideRows || []).map((row: any, idx: number) => (
                            <tr key={row.id || idx}>
                              <td className="px-4 py-2 text-slate-500">{idx + 1}</td>
                              <td className="px-4 py-2 text-slate-700">{row.date || '--'}</td>
                              <td className="px-4 py-2 text-slate-700">{row.feedback || '--'}</td>
                              <td className="px-4 py-2 text-slate-700">{row.note || '--'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </section>

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
                                  if (!row.opinion.trim()) {
                                    setInsurerActionMessage('请先填写审核意见后再操作同意。');
                                    return;
                                  }
                                  setSelectedCase({ ...selectedCase, reviewDecision: 'approve' });
                                  setReviewComment(row.opinion || reviewComment);
                                  if (!row.date) {
                                    updateInsurerAuditRow(row.id, 'date', getToday());
                                  }
                                  setInsurerActionMessage('已选择同意，等待确认提交。');
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
                                  if (!row.opinion.trim()) {
                                    setInsurerActionMessage('请先填写审核意见后再操作退回。');
                                    return;
                                  }
                                  setSelectedCase({ ...selectedCase, reviewDecision: 'reject' });
                                  setReviewComment(row.opinion || reviewComment);
                                  if (!row.date) {
                                    updateInsurerAuditRow(row.id, 'date', getToday());
                                  }
                                  setInsurerActionMessage('已选择退回，等待确认提交。');
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

            {insurerActionMessage ? (
              <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-700">
                {insurerActionMessage}
              </div>
            ) : null}

          </div>

          <aside className="rounded-xl border border-rose-300 bg-white p-4 text-sm text-slate-600 min-h-[220px]">
            <div className="text-xs text-slate-500 mb-2">理赔员操作日志</div>
            <textarea
              value={reportPreview}
              readOnly
              placeholder="点击“一键生成理赔日志”后在此展示日志预览"
              className="h-[260px] w-full resize-none rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
            />
            <button
              type="button"
              onClick={handleDownloadClaimLog}
              disabled={!claimLogText}
              className="mt-3 w-full px-4 py-2 border border-slate-300 bg-white rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50 text-xs"
            >
              下载理赔日志
            </button>
          </aside>
        </div>

        <div className="sticky bottom-0 -mx-6 -mb-6 lg:-mx-8 lg:-mb-6 mt-auto bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex flex-wrap justify-between items-center px-6 lg:px-8 gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenAttachmentViewer?.(selectedCase?.assistNo || '')}
              className="px-4 py-2 border border-slate-300 bg-white rounded-md text-slate-700 hover:bg-slate-50"
            >
              查看附件
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerateClaimLog}
              disabled={!isReviewEditable}
              className="px-4 py-2 border border-slate-300 bg-white rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              一键生成理赔日志
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCase({ ...selectedCase, reviewDecision: selectedCase.reviewDecision || 'approve' });
                setShowReviewConfirm(true);
              }}
              disabled={!isReviewEditable}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              提交
            </button>
          </div>
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
                    setInsurerActionMessage('审核结果已提交。');
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
        <div className="flex-1 mt-4 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 pb-24">
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">理赔协助录入详情（只读）</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="text-xs font-semibold text-slate-600 mb-3">基础信息</div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">案件号</div>
                    <div className="font-medium text-slate-900">{selectedCase.id || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">关联协助号</div>
                    <div className="font-medium text-slate-900">{selectedCase.assistNo || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">保单号</div>
                    {selectedCase.policyNo ? (
                      <button
                        type="button"
                        onClick={() => openPolicyAttachment(selectedCase.policyNo || '')}
                        className="font-medium text-sky-500 hover:text-sky-600 inline-flex items-center gap-1"
                      >
                        {selectedCase.policyNo}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="font-medium text-slate-900">--</div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">客户编码</div>
                    <div className="font-medium text-slate-900">{selectedCase.customerCode || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">被保险人</div>
                    <div className="font-medium text-slate-900">{selectedCase.insured || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">保险公司</div>
                    <div className="font-medium text-slate-900">{selectedCase.company || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">险种</div>
                    <div className="font-medium text-slate-900">{selectedCase.type || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">报案时间</div>
                    <div className="font-medium text-slate-900">{selectedCase.reportTime || '--'}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600 mb-3">保单及批改信息</div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm mb-6">
                  <div><div className="text-xs text-slate-500 mb-1">营业收入</div><div className="font-medium text-slate-900">{selectedCase.businessIncome || '¥50,000,000.00'}</div></div>
                  <div><div className="text-xs text-slate-500 mb-1">保费</div><div className="font-medium text-slate-900">{selectedCase.premium || '--'}</div></div>
                  <div className="md:col-span-2 xl:col-span-4"><div className="text-xs text-slate-500 mb-1">赔偿限额</div><div className="font-medium text-slate-900 whitespace-pre-wrap">{getCompensationLimitDisplay(selectedCase.compLimit)}</div></div>
                  <div className="md:col-span-2 xl:col-span-4"><div className="text-xs text-slate-500 mb-1">免赔条件</div><div className="font-medium text-slate-900">{selectedCase.deductibleClause || '每次事故绝对免赔额为人民币5000元或损失金额的10%，两者以高者为准。'}</div></div>
                  <div className="md:col-span-2 xl:col-span-4"><div className="text-xs text-slate-500 mb-1">特约条款</div><div className="font-medium text-slate-900">{selectedCase.specialClause || '1. 扩展承保冷链运输风险；2. 扩展承保装卸过程中的意外损失。'}</div></div>
                  <div className="md:col-span-2 xl:col-span-4">
                    <div className="text-xs text-slate-500 mb-2">批单信息</div>
                    {endorsementTimeline.length === 0 ? (
                      <div className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md bg-slate-50/50 text-slate-500">暂无批单记录</div>
                    ) : (
                      <ol className="relative border-l border-slate-200 pl-4 space-y-3 ml-2">
                        {endorsementTimeline.map((item: any, index: number) => (
                          <li key={item.id} className="relative">
                            <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500" />
                            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                              <div className="text-xs text-slate-500">{item.time}</div>
                              <div className="mt-1 text-sm text-slate-800 whitespace-pre-wrap">{item.content}</div>
                              <button
                                type="button"
                                onClick={() => {
                                  const url = new URL(window.location.href);
                                  url.searchParams.set('page', 'policy-endorsements');
                                  url.searchParams.set('policyNo', selectedCase.policyNo || '');
                                  url.searchParams.set('index', String(index));
                                  window.open(url.toString(), '_blank');
                                }}
                                className="mt-2 text-xs text-blue-500 hover:text-blue-600 underline underline-offset-2"
                              >
                                批单记录
                              </button>
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-slate-600">事故信息</div>
                  <button
                    type="button"
                    onClick={() => openClaimAttachmentFolder('事故证明')}
                    className="px-3 py-1.5 text-xs border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                  >
                    上传佐证
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">出险时间</div>
                    <div className="font-medium text-slate-900">{selectedCase.accidentInfo?.time || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">报案时间</div>
                    <div className="font-medium text-slate-900">{selectedCase.accidentInfo?.reportTime || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">报案号</div>
                    <div className="font-medium text-slate-900">{selectedCase.accidentInfo?.reportNo || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">事故原因</div>
                    <div className="font-medium text-slate-900">{[selectedCase.accidentInfo?.reason1, selectedCase.accidentInfo?.reason2].filter(Boolean).join(' / ') || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">启运地</div>
                    <div className="font-medium text-slate-900">{[selectedCase.accidentInfo?.departureProvince, selectedCase.accidentInfo?.departureCity].filter(Boolean).join(' ') || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">目的地</div>
                    <div className="font-medium text-slate-900">{[selectedCase.accidentInfo?.destinationProvince, selectedCase.accidentInfo?.destinationCity].filter(Boolean).join(' ') || '--'}</div>
                  </div>
                  <div className="md:col-span-2 xl:col-span-2">
                    <div className="text-xs text-slate-500 mb-1">出险地点</div>
                    <div className="font-medium text-slate-900">{[selectedCase.accidentInfo?.province, selectedCase.accidentInfo?.city, selectedCase.accidentInfo?.district, selectedCase.accidentInfo?.address].filter(Boolean).join(' ') || '--'}</div>
                  </div>
                  <div className="md:col-span-2 xl:col-span-4">
                    <div className="text-xs text-slate-500 mb-1">事故描述</div>
                    <div className="font-medium text-slate-900 whitespace-pre-wrap">{selectedCase.accidentInfo?.description || '--'}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-slate-600">承托关系</div>
                  <button
                    type="button"
                    onClick={() => openClaimAttachmentFolder('委托证明')}
                    className="px-3 py-1.5 text-xs border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                  >
                    上传佐证
                  </button>
                </div>
                {(selectedCase.logisticsCompanies || []).length === 0 ? (
                  <div className="text-sm text-slate-400 text-center py-4 border border-slate-200 rounded-lg">暂无承托关系信息</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(selectedCase.logisticsCompanies || []).map((row: any, index: number) => (
                      <div key={row.id || index} className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-700">
                        {row.name || '--'}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-slate-600">车辆信息</div>
                  <button
                    type="button"
                    onClick={() => openClaimAttachmentFolder('车辆证明')}
                    className="px-3 py-1.5 text-xs border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                  >
                    上传佐证
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">货主</div>
                    <div className="font-medium text-slate-900">{selectedCase.ownerName || '--'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">车牌号</div>
                    <div className="font-medium text-slate-900">{selectedCase.truckPlateNo || '--'}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-slate-600">直接损失（货损明细）</div>
                  <button
                    type="button"
                    onClick={() => openClaimAttachmentFolder('损失证明')}
                    className="px-3 py-1.5 text-xs border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                  >
                    上传佐证
                  </button>
                </div>
                {(selectedCase.cargoList || []).length === 0 ? (
                  <div className="text-sm text-slate-400 text-center py-4 border border-slate-200 rounded-lg">暂无货损明细</div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full min-w-[1120px] table-fixed text-left border-collapse whitespace-nowrap text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                          <th className="px-4 py-2 w-14">序号</th>
                          <th className="px-4 py-2 w-[22%]">品名</th>
                          <th className="px-4 py-2 w-[16%]">型号</th>
                          <th className="px-4 py-2 w-20">数量</th>
                          <th className="px-4 py-2 w-20">包装</th>
                          <th className="px-4 py-2 w-24">单价</th>
                          <th className="px-4 py-2 w-28">报损金额</th>
                          <th className="px-4 py-2 w-28">报损类型</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(selectedCase.cargoList || []).map((row: any, index: number) => (
                          <tr key={row.id || index}>
                            <td className="px-4 py-2 text-slate-500">{index + 1}</td>
                            <td className="px-4 py-2 text-slate-800">{row.name || '--'}</td>
                            <td className="px-4 py-2 text-slate-700">{row.model || '--'}</td>
                            <td className="px-4 py-2 text-slate-700">{row.quantity || '--'}</td>
                            <td className="px-4 py-2 text-slate-700">{row.unit || '--'}</td>
                            <td className="px-4 py-2 text-slate-700">{row.price || '--'}</td>
                            <td className="px-4 py-2 text-rose-600">{row.amount || '--'}</td>
                            <td className="px-4 py-2 text-slate-700">{row.type || '--'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600 mb-3">间接损失</div>
                {(selectedCase.indirectLossList || []).length === 0 ? (
                  <div className="text-sm text-slate-400 text-center py-4 border border-slate-200 rounded-lg">无间接损失</div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                          <th className="px-4 py-2 w-14">序号</th>
                          <th className="px-4 py-2 w-40">损失金额</th>
                          <th className="px-4 py-2 w-40">损失项目</th>
                          <th className="px-4 py-2">损失说明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(selectedCase.indirectLossList || []).map((row: any, index: number) => (
                          <tr key={row.id || index}>
                            <td className="px-4 py-2 text-slate-500">{index + 1}</td>
                            <td className="px-4 py-2 text-slate-700">{row.amount || '--'}</td>
                            <td className="px-4 py-2 text-slate-700">{row.item || '--'}</td>
                            <td className="px-4 py-2 text-slate-700">{row.note || '--'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600 mb-3">理赔协助上传附件（只读）</div>
                {getAssistAttachmentGroups(selectedCase).length === 0 ? (
                  <div className="text-sm text-slate-400 text-center py-4 border border-slate-200 rounded-lg">暂无附件记录</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getAssistAttachmentGroups(selectedCase).map((group) => (
                      <div key={group.label} className="rounded-lg border border-slate-200 p-3 bg-slate-50/60">
                        <div className="text-xs font-semibold text-slate-700 mb-2">{group.label}（{group.files.length}）</div>
                        <div className="space-y-1">
                          {group.files.map((file: string, idx: number) => (
                            <div key={`${group.label}-${idx}`} className="text-xs text-slate-600 truncate">{file}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600 mb-3">理赔协助证据清单（只读）</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: '事故证明', files: selectedCase.accidentEvidenceFiles || [] },
                    { label: '承托关系证明', files: selectedCase.relationEvidenceFiles || [] },
                    { label: '车辆证据', files: selectedCase.vehicleEvidenceFiles || [] },
                    { label: '直接损失证据', files: selectedCase.directLossEvidenceFiles || [] },
                    { label: '间接损失证据', files: selectedCase.indirectLossEvidenceFiles || [] },
                    { label: '备注附件', files: selectedCase.remarkEvidenceFiles || [] },
                  ].map((group) => (
                    <div key={group.label} className="rounded-lg border border-slate-200 p-3 bg-slate-50/60">
                      <div className="text-xs font-semibold text-slate-700 mb-2">{group.label}（{group.files.length}）</div>
                      {group.files.length === 0 ? (
                        <div className="text-xs text-slate-400">暂无</div>
                      ) : (
                        <div className="space-y-1">
                          {group.files.map((file: string, idx: number) => (
                            <div key={`${group.label}-${idx}`} className="text-xs text-slate-600 truncate">{file}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600 mb-2">理赔协助备注</div>
                <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-700 whitespace-pre-wrap">
                  {selectedCase.remarks || '--'}
                </div>
              </div>
            </div>
          </section>

          {/* 查勘历史 — 多块 */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">查勘历史</h3>
              <button
                type="button"
                onClick={addSurveyBlock}
                disabled={!isReviewEditable}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> 添加查勘
              </button>
            </div>

            <div className="p-6 space-y-6">
              {surveyBlocks.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">暂无查勘记录，点击"添加查勘"新增一次查勘。</p>
              )}
              {surveyBlocks.map((block, blockIdx) => (
                <div key={block.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  {/* 块标题 */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">查勘记录 #{blockIdx + 1}</span>
                    {isReviewEditable && surveyBlocks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSurveyBlock(block.id)}
                        className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                      >
                        删除
                      </button>
                    )}
                  </div>

                  <div className="p-4 space-y-4">
                    {/* 基本信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">查勘日期</label>
                        <input
                          type="text"
                          value={block.period}
                          onChange={(e) => updateBlock(block.id, 'period', e.target.value)}
                          placeholder="例如 2026-03-20"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                          disabled={!isReviewEditable}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">现场查勘人</label>
                        <input
                          type="text"
                          value={block.initiator}
                          onChange={(e) => updateBlock(block.id, 'initiator', e.target.value)}
                          placeholder="姓名"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                          disabled={!isReviewEditable}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">联系方式</label>
                        <input
                          type="text"
                          value={block.contact}
                          onChange={(e) => updateBlock(block.id, 'contact', e.target.value)}
                          placeholder="手机号"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                          disabled={!isReviewEditable}
                        />
                      </div>
                      <div className="md:col-span-2 xl:col-span-1">
                        <label className="block text-xs text-slate-600 mb-1">查勘地点</label>
                        <input
                          type="text"
                          value={block.location}
                          onChange={(e) => updateBlock(block.id, 'location', e.target.value)}
                          placeholder="详细地点"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                          disabled={!isReviewEditable}
                        />
                      </div>
                    </div>

                    {/* 货损明细表 */}
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full min-w-[1080px] table-fixed text-left border-collapse whitespace-nowrap text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                            <th className="px-4 py-2 w-14">序号</th>
                            <th className="px-4 py-2 w-[22%]">品名</th>
                            <th className="px-4 py-2 w-[16%]">型号</th>
                            <th className="px-4 py-2 w-24">数量</th>
                            <th className="px-4 py-2 w-32">包装</th>
                            <th className="px-4 py-2 w-40">货损状态说明</th>
                            <th className="px-4 py-2 w-28">佐证</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {block.rows.map((row, rowIdx) => (
                            <tr key={row.id}>
                              <td className="px-4 py-2 text-slate-500">{rowIdx + 1}</td>
                              <td className="px-4 py-2">
                                <input value={row.itemName} onChange={(e) => updateRowInBlock(block.id, row.id, 'itemName', e.target.value)} disabled={!isReviewEditable} className="w-full px-2 py-1 border border-slate-200 rounded" placeholder="品名" />
                              </td>
                              <td className="px-4 py-2">
                                <input value={(row as any).model || ''} onChange={(e) => updateRowInBlock(block.id, row.id, 'model', e.target.value)} disabled={!isReviewEditable} className="w-full px-2 py-1 border border-slate-200 rounded" placeholder="型号" />
                              </td>
                              <td className="px-4 py-2">
                                <input value={row.quantity} onChange={(e) => updateRowInBlock(block.id, row.id, 'quantity', e.target.value)} disabled={!isReviewEditable} className="w-full px-2 py-1 border border-slate-200 rounded" placeholder="数量" />
                              </td>
                              <td className="px-4 py-2">
                                <input value={row.packageType} onChange={(e) => updateRowInBlock(block.id, row.id, 'packageType', e.target.value)} disabled={!isReviewEditable} className="w-full px-2 py-1 border border-slate-200 rounded" placeholder="包装" />
                              </td>
                              <td className="px-4 py-2">
                                <input value={row.lossDesc} onChange={(e) => updateRowInBlock(block.id, row.id, 'lossDesc', e.target.value)} disabled={!isReviewEditable} className="w-full px-2 py-1 border border-slate-200 rounded" placeholder="货损状态说明" />
                              </td>
                              <td className="px-4 py-2">
                                <input value={row.voucher} onChange={(e) => updateRowInBlock(block.id, row.id, 'voucher', e.target.value)} disabled={!isReviewEditable} className="w-full px-2 py-1 border border-slate-200 rounded" placeholder="文件名" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {isReviewEditable && (
                      <button
                        type="button"
                        onClick={() => addRowToBlock(block.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
                      >
                        <Plus className="w-3.5 h-3.5" /> 添加货损行
                      </button>
                    )}

                    {/* 查勘已况 */}
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">查勘已况</label>
                      <textarea
                        rows={3}
                        value={block.summary}
                        onChange={(e) => updateBlock(block.id, 'summary', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                        disabled={!isReviewEditable}
                      />
                    </div>

                    {/* 附件上传 */}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <button
                        type="button"
                        disabled={!isReviewEditable}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.multiple = true;
                          input.accept = 'image/*';
                          input.onchange = (ev) => {
                            const files = Array.from((ev.target as HTMLInputElement).files || []);
                            if (!files.length) return;
                            let loaded = 0;
                            const newImages: Array<{ id: string; name: string; dataUrl: string }> = [];
                            files.forEach((file) => {
                              const reader = new FileReader();
                              reader.onload = () => {
                                newImages.push({ id: `${Date.now()}-${Math.random()}`, name: file.name, dataUrl: String(reader.result || '') });
                                loaded += 1;
                                if (loaded === files.length) {
                                  setSurveyBlocks((prev) =>
                                    prev.map((b) =>
                                      b.id === block.id
                                        ? { ...b, imageCount: b.imageCount + files.length, images: [...(b.images || []), ...newImages] }
                                        : b,
                                    ),
                                  );
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          };
                          input.click();
                        }}
                        className="px-3 py-1.5 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        上传图片
                      </button>
                      <button
                        type="button"
                        disabled={!isReviewEditable}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.multiple = true;
                          input.onchange = (ev) => {
                            const files = (ev.target as HTMLInputElement).files;
                            if (files?.length) {
                              setSurveyBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, notebookCount: b.notebookCount + files.length } : b));
                            }
                          };
                          input.click();
                        }}
                        className="px-3 py-1.5 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        上传勘办笔录
                      </button>
                      <span>图片 {block.imageCount} 份</span>
                      <span>勘办笔录 {block.notebookCount} 份</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">公估定损模块</h3>
              <div className="text-xs text-slate-500 mt-1">公估损失核定清单</div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="text-xs font-semibold text-slate-600 mb-3">货物损失核定</div>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full min-w-[1120px] table-fixed text-left border-collapse whitespace-nowrap text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                        <th className="px-4 py-2 w-14">序号</th>
                        <th className="px-4 py-2 w-[22%]">品名</th>
                        <th className="px-4 py-2 w-[16%]">型号</th>
                        <th className="px-4 py-2 w-24">数量</th>
                        <th className="px-4 py-2 w-24">包装</th>
                        <th className="px-4 py-2 w-24">单价</th>
                        <th className="px-4 py-2 w-28">损失金额</th>
                        <th className="px-4 py-2 w-28">损失类型</th>
                        <th className="px-4 py-2 w-16 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appraisalCargoList.map((row, index) => (
                        <tr key={row.id}>
                          <td className="px-4 py-2 text-slate-500">{index + 1}</td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) => updateAppraisalCargoRow(row.id, 'name', e.target.value)}
                              disabled={!isReviewEditable}
                              className="w-full px-2 py-1 border border-slate-200 rounded"
                              placeholder="品名"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={row.model}
                              onChange={(e) => updateAppraisalCargoRow(row.id, 'model', e.target.value)}
                              disabled={!isReviewEditable}
                              className="w-full px-2 py-1 border border-slate-200 rounded"
                              placeholder="型号"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={row.quantity}
                              onChange={(e) => updateAppraisalCargoRow(row.id, 'quantity', e.target.value)}
                              disabled={!isReviewEditable}
                              className="w-full px-2 py-1 border border-slate-200 rounded"
                              placeholder="数量"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={row.unit}
                              onChange={(e) => updateAppraisalCargoRow(row.id, 'unit', e.target.value)}
                              disabled={!isReviewEditable}
                              className="w-full px-2 py-1 border border-slate-200 rounded bg-white"
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
                              value={row.price}
                              onChange={(e) => updateAppraisalCargoRow(row.id, 'price', e.target.value)}
                              disabled={!isReviewEditable}
                              className="w-full px-2 py-1 border border-slate-200 rounded"
                              placeholder="单价"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={row.amount}
                              onChange={(e) => updateAppraisalCargoRow(row.id, 'amount', e.target.value)}
                              disabled={!isReviewEditable}
                              className="w-full px-2 py-1 border border-slate-200 rounded"
                              placeholder="损失金额"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={row.type}
                              onChange={(e) => updateAppraisalCargoRow(row.id, 'type', e.target.value)}
                              disabled={!isReviewEditable}
                              className="w-full px-2 py-1 border border-slate-200 rounded bg-white"
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
                              type="button"
                              onClick={() => removeAppraisalCargoRow(row.id)}
                              disabled={!isReviewEditable || appraisalCargoList.length === 1}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 disabled:text-slate-300 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={addAppraisalCargoRow}
                    disabled={!isReviewEditable}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    新增货损
                  </button>
                  <div className="text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-4 py-1.5">
                    合计损失金额：
                    <span className="text-rose-600 text-base">¥{appraisalCargoList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600 mb-3">间接损失核定</div>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                        <th className="px-4 py-2 w-14">序号</th>
                        <th className="px-4 py-2 w-40">损失金额</th>
                        <th className="px-4 py-2 w-40">损失项目</th>
                        <th className="px-4 py-2">损失说明</th>
                        <th className="px-4 py-2 w-16 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appraisalIndirectLossList.map((row, index) => (
                        <tr key={row.id}>
                          <td className="px-4 py-2 text-slate-500">{index + 1}</td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={row.amount}
                              onChange={(e) => updateAppraisalIndirectLossRow(row.id, 'amount', e.target.value)}
                              disabled={!isReviewEditable}
                              placeholder="损失金额"
                              className="w-full px-2 py-1 border border-slate-200 rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={row.item}
                              onChange={(e) => updateAppraisalIndirectLossRow(row.id, 'item', e.target.value)}
                              disabled={!isReviewEditable}
                              placeholder="损失项目"
                              className="w-full px-2 py-1 border border-slate-200 rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={row.note}
                              onChange={(e) => updateAppraisalIndirectLossRow(row.id, 'note', e.target.value)}
                              disabled={!isReviewEditable}
                              placeholder="损失说明"
                              className="w-full px-2 py-1 border border-slate-200 rounded"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeAppraisalIndirectLossRow(row.id)}
                              disabled={!isReviewEditable || appraisalIndirectLossList.length === 1}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 disabled:text-slate-300 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={addAppraisalIndirectLossRow}
                    disabled={!isReviewEditable}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    新增间接损失
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-900">公估定责任意见</h3>
            </div>
            <div className="p-6">
              <textarea
                rows={4}
                value={insurerOpinion}
                onChange={(e) => setInsurerOpinion(e.target.value)}
                disabled={!isReviewEditable}
                placeholder="录入公估定责任意见"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
              />
            </div>
          </section>

        </div> {/* end left column */}

          {/* Right: Report Preview Aside */}
          <aside className="rounded-xl border border-blue-200 bg-white p-4 text-sm text-slate-600 flex flex-col gap-3">
            <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              公估报告预览
            </div>
            {appraisalActionMessage ? (
              <div className="rounded border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                {appraisalActionMessage}
              </div>
            ) : (
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-400 text-center">
                点击底部「一键生成公估报告」生成预览，再点击下方按钮确认下载图文版 HTML 报告。
              </div>
            )}
            <textarea
              value={appraisalReportPreview}
              readOnly
              placeholder="生成后此处展示纯文本摘要预览..."
              className="flex-1 min-h-[260px] resize-none rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 leading-relaxed font-mono"
            />
            <button
              type="button"
              onClick={handleDownloadAppraisalReport}
              disabled={!appraisalReportHtml}
              className="w-full rounded-md border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              下载图文报告
            </button>
          </aside>
        </div> {/* end grid */}

        {/* Bottom Toolbar */}
        <div className="sticky bottom-0 -mx-6 -mb-6 lg:-mx-8 lg:-mb-6 mt-auto bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex flex-wrap justify-between items-center px-6 lg:px-8 gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerateAppraisalReport}
              disabled={!isReviewEditable}
              className="px-6 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-60"
            >
              一键生成公估报告
            </button>
            <button
              type="button"
              onClick={() => onOpenAttachmentViewer?.(selectedCase?.assistNo || '')}
              className="px-4 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              查看附件
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCase({ ...selectedCase, reviewDecision: selectedCase.reviewDecision || 'approve' });
              setShowReviewConfirm(true);
            }}
            disabled={!isReviewEditable}
            className="px-6 py-2 bg-blue-600 text-white shadow-sm rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            提交理算结果
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
                      // 公估阶段录入的查勘数据，保存回 claimsPool 供保司汇总页读取
                      surveyBlocks,
                      surveyRows: surveyBlocks[0]?.rows || [],
                      surveyPeriod: surveyBlocks[0]?.period || '',
                      surveyInitiator: surveyBlocks[0]?.initiator || '',
                      surveyContact: surveyBlocks[0]?.contact || '',
                      surveyLocation: surveyBlocks[0]?.location || '',
                      surveySummary: surveyBlocks[0]?.summary || '',
                      appraisalCargoList,
                      appraisalIndirectLossList,
                      guideRows,
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
                    // 公估理赔阶段：已提交或被保司退回的案件均可重新开始公估
                    const canOpen = row.status === stageConfig.openableStatus ||
                      (reviewStage === 'appraisal' && row.status === '审核退回');
                    if (canOpen) {
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
                    {(() => {
                      const canOpen = row.status === stageConfig.openableStatus ||
                        (reviewStage === 'appraisal' && row.status === '审核退回');
                      const label = row.status === stageConfig.openableStatus
                        ? stageConfig.openActionText
                        : row.status === stageConfig.inProgressStatus
                        ? stageConfig.continueActionText
                        : (reviewStage === 'appraisal' && row.status === '审核退回')
                        ? '重新公估'
                        : '查看详情';
                      return (
                        <button
                          className={`font-medium text-xs transition-colors p-1 rounded ${canOpen ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'} disabled:text-slate-400`}
                          disabled={canOpen && !canReview}
                        >
                          {label}
                        </button>
                      );
                    })()}
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
