// API Constants
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    ME: '/users/me',
  },
  COMPANIES: {
    BASE: '/companies',
    MEMBERS: '/companies/:id/members',
    JOBS: '/companies/:id/jobs',
  },
  JOBS: {
    BASE: '/jobs',
    SEARCH: '/jobs/search',
    CATEGORIES: '/jobs/categories',
    APPLY: '/jobs/:id/apply',
    APPLICATIONS: '/jobs/:id/applications',
  },
  APPLICATIONS: {
    BASE: '/applications',
    MY_APPLICATIONS: '/applications/me',
    STATUS: '/applications/:id/status',
  },
  SAVED_JOBS: {
    BASE: '/saved-jobs',
  },
  JOB_ALERTS: {
    BASE: '/job-alerts',
  },
  UPLOAD: {
    RESUME: '/upload/resume',
    PROFILE_PICTURE: '/upload/profile-picture',
    COMPANY_LOGO: '/upload/company-logo',
    COMPANY_COVER: '/upload/company-cover',
  },
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// Job Constants
export const JOB_CONSTANTS = {
  REMOTE_TYPES: ['office', 'remote', 'hybrid'] as const,
  EMPLOYMENT_TYPES: ['full_time', 'part_time', 'contract', 'internship'] as const,
  EXPERIENCE_LEVELS: ['entry', 'mid', 'senior', 'lead', 'executive'] as const,
  JOB_STATUS: ['draft', 'active', 'paused', 'closed', 'filled'] as const,
  SALARY_TYPES: ['yearly', 'monthly', 'weekly', 'hourly'] as const,
} as const;

// User Constants
export const USER_CONSTANTS = {
  ROLES: ['job_seeker', 'employer', 'admin'] as const,
  AVAILABILITY: ['available', 'not_available', 'open_to_offers'] as const,
} as const;

// Company Constants
export const COMPANY_CONSTANTS = {
  SIZES: ['startup', 'small', 'medium', 'large', 'enterprise'] as const,
  MEMBER_ROLES: ['admin', 'recruiter', 'member'] as const,
} as const;

// Application Constants
export const APPLICATION_CONSTANTS = {
  STATUS: ['submitted', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'rejected', 'withdrawn'] as const,
} as const;

// Currency Constants
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
] as const;

// Common Industries
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Construction',
  'Transportation',
  'Entertainment',
  'Government',
  'Non-profit',
  'Consulting',
  'Real Estate',
  'Energy',
  'Agriculture',
  'Other',
] as const;

// Common Skills (you can expand this list)
export const COMMON_SKILLS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  // Frontend
  'React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'Sass', 'Tailwind CSS', 'Next.js', 'Nuxt.js',
  // Backend
  'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel', 'Ruby on Rails',
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions',
  // Tools & Other
  'Git', 'Linux', 'API Design', 'GraphQL', 'REST API', 'Microservices', 'Testing', 'Agile', 'Scrum',
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  TOKEN_EXPIRED: 'Token has expired',
  FILE_TOO_LARGE: 'File size too large',
  INVALID_FILE_TYPE: 'Invalid file type',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  JOB_CREATED: 'Job posted successfully',
  JOB_UPDATED: 'Job updated successfully',
  APPLICATION_SUBMITTED: 'Application submitted successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  PASSWORD_RESET: 'Password reset successfully',
} as const;
