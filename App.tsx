
import React, { useState, useRef, useEffect } from 'react';
import { evaluateAlgorithm } from './services/geminiService';
import { ChatMessage, AlgorithmStatus } from './types';
import { StatusBadge } from './components/StatusBadge';
import { CircuitCard } from './components/CircuitCard';

type AppStage = 'OBJECTIVE' | 'INSTRUCTIONS';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<AppStage>('OBJECTIVE');
  const [currentObjective, setCurrentObjective] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const text = input.trim();
    setInput('');

    if (stage === 'OBJECTIVE') {
      setCurrentObjective(text);
      setMessages(prev => [
        ...prev, 
        { role: 'user', content: `🎯 TAREFA: ${text}`, type: 'objective' },
        { role: 'model', content: `Alvo travado: "${text}". Mande o algoritmo para análise de viabilidade!`, type: 'system' }
      ]);
      setStage('INSTRUCTIONS');
    } else {
      setIsLoading(true);
      const newUserMsg: ChatMessage = { role: 'user', content: text, type: 'instructions' };
      setMessages(prev => [...prev, newUserMsg]);

      try {
        const evaluation = await evaluateAlgorithm(currentObjective, text);
        const modelMsg: ChatMessage = { role: 'model', content: '', evaluation };
        
        setMessages(prev => [...prev, modelMsg]);
      } catch (error) {
        setMessages(prev => [...prev, { role: 'model', content: "CRITICAL_ERROR: Falha na análise de hardware!", type: 'system' }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetTask = () => {
    setStage('OBJECTIVE');
    setCurrentObjective('');
    setMessages(prev => [...prev, { role: 'model', content: "Memória limpa. Qual é a nova missão?", type: 'system' }]);
  };

  const isObjectiveStage = stage === 'OBJECTIVE';

  return (
    <div className="min-h-screen circuit-bg flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-4xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors-all duration-500 ${isObjectiveStage ? 'bg-orange-500 animate-header-orange' : 'bg-blue-500 animate-header-blue'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isObjectiveStage ? (
                <circle cx="12" cy="12" r="10" />
              ) : (
                <rect x="4" y="8" width="16" height="12" rx="2"/>
              )}
              <path d="M12 8V4H8" />
              {!isObjectiveStage && <path d="M2 14h2M20 14h2" />}
            </svg>
          </div>
          <div className="relative">
            <h1 className={`font-orbitron text-xl font-bold tracking-widest uppercase transition-colors-all duration-500 ${isObjectiveStage ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]'}`}>
              Mestre dos Circuitos
            </h1>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full transition-colors-all duration-500 ${isObjectiveStage ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></span>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                {isObjectiveStage ? 'AGUARDANDO OBJETIVO' : 'MODO_AVALIAÇÃO_ATIVO'}
              </p>
            </div>
          </div>
        </div>

        {currentObjective && (
          <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-lg flex items-center gap-3">
            <div className="text-right">
              <p className="text-[9px] font-mono text-blue-400 uppercase">Missão Atual</p>
              <p className="text-xs font-bold truncate max-w-[200px]">{currentObjective}</p>
            </div>
            <button onClick={resetTask} className="p-2 hover:bg-white/10 rounded-full transition-colors text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          </div>
        )}
      </header>

      <main className="w-full max-w-4xl flex-grow flex flex-col gap-4 overflow-hidden">
        <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-blue-500/20" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className={`w-20 h-20 border-2 border-dashed rounded-full flex items-center justify-center transition-colors-all duration-500 ${isObjectiveStage ? 'border-orange-500/30' : 'border-blue-500/30'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-10 h-10 transition-colors duration-500 ${isObjectiveStage ? 'text-orange-500' : 'text-blue-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/>
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="font-orbitron text-lg tracking-tighter uppercase">Protocolo de Treinamento v1.1</h2>
                <p className="max-w-xs text-sm">"Diga o que quer que o robô faça. Vou dizer onde você vai falhar."</p>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.type === 'objective' ? 'w-full' : ''}`}>
                {msg.role === 'user' ? (
                  <div className={`rounded-2xl px-4 py-3 shadow-lg ${msg.type === 'objective' ? 'bg-orange-900/40 border border-orange-500/50 text-orange-100 italic' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                    <p className="text-[10px] font-mono opacity-50 uppercase mb-1 tracking-widest">{msg.type === 'objective' ? 'OBJETIVO_INPUT' : 'ALG_INPUT'}</p>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ) : msg.evaluation ? (
                  <CircuitCard accent={msg.evaluation.status === AlgorithmStatus.SUCCESS ? 'green' : msg.evaluation.status === AlgorithmStatus.SYNTAX_ERROR ? 'yellow' : 'red'} title={`RELATÓRIO_TÉCNICO_${idx}`}>
                    <div className="flex justify-between items-start mb-4">
                      <StatusBadge status={msg.evaluation.status} />
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter">VEREDITO_IA</span>
                    </div>
                    <div className="space-y-4 text-sm">
                      <section>
                        <h4 className="font-orbitron text-[9px] text-gray-500 mb-1 tracking-widest uppercase">Diagnóstico do Bug</h4>
                        <p className="text-gray-200 font-mono text-xs">{msg.evaluation.codeAnalysis}</p>
                      </section>
                      {msg.evaluation.status !== AlgorithmStatus.SUCCESS && (
                        <section className="bg-black/30 p-3 rounded-lg border border-red-500/20 italic text-red-300">
                          <h4 className="font-orbitron text-[9px] text-red-500 mb-1 uppercase tracking-widest">Resultado do Teste Real</h4>
                          <p>"{msg.evaluation.disasterSimulation}"</p>
                        </section>
                      )}
                      <section className="bg-blue-900/10 p-3 rounded-lg border border-blue-500/20">
                        <h4 className="font-orbitron text-[9px] text-blue-400 mb-1 uppercase tracking-widest">Correção Necessária</h4>
                        <p className="text-blue-100 font-bold">{msg.evaluation.challenge}</p>
                      </section>
                    </div>
                  </CircuitCard>
                ) : (
                  <div className={`rounded-2xl px-4 py-3 border ${msg.type === 'system' ? 'bg-black/40 border-blue-500/20 text-blue-300 italic' : 'bg-gray-800 border-gray-700 text-gray-200'} rounded-tl-none`}>
                    <p className="text-[10px] font-mono opacity-50 mb-1 uppercase tracking-widest tracking-tighter">SISTEMA_MSG</p>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 bg-black/40 border border-blue-500/20 rounded-xl px-4 py-3 w-fit">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
              </div>
              <span className="text-[10px] font-mono text-blue-400 uppercase animate-pulse">Debugando Lógica...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="relative group mt-auto">
          <div className={`absolute -inset-1 rounded-2xl blur opacity-10 group-focus-within:opacity-80 transition duration-500 ${isObjectiveStage ? 'bg-gradient-to-r from-orange-600 via-orange-400 to-red-600 animate-cyber-pulse-orange' : 'bg-gradient-to-r from-blue-600 via-blue-400 to-purple-600 animate-cyber-pulse-blue'}`}></div>
          
          <div className={`relative bg-[#1a1a20] rounded-2xl p-2 flex flex-col md:flex-row gap-2 border border-white/10 shadow-2xl transition-all duration-300 ${isObjectiveStage ? 'focus-within-glow-orange' : 'focus-within-glow-blue'}`}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isObjectiveStage ? ">>> TAREFA ALVO: Digite a missão do robô..." : ">>> SEQUÊNCIA LÓGICA: Digite o algoritmo..."}
              className={`flex-grow bg-transparent text-gray-100 p-4 rounded-xl focus:outline-none resize-none min-h-[80px] md:h-20 font-mono text-sm transition-colors duration-300 ${isObjectiveStage ? 'placeholder:text-orange-500/50' : 'placeholder:text-blue-500/50'}`}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className={`h-20 md:px-8 font-orbitron font-bold rounded-xl transition-all flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 group-focus-within:scale-[1.02] ${
                isLoading 
                  ? 'bg-gray-800 text-gray-600' 
                  : !input.trim() 
                    ? 'bg-gray-800 text-gray-600' 
                    : isObjectiveStage 
                      ? 'bg-orange-500 hover:bg-orange-400 text-black group-focus-within:shadow-[0_0_20px_rgba(249,115,22,0.5)]' 
                      : 'bg-blue-500 hover:bg-blue-400 text-black group-focus-within:shadow-[0_0_20px_rgba(59,130,246,0.5)]'
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  <span className="text-[9px] tracking-widest uppercase">{isObjectiveStage ? 'ENVIAR' : 'ANALISAR'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <footer className="mt-6 opacity-30 text-[9px] font-mono uppercase tracking-[0.5em] text-center">
        Diagnóstico Lógico v1.2 // Foco em Erros Críticos
      </footer>
    </div>
  );
};

export default App;
