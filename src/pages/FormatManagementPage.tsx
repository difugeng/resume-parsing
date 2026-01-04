import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Radio, Switch, message, Select, Input as AntInput } from 'antd';
import { PlusOutlined, EditOutlined, CopyOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ResumeExportTemplate } from '../types';
import { mockResumeTemplates } from '../mockData';

const { TextArea } = AntInput;

// 模板列表页面
const TemplateListPage: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ResumeExportTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ResumeExportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedFormatType, setSelectedFormatType] = useState<string | null>(null);

  useEffect(() => {
    // TODO: 替换为真实 API 调用
    // const fetchTemplates = async () => {
    //   try {
    //     const response = await fetch('/api/v1/templates');
    //     const data = await response.json();
    //     setTemplates(data);
    //     setFilteredTemplates(data);
    //   } catch (error) {
    //     console.error('获取模板列表失败:', error);
    //     message.error('获取模板列表失败');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchTemplates();

    // 使用 mock 数据
    setTemplates(mockResumeTemplates);
    setFilteredTemplates(mockResumeTemplates);
    setLoading(false);
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

  const getStatusColor = (status: string) => {
    return status === '启用' ? 'green' : 'default';
  };

  const handleEdit = (id: string) => {
    navigate(`/templates/${id}/edit`);
  };

  const handleCreate = () => {
    navigate('/templates/new');
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个模板吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // TODO: 替换为真实 API 调用
        // const deleteTemplate = async () => {
        //   try {
        //     await fetch(`/api/v1/templates/${id}`, { method: 'DELETE' });
        //     setTemplates(templates.filter(template => template.templateId !== id));
        //     setFilteredTemplates(filteredTemplates.filter(template => template.templateId !== id));
        //     message.success('删除成功');
        //   } catch (error) {
        //     console.error('删除模板失败:', error);
        //     message.error('删除模板失败');
        //   }
        // };
        // deleteTemplate();

        // 使用 mock 数据
        const updatedTemplates = templates.filter(template => template.templateId !== id);
        setTemplates(updatedTemplates);
        setFilteredTemplates(updatedTemplates);
        message.success('删除成功');
      }
    });
  };

  const handleCopy = (template: ResumeExportTemplate) => {
    // TODO: 替换为真实 API 调用
    // const copyTemplate = async (templateData: ResumeExportTemplate) => {
    //   try {
    //     const newTemplate = {
    //       ...templateData,
    //       templateId: `copy_${templateData.templateId}_${Date.now()}`,
    //       name: `${templateData.name}_副本`,
    //       status: '停用', // 复制的模板默认为停用状态
    //       createdAt: new Date().toISOString(),
    //       updatedAt: new Date().toISOString(),
    //     };
    //     const response = await fetch('/api/v1/templates', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(newTemplate),
    //     });
    //     const createdTemplate = await response.json();
    //     setTemplates([...templates, createdTemplate]);
    //     setFilteredTemplates([...filteredTemplates, createdTemplate]);
    //     message.success('模板复制成功');
    //   } catch (error) {
    //     console.error('复制模板失败:', error);
    //     message.error('复制模板失败');
    //   }
    // };
    // copyTemplate(template);

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
    message.success('模板复制成功');
  };

  const handleToggleStatus = (id: string) => {
    // TODO: 替换为真实 API 调用
    // const updateStatus = async (templateId: string, newStatus: '启用' | '停用') => {
    //   try {
    //     await fetch(`/api/v1/templates/${templateId}`, {
    //       method: 'PUT',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ status: newStatus }),
    //     });
    //     setTemplates(templates.map(template => 
    //       template.templateId === id ? { ...template, status: newStatus } : template
    //     ));
    //     setFilteredTemplates(filteredTemplates.map(template => 
    //       template.templateId === id ? { ...template, status: newStatus } : template
    //     ));
    //     message.success('状态更新成功');
    //   } catch (error) {
    //     console.error('更新状态失败:', error);
    //     message.error('更新状态失败');
    //   }
    // };
    // updateStatus(id, templates.find(t => t.templateId === id)?.status === '启用' ? '停用' : '启用');

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
    message.success('状态更新成功');
  };

  const handleSetAsDefault = (id: string) => {
    // TODO: 替换为真实 API 调用
    // const setAsDefault = async (templateId: string) => {
    //   try {
    //     await fetch(`/api/v1/templates/${templateId}/default`, {
    //       method: 'PUT',
    //     });
    //     message.success('已设为默认模板');
    //   } catch (error) {
    //     console.error('设置默认模板失败:', error);
    //     message.error('设置默认模板失败');
    //   }
    // };
    // setAsDefault(id);

    // 使用 mock 数据
    console.log('Setting template as default:', id);
    message.success('已设为默认模板');
  };

  const columns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ResumeExportTemplate, b: ResumeExportTemplate) => a.name.localeCompare(b.name),
    },
    {
      title: '格式类型',
      dataIndex: 'formatType',
      key: 'formatType',
      render: (formatType: string) => (
        <Tag color={formatType === 'json' ? 'blue' : 'orange'}>
          {formatType.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'JSON', value: 'json' },
        { text: 'XML', value: 'xml' },
      ],
      onFilter: (value: any, record: ResumeExportTemplate) => record.formatType === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      filters: [
        { text: '全部', value: null },
        { text: '启用', value: '启用' },
        { text: '停用', value: '停用' },
      ],
      onFilter: (value: any, record: ResumeExportTemplate) => {
        if (value === null) return true;
        return record.status === value;
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleDateString('zh-CN'),
      sorter: (a: ResumeExportTemplate, b: ResumeExportTemplate) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ResumeExportTemplate) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record.templateId)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            icon={<CopyOutlined />} 
            onClick={() => handleCopy(record)}
          >
            复制
          </Button>
          <Button 
            type="link"
            icon={record.status === '启用' ? <CloseOutlined /> : <CheckOutlined />}
            onClick={() => handleToggleStatus(record.templateId)}
          >
            {record.status === '启用' ? '停用' : '启用'}
          </Button>
          <Button 
            type="link" 
            icon={<CheckOutlined />}
            onClick={() => handleSetAsDefault(record.templateId)}
          >
            设为默认
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            disabled={record.status === '启用'} // 仅停用模板可删除
            onClick={() => handleDelete(record.templateId)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card 
        title="解析格式管理"
        extra={
          <Space>
            <Select
              placeholder="按状态筛选"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setSelectedStatus(value)}
            >
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="启用">启用</Select.Option>
              <Select.Option value="停用">停用</Select.Option>
            </Select>
            <Select
              placeholder="按格式类型筛选"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setSelectedFormatType(value)}
            >
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="json">JSON</Select.Option>
              <Select.Option value="xml">XML</Select.Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建模板
            </Button>
          </Space>
        }
      >
        <Table 
          dataSource={filteredTemplates} 
          columns={columns as any} 
          rowKey="templateId"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>
    </div>
  );
};

