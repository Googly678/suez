import React, { useMemo } from 'react';
import { ChevronLeft, ExternalLink } from 'lucide-react';

type EndorsementItem = {
  id: string;
  time: string;
  content: string;
};

const buildStorageKey = (policyNo: string) => `policy_endorsements_${policyNo}`;

const parseItems = (raw: string | null): EndorsementItem[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item, index) => {
        if (!item || typeof item !== 'object') return null;
        return {
          id: String(item.id || `endorsement-${index + 1}`),
          time: String(item.time || '--'),
          content: String(item.content || '--'),
        };
      })
      .filter(Boolean) as EndorsementItem[];
  } catch {
    return [];
  }
};

export default function PolicyEndorsementViewer({
  policyNo,
  recordIndex,
  onClose,
}: {
  policyNo: string;
  recordIndex: number;
  onClose: () => void;
}) {
  const records = useMemo(() => parseItems(localStorage.getItem(buildStorageKey(policyNo))), [policyNo]);

  const activeIndex = Number.isFinite(recordIndex) && recordIndex >= 0 ? recordIndex : 0;
  const active = records[activeIndex] || records[0] || null;

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
              <div className="text-sm font-semibold text-slate-900">批单信息</div>
              <div className="mt-0.5 text-xs text-slate-500">保单号：{policyNo || '--'}</div>
            </div>
          </div>
          <div className="text-xs text-slate-500">共 {records.length} 条记录</div>
        </div>

        <div className="grid h-[calc(100vh-59px)] grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)]">
          <section className="border-r border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">批单时间线</div>
            {records.length === 0 ? (
              <div className="flex h-[calc(100%-49px)] items-center justify-center px-6 text-center text-sm text-slate-500">
                暂无批单记录
              </div>
            ) : (
              <div className="h-[calc(100%-49px)] overflow-y-auto p-4">
                <ol className="relative border-l border-slate-200 pl-4 space-y-4">
                  {records.map((item, index) => (
                    <li key={item.id} className="relative">
                      <span className={`absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full ${index === activeIndex ? 'bg-blue-600' : 'bg-slate-300'}`} />
                      <div className={`rounded-lg border p-3 ${index === activeIndex ? 'border-blue-200 bg-blue-50/60' : 'border-slate-200 bg-white'}`}>
                        <div className="text-xs text-slate-500">{item.time}</div>
                        <div className="mt-1 text-sm text-slate-800 line-clamp-2">{item.content}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>

          <section className="bg-white p-6 overflow-y-auto">
            {active ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">批单详情</h3>
                  <span className="inline-flex items-center gap-1 text-xs text-sky-500">
                    <ExternalLink className="h-3.5 w-3.5" /> 新标签页查看
                  </span>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500 mb-1">批改时间</div>
                  <div className="text-sm font-medium text-slate-900">{active.time}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500 mb-1">批改记录</div>
                  <div className="text-sm text-slate-800 whitespace-pre-wrap">{active.content}</div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">暂无批单详情</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
