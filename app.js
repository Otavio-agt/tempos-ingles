/* ===========================================================
   Verb Tenses — lógica da página
   -----------------------------------------------------------
   Sumário:
     1. DATA        — conteúdo (tempos, comparações, exercícios)
     2. HELPERS     — atalhos de DOM, normalização, progresso
     3. TIMELINE    — geração dos diagramas SVG
     4. RENDER      — zonas, cards, comparações, árvore
     5. EXERCISES   — montagem e correção automática
     6. SPEAKING    — sorteio de perguntas
     7. SIDEBAR     — drawer + scroll-spy
     8. THEME       — alternância claro/escuro
   =========================================================== */

/* ============ DATA ============ */
const T = [
{id:'present-simple',n:1,z:'present',name:'Present Simple',pt:'Presente simples',
 formula:'Sujeito + verbo  (he/she/it → +s / +es)',
 vizCap:'ação repetida, sem começo nem fim definidos',
 marks:[{k:'p',t:.10},{k:'p',t:.26},{k:'p',t:.42},{k:'p',t:.55},{k:'p',t:.70},{k:'p',t:.86}],
 forms:{
  aff:['I work. / You work. / They work.','He works.','She watches TV.'],
  neg:["I don't work on Sundays.","She doesn't like coffee."],
  que:['Do you speak English?','Does he live here?']},
 uses:[['Hábitos e rotinas','I usually get up at 7 a.m.'],
       ['Fatos e verdades gerais','Water boils at 100°C.'],
       ['Situações permanentes','She works for a bank.'],
       ['Horários e programações','The train leaves at 8:30.']],
 more:['I study English every day.','My brother plays football on weekends.',"She doesn't eat meat.",'Do you usually drive to work?']},

{id:'present-continuous',n:2,z:'present',name:'Present Continuous',pt:'Presente contínuo',
 formula:'Sujeito + am/is/are + verbo-ing',
 vizCap:'em andamento agora, com início e fim próximos',
 marks:[{k:'s',t:.44,t2:.68}],
 forms:{
  aff:['I am studying.','She is working.','They are watching TV.'],
  neg:['I am not studying.',"He isn't working.","They aren't sleeping."],
  que:['Are you studying?','Is she working?']},
 uses:[['Algo acontecendo agora','I am talking to you now.'],
       ['Situações temporárias','She is staying with her parents this month.'],
       ['Situações em mudança','Technology is changing very quickly.'],
       ['Combinados para o futuro próximo',"I'm meeting John tomorrow."]]},

{id:'past-simple',n:3,z:'past',name:'Past Simple',pt:'Passado simples',
 formula:'verbo + -ed  (irregulares têm forma própria)',
 vizCap:'evento concluído, num ponto do passado',
 marks:[{k:'p',t:.22,big:true}],
 forms:{
  aff:['work → worked / play → played / visit → visited','go → went, eat → ate, see → saw, buy → bought'],
  neg:["I didn't go to work yesterday."],
  que:['Did you see the movie?']},
 uses:[['Ações concluídas no passado','I visited London last year.'],
       ['Momento definido no tempo','She called me yesterday.'],
       ['Fatos datados','They moved to Brazil in 2018.']],
 warn:['I didn\'t went.','I didn\'t go.'],
 pills:['yesterday','last week','last year','two days ago','in 2010','when I was a child']},

{id:'past-continuous',n:4,z:'past',name:'Past Continuous',pt:'Passado contínuo',
 formula:'Sujeito + was/were + verbo-ing',
 vizCap:'estava em andamento — e algo a interrompe',
 marks:[{k:'s',t:.10,t2:.36},{k:'p',t:.26,big:true,tone:'err'}],
 forms:{
  aff:['I was studying.','They were playing.'],
  neg:["I wasn't studying.","They weren't playing."],
  que:['Were you studying?','Was she working?']},
 uses:[['Ação em curso num momento do passado','At 8 p.m., I was watching TV.'],
       ['Ação interrompida por outra','I was sleeping when the phone rang.'],
       ['Duas ações ao mesmo tempo','While I was cooking, my wife was watching TV.']]},

{id:'present-perfect',n:5,z:'bridge',name:'Present Perfect',pt:'Presente perfeito',
 formula:'Sujeito + have/has + particípio',
 vizCap:'começa no passado e chega até agora',
 marks:[{k:'a',t:.14,t2:.55}],
 forms:{
  aff:['I have visited London.','She has finished her homework.'],
  neg:["I haven't finished yet.","He hasn't called me."],
  que:['Have you ever been to England?','Has she finished the project?']},
 uses:[['Experiências (quando não importa)','I have been to Argentina.'],
       ['Ação recente com resultado agora','She has lost her keys.'],
       ['Começou no passado e continua','I have lived here for five years.']],
 more:['Have you ever eaten sushi?','I have never seen that movie.','She has just arrived.','We have lived here since 2020.',"I've known him for ten years."],
 pills:['ever','never','already','yet','just','since','for']},

{id:'present-perfect-continuous',n:6,z:'bridge',name:'Present Perfect Continuous',pt:'Presente perfeito contínuo',
 formula:'Sujeito + have/has + been + verbo-ing',
 vizCap:'a duração da atividade é o que importa',
 marks:[{k:'s',t:.14,t2:.55,dash:true}],
 forms:{
  aff:['I have been studying English.','She has been working all day.'],
  neg:["I haven't been sleeping well.","He hasn't been working."],
  que:['Have you been waiting long?','How long have you been studying?']},
 uses:[['Ênfase na duração','I have been studying for three hours.'],
       ['Atividade que continua até agora','She has been working all day.']]},

{id:'past-perfect',n:7,z:'past',name:'Past Perfect',pt:'Passado perfeito',
 formula:'Sujeito + had + particípio',
 vizCap:'o passado do passado — o que veio antes',
 marks:[{k:'p',t:.10,big:true,label:'1º'},{k:'p',t:.34,big:true,label:'2º'},{k:'c',t:.10,t2:.34}],
 forms:{
  aff:['I had finished my work.','She had already left.'],
  neg:["I hadn't finished my work.","She hadn't left yet."],
  que:['Had she already left?','Had you eaten before the movie?']},
 uses:[['Ação anterior a outra ação passada','When I arrived, she had already left.'],
       ['Ordem dos fatos fica clara','They had eaten dinner before the movie started.']]},

{id:'will',n:8,z:'future',name:'Future with Will',pt:'Futuro com will',
 formula:'Sujeito + will + verbo no infinitivo',
 vizCap:'decisão ou previsão apontando para o futuro',
 marks:[{k:'p',t:.84,big:true}],
 forms:{
  aff:['I will call you tomorrow.',"I'll help you."],
  neg:["I won't call you tomorrow."],
  que:['Will you help me?']},
 uses:[['Previsões','I think it will rain tomorrow.'],
       ['Decisões tomadas na hora',"The phone is ringing. I'll answer it."],
       ['Promessas',"I'll help you."],
       ['Ofertas',"I'll carry your bag."]]},

{id:'going-to',n:9,z:'future',name:'Be going to',pt:'Futuro com going to',
 formula:'Sujeito + am/is/are + going to + verbo',
 vizCap:'a decisão já existe agora; a ação vem depois',
 marks:[{k:'p',t:.55},{k:'a',t:.55,t2:.84,dash:true},{k:'p',t:.84,big:true}],
 forms:{
  aff:["I'm going to study tonight.","She's going to buy a new car."],
  neg:["I'm not going to study tonight.","He isn't going to come."],
  que:['Are you going to study tonight?','Is she going to buy a car?']},
 uses:[['Planos e intenções',"I'm going to learn Spanish next year."],
       ['Previsão com evidência clara',"Look at those clouds! It's going to rain."]]},

{id:'future-continuous',n:10,z:'future',name:'Future Continuous',pt:'Futuro contínuo',
 formula:'will be + verbo-ing',
 vizCap:'estará em andamento num momento futuro',
 marks:[{k:'s',t:.72,t2:.92}],
 forms:{
  aff:["This time tomorrow, I'll be flying to London.","At 10 p.m. tonight, I'll be studying."],
  neg:["I won't be working tomorrow."],
  que:['Will you be working tomorrow?']},
 uses:[['Ação em curso num ponto do futuro','This time next week, we\'ll be relaxing on the beach.']]},

{id:'future-perfect',n:11,z:'future',name:'Future Perfect',pt:'Futuro perfeito',
 formula:'will have + particípio',
 vizCap:'terminada antes de um prazo futuro',
 marks:[{k:'a',t:.55,t2:.86},{k:'d',t:.86}],
 forms:{
  aff:['I will have finished the project by Friday.','By next year, I will have finished university.'],
  neg:["I won't have finished by Friday."],
  que:['Will you have finished by Friday?']},
 uses:[['Ação concluída antes de um prazo','By 8 p.m., she will have arrived home.']],
 pills:['by Friday','by next year','by 8 p.m.','by the end of the month']}
];

