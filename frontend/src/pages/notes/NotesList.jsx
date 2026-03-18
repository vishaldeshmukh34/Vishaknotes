import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { logout, getUsername } from '../../utils/auth';

// Dark mode card palettes
const DARK_PALETTE = [
  { name:'Void',    bg:'#0f0f0f', accent:'#e2e2e2', glow:'#ffffff' },
  { name:'Crimson', bg:'#1a0808', accent:'#ff6b6b', glow:'#ff6b6b' },
  { name:'Ember',   bg:'#1a1008', accent:'#ff9f43', glow:'#ff9f43' },
  { name:'Aurora',  bg:'#081a0f', accent:'#26de81', glow:'#26de81' },
  { name:'Ocean',   bg:'#081018', accent:'#45aaf2', glow:'#45aaf2' },
  { name:'Nebula',  bg:'#100818', accent:'#a29bfe', glow:'#a29bfe' },
  { name:'Sakura',  bg:'#1a0812', accent:'#fd79a8', glow:'#fd79a8' },
];

// Light mode card palettes — soft, airy, beautiful
const LIGHT_PALETTE = [
  { name:'Cloud',   bg:'#ffffff', accent:'#6366f1', border:'#e0e7ff' },
  { name:'Rose',    bg:'#fff1f3', accent:'#f43f5e', border:'#ffd6dc' },
  { name:'Peach',   bg:'#fff7ed', accent:'#f97316', border:'#fed7aa' },
  { name:'Lime',    bg:'#f0fdf4', accent:'#22c55e', border:'#bbf7d0' },
  { name:'Sky',     bg:'#eff6ff', accent:'#3b82f6', border:'#bfdbfe' },
  { name:'Violet',  bg:'#f5f3ff', accent:'#8b5cf6', border:'#ddd6fe' },
  { name:'Pink',    bg:'#fdf4ff', accent:'#d946ef', border:'#f0abfc' },
];

const MESHES = [
  'radial-gradient(ellipse at 15% 15%, #7c3aed28 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, #06b6d428 0%, transparent 55%)',
  'radial-gradient(ellipse at 85% 15%, #f4370028 0%, transparent 55%), radial-gradient(ellipse at 15% 85%, #ff9f4328 0%, transparent 55%)',
  'radial-gradient(ellipse at 50% 5%,  #26de8128 0%, transparent 55%), radial-gradient(ellipse at 50% 95%, #45aaf228 0%, transparent 55%)',
  'radial-gradient(ellipse at 5% 50%,  #fd79a828 0%, transparent 55%), radial-gradient(ellipse at 95% 50%, #a29bfe28 0%, transparent 55%)',
];

