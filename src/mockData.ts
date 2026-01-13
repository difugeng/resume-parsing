import { ParseTask, JobPosition, ResumeParseError, ResumeExportTemplate, McpProvider, ResumeDetail, IndexedResume } from './types';

const mockSingleResume: ParseTask = {
  taskId: 'task-001',
  taskName: '张三_简历_20260102.pdf',
  createdAt: '2026-01-02T14:30:00Z',
  updatedAt: '2026-01-02T15:30:00Z',
  totalFiles: 1,
  successCount: 1,
  failedCount: 0,
  status: '已完成',
  recognitionType: 'target', // 目标职位识别
  targetPosition: 'AI产品经理',
  resumes: [{
    id: 'res-001',
    filename: '张三_简历_20260102.pdf',
    status: '成功',
    basicInfo: { name: '张三', phone: '138****5678', email: 'zhangsan@example.com' },
    education: [{ school: '清华大学', degree: '硕士', startDate: '2020-09', endDate: '2023-06' }],
    workExperience: [{
      company: '阿里巴巴集团',
      position: '高级算法工程师',
      startDate: '2023-07',
      endDate: '至今',
      responsibilities: ['负责推荐系统优化'],
      achievements: ['CTR 提升 15%']
    }],
    skills: { hardSkills: ['Python', 'SQL'], softSkills: ['沟通能力'] },
    jobIntent: { targetPosition: 'AI产品经理', preferredLocation: '杭州' },
    matchScore: 78,
    warnings: ['工作经历时间段与教育背景部分重叠'],
    parseSteps: [
      { key: 'upload', title: '文件上传', status: '完成' },
      { key: 'ocr', title: '文本提取', status: '完成' },
      { key: 'nlp', title: '结构化解析', status: '完成' },
      { key: 'quality_check', title: '质量检查', status: '完成' },
      { key: 'match', title: '岗位匹配', status: '完成' }
    ]
  }]
};

const mockBatchTask: ParseTask = {
  taskId: 'task-002',
  taskName: '2026校招_技术岗_批量解析',
  createdAt: '2026-01-02T15:20:00Z',
  updatedAt: '2026-01-02T16:20:00Z',
  totalFiles: 50,
  successCount: 45,
  failedCount: 5,
  status: '部分失败',
  recognitionType: 'system', // 系统识别
  resumes: [
    {
      id: 'res-101',
      filename: '李四_简历.pdf',
      status: '成功',
      basicInfo: { name: '李四', phone: '139****1234', email: 'lisi@xxx.com' },
      matchScore: 85,
      systemMatchedPositions: [
        { position: '前端工程师', matchScore: 92 },
        { position: '全栈工程师', matchScore: 88 },
        { position: 'React开发工程师', matchScore: 85 }
      ],
      warnings: [],
      parseSteps: [
        { key: 'upload', title: '文件上传', status: '完成' },
        { key: 'ocr', title: '文本提取', status: '完成' },
        { key: 'nlp', title: '结构化解析', status: '完成' },
        { key: 'quality_check', title: '质量检查', status: '完成' },
        { key: 'match', title: '岗位匹配', status: '完成' }
      ]
    },
    {
      id: 'res-201',
      filename: '空文件.txt',
      status: '失败',
      error: { code: 'EMPTY_FILE' as ResumeParseError, message: '文件内容为空' }
    },
    {
      id: 'res-202',
      filename: '超大简历扫描件.jpg',
      status: '失败',
      error: { code: 'FILE_TOO_LARGE' as ResumeParseError, message: '文件超过20MB限制' }
    }
  ]
};

