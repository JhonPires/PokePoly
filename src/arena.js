import {evolutionDex} from './pokedex.js';
import {spriteFor} from './sprites.js';
import {playSound} from './sound.js';
import {loadArenaSprite,directionFor,frameFor,visibleBottom} from './arena-sprites.js';

const species=new Map(evolutionDex.map(p=>[p.name,p]));
const names={1:['Investida','Impacto'],2:['Soco Rápido','Onda de Força'],3:['Rajada','Ciclone'],4:['Ferrão','Névoa Tóxica'],5:['Pedrada','Tremor'],6:['Pedra Afiada','Avalanche'],7:['Picada','Enxame'],8:['Assombro','Bola Sombria'],9:['Garra de Aço','Canhão Metálico'],10:['Brasa','Bola de Fogo'],11:['Jato d’Água','Onda Azul'],12:['Folha Afiada','Chicote de Vinha'],13:['Choque','Raio'],14:['Confusão','Onda Psíquica'],15:['Vento Gelado','Raio de Gelo'],16:['Garra Dragão','Sopro Dragão'],17:['Mordida','Pulso Sombrio'],18:['Encanto','Brilho Feérico']};
const palette={1:'#e9d6b0',2:'#f6a768',3:'#8bd3f0',4:'#b390ec',5:'#c8a477',6:'#cfb78f',7:'#c4a8ec',8:'#9f85e4',9:'#a8bbd4',10:'#ff9672',11:'#77b9f0',12:'#f2a2c0',13:'#f9d575',14:'#e8a3ee',15:'#9ddcf5',16:'#969df1',17:'#aa87ce',18:'#f3a6d6'};
// IDs das folhas de efeito e projétil usadas pelo protótipo Pokémon Arena.
const visuals={1:[51409,49312],2:[51409,49312],3:[51525,50948],4:[51774,49865],5:[51433,49349],6:[51433,49349],7:[51671,49594],8:[51499,49376],9:[51433,49312],10:[51541,49229],11:[51433,50751],12:[51671,49594],13:[51525,49468],14:[51525,50948],15:[51514,49540],16:[51433,49987],17:[51499,49376],18:[51525,50948]};
export const ARENA_BALANCE=Object.freeze({playerBasicCooldown:1.15,playerSpecialCooldown:5.2,enemyBasicCooldown:1.05,enemySpecialCooldown:4.3,playerBasicDamage:11,playerSpecialDamage:22,enemyBasicDamage:12,enemySpecialDamage:20});
export function movesFor(name){const raw=species.get(name.replace(/^Mega /,'')),type=raw?.types?.[0]||1;return {type,names:names[type]||names[1],color:palette[type]||palette[1],missile:visuals[type]?.[0]||visuals[1][0],hit:visuals[type]?.[1]||visuals[1][1]};}

export const ARENA_DURATION=25;
const W=800,H=460,LIMIT=ARENA_DURATION;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
// Todas as artes exibem um piso em perspectiva no mesmo enquadramento.
// As coordenadas representam os pés dos combatentes, não a cabeça da sprite.
export const ARENA_LIMITS=Object.freeze({left:34,right:W-34,top:215,bottom:H-36});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const aim=(a,b)=>{const length=distance(a,b)||1;return {x:(b.x-a.x)/length,y:(b.y-a.y)/length};};
const imageFor=name=>{const image=new Image(),src=spriteFor(name);if(src)image.src=/^https?:/.test(src)?src:new URL(`../${src}`,import.meta.url).href;return image;};
const effectBase='https://raw.githubusercontent.com/DistTopic/padventures-sprites/main/sprites/';
const effectImages=new Map();
const effectImage=(category,id)=>{const key=`${category}/${id}`;if(!effectImages.has(key)){const image=new Image();image.src=`${effectBase}${key}.png`;effectImages.set(key,image);}return effectImages.get(key);};

