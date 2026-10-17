import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {cardsFor} from './cards.js';
import {regions} from './regions.js';
import {evolutionDex} from './pokedex.js';
import {spriteFor} from './sprites.js';
import {createGame,resolveLanding} from './engine.js';

test('nove baralhos têm dez cartas e arte regional com Pokémon próprio',()=>{
 const pokemon=new Set(evolutionDex.map(p=>p.name));
 for(const region of Object.values(regions)){
  const deck=cardsFor(region.id);
  assert.equal(deck.length,10,region.id);
  assert.equal(deck.filter(card=>card.kind==='Sorte').length,5);
  assert.equal(deck.filter(card=>card.kind==='Revés').length,5);
  assert.equal(new Set(deck.map(card=>card.title)).size,10);
  assert.ok(existsSync(region.id==='kanto'?'assets/cards/sorte.png':`assets/cards/${region.id}.png`));
  if(region.id==='kanto')assert.ok(existsSync('assets/cards/reves.png'));
  for(const card of deck){assert.equal(card.region,region.id);assert.ok(pokemon.has(card.pokemon),card.pokemon);assert.ok(spriteFor(card.pokemon));assert.ok(card.text.length>20);}
 }
});

test('sorteio usa o baralho regional e aplica dinheiro, retorno e Descanso',()=>{
 for(const region of Object.values(regions)){
  const deck=cardsFor(region.id);
  for(let index=0;index<deck.length;index++){
   const card=deck[index],state=createGame([],region.id,index);
   state.players[0].position=8;
   state.players[0].money=50;
   resolveLanding(state,index);
   assert.equal(state.card.title,card.title);
   if(card.effect==='rest'){assert.equal(state.players[0].position,20);assert.ok(state.players[0].resting);assert.equal(state.players[0].money,50);}
   else if(card.effect==='start'){assert.equal(state.players[0].position,0);assert.equal(state.players[0].money,50+card.amount);}
   else {assert.equal(state.players[0].position,8);assert.equal(state.players[0].money,Math.max(0,50+card.amount));}
  }
 }
});