const mockSystemMatchSingleResume: ParseTask = {
  taskId: 'task-003',
  taskName: '王五_简历_20260102.pdf',
  createdAt: '2026-01-02T16:00:00Z',
  updatedAt: '2026-01-02T17:00:00Z',
  totalFiles: 1,
  successCount: 1,
  failedCount: 0,
  status: '已完成',
  recognitionType: 'system', // 系统识别
  resumes: [{
    id: 'res-003',
    filename: '王五_简历_20260102.pdf',
    status: '成功',
    basicInfo: { name: '王五', phone: '136****9876', email: 'wangwu@example.com', avatar: '' },
    education: [
      { school: '北京大学', degree: '本科', startDate: '2018-09', endDate: '2022-06', major: '计算机科学与技术' },
      { school: '斯坦福大学', degree: '硕士', startDate: '2022-09', endDate: '2024-06', major: '人工智能' }
    ],
    workExperience: [
      {
        company: '字节跳动',
        position: '算法工程师',
        startDate: '2024-07',
        endDate: '至今',
        responsibilities: ['负责推荐算法优化', '参与大模型训练'],
        achievements: ['算法效率提升 20%', '发表论文 2 篇']
      }
    ],
    skills: { hardSkills: ['Python', 'PyTorch', 'TensorFlow', '机器学习'], softSkills: ['团队协作', '创新思维'] },
    jobIntent: { targetPosition: 'AI算法专家', preferredLocation: '北京' },
    systemMatchedPositions: [
      { position: 'AI算法专家', matchScore: 95 },
      { position: '机器学习工程师', matchScore: 92 },
      { position: '算法架构师', matchScore: 88 }
    ],
    warnings: [],
    parseSteps: [
      { key: 'upload', title: '文件上传', status: '完成' },
      { key: 'ocr', title: '文本提取', status: '完成' },
      { key: 'nlp', title: '结构化解析', status: '完成' },
      { key: 'quality_check', title: '质量检查', status: '完成' },
      { key: 'match', title: '岗位匹配', status: '完成' }
    ]
  }]
};

export const mockTaskList: ParseTask[] = [mockBatchTask, mockSingleResume, mockSystemMatchSingleResume];

