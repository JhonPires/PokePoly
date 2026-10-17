import {createGame, prepareRoll, move, resolveLanding, buy, evolve, pay, finishTurn, needsFinance, sellHouse, bankrupt, rent, netWorth} from '../src/engine.js';
import {getRegion} from '../src/regions.js';

const games=Number(process.argv[2]||400);
const seed=Number(process.argv[3]||20261016);
let randomSeed=seed>>>0;
const random=()=>{randomSeed=(Math.imul(1664525,randomSeed)+1013904223)>>>0;return randomSeed/4294967296;};
const die=()=>1+Math.floor(random()*6);
const results=[];

for(let game=0;game<games;game++){
 const state=createGame([{name:'Red'},{name:'Blue'},{name:'Leaf'},{name:'Gold'}],['kanto','johto','hoenn'][game%3],game+1);
 const stats={turns:0,rounds:0,buys:0,upgrades:0,rentPaid:0,passes:0,sales:0,bankruptcies:0};
 while(state.winner===null&&stats.turns<800){
  const player=state.players[state.turn];
  const a=die(),b=die(),plan=prepareRoll(state,a,b);
  if(plan.steps){
   const old=player.position;
   move(state,plan.steps);
   if(old+plan.steps>=40)stats.passes++;
   resolveLanding(state,Math.floor(random()*8));
   const id=player.position,tile=getRegion(state.region).board[id];
   const property=state.properties[id];
   if(!player.resting&&tile.type==='property'&&property?.owner===state.turn){
    if(evolve(state,id))stats.upgrades++;
   }else if(!player.resting&&tile.type==='property'&&property){
    const due=rent(state,id);
    pay(state,id);stats.rentPaid+=due;
   }else if(!player.resting&&tile.type==='property'&&!property){
    if(buy(state,id,Math.floor(random()*3)))stats.buys++;
   }
  }
  while(needsFinance(state)){
   const owned=Object.keys(state.properties).map(Number).filter(id=>state.properties[id].owner===state.turn);
   if(!owned.length){bankrupt(state);stats.bankruptcies++;break;}
   sellHouse(state,owned[Math.floor(random()*owned.length)]);stats.sales++;
  }
  if(state.winner!==null)break;
  const before=state.turn,extra=finishTurn(state);
  stats.turns++;
  if(!extra&&state.turn===0&&before!==0)stats.rounds++;
 }
 results.push({...stats,finished:state.winner!==null,winnerWorth:state.winner===null?0:netWorth(state,state.winner),cash:state.players.reduce((sum,p)=>sum+p.money,0),properties:Object.keys(state.properties).length});
}

const sorted=results.map(r=>r.turns).sort((a,b)=>a-b);
const mean=key=>Math.round(results.reduce((sum,r)=>sum+r[key],0)/games);
console.log(JSON.stringify({games,finished:results.filter(r=>r.finished).length,turns:{p25:sorted[Math.floor(games*.25)],median:sorted[Math.floor(games*.5)],p75:sorted[Math.floor(games*.75)]},average:{rounds:mean('rounds'),buys:mean('buys'),upgrades:mean('upgrades'),rentPaid:mean('rentPaid'),passes:mean('passes'),sales:mean('sales'),bankruptcies:mean('bankruptcies'),cash:mean('cash'),properties:mean('properties'),winnerWorth:mean('winnerWorth')}},null,2));
