export interface FileData {
  key: string;
  url: string;
  originalName: string;
}

export interface RenderFiles {
  // Archivos principales para AR nativo
  usdz?: FileData; // Para iOS AR
  glb?: FileData;  // Para Android AR
  
  // Archivos legacy (para renders existentes)
  obj?: FileData;
  mtl?: FileData;
}

export interface RenderData {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  userId: string;
  userEmail: string;
  files: RenderFiles;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

export interface UploadedRender {
  id: string;
  slug: string;
  name: string;
  description?: string;
  publicUrl: string;
} 