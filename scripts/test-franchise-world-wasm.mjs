import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {WASI,File,OpenFile,ConsoleStdout}from '@bjorn3/browser_wasi_shim';
const wasi=new WASI(['franchise'],['TZ=UTC'],[new OpenFile(new File([])),ConsoleStdout.lineBuffered(console.log),ConsoleStdout.lineBuffered(console.error)]);
const {instance}=await WebAssembly.instantiate(await fs.readFile('public/franchise/franchise.wasm'),{wasi_snapshot_preview1:wasi.wasiImport});const w=instance.exports;wasi.initialize(instance);
function call(req){const b=new TextEncoder().encode(JSON.stringify(req)),p=w.hk_alloc(b.length);new Uint8Array(w.memory.buffer,p,b.length).set(b);try{const q=w.hk_dispatch(p,b.length),n=w.hk_result_length();const r=JSON.parse(new TextDecoder().decode(new Uint8Array(w.memory.buffer,q,n)));assert.equal(r.error,undefined);return r;}finally{w.hk_free(p);}}
const data={};for(const n of['teams','players','staff'])data['Data/'+n+'.json']=await fs.readFile('public/franchise/Data/'+n+'.json','utf8');
let frame=call({op:'init',data,files:{},photoOffset:0});const action=a=>{assert.ok(frame.areas.some(x=>x.action===a),'Visible action '+a);frame=call({op:'action',action:a});return frame;};
action('careers');action('new:1');action('newcustomclub');action('clubedit:name');frame=call({op:'clubtext',value:'Utrecht Comets'});action('clubcreate');action('tour:skip');action('group:1');action('tab:19');assert.equal(frame.tab,19);assert.ok(frame.areas.some(a=>a.action==='worldstyle'));
for(let n=0;n<4&&!frame.areas.some(a=>a.action==='worldplayer:expansion-2026-25');n++)action('officenext');
action('worldplayer:expansion-2026-25');action('releasecheck:expansion-2026-25');action('releasedo:expansion-2026-25');
let raw=call({op:'export',slot:1}).payload;assert.equal(JSON.parse(raw).players.find(p=>p.profile.id==='expansion-2026-25').club,-1);
action('group:0');action('tab:0');action('simmonth');assert.equal(frame.tab,1);assert.equal(frame.autoSim,true);
for(let n=0;n<24;n++){const next=call({op:'tick'});if(next.commands)frame=next;}assert.ok(frame.day>=1);assert.ok(frame.commands.some(c=>c[0]==='text'&&c[1].includes('SIMULATING')));action('stop');const paused=frame.day;for(let n=0;n<24;n++)call({op:'tick'});assert.equal(call({op:'draw'}).day,paused);
console.log('PASS: release-build Wasm action routing, custom identity, release, automatic calendar, visible progress and pause');
