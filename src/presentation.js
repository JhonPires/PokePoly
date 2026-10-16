// O modal só pode abrir depois de toda a apresentação da jogada.
export const pacing={spin:1100,result:1200,step:380,arrival:1100};
export async function presentRoll({spin,reveal,advance,arrive,open,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))}){
 await spin(pacing.spin);
 const steps=await reveal();
 await wait(pacing.result);
 for(let i=0;i<steps;i++){await advance(i);await wait(pacing.step);}
 await arrive();
 await wait(pacing.arrival);
 await open();
}
