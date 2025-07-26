export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  metadata?: {
    formField?: string;
    fieldType?: string;
    options?: string[];
  };
}

export interface FormData {
  [key: string]: string | number | Date | boolean;
}

export interface ChatSession {
  id: string;
  formType: string;
  messages: Message[];
  formData: FormData;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  pdfTemplate: string;
}

export interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'multiselect' | 'number';
  required: boolean;
  label: string;
  placeholder?: string;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}