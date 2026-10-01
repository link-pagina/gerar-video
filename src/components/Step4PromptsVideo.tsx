import React, { useState } from 'react';
import {
  Video,
  Copy,
  Check,
  Sparkles,
  Download,
  ExternalLink,
  Clapperboard,
  RefreshCw,
  Layers,
  Lightbulb,
  CheckCircle2,
  Film,
  Camera,
} from 'lucide-react';
import { Step4Data, Step1Data, Step2Data, ReferencePhoto } from '../types/script';

interface Step4PromptsVideoProps {
  step4Data?: Step4Data;
  step1Data?: Step1Data;
  step2Data?: Step2Data;
  selectedPhoto?: ReferencePhoto | null;
  onGenerateStep4: () => void;
  isLoading: boolean;
  onExportMarkdown: () => void;
  onChangePhoto?: () => void;
}

export const Step4PromptsVideo: React.FC<Step4PromptsVideoProps> = ({
  step4Data,
  step1Data,
  step2Data,
  selectedPhoto,
  onGenerateStep4,
  isLoading,
  onExportMarkdown,
  onChangePhoto,
}) => {
  const [copiedSceneIndex, setCopiedSceneIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyScene = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSceneIndex(index);
    setTimeout(() => setCopiedSceneIndex(null), 2000);
  };

  const handleCopyAll = () => {
    if (!step4Data) return;
    const plaintext = step4Data.videoPrompts
      .map((item) => `Cena ${item.index}:\n${item.prompt}`)
      .join('\n\n');
    navigator.clipboard.writeText(plaintext);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  if (!step4Data) {
    return (
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Clapperboard className="w-7 h-7" />
        </div>
        <div className="max-w-md mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <span>Passo 3 — Produção de Vídeo</span>
          </div>
          <h3 className="text-xl font-bold text-slate-100">
            Prompts de Vídeo para VEO (Google Flow)
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Gera os 5 prompts cinematográficos de 8 segundos em inglês para o VEO, com a pessoa
            falando diretamente para a câmera e tag de sincronização de fala em português brasileiro.
          </p>
        </div>

        {selectedPhoto && (
          <div className="inline-flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-left max-w-sm mx-auto">
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.name}
              className="w-10 h-12 rounded object-cover border border-slate-700 shrink-0"
            />
            <div className="text-xs">
              <span className="text-amber-400 font-bold block">
                Foto #{selectedPhoto.number} Selecionada
              </span>
              <span className="text-slate-400 truncate block text-[11px]">
                {selectedPhoto.apparentAge}
              </span>
            </div>
          </div>
        )}

        <div>
          <button
            onClick={onGenerateStep4}
            disabled={isLoading || !step1Data || !selectedPhoto}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 disabled:opacity-50 inline-flex items-center space-x-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Criando Direção de Vídeo VEO...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Gerar os 5 Prompts de Vídeo para VEO</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="text-lg font-bold text-slate-100">
              Passo 3 — Prompts de Vídeo (VEO / Google Flow)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            5 cenas de 8 segundos com contato visual direto com a lente e fala em português sincronizada.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onChangePhoto && (
            <button
              onClick={onChangePhoto}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 transition"
              title="Trocar a foto de referência da pasta"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Trocar Foto</span>
            </button>
          )}

          <button
            onClick={onGenerateStep4}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 transition"
            title="Recriar prompts de vídeo"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Recriar Vídeos</span>
          </button>

          <button
            onClick={handleCopyAll}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:text-amber-300 hover:border-amber-500/40 transition"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">5 Prompts Copiados!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar os 5 Prompts</span>
              </>
            )}
          </button>

          <button
            onClick={onExportMarkdown}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Pacote Completo (.md)</span>
          </button>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start space-x-3 text-xs text-amber-200/90 leading-relaxed">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-amber-300 block">
            Diretrizes do Prompt VEO / Google Flow:
          </strong>
          <p>
            • <strong>Voz do Homem (Jesus):</strong> Na Cena 1 fala com voz serena, acolhedora e amigável. Da Cena 2 em diante continua com sua voz serena e amigável (<code className="text-amber-400 font-mono bg-black/40 px-1 py-0.5 rounded">The man continues with his serene, warm, and friendly voice speaking in Brazilian Portuguese...</code>).
          </p>
          <p>
            • <strong>Restrições (Evite):</strong> Sem música de fundo e sem legendas (<code className="text-amber-400 font-mono bg-black/40 px-1 py-0.5 rounded">No background music, no subtitles, no captions</code>).
          </p>
        </div>
      </div>

      {/* 5 Video Scenes Cards */}
      <div className="space-y-4">
        {step4Data.videoPrompts.map((scene) => (
          <div
            key={scene.index}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-3"
          >
            {/* Scene Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center font-mono">
                  {scene.index}
                </span>
                <span className="text-sm font-bold text-slate-100">Cena {scene.index}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                  Duração: 8 segundos
                </span>
                {scene.sceneTone && (
                  <span className="text-[11px] text-amber-400/90 italic hidden md:inline">
                    • Tom: {scene.sceneTone}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleCopyScene(scene.prompt, scene.index)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 text-xs font-medium transition self-start sm:self-auto"
              >
                {copiedSceneIndex === scene.index ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Prompt Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar Prompt da Cena {scene.index}</span>
                  </>
                )}
              </button>
            </div>

            {/* Spoken Portuguese Tag */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Fala em Português Sincronizada com a Boca (Tag de Áudio):
              </span>
              <p className="text-slate-200 italic font-sans">
                "{scene.spokenPortuguese || step1Data?.falas[scene.index - 1]?.text}"
              </p>
            </div>

            {/* English VEO Prompt */}
            <div className="relative p-4 rounded-xl bg-slate-950 border border-slate-800/90">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                Prompt Cinematográfico VEO (English):
              </span>
              <p className="text-xs text-slate-300 font-mono leading-relaxed select-all">
                {scene.prompt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
