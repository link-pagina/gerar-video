import React, { useState } from 'react';
import {
  FolderOpen,
  ExternalLink,
  Check,
  Sparkles,
  Camera,
  Info,
  CheckCircle2,
  ArrowRight,
  Search,
} from 'lucide-react';
import { ReferencePhoto } from '../types/script';
import {
  REFERENCE_PHOTOS,
  GOOGLE_DRIVE_PHOTOS_FOLDER_URL,
} from '../data/referencePhotos';

interface PhotoReferenceSelectorProps {
  selectedPhoto: ReferencePhoto | null;
  onSelectPhoto: (photo: ReferencePhoto) => void;
  onConfirmAndGenerate: () => void;
  isGenerating: boolean;
  hasFalas: boolean;
  compact?: boolean;
}

export const PhotoReferenceSelector: React.FC<PhotoReferenceSelectorProps> = ({
  selectedPhoto,
  onSelectPhoto,
  onConfirmAndGenerate,
  isGenerating,
  hasFalas,
  compact = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');

  const current = selectedPhoto || REFERENCE_PHOTOS[0];

  const filteredPhotos = REFERENCE_PHOTOS.filter((photo) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      String(photo.number).includes(searchTerm.trim()) ||
      photo.name.toLowerCase().includes(searchTerm.toLowerCase());

    const isFemale = photo.name.toLowerCase().includes('mulher') || photo.name.toLowerCase().includes('jovem com olhar de esperança');
    const matchesGender =
      genderFilter === 'all' ||
      (genderFilter === 'female' && isFemale) ||
      (genderFilter === 'male' && !isFemale);

    return matchesSearch && matchesGender;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Fotos da Pasta do Google Drive ({REFERENCE_PHOTOS.length} fotos)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Selecione visualmente a foto desejada abaixo. O Imagen 4 e o VEO usarão esta foto para
            manter o mesmo narrador e iluminação em todas as 5 gerações.
          </p>
        </div>

        <a
          href={GOOGLE_DRIVE_PHOTOS_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-amber-300 hover:bg-slate-800 hover:border-amber-500/40 text-xs font-semibold transition shrink-0"
        >
          <FolderOpen className="w-4 h-4 text-amber-400" />
          <span>Abrir Pasta Original no Drive</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filtrar por número da foto (ex: 1, 5, 20)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-slate-500 mr-1 text-[11px]">Filtro:</span>
          <button
            onClick={() => setGenderFilter('all')}
            className={`px-2.5 py-1 rounded-lg border transition ${
              genderFilter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            Todas ({REFERENCE_PHOTOS.length})
          </button>
          <button
            onClick={() => setGenderFilter('male')}
            className={`px-2.5 py-1 rounded-lg border transition ${
              genderFilter === 'male'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            Masculino
          </button>
          <button
            onClick={() => setGenderFilter('female')}
            className={`px-2.5 py-1 rounded-lg border transition ${
              genderFilter === 'female'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            Feminino
          </button>
        </div>
      </div>

      {/* COMPLETE VISUAL PHOTO GALLERY (GRID OF ALL PHOTOS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[380px] overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
        {filteredPhotos.map((photo) => {
          const isSelected = current.number === photo.number;

          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => onSelectPhoto(photo)}
              className={`group relative flex flex-col rounded-xl overflow-hidden border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/20 scale-[1.02] bg-slate-900'
                  : 'border-slate-800/80 hover:border-slate-600 bg-slate-950/70 hover:scale-[1.01]'
              }`}
            >
              {/* Aspect 9:12 vertical portrait preview */}
              <div className="relative aspect-[9/12] w-full bg-slate-900 overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.name}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to thumbnail URL if lh3 has temporary network block
                    const target = e.currentTarget;
                    if (!target.src.includes('thumbnail')) {
                      const id = photo.imageUrl.split('/').pop();
                      target.src = `https://drive.google.com/thumbnail?id=${id}&sz=w600`;
                    }
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />

                {/* Photo Number Badge */}
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-amber-400 font-mono">
                  #{photo.number}
                </div>

                {/* Selected Checkmark Overlay */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md animate-in zoom-in-75">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Card Footer Info */}
              <div className="p-2 text-[11px]">
                <div className="font-semibold text-slate-200 truncate">Foto #{photo.number}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{photo.apparentAge}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* SELECTED PHOTO CONFIRMATION & AGENT BLOCKQUOTE */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border-2 border-amber-500/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 shadow-inner">
        <div className="flex items-start space-x-4 flex-1">
          {/* Small thumbnail of currently selected */}
          <div className="relative w-16 h-22 rounded-lg overflow-hidden border border-amber-500/50 shrink-0 bg-slate-900 shadow-md">
            <img
              src={current.imageUrl}
              alt={current.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[10px] font-bold text-amber-400 text-center py-0.5 font-mono">
              #{current.number}
            </div>
          </div>

          {/* Blockquote verification as required by Agent */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Foto #{current.number} Selecionada da Pasta
              </span>
            </div>

            <blockquote className="p-2.5 rounded-lg bg-slate-900 border-l-4 border-amber-500 text-xs text-slate-200 italic leading-relaxed">
              <span className="text-amber-500 font-bold not-italic mr-1">&gt;</span>
              {current.confirmationDescription}
            </blockquote>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="shrink-0 flex items-center justify-end">
          <button
            onClick={onConfirmAndGenerate}
            disabled={isGenerating || !hasFalas}
            className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/25 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Confirmar Foto #{current.number} & Gerar Vídeos (VEO)</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