const ZONES=[
 {z:'past',t:'Passado',s:'Fechado, com data. Aconteceu e terminou lá atrás.',ids:['past-simple','past-continuous','past-perfect']},
 {z:'bridge',t:'Ponte',s:'Começa no passado e alcança o agora.',ids:['present-perfect','present-perfect-continuous']},
 {z:'present',t:'Presente',s:'Rotina, verdade geral ou o que rola agora.',ids:['present-simple','present-continuous']},
 {z:'future',t:'Futuro',s:'Ainda não aconteceu. Plano, previsão ou prazo.',ids:['will','going-to','future-continuous','future-perfect']}
];

const CMP=[
 {t:'Present Simple vs. Present Continuous',a:{l:'Present Simple',s:'I work in São Paulo.',w:'Situação permanente ou regular — é assim que as coisas são.'},b:{l:'Present Continuous',s:"I'm working in São Paulo this week.",w:'Situação temporária — vale só por agora.'}},
 {t:'Past Simple vs. Past Continuous',a:{l:'Past Simple',s:'I watched TV at 8 p.m.',w:'O evento é apresentado como concluído.'},b:{l:'Past Continuous',s:'I was watching TV at 8 p.m.',w:'O foco é a ação em andamento naquele momento.'}},
 {t:'Present Perfect vs. Present Perfect Continuous',a:{l:'Present Perfect',s:'I have read three books this month.',w:'Foco no resultado concluído — quantos livros.'},b:{l:'Present Perfect Continuous',s:'I have been reading for three hours.',w:'Foco na atividade e na duração — há quanto tempo.'}},
 {t:'Will vs. Going to',a:{l:'Will',s:'"I\'m thirsty." "I\'ll get you some water."',w:'Decisão tomada na hora, sem plano anterior.'},b:{l:'Going to',s:"I'm going to visit my parents this weekend.",w:'Plano já feito antes de falar.'}}
];

