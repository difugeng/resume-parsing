import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadPage: React.FC = () => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [recognitionType, setRecognitionType] = useState<'system' | 'target'>('system');
  const [targetPosition, setTargetPosition] = useState<string>('前端工程师');
  const navigate = useNavigate();

  const targetPositions = [
    '前端工程师',
    '后端工程师', 
    '全栈工程师',
    '产品经理',
    'UI设计师',
    '数据分析师',
    '算法工程师',
    '测试工程师'
  ];

  const handleStartParse = () => {
    if (fileList.length === 0) {
      alert('请先上传简历文件');
      return;
    }

    // 模拟创建任务
    // TODO: 替换为真实 API 调用
    // const response = await fetch('/api/v1/tasks', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     files: fileList,
    //     recognitionType,
    //     targetPosition: recognitionType === 'target' ? targetPosition : undefined
    //   })
    // });
    // const task = await response.json();

    // 根据文件数量决定跳转到哪个任务
    if (fileList.length === 1) {
      // 跳转到单个简历任务详情页 - 使用系统识别的单个任务
      navigate('/tasks/task-001');
    } else {
      // 跳转到批量任务详情页
      navigate('/tasks/task-002');
    }
    
    alert(`已开始解析 ${fileList.length} 份简历`);
  };

  const handleGoBack = () => {
    navigate('/tasks');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // 验证文件类型和大小
      const validFiles = files.filter(file => {
        const allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        if (!allowedTypes.includes(fileExtension || '')) {
          alert(`${file.name} 文件格式不支持！`);
          return false;
        }
        
        if (file.size > 20 * 1024 * 1024) {
          alert(`${file.name} 文件大小超过20MB限制！`);
          return false;
        }
        
        return true;
      });
      
      setFileList(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFileList(prev => prev.filter((_, i) => i !== index));
  };

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
        <h2 className="text-2xl font-bold text-slate-800 mb-8">上传简历文件</h2>
        
        <div className="mb-8">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-6 py-3 rounded-xl font-medium text-sm ${
                recognitionType === 'system'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              onClick={() => setRecognitionType('system')}
            >
              系统识别
            </button>
            <button
              className={`px-6 py-3 rounded-xl font-medium text-sm ${
                recognitionType === 'target'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              onClick={() => setRecognitionType('target')}
            >
              目标职位
            </button>
          </div>
          
          {recognitionType === 'target' && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">目标职位</label>
              <select
                value={targetPosition}
                onChange={(e) => setTargetPosition(e.target.value)}
                className="w-full md:w-80 px-4 py-3 border border-slate-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm shadow-sm"
              >
                {targetPositions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors mb-8">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium text-slate-700 mb-1">点击或拖拽简历文件到此区域进行上传</p>
              <p className="text-slate-500">支持单次上传多个文件，支持格式：PDF, DOC, DOCX, TXT, JPG, PNG</p>
            </div>
          </label>
        </div>
        
        {fileList.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">已选择的文件 ({fileList.length})</h3>
            <div className="space-y-3">
              {fileList.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            className={`px-8 py-3 rounded-2xl font-bold text-white shadow-xl transition-all ${
              fileList.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
            onClick={handleStartParse}
            disabled={fileList.length === 0}
          >
            开始解析
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;