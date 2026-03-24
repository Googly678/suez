import React from 'react';
import {
  Plus,
  ChevronDown,
  MoreHorizontal,
  ChevronLeft,
  ClipboardList,
  Users,
  Save,
  Send,
  FileText,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface CustomerManagementViewProps {
  selectedCustomer: any;
  customerFilter: any;
  setCustomerFilter: React.Dispatch<React.SetStateAction<any>>;
  filteredCustomers: any[];
  locationData: Record<string, Record<string, string[]>>;
  purchaseData: any[];
  renewalData: any[];
  riskData: any[];
  riskColors: string[];
  onSelectCustomer: (customer: any) => void;
  onOpenAddCustomer: () => void;
  canManage?: boolean;
}

export function CustomerManagementView({
  selectedCustomer,
  customerFilter,
  setCustomerFilter,
  filteredCustomers,
  locationData,
  purchaseData,
  renewalData,
  riskData,
  riskColors,
  onSelectCustomer,
  onOpenAddCustomer,
  canManage = false,
}: CustomerManagementViewProps) {
  const [draftCustomerFilter, setDraftCustomerFilter] = React.useState(customerFilter);

  React.useEffect(() => {
    setDraftCustomerFilter(customerFilter);
  }, [customerFilter]);

  const handleApplyCustomerFilter = () => {
    setCustomerFilter(draftCustomerFilter);
  };

  const handleResetCustomerFilter = () => {
    const emptyFilter = {
      search: '',
      businessLine: '',
      province: '',
      city: '',
      district: '',
      industry: '',
      scale: '',
    };
    setDraftCustomerFilter(emptyFilter);
    setCustomerFilter(emptyFilter);
  };

  const filteredCustomerCount = filteredCustomers.length;
  const customerStartDisplay = filteredCustomerCount === 0 ? 0 : 1;
  const customerEndDisplay = filteredCustomerCount;

  return selectedCustomer ? (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
      <div className="mb-8 flex items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              {selectedCustomer.industry}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-mono">ID: {selectedCustomer.id}</p>
        </div>
      </div>

      <div className="space-y-12 pb-12">
        <section>
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
            客户基本信息
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-sm text-slate-500 mb-1">属地</div>
              <div className="text-base text-slate-900 font-medium">{selectedCustomer.location}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">规模</div>
              <div className="text-base text-slate-900 font-medium">{selectedCustomer.scale}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">关键联系人</div>
              <div className="text-base text-slate-900 font-medium">{selectedCustomer.contact}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">联系方式</div>
              <div className="text-base text-slate-900 font-mono">{selectedCustomer.phone}</div>
            </div>
            <div className="col-span-2 md:col-span-4">
              <div className="text-sm text-slate-500 mb-1">企业简介</div>
              <div className="text-sm text-slate-700 leading-relaxed">
                {selectedCustomer.name}是行业领先的{selectedCustomer.industry}企业，致力于提供高质量的服务与产品。近年来在数字化转型和智能化升级方面持续投入，与我司在多个领域保持着紧密的合作关系。
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-100"></div>

        <section>
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
            客户购买情况
          </h3>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-1/3 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                该客户自2023年起与我司建立合作关系，采购量呈逐年上升趋势。主要采购产品包括智能双视摄像头、DMS驾驶员监控摄像头等。
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <div className="text-2xl font-light text-slate-900">¥860万</div>
                  <div className="text-xs text-slate-500 mt-1">累计采购金额</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-slate-900">12单</div>
                  <div className="text-xs text-slate-500 mt-1">历史订单总数</div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-2/3 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={purchaseData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `¥${value}万`} />
                  <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="采购金额(万元)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-100"></div>

        <section>
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
            客户续约情况
          </h3>
          <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
            <div className="w-full lg:w-1/3 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                客户续约意愿强烈，近半年来续约率保持在85%以上，且呈现稳步增长态势。建议在下个续约周期提前介入，提供更多增值服务选项。
              </p>
              <div className="pt-4">
                <div className="text-3xl font-light text-emerald-600">96%</div>
                <div className="text-xs text-slate-500 mt-1">最新月度续约率</div>
              </div>
            </div>
            <div className="w-full lg:w-2/3 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={renewalData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" name="续约率" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-100"></div>

        <section>
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
            客户风险分析
          </h3>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/3 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={riskColors[index % riskColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {riskData.map((risk, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: riskColors[index % riskColors.length] }}></div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{risk.name} ({risk.value}%)</div>
                      <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {risk.name === '安全风险' && '系统运行稳定，安全风险处于可控范围，占比最大表示系统处于健康状态。'}
                        {risk.name === '财务风险' && '回款周期略有延长，建议财务部门跟进本季度账单结算进度。'}
                        {risk.name === '流失风险' && '近期有竞品接触客户，需销售团队加强客情维护。'}
                        {risk.name === '合规风险' && '资质文件均在有效期内，无明显合规问题。'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  ) : (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-6">
        <button
          onClick={onOpenAddCustomer}
          disabled={!canManage}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          新增客户
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex flex-wrap gap-x-6 gap-y-5">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">综合搜索</label>
            <input
              type="text"
              placeholder="名称/营业执照/唯一码"
              value={draftCustomerFilter.search}
              onChange={(event) => setDraftCustomerFilter({ ...draftCustomerFilter, search: event.target.value })}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1.5 flex-1 min-w-[280px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">属地</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={draftCustomerFilter.province}
                  onChange={(event) => setDraftCustomerFilter({ ...draftCustomerFilter, province: event.target.value, city: '', district: '' })}
                  className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="">省份</option>
                  {Object.keys(locationData).map((province) => <option key={province} value={province}>{province}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <select
                  value={draftCustomerFilter.city}
                  onChange={(event) => setDraftCustomerFilter({ ...draftCustomerFilter, city: event.target.value, district: '' })}
                  disabled={!draftCustomerFilter.province}
                  className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer disabled:bg-slate-50"
                >
                  <option value="">城市</option>
                  {draftCustomerFilter.province && Object.keys(locationData[draftCustomerFilter.province] || {}).map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <select
                  value={draftCustomerFilter.district}
                  onChange={(event) => setDraftCustomerFilter({ ...draftCustomerFilter, district: event.target.value })}
                  disabled={!draftCustomerFilter.city}
                  className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer disabled:bg-slate-50"
                >
                  <option value="">区县</option>
                  {draftCustomerFilter.province && draftCustomerFilter.city && locationData[draftCustomerFilter.province][draftCustomerFilter.city]?.map((district) => <option key={district} value={district}>{district}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[150px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">行业</label>
            <div className="relative">
              <select
                value={draftCustomerFilter.industry}
                onChange={(event) => setDraftCustomerFilter({ ...draftCustomerFilter, industry: event.target.value })}
                className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="">全部行业</option>
                <option value="物流运输">物流运输</option>
                <option value="网约车">网约车</option>
                <option value="公共交通">公共交通</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[150px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">规模(员工人数)</label>
            <div className="relative">
              <select
                value={draftCustomerFilter.scale}
                onChange={(event) => setDraftCustomerFilter({ ...draftCustomerFilter, scale: event.target.value })}
                className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="">全部规模</option>
                <option value="0-50人">0-50人</option>
                <option value="50-200人">50-200人</option>
                <option value="200-1000人">200-1000人</option>
                <option value="1000人以上">1000人以上</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-end gap-2 min-w-[220px]">
            <button
              type="button"
              onClick={handleApplyCustomerFilter}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              查询
            </button>
            <button
              type="button"
              onClick={handleResetCustomerFilter}
              className="px-4 py-1.5 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors"
            >
              重置
            </button>
          </div>
        </div>

      </div>

      <div className="flex flex-col">
        <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-y border-slate-200 text-xs uppercase tracking-wider text-slate-600 font-semibold">
                <th className="px-4 py-3">客户编码</th>
                <th className="px-4 py-3">客户名称</th>
                <th className="px-4 py-3">业务线</th>
                <th className="px-4 py-3">属地</th>
                <th className="px-4 py-3">行业</th>
                <th className="px-4 py-3">规模</th>
                <th className="px-4 py-3">关键联系人</th>
                <th className="px-4 py-3">联系方式</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCustomers.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onSelectCustomer(row)}>
                  <td className="px-4 py-3 font-mono text-slate-600 text-xs">{row.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.businessLine === '商用车' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      row.businessLine === '保险代理' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {row.businessLine}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.location}</td>
                  <td className="px-4 py-3 text-slate-600">{row.industry}</td>
                  <td className="px-4 py-3 text-slate-600">{row.scale}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{row.contact}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="py-4 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            显示 <span className="font-medium text-slate-900">{customerStartDisplay}</span> 至 <span className="font-medium text-slate-900">{customerEndDisplay}</span> 条，共 <span className="font-medium text-slate-900">{filteredCustomerCount}</span> 条数据
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>上一页</button>
            <button className="px-3 py-1 border border-slate-900 bg-slate-900 rounded text-sm text-white">1</button>
            <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>下一页</button>
          </div>
        </div>
      </div>
    </>
  );
}

interface OpportunityManagementViewProps {
  opportunityFilter: any;
  setOpportunityFilter: React.Dispatch<React.SetStateAction<any>>;
  filteredOpportunities: any[];
  onOpenAddOpportunity: () => void;
  canManage?: boolean;
}

export function OpportunityManagementView({
  opportunityFilter,
  setOpportunityFilter,
  filteredOpportunities,
  onOpenAddOpportunity,
  canManage = false,
}: OpportunityManagementViewProps) {
  const [draftOpportunityFilter, setDraftOpportunityFilter] = React.useState(opportunityFilter);

  React.useEffect(() => {
    setDraftOpportunityFilter(opportunityFilter);
  }, [opportunityFilter]);

  const handleApplyOpportunityFilter = () => {
    setOpportunityFilter(draftOpportunityFilter);
  };

  const handleResetOpportunityFilter = () => {
    const emptyFilter = { search: '', status: '', type: '', source: '' };
    setDraftOpportunityFilter(emptyFilter);
    setOpportunityFilter(emptyFilter);
  };

  const filteredOpportunityCount = filteredOpportunities.length;
  const opportunityStartDisplay = filteredOpportunityCount === 0 ? 0 : 1;
  const opportunityEndDisplay = filteredOpportunityCount;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-6">
        <button
          onClick={onOpenAddOpportunity}
          disabled={!canManage}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          新增商机
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex flex-wrap gap-x-6 gap-y-5">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">综合搜索</label>
            <input
              type="text"
              placeholder="商机名称/联系人"
              value={draftOpportunityFilter.search}
              onChange={(event) => setDraftOpportunityFilter({ ...draftOpportunityFilter, search: event.target.value })}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1.5 flex-1 min-w-[150px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">商机状态</label>
            <div className="relative">
              <select
                value={draftOpportunityFilter.status}
                onChange={(event) => setDraftOpportunityFilter({ ...draftOpportunityFilter, status: event.target.value })}
                className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="">全部状态</option>
                <option value="新增">新增</option>
                <option value="处理中">处理中</option>
                <option value="跟进中">跟进中</option>
                <option value="已成单">已成单</option>
                <option value="未成单">未成单</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[150px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">客户类型</label>
            <div className="relative">
              <select
                value={draftOpportunityFilter.type || ''}
                onChange={(event) => setDraftOpportunityFilter({ ...draftOpportunityFilter, type: event.target.value })}
                className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="">全部类型</option>
                <option value="库内客户">库内客户</option>
                <option value="库外客户">库外客户</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[150px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">商机来源</label>
            <div className="relative">
              <select
                value={draftOpportunityFilter.source || ''}
                onChange={(event) => setDraftOpportunityFilter({ ...draftOpportunityFilter, source: event.target.value })}
                className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="">全部来源</option>
                <option value="主动开发">主动开发</option>
                <option value="老客户复购">老客户复购</option>
                <option value="展会获取">展会获取</option>
                <option value="招投标">招投标</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-end gap-2 min-w-[220px]">
            <button
              type="button"
              onClick={handleApplyOpportunityFilter}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              查询
            </button>
            <button
              type="button"
              onClick={handleResetOpportunityFilter}
              className="px-4 py-1.5 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors"
            >
              重置
            </button>
          </div>
        </div>

      </div>

      <div className="flex flex-col">
        <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-y border-slate-200 text-xs uppercase tracking-wider text-slate-600 font-semibold">
                <th className="px-4 py-3">商机编号</th>
                <th className="px-4 py-3">商机名称</th>
                <th className="px-4 py-3">客户类型</th>
                <th className="px-4 py-3">商机来源</th>
                <th className="px-4 py-3">商机价值</th>
                <th className="px-4 py-3">联系人</th>
                <th className="px-4 py-3">联系方式</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredOpportunities.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{row.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      row.type === '库内客户' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.source}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">{row.value}</td>
                  <td className="px-4 py-3 text-slate-800">{row.contact}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.status === '已成单' ? 'bg-emerald-100 text-emerald-700' :
                      row.status === '未成单' ? 'bg-rose-100 text-rose-700' :
                      row.status === '新增' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {row.status === '新增' && <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">领取</button>}
                      {(row.status === '处理中' || row.status === '跟进中') && <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">处理</button>}
                      {(row.status === '处理中' || row.status === '跟进中') && <button className="text-xs text-slate-600 hover:text-slate-800 font-medium">转交</button>}
                      {row.status === '已成单' && <button className="text-xs text-emerald-600 hover:text-emerald-800 font-medium">申请合同</button>}
                      <button className="text-slate-400 hover:text-slate-900 transition-colors p-1 rounded hover:bg-slate-100" title="更多操作">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="py-4 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            显示 <span className="font-medium text-slate-900">{opportunityStartDisplay}</span> 至 <span className="font-medium text-slate-900">{opportunityEndDisplay}</span> 条，共 <span className="font-medium text-slate-900">{filteredOpportunityCount}</span> 条数据
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>上一页</button>
            <button className="px-3 py-1 border border-slate-900 bg-slate-900 rounded text-sm text-white">1</button>
            <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>下一页</button>
          </div>
        </div>
      </div>
    </>
  );
}

interface OrderManagementViewProps {
  selectedOrderForDetail: any;
  setSelectedOrderForDetail: React.Dispatch<React.SetStateAction<any>>;
  orderDetailEdit: any;
  setOrderDetailEdit: React.Dispatch<React.SetStateAction<any>>;
  orderFilter: any;
  setOrderFilter: React.Dispatch<React.SetStateAction<any>>;
  filteredOrders: any[];
  locationData: Record<string, Record<string, string[]>>;
  onOpenAddOrder: () => void;
  onOpenAttachmentViewer: (inquiryNo: string) => void;
  onSaveOrderDraft: (order: any) => void;
  onShowInquiryConfirm: () => void;
  onClaimOrder: (order: any) => void;
  submittedInquiries?: Record<string, any>;
  canManage?: boolean;
  canCreateClaim?: boolean;
}

export function OrderManagementView({
  selectedOrderForDetail,
  setSelectedOrderForDetail,
  orderDetailEdit,
  setOrderDetailEdit,
  orderFilter,
  setOrderFilter,
  filteredOrders,
  locationData,
  onOpenAddOrder,
  onOpenAttachmentViewer,
  onSaveOrderDraft,
  onShowInquiryConfirm,
  onClaimOrder,
  submittedInquiries = {},
  canManage = false,
  canCreateClaim = false,
}: OrderManagementViewProps) {
  const isNewOrder = Boolean(selectedOrderForDetail?.isNew);
  const [draftOrderFilter, setDraftOrderFilter] = React.useState(orderFilter);

  React.useEffect(() => {
    setDraftOrderFilter(orderFilter);
  }, [orderFilter]);

  const updateSelectedOrder = (patch: Record<string, any>) => {
    setSelectedOrderForDetail((prev: any) => ({ ...prev, ...patch }));
  };
  const selectedProvince = selectedOrderForDetail?.province || '';
  const selectedCity = selectedOrderForDetail?.city || '';
  const availableCities = selectedProvince ? Object.keys(locationData[selectedProvince] || {}) : [];
  const availableDistricts = selectedProvince && selectedCity ? locationData[selectedProvince]?.[selectedCity] || [] : [];
  const inquiryResult = submittedInquiries[selectedOrderForDetail?.id || ''];
  const inquiryFormData = inquiryResult?.formData;
  const requiredFieldsComplete = Boolean(
    selectedOrderForDetail?.customer &&
      selectedOrderForDetail?.province &&
      selectedOrderForDetail?.city &&
      selectedOrderForDetail?.district &&
      selectedOrderForDetail?.industry &&
      selectedOrderForDetail?.contact &&
      selectedOrderForDetail?.phone,
  );

  const renderReadonlyValue = (value: any, suffix = '') => {
    if (value === undefined || value === null || value === '' || value === '0') {
      return '待客户填写';
    }

    return `${value}${suffix}`;
  };

  const summarizeCheckedItems = (items: Array<{ name: string; checked: boolean; ratio: string }>) => {
    const selectedItems = (items || []).filter((item) => item.checked);
    if (selectedItems.length === 0) {
      return '待客户填写';
    }

    return selectedItems
      .map((item) => `${item.name}${item.ratio && item.ratio !== '0' ? ` ${item.ratio}%` : ''}`)
      .join('；');
  };

  const summarizeToggleGroups = (items: Array<{ key: string; label: string; revenueKey?: string }>) => {
    if (!inquiryFormData) {
      return '待客户填写';
    }

    const selectedItems = items
      .filter((item) => inquiryFormData[item.key])
      .map((item) => {
        const revenueValue = item.revenueKey ? inquiryFormData[item.revenueKey] : '';
        return `${item.label}${revenueValue && revenueValue !== '0' ? `（${revenueValue}万元）` : ''}`;
      });

    return selectedItems.length > 0 ? selectedItems.join('；') : '待客户填写';
  };

  const handleApplyOrderFilter = () => {
    setOrderFilter(draftOrderFilter);
  };

  const handleResetOrderFilter = () => {
    const emptyFilter = { search: '', status: '', source: '' };
    setDraftOrderFilter(emptyFilter);
    setOrderFilter(emptyFilter);
  };

  const filteredOrderCount = filteredOrders.length;
  const startDisplay = filteredOrderCount === 0 ? 0 : 1;
  const endDisplay = filteredOrderCount;

  const openPolicyAttachment = (policyNo: string) => {
    if (!policyNo) return;
    const url = new URL(window.location.href);
    url.searchParams.set('page', 'policy-attachments');
    url.searchParams.set('policyNo', policyNo);
    window.open(url.toString(), '_blank');
  };

  return (
    <>
      {!selectedOrderForDetail && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-6">
          <button
            onClick={onOpenAddOrder}
            disabled={!canManage}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            新增询价单
          </button>
        </div>
      )}

      {selectedOrderForDetail ? (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full relative">
          <div className="mb-3 flex items-center gap-1 border-b border-slate-200 bg-white px-3 py-2">
            <button
              type="button"
              onClick={() => setSelectedOrderForDetail(null)}
              className="rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
            >
              询价单列表
            </button>
            <button
              type="button"
              className="rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-900"
            >
              {isNewOrder ? '新增询价单' : selectedOrderForDetail.id}
            </button>
          </div>

          <div className="sticky top-0 -mx-6 -mt-6 lg:-mx-8 lg:-mt-6 pt-6 px-6 lg:px-8 bg-slate-50 z-40 pb-3">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-3 flex items-center justify-between gap-6">
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => setSelectedOrderForDetail(null)} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors shrink-0">
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">询价单编号</div>
                  <div className="text-sm font-bold text-slate-900 truncate">{selectedOrderForDetail.id}</div>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

              <div className="hidden md:grid grid-cols-3 gap-x-8 gap-y-1 flex-1">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">合同名称</div>
                  <div className="text-xs font-medium text-slate-900 truncate">{selectedOrderForDetail.contract || '--'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">客户名称</div>
                  <div className="text-xs font-medium text-slate-900 truncate">{selectedOrderForDetail.customer || '--'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">订单来源</div>
                  <div className="text-xs font-medium text-slate-900 truncate">{selectedOrderForDetail.source}</div>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200 hidden lg:block"></div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">保单号</div>
                  <div className="text-sm font-mono font-bold text-blue-600">{selectedOrderForDetail.policyNo || '--'}</div>
                  <button
                    type="button"
                    onClick={() => openPolicyAttachment(selectedOrderForDetail.policyNo || '')}
                    className="mt-1 text-xs text-sky-500 hover:text-sky-600 underline underline-offset-2"
                  >
                    保单文本链接
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 items-start flex-1 mt-4">
            <div className="flex-1 space-y-6 pb-24">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      客户基本信息
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">新建询价单阶段仅允许维护客户主数据，客户代码在发送问询单后自动生成。</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">客户代码</div>
                    <div className="mt-1 text-sm font-mono font-semibold text-slate-900">{selectedOrderForDetail.customerCode || '发送后自动生成'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">客户名称</div>
                    <input
                      type="text"
                      value={selectedOrderForDetail.customer || ''}
                      onChange={(event) => updateSelectedOrder({ customer: event.target.value })}
                      placeholder="请输入客户名称"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">客户行业</div>
                    <select
                      value={selectedOrderForDetail.industry || ''}
                      onChange={(event) => updateSelectedOrder({ industry: event.target.value })}
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="">请选择行业</option>
                      <option value="物流运输">物流运输</option>
                      <option value="网约车">网约车</option>
                      <option value="公共交通">公共交通</option>
                      <option value="制造业">制造业</option>
                      <option value="商贸流通">商贸流通</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">联系人</div>
                    <input
                      type="text"
                      value={selectedOrderForDetail.contact || ''}
                      onChange={(event) => updateSelectedOrder({ contact: event.target.value })}
                      placeholder="请输入联系人"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">联系电话</div>
                    <input
                      type="text"
                      value={selectedOrderForDetail.phone || ''}
                      onChange={(event) => updateSelectedOrder({ phone: event.target.value })}
                      placeholder="请输入联系电话"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2 xl:col-span-2">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">客户属地</div>
                    <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <select
                        value={selectedProvince}
                        onChange={(event) =>
                          updateSelectedOrder({
                            province: event.target.value,
                            city: '',
                            district: '',
                          })
                        }
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="">请选择省份</option>
                        {Object.keys(locationData).map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedCity}
                        onChange={(event) =>
                          updateSelectedOrder({
                            city: event.target.value,
                            district: '',
                          })
                        }
                        disabled={!selectedProvince}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                      >
                        <option value="">请选择城市</option>
                        {availableCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedOrderForDetail.district || ''}
                        onChange={(event) => updateSelectedOrder({ district: event.target.value })}
                        disabled={!selectedCity}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                      >
                        <option value="">请选择区县</option>
                        {availableDistricts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 px-5 py-4 bg-slate-50/80">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    客户问询回填信息
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">以下内容与客户问询表单一致，本页面仅展示回填结果，不允许销售侧录入。</p>
                </div>

                <div className="divide-y divide-slate-200">
                  <section className="p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">01</div>
                        <h4 className="mt-1 text-sm font-semibold text-slate-900">投保人/被保险人基本信息</h4>
                      </div>
                      <span className="text-xs text-slate-500">由客户填写后回写</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">企业名称</div>
                        <div className="mt-1 font-medium text-slate-900">{renderReadonlyValue(inquiryFormData?.companyName)}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">在职员工人数</div>
                        <div className="mt-1 font-medium text-slate-900">{renderReadonlyValue(inquiryFormData?.employeeCount, '人')}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">自有车辆数</div>
                        <div className="mt-1 font-medium text-slate-900">{renderReadonlyValue(inquiryFormData?.ownVehicleCount, '辆')}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">上年度营业收入</div>
                        <div className="mt-1 font-medium text-slate-900">{renderReadonlyValue(inquiryFormData?.lastYearRevenue, '万元')}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2 xl:col-span-4">
                        <div className="text-xs text-slate-500">预计保险区间内营业收入</div>
                        <div className="mt-1 font-medium text-slate-900">{renderReadonlyValue(inquiryFormData?.expectedRevenue, '万元')}</div>
                      </div>
                    </div>
                  </section>

                  <section className="p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">02</div>
                        <h4 className="mt-1 text-sm font-semibold text-slate-900">核心保险需求</h4>
                      </div>
                      <span className="text-xs text-slate-500">由客户填写后回写</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">每次事故赔偿限额</div>
                        <div className="mt-1 font-medium text-slate-900">{renderReadonlyValue(inquiryFormData?.singleLimit, '万元')}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">预计起保日期</div>
                        <div className="mt-1 font-medium text-slate-900">{renderReadonlyValue(inquiryFormData?.startDate)}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2 xl:col-span-2">
                        <div className="text-xs text-slate-500">扩展责任</div>
                        <div className="mt-1 font-medium text-slate-900">
                          {summarizeToggleGroups([
                            { key: 'expandCold', label: '冷藏运输', revenueKey: 'coldRevenue' },
                            { key: 'expandXinjiang', label: '新疆地区承保', revenueKey: 'xinjiangRevenue' },
                            { key: 'expandQinghai', label: '青海地区承保', revenueKey: 'qinghaiRevenue' },
                            { key: 'expandTibet', label: '西藏地区承保', revenueKey: 'tibetRevenue' },
                            { key: 'expandSpecialVehicle', label: '临牌/超牌/不可拆卸货物车型' },
                          ])}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2 xl:col-span-4">
                        <div className="text-xs text-slate-500">其他保险需求</div>
                        <div className="mt-1 font-medium text-slate-900 whitespace-pre-wrap">{renderReadonlyValue(inquiryFormData?.otherNeeds)}</div>
                      </div>
                    </div>
                  </section>

                  <section className="p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">03</div>
                        <h4 className="mt-1 text-sm font-semibold text-slate-900">被保险人经营情况</h4>
                      </div>
                      <span className="text-xs text-slate-500">由客户填写后回写</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">托运人结构</div>
                        <div className="mt-1 font-medium text-slate-900">{summarizeCheckedItems(inquiryFormData?.shippers || [])}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">承托人结构</div>
                        <div className="mt-1 font-medium text-slate-900">{summarizeCheckedItems(inquiryFormData?.carriers || [])}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">集装箱/箱式货车业务占比</div>
                        <div className="mt-1 font-medium text-slate-900">{renderReadonlyValue(inquiryFormData?.boxTruckRatio, '%')}</div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">运输货物品类</div>
                        <div className="mt-1 font-medium text-slate-900">
                          {summarizeToggleGroups([
                            { key: 'fragile', label: '易碎品', revenueKey: 'fragileRevenue' },
                            { key: 'autoParts', label: '汽车配件', revenueKey: 'autoPartsRevenue' },
                            { key: 'machinery', label: '机械设备', revenueKey: 'machineryRevenue' },
                            { key: 'steel', label: '钢材', revenueKey: 'steelRevenue' },
                            { key: 'food', label: '常温食品饮料', revenueKey: 'foodRevenue' },
                            { key: 'electronics', label: '电子设备', revenueKey: 'electronicsRevenue' },
                            { key: 'semiconductor', label: '半导体零配件', revenueKey: 'semiconductorRevenue' },
                          ])}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2">
                        <div className="text-xs text-slate-500">运输路线</div>
                        <div className="mt-1 font-medium text-slate-900">
                          {summarizeToggleGroups([
                            { key: 'yunGui', label: '云南/贵州', revenueKey: 'yunGuiRevenue' },
                            { key: 'ganNing', label: '甘肃/宁夏', revenueKey: 'ganNingRevenue' },
                            { key: 'innerMongolia', label: '内蒙古', revenueKey: 'innerMongoliaRevenue' },
                            { key: 'jiHei', label: '吉林/黑龙江', revenueKey: 'jiHeiRevenue' },
                            { key: 'hainan', label: '海南', revenueKey: 'hainanRevenue' },
                            { key: 'chuanYu', label: '四川/重庆', revenueKey: 'chuanYuRevenue' },
                          ])}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">04</div>
                        <h4 className="mt-1 text-sm font-semibold text-slate-900">出险及保险情况（2023-2025）</h4>
                      </div>
                      <span className="text-xs text-slate-500">由客户填写后回写</span>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-sm">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">历史出险记录</div>
                        <div className="mt-2 space-y-2 text-slate-900">
                          {(inquiryFormData?.claims || [
                            { year: '2023' },
                            { year: '2024' },
                            { year: '2025' },
                          ]).map((claim: any) => (
                            <div key={claim.year} className="rounded border border-slate-200 bg-white px-3 py-2">
                              <div className="font-medium text-slate-800">{claim.year}年</div>
                              <div className="mt-1 text-xs text-slate-500">保单号：{renderReadonlyValue(claim.policyNo)}</div>
                              <div className="text-xs text-slate-500">保险公司：{renderReadonlyValue(claim.insurer)}</div>
                              <div className="text-xs text-slate-500">出险次数：{renderReadonlyValue(claim.count, '次')}</div>
                              <div className="text-xs text-slate-500">赔付金额：{renderReadonlyValue(claim.amount, '元')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">系统及声明</div>
                        <div className="mt-2 space-y-2 text-sm text-slate-900">
                          <div className="rounded border border-slate-200 bg-white px-3 py-2">TMS系统：{inquiryFormData ? (inquiryFormData.useTMS ? '已使用' : '未使用') : '待客户填写'}</div>
                          <div className="rounded border border-slate-200 bg-white px-3 py-2">ADAS设备：{inquiryFormData ? (inquiryFormData.useADAS ? '已安装' : '未安装') : '待客户填写'}</div>
                          <div className="rounded border border-slate-200 bg-white px-3 py-2">投保声明确认：{inquiryFormData ? (inquiryFormData.declarationConfirmed ? '已确认' : '未确认') : '待客户填写'}</div>
                          <div className="rounded border border-dashed border-slate-300 bg-white px-3 py-2 text-xs text-slate-500">
                            客户完成手机端问询单后，以上信息自动回写到当前详情页。
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

            </div>
          </div>

          <div className="sticky bottom-0 -mx-6 -mb-6 lg:-mx-8 lg:-mb-6 mt-auto bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-between items-center px-6 lg:px-8 gap-4">
            <button
              type="button"
              onClick={() => onOpenAttachmentViewer(selectedOrderForDetail.id)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              查看附件
            </button>

            <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onSaveOrderDraft(selectedOrderForDetail)}
              disabled={!canManage}
              className="flex items-center gap-2 px-6 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              暂存
            </button>
            <button
              onClick={() => {
                if (isNewOrder) {
                  onSaveOrderDraft(selectedOrderForDetail);
                }
                onShowInquiryConfirm();
              }}
              disabled={!requiredFieldsComplete || !canManage}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 shadow-sm rounded-md text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              发送问询单
            </button>
            </div>
          </div>
                                disabled={!canCreateClaim}
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex flex-wrap gap-x-6 gap-y-5">
              <div className="space-y-1.5 flex-1 min-w-[200px]">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">综合搜索</label>
                <input
                  type="text"
                  placeholder="询价单编号/客户名称"
                  value={draftOrderFilter.search}
                  onChange={(event) => setDraftOrderFilter({ ...draftOrderFilter, search: event.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5 flex-1 min-w-[150px]">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">订单来源</label>
                <div className="relative">
                  <select
                    value={draftOrderFilter.source}
                    onChange={(event) => setDraftOrderFilter({ ...draftOrderFilter, source: event.target.value })}
                    className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">全部来源</option>
                    <option value="商机转化">商机转化</option>
                    <option value="续约">续约</option>
                    <option value="保险出单">保险出单</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5 flex-1 min-w-[150px]">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">订单状态</label>
                <div className="relative">
                  <select
                    value={draftOrderFilter.status}
                    onChange={(event) => setDraftOrderFilter({ ...draftOrderFilter, status: event.target.value })}
                    className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">全部状态</option>
                    <option value="已建单">已建单</option>
                    <option value="已发送">已发送</option>
                    <option value="已回填">已回填</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-end gap-2 min-w-[220px]">
                <button
                  type="button"
                  onClick={handleApplyOrderFilter}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  查询
                </button>
                <button
                  type="button"
                  onClick={handleResetOrderFilter}
                  className="px-4 py-1.5 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors"
                >
                  重置
                </button>
              </div>
            </div>

          </div>

          <div className="flex flex-col">
            <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2"></div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/50 border-y border-slate-200 text-xs uppercase tracking-wider text-slate-600 font-semibold">
                    <th className="px-4 py-3">询价单编号</th>
                    <th className="px-4 py-3">订单来源</th>
                    <th className="px-4 py-3">客户信息</th>
                    <th className="px-4 py-3">保费估值</th>
                    <th className="px-4 py-3">创建日期</th>
                    <th className="px-4 py-3">状态</th>
                    <th className="px-4 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredOrders.map((row, index) => (
                    <tr key={index} onClick={() => setSelectedOrderForDetail(row)} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                      <td className="px-4 py-3 font-mono text-xs text-slate-900 font-medium">{row.id}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          row.source === '商机转化' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {row.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.customer}</td>
                      <td className="px-4 py-3 text-emerald-600 font-medium">{row.value}</td>
                      <td className="px-4 py-3 text-slate-500">{row.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          row.status === '已回填'
                            ? 'bg-emerald-100 text-emerald-700'
                            : row.status === '已发送'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">查看</button>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              onClaimOrder(row);
                            }}
                            className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                          >
                            理赔
                          </button>
                          <button className="text-slate-400 hover:text-slate-900 transition-colors p-1 rounded hover:bg-slate-100" title="更多操作">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="py-4 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                显示 <span className="font-medium text-slate-900">{startDisplay}</span> 至 <span className="font-medium text-slate-900">{endDisplay}</span> 条，共 <span className="font-medium text-slate-900">{filteredOrderCount}</span> 条数据
              </div>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>上一页</button>
                <button className="px-3 py-1 border border-slate-900 bg-slate-900 rounded text-sm text-white">1</button>
                <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>下一页</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