const TREE={
 q:'A ação acontece quando?',
 opts:[
  {l:'No passado',q:'E como ela se encaixa lá?',opts:[
    {l:'Terminou num momento definido',r:'past-simple',ex:'I visited London last year.'},
    {l:'Estava em andamento naquele momento',r:'past-continuous',ex:'At 8 p.m., I was watching TV.'},
    {l:'Aconteceu antes de outra ação passada',r:'past-perfect',ex:'When I arrived, she had already left.'}]},
  {l:'No passado, mas ligada ao agora',q:'O que você quer destacar?',opts:[
    {l:'A experiência ou o resultado agora',r:'present-perfect',ex:'She has lost her keys.'},
    {l:'Há quanto tempo isso vem acontecendo',r:'present-perfect-continuous',ex:'I have been studying for three hours.'}]},
  {l:'No presente',q:'É rotina ou é agora?',opts:[
    {l:'Hábito, rotina, fato ou horário',r:'present-simple',ex:'The train leaves at 8:30.'},
    {l:'Acontecendo agora ou temporário',r:'present-continuous',ex:'I am talking to you now.'}]},
  {l:'No futuro',q:'Que tipo de futuro?',opts:[
    {l:'Previsão, promessa, oferta ou decisão na hora',r:'will',ex:"The phone is ringing. I'll answer it."},
    {l:'Plano já feito ou evidência à vista',r:'going-to',ex:"Look at those clouds! It's going to rain."},
    {l:'Estará em andamento num momento futuro',r:'future-continuous',ex:"This time tomorrow, I'll be flying to London."},
    {l:'Estará concluída antes de um prazo',r:'future-perfect',ex:'By next year, I will have finished university.'}]}
 ]
};

const EX1=[
 {q:'Maria usually ______ to work by bus.',o:['goes','is going','went'],c:0},
 {q:'Look! The children ______ in the garden.',o:['play','played','are playing'],c:2},
 {q:'I ______ that movie last weekend.',o:['have seen','saw','see'],c:1},
 {q:'When I called John, he ______ dinner.',o:['was having','has','had'],c:0},
 {q:'She ______ in this company since 2021.',o:['works','worked','has worked'],c:2},
 {q:'I ______ English for two hours.',o:['have been studying','studied','study'],c:0},
 {q:'When we arrived at the station, the train ______ already ______.',o:['has / left','had / left','was / leaving'],c:1},
 {q:'I think Brazil ______ win the game.',o:['will','is','has'],c:0},
 {q:'Look at that car! It ______ crash!',o:['will','is going to','has'],c:1},
 {q:'This time tomorrow, I ______ on the beach.',o:['will relax','will be relaxing','relaxed'],c:1}
];

const EX2=[
 {t:'I {} here for five years.',v:'work',a:[['have worked',"'ve worked"]]},
 {t:'She {} dinner when I arrived.',v:'cook',a:[['was cooking']]},
 {t:'They {} Paris last year.',v:'visit',a:[['visited']]},
 {t:'He {} never {} Japanese food.',v:'eat',a:[['has',"'s"],['eaten']]},
 {t:'We {} TV right now.',v:'watch',a:[['are watching',"'re watching"]]},
 {t:'My father usually {} up at 6 a.m.',v:'get',a:[['gets']]},
 {t:'By next month, I {} {} the course.',v:'finish',a:[['will',"'ll"],['have finished']]},
 {t:'When I got home, my wife {} already {} to bed.',v:'go',a:[['had',"'d"],['gone']]},
 {t:'I think you {} this book.',v:'like',a:[['will like',"'ll like"]]},
 {t:'They {} to Argentina next month. They have already bought the tickets.',v:'travel',a:[['are going to travel',"'re going to travel"]]}
];

