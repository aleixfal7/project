import axios from 'axios';
import { ApiResponse, ChatSession, FormTemplate, Message } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat endpoints
export const chatApi = {
  sendMessage: async (sessionId: string, message: string): Promise<ApiResponse<Message>> => {
    const response = await api.post(`/chat/${sessionId}/message`, { message });
    return response.data;
  },

  createSession: async (formType: string): Promise<ApiResponse<ChatSession>> => {
    const response = await api.post('/chat/session', { formType });
    return response.data;
  },

  getSession: async (sessionId: string): Promise<ApiResponse<ChatSession>> => {
    const response = await api.get(`/chat/session/${sessionId}`);
    return response.data;
  },

  generatePDF: async (sessionId: string): Promise<ApiResponse<{ pdfUrl: string }>> => {
    const response = await api.post(`/chat/${sessionId}/generate-pdf`);
    return response.data;
  },
};

// Form templates
export const formsApi = {
  getTemplates: async (): Promise<ApiResponse<FormTemplate[]>> => {
    const response = await api.get('/forms/templates');
    return response.data;
  },

  getTemplate: async (id: string): Promise<ApiResponse<FormTemplate>> => {
    const response = await api.get(`/forms/templates/${id}`);
    return response.data;
  },
};

export default api;