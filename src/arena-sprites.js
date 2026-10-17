import {evolutionDex} from './pokedex.js';

// A mesma fonte e o mesmo formato de folhas de animação usados no protótipo.
const BASE='https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/';
const ids=new Map(evolutionDex.map(p=>[p.name,p.id]));
const cache=new Map();
const pad=id=>String(id).padStart(4,'0');

export function directionFor(dx,dy){const angle=Math.atan2(dy,dx)*180/Math.PI;return ((Math.round((90-angle)/45)%8)+8)%8;}
export function frameFor(animation,seconds){if(!animation?.dur?.length||!animation.total)return 0;let tick=(seconds*60)%animation.total;for(let i=0;i<animation.dur.length;i++){if(tick<animation.dur[i])return i;tick-=animation.dur[i];}return animation.dur.length-1;}
export function visibleBottom(animation,direction,frame,source){
 const key=direction+':'+frame;animation.bottoms||=new Map();if(animation.bottoms.has(key))return animation.bottoms.get(key);
 const canvas=source||document.createElement('canvas');if(!source){canvas.width=animation.width;canvas.height=animation.height;}
 const context=canvas.getContext('2d',{willReadFrequently:true});let pixels;
 try{if(!source)context.drawImage(animation.image,frame*animation.width,direction*animation.height,animation.width,animation.height,0,0,animation.width,animation.height);pixels=context.getImageData(0,0,animation.width,animation.height).data;}catch{return animation.height;}
 let bottom=animation.height;outer:for(let y=animation.height-1;y>=0;y--)for(let x=0;x<animation.width;x++)if(pixels[(y*animation.width+x)*4+3]>24){bottom=y+1;break outer;}
 animation.bottoms.set(key,bottom);return bottom;
}
export function spriteFrame(animation,direction,frame,fast=false){
 const key=direction+':'+frame;animation.frames||=new Map();if(animation.frames.has(key))return animation.frames.get(key);
 const canvas=document.createElement('canvas');canvas.width=animation.width;canvas.height=animation.height;
 canvas.getContext('2d').drawImage(animation.image,frame*animation.width,direction*animation.height,animation.width,animation.height,0,0,animation.width,animation.height);
 const result={image:canvas,bottom:visibleBottom(animation,direction,fast?0:frame,fast&&frame!==0?undefined:canvas)};animation.frames.set(key,result);return result;
}
const fetchImage=url=>new Promise(resolve=>{const image=new Image();image.crossOrigin='anonymous';image.onload=()=>resolve(image);image.onerror=()=>resolve(null);image.src=url;});

export function loadArenaSprite(name){
 const id=ids.get(name.replace(/^Mega /,''));
 if(!id)return {ready:false};
 if(cache.has(id))return cache.get(id);
 const sprite={ready:false};cache.set(id,sprite);
 const folder=BASE+pad(id)+'/';
 (async()=>{
  try{
   const response=await fetch(folder+'AnimData.xml');
   if(!response.ok)throw Error(`Sprite ${id}: ${response.status}`);
   const document=new DOMParser().parseFromString(await response.text(),'text/xml');
   if(document.querySelector('parsererror'))throw Error(`Sprite ${id}: XML inválido`);
   const entries=new Map([...document.querySelectorAll('Anim')].map(element=>[element.querySelector('Name')?.textContent,element]));
   const build=async requested=>{
    let element=entries.get(requested);if(!element)return null;
    const alias=element.querySelector('CopyOf')?.textContent;if(alias)element=entries.get(alias)||element;
    const file=element.querySelector('Name')?.textContent;
    const width=Number(element.querySelector('FrameWidth')?.textContent),height=Number(element.querySelector('FrameHeight')?.textContent);
    const dur=[...element.querySelectorAll('Duration')].map(node=>Number(node.textContent)).filter(value=>value>0);
    if(!file||!width||!height||!dur.length)return null;
    const image=await fetchImage(folder+file+'-Anim.png');
    return image?{image,width,height,dur,total:dur.reduce((sum,value)=>sum+value,0)}:null;
   };
   sprite.walk=await build('Walk')||await build('Idle');
   if(!sprite.walk)return;
   sprite.ready=true;
   const [attack,shoot]=await Promise.all([build('Attack'),build('Shoot')]);
   sprite.attack=attack||sprite.walk;
   sprite.shoot=shoot||sprite.attack;
  }catch{sprite.ready=false;}
 })();
 return sprite;
}
