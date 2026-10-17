let context;
let enabled=true;
try{enabled=localStorage.getItem('pokepoly-sound')!=='off';}catch{}

export const soundEnabled=()=>enabled;
export function setSoundEnabled(value){enabled=!!value;try{localStorage.setItem('pokepoly-sound',enabled?'on':'off');}catch{}return enabled;}

export function playSound(kind,variant=0){
 if(!enabled)return;
 try{
  context||=new (window.AudioContext||window.webkitAudioContext)();
  if(context.state==='suspended')context.resume();
  const motifs={roll:[[280,0,.06],[350,.07,.06],[420,.14,.08]],step:[[variant%2?520:460,0,.075]],capture:[[480,0,.09],[650,.1,.09],[870,.2,.18]],upgrade:[[440,0,.08],[590,.1,.08],[740,.2,.08],[990,.3,.2]],event:[[700,0,.08],[840,.1,.12]],victory:[[440,0,.12],[550,.14,.12],[660,.28,.12],[880,.42,.4]],attack:[[520,0,.08],[690,.055,.09]],impact:[[170,0,.12],[110,.07,.14]],dash:[[380,0,.08],[660,.06,.1]]};
  for(const [frequency,offset,duration] of motifs[kind]||[]){
   const oscillator=context.createOscillator(),gain=context.createGain(),start=context.currentTime+offset;
   oscillator.type=kind==='step'?'sine':'triangle';oscillator.frequency.setValueAtTime(frequency,start);
   gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(kind==='step'?.035:.07,start+.018);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
   oscillator.connect(gain).connect(context.destination);oscillator.start(start);oscillator.stop(start+duration+.02);
  }
 }catch{}
}
