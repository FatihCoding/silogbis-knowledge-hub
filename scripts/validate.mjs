import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(process.cwd(),'public');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=p=>JSON.parse(read(p));
const taxonomy=data('data/taxonomy.json');
const catalog=data('data/catalog.json');
const config=data('data/site-config.json');
const routes={academic:'academic',internship:'kp-internship',research:'research',competition:'competition',alumni:'alumni'};
assert.equal(taxonomy.length,5,'Need exactly five hubs');
const ids=new Set(),topics=new Set();
for(const h of taxonomy){
 assert.ok(routes[h.id],`Unknown hub ${h.id}`);assert.ok(!ids.has(h.id),`Duplicate hub ${h.id}`);ids.add(h.id);
 assert.ok(h.topics.length>=1,`Empty topics ${h.id}`);
 for(const t of h.topics){assert.ok(!topics.has(h.id+'/'+t.id),'Duplicate topic');topics.add(h.id+'/'+t.id)}
}
assert.equal(topics.size,27,'Expected 27 approved taxonomy topics');
for(const f of ['index.html',...Object.values(routes).map(x=>x+'/index.html'),'404.html']){
 const html=read(f);assert.match(html,/<meta name="robots" content="noindex,nofollow">/,'Pilot noindex must be in '+f);
 assert.match(html,/<title>[^<]+<\/title>/,'Title missing in '+f);
 assert.match(html,/href="\/assets\/styles.css"/,'Shared CSS missing in '+f);
 assert.match(html,/src="\/assets\/app.js"/,'Shared JS missing in '+f);
}
assert.ok(fs.existsSync(path.join(root,'assets','silogbis-logo.png')),'Official logo missing');
assert.ok(fs.existsSync(path.join(root,'assets','silogbis-mark.png')),'Official mark missing');
assert.ok(Array.isArray(catalog),'Catalog must be JSON array');
const unique=new Set();
const https=(url)=>{try{const u=new URL(url);return u.protocol==='https:'&&!u.username&&!u.password&&!/\s/.test(String(url))}catch{return false}};
for(const r of catalog){
 assert.equal(r.status,'Published','Unpublished record is not allowed in public JSON');
 assert.equal(r.accessLevel,'Public','Internal data is forbidden in public JSON');
 assert.equal(r.rightsVerified,true,'Rights gate required');
 assert.equal(r.privacyCleared,true,'Privacy gate required');
 assert.ok(r.id&&r.title&&r.url,'Missing visible public data');
 assert.ok(!unique.has(r.id),'Duplicate resource IDs');unique.add(r.id);
 assert.ok(topics.has(r.hubId+'/'+r.topicId),'Taxonomy mismatch');
 assert.ok(https(r.url),'All public URLs must be HTTPS');
 const u=new URL(r.url);
 assert.ok(!['script.google.com','accounts.google.com','mail.google.com','admin.google.com'].includes(u.hostname),'Admin URL forbidden');
 assert.ok(!(u.hostname==='drive.google.com'&&u.pathname.startsWith('/drive/folders/')),'Drive folder URL forbidden');
 assert.ok(!(u.hostname==='docs.google.com'&&u.pathname.includes('/forms/')),'Google Forms URL forbidden');
 for(const key of ['email','phone','whatsapp','contactEmail','rawResponse','privateNotes','accessToken','reviewer'])assert.ok(!(key in r),`Sensitive field forbidden: ${key}`);
}
assert.ok(['pilot','public'].includes(config.mode),'Site mode must be pilot or public');
if(config.mode==='public'){
 assert.ok(catalog.length>=1,'Public launch requires at least one approved resource');
 for(const file of ['index.html',...Object.values(routes).map(x=>x+'/index.html')])assert.ok(!/name="robots" content="noindex/.test(read(file)),'Public launch cannot keep noindex meta');
 assert.ok(!/X-Robots-Tag:\s*noindex/i.test(read('_headers')),'Public launch cannot keep noindex header');
}
for(const [hubId,x] of Object.entries(config.internalAccess||{})){
 assert.ok(ids.has(hubId),'Unknown internal hub');
 if(x.enabled){assert.equal(x.aclVerified,true,'Internal link requires ACL verified');assert.ok(https(x.url),'Invalid internal URL');const domain=new URL(x.url).hostname;assert.ok(['drive.google.com','sites.google.com'].includes(domain),'Internal links only to Google ACL-gated folders/sites');}
}
// V3.1 direct links are shortcuts, not grants of access.
const privateIds=['1NCXTGcQ1r7GtOjh5SLVXBOo-9xGeQ75PCWX-RQXJLA8','10c5zVlJoriw6ufbm1TXf2pbGj6RTX0f-09-mMg3Z60I'];
const rootFolder=config.rootFolder||{};
if(rootFolder.enabled){assert.ok(rootFolder.aclVerified,'Root shortcut must have ACL verification');assert.ok(https(rootFolder.url),'Root shortcut URL invalid');assert.equal(new URL(rootFolder.url).hostname,'drive.google.com')}
for(const [hubId,links] of Object.entries(config.quickLinks||{})){
 assert.ok(ids.has(hubId),'Unrecognized shortcut hub');assert.ok(Array.isArray(links),'shortcuts should be a list');
 for(const link of links){
  if(link.enabled){assert.equal(link.verified,true,'Direct shortcut needs verified permission');assert.ok(https(link.url),'Invalid shortcut URL');const u=new URL(link.url);assert.ok(u.hostname==='drive.google.com'&&u.pathname.startsWith('/drive/folders/')||u.hostname==='docs.google.com'&&u.pathname.startsWith('/spreadsheets/d/'),'Only approved Drive folders or Sheets shortcuts permitted');}
  for(const forbidden of privateIds)assert.ok(!JSON.stringify(link).includes(forbidden),'Private admin spreadsheet accidentally exposed');
 }
}
for(const f of config.forms||[]){
 if(f.enabled){assert.ok(f.qaVerified&&f.privacyNoticeApproved,'Forms must pass QA and privacy review');assert.ok(https(f.url),'Form URL required');const u=new URL(f.url);assert.equal(u.hostname,'docs.google.com','Form must point to Google Forms');assert.match(u.pathname,/^\/forms\/d\/e\/[^/]+\/viewform\/?$/,'Use the RESPONDER form URL');}
}
const forbiddenPatterns=[/script\.google\.com\/macros\/s\//i,/docs\.google\.com\/spreadsheets\/d\/[^\s"'<]+/i];
// Avoid committing administrative IDs into the public build; check JS/JSON/HTML content only.
for(const file of fs.readdirSync(path.join(root,'data')).map(x=>'data/'+x).concat(['assets/app.js','index.html'])){
 const str=read(file);for(const pattern of forbiddenPatterns)assert.ok(!pattern.test(str),`Unexpected private backend link in ${file}`);
}
console.log(`PASS: six pages, five hubs, ${topics.size} subcategories, ${catalog.length} public catalog records`);
console.log('PASS: pilot noindex, physical routes, safe links, private metadata separation, hybrid config');
