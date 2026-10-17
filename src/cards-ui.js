import {pokemonImage} from './sprites.js';
import {getRegion} from './regions.js';

export function eventCard(card){const lucky=card.kind==='Sorte',region=getRegion(card.region),art=card.region==='kanto'?`assets/cards/${lucky?'sorte':'reves'}.png`:`assets/cards/${region.id}.png`;return `<article class="event-card ${lucky?'lucky':'unlucky'} ${region.id==='kanto'?'':'regional'}"><img class="card-art" src="${art}" alt="" aria-hidden="true"><small class="card-region">${region.name.toUpperCase()} · GERAÇÃO ${region.generation}</small><div class="card-feature">${pokemonImage(card.pokemon,'card-pokemon')}</div><span>${lucky?'✦ SORTE':'⚡ REVÉS'}</span><h3>${card.title}</h3><p>${card.text}</p></article>`;}
