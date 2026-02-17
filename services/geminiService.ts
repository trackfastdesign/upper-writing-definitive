
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { RepurposedContent } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Chave API não configurada.");
  return new GoogleGenAI({ apiKey });
};

// Utilitário para extrair dados limpos de Base64
const parseBase64 = (base64String: string) => {
  if (base64String.includes(',')) {
    const [header, data] = base64String.split(',');
    const mimeType = header.split(';')[0].split(':')[1];
    return { mimeType, data };
  }
  return { mimeType: 'image/jpeg', data: base64String };
};

export const refineImagePrompt = async (prompt: string): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Melhore tecnicamente este prompt para geração de imagem realista: "${prompt}"`,
      config: {
        systemInstruction: "Seja técnico, visual e descritivo. Responda APENAS com o novo prompt melhorado.",
        temperature: 0.7,
      }
    });
    return response.text || prompt;
  } catch (error) { return prompt; }
};

export const generateImage = async (prompt: string, aspectRatio: '1:1' | '16:9' | '9:16' = '1:1'): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: { numberOfImages: 1, aspectRatio, outputMimeType: 'image/jpeg' },
    });
    return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
  } catch (error) { throw error; }
};

export const extractTextFromImage = async (base64Image: string): Promise<string> => {
  const ai = getClient();
  const { mimeType, data } = parseBase64(base64Image);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType, data } },
          { text: "Extraia todo o texto literal visível nesta imagem. Preserve a quebra de linha se possível. Se não houver texto, responda 'Nenhum texto detectado'." }
        ]
      }
    });
    return response.text || "Nenhum texto detectado.";
  } catch (error) { throw error; }
};

export const cleanImageText = async (base64Image: string): Promise<string> => {
  const ai = getClient();
  const { mimeType, data } = parseBase64(base64Image);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType, data } },
          { text: "CRITICAL: Remove ALL text, logos, and overlays from this image. Reconstruct the background behind the text perfectly using context. The output must be ONLY the cleaned image." }
        ]
      }
    });
    
    let aiMessage = "";
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      if (part.text) aiMessage += part.text;
    }
    throw new Error(aiMessage || "A IA não conseguiu processar a limpeza desta imagem específica.");
  } catch (error) { throw error; }
};

export const generateVideo = async (prompt: string, onStatus: (status: string) => void): Promise<string> => {
  const ai = getClient();
  onStatus("Iniciando motor de vídeo Veo...");
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic high quality footage: ${prompt}`,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
    while (!operation.done) {
      onStatus("Renderizando frames (Veo 3.1)...");
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await ai.operations.getVideosOperation({ operation });
    }
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) { throw error; }
};

export const searchGrounding = async (query: string) => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: { tools: [{ googleSearch: {} }] },
    });
    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || "Fonte externa",
        uri: chunk.web?.uri || "#"
      })) || []
    };
  } catch (error) { throw error; }
};

export const generateCreativeContent = async (prompt: string, systemInstruction: string, onChunk: (text: string) => void) => {
  const ai = getClient();
  try {
    const streamResponse = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: `${systemInstruction} Responda sempre em Português do Brasil.`,
        temperature: 0.8
      },
    });
    let fullText = "";
    for await (const chunk of streamResponse) {
      const chunkText = (chunk as GenerateContentResponse).text || "";
      fullText += chunkText;
      onChunk(fullText);
    }
    return fullText;
  } catch (error) { throw error; }
};

export const repurposeContent = async (sourceText: string): Promise<RepurposedContent> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transforme o seguinte texto em formatos otimizados para redes sociais: "${sourceText}"`,
      config: {
        systemInstruction: "Você é um Social Media Manager. Extraia o valor máximo do texto para cada rede especificada. Retorne JSON válido seguindo o schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            twitterThread: { type: Type.ARRAY, items: { type: Type.STRING } },
            instagramCaption: { type: Type.STRING },
            youtubeShortsScript: { type: Type.STRING },
            linkedInSummary: { type: Type.STRING }
          },
          required: ["twitterThread", "instagramCaption", "youtubeShortsScript", "linkedInSummary"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { throw error; }
};

export const analyzeContent = async (content: string): Promise<any> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise editorialmente este texto e sugira melhorias: "${content}"`,
      config: {
        systemInstruction: "Você é um editor sênior. Forneça análise crítica e construtiva. Retorne em JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titles: { type: Type.ARRAY, items: { type: Type.STRING } },
            metaDescription: { type: Type.STRING },
            toneOfVoice: { type: Type.STRING },
            factCheck: { type: Type.STRING },
            suggestions: { type: Type.STRING }
          },
          required: ["titles", "metaDescription", "toneOfVoice", "factCheck", "suggestions"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { throw error; }
};
