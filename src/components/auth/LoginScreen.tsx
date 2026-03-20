import React, { useState } from 'react';
import { Building2, Lock, User } from 'lucide-react';

type DemoAccount = {
  username: string;
  password: string;
  roleName: string;
  realName: string;
};

export default function LoginScreen({
  demoAccounts,
  onLogin,
  loading,
  error,
}: {
  demoAccounts: DemoAccount[];
  onLogin: (payload: { username: string; password: string }) => void;
  loading: boolean;
  error: string;
}) {
  const [form, setForm] = useState({ username: demoAccounts[0]?.username || 'admin', password: demoAccounts[0]?.password || '123456' });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_34%),linear-gradient(135deg,_#e2e8f0,_#f8fafc_45%,_#dbeafe)] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_30px_80px_rgba(15,23,42,0.16)] p-10 lg:p-14">
          <div className="inline-flex items-center gap-3 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <Building2 className="h-4 w-4" />
            Suez 综合业务工作台
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">三级机构与角色权限管理已接入</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            当前版本支持总部-大区-分公司三级机构树、角色权限编排、用户角色分配，以及前后端统一的权限控制。请使用右侧演示账号登录体验不同角色视角。
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {demoAccounts.map((account) => (
              <button
                key={account.username}
                type="button"
                onClick={() => setForm({ username: account.username, password: account.password })}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="text-sm font-semibold text-slate-900">{account.realName}</div>
                <div className="mt-1 text-xs text-slate-500">{account.roleName}</div>
                <div className="mt-3 text-xs text-slate-600">账号：{account.username}</div>
                <div className="text-xs text-slate-600">密码：{account.password}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] p-8 lg:p-10">
          <div className="text-sm uppercase tracking-[0.24em] text-blue-300">登录系统</div>
          <h2 className="mt-3 text-2xl font-semibold">基于角色的权限访问</h2>

          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              onLogin(form);
            }}
          >
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">用户名</span>
              <div className="flex items-center rounded-2xl border border-slate-800 bg-slate-900 px-4">
                <User className="h-4 w-4 text-slate-500" />
                <input
                  value={form.username}
                  onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                  className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none"
                  placeholder="请输入用户名"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">密码</span>
              <div className="flex items-center rounded-2xl border border-slate-800 bg-slate-900 px-4">
                <Lock className="h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none"
                  placeholder="请输入密码"
                />
              </div>
            </label>

            {error ? <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-blue-500 px-4 py-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '登录中...' : '登录并进入系统'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}