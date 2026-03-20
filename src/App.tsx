import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Building2,
  Search,
  Bell,
  Menu,
  ChevronDown,
  Settings,
  Wrench,
  ShieldCheck,
  ClipboardList,
  HeartHandshake,
  Target,
  UserCog,
  LogOut,
} from 'lucide-react';
import ClaimsAssistance from './components/ClaimsAssistance';
import AppraisalClaims from './components/AppraisalClaims';
import AttachmentManager from './components/AttachmentManager';
import InquiryAttachmentManager from './components/InquiryAttachmentManager';
import InquiryForm from './components/InquiryForm';
import LoginScreen from './components/auth/LoginScreen';
import OrganizationManagement from './components/system/OrganizationManagement';
import AccessControlManagement from './components/system/AccessControlManagement';
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
} from './components/sales/SalesModals';

const sidebarGroups = [
  {
    title: '保单管理',
    icon: FileText,
    items: [{ name: '我的保单', icon: FileText, permissions: ['policies.view'] }],
  },
  {
    title: '销售管理',
    icon: TrendingUp,
    items: [
      { name: '询价单管理', icon: ClipboardList, permissions: ['sales.inquiry.view'] },
      { name: '客户管理', icon: HeartHandshake, permissions: ['sales.customer.view'] },
      { name: '商机池管理', icon: Target, permissions: ['sales.opportunity.view'] },
    ],
  },
  {
    title: '理赔工作台',
    icon: LayoutDashboard,
    items: [
      { name: '理赔协助', icon: ShieldCheck, permissions: ['claims.assist.view'] },
      { name: '公估理赔', icon: ShieldCheck, permissions: ['claims.appraisal.view'] },
      { name: '保司审核', icon: ShieldCheck, permissions: ['claims.insurer.view'] },
    ],
  },
  {
    title: '系统管理',
    icon: Settings,
    items: [
      { name: '机构管理', icon: Building2, permissions: ['system.org.view', 'system.org.manage'] },
      { name: '权限管理', icon: UserCog, permissions: ['system.role.view', 'system.role.manage', 'system.user.view', 'system.user.manage'] },
    ],
  },
];

