import React, { useState } from 'react';
import { Upload, Button, message, Space, Card, Form, Select, Radio } from 'antd';
import { InboxOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Dragger } = Upload;

const UploadPage: React.FC = () => {
  const [fileList, setFileList] = useState<any[]>([]);
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
      message.warning('请先上传简历文件');
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
    
    message.success(`已开始解析 ${fileList.length} 份简历`);
  };

  const handleGoBack = () => {
    navigate('/tasks');
  };

  const uploadProps = {
    name: 'files',
    multiple: true,
    fileList,
    onChange: ({ fileList: newFileList }: any) => {
      setFileList(newFileList);
    },
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      // 检查文件类型
      const allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension || '')) {
        message.error(`${file.name} 文件格式不支持！`);
        return false;
      }
      
      // 检查文件大小（20MB限制）
      if (file.size > 20 * 1024 * 1024) {
        message.error(`${file.name} 文件大小超过20MB限制！`);
        return false;
      }
      
      setFileList([...fileList, file]);
      return false; // 阻止自动上传
    },
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={handleGoBack} icon={<ArrowLeftOutlined />} type="primary" ghost>
          返回
        </Button>
      </div>
      <Card title="上传简历文件">
        <Form layout="vertical">
          <Form.Item label="识别类型">
            <Radio.Group 
              value={recognitionType} 
              onChange={(e) => setRecognitionType(e.target.value)}
              style={{ marginBottom: 16 }}
            >
              <Radio.Button value="system">系统识别</Radio.Button>
              <Radio.Button value="target">目标职位</Radio.Button>
            </Radio.Group>
          </Form.Item>
          
          {recognitionType === 'target' && (
            <Form.Item label="目标职位">
              <Select 
                value={targetPosition} 
                onChange={setTargetPosition}
                style={{ width: 300 }}
              >
                {targetPositions.map(position => (
                  <Select.Option key={position} value={position}>{position}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
        
        <Dragger {...uploadProps} style={{ marginBottom: 24 }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽简历文件到此区域进行上传</p>
          <p className="ant-upload-hint">
            支持单次上传多个文件，支持格式：PDF, DOC, DOCX, TXT, JPG, PNG
          </p>
        </Dragger>
        
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button 
            type="primary" 
            size="large"
            onClick={handleStartParse}
            disabled={fileList.length === 0}
          >
            开始解析
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default UploadPage;