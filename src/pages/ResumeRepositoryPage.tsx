import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndexedResume } from '../types';
import { mockIndexedResumes } from '../mockData';
import ResumeDetailModal from '../components/ResumeDetailModal';

const ResumeRepositoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [data, setData] = useState<IndexedResume[]>([]);
  const [filteredData, setFilteredData] = useState<IndexedResume[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [selectedResume, setSelectedResume] = useState<IndexedResume | null>(null);
  const [sortConfig, setSortConfig] = useState<{ field: string; order: 'ascend' | 'descend' | undefined }>({
    field: '',
    order: undefined
  });

  // 模拟从API获取数据
  useEffect(() => {
    // TODO: 实际API调用 - GET /api/v1/resumes
    setTimeout(() => {
      setData(mockIndexedResumes);
      setFilteredData(mockIndexedResumes);
    }, 500);
  }, []);

  // 过滤选项
  const cityOptions = ['北京', '上海', '深圳', '广州', '杭州', '成都', '武汉', '西安', '南京'];
  const degreeOptions = ['不限', '本科', '硕士', '博士'];
  const sourceOptions = ['全部', 'BOSS直聘', '内部推荐', '批量上传'];
  const skillOptions = [
    'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'Java', 'Python', 
    'C++', 'C#', 'Node.js', 'PHP', 'Go', 'Swift', 'Kotlin', 'SQL', 'NoSQL',
    'MongoDB', 'MySQL', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure',
    'GCP', 'Linux', 'Git', 'Jenkins', 'Figma', 'Sketch', 'Photoshop', 'Illustrator',
    'TensorFlow', 'PyTorch', '机器学习', '深度学习', '数据分析', '数据挖掘', 'PMP'
  ];

  // 应用筛选
  useEffect(() => {
    let result = [...data];

    // 搜索关键词筛选
    if (searchKeyword) {
      result = result.filter(resume => 
        resume.name.includes(searchKeyword) ||
        resume.currentPosition.includes(searchKeyword) ||
        resume.currentCompany.includes(searchKeyword) ||
        resume.hardSkills.some(skill => skill.includes(searchKeyword))
      );
    }

    // 高级筛选
    if (selectedFilters.city && selectedFilters.city.length > 0) {
      result = result.filter(resume => selectedFilters.city.includes(resume.location));
    }

    if (selectedFilters.degree && selectedFilters.degree !== '不限') {
      result = result.filter(resume => resume.highestDegree === selectedFilters.degree);
    }

    if (selectedFilters.workYears) {
      const [min, max] = selectedFilters.workYears;
      result = result.filter(resume => resume.workYears >= min && resume.workYears <= max);
    }

    if (selectedFilters.skills && selectedFilters.skills.length > 0) {
      result = result.filter(resume => 
        selectedFilters.skills.some((skill: string) => resume.hardSkills.includes(skill))
      );
    }

    if (selectedFilters.matchScore) {
      const [min, max] = selectedFilters.matchScore;
      result = result.filter(resume => {
        if (resume.matchScore === undefined) return false;
        return resume.matchScore >= min && resume.matchScore <= max;
      });
    }

    if (selectedFilters.source && selectedFilters.source !== '全部') {
      result = result.filter(resume => resume.source === selectedFilters.source);
    }

    if (selectedFilters.parsedDate) {
      const [startDate, endDate] = selectedFilters.parsedDate;
      result = result.filter(resume => {
        const parsedDate = new Date(resume.parsedAt);
        return parsedDate >= startDate && parsedDate <= endDate;
      });
    }

    if (selectedFilters.matchedPosition && selectedFilters.matchedPosition.length > 0) {
      result = result.filter(resume => 
        selectedFilters.matchedPosition.some((position: string) => 
          resume.matchedPosition && resume.matchedPosition.includes(position)
        )
      );
    }

    // 排序
    if (sortConfig.field && sortConfig.order) {
      result.sort((a, b) => {
        // @ts-ignore
        let aValue = a[sortConfig.field];
        // @ts-ignore
        let bValue = b[sortConfig.field];

        if (sortConfig.field === 'parsedAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.order === 'ascend' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.order === 'ascend' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredData(result);
  }, [data, searchKeyword, selectedFilters, sortConfig]);

  // 处理筛选条件变化
  const handleFilterChange = (key: string, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 移除筛选条件
  const removeFilter = (key: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  // 处理搜索
  const handleSearch = () => {
    // 这里可以添加搜索逻辑
    alert(`搜索关键词: ${searchKeyword}`);
  };

  // 处理回车搜索
  const handleSearchPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 处理排序
  const handleSort = (field: string) => {
    let order: 'ascend' | 'descend' | undefined = 'ascend';
    if (sortConfig.field === field && sortConfig.order === 'ascend') {
      order = 'descend';
    } else if (sortConfig.field === field && sortConfig.order === 'descend') {
      order = undefined;
    }
    setSortConfig({ field, order });
  };

  // 获取排序图标
  const getSortIcon = (field: string) => {
    if (sortConfig.field !== field) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    if (sortConfig.order === 'ascend') {
      return (
        <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      );
    } else if (sortConfig.order === 'descend') {
      return (
        <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
    return null;
  };

  // 表格选择处理
  const handleRowSelect = (resumeId: string) => {
    if (selectedRows.includes(resumeId)) {
      setSelectedRows(selectedRows.filter(id => id !== resumeId));
    } else {
      setSelectedRows([...selectedRows, resumeId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map(item => item.resumeId));
    }
  };

  // 处理批量操作
  const handleBatchOperation = (operation: string) => {
    if (selectedRows.length === 0) {
      alert('请先选择要操作的简历');
      return;
    }

    switch (operation) {
      case 'export':
        alert(`已导出 ${selectedRows.length} 份简历`);
        break;
      case 'contact':
        alert(`已标记 ${selectedRows.length} 份简历为已联系`);
        break;
      default:
        break;
    }
  };

  // 显示的筛选条件标签
  const filterTags = Object.entries(selectedFilters).map(([key, value]) => {
    let label = '';
    let displayValue = '';

    switch (key) {
      case 'city':
        label = '当前城市';
        displayValue = Array.isArray(value) ? value.join('、') : value;
        break;
      case 'degree':
        label = '最高学历';
        displayValue = value;
        break;
      case 'workYears':
        label = '工作年限';
        displayValue = `${value[0]}-${value[1]}年`;
        break;
      case 'skills':
        label = '硬技能';
        displayValue = Array.isArray(value) ? value.join('、') : value;
        break;
      case 'matchScore':
        label = '匹配度';
        displayValue = `${value[0]}-${value[1]}%`;
        break;
      case 'source':
        label = '来源';
        displayValue = value;
        break;
      case 'parsedDate':
        label = '解析时间';
        displayValue = `${value[0].toLocaleDateString()} - ${value[1].toLocaleDateString()}`;
        break;
      default:
        label = key;
        displayValue = String(value);
    }

    return (
      <span 
        key={key} 
        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 mr-2 mb-2"
      >
        {label}: {displayValue}
        <button 
          onClick={() => removeFilter(key)}
          className="ml-2 text-blue-600 hover:text-blue-800"
        >
          ×
        </button>
      </span>
    );
  });

  // 分页处理
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 card-shadow">
        {/* 搜索框 */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="输入关键词或自然语言，如 '3年Python经验'"
              className="w-full p-4 pl-12 pr-32 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleSearchPress}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl font-medium transition-colors"
              onClick={handleSearch}
            >
              搜索
            </button>
          </div>
        </div>

        {/* 高级筛选按钮 */}
        <div className="mb-4">
          <button 
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            {showAdvancedFilters ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
                收起筛选
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                高级筛选
              </>
            )}
          </button>
        </div>

        {/* 高级筛选面板 */}
        {showAdvancedFilters && (
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">当前城市</label>
                <select
                  multiple
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedFilters.city || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    handleFilterChange('city', values);
                  }}
                >
                  {cityOptions.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">最高学历</label>
                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedFilters.degree || ''}
                  onChange={(e) => handleFilterChange('degree', e.target.value)}
                >
                  <option value="">请选择学历</option>
                  {degreeOptions.map(degree => (
                    <option key={degree} value={degree}>{degree}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">工作年限</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={selectedFilters.workYears ? selectedFilters.workYears[1] || 20 : 20}
                    onChange={(e) => {
                      const currentValue = selectedFilters.workYears || [0, 20];
                      handleFilterChange('workYears', [currentValue[0], parseInt(e.target.value)]);
                    }}
                    className="w-full"
                  />
                  <div className="text-center">
                    {selectedFilters.workYears ? `${selectedFilters.workYears.join('-')}` : '0-20'}年
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">硬技能</label>
                <select
                  multiple
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedFilters.skills || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    handleFilterChange('skills', values);
                  }}
                >
                  {skillOptions.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">匹配度</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedFilters.matchScore ? selectedFilters.matchScore[1] || 100 : 100}
                    onChange={(e) => {
                      const currentValue = selectedFilters.matchScore || [0, 100];
                      handleFilterChange('matchScore', [currentValue[0], parseInt(e.target.value)]);
                    }}
                    className="w-full"
                  />
                  <div className="text-center">
                    {selectedFilters.matchScore ? `${selectedFilters.matchScore.join('-')}%` : '0-100%'}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">来源</label>
                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedFilters.source || ''}
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                >
                  <option value="">请选择来源</option>
                  {sourceOptions.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 已选条件标签 */}
        <div className="mb-6">
          {filterTags}
        </div>

        {/* 批量操作和表格 */}
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                  批量操作
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10 hidden group-hover:block">
                  <button 
                    className="block w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                    onClick={() => handleBatchOperation('export')}
                  >
                    导出选中
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                    onClick={() => handleBatchOperation('contact')}
                  >
                    标记为已联系
                  </button>
                </div>
              </div>
              <span className="text-slate-600">
                已选择 {selectedRows.length} 项
              </span>
            </div>
          </div>

          {/* 表格 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      姓名
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center">
                      手机号
                      {getSortIcon('phone')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      邮箱
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('currentPosition')}
                  >
                    <div className="flex items-center">
                      当前职位
                      {getSortIcon('currentPosition')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('currentCompany')}
                  >
                    <div className="flex items-center">
                      公司
                      {getSortIcon('currentCompany')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('location')}
                  >
                    <div className="flex items-center">
                      城市
                      {getSortIcon('location')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('matchedPosition')}
                  >
                    <div className="flex items-center">
                      匹配职位
                      {getSortIcon('matchedPosition')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('source')}
                  >
                    <div className="flex items-center">
                      来源
                      {getSortIcon('source')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('parsedAt')}
                  >
                    <div className="flex items-center">
                      解析时间
                      {getSortIcon('parsedAt')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {paginatedData.map((resume) => (
                  <tr key={resume.resumeId} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(resume.resumeId)}
                        onChange={() => handleRowSelect(resume.resumeId)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <button 
                        onClick={() => {
                          setSelectedResume(resume);
                          setDetailModalVisible(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {resume.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {resume.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {resume.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {resume.currentPosition}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {resume.currentCompany}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {resume.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500 mb-1">{resume.matchedPosition || '—'}</div>
                      {resume.matchScore !== undefined && (
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                resume.matchScore >= 80 ? 'bg-green-500' : 
                                resume.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${resume.matchScore}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-500">{resume.matchScore}%</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {resume.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(resume.parsedAt).toLocaleString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          // TODO: 实际API调用 - 跳转到对应的解析任务详情页面
                          // 这里应该根据简历ID获取对应的解析任务ID，然后跳转
                          // 暂时使用一个模拟的任务ID进行跳转
                          navigate(`/tasks/${resume.resumeId}`);
                        }}
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-700">
              共 <span className="font-medium">{filteredData.length}</span> 条
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={`p-2 rounded-lg ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-700">每页</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-200 rounded-lg p-2 text-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-slate-700">条</span>
            </div>
          </div>
        </div>
      </div>

      {/* 简历详情弹窗 */}
      {selectedResume && (
        <ResumeDetailModal
          visible={detailModalVisible}
          resume={selectedResume}
          onClose={() => setDetailModalVisible(false)}
        />
      )}
    </div>
  );
};

export default ResumeRepositoryPage;