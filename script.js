const jobs=[
{id:1,title:"Создать Telegram-бота",company:"StudyStart",icon:"🤖",time:"Сегодня · 14:30–17:00",location:"Онлайн",pay:6500,tags:["2.5 часа","Python","Онлайн"],match:98,type:"online today high",desc:"Собрать простого Telegram-бота для записи студентов на консультации. Нужны базовые Python и API.",profession:"Информатика"},
{id:2,title:"Помощник преподавателя по Python",company:"IT Academy",icon:"🐍",time:"Сегодня · 17:30–19:30",location:"0.8 км от университета",pay:5000,tags:["2 часа","Python","Офлайн"],match:96,type:"near today high",desc:"Проверять простые задания учеников, объяснять ошибки и помогать на практическом занятии.",profession:"Информатика"},
{id:3,title:"Сверстать страницу сайта",company:"Local Business",icon:"💻",time:"Сегодня · 18:00–21:00",location:"Онлайн",pay:7000,tags:["3 часа","HTML/CSS","Онлайн"],match:94,type:"online today high",desc:"Сделать адаптивную страницу по готовому макету. Подойдёт студенту с базовыми HTML и CSS.",profession:"Информатика"},
{id:4,title:"Создать Excel-дашборд",company:"DataStart",icon:"📊",time:"Завтра · 15:00–18:00",location:"2.4 км от университета",pay:6000,tags:["3 часа","Excel","Офлайн"],match:91,type:"near high",desc:"Собрать небольшой дашборд по продажам: таблицы, формулы и диаграммы.",profession:"Информатика"},
{id:5,title:"Тестировщик учебного приложения",company:"EdTech Lab",icon:"🧪",time:"Пт · 16:00–19:00",location:"Онлайн",pay:5500,tags:["3 часа","QA","Онлайн"],match:89,type:"online high",desc:"Пройти сценарии приложения, найти ошибки и оформить короткий баг-репорт.",profession:"Информатика"},
{id:6,title:"Настроить компьютерный класс",company:"School Hub",icon:"🖥️",time:"Сб · 12:00–15:00",location:"1.7 км от университета",pay:5000,tags:["3 часа","IT support","Офлайн"],match:87,type:"near high",desc:"Помочь подготовить компьютеры к занятиям: программы, аккаунты и базовая настройка.",profession:"Информатика"}
];

let applications=JSON.parse(localStorage.getItem("uw_apps")||"null")||[
{jobId:4,status:"ok",date:"Сегодня, 09:20"},
{jobId:2,status:"wait",date:"Сегодня, 11:42"}
];
let completed=JSON.parse(localStorage.getItem("uw_completed")||"null")||[
{title:"Оформление таблицы Excel",pay:3500,date:"5 октября",company:"StudyLab"},
{title:"Помощь на студенческом мероприятии",pay:4500,date:"2 октября",company:"Qadam Events"},
{title:"SMM для локального проекта",pay:6000,date:"28 сентября",company:"Local Brand"}
];

