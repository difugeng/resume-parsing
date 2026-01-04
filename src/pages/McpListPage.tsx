import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Modal, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { McpProvider } from '../types';
import { mockMcpProviders } from '../mockData';

const McpListPage: React.FC = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<McpProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<McpProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // TODO: 替换为真实 API 调用
    // const fetchProviders = async () => {
    //   try {
    //     const response = await fetch('/api/v1/mcp-providers');
    //     const data = await response.json();
    //     setProviders(data);
    //     setFilteredProviders(data);
    //   } catch (error) {
    //     console.error('获取MCP服务列表失败:', error);
    //     message.error('获取MCP服务列表失败');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchProviders();

    // 使用 mock 数据
    setProviders(mockMcpProviders);
    setFilteredProviders(mockMcpProviders);
    setLoading(false);
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

  const getStatusColor = (status: string) => {
    return status === '启用' ? 'green' : 'default';
  };

  const handleEdit = (id: string) => {
    navigate(`/mcp-providers/${id}/edit`);
  };

  const handleCreate = () => {
    navigate('/mcp-providers/new');
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个MCP服务吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // TODO: 替换为真实 API 调用
        // const deleteProvider = async () => {
        //   try {
        //     await fetch(`/api/v1/mcp-providers/${id}`, { method: 'DELETE' });
        //     setProviders(providers.filter(provider => provider.mcpId !== id));
        //     setFilteredProviders(filteredProviders.filter(provider => provider.mcpId !== id));
        //     message.success('删除成功');
        //   } catch (error) {
        //     console.error('删除MCP服务失败:', error);
        //     message.error('删除MCP服务失败');
        //   }
        // };
        // deleteProvider();

        // 使用 mock 数据
        const updatedProviders = providers.filter(provider => provider.mcpId !== id);
        setProviders(updatedProviders);
        setFilteredProviders(updatedProviders);
        message.success('删除成功');
      }
    });
  };

  const handleToggleStatus = (id: string) => {
    // TODO: 替换为真实 API 调用
    // const updateStatus = async (providerId: string, newStatus: '启用' | '停用') => {
    //   try {
    //     await fetch(`/api/v1/mcp-providers/${providerId}`, {
    //       method: 'PUT',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ status: newStatus }),
    //     });
    //     setProviders(providers.map(provider => 
    //       provider.mcpId === id ? { ...provider, status: newStatus } : provider
    //     ));
    //     setFilteredProviders(filteredProviders.map(provider => 
    //       provider.mcpId === id ? { ...provider, status: newStatus } : provider
    //     ));
    //     message.success('状态更新成功');
    //   } catch (error) {
    //     console.error('更新状态失败:', error);
    //     message.error('更新状态失败');
    //   }
    // };
    // updateStatus(id, providers.find(p => p.mcpId === id)?.status === '启用' ? '停用' : '启用');

    // 使用 mock 数据
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
    message.success('状态更新成功');
  };

  const handleTestConnection = (id: string) => {
    // TODO: 替换为真实 API 调用
    // const testConnection = async (providerId: string) => {
    //   try {
    //     const response = await fetch(`/api/v1/mcp-providers/${providerId}/test`, {
    //       method: 'POST',
    //     });
    //     const result = await response.json();
    //     if (result.success) {
    //       message.success(`连接测试成功，耗时: ${result.duration}ms`);
    //     } else {
    //       message.error(`连接测试失败: ${result.error}`);
    //     }
    //   } catch (error) {
    //     console.error('连接测试失败:', error);
    //     message.error('连接测试失败');
    //   }
    // };
    // testConnection(id);

    // 使用 mock 数据
    const duration = Math.floor(Math.random() * 1000) + 100; // 随机模拟耗时
    console.log('Testing connection for provider:', id); // 使用参数以避免未使用警告
    message.success(`连接测试成功，耗时: ${duration}ms`);
  };

  const columns = [
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: McpProvider, b: McpProvider) => a.name.localeCompare(b.name),
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        let color = 'default';
        if (category === '学历验证') color = 'blue';
        if (category === '身份核验') color = 'green';
        if (category === '工作经历验证') color = 'orange';
        if (category === '自定义') color = 'purple';
        
        return <Tag color={color}>{category}</Tag>;
      },
      filters: [
        { text: '学历验证', value: '学历验证' },
        { text: '身份核验', value: '身份核验' },
        { text: '工作经历验证', value: '工作经历验证' },
        { text: '自定义', value: '自定义' },
      ],
      onFilter: (value: any, record: McpProvider) => record.category === value,
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
      onFilter: (value: any, record: McpProvider) => {
        if (value === null) return true;
        return record.status === value;
      },
    },
    {
      title: 'API 地址',
      dataIndex: 'endpointUrl',
      key: 'endpointUrl',
      render: (url: string) => (
        <div style={{ wordBreak: 'break-all' }}>
          {url}
        </div>
      ),
    },
    {
      title: '认证方式',
      dataIndex: 'authType',
      key: 'authType',
      render: (authType: string) => (
        <Tag color="geekblue">{authType}</Tag>
      ),
    },
    {
      title: '默认启用',
      dataIndex: 'isEnabledByDefault',
      key: 'isEnabledByDefault',
      render: (isEnabled: boolean) => (
        <Tag color={isEnabled ? 'green' : 'default'}>
          {isEnabled ? '✅ 是' : '❌ 否'}
        </Tag>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: McpProvider) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record.mcpId)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            icon={<ThunderboltOutlined />}
            onClick={() => handleTestConnection(record.mcpId)}
          >
            测试连接
          </Button>
          <Button 
            type="link"
            icon={record.status === '启用' ? <CloseOutlined /> : <CheckOutlined />}
            onClick={() => handleToggleStatus(record.mcpId)}
          >
            {record.status === '启用' ? '停用' : '启用'}
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.mcpId)}
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
        title="MCP管理"
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
              placeholder="按类别筛选"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setSelectedCategory(value)}
            >
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="学历验证">学历验证</Select.Option>
              <Select.Option value="身份核验">身份核验</Select.Option>
              <Select.Option value="工作经历验证">工作经历验证</Select.Option>
              <Select.Option value="自定义">自定义</Select.Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建 MCP 配置
            </Button>
          </Space>
        }
      >
        <Table 
          dataSource={filteredProviders} 
          columns={columns as any} 
          rowKey="mcpId"
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

export default McpListPage;