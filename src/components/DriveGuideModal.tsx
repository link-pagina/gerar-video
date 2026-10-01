import React from 'react';
import {
  X,
  FileText,
  FolderOpen,
  ExternalLink,
  BookOpen,
  Lightbulb,
  Workflow,
  Sparkles,
  Github,
  Globe,
} from 'lucide-react';
import { GOOGLE_DRIVE_DOC_URL } from '../data/defaultMessages';
import { GOOGLE_DRIVE_PHOTOS_FOLDER_URL } from '../data/referencePhotos';

interface DriveGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriveGuideModal: React.FC<DriveGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">
              Guia Prático do Agente & Links do Drive
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Drive Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Links Oficiais do Google Drive (Compartilhados)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={GOOGLE_DRIVE_DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-300" />
                  </div>
                  <h5 className="font-bold text-slate-200 text-sm">Arquivo MENSAGENS</h5>
                  <p className="text-xs text-slate-400 mt-1">
                    Documento com todas as mensagens numeradas de 1 em diante.
                  </p>
                </div>
                <span className="text-[11px] text-amber-400 font-medium mt-3 inline-block">
                  Abrir no Google Docs &rarr;
                </span>
              </a>

              <a
                href={GOOGLE_DRIVE_PHOTOS_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FolderOpen className="w-5 h-5 text-amber-400" />
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-300" />
                  </div>
                  <h5 className="font-bold text-slate-200 text-sm">Pasta fotos</h5>
                  <p className="text-xs text-slate-400 mt-1">
                    Pasta com retratos numerados de referência para Imagen 4 e VEO.
                  </p>
                </div>
                <span className="text-[11px] text-amber-400 font-medium mt-3 inline-block">
                  Abrir Pasta no Drive &rarr;
                </span>
              </a>
            </div>
          </div>

          {/* 4 Steps Workflow */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Como Funciona o Fluxo de 4 Passos
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-slate-200">1. Fala (5 blocos, 14-20 palavras):</strong>{' '}
                Gancho, Identificação, Ensinamento, Reflexão e Encerramento com CTA suave. Os
                blocos 1-4 terminam com reticências (...) e o bloco 5 com ponto final.
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-slate-200">2. Título & Descrição (Automático):</strong> 2
                opções de títulos até 60 caracteres, descrição em 3 partes e 5 a 8 hashtags.
                Depois, o sistema pausa para a escolha da foto!
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-slate-200">3. Prompts de Imagem (Imagen 4 / Flow):</strong>{' '}
                Mantém o bloco fixo de personagem em inglês em todas as 5 gerações, vertical 9:16,
                lente 85mm e consistência facial.
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-slate-200">4. Prompts de Vídeo (VEO):</strong> 5 cenas de 8
                segundos, pessoa olhando diretamente para a câmera, sincronizada com a fala em
                português brasileiro.
              </div>
            </div>
          </div>

          {/* Hosting on GitHub and Vercel */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-amber-300 font-bold">
              <Globe className="w-4 h-4" />
              <span>Hospedagem no GitHub e Vercel</span>
            </div>
            <p className="text-slate-400">
              O projeto já vem com <code className="text-amber-300">vercel.json</code>, rota serverless em{' '}
              <code className="text-amber-300">api/generate.ts</code> e servidor full-stack{' '}
              <code className="text-amber-300">server.ts</code>.
            </p>
            <p className="text-slate-400">
              No Vercel, adicione a variável de ambiente: <code className="text-amber-300">GEMINI_API_KEY</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
