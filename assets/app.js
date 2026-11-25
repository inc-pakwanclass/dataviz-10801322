(function(){
var C=window.PORTAL,M=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
function $(i){return document.getElementById(i)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function p(s){var a=s.split("-");return{d:+a[2],m:+a[1]-1}}
function rng(w){var a=p(w.start),b=p(w.end);return a.d+(a.m!==b.m?" "+M[a.m]:"")+"–"+b.d+" "+M[b.m]}
function pad(n){return n<10?"0"+n:""+n}
function safeUrl(u){return /^https:\/\//.test(u)?u:"#"}
function link(cls,txt,href){var a=el("a",cls,txt);a.href=safeUrl(href);a.target="_blank";a.rel="noopener";return a}

function head(){
  document.title=C.courseName+" · "+C.courseCode.split(" ")[0];
  $("faculty").textContent=C.faculty;
  var yr=(C.courseCode.match(/(\d)\/(\d{4})/)||[]);
  $("year").textContent=yr[2]||"";
  $("b1").textContent=yr[1]?"T"+yr[1]:"";$("b2").textContent=yr[2]||"";
  $("short").textContent=C.short||C.courseEn||"";
  $("name").textContent=C.courseName;
  $("code").textContent=C.courseCode;
  $("sub").textContent=C.courseEn||"";
  if(C.logo){var l=$("logo");l.src=C.logo;l.hidden=false}
  if(C.announcement){var n=$("notice");n.textContent=C.announcement;n.hidden=false}
  $("foot").textContent=C.footer||"";
}
function hwBoxes(w){return w.hw.map(function(h){
  var c=el("div","hw");c.appendChild(el("b",null,h.name));c.appendChild(el("span","d",h.note||""));
  var o=p(h.open),cl=h.close?p(h.close):null,rg=o.d+" "+M[o.m]+(cl?"–"+cl.d+" "+M[cl.m]:"");
  if(h.isClosed)c.appendChild(el("span","tag","ปิดรับแล้ว ("+rg+")"));
  else if(!h.isOpen)c.appendChild(el("span","tag","เปิดให้ส่ง "+rg));
  else{if(cl)c.appendChild(el("span","tag","ส่งภายใน "+cl.d+" "+M[cl.m]));c.appendChild(link("btn","ไปที่แบบฟอร์ม",h.url))}
  return c})}
// สัปดาห์ที่มีช่องไฟล์: ไม่ใช่สัปดาห์สอบ และชื่อหัวข้อไม่มีคำว่า (ต่อ)
function hasSlot(w){return !w.exam&&!/\(ต่อ\)/.test(w.title)}
function filesBox(w){
  if(!w.files.length){
    if(!hasSlot(w))return el("p","empty",w.exam?"ไม่มีเอกสารประกอบ":"ไม่มีเอกสารใหม่ในสัปดาห์นี้ (ต่อเนื่องจากสัปดาห์ก่อน)");
    var box0=el("div","files"),r0=el("div","f pending");r0.appendChild(el("span","pdf","PDF"));
    var n0=el("span","fn");n0.appendChild(document.createTextNode("เอกสารประกอบการสอน"));n0.appendChild(el("span","d","ยังไม่เผยแพร่ — อาจารย์จะอัปโหลดก่อนเรียน"));r0.appendChild(n0);
    r0.appendChild(el("span","btn ghost off","เปิดดู"));r0.appendChild(el("span","btn off","ดาวน์โหลด"));box0.appendChild(r0);return box0}
  var box=el("div","files");
  w.files.forEach(function(f){var r=el("div","f");r.appendChild(el("span","pdf",f.pdf?"PDF":"ไฟล์"));
    var n=el("span","fn");n.appendChild(document.createTextNode(f.name));n.appendChild(el("span","d",f.size));r.appendChild(n);
    r.appendChild(link("btn ghost","เปิดดู",f.view));r.appendChild(link("btn","ดาวน์โหลด",f.dl));box.appendChild(r)});
  return box}
function render(d){
  var cw=d.weeks[d.cur-1],now=$("now");now.textContent="";
  now.appendChild(el("div","lbl","สัปดาห์นี้ · "+rng(cw)));
  var big=el("span","num");big.appendChild(el("small",null,"Week"));big.appendChild(document.createTextNode(pad(cw.n)));now.appendChild(big);
  now.appendChild(el("h2",null,cw.title));
  var row=el("div","row");
  if(cw.files.length)cw.files.forEach(function(f){row.appendChild(link("btn","เปิดดู: "+f.name,f.view))});
  else row.appendChild(el("span","d",cw.exam?"สัปดาห์สอบ":"ไฟล์ของสัปดาห์นี้ยังไม่เผยแพร่"));
  now.appendChild(row);
  var ol=$("weeks");ol.textContent="";
  d.weeks.forEach(function(w){var li=el("li"),de=el("details");if(w.n===d.cur){de.open=true;de.className="cur"}
    var s=el("summary");var wk=el("span","wk");wk.appendChild(el("small",null,"Week"));wk.appendChild(document.createTextNode(pad(w.n)));s.appendChild(wk);
    var t=el("span","t");t.appendChild(document.createTextNode(w.title));t.appendChild(el("span","d",rng(w)));s.appendChild(t);
    var lab=[];if(w.files.length)lab.push(w.files.length+" ไฟล์");if(w.hw.length)lab.push("การบ้าน");
    s.appendChild(w.exam?el("span","tag exam","สอบ"):el("span","tag",lab.join(" · ")||(hasSlot(w)?"รอไฟล์":"—")));de.appendChild(s);
    var b=el("div","body");b.appendChild(filesBox(w));hwBoxes(w).forEach(function(x){b.appendChild(x)});
    de.appendChild(b);li.appendChild(de);ol.appendChild(li)});
}
function fail(){
  if($("weeks").children.length)return; // มีข้อมูลเก่าที่แคชไว้แสดงอยู่แล้ว
  var e=el("div","err","โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
  var b=el("button","btn","โหลดใหม่");b.onclick=load;e.appendChild(document.createElement("br"));e.appendChild(b);
  $("now").textContent="";$("now").appendChild(e)}
function load(){
  var cb="__portal"+Date.now(),done=false,s=document.createElement("script");
  window[cb]=function(d){done=true;try{localStorage.setItem("portal_cache",JSON.stringify(d))}catch(e){}render(d);s.remove();delete window[cb]};
  s.onerror=function(){if(!done)fail()};
  s.src=C.API+(C.API.indexOf("?")<0?"?":"&")+"api=1&callback="+cb;
  setTimeout(function(){if(!done)fail()},15000);
  document.head.appendChild(s)}
head();
try{var c=JSON.parse(localStorage.getItem("portal_cache")||"null");if(c&&c.weeks)render(c)}catch(e){}
load();
})();