const EX3=[
 {w:"She don't like coffee.",a:["she doesn't like coffee","she does not like coffee"],k:"She doesn't like coffee."},
 {w:'I am work here every day.',a:['i work here every day'],k:'I work here every day.'},
 {w:"He didn't went to school yesterday.",a:["he didn't go to school yesterday","he did not go to school yesterday"],k:"He didn't go to school yesterday."},
 {w:'I have seen him yesterday.',a:['i saw him yesterday'],k:'I saw him yesterday.'},
 {w:'They was watching TV.',a:['they were watching tv'],k:'They were watching TV.'},
 {w:'She has been study English for two years.',a:['she has been studying english for two years',"she's been studying english for two years"],k:'She has been studying English for two years.'},
 {w:'When I arrived, they have already left.',a:['when i arrived they had already left'],k:'When I arrived, they had already left.'},
 {w:'I will going to call you tomorrow.',a:['i will call you tomorrow',"i'll call you tomorrow",'i am going to call you tomorrow',"i'm going to call you tomorrow"],k:'I will call you tomorrow.'}
];

const EX4=[
 {p:'Eu trabalho todos os dias.',a:['i work every day'],k:'I work every day.'},
 {p:'Estou estudando inglês agora.',a:['i am studying english now',"i'm studying english now",'i am studying english right now',"i'm studying english right now"],k:'I am studying English now.'},
 {p:'Nós fomos ao Rio de Janeiro no ano passado.',a:['we went to rio de janeiro last year'],k:'We went to Rio de Janeiro last year.'},
 {p:'Ela já terminou o trabalho.',a:['she has already finished the work',"she's already finished the work"],k:'She has already finished the work.'},
 {p:'Eu moro aqui há dez anos.',a:['i have lived here for ten years',"i've lived here for ten years",'i have been living here for ten years'],k:'I have lived here for ten years.'},
 {p:'Quando cheguei, ele já tinha saído.',a:['when i arrived he had already left','when i got home he had already left'],k:'When I arrived, he had already left.'},
 {p:'Acho que vai chover amanhã.',a:['i think it will rain tomorrow',"i think it'll rain tomorrow","i think it's going to rain tomorrow",'i think it is going to rain tomorrow'],k:'I think it will rain tomorrow.'},
 {p:'Nós vamos viajar no próximo mês.',a:['we are going to travel next month',"we're going to travel next month"],k:'We are going to travel next month.'},
 {p:'Amanhã, a esta hora, estarei trabalhando.',a:['this time tomorrow i will be working',"this time tomorrow i'll be working"],k:'This time tomorrow, I will be working.'},
 {p:'Até sexta-feira, terei terminado o projeto.',a:['by friday i will have finished the project',"by friday i'll have finished the project"],k:'By Friday, I will have finished the project.'}
];

const FIN=[
 ['Every morning, James ',{v:'wake',a:['wakes']},' up at 7 o\'clock. Today, however, he ',{v:'sleep',a:['is sleeping',"'s sleeping"]},' later because he ',{v:'work',a:['worked']},' until midnight yesterday.'],
 ['James ',{v:'work',a:['has worked',"'s worked"]},' for the same company since 2019. He ',{v:'start',a:['started']},' there after he graduated from university.'],
 ['When he arrived at work yesterday, his manager ',{a:['had',"'d"]},' already ',{v:'leave',a:['left']},'. James ',{v:'finish',a:['finished','had finished']},' an important project before he went home.'],
 ['Next week, James ',{v:'travel',a:['is going to travel',"'s going to travel"]},' to London for a business meeting. By the end of the trip, he ',{a:['will',"'ll"]},' ',{v:'meet',a:['have met']},' several important clients.']
];

const SPEAK=[
 ['Present','What do you usually do in the morning?'],
 ['Present','What are you doing these days?'],
 ['Past','What did you do last weekend?'],
 ['Past','What were you doing yesterday at 8 p.m.?'],
 ['Experience','Have you ever traveled to another country?'],
 ['Experience','How long have you been studying English?'],
 ['Future','What are you going to do next weekend?'],
 ['Future','What do you think your life will be like in five years?'],
 ['Warm-up','What are you doing these days that you weren\'t doing last year?'],
 ['Challenge','Tell a short story about your life using at least five different tenses.']
];

