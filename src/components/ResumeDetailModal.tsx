import React from 'react';
import { Modal, Descriptions, Tag, Space, Typography, Divider } from 'antd';
import { IndexedResume } from '../types';

const { Title } = Typography;

interface ResumeDetailModalProps {
  visible: boolean;
  resume: IndexedResume;
  onClose: () => void;
}

const ResumeDetailModal: React.FC<ResumeDetailModalProps> = ({ visible, resume, onClose }) => {
  if (!resume) return null;

  return (
    <Modal
      title={`${resume.name} - 简历详情`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {/* 基础信息 */}
        <Title level={4}>基础信息</Title>
        <Descriptions column={2} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="姓名">{resume.name}</Descriptions.Item>
          <Descriptions.Item label="手机号">{resume.phone}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{resume.email}</Descriptions.Item>
          <Descriptions.Item label="年龄">{resume.age || '—'}</Descriptions.Item>
          <Descriptions.Item label="所在城市">{resume.location}</Descriptions.Item>
          <Descriptions.Item label="来源">{resume.source}</Descriptions.Item>
          <Descriptions.Item label="解析时间">{new Date(resume.parsedAt).toLocaleString('zh-CN')}</Descriptions.Item>
          <Descriptions.Item label="匹配度">{resume.matchScore ? `${resume.matchScore}%` : '—'}</Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* 教育背景 */}
        <Title level={4}>教育背景</Title>
        <Descriptions column={2} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="最高学历">{resume.highestDegree}</Descriptions.Item>
          <Descriptions.Item label="毕业院校">{resume.school.join(', ')}</Descriptions.Item>
          <Descriptions.Item label="专业">{resume.major}</Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* 工作经历 */}
        <Title level={4}>工作经历</Title>
        <Descriptions column={2} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="当前职位">{resume.currentPosition}</Descriptions.Item>
          <Descriptions.Item label="当前公司">{resume.currentCompany}</Descriptions.Item>
          <Descriptions.Item label="工作年限">{resume.workYears}年</Descriptions.Item>
          <Descriptions.Item label="曾服务公司">{resume.companies.join(', ')}</Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* 技能 */}
        <Title level={4}>技能</Title>
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>硬技能：</strong>
            <Space wrap style={{ marginLeft: 8 }}>
              {resume.hardSkills.map((skill, index) => (
                <Tag key={index} color="blue">{skill}</Tag>
              ))}
            </Space>
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>软技能：</strong>
            <Space wrap style={{ marginLeft: 8 }}>
              {resume.softSkills.map((skill, index) => (
                <Tag key={index} color="green">{skill}</Tag>
              ))}
            </Space>
          </div>
          <div>
            <strong>语言能力：</strong>
            <Space wrap style={{ marginLeft: 8 }}>
              {resume.languages.map((lang, index) => (
                <Tag key={index} color="orange">{lang}</Tag>
              ))}
            </Space>
          </div>
        </div>

        <Divider />

        {/* 求职意向 */}
        <Title level={4}>求职意向</Title>
        <Descriptions column={1} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="目标职位">
            {resume.jobIntent?.targetPosition || '—'}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default ResumeDetailModal;