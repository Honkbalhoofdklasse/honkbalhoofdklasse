import {chromium,webkit,firefox,expect} from '@playwright/test';
import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';
const engine=process.env.FRANCHISE_BROWSER||'chrome',type=({chrome:chromium,webkit,firefox})[engine];
const profile=await fs.mkdtemp(path.join(os.tmpdir(),'hk-world-test-'));
const ctx=await type.launchPersistentContext(profile,{...(engine==='chrome'?{channel:'chrome'}:{}),headless:true,viewport:{width:1600,height:930}});
await ctx.route('**/api/franchise/**',r=>r.fulfill({json:r.request().url().endsWith('/session')?{user:null,configured:false}:{saves:[]}}));
const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
const click=async a=>{await page.locator(`[data-action="${a}"]`).click();await page.waitForTimeout(200);};
const shot=async label=>page.screenshot({path:`../work/web-parity/070-${engine}-${label}.png`});
const exportSave=async()=>{await page.locator('#account').click();const dl=page.waitForEvent('download');await page.locator('#export').click();const file=await dl;const raw=await fs.readFile(await file.path(),'utf8');await page.locator('#close-account').click();return JSON.parse(raw);};
try{
await page.goto(process.env.FRANCHISE_TEST_URL||'http://127.0.0.1:3100/franchise/game.html');
await page.locator('[data-action="careers"]').waitFor({timeout:60000});await click('careers');await click('new:1');await click('newcustomclub');
for(const [field,value]of [['name','Utrecht Comets'],['city','Utrecht'],['abbr','COM']]){await click('clubedit:'+field);await expect(page.locator('#club-text-dialog')).toBeVisible();await page.locator('#club-text-input').fill(value);await page.locator('#club-text-form button[type="submit"]').click();await expect(page.locator('#club-text-dialog')).not.toBeVisible();}
await click('clubbadge:1');await click('clubcolor:5');await shot('creator');await click('clubcreate');await click('tour:skip');
await expect(page.locator('[data-action="simmonth"]')).toBeVisible();let initial=await exportSave();
if(initial.clubs.length!==8||initial.user!==7||initial.customClub.name!=='Utrecht Comets'||initial.customClub.badge!==1)throw Error('Custom identity or league missing');
await click('group:1');await click('tab:19');await expect(page.locator('[data-action="worldstyle"]')).toBeVisible();await shot('front-office');
for(let n=0;n<4 && !(await page.locator('[data-action="worldplayer:expansion-2026-25"]').count());n++)await click('officenext');
await click('worldplayer:expansion-2026-25');await shot('player-contract');await click('releasecheck:expansion-2026-25');await shot('release');await click('releasedo:expansion-2026-25');
let saved=await exportSave();if(saved.players.find(p=>p.profile.id==='expansion-2026-25').club!==-1||saved.clubs[7].roster.length!==27)throw Error('Release not persisted');
await click('worldstyle');await click('worldstyle:1');await shot('style');await click('worldback');
await click('group:0');await click('tab:15');await click('automate:contracts');await click('automate:events');await shot('automation');
await click('group:4');await click('tab:20');await shot('story');
await click('group:0');await click('tab:0');await click('simmonth');
await expect(page.locator('[data-action="today"]')).toBeVisible();await expect(page.locator('[data-action="stop"]')).toBeVisible();
await page.waitForTimeout(1800);await shot('simulating');await click('stop');await expect(page.locator('[data-action="stop"]')).toHaveCount(0);
const paused=await exportSave();if(paused.day<1)throw Error('Calendar did not advance');await page.waitForTimeout(750);const pausedAgain=await exportSave();if(pausedAgain.day!==paused.day||pausedAgain.schedule.filter(g=>g.awayRuns!=null).length!==paused.schedule.filter(g=>g.awayRuns!=null).length)throw Error('Stop did not freeze simulation');
await page.reload();await page.locator('[data-action="careers"]').waitFor({timeout:60000});await click('careers');await click('load:1');saved=await exportSave();
if(!saved.world.autoContracts||!saved.world.autoEvents||saved.world.styles[7]!==1||saved.players.find(p=>p.profile.id==='expansion-2026-25').club!==-1)throw Error('World state did not survive reload');
// Import an isolated generated offseason fixture; no real career or account is touched.
if(!process.env.FRANCHISE_TEST_URL){await page.locator('#account').click();await page.locator('#save-slot').selectOption('2');await page.locator('#save-file').setInputFiles('game-runtime/.test-native/world/offseason.json');await expect(page.locator('#account-message')).toContainText('geïmporteerd');await page.locator('#close-account').click();await click('load:2');await click('group:1');await click('tab:19');await expect(page.locator('[data-action="worldstyle"]')).toBeVisible();await shot('offseason');await click('office:1');await page.locator('[data-action^="offerplayer:"]').first().click();await shot('negotiation');await click('worldback');await click('winteradvance');await expect(page.locator('[data-action="winteradvance"]')).toBeVisible();}
if(errors.length)throw Error(errors.join('\n'));console.log('PASS: eight-club creator text/badge, release review and persistence, style, automation, story, reload and offseason controls');
}finally{await ctx.close();await fs.rm(profile,{recursive:true,force:true});}
