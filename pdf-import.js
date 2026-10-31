// Bundled PDF.js 6.4.299, Apache-2.0. Documents remain on the user's device.
async function extractPdfPractice(file, onProgress = () => {}) {
 if(location.protocol==='file:')throw Error('PDF import needs a web server. Run python3 -m http.server 8000 and open http://localhost:8000, or use the hosted game. You can still paste text directly.');
 const pdfjs=await import('./vendor/pdfjs/pdf.min.mjs');
 pdfjs.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.min.mjs',document.baseURI).href;
 const base=new URL('./vendor/pdfjs/',document.baseURI);
 const task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),cMapUrl:new URL('cmaps/',base).href,cMapPacked:true,standardFontDataUrl:new URL('standard_fonts/',base).href,wasmUrl:new URL('wasm/',base).href,isEvalSupported:false});
 try {
  const pdf=await task.promise;
  if(pdf.numPages>50)throw Error('This PDF has more than 50 pages. Upload a shorter excerpt.');
  const pages=[];let length=0;
  for(let n=1;n<=pdf.numPages;n++){
   onProgress(`Reading PDF page ${n} of ${pdf.numPages}…`);
   const page=await pdf.getPage(n),content=await page.getTextContent();let line='',text='';
   for(const item of content.items){if(typeof item.str!=='string')continue;
    // Separate Latin words without inserting artificial spaces between Chinese glyphs.
    if(/[A-Za-z0-9]$/.test(line)&&/^[A-Za-z0-9]/.test(item.str))line+=' ';
    line+=item.str;if(item.hasEOL){text+=line+'\n';line=''}
   }
   text+=line;pages.push(text);length+=text.length+1;page.cleanup();
   if(length>12000)throw Error('Extracted text exceeds 12,000 characters. Upload a shorter PDF excerpt.');
  }
  const text=pages.join('\n').trim();
  if(!/\p{Script=Han}/u.test(text))throw Error('No selectable Chinese text was found. Scanned/image PDFs need OCR first; copy the OCR text into the practice box.');
  return text;
 }catch(error){if(error.name==='PasswordException')throw Error('This PDF is password-protected. Upload an unlocked copy.');if(error.name==='InvalidPDFException')throw Error('This PDF could not be read. Try another PDF or paste its text.');throw error}
 finally{await task.destroy()}
}