/* ============ HELPERS ============ */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const norm=s=>String(s).toLowerCase().replace(/[’‘`]/g,"'").replace(/[.,!?;:"]/g,'').replace(/\s+/g,' ').trim();
const byId=id=>T.find(x=>x.id===id);
const TOTAL=49;
const state={ex1:new Set(),ex2:0,ex3:0,ex4:0,fin:0};

function updateProgress(){
  const n=state.ex1.size+state.ex2+state.ex3+state.ex4+state.fin;
  $('#progTxt').textContent=n+'/'+TOTAL;
  $('#progFill').style.width=Math.min(100,(n/TOTAL)*100)+'%';
}

/* ============ TIMELINE SVG ============ */
function viz(marks){
  const W=320,H=80,x0=12,x1=308,Y=42,span=x1-x0;
  const X=t=>x0+t*span;
  let g='';
  marks.forEach(m=>{
    const tone=m.tone==='err'?'var(--err)':'currentColor';
    if(m.k==='s'){
      g+=`<rect x="${X(m.t)}" y="${Y-9}" width="${X(m.t2)-X(m.t)}" height="18" rx="9" fill="currentColor" opacity="${m.dash?.14:.22}" ${m.dash?'stroke="currentColor" stroke-dasharray="4 3" stroke-opacity=".55"':''}/>`;
    } else if(m.k==='a'){
      g+=`<line x1="${X(m.t)}" y1="${Y}" x2="${X(m.t2)-7}" y2="${Y}" stroke="currentColor" stroke-width="3" stroke-linecap="round" ${m.dash?'stroke-dasharray="5 4" stroke-opacity=".6"':''}/>
          <path d="M${X(m.t2)-8} ${Y-5} L${X(m.t2)} ${Y} L${X(m.t2)-8} ${Y+5} Z" fill="currentColor"/>`;
    } else if(m.k==='c'){
      g+=`<path d="M${X(m.t)} ${Y-11} Q ${(X(m.t)+X(m.t2))/2} ${Y-26} ${X(m.t2)} ${Y-11}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3" opacity=".65"/>`;
    } else if(m.k==='d'){
      g+=`<line x1="${X(m.t)}" y1="${Y-14}" x2="${X(m.t)}" y2="${Y+14}" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>`;
    } else {
      const r=m.big?6:4;
      g+=`<circle cx="${X(m.t)}" cy="${Y}" r="${r}" fill="${tone}"/>`;
      if(m.label)g+=`<text x="${X(m.t)}" y="${Y-13}" text-anchor="middle" font-family="var(--mono)" font-size="9" fill="currentColor" opacity=".7">${m.label}</text>`;
    }
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-hidden="true">
    <line x1="${x0}" y1="${Y}" x2="${x1}" y2="${Y}" stroke="var(--line-strong)" stroke-width="2"/>
    <line x1="${X(.55)}" y1="${Y-16}" x2="${X(.55)}" y2="${Y+16}" stroke="var(--now)" stroke-width="1.5" opacity=".8"/>
    <text x="${X(.55)}" y="${Y+28}" text-anchor="middle" font-family="var(--mono)" font-size="9" fill="var(--now)" letter-spacing="1.5">NOW</text>
    <text x="${x0}" y="${Y+28}" font-family="var(--mono)" font-size="9" fill="var(--faint)" letter-spacing="1">PAST</text>
    <text x="${x1}" y="${Y+28}" text-anchor="end" font-family="var(--mono)" font-size="9" fill="var(--faint)" letter-spacing="1">FUTURE</text>
    ${g}</svg>`;
}
const zoneColor=z=>({past:'var(--past)',bridge:'var(--bridge)',present:'var(--now)',future:'var(--future)'})[z];

/* ============ RENDER: zones ============ */
$('#zones').innerHTML=ZONES.map(z=>`
  <div class="zone" data-z="${z.z}">
    <h4>${z.t}</h4><small>${z.s}</small>
    ${z.ids.map(id=>{const t=byId(id);return `<button class="chip" data-go="${id}">${t.name}<u>${t.pt}</u></button>`}).join('')}
  </div>`).join('');

/* ============ RENDER: tense cards ============ */
$('#tenseList').innerHTML=T.map(t=>`
<article class="tense" data-z="${t.z}" id="t-${t.id}">
  <button class="tense-head" data-toggle="${t.id}" aria-expanded="false">
    <span class="num">${t.n}</span>
    <span><h3>${t.name}</h3><span class="pt">${t.pt}</span></span>
    <span class="caret">▼</span>
  </button>
  <div class="tense-body">
    <div class="formula">${esc(t.formula)}</div>
    <div class="viz" style="color:${zoneColor(t.z)}">${viz(t.marks)}<div class="cap">${t.vizCap}</div></div>
    <div class="grid2">
      <div>
        <div class="mini-h">Forma</div>
        <div class="tabs" data-tabs="${t.id}">
          <button class="tab on" data-f="aff">Afirmativa</button>
          <button class="tab" data-f="neg">Negativa</button>
          <button class="tab" data-f="que">Pergunta</button>
        </div>
        <div data-forms="${t.id}">${t.forms.aff.map(s=>`<p class="sent">${esc(s)}</p>`).join('')}</div>
        ${t.warn?`<div class="warn"><s>${esc(t.warn[0])}</s><br><i>${esc(t.warn[1])}</i></div>`:''}
      </div>
      <div>
        <div class="mini-h">Quando usar</div>
        <ul class="uses">${t.uses.map(u=>`<li><span class="u-t">${u[0]}</span><span class="u-e">${esc(u[1])}</span></li>`).join('')}</ul>
        ${t.pills?`<div class="mini-h" style="margin-top:16px">Marcadores de tempo</div><div class="pill-row">${t.pills.map(p=>`<span class="pill">${esc(p)}</span>`).join('')}</div>`:''}
      </div>
    </div>
    ${t.more?`<div class="mini-h" style="margin-top:20px">Mais exemplos</div>${t.more.map(s=>`<p class="sent">${esc(s)}</p>`).join('')}`:''}
  </div>
</article>`).join('');

document.addEventListener('click',e=>{
  const go=e.target.closest('[data-go]');
  if(go){
    const id=go.dataset.go,card=$('#t-'+id);
    card.classList.add('open');$('[data-toggle="'+id+'"]',card).setAttribute('aria-expanded','true');
    card.scrollIntoView({behavior:'smooth',block:'center'});return;
  }
  const tg=e.target.closest('[data-toggle]');
  if(tg){
    const card=tg.closest('.tense');const on=card.classList.toggle('open');
    tg.setAttribute('aria-expanded',on?'true':'false');return;
  }
  const tab=e.target.closest('.tab');
  if(tab){
    const box=tab.closest('.tabs'),id=box.dataset.tabs,t=byId(id);
    $$('.tab',box).forEach(b=>b.classList.toggle('on',b===tab));
    $('[data-forms="'+id+'"]').innerHTML=t.forms[tab.dataset.f].map(s=>`<p class="sent">${esc(s)}</p>`).join('');
  }
});
$('#openAll').onclick=()=>$$('.tense').forEach(c=>{c.classList.add('open');$('.tense-head',c).setAttribute('aria-expanded','true')});
$('#closeAll').onclick=()=>$$('.tense').forEach(c=>{c.classList.remove('open');$('.tense-head',c).setAttribute('aria-expanded','false')});

/* ============ RENDER: compare ============ */
$('#cmpList').innerHTML=CMP.map((c,i)=>`
<div class="cmp" data-cmp="${i}">
  <div class="cmp-top">
    <h3>${c.t}</h3>
    <div class="switch"><button class="on" data-side="a">${c.a.l}</button><button data-side="b">${c.b.l}</button></div>
  </div>
  <div class="cmp-out"><div class="big">${esc(c.a.s)}</div><div class="why">${c.a.w}</div></div>
</div>`).join('');
$$('.cmp .switch button').forEach(b=>b.onclick=()=>{
  const box=b.closest('.cmp'),c=CMP[+box.dataset.cmp],d=c[b.dataset.side];
  $$('button',b.parentElement).forEach(x=>x.classList.toggle('on',x===b));
  $('.cmp-out',box).innerHTML=`<div class="big">${esc(d.s)}</div><div class="why">${d.w}</div>`;
});

/* ============ RENDER: decision tree ============ */
function drawTree(node,depth){
  const el=$('#tree');
  el.innerHTML=`<div class="q">${node.q}</div><div class="opts">${node.opts.map((o,i)=>`<button class="opt" data-i="${i}">${o.l}</button>`).join('')}</div>
    ${depth?'<div class="actions"><button class="btn" id="treeBack">Voltar ao início</button></div>':''}`;
  $$('.opt',el).forEach(b=>b.onclick=()=>{
    const o=node.opts[+b.dataset.i];
    if(o.opts)drawTree(o,depth+1);else showRes(o);
  });
  if(depth)$('#treeBack').onclick=()=>drawTree(TREE,0);
}
function showRes(o){
  const t=byId(o.r);
  $('#tree').innerHTML=`<div class="tree-res">
    <div class="eyebrow">Use</div>
    <div class="name">${t.name}</div>
    <div class="ex">${esc(o.ex)}</div>
    <div class="actions" style="justify-content:center">
      <button class="btn primary" data-go="${t.id}">Ver a explicação</button>
      <button class="btn" id="treeBack">Recomeçar</button>
    </div></div>`;
  $('#treeBack').onclick=()=>drawTree(TREE,0);
}
drawTree(TREE,0);

/* ============ EX1 ============ */
$('#ex1List').innerHTML=EX1.map((q,i)=>`
<div class="q-item">
  <div class="q-text"><span class="q-num">${i+1}</span><span>${esc(q.q)}</span></div>
  <div class="choices" data-q="${i}">${q.o.map((o,j)=>`<button class="choice" data-j="${j}">${'abc'[j]}) ${esc(o)}</button>`).join('')}</div>
</div>`).join('');
$$('#ex1List .choice').forEach(b=>b.onclick=()=>{
  const box=b.parentElement,i=+box.dataset.q,q=EX1[i],j=+b.dataset.j;
  $$('.choice',box).forEach(x=>{x.disabled=true;if(+x.dataset.j===q.c)x.classList.add('right')});
  if(j!==q.c)b.classList.add('wrong');else state.ex1.add(i);
  $('#ex1Score').textContent=state.ex1.size+' / 10';updateProgress();
});

