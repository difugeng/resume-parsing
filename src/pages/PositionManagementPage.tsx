import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { mockJobPositions } from '../mockData';
import { JobPosition, JOB_STATUS_LABELS } from '../types';

const { TextArea } = Input;
const { Option } = Select;

// 职位列表页面
const JobListPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
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
    //     message.error('获取职位列表失败');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchJobs();

    // 使用 mock 数据
    setJobs(mockJobPositions);
    setFilteredJobs(mockJobPositions);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedStatus) {
      setFilteredJobs(jobs.filter(job => job.status === selectedStatus));
    } else {
      setFilteredJobs(jobs);
    }
  }, [selectedStatus, jobs]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'draft':
        return 'default';
      case 'paused':
        return 'orange';
      case 'closed':
        return 'red';
      default:
        return 'default';
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
    //     message.success('职位复制成功');
    //   } catch (error) {
    //     console.error('复制职位失败:', error);
    //     message.error('复制职位失败');
    //   }
    // };
    // copyJob();

    // 使用 mock 数据
    setJobs([...jobs, newJob]);
    setFilteredJobs([...filteredJobs, newJob]);
    message.success('职位复制成功');
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    // TODO: 替换为真实 API 调用
    // const updateJobStatus = async () => {
    //   try {
    //     await fetch(`/api/v1/jobs/${id}/status`, {
    //       method: 'PUT',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ status: newStatus }),
    //     });
    //     setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
    //     setFilteredJobs(filteredJobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
    //     message.success('状态更新成功');
    //   } catch (error) {
    //     console.error('更新职位状态失败:', error);
    //     message.error('更新职位状态失败');
    //   }
    // };
    // updateJobStatus();

    // 使用 mock 数据
    setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus as any } : job));
    setFilteredJobs(filteredJobs.map(job => job.id === id ? { ...job, status: newStatus as any } : job));
    message.success('状态更新成功');
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个职位吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // TODO: 替换为真实 API 调用
        // const deleteJob = async () => {
        //   try {
        //     await fetch(`/api/v1/jobs/${id}`, { method: 'DELETE' });
        //     setJobs(jobs.filter(job => job.id !== id));
        //     setFilteredJobs(filteredJobs.filter(job => job.id !== id));
        //     message.success('删除成功');
        //   } catch (error) {
        //     console.error('删除职位失败:', error);
        //     message.error('删除职位失败');
        //   }
        // };
        // deleteJob();

        // 使用 mock 数据
        const updatedJobs = jobs.filter(job => job.id !== id);
        setJobs(updatedJobs);
        setFilteredJobs(updatedJobs);
        message.success('删除成功');
      }
    });
  };

  const columns: any = [
    {
      title: '职位名称',
      dataIndex: 'positionName',
      key: 'positionName',
      sorter: (a: JobPosition, b: JobPosition) => a.positionName.localeCompare(b.positionName),
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{JOB_STATUS_LABELS[status as keyof typeof JOB_STATUS_LABELS]}</Tag>
      ),
      filters: [
        { text: '全部', value: null },
        { text: '草稿', value: 'draft' },
        { text: '招聘中', value: 'active' },
        { text: '暂停招聘', value: 'paused' },
        { text: '已关闭', value: 'closed' },
      ],
      onFilter: (value: any, record: JobPosition) => {
        if (value === null) return true;
        return record.status === value;
      },
    },
    {
      title: '工作地点',
      dataIndex: 'workLocation',
      key: 'workLocation',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleDateString('zh-CN'),
      sorter: (a: JobPosition, b: JobPosition) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: JobPosition) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record.id)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
          <Button 
            type="link" 
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record)}
          >
            复制
          </Button>
          <Select
            value={record.status}
            onChange={(value) => handleStatusChange(record.id, value)}
            style={{ width: 100 }}
            size="small"
          >
            <Option value="draft">草稿</Option>
            <Option value="active">招聘中</Option>
            <Option value="paused">暂停招聘</Option>
            <Option value="closed">已关闭</Option>
          </Select>
        </Space>
      ),
    },
  ];

  const handleAddJob = () => {
    navigate('/jobs/new');
  };

  return (
    <div>
      <Card 
        title="职位管理"
        extra={
          <Space>
            <Select
              placeholder="按状态筛选"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setSelectedStatus(value)}
            >
              <Option value="">全部</Option>
              <Option value="draft">草稿</Option>
              <Option value="active">招聘中</Option>
              <Option value="paused">暂停招聘</Option>
              <Option value="closed">已关闭</Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddJob}>
              新增职位
            </Button>
          </Space>
        }
      >
        <Table 
          dataSource={filteredJobs} 
          columns={columns} 
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>
    </div>
  );
};

