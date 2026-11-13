// Theme, menu
const root=document.documentElement,nav=document.getElementById('nav'),menuBtn=document.getElementById('menuBtn');
try{const t=localStorage.getItem('theme');if(t)root.dataset.theme=t}catch(e){}
document.getElementById('theme').addEventListener('click',function(){
  const cur=root.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  const next=cur==='dark'?'light':'dark';root.dataset.theme=next;try{localStorage.setItem('theme',next)}catch(e){}});
menuBtn.addEventListener('click',function(){menuBtn.setAttribute('aria-expanded',nav.classList.toggle('open'))});

// Hero: profile typed out as code
const typed=document.getElementById('typed');
if(typed){
  const text='const me = {\n  name: "Clement Precious",\n  study: "Computer Science",\n  from: "Lagos",\n  goal: "Software Engineer",\n  coding: true\n};';
  const paint=function(s){typed.innerHTML=s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"[^"]*"/g,'<span class="s">$&</span>').replace(/^(\s*)(\w+)(:)/gm,'$1<span class="k">$2</span>$3')};
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){paint(text)}else{let i=0;(function tick(){paint(text.slice(0,++i));if(i<text.length)setTimeout(tick,38)})()}
}

// Academic planner
const form=document.getElementById('taskForm');
if(form){
  const input=document.getElementById('taskInput'),list=document.getElementById('taskList'),empty=document.getElementById('empty');
  let tasks=[],filter='all';
  try{tasks=JSON.parse(localStorage.getItem('tasks'))||[]}catch(e){}
  const save=function(){try{localStorage.setItem('tasks',JSON.stringify(tasks))}catch(e){}};
  function render(){
    list.innerHTML='';
    const shown=tasks.filter(function(t){return filter==='all'||(filter==='done')===t.done});
    shown.forEach(function(t){
      const li=document.createElement('li');if(t.done)li.className='done';
      const box=document.createElement('input');box.type='checkbox';box.checked=t.done;box.setAttribute('aria-label','Mark "'+t.text+'" as completed');
      box.addEventListener('change',function(){t.done=!t.done;save();render()});
      const sp=document.createElement('span');sp.textContent=t.text;
      const del=document.createElement('button');del.className='del';del.textContent='Delete';
      del.addEventListener('click',function(){tasks=tasks.filter(function(x){return x.id!==t.id});save();render()});
      li.append(box,sp,del);list.appendChild(li);
    });
    const done=tasks.filter(function(t){return t.done}).length,pct=tasks.length?Math.round(done/tasks.length*100):0;
    document.getElementById('bar').style.width=pct+'%';document.getElementById('pct').textContent=pct+'%';
    empty.textContent=shown.length?'':(tasks.length?'Nothing in this view.':'No tasks yet. Type one above and press Add task.');
  }
  form.addEventListener('submit',function(e){e.preventDefault();const v=input.value.trim();if(!v)return;tasks.unshift({id:Date.now(),text:v,done:false});save();input.value='';render()});
  document.getElementById('tabs').addEventListener('click',function(e){const b=e.target.closest('button');if(!b)return;filter=b.dataset.f;this.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)});render()});
  document.getElementById('clearDone').addEventListener('click',function(){tasks=tasks.filter(function(t){return!t.done});save();render()});
  render();
}

// Contact form validation
const cf=document.getElementById('contactForm');
if(cf){
  const rules={
    name:function(v){return v?'':'Enter your name.'},
    email:function(v){return!v?'Enter your email address.':/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?'':'Enter a valid email, like name@example.com.'},
    phone:function(v){return!v?'Enter your phone number.':/^[0-9]+$/.test(v)?'':'Use digits only, with no spaces or symbols.'},
    message:function(v){return v?'':'Write a message.'}
  };
  function check(id){const el=document.getElementById(id),msg=rules[id](el.value.trim());document.getElementById(id+'Err').textContent=msg;el.classList.toggle('bad',!!msg);return!msg}
  Object.keys(rules).forEach(function(id){document.getElementById(id).addEventListener('blur',function(){check(id)});document.getElementById(id).addEventListener('input',function(){if(this.classList.contains('bad'))check(id)})});
  cf.addEventListener('submit',function(e){
    e.preventDefault();
    if(Object.keys(rules).map(check).every(Boolean)){
      document.getElementById('okText').textContent='Thank you, '+document.getElementById('name').value.trim()+'. I will reply as soon as I can.';
      cf.style.display='none';document.getElementById('okBox').classList.add('show');cf.reset();
    }
  });
  document.getElementById('again').addEventListener('click',function(){document.getElementById('okBox').classList.remove('show');cf.style.display='flex'});
}