// 简历详情mock数据
export const mockIndexedResumes: IndexedResume[] = [
  {
    resumeId: '1',
    originalFilename: '张三-前端工程师.pdf',
    parsedAt: '2024-01-15 10:30:00',
    source: 'BOSS直聘',
    status: '解析成功',
    matchScore: 85,
    name: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    age: 28,
    location: '北京',
    highestDegree: '本科',
    school: ['清华大学'],
    major: '计算机科学与技术',
    currentCompany: 'ABC科技有限公司',
    currentPosition: '高级前端工程师',
    workYears: 5,
    companies: ['ABC科技有限公司', 'XYZ互联网公司'],
    hardSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
    softSkills: ['团队协作', '沟通能力', '问题解决能力'],
    languages: ['英语', '中文'],
    jobIntent: { targetPosition: '高级前端工程师' },
    matchedPosition: '前端开发工程师'
  },
  {
    resumeId: '2',
    originalFilename: '李四-后端工程师.pdf',
    parsedAt: '2024-01-14 15:20:00',
    source: '内部推荐',
    status: '解析成功',
    matchScore: 92,
    name: '李四',
    phone: '13900139002',
    email: 'lisi@example.com',
    age: 30,
    location: '上海',
    highestDegree: '硕士',
    school: ['北京大学', '清华大学'],
    major: '软件工程',
    currentCompany: 'DEF软件公司',
    currentPosition: '后端架构师',
    workYears: 7,
    companies: ['DEF软件公司', 'GHI科技公司', 'JKL互联网公司'],
    hardSkills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Docker'],
    softSkills: ['领导能力', '项目管理', '技术指导'],
    languages: ['英语', '中文'],
    jobIntent: { targetPosition: '技术专家' },
    matchedPosition: 'Java开发工程师'
  },
  {
    resumeId: '3',
    originalFilename: '王五-产品经理.pdf',
    parsedAt: '2024-01-13 09:45:00',
    source: 'BOSS直聘',
    status: '解析成功',
    matchScore: 78,
    name: '王五',
    phone: '13700137003',
    email: 'wangwu@example.com',
    age: 27,
    location: '深圳',
    highestDegree: '本科',
    school: ['复旦大学'],
    major: '工商管理',
    currentCompany: 'MNO科技公司',
    currentPosition: '高级产品经理',
    workYears: 4,
    companies: ['MNO科技公司', 'PQR创新公司'],
    hardSkills: ['Axure', 'Figma', 'SQL', '数据分析'],
    softSkills: ['用户研究', '需求分析', '项目协调'],
    languages: ['英语', '中文'],
    jobIntent: { targetPosition: '产品总监' },
    matchedPosition: '产品策划经理'
  },
  {
    resumeId: '4',
    originalFilename: '赵六-UI设计师.pdf',
    parsedAt: '2024-01-12 16:30:00',
    source: '批量上传',
    status: '解析成功',
    matchScore: 88,
    name: '赵六',
    phone: '13600136004',
    email: 'zhaoliu@example.com',
    age: 26,
    location: '广州',
    highestDegree: '本科',
    school: ['中央美术学院'],
    major: '视觉传达设计',
    currentCompany: 'STU设计公司',
    currentPosition: 'UI设计师',
    workYears: 3,
    companies: ['STU设计公司', 'VWX创意公司'],
    hardSkills: ['Figma', 'Sketch', 'Photoshop', 'Illustrator', 'AE'],
    softSkills: ['创意思维', '用户研究', '团队协作'],
    languages: ['中文'],
    jobIntent: { targetPosition: '资深UI设计师' },
    matchedPosition: 'UI/UX设计师'
  },
  {
    resumeId: '5',
    originalFilename: '钱七-数据分析师.pdf',
    parsedAt: '2024-01-11 11:15:00',
    source: 'BOSS直聘',
    status: '解析成功',
    matchScore: 80,
    name: '钱七',
    phone: '13500135005',
    email: 'qianqi@example.com',
    age: 29,
    location: '杭州',
    highestDegree: '硕士',
    school: ['浙江大学'],
    major: '数据科学',
    currentCompany: 'YZA数据公司',
    currentPosition: '高级数据分析师',
    workYears: 6,
    companies: ['YZA数据公司', 'BCD科技公司', 'EFG数据公司'],
    hardSkills: ['Python', 'SQL', 'Excel', 'Tableau', 'R'],
    softSkills: ['数据挖掘', '统计分析', '报告撰写'],
    languages: ['英语', '中文'],
    jobIntent: { targetPosition: '数据科学家' },
    matchedPosition: '数据挖掘工程师'
  },
  {
    resumeId: '6',
    originalFilename: '孙八-运维工程师.pdf',
    parsedAt: '2024-01-10 14:25:00',
    source: '内部推荐',
    status: '解析成功',
    matchScore: 75,
    name: '孙八',
    phone: '13400134006',
    email: 'sunba@example.com',
    age: 31,
    location: '成都',
    highestDegree: '本科',
    school: ['电子科技大学'],
    major: '网络工程',
    currentCompany: 'HIJ云服务公司',
    currentPosition: '运维工程师',
    workYears: 8,
    companies: ['HIJ云服务公司', 'KLM科技公司', 'NOP运维公司'],
    hardSkills: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'Jenkins'],
    softSkills: ['故障排查', '系统优化', '安全防护'],
    languages: ['英语', '中文'],
    jobIntent: { targetPosition: '运维专家' },
    matchedPosition: 'DevOps工程师'
  },
  {
    resumeId: '7',
    originalFilename: '周九-测试工程师.pdf',
    parsedAt: '2024-01-09 13:40:00',
    source: 'BOSS直聘',
    status: '解析成功',
    matchScore: 82,
    name: '周九',
    phone: '13300133007',
    email: 'zhoujiu@example.com',
    age: 25,
    location: '西安',
    highestDegree: '本科',
    school: ['西安电子科技大学'],
    major: '软件工程',
    currentCompany: 'QRS软件公司',
    currentPosition: '测试工程师',
    workYears: 2,
    companies: ['QRS软件公司'],
    hardSkills: ['Selenium', 'JMeter', 'Postman', 'Python', 'SQL'],
    softSkills: ['质量意识', '问题发现', '流程规范'],
    languages: ['中文'],
    jobIntent: { targetPosition: '高级测试工程师' },
    matchedPosition: '自动化测试工程师'
  },
  {
    resumeId: '8',
    originalFilename: '吴十-算法工程师.pdf',
    parsedAt: '2024-01-08 10:50:00',
    source: '批量上传',
    status: '解析成功',
    matchScore: 95,
    name: '吴十',
    phone: '13200132008',
    email: 'wushi@example.com',
    age: 32,
    location: '北京',
    highestDegree: '博士',
    school: ['清华大学', '中科院'],
    major: '人工智能',
    currentCompany: 'TUV科技公司',
    currentPosition: '算法专家',
    workYears: 9,
    companies: ['TUV科技公司', 'WXY人工智能公司', 'ZAB科技公司'],
    hardSkills: ['Python', 'TensorFlow', 'PyTorch', '机器学习', '深度学习'],
    softSkills: ['算法优化', '模型设计', '创新思维'],
    languages: ['英语', '中文'],
    jobIntent: { targetPosition: '首席算法工程师' },
    matchedPosition: '机器学习工程师'
  },
  {
    resumeId: '9',
    originalFilename: '刘一-前端工程师.pdf',
    parsedAt: '2024-01-07 17:20:00',
    source: 'BOSS直聘',
    status: '解析成功',
    matchScore: 70,
    name: '刘一',
    phone: '13100131009',
    email: 'liuyi@example.com',
    age: 24,
    location: '南京',
    highestDegree: '本科',
    school: ['东南大学'],
    major: '计算机科学与技术',
    currentCompany: 'CDE互联网公司',
    currentPosition: '前端工程师',
    workYears: 1,
    companies: ['CDE互联网公司'],
    hardSkills: ['Vue.js', 'JavaScript', 'CSS', 'HTML', 'Webpack'],
    softSkills: ['学习能力', '团队协作', '快速适应'],
    languages: ['中文'],
    jobIntent: { targetPosition: '高级前端工程师' },
    matchedPosition: '前端开发工程师'
  },
  {
    resumeId: '10',
    originalFilename: '陈二-项目经理.pdf',
    parsedAt: '2024-01-06 09:10:00',
    source: '内部推荐',
    status: '解析成功',
    matchScore: 87,
    name: '陈二',
    phone: '13000130010',
    email: 'chener@example.com',
    age: 33,
    location: '武汉',
    highestDegree: '硕士',
    school: ['华中科技大学'],
    major: '项目管理',
    currentCompany: 'FGH咨询公司',
    currentPosition: '项目经理',
    workYears: 10,
    companies: ['FGH咨询公司', 'IJK管理公司', 'LMN项目公司'],
    hardSkills: ['PMP', '项目管理', '敏捷开发', '风险控制', '预算管理'],
    softSkills: ['领导力', '沟通协调', '团队管理'],
    languages: ['英语', '中文'],
    jobIntent: { targetPosition: '高级项目经理' },
    matchedPosition: '项目管理专家'
  }
];

