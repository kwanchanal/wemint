
const STATE = { account:null, chainId:null };
const LS_KEYS = { TOKENS:"pad3_tokens_v1" };
const $=(s,r=document)=>r.querySelector(s);
function fmtAddr(a){ if(!a) return ""; return `${a.slice(0,6)}…${a.slice(-4)}`; }
function randomHex(n){ const c="abcdef0123456789"; let s="0x"; for(let i=0;i<n;i++) s+=c[Math.floor(Math.random()*c.length)]; return s; }
function loadTokens(){ try{ return JSON.parse(localStorage.getItem(LS_KEYS.TOKENS)||"[]"); }catch(e){ return []; } }
function saveTokens(v){ localStorage.setItem(LS_KEYS.TOKENS, JSON.stringify(v)); }

function ensureHeader(){
  const loginBtn=$("#loginBtn"); const addr=$("#addrTxt");
  if(!window.ethereum){ loginBtn.textContent="Install MetaMask"; loginBtn.onclick=()=>window.open("https://metamask.io","_blank"); return; }
  loginBtn.onclick=async()=>{
    if(STATE.account){ STATE.account=null; STATE.chainId=null; sessionStorage.removeItem("pad3_account"); addr.textContent="log-in"; loginBtn.textContent="log-in"; return; }
    try{
      const accounts=await window.ethereum.request({method:'eth_requestAccounts'});
      STATE.account=accounts[0]; STATE.chainId=await window.ethereum.request({method:'eth_chainId'});
      sessionStorage.setItem("pad3_account", STATE.account);
      addr.textContent=fmtAddr(STATE.account); loginBtn.textContent="disconnect";
    }catch(e){ alert("Wallet connect cancelled/failed."); }
  };
  const cached=sessionStorage.getItem("pad3_account");
  if(cached){ STATE.account=cached; addr.textContent=fmtAddr(cached); loginBtn.textContent="disconnect"; }
  window.ethereum?.on?.('accountsChanged',()=>location.reload());
  window.ethereum?.on?.('chainChanged',()=>location.reload());
}

function renderHome(){
  const grid=$("#homeGrid"); if(!grid) return;
  const list=loadTokens().slice().reverse();
  grid.innerHTML = list.length? list.map(t=>`
    <div class="card">
      <div class="token-card">
        <img src="${t.image||''}" alt="img"/>
        <div>
          <div class="token-title">${t.network} — ${t.name} <span style="color:#333">(${t.symbol})</span></div>
          <div class="token-desc">${t.desc||''}</div>
          <div class="token-meta">addr: <span class="kbd">${fmtAddr(t.address)}</span></div>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:10px">
        <a class="btn" href="created.html?token=${encodeURIComponent(t.address)}">view</a>
        <button class="btn copy" data-copy="${t.claimUrl}">copy claim link</button>
      </div>
    </div>
  `).join("") : `<div class="help">No coins yet. <a href="create.html" style="color:#6FCF97">create coin</a></div>`;
}

function initCreate(){
  const form=$("#createForm"); if(!form) return;
  const imgInput=$("#tokenImage"), imgPreview=$("#imgPreview");
  imgInput.addEventListener("change",(e)=>{ const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ imgPreview.src=r.result; imgPreview.style.display="block"; }; r.readAsDataURL(f); });
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    if(!STATE.account){ alert("Please log-in first."); return; }
    const name=$("#name").value.trim(), symbol=$("#symbol").value.trim(), desc=$("#desc").value.trim(), supply=$("#supply").value.trim(), image=imgPreview.src||"";
    if(!name||!symbol||!supply){ alert("Name, Symbol, Supply are required."); return; }
    const btn=$("#createBtn"); btn.disabled=true; btn.textContent="creating…";
    await new Promise(r=>setTimeout(r,1000));
    const token={address:randomHex(40), txHash:randomHex(64), name,symbol,desc,image,network:"BASE",standard:"ERC-20",owner:STATE.account,createdAt:Date.now(),supply};
    token.claimUrl = location.origin + location.pathname.replace(/\/[^\/]*$/,"/") + "created.html?token=" + encodeURIComponent(token.address);
    const all=loadTokens(); all.push(token); saveTokens(all);
    location.href = `created.html?token=${encodeURIComponent(token.address)}`;
  });
}

function renderCreated(){
  const wrap=$("#createdWrap"); if(!wrap) return;
  const addrParam=new URLSearchParams(location.search).get("token");
  const list=loadTokens(); const t=list.find(x=>x.address===addrParam)||list[list.length-1];
  if(!t){ wrap.innerHTML='<div class="help">Token not found.</div>'; return; }
  wrap.innerHTML = `
    <div class="centered">
      <div class="h2">CREATED</div>
      <div class="h2" style="margin-top:-8px">READY TO CLAIM</div>
      <div style="display:flex;justify-content:center;margin:18px 0">
        <div class="token-card" style="width:420px">
          <img src="${t.image||''}" alt="img"/>
          <div style="width:100%">
            <div class="token-title">${t.name}</div>
            <div class="token-desc">${t.desc||''}</div>
            <div class="token-meta">${fmtAddr(t.address)}</div>
          </div>
        </div>
      </div>
      <div>
        <img src="assets/img/heart.png" class="heart-img" onerror="this.style.display='none';document.getElementById('heartEmoji').style.display='inline'">
        <span id="heartEmoji" class="heart" style="display:none">❤</span>
      </div>
      <a class="cta" href="${t.claimUrl}" onclick="return false">TO CLAIM</a>
      <div style="margin-top:12px" class="claim-link" id="claimLink">${t.claimUrl}</div>
      <button class="btn copy" data-copy="${t.claimUrl}" style="margin-top:10px">copy link</button>
    </div>
  `;
}

document.addEventListener("click",(e)=>{ const btn=e.target.closest(".copy"); if(!btn) return; const text=btn.getAttribute("data-copy"); navigator.clipboard.writeText(text).then(()=>{ btn.textContent="copied ✓"; setTimeout(()=>btn.textContent="copy link",1200); }); });

function boot(){ ensureHeader(); renderHome(); initCreate(); renderCreated(); }
document.addEventListener("DOMContentLoaded", boot);
