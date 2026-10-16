# Direção de arte de PokéPoly

Estética de RPG portátil e tabuleiro: pixel art para cenários, ícones vetoriais para funções, painéis com molduras e botões com profundidade. Paleta azul-noturno, violeta, coral, creme e dourado. Não usar verde.

## Ativos iniciais
- `assets/art/kanto-dusk.png`: cenário original gerado com a ferramenta integrada ImageGen, aplicado ao centro do tabuleiro.
- `src/icons.js`: ícones SVG de território, captura, centro Pokémon, carta, encontro, estação, Rocket, taxa e descanso.
- Territórios comprados recebem fundo e borda na cor do dono, além do símbolo de seu pino. O símbolo distingue propriedade sem depender apenas de cor.

## Regras de interação
A evolução exige propriedade do jogador atual, posição na casa e fase de resolução da chegada. Disponível no modal da própria casa. Consultar outro território não habilita evolução.

## Próximos ativos
Retratos e sprites por espécie, pinos ilustrados, dados próprios e arena. Sprites devem preservar identificação da espécie, estado de evolução e coerência de escala. O cenário atual é a primeira direção visual, não o mapa geográfico definitivo de Kanto.

## Prompt do cenário (ferramenta integrada, sem CLI)
Use case: stylized-concept. Asset type: background illustration for PokéPoly browser board game. Create a square polished pixel art aerial top-down Japanese monster-catching RPG town, reminiscent of classic Pokemon Kanto game maps. Tiny coral red roof healing center with white cross emblem, blue roof houses, stone paths, small pond, violet lavender trees, distant blue mountains. Strict palette navy blue, lavender purple, coral, cream and warm gold. Absolutely NO green, no green foliage. Nostalgic crisp pixel art, dusk with warm lit windows, rich coherent tile-based environment. Keep central 45 percent relatively calm dark blue cobblestone plaza for game title and dice overlay. Buildings and details concentrated toward outer edges. No text, no typography, no watermark. This is a scenic game background, not a screenshot of UI.

## Expansão visual e regiões
A identidade agora usa letreiro amarelo com contorno azul, molduras de RPG, caixa de controles inspirada no Pokégear e ícones vetoriais de itens reais do universo Pokémon. Não usar verde no tema. Formas originais dos Pokémon preservam suas próprias cores.

Novos ativos (ferramenta ImageGen integrada, sem CLI):
- `assets/art/johto-dusk.png`: Johto, cidade tradicional com torre e cerejeiras violetas.
- `assets/art/hoenn-coast.png`: Hoenn, cidade portuária com oceano e vulcão.
- `src/pins.js`: oito ícones SVG de Poké Bolas, insígnia e itens.

### Prompt Johto
Use case: stylized-concept. Asset: square pixel art Pokemon-inspired Johto Ecruteak town board game background. Top-down elevated map, violet cherry blossoms, traditional Japanese blue roof houses, distant tall pagoda tower, lanterns, calm dark navy central stone courtyard for UI overlay. Architectural details around outside, center relatively empty. Nostalgic handheld monster-catching RPG, crisp pixel art. Palette strictly navy, purple, coral, gold. NO green anywhere, NO text, no UI, no watermark.

### Prompt Hoenn
Use case: stylized-concept. Asset: square pixel art Pokemon-inspired Hoenn coastal port and volcanic island board game background. Top-down elevated coastal town, coral orange and blue rooftops, wooden docks and ships, navy ocean and purple wave highlights, distant volcano and meteor-shaped rocks. Large calm central dark blue stone plaza for overlaying game controls, details around perimeter. Classic handheld monster-catching RPG pixel art. Strict navy, violet, coral, sand cream, gold palette. No green, NO green foliage. No text, UI or watermark.

Atualização da regra de batalha: vitória paga 50% do aluguel total; não há mais isenção completa.

## Cartas Sorte e Revés
Ativos gerados com ImageGen integrada (sem CLI), usados no modal do encontro e na galeria do menu:
- `assets/cards/sorte.png`: descoberta com baú, esfera de captura e moedas; moldura dourada.
- `assets/cards/reves.png`: rua noturna com bicicleta, esferas espalhadas e raios; moldura coral.
A arte contém painel sem texto; títulos e efeitos são renderizados em HTML, mantendo leitura e acessibilidade.

Prompt Sorte: Create an original vertical 2:3 pixel art collectible board game card background. Lucky discovery in a cozy fantasy town at dusk: a glowing red and cream capture sphere resting on a small treasure chest with golden coins, warm star-shaped sparkles, violet blossom trees and blue rooftops around the edges. Charming handheld RPG aesthetic, crisp pixel art, decorative cream and gold card border. Top half richly illustrated, bottom half a calm empty deep navy panel for text that will be added by code. Palette navy, violet, coral, cream and gold, no green. No text, no lettering, no characters, no watermark.

Prompt Revés: Create an original vertical 2:3 pixel art collectible board game card background for a playful misfortune event. A blue and violet fantasy town at night under a theatrical coral lightning cloud, scattered capture spheres and an overturned bicycle basket on a stone path, wisps of lavender mist. No people or creatures. Charming handheld RPG aesthetic, crisp pixel art, decorative coral and silver card border. Top half illustrated, bottom half calm empty deep navy panel for text to be added later in code. Palette navy, violet, coral and cream, no green. No text, no lettering, no watermark, not scary.
