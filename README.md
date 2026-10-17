# PokéPoly
Jogo de tabuleiro para 2 a 4 treinadores, no mesmo dispositivo ou com o criador como host da sala.

## Executar
O jogo é estático: pode ser servido pelo Live Server, por hospedagem estática HTTPS ou, para desenvolvimento local, por `npm start`. Este comando apenas serve HTML, JavaScript, CSS e imagens em http://127.0.0.1:5174. Não há servidor de partidas nem necessidade de VPS. `npm test` verifica regras e comandos do host.

## Instalar no celular

A versão publicada em https://jhonpires.github.io/PokePoly/ usa um manifesto PWA com ícones de 192 e 512 px e abre em modo independente quando instalada. No Android, abra o endereço no Chrome e use **Instalar app** no menu. No iPhone, abra no Safari e use **Compartilhar → Adicionar à Tela de Início**. A instalação mantém o jogo ligado ao endereço publicado; é preciso estar online para carregar a partida e para recursos remotos, incluindo sprites que não estão disponíveis localmente. A sala online também exige conexão.

## Multiplayer com host no navegador
1. Selecione **Criar sala online**, região, nickname e pino.
2. Compartilhe o código e o endereço da página do jogo com os convidados.
3. Até três convidados entram pelo código com pinos diferentes.
4. O host inicia com 2, 3 ou 4 treinadores.

O host mantém o estado e valida dados, cartas, pagamentos, batalhas, saldo, posse, turnos e versões. Os convidados enviam comandos; não enviam um estado substituto. O transporte entre navegadores é WebRTC/PeerJS, em estrela, com sinalização no serviço público PeerServer Cloud. Esse serviço ajuda a localizar o host; a aplicação não usa backend próprio de partidas. A biblioteca PeerJS 1.5.5 está incluída em `assets/vendor` com licença MIT. Documentação: https://peerjs.com/client/getting-started.

Nas salas online, o treinador da vez escolhe um Pokémon de suas casas e joga a arena com movimento, duas habilidades e dash. Os demais acompanham posições, vida e tempo em tempo real. O host recebe o resultado, confere o quadro final e aplica aluguel ou prêmio uma única vez antes de avançar o turno.

Entre abas da mesma origem, BroadcastChannel evita conexões externas desnecessárias. O lobby informa se a sinalização pública está conectada ou se apenas outras abas do mesmo navegador poderão entrar. Redes que bloqueiam WebRTC podem impedir a conexão; não há TURN próprio. Para amigos em outras máquinas, todos precisam conseguir abrir a mesma página estática; `127.0.0.1` é apenas o endereço do seu próprio computador. Uma hospedagem estática HTTPS resolve a distribuição da página sem VPS.

Mantenha a aba do host aberta. Recarregar tenta restaurar o host e as sessões com sessionStorage; convidados podem precisar recarregar para reconectar. Não há migração automática para outro host se o criador fechar a aba. Sair do lobby libera o lugar; após iniciar, o lugar fica reservado para reconexão. O host é confiável para arbitrar esta partida casual.

## Regiões e catálogo
Kanto (151), Johto (100), Hoenn (135), Sinnoh (107), Unova (156), Kalos (72), Alola (88), Galar (96) e Paldea (120) têm 40 casas, locais, grupos e imagens de tabuleiro próprios. O catálogo contém 1.025 espécies, separadas pela geração de cada região. Dados públicos da PokéAPI: https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv. `scripts/import-pokedex.py` atualiza JSON, módulo do catálogo e índice de GIFs. O jogo usa GIFs locais quando disponíveis e imagens do repositório de sprites da PokéAPI para as demais espécies; nesse caso, exibir a imagem requer acesso à internet. A batalha usa as folhas de animação do SpriteCollab quando disponíveis.

As três opções de cada território compartilham tipo e estágio evolutivo real, calculado sobre toda a árvore, sem reiniciar a contagem na fronteira entre gerações. Crobat é terceiro estágio; Steelix e Scizor são segundo; Skarmory é primeiro. As ofertas só incluem espécies da geração escolhida e só formam trios quando existem três candidatos compatíveis. O sorteio varia por casa e partida, evitando repetições enquanto há opções suficientes.

## Nível da casa e evolução da espécie
Cada território tem **quatro níveis de melhoria**, para qualquer Pokémon. Cada melhoria custa 60% do preço inicial da casa, arredondado para a próxima dezena, e aumenta o aluguel segundo o mesmo multiplicador (1x, 3x, 5x e 7x), independentemente da quantidade de evoluções da espécie.

Quando existe uma próxima evolução da linha selecionada dentro da geração, a espécie muda. Caso contrário, ocorre treinamento: a espécie permanece e o nível da casa aumenta normalmente. Assim, um Pokémon sem evolução ou já evoluído não perde níveis de melhoria nem potencial de aluguel. A imagem usa a última espécie disponível, nunca uma posição inexistente na linha. Melhorias continuam limitadas a uma por turno e somente na casa atual.

