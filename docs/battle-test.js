import {startArena} from '../src/arena.js';

const pairs={
 kanto:['Pikachu','Charizard'],johto:['Cyndaquil','Crobat'],hoenn:['Treecko','Mightyena'],
 sinnoh:['Shinx','Lucario'],unova:['Snivy','Zoroark'],kalos:['Fennekin','Greninja'],
 alola:['Rowlet','Lycanroc'],galar:['Scorbunny','Corviknight'],paldea:['Sprigatito','Ceruledge']
};
if(typeof document!=='undefined'){
const region=document.getElementById('region');
const restart=document.getElementById('restart');
const result=document.getElementById('result');
const matchup=document.getElementById('matchup');
let duel;
const canvas=document.getElementById('arena');

function showPreview(){
 const image=new Image();
 const selected=region.value;
 image.onload=()=>{
  if(duel||region.value!==selected)return;
  const ctx=canvas.getContext('2d');
  const sourceHeight=image.naturalWidth*canvas.height/canvas.width;
  ctx.drawImage(image,0,Math.max(0,(image.naturalHeight-sourceHeight)/2),image.naturalWidth,Math.min(sourceHeight,image.naturalHeight),0,0,canvas.width,canvas.height);
  ctx.fillStyle='#0b1738bb';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#fff0cc';ctx.font='bold 28px system-ui';ctx.textAlign='center';
  ctx.fillText('Pronto para batalhar?',canvas.width/2,canvas.height/2);
  ctx.font='16px system-ui';ctx.fillText('Clique em Iniciar duelo',canvas.width/2,canvas.height/2+34);
 };
 image.src=new URL(`../assets/arena/${selected}.png`,import.meta.url).href;
}

function showMatchup(){const [attacker,defender]=pairs[region.value];matchup.textContent=`${attacker} contra ${defender}`;}
function start(){
 duel?.stop();
 const [attacker,defender]=pairs[region.value];
 result.textContent='Batalha em andamento. Vença antes do tempo acabar!';
 restart.textContent='Reiniciar duelo';
 duel=startArena({canvas,controls:document.getElementById('controls'),attacker,defender,region:region.value,onFinish:outcome=>{
  result.textContent=outcome==='win'?'Vitória!':outcome==='loss'?'Derrota ou tempo esgotado. Tente novamente.':'Empate.';
  restart.textContent='Jogar novamente';
 }});
}
region.addEventListener('change',()=>{duel?.stop();duel=null;showMatchup();showPreview();result.textContent='Duelo pronto.';restart.textContent='Iniciar duelo';});
restart.addEventListener('click',start);
showMatchup();
showPreview();
}
