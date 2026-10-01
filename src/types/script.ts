export interface MessageItem {
  id: string;
  number: number;
  title: string;
  theme?: string;
  biblicalReference?: string;
  text: string;
  source?: 'preset' | 'google-drive' | 'custom';
}

export interface ReferencePhoto {
  id: string;
  number: number;
  name: string;
  apparentAge: string;
  skinTone: string;
  hair: string;
  expression: string;
  clothing: string;
  lighting: string;
  scene: string;
  imageUrl: string;
  confirmationDescription: string;
  characterDescriptionEn: string;
}

export interface FalaBlock {
  index: number; // 1 to 5
  name: 'Gancho' | 'Identificação' | 'Ensinamento' | 'Convite à reflexão' | 'Encerramento com convite emocional';
  text: string;
  wordCount: number;
  isValidLength: boolean; // 14 to 20 words
  endsCorrectly: boolean; // 1-4 end with '...', 5 ends with '.' or '?'
}

export interface Step1Data {
  falas: FalaBlock[];
  rawText: string;
  messageConfirmedText: string;
  messageNumber?: number;
  creativeAngle?: string;
  variationIndex?: number;
}

export interface Step2Data {
  title1: string;
  title2: string;
  hookDescription: string; // Gancho (<= 120 chars)
  reflectionDescription: string; // Reflexão (<= 300 chars)
  ctaDescription: string; // Chamada para ação (<= 200 chars)
  hashtags: string[];
  rawFormattedText?: string;
}

export interface ImagePromptItem {
  index: number; // 1 to 5
  prompt: string;
  correspondingFala: string;
  emotionalProgression: string;
}

export interface Step3Data {
  confirmedPhotoDescription: string;
  characterBlockFixed: string;
  imagePrompts: ImagePromptItem[];
  photoReferenceNumber: number;
  photoReference: ReferencePhoto;
  rawFormattedText?: string;
}

export interface VideoPromptItem {
  index: number; // 1 to 5
  prompt: string;
  spokenPortuguese: string;
  sceneTone: string;
}

export interface Step4Data {
  videoPrompts: VideoPromptItem[];
  rawFormattedText?: string;
}

export interface GenerationProject {
  id: string;
  createdAt: string;
  title: string;
  selectedMessageNumber?: number;
  selectedPhotoNumber?: number;
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
  step4?: Step4Data;
  status: 'idle' | 'step1_completed' | 'step2_completed' | 'waiting_photo' | 'step3_completed' | 'completed';
}
