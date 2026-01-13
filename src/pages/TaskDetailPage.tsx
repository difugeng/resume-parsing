import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ParseTask, ParsedResume, ResumeFileStatus } from '../types';
import { getMockTaskById, mockResumeDetail } from '../mockData';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const DIMENSIONS = [
  { subject: '技能匹配', A: 85, fullMark: 100 },
  { subject: '经验匹配', A: 90, fullMark: 100 },
  { subject: '学历匹配', A: 70, fullMark: 100 },
  { subject: '稳定性匹配', A: 65, fullMark: 100 },
  { subject: '语义匹配', A: 95, fullMark: 100 },
];

const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<ParseTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportType, setExportType] = useState<'单个' | '批量'>('单个');
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    // TODO: 替换为真实 API 调用
    // const res = await fetch(`/api/v1/tasks/${taskId}`);
    // setTask(await res.json());
    const mockTask = getMockTaskById(taskId!);
    setTask(mockTask || null);
    setLoading(false);
  }, [taskId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!task) {
    return <div className="text-center py-10 text-gray-500">任务不存在</div>;
  }

  const handleGoBack = () => {
    navigate('/tasks');
  };

  const handleExport = (format: 'JSON' | 'XML' | '表格') => {
    // TODO: 替换为真实 API 调用
    // const response = await fetch(`/api/v1/tasks/${taskId}/export`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ format, resumeId: task.resumes[0].id })
    // });
    // const blob = await response.blob();
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `resume_export.${format.toLowerCase()}`;
    // a.click();
    
    alert(`已导出为${format}格式`);
    setExportModalVisible(false);
  };
  
  const showExportModal = (type: '单个' | '批量') => {
    setExportType(type);
    setExportModalVisible(true);
  };
  
  const handleExportModalOk = (format: 'JSON' | 'XML' | '表格') => {
    handleExport(format);
  };

  const getStatusColor = (status: ResumeFileStatus) => {
    switch (status) {
      case '成功':
        return 'bg-green-100 text-green-800';
      case '失败':
        return 'bg-red-100 text-red-800';
      case '处理中':
        return 'bg-blue-100 text-blue-800';
      case '待处理':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (task && 'resumes' in task && Array.isArray(task.resumes) && task.resumes.length === 1 && task.resumes[0].status === '成功') {
    const resume = task.resumes[0];

    return (
      <div className="max-w-[1600px] mx-auto space-y-6 pb-20 px-4 md:px-0">
        {/* 详情头部导航 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button onClick={handleGoBack} className="p-3 bg-white hover:bg-slate-100 rounded-2xl transition-all border border-slate-100 shadow-sm group">
              <svg className="w-5 h-5 text-slate-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{resume.filename || '未命名文件'}</h2>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1 font-medium">
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  解析时间：{new Date(task.createdAt).toLocaleString('zh-CN')}
                </span>
                <span className="text-slate-200">|</span>
                <span 
                  className="text-blue-600 font-bold hover:underline cursor-pointer" 
                  onClick={() => setPreviewVisible(true)}
                >
                  原始文件预览
                </span>
              </div>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
            展开全部解析
          </button>
        </div>

        {/* 核心步骤条 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-around relative min-w-[600px]">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-slate-100 -z-0">
              <div className="h-full bg-blue-600 w-full animate-progress-reveal"></div>
            </div>
            {['文件上传', '文本提取', '结构化解析', '质量检查', '岗位匹配'].map((step, i) => (
              <div key={i} className="flex flex-col items-center z-10 bg-white px-4 group">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mb-2 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* 左侧：简历解析正文 */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* 基础信息 */}
            <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-black text-slate-800">基础信息</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">姓名</p>
                  <p className="text-base font-black text-slate-800">{resume.basicInfo?.name || '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">电话</p>
                  <p className="text-base font-black text-slate-800">{resume.basicInfo?.phone || '—'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">邮箱</p>
                  <p className="text-base font-black text-slate-800">{resume.basicInfo?.email || '—'}</p>
                </div>
              </div>
            </section>

            {/* 教育背景 */}
            <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-black text-slate-800">教育背景</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-left bg-slate-50/50">
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="p-4 rounded-tl-xl">学校</th>
                      <th className="p-4">学历</th>
                      <th className="p-4">专业</th>
                      <th className="p-4 rounded-tr-xl">时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resume.education?.map((edu: any, idx: number) => (
                      <tr key={idx} className="text-sm hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{edu.school}</td>
                        <td className="p-4 text-slate-600">{edu.degree}</td>
                        <td className="p-4 text-slate-600">{edu.major}</td>
                        <td className="p-4 text-slate-500 font-medium">{edu.startDate} 至 {edu.endDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 工作经历 */}
            <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-black text-slate-800">工作经历</h3>
              </div>
              <div className="space-y-0">
                <div className="flex border border-slate-100 rounded-2xl overflow-hidden text-xs">
                  <div className="w-24 p-4 bg-slate-50 font-bold border-r border-slate-100">公司</div>
                  <div className="w-24 p-4 bg-slate-50 font-bold border-r border-slate-100">职位</div>
                  <div className="w-32 p-4 bg-slate-50 font-bold border-r border-slate-100">时间</div>
                  <div className="flex-1 p-4 bg-slate-50 font-bold">职责</div>
                </div>
                {resume.workExperience?.map((work: any, idx: number) => (
                  <div key={idx} className="flex border-x border-b border-slate-100 rounded-b-2xl text-sm">
                    <div className="w-24 p-4 font-bold text-slate-800 text-xs">{work.company}</div>
                    <div className="w-24 p-4 text-slate-600 text-xs">{work.position}</div>
                    <div className="w-32 p-4 text-slate-500 font-medium text-xs">{work.startDate} 至 {work.endDate}</div>
                    <div className="flex-1 p-4 text-xs text-slate-600 leading-relaxed space-y-2">
                      {work.responsibilities.map((resp: string, respIdx: number) => (
                        <p key={respIdx}>{respIdx + 1}. {resp}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 项目经历 */}
            <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-black text-slate-800">项目经历</h3>
              </div>
              <div className="space-y-6">
                {resume.workExperience?.map((work: any, i: number) => (
                  <div key={i} className="group p-6 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-blue-200 rounded-3xl transition-all shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-1.5 h-6 bg-blue-200 group-hover:bg-blue-600 rounded-full transition-colors"></div>
                        <h4 className="font-black text-slate-800 text-base">{work.company} - {work.position}</h4>
                      </div>
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-tighter shadow-sm">{work.startDate} 至 {work.endDate}</span>
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line pl-4 border-l border-slate-200 ml-0.5">
                      {work.responsibilities.map((resp: string, idx: number) => (
                        <p key={idx}>{idx + 1}. {resp}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 技能图谱 */}
            <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-black text-slate-800">技能图谱</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">硬核技术 (Hard Skills)</h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills?.hardSkills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-[11px] font-bold border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors cursor-default">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">软技能 (Soft Skills)</h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills?.softSkills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[11px] font-bold border border-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-default">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 风险提示 - 还原截图数据 */}
            <section className="bg-white rounded-[2rem] border-2 border-red-50 shadow-xl p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <svg className="w-32 h-32 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                <h3 className="text-lg font-black text-slate-800">风险风险预警 (Risk Indicators)</h3>
              </div>
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left table-fixed">
                  <thead className="bg-slate-50">
                    <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="p-4 w-28">风险分类</th>
                      <th className="p-4 w-1/3">风险描述</th>
                      <th className="p-4">支撑证据 (Evidence)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resume.warnings?.map((warning: string, i: number) => (
                      <tr key={i} className="text-xs hover:bg-red-50/10 transition-colors">
                        <td className="p-4">
                          <span className="font-black text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 whitespace-nowrap">解析警告</span>
                        </td>
                        <td className="p-4 text-slate-700 font-bold leading-relaxed">{warning}</td>
                        <td className="p-4 text-slate-500 bg-slate-50/50 italic leading-relaxed font-medium">简历中发现的问题</td>
                      </tr>
                    ))}
                    {(!resume.warnings || resume.warnings.length === 0) && (
                      <tr className="text-xs">
                        <td colSpan={3} className="p-4 text-center text-slate-500">未发现风险</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* 右侧：AI 分析报告面板 */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]"></div>
                
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">智能分析结果 (AI Engine v3.1)</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">REF: RES-88910</span>
                </div>

                {/* 匹配职位环形统计 */}
                <div className="space-y-6 mb-12">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">系统推荐职位匹配度</p>
                  <div className="space-y-4">
                    <div className="bg-slate-800/80 backdrop-blur p-5 rounded-3xl border border-white/5 shadow-inner">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-base font-black">产品经理</span>
                        <span className="text-2xl font-black text-blue-400 italic">85%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    <div className="bg-slate-800/40 backdrop-blur p-5 rounded-3xl border border-white/5">
                      <div className="flex justify-between items-end mb-2 text-slate-400">
                        <span className="text-sm font-bold">项目经理</span>
                        <span className="text-xl font-bold">78%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-500" style={{width: '78%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 核心匹配雷达 */}
                <div className="space-y-4 mb-10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">职位匹配维度分析 - 产品经理</p>
                  <div className="h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="w-40 h-40 border-2 border-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={DIMENSIONS}>
                        <PolarGrid stroke="#334155" />
                        {React.createElement(PolarAngleAxis as any, { 
                          dataKey: "subject", 
                          tick: { fill: '#94a3b8', fontSize: 10, fontWeight: 700 } 
                        })}
                        <Radar
                          name="候选人素质"
                          dataKey="A"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          fill="#3b82f6"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 结论性亮点 */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[11px] font-black text-green-400 uppercase flex items-center mb-4 tracking-widest">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      匹配点 (Strengths)
                    </h4>
                    <div className="space-y-3">
                      {[
                        '近4年产品经理经验，符合3年及以上要求。',
                        '简历详细描述了需求调研、PRD/原型输出、跨团队协调、产品交付与迭代等核心职责，与岗位要求高度匹配。',
                        '具备金融行业B端地产产品经验，熟悉数据驱动和系统搭建。',
                        '本科学历，计算机专业，符合要求。',
                        '熟练使用Axure等产品工具。',
                        '有技术背景，有助于与技术团队沟通。'
                      ].map((item, i) => (
                        <div key={i} className="flex items-start bg-green-400/5 border border-green-400/20 p-3 rounded-2xl">
                          <span className="text-green-500 mr-2 text-xs font-black">匹配</span>
                          <span className="text-[11px] text-slate-300 font-medium leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-black text-amber-400 uppercase flex items-center mb-4 tracking-widest">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      差距提示 (Gaps)
                    </h4>
                    <div className="space-y-3">
                      {[
                        '职位描述未明确要求金融行业经验，此为加分项但非必需，简历中项目管理职责（如资源协调、排期）与产品经理核心职责有重叠但并非重点差异。',
                        '稳定性风险：仅有一段工作经历，但已持续近4年，风险较低。'
                      ].map((item, i) => (
                        <div key={i} className="flex items-start bg-amber-400/5 border border-amber-400/20 p-3 rounded-2xl">
                          <span className="text-amber-500 mr-2 text-xs font-black">差距</span>
                          <span className="text-[11px] text-slate-300 font-medium leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl">
                    <h4 className="text-[11px] font-black text-blue-400 uppercase mb-3 tracking-widest">总结评估 (AI Summary)</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      候选人经验、技能、教育背景与产品经理岗位要求高度匹配，尤其在金融B端产品全流程管理方面有扎实经验。
                    </p>
                  </div>
                </div>

                <button className="w-full mt-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl text-white font-black text-sm shadow-2xl shadow-blue-900 transition-all active:scale-[0.98] flex items-center justify-center space-x-2">
                  <span>导出详细简历解析包</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Export Modal */}
        {exportModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">{exportType}导出</h3>
                <button 
                  className="text-slate-400 hover:text-slate-600"
                  onClick={() => setExportModalVisible(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <h4 className="font-medium text-slate-700 mb-3">请选择导出格式</h4>
                <div className="space-y-3">
                  <button 
                    className="w-full text-left p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                    onClick={() => handleExportModalOk('JSON')}
                  >
                    JSON 格式
                  </button>
                  <button 
                    className="w-full text-left p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                    onClick={() => handleExportModalOk('XML')}
                  >
                    XML 格式
                  </button>
                  <button 
                    className="w-full text-left p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                    onClick={() => handleExportModalOk('表格')}
                  >
                    表格格式 (Excel)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PDF Preview Modal */}
        {previewVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-4/5 flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold text-slate-800">原始文件预览</h3>
                <div className="flex gap-2">
                  <a 
                    href={mockResumeDetail.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-slate-600 hover:text-blue-600"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    下载文件
                  </a>
                  <button 
                    className="text-slate-400 hover:text-slate-600"
                    onClick={() => setPreviewVisible(false)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4">
                <iframe
                  src={mockResumeDetail.fileUrl}
                  className="w-full h-full border rounded-lg"
                  title="简历文件预览"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 如果是批量任务，显示表格
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-slate-600 hover:text-blue-600 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回
        </button>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 p-6 card-shadow">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">批量任务详情 - {task.taskName}</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-slate-700 mb-3">整体进度</h3>
          <div className="w-full bg-slate-200 rounded-full h-4 mb-2">
            <div 
              className="h-4 rounded-full bg-blue-500" 
              style={{ width: `${Math.round((task.successCount / task.totalFiles) * 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-600">
            成功: {task.successCount}, 失败: {task.failedCount}, 总计: {task.totalFiles}
          </p>
        </div>

        <div className="mb-6">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl font-bold transition-all"
            onClick={() => showExportModal('批量')}
          >
            批量导出
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">文件名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {'resumes' in task && Array.isArray(task.resumes) ? task.resumes.map((record: ParsedResume) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{record.filename}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {record.status === '失败' && (
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        onClick={async () => {
                          // TODO: 替换为真实 API 调用
                          // const response = await fetch(`/api/v1/tasks/${taskId}/retry`, {
                          //   method: 'POST',
                          //   headers: { 'Content-Type': 'application/json' },
                          //   body: JSON.stringify({ resumeId: record.id })
                          // });
                          alert('重试请求已发送');
                        }}
                      >
                        重试
                      </button>
                    )}
                    {record.status === '成功' && (
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          // 对于单个成功简历，我们直接展示详情，而不是跳转
                          // 这里我们模拟显示详情
                          alert('查看详情功能已触发');
                        }}
                      >
                        查看详情
                      </button>
                    )}
                  </td>
                </tr>
              )) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Modal */}
      {exportModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">{exportType}导出</h3>
              <button 
                className="text-slate-400 hover:text-slate-600"
                onClick={() => setExportModalVisible(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <h4 className="font-medium text-slate-700 mb-3">请选择导出格式</h4>
              <div className="space-y-3">
                <button 
                  className="w-full text-left p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                  onClick={() => handleExportModalOk('JSON')}
                >
                  JSON 格式
                </button>
                <button 
                  className="w-full text-left p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                  onClick={() => handleExportModalOk('XML')}
                >
                  XML 格式
                </button>
                <button 
                  className="w-full text-left p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                  onClick={() => handleExportModalOk('表格')}
                >
                  表格格式 (Excel)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetailPage;