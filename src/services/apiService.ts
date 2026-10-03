import {
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  FalaBlock,
  ReferencePhoto,
} from '../types/script';

export interface GenerateStep1And2Response {
  success: boolean;
  step1: Step1Data;
  step2: Step2Data;
}

export interface GenerateStep3Response {
  success: boolean;
  step3: Step3Data;
}

export interface GenerateStep4Response {
  success: boolean;
  step4: Step4Data;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

async function postApi(endpoint: string, action: string, data: Record<string, any>) {
  const requestBody = JSON.stringify({
    action,
    payload: data,
    ...data,
  });

  // Call the primary serverless endpoint /api/generate directly
  let response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: requestBody,
  });

  // If 404, fallback to specific endpoint /api/{endpoint}
  if (response.status === 404) {
    response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestBody,
    });
  }

  if (!response.ok) {
    let errorMsg = '';
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorData.message || '';
    } catch {
      const text = await response.text().catch(() => '');
      errorMsg = text;
    }
    throw new Error(errorMsg || `Erro HTTP ${response.status} ao processar a geração.`);
  }

  return response.json();
}

export async function generateStep1And2(
  messageText: string,
  messageNumber?: number,
  biblicalReference?: string,
  creativeAngle?: string,
  variationIndex?: number
): Promise<GenerateStep1And2Response> {
  return postApi('generate-step-1-2', 'step-1-2', {
    messageText,
    messageNumber,
    biblicalReference,
    creativeAngle,
    variationIndex,
  });
}

export async function generateStep3(
  falas: FalaBlock[],
  photoReference: ReferencePhoto
): Promise<GenerateStep3Response> {
  return postApi('generate-step-3', 'step-3', {
    falas,
    photoReference,
  });
}

export async function generateStep4(
  falas: FalaBlock[],
  characterBlockFixed: string,
  photoReference?: ReferencePhoto
): Promise<GenerateStep4Response> {
  return postApi('generate-step-4', 'step-4', {
    falas,
    characterBlockFixed,
    photoReference,
  });
}
