import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Switch, Button, Space, message, InputNumber, Modal } from 'antd';
import { ArrowLeftOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { mockMcpProviders } from '../mockData';

const { TextArea } = Input;
const { Option } = Select;

const McpFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { mcpId } = useParams<{ mcpId: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const isEdit = mcpId && mcpId !== 'new';

  useEffect(() => {
    if (isEdit) {
      // TODO: 替换为真实 API 调用
      // const fetchProvider = async () => {
      //   try {
      //     const response = await fetch(`/api/v1/mcp-providers/${mcpId}`);
      //     const data = await response.json();
      //     form.setFieldsValue({
      //       ...data,
      //       status: data.status === '启用',
      //       isEnabledByDefault: data.isEnabledByDefault,
      //     });
      //   } catch (error) {
      //     console.error('获取MCP服务详情失败:', error);
      //     message.error('获取MCP服务详情失败');
      //   } finally {
      //     setLoading(false);
      //   }
      // };
      // fetchProvider();

      // 使用 mock 数据
      const mockProvider = mockMcpProviders.find(p => p.mcpId === mcpId);
      if (mockProvider) {
        form.setFieldsValue({
          ...mockProvider,
          status: mockProvider.status === '启用',
          isEnabledByDefault: mockProvider.isEnabledByDefault,
          // 在编辑模式下，API密钥显示为占位符
          apiKey: '••••••••',
        });
      } else {
        message.error('MCP服务不存在');
        navigate('/mcp-providers');
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [mcpId, form, isEdit, navigate]);

  const handleFinish = async (values: any) => {
    // 移除占位符值
    if (values.apiKey === '••••••••') {
      delete values.apiKey;
    }

    if (isEdit) {
      // TODO: 替换为真实 API 调用
      // try {
      //   const providerData = {
      //     ...values,
      //     status: values.status ? '启用' : '停用',
      //     updatedAt: new Date().toISOString(),
      //   };
      //   await fetch(`/api/v1/mcp-providers/${mcpId}`, {
      //     method: 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(providerData),
      //   });
      //   message.success('MCP服务更新成功');
      //   navigate('/mcp-providers');
      // } catch (error) {
      //   console.error('更新MCP服务失败:', error);
      //   message.error('更新MCP服务失败');
      // }
      message.success('MCP服务更新成功（模拟）');
      navigate('/mcp-providers');
    } else {
      // TODO: 替换为真实 API 调用
      // try {
      //   const providerData = {
      //     ...values,
      //     mcpId: `mcp_${Date.now()}`,
      //     status: values.status ? '启用' : '停用',
      //     createdBy: '当前用户', // 这里应该从用户上下文获取
      //     createdAt: new Date().toISOString(),
      //     updatedAt: new Date().toISOString(),
      //   };
      //   await fetch('/api/v1/mcp-providers', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(providerData),
      //   });
      //   message.success('MCP服务创建成功');
      //   navigate('/mcp-providers');
      // } catch (error) {
      //   console.error('创建MCP服务失败:', error);
      //   message.error('创建MCP服务失败');
      // }
      message.success('MCP服务创建成功（模拟）');
      navigate('/mcp-providers');
    }
  };

  const handleTestConnection = async () => {
    try {
      // 获取表单值，包括API密钥
      const values = form.getFieldsValue();
      
      // 验证必要字段
      if (!values.name || !values.endpointUrl) {
        message.error('请填写服务名称和API地址');
        return;
      }
      
      if (!values.apiKey && values.apiKey !== '••••••••') {
        message.error('请输入API密钥');
        return;
      }
      
      setIsTesting(true);
      
      // TODO: 替换为真实 API 调用
      // const response = await fetch(`/api/v1/mcp-providers/test`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...values,
      //     apiKey: values.apiKey === '••••••••' ? undefined : values.apiKey, // 编辑时如果显示占位符则不发送
      //   }),
      // });
      // const result = await response.json();
      
      // 使用 mock 数据模拟测试
      await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
      const duration = Math.floor(Math.random() * 1000) + 100; // 随机模拟耗时
      
      setIsTesting(false);
      
      Modal.success({
        title: '连接测试结果',
        content: (
          <div>
            <p>状态: <span style={{ color: 'green' }}>成功</span></p>
            <p>耗时: <span style={{ color: 'blue' }}>{duration}ms</span></p>
            <p>服务: {values.name}</p>
            <p>地址: {values.endpointUrl}</p>
          </div>
        ),
        okText: '确定',
      });
    } catch (error) {
      setIsTesting(false);
      message.error('连接测试失败');
      console.error('连接测试失败:', error);
    }
  };

  const handleGoBack = () => {
    navigate('/mcp-providers');
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
        title={isEdit ? '编辑 MCP 服务' : '新建 MCP 服务'} 
        style={{ maxWidth: 800, margin: '0 auto', textAlign: 'left' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            status: true, // 默认启用
            isEnabledByDefault: false, // 默认不默认启用
            timeoutMs: 5000, // 默认超时时间
            retryCount: 2, // 默认重试次数
          }}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="服务名称"
            rules={[{ required: true, message: '请输入服务名称' }]}
          >
            <Input placeholder="请输入服务名称，如：学信网学历验证服务" />
          </Form.Item>

          <Form.Item
            name="category"
            label="服务类别"
            rules={[{ required: true, message: '请选择服务类别' }]}
          >
            <Select placeholder="请选择服务类别">
              <Option value="学历验证">学历验证</Option>
              <Option value="身份核验">身份核验</Option>
              <Option value="工作经历验证">工作经历验证</Option>
              <Option value="自定义">自定义</Option>
            </Select>
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
            name="endpointUrl"
            label="API 地址"
            rules={[
              { required: true, message: '请输入API地址' },
              { type: 'url', message: '请输入有效的URL地址' }
            ]}
          >
            <Input placeholder="请输入API接口地址，如：https://api.example.com/verify" />
          </Form.Item>

          <Form.Item
            name="authType"
            label="认证方式"
            rules={[{ required: true, message: '请选择认证方式' }]}
          >
            <Select placeholder="请选择认证方式">
              <Option value="API Key">API Key</Option>
              <Option value="Bearer Token">Bearer Token</Option>
              <Option value="Basic Auth">Basic Auth</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="apiKey"
            label="API 密钥"
            rules={[{ required: true, message: '请输入API密钥' }]}
          >
            <Input.Password 
              placeholder="请输入API密钥" 
              visibilityToggle={isEdit ? false : undefined} // 编辑模式下不显示眼睛图标
            />
          </Form.Item>

          <Form.Item
            name="timeoutMs"
            label="超时时间（毫秒）"
            rules={[{ required: true, message: '请输入超时时间' }]}
          >
            <InputNumber 
              min={100} 
              max={30000} 
              step={100}
              style={{ width: '100%' }}
              placeholder="请输入超时时间，单位毫秒"
            />
          </Form.Item>

          <Form.Item
            name="retryCount"
            label="重试次数"
            rules={[{ required: true, message: '请输入重试次数' }]}
          >
            <InputNumber 
              min={0} 
              max={10} 
              style={{ width: '100%' }}
              placeholder="请输入重试次数"
            />
          </Form.Item>

          <Form.Item
            name="isEnabledByDefault"
            label="是否默认启用"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="是" 
              unCheckedChildren="否" 
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="服务说明"
          >
            <TextArea rows={4} placeholder="请输入服务说明" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {isEdit ? '更新服务' : '创建服务'}
              </Button>
              <Button 
                icon={<ThunderboltOutlined />} 
                onClick={handleTestConnection}
                loading={isTesting}
              >
                测试连接
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

export default McpFormPage;