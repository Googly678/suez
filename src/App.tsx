import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Search,
  Bell,
  Menu,
  ChevronDown,
  Wrench,
  ShieldCheck,
  ClipboardList,
  HeartHandshake,
  Target,
} from 'lucide-react';
import ClaimsAssistance from './components/ClaimsAssistance';
import AppraisalClaims from './components/AppraisalClaims';
import InquiryForm from './components/InquiryForm';
import { locationData } from './constants/locations';
import {
  CustomerManagementView,
  OpportunityManagementView,
  OrderManagementView,
} from './components/sales/SalesPages';
import {
  InquiryConfirmModal,
  AddCustomerModal,
  AddOpportunityModal,
  AddOrderModal,
} from './components/sales/SalesModals';

const sidebarGroups = [
  {
    title: '运营工作台',
    icon: LayoutDashboard,
    items: [
      { name: '理赔协助', icon: ShieldCheck },
      { name: '公估理赔', icon: ShieldCheck },
    ],
  },
  {
    title: '销售管理',
    icon: TrendingUp,
    items: [
      { name: '订单管理', icon: ClipboardList },
      { name: '客户管理', icon: HeartHandshake },
      { name: '商机池管理', icon: Target },
    ],
  },
];

const mockCustomerData = [
  { id: 'CUST-2026-001', customerCode: 'SF001', name: '顺丰速运', location: '广东省/深圳市/南山区', industry: '物流运输', scale: '10000人以上', contact: '张伟', phone: '13800138000', businessLine: '配送物流' },
  { id: 'CUST-2026-002', customerCode: 'DD002', name: '滴滴出行', location: '北京市/海淀区', industry: '网约车', scale: '5000-10000人', contact: '李娜', phone: '13900139000', businessLine: '商用车' },
  { id: 'CUST-2026-003', customerCode: 'KY003', name: '跨越速运', location: '广东省/深圳市/宝安区', industry: '物流运输', scale: '1000-5000人', contact: '王强', phone: '13700137000', businessLine: '配送物流' },
];

const mockOpportunityData = [
  { id: 'OPP-2026-001', customerCode: 'SF001', name: '顺丰华南区车载终端升级项目', type: '库内客户', source: '老客户复购', value: '¥1,500,000', contact: '张伟', phone: '13800138000', status: '跟进中' },
  { id: 'OPP-2026-002', customerCode: 'DD002', name: '某网约车平台安全监控设备采购', type: '库外客户', source: '展会获取', value: '¥800,000', contact: '刘总', phone: '13912345678', status: '处理中' },
  { id: 'OPP-2026-003', customerCode: 'KY003', name: '跨越速运冷链物流追踪模块', type: '库内客户', source: '主动开发', value: '¥2,100,000', contact: '王强', phone: '13700137000', status: '已成单' },
  { id: 'OPP-2026-004', customerCode: 'GJ004', name: '公交集团智能调度系统硬件', type: '库外客户', source: '招投标', value: '¥5,000,000', contact: '陈主任', phone: '13600136000', status: '新增' },
];

const mockOrderData = [
  { id: 'ORD-2026-001', customerCode: 'SF001', policyNo: 'POL-2026-8899001', source: '商机转化', contract: '顺丰华南区车载终端升级合同', customer: '顺丰速运', value: '¥1,500,000', date: '2026-09-10', status: '已生效' },
  { id: 'ORD-2026-002', customerCode: 'DD002', policyNo: 'POL-2026-8899002', source: '续约', contract: '滴滴出行年度维保服务协议', customer: '滴滴出行', value: '¥300,000', date: '2026-09-08', status: '待签署' },
  { id: 'ORD-2026-003', customerCode: 'KY003', policyNo: 'POL-2026-8899003', source: '商机转化', contract: '跨越速运冷链物流追踪模块采购', customer: '跨越速运', value: '¥2,100,000', date: '2026-09-05', status: '执行中' },
];

const purchaseData = [
  { year: '2023', amount: 120 },
  { year: '2024', amount: 180 },
  { year: '2025', amount: 250 },
  { year: '2026', amount: 310 },
];

const renewalData = [
  { month: '1月', rate: 85 },
  { month: '2月', rate: 88 },
  { month: '3月', rate: 92 },
  { month: '4月', rate: 90 },
  { month: '5月', rate: 95 },
  { month: '6月', rate: 96 },
];

