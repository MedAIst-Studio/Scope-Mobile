export interface PDFFile {
  id: string;
  name: string;
  fileName: string;
  size: string;
  uploadDate: string;
  messageCount: number;
  isProcessing?: boolean;
  status?: 'ready' | 'processing' | 'error';
  processingProgress?: number;
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}
