import { theme } from 'antd';

const { defaultAlgorithm } = theme;

export const minimalistBusinessTheme = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: '#1890ff', // 保留主色
    colorBgBase: '#FFFFFF',
    colorBgContainer: '#FFFFFF',
    colorBorder: '#E5E7EB',
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 1.6,
    padding: 16, // 全局内边距基准
  },
  components: {
    Table: {
      headerBg: '#FFFFFF',
      headerColor: '#111827',
      borderColor: '#E5E7EB',
      rowHoverBg: '#F9FAFB',
      // 移除斑马纹，用 hover 区分
      bodySortBg: '#FFFFFF',
    },
    Form: {
      labelColor: '#111827',
      labelFontSize: 14,
      itemMarginBottom: 20, // 增大表单项间距
    },
    Card: {
      colorBgContainer: '#FFFFFF',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
    },
  },
};