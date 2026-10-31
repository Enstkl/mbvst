const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path'),{webcrypto}=require('node:crypto');
const root=path.resolve(__dirname,'..');
function app(store=new Map(),options={}){
 const nodes=new Map(),node=key=>{if(!nodes.has(key))nodes.set(key,{innerHTML:'',textContent:'',value:'',srcObject:null,hidden:false,classList:{add(){},remove(){},toggle(){}},focus(){},scrollIntoView(){},setAttribute(){},removeAttribute(){},addEventListener(){},prepend(){}});return nodes.get(key);};
 const location={hash:'#credit'},ctx=vm.createContext({console,Intl,URL,Blob,crypto:webcrypto,setTimeout:()=>0,clearTimeout(){},location,history:{replaceState(a,b,h){location.hash=h;}},FormData:class{constructor(v){this.v=v}get(k){return this.v[k]??null}getAll(k){return this.v[k]||[]}},window:{addEventListener(){},scrollTo(){}},document:{hidden:false,querySelector:node,querySelectorAll:()=>[],createElement:()=>node('created'),addEventListener(){}},navigator:{},localStorage:{getItem(key){if(options.failRead)throw new Error('blocked');return store.get(key)??null;},setItem(key,value){if(options.failWrite)throw new Error('quota');store.set(key,value);}}});
 vm.runInContext(fs.readFileSync(path.join(root,'vendor/jsbarcode.min.js'),'utf8'),ctx);ctx.JsBarcode=ctx.window.JsBarcode;
 for(const file of ['product-entry.js','team-access.js','sale-payments.js','credit-ledger.js','customer-directory.js','capture-flows.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
 return {run:source=>vm.runInContext(source,ctx),node,store};
}
const storage=new Map(),first=app(storage),run=first.run;
assert(first.node('#main').innerHTML.includes('new-credit-customer'));assert.equal(run('customerDirectory.length'),0);
assert(run('registerCreditCustomer({name:"",phone:"05000000000"}).error'));assert.equal(run('customerDirectory.length'),0);
run('openCustomerForm("credit")');assert(first.node('#modal-root').innerHTML.includes('customer-registration-form'));
assert(run('submitCustomerForm({name:"Zeynep",phone:"05000000000",note:"Müşteri notu"})'));assert.equal(run('customerDirectory.length'),1);assert.equal(run('creditCustomers()[0].original'),0);assert.equal(run('creditCustomers()[0].status'),'none');assert.equal(run('creditStatus'),'all');
const zeynepId=run('customerDirectory[0].id');assert(storage.size>0);
run('page="sales";paymentDraft.method="credit";paymentDraft.name="Ali";paymentDraft.phone="05000000001";render()');assert(run('saveSaleCustomer()'));assert.equal(run('customerDirectory.length'),2);assert(first.node('[data-payment-field="name"]').readOnly);assert(first.node('[data-payment-field="phone"]').readOnly);
assert(run('registerCreditCustomer({name:"Çağla",phone:"05000000002"}).customer'));
assert.equal(run('registerCreditCustomer({name:"Başka ad",phone:"+90 (500) 000 00 00"}).existing'),true);assert.equal(run('registerCreditCustomer({name:"Başka ad",phone:"905000000000"}).customer.id'),zeynepId);assert.equal(run('customerDirectory.length'),3);assert.equal(run('customerDirectory[0].name'),'Zeynep');
const suggestion=run('customerNameSuggestions("")');assert(suggestion.indexOf('Ali')<suggestion.indexOf('Çağla'));assert(suggestion.indexOf('Çağla')<suggestion.indexOf('Zeynep'));assert(run('savedCustomerPicker()').includes('Kayıtlı müşteri seç · A–Z'));
run('pickSavedCustomer("")');assert.equal(run('paymentDraft.name'),'');assert.equal(first.node('[data-payment-field="phone"]').readOnly,false);
// A fresh page context shares only the persisted directory, not transient debt records.
const second=app(storage),run2=second.run;assert.equal(run2('customerDirectory.length'),3);assert.equal(run2('customerDirectory.find(c=>c.name==="Zeynep").id'),zeynepId);assert.equal(run2('creditCustomers().filter(c=>c.status==="none").length'),3);
const count=run2('customerDirectory.length');run2('page="sales";addCart(1);paymentDraft={method:"credit",name:"Yeniden yazılan ad",phone:"+90 500 000 00 00",note:"Satış notu",posRate:""};actions["complete-sale"]()');assert.equal(run2('customerDirectory.length'),count);assert.equal(run2('transactions[0].customer.id'),zeynepId);assert.equal(run2('transactions[0].customer.name'),'Zeynep');assert.equal(run2('transactions[0].customer.note'),'Satış notu');
// Matching names are not a unique identifier: different phones can belong to different people.
assert(run2('registerCreditCustomer({name:"Ali",phone:"05000000003"}).customer'));assert.equal(run2('customerDirectory.filter(c=>c.name==="Ali").length'),2);
const beforeRead=app(storage),anotherTab=app(storage);const created=anotherTab.run('registerCreditCustomer({name:"Sekme",phone:"05000000004"}).customer.id');assert.equal(beforeRead.run('registerCreditCustomer({name:"Yinelenen",phone:"+90 500 000 00 04"}).customer.id'),created);
const readonly=app(storage);readonly.run('employees.push({id:"reader",name:"Muhasebe",email:"reader@example.com",role:"accountant",permissions:[...rolePresets.accountant.permissions],active:true});previewEmployee("reader")');assert(readonly.run('registerCreditCustomer({name:"Yetkisiz",phone:"05000000005"}).error'));assert.equal(readonly.run('button("Yeni müşteri","new-credit-customer","plus","primary")'),'');
const quota=app(storage,{failWrite:true}),q=quota.run;q('page="sales";addCart(1);paymentDraft={method:"credit",name:"Yeni",phone:"05000000005",note:"",posRate:""}');const stock=q('products[0].stock'),txCount=q('transactions.length');assert.equal(q('finishRecordedSale()'),false);assert.equal(q('products[0].stock'),stock);assert.equal(q('transactions.length'),txCount);
assert(quota.run('registerCreditCustomer({name:"Mevcut",phone:"05000000000"}).customer'));
const badStorage=new Map([['stokca.mbvst.customers.v1','broken-json']]),bad=app(badStorage);assert(bad.run('customerStorageError'));assert(bad.run('registerCreditCustomer({name:"Yeni",phone:"05000000005"}).error'));assert.equal(badStorage.get('stokca.mbvst.customers.v1'),'broken-json');
const blocked=app(new Map(),{failRead:true});assert(blocked.run('registerCreditCustomer({name:"Yeni",phone:"05000000005"}).error'));
assert(!storage.get('stokca.mbvst.customers.v1').includes('receivableAmount'));
console.log('PASS: registration from credit page and sale point, zero-debt customers, A–Z picker, duplicate canonical phones, stable IDs after reload, same-name distinct people, existing-customer reuse, readonly selected fields, cross-tab uniqueness refresh, registration permissions, quota/corrupt storage rejection without stock mutation.');
