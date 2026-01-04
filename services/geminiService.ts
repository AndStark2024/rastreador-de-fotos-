
import { GoogleGenAI, Type } from "@google/genai";
import { ImageFile, MatchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const compareImages = async (
  targetImage: string,
  candidateImages: ImageFile[]
): Promise<MatchResult[]> => {
  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING, description: "O ID da imagem candidata" },
        similarityScore: { type: Type.NUMBER, description: "Pontuação de 0 a 100 baseada na similaridade" },
        reason: { type: Type.STRING, description: "Explicação curta do porquê a imagem corresponde, em português brasileiro" }
      },
      required: ["id", "similarityScore", "reason"]
    }
  };

  try {
    const targetMimeType = targetImage.split(';')[0].split(':')[1] || "image/jpeg";
    const targetData = targetImage.split(',')[1] || targetImage;

    const targetPart = {
      inlineData: {
        mimeType: targetMimeType,
        data: targetData
      }
    };

    const candidateParts = candidateImages.map(img => {
      const mimeType = img.data.split(';')[0].split(':')[1] || "image/jpeg";
      const data = img.data.split(',')[1] || img.data;
      return {
        inlineData: {
          mimeType,
          data
        }
      };
    });

    const textPart = {
      text: `Analise a imagem alvo fornecida e compare-a com as ${candidateImages.length} imagens candidatas fornecidas sequencialmente. 
             Identifique quais imagens candidatas mostram a mesma pessoa, objeto, cenário ou conteúdo visual muito semelhante.
             Retorne um array JSON de objetos de correspondência para os melhores candidatos com uma pontuação de similaridade superior a 40.
             IMPORTANTE: O campo 'reason' deve estar obrigatoriamente em português brasileiro.
             Mapeamento de IDs dos candidatos em ordem: ${candidateImages.map((c, i) => `Imagem ${i+1}: ${c.id}`).join(', ')}`
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { 
        parts: [targetPart, ...candidateParts, textPart] 
      },
      config: {
        responseMimeType: "application/json",
        responseSchema
      }
    });

    const text = response.text;
    if (!text) {
      return [];
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return [];
  }
};
