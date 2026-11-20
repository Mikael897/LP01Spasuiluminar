# SpaSu Iluminar — Landing page

## Como rodar
1. Instale o Node.js (versão LTS): https://nodejs.org
2. Abra esta pasta no VS Code e, no terminal (Terminal > Novo Terminal), rode:

   npm install
   npm run dev

3. Abra o endereço que aparecer (normalmente http://localhost:5173).

## Personalizar (arquivo src/SpaSuIluminar.jsx, no topo)
- WHATSAPP: troque pelo número, só dígitos (ex.: 5551999999999).
- IMAGES: coloque as fotos em public/img/ e use o caminho, ex.: hero: "/img/hero.jpg".

## Publicar
npm run build  -> gera a pasta dist, pronta para Vercel, Netlify etc.
