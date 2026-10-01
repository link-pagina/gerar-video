import React from 'react';
import { X, Trash2, Clock, ArrowRight, BookOpen, Film } from 'lucide-react';
import { GenerationProject } from '../types/script';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: GenerationProject[];
  onLoadProject: (project: GenerationProject) => void;
  onDeleteProject: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  projects,
  onLoadProject,
  onDeleteProject,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">Histórico de Roteiros Salvos</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {projects.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Film className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              Nenhum projeto salvo no histórico ainda. Gere um novo roteiro para vê-lo aqui.
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Mensagem #{proj.selectedMessageNumber || 'Custom'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(proj.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 truncate">
                    {proj.step2?.title1 || proj.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {proj.step1?.falas[0]?.text || 'Sem prévia'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      onLoadProject(proj);
                      onClose();
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition"
                  >
                    <span>Carregar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Excluir do histórico"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {projects.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-500">{projects.length} roteiro(s) salvo(s)</span>
            <button
              onClick={onClearAll}
              className="text-rose-400/80 hover:text-rose-300 transition"
            >
              Limpar todo o histórico
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
