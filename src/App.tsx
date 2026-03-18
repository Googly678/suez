import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Factory, 
  TrendingUp, 
  CircleDollarSign,
  Plus,
  Search,
  Bell,
  UserCircle,
  Menu,
  ChevronDown,
  Filter,
  MoreHorizontal,
  FileText,
  Wrench,
  Box,
  Warehouse,
  Users,
  ListTree,
  ShieldCheck,
  ClipboardList,
  HeartHandshake,
  ShoppingCart,
  CreditCard,
  Settings,
  X,
  Target,
  ChevronLeft,
  ChevronRight,
  Check,
  Building2,
  Activity,
  Mail,
  Save,
  Send,
  Upload,
  AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import ClaimsAssistance from './components/ClaimsAssistance';
import AppraisalClaims from './components/AppraisalClaims';
import InquiryForm from './components/InquiryForm';
import { locationData } from './constants/locations';

const sidebarGroups = [
  {
    title: '运营工作台',
    icon: LayoutDashboard,
    items: [
      { name: '售后工单', icon: Wrench },
      { name: '线上报告', icon: FileText },
      { name: '理赔协助', icon: ShieldCheck },
      { name: '公估理赔', icon: ShieldCheck }
    ]
  },
  {
    title: '供应链管理',
    icon: PackageSearch,
    items: [
      { name: '采购管理', icon: ShoppingCart },
      { name: '库存控制', icon: Box },
      { name: '仓储管理', icon: Warehouse },
      { name: '供应商管理', icon: Users }
    ]
  },
  {
    title: '生产管理',
    icon: Factory,
    items: [
      { name: '生产计划', icon: FileText },
      { name: '质量检测', icon: ShieldCheck }
    ]
  },
  {
    title: '销售管理',
    icon: TrendingUp,
    items: [
      { name: '订单管理', icon: ClipboardList },
      { name: '客户管理', icon: HeartHandshake },
      { name: '商机池管理', icon: Target }
    ]
  },
  {
    title: '财务管理',
    icon: CircleDollarSign,
    items: [
      { name: '财务总览', icon: CircleDollarSign }
    ]
  },
  {
    title: '订阅管理',
    icon: CreditCard,
    items: [
      { name: '订阅计划', icon: FileText },
      { name: '账单记录', icon: CircleDollarSign }
    ]
  },
  {
    title: '系统设置',
    icon: Settings,
    items: [
      { name: '账号管理', icon: UserCircle },
      { name: '权限配置', icon: ShieldCheck }
    ]
  }
];

