const c=window.APP_CONFIG||{},ok=c.SUPABASE_URL&&!c.SUPABASE_URL.includes("COLE_AQUI")&&c.SUPABASE_ANON_KEY&&!c.SUPABASE_ANON_KEY.includes("COLE_AQUI");
const L=document.querySelector("#login"),A=document.querySelector("#app"),N=document.querySelector("#note"),S=document.querySelector("#status"),M=document.querySelector("#msg");
let db,user,timer;
function resize(){N.style.height="auto";N.style.height=Math.max(N.scrollHeight,innerHeight-84)+"px"}
async function open(u){user=u;L.classList.add("hidden");A.classList.remove("hidden");S.textContent="Carregando...";
let {data,error}=await db.from("notes").select("content").eq("user_id",u.id).maybeSingle();N.value=data?.content||"";S.textContent=error?"Erro ao carregar":"Salvo ✓";resize()}
function close(){user=null;N.value="";A.classList.add("hidden");L.classList.remove("hidden")}
async function save(){if(!user)return;S.textContent="Salvando...";let {error}=await db.from("notes").upsert({user_id:user.id,content:N.value,updated_at:new Date().toISOString()},{onConflict:"user_id"});S.textContent=error?"Erro ao salvar":"Salvo ✓"}
N.oninput=()=>{resize();S.textContent="Digitando...";clearTimeout(timer);timer=setTimeout(save,700)}
if(!ok)M.textContent="Falta conectar o armazenamento antes de publicar.";else{db=supabase.createClient(c.SUPABASE_URL,c.SUPABASE_ANON_KEY);db.auth.getSession().then(x=>x.data.session&&open(x.data.session.user));db.auth.onAuthStateChange((e,s)=>s?.user?open(s.user):close())}
loginBtn.onclick=async()=>{if(!db)return;M.textContent="";let {error}=await db.auth.signInWithPassword({email:email.value.trim(),password:password.value});if(error)M.textContent="Confira e-mail e senha."}
signupBtn.onclick=async()=>{if(!db)return;let {error}=await db.auth.signUp({email:email.value.trim(),password:password.value});M.textContent=error?"Não foi possível criar a conta.":"Conta criada. Confira seu e-mail se solicitado."}
logoutBtn.onclick=()=>db&&db.auth.signOut();addEventListener("resize",resize);