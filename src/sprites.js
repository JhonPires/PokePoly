import {pokedex,availableSprites} from './pokedex.js';
const dex=new Map(pokedex.map(p=>[p.name,p.id])),available=new Set(availableSprites);
export function spriteFor(name){const id=dex.get(name.replace(/^Mega /,''));if(!id)return null;return available.has(id)?`assets/pokemons/poke_${id}.gif`:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;}
export function pokemonImage(name,className='pokemon-sprite'){const src=spriteFor(name);return src?`<img class="${className}" src="${src}" alt="${name}" title="${name}${name.startsWith('Mega ')?' (arte da forma base)':''}" decoding="async">`:`<span class="sprite-missing" title="${name}">◓</span>`;}