// 模板表单页面
const TemplateFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const pathname = window.location.pathname;
  const match = pathname.match(/\/templates\/([^\/]+)\/edit/);
  const templateId = match ? match[1] : null;
  const [loading, setLoading] = useState(true);
  const isEdit = templateId && templateId !== 'new';

  useEffect(() => {
    if (isEdit) {
      // TODO: 替换为真实 API 调用
      // const fetchTemplate = async () => {
      //   try {
      //     const response = await fetch(`/api/v1/templates/${templateId}`);
      //     const data = await response.json();
      //     form.setFieldsValue({
      //       ...data,
      //       formatType: data.formatType,
      //       status: data.status === '启用',
      //     });
      //   } catch (error) {
      //     console.error('获取模板详情失败:', error);
      //     message.error('获取模板详情失败');
      //   } finally {
      //     setLoading(false);
      //   }
      // };
      // fetchTemplate();

      // 使用 mock 数据
      const mockTemplate = mockResumeTemplates.find(t => t.templateId === templateId);
      if (mockTemplate) {
        form.setFieldsValue({
          ...mockTemplate,
          status: mockTemplate.status === '启用',
        });
      } else {
        message.error('模板不存在');
        navigate('/templates');
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [templateId, form, isEdit, navigate]);

  const handleFinish = async (values: any) => {
    console.log('Form values:', values); // 使用参数以避免未使用警告
    if (isEdit) {
      // TODO: 替换为真实 API 调用
      // try {
      //   const templateData = {
      //     ...values,
      //     status: values.status ? '启用' : '停用',
      //     updatedAt: new Date().toISOString(),
      //   };
      //   await fetch(`/api/v1/templates/${templateId}`, {
      //     method: 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(templateData),
      //   });
      //   message.success('模板更新成功');
      //   navigate('/templates');
      // } catch (error) {
      //   console.error('更新模板失败:', error);
      //   message.error('更新模板失败');
      // }
      message.success('模板更新成功（模拟）');
      navigate('/templates');
    } else {
      // TODO: 替换为真实 API 调用
      // try {
      //   const templateData = {
      //     ...values,
      //     templateId: `temp_${Date.now()}`,
      //     status: values.status ? '启用' : '停用',
      //     createdBy: '当前用户', // 这里应该从用户上下文获取
      //     createdAt: new Date().toISOString(),
      //     updatedAt: new Date().toISOString(),
      //   };
      //   await fetch('/api/v1/templates', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(templateData),
      //   });
      //   message.success('模板创建成功');
      //   navigate('/templates');
      // } catch (error) {
      //   console.error('创建模板失败:', error);
      //   message.error('创建模板失败');
      // }
      message.success('模板创建成功（模拟）');
      navigate('/templates');
    }
  };

  const handlePreview = () => {
    // TODO: 实现预览功能
    // 可以打开一个模态框，左侧显示mock简历数据，右侧显示渲染后的结果
    Modal.info({
      title: '模板预览效果',
      width: 800,
      content: (
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, marginRight: 16 }}>
            <h4>Mock 简历数据</h4>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '4px', 
              maxHeight: '300px', 
              overflow: 'auto' 
            }}>
              {JSON.stringify({
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
              }, null, 2)}
            </pre>
          </div>
          <div style={{ flex: 1 }}>
            <h4>渲染结果</h4>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '4px', 
              maxHeight: '300px', 
              overflow: 'auto' 
            }}>
              {form.getFieldValue('content') || '模板内容'}
            </pre>
          </div>
        </div>
      ),
      okText: '关闭',
    });
  };

  const handleGoBack = () => {
    navigate('/templates');
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={handleGoBack} icon={<ArrowLeftOutlined />} type="primary" ghost>
          返回
        </Button>
      </div>
      <Card 
        title={isEdit ? '编辑模板' : '新建模板'} 
        style={{ maxWidth: 800, margin: '0 auto', textAlign: 'left' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            status: true, // 默认启用
            formatType: 'json', // 默认JSON
          }}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="请输入模板名称" />
          </Form.Item>

          <Form.Item
            name="formatType"
            label="格式类型"
            rules={[{ required: true, message: '请选择格式类型' }]}
          >
            <Radio.Group>
              <Radio value="json">JSON</Radio>
              <Radio value="xml">XML</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="启用" 
              unCheckedChildren="停用" 
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={3} placeholder="请输入模板描述" />
          </Form.Item>

          <Form.Item
            name="content"
            label="模板内容"
            rules={[{ required: true, message: '请输入模板内容' }]}
          >
            <TextArea 
              rows={10} 
              placeholder="请输入模板内容，支持变量替换，如 {{name}}, {{email}} 等" 
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {isEdit ? '更新模板' : '创建模板'}
              </Button>
              <Button icon={<EyeOutlined />} onClick={handlePreview}>
                预览效果
              </Button>
              <Button onClick={handleGoBack}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
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