export function startArena({canvas,controls,attacker,defender,region='kanto',level=0,onFinish=()=>{},onState,spectator=false,initialState}){
 const ctx=canvas.getContext('2d'),attackStyle=movesFor(attacker),defendStyle=movesFor(defender);
 for(const style of [attackStyle,defendStyle]){effectImage('missile',style.missile);effectImage('effect',style.hit);}
 const regionId=['kanto','johto','hoenn','sinnoh','unova','kalos','alola','galar','paldea'].includes(region)?region:'kanto';
 const background=new Image();background.src=new URL(`../assets/arena/${regionId}.png`,import.meta.url).href;
 const limits=ARENA_LIMITS;
 const startX=132;
 const startY=(limits.top+limits.bottom)/2;
 const player={x:startX,y:startY,hp:100,maxHp:100,cd:0,special:0,dash:0,dashTime:0,flash:0,img:imageFor(attacker),sprite:loadArenaSprite(attacker),dir:2,actionAt:-10,moving:false,name:attacker,style:attackStyle};
 const enemy={x:W-startX,y:startY,hp:115+level*20,maxHp:115+level*20,cd:1,special:2.8,flash:0,img:imageFor(defender),sprite:loadArenaSprite(defender),dir:6,actionAt:-10,moving:false,name:defender,style:defendStyle};
 const held=new Set(),shots=[],effects=[],impactSprites=[];let time=LIMIT,elapsed=0,ended=false,stopped=false,frame=0,last=performance.now(),enemyStrafe=1,lastBroadcast=-1;
 if(initialState){for(const [target,data] of [[player,initialState.player],[enemy,initialState.enemy]])if(data){target.x=clamp(data.x,limits.left,limits.right);target.y=clamp(data.y,limits.top,limits.bottom);target.hp=clamp(data.hp,0,target.maxHp);target.dir=data.dir;}time=clamp(initialState.time,0,LIMIT);elapsed=LIMIT-time;}
 const abort=new AbortController(),keyMap={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',KeyJ:'basic',Space:'basic',KeyK:'special',ShiftLeft:'dash',ShiftRight:'dash'};
 const hold=(key,on)=>on?held.add(key):held.delete(key);
 if(!spectator){document.addEventListener('keydown',event=>{const key=keyMap[event.code];if(!key||ended)return;event.preventDefault();hold(key,true);},{signal:abort.signal});
 document.addEventListener('keyup',event=>{const key=keyMap[event.code];if(!key)return;event.preventDefault();hold(key,false);},{signal:abort.signal});
 window.addEventListener('blur',()=>held.clear(),{signal:abort.signal});
 controls.querySelectorAll('[data-control]').forEach(button=>{
  const key=button.dataset.control;
  button.addEventListener('pointerdown',event=>{event.preventDefault();button.setPointerCapture(event.pointerId);hold(key,true);},{signal:abort.signal});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,()=>hold(key,false),{signal:abort.signal});
 });}
 for(const [key,label] of [['basic',attackStyle.names[0]],['special',attackStyle.names[1]]]){const button=controls.querySelector(`[data-control="${key}"]`);if(button)button.textContent=`${key==='basic'?'J':'K'} · ${label}`;}
 const burst=(x,y,color,r=18)=>effects.push({x,y,color,r,life:.38,max:.38});
 const projectile=(owner,from,to,damage,speed,radius,color,special=false)=>{const direction=aim(from,to);from.dir=directionFor(direction.x,direction.y);from.actionAt=elapsed;shots.push({owner,x:from.x+direction.x*30,y:from.y+direction.y*30,vx:direction.x*speed,vy:direction.y*speed,damage,radius,color,life:2,missile:from.style.missile,hit:from.style.hit,special});burst(from.x,from.y,color,special?28:14);playSound('attack');};
 const impact=(target,damage,color,hit)=>{target.hp=clamp(target.hp-damage,0,target.maxHp);target.flash=.24;burst(target.x,target.y,color,30);impactSprites.push({x:target.x,y:target.y-20,id:hit,life:.5,max:.5,size:92});playSound('impact');};
 const stateFrame=()=>({time:Math.round(time*10)/10,player:{x:Math.round(player.x),y:Math.round(player.y),hp:Math.round(player.hp),dir:player.dir},enemy:{x:Math.round(enemy.x),y:Math.round(enemy.y),hp:Math.round(enemy.hp),dir:enemy.dir}});
 const finish=result=>{if(ended)return;ended=true;held.clear();abort.abort();cancelAnimationFrame(frame);onState?.(stateFrame());draw();onFinish(result);};
 const update=dt=>{
  if(spectator)return;
  elapsed+=dt;time=Math.max(0,time-dt);if(time===0){finish('loss');return;}
  for(const fighter of [player,enemy]){fighter.cd=Math.max(0,fighter.cd-dt);fighter.special=Math.max(0,fighter.special-dt);fighter.flash=Math.max(0,fighter.flash-dt);}
  player.dash=Math.max(0,player.dash-dt);player.dashTime=Math.max(0,player.dashTime-dt);
  let dx=Number(held.has('right'))-Number(held.has('left')),dy=Number(held.has('down'))-Number(held.has('up'));
  const length=Math.hypot(dx,dy)||1;dx/=length;dy/=length;player.moving=!!(dx||dy);if(player.moving)player.dir=directionFor(dx,dy);
  if(held.has('dash')&&player.dash===0&&(dx||dy)){player.dash=3;player.dashTime=.18;burst(player.x,player.y,'#9abfff',26);playSound('dash');}
  player.x=clamp(player.x+dx*(player.dashTime?460:205)*dt,limits.left,limits.right);player.y=clamp(player.y+dy*(player.dashTime?460:205)*dt,limits.top,limits.bottom);
  const gap=distance(player,enemy),toward=aim(enemy,player);
  enemy.dir=directionFor(toward.x,toward.y);enemy.moving=true;
  if(gap>215){enemy.x+=toward.x*155*dt;enemy.y+=toward.y*155*dt;}else if(gap<105){enemy.x-=toward.x*125*dt;enemy.y-=toward.y*125*dt;}else enemy.y+=enemyStrafe*95*dt;
  if((enemy.y<limits.top+20&&enemyStrafe<0)||(enemy.y>limits.bottom-20&&enemyStrafe>0))enemyStrafe*=-1;
  enemy.x=clamp(enemy.x,limits.left,limits.right);enemy.y=clamp(enemy.y,limits.top,limits.bottom);
  if(held.has('basic')&&player.cd===0){projectile('player',player,enemy,ARENA_BALANCE.playerBasicDamage,425,13,player.style.color);player.cd=ARENA_BALANCE.playerBasicCooldown;}
  if(held.has('special')&&player.special===0){projectile('player',player,enemy,ARENA_BALANCE.playerSpecialDamage,340,24,player.style.color,true);player.special=ARENA_BALANCE.playerSpecialCooldown;}
  // A IA antecipa um pouco o movimento atual do jogador, mas ainda permite esquiva.
  const lead={x:clamp(player.x+dx*38,limits.left,limits.right),y:clamp(player.y+dy*38,limits.top,limits.bottom)};
  if(enemy.cd===0){projectile('enemy',enemy,lead,ARENA_BALANCE.enemyBasicDamage+level*2,390,14,enemy.style.color);enemy.cd=ARENA_BALANCE.enemyBasicCooldown;}
  if(enemy.special===0&&gap<310){projectile('enemy',enemy,lead,ARENA_BALANCE.enemySpecialDamage+level*2,330,25,enemy.style.color,true);enemy.special=ARENA_BALANCE.enemySpecialCooldown;}
  for(const shot of shots){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;const target=shot.owner==='player'?enemy:player;if(distance(shot,target)<shot.radius+23){impact(target,shot.damage,shot.color,shot.hit);shot.life=0;}}
  for(let i=shots.length-1;i>=0;i--)if(shots[i].life<=0||shots[i].x<0||shots[i].x>W||shots[i].y<0||shots[i].y>H)shots.splice(i,1);
  for(const effect of effects)effect.life-=dt;
  for(let i=effects.length-1;i>=0;i--)if(effects[i].life<=0)effects.splice(i,1);
  for(const sprite of impactSprites)sprite.life-=dt;
  for(let i=impactSprites.length-1;i>=0;i--)if(impactSprites[i].life<=0)impactSprites.splice(i,1);
  if(onState&&elapsed-lastBroadcast>=.2){lastBroadcast=elapsed;onState(stateFrame());}
  if(enemy.hp<=0){finish('win');return;}if(player.hp<=0){finish('loss');}
 };
 const rounded=(x,y,w,h,r)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);};
 const bar=(x,y,w,value,max,color)=>{ctx.fillStyle='#10192d';rounded(x,y,w,11,5);ctx.fill();ctx.fillStyle=color;rounded(x,y,w*clamp(value/max,0,1),11,5);ctx.fill();};
 const drawFighter=(fighter,side)=>{
  ctx.fillStyle='#080f22aa';ctx.beginPath();ctx.ellipse(fighter.x,fighter.y+21,33,9,0,0,Math.PI*2);ctx.fill();
  if(fighter.flash)ctx.filter='brightness(2.5)';
  if(fighter.sprite.ready){const attacking=elapsed-fighter.actionAt<.35;const animation=attacking?fighter.sprite.shoot:fighter.sprite.walk;const index=attacking?frameFor(animation,elapsed-fighter.actionAt):fighter.moving?frameFor(animation,elapsed):0;const scale=Math.min(2,120/animation.width,112/animation.height),width=animation.width*scale,height=animation.height*scale;const bottom=visibleBottom(animation,fighter.dir,index);ctx.imageSmoothingEnabled=false;ctx.drawImage(animation.image,index*animation.width,fighter.dir*animation.height,animation.width,animation.height,fighter.x-width/2,fighter.y+20-bottom*scale,width,height);}
  else if(fighter.img.complete&&fighter.img.naturalWidth){ctx.imageSmoothingEnabled=false;ctx.drawImage(fighter.img,fighter.x-48,fighter.y-76,96,96);}else{ctx.fillStyle=fighter.style.color;ctx.beginPath();ctx.arc(fighter.x,fighter.y-16,29,0,Math.PI*2);ctx.fill();}
  ctx.filter='none';bar(fighter.x-44,fighter.y-82,88,fighter.hp,fighter.maxHp,side==='player'?'#86baff':'#f28a99');
  ctx.fillStyle='#fff0d3';ctx.font='bold 12px Segoe UI';ctx.textAlign='center';ctx.fillText(fighter.name,fighter.x,fighter.y-89);
 };
 const draw=()=>{
  ctx.clearRect(0,0,W,H);
  if(background.complete&&background.naturalWidth){const sourceHeight=background.naturalWidth*H/W,cropY=(background.naturalHeight-sourceHeight)/2;ctx.drawImage(background,0,Math.max(0,cropY),background.naturalWidth,Math.min(sourceHeight,background.naturalHeight),0,0,W,H);}else{ctx.fillStyle='#172841';ctx.fillRect(0,0,W,H);}
  ctx.fillStyle='#09142b28';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#edc990aa';ctx.lineWidth=3;ctx.strokeRect(8,8,W-16,H-16);
  ctx.fillStyle='#0c1935dd';rounded(16,14,91,30,8);ctx.fill();ctx.fillStyle='#ffe0a8';ctx.font='bold 13px Segoe UI';ctx.textAlign='center';ctx.fillText(regionId.toUpperCase(),61,34);
  for(const effect of effects){const alpha=effect.life/effect.max;ctx.strokeStyle=effect.color;ctx.globalAlpha=alpha;ctx.lineWidth=4;ctx.beginPath();ctx.arc(effect.x,effect.y,effect.r*(1+(1-alpha)),0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
  for(const shot of shots){const image=effectImage('missile',shot.missile);if(image.complete&&image.naturalWidth>=32&&image.naturalHeight>=32){const angle=Math.atan2(shot.vy,shot.vx),direction=((Math.round(angle/(Math.PI/4))%8)+8)%8,row=Math.min(Math.floor(image.naturalHeight/32)-1,((Math.round(Math.sin(angle))+1)*3+Math.round(Math.cos(angle))+1));const size=shot.special?shot.radius*3.4:shot.radius*3;ctx.save();ctx.translate(shot.x,shot.y);ctx.rotate(angle-direction*Math.PI/4);ctx.imageSmoothingEnabled=false;ctx.drawImage(image,0,row*32,32,32,-size/2,-size/2,size,size);ctx.restore();}else{ctx.shadowBlur=15;ctx.shadowColor=shot.color;ctx.fillStyle=shot.color;ctx.beginPath();ctx.arc(shot.x,shot.y,shot.radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}}
  for(const sprite of impactSprites){const image=effectImage('effect',sprite.id);if(image.complete&&image.naturalWidth&&image.naturalHeight){const tile=image.naturalHeight,frames=Math.max(1,Math.floor(image.naturalWidth/tile)),index=Math.min(frames-1,Math.floor((1-sprite.life/sprite.max)*frames));ctx.save();ctx.globalAlpha=Math.min(1,sprite.life*4);ctx.imageSmoothingEnabled=false;ctx.drawImage(image,index*tile,0,tile,tile,sprite.x-sprite.size/2,sprite.y-sprite.size/2,sprite.size,sprite.size);ctx.restore();}}
  drawFighter(player,'player');drawFighter(enemy,'enemy');
  ctx.fillStyle='#0c1935dd';rounded(W/2-95,14,190,38,10);ctx.fill();ctx.fillStyle='#fff0c5';ctx.font='bold 20px Segoe UI';ctx.textAlign='center';ctx.fillText(`${Math.ceil(time)} s`,W/2,40);
  ctx.fillStyle='#0c1935dd';rounded(13,H-57,390,45,7);ctx.fill();ctx.fillStyle='#ecddff';ctx.font='12px Segoe UI';ctx.textAlign='left';ctx.fillText(`J · ${player.style.names[0]} ${player.cd?`${player.cd.toFixed(1)}s`:'PRONTO'}`,24,H-39);ctx.fillText(`K · ${player.style.names[1]} ${player.special?`${player.special.toFixed(1)}s`:'PRONTO'}`,24,H-21);
  ctx.fillStyle='#0c1935dd';rounded(W-125,H-45,110,33,7);ctx.fill();ctx.fillStyle='#ffe19c';ctx.textAlign='right';ctx.fillText(`Dash ${player.dash?`${player.dash.toFixed(1)}s`:'PRONTO'}`,W-25,H-24);
  if(ended){ctx.fillStyle='#0c1324bb';ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff0c5';ctx.font='bold 38px Segoe UI';ctx.textAlign='center';ctx.fillText(enemy.hp<=0?'VITÓRIA':time===0?'TEMPO ESGOTADO':'DERROTA',W/2,H/2);}
 };
 const loop=now=>{if(stopped||ended)return;const dt=clamp((now-last)/1000,0,.04);last=now;update(dt);if(!ended){draw();frame=requestAnimationFrame(loop);}};
 frame=requestAnimationFrame(loop);
 return {stop(){stopped=true;abort.abort();cancelAnimationFrame(frame);},sync(remote){if(!spectator||stopped||!remote)return;for(const [target,data] of [[player,remote.player],[enemy,remote.enemy]])if(data){target.x=clamp(data.x,limits.left,limits.right);target.y=clamp(data.y,limits.top,limits.bottom);target.hp=clamp(data.hp,0,target.maxHp);target.dir=data.dir;target.moving=true;}time=clamp(remote.time,0,LIMIT);}};
}
