# Batalha em arena — direção para o PokéPoly

Referência examinada: `F:/Projetos/battle/pokemon-arena.html` (protótipo independente, 16/10/2026).

## O que aproveitar

- Arena 2D com movimento livre, dash, projéteis, colisão, vida e recarga.
- Duas habilidades com recargas próprias: golpe básico e habilidade especial.
- Controles de teclado (WASD/setas, J/K, Shift) e controles de toque.
- Efeitos de acerto, indicadores de dano e vida, com leitura clara do estado da luta.
- Simulação no host e envio de posições/efeitos para convidados, coerente com o host no navegador que o PokéPoly já usa.

## O que adaptar

O protótipo é um combate livre entre vários treinadores, com pontuação por nocaute e renascimento depois de três segundos. No tabuleiro, cada confronto precisa ser um **duelo 1 contra 1 com começo e fim**. Um nocaute encerra a luta; não há renascimento. Um limite de tempo curto impede que uma casa detenha a partida por muito tempo.

O atacante escolhe um Pokémon de um território que já capturou. A partida começa sem Pokémon inicial; antes da primeira captura, uma casa rival oferece apenas o pagamento do aluguel integral, e o Ataque Rocket oferece apenas a taxa integral da casa. O defensor é o Pokémon daquela casa, no nível de melhoria atual. No Ataque Rocket, o defensor vem da equipe Rocket da região.

As regras econômicas existentes continuam: vitória contra defensor paga 50% do aluguel total; derrota paga 150%. Contra a Rocket, vitória concede 75 moedas e derrota não cobra nem envia ao Descanso. Tempo esgotado conta como derrota do desafiante: cobra 150% do aluguel contra defensor e não concede prêmio contra a Rocket. O encerramento da batalha acontece uma única vez no motor, por `settleEncounter`.

## Catálogo de golpes

O protótipo declara golpes específicos para cerca de 40 espécies e usa um golpe padrão de Eevee quando não encontra uma definição. O PokéPoly atualmente oferece 386 espécies nas três regiões. A primeira versão da arena deve gerar dois golpes por **tipo principal e função**, com recarga e dano balanceados para todas as espécies. Definições especiais por espécie podem enriquecer o catálogo gradualmente. Assim, nenhum Pokémon capturado entra na arena com golpes de outra espécie por falta de configuração.

As quatro melhorias da casa podem aumentar moderadamente vida ou defesa do defensor, mantendo chance real de vitória do atacante. O bônus de grupo continua afetando o aluguel, sem duplicar vantagem de combate.

## Visual e recursos

O tabuleiro usa GIFs locais. A arena usa como fonte principal as folhas de animação e metadados XML do [PMD Collab SpriteCollab](https://github.com/PMDCollab/SpriteCollab), exatamente como no protótipo. Carrega caminhada e ataque em oito direções; enquanto aguarda ou se a rede falhar, exibe a GIF local. O projeto da fonte exige crédito e uso não comercial; o link aparece na interface. Os golpes usam folhas de projétil e impacto da coleção PAdventures Sprites referenciada no protótipo, com formas de canvas como fallback. A arena segue a paleta azul, violeta, coral e dourado.

Cada região tem um cenário próprio em `assets/arena/`. As três imagens são vistas de cima, com o piso livre para o duelo. A posição vertical das sprites é calculada pelo último pixel visível de cada quadro, alinhando os pés à sombra no chão. Em Hoenn, os limites de movimento preservam os personagens na parte central de pedra, fora da água e das rochas.

## Estado da implementação

A primeira arena jogável já está integrada às partidas no mesmo dispositivo. O atacante escolhe um Pokémon do time, enfrenta uma IA em um duelo de até 25 segundos e usa movimento, duas habilidades e dash. As animações do SpriteCollab e a paleta azul/violeta aparecem no canvas. A vitória ou derrota passam por `settleEncounter` uma única vez; tempo esgotado é derrota do desafiante. Após mostrar o resultado por três segundos, o modal fecha e a partida continua no tabuleiro. A página `docs/arena-preview.html` é uma galeria dos cenários; o combate só começa na partida.

A sala online conserva, por enquanto, a batalha por turnos anterior. Assim a simulação em tempo real ainda não é transmitida pelo host; esse é o próximo passo técnico para unificar o combate em todos os modos.

## Próxima etapa

1. Separar a simulação do desenho em canvas para testes determinísticos de colisão, nocaute, tempo limite e dano por nível.
2. Ajustar habilidades, IA e duração com partidas reais, inclusive no toque.
3. Na partida online, aproveitar a sala existente: o host executa a simulação e transmite um estado compacto apenas durante a batalha. Não criar uma segunda sala PeerJS como faz o protótipo.

## Primeiro recorte jogável

Um duelo contra a IA, de até 25 segundos, com movimento, dash, duas habilidades; atacante escolhido entre seus Pokémon; defensor da casa ou Rocket; indicadores de vida e recarga; sprites locais. Esse recorte valida a sensação da arena e o tempo médio de uma jogada antes de ampliar o catálogo de golpes ou sincronizar o combate em tempo real pela sala online.
