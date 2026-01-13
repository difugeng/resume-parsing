import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeExportTemplate } from '../types';
import { mockResumeTemplates } from '../mockData';

// 模板列表页面
const TemplateListPage: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ResumeExportTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ResumeExportTemplate[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedFormatType, setSelectedFormatType] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    // 使用 mock 数据
    setTemplates(mockResumeTemplates);
    setFilteredTemplates(mockResumeTemplates);
  }, []);

  useEffect(() => {
    let result = templates;
    
    if (selectedStatus) {
      result = result.filter(template => template.status === selectedStatus);
    }
    
    if (selectedFormatType) {
      result = result.filter(template => template.formatType === selectedFormatType);
    }
    
    setFilteredTemplates(result);
  }, [selectedStatus, selectedFormatType, templates]);

  const handleEdit = (id: string) => {
    navigate(`/templates/${id}/edit`);
  };

  const handleCreate = () => {
    navigate('/templates/new');
  };

  const handleDeleteConfirm = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const handleDelete = (id: string) => {
    // 使用 mock 数据
    const updatedTemplates = templates.filter(template => template.templateId !== id);
    setTemplates(updatedTemplates);
    setFilteredTemplates(updatedTemplates);
    alert('删除成功');
    setShowDeleteConfirm(null);
  };

  const handleCopy = (template: ResumeExportTemplate) => {
    // 使用 mock 数据
    const newTemplate: ResumeExportTemplate = {
      ...template,
      templateId: `copy_${template.templateId}_${Date.now()}`,
      name: `${template.name}_副本`,
      status: '停用', // 复制的模板默认为停用状态
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
    setFilteredTemplates([...filteredTemplates, newTemplate]);
    alert('模板复制成功');
  };

  const handleToggleStatus = (id: string) => {
    // 使用 mock 数据
    setTemplates(templates.map(template => 
      template.templateId === id 
        ? { 
            ...template, 
            status: template.status === '启用' ? '停用' : '启用',
            updatedAt: new Date().toISOString()
          } 
        : template
    ));
    setFilteredTemplates(filteredTemplates.map(template => 
      template.templateId === id 
        ? { 
            ...template, 
            status: template.status === '启用' ? '停用' : '启用',
            updatedAt: new Date().toISOString()
          } 
        : template
    ));
    alert('状态更新成功');
  };

  const handleSetAsDefault = (id: string) => {
    console.log('Setting template as default:', id);
    alert('已设为默认模板');
  };

  const getStatusColor = (status: string) => {
    return status === '启用' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getFormatTypeColor = (formatType: string) => {
    return formatType === 'json' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 card-shadow">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">解析格式管理</h2>
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
              value={selectedFormatType || ''}
              onChange={(e) => setSelectedFormatType(e.target.value || null)}
            >
              <option value="">全部格式</option>
              <option value="json">JSON</option>
              <option value="xml">XML</option>
            </select>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all flex items-center space-x-2"
              onClick={handleCreate}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>新建模板</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  模板名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  格式类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  描述
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  创建人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredTemplates.map((template) => (
                <tr key={template.templateId} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{template.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getFormatTypeColor(template.formatType)}`}>
                      {template.formatType.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(template.status)}`}>
                      {template.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                    {template.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {template.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(template.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleEdit(template.templateId)}
                        title="编辑"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleCopy(template)}
                        title="复制"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        className={`${
                          template.status === '启用' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                        onClick={() => handleToggleStatus(template.templateId)}
                        title={template.status === '启用' ? '停用' : '启用'}
                      >
                        {template.status === '启用' ? (
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
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleSetAsDefault(template.templateId)}
                        title="设为默认"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        className={`${
                          template.status === '启用' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'
                        }`}
                        onClick={() => handleDeleteConfirm(template.templateId)}
                        title="删除"
                        disabled={template.status === '启用'}
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
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-4">确认删除</h3>
            <p className="text-slate-600 mb-6">确定要删除这个模板吗？此操作不可恢复。</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
                onClick={handleDeleteCancel}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                onClick={() => handleDelete(showDeleteConfirm)}
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

// 模板表单页面
const TemplateFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    formatType: 'json',
    status: true,
    description: '',
    content: ''
  });
  const pathname = window.location.pathname;
  const match = pathname.match(/\/templates\/([^\/]+)\/edit/);
  const templateId = match ? match[1] : null;
  const [loading, setLoading] = useState(true);
  const isEdit = templateId && templateId !== 'new';
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit) {
      // 使用 mock 数据
      const mockTemplate = mockResumeTemplates.find(t => t.templateId === templateId);
      if (mockTemplate) {
        setFormData({
          name: mockTemplate.name,
          formatType: mockTemplate.formatType,
          status: mockTemplate.status === '启用',
          description: mockTemplate.description || '',
          content: mockTemplate.content || ''
        });
      } else {
        alert('模板不存在');
        navigate('/templates');
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [templateId, isEdit, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = '请输入模板名称';
    }
    if (!formData.content.trim()) {
      newErrors.content = '请输入模板内容';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    if (isEdit) {
      alert('模板更新成功（模拟）');
      navigate('/templates');
    } else {
      alert('模板创建成功（模拟）');
      navigate('/templates');
    }
  };

  const handlePreview = () => {
    // 显示预览模态框
    const mockResumeData = {
      basicInfo: { name: '张三', phone: '13800138000', email: 'zhangsan@example.com' },
      education: [{ school: '清华大学', degree: '硕士', startDate: '2020-09', endDate: '2023-06' }],
      workExperience: [{
        company: '某科技公司',
        position: '前端工程师',
        startDate: '2023-07',
        endDate: '至今',
        responsibilities: ['负责前端开发', '参与产品设计'],
        achievements: ['提升页面性能30%']
      }]
    };
    
    const previewContent = formData.content || '模板内容';
    
    alert(`预览功能：左侧是模拟简历数据，右侧是渲染结果\n\n模拟简历数据：${JSON.stringify(mockResumeData, null, 2)}\n\n渲染结果：${previewContent}`);
  };

  const handleGoBack = () => {
    navigate('/templates');
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={handleGoBack} 
          className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回
        </button>
      </div>
      
      <div className="bg-white rounded-3xl border border-slate-100 p-8 card-shadow">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{isEdit ? '编辑模板' : '新建模板'}</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">模板名称 *</label>
            <input
              type="text"
              className={`w-full p-3 rounded-xl border ${
                errors.name ? 'border-red-500' : 'border-slate-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="请输入模板名称"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">格式类型 *</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="text-blue-600 focus:ring-blue-500"
                  checked={formData.formatType === 'json'}
                  onChange={() => setFormData({...formData, formatType: 'json'})}
                />
                <span className="ml-2">JSON</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="text-blue-600 focus:ring-blue-500"
                  checked={formData.formatType === 'xml'}
                  onChange={() => setFormData({...formData, formatType: 'xml'})}
                />
                <span className="ml-2">XML</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">状态</label>
            <div className="flex items-center">
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.status ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                onClick={() => setFormData({...formData, status: !formData.status})}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.status ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm text-slate-700">
                {formData.status ? '启用' : '停用'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">描述</label>
            <textarea
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="请输入模板描述"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">模板内容 *</label>
            <textarea
              className={`w-full p-3 rounded-xl border font-mono ${
                errors.content ? 'border-red-500' : 'border-slate-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              rows={10}
              placeholder="请输入模板内容，支持变量替换，如 {{name}}, {{email}} 等"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-colors"
              onClick={handleSave}
            >
              {isEdit ? '更新模板' : '创建模板'}
            </button>
            <button
              className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-2xl font-medium transition-colors flex items-center"
              onClick={handlePreview}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              预览效果
            </button>
            <button
              className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-2xl font-medium transition-colors"
              onClick={handleGoBack}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 主组件，根据路由渲染不同页面
const FormatManagementPage: React.FC = () => {
  const pathname = window.location.pathname;
  
  if (pathname.includes('/templates/new') || pathname.match(/\/templates\/[^\/]+\/edit/)) {
    return <TemplateFormPage />;
  }

  return <TemplateListPage />;
};

export default FormatManagementPage;