## Outras regras
- Cada treinador começa sem Pokémon. Somente a captura de um território adiciona um defensor ao time e libera desafios.
- Volta ao tabuleiro: 200 moedas.
- Vitória contra defensor: paga 50% do aluguel total; derrota: 150%.
- Dados iguais concedem outra jogada; três pares no turno enviam ao Descanso sem bônus de volta.
- **Visita à Rocket**: envio direto ao Descanso.
- **Ataque Rocket**: com Pokémon capturado, é possível batalhar por um prêmio de 75 moedas ou pagar a taxa integral da casa. Sem território próprio, paga-se somente a taxa integral. Derrota na batalha não cobra multa nem envia ao Descanso.
- Descanso: paga 100 moedas ou tenta dados iguais. Falha perde turno; sucesso avança sem jogada extra.
- Grupo completo: +50% de aluguel em todas as casas desse grupo.
- Cartas de Sorte/Revés têm recompensas, custos ou envio ao Descanso. Saldos são limitados a zero; dívidas de aluguel são resolvidas na Central Financeira.
- A duração é escolhida ao criar a partida (4 a 100 rodadas; padrão de 24). Vence o maior patrimônio: dinheiro em caixa + preço de captura das casas possuídas + valor investido nas melhorias. O placar final mostra essas parcelas. Se restar apenas um treinador antes disso, ele vence imediatamente.

## Interface e arquivos
Tabuleiro completo no viewport, dados com animação, salto de pinos e modal após chegada. Tela lateral em estilo Pokégear, pinos temáticos e cenários locais, sem verde no tema. Botões do lobby compartilham altura, largura, tipografia e alinhamento.

- `src/engine.js`: regras compartilhadas.
- `src/host-room.js`: salas, membros e comandos autoritativos no navegador do host.
- `src/online.js`: PeerJS/WebRTC, canal entre abas e reconexão.
- `src/catalog.js`: estágios e sorteio.
- `src/pokedex.js`, `src/regions.js`, `src/sprites.js`, `src/pins.js`: dados e apresentação.
- `scripts/serve.js`: servidor estático opcional para desenvolvimento.

## Pendências
Para uma etapa futura: hospedagem estática pública da página, migração de host e TURN para redes restritivas. O combate com movimentação livre e habilidades permanece na próxima etapa de jogabilidade.

## Atualização: Descanso, negociações e recuperação financeira
- O contador do Descanso registra somente tentativas sem par. Após três falhas, a quarta rolagem libera o jogador e move a soma dos dados, sem cobrança e sem jogada extra. Um novo envio ao Descanso zera o contador.
- Após capturar ao menos um território, ao cair em território rival é possível propor a compra por um valor inteiro positivo dentro do saldo. A partida aguarda aceite ou recusa do dono, inclusive fora do turno dele. Aceitar transfere dinheiro, território, defensor e melhorias; recusar preserva o estado e retorna à escolha entre aluguel e batalha. Sem território próprio, somente o aluguel integral pode ser pago.
- Ao ficar sem dinheiro, a Central Financeira oferece venda ao banco ou declaração de falência. A venda retorna 50% do investimento total (captura + melhorias); a casa fica livre, perde suas melhorias e o defensor sai do time.
- Aluguel não coberto pelo saldo fica como dívida. Dinheiro recuperado por venda quita essa dívida antes de continuar; a cobrança não é repetida. Não é permitido prosseguir enquanto ainda houver dívida ou saldo zerado.
- Falência requer confirmação na interface, elimina o treinador e libera todas as suas casas. Turnos pulam eliminados. O último treinador ativo vence.
- Cada uma das nove regiões tem um baralho próprio com cinco cartas de Sorte e cinco de Revés, com títulos, textos, Pokémon e efeitos próprios. As artes regionais estão em `assets/cards`; Kanto conserva as artes de Sorte e Revés originais. O menu **Cartas de Sorte / Revés** permite escolher a região e visualizar as cartas sem aplicar efeitos.

## Distribuição dos painéis e marca
Em desktop, menu e treinadores ficam à esquerda; território e diário ficam à direita. O tabuleiro permanece ao centro e inteiro no viewport. Em telas de até 1000 px, ambos os lados são reunidos no menu recolhível. Modais, painéis e menu usam a mesma paleta de scrollbar. O logo PNG com transparência está em `assets/brand/pokepoly-logo.png`; prompt e origem em `docs/logo.md`.

## Balanceamento e acabamento inicial

`node scripts/simulate-economy.js 1000` joga mil partidas automáticas com quatro treinadores alternando Kanto, Johto e Hoenn. O agente compra casas livres, melhora casas próprias quando pode, paga aluguel e vende para quitar dívida. É uma referência de ritmo, não substitui partidas com pessoas. Com o limite de 24 rodadas, todas as mil partidas terminaram; a mediana foi de 109 jogadas (incluindo dados iguais), com média de 24 capturas, 8 melhorias e 1 venda. Antes do limite, somente 315 de 400 simulações terminavam em até 800 jogadas. Os preços de captura, aluguéis, bônus de volta e cartas foram mantidos após essa medição; a melhoria caiu de 100% para 60% do preço da casa para ser uma opção mais viável antes do encerramento.

O menu **Como jogar** apresenta as regras e aparece na primeira partida local. O fim da jornada mostra um placar por patrimônio. Captura e melhoria têm animações curtas no tabuleiro. Há um som curto a cada salto do pino; os efeitos podem ser desligados no menu, e a escolha fica salva no navegador.
