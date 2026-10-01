# Roteirista Shorts Cristão — Agent Pro

Sistema prático e elegante para criadores de YouTube Shorts devocionais cristãos, baseado nas regras estritas de 4 passos do Agente:
1. **Passo 1 — Criação das Falas (Roteiro):** 5 blocos estritamente calibrados (14 a 20 palavras cada) com progressão emocional fixa (Gancho, Identificação, Ensinamento, Convite à reflexão, Encerramento com CTA suave). Blocos 1 a 4 terminam com reticências (...), e o bloco 5 com ponto final ou pergunta.
2. **Passo 2 — Criação do Título e Descrição:** 2 opções de títulos impactantes (até 60 caracteres), descrição estruturada em 3 partes (Gancho até 120 caracteres, Reflexão até 300 caracteres com referência bíblica, Chamada para Ação até 200 caracteres) e 5 a 8 hashtags em 3 níveis.
3. **Pausa & Seleção da Foto:** Pausa obrigatória para seleção da foto de referência salva na pasta do Google Drive antes de avançar.
4. **Passo 3 — Prompts de Imagem (Imagen 4 / Google Flow):** Confirmação visual em português, bloco fixo de personagem em inglês mantido nos 5 prompts, enquadramento peito para cima, lente 85mm simulada, iluminação cinematográfica e tom emocional conectado à respectiva fala.
5. **Passo 4 — Prompts de Vídeo (VEO / Google Flow):** Cenas de 8 segundos, pessoa olhando diretamente para a câmera, microexpressões naturais, tag de fala `says in Brazilian Portuguese: "..."` e orientação de continuidade.

---

## Links Compartilhados do Google Drive
- **Arquivo MENSAGENS:** [https://docs.google.com/document/d/1Z3UOlxleRT5CNEN6GuDs1P425AxEk9XgU-f3Emb25vg/edit?usp=drive_link](https://docs.google.com/document/d/1Z3UOlxleRT5CNEN6GuDs1P425AxEk9XgU-f3Emb25vg/edit?usp=drive_link)
- **Pasta fotos:** [https://drive.google.com/drive/folders/1AWmLJg5bIdLsDTcHJKJGwS8PpDW_BBIA?usp=drive_link](https://drive.google.com/drive/folders/1AWmLJg5bIdLsDTcHJKJGwS8PpDW_BBIA?usp=drive_link)

---

## Como Rodar Localmente

1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd roteirista-shorts-cristao
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o arquivo `.env` na raiz do projeto:
```env
GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
O sistema estará acessível em `http://localhost:3000`.

---

## Como Hospedar no GitHub e no Vercel

### 1. No GitHub
1. Crie um novo repositório no seu GitHub (ex.: `roteirista-shorts-cristao`).
2. Conecte o seu repositório local e envie o código:
```bash
git init
git add .
git commit -m "feat: Roteirista Shorts Cristão sistema completo"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/roteirista-shorts-cristao.git
git push -u origin main
```

### 2. No Vercel
1. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
2. Clique em **"Add New Project"** e importe o repositório `roteirista-shorts-cristao`.
3. O Vercel detectará automaticamente a configuração do Vite e o arquivo `vercel.json`.
4. Em **"Environment Variables"**, adicione:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Sua chave da API do Gemini (Google AI Studio)
5. Clique em **"Deploy"**.

A aplicação funcionará automaticamente com a função serverless em `api/generate.ts` integrada com o frontend!
