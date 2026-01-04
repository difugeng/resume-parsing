import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Steps, 
  Descriptions, 
  Table, 
  Tag, 
  Progress, 
  Alert, 
  Button, 
  Space, 
  Row,
  Col,
  message,
  Modal,
  Radio,
  Typography
} from 'antd';
import { ArrowLeftOutlined, FilePdfOutlined, DownloadOutlined } from '@ant-design/icons';
import { ParseTask, ParsedResume, ResumeFileStatus } from '../types';
import { getMockTaskById, mockResumeDetail } from '../mockData';
import JobMatchAnalysisCard from '../components/JobMatchAnalysisCard';

const { Step } = Steps;

const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<ParseTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportType, setExportType] = useState<'单个' | '批量'>('单个');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);

  useEffect(() => {
    // TODO: 替换为真实 API 调用
    // const res = await fetch(`/api/v1/tasks/${taskId}`);
    // setTask(await res.json());
    const mockTask = getMockTaskById(taskId!);
    setTask(mockTask || null);
    setLoading(false);
  }, [taskId]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!task) {
    return <div>任务不存在</div>;
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
    
    message.success(`已导出为${format}格式`);
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
        return 'green';
      case '失败':
        return 'red';
      case '处理中':
        return 'blue';
      case '待处理':
        return 'orange';
      default:
        return 'default';
    }
  };

  // 如果是单个简历且成功，显示详细信息
  if (task && 'resumes' in task && Array.isArray(task.resumes) && task.resumes.length === 1 && task.resumes[0].status === '成功') {
    const resume = task.resumes[0];
    const parseSteps = resume.parseSteps || [];

    return (
      <>
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button onClick={handleGoBack} icon={<ArrowLeftOutlined />} type="primary" ghost>
              返回
            </Button>
          </div>
          <Card 
            title="查看原始文件" 
            extra={
              <Button 
                icon={<FilePdfOutlined />} 
                onClick={() => setPreviewVisible(true)}
              >
                查看原始文件
              </Button>
            }
          >
            <p>文件名: {resume.filename || '未命名文件'}</p>
            <p>解析时间: {new Date(task.createdAt).toLocaleString('zh-CN')}</p>
          </Card>
          <Card title="简历解析详情" style={{ marginTop: 16 }}>
            <Steps current={parseSteps.length} style={{ marginBottom: 24 }}>
              {parseSteps.map((step: any, index: number) => (
                <Step 
                  key={index} 
                  title={step.title} 
                  status={step.status as any} 
                  description={step.description} 
                />
              ))}
            </Steps>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                {resume.basicInfo && (
                  <Card title="基础信息" style={{ marginBottom: 16 }}>
                    <Descriptions column={2}>
                      <Descriptions.Item label="姓名">{resume.basicInfo.name}</Descriptions.Item>
                      <Descriptions.Item label="电话">{resume.basicInfo.phone}</Descriptions.Item>
                      <Descriptions.Item label="邮箱">{resume.basicInfo.email}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                )}

                {resume.education && resume.education.length > 0 && (
                  <Card title="教育背景" style={{ marginBottom: 16 }}>
                    <Table
                      dataSource={resume.education}
                      columns={[
                        {
                          title: '学校',
                          dataIndex: 'school',
                          key: 'school',
                        },
                        {
                          title: '学历',
                          dataIndex: 'degree',
                          key: 'degree',
                        },
                        {
                          title: '时间',
                          key: 'time',
                          render: (_: any, record: any) => (
                            `${record.startDate} 至 ${record.endDate}`
                          ),
                        },
                      ]}
                      pagination={false}
                      rowKey={(record: any) => `${record.school}-${record.startDate}`}
                    />
                  </Card>
                )}

                {resume.workExperience && resume.workExperience.length > 0 && (
                  <Card title="工作经历" style={{ marginBottom: 16 }}>
                    <Table
                      dataSource={resume.workExperience}
                      columns={[
                        {
                          title: '公司',
                          dataIndex: 'company',
                          key: 'company',
                        },
                        {
                          title: '职位',
                          dataIndex: 'position',
                          key: 'position',
                        },
                        {
                          title: '时间',
                          key: 'time',
                          render: (_: any, record: any) => (
                            `${record.startDate} 至 ${record.endDate}`
                          ),
                        },
                        {
                          title: '职责',
                          key: 'responsibilities',
                          render: (_: any, record: any) => (
                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                              {record.responsibilities.map((resp: string, idx: number) => (
                                <li key={idx}>{resp}</li>
                              ))}
                            </ul>
                          ),
                        },
                      ]}
                      pagination={false}
                      rowKey={(record: any) => `${record.company}-${record.startDate}`}
                    />
                  </Card>
                )}

                {resume.skills && (
                  <Card title="技能" style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 16 }}>
                      <Typography.Title level={5}>硬技能</Typography.Title>
                      <Space wrap>
                        {resume.skills.hardSkills.map((skill: string, index: number) => (
                          <Tag key={index} color="blue">{skill}</Tag>
                        ))}
                      </Space>
                    </div>
                    <div>
                      <Typography.Title level={5}>软技能</Typography.Title>
                      <Space wrap>
                        {resume.skills.softSkills.map((skill: string, index: number) => (
                          <Tag key={index} color="geekblue">{skill}</Tag>
                        ))}
                      </Space>
                    </div>
                  </Card>
                )}

                {resume.jobIntent && (
                  <Card title="求职意向" style={{ marginBottom: 16 }}>
                    <Descriptions column={2}>
                      <Descriptions.Item label="目标职位">{resume.jobIntent.targetPosition || '—'}</Descriptions.Item>
                      <Descriptions.Item label="期望地点">{resume.jobIntent.preferredLocation || '—'}</Descriptions.Item>
                      <Descriptions.Item label="期望薪资">{resume.jobIntent.expectedSalary || '—'}</Descriptions.Item>
                      <Descriptions.Item label="期望行业">{resume.jobIntent.expectedIndustry || '—'}</Descriptions.Item>
                      <Descriptions.Item label="工作类型">{resume.jobIntent.workType || '—'}</Descriptions.Item>
                      <Descriptions.Item label="到岗时间">{resume.jobIntent.availableTime || '—'}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                )}

                {resume.warnings && resume.warnings.length > 0 && (
                  <Card title="解析警告" style={{ marginBottom: 16 }}>
                    {resume.warnings.map((warning :any, index :any) => (
                      <Alert 
                        key={index} 
                        message={warning} 
                        type="warning" 
                        showIcon 
                        style={{ marginBottom: 8 }}
                      />
                    ))}
                  </Card>
                )}
              </Col>

              <Col xs={24} lg={8}>
                <Card title="解析结果">


                  {task.recognitionType === 'target' && resume.matchScore !== undefined && (
                    <div style={{ marginBottom: 24 }}>
                      {/* 目标职位匹配度详情 */}
                      {mockResumeDetail.jobMatch && (
                        <JobMatchAnalysisCard 
                          jobMatch={mockResumeDetail.jobMatch} 
                          positionName={task.recognitionType === 'target' ? task.targetPosition : selectedPosition?.position} 
                        />
                      )}
                    </div>
                  )}

                  {task.recognitionType === 'system' && resume.systemMatchedPositions && (
                    <div style={{ marginBottom: 24 }}>
                      <h4 style={{ textAlign: 'center', marginBottom: 16 }}>系统推荐职位</h4>
                      {resume.systemMatchedPositions.slice(0, 3).map((position :any, index :any) => (
                        <div key={index} style={{ marginBottom: 12 }}>
                          <div 
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              marginBottom: 4,
                              cursor: 'pointer',
                              padding: '8px',
                              borderRadius: '4px',
                              backgroundColor: selectedPosition?.position === position.position ? '#e6f7ff' : 'transparent',
                              border: selectedPosition?.position === position.position ? '2px solid #1890ff' : '1px solid #f0f0f0',
                              fontWeight: selectedPosition?.position === position.position ? 'bold' : 'normal'
                            }}
                            onClick={() => {
                              // 切换选中状态
                              setSelectedPosition(selectedPosition?.position === position.position ? null : position);
                            }}
                          >
                            <span>{position.position}</span>
                            <span>{position.matchScore}%</span>
                          </div>
                          <Progress 
                            percent={position.matchScore} 
                            size="small" 
                            strokeColor={selectedPosition?.position === position.position ? '#1890ff' : '#f5f5f5'}
                          />
                        </div>
                      ))}
                      {/* 所有系统推荐职位的匹配分析详情统一放在下方 */}
                      {selectedPosition && mockResumeDetail.jobMatch && (
                        <div style={{ marginTop: 24 }}>
                          <JobMatchAnalysisCard 
                            jobMatch={mockResumeDetail.jobMatch} 
                            positionName={selectedPosition.position} 
                          />
                        </div>
                      )}
                    </div>
                  )}



                  <Space style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}>
                    <Button type="primary" onClick={() => showExportModal('单个')}>导出简历</Button>
                    <Button>重新解析</Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
        <Modal
          title={`${exportType}导出`}
          open={exportModalVisible}
          onCancel={() => setExportModalVisible(false)}
          footer={null}
        >
          <div style={{ marginBottom: 24 }}>
            <h4>请选择导出格式</h4>
            <Radio.Group 
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}
              onChange={(e) => handleExportModalOk(e.target.value)}
            >
              <Radio value="JSON">JSON 格式</Radio>
              <Radio value="XML">XML 格式</Radio>
              <Radio value="表格">表格格式 (Excel)</Radio>
            </Radio.Group>
          </div>
        </Modal>

        {/* PDF预览Modal */}
         <Modal
           title="原始文件预览"
           open={previewVisible}
           onCancel={() => setPreviewVisible(false)}
           footer={[
             <Button key="download" icon={<DownloadOutlined />} href={mockResumeDetail.fileUrl} target="_blank">
               下载文件
             </Button>,
             <Button key="close" onClick={() => setPreviewVisible(false)}>
               关闭
             </Button>
           ]}
           width="80%"
         >
           <div style={{ height: '70vh' }}>
             <iframe
               src={mockResumeDetail.fileUrl}
               style={{ width: '100%', height: '100%', border: 'none' }}
               title="简历文件预览"
             />
           </div>
         </Modal>


      </>
    );
  }

  // 如果是批量任务，显示表格
  return (
    <>
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button onClick={handleGoBack} type="primary" ghost>
            返回
          </Button>
        </div>
        <Card title={`批量任务详情 - ${task.taskName}`}>
          <div style={{ marginBottom: 24 }}>
            <h3>整体进度</h3>
            <Progress 
              percent={Math.round((task.successCount / task.totalFiles) * 100)} 
              size="small" 
            />
            <div style={{ marginTop: 8 }}>
              成功: {task.successCount}, 失败: {task.failedCount}, 总计: {task.totalFiles}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" onClick={() => showExportModal('批量')}>
                批量导出
              </Button>
            </Space>
          </div>

          <Table 
            dataSource={'resumes' in task && Array.isArray(task.resumes) ? task.resumes : []}
            columns={[
              {
                title: '文件名',
                dataIndex: 'filename',
                key: 'filename',
              },
              {
                title: '状态',
                key: 'status',
                render: (_: any, record: ParsedResume) => (
                  <Tag color={getStatusColor(record.status)}>
                    {record.status}
                  </Tag>
                ),
              },
              {
                title: '操作',
                key: 'action',
                render: (_: any, record: ParsedResume) => (
                  <Space size="middle">
                    {record.status === '失败' && (
                      <Button 
                        type="link" 
                        onClick={async () => {
                          // TODO: 替换为真实 API 调用
                          // const response = await fetch(`/api/v1/tasks/${taskId}/retry`, {
                          //   method: 'POST',
                          //   headers: { 'Content-Type': 'application/json' },
                          //   body: JSON.stringify({ resumeId: record.id })
                          // });
                          message.success('重试请求已发送');
                        }}
                      >
                        重试
                      </Button>
                    )}
                    {record.status === '成功' && (
                      <Button 
                        type="link" 
                        onClick={() => {
                          // 对于单个成功简历，我们直接展示详情，而不是跳转
                          // 这里我们模拟显示详情
                          message.info('查看详情功能已触发');
                        }}
                      >
                        查看详情
                      </Button>
                    )}
                  </Space>
                ),
              },
            ]}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
      <Modal
        title={`${exportType}导出`}
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={null}
      >
        <div style={{ marginBottom: 24 }}>
          <h4>请选择导出格式</h4>
          <Radio.Group 
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}
            onChange={(e) => handleExportModalOk(e.target.value)}
          >
            <Radio value="JSON">JSON 格式</Radio>
            <Radio value="XML">XML 格式</Radio>
            <Radio value="表格">表格格式 (Excel)</Radio>
          </Radio.Group>
        </div>
      </Modal>
    </>
  );
};

export default TaskDetailPage;