const mockData = [
  { id: 'PR-20260908-001', supplier: '安易行Co', contract: '智能双视摄像头采购', reason: 'Q4车队客户备货', date: '2026-09-08', status: '审批中', approvedAt: '--:--:--' },
  { id: 'PR-20260907-042', supplier: '智联科技', contract: 'OBD-II诊断终端采购', reason: '常规库存补充', date: '2026-09-07', status: '已通过', approvedAt: '2026-09-08 10:30' },
  { id: 'PR-20260905-018', supplier: '安易行Co', contract: 'ADAS高级辅助系统模块', reason: '定制项目采购', date: '2026-09-05', status: '已驳回', approvedAt: '2026-09-06 14:15' },
  { id: 'PR-20260901-005', supplier: '星网宇达', contract: 'DMS驾驶员监控摄像头', reason: '新产品线试产', date: '2026-09-01', status: '已通过', approvedAt: '2026-09-03 09:00' },
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

const initialProductionPlanData = [
  { id: 'PLN-2026-001', name: '车载终端T1批次生产', product: '智能双视摄像头', quantity: 500, startDate: '2026-03-10', endDate: '2026-03-20', status: '进行中' },
  { id: 'PLN-2026-002', name: '冷链追踪模块试产', product: '冷链物流追踪模块', quantity: 50, startDate: '2026-03-15', endDate: '2026-03-18', status: '新增' },
  { id: 'PLN-2026-003', name: '公交调度硬件交付', product: '智能调度系统硬件', quantity: 200, startDate: '2026-02-20', endDate: '2026-03-01', status: '已验收' },
  { id: 'PLN-2026-004', name: 'DMS摄像头常规生产', product: 'DMS驾驶员监控摄像头', quantity: 1000, startDate: '2026-01-10', endDate: '2026-01-25', status: '已完成' },
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
  
  // Centralized State
  const [purchaseOrders, setPurchaseOrders] = useState(mockData);
  const [customers, setCustomers] = useState(mockCustomerData);
  const [opportunities, setOpportunities] = useState(mockOpportunityData);
  const [orders, setOrders] = useState(mockOrderData);
  const [productionPlans, setProductionPlans] = useState(initialProductionPlanData);
  const [claimsPool, setClaimsPool] = useState<any[]>([]); // Pool for Appraisal Claims
  
  // Filter States
  const [purchaseFilter, setPurchaseFilter] = useState({ search: '', status: '' });
  const [customerFilter, setCustomerFilter] = useState({ 
    search: '', 
    businessLine: '',
    province: '',
    city: '',
    district: '',
    industry: '',
    scale: ''
  });
  const [opportunityFilter, setOpportunityFilter] = useState({ search: '', status: '' });
  const [orderFilter, setOrderFilter] = useState({ search: '', status: '', source: '' });
  const [planFilter, setPlanFilter] = useState({ search: '', status: '' });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isAddOpportunityModalOpen, setIsAddOpportunityModalOpen] = useState(false);
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
  const [opportunitySearchTerm, setOpportunitySearchTerm] = useState('');
  const [selectedCustomerForOpp, setSelectedCustomerForOpp] = useState<any>(null);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
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
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [newProductionPlan, setNewProductionPlan] = useState({
    name: '',
    product: '',
    quantity: '',
    startDate: '',
    endDate: '',
  });
  const [selectedCustomerForOrder, setSelectedCustomerForOrder] = useState<any>(null);
  const [isAddProductionPlanModalOpen, setIsAddProductionPlanModalOpen] = useState(false);
  
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedOrderForClaim, setSelectedOrderForClaim] = useState<any>(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<any>(null);
  
  // Order Detail Editable State
  const [orderDetailEdit, setOrderDetailEdit] = useState({
    contractValue: '',
    actualValue: '',
    isInvoiced: '否',
    invoiceType: '增值税专用发票',
    taxPoint: '6%'
  });
  const [showInquiryConfirm, setShowInquiryConfirm] = useState(false);

  useEffect(() => {
    if (selectedOrderForDetail) {
      setOrderDetailEdit({
        contractValue: selectedOrderForDetail.value || '',
        actualValue: selectedOrderForDetail.value || '',
        isInvoiced: '否',
        invoiceType: '增值税专用发票',
        taxPoint: '6%'
      });
    }
  }, [selectedOrderForDetail]);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    province: '',
    city: '',
    district: '',
    industry: '',
    scale: '',
    businessLine: '',
    contact: '',
    phone: ''
  });

  // Location Selector State for New Customer
  const availableCities = newCustomer.province ? Object.keys(locationData[newCustomer.province] || {}) : [];
  const availableDistricts = (newCustomer.province && newCustomer.city) ? locationData[newCustomer.province][newCustomer.city] : [];

  const handleAddCustomer = () => {
    const id = `CUST-2026-${String(customers.length + 1).padStart(3, '0')}`;
    const location = `${newCustomer.province}/${newCustomer.city}/${newCustomer.district}`;
    setCustomers([...customers, { ...newCustomer, id, location }]);
    setIsAddModalOpen(false);
    setNewCustomer({
      name: '', province: '', city: '', district: '', industry: '', scale: '', businessLine: '', contact: '', phone: ''
    });
  };

  const handleAddOpportunity = () => {
    if (!newOpportunity.name || newOpportunity.name === '') {
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
    
    // If it's a new customer (库外客户), add it to the customers list
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
      setCustomers([...customers, newCust]);
    }
    
    setIsAddOpportunityModalOpen(false);
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
  };

  const handleAddOrder = () => {
    if (!newOrder.contract || newOrder.contract === '') {
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
    
    // If it's a new customer (库外客户), add it to the customers list
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
      setCustomers([...customers, newCust]);
    }
    
    setIsAddOrderModalOpen(false);
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
  };

  const handleAddProductionPlan = () => {
    const newId = `PLN-${new Date().getFullYear()}-${String(productionPlans.length + 1).padStart(3, '0')}`;
    const plan = {
      id: newId,
      ...newProductionPlan,
      quantity: Number(newProductionPlan.quantity),
      status: '新增',
    };
    setProductionPlans([...productionPlans, plan]);
    setIsAddProductionPlanModalOpen(false);
    setNewProductionPlan({
      name: '',
      product: '',
      quantity: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleClaimsSubmit = (claim: any) => {
    // When claims assistance is submitted, status becomes '理赔审核'
    const newClaim = { 
      ...claim, 
      id: `CLM-${new Date().getTime()}`, 
      status: '理赔审核', 
      reportTime: new Date().toLocaleString() 
    };
    setClaimsPool(prev => [...prev, newClaim]);
    setActiveItem('公估理赔');
  };

  const handleAppraisalSubmit = (claimId: string, appraisalData: any) => {
    // appraisalData will contain the new status based on the audit conclusion
    setClaimsPool(prev => prev.map(c => c.id === claimId ? { ...c, ...appraisalData } : c));
  };

  // Filtered Data
  const filteredPurchaseOrders = purchaseOrders.filter(item => 
    (item.id.includes(purchaseFilter.search) || item.supplier.includes(purchaseFilter.search)) &&
    (purchaseFilter.status === '' || item.status === purchaseFilter.status)
  );

  const filteredCustomers = customers.filter(item => 
    (item.name.includes(customerFilter.search) || item.id.includes(customerFilter.search)) &&
    (customerFilter.businessLine === '' || item.businessLine === customerFilter.businessLine)
  );

  const filteredOpportunities = opportunities.filter(item => 
    (item.name.includes(opportunityFilter.search) || item.id.includes(opportunityFilter.search)) &&
    (opportunityFilter.status === '' || item.status === opportunityFilter.status)
  );

  const filteredOrders = orders.filter(item => 
    (item.customer.includes(orderFilter.search) || item.id.includes(orderFilter.search) || item.contract.includes(orderFilter.search)) &&
    (orderFilter.status === '' || item.status === orderFilter.status) &&
    (orderFilter.source === '' || item.source === orderFilter.source)
  );

  const filteredProductionPlans = productionPlans.filter(item => 
    (item.name.includes(planFilter.search) || item.product.includes(planFilter.search)) &&
    (planFilter.status === '' || item.status === planFilter.status)
  );

  const currentGroup = sidebarGroups.find(g => g.items.some(i => i.name === activeItem))?.title || '未知模块';

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
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
            const hasActiveItem = group.items.some(item => item.name === activeItem);

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

                {/* Sub-items */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded && isSidebarOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <ul className="py-1 bg-slate-900/30">
                    {group.items.map((item, itemIdx) => {
                      const isActive = activeItem === item.name;
                      return (
                        <li key={itemIdx}>
                          <button
                            onClick={() => {
                              setActiveItem(item.name);
                              setSelectedCustomer(null);
                              setSelectedOrderForClaim(null);
                              setResetKey(prev => prev + 1);
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
        
        {/* User Profile in Sidebar Bottom */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-500 hover:text-slate-700 focus:outline-none p-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <span className="hover:text-slate-700 cursor-pointer transition-colors">{currentGroup}</span> 
              <span className="text-slate-300">/</span> 
              <span 
                className={`transition-colors hover:text-slate-700 cursor-pointer text-slate-900 font-medium`}
                onClick={() => {
                  if (selectedCustomer) setSelectedCustomer(null);
                  setResetKey(prev => prev + 1);
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
                placeholder="搜索合同、供应商..." 
                className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all w-64 placeholder:text-slate-400"
              />
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <button className="relative text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="w-full max-w-[1600px] mx-auto px-6 py-6 lg:px-8 flex-1 flex flex-col">
            
            {/* Page Header */}
            {['采购管理', '客户管理', '商机池管理', '订单管理', '生产计划'].includes(activeItem) && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-6">
                {activeItem === '采购管理' && (
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    新增采购
                  </button>
                )}
                {activeItem === '客户管理' && !selectedCustomer && (
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    新增客户
                  </button>
                )}
                {activeItem === '商机池管理' && (
                  <button 
                    onClick={() => {
                      setNewOpportunity({
                        name: '',
                        type: '库内客户',
                        source: '市场活动',
                        value: '',
                        customerCode: '',
                        customerName: '',
                        businessLine: '',
                        location: '',
                        industry: '',
                        scale: '',
                        contact: '',
                        job: '',
                        phone: '',
                      });
                      setSelectedCustomerForOpp(null);
                      setOpportunitySearchTerm('');
                      setIsAddOpportunityModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    新增商机
                  </button>
                )}
                {activeItem === '订单管理' && !selectedOrderForDetail && (
                  <button 
                    onClick={() => {
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
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    新增订单
                  </button>
                )}
                {activeItem === '生产计划' && (
                  <button 
                    onClick={() => {
                      setNewProductionPlan({
                        name: '',
                        product: '',
                        quantity: '',
                        startDate: '',
                        endDate: '',
                      });
                      setIsAddProductionPlanModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    新建生产计划
                  </button>
                )}
              </div>
            )}

            {activeItem === '采购管理' ? (
              <>
                {/* Filter Section */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <div className="flex flex-wrap gap-x-6 gap-y-5">
                    {/* 采购单号 (精确搜索) */}
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">采购单号</label>
                      <input 
                        type="text" 
                        placeholder="请输入单号" 
                        value={purchaseFilter.search}
                        onChange={(e) => setPurchaseFilter({ ...purchaseFilter, search: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                      />
                    </div>
                    
                    {/* 供应商 (下拉) */}
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">供应商</label>
                      <div className="relative">
                        <select className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                          <option value="">全部供应商</option>
                          <option value="安易行Co">安易行Co</option>
                          <option value="智联科技">智联科技</option>
                          <option value="星网宇达">星网宇达</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* 合同事由 (下拉) */}
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">合同事由</label>
                      <div className="relative">
                        <select className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                          <option value="">全部事由</option>
                          <option value="采购">常规采购</option>
                          <option value="备货">备货采购</option>
                          <option value="定制">定制项目</option>
                          <option value="试产">新产品试产</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* 申请日期区间 */}
                    <div className="space-y-1.5 flex-1 min-w-[280px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">申请日期</label>
                      <div className="flex items-center w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
                        <input 
                          type="date" 
                          className="bg-transparent border-none focus:outline-none text-slate-700 w-full flex-1 cursor-pointer"
                        />
                        <span className="text-slate-300 mx-2 text-xs">至</span>
                        <input 
                          type="date" 
                          className="bg-transparent border-none focus:outline-none text-slate-700 w-full flex-1 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* 通过时间区间 */}
                    <div className="space-y-1.5 flex-1 min-w-[280px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">通过时间</label>
                      <div className="flex items-center w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
                        <input 
                          type="date" 
                          className="bg-transparent border-none focus:outline-none text-slate-700 w-full flex-1 cursor-pointer"
                        />
                        <span className="text-slate-300 mx-2 text-xs">至</span>
                        <input 
                          type="date" 
                          className="bg-transparent border-none focus:outline-none text-slate-700 w-full flex-1 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex justify-end gap-3">
                    <button className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      重置
                    </button>
                    <button className="px-4 py-1.5 text-sm font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">
                      查询
                    </button>
                  </div>
                </div>

                {/* Table Section */}
                <div className="flex flex-col">
                  
                  {/* Table Toolbar */}
                  <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <select className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded text-slate-700 bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer font-medium">
                          <option>所有状态</option>
                          <option>审批中</option>
                          <option>已通过</option>
                          <option>已驳回</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded text-slate-600 bg-white hover:bg-slate-50 transition-colors">
                      <Filter className="w-4 h-4 text-slate-400" />
                      筛选
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-slate-50/50 border-y border-slate-200 text-xs uppercase tracking-wider text-slate-600 font-semibold">
                          <th className="px-4 py-3">采购单号</th>
                          <th className="px-4 py-3">供应商</th>
                          <th className="px-4 py-3">合同名称</th>
                          <th className="px-4 py-3">合同事由</th>
                          <th className="px-4 py-3">申请日期</th>
                          <th className="px-4 py-3">合同进度</th>
                          <th className="px-4 py-3">通过时间</th>
                          <th className="px-4 py-3 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredPurchaseOrders.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                        <td className="px-4 py-3 font-mono text-slate-600 text-xs">{row.id}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {row.supplier}
                        </td>
                        <td className="px-4 py-3 text-slate-800 font-medium">{row.contract}</td>
                        <td className="px-4 py-3 text-slate-600">{row.reason}</td>
                        <td className="px-4 py-3 text-slate-600">{row.date}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            row.status === '审批中' ? 'bg-amber-100/50 text-amber-800' :
                            row.status === '已通过' ? 'bg-emerald-100/50 text-emerald-800' :
                            'bg-rose-100/50 text-rose-800'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.approvedAt}</td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-slate-400 hover:text-slate-900 transition-colors p-1 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 focus:opacity-100" title="更多操作">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="py-4 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  显示 <span className="font-medium text-slate-900">1</span> 至 <span className="font-medium text-slate-900">4</span> 条，共 <span className="font-medium text-slate-900">4</span> 条数据
                </div>
                <div className="flex gap-1">
                  <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>上一页</button>
                  <button className="px-3 py-1 border border-slate-900 bg-slate-900 rounded text-sm text-white">1</button>
                  <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>下一页</button>
                </div>
              </div>
            </div>
            </>
            ) : activeItem === '客户管理' ? (
              selectedCustomer ? (
                <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                  {/* Header */}
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
                    {/* 1. 客户基本信息 */}
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

                    {/* 2. 客户购买情况 */}
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
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `¥${val}万`} />
                              <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="采购金额(万元)" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </section>

                    <div className="h-px bg-slate-100"></div>

                    {/* 3. 客户续约情况 */}
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
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" name="续约率" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </section>

                    <div className="h-px bg-slate-100"></div>

                    {/* 4. 客户风险分析 */}
                    <section>
                      <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                        客户风险分析
                      </h3>
                      <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="w-full lg:w-1/3 h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={riskData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                              >
                                {riskData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                                ))}
                              </Pie>
                              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-full lg:w-2/3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {riskData.map((risk, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: RISK_COLORS[idx % RISK_COLORS.length] }}></div>
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
                {/* Customer Filter Section */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <div className="flex flex-wrap gap-x-6 gap-y-5">
                    {/* 综合搜索 */}
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">综合搜索</label>
                      <input 
                        type="text" 
                        placeholder="名称/营业执照/唯一码" 
                        value={customerFilter.search}
                        onChange={(e) => setCustomerFilter({ ...customerFilter, search: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                      />
                    </div>
                    
                    {/* 属地三级筛选 */}
                    <div className="space-y-1.5 flex-1 min-w-[280px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">属地</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <select 
                            value={customerFilter.province}
                            onChange={(e) => setCustomerFilter({ ...customerFilter, province: e.target.value, city: '', district: '' })}
                            className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                          >
                            <option value="">省份</option>
                            {Object.keys(locationData).map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative flex-1">
                          <select 
                            value={customerFilter.city}
                            onChange={(e) => setCustomerFilter({ ...customerFilter, city: e.target.value, district: '' })}
                            disabled={!customerFilter.province}
                            className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer disabled:bg-slate-50"
                          >
                            <option value="">城市</option>
                            {customerFilter.province && Object.keys(locationData[customerFilter.province] || {}).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative flex-1">
                          <select 
                            value={customerFilter.district}
                            onChange={(e) => setCustomerFilter({ ...customerFilter, district: e.target.value })}
                            disabled={!customerFilter.city}
                            className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer disabled:bg-slate-50"
                          >
                            <option value="">区县</option>
                            {customerFilter.province && customerFilter.city && locationData[customerFilter.province][customerFilter.city]?.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* 行业筛选 */}
                    <div className="space-y-1.5 flex-1 min-w-[150px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">行业</label>
                      <div className="relative">
                        <select 
                          value={customerFilter.industry}
                          onChange={(e) => setCustomerFilter({ ...customerFilter, industry: e.target.value })}
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

                    {/* 规模筛选 */}
                    <div className="space-y-1.5 flex-1 min-w-[150px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">规模(员工人数)</label>
                      <div className="relative">
                        <select className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                          <option value="">全部规模</option>
                          <option value="0-50">0-50人</option>
                          <option value="50-200">50-200人</option>
                          <option value="200-1000">200-1000人</option>
                          <option value="1000+">1000人以上</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex justify-end gap-3">
                    <button 
                      onClick={() => setCustomerFilter({ 
                        search: '', 
                        businessLine: '',
                        province: '',
                        city: '',
                        district: '',
                        industry: '',
                        scale: ''
                      })}
                      className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      重置
                    </button>
                    <button className="px-4 py-1.5 text-sm font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">
                      查询
                    </button>
                  </div>
                </div>

                {/* Customer Table Section */}
                <div className="flex flex-col">
                  {/* Table Toolbar */}
                  <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                      {/* Placeholder for other toolbar items if needed */}
                    </div>
                  </div>

                  {/* Table */}
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
                        {filteredCustomers.map((row, idx) => (
                          <tr 
                            key={idx} 
                            className="hover:bg-slate-50 transition-colors group cursor-pointer"
                            onClick={() => setSelectedCustomer(row)}
                          >
                            <td className="px-4 py-3 font-mono text-slate-600 text-xs">{row.id}</td>
                            <td className="px-4 py-3 font-medium text-slate-900">
                              {row.name}
                            </td>
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
                  
                  {/* Pagination */}
                  <div className="py-4 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      显示 <span className="font-medium text-slate-900">1</span> 至 <span className="font-medium text-slate-900">3</span> 条，共 <span className="font-medium text-slate-900">3</span> 条数据
                    </div>
                    <div className="flex gap-1">
                      <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>上一页</button>
                      <button className="px-3 py-1 border border-slate-900 bg-slate-900 rounded text-sm text-white">1</button>
                      <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>下一页</button>
                    </div>
                  </div>
                </div>
              </>
              )
            ) : activeItem === '商机池管理' ? (
              <>
                {/* Opportunity Filter Section */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <div className="flex flex-wrap gap-x-6 gap-y-5">
                    {/* 综合搜索 */}
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">综合搜索</label>
                      <input 
                        type="text" 
                        placeholder="商机名称/联系人" 
                        value={opportunityFilter.search}
                        onChange={(e) => setOpportunityFilter({ ...opportunityFilter, search: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                      />
                    </div>
                    
                    {/* 商机状态 */}
                    <div className="space-y-1.5 flex-1 min-w-[150px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">商机状态</label>
                      <div className="relative">
                        <select 
                          value={opportunityFilter.status}
                          onChange={(e) => setOpportunityFilter({ ...opportunityFilter, status: e.target.value })}
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

                    {/* 客户类型 */}
                    <div className="space-y-1.5 flex-1 min-w-[150px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">客户类型</label>
                      <div className="relative">
                        <select className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                          <option value="">全部类型</option>
                          <option value="库内客户">库内客户</option>
                          <option value="库外客户">库外客户</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* 商机来源 */}
                    <div className="space-y-1.5 flex-1 min-w-[150px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">商机来源</label>
                      <div className="relative">
                        <select className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                          <option value="">全部来源</option>
                          <option value="主动开发">主动开发</option>
                          <option value="老客户复购">老客户复购</option>
                          <option value="展会获取">展会获取</option>
                          <option value="招投标">招投标</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex justify-end gap-3">
                    <button className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 hover:text-slate-900 transition-colors">
                      重置
                    </button>
                    <button className="px-4 py-1.5 text-sm font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">
                      查询
                    </button>
                  </div>
                </div>

                {/* Opportunity Table Section */}
                <div className="flex flex-col">
                  {/* Table Toolbar */}
                  <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                      {/* Placeholder for other toolbar items if needed */}
                    </div>
                    
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded text-slate-600 bg-white hover:bg-slate-50 transition-colors">
                      <Filter className="w-4 h-4 text-slate-400" />
                      筛选
                    </button>
                  </div>

                  {/* Table */}
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
                        {filteredOpportunities.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors group cursor-pointer">
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
                  
                  {/* Pagination */}
                  <div className="py-4 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      显示 <span className="font-medium text-slate-900">1</span> 至 <span className="font-medium text-slate-900">4</span> 条，共 <span className="font-medium text-slate-900">4</span> 条数据
                    </div>
                    <div className="flex gap-1">
                      <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>上一页</button>
                      <button className="px-3 py-1 border border-slate-900 bg-slate-900 rounded text-sm text-white">1</button>
                      <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>下一页</button>
                    </div>
                  </div>
                </div>
              </>
            ) : activeItem === '订单管理' ? (
              <>
                {selectedOrderForDetail ? (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full relative">
                    {/* Compact Fixed Top Area (Basic & Customer Info) */}
                    <div className="sticky top-0 -mx-6 -mt-6 lg:-mx-8 lg:-mt-6 pt-6 px-6 lg:px-8 bg-slate-50 z-40 pb-3">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-3 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-3 min-w-0">
                          <button 
                            onClick={() => setSelectedOrderForDetail(null)}
                            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors shrink-0"
                          >
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                          </button>
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                            <ClipboardList className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">订单编号</div>
                            <div className="text-sm font-bold text-slate-900 truncate">{selectedOrderForDetail.id}</div>
                          </div>
                        </div>

                        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                        <div className="hidden md:grid grid-cols-3 gap-x-8 gap-y-1 flex-1">
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">合同名称</div>
                            <div className="text-xs font-medium text-slate-900 truncate">{selectedOrderForDetail.contract}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">客户名称</div>
                            <div className="text-xs font-medium text-slate-900 truncate">{selectedOrderForDetail.customer}</div>
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
                            <div className="text-sm font-mono font-bold text-blue-600">{selectedOrderForDetail.policyNo}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6 items-start flex-1 mt-4">
                      {/* Main Content Area */}
                      <div className="flex-1 space-y-6 pb-24">
                        {/* 1. 基础信息 & 客户信息 (Read-only Cards) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-500" />
                              基础信息
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold">合同名称</div>
                                <div className="text-sm text-slate-900">{selectedOrderForDetail.contract}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold">订单来源</div>
                                <div className="text-sm text-slate-900">{selectedOrderForDetail.source}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold">签订日期</div>
                                <div className="text-sm text-slate-900">{selectedOrderForDetail.date}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold">保单号</div>
                                <div className="text-sm font-mono text-slate-900">{selectedOrderForDetail.policyNo}</div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-500" />
                              客户信息
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold">客户名称</div>
                                <div className="text-sm text-slate-900">{selectedOrderForDetail.customer}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold">客户代码</div>
                                <div className="text-sm text-slate-900">{selectedOrderForDetail.customerCode || '--'}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold">联系人</div>
                                <div className="text-sm text-slate-900">张经理</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold">联系电话</div>
                                <div className="text-sm text-slate-900">138****8888</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 2. 合同执行状态 (Styled like Case Progress) */}
                        <div className="bg-[#f5f3ff] rounded-2xl border border-purple-100 p-6 shadow-sm">
                          <h3 className="text-lg font-bold text-slate-800 mb-12">合同执行进度</h3>
                          <div className="relative flex justify-between items-center px-12">
                            {/* Connecting Line */}
                            <div className="absolute left-12 right-12 h-1 bg-blue-400 top-1/2 -translate-y-1/2"></div>
                            
                            {/* Steps */}
                            {[
                              { title: '合同签订', detail: '经办人：', name: '王经理' },
                              { title: '系统录入', detail: '执行人：', name: '管理员' },
                              { title: '增价询价单上传', detail: '上传人：', name: '业务员' },
                              { title: '财务审核', detail: '审核人：', name: '财务部' },
                              { title: '执行中', detail: '负责人：', name: '运营部' },
                            ].map((step, index) => {
                              const isActive = index === 2; // Current step: Inquiry upload
                              const isCompleted = index < 2;

                              return (
                                <div key={index} className="relative flex flex-col items-center z-10">
                                  <div className={`absolute -top-8 whitespace-nowrap text-[11px] font-bold ${
                                    isActive || isCompleted ? 'text-blue-600' : 'text-slate-400'
                                  }`}>
                                    {step.title}
                                  </div>
                                  
                                  <div className={`w-5 h-5 rounded-full border-4 border-white shadow-sm transition-colors ${
                                    isActive ? 'bg-blue-500 ring-4 ring-blue-500/20' : 
                                    isCompleted ? 'bg-blue-500' : 'bg-slate-200'
                                  }`}></div>
                                  
                                  <div className="absolute top-8 whitespace-nowrap text-center text-[10px] text-slate-500 leading-tight">
                                    <div>{step.detail}</div>
                                    <div className="font-medium">{step.name}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="h-10"></div>
                        </div>

                        {/* 3. 订单关键信息 (Editable) */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            订单关键信息
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-700">签约价值</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                                <input 
                                  type="text" 
                                  value={orderDetailEdit.contractValue}
                                  onChange={(e) => setOrderDetailEdit({...orderDetailEdit, contractValue: e.target.value})}
                                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-700">实际价值</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                                <input 
                                  type="text" 
                                  value={orderDetailEdit.actualValue}
                                  onChange={(e) => setOrderDetailEdit({...orderDetailEdit, actualValue: e.target.value})}
                                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-700">是否开票</label>
                              <select 
                                value={orderDetailEdit.isInvoiced}
                                onChange={(e) => setOrderDetailEdit({...orderDetailEdit, isInvoiced: e.target.value})}
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                              >
                                <option value="是">是</option>
                                <option value="否">否</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-700">发票类型</label>
                              <select 
                                value={orderDetailEdit.invoiceType}
                                onChange={(e) => setOrderDetailEdit({...orderDetailEdit, invoiceType: e.target.value})}
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                              >
                                <option value="增值税专用发票">增值税专用发票</option>
                                <option value="增值税普通发票">增值税普通发票</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-700">税点</label>
                              <select 
                                value={orderDetailEdit.taxPoint}
                                onChange={(e) => setOrderDetailEdit({...orderDetailEdit, taxPoint: e.target.value})}
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                              >
                                <option value="3%">3%</option>
                                <option value="6%">6%</option>
                                <option value="9%">9%</option>
                                <option value="13%">13%</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* 4. 备注信息 (Moved below Key Info) */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">备注信息</h3>
                          <textarea 
                            placeholder="添加订单备注..."
                            className="w-full h-32 p-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                          />
                          <div className="flex justify-end mt-3">
                            <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                              保存备注
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fixed Bottom Toolbar */}
                    <div className="sticky bottom-0 -mx-6 -mb-6 lg:-mx-8 lg:-mb-6 mt-auto bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-end items-center px-6 lg:px-8 gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                        <Upload className="w-4 h-4" />
                        上传附件
                      </button>
                      <button 
                        onClick={() => setShowInquiryConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        发送问询单
                      </button>
                      <button className="flex items-center gap-2 px-6 py-2 border border-slate-300 bg-white shadow-sm rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                        <Save className="w-4 h-4" />
                        暂存
                      </button>
                      <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 shadow-sm rounded-md text-white font-medium hover:bg-blue-700 transition-colors">
                        <Send className="w-4 h-4" />
                        提交审核
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                {/* Order Filter Section */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <div className="flex flex-wrap gap-x-6 gap-y-5">
                    {/* 综合搜索 */}
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">综合搜索</label>
                      <input 
                        type="text" 
                        placeholder="订单编号/合同名称/客户名称" 
                        value={orderFilter.search}
                        onChange={(e) => setOrderFilter({ ...orderFilter, search: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                      />
                    </div>
                    
                    {/* 订单来源 */}
                    <div className="space-y-1.5 flex-1 min-w-[150px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">订单来源</label>
                      <div className="relative">
                        <select 
                          value={orderFilter.source}
                          onChange={(e) => setOrderFilter({ ...orderFilter, source: e.target.value })}
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

                    {/* 订单状态 */}
                    <div className="space-y-1.5 flex-1 min-w-[150px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">订单状态</label>
                      <div className="relative">
                        <select 
                          value={orderFilter.status}
                          onChange={(e) => setOrderFilter({ ...orderFilter, status: e.target.value })}
                          className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                          <option value="">全部状态</option>
                          <option value="待签署">待签署</option>
                          <option value="已生效">已生效</option>
                          <option value="执行中">执行中</option>
                          <option value="已完成">已完成</option>
                          <option value="已作废">已作废</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex justify-end gap-3">
                    <button 
                      onClick={() => setOrderFilter({ search: '', status: '', source: '' })}
                      className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      重置
                    </button>
                    <button className="px-4 py-1.5 text-sm font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">
                      查询
                    </button>
                  </div>
                </div>

                {/* Order Table Section */}
                <div className="flex flex-col">
                  {/* Table Toolbar */}
                  <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                      {/* Placeholder for other toolbar items if needed */}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-slate-50/50 border-y border-slate-200 text-xs uppercase tracking-wider text-slate-600 font-semibold">
                          <th className="px-4 py-3">订单编号</th>
                          <th className="px-4 py-3">订单来源</th>
                          <th className="px-4 py-3">合同信息</th>
                          <th className="px-4 py-3">客户信息</th>
                          <th className="px-4 py-3">合同价值</th>
                          <th className="px-4 py-3">签订日期</th>
                          <th className="px-4 py-3">状态</th>
                          <th className="px-4 py-3 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredOrders.map((row, idx) => (
                          <tr 
                            key={idx} 
                            onClick={() => setSelectedOrderForDetail(row)}
                            className="hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <td className="px-4 py-3 font-mono text-xs text-slate-900 font-medium">{row.id}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                row.source === '商机转化' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                                {row.source}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-900">{row.contract}</td>
                            <td className="px-4 py-3 text-slate-600">{row.customer}</td>
                            <td className="px-4 py-3 text-emerald-600 font-medium">{row.value}</td>
                            <td className="px-4 py-3 text-slate-500">{row.date}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                row.status === '已生效' || row.status === '执行中' ? 'bg-emerald-100 text-emerald-700' :
                                row.status === '待签署' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">查看</button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrderForClaim(row);
                                    setActiveItem('理赔协助');
                                    setResetKey(prev => prev + 1);
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
                  
                  {/* Pagination */}
                  <div className="py-4 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      显示 <span className="font-medium text-slate-900">1</span> 至 <span className="font-medium text-slate-900">3</span> 条，共 <span className="font-medium text-slate-900">3</span> 条数据
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
        ) : activeItem === '生产计划' ? (
              <>
                {/* Production Plan Filter Section */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <div className="flex flex-wrap gap-x-6 gap-y-5">
                    {/* 综合搜索 */}
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">综合搜索</label>
                      <input 
                        type="text" 
                        value={planFilter.search}
                        onChange={(e) => setPlanFilter({ ...planFilter, search: e.target.value })}
                        placeholder="计划编号/计划名称/生产产品" 
                        className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400"
                      />
                    </div>
                    
                    {/* 计划状态 */}
                    <div className="space-y-1.5 flex-1 min-w-[150px]">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">计划状态</label>
                      <div className="relative">
                        <select 
                          value={planFilter.status}
                          onChange={(e) => setPlanFilter({ ...planFilter, status: e.target.value })}
                          className="w-full appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-300 rounded bg-white hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                          <option value="">全部状态</option>
                          <option value="新增">新增</option>
                          <option value="进行中">进行中</option>
                          <option value="已验收">已验收</option>
                          <option value="已完成">已完成</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex justify-end gap-3">
                    <button 
                      onClick={() => setPlanFilter({ search: '', status: '' })}
                      className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      重置
                    </button>
                    <button className="px-4 py-1.5 text-sm font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">
                      查询
                    </button>
                  </div>
                </div>

                {/* Production Plan Table Section */}
                <div className="flex flex-col">
                  {/* Table Toolbar */}
                  <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                    </div>
                    
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-300 rounded text-slate-600 bg-white hover:bg-slate-50 transition-colors">
                      <Filter className="w-4 h-4 text-slate-400" />
                      筛选
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-slate-50/50 border-y border-slate-200 text-xs uppercase tracking-wider text-slate-600 font-semibold">
                          <th className="px-4 py-3">计划编号</th>
                          <th className="px-4 py-3">计划名称</th>
                          <th className="px-4 py-3">生产产品</th>
                          <th className="px-4 py-3">计划数量</th>
                          <th className="px-4 py-3">开始日期</th>
                          <th className="px-4 py-3">结束日期</th>
                          <th className="px-4 py-3">状态</th>
                          <th className="px-4 py-3 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {productionPlans.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                            <td className="px-4 py-3 font-mono text-xs text-slate-900 font-medium">{row.id}</td>
                            <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                            <td className="px-4 py-3 text-slate-600">{row.product}</td>
                            <td className="px-4 py-3 text-slate-900 font-medium">{row.quantity}</td>
                            <td className="px-4 py-3 text-slate-500">{row.startDate}</td>
                            <td className="px-4 py-3 text-slate-500">{row.endDate}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                row.status === '进行中' ? 'bg-blue-100 text-blue-700' :
                                row.status === '已验收' ? 'bg-emerald-100 text-emerald-700' :
                                row.status === '已完成' ? 'bg-slate-200 text-slate-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">查看</button>
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
                  
                  {/* Pagination */}
                  <div className="py-4 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      显示 <span className="font-medium text-slate-900">1</span> 至 <span className="font-medium text-slate-900">{productionPlans.length}</span> 条，共 <span className="font-medium text-slate-900">{productionPlans.length}</span> 条数据
                    </div>
                    <div className="flex gap-1">
                      <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>上一页</button>
                      <button className="px-3 py-1 border border-slate-900 bg-slate-900 rounded text-sm text-white">1</button>
                      <button className="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>下一页</button>
                    </div>
                  </div>
                </div>
              </>
            ) : activeItem === '理赔协助' ? (
              <div key={resetKey}>
                <ClaimsAssistance 
                  selectedOrder={selectedOrderForClaim}
                  onSubmit={handleClaimsSubmit} 
                />
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

      {/* Inquiry Confirmation Modal */}
      {showInquiryConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">确认发送问询单？</h3>
              <p className="text-sm text-slate-500 mb-6">
                系统将向客户 <span className="font-bold text-slate-900">{selectedOrderForDetail?.customer}</span> 发送订单问询单，请确认操作。
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowInquiryConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    alert('问询单已发送！');
                    setShowInquiryConfirm(false);
                    // Simulate customer receiving the link
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
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  确认发送
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Procurement Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-slate-100 w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-200/50 px-6 py-4 border-b border-slate-300 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-slate-800">采购申请</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Section 1: 基础信息 */}
              <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">基础信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">供应商选择：</label>
                    <select className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                      <option>安易行Co</option>
                      <option>智联科技</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">采购事由：</label>
                    <select className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                      <option>设备采购</option>
                      <option>备件采购</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">采购合同：</label>
                    <select className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                      <option>2026-09-09采购申请</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: 采购详情 (Equipment) */}
              <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">采购详情</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">设备名称：</label>
                    <input type="text" defaultValue="智能辅助设备" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">设备型号：</label>
                    <input type="text" defaultValue="AM365" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">设备单位：</label>
                    <input type="text" defaultValue="套" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">设备分类：</label>
                    <select className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                      <option>成品类</option>
                      <option>半成品类</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: 采购详情 (Pricing) */}
              <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">采购详情</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">采购单价：</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">采购数量：</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">采购总价：</label>
                    <input type="text" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">是否包邮：</label>
                    <select className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                      <option>是</option>
                      <option>否</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-200/50 px-6 py-4 border-t border-slate-300 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                取消
              </button>
              <button className="px-6 py-1.5 text-sm font-medium text-white bg-[#2b90d9] rounded hover:bg-blue-600 transition-colors">
                提交
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Customer Modal */}
      {isAddModalOpen && activeItem === '客户管理' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-slate-100 w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-200/50 px-6 py-4 border-b border-slate-300 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-slate-800">客户信息录入</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Section 1: 基础信息 */}
              <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">基础信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center">
                    <label className="w-28 text-sm text-slate-700 shrink-0">客户名称：</label>
                    <input type="text" placeholder="请输入客户全称" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-28 text-sm text-slate-700 shrink-0">客户属地：</label>
                    <div className="flex-1 flex gap-2">
                      <select className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                        <option>省份</option>
                      </select>
                      <select className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                        <option>城市</option>
                      </select>
                      <select className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                        <option>区县</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-28 text-sm text-slate-700 shrink-0">客户行业：</label>
                    <select className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                      <option>请选择行业</option>
                      <option>物流运输</option>
                      <option>网约车</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-28 text-sm text-slate-700 shrink-0">员工人数：</label>
                    <select className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                      <option>请选择规模</option>
                      <option>0-50人</option>
                      <option>50-200人</option>
                      <option>200-1000人</option>
                      <option>1000人以上</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-28 text-sm text-slate-700 shrink-0">业务线：</label>
                    <select className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                      <option>请选择业务线</option>
                      <option>商用车</option>
                      <option>保险代理</option>
                      <option>配送物流</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: 联系人信息 */}
              <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">联系人信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center">
                    <label className="w-28 text-sm text-slate-700 shrink-0">关键联系人：</label>
                    <input type="text" placeholder="请输入姓名" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-28 text-sm text-slate-700 shrink-0">联系方式：</label>
                    <input type="text" placeholder="请输入手机号或座机" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Section 3: 资质信息 */}
              <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">资质信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center">
                    <label className="w-28 text-sm text-slate-700 shrink-0">营业执照编号：</label>
                    <input type="text" placeholder="请输入统一社会信用代码" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-28 text-sm text-slate-700 shrink-0">营业执照名称：</label>
                    <input type="text" placeholder="请输入执照上的企业名称" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-start md:col-span-2">
                    <label className="w-28 text-sm text-slate-700 shrink-0 mt-2">营业执照图片：</label>
                    <div className="flex-1">
                      <div className="border-2 border-dashed border-slate-300 rounded-md p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer">
                        <Plus className="w-6 h-6 mb-2 text-slate-400" />
                        <span className="text-sm">点击上传图片</span>
                        <span className="text-xs text-slate-400 mt-1">支持 JPG, PNG 格式，最大 5MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-200/50 px-6 py-4 border-t border-slate-300 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                取消
              </button>
              <button 
                onClick={handleAddCustomer}
                className="px-6 py-1.5 text-sm font-medium text-white bg-[#2b90d9] rounded hover:bg-blue-600 transition-colors"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Opportunity Modal */}
      {isAddOpportunityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-slate-100 w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-200/50 px-6 py-4 border-b border-slate-300 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-slate-800">商机信息录入</h3>
              <button onClick={() => setIsAddOpportunityModalOpen(false)} className="text-slate-500 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Section 1: 基础信息 */}
              <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">基础信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center md:col-span-2">
                    <label className="w-24 text-sm text-slate-700 shrink-0">商机名称：</label>
                    <input 
                      type="text" 
                      value={newOpportunity.name}
                      onChange={(e) => setNewOpportunity({ ...newOpportunity, name: e.target.value })}
                      placeholder="请输入商机名称" 
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">商机来源：</label>
                    <select 
                      value={newOpportunity.source}
                      onChange={(e) => setNewOpportunity({ ...newOpportunity, source: e.target.value })}
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option>请选择来源</option>
                      <option>主动开发</option>
                      <option>老客户复购</option>
                      <option>展会获取</option>
                      <option>招投标</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">商机价值：</label>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">¥</span>
                      <input 
                        type="number" 
                        value={newOpportunity.value}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, value: e.target.value })}
                        placeholder="0.00" 
                        className="w-full border border-slate-300 rounded pl-7 pr-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">客户类型：</label>
                    <select 
                      value={newOpportunity.type}
                      onChange={(e) => {
                        setNewOpportunity({ 
                          ...newOpportunity, 
                          type: e.target.value,
                          customerCode: '',
                          customerName: '',
                          businessLine: '',
                          location: '',
                          industry: '',
                          scale: '',
                          contact: '',
                          phone: '',
                        });
                        setSelectedCustomerForOpp(null);
                        setOpportunitySearchTerm('');
                      }}
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option>请选择类型</option>
                      <option>库内客户</option>
                      <option>库外客户</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: 客户信息 */}
              {newOpportunity.type === '库内客户' && (
                <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">客户选择</h4>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="搜索库内客户（名称/编码）" 
                        value={opportunitySearchTerm}
                        onChange={(e) => setOpportunitySearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    {opportunitySearchTerm && !selectedCustomerForOpp && (
                      <div className="border border-slate-200 rounded-md overflow-hidden max-h-48 overflow-y-auto bg-white shadow-lg z-10">
                        {customers.filter(c => 
                          c.name.includes(opportunitySearchTerm) || 
                          c.customerCode.includes(opportunitySearchTerm)
                        ).map(customer => (
                          <div 
                            key={customer.id}
                            onClick={() => {
                              setSelectedCustomerForOpp(customer);
                              setNewOpportunity({
                                ...newOpportunity,
                                customerCode: customer.customerCode,
                                customerName: customer.name,
                                businessLine: customer.businessLine,
                                location: customer.location,
                                industry: customer.industry,
                                scale: customer.scale,
                                contact: customer.contact,
                                phone: customer.phone,
                              });
                              setOpportunitySearchTerm('');
                            }}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-100 last:border-0"
                          >
                            <div className="font-medium text-slate-900">{customer.name}</div>
                            <div className="text-xs text-slate-500">{customer.customerCode} | {customer.industry}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedCustomerForOpp && (
                      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 relative animate-in slide-in-from-top-2 duration-200">
                        <button 
                          onClick={() => {
                            setSelectedCustomerForOpp(null);
                            setNewOpportunity({
                              ...newOpportunity,
                              customerCode: '',
                              customerName: '',
                              businessLine: '',
                              location: '',
                              industry: '',
                              scale: '',
                              contact: '',
                              phone: '',
                            });
                          }}
                          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-slate-500 mb-1">客户编码</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.customerCode}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">客户名称</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.name}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">业务线</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.businessLine}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">属地</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.location}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">行业</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.industry}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">规模</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.scale}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">联系人</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.contact}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">联系方式</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.phone}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {newOpportunity.type === '库外客户' && (
                <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">客户信息录入</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">客户名称：</label>
                      <input 
                        type="text" 
                        value={newOpportunity.customerName}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, customerName: e.target.value })}
                        placeholder="请输入客户名称" 
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">业务线：</label>
                      <select 
                        value={newOpportunity.businessLine}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, businessLine: e.target.value })}
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        <option value="">请选择业务线</option>
                        <option value="商用车">商用车</option>
                        <option value="配送物流">配送物流</option>
                        <option value="乘用车">乘用车</option>
                        <option value="其他">其他</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">属地：</label>
                      <input 
                        type="text" 
                        value={newOpportunity.location}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, location: e.target.value })}
                        placeholder="请输入属地（如：广东省/深圳市）" 
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">行业：</label>
                      <input 
                        type="text" 
                        value={newOpportunity.industry}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, industry: e.target.value })}
                        placeholder="请输入行业" 
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">规模：</label>
                      <select 
                        value={newOpportunity.scale}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, scale: e.target.value })}
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        <option value="">请选择规模</option>
                        <option value="20人以下">20人以下</option>
                        <option value="20-99人">20-99人</option>
                        <option value="100-499人">100-499人</option>
                        <option value="500-999人">500-999人</option>
                        <option value="1000-4999人">1000-4999人</option>
                        <option value="5000-9999人">5000-9999人</option>
                        <option value="10000人以上">10000人以上</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: 联系人信息 */}
              {(newOpportunity.type === '库外客户' || (newOpportunity.type === '库内客户' && selectedCustomerForOpp)) && (
                <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">联系人信息</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">联系人：</label>
                      <input 
                        type="text" 
                        value={newOpportunity.contact}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, contact: e.target.value })}
                        placeholder="请输入姓名" 
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">职务：</label>
                      <input 
                        type="text" 
                        value={newOpportunity.job}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, job: e.target.value })}
                        placeholder="请输入职务" 
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">联系方式：</label>
                      <input 
                        type="text" 
                        value={newOpportunity.phone}
                        onChange={(e) => setNewOpportunity({ ...newOpportunity, phone: e.target.value })}
                        placeholder="请输入手机号或座机" 
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-200/50 px-6 py-4 border-t border-slate-300 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsAddOpportunityModalOpen(false)} className="px-6 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                取消
              </button>
              <button 
                onClick={handleAddOpportunity}
                className="px-6 py-1.5 text-sm font-medium text-white bg-[#2b90d9] rounded hover:bg-blue-600 transition-colors"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Order Modal */}
      {isAddOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-slate-100 w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-200/50 px-6 py-4 border-b border-slate-300 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-slate-800">订单信息录入</h3>
              <button onClick={() => setIsAddOrderModalOpen(false)} className="text-slate-500 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Section 1: 基础信息 */}
              <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">基础信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">订单来源：</label>
                    <select 
                      value={newOrder.source}
                      onChange={(e) => setNewOrder({ ...newOrder, source: e.target.value })}
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option>商机转化</option>
                      <option>续约</option>
                      <option>保险出单</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">关联商机：</label>
                    <select 
                      value={newOrder.opportunityId}
                      onChange={(e) => setNewOrder({ ...newOrder, opportunityId: e.target.value })}
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option value="">请选择关联商机</option>
                      {opportunities.map(opp => (
                        <option key={opp.id} value={opp.id}>{opp.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center md:col-span-2">
                    <label className="w-24 text-sm text-slate-700 shrink-0">合同信息：</label>
                    <input 
                      type="text" 
                      value={newOrder.contract}
                      onChange={(e) => setNewOrder({ ...newOrder, contract: e.target.value })}
                      placeholder="请输入合同名称" 
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">合同价值：</label>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">¥</span>
                      <input 
                        type="number" 
                        value={newOrder.value}
                        onChange={(e) => setNewOrder({ ...newOrder, value: e.target.value })}
                        placeholder="0.00" 
                        className="w-full border border-slate-300 rounded pl-7 pr-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">客户类型：</label>
                    <select 
                      value={newOrder.type}
                      onChange={(e) => {
                        setNewOrder({ 
                          ...newOrder, 
                          type: e.target.value,
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
                      }}
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option>库内客户</option>
                      <option>库外客户</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: 客户信息 */}
              {newOrder.type === '库内客户' && (
                <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">客户选择</h4>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="搜索库内客户（名称/编码）" 
                        value={orderSearchTerm}
                        onChange={(e) => setOrderSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    {orderSearchTerm && !selectedCustomerForOrder && (
                      <div className="border border-slate-200 rounded-md overflow-hidden max-h-48 overflow-y-auto bg-white shadow-lg z-10">
                        {customers.filter(c => 
                          c.name.includes(orderSearchTerm) || 
                          c.customerCode.includes(orderSearchTerm)
                        ).map(customer => (
                          <div 
                            key={customer.id}
                            onClick={() => {
                              setSelectedCustomerForOrder(customer);
                              setNewOrder({
                                ...newOrder,
                                customerCode: customer.customerCode,
                                customerName: customer.name,
                                businessLine: customer.businessLine,
                                location: customer.location,
                                industry: customer.industry,
                                scale: customer.scale,
                                contact: customer.contact,
                                phone: customer.phone,
                              });
                              setOrderSearchTerm('');
                            }}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-100 last:border-0"
                          >
                            <div className="font-medium text-slate-900">{customer.name}</div>
                            <div className="text-xs text-slate-500">{customer.customerCode} | {customer.industry}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedCustomerForOrder && (
                      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 relative animate-in slide-in-from-top-2 duration-200">
                        <button 
                          onClick={() => {
                            setSelectedCustomerForOrder(null);
                            setNewOrder({
                              ...newOrder,
                              customerCode: '',
                              customerName: '',
                              businessLine: '',
                              location: '',
                              industry: '',
                              scale: '',
                              contact: '',
                              phone: '',
                            });
                          }}
                          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-slate-500 mb-1">客户编码</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.customerCode}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">客户名称</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.name}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">业务线</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.businessLine}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">属地</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.location}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">行业</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.industry}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">规模</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.scale}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">联系人</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.contact}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">联系方式</div>
                            <div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.phone}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {newOrder.type === '库外客户' && (
                <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">客户信息录入</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">客户名称：</label>
                      <input 
                        type="text" 
                        value={newOrder.customerName}
                        onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                        placeholder="请输入客户名称" 
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">业务线：</label>
                      <select 
                        value={newOrder.businessLine}
                        onChange={(e) => setNewOrder({ ...newOrder, businessLine: e.target.value })}
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        <option value="">请选择业务线</option>
                        <option value="商用车">商用车</option>
                        <option value="配送物流">配送物流</option>
                        <option value="乘用车">乘用车</option>
                        <option value="其他">其他</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">属地：</label>
                      <input 
                        type="text" 
                        value={newOrder.location}
                        onChange={(e) => setNewOrder({ ...newOrder, location: e.target.value })}
                        placeholder="请输入属地（如：广东省/深圳市）" 
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">行业：</label>
                      <input 
                        type="text" 
                        value={newOrder.industry}
                        onChange={(e) => setNewOrder({ ...newOrder, industry: e.target.value })}
                        placeholder="请输入行业" 
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">规模：</label>
                      <select 
                        value={newOrder.scale}
                        onChange={(e) => setNewOrder({ ...newOrder, scale: e.target.value })}
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        <option value="">请选择规模</option>
                        <option value="20人以下">20人以下</option>
                        <option value="20-99人">20-99人</option>
                        <option value="100-499人">100-499人</option>
                        <option value="500-999人">500-999人</option>
                        <option value="1000-4999人">1000-4999人</option>
                        <option value="5000-9999人">5000-9999人</option>
                        <option value="10000人以上">10000人以上</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">联系人：</label>
                      <input 
                        type="text" 
                        value={newOrder.contact}
                        onChange={(e) => setNewOrder({ ...newOrder, contact: e.target.value })}
                        placeholder="请输入姓名" 
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-slate-700 shrink-0">联系方式：</label>
                      <input 
                        type="text" 
                        value={newOrder.phone}
                        onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                        placeholder="请输入手机号或座机" 
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-200/50 px-6 py-4 border-t border-slate-300 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsAddOrderModalOpen(false)} className="px-6 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                取消
              </button>
              <button 
                onClick={handleAddOrder}
                className="px-6 py-1.5 text-sm font-medium text-white bg-[#2b90d9] rounded hover:bg-blue-600 transition-colors"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Production Plan Modal */}
      {isAddProductionPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-slate-100 w-full max-w-5xl rounded-lg shadow-2xl flex flex-col max-h-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-200/50 px-6 py-4 border-b border-slate-300 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-slate-800">新建生产计划</h3>
              <button onClick={() => setIsAddProductionPlanModalOpen(false)} className="text-slate-500 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Section 1: 基础信息 */}
              <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">基础信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center md:col-span-2">
                    <label className="w-24 text-sm text-slate-700 shrink-0">计划名称：</label>
                    <input 
                      type="text" 
                      value={newProductionPlan.name}
                      onChange={(e) => setNewProductionPlan({ ...newProductionPlan, name: e.target.value })}
                      placeholder="请输入生产计划名称" 
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">生产产品：</label>
                    <select 
                      value={newProductionPlan.product}
                      onChange={(e) => setNewProductionPlan({ ...newProductionPlan, product: e.target.value })}
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option value="">请选择生产产品</option>
                      <option value="智能双视摄像头">智能双视摄像头</option>
                      <option value="冷链物流追踪模块">冷链物流追踪模块</option>
                      <option value="智能调度系统硬件">智能调度系统硬件</option>
                      <option value="DMS驾驶员监控摄像头">DMS驾驶员监控摄像头</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">计划数量：</label>
                    <input 
                      type="number" 
                      value={newProductionPlan.quantity}
                      onChange={(e) => setNewProductionPlan({ ...newProductionPlan, quantity: e.target.value })}
                      placeholder="0" 
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">开始日期：</label>
                    <input 
                      type="date" 
                      value={newProductionPlan.startDate}
                      onChange={(e) => setNewProductionPlan({ ...newProductionPlan, startDate: e.target.value })}
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white" 
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-24 text-sm text-slate-700 shrink-0">结束日期：</label>
                    <input 
                      type="date" 
                      value={newProductionPlan.endDate}
                      onChange={(e) => setNewProductionPlan({ ...newProductionPlan, endDate: e.target.value })}
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white" 
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: 物料表编制 (BOM) */}
              <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-800">生产计划物料表编制</h4>
                  <button className="text-xs bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 px-3 py-1 rounded transition-colors flex items-center gap-1">
                    <Plus className="w-3 h-3" /> 添加物料
                  </button>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 font-semibold">
                        <th className="px-3 py-2">物料编码</th>
                        <th className="px-3 py-2">物料名称</th>
                        <th className="px-3 py-2">规格型号</th>
                        <th className="px-3 py-2 text-right">需求数量</th>
                        <th className="px-3 py-2 text-right">当前库存</th>
                        <th className="px-3 py-2 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      <tr className="hover:bg-slate-50">
                        <td className="px-3 py-2"><input type="text" defaultValue="MAT-001" className="w-20 border border-slate-300 rounded px-2 py-1 text-xs" /></td>
                        <td className="px-3 py-2"><input type="text" defaultValue="主控芯片" className="w-24 border border-slate-300 rounded px-2 py-1 text-xs" /></td>
                        <td className="px-3 py-2"><input type="text" defaultValue="STM32F407" className="w-24 border border-slate-300 rounded px-2 py-1 text-xs" /></td>
                        <td className="px-3 py-2 text-right"><input type="number" defaultValue="500" className="w-16 border border-slate-300 rounded px-2 py-1 text-xs text-right" /></td>
                        <td className="px-3 py-2 text-right text-emerald-600 font-medium">1200</td>
                        <td className="px-3 py-2 text-center">
                          <button className="text-rose-500 hover:text-rose-700"><X className="w-4 h-4 mx-auto" /></button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-3 py-2"><input type="text" defaultValue="MAT-002" className="w-20 border border-slate-300 rounded px-2 py-1 text-xs" /></td>
                        <td className="px-3 py-2"><input type="text" defaultValue="摄像头模组" className="w-24 border border-slate-300 rounded px-2 py-1 text-xs" /></td>
                        <td className="px-3 py-2"><input type="text" defaultValue="1080P/120°" className="w-24 border border-slate-300 rounded px-2 py-1 text-xs" /></td>
                        <td className="px-3 py-2 text-right"><input type="number" defaultValue="1000" className="w-16 border border-slate-300 rounded px-2 py-1 text-xs text-right" /></td>
                        <td className="px-3 py-2 text-right text-amber-600 font-medium">1050</td>
                        <td className="px-3 py-2 text-center">
                          <button className="text-rose-500 hover:text-rose-700"><X className="w-4 h-4 mx-auto" /></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                  提交计划后将自动锁定所需物料库存。
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-200/50 px-6 py-4 border-t border-slate-300 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsAddProductionPlanModalOpen(false)} className="px-6 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                取消
              </button>
              <button onClick={handleAddProductionPlan} className="px-6 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors">
                暂存
              </button>
              <button onClick={handleAddProductionPlan} className="px-6 py-1.5 text-sm font-medium text-white bg-[#2b90d9] rounded hover:bg-blue-600 transition-colors">
                提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
