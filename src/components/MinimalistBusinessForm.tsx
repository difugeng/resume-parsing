import React from 'react';
import { Form as AntdForm, FormProps } from 'antd';

// 极简商务风格表单组件
const Form: React.FC<FormProps<any>> = (props) => {
  const { labelCol, wrapperCol, layout, style, ...restProps } = props;

  return (
    <AntdForm
      {...restProps as any}
      labelCol={labelCol || { span: 6 }}
      wrapperCol={wrapperCol || { span: 18 }}
      layout={layout || 'horizontal'}
      style={{
        padding: '24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        ...style,
      }}
    />
  );
};

export default Form;