import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('manifesto instalável usa o escopo do GitHub Pages e ícones PNG válidos',async()=>{
 const root=new URL('../',import.meta.url);
 const manifest=JSON.parse(await readFile(new URL('manifest.webmanifest',root),'utf8'));
 assert.equal(manifest.start_url,'./index.html');
 assert.equal(manifest.scope,'./');
 assert.equal(manifest.display,'standalone');
 for(const size of [192,512]){
  const icon=manifest.icons.find(item=>item.sizes===`${size}x${size}`);
  assert.ok(icon,`Ícone ${size} ausente`);
  const png=await readFile(new URL(icon.src,root));
  assert.equal(png.subarray(1,4).toString(),'PNG');
  assert.equal(png.readUInt32BE(16),size);
  assert.equal(png.readUInt32BE(20),size);
 }
 const html=await readFile(new URL('index.html',root),'utf8');
 assert.match(html,/rel="manifest" href="manifest.webmanifest"/);
 assert.match(html,/rel="apple-touch-icon" href="assets\/brand\/apple-touch-icon.png"/);
});