const demoAccounts = [
  { username: 'admin', password: '123456', roleName: '系统管理员', realName: '系统管理员' },
  { username: 'sales.sz', password: '123456', roleName: '销售经理', realName: '深圳销售经理' },
  { username: 'appraisal', password: '123456', roleName: '公估审核员', realName: '公估审核员' },
  { username: 'insurer', password: '123456', roleName: '保司审核员', realName: '保司审核员' },
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
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3002/api';

const parseMoney = (value: string) => Number(value.replace(/[¥,]/g, '')) || 0;

const matchRange = (amount: number, range: string) => {
  if (!range) return true;

  switch (range) {
    case '0-50000':
      return amount >= 0 && amount <= 50000;
    case '50001-100000':
      return amount > 50000 && amount <= 100000;
    case '100001-500000':
      return amount > 100000 && amount <= 500000;
    case '500001-5000000':
      return amount > 500000 && amount <= 5000000;
    case '5000001+':
      return amount > 5000000;
    default:
      return true;
  }
};

type PolicyRow = {
  policyNo: string;
  customerName: string;
  startDate: string;
  endDate: string;
  insurer: string;
  insuranceType: string;
  coverage: string;
  premium: string;
  claimAmount: string;
  reportCount: number;
};

const normalizeAssistRow = (row: any) => ({
  assistNo: row.assist_no,
  relatedCaseNo: row.related_case_no || '',
  policyNo: row.policy_no,
  customerCode: row.customer_code || '',
  customer: row.customer_name || row.insured || '',
  company: row.company || '',
  type: row.insurance_type || '',
  insured: row.insured || '',
  startTime: row.start_time || '',
  endTime: row.end_time || '',
  status: row.status || '',
  latestReviewComment: row.latest_review_comment || '',
  reportTime: row.report_time || '',
  updatedAt: row.updated_at || '',
});

const normalizeCaseRow = (row: any) => ({
  id: row.case_no,
  assistNo: row.assist_no || '',
  policyNo: row.policy_no,
  customerCode: row.customer_code || '',
  insured: row.insured || '',
  company: row.company || '',
  type: row.insurance_type || '',
  status: row.status || '',
  reportTime: row.report_time || '',
  reviewDecision: row.review_decision || '',
  reviewComment: row.review_comment || '',
  reviewTime: row.review_time || '',
  reporter: '理赔协助',
  startTime: '',
  endTime: '',
});

const normalizePolicyRow = (row: any): PolicyRow => ({
  policyNo: row.policy_no,
  customerName: row.customer_name || '',
  startDate: row.start_date || '',
  endDate: row.end_date || '',
  insurer: row.insurer || '',
  insuranceType: row.insurance_type || '',
  coverage: '--',
  premium: '--',
  claimAmount: '--',
  reportCount: 0,
});

export default function App() {
  const query = new URLSearchParams(window.location.search);
  const isMobileInquiryPage = query.get('page') === 'inquiry';
  const isAttachmentPage = query.get('page') === 'attachments';
  const isInquiryAttachmentPage = query.get('page') === 'inquiry-attachments';
  const queryCustomerName = query.get('customerName') || '张三';

  const inquiryNo = query.get('inquiryNo') || '';
  const attachmentAssistNo = query.get('assistNo') || '';

  if (isAttachmentPage) {
    return <AttachmentManager assistNo={attachmentAssistNo} onClose={() => window.close()} />;
  }

  if (isInquiryAttachmentPage) {
    return <InquiryAttachmentManager inquiryNo={inquiryNo} onClose={() => window.close()} />;
  }
  
  if (isMobileInquiryPage) {
    const handleInquirySubmit = (data: any) => {
      // 将数据存储到localStorage，以便主窗口可以读取
      localStorage.setItem(`inquiry_${data.inquiryNo}`, JSON.stringify(data));
      console.log('Inquiry submitted:', data);
    };
    return <InquiryForm 
      customerName={queryCustomerName} 
      inquiryNo={inquiryNo}
      onClose={() => window.close()}
      onSubmitData={handleInquirySubmit}
    />;
  }

  const [activeItem, setActiveItem] = useState('理赔协助');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState('理赔工作台');
  const [resetKey, setResetKey] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [organizationList, setOrganizationList] = useState<any[]>([]);
  const [organizationTree, setOrganizationTree] = useState<any[]>([]);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
  const [permissionList, setPermissionList] = useState<any[]>([]);

  const [customers, setCustomers] = useState(mockCustomerData);
  const [opportunities, setOpportunities] = useState(mockOpportunityData);
  const [orders, setOrders] = useState<any[]>([]);
  const [policies, setPolicies] = useState<PolicyRow[]>([]);
  const [claimAssistPool, setClaimAssistPool] = useState<any[]>([]);
  const [claimsPool, setClaimsPool] = useState<any[]>([]);
  const claimAssistNoSeedRef = useRef(3);
  const appraisalCaseSeedRef = useRef(3);

  const [customerFilter, setCustomerFilter] = useState({
    search: '',
    businessLine: '',
    province: '',
    city: '',
    district: '',
    industry: '',
    scale: '',
  });
  const [opportunityFilter, setOpportunityFilter] = useState({ search: '', status: '', type: '', source: '' });
  const [orderFilter, setOrderFilter] = useState({ search: '', status: '', source: '' });
  const [policyFilter, setPolicyFilter] = useState({
    startDateFrom: '',
    startDateTo: '',
    insurer: '',
    insuranceType: '',
    coverageRange: '',
    claimAmountRange: '',
  });
  const [draftPolicyFilter, setDraftPolicyFilter] = useState({
    startDateFrom: '',
    startDateTo: '',
    insurer: '',
    insuranceType: '',
    coverageRange: '',
    claimAmountRange: '',
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddOpportunityModalOpen, setIsAddOpportunityModalOpen] = useState(false);
  const [showInquiryConfirm, setShowInquiryConfirm] = useState(false);
  const [submittedInquiries, setSubmittedInquiries] = useState<Record<string, any>>({});
  const [selectedPolicyNos, setSelectedPolicyNos] = useState<string[]>([]);
  const [selectedPolicyForDetail, setSelectedPolicyForDetail] = useState<PolicyRow | null>(null);

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
  const [opportunitySearchTerm, setOpportunitySearchTerm] = useState('');
  const [selectedCustomerForOpp, setSelectedCustomerForOpp] = useState<any>(null);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedOrderForClaim, setSelectedOrderForClaim] = useState<any>(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<any>(null);
  const [selectedAppraisalCase, setSelectedAppraisalCase] = useState<any>(null);
  const [orderDetailEdit, setOrderDetailEdit] = useState({
    contractValue: '',
    actualValue: '',
    isInvoiced: '否',
    invoiceType: '增值税专用发票',
    taxPoint: '6%',
  });

  const apiRequest = async (path: string, options?: RequestInit) => {
    const currentUserId = currentUser?.userId || localStorage.getItem('suez_user_id') || '';
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(currentUserId ? { 'X-User-Id': currentUserId } : {}),
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API ${response.status}: ${text}`);
    }

    return response.json();
  };

  const loadSystemBootstrap = async () => {
    const result = await apiRequest('/system/bootstrap');
    const data = result?.data || {};
    setCurrentUser(data.currentUser || null);
    setOrganizationList(data.organizations || []);
    setOrganizationTree(data.organizationTree || []);
    setRoleList(data.roles || []);
    setUserList(data.users || []);
    setPermissionList(data.permissions || []);
  };

  const hasPermission = (permission: string | string[]) => {
    const permissions = Array.isArray(permission) ? permission : [permission];
    const currentPermissions = currentUser?.permissions || [];
    return permissions.some((item) => currentPermissions.includes(item));
  };

  const handleLogin = async ({ username, password }: { username: string; password: string }) => {
    try {
      setAuthLoading(true);
      setAuthError('');
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      const user = result?.data?.user || null;
      const token = result?.data?.token || '';
      if (!user || !token) {
        throw new Error('登录返回无效');
      }
      localStorage.setItem('suez_user_id', token);
      setCurrentUser(user);
      await loadSystemBootstrap();
    } catch (error: any) {
      setAuthError(error?.message || '登录失败');
      localStorage.removeItem('suez_user_id');
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('suez_user_id');
    setCurrentUser(null);
    setOrganizationList([]);
    setOrganizationTree([]);
    setRoleList([]);
    setUserList([]);
    setPermissionList([]);
    setAuthError('');
  };

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

  useEffect(() => {
    const restoreSession = async () => {
      const savedUserId = localStorage.getItem('suez_user_id');
      if (!savedUserId) {
        setAuthLoading(false);
        return;
      }

      try {
        const userResult = await apiRequest('/auth/me', {
          headers: { 'X-User-Id': savedUserId },
        });
        setCurrentUser(userResult?.data || null);
      } catch {
        localStorage.removeItem('suez_user_id');
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const loadBackendClaimsData = async () => {
      if (!currentUser) {
        return;
      }

      try {
        await loadSystemBootstrap();
        const [policyRes, assistRes, casesRes] = await Promise.all([
          hasPermission('policies.view') ? apiRequest('/policies') : Promise.resolve({ data: [] }),
          hasPermission('claims.assist.view') ? apiRequest('/claim-assists') : Promise.resolve({ data: [] }),
          hasPermission(['claims.appraisal.view', 'claims.insurer.view', 'claims.assist.view']) ? apiRequest('/appraisal-cases') : Promise.resolve({ data: [] }),
        ]);

        const policyRows = (policyRes?.data || []).map(normalizePolicyRow);
        const assistRows = (assistRes?.data || []).map(normalizeAssistRow);
        const caseRows = (casesRes?.data || []).map(normalizeCaseRow);

        setPolicies(policyRows);
        setClaimAssistPool(assistRows);
        setClaimsPool(caseRows);
      } catch (error) {
        console.warn('Backend claims data not available, fallback to local state.', error);
      }
    };

    loadBackendClaimsData();
  }, [currentUser]);

  // 监听localStorage中的询价单提交数据
  useEffect(() => {
    const handleStorageChange = () => {
      const newInquiries: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('inquiry_')) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              newInquiries[parsed.inquiryNo] = parsed;
            } catch (e) {
              console.error('Failed to parse inquiry data:', e);
            }
          }
        }
      }
      setSubmittedInquiries(newInquiries);
      setOrders((prev) =>
        prev.map((order) =>
          newInquiries[order.id]
            ? {
                ...order,
                status: '已回填',
              }
            : order,
        ),
      );
    };

    // 初始加载
    handleStorageChange();

    // 监听storage事件
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

  const generateInquiryOrderNo = () => {
    const newNo = `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
    console.log('[generateInquiryOrderNo] Generated:', newNo, 'existing orders count:', orders.length, 'order IDs:', orders.map(o => o.id));
    return newNo;
  };

  const generateCustomerCode = () => {
    const date = new Date();
    const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const existingCodes = new Set(customers.map((item) => item.customerCode).filter(Boolean));
    let seed = 1;
    let nextCode = '';

    do {
      nextCode = `KH${datePart}${String(seed).padStart(3, '0')}`;
      seed += 1;
    } while (existingCodes.has(nextCode));

    return nextCode;
  };

  const openAddOrderDetail = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedOrderForDetail({
      id: generateInquiryOrderNo(),
      customerCode: '',
      policyNo: '',
      source: '商机转化',
      contract: '',
      customer: '',
      province: '',
      city: '',
      district: '',
      industry: '',
      contact: '',
      phone: '',
      value: '',
      date: today,
      status: '已建单',
      isNew: true,
    });
    setOrderDetailEdit({
      contractValue: '',
      actualValue: '',
      isInvoiced: '',
      invoiceType: '10%',
      taxPoint: '一级（低风险）',
    });
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

  const handleOrderDraftSave = (order: any) => {
    const savedOrder = {
      ...order,
      status: order.status || '已建单',
      isNew: false,
    };

    setOrders((prev) => {
      const index = prev.findIndex((item) => item.id === savedOrder.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], ...savedOrder };
        return next;
      }
      return [...prev, savedOrder];
    });

    setSelectedOrderForDetail(savedOrder);
  };

  const handleInquirySendConfirm = () => {
    if (!selectedOrderForDetail) {
      setShowInquiryConfirm(false);
      return;
    }

    console.log('[handleInquirySendConfirm] Sending order:', selectedOrderForDetail.id, 'customer:', selectedOrderForDetail.customer);

    const requiredFields = [
      selectedOrderForDetail.customer,
      selectedOrderForDetail.province,
      selectedOrderForDetail.city,
      selectedOrderForDetail.district,
      selectedOrderForDetail.industry,
      selectedOrderForDetail.contact,
      selectedOrderForDetail.phone,
    ];

    if (requiredFields.some((item) => !item)) {
      alert('请先完整录入客户名称、属地、行业、联系人和联系电话。');
      return;
    }

    const customerCode = selectedOrderForDetail.customerCode || generateCustomerCode();
    const location = `${selectedOrderForDetail.province}/${selectedOrderForDetail.city}/${selectedOrderForDetail.district}`;
    const sentOrder = {
      ...selectedOrderForDetail,
      customerCode,
      status: '已发送',
      isNew: false,
    };

    // 在后端创建 inquiry 记录
    const userId = localStorage.getItem('userId') || 'USER-001';
    fetch('/api/inquiries/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({
        inquiryNo: sentOrder.id,
        customerName: sentOrder.customer,
        customerCode: customerCode,
        formData: {},
      }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error('[handleInquirySendConfirm] Failed to create inquiry in backend');
        }
      })
      .catch((error) => {
        console.error('[handleInquirySendConfirm] Error creating inquiry in backend:', error);
      });

    setOrders((prev) => {
      const index = prev.findIndex((item) => item.id === sentOrder.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], ...sentOrder };
        return next;
      }
      return [...prev, sentOrder];
    });

    setSelectedOrderForDetail(sentOrder);

    setCustomers((prev) => {
      const index = prev.findIndex(
        (item) => item.customerCode === customerCode || (item.name === sentOrder.customer && item.phone === sentOrder.phone),
      );

      const customerRow = {
        id: index >= 0 ? prev[index].id : `CUST-2026-${String(prev.length + 1).padStart(3, '0')}`,
        customerCode,
        name: sentOrder.customer,
        location,
        industry: sentOrder.industry,
        scale: index >= 0 ? prev[index].scale : '待补充',
        contact: sentOrder.contact,
        phone: sentOrder.phone,
        businessLine: index >= 0 ? prev[index].businessLine : '货运险询价',
      };

      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], ...customerRow };
        return next;
      }

      return [...prev, customerRow];
    });

    alert('问询单已发送！');
    setShowInquiryConfirm(false);
    setTimeout(() => {
      if (confirm('客户已收到问询单链接，是否在新的标签页模拟客户手机端填写页面？')) {
        const inquiryUrl = new URL(window.location.href);
        inquiryUrl.searchParams.set('page', 'inquiry');
        inquiryUrl.searchParams.set('customerName', sentOrder.customer);
        inquiryUrl.searchParams.set('inquiryNo', sentOrder.id);
        console.log('[handleInquirySendConfirm] Opening inquiry window with URL params:', {
          page: 'inquiry',
          customerName: sentOrder.customer,
          inquiryNo: sentOrder.id,
          fullUrl: inquiryUrl.toString(),
        });
        window.open(inquiryUrl.toString(), '_blank');
      }
    }, 1000);
  };

  const handleOpenInquiryAttachmentViewer = (orderInquiryNo: string) => {
    if (!orderInquiryNo) {
      return;
    }

    const inquiryAttachmentUrl = new URL(window.location.href);
    inquiryAttachmentUrl.searchParams.set('page', 'inquiry-attachments');
    inquiryAttachmentUrl.searchParams.set('inquiryNo', orderInquiryNo);
    window.open(inquiryAttachmentUrl.toString(), '_blank');
  };

  const generateClaimAssistNo = () => {
    const date = new Date();
    const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    claimAssistNoSeedRef.current += 1;
    return `LAS-${datePart}-${String(claimAssistNoSeedRef.current).padStart(3, '0')}`;
  };

  const generateAppraisalCaseNo = () => {
    const date = new Date();
    const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    appraisalCaseSeedRef.current += 1;
    return `CLM-${datePart}-${String(appraisalCaseSeedRef.current).padStart(3, '0')}`;
  };

  const upsertClaimAssist = (claim: any) => {
    setClaimAssistPool((prev) => {
      const index = prev.findIndex((item) => item.assistNo === claim.assistNo);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], ...claim };
        return next;
      }
      return [...prev, claim];
    });
  };

  const handleClaimDraftSave = (claim: any) => {
    upsertClaimAssist({
      ...claim,
      status: '已暂存',
      updatedAt: new Date().toLocaleString(),
    });

    apiRequest('/claim-assists/save', {
      method: 'POST',
      body: JSON.stringify({
        action: 'draft',
        assistNo: claim.assistNo,
        policyNo: claim.policyNo,
        customerCode: claim.customerCode,
        customerName: claim.customer || claim.insured,
        company: claim.company,
        insuranceType: claim.type,
        insured: claim.insured,
        startTime: claim.startTime,
        endTime: claim.endTime,
        payload: claim,
      }),
    })
      .then((result) => {
        if (result?.data?.assist) {
          upsertClaimAssist(normalizeAssistRow(result.data.assist));
        }
      })
      .catch((error) => {
        console.warn('Draft save API failed, kept local state only.', error);
      });
  };

  const handleClaimsSubmit = (claim: any) => {

    const existingCase = claimsPool.find((item) => item.assistNo === claim.assistNo);
    const relatedCaseNo = existingCase?.id || generateAppraisalCaseNo();

    const submittedAssist = {
      ...claim,
      status: '已提交',
      relatedCaseNo,
      reportTime: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };

    setClaimsPool((prev) => {
      const existedCase = prev.find((item) => item.assistNo === submittedAssist.assistNo);
      if (existedCase) {
        return prev.map((item) =>
          item.assistNo === submittedAssist.assistNo
            ? {
                ...item,
                status: '已提交',
                reviewDecision: '',
                reviewComment: '',
                reviewTime: '',
                reportTime: submittedAssist.reportTime,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          id: relatedCaseNo,
          assistNo: submittedAssist.assistNo,
          customerCode: submittedAssist.customerCode,
          policyNo: submittedAssist.policyNo,
          company: submittedAssist.company,
          type: submittedAssist.type,
          insured: submittedAssist.insured,
          startTime: submittedAssist.startTime,
          endTime: submittedAssist.endTime,
          reporter: '理赔协助',
          reportTime: submittedAssist.reportTime,
          status: '已提交',
        },
      ];
    });

    apiRequest('/claim-assists/save', {
      method: 'POST',
      body: JSON.stringify({
        action: 'submit',
        assistNo: claim.assistNo,
        policyNo: claim.policyNo,
        customerCode: claim.customerCode,
        customerName: claim.customer || claim.insured,
        company: claim.company,
        insuranceType: claim.type,
        insured: claim.insured,
        startTime: claim.startTime,
        endTime: claim.endTime,
        payload: claim,
      }),
    })
      .then((result) => {
        if (result?.data?.assist) {
          upsertClaimAssist(normalizeAssistRow(result.data.assist));
        }
        if (result?.data?.case) {
          setClaimsPool((prev) => {
            const normalized = normalizeCaseRow(result.data.case);
            const idx = prev.findIndex((item) => item.id === normalized.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = { ...next[idx], ...normalized };
              return next;
            }
            return [...prev, normalized];
          });
        }
      })
      .catch((error) => {
        console.warn('Submit API failed, kept local state only.', error);
        // 保留本地状态，让用户看到已提交
      });
  };

  const handleAppraisalCaseOpen = (claimCase: any, reviewStage: 'appraisal' | 'insurer' = 'appraisal') => {
    const nextStatus = reviewStage === 'insurer' ? '审核中' : '公估中';
    setClaimsPool((prev) => prev.map((item) => (item.id === claimCase.id ? { ...item, status: nextStatus } : item)));

    if (claimCase.assistNo) {
      setClaimAssistPool((prev) =>
        prev.map((item) => (item.assistNo === claimCase.assistNo ? { ...item, status: nextStatus, updatedAt: new Date().toLocaleString() } : item)),
      );
    } else {
      setClaimAssistPool((prev) =>
        prev.map((item) => (item.relatedCaseNo === claimCase.id ? { ...item, status: nextStatus, updatedAt: new Date().toLocaleString() } : item)),
      );
    }

    apiRequest(`/appraisal-cases/${claimCase.id}/open`, {
      method: 'POST',
      body: JSON.stringify({ stage: reviewStage }),
    })
      .then((result) => {
        if (result?.data?.case) {
          const normalizedCase = normalizeCaseRow(result.data.case);
          setClaimsPool((prev) => prev.map((item) => (item.id === normalizedCase.id ? { ...item, ...normalizedCase } : item)));
        }
        if (result?.data?.assist) {
          upsertClaimAssist(normalizeAssistRow(result.data.assist));
        }
      })
      .catch((error) => {
        console.warn('Open case API failed, kept local state only.', error);
      });
  };

  const handleAppraisalSubmit = (claimId: string, appraisalData: any, reviewStage: 'appraisal' | 'insurer' = 'appraisal') => {
    let assistNo = '';
    let assistStatus = '';

    if (appraisalData.reviewDecision === 'approve') {
      assistStatus = reviewStage === 'insurer' ? '定损协议通过' : '定损中';
    } else if (appraisalData.reviewDecision === 'reject') {
      assistStatus = reviewStage === 'insurer' ? '审核退回' : '已退回';
    }

    setClaimsPool((prev) =>
      prev.map((claim) => {
        if (claim.id === claimId) {
          assistNo = claim.assistNo || '';
          return {
            ...claim,
            ...appraisalData,
            status: assistStatus || claim.status,
          };
        }
        return claim;
      }),
    );

    if (assistNo && assistStatus) {
      setClaimAssistPool((prev) =>
        prev.map((item) =>
          item.assistNo === assistNo
            ? {
                ...item,
                status: assistStatus,
                latestReviewComment: appraisalData.reviewComment || item.latestReviewComment || '',
                updatedAt: new Date().toLocaleString(),
              }
            : item,
        ),
      );
    } else if (assistStatus) {
      setClaimAssistPool((prev) =>
        prev.map((item) => {
          if (item.relatedCaseNo === claimId) {
            return {
              ...item,
              status: assistStatus,
              latestReviewComment: appraisalData.reviewComment || item.latestReviewComment || '',
              updatedAt: new Date().toLocaleString(),
            };
          }
          return item;
        }),
      );
    }

    const decision = appraisalData.reviewDecision === 'approve' ? 'approve' : appraisalData.reviewDecision === 'reject' ? 'reject' : '';
    if (!decision) {
      return;
    }

    apiRequest(`/appraisal-cases/${claimId}/review`, {
      method: 'POST',
      body: JSON.stringify({ decision, comment: appraisalData.reviewComment || '', stage: reviewStage }),
    })
      .then((result) => {
        if (result?.data?.case) {
          const normalizedCase = normalizeCaseRow(result.data.case);
          setClaimsPool((prev) => prev.map((item) => (item.id === normalizedCase.id ? { ...item, ...normalizedCase } : item)));
        }
        if (result?.data?.assist) {
          upsertClaimAssist(normalizeAssistRow(result.data.assist));
        }
      })
      .catch((error) => {
        console.warn('Review API failed, kept local state only.', error);
      });
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
    const matchesType = !opportunityFilter.type || item.type === opportunityFilter.type;
    const matchesSource = !opportunityFilter.source || item.source === opportunityFilter.source;
    return matchesSearch && matchesStatus && matchesType && matchesSource;
  });

  const filteredOrders = orders.filter((item) => {
    const matchesSearch = item.customer.includes(orderFilter.search) || item.id.includes(orderFilter.search) || item.contract.includes(orderFilter.search);
    const matchesStatus = orderFilter.status === '' || item.status === orderFilter.status;
    const matchesSource = orderFilter.source === '' || item.source === orderFilter.source;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const enrichedPolicies = policies.map((item) => ({
    ...item,
    reportCount: claimsPool.filter((claim) => claim.policyNo === item.policyNo).length,
  }));

  const insurerOptions = Array.from(new Set(enrichedPolicies.map((item) => item.insurer).filter(Boolean)));
  const insuranceTypeOptions = Array.from(new Set(enrichedPolicies.map((item) => item.insuranceType).filter(Boolean)));

  const filteredPolicies = enrichedPolicies.filter((item) => {
    const matchesStartDateFrom = !policyFilter.startDateFrom || item.startDate >= policyFilter.startDateFrom;
    const matchesStartDateTo = !policyFilter.startDateTo || item.startDate <= policyFilter.startDateTo;
    const matchesInsurer = !policyFilter.insurer || item.insurer === policyFilter.insurer;
    const matchesInsuranceType = !policyFilter.insuranceType || item.insuranceType === policyFilter.insuranceType;
    const matchesCoverage = matchRange(parseMoney(item.coverage), policyFilter.coverageRange);
    const matchesClaimAmount = matchRange(parseMoney(item.claimAmount), policyFilter.claimAmountRange);
    return (
      matchesStartDateFrom &&
      matchesStartDateTo &&
      matchesInsurer &&
      matchesInsuranceType &&
      matchesCoverage &&
      matchesClaimAmount
    );
  });

  const currentGroup =
    activeItem === '保单详情'
      ? '保单管理'
      : sidebarGroups.find((group) => group.items.some((item) => item.name === activeItem))?.title || '未知模块';

  const filteredSidebarGroups = sidebarGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(item.permissions)),
    }))
    .filter((group) => group.items.length > 0);

  useEffect(() => {
    if (filteredSidebarGroups.length === 0) {
      return;
    }

    const allVisibleItems = filteredSidebarGroups.flatMap((group) => group.items.map((item) => item.name));
    // '保单详情' 是虚拟路由（点击保单号进入），不在侧边栏列表中，不应被强制重置
    if (activeItem === '保单详情') return;
    if (!allVisibleItems.includes(activeItem)) {
      setActiveItem(allVisibleItems[0]);
      setExpandedGroup(filteredSidebarGroups[0].title);
    }
  }, [currentUser, filteredSidebarGroups, activeItem]);
  const allPoliciesSelected =
    filteredPolicies.length > 0 && filteredPolicies.every((policy) => selectedPolicyNos.includes(policy.policyNo));

  const handleApplyPolicyFilter = () => {
    setPolicyFilter(draftPolicyFilter);
  };

  const handleResetPolicyFilter = () => {
    const emptyPolicyFilter = {
      startDateFrom: '',
      startDateTo: '',
      insurer: '',
      insuranceType: '',
      coverageRange: '',
      claimAmountRange: '',
    };
    setDraftPolicyFilter(emptyPolicyFilter);
    setPolicyFilter(emptyPolicyFilter);
  };

  const refreshSystemData = async () => {
    await loadSystemBootstrap();
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">系统加载中...</div>;
  }

  if (!currentUser) {
    return <LoginScreen demoAccounts={demoAccounts} onLogin={handleLogin} loading={authLoading} error={authError} />;
  }

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
          {filteredSidebarGroups.map((group, idx) => {
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
                <p className="text-sm font-medium text-white truncate">{currentUser.realName}</p>
                <p className="text-xs text-slate-400 truncate">{currentUser.roleName}</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-800"
            >
              <LogOut className="h-3.5 w-3.5" />
              退出登录
            </button>
          )}
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
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8 flex-1 flex flex-col">
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
                canManage={hasPermission('sales.customer.manage')}
              />
            ) : activeItem === '商机池管理' ? (
              <OpportunityManagementView
                opportunityFilter={opportunityFilter}
                setOpportunityFilter={setOpportunityFilter}
                filteredOpportunities={filteredOpportunities}
                onOpenAddOpportunity={openAddOpportunityModal}
                canManage={hasPermission('sales.opportunity.manage')}
              />
            ) : activeItem === '询价单管理' ? (
              <OrderManagementView
                selectedOrderForDetail={selectedOrderForDetail}
                setSelectedOrderForDetail={setSelectedOrderForDetail}
                orderDetailEdit={orderDetailEdit}
                setOrderDetailEdit={setOrderDetailEdit}
                orderFilter={orderFilter}
                setOrderFilter={setOrderFilter}
                filteredOrders={filteredOrders}
                locationData={locationData}
                onOpenAddOrder={openAddOrderDetail}
                onOpenAttachmentViewer={handleOpenInquiryAttachmentViewer}
                onSaveOrderDraft={handleOrderDraftSave}
                onShowInquiryConfirm={() => setShowInquiryConfirm(true)}
                onClaimOrder={(row) => {
                  setSelectedOrderForClaim({
                    ...row,
                    assistNo: generateClaimAssistNo(),
                  });
                  setActiveItem('理赔协助');
                  setResetKey((prev) => prev + 1);
                }}
                submittedInquiries={submittedInquiries}
                canManage={hasPermission('sales.inquiry.manage')}
                canCreateClaim={hasPermission('claims.assist.manage')}
              />
            ) : activeItem === '机构管理' ? (
              <OrganizationManagement
                tree={organizationTree}
                canManage={hasPermission('system.org.manage')}
                onCreate={async (payload) => {
                  await apiRequest('/system/organizations', { method: 'POST', body: JSON.stringify(payload) });
                  await refreshSystemData();
                }}
                onUpdate={async (orgId, payload) => {
                  await apiRequest(`/system/organizations/${orgId}`, { method: 'PATCH', body: JSON.stringify(payload) });
                  await refreshSystemData();
                }}
              />
            ) : activeItem === '权限管理' ? (
              <AccessControlManagement
                roles={roleList}
                users={userList}
                permissions={permissionList}
                organizations={organizationList}
                canManageRoles={hasPermission('system.role.manage')}
                canManageUsers={hasPermission('system.user.manage')}
                onCreateRole={async (payload) => {
                  await apiRequest('/system/roles', { method: 'POST', body: JSON.stringify(payload) });
                  await refreshSystemData();
                }}
                onUpdateRole={async (roleId, payload) => {
                  await apiRequest(`/system/roles/${roleId}`, { method: 'PATCH', body: JSON.stringify(payload) });
                  await refreshSystemData();
                }}
                onCreateUser={async (payload) => {
                  await apiRequest('/system/users', { method: 'POST', body: JSON.stringify(payload) });
                  await refreshSystemData();
                }}
                onUpdateUser={async (userId, payload) => {
                  await apiRequest(`/system/users/${userId}`, { method: 'PATCH', body: JSON.stringify(payload) });
                  await refreshSystemData();
                }}
              />
            ) : activeItem === '我的保单' ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">起始时间</label>
                      <input
                        type="date"
                        value={draftPolicyFilter.startDateFrom}
                        onChange={(event) => setDraftPolicyFilter((prev) => ({ ...prev, startDateFrom: event.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">结束时间</label>
                      <input
                        type="date"
                        value={draftPolicyFilter.startDateTo}
                        onChange={(event) => setDraftPolicyFilter((prev) => ({ ...prev, startDateTo: event.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">保险公司</label>
                      <select
                        value={draftPolicyFilter.insurer}
                        onChange={(event) => setDraftPolicyFilter((prev) => ({ ...prev, insurer: event.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="">全部</option>
                        {insurerOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">险种</label>
                      <select
                        value={draftPolicyFilter.insuranceType}
                        onChange={(event) => setDraftPolicyFilter((prev) => ({ ...prev, insuranceType: event.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="">全部</option>
                        {insuranceTypeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">保额区间</label>
                      <select
                        value={draftPolicyFilter.coverageRange}
                        onChange={(event) => setDraftPolicyFilter((prev) => ({ ...prev, coverageRange: event.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="">全部</option>
                        <option value="0-50000">0 - 50,000</option>
                        <option value="50001-100000">50,001 - 100,000</option>
                        <option value="100001-500000">100,001 - 500,000</option>
                        <option value="500001-5000000">500,001 - 5,000,000</option>
                        <option value="5000001+">5,000,001 以上</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">赔款区间</label>
                      <select
                        value={draftPolicyFilter.claimAmountRange}
                        onChange={(event) => setDraftPolicyFilter((prev) => ({ ...prev, claimAmountRange: event.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="">全部</option>
                        <option value="0-50000">0 - 50,000</option>
                        <option value="50001-100000">50,001 - 100,000</option>
                        <option value="100001-500000">100,001 - 500,000</option>
                        <option value="500001-5000000">500,001 - 5,000,000</option>
                        <option value="5000001+">5,000,001 以上</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleApplyPolicyFilter}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      查询
                    </button>
                    <button
                      type="button"
                      onClick={handleResetPolicyFilter}
                      className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-md hover:bg-slate-50 transition-colors"
                    >
                      重置
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50/60 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-600 font-semibold">
                        <th className="px-4 py-3 w-10">
                          <input
                            type="checkbox"
                            checked={allPoliciesSelected}
                            onChange={(event) => {
                              if (event.target.checked) {
                                setSelectedPolicyNos((prev) =>
                                  Array.from(new Set([...prev, ...filteredPolicies.map((policy) => policy.policyNo)]))
                                );
                              } else {
                                const currentPolicyNos = filteredPolicies.map((policy) => policy.policyNo);
                                setSelectedPolicyNos((prev) => prev.filter((policyNo) => !currentPolicyNos.includes(policyNo)));
                              }
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-4 py-3">保单号</th>
                        <th className="px-4 py-3">客户名称</th>
                        <th className="px-4 py-3">保单起始日期</th>
                        <th className="px-4 py-3">保单终止日期</th>
                        <th className="px-4 py-3">保险公司</th>
                        <th className="px-4 py-3">险种</th>
                        <th className="px-4 py-3">保额</th>
                        <th className="px-4 py-3">保费</th>
                        <th className="px-4 py-3">赔款</th>
                        <th className="px-4 py-3">报案数</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredPolicies.map((policy) => {
                        const checked = selectedPolicyNos.includes(policy.policyNo);
                        return (
                          <tr key={policy.policyNo} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    setSelectedPolicyNos((prev) => [...prev, policy.policyNo]);
                                  } else {
                                    setSelectedPolicyNos((prev) => prev.filter((policyNo) => policyNo !== policy.policyNo));
                                  }
                                }}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-900">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPolicyForDetail(policy);
                                  setActiveItem('保单详情');
                                }}
                                className="text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                {policy.policyNo}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-slate-700">{policy.customerName}</td>
                            <td className="px-4 py-3 text-slate-600">{policy.startDate}</td>
                            <td className="px-4 py-3 text-slate-600">{policy.endDate}</td>
                            <td className="px-4 py-3 text-slate-700">{policy.insurer}</td>
                            <td className="px-4 py-3 text-slate-700">{policy.insuranceType}</td>
                            <td className="px-4 py-3 text-slate-700">{policy.coverage}</td>
                            <td className="px-4 py-3 text-slate-700">{policy.premium}</td>
                            <td className="px-4 py-3 text-rose-600">{policy.claimAmount}</td>
                            <td className="px-4 py-3 text-slate-700">{policy.reportCount}</td>
                          </tr>
                        );
                      })}
                      {filteredPolicies.length === 0 && (
                        <tr>
                          <td colSpan={11} className="px-4 py-10 text-center text-sm text-slate-500">
                            当前筛选条件下暂无保单数据
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeItem === '保单详情' ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">保单详情</h3>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedPolicyForDetail) return;
                        setSelectedOrderForClaim({
                          customerCode: '',
                          policyNo: selectedPolicyForDetail.policyNo,
                          customer: selectedPolicyForDetail.customerName,
                          assistNo: generateClaimAssistNo(),
                        });
                        setActiveItem('理赔协助');
                        setResetKey((prev) => prev + 1);
                      }}
                      disabled={!selectedPolicyForDetail}
                      className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      新增理赔
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveItem('我的保单')}
                      className="px-3 py-2 text-xs font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      返回我的保单
                    </button>
                  </div>
                </div>

                {!selectedPolicyForDetail ? (
                  <div className="px-6 py-12 text-center text-sm text-slate-500">未选择保单，请从我的保单列表点击保单号进入详情。</div>
                ) : (
                  <div className="p-6 space-y-8">
                    {(() => {
                      const policyClaimRecords = [...claimsPool]
                        .filter((item) => item.policyNo === selectedPolicyForDetail.policyNo)
                        .filter((item, index, arr) => arr.findIndex((other) => other.id === item.id) === index)
                        .sort((a, b) => (b.reportTime || '').localeCompare(a.reportTime || ''));

                      return (
                        <>
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-4 rounded-full bg-blue-500"></span>
                        <h4 className="text-sm font-semibold text-slate-900">基础信息</h4>
                      </div>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-sm">
                          <div className="px-4 py-3 border-b border-slate-200 lg:border-r bg-slate-50 text-slate-500">保单号</div>
                          <div className="px-4 py-3 border-b border-slate-200 lg:col-span-2 font-mono text-slate-900">{selectedPolicyForDetail.policyNo}</div>

                          <div className="px-4 py-3 border-b border-slate-200 lg:border-r bg-slate-50 text-slate-500">客户名称</div>
                          <div className="px-4 py-3 border-b border-slate-200 lg:col-span-2 text-slate-900">{selectedPolicyForDetail.customerName}</div>

                          <div className="px-4 py-3 border-b border-slate-200 lg:border-r bg-slate-50 text-slate-500">保险公司</div>
                          <div className="px-4 py-3 border-b border-slate-200 text-slate-900">{selectedPolicyForDetail.insurer}</div>
                          <div className="px-4 py-3 border-b border-slate-200 lg:border-l text-slate-900">{selectedPolicyForDetail.insuranceType}</div>

                          <div className="px-4 py-3 lg:border-r bg-slate-50 text-slate-500">保障期间</div>
                          <div className="px-4 py-3 text-slate-900">{selectedPolicyForDetail.startDate}</div>
                          <div className="px-4 py-3 lg:border-l text-slate-900">{selectedPolicyForDetail.endDate}</div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-4 rounded-full bg-blue-500"></span>
                        <h4 className="text-sm font-semibold text-slate-900">理赔与费用概览</h4>
                      </div>
                      <div className="border border-slate-200 rounded-lg overflow-x-auto">
                        <table className="w-full text-sm whitespace-nowrap">
                          <thead className="bg-slate-50 text-slate-500">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium">保额</th>
                              <th className="px-4 py-3 text-left font-medium">保费</th>
                              <th className="px-4 py-3 text-left font-medium">累计赔款</th>
                              <th className="px-4 py-3 text-left font-medium">报案数</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-slate-200 text-slate-900">
                              <td className="px-4 py-3 font-semibold">{selectedPolicyForDetail.coverage}</td>
                              <td className="px-4 py-3">{selectedPolicyForDetail.premium}</td>
                              <td className="px-4 py-3 text-rose-600 font-semibold">{selectedPolicyForDetail.claimAmount}</td>
                              <td className="px-4 py-3">{selectedPolicyForDetail.reportCount} 次</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-4 rounded-full bg-blue-500"></span>
                          <h4 className="text-sm font-semibold text-slate-900">该保单下理赔案件记录</h4>
                        </div>
                        <span className="text-xs text-slate-500">共 {policyClaimRecords.length} 条</span>
                      </div>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 text-slate-500">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium">案件号</th>
                              <th className="px-4 py-3 text-left font-medium">报案时间</th>
                              <th className="px-4 py-3 text-left font-medium">状态</th>
                              <th className="px-4 py-3 text-left font-medium">报案人</th>
                              <th className="px-4 py-3 text-right font-medium">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {policyClaimRecords.map((claim) => (
                              <tr key={claim.id} className="border-t border-slate-200 hover:bg-slate-50">
                                <td className="px-4 py-3 font-mono text-slate-900">{claim.id}</td>
                                <td className="px-4 py-3 text-slate-700">{claim.reportTime || '--'}</td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    claim.status === '已提交' ? 'bg-amber-100 text-amber-700' :
                                    claim.status === '公估中' || claim.status === '审核中' ? 'bg-blue-100 text-blue-700' :
                                    claim.status === '定损中' || claim.status === '定损协议通过' ? 'bg-emerald-100 text-emerald-700' :
                                    claim.status === '已退回' || claim.status === '审核退回' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {claim.status || '--'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{claim.reporter || '--'}</td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedAppraisalCase(claim);
                                      setActiveItem('公估理赔');
                                      setResetKey((prev) => prev + 1);
                                    }}
                                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                                  >
                                    查看详情
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {policyClaimRecords.length === 0 && (
                              <tr className="border-t border-slate-200">
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                  当前保单暂无理赔案件记录
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </section>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            ) : activeItem === '理赔协助' ? (
              <div key={resetKey}>
                <ClaimsAssistance
                  selectedOrder={selectedOrderForClaim}
                  claimAssistPool={claimAssistPool}
                  appraisalCases={claimsPool}
                  onDraftSave={handleClaimDraftSave}
                  onSubmit={handleClaimsSubmit}
                  canManage={hasPermission('claims.assist.manage')}
                  canSubmit={hasPermission('claims.assist.submit')}
                />
              </div>
            ) : activeItem === '公估理赔' ? (
              <div key={resetKey}>
                <AppraisalClaims
                  claimsPool={claimsPool}
                  onCaseOpen={handleAppraisalCaseOpen}
                  onAppraisalSubmit={handleAppraisalSubmit}
                  initialSelectedCase={selectedAppraisalCase}
                  onInitialSelectedCaseConsumed={() => setSelectedAppraisalCase(null)}
                  reviewStage="appraisal"
                  canReview={hasPermission('claims.appraisal.review')}
                />
              </div>
            ) : activeItem === '保司审核' ? (
              <div key={resetKey}>
                <AppraisalClaims
                  claimsPool={claimsPool}
                  onCaseOpen={handleAppraisalCaseOpen}
                  onAppraisalSubmit={handleAppraisalSubmit}
                  initialSelectedCase={selectedAppraisalCase}
                  onInitialSelectedCaseConsumed={() => setSelectedAppraisalCase(null)}
                  reviewStage="insurer"
                  canReview={hasPermission('claims.insurer.review')}
                />
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
        onConfirm={handleInquirySendConfirm}
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

    </div>
  );
}
