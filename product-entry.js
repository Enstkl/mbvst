/* İşletme içi barkodlar; ürün ve etiket kayıtları bu taslakta sekme belleğindedir. */
let manualDraft=null, savedManualProductId=null, labelProductId=null;
function createInternalBarcode(){
 for(let attempt=0;attempt<50;attempt++){
  const bytes=crypto.getRandomValues(new Uint8Array(10));
  const code='20'+Array.from(bytes,n=>String(n%10)).join('');
  if(!products.some(p=>p.barcode===code))return code;
 }
 throw new Error('Yeni barkod oluşturulamadı. Lütfen tekrar dene.');
}
function barcodeMarkup(code){
 if(!code)return '<p class="help-text">Barkod bulunamadı.</p>';
 try{
  const output={};JsBarcode(output,String(code),{format:'CODE128',displayValue:false});
  const bits=output.encodings.map(e=>e.data).join('');
  let bars='';for(let i=0;i<bits.length;i++)if(bits[i]==='1')bars+=`<rect x="${16+i}" y="4" width="1" height="52"/>`;
  return `<svg class="real-barcode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${bits.length+32} 60" role="img" aria-label="Barkod: ${escapeHtml(code)}"><rect width="100%" height="100%" fill="white"/><g fill="black">${bars}</g></svg><span class="barcode-number">${escapeHtml(code)}</span>`;
 }catch{return '<p class="help-text">Bu kod barkod etiketine dönüştürülemiyor.</p>';}
}
function getManualDraft(){if(!manualDraft)manualDraft={barcode:createInternalBarcode()};return manualDraft;}
function manualProductPage(){
 const draft=getManualDraft(),saved=products.find(p=>p.id===savedManualProductId);
 return pageHead('Elle ürün ekle','Ürün bilgilerini gir; barkodu otomatik oluşsun, etiketini yazdır.',button('Ürün listesi','products','box','white'),'YENİ ÜRÜN KARTI')+
 `${saved?`<div class="success-banner">${icon('check')}<div><strong>${escapeHtml(saved.name)} eklendi.</strong><p>Barkod: ${saved.barcode} · ${saved.stock} ${saved.unit||'set'} stokta</p></div><button class="button button-white" data-label-product="${saved.id}">${icon('scan')}Barkodunu yazdır</button></div>`:''}`+
 `<div class="manual-entry-layout"><section class="panel"><div class="panel-head"><div><h2 class="panel-title">Ürün bilgileri</h2><p class="panel-subtitle">Yıldızlı alanlar zorunludur.</p></div></div><form id="manual-product-form" class="manual-product-form"><div class="form-grid"><label class="modal-field full-width">Ürün adı *<input name="name" id="manual-name" required maxlength="100" placeholder="Örn. Seramik Kahve Kupası" autocomplete="off"></label><label class="modal-field full-width">Açıklama / model<input name="description" maxlength="120" placeholder="Örn. Krem · 250 ml"></label><label class="modal-field">Kategori *<select name="category" required><option>Züccaciye</option><option>Mutfak</option></select></label><label class="modal-field">Stok birimi *<select name="unit" required><option value="adet">Adet</option><option value="set">Set</option><option value="paket">Paket</option></select></label><label class="modal-field">Başlangıç stok miktarı *<input name="stock" type="number" min="0" max="1000000" step="1" value="1" required inputmode="numeric"></label><label class="modal-field">Otomatik barkod<input value="${draft.barcode}" readonly aria-describedby="barcode-note"></label><label class="modal-field">Birim alış maliyeti (₺) *<input name="cost" type="number" min="0" max="10000000" step="0.01" required placeholder="0,00" inputmode="decimal"></label><label class="modal-field">Birim satış fiyatı (₺) *<input name="price" id="manual-price" type="number" min="0" max="10000000" step="0.01" required placeholder="0,00" inputmode="decimal"></label></div><p class="help-text" id="barcode-note">Her yeni ürün için benzersiz bir işletme içi barkod oluşturulur. Aynı ürünün etiketini daha sonra ürün listesinden tekrar yazdırabilirsin.</p><p class="form-error" id="manual-error" role="alert"></p><div class="manual-form-footer"><button type="button" class="button button-white" data-action="products">Vazgeç</button><button class="button button-primary" type="submit">${icon('check')}Ürünü kaydet</button></div></form></section><aside><section class="panel label-preview-panel"><div class="panel-head"><h2 class="panel-title">Etiket önizlemesi</h2><span class="pill">CODE128</span></div><div class="product-label"><strong id="draft-label-name">Yeni ürün</strong><div>${barcodeMarkup(draft.barcode)}</div><b id="draft-label-price">₺0,00</b></div><p class="capture-help">Kaydettikten sonra etiket sayısını ve kağıt düzenini seçerek yazdırabilirsin.</p></section><div class="honesty-note">${icon('box')}<p><strong>Bu sürümde kayıtlar geçicidir.</strong>Ürün ve barkod bu açık sekmede tutulur. Sayfa yenilenince kayıt sıfırlanır. Kalıcı veritabanı henüz bağlı değil.</p></div></aside></div>`;
}
function labelPage(){
 const available=products.filter(p=>p.barcode);
 const p=available.find(p=>p.id===labelProductId)||available[0];if(p)labelProductId=p.id;
 return pageHead('Barkod etiketi yazdır','Ürününü seç, etiket adedini belirle ve baskı önizlemesini aç.',button('Ürün listesi','products','box','white'),'ÜRÜN ETİKETLERİ')+
 `<div class="manual-entry-layout"><section class="panel"><div class="panel-head"><h2 class="panel-title">Yazdırma ayarları</h2></div><form id="label-print-form" class="manual-product-form"><label class="modal-field">Ürün<select id="label-product-select" name="productId" required>${available.map(item=>`<option value="${item.id}" ${p?.id===item.id?'selected':''}>${escapeHtml(item.name)} · ${item.barcode}</option>`).join('')}</select></label><div class="form-grid"><label class="modal-field">Etiket sayısı<input name="copies" type="number" required min="1" max="100" step="1" value="1" inputmode="numeric"></label><label class="modal-field">Kağıt düzeni<select name="layout"><option value="a4">A4 · 3 sütun</option><option value="thermal">Etiket yazıcı · 50 × 30 mm</option></select></label></div><label class="price-checkbox"><input type="checkbox" name="showPrice" id="label-show-price" checked>Satış fiyatını etikette göster</label><p class="help-text">Baskı ayarlarında ölçeği %100 seç. 50 × 30 mm etiket için yazıcının kağıt boyutunu da buna ayarla. A4 düzeni düz kağıt için hazırlanmıştır.</p><p class="form-error" id="label-print-error" role="alert"></p><button type="submit" class="button button-primary" ${p?'':'disabled'}>${icon('scan')}Baskı önizlemesini aç</button></form></section><section class="panel label-preview-panel"><div class="panel-head"><h2 class="panel-title">Etiket önizlemesi</h2><span class="pill">CODE128</span></div><div id="label-live-preview">${p?productLabel(p,true):'<p class="empty-state">Barkodlu ürün bulunamadı.</p>'}</div></section></div>`;
}
function labelMoney(value){return new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',minimumFractionDigits:2,maximumFractionDigits:2}).format(value);}
function productLabel(p,showPrice){return `<div class="product-label"><strong>${escapeHtml(p.name)}</strong><div>${barcodeMarkup(p.barcode)}</div>${showPrice?`<b>${labelMoney(p.price)}</b>`:''}</div>`;}
function saveManualProduct(form){
 const data=new FormData(form),name=String(data.get('name')||'').trim(),category=String(data.get('category')),unit=String(data.get('unit'));
 const stock=Number(data.get('stock')),cost=Number(data.get('cost')),price=Number(data.get('price'));
 const error=document.querySelector('#manual-error');
 if(!name||!Number.isInteger(stock)||stock<0||stock>1000000||![cost,price].every(n=>Number.isFinite(n)&&n>=0&&n<=10000000)||!['adet','set','paket'].includes(unit)||!['Züccaciye','Mutfak'].includes(category)){error.textContent='Ürün adını, miktarı ve fiyatları kontrol et.';return;}
 const draft=getManualDraft();if(products.some(p=>p.barcode===draft.barcode)){draft.barcode=createInternalBarcode();error.textContent='Barkod yenilendi. Kaydetmek için tekrar dene.';return;}
 const p={id:Math.max(0,...products.map(p=>p.id))+1,name,category,unit,stock,cost,price,sub:String(data.get('description')||'').trim()||'Elle eklenen ürün',barcode:draft.barcode,icon:'box',color:'sage',sold:0};
 products.push(p);savedManualProductId=p.id;labelProductId=p.id;manualDraft=null;render();toast('Ürün kaydedildi ve barkodu oluşturuldu.');window.scrollTo({top:0,behavior:'smooth'});
}
function prepareLabelPrint(form){
 const data=new FormData(form),p=products.find(p=>p.id===Number(data.get('productId'))),copies=Number(data.get('copies')),layout=data.get('layout'),showPrice=data.get('showPrice')==='on';
 const error=document.querySelector('#label-print-error');
 if(!p?.barcode||!Number.isInteger(copies)||copies<1||copies>100||!['a4','thermal'].includes(layout)){error.textContent='Ürünü ve 1–100 arasında etiket sayısını kontrol et.';return;}
 if(!barcodeMarkup(p.barcode).includes('<svg')){error.textContent='Bu ürünün barkodu yazdırılamıyor.';return;}
 let root=document.querySelector('#print-label-root');if(!root){root=document.createElement('div');root.id='print-label-root';document.body.appendChild(root);}
 root.className=layout==='thermal'?'print-thermal':'print-a4';root.innerHTML=Array.from({length:copies},()=>productLabel(p,showPrice)).join('');
 let style=document.querySelector('#label-page-style');if(!style){style=document.createElement('style');style.id='label-page-style';document.head.appendChild(style);}
 style.textContent=layout==='thermal'?'@media print{@page{size:50mm 30mm;margin:0}}':'@media print{@page{size:A4 portrait;margin:10mm}}';
 error.textContent='';window.print();
}
function setupProductEntry(){
 actions['new-product']=()=>{manualDraft=null;savedManualProductId=null;navigate('new-product');};
 actions['print-labels']=()=>navigate('labels');
 document.addEventListener('click',e=>{const target=e.target.closest('[data-label-product]');if(target){labelProductId=Number(target.dataset.labelProduct);closeModal();navigate('labels');}});
 document.addEventListener('submit',e=>{if(e.target.id==='manual-product-form'){e.preventDefault();saveManualProduct(e.target);}if(e.target.id==='label-print-form'){e.preventDefault();prepareLabelPrint(e.target);}});
 document.addEventListener('input',e=>{if(e.target.id==='manual-name')document.querySelector('#draft-label-name').textContent=e.target.value.trim()||'Yeni ürün';if(e.target.id==='manual-price')document.querySelector('#draft-label-price').textContent=labelMoney(Number(e.target.value)||0);});
 document.addEventListener('change',e=>{if(e.target.id==='label-product-select')labelProductId=Number(e.target.value);if(['label-product-select','label-show-price'].includes(e.target.id)){const p=products.find(p=>p.id===labelProductId);if(p)document.querySelector('#label-live-preview').innerHTML=productLabel(p,document.querySelector('#label-show-price').checked);}});
}
