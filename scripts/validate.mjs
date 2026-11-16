import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../public');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'data',name),'utf8'));
const hubs=read('taxonomy.json');const catalog=read('catalog.json');const config=read('site-config.json');
const errors=[];const add=x=>errors.push(x);
if(!Array.isArray(hubs)||hubs.length!==5)add('Exactly five public hubs are required.');
const ids=new Set(),topicIds=new Set();let topicCount=0;
for(const h of hubs){if(!h.id||!h.name||!Array.isArray(h.topics))add('Invalid hub.');if(ids.has(h.id))add('Duplicate hub ID: '+h.id);ids.add(h.id);for(const t of h.topics||[]){topicCount++;if(!t.id||!t.name||!Array.isArray(t.keywords))add('Invalid topic.');const key=h.id+':'+t.id;if(topicIds.has(key))add('Duplicate topic: '+key);topicIds.add(key);}}
if(!Array.isArray(catalog))add('catalog.json must be an array.');
const resourceIds=new Set();
for(const r of Array.isArray(catalog)?catalog:[]){if(resourceIds.has(r.id))add('Duplicate resource ID: '+String(r.id));resourceIds.add(r.id);if(r.status!=='Published'||r.accessLevel!=='Public'||r.rightsVerified!==true||r.privacyCleared!==true)add('Unsafe record in public catalog: '+String(r.id));if(!topicIds.has(r.hubId+':'+r.topicId))add('Invalid hub/topic mapping: '+String(r.id));try{const u=new URL(r.url);if(u.protocol!=='https:'||u.username||u.password)add('Invalid HTTPS URL: '+String(r.id));}catch{add('Invalid URL: '+String(r.id));}if(!r.title||!r.id)add('Catalog record missing id/title.');}
if(!['pilot','public'].includes(config.mode))add('mode must be pilot or public.');
if(!Array.isArray(config.forms)||config.forms.length!==3)add('Exactly 3 contribution form configs required.');
for(const f of config.forms||[]){
  if(f.enabled){
    if(f.qaVerified!==true||f.privacyNoticeApproved!==true)add('Enabled Form missing human approval flags: '+f.id);
    try{
      const u=new URL(f.url);
      if(u.protocol!=='https:'||u.hostname!=='docs.google.com'||!/^\/forms\/d\/e\/[^/]+\/viewform\/?$/.test(u.pathname))
        add('Enabled Form URL must be a respondent viewform URL: '+f.id);
    }catch{add('Enabled form has no valid Google Forms URL: '+f.id);}
  }
  if(!f.enabled && f.url)add('A disabled Form should not store its URL in public JSON: '+f.id);
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');const hasNoIndex=html.includes('name="robots" content="noindex,nofollow"');
if(config.mode==='pilot'&&!hasNoIndex)add('Pilot must remain noindex.');
if(config.mode==='public'&&hasNoIndex)add('Public launch still has noindex; require explicit release edit.');
if(config.mode==='public'&&Array.isArray(catalog)&&catalog.length<3)add('Launch requires at least three permission-cleared public resources.');
if(!fs.existsSync(path.join(root,'assets/silogbis-logo.png')))add('Official logo missing.');
// Block accidental inclusion of internal Google IDs and Form edit links.
const publicFiles=['index.html','data/catalog.json','data/site-config.json','assets/app.js'];
const unsafeTokens=['1NCXTGcQ1r7GtOjh5SLVXBOo-9xGeQ75PCWX-RQXJLA8','10c5zVlJoriw6ufbm1TXf2pbGj6RTX0f-09-mMg3Z60I','1bwrvOP7bJhqrcMvI3ayhbni2eIfFqkVa','AKfycbyTnPeAG_RjLiVTqAzhPxM5CtxnrSQtSv3dBM78E07uesLBWnrxwr5LD3DrfXVkS5mI'];
for(const fname of publicFiles){const content=fs.readFileSync(path.join(root,fname),'utf8');for(const token of unsafeTokens){if(content.includes(token))add('Internal reference leaked in public/'+fname);}}
if(errors.length){console.error('SECURITY / BUILD FAILED:');for(const e of errors)console.error(' - '+e);process.exit(1);}
console.log(`PASS — ${hubs.length} hubs, ${topicCount} topics, ${catalog.length} publicly validated resources, mode=${config.mode}`);
console.log('PASS — No private database IDs in public assets; homepage index policy consistent.');