const riskData = [
  { name: '财务风险', value: 20 },
  { name: '流失风险', value: 15 },
  { name: '合规风险', value: 5 },
  { name: '安全风险', value: 60 },
];

const RISK_COLORS = ['#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];

export default function App() {
  const query = new URLSearchParams(window.location.search);
  const isMobileInquiryPage = query.get('page') === 'inquiry';
  const queryCustomerName = query.get('customerName') || '张三';

  if (isMobileInquiryPage) {
    return <InquiryForm customerName={queryCustomerName} onClose={() => window.close()} />;
  }

  const [activeItem, setActiveItem] = useState('理赔协助');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState('运营工作台');
  const [resetKey, setResetKey] = useState(0);

  const [customers, setCustomers] = useState(mockCustomerData);
  const [opportunities, setOpportunities] = useState(mockOpportunityData);
  const [orders, setOrders] = useState(mockOrderData);
  const [claimsPool, setClaimsPool] = useState<any[]>([]);

  const [customerFilter, setCustomerFilter] = useState({
    search: '',
    businessLine: '',
    province: '',
    city: '',
    district: '',
    industry: '',
    scale: '',
  });
  const [opportunityFilter, setOpportunityFilter] = useState({ search: '', status: '' });
  const [orderFilter, setOrderFilter] = useState({ search: '', status: '', source: '' });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddOpportunityModalOpen, setIsAddOpportunityModalOpen] = useState(false);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [showInquiryConfirm, setShowInquiryConfirm] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    province: '',
    city: '',
    district: '',
    industry: '',
    scale: '',
    businessLine: '',
    contact: '',
    phone: '',
  });
  const [newOpportunity, setNewOpportunity] = useState({
    name: '',
    source: '请选择来源',
    value: '',
    type: '请选择类型',
    contact: '',
    phone: '',
    job: '',
    customerCode: '',
    customerName: '',
    businessLine: '',
    location: '',
    industry: '',
    scale: '',
  });
  const [newOrder, setNewOrder] = useState({
    source: '商机转化',
    opportunityId: '',
    contract: '',
    value: '',
    type: '库内客户',
    customerCode: '',
    customerName: '',
    businessLine: '',
    location: '',
    industry: '',
    scale: '',
    contact: '',
    phone: '',
  });

  const [opportunitySearchTerm, setOpportunitySearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [selectedCustomerForOpp, setSelectedCustomerForOpp] = useState<any>(null);
  const [selectedCustomerForOrder, setSelectedCustomerForOrder] = useState<any>(null);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedOrderForClaim, setSelectedOrderForClaim] = useState<any>(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<any>(null);
  const [orderDetailEdit, setOrderDetailEdit] = useState({
    contractValue: '',
    actualValue: '',
    isInvoiced: '否',
    invoiceType: '增值税专用发票',
    taxPoint: '6%',
  });

  useEffect(() => {
    if (selectedOrderForDetail) {
      setOrderDetailEdit({
        contractValue: selectedOrderForDetail.value || '',
        actualValue: selectedOrderForDetail.value || '',
        isInvoiced: '否',
        invoiceType: '增值税专用发票',
        taxPoint: '6%',
      });
    }
  }, [selectedOrderForDetail]);

  const availableCities = newCustomer.province ? Object.keys(locationData[newCustomer.province] || {}) : [];
  const availableDistricts = newCustomer.province && newCustomer.city ? locationData[newCustomer.province][newCustomer.city] : [];

  const openAddCustomerModal = () => {
    setIsAddModalOpen(true);
  };

  const openAddOpportunityModal = () => {
    setNewOpportunity({
      name: '',
      source: '请选择来源',
      value: '',
      type: '请选择类型',
      contact: '',
      phone: '',
      job: '',
      customerCode: '',
      customerName: '',
      businessLine: '',
      location: '',
      industry: '',
      scale: '',
    });
    setSelectedCustomerForOpp(null);
    setOpportunitySearchTerm('');
    setIsAddOpportunityModalOpen(true);
  };

  const openAddOrderModal = () => {
    setNewOrder({
      source: '商机转化',
      opportunityId: '',
      contract: '',
      value: '',
      type: '库内客户',
      customerCode: '',
      customerName: '',
      businessLine: '',
      location: '',
      industry: '',
      scale: '',
      contact: '',
      phone: '',
    });
    setSelectedCustomerForOrder(null);
    setOrderSearchTerm('');
    setIsAddOrderModalOpen(true);
  };

  const handleAddCustomer = () => {
    const id = `CUST-2026-${String(customers.length + 1).padStart(3, '0')}`;
    const location = `${newCustomer.province}/${newCustomer.city}/${newCustomer.district}`;
    setCustomers([...customers, { ...newCustomer, id, location }]);
    setIsAddModalOpen(false);
    setNewCustomer({
      name: '',
      province: '',
      city: '',
      district: '',
      industry: '',
      scale: '',
      businessLine: '',
      contact: '',
      phone: '',
    });
  };

  const handleAddOpportunity = () => {
    if (!newOpportunity.name) {
      alert('请输入商机名称');
      return;
    }

    const newId = `OPP-2026-${String(opportunities.length + 1).padStart(3, '0')}`;
    const newOpp = {
      id: newId,
      name: newOpportunity.name,
      type: newOpportunity.type,
      source: newOpportunity.source,
      value: `¥${newOpportunity.value}`,
      contact: newOpportunity.contact,
      phone: newOpportunity.phone,
      status: '新增',
      customerCode: newOpportunity.customerCode,
    };

    setOpportunities([...opportunities, newOpp]);

    if (newOpportunity.type === '库外客户') {
      const newCustId = `CUST-2026-${String(customers.length + 1).padStart(3, '0')}`;
      const newCust = {
        id: newCustId,
        customerCode: newOpportunity.customerCode || `CUST-${Math.floor(Math.random() * 10000)}`,
        name: newOpportunity.customerName,
        location: newOpportunity.location,
        industry: newOpportunity.industry,
        scale: newOpportunity.scale,
        contact: newOpportunity.contact,
        phone: newOpportunity.phone,
        businessLine: newOpportunity.businessLine,
      };
      setCustomers((prev) => [...prev, newCust]);
    }

    setIsAddOpportunityModalOpen(false);
    setSelectedCustomerForOpp(null);
    setOpportunitySearchTerm('');
  };

  const handleAddOrder = () => {
    if (!newOrder.contract) {
      alert('请输入合同名称');
      return;
    }

    const newId = `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`;
    const newOrderObj = {
      id: newId,
      customerCode: newOrder.customerCode,
      policyNo: `POL-2026-${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      source: newOrder.source,
      contract: newOrder.contract,
      customer: newOrder.customerName,
      value: `¥${newOrder.value}`,
      date: new Date().toISOString().split('T')[0],
      status: '待签署',
    };

    setOrders([...orders, newOrderObj]);

    if (newOrder.type === '库外客户') {
      const newCustId = `CUST-2026-${String(customers.length + 1).padStart(3, '0')}`;
      const newCust = {
        id: newCustId,
        customerCode: newOrder.customerCode || `CUST-${Math.floor(Math.random() * 10000)}`,
        name: newOrder.customerName,
        location: newOrder.location,
        industry: newOrder.industry,
        scale: newOrder.scale,
        contact: newOrder.contact,
        phone: newOrder.phone,
        businessLine: newOrder.businessLine,
      };
      setCustomers((prev) => [...prev, newCust]);
    }

    setIsAddOrderModalOpen(false);
    setSelectedCustomerForOrder(null);
    setOrderSearchTerm('');
  };

  const handleClaimsSubmit = (claim: any) => {
    const newClaim = {
      ...claim,
      id: `CLM-${new Date().getTime()}`,
      status: '理赔审核',
      reportTime: new Date().toLocaleString(),
    };
    setClaimsPool((prev) => [...prev, newClaim]);
    setActiveItem('公估理赔');
  };

  const handleAppraisalSubmit = (claimId: string, appraisalData: any) => {
    setClaimsPool((prev) => prev.map((claim) => (claim.id === claimId ? { ...claim, ...appraisalData } : claim)));
  };

  const filteredCustomers = customers.filter((item) => {
    const matchesSearch = item.name.includes(customerFilter.search) || item.id.includes(customerFilter.search) || item.customerCode.includes(customerFilter.search);
    const matchesBusinessLine = customerFilter.businessLine === '' || item.businessLine === customerFilter.businessLine;
    const matchesProvince = customerFilter.province === '' || item.location.startsWith(customerFilter.province);
    const matchesCity = customerFilter.city === '' || item.location.includes(`/${customerFilter.city}/`) || item.location.endsWith(`/${customerFilter.city}`);
    const matchesDistrict = customerFilter.district === '' || item.location.endsWith(`/${customerFilter.district}`);
    const matchesIndustry = customerFilter.industry === '' || item.industry === customerFilter.industry;
    const matchesScale = customerFilter.scale === '' || item.scale === customerFilter.scale;
    return matchesSearch && matchesBusinessLine && matchesProvince && matchesCity && matchesDistrict && matchesIndustry && matchesScale;
  });

  const filteredOpportunities = opportunities.filter((item) => {
    const matchesSearch = item.name.includes(opportunityFilter.search) || item.id.includes(opportunityFilter.search) || item.contact.includes(opportunityFilter.search);
    const matchesStatus = opportunityFilter.status === '' || item.status === opportunityFilter.status;
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter((item) => {
    const matchesSearch = item.customer.includes(orderFilter.search) || item.id.includes(orderFilter.search) || item.contract.includes(orderFilter.search);
    const matchesStatus = orderFilter.status === '' || item.status === orderFilter.status;
    const matchesSource = orderFilter.source === '' || item.source === orderFilter.source;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const currentGroup = sidebarGroups.find((group) => group.items.some((item) => item.name === activeItem))?.title || '未知模块';

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 bg-slate-900 text-white transition-all duration-300 flex flex-col z-20 shadow-xl shadow-slate-900/20`}>
        <div className="h-16 flex items-center justify-center border-b border-slate-800 px-4 shrink-0">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-inner">
                S
              </div>
              Suez
            </h1>
          ) : (
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-inner">
              S
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          {sidebarGroups.map((group, idx) => {
            const isExpanded = expandedGroup === group.title;
            const hasActiveItem = group.items.some((item) => item.name === activeItem);

            return (
              <div key={idx} className="mb-1">
                <button
                  onClick={() => {
                    if (!isSidebarOpen) setIsSidebarOpen(true);
                    setExpandedGroup(isExpanded ? '' : group.title);
                  }}
                  className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-6' : 'justify-center px-0'} py-3 text-sm font-medium transition-colors ${
                    isExpanded || (!isExpanded && hasActiveItem && !isSidebarOpen)
                      ? 'text-white bg-slate-800/80'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                  title={!isSidebarOpen ? group.title : undefined}
                >
                  <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : ''}`}>
                    <group.icon className={`w-5 h-5 ${isExpanded || hasActiveItem ? 'text-blue-400' : 'text-slate-500'}`} />
                    {isSidebarOpen && <span>{group.title}</span>}
                  </div>
                  {isSidebarOpen && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-400' : 'text-slate-500'}`} />
                  )}
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded && isSidebarOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <ul className="py-1 bg-slate-900/30">
                    {group.items.map((item, itemIdx) => {
                      const isActive = activeItem === item.name;
                      return (
                        <li key={itemIdx}>
                          <button
                            onClick={() => {
                              setActiveItem(item.name);
                              setSelectedCustomer(null);
                              setSelectedOrderForDetail(null);
                              setSelectedOrderForClaim(null);
                              setResetKey((prev) => prev + 1);
                            }}
                            className={`w-full flex items-center pl-14 pr-6 py-2.5 text-sm transition-all duration-200 ${
                              isActive
                                ? 'text-blue-400 bg-blue-600/10 border-r-2 border-blue-500 shadow-[inset_4px_0_0_0_rgba(59,130,246,0.1)]'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                              <span>{item.name}</span>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
            <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" className="w-9 h-9 rounded-full border-2 border-slate-700" referrerPolicy="no-referrer" />
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">系统管理员</p>
                <p className="text-xs text-slate-400 truncate">admin@ryts.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-slate-700 focus:outline-none p-1 rounded-md hover:bg-slate-100 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <span className="hover:text-slate-700 cursor-pointer transition-colors">{currentGroup}</span>
              <span className="text-slate-300">/</span>
              <span
                className="transition-colors hover:text-slate-700 cursor-pointer text-slate-900 font-medium"
                onClick={() => {
                  if (selectedCustomer) setSelectedCustomer(null);
                  if (selectedOrderForDetail) setSelectedOrderForDetail(null);
                  setResetKey((prev) => prev + 1);
                }}
              >
                {activeItem}
              </span>
              {selectedCustomer && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-900 font-medium">{selectedCustomer.name}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="搜索订单、客户、案件..."
                className="pl-9 pr-4 py-2 w-64 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            <button className="relative text-slate-500 hover:text-slate-700 transition-colors p-1.5 rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="w-full max-w-[1600px] mx-auto px-6 py-6 lg:px-8 flex-1 flex flex-col">
            {activeItem === '客户管理' ? (
              <CustomerManagementView
                selectedCustomer={selectedCustomer}
                customerFilter={customerFilter}
                setCustomerFilter={setCustomerFilter}
                filteredCustomers={filteredCustomers}
                locationData={locationData}
                purchaseData={purchaseData}
                renewalData={renewalData}
                riskData={riskData}
                riskColors={RISK_COLORS}
                onSelectCustomer={setSelectedCustomer}
                onOpenAddCustomer={openAddCustomerModal}
              />
            ) : activeItem === '商机池管理' ? (
              <OpportunityManagementView
                opportunityFilter={opportunityFilter}
                setOpportunityFilter={setOpportunityFilter}
                filteredOpportunities={filteredOpportunities}
                onOpenAddOpportunity={openAddOpportunityModal}
              />
            ) : activeItem === '订单管理' ? (
              <OrderManagementView
                selectedOrderForDetail={selectedOrderForDetail}
                setSelectedOrderForDetail={setSelectedOrderForDetail}
                orderDetailEdit={orderDetailEdit}
                setOrderDetailEdit={setOrderDetailEdit}
                orderFilter={orderFilter}
                setOrderFilter={setOrderFilter}
                filteredOrders={filteredOrders}
                onOpenAddOrder={openAddOrderModal}
                onShowInquiryConfirm={() => setShowInquiryConfirm(true)}
                onClaimOrder={(row) => {
                  setSelectedOrderForClaim(row);
                  setActiveItem('理赔协助');
                  setResetKey((prev) => prev + 1);
                }}
              />
            ) : activeItem === '理赔协助' ? (
              <div key={resetKey}>
                <ClaimsAssistance selectedOrder={selectedOrderForClaim} onSubmit={handleClaimsSubmit} />
              </div>
            ) : activeItem === '公估理赔' ? (
              <div key={resetKey}>
                <AppraisalClaims claimsPool={claimsPool} onAppraisalSubmit={handleAppraisalSubmit} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Wrench className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">页面建设中</h3>
                <p className="text-sm text-slate-500 mt-1">[{activeItem}] 功能模块正在开发中，敬请期待。</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <InquiryConfirmModal
        isOpen={showInquiryConfirm}
        customerName={selectedOrderForDetail?.customer}
        onClose={() => setShowInquiryConfirm(false)}
        onConfirm={() => {
          alert('问询单已发送！');
          setShowInquiryConfirm(false);
          setTimeout(() => {
            if (confirm('客户已收到问询单链接，是否在新的标签页模拟客户手机端填写页面？')) {
              const inquiryUrl = new URL(window.location.href);
              inquiryUrl.searchParams.set('page', 'inquiry');
              if (selectedOrderForDetail?.customer) {
                inquiryUrl.searchParams.set('customerName', selectedOrderForDetail.customer);
              }
              window.open(inquiryUrl.toString(), '_blank');
            }
          }, 1000);
        }}
      />

      <AddCustomerModal
        isOpen={isAddModalOpen && activeItem === '客户管理'}
        newCustomer={newCustomer}
        setNewCustomer={setNewCustomer}
        availableCities={availableCities}
        availableDistricts={availableDistricts}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCustomer}
      />

      <AddOpportunityModal
        isOpen={isAddOpportunityModalOpen}
        newOpportunity={newOpportunity}
        setNewOpportunity={setNewOpportunity}
        opportunitySearchTerm={opportunitySearchTerm}
        setOpportunitySearchTerm={setOpportunitySearchTerm}
        selectedCustomerForOpp={selectedCustomerForOpp}
        setSelectedCustomerForOpp={setSelectedCustomerForOpp}
        customers={customers}
        onClose={() => setIsAddOpportunityModalOpen(false)}
        onSubmit={handleAddOpportunity}
      />

      <AddOrderModal
        isOpen={isAddOrderModalOpen}
        newOrder={newOrder}
        setNewOrder={setNewOrder}
        orderSearchTerm={orderSearchTerm}
        setOrderSearchTerm={setOrderSearchTerm}
        selectedCustomerForOrder={selectedCustomerForOrder}
        setSelectedCustomerForOrder={setSelectedCustomerForOrder}
        customers={customers}
        opportunities={opportunities}
        onClose={() => setIsAddOrderModalOpen(false)}
        onSubmit={handleAddOrder}
      />
    </div>
  );
}
