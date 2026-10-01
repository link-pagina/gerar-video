import React, { useState } from 'react';
import {
  FileEdit,
  Copy,
  Check,
  Hash,
  Sparkles,
  ArrowRight,
  FolderOpen,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Step2Data, ReferencePhoto } from '../types/script';
import { PhotoReferenceSelector } from './PhotoReferenceSelector';

interface Step2TitulosDescricaoProps {
  step2Data?: Step2Data;
  selectedPhoto: ReferencePhoto | null;
  onSelectPhoto: (photo: ReferencePhoto) => void;
  onConfirmPhotoAndGoToStep3: () => void;
  hasFalas: boolean;
  isLoading: boolean;
}

export const Step2TitulosDescricao: React.FC<Step2TitulosDescricaoProps> = ({
  step2Data,
  selectedPhoto,
  onSelectPhoto,
  onConfirmPhotoAndGoToStep3,
  hasFalas,
  isLoading,
}) => {
  const [copiedTitle1, setCopiedTitle1] = useState(false);
  const [copiedTitle2, setCopiedTitle2] = useState(false);
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!step2Data) {
    return (
      <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
        <FileEdit className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-medium text-slate-300">
          Nenhum título ou descrição gerado ainda
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Gere o Passo 1 primeiro para criar os títulos e a descrição automaticamente.
        </p>
      </div>
    );
  }

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fullDescriptionText = `${step2Data.hookDescription}\n\n${step2Data.reflectionDescription}\n\n${step2Data.ctaDescription}`;
  const hashtagsText = step2Data.hashtags.join(' ');

  const handleCopyAll = () => {
    const fullBundle = `TÍTULO 1:\n${step2Data.title1}\n\nTÍTULO 2:\n${step2Data.title2}\n\nDESCRIÇÃO:\n${fullDescriptionText}\n\nHASHTAGS:\n${hashtagsText}`;
    navigator.clipboard.writeText(fullBundle);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="text-lg font-bold text-slate-100">
              Passo 2 — Títulos Otimizados, Descrição & Hashtags
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Formatado com precisão para o algoritmo do YouTube Shorts (retenção, busca e CTR).
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-amber-300 hover:border-amber-500/40 transition self-start sm:self-auto"
        >
          {copiedAll ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Pacote Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copiar Títulos + Descrição</span>
            </>
          )}
        </button>
      </div>

      {/* TITLES (2 options) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title 1 */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              TÍTULO 1 (Opção Principal)
            </span>
            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  step2Data.title1.length <= 60
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                    : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                }`}
              >
                {step2Data.title1.length}/60 carac.
              </span>
              <button
                onClick={() => handleCopy(step2Data.title1, setCopiedTitle1)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 transition"
                title="Copiar Título 1"
              >
                {copiedTitle1 ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-100">{step2Data.title1}</p>
        </div>

        {/* Title 2 */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              TÍTULO 2 (Opção Alternativa)
            </span>
            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  step2Data.title2.length <= 60
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                    : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                }`}
              >
                {step2Data.title2.length}/60 carac.
              </span>
              <button
                onClick={() => handleCopy(step2Data.title2, setCopiedTitle2)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 transition"
                title="Copiar Título 2"
              >
                {copiedTitle2 ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-100">{step2Data.title2}</p>
        </div>
      </div>

      {/* DESCRIPTION (3 Parts) */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              DESCRIÇÃO ESTRUTURADA (3 Partes)
            </h3>
            <p className="text-xs text-slate-400">
              Gancho visível antes do "mostrar mais", reflexão acolhedora e CTA suave.
            </p>
          </div>
          <button
            onClick={() => handleCopy(fullDescriptionText, setCopiedDescription)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 transition"
          >
            {copiedDescription ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Descrição Copiada</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Descrição Completa</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {/* Part 1: Gancho */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-amber-400">
                1. Gancho (Primeira linha antes do "mostrar mais")
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {step2Data.hookDescription.length}/120 carac.
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200">{step2Data.hookDescription}</p>
          </div>

          {/* Part 2: Reflexão */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-amber-400">
                2. Reflexão & Conteúdo Edificante
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {step2Data.reflectionDescription.length}/300 carac.
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200">
              {step2Data.reflectionDescription}
            </p>
          </div>

          {/* Part 3: Chamada para Ação */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-amber-400">
                3. Chamada para Ação Amigável (CTA)
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {step2Data.ctaDescription.length}/200 carac.
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200">{step2Data.ctaDescription}</p>
          </div>
        </div>
      </div>

      {/* HASHTAGS (5-8 tags in 3 tiers) */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Hashtags Otimizadas ({step2Data.hashtags.length})
            </h3>
          </div>
          <button
            onClick={() => handleCopy(hashtagsText, setCopiedHashtags)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 transition"
          >
            {copiedHashtags ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Hashtags Copiadas</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Hashtags</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {step2Data.hashtags.map((tag, i) => (
            <span
              key={i}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${
                i < 3
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-semibold'
                  : 'bg-slate-950 text-slate-300 border-slate-800'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          As 3 primeiras hashtags aparecem como links clicáveis acima do título no YouTube.
        </p>
      </div>

      {/* COMPLETE DRIVE PHOTO SELECTION GALLERY DIRECTLY IN STEP 2 */}
      <div>
        <div className="mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
            Próximo Passo: Escolha da Foto de Referência para os Vídeos
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-2">
            Selecione a Foto da Pasta do Drive para o VEO
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Clique na foto que deseja usar como narrador. Ela será enviada ao VEO / Google Flow para
            manter o mesmo personagem consistente em todas as 5 cenas de vídeo.
          </p>
        </div>

        <PhotoReferenceSelector
          selectedPhoto={selectedPhoto}
          onSelectPhoto={onSelectPhoto}
          onConfirmAndGenerate={onConfirmPhotoAndGoToStep3}
          isGenerating={isLoading}
          hasFalas={hasFalas}
        />
      </div>
    </div>
  );
};
