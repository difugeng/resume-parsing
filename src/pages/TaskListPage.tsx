import React, { useState, useEffect } from 'react';
import { Table, Tag, Progress, Button, Space } from 'antd';
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

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case '已完成':
        return 'green';
      case '部分失败':
        return 'orange';
      case '失败':
        return 'red';
      case '处理中':
        return 'blue';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '简历数量',
      dataIndex: 'totalFiles',
      key: 'totalFiles',
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: ParseTask) => (
        <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
      ),
    },
    {
      title: '成功率',
      key: 'progress',
      render: (_: any, record: ParseTask) => {
        const successRate = record.totalFiles > 0 ? (record.successCount / record.totalFiles) * 100 : 0;
        return (
          <div>
            <Progress 
              percent={Math.round(successRate)} 
              size="small" 
              status={record.status === '失败' ? 'exception' : 'normal'} 
            />
            <div>{record.successCount}/{record.totalFiles}</div>
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ParseTask) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => navigate(`/tasks/${record.taskId}`)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          onClick={() => navigate('/tasks/new')}
        >
          新建简历解析任务
        </Button>
      </div>
      <Table 
        dataSource={tasks} 
        columns={columns} 
        rowKey="taskId"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TaskListPage;