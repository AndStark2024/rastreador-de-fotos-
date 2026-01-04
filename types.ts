
export interface ImageFile {
  id: string;
  name: string;
  url: string;
  data: string; // Base64 data
  lastModified: number;
}

export interface MatchResult {
  id: string;
  similarityScore: number;
  reason: string;
}

export interface ScanningStatus {
  total: number;
  processed: number;
  isScanning: boolean;
}
