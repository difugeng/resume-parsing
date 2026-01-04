import React from 'react';
import { Card as AntdCard, CardProps } from 'antd';

// 极简商务风格卡片组件
const Card: React.FC<CardProps> = (props) => {
  return (
    <AntdCard
      {...props}
      style={{
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        ...props.style,
      }}
      bodyStyle={{
        padding: '24px',
        ...props.bodyStyle,
      }}
    />
  );
};

export default Card;