import React from 'react';
import { Table as AntdTable, TableProps } from 'antd';

// 极简商务风格表格组件
const Table: React.FC<TableProps<any>> = (props) => {
  return (
    <AntdTable
      {...props}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        ...props.style,
      }}
      tableLayout="fixed"
      rowClassName={() => 'minimalist-business-table-row'}
      scroll={{ x: 'max-content' }}
      // 完全移除所有内部边框
      bordered={false}
      // 设置行高
      size="middle"
    />
  );
};

export default Table;