export const mockResumeDetail: ResumeDetail = {
  resumeId: 'resume-001',
  originalFilename: '张三_前端工程师.pdf',
  parsedAt: '2023-12-01T10:30:00Z',
  source: 'upload',
  basicInfo: {
    name: '张三',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    age: 28,
    location: '北京'
  },
  education: [
    {
      school: '清华大学',
      degree: '本科',
      startDate: '2013-09-01',
      endDate: '2017-06-30'
    },
    {
      school: '北京大学',
      degree: '硕士',
      startDate: '2017-09-01',
      endDate: '2020-06-30'
    }
  ],
  workExperience: [
    {
      company: '腾讯科技有限公司',
      position: '高级前端工程师',
      startDate: '2020-07-01',
      endDate: '2023-11-30',
      responsibilities: [
        '负责公司核心产品的前端开发',
        '参与技术架构设计和重构',
        '指导初级工程师进行开发'
      ]
    },
    {
      company: '阿里巴巴集团',
      position: '前端工程师',
      startDate: '2017-07-01',
      endDate: '2020-06-30',
      responsibilities: [
        '参与电商平台前端开发',
        '优化页面性能，提升用户体验',
        '维护和迭代现有功能'
      ]
    }
  ],
  skills: {
    hardSkills: ['React', 'TypeScript', 'Node.js', 'Webpack', 'CSS', 'HTML'],
    softSkills: ['沟通能力', '团队协作', '问题解决能力', '学习能力']
  },
  jobIntent: {
    targetPosition: '高级前端工程师',
    preferredLocation: '北京',
    expectedSalary: '25-35K',
    expectedIndustry: '互联网',
    workType: '全职',
    availableTime: '随时'
  },
  fileUrl: 'https://example.com/resumes/resume-001.pdf',
  jobMatch: {
    overall_score: 85,
    dimension_scores: {
      skill_match: 90,
      experience_match: 85,
      education_match: 80,
      semantic_match: 87
    },
    risk_score: 25,
    matched_points: [
      '拥有5年以上React开发经验',
      '熟悉TypeScript和现代前端框架',
      '有大型电商平台开发经验',
      '具备团队协作和指导能力'
    ],
    gap_points: [
      '缺乏移动端开发经验',
      '未接触过微前端架构',
      '对某些新技术栈了解有限'
    ],
    summary: '该候选人技能匹配度较高，工作经验丰富，与目标职位要求匹配度达85%。主要优势是React和TypeScript经验丰富，有大型项目经验。需要注意的是在移动端开发经验方面有所欠缺。'
  }
};

