import React from 'react';
import {
  Sparkles,
  FolderOpen,
  FileText,
  History,
  RotateCcw,
  ExternalLink,
  Download,
} from 'lucide-react';
import { GOOGLE_DRIVE_DOC_URL } from '../data/defaultMessages';
import { GOOGLE_DRIVE_PHOTOS_FOLDER_URL } from '../data/referencePhotos';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenDriveGuide: () => void;
  onReset: () => void;
  onExportMarkdown: () => void;
  hasContent: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenDriveGuide,
  onReset,
  onExportMarkdown,
  hasContent,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold tracking-wider text-slate-100 uppercase text-xs sm:text-sm">
                Shorts Cristão
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                Agent Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Roteiros Devocionais • Imagen 4 • VEO / Google Flow
            </p>
          </div>
        </div>

        {/* Google Drive Direct Quick Links */}
        <div className="hidden md:flex items-center space-x-2">
          <a
            href={GOOGLE_DRIVE_DOC_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir arquivo de Mensagens no Google Drive"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all duration-200"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Doc MENSAGENS</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <a
            href={GOOGLE_DRIVE_PHOTOS_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir pasta de Fotos no Google Drive"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all duration-200"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Pasta FOTOS</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

        {/* Global Actions */}
        <div className="flex items-center space-x-2">
          {hasContent && (
            <button
              onClick={onExportMarkdown}
              title="Exportar pacote completo em Markdown"
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          )}

          <button
            onClick={onOpenHistory}
            title="Histórico de Roteiros"
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Histórico</span>
          </button>

          <button
            onClick={onOpenDriveGuide}
            title="Guia dos Links do Google Drive e Flow"
            className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            Ajuda Drive
          </button>

          {hasContent && (
            <button
              onClick={onReset}
              title="Novo Roteiro"
              className="p-1.5 text-xs rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
