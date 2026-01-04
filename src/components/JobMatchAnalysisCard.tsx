import React from 'react';
import { Card, Progress, List, Tag, Typography } from 'antd';
import { JobMatchResult } from '../types';

const { Title, Text } = Typography;

interface JobMatchAnalysisCardProps {
  jobMatch: JobMatchResult;
}

interface JobMatchAnalysisCardProps {
  jobMatch: JobMatchResult;
  positionName?: string;
}

const JobMatchAnalysisCard: React.FC<JobMatchAnalysisCardProps> = ({ jobMatch, positionName }) => {
  const {
    overall_score,
    dimension_scores,
    risk_score,
    matched_points,
    gap_points,
    summary
  } = jobMatch;

  // 计算维度颜色
  const getDimensionColor = (dimension: string) => {
    switch (dimension) {
      case 'skill_match':
        return '#1890ff'; // 蓝色
      case 'experience_match':
        return '#52c41a'; // 绿色
      case 'education_match':
        return '#722ed1'; // 紫色
      case 'semantic_match':
        return '#fa8c16'; // 橙色
      default:
        return '#1890ff';
    }
  };

  // 获取风险评分文字
  const getRiskText = (score: number) => {
    if (score > 80) return '风险极高';
    if (score > 60) return '风险较高';
    if (score > 40) return '风险中等';
    if (score > 20) return '风险较低';
    return '风险很低';
  };

  return (
    <Card 
      title={positionName ? `职位匹配分析 - ${positionName}` : "职位匹配分析"} 
      style={{ height: '100%', minHeight: 600 }}
    >
      {/* 总体匹配度 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>总体匹配度</Title>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Progress 
            type="circle" 
            percent={overall_score} 
            size={100}
            strokeColor="#52c41a"
          />
          <div style={{ marginLeft: 16 }}>
            <Title level={3} style={{ margin: 0, color: '#52c41a' }}>{overall_score}%</Title>
            <Text>总体匹配度</Text>
          </div>
        </div>
      </div>

      {/* 各维度得分 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>各维度得分</Title>
        <List
          dataSource={Object.entries(dimension_scores)}
          renderItem={([key, value]) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      {key === 'skill_match' && '技能匹配'}
                      {key === 'experience_match' && '经验匹配'}
                      {key === 'education_match' && '学历匹配'}
                      {key === 'semantic_match' && '语义匹配'}
                    </span>
                    <span>{value}%</span>
                  </div>
                }
                description={
                  <Progress 
                    percent={value} 
                    showInfo={false} 
                    strokeColor={getDimensionColor(key)}
                  />
                }
              />
            </List.Item>
          )}
        />
      </div>

      {/* 风险评分 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>风险评分</Title>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title 
            level={3} 
            style={{ 
              margin: 0, 
              color: risk_score > 60 ? '#ff4d4f' : '#fa8c16' 
            }}
          >
            {risk_score}分
          </Title>
          <Text 
            style={{ 
              marginLeft: 8, 
              color: risk_score > 60 ? '#ff4d4f' : '#fa8c16' 
            }}
          >
            {getRiskText(risk_score)}
          </Text>
        </div>
      </div>

      {/* 匹配点 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>✅ 匹配点</Title>
        <List
          size="small"
          dataSource={matched_points}
          renderItem={item => (
            <List.Item>
              <Tag color="green">匹配</Tag>
              {item}
            </List.Item>
          )}
        />
      </div>

      {/* 差距点 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>⚠️ 差距点</Title>
        <List
          size="small"
          dataSource={gap_points}
          renderItem={item => (
            <List.Item>
              <Tag color="orange">差距</Tag>
              {item}
            </List.Item>
          )}
        />
      </div>

      {/* 总结评语 */}
      <div>
        <Title level={4}>📝 总结评语</Title>
        <div style={{ padding: '12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px' }}>
          <Text>{summary}</Text>
        </div>
      </div>
    </Card>
  );
};

export default JobMatchAnalysisCard;