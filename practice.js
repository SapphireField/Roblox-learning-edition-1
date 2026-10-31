// Local-only practice material. No translation or upload service is used.
let practiceItems=[];
let importVersion=0;
function importBusy(busy){for(const id of ['applyPractice','practiceText'])$(id).disabled=busy;}
function parsePractice(text){
 if(text.length>12000)throw Error('Please use at most 12,000 characters.');
 const items=[];
 for(const line of text.normalize('NFC').split(/\r?\n/).map(s=>s.trim()).filter(Boolean)){
  const parts=line.split('|').map(s=>s.trim());
  if(parts.length>1){if(parts.length>3||!/[\p{Script=Han}]/u.test(parts[0])||!parts[1])throw Error('Use Chinese | meaning | optional pinyin on each vocabulary line.');if(parts[0].length>80)throw Error('Vocabulary entries must be at most 80 characters.');items.push({word:parts[0],meaning:parts[1],pinyin:parts[2]||''});}
  else {for(const sentence of line.split(/[。！？!?]/u).map(s=>s.trim()).filter(Boolean)){if(!/\p{Script=Han}/u.test(sentence))continue;const chunks=sentence.match(/[\p{Script=Han}]+/gu)||[];const target=chunks.sort((a,b)=>b.length-a.length)[0];const word=[...target].slice(-Math.min(4,[...target].length)).join('');items.push({word,context:sentence.replace(target,target.slice(0,target.length-word.length)+'＿＿'),source:sentence});}}
 }
 if(!items.length)throw Error('Enter at least one Chinese word or Chinese passage.');
 if(items.length>150)throw Error('Please use at most 150 vocabulary entries or sentences.');
 return items;
}
function customPracticeQuestions(tier){return practiceItems.map(item=>{
 const hint=item.meaning?`Write the Chinese for “${item.meaning}”${tier===0&&item.pinyin?' ('+item.pinyin+')':''}.`:item.context==='＿＿'?`Recall your practice word (${[...item.word].length} Chinese characters).`:`Fill the missing Chinese characters: ${item.context}`;
 return {subject:'Chinese · Your practice',typed:true,data:[hint,[item.word],`Practice answer: ${item.word}${item.meaning?' — '+item.meaning:''}${item.pinyin?' ('+item.pinyin+')':''}.` ]};
})}
function applyPractice(){try{const parsed=parsePractice($('practiceText').value);practiceItems=parsed;$('subject').value='Chinese';$('practiceStatus').textContent=`Ready: ${parsed.length} practice challenges. Review your text before starting; type Chinese answers during the game. Higher modes remove pinyin hints and shorten response time.`;}catch(e){$('practiceStatus').textContent=e.message}}
$('applyPractice').onclick=applyPractice;
$('clearPractice').onclick=()=>{importVersion++;importBusy(false);practiceItems=[];$('practiceText').value='';$('practiceFile').value='';$('practiceStatus').textContent='Built-in Chinese questions restored.'};
$('practiceFile').onchange=async()=>{
 const version=++importVersion;importBusy(false);
 const file=$('practiceFile').files[0];if(!file)return;
 const pdf=/\.pdf$/i.test(file.name),txt=/\.txt$/i.test(file.name);
 if((!pdf&&!txt)||file.size>(pdf?10*1024*1024:48000)){$('practiceStatus').textContent='Choose a PDF up to 10 MB or a UTF-8 .txt file up to 48 KB.';return}
 importBusy(true);$('practiceStatus').textContent=pdf?'Opening PDF…':'Reading text…';
 try{
  const text=pdf?await extractPdfPractice(file,message=>{if(version===importVersion)$('practiceStatus').textContent=message}):await file.text();
  if(version!==importVersion)return;
  parsePractice(text);$('practiceText').value=text;
  $('practiceStatus').textContent='Text loaded. Review and correct it below, then click Use this practice. Your current practice stays active until you apply the new text.';
 }catch(e){if(version===importVersion)$('practiceStatus').textContent='Could not load practice: '+e.message}
 finally{if(version===importVersion)importBusy(false)}
};
