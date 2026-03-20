import React, { useEffect, useMemo, useState } from 'react';
import { KeyRound, Save, Shield, UserCog, Users } from 'lucide-react';

type PermissionItem = {
  code: string;
  name: string;
  module: string;
};

type RoleItem = {
  roleId: string;
  roleName: string;
  description: string;
  orgId: string;
  orgName: string;
  permissions: string[];
};

type UserItem = {
  userId: string;
  username: string;
  realName: string;
  email: string;
  orgId: string;
  orgName: string;
  roleId: string;
  roleName: string;
  status: string;
};

type OrganizationItem = {
  org_id: string;
  org_name: string;
};

export default function AccessControlManagement({
  roles,
  users,
  permissions,
  organizations,
  canManageRoles,
  canManageUsers,
  onCreateRole,
  onUpdateRole,
  onCreateUser,
  onUpdateUser,
}: {
  roles: RoleItem[];
  users: UserItem[];
  permissions: PermissionItem[];
  organizations: OrganizationItem[];
  canManageRoles: boolean;
  canManageUsers: boolean;
  onCreateRole: (payload: { roleName: string; description: string; orgId: string; permissions: string[] }) => Promise<void>;
  onUpdateRole: (roleId: string, payload: { roleName: string; description: string; orgId: string; permissions: string[] }) => Promise<void>;
  onCreateUser: (payload: { username: string; password: string; realName: string; email: string; orgId: string; roleId: string; status: string }) => Promise<void>;
  onUpdateUser: (userId: string, payload: { username: string; password: string; realName: string; email: string; orgId: string; roleId: string; status: string }) => Promise<void>;
}) {
  const [tab, setTab] = useState<'roles' | 'users'>('roles');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [roleDraft, setRoleDraft] = useState({ roleName: '', description: '', orgId: '', permissions: [] as string[] });
  const [userDraft, setUserDraft] = useState({ username: '', password: '123456', realName: '', email: '', orgId: '', roleId: '', status: 'active' });

  const selectedRole = roles.find((item) => item.roleId === selectedRoleId) || null;
  const selectedUser = users.find((item) => item.userId === selectedUserId) || null;
  const permissionsByModule = useMemo(() => {
    return permissions.reduce<Record<string, PermissionItem[]>>((acc, item) => {
      acc[item.module] = [...(acc[item.module] || []), item];
      return acc;
    }, {});
  }, [permissions]);

  useEffect(() => {
    if (selectedRole) {
      setRoleDraft({
        roleName: selectedRole.roleName,
        description: selectedRole.description,
        orgId: selectedRole.orgId,
        permissions: selectedRole.permissions,
      });
    } else {
      setRoleDraft({ roleName: '', description: '', orgId: '', permissions: [] });
    }
  }, [selectedRole]);

  useEffect(() => {
    if (selectedUser) {
      setUserDraft({
        username: selectedUser.username,
        password: '',
        realName: selectedUser.realName,
        email: selectedUser.email,
        orgId: selectedUser.orgId,
        roleId: selectedUser.roleId,
        status: selectedUser.status,
      });
    } else {
      setUserDraft({ username: '', password: '123456', realName: '', email: '', orgId: '', roleId: '', status: 'active' });
    }
  }, [selectedUser]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm inline-flex gap-2">
        <button
          type="button"
          onClick={() => setTab('roles')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === 'roles' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          角色权限
        </button>
        <button
          type="button"
          onClick={() => setTab('users')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          用户管理
        </button>
      </div>

      {tab === 'roles' ? (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <div className="text-base font-semibold text-slate-900">角色列表</div>
                <div className="mt-1 text-sm text-slate-500">按角色绑定可访问菜单与可执行动作</div>
              </div>
              <button
                type="button"
                disabled={!canManageRoles}
                onClick={() => setSelectedRoleId('')}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                新建角色
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {roles.map((role) => (
                <button
                  key={role.roleId}
                  type="button"
                  onClick={() => setSelectedRoleId(role.roleId)}
                  className={`w-full px-6 py-4 text-left transition ${selectedRoleId === role.roleId ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{role.roleName}</div>
                      <div className="mt-1 text-xs text-slate-500">{role.orgName || '未绑定机构'} · {role.permissions.length} 项权限</div>
                    </div>
                    <Shield className="h-4 w-4 text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <div className="text-base font-semibold text-slate-900">角色权限配置</div>
              <div className="mt-1 text-sm text-slate-500">可为角色勾选菜单访问和业务动作权限</div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">角色名称</span>
                  <input
                    value={roleDraft.roleName}
                    disabled={!canManageRoles}
                    onChange={(event) => setRoleDraft((prev) => ({ ...prev, roleName: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">所属机构</span>
                  <select
                    value={roleDraft.orgId}
                    disabled={!canManageRoles}
                    onChange={(event) => setRoleDraft((prev) => ({ ...prev, orgId: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                  >
                    <option value="">请选择机构</option>
                    {organizations.map((item) => (
                      <option key={item.org_id} value={item.org_id}>{item.org_name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">角色说明</span>
                <textarea
                  rows={3}
                  value={roleDraft.description}
                  disabled={!canManageRoles}
                  onChange={(event) => setRoleDraft((prev) => ({ ...prev, description: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(permissionsByModule).map(([moduleName, modulePermissions]) => (
                  <div key={moduleName} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <KeyRound className="h-4 w-4 text-blue-600" />
                      {moduleName}
                    </div>
                    <div className="space-y-2">
                      {modulePermissions.map((permission) => (
                        <label key={permission.code} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={roleDraft.permissions.includes(permission.code)}
                            disabled={!canManageRoles}
                            onChange={(event) => {
                              setRoleDraft((prev) => ({
                                ...prev,
                                permissions: event.target.checked
                                  ? [...prev.permissions, permission.code]
                                  : prev.permissions.filter((item) => item !== permission.code),
                              }));
                            }}
                          />
                          <span>{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!canManageRoles}
                  onClick={async () => {
                    if (selectedRoleId) {
                      await onUpdateRole(selectedRoleId, roleDraft);
                    } else {
                      await onCreateRole(roleDraft);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {selectedRoleId ? '保存角色' : '创建角色'}
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <div className="text-base font-semibold text-slate-900">用户列表</div>
                <div className="mt-1 text-sm text-slate-500">为用户分配机构、角色并控制状态</div>
              </div>
              <button
                type="button"
                disabled={!canManageUsers}
                onClick={() => setSelectedUserId('')}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                新建用户
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {users.map((user) => (
                <button
                  key={user.userId}
                  type="button"
                  onClick={() => setSelectedUserId(user.userId)}
                  className={`w-full px-6 py-4 text-left transition ${selectedUserId === user.userId ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{user.realName}</div>
                      <div className="mt-1 text-xs text-slate-500">{user.username} · {user.roleName} · {user.orgName}</div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {user.status === 'active' ? '启用' : '停用'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <div className="text-base font-semibold text-slate-900">用户维护</div>
              <div className="mt-1 text-sm text-slate-500">绑定用户所属机构和角色，前后端统一按角色权限控制功能</div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">姓名</span>
                  <input
                    value={userDraft.realName}
                    disabled={!canManageUsers}
                    onChange={(event) => setUserDraft((prev) => ({ ...prev, realName: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">用户名</span>
                  <input
                    value={userDraft.username}
                    disabled={!canManageUsers}
                    onChange={(event) => setUserDraft((prev) => ({ ...prev, username: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">邮箱</span>
                  <input
                    value={userDraft.email}
                    disabled={!canManageUsers}
                    onChange={(event) => setUserDraft((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">密码</span>
                  <input
                    type="password"
                    value={userDraft.password}
                    disabled={!canManageUsers}
                    onChange={(event) => setUserDraft((prev) => ({ ...prev, password: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                    placeholder={selectedUserId ? '留空则保持不变' : '默认 123456'}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">所属机构</span>
                  <select
                    value={userDraft.orgId}
                    disabled={!canManageUsers}
                    onChange={(event) => setUserDraft((prev) => ({ ...prev, orgId: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                  >
                    <option value="">请选择机构</option>
                    {organizations.map((item) => (
                      <option key={item.org_id} value={item.org_id}>{item.org_name}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-500">角色</span>
                  <select
                    value={userDraft.roleId}
                    disabled={!canManageUsers}
                    onChange={(event) => setUserDraft((prev) => ({ ...prev, roleId: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50"
                  >
                    <option value="">请选择角色</option>
                    {roles.map((item) => (
                      <option key={item.roleId} value={item.roleId}>{item.roleName}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">角色即权限集合</div>
                    <div className="text-xs text-slate-500">用户登录后，菜单显隐和关键操作权限将自动根据所选角色生效。</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!canManageUsers}
                  onClick={async () => {
                    if (selectedUserId) {
                      await onUpdateUser(selectedUserId, userDraft);
                    } else {
                      await onCreateUser(userDraft);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UserCog className="h-4 w-4" />
                  {selectedUserId ? '保存用户' : '创建用户'}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}