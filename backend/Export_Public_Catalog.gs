/**
 * SILOGBIS — PUBLIC CATALOG EXPORTER V1.1
 * To be pasted as NEW FILE in the EXISTING PRIVATE Apps Script project.
 * No public web app, no external network calls, no tokens, no auto trigger.
 *
 * Requires SILO_INTAKE from the existing Forms V2.2 script.
 * Exported JSON is saved to Internal Operations, NOT directly to public site.
 * Reviewer must manually confirm access + copyright + privacy before export.
 */

const SILO_PUBLIC_EXPORT = Object.freeze({
  gateSheet: 'Public Release Gate',
  catalogSheet: 'Library Catalog 📚',
  reviewSheet: 'Submission Review 📥',
  outputName: 'silogbis-catalog-export.json',
  topics: {
  "Academic Resources": {
    "hubId": "academic",
    "topics": {
      "Course Materials": "course-materials",
      "Open-Access References": "open-references",
      "Study Notes & Learning Guides": "study-notes",
      "Practice & Exam Preparation": "exam-preparation",
      "Academic Templates": "academic-templates"
    }
  },
  "KP & Internship": {
    "hubId": "internship",
    "topics": {
      "Getting Started & Guidelines": "kp-guidelines",
      "Company & Role Insights": "company-insights",
      "KP & Internship Reports": "kp-reports",
      "Experience & Lessons Learned": "kp-lessons",
      "Applications & Templates": "kp-applications"
    }
  },
  "Research & Final Project": {
    "hubId": "research",
    "topics": {
      "Research Topics & Ideas": "research-ideas",
      "Final Project Archive": "final-project-archive",
      "Research Papers & Publications": "papers",
      "Research Methods & Tools": "research-methods",
      "Writing & Submission Templates": "writing-submission"
    }
  },
  "Competition & Skill Development": {
    "hubId": "competition",
    "topics": {
      "Business Case & Mini Case": "business-case",
      "Business Plan & Entrepreneurship": "business-plan",
      "Supply Chain & Logistics": "supply-chain",
      "Data Analytics & AI": "data-ai",
      "Scientific Writing & Innovation": "scientific-writing",
      "Tools & Software Academy": "tools-software",
      "Cross-Competition Toolkit": "competition-toolkit"
    }
  },
  "Alumni & Industry": {
    "hubId": "alumni",
    "topics": {
      "Alumni Stories & Career Paths": "career-stories",
      "Mentoring & Knowledge Sharing": "mentoring",
      "Industry Projects & Collaboration": "industry-collaboration",
      "Opportunities & Events": "opportunities",
      "Approved Alumni Profiles": "approved-profiles"
    }
  }
}
});

/** Run once. Adds ONLY the release checklist tab; preserves other sheets. */
function setupSilogbisPublicReleaseGateV11() {
  const master = siloPublicMaster_();
  let sh = master.getSheetByName(SILO_PUBLIC_EXPORT.gateSheet);
  if (sh) {
    console.log('Release Gate already exists; no changes made.');
    return;
  }
  sh = master.insertSheet(SILO_PUBLIC_EXPORT.gateSheet);
  if (sh.getMaxRows() > 75) sh.deleteRows(76,sh.getMaxRows()-75);
  if (sh.getMaxColumns() > 9) sh.deleteColumns(10,sh.getMaxColumns()-9);
  if (sh.getMaxColumns() < 9) sh.insertColumnsAfter(sh.getMaxColumns(),9-sh.getMaxColumns());
  sh.setHiddenGridlines(true);
  sh.setTabColor('#2166AC');
  sh.getRange('A1:I1').setValues([[
    'Resource ID', 'Rights Verified', 'Privacy Cleared', 'Link Tested Incognito',
    'Release Authorized', 'Reviewer', 'Review Date', 'Review Notes', 'Export Note'
  ]]);
  sh.getRange('A1:I1').setFontWeight('bold').setFontColor('#FFFFFF')
    .setBackground('#174C77').setWrap(true);
  sh.setRowHeight(1, 46);
  sh.setFrozenRows(1);
  sh.getRange('A2:I75').setFontFamily('Arial').setFontSize(10).setVerticalAlignment('middle');
  sh.setColumnWidth(1,175);
  for (let c=2;c<=5;c++) sh.setColumnWidth(c,145);
  sh.setColumnWidth(6,160);
  sh.setColumnWidth(7,140);
  sh.setColumnWidth(8,330);
  sh.setColumnWidth(9,270);
  const choice=SpreadsheetApp.newDataValidation().requireValueInList(['Yes','No'],true).setAllowInvalid(false).build();
  sh.getRange('B2:E75').setDataValidation(choice);
  sh.getRange('A1:I75').createFilter();
  sh.getRange('A2').setNote('Isi Resource ID yang persis sama dengan Library Catalog kolom B. Jangan gunakan TEST atau data privat.');
  sh.getRange('D2').setNote('Uji URL sebagai pengunjung via Incognito, tanpa akun SILOGBIS. Jangan hanya mengandalkan tampilan admin.');
  sh.getRange('E2').setNote('Yes = keputusan eksplisit reviewer untuk menampilkan judul, metadata dan link di situs publik.');
  console.log('Created Public Release Gate in Master. No catalog data copied.');
}

