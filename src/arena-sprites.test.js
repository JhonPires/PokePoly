import test from 'node:test';
import assert from 'node:assert/strict';
import {directionFor,frameFor,spriteFrame} from './arena-sprites.js';

test('orientação acompanha as oito direções da folha de sprites',()=>{assert.equal(directionFor(0,1),0);assert.equal(directionFor(1,0),2);assert.equal(directionFor(0,-1),4);assert.equal(directionFor(-1,0),6);});
test('quadros respeitam as durações declaradas no XML',()=>{const animation={dur:[8,10,8],total:26};assert.equal(frameFor(animation,0),0);assert.equal(frameFor(animation,8/60),1);assert.equal(frameFor(animation,18/60),2);assert.equal(frameFor(animation,26/60),0);});
test('quadro de sprite é recortado uma única vez',()=>{const previous=globalThis.document;let draws=0;try{globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({drawImage(){draws++;},getImageData:()=>({data:new Uint8ClampedArray(4*4*4).fill(255)})})})};const animation={image:{},width:4,height:4};const first=spriteFrame(animation,2,0,true);assert.equal(first.bottom,4);assert.equal(spriteFrame(animation,2,0,true),first);assert.equal(draws,1);}finally{globalThis.document=previous;}});