/* ============ gap-based exercises ============ */
function gapHTML(len){return `<input class="gap${len?' wide':''}" type="text" autocomplete="off" autocapitalize="none" spellcheck="false">`}

function renderTemplate(item,idx){
  let n=0;
  const body=item.t.split('{}').map((chunk,i,arr)=>esc(chunk)+(i<arr.length-1?gapHTML(item.a[n++][0].length>10):'')).join('');
  return `<div class="q-item" data-i="${idx}">
    <div class="line"><span class="q-num">${idx+1}</span><span class="body">${body} <span class="verb-tag">(${item.v})</span></span></div>
    <div class="sol"></div></div>`;
}
$('#ex2List').innerHTML=EX2.map(renderTemplate).join('');

$('#ex3List').innerHTML=EX3.map((it,i)=>`
<div class="q-item" data-i="${i}">
  <div class="line"><span class="q-num">${i+1}</span><span class="body" style="line-height:1.7">
    <s style="color:var(--err);opacity:.8">${esc(it.w)}</s><br>
    <input class="gap wide" style="width:100%;min-width:0" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="frase corrigida">
  </span></div>
  <div class="sol"></div></div>`).join('');

$('#ex4List').innerHTML=EX4.map((it,i)=>`
<div class="q-item" data-i="${i}">
  <div class="line"><span class="q-num">${i+1}</span><span class="body" style="line-height:1.7">
    ${esc(it.p)}<br>
    <input class="gap wide" style="width:100%;min-width:0" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="in English…">
  </span></div>
  <div class="sol"></div></div>`).join('');

