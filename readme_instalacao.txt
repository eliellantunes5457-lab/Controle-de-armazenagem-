Instruções rápidas para gerar o app instalável e instalar em dispositivos:

1) Teste localmente:
   - Recomendo subir a pasta no GitHub Pages (ou Netlify) para testes.
   - Para testes rápidos no celular, hospede os arquivos em um servidor (ex: GitHub Pages) e abra o link.

2) Gerar APK / empacotar (opcional):
   - Acesse https://www.pwabuilder.com
   - Clique em "Start" e carregue o arquivo ZIP (este arquivo).
   - Siga os passos para "Build My PWA" -> selecione Android.
   - PWABuilder criará o APK/AAB para você baixar.

3) Observações sobre funcionamento offline:
   - O app é preparado para trabalhar offline via service worker.
   - A geração de PDF depende da biblioteca jsPDF. Para garantir funcionamento offline immediate, faça um primeiro acesso online (com internet) para que o navegador baixe a biblioteca externa (se houver). 
   - Se desejar, eu posso embutir jsPDF e autotable diretamente no index.html (arquivo maior).

4) Instalação no celular (Android):
   - Abra o link no Chrome, toque em "Adicionar à tela inicial".
   - Ou instale o APK gerado.

5) Instalação no iPhone (Safari):
   - Abra o link no Safari, toque no ícone de compartilhar, escolha "Adicionar à Tela de Início".

