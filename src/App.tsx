import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { Layout, Menu, Button, ConfigProvider, App as AntdApp } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, FileTextOutlined, AppstoreOutlined, FileProtectOutlined, UserOutlined, ApiOutlined } from '@ant-design/icons';
import { minimalistBusinessTheme } from './theme';
import './minimalist-business-styles.css';
import TaskListPage from './pages/TaskListPage';
import UploadPage from './pages/UploadPage';
import TaskDetailPage from './pages/TaskDetailPage';
import PositionManagementPage from './pages/PositionManagementPage';
import FormatManagementPage from './pages/FormatManagementPage';
import McpListPage from './pages/McpListPage';
import McpFormPage from './pages/McpFormPage';
import ResumeRepositoryPage from './pages/ResumeRepositoryPage';
import type { MenuProps } from 'antd';

const { Header, Content, Sider } = Layout;

const AppContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuProps['items'] = [
    {
      key: '/tasks',
      label: <Link to="/tasks">简历解析</Link>,
      icon: <AppstoreOutlined />,  // Changed from FileTextOutlined to AppstoreOutlined
    },
    {
      key: '/resumes',
      label: <Link to="/resumes">简历仓库</Link>,
      icon: <FileProtectOutlined />,
    },
    {
      key: '/jobs',
      label: <Link to="/jobs">职位管理</Link>,
      icon: <UserOutlined />,  // Changed from AppstoreOutlined to UserOutlined
    },
    {
      key: '/format-management',
      label: <Link to="/format-management">解析格式管理</Link>,
      icon: <FileTextOutlined />,  // Changed from SettingOutlined to FileTextOutlined
    },
    {
      key: '/mcp-providers',
      label: <Link to="/mcp-providers">MCP管理</Link>,
      icon: <ApiOutlined />,  // Changed from SettingOutlined to ApiOutlined
    },
  ];

  const onClickMenu: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        color: '#fff', 
        fontSize: '18px', 
        fontWeight: 'bold',
        backgroundImage: 'url(/hearder_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}>
        智能简历解析系统
      </Header>
      <Layout>
        <Sider 
          width={200} 
          collapsed={collapsed}
          collapsedWidth={80}
          style={{ background: '#fff', borderRight: '1px solid #f0f0f0', overflow: 'auto', height: 'calc(100vh - 64px)', position: 'fixed', left: 0, top: 64, zIndex: 100 }}
          trigger={null}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: '0 16px', height: 48 }}>
            {!collapsed && <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff' }}></div>}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ padding: 0 }}
            />
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={onClickMenu}
            items={menuItems}
            style={{ height: 'calc(100% - 48px)', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Content style={{ padding: '24px', background: '#fff', marginTop: 24, marginLeft: 24, overflow: 'auto', height: 'calc(100vh - 88px)' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/tasks" />} />
              <Route path="/tasks" element={<TaskListPage />} />
              <Route path="/tasks/new" element={<UploadPage />} />
              <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
              <Route path="/jobs" element={<PositionManagementPage />} />
              <Route path="/jobs/:jobId/edit" element={<PositionManagementPage />} />
              <Route path="/jobs/new" element={<PositionManagementPage />} />
              <Route path="/format-management" element={<FormatManagementPage />} />
              <Route path="/templates" element={<FormatManagementPage />} />
              <Route path="/templates/new" element={<FormatManagementPage />} />
              <Route path="/templates/:templateId/edit" element={<FormatManagementPage />} />
              <Route path="/resumes" element={<ResumeRepositoryPage />} />
              <Route path="/mcp-providers" element={<McpListPage />} />
              <Route path="/mcp-providers/new" element={<McpFormPage />} />
              <Route path="/mcp-providers/:mcpId/edit" element={<McpFormPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider theme={minimalistBusinessTheme}>
      <AntdApp>
        <Router>
          <AppContent />
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;