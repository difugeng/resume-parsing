/**
 * 极简商务风设计系统 - 全局设计 Token
 */
export const designTokens = {
  // 间距系统
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // 圆角系统
  radius: {
    default: '8px',
  },

  // 阴影系统
  shadow: {
    card: '0 2px 12px rgba(0, 0, 0, 0.06)',
  },

  // 颜色系统
  color: {
    // 文字颜色
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      tertiary: '#9CA3AF',
    },
    
    // 背景色
    bg: {
      page: '#FFFFFF',
      card: '#FFFFFF',
    },
    
    // 边框颜色
    border: {
      light: '#E5E7EB',
    },
  },
} as const;