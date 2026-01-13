import React from 'react';
import { IndexedResume } from '../types';

interface ResumeDetailModalProps {
  visible: boolean;
  resume: IndexedResume;
  onClose: () => void;
}

const ResumeDetailModal: React.FC<ResumeDetailModalProps> = ({ visible, resume, onClose }) => {
  if (!resume || !visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">{resume.name} - 简历详情</h2>
            <button 
              className="text-slate-400 hover:text-slate-600"
              onClick={onClose}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-8">
            {/* 基础信息 */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">基础信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">姓名</label>
                  <p className="text-slate-800">{resume.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">手机号</label>
                  <p className="text-slate-800">{resume.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">邮箱</label>
                  <p className="text-slate-800">{resume.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">年龄</label>
                  <p className="text-slate-800">{resume.age || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">所在城市</label>
                  <p className="text-slate-800">{resume.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">来源</label>
                  <p className="text-slate-800">{resume.source}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">解析时间</label>
                  <p className="text-slate-800">{new Date(resume.parsedAt).toLocaleString('zh-CN')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">匹配度</label>
                  <p className="text-slate-800">{resume.matchScore ? `${resume.matchScore}%` : '—'}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              {/* 教育背景 */}
              <h3 className="text-lg font-semibold text-slate-800 mb-4">教育背景</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">最高学历</label>
                  <p className="text-slate-800">{resume.highestDegree}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">毕业院校</label>
                  <p className="text-slate-800">{resume.school.join(', ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">专业</label>
                  <p className="text-slate-800">{resume.major}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              {/* 工作经历 */}
              <h3 className="text-lg font-semibold text-slate-800 mb-4">工作经历</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">当前职位</label>
                  <p className="text-slate-800">{resume.currentPosition}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">当前公司</label>
                  <p className="text-slate-800">{resume.currentCompany}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">工作年限</label>
                  <p className="text-slate-800">{resume.workYears}年</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">曾服务公司</label>
                  <p className="text-slate-800">{resume.companies.join(', ')}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              {/* 技能 */}
              <h3 className="text-lg font-semibold text-slate-800 mb-4">技能</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <strong className="text-slate-700 mr-2">硬技能：</strong>
                    <div className="flex flex-wrap gap-2">
                      {resume.hardSkills.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <strong className="text-slate-700 mr-2">软技能：</strong>
                    <div className="flex flex-wrap gap-2">
                      {resume.softSkills.map((skill, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <strong className="text-slate-700 mr-2">语言能力：</strong>
                    <div className="flex flex-wrap gap-2">
                      {resume.languages.map((lang, index) => (
                        <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              {/* 求职意向 */}
              <h3 className="text-lg font-semibold text-slate-800 mb-4">求职意向</h3>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">目标职位</label>
                <p className="text-slate-800">{resume.jobIntent?.targetPosition || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetailModal;