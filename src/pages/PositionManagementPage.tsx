import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { mockJobPositions } from '../mockData';
import { JobPosition, JOB_STATUS_LABELS } from '../types';

// 职位列表页面
const JobListPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosition[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    // TODO: 替换为真实 API 调用
    // const fetchJobs = async () => {
    //   try {
    //     const response = await fetch('/api/v1/jobs');
    //     const data = await response.json();
    //     setJobs(data);
    //     setFilteredJobs(data);
    //   } catch (error) {
    //     console.error('获取职位列表失败:', error);
    //     alert('获取职位列表失败');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchJobs();

    // 使用 mock 数据
    setJobs(mockJobPositions);
    setFilteredJobs(mockJobPositions);
  }, []);

  useEffect(() => {
    if (selectedStatus) {
      setFilteredJobs(jobs.filter(job => job.status === selectedStatus));
    } else {
      setFilteredJobs(jobs);
    }
  }, [selectedStatus, jobs]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-completed';
      case 'draft':
        return 'status-partial';
      case 'paused':
        return 'status-processing';
      case 'closed':
        return 'status-failed';
      default:
        return '';
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/jobs/${id}/edit`);
  };

  const handleCopy = (record: JobPosition) => {
    // 创建新的职位对象，复制原职位信息，但修改一些字段
    const newJob: JobPosition = {
      ...record,
      id: `copy_${record.id}_${Date.now()}`, // 生成新的唯一ID
      positionName: `${record.positionName}_副本`,
      status: 'draft', // 复制的职位默认为草稿状态
      createdAt: new Date().toISOString(), // 更新创建时间为当前时间
      updatedAt: new Date().toISOString(), // 更新更新时间为当前时间
    };

    // TODO: 替换为真实 API 调用
    // const copyJob = async () => {
    //   try {
    //     const response = await fetch('/api/v1/jobs', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(newJob),
    //     });
    //     const createdJob = await response.json();
    //     setJobs([...jobs, createdJob]);
    //     setFilteredJobs([...filteredJobs, createdJob]);
    //     alert('职位复制成功');
    //   } catch (error) {
    //     console.error('复制职位失败:', error);
    //     alert('复制职位失败');
    //   }
    // };
    // copyJob();

    // 使用 mock 数据
    setJobs([...jobs, newJob]);
    setFilteredJobs([...filteredJobs, newJob]);
    alert('职位复制成功');
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个职位吗？此操作不可恢复。')) {
      try {
        // TODO: 替换为真实 API 调用
        // await fetch(`/api/v1/jobs/${id}`, { method: 'DELETE' });
        setJobs(jobs.filter(job => job.id !== id));
        setFilteredJobs(filteredJobs.filter(job => job.id !== id));
        alert('删除成功');
      } catch (error) {
        console.error('删除职位失败:', error);
        alert('删除职位失败');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">职位管理</h2>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all flex items-center space-x-2"
          onClick={() => navigate('/jobs/new')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>新建职位</span>
        </button>
      </div>

      {/* 状态筛选按钮 */}
      <div className="flex space-x-3">
        <button
          className={`px-4 py-2 rounded-xl font-medium text-sm ${
            selectedStatus === null
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          onClick={() => setSelectedStatus(null)}
        >
          全部
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-medium text-sm ${
            selectedStatus === 'active'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          onClick={() => setSelectedStatus('active')}
        >
          启用
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-medium text-sm ${
            selectedStatus === 'draft'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          onClick={() => setSelectedStatus('draft')}
        >
          草稿
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-medium text-sm ${
            selectedStatus === 'paused'
              ? 'bg-yellow-500 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          onClick={() => setSelectedStatus('paused')}
        >
          暂停
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-medium text-sm ${
            selectedStatus === 'closed'
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          onClick={() => setSelectedStatus('closed')}
        >
          关闭
        </button>
      </div>

      {/* 职位列表 */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden card-shadow">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              {['职位名称', '职位类型', '职位类别', '状态', '创建时间', '操作'].map((head) => (
                <th key={head} className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredJobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2m8 0V9a2 2 0 01-2 2H8a2 2 0 01-2-2V7m6 0V4a2 2 0 00-2-2H8a2 2 0 00-2 2v3m6 0V9a2 2 0 01-2 2H8a2 2 0 01-2-2V7" />
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-slate-700">{job.positionName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{job.positionType || '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{job.category || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`${getStatusClass(job.status)} px-2.5 py-1 rounded-full text-[11px] font-bold`}>
                    {JOB_STATUS_LABELS[job.status as keyof typeof JOB_STATUS_LABELS]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{new Date(job.createdAt).toLocaleString('zh-CN')}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button 
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      onClick={() => handleEdit(job.id)}
                    >
                      编辑
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      onClick={() => handleCopy(job)}
                    >
                      复制
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                      onClick={() => handleDelete(job.id)}
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 职位编辑页面
const JobEditPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPosition | null>(null);
  const [formData, setFormData] = useState({
    positionName: '',
    positionType: '',
    category: '',
    status: 'active',
    description: ''
  });

  useEffect(() => {
    if (jobId === 'new') {
      // 新建职位
      setJob(null);
    } else {
      // 编辑现有职位
      // 使用 mock 数据
      const mockJob = mockJobPositions.find(job => job.id === jobId);
      if (mockJob) {
        setJob(mockJob);
        setFormData({
          positionName: mockJob.positionName,
          positionType: mockJob.positionType || '',
          category: mockJob.category || '',
          status: mockJob.status,
          description: mockJob.description || ''
        });
      }
    }
  }, [jobId]);

  const handleSubmit = async () => {
    try {
      // TODO: 替换为真实 API 调用
      alert(jobId === 'new' ? '创建成功' : '更新成功');
      navigate('/jobs');
    } catch (error) {
      console.error('保存职位失败:', error);
      alert('保存职位失败');
    }
  };

  const handleCancel = () => {
    navigate('/jobs');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={handleCancel} 
          className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回
        </button>
      </div>
      
      <div className="bg-white rounded-3xl border border-slate-100 p-8 card-shadow">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">
          {jobId === 'new' ? '新建职位' : `编辑职位 - ${job?.positionName}`}
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">职位名称 *</label>
            <input
              type="text"
              name="positionName"
              value={formData.positionName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm shadow-sm"
              placeholder="请输入职位名称"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">职位类型</label>
            <select
              name="positionType"
              value={formData.positionType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm shadow-sm"
            >
              <option value="">请选择职位类型</option>
              <option value="technical">技术</option>
              <option value="product">产品</option>
              <option value="design">设计</option>
              <option value="marketing">市场</option>
              <option value="operations">运营</option>
              <option value="finance">财务</option>
              <option value="hr">人事</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">职位类别</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm shadow-sm"
            >
              <option value="">请选择职位类别</option>
              <option value="fulltime">全职</option>
              <option value="parttime">兼职</option>
              <option value="internship">实习</option>
              <option value="contract">合同工</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">状态 *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm shadow-sm"
            >
              <option value="active">启用</option>
              <option value="draft">草稿</option>
              <option value="paused">暂停</option>
              <option value="closed">关闭</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">职位描述</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm shadow-sm"
              placeholder="请输入职位描述"
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-2xl font-medium transition-colors"
              onClick={handleCancel}
            >
              取消
            </button>
            <button
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-colors"
              onClick={handleSubmit}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 职位管理页面 - 根据路由渲染不同子页面
const PositionManagementPage: React.FC = () => {
  const location = useLocation();
  const isEditRoute = location.pathname.includes('/edit') || location.pathname.endsWith('/new');

  return isEditRoute ? <JobEditPage /> : <JobListPage />;
};

export default PositionManagementPage;