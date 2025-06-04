export interface FileData {
  key: string;
  url: string;
  originalName: string;
}

export interface RenderFiles {
  // Main files for native AR
  usdz?: FileData; // For iOS AR
  glb?: FileData; // For Android AR

  // Legacy files (for existing renders)
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
