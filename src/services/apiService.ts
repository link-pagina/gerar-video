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

export async function generateStep1And2(
  messageText: string,
  messageNumber?: number,
  biblicalReference?: string,
  creativeAngle?: string,
  variationIndex?: number
): Promise<GenerateStep1And2Response> {
  let response = await fetch(`${API_BASE_URL}/api/generate-step-1-2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messageText,
      messageNumber,
      biblicalReference,
      creativeAngle,
      variationIndex,
    }),
  });

  // Fallback to Vercel unified /api/generate endpoint if 404
  if (response.status === 404) {
    response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'step-1-2',
        payload: {
          messageText,
          messageNumber,
          biblicalReference,
          creativeAngle,
          variationIndex,
        },
      }),
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${response.status} na geração do Passo 1 e 2`);
  }

  return response.json();
}

export async function generateStep3(
  falas: FalaBlock[],
  photoReference: ReferencePhoto
): Promise<GenerateStep3Response> {
  let response = await fetch(`${API_BASE_URL}/api/generate-step-3`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ falas, photoReference }),
  });

  if (response.status === 404) {
    response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'step-3',
        payload: { falas, photoReference },
      }),
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${response.status} na geração do Passo 3`);
  }

  return response.json();
}

export async function generateStep4(
  falas: FalaBlock[],
  characterBlockFixed: string,
  photoReference?: ReferencePhoto
): Promise<GenerateStep4Response> {
  let response = await fetch(`${API_BASE_URL}/api/generate-step-4`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ falas, characterBlockFixed, photoReference }),
  });

  if (response.status === 404) {
    response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'step-4',
        payload: { falas, characterBlockFixed, photoReference },
      }),
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${response.status} na geração do Passo 4`);
  }

  return response.json();
}
