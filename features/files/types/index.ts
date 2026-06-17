export type File = {
  id: string;
  title: string;
  created_at: string;
  size: number;
  url?: string;
  is_saved?: boolean;
  file_type?: 'pdf' | 'image' | 'youtube' | 'audio';
  source_url?: string | null;
  extracted_text?: string | null;
  thumbnail_url?: string | null;
};

export type SubmitYouTubeResponse = {
  file_id: string;
  title: string;
  thumbnail_url: string;
};

export type ExtractNotesResponse = {
  file_id: string;
  extracted_text: string;
};

export type UpdateNotesResponse = {
  success: boolean;
};
