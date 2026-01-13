import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { McpProvider } from '../types';
import { mockMcpProviders } from '../mockData';

const McpListPage: React.FC = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<McpProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<McpProvider[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{show: boolean, id: string | null}>({show: false, id: null});

  useEffect(() => {
    // 使用 mock 数据
    setProviders(mockMcpProviders);
    setFilteredProviders(mockMcpProviders);
  }, []);

  useEffect(() => {
    let result = providers;
    
    if (selectedStatus) {
      result = result.filter(provider => provider.status === selectedStatus);
    }
    
    if (selectedCategory) {
      result = result.filter(provider => provider.category === selectedCategory);
    }
    
    setFilteredProviders(result);
  }, [selectedStatus, selectedCategory, providers]);

  const handleEdit = (id: string) => {
    navigate(`/mcp-providers/${id}/edit`);
  };

  const handleCreate = () => {
    navigate('/mcp-providers/new');
  };

  const handleDeleteConfirm = (id: string) => {
    setShowDeleteConfirm({show: true, id});
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm({show: false, id: null});
  };

  const handleDelete = () => {
    if (showDeleteConfirm.id) {
      const updatedProviders = providers.filter(provider => provider.mcpId !== showDeleteConfirm.id);
      setProviders(updatedProviders);
      setFilteredProviders(updatedProviders);
      alert('删除成功');
      setShowDeleteConfirm({show: false, id: null});
    }
  };

  const handleToggleStatus = (id: string) => {
    setProviders(providers.map(provider => 
      provider.mcpId === id 
        ? { 
            ...provider, 
            status: provider.status === '启用' ? '停用' : '启用',
            updatedAt: new Date().toISOString()
          } 
        : provider
    ));
    setFilteredProviders(filteredProviders.map(provider => 
      provider.mcpId === id 
        ? { 
            ...provider, 
            status: provider.status === '启用' ? '停用' : '启用',
            updatedAt: new Date().toISOString()
          } 
        : provider
    ));
    alert('状态更新成功');
  };

  const handleTestConnection = (id: string) => {
    // 使用 mock 数据
    const duration = Math.floor(Math.random() * 1000) + 100; // 随机模拟耗时
    console.log('Testing connection for provider:', id); // 使用参数以避免未使用警告
    alert(`连接测试成功，耗时: ${duration}ms`);
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case '学历验证': return 'bg-blue-100 text-blue-800';
      case '身份核验': return 'bg-green-100 text-green-800';
      case '工作经历验证': return 'bg-orange-100 text-orange-800';
      case '自定义': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === '启用' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getAuthTypeColor = (authType: string) => {
    return authType === 'API Key' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-indigo-100 text-indigo-800';
  };

  const getDefaultStatusColor = (isEnabled: boolean) => {
    return isEnabled 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 card-shadow">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">MCP管理</h2>
          <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
            <select
              className="border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
            >
              <option value="">全部状态</option>
              <option value="启用">启用</option>
              <option value="停用">停用</option>
            </select>
            <select
              className="border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">全部类别</option>
              <option value="学历验证">学历验证</option>
              <option value="身份核验">身份核验</option>
              <option value="工作经历验证">工作经历验证</option>
              <option value="自定义">自定义</option>
            </select>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all flex items-center space-x-2"
              onClick={handleCreate}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>新建 MCP 配置</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  服务名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  类别
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  API 地址
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  认证方式
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  默认启用
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  创建人
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredProviders.map((provider) => (
                <tr key={provider.mcpId} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{provider.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(provider.category)}`}>
                      {provider.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                    {provider.endpointUrl}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAuthTypeColor(provider.authType)}`}>
                      {provider.authType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDefaultStatusColor(provider.isEnabledByDefault)}`}>
                      {provider.isEnabledByDefault ? '✅ 是' : '❌ 否'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {provider.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleEdit(provider.mcpId)}
                        title="编辑"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleTestConnection(provider.mcpId)}
                        title="测试连接"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </button>
                      <button
                        className={`${
                          provider.status === '启用' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                        onClick={() => handleToggleStatus(provider.mcpId)}
                        title={provider.status === '启用' ? '停用' : '启用'}
                      >
                        {provider.status === '启用' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteConfirm(provider.mcpId)}
                        title="删除"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 删除确认模态框 */}
      {showDeleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-4">确认删除</h3>
            <p className="text-slate-600 mb-6">确定要删除这个MCP服务吗？此操作不可恢复。</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
                onClick={handleDeleteCancel}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                onClick={handleDelete}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default McpListPage;