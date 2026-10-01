import React from 'react';
import { Mic, FileEdit, Video, CheckCircle2, Lock } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number; // 1, 2, 3
  onSelectStep: (step: number) => void;
  isStep1Complete: boolean;
  isStep2Complete: boolean;
  isStep3Complete: boolean; // video prompts complete
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onSelectStep,
  isStep1Complete,
  isStep2Complete,
  isStep3Complete,
}) => {
  const steps = [
    {
      number: 1,
      title: 'Passo 1',
      subtitle: 'Criação das Falas',
      detail: '5 blocos de 14-20 palavras',
      icon: Mic,
      isComplete: isStep1Complete,
      isAccessible: true,
    },
    {
      number: 2,
      title: 'Passo 2',
      subtitle: 'Título, Descrição & Foto',
      detail: 'Otimização YouTube + Foto Drive',
      icon: FileEdit,
      isComplete: isStep2Complete,
      isAccessible: isStep1Complete,
    },
    {
      number: 3,
      title: 'Passo 3',
      subtitle: 'Prompts de Vídeo',
      detail: 'VEO / Google Flow 8s',
      icon: Video,
      isComplete: isStep3Complete,
      isAccessible: isStep2Complete,
    },
  ];

  return (
    <nav className="w-full my-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isComplete = step.isComplete;
          const isLocked = !step.isAccessible;

          return (
            <button
              key={step.number}
              type="button"
              disabled={isLocked}
              onClick={() => onSelectStep(step.number)}
              className={`relative text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-amber-500/15 via-slate-900/90 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-950/20'
                  : isComplete
                  ? 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600 text-slate-300'
                  : isLocked
                  ? 'bg-slate-950/40 border-slate-800/40 opacity-50 cursor-not-allowed text-slate-500'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : isComplete
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step.title}
                </span>

                <div className="flex items-center">
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  ) : (
                    <Icon
                      className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`}
                    />
                  )}
                </div>
              </div>

              <div>
                <h4
                  className={`text-sm font-semibold truncate ${
                    isActive ? 'text-slate-100' : isComplete ? 'text-slate-200' : 'text-slate-400'
                  }`}
                >
                  {step.subtitle}
                </h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{step.detail}</p>
              </div>

              {isActive && (
                <div className="absolute -bottom-[1px] left-4 right-4 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