// 职位表单页面
const JobFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const isEdit = jobId && jobId !== 'new';

  useEffect(() => {
    if (isEdit) {
      // TODO: 替换为真实 API 调用
      // const fetchJob = async () => {
      //   try {
      //     const response = await fetch(`/api/v1/jobs/${jobId}`);
      //     const data = await response.json();
      //     form.setFieldsValue({
      //       ...data,
      //       responsibilities: data.responsibilities.join('\n'),
      //       qualifications: data.qualifications.join('\n'),
      //       requiredSkills: data.requiredSkills.join(', '),
      //     });
      //   } catch (error) {
      //     console.error('获取职位详情失败:', error);
      //     message.error('获取职位详情失败');
      //   } finally {
      //     setLoading(false);
      //   }
      // };
      // fetchJob();

      // 使用 mock 数据
      const mockJob = mockJobPositions.find(j => j.id === jobId);
      if (mockJob) {
        form.setFieldsValue({
          ...mockJob,
          responsibilities: mockJob.responsibilities.join('\n'),
          qualifications: mockJob.qualifications.join('\n'),
          requiredSkills: mockJob.requiredSkills.join(', '),
          preferredSkills: mockJob.preferredSkills.join(', '),
        });
      } else {
        message.error('职位不存在');
        navigate('/jobs');
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [jobId, isEdit, form, navigate]);

  const handleFinish = async (_values: any) => {
    if (isEdit) {
      // TODO: 替换为真实 API 调用
      // try {
      //   // 将字符串转换回数组
      //   const responsibilities = _values.responsibilities ? _values.responsibilities.split('\n').filter((s: string) => s.trim()) : [];
      //   const qualifications = _values.qualifications ? _values.qualifications.split('\n').filter((s: string) => s.trim()) : [];
      //   const requiredSkills = _values.requiredSkills ? _values.requiredSkills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [];
      //   const preferredSkills = _values.preferredSkills ? _values.preferredSkills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [];
      //   const jobData = {
      //     ..._values,
      //     responsibilities,
      //     qualifications,
      //     requiredSkills,
      //     preferredSkills,
      //   };
      //   await fetch(`/api/v1/jobs/${jobId}`, {
      //     method: 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(jobData),
      //   });
      //   message.success('职位更新成功');
      //   navigate('/jobs');
      // } catch (error) {
      //   console.error('更新职位失败:', error);
      //   message.error('更新职位失败');
      // }
      message.success('职位更新成功（模拟）');
      navigate('/jobs');
    } else {
      // TODO: 替换为真实 API 调用
      // try {
      //   // 将字符串转换回数组
      //   const responsibilities = _values.responsibilities ? _values.responsibilities.split('\n').filter((s: string) => s.trim()) : [];
      //   const qualifications = _values.qualifications ? _values.qualifications.split('\n').filter((s: string) => s.trim()) : [];
      //   const requiredSkills = _values.requiredSkills ? _values.requiredSkills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [];
      //   const preferredSkills = _values.preferredSkills ? _values.preferredSkills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [];
      //   const jobData = {
      //     ..._values,
      //     responsibilities,
      //     qualifications,
      //     requiredSkills,
      //     preferredSkills,
      //   };
      //   await fetch('/api/v1/jobs', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(jobData),
      //   });
      //   message.success('职位创建成功');
      //   navigate('/jobs');
      // } catch (error) {
      //   console.error('创建职位失败:', error);
      //   message.error('创建职位失败');
      // }
      message.success('职位创建成功（模拟）');
      navigate('/jobs');
    }
  };

  const handleGoBack = () => {
    navigate('/jobs');
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
        title={isEdit ? '编辑职位' : '新增职位'} 
        style={{ maxWidth: 800, margin: '0 auto', textAlign: 'left' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            status: 'draft',
            employmentType: 'full_time',
            experienceLevel: 'entry',
          }}
        >
          <Form.Item
            name="positionName"
            label="职位名称"
            rules={[{ required: true, message: '请输入职位名称' }]}
          >
            <Input placeholder="请输入职位名称" />
          </Form.Item>

          <Form.Item
            name="department"
            label="所属部门"
            rules={[{ required: true, message: '请选择所属部门' }]}
          >
            <Select placeholder="请选择所属部门">
              <Option value="技术研发部">技术研发部</Option>
              <Option value="产品部">产品部</Option>
              <Option value="设计部">设计部</Option>
              <Option value="市场部">市场部</Option>
              <Option value="运营部">运营部</Option>
              <Option value="人事部">人事部</Option>
              <Option value="财务部">财务部</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="workLocation"
            label="工作地点"
            rules={[{ required: true, message: '请选择工作地点' }]}
          >
            <Select placeholder="请选择工作地点">
              <Option value="北京">北京</Option>
              <Option value="上海">上海</Option>
              <Option value="广州">广州</Option>
              <Option value="深圳">深圳</Option>
              <Option value="杭州">杭州</Option>
              <Option value="成都">成都</Option>
              <Option value="武汉">武汉</Option>
              <Option value="西安">西安</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="employmentType"
            label="用工类型"
            rules={[{ required: true, message: '请选择用工类型' }]}
          >
            <Select placeholder="请选择用工类型">
              <Option value="full_time">全职</Option>
              <Option value="part_time">兼职</Option>
              <Option value="intern">实习</Option>
              <Option value="contract">合同制</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="experienceLevel"
            label="经验要求"
            rules={[{ required: true, message: '请选择经验要求' }]}
          >
            <Select placeholder="请选择经验要求">
              <Option value="entry">初级（0-2年）</Option>
              <Option value="mid">中级（3-5年）</Option>
              <Option value="senior">高级（6-10年）</Option>
              <Option value="expert">专家/总监（10年以上）</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="salaryRange"
            label="薪资范围（元/月）"
            rules={[{ required: true, message: '请输入薪资范围' }]}
          >
            <Input placeholder="如：15000-25000" />
          </Form.Item>

          <Form.Item
            name="educationRequirement"
            label="学历要求"
            rules={[{ required: true, message: '请选择学历要求' }]}
          >
            <Select placeholder="请选择学历要求">
              <Option value="不限">不限</Option>
              <Option value="大专">大专</Option>
              <Option value="本科">本科</Option>
              <Option value="硕士">硕士</Option>
              <Option value="博士">博士</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="majorPreference"
            label="专业偏好"
          >
            <Input placeholder="请输入专业偏好" />
          </Form.Item>

          <Form.Item
            name="description"
            label="职位描述"
            rules={[{ required: true, message: '请输入职位描述' }]}
          >
            <TextArea rows={4} placeholder="请输入职位描述" />
          </Form.Item>

          <Form.Item
            name="responsibilities"
            label="核心职责（每行一项）"
            rules={[{ required: true, message: '请输入核心职责' }]}
          >
            <TextArea rows={4} placeholder="每行输入一项核心职责" />
          </Form.Item>

          <Form.Item
            name="qualifications"
            label="任职资格（每行一项）"
            rules={[{ required: true, message: '请输入任职资格' }]}
          >
            <TextArea rows={4} placeholder="每行输入一项任职资格" />
          </Form.Item>

          <Form.Item
            name="requiredSkills"
            label="必需技能（回车分隔）"
            rules={[{ required: true, message: '请输入必需技能' }]}
          >
            <TextArea rows={4} placeholder="请输入必需技能，用逗号分隔" />
          </Form.Item>

          <Form.Item
            name="preferredSkills"
            label="加分技能"
          >
            <TextArea rows={4} placeholder="请输入加分技能，用逗号分隔" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {isEdit ? '更新职位' : '创建职位'}
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

// 主组件，根据路由渲染不同页面
const PositionManagementPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();

  if (jobId || location.pathname === '/jobs/new') {
    return <JobFormPage />;
  }

  return <JobListPage />;
};

export default PositionManagementPage;