const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function save(){localStorage.setItem("uw_apps",JSON.stringify(applications));localStorage.setItem("uw_completed",JSON.stringify(completed));}
function money(n){return n.toLocaleString("ru-RU")+" ₸"}
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2400)}
function showPage(page){
  $$(".page").forEach(x=>x.classList.remove("active")); $(`#page-${page}`).classList.add("active");
  $$(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  window.scrollTo({top:0,behavior:"smooth"});
  if(page==="applications")renderApplications();
  if(page==="portfolio")renderPortfolio();
  if(page==="earnings")renderTransactions();
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-page]"); if(b){showPage(b.dataset.page)}
});
function jobCard(j){
 const applied=applications.some(a=>a.jobId===j.id);
 return `<div class="job-card">
 <div class="job-top"><span class="job-icon">${j.icon}</span><span class="match">${j.match}% match</span></div>
 <h3>${j.title}</h3><p>${j.company} · ${j.location}</p>
 <div class="job-meta">${j.tags.map(x=>`<span class="chip">${x}</span>`).join("")}</div>
 <p>${j.desc}</p>
 <div class="job-bottom"><strong>${money(j.pay)}</strong><button class="${applied?"secondary":"primary"}" onclick="openJob(${j.id})">${applied?"Открыть заявку":"Подробнее"}</button></div>
 </div>`
}
function renderJobs(filter="all"){
 let arr=jobs;
 if(filter!=="all")arr=jobs.filter(j=>j.type.includes(filter));
 $("#allJobs").innerHTML=arr.map(jobCard).join("");
 $("#smartJobs").innerHTML=jobs.slice(0,4).map(jobCard).join("");
 $("#homeJobs").innerHTML=jobs.slice(0,4).map(jobCard).join("");
}
function renderHomeApps(){
 $("#homeApps").innerHTML=applications.slice(0,3).map(a=>{
  const j=jobs.find(x=>x.id===a.jobId);return `<div class="application"><span class="job-icon">${j.icon}</span><div class="app-main"><h3>${j.title}</h3><p>${j.time}</p></div><span class="status ${a.status}">${a.status==="ok"?"Принято":"На рассмотрении"}</span></div>`
 }).join("");
}
function renderApplications(){
 $("#applicationsList").innerHTML=applications.map((a,i)=>{
  const j=jobs.find(x=>x.id===a.jobId); return `<div class="application"><span class="job-icon">${j.icon}</span><div class="app-main"><h3>${j.title}</h3><p>${j.company} · ${j.time} · ${money(j.pay)}</p></div><span class="status ${a.status}">${a.status==="ok"?"Принято":a.status==="done"?"Выполнено":"На рассмотрении"}</span>${a.status==="ok"?`<button class="primary" onclick="completeJob(${i})">Завершить</button>`:""}</div>`
 }).join("");
 $("#appBadge").textContent=applications.filter(a=>a.status==="wait"||a.status==="ok").length;
}
function renderTransactions(){
 const all=[...completed.map(x=>({name:x.title,pay:x.pay,date:x.date})),{name:"Вывод средств",pay:-10000,date:"30 сентября"}];
 $("#transactions").innerHTML=all.map(x=>`<div class="transaction"><div><b>${x.name}</b><span>${x.date}</span></div><span class="${x.pay>0?"plus":""}">${x.pay>0?"+":""}${money(x.pay)}</span></div>`).join("");
 $("#completedCount").textContent=12+completed.length-3;
 $("#balance").textContent=money(37500+completed.reduce((s,x)=>s+x.pay,0)-13500);
}
function renderPortfolio(){
 $("#portfolioItems").innerHTML=completed.map(x=>`<div class="portfolio-item"><span class="check">✓</span><div><b>${x.title}</b><span>${x.company} · ${x.date} · ${money(x.pay)}</span></div><span class="status done">Подтверждено</span></div>`).join("");
 $("#portCompleted").textContent=12+completed.length-3;
}
function openJob(id){
 const j=jobs.find(x=>x.id===id), a=applications.find(x=>x.jobId===id);
 $("#modalContent").innerHTML=`<div class="job-top"><span class="job-icon">${j.icon}</span><span class="match">${j.match}% match</span></div><h2>${j.title}</h2><p><b>${j.company}</b><br>${j.time}<br>${j.location}</p><p>${j.desc}</p><div class="job-meta">${j.tags.map(x=>`<span class="chip">${x}</span>`).join("")}</div><h2>${money(j.pay)}</h2>${a?`<div class="status ${a.status}">Вы уже откликнулись · ${a.status==="ok"?"Вас приняли":"заявка рассматривается"}</div>`:`<button class="primary" onclick="applyJob(${id})">Откликнуться</button>`}`;
 $("#modal").classList.add("show");
}
function applyJob(id){
 applications.push({jobId:id,status:"wait",date:"Только что"});save();$("#modal").classList.remove("show");renderJobs();renderHomeApps();renderApplications();toast("Отклик отправлен работодателю ✓");
}
function completeJob(i){
 const a=applications[i],j=jobs.find(x=>x.id===a.jobId);a.status="done";completed.push({title:j.title,pay:j.pay,date:"Сегодня",company:j.company});save();renderApplications();renderJobs();toast(`+ ${money(j.pay)} добавлено в заработок`);
}
$("#closeModal").onclick=()=>$("#modal").classList.remove("show");
$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").classList.remove("show")};
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderJobs(b.dataset.filter)});
$("#globalSearch").oninput=e=>{
 const q=e.target.value.toLowerCase();const arr=jobs.filter(j=>(j.title+j.company+j.desc+j.location).toLowerCase().includes(q));
 $("#allJobs").innerHTML=arr.map(jobCard).join("");
 if($("#page-jobs").classList.contains("active")){}
};
$("#addFree").onclick=()=>toast("Свободное окно добавлено ✓");
$("#supportBtn").onclick=()=>{$("#modalContent").innerHTML=`<h2>Чат поддержки</h2><p>Здесь в реальном продукте будет защищённый чат со специалистом. Для учебного MVP демонстрируется сценарий обращения.</p><div class="smart-result"><span class="pulse"></span><div><b>Дежурный специалист онлайн</b><p>Среднее время ответа — до 5 минут</p></div></div><br><button class="primary" onclick="closeAndToast()">Начать диалог</button>`;$("#modal").classList.add("show")};
$("#burnoutBtn").onclick=()=>{$("#modalContent").innerHTML=`<h2>Проверка состояния</h2><p>Как часто за последнюю неделю вы чувствовали усталость из-за учёбы?</p><button class="secondary" onclick="burn(1)">Редко</button> <button class="secondary" onclick="burn(2)">Иногда</button> <button class="secondary" onclick="burn(3)">Часто</button>`;$("#modal").classList.add("show")};
function burn(n){$("#modalContent").innerHTML=`<h2>Результат</h2><p>${n===1?"Похоже, сейчас у вас относительно спокойный период.":n===2?"Есть признаки нагрузки. Попробуйте запланировать отдых и поговорить с близким человеком.":"Нагрузка заметная. Стоит уделить внимание отдыху и при необходимости обратиться за профессиональной поддержкой."}</p><button class="primary" onclick="closeAndToast()">Понятно</button>`}
function closeAndToast(){$("#modal").classList.remove("show");toast("Спасибо ✓")}
const mats=[
["🐍","Python с нуля","Конспект · 42 страницы","1 200 ₸"],
["💻","HTML/CSS для начинающих","Практический гайд","900 ₸"],
["🧠","Дискретная математика","Разбор типовых задач","1 500 ₸"],
["🎓","Подготовка к экзамену","2 консультации","3 500 ₸"],
["💻","SQL: быстрый старт","Шпаргалка + примеры","700 ₸"],
["📐","Алгоритмы","Авторский учебник","1 100 ₸"]];
$("#materialsGrid").innerHTML=mats.map(m=>`<div class="material"><div class="cover">${m[0]}</div><h3>${m[1]}</h3><p>${m[2]}</p><div class="material-bottom"><b>${m[3]}</b><button class="secondary" onclick="toast('Материал добавлен в корзину ✓')">Открыть</button></div></div>`).join("");

renderJobs();renderHomeApps();renderApplications();renderPortfolio();renderTransactions();

function openProfession(){
  $("#modalContent").innerHTML=`<h2>Специальность</h2>
  <p>Выбери направление — UniWork будет повышать рейтинг заданий, связанных с профессией и навыками.</p>
  <div class="profession-options">
    <button class="profession-option selected" onclick="setProfession('Информатика')">💻 Информатика</button>
    <button class="profession-option" onclick="setProfession('Дизайн')">🎨 Дизайн</button>
    <button class="profession-option" onclick="setProfession('Экономика')">📈 Экономика</button>
    <button class="profession-option" onclick="setProfession('Педагогика')">👩‍🏫 Педагогика</button>
  </div>`;
  $("#modal").classList.add("show");
}
function setProfession(p){
  $("#modal").classList.remove("show");
  toast("Специальность: "+p+" ✓");
}
