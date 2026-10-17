const randomBytes=n=>({toString:()=>Array.from(crypto.getRandomValues(new Uint8Array(n)),b=>b.toString(16).padStart(2,'0')).join('')});
const randomInt=(min,max)=>{const range=max-min,limit=Math.floor(4294967296/range)*range;let value;do{value=crypto.getRandomValues(new Uint32Array(1))[0];}while(value>=limit);return min+value%range;};
import {createGame,validRoundLimit,prepareRoll,move,resolveLanding,buy,evolve,pay,payRocket,battlePokemon,settleBattle,finishTurn,releaseByPaying,lineage,createBattle,settleEncounter,needsFinance,sellHouse,bankrupt,makeOffer,replyOffer} from './engine.js';
import {regions} from './regions.js';
import {pinOptions} from './pins.js';
import {pacing} from './presentation.js';
const fail=message=>{throw new Error(message);};
const profile=p=>{if(typeof p?.name!=='string'||!p.name.trim()||p.name.trim().length>20)fail('Informe um nickname de até 20 caracteres.');if(!pinOptions.some(i=>i.id===p.pin))fail('Escolha um pino válido.');return {name:p.name.trim(),pin:p.pin};};
export class Rooms{
 constructor({now=Date.now,die=()=>randomInt(1,7)}={}){this.rooms=new Map();this.now=now;this.die=die;}
 create(p,region,roundLimit=24){if(!regions[region])fail('Região inválida.');if(!validRoundLimit(roundLimit))fail('Escolha entre 4 e 100 rodadas.');const code=randomBytes(4).toString('hex').slice(0,6).toUpperCase(),token=randomBytes(24).toString('hex');const room={code,region,roundLimit,members:[{...profile(p),token}],state:null,version:0,lockedUntil:0,lastRoll:null,battle:null,touched:this.now()};this.rooms.set(code,room);return {code,token,slot:0};}
 find(code){const r=this.rooms.get(code);if(!r)fail('Sala não encontrada.');r.touched=this.now();return r;}
 member(r,token){const slot=r.members.findIndex(m=>m.token===token);if(slot<0)fail('Sessão inválida.');return slot;}
 join(code,p){const r=this.find(code);if(r.state||r.members.length>=4)fail('Sala cheia ou partida iniciada.');const data=profile(p);if(r.members.some(m=>m.pin===data.pin))fail('Esse pino já está em uso. Escolha outro.');const token=randomBytes(24).toString('hex');r.members.push({...data,token});r.version++;return {code,token,slot:r.members.length-1};}
 snapshot(code,token){const r=this.find(code),slot=this.member(r,token);return {code:r.code,region:r.region,roundLimit:r.roundLimit||24,slot,version:r.version,members:r.members.map(({name,pin})=>({name,pin})),state:r.state,battle:r.battle,lastRoll:r.lastRoll,lockedUntil:r.lockedUntil};}
 battleFrame(code,token,battleId,frame){const r=this.find(code),slot=this.member(r,token),b=r.battle;if(!b||b.battleId!==battleId||b.finished||slot!==r.state?.turn)return false;const maxEnemy=115+(r.state.properties[b.id]?.level||0)*20,old=b.frame;const fighter=(value,max)=>value&&Number.isInteger(value.x)&&value.x>=0&&value.x<=800&&Number.isInteger(value.y)&&value.y>=0&&value.y<=460&&Number.isInteger(value.hp)&&value.hp>=0&&value.hp<=max&&Number.isInteger(value.dir)&&value.dir>=0&&value.dir<=7;if(!frame||!Number.isFinite(frame.time)||frame.time<0||frame.time>45||!fighter(frame.player,100)||!fighter(frame.enemy,maxEnemy))return false;if(old&&(frame.time>old.time+.2||frame.player.hp>old.player.hp||frame.enemy.hp>old.enemy.hp))return false;b.frame=frame;return true;}
 command(code,token,command){const r=this.find(code),slot=this.member(r,token);if(command.version!==r.version)fail('O estado mudou. Aguarde a sincronização.');if(command.type==='start'){if(slot!==0)fail('Só o criador pode iniciar.');if(r.state||r.members.length<2||r.members.length>4)fail('Aguarde de dois a quatro treinadores.');r.state=createGame(r.members,r.region,undefined,r.roundLimit||24);r.version++;return;}
 const s=r.state;if(!s)fail('A partida ainda não começou.');if(s.winner!==null)fail('A partida terminou.');if(command.type==='reply-offer'){if(typeof command.accept!=='boolean'||!replyOffer(s,slot,command.accept))fail('Somente o dono pode responder à proposta.');r.version++;return;}if(s.offer)fail('Aguarde a resposta do dono da casa.');if(slot!==s.turn)fail('Aguarde seu turno.');if(this.now()<r.lockedUntil)fail('Aguarde os dados e o movimento.');const id=s.players[slot].position,o=s.properties[id];
 const end=()=>{if(needsFinance(s)){s.endPending=true;return;}finishTurn(s);};
 if(needsFinance(s)&&!['sell','bankrupt','finish-battle'].includes(command.type))fail('Venda casas ou declare falência antes de continuar.');
 switch(command.type){
 case 'sell':if(r.battle&&!r.battle.finished)fail('Conclua a batalha.');if(!Number.isInteger(command.id)||!sellHouse(s,command.id))fail('Venda inválida.');break;
 case 'bankrupt':if(r.battle&&!r.battle.finished)fail('Conclua a batalha.');if(!bankrupt(s))fail('Falência indisponível.');r.battle=null;break;
 case 'offer':if(r.battle||!makeOffer(s,id,command.amount))fail('Proposta inválida.');break;
 case 'roll':{if(s.phase!=='roll'||r.battle)fail('Resolva a casa antes de rolar.');const before=structuredClone(s),a=this.die(),b=this.die(),plan=prepareRoll(s,a,b);if(plan.steps){move(s,plan.steps);resolveLanding(s);}r.lastRoll={id:randomBytes(8).toString('hex'),a,b,before,steps:plan.steps};r.lockedUntil=this.now()+pacing.spin+pacing.result+pacing.step*plan.steps+pacing.arrival;s.log.unshift(`${s.players[slot].name} rolou ${a} + ${b}.`);break;}
 case 'release':if(!releaseByPaying(s))fail('Não foi possível pagar a saída.');break;
 case 'buy':if(s.phase!=='resolve'||r.battle||!Number.isInteger(command.choice)||!buy(s,id,command.choice))fail('Captura inválida.');end();break;
 case 'evolve':if(r.battle||!evolve(s,id))fail('Evolução indisponível nesta casa ou turno.');break;
 case 'pay':if(s.phase!=='resolve'||r.battle||!o||o.owner===slot)fail('Aluguel indisponível.');pay(s,id);end();break;
 case 'pay-rocket':if(r.battle||!payRocket(s))fail('Taxa Rocket indisponível.');end();break;
 case 'end':if(s.phase!=='resolve'||r.battle||(o&&o.owner!==slot&&s.rentResolvedId!==id)||(id===30&&!s.rocketResolved))fail('Resolva o aluguel antes de continuar.');end();break;
 case 'battle':if(s.phase!=='resolve'||r.battle||!battlePokemon(s).length||(id===30?s.rocketResolved:(!o||o.owner===slot)))fail('Desafio inválido. Capture um território para batalhar.');if(!battlePokemon(s).includes(command.attacker))fail('Escolha um Pokémon de um território seu.');r.battle={...createBattle(s,id,command.attacker),battleId:randomBytes(8).toString('hex'),startedAt:this.now(),frame:null};break;
 case 'battle-result':{const b=r.battle;if(!b||b.finished||b.battleId!==command.battleId||!['win','loss','draw'].includes(command.result))fail('Resultado de batalha inválido.');const frame=b.frame,result=frame?.enemy.hp===0?'win':frame?.player.hp===0?'loss':frame?.time===0?'draw':null;if(result!==command.result)fail('A arena ainda não terminou.');b.result=result;b.hp=frame.player.hp;b.enemy=frame.enemy.hp;settleEncounter(s,b);s.log.unshift(`${s.players[slot].name} ${result==='win'?'venceu':result==='loss'?'perdeu':'empatou'} a batalha.`);break;}
 case 'finish-battle':if(!r.battle?.finished)fail('A batalha não terminou.');r.battle=null;end();break;
 default:fail('Ação desconhecida.');}
 r.version++;
 }
 cleanup(){for(const [code,r] of this.rooms)if(this.now()-r.touched>24*3600*1000)this.rooms.delete(code);}
}

// Desconexão no lobby remove o membro; durante a partida o lugar fica reservado para reconexão.
Rooms.prototype.leave=function(code,token){const r=this.find(code),slot=this.member(r,token);if(slot===0)throw Error('O host deve encerrar a sala.');if(!r.state){r.members.splice(slot,1);r.version++;}};
