import { useState } from 'react';
import { PDFFile, UploadProgress } from '../types';
import { mockPDFFiles } from '../utils/mockData';

export const useFiles = () => {
  const [files, setFiles] = useState<PDFFile[]>(mockPDFFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUploadFile = () => {
    // TODO: Implement file upload functionality
    console.log('Upload file');
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleChatStart = (fileId: string) => {
    // TODO: Navigate to chat with specific file
    console.log('Start chat with file:', fileId);
  };

  const simulateFileUpload = (fileName: string, fileSize: string) => {
    const newFile: PDFFile = {
      id: Date.now().toString(),
      name: fileName.replace('.pdf', ''),
      fileName: fileName,
      size: fileSize,
      uploadDate: new Date().toLocaleDateString('tr-TR'),
      messageCount: 0,
      status: 'processing',
      isProcessing: true,
      processingProgress: 0,
    };

    setFiles((prev) => [newFile, ...prev]);

    // Simulate processing progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Update file status to ready
        setFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id
              ? { ...f, status: 'ready', isProcessing: false, processingProgress: 100 }
              : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id ? { ...f, processingProgress: Math.round(progress) } : f
          )
        );
      }
    }, 500);
  };

  return {
    files: filteredFiles,
    searchQuery,
    setSearchQuery,
    uploadProgress,
    handleUploadFile,
    handleDeleteFile,
    handleChatStart,
    simulateFileUpload,
  };
};