// MCP mock数据
export const mockMcpProviders: McpProvider[] = [
  {
    mcpId: 'mcp-001',
    name: '学信网学历验证服务',
    category: '学历验证',
    status: '启用',
    endpointUrl: 'https://api.chsi.com.cn/verify',
    authType: 'API Key',
    description: '官方学信网学历验证服务，支持学位和学历信息验证',
    timeoutMs: 5000,
    retryCount: 2,
    isEnabledByDefault: true,
    createdBy: '系统管理员',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  },
  {
    mcpId: 'mcp-002',
    name: '公安身份核验服务',
    category: '身份核验',
    status: '启用',
    endpointUrl: 'https://api.gongan.gov.cn/id-verify',
    authType: 'Bearer Token',
    description: '公安部门提供的身份信息核验服务',
    timeoutMs: 3000,
    retryCount: 1,
    isEnabledByDefault: true,
    createdBy: '系统管理员',
    createdAt: '2023-02-20T14:30:00Z',
    updatedAt: '2023-02-20T14:30:00Z',
  },
  {
    mcpId: 'mcp-003',
    name: '自定义背景调查服务',
    category: '自定义',
    status: '停用',
    endpointUrl: 'https://api.custom-bg-check.com/verify',
    authType: 'Basic Auth',
    description: '第三方背景调查服务，支持工作经历验证',
    timeoutMs: 10000,
    retryCount: 3,
    isEnabledByDefault: false,
    createdBy: '系统管理员',
    createdAt: '2023-03-10T09:15:00Z',
    updatedAt: '2023-03-10T09:15:00Z',
  }
];