function siloPublicMaster_(){
  if (typeof SILO_INTAKE === 'undefined' || !SILO_INTAKE.MASTER_ID) {
    throw Error('SILO_INTAKE.MASTER_ID not found. Use the EXISTING private Apps Script project.');
  }
  const ss=SpreadsheetApp.openById(SILO_INTAKE.MASTER_ID);
  if(!ss.getSheetByName(SILO_PUBLIC_EXPORT.catalogSheet)||
     !ss.getSheetByName(SILO_PUBLIC_EXPORT.reviewSheet)) {
    throw Error('Master Control schema is not the expected Blue V2.');
  }
  return ss;
}

function siloPublicRows_(sheet, startColumn, count){
  const last=sheet.getLastRow();
  return last<2 ? [] : sheet.getRange(2,startColumn,last-1,count).getValues();
}
function siloPublicCatalogRows_(sheet){
  const last=sheet.getLastRow();
  return last<8 ? [] : sheet.getRange(8,2,last-7,12).getValues();
}
function siloPublicReviewRows_(sheet){
  const last=sheet.getLastRow();
  return last<8 ? [] : sheet.getRange(8,2,last-7,13).getValues();
}

/** Pure function: supports testing without Google access. */
function siloPublicCurate_(catalogRows, reviewRows, gateRows){
  const byCatalogId = new Map();
  for(const r of reviewRows){
    const id=String(r[12]||'').trim();
    if(id){
      if(!byCatalogId.has(id))byCatalogId.set(id,[]);
      byCatalogId.get(id).push(r);
    }
  }
  const byGateId=new Map();
  for(const g of gateRows){
    const id=String(g[0]||'').trim();
    if(id){
      if(!byGateId.has(id))byGateId.set(id,[]);
      byGateId.get(id).push(g);
    }
  }
  const out=[], errors=[], ids=new Set();
  const yes=x=>String(x||'').trim().toLowerCase()==='yes';
  const str=x=>String(x??'').trim();
  for(const c of catalogRows){
    const [id,title,hubName,topicName,keywords,year,contributor,access,url,status,lastReviewed,metaStatus]=c;
    const resourceId=str(id);
    if(!resourceId)continue;
    if(status!=='Published'||access!=='Public')continue;
    const reject=reason=>errors.push(resourceId+': '+reason);
    if(ids.has(resourceId)){reject('duplicate resource ID');continue;}
    ids.add(resourceId);
    if(/^TEST([ -]|$)/i.test(str(title))){reject('TEST record');continue;}
    if(str(metaStatus)!=='Complete'){reject('metadata incomplete');continue;}
    const hub=SILO_PUBLIC_EXPORT.topics[hubName];
    if(!hub){reject('unknown hub');continue;}
    const topicId=hub.topics[topicName];
    if(!topicId){reject('subtopic must equal exact taxonomy title');continue;}
    if(!str(title)){reject('empty title');continue;}
    if(!str(lastReviewed)){reject('missing last reviewed date');continue;}
    const gate=byGateId.get(resourceId)||[];
    if(gate.length!==1){reject('missing or duplicate Public Release Gate row');continue;}
    const g=gate[0];
    if(![g[1],g[2],g[3],g[4]].every(yes)||!str(g[5])||!str(g[6])){
      reject('Release Gate requires four Yes + reviewer + review date');continue;
    }
    const matchingReviews=byCatalogId.get(resourceId)||[];
    if(matchingReviews.length!==1){reject('needs exactly one matching verified submission');continue;}
    const review=matchingReviews[0];
    if(!yes(review[6])||str(review[7])!=='Cleared'||
       !['Approved','Published'].includes(str(review[8]))||!str(review[9])){
      reject('submission rights / privacy / reviewer not cleared');continue;
    }
    let parsed;
    try{parsed=new URL(str(url));}catch{reject('bad URL');continue;}
    if(parsed.protocol!=='https:'||parsed.username||parsed.password){reject('URL must be plain HTTPS');continue;}
    if(['script.google.com','accounts.google.com'].includes(parsed.hostname)){
      reject('do not expose script/admin account links');continue;
    }
    if(parsed.hostname==='drive.google.com'&&parsed.pathname.startsWith('/drive/folders/')){
      reject('do not publish an entire Drive folder');continue;
    }
    out.push({
      id:resourceId,
      title:str(title).slice(0,180),
      summary:'Referensi terkurasi untuk topik '+str(topicName).slice(0,120)+'.',
      type:'Learning Resource',
      year:str(year).slice(0,10),
      hubId:hub.hubId,
      topicId,
      url:str(url),
      status:'Published',
      accessLevel:'Public',
      rightsVerified:true,
      privacyCleared:true
    });
  }
  return {items:out,skipped:errors};
}

