import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ExternalLink,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Hash,
  PenTool,
  Loader2,
  RefreshCw,
  Wand2,
  Layers,
} from 'lucide-react';
import { MessageItem, Step1Data } from '../types/script';
import { GOOGLE_DRIVE_DOC_URL } from '../data/defaultMessages';

export const CREATIVE_ANGLES = [
  {
    id: 'auto',
    name: 'Surpreenda-me (Variação Inédita & Inteligente)',
    desc: 'O agente escolhe dinamicamente um novo ângulo criativo para esta mensagem.',
  },
  {
    id: 'Pergunta Direta e Provocativa',
    name: 'Pergunta Provocativa (Prende a Atenção)',
    desc: 'Gancho visceral com pergunta profunda que faz o espectador parar de rolar o feed.',
  },
  {
    id: 'Revelação Espiritual e Quebra de Paradoxo',
    name: 'Revelação Espiritual (Deus Opera no Oculto)',
    desc: 'Mostra que a ação divina muitas vezes acontece de forma oposta à lógica humana.',
  },
  {
    id: 'Acolhimento Íntimo e Voz Paternal',
    name: 'Acolhimento Íntimo (Voz Paternal de Amor)',
    desc: 'Tom caloroso que toca feridas da alma, acolhe a dor e convida ao recomeço.',
  },
  {
    id: 'Metáfora Poética e Contraste Emocional',
    name: 'Metáfora Poética & Visual (Luz na Tempestade)',
    desc: 'Usa imagens fortes e poéticas (porto seguro, âncora, orvalho matinal, calmaria).',
  },
  {
    id: 'Afirmação Contundente de Esperança',
    name: 'Afirmação Contundente (Fé & Vitória)',
    desc: 'Declaração marcante de autoridade e triunfo espiritual sobre os medos.',
  },
];

interface Step1FalasProps {
  messages: MessageItem[];
  selectedMessageNumber: number | null;
  onSelectMessageNumber: (num: number) => void;
  selectedMessageText: string;
  onUpdateMessageText: (text: string) => void;
  onAddCustomMessage: (item: MessageItem) => void;
  step1Data?: Step1Data;
  isLoading: boolean;
  onGenerate: (angle?: string, isNewVariation?: boolean) => void;
  onNextStep: () => void;
  creativeAngle: string;
  onChangeCreativeAngle: (angle: string) => void;
  variationCount: number;
}

