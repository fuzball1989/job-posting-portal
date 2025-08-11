import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
              
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', newRefreshToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'job_seeker' | 'employer';
  }) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async logout() {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Jobs endpoints
  async searchJobs(params: {
    search?: string;
    categoryId?: string;
    location?: string;
    remoteType?: string[];
    employmentType?: string[];
    experienceLevel?: string[];
    salaryMin?: number;
    salaryMax?: number;
    companyId?: string;
    isFeatured?: boolean;
    isUrgent?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const response = await this.api.get('/jobs/search', { params });
    return response.data;
  }

  async getJobById(id: string) {
    const response = await this.api.get(`/jobs/${id}`);
    return response.data;
  }

  async createJob(jobData: {
    categoryId?: string;
    title: string;
    description: string;
    requirements?: string;
    responsibilities?: string;
    benefits?: string;
    location?: string;
    remoteType: 'office' | 'remote' | 'hybrid';
    employmentType: 'full_time' | 'part_time' | 'contract' | 'internship';
    experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    salaryType?: 'yearly' | 'monthly' | 'weekly' | 'hourly';
    skillsRequired?: string[];
    niceToHaveSkills?: string[];
    applicationDeadline?: string;
    isFeatured?: boolean;
    isUrgent?: boolean;
  }) {
    const response = await this.api.post('/jobs', jobData);
    return response.data;
  }

  async updateJob(id: string, jobData: any) {
    const response = await this.api.put(`/jobs/${id}`, jobData);
    return response.data;
  }

  async deleteJob(id: string) {
    const response = await this.api.delete(`/jobs/${id}`);
    return response.data;
  }

  async getJobCategories() {
    const response = await this.api.get('/jobs/categories');
    return response.data;
  }

  // Generic request method
  async request(method: string, url: string, data?: any, config?: any) {
    const response = await this.api.request({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
