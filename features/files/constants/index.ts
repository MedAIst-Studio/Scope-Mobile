/**
 * File upload constants and configuration
 */

// File size limits
export const FILE_SIZE_LIMITS = {
  MIN: 0,
  MAX: 10 * 1024 * 1024, // 10MB
  RECOMMENDED_MAX: 5 * 1024 * 1024, // 5MB for optimal performance
} as const;

// File count limits
export const FILE_COUNT_LIMITS = {
  MIN: 1,
  MAX: 10,
  BULK_UPLOAD_MAX: 5,
} as const;

// Accepted file types
export const ACCEPTED_FILE_TYPES = {
  PDF: '.pdf',
  DOC: '.doc',
  DOCX: '.docx',
  TXT: '.txt',
} as const;

export const ACCEPTED_FILE_TYPES_ARRAY = Object.values(ACCEPTED_FILE_TYPES);

export const ACCEPTED_FILE_TYPES_STRING = ACCEPTED_FILE_TYPES_ARRAY.join(',');

// MIME types mapping
export const MIME_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  TXT: 'text/plain',
} as const;

// Upload status messages
export const UPLOAD_MESSAGES = {
  ERROR: 'Dosya yüklenirken bir hata oluştu',
  SIZE_EXCEEDED: 'Dosya boyutu limiti aşıldı',
  TYPE_NOT_ACCEPTED: 'Desteklenmeyen dosya türü',
  COUNT_EXCEEDED: 'Maksimum dosya sayısı aşıldı',
  PROCESSING: 'Dosya işleniyor...',
  UPLOADING: 'Dosya yükleniyor...',
} as const;

// Processing time estimates (in seconds per MB)
export const PROCESSING_TIME_ESTIMATES = {
  FAST: 2,
  MEDIUM: 5,
  SLOW: 10,
} as const;

// Retry configuration
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 1,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 10000,
  BACKOFF_FACTOR: 2,
} as const;
