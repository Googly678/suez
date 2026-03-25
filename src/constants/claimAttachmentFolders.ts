export const CLAIM_ATTACHMENT_FOLDERS = [
  '保单信息',
  '被保险人信息',
  '车辆证明',
  '驾驶员证明',
  '三者信息',
  '事故认定',
  '委托证明',
  '现场图片',
  '货损证明',
  '发票',
  '装货图片',
  '卸货图片',
  '施救费',
  '其他',
] as const;

export type ClaimAttachmentFolder = (typeof CLAIM_ATTACHMENT_FOLDERS)[number];

const LEGACY_FOLDER_ALIAS: Record<string, ClaimAttachmentFolder> = {
  个人身份证明: '被保险人信息',
  事故证明: '事故认定',
  损失证明: '货损证明',
};

export const normalizeClaimAttachmentFolder = (folder?: string | null): ClaimAttachmentFolder | null => {
  const raw = String(folder || '').trim();
  if (!raw) return null;
  if ((CLAIM_ATTACHMENT_FOLDERS as readonly string[]).includes(raw)) {
    return raw as ClaimAttachmentFolder;
  }
  return LEGACY_FOLDER_ALIAS[raw] || null;
};