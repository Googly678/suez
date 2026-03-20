import React, { useEffect, useMemo, useState } from 'react';
import { Building2, GitBranch, Plus, Save } from 'lucide-react';

type Organization = {
  org_id: string;
  org_code: string;
  org_name: string;
  parent_org_id: string | null;
  org_level: number;
  leader_name: string;
  children?: Organization[];
};

function flattenOrganizations(tree: Organization[], level = 0): Array<Organization & { indentLevel: number }> {
  return tree.flatMap((item) => [
    { ...item, indentLevel: level },
    ...flattenOrganizations(item.children || [], level + 1),
  ]);
}

export default function OrganizationManagement({
  tree,
  canManage,
  onCreate,
  onUpdate,
}: {
  tree: Organization[];
  canManage: boolean;
  onCreate: (payload: { orgCode: string; orgName: string; parentOrgId: string; leaderName: string }) => Promise<void>;
  onUpdate: (orgId: string, payload: { orgCode: string; orgName: string; parentOrgId: string; leaderName: string }) => Promise<void>;
}) {
  const flatOrganizations = useMemo(() => flattenOrganizations(tree), [tree]);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [draft, setDraft] = useState({ orgCode: '', orgName: '', parentOrgId: '', leaderName: '' });

  const selectedOrg = flatOrganizations.find((item) => item.org_id === selectedOrgId) || null;

  useEffect(() => {
    if (selectedOrg) {
      setDraft({
        orgCode: selectedOrg.org_code,
        orgName: selectedOrg.org_name,
        parentOrgId: selectedOrg.parent_org_id || '',
        leaderName: selectedOrg.leader_name || '',
      });
      return;
    }

    setDraft({ orgCode: '', orgName: '', parentOrgId: '', leaderName: '' });
  }, [selectedOrg]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <div className="text-base font-semibold text-slate-900">三级机构树</div>
            <div className="mt-1 text-sm text-slate-500">支持总部、大区、分公司三级组织结构</div>
          </div>
          <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">共 {flatOrganizations.length} 个机构</div>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {flatOrganizations.map((item) => {
              const isSelected = item.org_id === selectedOrgId;
              return (
                <button
                  key={item.org_id}
                  type="button"
                  onClick={() => setSelectedOrgId(item.org_id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${isSelected ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
                  style={{ paddingLeft: `${16 + item.indentLevel * 24}px` }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-slate-400" />
                      <span className="truncate text-sm font-medium text-slate-900">{item.org_name}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{item.org_code} · 第 {item.org_level} 级机构</div>
                  </div>
                  <span className="text-xs text-slate-400">负责人：{item.leader_name || '--'}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <div className="text-base font-semibold text-slate-900">机构维护</div>
            <div className="mt-1 text-sm text-slate-500">可新增下级机构，或维护已选机构基本信息</div>
          </div>
          <button
            type="button"
            disabled={!canManage}
            onClick={() => setSelectedOrgId('')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            新建机构
          </button>
        </div>

        <div className="p-6 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">机构编码</span>
              <input
                value={draft.orgCode}
                disabled={!canManage}
                onChange={(event) => setDraft((prev) => ({ ...prev, orgCode: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                placeholder="例如 REG-SOUTH"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">机构名称</span>
              <input
                value={draft.orgName}
                disabled={!canManage}
                onChange={(event) => setDraft((prev) => ({ ...prev, orgName: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                placeholder="请输入机构名称"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">上级机构</span>
              <select
                value={draft.parentOrgId}
                disabled={!canManage}
                onChange={(event) => setDraft((prev) => ({ ...prev, parentOrgId: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
              >
                <option value="">无上级机构（一级）</option>
                {flatOrganizations
                  .filter((item) => item.org_id !== selectedOrgId && item.org_level < 3)
                  .map((item) => (
                    <option key={item.org_id} value={item.org_id}>
                      {item.org_name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">负责人</span>
              <input
                value={draft.leaderName}
                disabled={!canManage}
                onChange={(event) => setDraft((prev) => ({ ...prev, leaderName: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                placeholder="请输入负责人姓名"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">机构层级约束</div>
                <div className="text-xs text-slate-500">后端会校验层级最多为三级，不能将分公司继续挂到分公司之下。</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              disabled={!canManage}
              onClick={async () => {
                if (selectedOrgId) {
                  await onUpdate(selectedOrgId, draft);
                } else {
                  await onCreate(draft);
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {selectedOrgId ? '保存机构' : '创建机构'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}