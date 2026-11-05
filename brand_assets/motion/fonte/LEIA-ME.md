# Motion institucional Empilhatec — fonte

`index.html` é a animação (1920×1080, 30 fps, 37 s). Aberto no navegador, toca em loop; clique para recomeçar.
`render.mjs` grava quadro a quadro com o Chrome e monta o MP4 com o ffmpeg.

Os trechos do vídeo institucional (`clips/`) não ficam aqui. Para recriar, a partir de `public/videos/home-hero.mp4`:

    ffmpeg -ss 13.80 -t 1.70 -i home-hero.mp4 -vf fps=30 -q:v 3 clips/frota/%03d.jpg
    ffmpeg -ss 6.33  -t 2.05 -i home-hero.mp4 -vf fps=30 -q:v 3 clips/aperto/%03d.jpg

Renderizar (playwright-core e ffmpeg indicados por variável de ambiente):

    PW_CORE=<caminho>/playwright-core FFMPEG=<caminho>/ffmpeg node render.mjs . saida.mp4
