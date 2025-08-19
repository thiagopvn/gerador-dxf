export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  active: boolean;
  order: number;
}

export interface Model {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  active: boolean;
}

export interface FontMapping {
  id: string;
  modelId: string;
  modelName: string;
  fontFileName: string;
  yearStart: number;
  yearEnd: number;
  settings: {
    fontSize: number;
    spacing: number;
    offsetX?: number;
    offsetY?: number;
  };
}

export interface DXFGenerationRequest {
  modelId: string;
  year: number;
  chassisNumber: string;
  engineNumber: string;
}