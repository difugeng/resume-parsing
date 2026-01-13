import React, { useState, useEffect } from 'react';
import { mockTaskList } from '../mockData';
import { ParseTask, TaskStatus } from '../types';
import { useNavigate } from 'react-router-dom';

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<ParseTask[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: 替换为真实 API 调用
    // const res = await fetch('/api/v1/tasks');
    // setTasks(await res.json());
    setTasks(mockTaskList);
  }, []);

  const getStatusClass = (status: TaskStatus) => {
    switch (status) {
      case '已完成':
        return 'status-completed';
      case '部分失败':
        return 'status-partial';
      case '失败':
        return 'status-failed';
      case '处理中':
        return 'status-processing';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: '解析总量', value: '1,285', sub: '本月累计', color: 'blue' },
          { label: '解析成功率', value: '99.5%', sub: '运行极稳', color: 'green' },
          { label: '平均解析耗时', value: '0.6s', sub: '性能卓越', color: 'purple' },
          { label: '待处理队列', value: '1', sub: '实时处理', color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 card-shadow">
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              <span className="text-xs text-slate-400 font-normal">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 搜索与操作 */}
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="搜索解析文件或任务 ID..."
            className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm shadow-sm"
          />
        </div>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all flex items-center space-x-2"
          onClick={() => navigate('/tasks/new')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>新建简历解析任务</span>
        </button>
      </div>

      {/* 任务列表 */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden card-shadow">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              {['任务名称', '创建日期', '文件数', '状态', '匹配质量', '操作'].map((head) => (
                <th key={head} className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {tasks.map((task) => {
              const successRate = task.totalFiles > 0 ? (task.successCount / task.totalFiles) * 100 : 0;
              return (
                <tr key={task.taskId} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-sm font-bold text-slate-700 max-w-xs truncate">{task.taskName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{new Date(task.createdAt).toLocaleString('zh-CN')}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-800">{task.totalFiles}</td>
                  <td className="px-6 py-4">
                    <span className={`${getStatusClass(task.status)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${successRate}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{Math.round(successRate)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      onClick={() => navigate(`/tasks/${task.taskId}`)}
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskListPage;