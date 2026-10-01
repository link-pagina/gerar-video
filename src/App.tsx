import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepNavigation } from './components/StepNavigation';
import { Step1Falas } from './components/Step1Falas';
import { Step2TitulosDescricao } from './components/Step2TitulosDescricao';
import { Step4PromptsVideo } from './components/Step4PromptsVideo';
import { HistoryModal } from './components/HistoryModal';
import { DriveGuideModal } from './components/DriveGuideModal';
import {
  MessageItem,
  ReferencePhoto,
  Step1Data,
  Step2Data,
  Step4Data,
  GenerationProject,
} from './types/script';
import { INITIAL_MESSAGES } from './data/defaultMessages';
import { REFERENCE_PHOTOS } from './data/referencePhotos';
import {
  generateStep1And2,
  generateStep4,
} from './services/apiService';
import { AlertTriangle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const STORAGE_KEY_PROJECTS = 'roteirista_shorts_cristao_projects_v2';
const STORAGE_KEY_CUSTOM_MSGS = 'roteirista_shorts_cristao_custom_msgs_v1';

export default function App() {
  // App state
  const [messages, setMessages] = useState<MessageItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_MSGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...INITIAL_MESSAGES, ...parsed];
      }
    } catch (e) {
      console.error('Error loading custom messages from localStorage', e);
    }
    return INITIAL_MESSAGES;
  });

  const [selectedMessageNumber, setSelectedMessageNumber] = useState<number | null>(1);
  const [selectedMessageText, setSelectedMessageText] = useState<string>(
    INITIAL_MESSAGES[0].text
  );

  const [selectedPhoto, setSelectedPhoto] = useState<ReferencePhoto | null>(
    REFERENCE_PHOTOS[0]
  );

  // Workflow steps: 1 = Falas, 2 = Títulos & Descrição, 3 = Prompts de Vídeo (VEO)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [step1Data, setStep1Data] = useState<Step1Data | undefined>(undefined);
  const [step2Data, setStep2Data] = useState<Step2Data | undefined>(undefined);
  const [step4Data, setStep4Data] = useState<Step4Data | undefined>(undefined);

  // Creative variation tracking
  const [creativeAngle, setCreativeAngle] = useState<string>('auto');
  const [variationCount, setVariationCount] = useState<number>(1);

  // Loading & Error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepLabel, setLoadingStepLabel] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History & Guide Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isDriveGuideOpen, setIsDriveGuideOpen] = useState<boolean>(false);
  const [savedProjects, setSavedProjects] = useState<GenerationProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved projects', e);
    }
    return [];
  });

  // Save history helper
  const saveProjectToHistory = (
    s1?: Step1Data,
    s2?: Step2Data,
    s4?: Step4Data
  ) => {
    if (!s1) return;
    const newProj: GenerationProject = {
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: s2?.title1 || `Roteiro Mensagem #${selectedMessageNumber || 'Custom'}`,
      selectedMessageNumber: selectedMessageNumber || undefined,
      selectedPhotoNumber: selectedPhoto?.number,
      step1: s1,
      step2: s2,
      step4: s4,
      status: s4 ? 'completed' : s2 ? 'step2_completed' : 'step1_completed',
    };

    setSavedProjects((prev) => {
      const updated = [newProj, ...prev.filter((p) => p.id !== newProj.id)].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving projects to localStorage', e);
      }
      return updated;
    });
  };

  // Add custom message to project
  const handleAddCustomMessage = (item: MessageItem) => {
    setMessages((prev) => {
      const updated = [...prev, item];
      try {
        const customOnly = updated.filter((m) => m.source === 'custom');
        localStorage.setItem(STORAGE_KEY_CUSTOM_MSGS, JSON.stringify(customOnly));
      } catch (e) {
        console.error('Error saving custom message', e);
      }
      return updated;
    });
  };

  // Execute Step 1 & automatically Step 2 (supporting creative variations)
  const handleGenerateStep1And2 = async (angle?: string, isNewVariation: boolean = false) => {
    setErrorMessage(null);
    setIsLoading(true);
    const nextVariationIndex = isNewVariation ? variationCount + 1 : variationCount;
    setLoadingStepLabel(`Gerando Roteiro (Variação #${nextVariationIndex})...`);

    try {
      const currentMsg = messages.find((m) => m.number === selectedMessageNumber);
      const res = await generateStep1And2(
        selectedMessageText,
        selectedMessageNumber || undefined,
        currentMsg?.biblicalReference,
        angle || creativeAngle,
        nextVariationIndex
      );

      setStep1Data(res.step1);
      setStep2Data(res.step2);
      setVariationCount(nextVariationIndex);

      if (isNewVariation) {
        setCurrentStep(1);
      } else {
        setCurrentStep(2);
      }
      saveProjectToHistory(res.step1, res.step2, step4Data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Falha ao processar Passo 1 e 2');
    } finally {
      setIsLoading(false);
      setLoadingStepLabel('');
    }
  };

  // Execute Step 3: Video Prompts for VEO / Google Flow
  const handleGenerateVideoPrompts = async () => {
    if (!step1Data) {
      setErrorMessage('As 5 falas do Passo 1 são necessárias.');
      return;
    }

    if (!selectedPhoto) {
      setErrorMessage('Selecione uma foto da pasta do Drive antes de gerar os vídeos.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setLoadingStepLabel('Filmmaker Profissional: elaborando os 5 prompts de vídeo para VEO (Google Flow)...');

    try {
      const res = await generateStep4(
        step1Data.falas,
        selectedPhoto.characterDescriptionEn,
        selectedPhoto
      );
      setStep4Data(res.step4);
      setCurrentStep(3);
      saveProjectToHistory(step1Data, step2Data, res.step4);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Falha ao processar prompts de vídeo para VEO');
    } finally {
      setIsLoading(false);
      setLoadingStepLabel('');
    }
  };

  // Export full package as Markdown
  const handleExportMarkdown = () => {
    const currentMsg = messages.find((m) => m.number === selectedMessageNumber);
    const dateStr = new Date().toLocaleDateString('pt-BR');

    let md = `# PACOTE COMPLETO — YOUTUBE SHORT CRISTÃO\n`;
    md += `*Data de geração: ${dateStr}*\n\n`;

    if (currentMsg) {
      md += `## MENSAGEM DE ORIGEM\n`;
      md += `**Número no Drive:** #${currentMsg.number}\n`;
      md += `**Título:** ${currentMsg.title}\n`;
      if (currentMsg.biblicalReference) md += `**Referência:** ${currentMsg.biblicalReference}\n`;
      md += `\n> ${currentMsg.text}\n\n`;
    }

    if (selectedPhoto) {
      md += `## FOTO DE REFERÊNCIA NARRADOR (DRIVE)\n`;
      md += `**Foto:** #${selectedPhoto.number} (${selectedPhoto.name})\n`;
      md += `> ${selectedPhoto.confirmationDescription}\n\n`;
    }

    if (step1Data) {
      md += `---\n## PASSO 1 — CRIAÇÃO DAS FALAS (ROTEIRO)\n\n\`\`\`\n`;
      step1Data.falas.forEach((f) => {
        md += `Fala ${f.index}:\n${f.text}\n\n`;
      });
      md += `\`\`\`\n\n`;
    }

    if (step2Data) {
      md += `---\n## PASSO 2 — TÍTULO E DESCRIÇÃO\n\n`;
      md += `\`\`\`\nTÍTULO 1:\n${step2Data.title1}\n\nTÍTULO 2:\n${step2Data.title2}\n\`\`\`\n\n`;
      md += `\`\`\`\nDESCRIÇÃO:\n${step2Data.hookDescription}\n\n${step2Data.reflectionDescription}\n\n${step2Data.ctaDescription}\n\`\`\`\n\n`;
      md += `\`\`\`\nHASHTAGS:\n${step2Data.hashtags.join(' ')}\n\`\`\`\n\n`;
    }

    if (step4Data) {
      md += `---\n## PASSO 3 — PROMPTS DE VÍDEO (VEO / GOOGLE FLOW)\n\n`;
      step4Data.videoPrompts.forEach((scene) => {
        md += `### Cena ${scene.index} (8 segundos)\n`;
        md += `**Fala Sincronizada (Português):**\n"${scene.spokenPortuguese}"\n\n`;
        md += `**Prompt VEO (English):**\n\`\`\`\n${scene.prompt}\n\`\`\`\n\n`;
      });
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Short-Cristao-Msg-${selectedMessageNumber || 'Custom'}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to format friendly error messages
  const getFriendlyErrorMessage = (msg: string) => {
    if (
      msg.includes('503') ||
      msg.includes('UNAVAILABLE') ||
      msg.includes('high demand')
    ) {
      return 'Os servidores de IA do Google estão experimentando pico temporário de demanda. Nosso sistema realizou tentativas automáticas. Clique no botão ao lado para tentar novamente agora.';
    }
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return 'Limite de requisições temporário atingido. Aguarde alguns instantes e clique em Tentar Novamente.';
    }
    if (
      msg.includes('fetch failed') ||
      msg.includes('ECONNRESET') ||
      msg.includes('ETIMEDOUT') ||
      msg.includes('network')
    ) {
      return 'Houve uma oscilação momentânea na conexão de rede com os servidores do Gemini. O sistema realiza tentativas automáticas, ou você pode clicar em Tentar Novamente.';
    }
    return msg;
  };

  const handleRetryLastAction = () => {
    setErrorMessage(null);
    if (currentStep === 1 || currentStep === 2) {
      handleGenerateStep1And2();
    } else if (currentStep === 3) {
      handleGenerateVideoPrompts();
    }
  };

  const handleReset = () => {
    if (confirm('Deseja iniciar um novo roteiro? Os dados salvos continuarão no Histórico.')) {
      setStep1Data(undefined);
      setStep2Data(undefined);
      setStep4Data(undefined);
      setCurrentStep(1);
    }
  };

  const handleLoadProject = (proj: GenerationProject) => {
    if (proj.selectedMessageNumber) {
      setSelectedMessageNumber(proj.selectedMessageNumber);
      const match = messages.find((m) => m.number === proj.selectedMessageNumber);
      if (match) setSelectedMessageText(match.text);
    }
    if (proj.selectedPhotoNumber) {
      const photoMatch = REFERENCE_PHOTOS.find((p) => p.number === proj.selectedPhotoNumber);
      if (photoMatch) setSelectedPhoto(photoMatch);
    }
    setStep1Data(proj.step1);
    setStep2Data(proj.step2);
    setStep4Data(proj.step4);

    if (proj.step4) setCurrentStep(3);
    else if (proj.step2) setCurrentStep(2);
    else setCurrentStep(1);
  };

  const handleDeleteProject = (id: string) => {
    setSavedProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation Bar */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDriveGuide={() => setIsDriveGuideOpen(true)}
        onReset={handleReset}
        onExportMarkdown={handleExportMarkdown}
        hasContent={!!step1Data || !!step2Data || !!step4Data}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="mb-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema Prático de Produção • Shorts Devocionais Cristãos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-serif-title">
            Do Texto ao Roteiro & Prompts de Vídeo VEO
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Geração estritamente alinhada às regras do Agente: 5 falas de 14-20 palavras, títulos e
            descrições otimizados, seleção visual da foto do Drive e prompts de vídeo de 8s para VEO.
          </p>
        </div>

        {/* Global Loading Overlay Banner */}
        {isLoading && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center space-x-3 text-amber-300 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs sm:text-sm font-semibold">{loadingStepLabel}</span>
          </div>
        )}

        {/* Global Error Banner with Retry */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-200 text-xs">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-300 font-semibold mb-0.5">
                  Aviso do Sistema:
                </strong>
                <span className="leading-relaxed">{getFriendlyErrorMessage(errorMessage)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
              <button
                onClick={handleRetryLastAction}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-semibold transition"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => setErrorMessage(null)}
                className="p-1 rounded text-rose-400 hover:text-rose-200"
                title="Fechar aviso"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 3-Step Progress Tracker */}
        <StepNavigation
          currentStep={currentStep}
          onSelectStep={(step) => setCurrentStep(step)}
          isStep1Complete={!!step1Data}
          isStep2Complete={!!step2Data}
          isStep3Complete={!!step4Data}
        />

        {/* Step Views */}
        <div className="mt-6">
          {currentStep === 1 && (
            <Step1Falas
              messages={messages}
              selectedMessageNumber={selectedMessageNumber}
              onSelectMessageNumber={(num) => {
                setSelectedMessageNumber(num);
                const match = messages.find((m) => m.number === num);
                if (match) setSelectedMessageText(match.text);
              }}
              selectedMessageText={selectedMessageText}
              onUpdateMessageText={setSelectedMessageText}
              onAddCustomMessage={handleAddCustomMessage}
              step1Data={step1Data}
              isLoading={isLoading}
              onGenerate={handleGenerateStep1And2}
              onNextStep={() => setCurrentStep(2)}
              creativeAngle={creativeAngle}
              onChangeCreativeAngle={setCreativeAngle}
              variationCount={variationCount}
            />
          )}

          {currentStep === 2 && (
            <Step2TitulosDescricao
              step2Data={step2Data}
              selectedPhoto={selectedPhoto}
              onSelectPhoto={(photo) => setSelectedPhoto(photo)}
              onConfirmPhotoAndGoToStep3={() => {
                handleGenerateVideoPrompts();
              }}
              hasFalas={!!step1Data && step1Data.falas.length === 5}
              isLoading={isLoading}
            />
          )}

          {currentStep === 3 && (
            <Step4PromptsVideo
              step4Data={step4Data}
              step1Data={step1Data}
              step2Data={step2Data}
              selectedPhoto={selectedPhoto}
              onGenerateStep4={handleGenerateVideoPrompts}
              isLoading={isLoading}
              onExportMarkdown={handleExportMarkdown}
              onChangePhoto={() => setCurrentStep(2)}
            />
          )}
        </div>
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        projects={savedProjects}
        onLoadProject={handleLoadProject}
        onDeleteProject={handleDeleteProject}
        onClearAll={() => {
          if (confirm('Deseja limpar todo o histórico de roteiros salvos?')) {
            setSavedProjects([]);
            localStorage.removeItem(STORAGE_KEY_PROJECTS);
          }
        }}
      />

      {/* Google Drive Guide Modal */}
      <DriveGuideModal
        isOpen={isDriveGuideOpen}
        onClose={() => setIsDriveGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <p>Sistema Roteirista e Diretor de Shorts Cristãos • Alinhado às diretrizes oficiais</p>
      </footer>
    </div>
  );
}