$('#finalList').innerHTML=FIN.map(par=>'<p>'+par.map(seg=>{
  if(typeof seg==='string')return esc(seg);
  return gapHTML(seg.a[0].length>10)+(seg.v?` <span class="verb-tag">(${seg.v})</span>`:'');
}).join('')+'</p>').join('');

function check(inp,answers){
  const v=norm(inp.value);
  const ok=v!==''&&answers.some(a=>norm(a)===v);
  inp.classList.remove('right','wrong');
  inp.classList.add(ok?'right':'wrong');
  return ok;
}

function checkTemplate(listSel,data,scoreSel,key){
  let hit=0,total=0;
  $$(listSel+' .q-item').forEach(item=>{
    const d=data[+item.dataset.i];const inps=$$('input',item);
    let all=true;
    inps.forEach((inp,k)=>{total++;if(check(inp,d.a[k]))hit++;else all=false});
    const sol=$('.sol',item);
    sol.classList.toggle('show',!all);
    sol.textContent=all?'':'✓ '+d.a.map(x=>x[0]).join('  ·  ');
  });
  $(scoreSel).textContent=$$(listSel+' .q-item').filter(it=>$$('input',it).every(i=>i.classList.contains('right'))).length+' / '+data.length;
  state[key]=$$(listSel+' .q-item').filter(it=>$$('input',it).every(i=>i.classList.contains('right'))).length;
  updateProgress();
}

function checkSentence(listSel,data,scoreSel,key){
  let hit=0;
  $$(listSel+' .q-item').forEach(item=>{
    const d=data[+item.dataset.i],inp=$('input',item);
    const ok=d.a.some(a=>norm(a)===norm(inp.value));
    inp.classList.remove('right','wrong');inp.classList.add(ok?'right':'wrong');
    if(ok)hit++;
    const sol=$('.sol',item);sol.classList.toggle('show',!ok);sol.textContent=ok?'':'✓ '+d.k;
  });
  $(scoreSel).textContent=hit+' / '+data.length;state[key]=hit;updateProgress();
}

function checkFinal(){
  const inps=$$('#finalList input');let flat=[],hit=0;
  FIN.forEach(p=>p.forEach(s=>{if(typeof s!=='string')flat.push(s)}));
  inps.forEach((inp,i)=>{if(check(inp,flat[i].a))hit++});
  $('#finScore').textContent=hit+' / '+flat.length;state.fin=hit;updateProgress();
}

