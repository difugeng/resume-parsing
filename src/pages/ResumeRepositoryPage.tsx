import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Input, 
  Button, 
  Select, 
  Slider, 
  DatePicker, 
  Tag, 
  Table, 
  Progress, 
  Space, 
  message,
  Row,
  Col,
  Dropdown,
  MenuProps
} from 'antd';
import { SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { IndexedResume } from '../types';
import { mockIndexedResumes } from '../mockData';
import ResumeDetailModal from '../components/ResumeDetailModal';

const { RangePicker } = DatePicker;

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
  const [loading, setLoading] = useState<boolean>(true);
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
      setLoading(false);
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
  const positionOptions = ['前端开发工程师', 'Java开发工程师', '产品策划经理', 'UI/UX设计师', '数据挖掘工程师', 'DevOps工程师', '自动化测试工程师', '机器学习工程师', '项目管理专家'];

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
    message.info(`搜索关键词: ${searchKeyword}`);
  };

  // 处理回车搜索
  const handleSearchPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (_text: string, record: IndexedResume) => (
        <a onClick={() => {
          setSelectedResume(record);
          setDetailModalVisible(true);
        }}>
          {record.name}
        </a>
      )
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      sorter: true
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      sorter: true
    },
    {
      title: '当前职位',
      dataIndex: 'currentPosition',
      key: 'currentPosition',
      sorter: true
    },
    {
      title: '公司',
      dataIndex: 'currentCompany',
      key: 'currentCompany',
      sorter: true
    },
    {
      title: '城市',
      dataIndex: 'location',
      key: 'location',
      sorter: true
    },
    {
      title: '匹配职位',
      key: 'matchedPosition',
      sorter: true,
      render: (_: any, record: IndexedResume) => (
          <div>
            <div style={{ marginBottom: 4 }}>{record.matchedPosition || '—'}</div>
            {record.matchScore !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Progress 
                  percent={record.matchScore} 
                  size="small" 
                  showInfo={false}
                  strokeWidth={6}
                  style={{ flex: 1, maxWidth: 80 }}
                  strokeColor={record.matchScore >= 80 ? '#52c41a' : record.matchScore >= 60 ? '#faad14' : '#f5222d'} 
                />
                <span style={{ fontSize: '12px', color: '#666', minWidth: '30px' }}>{record.matchScore}%</span>
              </div>
            )}
          </div>
        )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      sorter: true
    },
    {
      title: '解析时间',
      dataIndex: 'parsedAt',
      key: 'parsedAt',
      sorter: true,
      render: (text: string) => new Date(text).toLocaleString('zh-CN')
    },
    {
      title: '操作',
      key: 'action',
      render: (_unused: any, record: IndexedResume) => (
        <Button 
          type="link" 
          onClick={() => {
            // TODO: 实际API调用 - 跳转到对应的解析任务详情页面
            // 这里应该根据简历ID获取对应的解析任务ID，然后跳转
            // 暂时使用一个模拟的任务ID进行跳转
            navigate(`/tasks/${record.resumeId}`);
          }}
        >
          查看详情
        </Button>
      )
    }
  ];

  // 表格选择配置
  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRows(selectedRowKeys as string[]);
    }
  };

  // 批量操作菜单
  const batchMenuItems: MenuProps['items'] = [
    {
      key: 'export',
      label: '导出选中',
    },
    {
      key: 'contact',
      label: '标记为已联系',
    },
  ];

  // 处理批量操作
  const handleBatchOperation = (key: string) => {
    if (selectedRows.length === 0) {
      message.warning('请先选择要操作的简历');
      return;
    }

    switch (key) {
      case 'export':
        message.success(`已导出 ${selectedRows.length} 份简历`);
        break;
      case 'contact':
        message.success(`已标记 ${selectedRows.length} 份简历为已联系`);
        break;
      default:
        break;
    }
  };

  // 处理表格排序
  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    if (sorter.field && sorter.order) {
      setSortConfig({
        field: sorter.field,
        order: sorter.order
      });
    } else {
      setSortConfig({
        field: '',
        order: undefined
      });
    }
  };

  // 显示的筛选条件标签
  const filterTags = Object.entries(selectedFilters).map(([key, value]) => {
    let label = '';
    let displayValue = '';

    switch (key) {
      case 'city':
        label = '当前城市';
        displayValue = value.join('、');
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
        displayValue = value.join('、');
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
      <Tag 
        key={key} 
        closable 
        onClose={() => removeFilter(key)}
      >
        {label}: {displayValue}
      </Tag>
    );
  });

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        {/* 搜索框 */}
        <div style={{ marginBottom: 24 }}>
          <Input.Search
            placeholder="输入关键词或自然语言，如 '3年Python经验'"
            enterButton={<Button type="primary" icon={<SearchOutlined />}>搜索</Button>}
            size="large"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            onPressEnter={handleSearchPress}
          />
        </div>

        {/* 高级筛选按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Button 
            type="link" 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            icon={showAdvancedFilters ? <UpOutlined /> : <DownOutlined />}
          >
            {showAdvancedFilters ? '收起筛选' : '高级筛选'}
          </Button>
        </div>

        {/* 高级筛选面板 */}
        {showAdvancedFilters && (
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>当前城市</div>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择城市"
                  options={cityOptions.map(city => ({ label: city, value: city }))}
                  value={selectedFilters.city || []}
                  onChange={(value) => handleFilterChange('city', value)}
                />
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>最高学历</div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择学历"
                  options={degreeOptions.map(degree => ({ label: degree, value: degree }))}
                  value={selectedFilters.degree || undefined}
                  onChange={(value) => handleFilterChange('degree', value)}
                />
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>工作年限</div>
                <Slider
                  range
                  min={0}
                  max={20}
                  defaultValue={[0, 20]}
                  value={selectedFilters.workYears || [0, 20]}
                  onChange={(value) => handleFilterChange('workYears', value)}
                />
                <div style={{ textAlign: 'center' }}>
                  {(selectedFilters.workYears || [0, 20]).join('-')}年
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>硬技能</div>
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="请选择或输入技能"
                  options={skillOptions.map(skill => ({ label: skill, value: skill }))}
                  value={selectedFilters.skills || []}
                  onChange={(value) => handleFilterChange('skills', value)}
                />
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>匹配度</div>
                <Slider
                  range
                  min={0}
                  max={100}
                  defaultValue={[0, 100]}
                  value={selectedFilters.matchScore || [0, 100]}
                  onChange={(value) => handleFilterChange('matchScore', value)}
                />
                <div style={{ textAlign: 'center' }}>
                  {(selectedFilters.matchScore || [0, 100]).join('-')}%
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>来源</div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择来源"
                  options={sourceOptions.map(source => ({ label: source, value: source }))}
                  value={selectedFilters.source || '全部'}
                  onChange={(value) => handleFilterChange('source', value)}
                />
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>解析时间</div>
                <RangePicker
                  style={{ width: '100%' }}
                  value={selectedFilters.parsedDate || undefined}
                  onChange={(dates) => handleFilterChange('parsedDate', dates)}
                />
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>匹配职位</div>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择匹配职位"
                  options={positionOptions.map(position => ({ label: position, value: position }))}
                  value={selectedFilters.matchedPosition || []}
                  onChange={(value) => handleFilterChange('matchedPosition', value)}
                />
              </Col>
            </Row>
          </Card>
        )}

        {/* 已选条件标签 */}
        <div style={{ marginBottom: 16 }}>
          {filterTags}
        </div>

        {/* 批量操作和表格 */}
        <div>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Dropdown
                menu={{ 
                  items: batchMenuItems,
                  onClick: ({ key }) => handleBatchOperation(key)
                }}
              >
                <Button>
                  批量操作 <DownOutlined />
                </Button>
              </Dropdown>
              <span>
                已选择 {selectedRows.length} 项
              </span>
            </Space>
          </div>

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            rowKey="resumeId"
            loading={loading}
            onChange={handleTableChange}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredData.length,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size || 10);
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`
            }}
          />
        </div>
      </Card>

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