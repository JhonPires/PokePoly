import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {encounters} from './encounters.js';
import {spriteFor} from './sprites.js';
import {presentRoll,pacing} from './presentation.js';
test('modal abre somente após resultado, todos os saltos e pausa de chegada',async()=>{const events=[];await presentRoll({spin:async duration=>events.push(['spin',duration]),reveal:()=>{events.push('result');return 3;},advance:i=>events.push('step'+i),arrive:()=>events.push('arrived'),open:()=>events.push('modal'),wait:async ms=>events.push(['wait',ms])});assert.deepEqual(events,[['spin',pacing.spin],'result',['wait',pacing.result],'step0',['wait',pacing.step],'step1',['wait',pacing.step],'step2',['wait',pacing.step],'arrived',['wait',pacing.arrival],'modal']);});
test('jogada sem deslocamento também mostra resultado antes do modal',async()=>{const events=[];await presentRoll({spin:async()=>{},reveal:()=>0,advance:()=>assert.fail('não deve mover'),arrive:()=>events.push('arrival'),open:()=>events.push('modal'),wait:async ms=>events.push(ms)});assert.deepEqual(events,[pacing.result,'arrival',pacing.arrival,'modal']);});
test('todos os candidatos e evoluções possuem GIF local',()=>{for(const group of encounters)for(const line of group.options)for(const name of line){const src=spriteFor(name);assert.ok(src,name);assert.ok(existsSync(src),`${name}: ${src}`);}});
