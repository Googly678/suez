import React, { useState } from 'react';
import { ArrowRight, Fingerprint, Lock, ShieldCheck, User } from 'lucide-react';

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
  const logoSrc = `${import.meta.env.BASE_URL}sigreal-logo.svg`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06111d] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-[#20cfe0]/28 blur-3xl" />
        <div className="absolute right-[-120px] top-20 h-[380px] w-[380px] rounded-full bg-[#1ea7d7]/22 blur-3xl" />
        <div className="absolute bottom-[-160px] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#26d7e6]/14 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(31,41,55,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(31,41,55,0.25)_1px,transparent_1px)] bg-[size:34px_34px]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-5 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <section className="rounded-3xl border border-[#20cfe0]/25 bg-slate-900/45 p-6 shadow-[0_32px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#20cfe0]/40 bg-[#20cfe0]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#8de9f2]">
            <ShieldCheck className="h-3.5 w-3.5" />
            SIGREAL INSURANCE SUITE
          </div>

          <div className="mt-6 rounded-2xl border border-[#20cfe0]/25 bg-slate-950/65 p-4 sm:p-5">
            <img src={logoSrc} alt="SiGReal Tech" className="h-auto w-full object-contain" />
          </div>

          <h1 className="mt-8 text-3xl font-semibold leading-tight text-cyan-50 sm:text-4xl">理赔与权限协同中枢</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            将保单管理、理赔协助、公估理算、保司审核统一在同一工作台。
            面向总部-大区-分公司组织体系，提供精细化角色权限控制与全流程可追溯操作记录。
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {demoAccounts.map((account) => (
              <button
                key={account.username}
                type="button"
                onClick={() => setForm({ username: account.username, password: account.password })}
                className="group rounded-2xl border border-[#20cfe0]/20 bg-slate-900/70 px-4 py-3 text-left transition duration-300 hover:border-[#20cfe0]/55 hover:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-cyan-100">{account.realName}</div>
                  <ArrowRight className="h-4 w-4 text-[#7adfea]/60 transition group-hover:translate-x-0.5 group-hover:text-[#a5eff6]" />
                </div>
                <div className="mt-1 text-xs text-slate-400">{account.roleName}</div>
                <div className="mt-3 text-xs text-slate-300">账号：{account.username}</div>
                <div className="text-xs text-slate-300">密码：{account.password}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#20cfe0]/35 bg-slate-950/80 p-7 shadow-[0_24px_72px_rgba(32,207,224,0.2)] backdrop-blur-xl lg:p-9">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#20cfe0]/35 bg-[#20cfe0]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#9ceef5]">
            <Fingerprint className="h-3.5 w-3.5" />
            安全登录入口
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-cyan-50">欢迎使用 SiGReal 工作台</h2>
          <p className="mt-2 text-sm text-slate-400">请输入账号与密码，进入对应角色视图。</p>

          <form
            className="mt-7 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              onLogin(form);
            }}
          >
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">用户名</span>
              <div className="flex items-center rounded-2xl border border-[#20cfe0]/20 bg-slate-900/80 px-4 transition focus-within:border-[#20cfe0]/65">
                <User className="h-4 w-4 text-[#8be8f1]/85" />
                <input
                  value={form.username}
                  onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-500"
                  placeholder="请输入用户名"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">密码</span>
              <div className="flex items-center rounded-2xl border border-[#20cfe0]/20 bg-slate-900/80 px-4 transition focus-within:border-[#20cfe0]/65">
                <Lock className="h-4 w-4 text-[#8be8f1]/85" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-500"
                  placeholder="请输入密码"
                />
              </div>
            </label>

            {error ? <div className="rounded-xl border border-rose-400/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-[#20cfe0] to-[#1ea7d7] px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:from-[#3cdae8] hover:to-[#37bde2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '登录中...' : '登录并进入系统'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}