document.addEventListener('click',e=>{
  const c=e.target.closest('[data-check]'),s=e.target.closest('[data-show]'),r=e.target.closest('[data-reset]');
  if(c){
    const k=c.dataset.check;
    if(k==='ex2')checkTemplate('#ex2List',EX2,'#ex2Score','ex2');
    if(k==='ex3')checkSentence('#ex3List',EX3,'#ex3Score','ex3');
    if(k==='ex4')checkSentence('#ex4List',EX4,'#ex4Score','ex4');
    if(k==='fin')checkFinal();
  }
  if(s){
    const k=s.dataset.show;
    if(k==='ex2')$$('#ex2List .q-item').forEach(it=>{const d=EX2[+it.dataset.i];$$('input',it).forEach((inp,j)=>inp.value=d.a[j][0]);checkTemplate('#ex2List',EX2,'#ex2Score','ex2')});
    if(k==='ex3')$$('#ex3List .q-item').forEach(it=>$('input',it).value=EX3[+it.dataset.i].k),checkSentence('#ex3List',EX3,'#ex3Score','ex3');
    if(k==='ex4')$$('#ex4List .q-item').forEach(it=>$('input',it).value=EX4[+it.dataset.i].k),checkSentence('#ex4List',EX4,'#ex4Score','ex4');
    if(k==='fin'){const flat=[];FIN.forEach(p=>p.forEach(x=>{if(typeof x!=='string')flat.push(x)}));$$('#finalList input').forEach((inp,i)=>inp.value=flat[i].a[0]);checkFinal();}
  }
  if(r){
    const k=r.dataset.reset;
    if(k==='ex1'){state.ex1.clear();$('#ex1Score').textContent='0 / 10';
      $$('#ex1List .choice').forEach(b=>{b.disabled=false;b.classList.remove('right','wrong')});}
    else{
      const map={ex2:'#ex2List',ex3:'#ex3List',ex4:'#ex4List',fin:'#finalList'};
      $$(map[k]+' input').forEach(i=>{i.value='';i.classList.remove('right','wrong')});
      $$(map[k]+' .sol').forEach(x=>x.classList.remove('show'));
      state[k]=0;
      const sc={ex2:['#ex2Score','— / 10'],ex3:['#ex3Score','— / 8'],ex4:['#ex4Score','— / 10'],fin:['#finScore','— / 11']}[k];
      $(sc[0]).textContent=sc[1];
    }
    updateProgress();
  }
});

/* ============ speaking ============ */
let spi=0;
$('#spNext').onclick=()=>{
  spi=(spi+1)%SPEAK.length;
  $('#spTag').textContent=SPEAK[spi][0];
  $('#spQ').textContent=SPEAK[spi][1];
};

/* ============ sidebar ============ */
(function(){
  const sec=[
    ['Guia',[['linha','Linha do tempo'],['tempos','Os 11 tempos'],['comparar','Comparações'],['qual','Qual tempo usar?']]],
    ['Prática',[['ex1','Exercise 1 · múltipla escolha'],['ex2','Exercise 2 · completar'],['ex3','Exercise 3 · corrigir'],['ex4','Exercise 4 · traduzir'],['final','Final challenge'],['speaking','Speaking practice']]]
  ];
  let h='';
  h+=`<div class="side-h">${sec[0][0]}</div>`+sec[0][1].map(x=>`<a class="snav" href="#${x[0]}" data-spy="${x[0]}">${x[1]}</a>`).join('');
  ZONES.forEach(z=>{
    h+=`<div class="side-h" style="color:${zoneColor(z.z)}">${z.t}</div>`;
    h+=z.ids.map(id=>{const t=byId(id);
      return `<button class="snav" data-go="${id}" data-spy="t-${id}"><span class="dot" style="background:${zoneColor(z.z)}"></span>${t.name}</button>`}).join('');
  });
  h+=`<div class="side-h">${sec[1][0]}</div>`+sec[1][1].map(x=>`<a class="snav" href="#${x[0]}" data-spy="${x[0]}">${x[1]}</a>`).join('');
  $('#sideNav').innerHTML=h;

  const side=$('#side'),scrim=$('#scrim'),menu=$('#menuBtn');
  const wide=()=>window.matchMedia('(min-width:1120px)').matches;
  const open=v=>{side.classList.toggle('open',v);scrim.classList.toggle('on',v);menu.setAttribute('aria-expanded',v?'true':'false')};
  menu.onclick=()=>open(!side.classList.contains('open'));
  scrim.onclick=()=>open(false);
  $('#sideClose').onclick=()=>open(false);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')open(false)});
  $('#sideNav').addEventListener('click',e=>{if(e.target.closest('.snav')&&!wide())open(false)});

  const links=$$('#sideNav .snav');
  const targets=links.map(l=>({l,el:document.getElementById(l.dataset.spy)})).filter(x=>x.el);
  let tick=false;
  function spy(){
    tick=false;let cur=targets[0];
    targets.forEach(t=>{if(t.el.getBoundingClientRect().top<=140)cur=t});
    links.forEach(l=>l.classList.toggle('active',l===cur.l));
  }
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(spy)}},{passive:true});
  addEventListener('resize',()=>{if(wide())open(false)});
  spy();
})();

/* ============ theme ============ */
$('#themeBtn').onclick=()=>{
  const cur=document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';
  document.documentElement.setAttribute('data-theme',cur);
};

updateProgress();