/** Run after human review. Saves JSON in PRIVATE Internal Operations. */
function exportSilogbisPublicCatalogV11(){
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(30000))throw Error('Export sedang berjalan; jangan dijalankan paralel.');
  try{
    const ss=siloPublicMaster_();
    const gate=ss.getSheetByName(SILO_PUBLIC_EXPORT.gateSheet);
    if(!gate)throw Error('Run setupSilogbisPublicReleaseGateV11 once first.');
    const result=siloPublicCurate_(
      siloPublicCatalogRows_(ss.getSheetByName(SILO_PUBLIC_EXPORT.catalogSheet)),
      siloPublicReviewRows_(ss.getSheetByName(SILO_PUBLIC_EXPORT.reviewSheet)),
      siloPublicRows_(gate,1,9)
    );
    const json=JSON.stringify(result.items,null,2)+'\n';
    const operations=DriveApp.getFolderById(SILO_INTAKE.OPERATIONS_ID);
    const adminFolders=operations.getFoldersByName('Administration');
    if(!adminFolders.hasNext())throw Error('Private Administration folder missing.');
    const admin=adminFolders.next();
    if(adminFolders.hasNext())throw Error('Duplicate Administration folder.');
    const matches=admin.getFilesByName(SILO_PUBLIC_EXPORT.outputName);
    let file;
    if(matches.hasNext()){
      file=matches.next();
      if(matches.hasNext())throw Error('Duplicate public export file. Resolve manually.');
      if(file.getMimeType()!=='text/plain')throw Error('Export name collision with a non-text file.');
      file.setContent(json);
    }else{
      file=admin.createFile(SILO_PUBLIC_EXPORT.outputName,json,MimeType.PLAIN_TEXT);
    }
    console.log('=== PUBLIC CATALOG EXPORT READY (PRIVATE) ===');
    console.log('Number of approved public resource records: '+result.items.length);
    console.log('Rejected/skipped records: '+result.skipped.length);
    result.skipped.forEach(x=>console.warn('HELD: '+x));
    console.log('Private export file URL: '+file.getUrl());
    console.log('Next: download this file, replace public/data/catalog.json in GitHub, commit.');
    console.log('No Drive permissions, publication statuses, or GitHub resources changed.');
    return file.getUrl();
  }finally{lock.releaseLock();}
}