export default function NotesList() {
  const navigate = useNavigate();
  const [notes, setNotes]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editNote, setEditNote]     = useState(null);
  const [form, setForm]             = useState({ title:'', content:'', pi:0 });
  const [search, setSearch]         = useState('');
  const [dm, setDm]                 = useState(() => localStorage.getItem('dm') !== 'false');
  const [pinned, setPinned]         = useState(() => JSON.parse(localStorage.getItem('pinned') || '[]'));
  const [palMap, setPalMap]         = useState(() => JSON.parse(localStorage.getItem('palMap') || '{}'));
  const [meshMap, setMeshMap]       = useState(() => JSON.parse(localStorage.getItem('meshMap') || '{}'));
  const [showProfile, setShowProfile] = useState(false);
  const [avatar, setAvatar]         = useState(() => localStorage.getItem('avatar') || null);
  const [drawer, setDrawer]         = useState(false);
  const [toast, setToast]           = useState(null);
  const [filter, setFilter]         = useState('all');
  const [view, setView]             = useState(() => localStorage.getItem('view') || 'grid');
  const drawerRef = useRef(null);
  const username = getUsername();

  const PALETTE = dm ? DARK_PALETTE : LIGHT_PALETTE;

  const T = (msg, type='ok') => { setToast({msg,type}); setTimeout(()=>setToast(null),2600); };

  const load = async () => {
    try { const r = await api.get('/notes'); setNotes(r.data); }
    catch { T('Failed to load','err'); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);
  useEffect(()=>{ localStorage.setItem('pinned', JSON.stringify(pinned)); },[pinned]);
  useEffect(()=>{ localStorage.setItem('palMap', JSON.stringify(palMap)); },[palMap]);
  useEffect(()=>{ localStorage.setItem('meshMap', JSON.stringify(meshMap)); },[meshMap]);
  useEffect(()=>{ localStorage.setItem('dm', dm); },[dm]);
  useEffect(()=>{ localStorage.setItem('view', view); },[view]);

  useEffect(()=>{
    const fn = e => { if(drawerRef.current && !drawerRef.current.contains(e.target)) setDrawer(false); };
    if(drawer) document.addEventListener('mousedown', fn);
    return ()=> document.removeEventListener('mousedown', fn);
  },[drawer]);

  const save = async (e) => {
    e.preventDefault();
    try {
      if(editNote){
        await api.put(`/notes/${editNote.id}`, { title:form.title, content:form.content });
        setPalMap(p=>({...p, [editNote.id]:form.pi}));
        T('Updated ✦');
      } else {
        const r = await api.post('/notes', { title:form.title, content:form.content });
        const mi = Math.floor(Math.random()*MESHES.length);
        setPalMap(p=>({...p, [r.data.id]:form.pi}));
        setMeshMap(p=>({...p, [r.data.id]:mi}));
        T('Saved ✦');
      }
      setForm({title:'',content:'',pi:0}); setShowForm(false); setEditNote(null); load();
    } catch { T('Save failed','err'); }
  };

  const del = async (id) => {
    if(!window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setPinned(p=>p.filter(x=>x!==id));
      setPalMap(p=>{ const n={...p}; delete n[id]; return n; });
      load(); T('Deleted','err');
    } catch { T('Delete failed','err'); }
  };

  const edit = (note) => {
    setEditNote(note);
    setForm({title:note.title, content:note.content, pi:palMap[note.id]||0});
    setShowForm(true);
    window.scrollTo({top:0,behavior:'smooth'});
  };

  const pin = (id) => {
    setPinned(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
    T(pinned.includes(id)?'Unpinned':'Pinned ◆');
  };

  const avatarChange = (e) => {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onloadend=()=>{ setAvatar(r.result); localStorage.setItem('avatar',r.result); };
    r.readAsDataURL(f);
  };

  const displayed = notes
    .filter(n=>{
      const q=search.toLowerCase();
      const m = n.title.toLowerCase().includes(q)||n.content?.toLowerCase().includes(q);
      if(filter==='pinned') return m && pinned.includes(n.id);
      return m;
    })
    .sort((a,b)=>{ const aP=pinned.includes(a.id),bP=pinned.includes(b.id); if(aP&&!bP)return -1; if(!aP&&bP)return 1; return 0; });

  // ── DESIGN TOKENS (swap based on mode) ──
  const C = dm ? {
    // DARK MODE TOKENS
    bg:           '#07070f',
    bgSecondary:  '#0e0e1c',
    surface:      '#0e0e1c',
    surfaceHover: '#141428',
    glass:        'rgba(7,7,15,0.88)',
    border:       'rgba(255,255,255,0.07)',
    borderHover:  'rgba(139,92,246,0.3)',
    t1:           '#ede9ff',
    t2:           '#6b6490',
    t3:           'rgba(255,255,255,0.22)',
    accent:       '#8b5cf6',
    accentBg:     'rgba(139,92,246,0.12)',
    accentBorder: 'rgba(139,92,246,0.25)',
    acc2:         '#06b6d4',
    danger:       '#ff6b6b',
    dangerBg:     'rgba(255,107,107,0.1)',
    dangerBorder: 'rgba(255,107,107,0.22)',
    success:      '#26de81',
    successBg:    'rgba(38,222,129,0.1)',
    inputBg:      'rgba(255,255,255,0.04)',
    headerBg:     'rgba(7,7,15,0.88)',
    drawerBg:     '#0a0a18',
    modalBg:      '#0a0a18',
    pillBg:       'rgba(255,255,255,0.05)',
    pillBorder:   'rgba(255,255,255,0.07)',
    toggleBg:     'rgba(255,255,255,0.05)',
    statBg:       'rgba(139,92,246,0.08)',
    emptyIconBg:  'rgba(139,92,246,0.1)',
    fabGlow:      'rgba(139,92,246,0.5)',
    toastOkBg:    'rgba(8,20,16,0.95)',
    toastErrBg:   'rgba(26,8,8,0.95)',
  } : {
    // LIGHT MODE TOKENS
    bg:           '#f8f6ff',
    bgSecondary:  '#f0ecff',
    surface:      '#ffffff',
    surfaceHover: '#f5f3ff',
    glass:        'rgba(248,246,255,0.92)',
    border:       'rgba(139,92,246,0.12)',
    borderHover:  'rgba(139,92,246,0.4)',
    t1:           '#1e1340',
    t2:           '#7c6fa0',
    t3:           'rgba(30,19,64,0.35)',
    accent:       '#7c3aed',
    accentBg:     'rgba(124,58,237,0.08)',
    accentBorder: 'rgba(124,58,237,0.2)',
    acc2:         '#0ea5e9',
    danger:       '#e11d48',
    dangerBg:     'rgba(225,29,72,0.07)',
    dangerBorder: 'rgba(225,29,72,0.18)',
    success:      '#059669',
    successBg:    'rgba(5,150,105,0.08)',
    inputBg:      'rgba(124,58,237,0.04)',
    headerBg:     'rgba(248,246,255,0.92)',
    drawerBg:     '#ffffff',
    modalBg:      '#ffffff',
    pillBg:       'rgba(124,58,237,0.06)',
    pillBorder:   'rgba(124,58,237,0.12)',
    toggleBg:     'rgba(124,58,237,0.06)',
    statBg:       'rgba(124,58,237,0.06)',
    emptyIconBg:  'rgba(124,58,237,0.07)',
    fabGlow:      'rgba(124,58,237,0.4)',
    toastOkBg:    'rgba(240,253,248,0.97)',
    toastErrBg:   'rgba(255,241,242,0.97)',
  };

  const hr = new Date().getHours();
  const greeting = hr<12?'Good Morning ☀️':hr<18?'Good Afternoon ✦':'Good Evening ◑';

  return (
    <div style={{minHeight:'100vh', background:C.bg, fontFamily:"'Syne','DM Sans',sans-serif", position:'relative', overflowX:'hidden', transition:'background 0.4s ease, color 0.4s ease'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
        ::selection { background:#8b5cf622; color:#8b5cf6; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#8b5cf633; border-radius:99px; }

        @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn   { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
        @keyframes cardIn    { from{opacity:0;transform:translateY(22px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes formDrop  { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes toastIn   { from{opacity:0;transform:translateX(50px) scale(0.88)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes drawerIn  { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes orb1      { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)} }
        @keyframes orb2      { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,25px)} }
        @keyframes shimmer   { from{background-position:-200% center} to{background-position:200% center} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px #8b5cf644} 50%{box-shadow:0 0 44px #8b5cf688} }
        @keyframes toggleSlide { from{transform:translateX(0)} to{transform:translateX(22px)} }
        @keyframes modeFlash { 0%{opacity:0} 50%{opacity:1} 100%{opacity:0} }

        .fu   { animation: fadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }
        .si   { animation: scaleIn 0.35s cubic-bezier(.22,1,.36,1) both; }
        .ci   { animation: cardIn 0.5s cubic-bezier(.22,1,.36,1) both; }
        .fd   { animation: formDrop 0.4s cubic-bezier(.22,1,.36,1) both; }
        .dr   { animation: drawerIn 0.35s cubic-bezier(.22,1,.36,1) both; }
        .ta   { animation: toastIn 0.35s cubic-bezier(.22,1,.36,1) both; }

        .nc   { transition: transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease; }
        .nc:hover { transform: translateY(-6px) scale(1.015) !important; }

        .bp   { transition: transform 0.15s, opacity 0.15s; cursor:pointer; border:none; font-family:inherit; }
        .bp:hover  { opacity: 0.85; }
        .bp:active { transform: scale(0.94) !important; }
        .ih:hover  { background: rgba(139,92,246,0.14) !important; }

        .shimmer-logo {
          background: linear-gradient(90deg,#8b5cf6 0%,#06b6d4 40%,#a78bfa 60%,#8b5cf6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        input, textarea { font-family: 'DM Sans',sans-serif; }
        input:focus, textarea:focus {
          border-color: #8b5cf6 !important;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.18) !important;
          outline: none;
        }

        /* Mode toggle switch */
        .mode-toggle {
          width: 52px; height: 28px; border-radius: 99px;
          position: relative; cursor: pointer; border: none;
          transition: background 0.35s ease;
          display: flex; align-items: center; padding: 0 4px;
          flex-shrink: 0;
        }
        .mode-toggle-thumb {
          width: 22px; height: 22px; border-radius: 50%;
          position: absolute; top: 3px;
          transition: left 0.35s cubic-bezier(.22,1,.36,1), background 0.3s ease, box-shadow 0.3s ease;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; line-height: 1;
        }

        .bottom-nav { display: none !important; }
        .fab        { display: none !important; }
        @media (max-width: 768px) {
          .bottom-nav  { display: flex !important; }
          .fab         { display: flex !important; }
          .dsk-add     { display: none !important; }
          .dsk-menu    { display: none !important; }
          .view-tog    { display: none !important; }
          .srch-wrap   { max-width: 150px !important; }
          .main-c      { padding: 16px 12px 110px !important; }
          .grid-3      { grid-template-columns: 1fr !important; }
          .prof-m      { padding: 24px 16px !important; max-width: 100% !important; }
        }
        @media (min-width: 769px) and (max-width: 1100px) {
          .grid-3 { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* ── AMBIENT ORBS (Dark mode) ── */}
      {dm && (<>
        <div style={{position:'fixed',top:'-15%',left:'-10%',width:'550px',height:'550px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 65%)',pointerEvents:'none',animation:'orb1 14s ease-in-out infinite',zIndex:0}}/>
        <div style={{position:'fixed',bottom:'-15%',right:'-10%',width:'480px',height:'480px',borderRadius:'50%',background:'radial-gradient(circle,rgba(6,182,212,0.09) 0%,transparent 65%)',pointerEvents:'none',animation:'orb2 18s ease-in-out infinite',zIndex:0}}/>
      </>)}

      {/* ── LIGHT MODE DECORATIVE BLOBS ── */}
      {!dm && (<>
        <div style={{position:'fixed',top:'-10%',right:'-8%',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 65%)',pointerEvents:'none',zIndex:0}}/>
        <div style={{position:'fixed',bottom:'-10%',left:'-8%',width:'440px',height:'440px',borderRadius:'50%',background:'radial-gradient(circle,rgba(14,165,233,0.07) 0%,transparent 65%)',pointerEvents:'none',zIndex:0}}/>
      </>)}

      {/* ── TOAST ── */}
      {toast && (
        <div className="ta" style={{
          position:'fixed', bottom:'90px', right:'20px', zIndex:9999,
          background: toast.type==='err' ? C.toastErrBg : C.toastOkBg,
          color: toast.type==='err' ? C.danger : C.success,
          border: `1px solid ${toast.type==='err' ? C.dangerBorder : (dm?'rgba(38,222,129,0.25)':'rgba(5,150,105,0.25)')}`,
          padding:'10px 18px', borderRadius:'12px', fontWeight:'600', fontSize:'13px',
          backdropFilter:'blur(16px)', fontFamily:'inherit',
          boxShadow:`0 8px 32px ${toast.type==='err' ? (dm?'rgba(255,107,107,0.15)':'rgba(225,29,72,0.1)') : (dm?'rgba(38,222,129,0.12)':'rgba(5,150,105,0.1)')}`,
          display:'flex', alignItems:'center', gap:'8px',
        }}>
          <span style={{fontSize:'14px'}}>{toast.type==='err'?'✕':'✓'}</span>
          {toast.msg}
        </div>
      )}

      {/* ── HEADER ── */}
      <header style={{
        position:'sticky', top:0, zIndex:300,
        background: C.headerBg,
        backdropFilter:'blur(24px) saturate(180%)',
        borderBottom:`1px solid ${C.border}`,
        height:'62px', display:'flex', alignItems:'center',
        padding:'0 20px', gap:'10px',
        transition:'background 0.4s ease, border-color 0.4s ease',
      }}>
        {/* Hamburger (desktop) */}
        <button className="bp ih dsk-menu" onClick={()=>setDrawer(true)} style={{
          background:'transparent', padding:'8px 10px',
          borderRadius:'10px', color:C.t2, fontSize:'20px', lineHeight:1,
        }}>☰</button>

        {/* Logo */}
        <div style={{display:'flex', alignItems:'center', gap:'8px', marginRight:'6px'}}>
          <div style={{
            width:'30px', height:'30px',
            background:`linear-gradient(135deg, ${C.accent}, ${C.acc2})`,
            borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'14px', animation:'glowPulse 3s ease-in-out infinite',
            boxShadow:`0 4px 14px ${C.accent}44`,
          }}>✦</div>
          <span className="shimmer-logo" style={{fontWeight:'800', fontSize:'19px', letterSpacing:'-0.5px'}}>VishakNotely</span>
        </div>

        {/* Search */}
        <div className="srch-wrap" style={{flex:1, maxWidth:'380px', position:'relative'}}>
          <span style={{position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', fontSize:'15px', color:C.t2, pointerEvents:'none'}}>⌕</span>
          <input
            value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search notes..."
            style={{
              width:'100%', padding:'9px 34px 9px 32px',
              background:C.inputBg, border:`1px solid ${C.border}`,
              borderRadius:'10px', color:C.t1, fontSize:'13.5px', transition:'all 0.2s',
            }}
          />
          {search && <button onClick={()=>setSearch('')} style={{position:'absolute',right:'10px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:C.t2,cursor:'pointer',fontSize:'17px',lineHeight:1}}>×</button>}
        </div>

        {/* Actions */}
        <div style={{display:'flex', alignItems:'center', gap:'8px', marginLeft:'auto'}}>

          {/* View Toggle */}
          <div className="view-tog" style={{display:'flex', background:C.toggleBg, borderRadius:'10px', padding:'3px', gap:'2px', border:`1px solid ${C.border}`}}>
            {['grid','list'].map(v=>(
              <button key={v} className="bp" onClick={()=>setView(v)} style={{
                background: view===v ? (dm ? `${C.accent}44` : C.accent) : 'transparent',
                padding:'5px 11px', borderRadius:'8px',
                color: view===v ? '#fff' : C.t2,
                fontSize:'13px', fontFamily:'inherit', transition:'all 0.2s',
              }}>{v==='grid'?'⊞':'☰'}</button>
            ))}
          </div>

          {/* ── DARK/LIGHT MODE TOGGLE SWITCH ── */}
          <button
            className="mode-toggle"
            onClick={()=>setDm(!dm)}
            title={dm?'Switch to Light Mode':'Switch to Dark Mode'}
            style={{background: dm ? 'rgba(139,92,246,0.3)' : 'rgba(124,58,237,0.15)', border:`1px solid ${C.accentBorder}`}}
          >
            {/* Track icons */}
            <span style={{position:'absolute', left:'6px', fontSize:'12px', opacity: dm?0.4:0, transition:'opacity 0.3s'}}>🌙</span>
            <span style={{position:'absolute', right:'6px', fontSize:'12px', opacity: dm?0:0.6, transition:'opacity 0.3s'}}>☀️</span>
            {/* Thumb */}
            <div className="mode-toggle-thumb" style={{
              background: dm ? '#8b5cf6' : '#fff',
              left: dm ? '26px' : '3px',
              boxShadow: dm ? `0 2px 8px rgba(139,92,246,0.6)` : '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              <span style={{fontSize:'11px'}}>{dm?'🌙':'☀️'}</span>
            </div>
          </button>

          {/* Avatar */}
          <button className="bp" onClick={()=>setShowProfile(true)} style={{
            width:'36px', height:'36px', borderRadius:'50%', padding:0,
            background:`linear-gradient(135deg, ${C.accent}44, ${C.acc2}44)`,
            border:`2px solid ${C.accent}44`, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden',
            boxShadow:`0 0 0 3px ${C.accent}1a`,
          }}>
            {avatar ? <img src={avatar} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>
              : <span style={{color: dm?'white':C.accent, fontWeight:'800', fontSize:'14px'}}>{username?.[0]?.toUpperCase()}</span>}
          </button>
        </div>
      </header>

      {/* ── DRAWER ── */}
      {drawer && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:500,backdropFilter:'blur(6px)'}} onClick={()=>setDrawer(false)}>
          <div ref={drawerRef} className="dr" onClick={e=>e.stopPropagation()} style={{
            position:'absolute', left:0, top:0, bottom:0, width:'280px',
            background:C.drawerBg, borderRight:`1px solid ${C.border}`,
            display:'flex', flexDirection:'column',
            boxShadow:`12px 0 50px rgba(0,0,0,${dm?0.4:0.12})`,
            transition:'background 0.4s ease',
          }}>
            <div style={{padding:'28px 20px 20px', borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px'}}>
                <div style={{width:'50px',height:'50px',borderRadius:'15px',background:`linear-gradient(135deg,${C.accent},${C.acc2})`,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',boxShadow:`0 8px 24px ${C.accent}44`}}>
                  {avatar ? <img src={avatar} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>
                    : <span style={{color:'white',fontWeight:'800',fontSize:'22px'}}>{username?.[0]?.toUpperCase()}</span>}
                </div>
                <div>
                  <p style={{fontWeight:'800',color:C.t1,fontSize:'16px',letterSpacing:'-0.3px'}}>{username}</p>
                  <p style={{color:C.t2,fontSize:'12px',fontWeight:'500'}}>{notes.length} notes · {pinned.length} pinned</p>
                </div>
              </div>
              {/* Stats */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
                {[{v:notes.length,l:'Notes'},{v:pinned.length,l:'Pinned'},{v:Object.keys(palMap).length,l:'Themed'}].map((s,i)=>(
                  <div key={i} style={{background:C.statBg,borderRadius:'10px',padding:'10px 6px',textAlign:'center',border:`1px solid ${C.accentBorder}`}}>
                    <p style={{fontWeight:'800',fontSize:'18px',color:C.accent}}>{s.v}</p>
                    <p style={{fontSize:'10px',color:C.t2,fontWeight:'700',letterSpacing:'0.5px'}}>{s.l.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </div>

            <nav style={{padding:'14px 12px',flex:1}}>
              {[
                {icon:'◈',label:'All Notes',f:'all',count:notes.length},
                {icon:'◆',label:'Pinned',f:'pinned',count:pinned.length},
              ].map((item,i)=>(
                <button key={i} onClick={()=>{setFilter(item.f);setDrawer(false);}} style={{
                  display:'flex',alignItems:'center',justifyContent:'space-between',
                  width:'100%',padding:'12px 14px',borderRadius:'12px',
                  background:filter===item.f?C.accentBg:'transparent',
                  border:filter===item.f?`1px solid ${C.accentBorder}`:'1px solid transparent',
                  color:filter===item.f?C.accent:C.t2,
                  cursor:'pointer',fontWeight:'600',fontSize:'14px',fontFamily:'inherit',
                  marginBottom:'4px',transition:'all 0.2s',
                }}>
                  <span>{item.icon} {item.label}</span>
                  <span style={{background:C.pillBg,padding:'2px 8px',borderRadius:'99px',fontSize:'11px',color:C.t2,border:`1px solid ${C.pillBorder}`}}>{item.count}</span>
                </button>
              ))}

              {/* Mode toggle in drawer */}
              <div style={{marginTop:'16px',padding:'14px',background:C.statBg,borderRadius:'12px',border:`1px solid ${C.border}`}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <p style={{fontWeight:'700',color:C.t1,fontSize:'13px',marginBottom:'2px'}}>{dm?'🌙 Dark Mode':'☀️ Light Mode'}</p>
                    <p style={{color:C.t2,fontSize:'11px'}}>{dm?'Click to switch to light':'Click to switch to dark'}</p>
                  </div>
                  <button
                    className="mode-toggle"
                    onClick={()=>setDm(!dm)}
                    style={{background: dm ? 'rgba(139,92,246,0.3)' : 'rgba(124,58,237,0.15)', border:`1px solid ${C.accentBorder}`, flexShrink:0}}
                  >
                    <span style={{position:'absolute',left:'6px',fontSize:'11px',opacity:dm?0.4:0,transition:'opacity 0.3s'}}>🌙</span>
                    <span style={{position:'absolute',right:'6px',fontSize:'11px',opacity:dm?0:0.6,transition:'opacity 0.3s'}}>☀️</span>
                    <div className="mode-toggle-thumb" style={{
                      background: dm ? '#8b5cf6' : '#fff',
                      left: dm ? '26px' : '3px',
                      boxShadow: dm ? `0 2px 8px rgba(139,92,246,0.6)` : '0 2px 8px rgba(0,0,0,0.15)',
                    }}>
                      <span style={{fontSize:'10px'}}>{dm?'🌙':'☀️'}</span>
                    </div>
                  </button>
                </div>
              </div>
            </nav>

            <div style={{padding:'14px 12px',borderTop:`1px solid ${C.border}`}}>
              <button className="bp" onClick={()=>{setShowProfile(true);setDrawer(false);}} style={{
                width:'100%',padding:'11px',borderRadius:'11px',marginBottom:'8px',
                background:C.pillBg,border:`1px solid ${C.border}`,
                color:C.t2,cursor:'pointer',fontWeight:'600',fontSize:'13px',fontFamily:'inherit',
              }}>👤 Profile</button>
              <button className="bp" onClick={()=>{logout();navigate('/login');}} style={{
                width:'100%',padding:'11px',borderRadius:'11px',
                background:C.dangerBg,border:`1px solid ${C.dangerBorder}`,
                color:C.danger,cursor:'pointer',fontWeight:'600',fontSize:'13px',fontFamily:'inherit',
              }}>⬡ Sign Out</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <main className="main-c" style={{maxWidth:'1200px',margin:'0 auto',padding:'28px 22px 80px',position:'relative',zIndex:1}}>

        {/* Page Title */}
        <div className="fu" style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'22px',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <p style={{fontSize:'11px',fontWeight:'700',color:C.t2,letterSpacing:'2px',marginBottom:'5px',transition:'color 0.4s'}}>
              {filter==='pinned'?'PINNED NOTES':'MY WORKSPACE'}
            </p>
            <h1 style={{fontWeight:'800',fontSize:'clamp(20px,4vw,30px)',color:C.t1,letterSpacing:'-0.8px',lineHeight:1.15,transition:'color 0.4s'}}>
              {search
                ? <><span style={{color:C.accent}}>"{search}"</span></>
                : filter==='pinned' ? 'Pinned ◆' : greeting
              }
            </h1>
          </div>
          <button className="bp dsk-add" onClick={()=>{setShowForm(true);setEditNote(null);setForm({title:'',content:'',pi:0});}} style={{
            display:'flex',alignItems:'center',gap:'8px',
            background:`linear-gradient(135deg,${C.accent},${dm?'#7c3aed':'#9333ea'})`,
            color:'white',padding:'11px 22px',borderRadius:'12px',
            fontWeight:'700',fontSize:'14px',cursor:'pointer',fontFamily:'inherit',
            boxShadow:`0 8px 28px ${C.accent}44`,transition:'all 0.2s',
          }}>
            <span style={{fontSize:'17px',lineHeight:1}}>✦</span> New Note
          </button>
        </div>

        {/* Filter Chips */}
        <div className="fu" style={{display:'flex',gap:'8px',marginBottom:'24px',flexWrap:'wrap'}}>
          {['all','pinned'].map(f=>(
            <button key={f} className="bp" onClick={()=>setFilter(f)} style={{
              padding:'6px 16px',borderRadius:'99px',
              background:filter===f?C.accent:C.pillBg,
              border:`1px solid ${filter===f?C.accent:C.pillBorder}`,
              color:filter===f?'white':C.t2,
              fontWeight:'600',fontSize:'12px',fontFamily:'inherit',
              transition:'all 0.2s',letterSpacing:'0.3px',
            }}>
              {f==='all'?`◈ All (${notes.length})`:`◆ Pinned (${pinned.length})`}
            </button>
          ))}
        </div>

        {/* ── NOTE FORM ── */}
        {showForm && (
          <div className="fd" style={{
            background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:'20px', marginBottom:'28px', overflow:'hidden',
            boxShadow:dm?`0 28px 70px rgba(0,0,0,0.65),0 0 0 1px ${C.accent}1a`:`0 24px 60px rgba(124,58,237,0.1)`,
            transition:'background 0.4s ease',
          }}>
            <div style={{height:'3px',background:`linear-gradient(90deg,${C.accent},${C.acc2},${PALETTE[form.pi]?.accent||C.accent})`}}/>
            <div style={{padding:'24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                <h3 style={{fontWeight:'800',fontSize:'17px',color:C.t1,letterSpacing:'-0.3px'}}>
                  {editNote?'✎ Edit Note':'✦ New Note'}
                </h3>
                <button className="bp" onClick={()=>{setShowForm(false);setEditNote(null);}} style={{background:'transparent',color:C.t2,fontSize:'22px',cursor:'pointer',lineHeight:1,padding:'4px'}}>×</button>
              </div>
              <form onSubmit={save}>
                <input
                  value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
                  placeholder="Give your note a title..." required
                  style={{
                    width:'100%',padding:'13px 16px',marginBottom:'12px',
                    background:C.inputBg, border:`1.5px solid ${C.border}`,
                    borderRadius:'12px', color:C.t1, fontSize:'16px', fontWeight:'700',
                    transition:'all 0.2s',
                  }}
                />
                <textarea
                  value={form.content} onChange={e=>setForm({...form,content:e.target.value})}
                  placeholder="Write something worth remembering..." required rows={5}
                  style={{
                    width:'100%',padding:'13px 16px',marginBottom:'18px',
                    background:C.inputBg, border:`1.5px solid ${C.border}`,
                    borderRadius:'12px', color:C.t1, fontSize:'14px',
                    lineHeight:'1.7', resize:'vertical', transition:'all 0.2s',
                  }}
                />

                {/* Palette Picker */}
                <div style={{marginBottom:'20px'}}>
                  <p style={{fontSize:'11px',fontWeight:'700',color:C.t2,letterSpacing:'1.5px',marginBottom:'10px'}}>
                    CARD THEME {dm?'(Dark)':'(Light)'}
                  </p>
                  <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                    {PALETTE.map((p,i)=>(
                      <button key={i} type="button" onClick={()=>setForm({...form,pi:i})} title={p.name} className="bp" style={{
                        width:'36px',height:'36px',borderRadius:'10px',
                        background:p.bg,
                        outline:form.pi===i?`3px solid ${p.accent}`:`2px solid ${dm?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)'}`,
                        outlineOffset:'2px',transition:'all 0.15s',
                        boxShadow:form.pi===i?`0 4px 14px ${(p.glow||p.accent)}55`:'none',
                        position:'relative',
                        border:dm?'none':`1px solid ${p.border||'#e0e7ff'}`,
                      }}>
                        <span style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',color:p.accent,fontWeight:'800'}}>
                          {form.pi===i?'✓':''}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{display:'flex',gap:'10px'}}>
                  <button type="submit" className="bp" style={{
                    flex:1,padding:'13px',
                    background:`linear-gradient(135deg,${C.accent},${dm?'#7c3aed':'#9333ea'})`,
                    color:'white',borderRadius:'12px',
                    fontWeight:'700',fontSize:'14px',cursor:'pointer',fontFamily:'inherit',
                    boxShadow:`0 8px 24px ${C.accent}44`,
                  }}>{editNote?'✓ Update Note':'✦ Save Note'}</button>
                  <button type="button" className="bp" onClick={()=>{setShowForm(false);setEditNote(null);}} style={{
                    padding:'13px 20px', background:C.pillBg,
                    border:`1px solid ${C.border}`, borderRadius:'12px',
                    color:C.t2, cursor:'pointer', fontWeight:'600', fontSize:'14px', fontFamily:'inherit',
                  }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{textAlign:'center',padding:'90px 0'}}>
            <div style={{width:'40px',height:'40px',border:`3px solid ${C.border}`,borderTopColor:C.accent,borderRadius:'50%',animation:'spin 0.7s linear infinite',margin:'0 auto 16px'}}/>
            <p style={{color:C.t2,fontWeight:'600',fontSize:'12px',letterSpacing:'2px'}}>LOADING NOTES...</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && displayed.length===0 && (
          <div className="fu" style={{textAlign:'center',padding:'90px 20px'}}>
            <div style={{
              width:'84px',height:'84px',margin:'0 auto 24px',
              background:C.emptyIconBg, borderRadius:'26px',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:'38px', border:`1px solid ${C.accentBorder}`,
              boxShadow:`0 0 40px ${C.accent}1a`,
            }}>{search?'⌕':'✦'}</div>
            <h3 style={{fontWeight:'800',fontSize:'20px',color:C.t1,marginBottom:'8px',letterSpacing:'-0.3px'}}>
              {search?'Nothing found':'Your canvas awaits'}
            </h3>
            <p style={{color:C.t2,fontSize:'14px',maxWidth:'240px',margin:'0 auto 28px',lineHeight:'1.7'}}>
              {search?`No notes match "${search}"`:'Capture your first thought, idea, or reminder.'}
            </p>
            {!search && (
              <button className="bp" onClick={()=>setShowForm(true)} style={{
                background:`linear-gradient(135deg,${C.accent},${dm?'#7c3aed':'#9333ea'})`,
                color:'white',padding:'13px 30px',borderRadius:'12px',
                fontWeight:'700',fontSize:'14px',cursor:'pointer',fontFamily:'inherit',
                boxShadow:`0 8px 28px ${C.accent}44`,
              }}>✦ Create First Note</button>
            )}
          </div>
        )}

        {/* ── NOTES GRID ── */}
        {!loading && displayed.length>0 && (
          <div className="grid-3" style={{
            display:view==='list'?'flex':'grid',
            flexDirection:view==='list'?'column':undefined,
            gridTemplateColumns:view==='grid'?'repeat(auto-fill,minmax(285px,1fr))':'1fr',
            gap:view==='grid'?'18px':'12px',
          }}>
            {displayed.map((note,idx)=>{
              const pal     = PALETTE[palMap[note.id]??0] || PALETTE[0];
              const mesh    = MESHES[meshMap[note.id]??0];
              const isPinned = pinned.includes(note.id);
              const isList   = view==='list';
              const cardAccent = pal.accent;
              const cardBg     = dm ? pal.bg : pal.bg;
              const cardBorder = dm ? 'rgba(255,255,255,0.07)' : (pal.border||'rgba(124,58,237,0.1)');

              return (
                <div key={note.id} className="nc ci" style={{
                  background:cardBg,
                  border:`1px solid ${cardBorder}`,
                  borderRadius:'18px', overflow:'hidden',
                  animationDelay:`${idx*0.04}s`,
                  boxShadow:dm
                    ?`0 4px 28px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.05)`
                    :`0 2px 20px rgba(124,58,237,0.08),0 1px 3px rgba(0,0,0,0.04)`,
                  display:isList?'flex':'block',
                  position:'relative',
                  transition:'background 0.4s ease, border-color 0.4s ease',
                }}>
                  {/* Mesh bg (dark only) */}
                  {dm && <div style={{position:'absolute',inset:0,background:mesh,opacity:0.5,pointerEvents:'none',borderRadius:'18px'}}/>}

                  {/* Accent bar */}
                  <div style={{
                    [isList?'width':'height']: isList?'4px':'3px',
                    [isList?'alignSelf':'width']: isList?'stretch':'100%',
                    background:`linear-gradient(${isList?'to bottom':'90deg'},${cardAccent},${cardAccent}55)`,
                    flexShrink:0,
                  }}/>

                  <div style={{padding:isList?'16px 18px':'18px',flex:1,position:'relative',zIndex:1}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'8px',marginBottom:'8px'}}>
                      <div style={{flex:1,minWidth:0}}>
                        {isPinned && (
                          <span style={{
                            display:'inline-flex',alignItems:'center',gap:'3px',
                            background:dm?`${cardAccent}18`:`${cardAccent}14`,
                            color:cardAccent,
                            fontSize:'9px',fontWeight:'800',padding:'2px 8px',
                            borderRadius:'99px',marginBottom:'6px',letterSpacing:'1px',
                            border:`1px solid ${cardAccent}30`,
                          }}>◆ PINNED</span>
                        )}
                        <h3 style={{
                          fontWeight:'800',fontSize:isList?'16px':'15px',
                          color:dm?cardAccent:C.t1,
                          lineHeight:'1.3',letterSpacing:'-0.2px',
                          overflow:'hidden',display:'-webkit-box',
                          WebkitLineClamp:isList?1:2,WebkitBoxOrient:'vertical',
                          transition:'color 0.4s',
                        }}>{note.title}</h3>
                      </div>
                      {/* Glowing dot */}
                      <div style={{
                        width:'9px',height:'9px',borderRadius:'50%',
                        background:cardAccent, flexShrink:0, marginTop:'4px',
                        boxShadow:dm?`0 0 10px ${cardAccent}88`:`0 0 6px ${cardAccent}55`,
                      }}/>
                    </div>

                    <p style={{
                      fontSize:'13px',lineHeight:'1.65',
                      color:dm?'rgba(255,255,255,0.38)':C.t2,
                      marginBottom:'14px',
                      overflow:'hidden',display:'-webkit-box',
                      WebkitLineClamp:isList?1:3,WebkitBoxOrient:'vertical',
                      transition:'color 0.4s',
                    }}>{note.content}</p>

                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px',flexWrap:'wrap'}}>
                      <span style={{fontSize:'11px',color:C.t3,fontWeight:'500'}}>
                        {new Date(note.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                      </span>
                      <div style={{display:'flex',gap:'6px'}}>
                        <button onClick={()=>edit(note)} className="bp" style={{
                          padding:'6px 14px',borderRadius:'8px',fontSize:'12px',fontWeight:'700',
                          background:`${cardAccent}14`,color:cardAccent,
                          border:`1px solid ${cardAccent}2a`,cursor:'pointer',fontFamily:'inherit',
                        }}>Edit</button>
                        <button onClick={()=>pin(note.id)} className="bp" style={{
                          padding:'6px 9px',borderRadius:'8px',fontSize:'13px',
                          background:isPinned?`${cardAccent}20`:C.pillBg,
                          color:isPinned?cardAccent:C.t2,
                          border:`1px solid ${isPinned?cardAccent+'30':C.pillBorder}`,
                          cursor:'pointer', transition:'all 0.15s',
                        }}>◆</button>
                        <button onClick={()=>del(note.id)} className="bp" style={{
                          padding:'6px 9px',borderRadius:'8px',fontSize:'13px',
                          background:C.dangerBg,color:C.danger,
                          border:`1px solid ${C.dangerBorder}`,cursor:'pointer',
                        }}>✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── FAB (mobile) ── */}
      <button className="fab bp" onClick={()=>{setShowForm(true);setEditNote(null);setForm({title:'',content:'',pi:0});window.scrollTo({top:0,behavior:'smooth'});}} style={{
        position:'fixed',bottom:'82px',right:'20px',zIndex:400,
        width:'58px',height:'58px',borderRadius:'17px',
        background:`linear-gradient(135deg,${C.accent},${dm?'#7c3aed':'#9333ea'})`,
        color:'white',fontSize:'24px',cursor:'pointer',
        display:'flex',alignItems:'center',justifyContent:'center',
        boxShadow:`0 8px 30px ${C.fabGlow}`,
        fontFamily:'inherit',animation:'glowPulse 3s ease-in-out infinite',
      }}>✦</button>

      {/* ── BOTTOM NAV (mobile) ── */}
      <nav className="bottom-nav" style={{
        position:'fixed',bottom:0,left:0,right:0,zIndex:350,
        background:C.headerBg,
        backdropFilter:'blur(24px)',
        borderTop:`1px solid ${C.border}`,
        padding:'10px 8px 14px',
        justifyContent:'space-around',alignItems:'center',gap:'4px',
        transition:'background 0.4s ease',
      }}>
        {[
          {icon:'◈',label:'Notes',  fn:()=>setFilter('all'),     active:filter==='all'},
          {icon:'◆',label:'Pinned', fn:()=>setFilter('pinned'),  active:filter==='pinned'},
          {icon:dm?'☀️':'🌙',label:dm?'Light':'Dark', fn:()=>setDm(!dm), active:false},
          {icon:'👤',label:'Profile',fn:()=>setShowProfile(true), active:showProfile},
        ].map((item,i)=>(
          <button key={i} onClick={item.fn} style={{
            display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',
            background:'transparent',border:'none',cursor:'pointer',fontFamily:'inherit',
            color:item.active?C.accent:C.t2,
            padding:'4px 10px',borderRadius:'10px',transition:'all 0.2s',minWidth:'54px',
          }}>
            <span style={{fontSize:'19px',lineHeight:1}}>{item.icon}</span>
            <span style={{fontSize:'9px',fontWeight:'700',letterSpacing:'0.8px'}}>{item.label.toUpperCase()}</span>
          </button>
        ))}
      </nav>

      {/* ── PROFILE MODAL ── */}
      {showProfile && (
        <div className="fu" onClick={()=>setShowProfile(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:700,backdropFilter:'blur(10px)',padding:'16px'}}>
          <div className="si prof-m" onClick={e=>e.stopPropagation()} style={{
            background:C.modalBg, border:`1px solid ${C.border}`,
            borderRadius:'24px', padding:'32px 28px',
            width:'100%', maxWidth:'380px',
            boxShadow:`0 32px 80px rgba(0,0,0,${dm?0.5:0.15}),0 0 0 1px ${C.accent}1a`,
            transition:'background 0.4s ease',
          }}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'28px'}}>
              <h2 style={{fontWeight:'800',fontSize:'22px',color:C.t1,letterSpacing:'-0.3px'}}>Profile</h2>
              <button className="bp" onClick={()=>setShowProfile(false)} style={{background:'transparent',color:C.t2,fontSize:'24px',cursor:'pointer',lineHeight:1}}>×</button>
            </div>

            {/* Mode toggle in profile */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',background:C.statBg,borderRadius:'14px',border:`1px solid ${C.border}`,marginBottom:'24px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <span style={{fontSize:'20px'}}>{dm?'🌙':'☀️'}</span>
                <div>
                  <p style={{fontWeight:'700',color:C.t1,fontSize:'14px'}}>{dm?'Dark Mode':'Light Mode'}</p>
                  <p style={{color:C.t2,fontSize:'11px'}}>{dm?'Tap to switch to light':'Tap to switch to dark'}</p>
                </div>
              </div>
              <button
                className="mode-toggle"
                onClick={()=>setDm(!dm)}
                style={{background: dm ? 'rgba(139,92,246,0.3)' : 'rgba(124,58,237,0.15)', border:`1px solid ${C.accentBorder}`, flexShrink:0}}
              >
                <span style={{position:'absolute',left:'6px',fontSize:'11px',opacity:dm?0.4:0,transition:'opacity 0.3s'}}>🌙</span>
                <span style={{position:'absolute',right:'6px',fontSize:'11px',opacity:dm?0:0.6,transition:'opacity 0.3s'}}>☀️</span>
                <div className="mode-toggle-thumb" style={{
                  background: dm ? '#8b5cf6' : '#fff',
                  left: dm ? '26px' : '3px',
                  boxShadow: dm ? `0 2px 8px rgba(139,92,246,0.6)` : '0 2px 8px rgba(0,0,0,0.15)',
                }}>
                  <span style={{fontSize:'10px'}}>{dm?'🌙':'☀️'}</span>
                </div>
              </button>
            </div>

            {/* Avatar */}
            <div style={{textAlign:'center',marginBottom:'24px'}}>
              <div style={{width:'88px',height:'88px',borderRadius:'50%',background:`linear-gradient(135deg,${C.accent},${C.acc2})`,margin:'0 auto 16px',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',boxShadow:`0 8px 32px ${C.accent}44,0 0 0 4px ${C.accent}1a`}}>
                {avatar?<img src={avatar} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>
                  :<span style={{color:'white',fontWeight:'800',fontSize:'36px'}}>{username?.[0]?.toUpperCase()}</span>}
              </div>
              <p style={{fontWeight:'800',fontSize:'18px',color:C.t1,marginBottom:'12px',letterSpacing:'-0.3px'}}>{username}</p>
              <label style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'8px 18px',background:C.accentBg,color:C.accent,border:`1px solid ${C.accentBorder}`,borderRadius:'10px',cursor:'pointer',fontSize:'12px',fontWeight:'700',letterSpacing:'0.5px'}}>
                ◎ CHANGE PHOTO
                <input type="file" accept="image/*" style={{display:'none'}} onChange={avatarChange}/>
              </label>
            </div>

            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'24px'}}>
              {[{v:notes.length,l:'Total',ic:'◈'},{v:pinned.length,l:'Pinned',ic:'◆'},{v:Object.keys(palMap).length,l:'Themed',ic:'◇'}].map((s,i)=>(
                <div key={i} style={{background:C.statBg,borderRadius:'14px',padding:'14px 6px',textAlign:'center',border:`1px solid ${C.accentBorder}`}}>
                  <div style={{fontSize:'16px',color:C.accent,marginBottom:'4px'}}>{s.ic}</div>
                  <p style={{fontWeight:'800',fontSize:'22px',color:C.accent}}>{s.v}</p>
                  <p style={{fontSize:'10px',fontWeight:'700',color:C.t2,letterSpacing:'0.5px'}}>{s.l.toUpperCase()}</p>
                </div>
              ))}
            </div>

            <button className="bp" onClick={()=>{logout();navigate('/login');}} style={{
              width:'100%',padding:'13px',
              background:C.dangerBg,color:C.danger,
              border:`1px solid ${C.dangerBorder}`,borderRadius:'14px',
              fontWeight:'700',fontSize:'14px',cursor:'pointer',fontFamily:'inherit',
            }}>⬡ Sign Out</button>
          </div>
        </div>
      )}
    </div>
  );
}