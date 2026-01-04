export type ResumeFileStatus = '待处理' | '处理中' | '成功' | '失败';

export enum ResumeParseError {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  EMPTY_FILE = 'EMPTY_FILE',
  OCR_FAILED = 'OCR_FAILED',
  CORRUPTED_CONTENT = 'CORRUPTED_CONTENT',
  UNKNOWN = 'UNKNOWN',
}

export interface ParsedResume {
  id: string;
  filename: string;
  status: ResumeFileStatus;
  error?: { code: ResumeParseError; message: string };
  basicInfo?: { name: string; phone: string; email: string; avatar?: string };
  education?: Array<{ school: string; degree: string; startDate: string; endDate: string; major?: string }>;
  workExperience?: Array<{ company: string; position: string; startDate: string; endDate: string; responsibilities: string[]; achievements: string[] }>;
  skills?: { hardSkills: string[]; softSkills: string[] };
  jobIntent?: { 
    targetPosition: string; 
    preferredLocation: string; 
    expectedSalary?: string;
    expectedIndustry?: string;
    workType?: string;
    availableTime?: string;
  };
  matchScore?: number; // 0–100
  systemMatchedPositions?: Array<{ position: string; matchScore: number }>; // 系统匹配的职位列表，仅在recognitionType为'system'时存在
  warnings?: string[];
  parseSteps?: { key: string; title: string; status: '等待' | '处理中' | '完成' | '错误'; description?: string }[];
}

export interface IndexedResume {
  resumeId: string;
  originalFilename: string;
  parsedAt: string;
  source: string; // 如 "BOSS直聘", "内部推荐"
  status: '解析成功' | '解析失败';
  matchScore?: number;

  // 基础信息
  name: string;
  phone: string;
  email: string;
  age?: number;
  location: string;

  // 教育
  highestDegree: string;
  school: string[];
  major: string;

  // 工作
  currentCompany: string;
  currentPosition: string;
  workYears: number;
  companies: string[];

  // 技能
  hardSkills: string[];
  softSkills: string[];
  languages: string[];

  // 求职意向
  jobIntent?: { targetPosition: string };
  
  // 匹配职位
  matchedPosition?: string;
}

export type TaskStatus = '待处理' | '处理中' | '已完成' | '部分失败' | '失败';

export interface ParseTask {
  taskId: string;
  taskName: string;
  status: TaskStatus;
  totalFiles: number;
  successCount: number;
  failedCount: number;
  createdAt: string;
  updatedAt: string;
  recognitionType: 'system' | 'target';
  targetPosition?: string;
  resumes?: ParsedResume[];
}

// 职位管理相关类型定义
export interface JobPosition {
  id: string;
  positionName: string;
  department: string;
  status: 'draft' | 'active' | 'paused' | 'closed';
  workLocation: string;
  employmentType: 'full_time' | 'part_time' | 'intern' | 'contract';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'expert';
  salaryRange: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirement: string;
  majorPreference: string;
  createdAt: string;
  updatedAt: string;
}

// 映射常量
export const JOB_STATUS_LABELS = { 
  draft: '草稿', 
  active: '招聘中', 
  paused: '暂停招聘', 
  closed: '已关闭' 
} as const;

export const EMPLOYMENT_TYPE_LABELS = { 
  full_time: '全职', 
  part_time: '兼职', 
  intern: '实习', 
  contract: '合同制' 
} as const;

export const EXPERIENCE_LEVEL_LABELS = { 
  entry: '初级（0-2年）', 
  mid: '中级（3-5年）', 
  senior: '高级（6-10年）', 
  expert: '专家/总监（10年以上）' 
} as const;

// 简历导出模板相关类型定义
export interface ResumeExportTemplate {
  templateId: string;
  name: string;               // 模板名称
  formatType: 'json' | 'xml'; // 格式类型（API 用英文）
  status: '启用' | '停用';     // 状态（UI 直接存中文，或通过映射）
  description?: string;       // 描述
  content: string;            // 模板内容（纯文本）
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// MCP外部能力管理相关类型定义
export interface McpProvider {
  mcpId: string;
  name: string; // 如 "学信网学历验证服务"
  category: '学历验证' | '身份核验' | '工作经历验证' | '自定义';
  status: '启用' | '停用'; // 直接使用中文
  endpointUrl: string;
  authType: 'API Key' | 'Bearer Token' | 'Basic Auth';
  // apiKey 不在列表页返回，仅在编辑时允许输入
  description?: string;
  timeoutMs: number; // 默认 5000
  retryCount: number; // 默认 2
  isEnabledByDefault: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 简历详情相关类型定义
export interface ResumeDetail {
  resumeId: string;
  originalFilename: string;
  parsedAt: string;
  source: string;

  // 结构化信息
  basicInfo: {
    name: string;
    phone: string;
    email: string;
    age: number;
    location: string;
  };

  education: Array<{
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;

  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
  }>;

  skills: {
    hardSkills: string[];
    softSkills: string[];
  };

  jobIntent: {
    targetPosition: string;
    preferredLocation: string;
    expectedSalary?: string;
    expectedIndustry?: string;
    workType?: string;
    availableTime?: string;
  };

  // 新增：原始文件URL（用于预览）
  fileUrl: string; // 如 "https://xxx.com/resumes/abc.pdf"

  // 新增：职位匹配结果
  jobMatch?: JobMatchResult;
}

export interface JobMatchResult {
  overall_score: number;
  dimension_scores: {
    skill_match: number;
    experience_match: number;
    education_match: number;
    semantic_match: number;
  };
  risk_score: number;
  matched_points: string[];
  gap_points: string[];
  summary: string;
}