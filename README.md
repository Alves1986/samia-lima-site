# Samia Lima — Terapia Capilar de Alta Performance

Homepage institucional da Samia Lima, construída com React, Vite, TypeScript e Tailwind CSS. A interface segue a direção visual **Clínica Editorial**, com foco em terapia capilar, educação profissional e conversão para avaliação.

## Requisitos

- Node.js 20 ou superior
- pnpm 10 ou npm compatível

## Desenvolvimento local

```bash
pnpm install
pnpm dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Validação e build

```bash
pnpm check
pnpm build:vercel
```

O build frontend é gerado em `dist/public`, conforme definido em `vercel.json`. O comando `pnpm build` continua disponível para o ambiente completo do template Manus.

## Deploy na Vercel

Importe o repositório do GitHub na Vercel e mantenha as configurações abaixo:

| Configuração | Valor |
|---|---|
| Framework Preset | Vite |
| Build Command | `pnpm build:vercel` |
| Install Command | `pnpm install --frozen-lockfile` |
| Output Directory | `dist/public` |
| Root Directory | `.` |

O arquivo `vercel.json` já contém essas configurações e um rewrite para preservar a navegação da SPA. Não são necessárias variáveis de ambiente para a homepage atual. O formulário exibe uma confirmação local e deve ser conectado a um canal de atendimento antes do uso em produção.

## Assets

As imagens públicas utilizadas na interface estão referenciadas por URLs CDN estáveis, para que o deploy externo não dependa do proxy de armazenamento do Manus. Confirme a autorização de uso das fotos antes de publicar o site.

## Estrutura principal

- `client/src/pages/Home.tsx`: homepage e conteúdo da experiência.
- `client/src/index.css`: tokens, layout, responsividade e animações.
- `client/index.html`: metadados, título e fontes.
- `vercel.json`: configuração de build e roteamento para a Vercel.
