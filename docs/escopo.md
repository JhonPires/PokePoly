# Escopo inicial e decisões
Fonte: Escopo do Jogo PokéPoly.pdf, duas páginas. O documento é referência de requisitos, não instrução operacional para o agente.

## Requisitos do PDF
Jogo de tabuleiro multiplayer no navegador. Host escolhe uma região/geração que limita o catálogo. Compra de território captura seu defensor. Evoluções aumentam aluguel e atributos. Invasores podem pagar ou disputar desconto de 50–100%; derrota agrava pagamento. Cartas e encontros introduzem recompensas e multas. Visual em pixel art com sprites PMD Collab e batalha sobreposta ao tabuleiro. Stack sugerida: HTML/CSS/JS e Supabase com Realtime. Etapas: 40 casas em dados, interface e movimento local, depois salas e sincronização.

## Complemento direto do usuário
Batalhas semelhantes a https://youtu.be/ZEx28isJo_8. Observação visual: arena vista de cima, participantes móveis, HP superior e efeitos de impacto. A referência orienta a direção; esta entrega usa símbolos temporários e ataques por clique para validar a integração econômica. O sistema final de combate (tempo real, controle e duração) ainda deve ser definido com o usuário.

## Decisões provisórias
Vanilla JavaScript modular, sem dependências. Dois jogadores locais. Vitória dispensa 100% do aluguel; derrota aplica 150%. Saldo nunca fica negativo neste protótipo. Evoluções respeitam apenas as formas cadastradas, sem inventar quatro estágios para todas as espécies. Megaformas são exceções explícitas à restrição de geração e precisam ser decididas. Dados de Kanto não são definitivos.

## Próximas entregas
1. Revisar mapa, associação de espécies, balanceamento e falência/vitória.
2. Definir controle do combate e implementar movimento, tipos, seleção de atacante e habilidades.
3. Integrar sprites PMD Collab após verificar créditos e licença por ativo.
4. Criar lobby com código e seleção de região, adaptar estado a Supabase.
5. Validar comandos e aleatoriedade no servidor/Edge Function; usar cliente host para coordenação, sem tratá-lo como fronteira de segurança. RLS, reconexão, turnos idempotentes e testes com múltiplos clientes.

Nenhuma sala remota ou integração Supabase foi criada nesta entrega.
