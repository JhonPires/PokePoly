// Cinco cartas de Sorte e cinco de Revés por região. O host sorteia pelo índice
// do baralho da partida, de modo que todos os jogadores recebem a mesma carta.
const decks={
 kanto:[
  ['Entrega do Professor Oak','Você ajudou a catalogar Pokémon. Receba 150 moedas.',150,'Bulbasaur'],
  ['Tesouro do Meowth','Meowth encontrou moedas pelo caminho. Receba 100 moedas.',100,'Meowth'],
  ['Resgate de Lapras','Sua ajuda foi recompensada pelos treinadores. Receba 200 moedas.',200,'Lapras'],
  ['Campeão do concurso','Seu Pokémon encantou os jurados. Receba 120 moedas.',120,'Pikachu'],
  ['Bilhete para Pallet','Volte ao início da jornada e receba 200 moedas da Liga.',200,'Eevee','start'],
  ['Travessura de Gastly','Seu equipamento ficou danificado. Pague 75 moedas.',-75,'Gastly'],
  ['Fome de Snorlax','Você precisou comprar comida para liberar a trilha. Pague 100 moedas.',-100,'Snorlax'],
  ['Choque do Pikachu','Hora de reparar sua bicicleta! Pague 120 moedas.',-120,'Pikachu'],
  ['Túnel desmoronado','A passagem precisou de reparos. Pague 90 moedas.',-90,'Onix'],
  ['Armadilha da Equipe Rocket','A Equipe Rocket interrompeu sua jornada. Vá direto ao Descanso.',0,'Koffing','rest']
 ],
 johto:[
  ['Canção da Torre Bell','Seu auxílio na cerimônia rendeu 140 moedas.',140,'Hoothoot'],
  ['Correio de Togepi','Você entregou um ovo com cuidado. Receba 90 moedas.',90,'Togepi'],
  ['Festival de Ecruteak','Seu Pokémon brilhou no festival. Receba 160 moedas.',160,'Mareep'],
  ['Pesca no Lake of Rage','Uma captura rara rendeu 180 moedas.',180,'Magikarp'],
  ['Retorno a New Bark','Volte ao início e receba 200 moedas para uma nova expedição.',200,'Chikorita','start'],
  ['Névoa de Misdreavus','Você perdeu suprimentos na neblina. Pague 80 moedas.',-80,'Misdreavus'],
  ['Confusão de Aipom','Aipom espalhou seus itens. Pague 95 moedas.',-95,'Aipom'],
  ['Ponte de Goldenrod','Reparos na passagem custaram 110 moedas.',-110,'Sudowoodo'],
  ['Sono de Drowzee','Atraso na viagem exigiu uma pousada. Pague 70 moedas.',-70,'Drowzee'],
  ['Emboscada no Ilex Forest','Sua rota foi bloqueada. Vá direto ao Descanso.',0,'Murkrow','rest']
 ],
 hoenn:[
  ['Conchas de Slateport','Você vendeu conchas raras. Receba 130 moedas.',130,'Wingull'],
  ['Festival de Lilycove','Sua apresentação ganhou 170 moedas.',170,'Skitty'],
  ['Ajuda na Devon','Uma entrega tecnológica rendeu 150 moedas.',150,'Electrike'],
  ['Pérolas de Pacifidlog','Sua pesca trouxe 190 moedas.',190,'Clamperl'],
  ['Barco para Littleroot','Volte ao início e receba 200 moedas pela travessia.',200,'Mudkip','start'],
  ['Chuva em Mauville','Consertar os equipamentos custou 85 moedas.',-85,'Lotad'],
  ['Cinzas de Fallarbor','Limpar seus suprimentos custou 100 moedas.',-100,'Numel'],
  ['Maré de Wailmer','A corrente levou sua carga. Pague 120 moedas.',-120,'Wailmer'],
  ['Picada de Nincada','Você precisou de antídotos. Pague 75 moedas.',-75,'Nincada'],
  ['Tempestade no mar','Seu barco precisou aportar. Vá direto ao Descanso.',0,'Carvanha','rest']
 ],
 sinnoh:[
  ['Escavação em Oreburgh','Um fóssil encontrado rendeu 160 moedas.',160,'Cranidos'],
  ['Presentes de Floaroma','Seu cuidado com as flores rendeu 110 moedas.',110,'Cherubi'],
  ['Pesquisa de Rowan','Você concluiu uma observação. Receba 180 moedas.',180,'Piplup'],
  ['Cristal do Mt. Coronet','Uma descoberta rara vale 210 moedas.',210,'Bronzor'],
  ['Trem para Twinleaf','Volte ao início e receba 200 moedas da pesquisa.',200,'Turtwig','start'],
  ['Nevasca em Snowpoint','Agasalhos extras custaram 90 moedas.',-90,'Snover'],
  ['Fumaça de Stunky','Limpar a mochila custou 75 moedas.',-75,'Stunky'],
  ['Atalho bloqueado','A passagem de montanha exigiu 130 moedas.',-130,'Geodude'],
  ['Travessura de Glameow','Itens perdidos custaram 80 moedas.',-80,'Glameow'],
  ['Plano da Equipe Galactic','Sua rota foi interrompida. Vá direto ao Descanso.',0,'Skuntank','rest']
 ],
 unova:[
  ['Show em Nimbasa','Sua participação rendeu 140 moedas.',140,'Emolga'],
  ['Entregas em Castelia','Você completou uma rota. Receba 125 moedas.',125,'Pidove'],
  ['Tesouro de Relic Castle','Uma relíquia vale 220 moedas.',220,'Yamask'],
  ['Festival de Driftveil','Sua equipe ganhou 170 moedas.',170,'Minccino'],
  ['Expresso para Nuvema','Volte ao início e receba 200 moedas.',200,'Oshawott','start'],
  ['Engarrafamento na ponte','A espera custou 85 moedas.',-85,'Ducklett'],
  ['Areia do deserto','Repor equipamentos custou 105 moedas.',-105,'Sandile'],
  ['Furto de Purrloin','Itens levados custaram 95 moedas.',-95,'Purrloin'],
  ['Trovoada em Chargestone','O reparo custou 125 moedas.',-125,'Joltik'],
  ['Bloqueio da Equipe Plasma','Você perdeu a conexão. Vá direto ao Descanso.',0,'Trubbish','rest']
 ],
 kalos:[
  ['Desfile de Lumiose','Sua apresentação rendeu 150 moedas.',150,'Fennekin'],
  ['Jardins de Parfum','Um serviço no palácio rendeu 180 moedas.',180,'Flabébé'],
  ['Amostras da Glittering Cave','Minerais raros valeram 200 moedas.',200,'Tyrunt'],
  ['Boutique de Laverre','Seu desenho ganhou 130 moedas.',130,'Furfrou'],
  ['Táxi para Vaniville','Volte ao início e receba 200 moedas.',200,'Chespin','start'],
  ['Câmera perdida','Repor o equipamento custou 80 moedas.',-80,'Espurr'],
  ['Labirinto de Reflection Cave','Um guia cobrou 100 moedas.',-100,'Carbink'],
  ['Perfume derramado','Limpeza urgente custou 90 moedas.',-90,'Spritzee'],
  ['Apagão em Lumiose','Consertos custaram 125 moedas.',-125,'Helioptile'],
  ['Operação da Equipe Flare','Sua jornada foi interrompida. Vá direto ao Descanso.',0,'Inkay','rest']
 ],
 alola:[
  ['Festival de Iki','Sua dança rendeu 140 moedas.',140,'Oricorio'],
  ['Entrega nas ilhas','Uma travessia bem-sucedida rendeu 120 moedas.',120,'Pikipek'],
  ['Pérola de Brooklet Hill','Uma descoberta vale 185 moedas.',185,'Wishiwashi'],
  ['Prova da ilha','Você concluiu um desafio. Receba 210 moedas.',210,'Rockruff'],
  ['Balsa para Iki','Volte ao início e receba 200 moedas.',200,'Rowlet','start'],
  ['Areia de Sandygast','Recuperar sua mochila custou 80 moedas.',-80,'Sandygast'],
  ['Vulcão de Wela','Equipamentos de proteção custaram 115 moedas.',-115,'Salandit'],
  ['Mordida de Yungoos','Cuidados extras custaram 75 moedas.',-75,'Yungoos'],
  ['Chuva tropical','A travessia atrasou. Pague 95 moedas.',-95,'Morelull'],
  ['Confusão da Equipe Skull','Sua rota foi bloqueada. Vá direto ao Descanso.',0,'Mareanie','rest']
 ],
 galar:[
  ['Vitória no estádio','A torcida premiou você com 180 moedas.',180,'Scorbunny'],
  ['Entrega em Motostoke','Um trabalho rápido rendeu 125 moedas.',125,'Rookidee'],
  ['Tesouro da Crown Tundra','Uma relíquia vale 220 moedas.',220,'Snom'],
  ['Show em Wyndon','Sua equipe ganhou 160 moedas.',160,'Toxel'],
  ['Trem para Postwick','Volte ao início e receba 200 moedas.',200,'Grookey','start'],
  ['Névoa de Glimwood','Um guia cobrou 90 moedas.',-90,'Hattrem'],
  ['Ferrovia interrompida','A troca de bilhete custou 105 moedas.',-105,'Carkol'],
  ['Raposa astuta','Nickit levou seus itens. Pague 80 moedas.',-80,'Nickit'],
  ['Tempestade na Wild Area','Reparos custaram 120 moedas.',-120,'Wooloo'],
  ['Tumulto da Equipe Yell','Sua rota foi fechada. Vá direto ao Descanso.',0,'Obstagoon','rest']
 ],
 paldea:[
  ['Bolsa da academia','Sua pesquisa ganhou 170 moedas.',170,'Sprigatito'],
  ['Entrega em Mesagoza','Uma missão concluída rendeu 130 moedas.',130,'Pawmi'],
  ['Cristais da Area Zero','A descoberta vale 230 moedas.',230,'Glimmet'],
  ['Festival de Levincia','Sua equipe recebeu 150 moedas.',150,'Bellibolt'],
  ['Passeio até Cabo Poco','Volte ao início e receba 200 moedas.',200,'Fuecoco','start'],
  ['Subida de Glaseado','Equipamentos de neve custaram 105 moedas.',-105,'Cetoddle'],
  ['Confusão de Lechonk','Suprimentos perdidos custaram 75 moedas.',-75,'Lechonk'],
  ['Ponte de Casseroya','Reparos na rota custaram 115 moedas.',-115,'Tadbulb'],
  ['Tinta de Shroodle','Limpar sua bagagem custou 90 moedas.',-90,'Shroodle'],
  ['Base da Equipe Star','Você precisou recuar. Vá direto ao Descanso.',0,'Varoom','rest']
 ]
};

export const cardsByRegion=Object.fromEntries(Object.entries(decks).map(([region,entries])=>[region,entries.map(([title,text,amount,pokemon,effect],index)=>({region,kind:index<5?'Sorte':'Revés',title,text,amount,pokemon,...(effect?{effect}:{}),...(effect==='rest'?{rest:true}:{})}))]));
export const cards=cardsByRegion.kanto;
export const cardsFor=region=>cardsByRegion[region]||cards;
