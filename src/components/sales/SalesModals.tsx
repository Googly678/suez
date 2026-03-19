import React from 'react';
import { Plus, X, Search, Mail } from 'lucide-react';

interface InquiryConfirmModalProps {
  isOpen: boolean;
  customerName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function InquiryConfirmModal({ isOpen, customerName, onClose, onConfirm }: InquiryConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">确认发送问询单？</h3>
          <p className="text-sm text-slate-500 mb-6">
            系统将向客户 <span className="font-bold text-slate-900">{customerName}</span> 发送订单问询单，请确认操作。
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              取消
            </button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              确认发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AddCustomerModalProps {
  isOpen: boolean;
  newCustomer: any;
  setNewCustomer: React.Dispatch<React.SetStateAction<any>>;
  availableCities: string[];
  availableDistricts: string[];
  onClose: () => void;
  onSubmit: () => void;
}

export function AddCustomerModal({
  isOpen,
  newCustomer,
  setNewCustomer,
  availableCities,
  availableDistricts,
  onClose,
  onSubmit,
}: AddCustomerModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-slate-100 w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-200/50 px-6 py-4 border-b border-slate-300 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-bold text-slate-800">客户信息录入</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-4">基础信息</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center">
                <label className="w-28 text-sm text-slate-700 shrink-0">客户名称：</label>
                <input type="text" value={newCustomer.name} onChange={(event) => setNewCustomer({ ...newCustomer, name: event.target.value })} placeholder="请输入客户全称" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="flex items-center">
                <label className="w-28 text-sm text-slate-700 shrink-0">客户属地：</label>
                <div className="flex-1 flex gap-2">
                  <select value={newCustomer.province} onChange={(event) => setNewCustomer({ ...newCustomer, province: event.target.value, city: '', district: '' })} className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                    <option value="">省份</option>
                    <option value="北京市">北京市</option>
                    <option value="广东省">广东省</option>
                    <option value="上海市">上海市</option>
                    <option value="浙江省">浙江省</option>
                  </select>
                  <select value={newCustomer.city} onChange={(event) => setNewCustomer({ ...newCustomer, city: event.target.value, district: '' })} disabled={!newCustomer.province} className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-slate-50">
                    <option value="">城市</option>
                    {availableCities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                  <select value={newCustomer.district} onChange={(event) => setNewCustomer({ ...newCustomer, district: event.target.value })} disabled={!newCustomer.city} className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-slate-50">
                    <option value="">区县</option>
                    {availableDistricts.map((district) => <option key={district} value={district}>{district}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-28 text-sm text-slate-700 shrink-0">客户行业：</label>
                <select value={newCustomer.industry} onChange={(event) => setNewCustomer({ ...newCustomer, industry: event.target.value })} className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                  <option value="">请选择行业</option>
                  <option value="物流运输">物流运输</option>
                  <option value="网约车">网约车</option>
                  <option value="公共交通">公共交通</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-28 text-sm text-slate-700 shrink-0">员工人数：</label>
                <select value={newCustomer.scale} onChange={(event) => setNewCustomer({ ...newCustomer, scale: event.target.value })} className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                  <option value="">请选择规模</option>
                  <option value="0-50人">0-50人</option>
                  <option value="50-200人">50-200人</option>
                  <option value="200-1000人">200-1000人</option>
                  <option value="1000人以上">1000人以上</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-28 text-sm text-slate-700 shrink-0">业务线：</label>
                <select value={newCustomer.businessLine} onChange={(event) => setNewCustomer({ ...newCustomer, businessLine: event.target.value })} className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                  <option value="">请选择业务线</option>
                  <option value="商用车">商用车</option>
                  <option value="保险代理">保险代理</option>
                  <option value="配送物流">配送物流</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-4">联系人信息</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center">
                <label className="w-28 text-sm text-slate-700 shrink-0">关键联系人：</label>
                <input type="text" value={newCustomer.contact} onChange={(event) => setNewCustomer({ ...newCustomer, contact: event.target.value })} placeholder="请输入姓名" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="flex items-center">
                <label className="w-28 text-sm text-slate-700 shrink-0">联系方式：</label>
                <input type="text" value={newCustomer.phone} onChange={(event) => setNewCustomer({ ...newCustomer, phone: event.target.value })} placeholder="请输入手机号或座机" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>

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

        <div className="bg-slate-200/50 px-6 py-4 border-t border-slate-300 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
            取消
          </button>
          <button onClick={onSubmit} className="px-6 py-1.5 text-sm font-medium text-white bg-[#2b90d9] rounded hover:bg-blue-600 transition-colors">
            提交
          </button>
        </div>
      </div>
    </div>
  );
}

interface AddOpportunityModalProps {
  isOpen: boolean;
  newOpportunity: any;
  setNewOpportunity: React.Dispatch<React.SetStateAction<any>>;
  opportunitySearchTerm: string;
  setOpportunitySearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedCustomerForOpp: any;
  setSelectedCustomerForOpp: React.Dispatch<React.SetStateAction<any>>;
  customers: any[];
  onClose: () => void;
  onSubmit: () => void;
}

export function AddOpportunityModal({
  isOpen,
  newOpportunity,
  setNewOpportunity,
  opportunitySearchTerm,
  setOpportunitySearchTerm,
  selectedCustomerForOpp,
  setSelectedCustomerForOpp,
  customers,
  onClose,
  onSubmit,
}: AddOpportunityModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-slate-100 w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-200/50 px-6 py-4 border-b border-slate-300 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-bold text-slate-800">商机信息录入</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-4">基础信息</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center md:col-span-2">
                <label className="w-24 text-sm text-slate-700 shrink-0">商机名称：</label>
                <input type="text" value={newOpportunity.name} onChange={(event) => setNewOpportunity({ ...newOpportunity, name: event.target.value })} placeholder="请输入商机名称" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="flex items-center">
                <label className="w-24 text-sm text-slate-700 shrink-0">商机来源：</label>
                <select value={newOpportunity.source} onChange={(event) => setNewOpportunity({ ...newOpportunity, source: event.target.value })} className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
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
                  <input type="number" value={newOpportunity.value} onChange={(event) => setNewOpportunity({ ...newOpportunity, value: event.target.value })} placeholder="0.00" className="w-full border border-slate-300 rounded pl-7 pr-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-24 text-sm text-slate-700 shrink-0">客户类型：</label>
                <select value={newOpportunity.type} onChange={(event) => {
                  setNewOpportunity({ ...newOpportunity, type: event.target.value, customerCode: '', customerName: '', businessLine: '', location: '', industry: '', scale: '', contact: '', phone: '' });
                  setSelectedCustomerForOpp(null);
                  setOpportunitySearchTerm('');
                }} className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                  <option>请选择类型</option>
                  <option>库内客户</option>
                  <option>库外客户</option>
                </select>
              </div>
            </div>
          </div>

          {newOpportunity.type === '库内客户' && (
            <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-4">客户选择</h4>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" placeholder="搜索库内客户（名称/编码）" value={opportunitySearchTerm} onChange={(event) => setOpportunitySearchTerm(event.target.value)} className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                {opportunitySearchTerm && !selectedCustomerForOpp && (
                  <div className="border border-slate-200 rounded-md overflow-hidden max-h-48 overflow-y-auto bg-white shadow-lg z-10">
                    {customers.filter((customer) => customer.name.includes(opportunitySearchTerm) || customer.customerCode.includes(opportunitySearchTerm)).map((customer) => (
                      <div key={customer.id} onClick={() => {
                        setSelectedCustomerForOpp(customer);
                        setNewOpportunity({ ...newOpportunity, customerCode: customer.customerCode, customerName: customer.name, businessLine: customer.businessLine, location: customer.location, industry: customer.industry, scale: customer.scale, contact: customer.contact, phone: customer.phone });
                        setOpportunitySearchTerm('');
                      }} className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-100 last:border-0">
                        <div className="font-medium text-slate-900">{customer.name}</div>
                        <div className="text-xs text-slate-500">{customer.customerCode} | {customer.industry}</div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedCustomerForOpp && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 relative animate-in slide-in-from-top-2 duration-200">
                    <button onClick={() => {
                      setSelectedCustomerForOpp(null);
                      setNewOpportunity({ ...newOpportunity, customerCode: '', customerName: '', businessLine: '', location: '', industry: '', scale: '', contact: '', phone: '' });
                    }} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div><div className="text-xs text-slate-500 mb-1">客户编码</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.customerCode}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">客户名称</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.name}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">业务线</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.businessLine}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">属地</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.location}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">行业</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.industry}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">规模</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.scale}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">联系人</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.contact}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">联系方式</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOpp.phone}</div></div>
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
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">客户名称：</label><input type="text" value={newOpportunity.customerName} onChange={(event) => setNewOpportunity({ ...newOpportunity, customerName: event.target.value })} placeholder="请输入客户名称" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">业务线：</label><select value={newOpportunity.businessLine} onChange={(event) => setNewOpportunity({ ...newOpportunity, businessLine: event.target.value })} className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"><option value="">请选择业务线</option><option value="商用车">商用车</option><option value="配送物流">配送物流</option><option value="乘用车">乘用车</option><option value="其他">其他</option></select></div>
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">属地：</label><input type="text" value={newOpportunity.location} onChange={(event) => setNewOpportunity({ ...newOpportunity, location: event.target.value })} placeholder="请输入属地（如：广东省/深圳市）" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">行业：</label><input type="text" value={newOpportunity.industry} onChange={(event) => setNewOpportunity({ ...newOpportunity, industry: event.target.value })} placeholder="请输入行业" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">规模：</label><select value={newOpportunity.scale} onChange={(event) => setNewOpportunity({ ...newOpportunity, scale: event.target.value })} className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"><option value="">请选择规模</option><option value="20人以下">20人以下</option><option value="20-99人">20-99人</option><option value="100-499人">100-499人</option><option value="500-999人">500-999人</option><option value="1000-4999人">1000-4999人</option><option value="5000-9999人">5000-9999人</option><option value="10000人以上">10000人以上</option></select></div>
              </div>
            </div>
          )}

          {(newOpportunity.type === '库外客户' || (newOpportunity.type === '库内客户' && selectedCustomerForOpp)) && (
            <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-4">联系人信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">联系人：</label><input type="text" value={newOpportunity.contact} onChange={(event) => setNewOpportunity({ ...newOpportunity, contact: event.target.value })} placeholder="请输入姓名" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">职务：</label><input type="text" value={newOpportunity.job} onChange={(event) => setNewOpportunity({ ...newOpportunity, job: event.target.value })} placeholder="请输入职务" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">联系方式：</label><input type="text" value={newOpportunity.phone} onChange={(event) => setNewOpportunity({ ...newOpportunity, phone: event.target.value })} placeholder="请输入手机号或座机" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-200/50 px-6 py-4 border-t border-slate-300 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">取消</button>
          <button onClick={onSubmit} className="px-6 py-1.5 text-sm font-medium text-white bg-[#2b90d9] rounded hover:bg-blue-600 transition-colors">提交</button>
        </div>
      </div>
    </div>
  );
}

interface AddOrderModalProps {
  isOpen: boolean;
  newOrder: any;
  setNewOrder: React.Dispatch<React.SetStateAction<any>>;
  orderSearchTerm: string;
  setOrderSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedCustomerForOrder: any;
  setSelectedCustomerForOrder: React.Dispatch<React.SetStateAction<any>>;
  customers: any[];
  opportunities: any[];
  onClose: () => void;
  onSubmit: () => void;
}

export function AddOrderModal({
  isOpen,
  newOrder,
  setNewOrder,
  orderSearchTerm,
  setOrderSearchTerm,
  selectedCustomerForOrder,
  setSelectedCustomerForOrder,
  customers,
  opportunities,
  onClose,
  onSubmit,
}: AddOrderModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-slate-100 w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-200/50 px-6 py-4 border-b border-slate-300 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-bold text-slate-800">订单信息录入</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-4">基础信息</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center">
                <label className="w-24 text-sm text-slate-700 shrink-0">订单来源：</label>
                <select value={newOrder.source} onChange={(event) => setNewOrder({ ...newOrder, source: event.target.value })} className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                  <option>商机转化</option>
                  <option>续约</option>
                  <option>保险出单</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="w-24 text-sm text-slate-700 shrink-0">关联商机：</label>
                <select value={newOrder.opportunityId} onChange={(event) => setNewOrder({ ...newOrder, opportunityId: event.target.value })} className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                  <option value="">请选择关联商机</option>
                  {opportunities.map((opp) => <option key={opp.id} value={opp.id}>{opp.name}</option>)}
                </select>
              </div>
              <div className="flex items-center md:col-span-2">
                <label className="w-24 text-sm text-slate-700 shrink-0">合同信息：</label>
                <input type="text" value={newOrder.contract} onChange={(event) => setNewOrder({ ...newOrder, contract: event.target.value })} placeholder="请输入合同名称" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="flex items-center">
                <label className="w-24 text-sm text-slate-700 shrink-0">合同价值：</label>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">¥</span>
                  <input type="number" value={newOrder.value} onChange={(event) => setNewOrder({ ...newOrder, value: event.target.value })} placeholder="0.00" className="w-full border border-slate-300 rounded pl-7 pr-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-24 text-sm text-slate-700 shrink-0">客户类型：</label>
                <select value={newOrder.type} onChange={(event) => {
                  setNewOrder({ ...newOrder, type: event.target.value, customerCode: '', customerName: '', businessLine: '', location: '', industry: '', scale: '', contact: '', phone: '' });
                  setSelectedCustomerForOrder(null);
                  setOrderSearchTerm('');
                }} className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                  <option>库内客户</option>
                  <option>库外客户</option>
                </select>
              </div>
            </div>
          </div>

          {newOrder.type === '库内客户' && (
            <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-4">客户选择</h4>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="text" placeholder="搜索库内客户（名称/编码）" value={orderSearchTerm} onChange={(event) => setOrderSearchTerm(event.target.value)} className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                {orderSearchTerm && !selectedCustomerForOrder && (
                  <div className="border border-slate-200 rounded-md overflow-hidden max-h-48 overflow-y-auto bg-white shadow-lg z-10">
                    {customers.filter((customer) => customer.name.includes(orderSearchTerm) || customer.customerCode.includes(orderSearchTerm)).map((customer) => (
                      <div key={customer.id} onClick={() => {
                        setSelectedCustomerForOrder(customer);
                        setNewOrder({ ...newOrder, customerCode: customer.customerCode, customerName: customer.name, businessLine: customer.businessLine, location: customer.location, industry: customer.industry, scale: customer.scale, contact: customer.contact, phone: customer.phone });
                        setOrderSearchTerm('');
                      }} className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-slate-100 last:border-0">
                        <div className="font-medium text-slate-900">{customer.name}</div>
                        <div className="text-xs text-slate-500">{customer.customerCode} | {customer.industry}</div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedCustomerForOrder && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 relative animate-in slide-in-from-top-2 duration-200">
                    <button onClick={() => {
                      setSelectedCustomerForOrder(null);
                      setNewOrder({ ...newOrder, customerCode: '', customerName: '', businessLine: '', location: '', industry: '', scale: '', contact: '', phone: '' });
                    }} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div><div className="text-xs text-slate-500 mb-1">客户编码</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.customerCode}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">客户名称</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.name}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">业务线</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.businessLine}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">属地</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.location}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">行业</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.industry}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">规模</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.scale}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">联系人</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.contact}</div></div>
                      <div><div className="text-xs text-slate-500 mb-1">联系方式</div><div className="text-sm font-medium text-slate-900">{selectedCustomerForOrder.phone}</div></div>
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
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">客户名称：</label><input type="text" value={newOrder.customerName} onChange={(event) => setNewOrder({ ...newOrder, customerName: event.target.value })} placeholder="请输入客户名称" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">业务线：</label><select value={newOrder.businessLine} onChange={(event) => setNewOrder({ ...newOrder, businessLine: event.target.value })} className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"><option value="">请选择业务线</option><option value="商用车">商用车</option><option value="配送物流">配送物流</option><option value="乘用车">乘用车</option><option value="其他">其他</option></select></div>
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">属地：</label><input type="text" value={newOrder.location} onChange={(event) => setNewOrder({ ...newOrder, location: event.target.value })} placeholder="请输入属地（如：广东省/深圳市）" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">行业：</label><input type="text" value={newOrder.industry} onChange={(event) => setNewOrder({ ...newOrder, industry: event.target.value })} placeholder="请输入行业" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">规模：</label><select value={newOrder.scale} onChange={(event) => setNewOrder({ ...newOrder, scale: event.target.value })} className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"><option value="">请选择规模</option><option value="20人以下">20人以下</option><option value="20-99人">20-99人</option><option value="100-499人">100-499人</option><option value="500-999人">500-999人</option><option value="1000-4999人">1000-4999人</option><option value="5000-9999人">5000-9999人</option><option value="10000人以上">10000人以上</option></select></div>
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">联系人：</label><input type="text" value={newOrder.contact} onChange={(event) => setNewOrder({ ...newOrder, contact: event.target.value })} placeholder="请输入姓名" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
                <div className="flex items-center"><label className="w-24 text-sm text-slate-700 shrink-0">联系方式：</label><input type="text" value={newOrder.phone} onChange={(event) => setNewOrder({ ...newOrder, phone: event.target.value })} placeholder="请输入手机号或座机" className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" /></div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-200/50 px-6 py-4 border-t border-slate-300 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">取消</button>
          <button onClick={onSubmit} className="px-6 py-1.5 text-sm font-medium text-white bg-[#2b90d9] rounded hover:bg-blue-600 transition-colors">提交</button>
        </div>
      </div>
    </div>
  );
}