export const Step1Falas: React.FC<Step1FalasProps> = ({
  messages,
  selectedMessageNumber,
  onSelectMessageNumber,
  selectedMessageText,
  onUpdateMessageText,
  onAddCustomMessage,
  step1Data,
  isLoading,
  onGenerate,
  onNextStep,
  creativeAngle,
  onChangeCreativeAngle,
  variationCount,
}) => {
  const [inputNumber, setInputNumber] = useState<string>(
    selectedMessageNumber ? String(selectedMessageNumber) : '1'
  );
  const [activeTab, setActiveTab] = useState<'number' | 'custom'>('number');
  const [customTitle, setCustomTitle] = useState('');
  const [customVerse, setCustomVerse] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  // Sync input number
  useEffect(() => {
    if (selectedMessageNumber) {
      setInputNumber(String(selectedMessageNumber));
    }
  }, [selectedMessageNumber]);

  const handleLookupNumber = (numStr: string) => {
    setErrorFeedback(null);
    const parsed = parseInt(numStr, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setErrorFeedback('Por favor, informe um número válido (ex: 1, 5, 20).');
      return;
    }

    const found = messages.find((m) => m.number === parsed);
    if (found) {
      onSelectMessageNumber(parsed);
      onUpdateMessageText(found.text);
    } else {
      setErrorFeedback(
        `A Mensagem #${parsed} ainda não foi sincronizada nesta biblioteca local. Você pode abrir o Doc do Google Drive e colar o texto dela na aba "Mensagem Manual" abaixo.`
      );
    }
  };

  const handleSaveCustom = () => {
    if (!selectedMessageText.trim()) return;
    const nextNum = Math.max(...messages.map((m) => m.number), 0) + 1;
    const newItem: MessageItem = {
      id: `custom-${Date.now()}`,
      number: nextNum,
      title: customTitle.trim() || `Mensagem #${nextNum}`,
      biblicalReference: customVerse.trim() || undefined,
      text: selectedMessageText.trim(),
      source: 'custom',
    };
    onAddCustomMessage(newItem);
    onSelectMessageNumber(nextNum);
    setActiveTab('number');
    setInputNumber(String(nextNum));
  };

  const handleCopySingle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    if (!step1Data) return;
    const formatted = step1Data.falas
      .map((f) => `Fala ${f.index}:\n${f.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Text-to-speech preview for audio pacing
  const speakFalas = (indexToSpeak?: number) => {
    if (!('speechSynthesis' in window) || !step1Data) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingIndex(null);
      return;
    }

    const textToSpeak =
      indexToSpeak !== undefined
        ? step1Data.falas[indexToSpeak].text
        : step1Data.falas.map((f) => f.text).join(' ');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.92;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingIndex(indexToSpeak ?? null);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const currentMessage = messages.find((m) => m.number === selectedMessageNumber);

  return (
    <div className="space-y-8">
      {/* Step Header & Rules Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="text-xl font-bold text-slate-100">
                Passo 1 — Criação das Falas (Roteiro com Variações)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Cada geração cria uma <strong>variação inédita e única</strong> da mensagem (mesmo se
              você escolher o mesmo número), alternando ganchos, metáforas e CTAs sem repetir padrões.
            </p>
          </div>

          <a
            href={GOOGLE_DRIVE_DOC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-800/90 border border-slate-700/80 text-amber-300 hover:bg-slate-800 hover:border-amber-500/40 transition shadow-sm shrink-0"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Ver Doc `MENSAGENS` no Drive</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

        {/* Input Selector: Number or Custom */}
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <button
              onClick={() => setActiveTab('number')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'number'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <Hash className="w-3.5 h-3.5" />
                <span>Escolher por Número (Drive)</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'custom'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <PenTool className="w-3.5 h-3.5" />
                <span>Texto Livre / Nova Mensagem</span>
              </span>
            </button>
          </div>

          {activeTab === 'number' ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <span className="text-xs font-bold text-amber-400/80">#</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={inputNumber}
                    onChange={(e) => {
                      setInputNumber(e.target.value);
                      handleLookupNumber(e.target.value);
                    }}
                    placeholder="Número da mensagem (ex: 1, 5, 20...)"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition"
                  />
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setInputNumber(String(num));
                        handleLookupNumber(String(num));
                      }}
                      className={`px-2.5 py-1.5 text-xs font-mono rounded-lg transition border ${
                        selectedMessageNumber === num
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      #{num}
                    </button>
                  ))}
                </div>
              </div>

              {errorFeedback && (
                <div className="flex items-start space-x-2 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>{errorFeedback}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Título ou Tema (opcional)"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="Referência Bíblica (ex: Mateus 11:28)"
                  value={customVerse}
                  onChange={(e) => setCustomVerse(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Cole aqui o texto da mensagem extraído do Google Drive ou uma reflexão autoral..."
                value={selectedMessageText}
                onChange={(e) => onUpdateMessageText(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveCustom}
                  disabled={!selectedMessageText.trim()}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 disabled:opacity-50 transition"
                >
                  Salvar na Biblioteca do Projeto
                </button>
              </div>
            </div>
          )}

          {/* VISUAL CONFIRMATION BLOCKQUOTE */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Confirmação Visual da Mensagem Localizada:
              </span>
              {currentMessage?.biblicalReference && (
                <span className="text-[11px] text-amber-400/90 font-mono">
                  Ref: {currentMessage.biblicalReference}
                </span>
              )}
            </div>

            <blockquote className="relative p-4 rounded-xl bg-slate-950 border-l-4 border-amber-500 border-t border-r border-b border-slate-800/80 shadow-inner">
              <div className="flex items-start space-x-2 text-slate-300 text-xs sm:text-sm italic leading-relaxed font-sans">
                <span className="text-amber-500 font-bold select-none text-base">&gt;</span>
                <p className="flex-1 whitespace-pre-wrap">
                  {selectedMessageText ||
                    'Nenhuma mensagem selecionada. Informe um número acima para carregar o texto.'}
                </p>
              </div>
              {currentMessage && (
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 not-italic">
                  <span>
                    Mensagem #{currentMessage.number}:{' '}
                    <strong className="text-slate-300 font-medium">{currentMessage.title}</strong>
                  </span>
                  <span className="text-amber-400/80">{currentMessage.theme}</span>
                </div>
              )}
            </blockquote>
          </div>

          {/* CREATIVE VARIATION SELECTOR */}
          <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Ângulo de Variação Criativa para este Roteiro:</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {variationCount > 0 ? `${variationCount} variação(ões) gerada(s)` : 'Nova geração'}
              </span>
            </div>

            <select
              value={creativeAngle}
              onChange={(e) => onChangeCreativeAngle(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {CREATIVE_ANGLES.map((angle) => (
                <option key={angle.id} value={angle.id}>
                  {angle.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              {CREATIVE_ANGLES.find((a) => a.id === creativeAngle)?.desc ||
                'Gera uma versão totalmente nova e inédita desta mensagem.'}
            </p>
          </div>

          {/* Generation Action Buttons */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              O agente irá gerar automaticamente o{' '}
              <strong className="text-amber-300">Passo 1 (Falas)</strong> e o{' '}
              <strong className="text-amber-300">Passo 2 (Títulos e Descrição)</strong>.
            </p>

            <button
              onClick={() => onGenerate(creativeAngle, false)}
              disabled={isLoading || !selectedMessageText.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Criando Nova Variação...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Gerar Passo 1 + Passo 2</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* STEP 1 RESULTS DISPLAY */}
      {step1Data && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-100">
                  Falas Geradas para o YouTube Short
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  5 blocos
                </span>
              </div>
              {step1Data.creativeAngle && (
                <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Variação #{step1Data.variationIndex || 1}:{' '}
                    <strong className="text-slate-200">{step1Data.creativeAngle.split('(')[0]}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* RE-GENERATE ANOTHER VARIATION BUTTON */}
              <button
                onClick={() => onGenerate(creativeAngle, true)}
                disabled={isLoading}
                title="Gera outra variação inédita da mesma mensagem"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Gerar Outra Variação</span>
              </button>

              <button
                onClick={() => speakFalas()}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 transition"
                title="Ouvir simulação de narração natural com pausas"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Parar</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ouvir</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyAll}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-amber-300 hover:border-amber-500/40 transition"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar 5 Falas</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 5 Blocks Cards */}
          <div className="grid grid-cols-1 gap-3">
            {step1Data.falas.map((fala, idx) => {
              const isBlockValid = fala.wordCount >= 14 && fala.wordCount <= 20;

              return (
                <div
                  key={fala.index}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center font-mono">
                        {fala.index}
                      </span>
                      <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                        {fala.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Word Count Indicator with 14-20 compliance badge */}
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                          isBlockValid
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                            : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                        }`}
                        title={
                          isBlockValid
                            ? 'Extensão perfeita (entre 14 e 20 palavras)'
                            : 'Atenção: a regra do agente pede entre 14 e 20 palavras'
                        }
                      >
                        {fala.wordCount} palavras
                      </span>

                      {/* Single Copy button */}
                      <button
                        onClick={() => handleCopySingle(fala.text, idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                        title="Copiar apenas esta fala"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Single listen button */}
                      <button
                        onClick={() => speakFalas(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
                        title="Ouvir esta fala isolada"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed pl-8">
                    {fala.text}
                  </p>

                  <div className="mt-2 pl-8 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {idx < 4 ? 'Termina com reticências (...)' : 'Termina com ponto final (.)'}
                    </span>
                    <span className="font-mono text-[10px]">~7 segundos na narração</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Forward to Step 2 Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onNextStep}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider transition"
            >
              <span>Ver Título e Descrição (Passo 2)</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
