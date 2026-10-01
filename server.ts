import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side initialization of Gemini API per skill guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Resilient Gemini Content Generation with Instant Fallback on 503/429
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateWithRetryAndFallback(params: {
  contents: any;
  config?: any;
}) {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Generating with model: ${model} (attempt ${attempt})...`);
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        console.log(`Success with model: ${model}`);
        return response;
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const errCause = err?.cause ? ` (cause: ${err.cause.message || err.cause})` : '';
        console.warn(`Model ${model} attempt ${attempt} failed with: ${errMsg}${errCause}.`);

        // If client-side bad request (invalid argument / content policy), don't retry same input
        if (errMsg.includes('INVALID_ARGUMENT') || errMsg.includes('400')) {
          throw err;
        }

        // Brief delay before retry or fallback
        await sleep(400 * attempt);
      }
    }
  }

  throw lastError;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasKey: !!apiKey });
});

// STEP 1 & STEP 2: Criação das Falas (5 blocos, 14-20 palavras) + Título e Descrição
app.post('/api/generate-step-1-2', async (req, res) => {
  try {
    const {
      messageText,
      messageNumber,
      biblicalReference,
      creativeAngle,
      variationIndex = 1,
    } = req.body;

    if (!messageText || typeof messageText !== 'string' || messageText.trim().length === 0) {
      return res.status(400).json({ error: 'Texto da mensagem é obrigatório.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'Chave GEMINI_API_KEY não configurada no servidor. Verifique o arquivo .env ou Secrets.',
      });
    }

    // Creative variation angles to guarantee variety
    const ANGLES = [
      'Pergunta Direta e Provocativa (gancho com pergunta visceral que faz a pessoa parar no feed)',
      'Revelação Espiritual e Quebra de Paradoxo (mostra que Deus age de forma contrária à lógica do mundo)',
      'Acolhimento Íntimo e Voz Paternal (tom caloroso, íntimo, que acolhe a dor e convida ao recomeço)',
      'Metáfora Poética e Contraste Emocional (usa imagens fortes de luz/escuridão, tempestade/porto, espera/colheita)',
      'Afirmação Contundente de Esperança (frase de impacto com autoridade e fé inabalável)',
    ];

    const selectedAngle =
      creativeAngle && creativeAngle !== 'auto'
        ? creativeAngle
        : ANGLES[((variationIndex - 1) % ANGLES.length + Math.floor(Math.random() * ANGLES.length)) % ANGLES.length];

    const randomSeed = Math.floor(Math.random() * 100000);

    const prompt = `
Você é um roteirista e diretor especializado em vídeos curtos (Shorts) devocionais cristãos.
Siga rigorosamente as instruções para executar o PASSO 1 e automaticamente o PASSO 2.

MENSAGEM DE ENTRADA DO USUÁRIO (Mensagem #${messageNumber || 'Personalizada'}):
"""
${messageText.trim()}
"""
${biblicalReference ? `Referência Bíblica associada: ${biblicalReference}` : ''}

DIRETRIZ DE VARIAÇÃO CRIATIVA (OBRIGATÓRIO):
- Esta é a VARIAÇÃO CRIATIVA #${variationIndex}.
- ÂNGULO CRIATIVO ESCOLHIDO PARA ESTA VARIAÇÃO: "${selectedAngle}".
- Crie uma versão FRESCA, INÉDITA, TOTALMENTE DIFERENTE de formulações clichês ou anteriores.
- Varie totalmente a estrutura do Gancho (Bloco 1), o tom das metáforas e a formulação do CTA suave (Bloco 5).
- Cada vez que este texto for enviado, sua missão é entregar uma nova joia devocional, profunda, poética e ainda mais emocionante!

REGRAS ESTRITAS DO PASSO 1 — CRIAÇÃO DAS FALAS:
1. Crie exatamente 5 blocos de fala, em português (Brasil), falando com "você", tom acolhedor, amoroso, íntimo, espiritual, humano e carismático.
2. NUNCA cite versículos como citação bíblica literal nem apresente o texto como fala histórica de Jesus.
3. Se o tema tocar em "muitos são chamados, mas poucos serão escolhidos", transmita: Deus convida com amor e graça, não basta ouvir o chamado mas responder com fé sincera, arrependimento e vida transformada, sem condenação ou medo.
4. PROGRESSÃO EMOCIONAL DOS 5 BLOCOS:
   - Bloco 1 (Gancho): capta atenção nos primeiros segundos, com afirmação, pergunta direta ou revelação baseada no ângulo "${selectedAngle}".
   - Bloco 2 (Identificação): a pessoa se reconhece na situação ou no sentimento.
   - Bloco 3 (Ensinamento): a mensagem espiritual central, com clareza.
   - Bloco 4 (Convite à reflexão): provoca a pessoa a pensar sobre sua própria vida.
   - Bloco 5 (Encerramento com convite emocional): fecha com esperança e um chamado suave à ação (ex: variar entre "Compartilhe com alguém que precisa ouvir isso hoje.", "Guarde esse vídeo para reler quando precisar lembrar disso.", "Se essa palavra tocou você, deixe aqui embaixo o que sentiu."). NUNCA use a palavra "digite".
5. REGRAS DE EXTENSÃO E PONTUAÇÃO (CRÍTICAS):
   - CADA BLOCO DEVE TER ENTRE 14 E 20 PALAVRAS. NENHUM BLOCO PODE ULTRAPASSAR 20 PALAVRAS!
   - Blocos 1 a 4 TERMINAM OBRIGATORIAMENTE COM RETICÊNCIAS (...).
   - O Bloco 5 TERMINA OBRIGATORIAMENTE COM PONTO FINAL OU PERGUNTA (. ou ?), NUNCA COM RETICÊNCIAS.
   - Evite: "Oi pessoal", apresentações longas, promessas de prosperidade/cura garantida, culpa ou medo.

REGRAS ESTRITAS DO PASSO 2 — TÍTULO E DESCRIÇÃO:
1. Títulos: sugira 2 opções de títulos impactantes e reflexivos, com no máximo 60 caracteres cada. Coloque a palavra-chave e o gancho principal logo no início.
2. Descrição estruturada em 3 partes:
   - Gancho: até 120 caracteres na primeira linha, frase de impacto com linguagem forte do nicho cristão.
   - Reflexão: até 300 caracteres, tom acolhedor e edificante. Cite a referência bíblica se aplicável.
   - Chamada para ação: até 200 caracteres, convite amigável para compartilhar, se inscrever, comentar e curtir.
3. Hashtags: 5 a 8 hashtags curtas e limpas (ex: #Jesus, #Fe, #Devocional, #Paz, #Shorts - nunca concatenar frases longas em uma hashtag) organizadas em 3 níveis (2 a 3 específicas do vídeo, 2 a 3 específicas do nicho cristão, 1 a 2 gerais incluindo #Shorts). As 3 primeiras serão as mais relevantes.
`;

    const response = await generateWithRetryAndFallback({
      contents: prompt,
      config: {
        systemInstruction:
          'Você é o AGENTE ROTEIRISTA E DIRETOR DE SHORTS CRISTÃOS. Entregue variações criativas originais a cada execução, respeitando rigorosamente a contagem de 14 a 20 palavras por fala.',
        temperature: 1.0,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            step1: {
              type: Type.OBJECT,
              properties: {
                falas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      index: { type: Type.INTEGER },
                      name: { type: Type.STRING },
                      text: { type: Type.STRING },
                    },
                    required: ['index', 'name', 'text'],
                  },
                },
              },
              required: ['falas'],
            },
            step2: {
              type: Type.OBJECT,
              properties: {
                title1: { type: Type.STRING },
                title2: { type: Type.STRING },
                hookDescription: { type: Type.STRING },
                reflectionDescription: { type: Type.STRING },
                ctaDescription: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'title1',
                'title2',
                'hookDescription',
                'reflectionDescription',
                'ctaDescription',
                'hashtags',
              ],
            },
          },
          required: ['step1', 'step2'],
        },
      },
    });

    const rawResponse = response.text || '{}';
    const parsedData = JSON.parse(rawResponse);

    // Process and validate word counts & endings
    const processedFalas = (parsedData.step1?.falas || []).map((fala: any, idx: number) => {
      let text = (fala.text || '').trim();
      const isLast = idx === 4;

      // Fix ending punctuation if needed
      if (!isLast) {
        if (!text.endsWith('...')) {
          text = text.replace(/[\.\?\!]+$/, '') + '...';
        }
      } else {
        if (text.endsWith('...')) {
          text = text.replace(/\.{3}$/, '.');
        } else if (!/[\.\?\!]$/.test(text)) {
          text = text + '.';
        }
      }

      const words = text.split(/\s+/).filter(Boolean);
      const wordCount = words.length;

      const roles = [
        'Gancho',
        'Identificação',
        'Ensinamento',
        'Convite à reflexão',
        'Encerramento com convite emocional',
      ] as const;

      return {
        index: idx + 1,
        name: roles[idx] || fala.name || `Fala ${idx + 1}`,
        text: text,
        wordCount: wordCount,
        isValidLength: wordCount >= 14 && wordCount <= 20,
        endsCorrectly: !isLast ? text.endsWith('...') : /[\.\?]$/.test(text),
      };
    });

    const step1Data = {
      falas: processedFalas,
      rawText: processedFalas.map((f: any) => `Fala ${f.index}:\n${f.text}`).join('\n\n'),
      messageConfirmedText: messageText.trim(),
      messageNumber: messageNumber,
      creativeAngle: selectedAngle,
      variationIndex: Number(variationIndex) || 1,
    };

    const step2Data = {
      title1: parsedData.step2?.title1 || '',
      title2: parsedData.step2?.title2 || '',
      hookDescription: parsedData.step2?.hookDescription || '',
      reflectionDescription: parsedData.step2?.reflectionDescription || '',
      ctaDescription: parsedData.step2?.ctaDescription || '',
      hashtags: parsedData.step2?.hashtags || [],
      rawFormattedText: `TÍTULO 1:\n${parsedData.step2?.title1}\n\nTÍTULO 2:\n${parsedData.step2?.title2}\n\nDESCRIÇÃO:\n${parsedData.step2?.hookDescription}\n${parsedData.step2?.reflectionDescription}\n${parsedData.step2?.ctaDescription}\n\nHASHTAGS:\n${(parsedData.step2?.hashtags || []).join(' ')}`,
    };

    res.json({
      success: true,
      step1: step1Data,
      step2: step2Data,
    });
  } catch (error: any) {
    console.error('Error generating Step 1 & 2:', error);
    res.status(500).json({ error: error.message || 'Erro ao gerar Passo 1 e Passo 2' });
  }
});

// STEP 3: Criação dos Prompts de Imagem (Imagen 4 / Google Flow)
app.post('/api/generate-step-3', async (req, res) => {
  try {
    const { falas, photoReference } = req.body;

    if (!falas || !Array.isArray(falas) || falas.length < 5) {
      return res.status(400).json({ error: 'As 5 falas do Passo 1 são obrigatórias.' });
    }

    if (!photoReference) {
      return res.status(400).json({ error: 'Os dados da foto de referência são obrigatórios.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'Chave GEMINI_API_KEY não configurada no servidor.',
      });
    }

    const prompt = `
Você atua como um Engenheiro de Prompts especializado em geração de imagens foto realistas para o nicho devocional cristão, com domínio total da linguagem do Imagen 4 do Google Flow.

FOTO DE REFERÊNCIA SELECIONADA:
- Número da Foto: ${photoReference.number}
- Nome: ${photoReference.name}
- Idade aparente: ${photoReference.apparentAge}
- Tom de pele: ${photoReference.skinTone}
- Cabelo: ${photoReference.hair}
- Expressão: ${photoReference.expression}
- Roupa: ${photoReference.clothing}
- Iluminação e Cenário: ${photoReference.lighting} | ${photoReference.scene}
- Descrição fixa em inglês pré-existente (base): "${photoReference.characterDescriptionEn}"

AS 5 FALAS DO PASSO 1:
${falas.map((f: any) => `Fala ${f.index}: "${f.text}"`).join('\n')}

TAREFAS E REGRAS ESTRITAS DO PASSO 3:
1. Monte em português uma breve confirmação visual da foto encontrada (para exibição em blockquote/destaque).
2. Bloco fixo de personagem (em inglês): com base na foto, monte a descrição exata de idade aparente, tom de pele, cabelo, expressão natural, roupas e cores. Use EXATAMENTE essa mesma descrição em todos os 5 prompts de imagem para consistência absoluta.
3. Estrutura de cada um dos 5 prompts (EM INGLÊS):
   Cada prompt deve conter, nesta ordem:
   - Consistência com a referência: instrução para manter a aparência da pessoa da imagem de referência (rosto, expressão, tom de pele, cabelo, roupa).
   - Enquadramento: plano médio (peito para cima - medium close-up / chest up), pessoa olhando diretamente para a câmera, câmera na altura dos olhos.
   - Cenário e iluminação: ambiente inspirado na foto de referência, com iluminação cinematográfica específica (direção de luz, temperatura de cor ex: warm golden hour light, cool soft rim light, shallow depth of field, f/1.8 bokeh).
   - Estilo visual: fotorrealismo de alta qualidade, lente 85mm simulada, textura natural e nítida de pele, sem aparência de IA gerada.
   - Tom emocional conectado à fala:
     * Imagem 1: serious and strong expression, direct and intriguing gaze, dramatic moody lighting.
     * Imagem 2: slightly more open expression, beginning of welcoming warmth, light softening.
     * Imagem 3: serene and teaching expression, sense of depth and spiritual presence.
     * Imagem 4: reflective expression, subtle emotional pause, warm intimate light.
     * Imagem 5: expression of hope, lightness, subtle gentle smile or peace in the eyes, open welcoming light.
   - Formato: vertical 9:16, alta resolução, sem texto na imagem, sem logotipo, sem marca d'água.
   - Evitar: olhar desviado da câmera, fundo poluído, mãos ou rosto deformados, aura, brilho sobrenatural, texto na cena, aparência artificial.
4. Para cada imagem, indique a Fala correspondente sem reticências.
`;

    const response = await generateWithRetryAndFallback({
      contents: prompt,
      config: {
        systemInstruction:
          'Você é o ENGENHEIRO DE PROMPTS IMAGEN 4 / GOOGLE FLOW para nicho devocional cristão. Prompts sempre em inglês cinematográfico ultra detalhado.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confirmedPhotoDescription: { type: Type.STRING },
            characterBlockFixed: { type: Type.STRING },
            imagePrompts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  index: { type: Type.INTEGER },
                  prompt: { type: Type.STRING },
                  correspondingFala: { type: Type.STRING },
                  emotionalProgression: { type: Type.STRING },
                },
                required: ['index', 'prompt', 'correspondingFala', 'emotionalProgression'],
              },
            },
          },
          required: ['confirmedPhotoDescription', 'characterBlockFixed', 'imagePrompts'],
        },
      },
    });

    const rawResponse = response.text || '{}';
    const parsedData = JSON.parse(rawResponse);

    const step3Data = {
      confirmedPhotoDescription:
        parsedData.confirmedPhotoDescription || photoReference.confirmationDescription,
      characterBlockFixed:
        parsedData.characterBlockFixed || photoReference.characterDescriptionEn,
      imagePrompts: parsedData.imagePrompts || [],
      photoReferenceNumber: photoReference.number,
      photoReference: photoReference,
      rawFormattedText: (parsedData.imagePrompts || [])
        .map(
          (item: any) =>
            `Imagem ${item.index}:\n${item.prompt}\nFala correspondente: "${item.correspondingFala}"`
        )
        .join('\n\n'),
    };

    res.json({
      success: true,
      step3: step3Data,
    });
  } catch (error: any) {
    console.error('Error generating Step 3:', error);
    res.status(500).json({ error: error.message || 'Erro ao gerar Passo 3' });
  }
});

// STEP 4: Criação dos Prompts de Vídeo (VEO / Google Flow)
app.post('/api/generate-step-4', async (req, res) => {
  try {
    const { falas, characterBlockFixed, photoReference } = req.body;

    if (!falas || !Array.isArray(falas) || falas.length < 5) {
      return res.status(400).json({ error: 'As 5 falas do Passo 1 são obrigatórias.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'Chave GEMINI_API_KEY não configurada no servidor.',
      });
    }

    const effectiveCharacterBlock =
      characterBlockFixed ||
      photoReference?.characterDescriptionEn ||
      'A contemplative narrator looking directly into the camera lens with warm and sincere eyes';

    const prompt = `
Você atua como um Filmmaker Profissional especializado em minivídeos curtos, reflexivos e emocionais, com realismo natural e estética de alto nível para VEO / Google Flow.
Você é um assistente estritamente textual. Entregue apenas os prompts em texto (em inglês), detalhando enquadramento, iluminação, cenário, ação, estilo da fala e restrições de áudio.

DADOS DE ENTRADA:
- Bloco fixo de personagem (reutilize palavra por palavra em inglês): "${effectiveCharacterBlock}"
- Cenário da foto: ${photoReference?.scene || 'warm natural intimate rustic background with soft bokeh'}
- Iluminação da foto: ${photoReference?.lighting || 'soft warm golden hour natural light'}
- As 5 falas em português:
${falas.map((f: any) => `Cena ${f.index}: "${f.text.replace(/\.+$/, '')}"`).join('\n')}

REGRAS CENTRAIS DOS PROMPTS DE VÍDEO (OBRIGATÓRIAS):
1. Pessoa falando naturalmente para a câmera: todas as 5 cenas de vídeo devem mostrar a mesma pessoa da foto de referência, sozinha, OLHANDO DIRETAMENTE PARA A CÂMERA, como se estivesse falando com quem assiste. Sem cortes, sem mudança de ângulo.
2. Contato visual direto e constante com a lente.
3. Enquadramento fixo em plano médio (peito para cima), câmera na altura dos olhos.
4. Microexpressões naturais: piscadas, leve movimento de cabeça, lábios perfeitamente sincronizados com a fala em português.
5. Câmera estática ou com um levíssimo slow push-in. Sem pan, sem orbit.
6. Progressão emocional entre as cenas:
   - Cena 1: mais reflexiva, serena e intrigante.
   - Cenas 2, 3 e 4: gradualmente mais próximas, calorosas e acolhedoras.
   - Cena 5: serena, cheia de paz e leve esperança no olhar.

7. REGRA OBRIGATÓRIA PARA A INSTRUÇÃO DAS FALAS (EM INGLÊS):
   - Na CENA 1:
     "The man speaks in Brazilian Portuguese with a serene, warm, and friendly voice: \"[texto da fala 1]\"."
   - Da CENA 2 EM DIANTE (Cenas 2, 3, 4 e 5):
     "The man continues with his serene, warm, and friendly voice speaking in Brazilian Portuguese: \"[texto da fala correspondente]\"."

8. REGRA OBRIGATÓRIA DE RESTRIÇÕES (EVITE - NÃO COLOQUE MÚSICA, NÃO COLOQUE LEGENDA):
   - Em TODAS as 5 cenas, inclua obrigatoriamente ao final do prompt:
     "Constraints: No background music, no musical score, no soundtrack, no subtitles, no captions, no on-screen text, no text overlays. Pure clean spoken dialogue only with subtle natural ambient room tone."
`;

    const response = await generateWithRetryAndFallback({
      contents: prompt,
      config: {
        systemInstruction:
          'Você é o FILMMAKER PROFISSIONAL PARA VEO / GOOGLE FLOW. Siga rigorosamente as instruções da voz do homem (serena, acolhedora e amigável na cena 1, e "continua com sua voz serena e amigável" da cena 2 em diante) e a proibição explícita de música e legendas.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            videoPrompts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  index: { type: Type.INTEGER },
                  prompt: { type: Type.STRING },
                  spokenPortuguese: { type: Type.STRING },
                  sceneTone: { type: Type.STRING },
                },
                required: ['index', 'prompt', 'spokenPortuguese', 'sceneTone'],
              },
            },
          },
          required: ['videoPrompts'],
        },
      },
    });

    const rawResponse = response.text || '{}';
    const parsedData = JSON.parse(rawResponse);

    // Post-process to ensure 100% adherence to the user's voice rules and negative constraints
    const processedVideoPrompts = (parsedData.videoPrompts || []).map((scene: any, idx: number) => {
      let promptText = (scene.prompt || '').trim();
      const correspondingFala = falas[idx]?.text?.replace(/\.+$/, '') || scene.spokenPortuguese || '';

      const voiceDirective =
        idx === 0
          ? `The man speaks in Brazilian Portuguese with a serene, warm, and friendly voice: "${correspondingFala}".`
          : `The man continues with his serene, warm, and friendly voice speaking in Brazilian Portuguese: "${correspondingFala}".`;

      const constraintsDirective =
        'Constraints: No background music, no musical score, no soundtrack, no subtitles, no captions, no on-screen text, no text overlays. Pure clean spoken dialogue only with subtle natural ambient room tone.';

      // Ensure spoken voice line adheres to pattern
      if (!promptText.toLowerCase().includes('serene') || !promptText.toLowerCase().includes('friendly')) {
        promptText = promptText.replace(/says in Brazilian Portuguese:[^.]+\./i, voiceDirective);
        if (!promptText.includes(voiceDirective)) {
          promptText += ` ${voiceDirective}`;
        }
      }

      // Ensure negative constraint is explicitly present
      if (!promptText.toLowerCase().includes('no background music') && !promptText.toLowerCase().includes('no musical score')) {
        promptText += ` ${constraintsDirective}`;
      } else if (!promptText.toLowerCase().includes('no subtitles') && !promptText.toLowerCase().includes('no captions')) {
        promptText += ' No subtitles, no captions, no on-screen text.';
      }

      return {
        index: idx + 1,
        prompt: promptText,
        spokenPortuguese: correspondingFala,
        sceneTone: scene.sceneTone || (idx === 0 ? 'Sereno e intrigante' : idx === 4 ? 'Sereno e esperançoso' : 'Acolhedor e amigável'),
      };
    });

    const step4Data = {
      videoPrompts: processedVideoPrompts,
      rawFormattedText: processedVideoPrompts
        .map((item: any) => `Cena ${item.index}:\n${item.prompt}`)
        .join('\n\n'),
    };

    res.json({
      success: true,
      step4: step4Data,
    });
  } catch (error: any) {
    console.error('Error generating Step 4:', error);
    res.status(500).json({ error: error.message || 'Erro ao gerar Passo 4' });
  }
});

// Setup Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
