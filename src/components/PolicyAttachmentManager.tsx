import React, { useMemo } from 'react';
import { ChevronLeft, FileText } from 'lucide-react';

type AttachmentItem = {
  id: string;
  name: string;
  dataUrl?: string;
  uploadedAt?: string;
};

const getStorageCandidates = (policyNo: string) => [
  `policy_attachments_${policyNo}`,
  `policyAttachments_${policyNo}`,
  `policy_files_${policyNo}`,
];

const normalizeAttachments = (raw: string | null): AttachmentItem[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item, index) => {
        if (typeof item === 'string') {
          return {
            id: `${index}-${item}`,
            name: item,
          };
        }
        if (item && typeof item === 'object') {
          return {
            id: String(item.id || `${index}-${item.name || 'file'}`),
            name: String(item.name || `附件-${index + 1}`),
            dataUrl: item.dataUrl ? String(item.dataUrl) : undefined,
            uploadedAt: item.uploadedAt ? String(item.uploadedAt) : undefined,
          };
        }
        return null;
      })
      .filter(Boolean) as AttachmentItem[];
  } catch {
    return [];
  }
};

export default function PolicyAttachmentManager({
  policyNo,
  onClose,
}: {
  policyNo: string;
  onClose: () => void;
}) {
  const attachments = useMemo(() => {
    for (const key of getStorageCandidates(policyNo)) {
      const items = normalizeAttachments(localStorage.getItem(key));
      if (items.length > 0) {
        return items;
      }
    }
    return [];
  }, [policyNo]);

  return (
    <div className="h-screen overflow-hidden bg-[#f3f5f7]">
      <div className="h-full border border-slate-300 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="text-sm font-semibold text-slate-900">保单附件</div>
              <div className="mt-0.5 text-xs text-slate-500">保单号：{policyNo || '--'}</div>
            </div>
          </div>
          <div className="text-xs text-slate-500">共 {attachments.length} 个文件</div>
        </div>

        <div className="h-[calc(100vh-59px)] overflow-y-auto p-4">
          {attachments.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">暂无保单附件</div>
          ) : (
            <div className="space-y-3">
              {attachments.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-800">{item.name}</div>
                      <div className="mt-1 text-xs text-slate-400">{item.uploadedAt || '--'}</div>
                    </div>
                    {item.dataUrl ? (
                      <a
                        href={item.dataUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-sky-500 hover:text-sky-600"
                      >
                        <FileText className="h-3.5 w-3.5" /> 查看
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <FileText className="h-3.5 w-3.5" /> 仅文件名
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
