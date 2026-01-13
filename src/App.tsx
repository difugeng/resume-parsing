import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import TaskListPage from './pages/TaskListPage';
import UploadPage from './pages/UploadPage';
import TaskDetailPage from './pages/TaskDetailPage';
import PositionManagementPage from './pages/PositionManagementPage';
import FormatManagementPage from './pages/FormatManagementPage';
import McpListPage from './pages/McpListPage';
import McpFormPage from './pages/McpFormPage';
import ResumeRepositoryPage from './pages/ResumeRepositoryPage';

// 定义视图类型
enum ViewType {
  TASKS = 'tasks',
  RESUMES = 'resumes',
  JOBS = 'jobs',
  FORMAT_MANAGEMENT = 'format_management',
  MCP_PROVIDERS = 'mcp_providers',
}

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.TASKS);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: ViewType.TASKS, label: '简历解析', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: ViewType.RESUMES, label: '简历仓库', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: ViewType.JOBS, label: '职位管理', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: ViewType.FORMAT_MANAGEMENT, label: '解析格式管理', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-2.572-1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543-.94-3.31.826-2.37 2.37a1.724 1.724 0 00-1.065 2.572c-1.756.426-1.756 2.924 0 3.35a1.724 1.724 0 002.573 1.066c1.543.94 3.31-.826 2.37-2.37a1.724 1.724 0 00-1.066-2.573c-.426-1.756.416-3.52 2.37-2.37.94.55 1.543 1.68 1.543 2.37 0 .69-.603 1.82-1.543 2.37-.426.26-.852.52-1.277.78' },
    { id: ViewType.MCP_PROVIDERS, label: 'MCP管理', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    // 根据视图类型导航到相应路径
    switch(view) {
      case ViewType.TASKS:
        navigate('/tasks');
        break;
      case ViewType.RESUMES:
        navigate('/resumes');
        break;
      case ViewType.JOBS:
        navigate('/jobs');
        break;
      case ViewType.FORMAT_MANAGEMENT:
        navigate('/format-management');
        break;
      case ViewType.MCP_PROVIDERS:
        navigate('/mcp-providers');
        break;
      default:
        navigate('/tasks');
    }
  };

  // 更新当前视图基于路由
  React.useEffect(() => {
    if (location.pathname.startsWith('/tasks')) {
      setCurrentView(ViewType.TASKS);
    } else if (location.pathname.startsWith('/resumes')) {
      setCurrentView(ViewType.RESUMES);
    } else if (location.pathname.startsWith('/jobs')) {
      setCurrentView(ViewType.JOBS);
    } else if (location.pathname.startsWith('/format-management')) {
      setCurrentView(ViewType.FORMAT_MANAGEMENT);
    } else if (location.pathname.startsWith('/mcp-providers')) {
      setCurrentView(ViewType.MCP_PROVIDERS);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass-sidebar h-full flex flex-col shrink-0">
        <div className="p-6 flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 leading-tight">智能简历解析系统</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Intelligent System</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-4"></div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                YX
              </div>
              <span className="text-sm font-medium text-slate-700">云象设计</span>
            </div>
            <button className="text-slate-500 hover:text-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" />} />
            <Route path="/tasks/*" element={<TaskListPage />} />
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
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;