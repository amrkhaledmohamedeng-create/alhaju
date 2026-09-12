const CONFIG = {
  // ضع هنا رابط Google Apps Script الخاص بالموقع بعد النشر.
  API_URL: "https://script.google.com/macros/s/AKfycbyEbA8KHkSTuIJ8XlvjV8TB8C8cZpYpVTqgkiCaXwT_SFqlv9jdA8hpbR-vA4NlFz3FSQ/exec"
};

const fallbackOffers = [
  {id:"mayassar", type:"حج ميسر", title:"الحج الميسر", price:"120000", currency:"جنيه", installmentMonths:24, installment:"5000 جنيه شهريًا", description:"دفع كامل للبرنامج مع إمكانية تقسيط مبلغ 120 ألف جنيه على 24 شهر."},
  {id:"tourist", type:"حج سياحي", title:"الحج السياحي", price:"", currency:"", installmentMonths:"", installment:"", description:"برنامج الحج + 5,000 دولار حسب تفاصيل البرنامج المختار."},
  {id:"lottery", type:"حج القرعة", title:"حج القرعة", price:"", currency:"", installmentMonths:"", installment:"", description:"اختيار البرنامج المناسب، والسعر والتفاصيل حسب البرنامج."}
];

let offers = [];

function money(v,c){ if(v===undefined||v===null||v==="") return ""; return `${Number(v).toLocaleString("ar-EG")} ${c||""}`; }

function card(o){
  const bullets=[];
  if(o.installment) bullets.push(`التقسيط: ${o.installment}`);
  if(o.installmentMonths) bullets.push(`مدة التقسيط: ${o.installmentMonths} شهر`);
  if(o.type==="حج سياحي") bullets.push("البرنامج + 5,000 دولار");
  if(o.type==="حج القرعة") bullets.push("اختيار البرنامج حسب المتاح");
  return `<article class="offer ${o.id==="mayassar"?"featured":""}">
    <span class="eyebrow">${escapeHtml(o.type||"حج")}</span>
    <h3>${escapeHtml(o.title||o.name||"برنامج حج")}</h3>
    ${o.price?`<div class="price">${money(o.price,o.currency||"جنيه")}</div>`:""}
    <p class="muted">${escapeHtml(o.description||"تفاصيل البرنامج متاحة عند التسجيل.")}</p>
    <ul>${bullets.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul>
    <div class="actions"><button class="primary" onclick="selectOffer('${escapeAttr(o.id||"")}')">سجل في البرنامج</button></div>
  </article>`;
}

function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function escapeAttr(s){return String(s??"").replace(/'/g,"\\'");}

async function loadOffers(){
  if(!CONFIG.API_URL || CONFIG.API_URL.includes("PASTE_")){
    offers=fallbackOffers;
  } else {
    try{
      const r=await fetch(`${CONFIG.API_URL}?action=list&table=hajj_offers`);
      const d=await r.json();
      offers=(d.rows||d.data||[]).filter(x=>String(x.active??"true")!=="false");
      if(!offers.length) offers=fallbackOffers;
    }catch(e){ offers=fallbackOffers; }
  }
  document.querySelector("#offersGrid").innerHTML=offers.map(card).join("");
  updatePrograms();
}

function selectOffer(id){
  const o=offers.find(x=>String(x.id)===String(id));
  document.querySelector("#hajjType").value=o?.type||"";
  updatePrograms();
  document.querySelector("#programId").value=o?.id||"";
  document.querySelector("#booking").scrollIntoView({behavior:"smooth"});
}

function updatePrograms(){
  const type=document.querySelector("#hajjType").value;
  const list=offers.filter(o=>!type || o.type===type);
  document.querySelector("#programId").innerHTML=`<option value="">اختر البرنامج</option>`+
    list.map(o=>`<option value="${escapeHtml(o.id)}">${escapeHtml(o.title||o.name)}</option>`).join("");
}

document.querySelector("#hajjType").addEventListener("change",updatePrograms);

document.querySelector("#bookingForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const msg=document.querySelector("#formMessage");
  const data=Object.fromEntries(new FormData(e.target).entries());
  data.createdAt=new Date().toISOString();
  data.status="جديد";
  try{
    if(CONFIG.API_URL && !CONFIG.API_URL.includes("PASTE_")){
      const r=await fetch(CONFIG.API_URL,{method:"POST",body:JSON.stringify({action:"upsert",table:"hajj_bookings",record:data})});
      const d=await r.json();
      if(d.ok===false) throw new Error(d.error||"تعذر الحفظ");
    }else{
      localStorage.setItem("hajj_demo_last_booking",JSON.stringify(data));
    }
    msg.textContent="تم تسجيل بياناتك بنجاح، وسنتواصل معك لاستكمال التفاصيل.";
    msg.style.color="green"; e.target.reset(); updatePrograms();
  }catch(err){
    msg.textContent="حدث خطأ أثناء التسجيل. راجع إعداد رابط Google Apps Script.";
    msg.style.color="#a33";
  }
});

loadOffers();