// 模板mock数据
export const mockResumeTemplates: ResumeExportTemplate[] = [
  {
    templateId: 'temp-001',
    name: '标准JSON格式模板',
    formatType: 'json',
    status: '启用',
    description: '标准的JSON格式输出，包含所有简历字段',
    content: `{
  "basicInfo": {
    "name": "{{name}}",
    "phone": "{{phone}}",
    "email": "{{email}}"
  },
  "education": [
    {
      "school": "{{school}}",
      "degree": "{{degree}}",
      "startDate": "{{startDate}}",
      "endDate": "{{endDate}}"
    }
  ],
  "workExperience": [
    {
      "company": "{{company}}",
      "position": "{{position}}",
      "startDate": "{{startDate}}",
      "endDate": "{{endDate}}",
      "responsibilities": ["{{responsibility}}"],
      "achievements": ["{{achievement}}"]
    }
  ]
}`,
    createdBy: '系统管理员',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  },
  {
    templateId: 'temp-002',
    name: '精简XML格式模板',
    formatType: 'xml',
    status: '启用',
    description: '精简的XML格式，适合系统间数据交换',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<resume>
  <basicInfo>
    <name>{{name}}</name>
    <phone>{{phone}}</phone>
    <email>{{email}}</email>
  </basicInfo>
  <education>
    <item>
      <school>{{school}}</school>
      <degree>{{degree}}</degree>
      <startDate>{{startDate}}</startDate>
      <endDate>{{endDate}}</endDate>
    </item>
  </education>
</resume>`,
    createdBy: '系统管理员',
    createdAt: '2023-02-20T14:30:00Z',
    updatedAt: '2023-02-20T14:30:00Z',
  },
  {
    templateId: 'temp-003',
    name: '停用的Excel格式模板',
    formatType: 'json',
    status: '停用',
    description: '旧版Excel格式导出模板，已停用',
    content: `{
  "personalInfo": {
    "name": "{{name}}",
    "contact": "{{contact}}"
  }
}`,
    createdBy: '系统管理员',
    createdAt: '2023-03-10T09:15:00Z',
    updatedAt: '2023-03-10T09:15:00Z',
  }
];
export const getMockTaskById = (id: string): ParseTask | undefined =>
  [mockBatchTask, mockSingleResume, mockSystemMatchSingleResume].find(t => t.taskId === id);

// 职位管理模拟数据
export const mockJobPositions: JobPosition[] = [
  {
    id: 'job-001',
    positionName: '前端工程师',
    department: '技术研发部',
    status: 'active',
    workLocation: '北京',
    employmentType: 'full_time',
    experienceLevel: 'mid',
    salaryRange: '15000-25000',
    description: '负责公司产品的前端开发工作，参与产品设计和优化。',
    responsibilities: [
      '负责公司产品的前端开发和维护',
      '与UI设计师、后端工程师协作完成产品开发',
      '优化前端性能，提升用户体验'
    ],
    qualifications: [
      '本科及以上学历，计算机相关专业',
      '3年以上前端开发经验',
      '熟练掌握HTML、CSS、JavaScript'
    ],
    requiredSkills: [
      'React',
      'TypeScript',
      'Webpack'
    ],
    preferredSkills: [
      'Node.js',
      'GraphQL'
    ],
    educationRequirement: '本科及以上',
    majorPreference: '计算机相关专业',
    positionType: '技术类',
    category: '研发',
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2023-05-10T14:30:00Z',
  },
  {
    id: 'job-002',
    positionName: '产品经理',
    department: '产品部',
    status: 'draft',
    workLocation: '上海',
    employmentType: 'full_time',
    experienceLevel: 'senior',
    salaryRange: '20000-35000',
    description: '负责产品规划、需求分析和产品生命周期管理。',
    responsibilities: [
      '负责产品规划和需求分析',
      '协调开发团队完成产品开发',
      '跟踪产品上线后的数据和反馈'
    ],
    qualifications: [
      '5年以上产品管理经验',
      '熟悉产品开发流程',
      '具备良好的沟通协调能力'
    ],
    requiredSkills: [
      'Axure',
      'PRD文档编写',
      '数据分析'
    ],
    preferredSkills: [
      '用户研究',
      '增长黑客'
    ],
    educationRequirement: '本科及以上',
    majorPreference: '不限',
    positionType: '管理类',
    category: '产品',
    createdAt: '2023-02-20T10:15:00Z',
    updatedAt: '2023-04-12T11:20:00Z',
  },
  {
    id: 'job-003',
    positionName: 'UI设计师',
    department: '设计部',
    status: 'closed',
    workLocation: '深圳',
    employmentType: 'part_time',
    experienceLevel: 'entry',
    salaryRange: '8000-12000',
    description: '负责公司产品的界面设计和用户体验优化。',
    responsibilities: [
      '负责产品界面设计',
      '制定设计规范和组件库',
      '参与用户体验优化'
    ],
    qualifications: [
      '2年以上UI设计经验',
      '熟练使用Figma、Sketch等设计工具',
      '具备良好的审美能力'
    ],
    requiredSkills: [
      'Figma',
      'Sketch',
      'Photoshop'
    ],
    preferredSkills: [
      '用户研究',
      '交互设计'
    ],
    educationRequirement: '大专及以上',
    majorPreference: '设计相关专业',
    positionType: '设计类',
    category: '设计',
    createdAt: '2023-03-01T08:45:00Z',
    updatedAt: '2023-05-05T16:40:00Z',
  },
];