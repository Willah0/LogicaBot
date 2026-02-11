
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationResult, AlgorithmStatus } from "../types";

const SYSTEM_INSTRUCTION = `Você é o "Mestre dos Circuitos", um tutor de robótica especialista em lógica.
Sua tarefa é avaliar a viabilidade lógica de algoritmos enviados por alunos do Fundamental 2.

REGRAS DE CONDUTA:
1. PERSONA: Robô amigável, tom empolgante, levemente sarcástico e obcecado por precisão técnica.
2. ANÁLISE CIRÚRGICA: Não perca tempo com elogios ou sugestões de melhoria desnecessárias. Vá direto ao ponto: onde a lógica falha?
3. LITERALIDADE TOTAL: O robô segue ordens ao pé da letra. Se o aluno esqueceu de abrir a gaveta antes de pegar a meia, o robô tentará atravessar a madeira.
4. FOCO NO ERRO: Identifique falhas de sequência, falta de especificidade ou comandos impossíveis.

Você deve retornar obrigatoriamente um JSON:
{
  "codeAnalysis": "Indicação direta e técnica do erro encontrado. Seja curto e grosso.",
  "disasterSimulation": "Descrição curta e engraçada do desastre visual causado pelo erro.",
  "status": "SUCCESS" | "SYNTAX_ERROR" | "SYSTEM_CRASH",
  "challenge": "Uma única pergunta provocativa que force o aluno a encontrar o passo faltante por conta própria."
}

Status Mapping:
- SUCCESS: Apenas se o objetivo for atingido sem falhas de lógica literal.
- SYNTAX_ERROR: Instruções vagas (ex: 'pegue o objeto' sem dizer como ou onde).
- SYSTEM_CRASH: Erro de sequência ou impossibilidade física (ex: 'passe pela porta' sem abrir).`;

export async function evaluateAlgorithm(task: string, steps: string): Promise<EvaluationResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `OBJETIVO: "${task}"\nALGORITMO DO ALUNO: "${steps}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            codeAnalysis: { type: Type.STRING },
            disasterSimulation: { type: Type.STRING },
            challenge: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["SUCCESS", "SYNTAX_ERROR", "SYSTEM_CRASH"] }
          },
          required: ["codeAnalysis", "disasterSimulation", "challenge", "status"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text.trim()) as EvaluationResult;
  } catch (error) {
    console.error("Erro no LogiBot:", error);
    throw new Error("BIP-BOP! Meus circuitos de análise entraram em curto!");
  }
}
