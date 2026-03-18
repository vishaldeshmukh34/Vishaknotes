import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { saveAuth } from '../../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const r = await api.post('/auth/login', form);
      saveAuth(r.data);
      navigate('/notes');
    } catch(err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Syne','DM Sans',sans-serif", background:'#07070f' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:#8b5cf622;color:#8b5cf6;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-14px) rotate(8deg)}}
        @keyframes orb1{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-20px)}}
        @keyframes orb2{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,15px)}}
        @keyframes shimmer{from{background-position:-200% center}to{background-position:200% center}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px #8b5cf655}50%{box-shadow:0 0 50px #8b5cf699}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .fu{animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both;}
        .shimmer-logo{
          background:linear-gradient(90deg,#8b5cf6 0%,#06b6d4 40%,#a78bfa 60%,#8b5cf6 100%);
          background-size:200% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          animation:shimmer 4s linear infinite;
        }
        .bp{transition:transform .15s,opacity .15s;cursor:pointer;}
        .bp:hover{opacity:.88;}
        .bp:active{transform:scale(.96)!important;}
        input{font-family:'DM Sans',sans-serif;}
        .auth-inp{transition:all .25s;}
        .auth-inp:focus{
          border-color:#8b5cf6!important;
          box-shadow:0 0 0 3px rgba(139,92,246,.2)!important;
          outline:none;
          background:rgba(139,92,246,.08)!important;
        }
        .submit-btn{transition:all .2s;}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 40px rgba(139,92,246,.55)!important;}
        .submit-btn:active{transform:translateY(0)!important;}

        @media(max-width:768px){
          .left-panel{display:none!important;}
          .right-panel{width:100%!important;padding:32px 24px!important;}
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="left-panel" style={{
        width:'46%', position:'relative', overflow:'hidden',
        background:'linear-gradient(145deg,#0a0a18 0%,#100820 50%,#080f18 100%)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 48px',
        borderRight:'1px solid rgba(255,255,255,.06)',
      }}>
        {/* Orbs */}
        <div style={{position:'absolute',top:'-10%',left:'-10%',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,.18) 0%,transparent 65%)',animation:'orb1 12s ease-in-out infinite',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-10%',right:'-10%',width:'350px',height:'350px',borderRadius:'50%',background:'radial-gradient(circle,rgba(6,182,212,.14) 0%,transparent 65%)',animation:'orb2 16s ease-in-out infinite',pointerEvents:'none'}}/>

        {/* Grid pattern */}
        <div style={{
          position:'absolute',inset:0,
          backgroundImage:'linear-gradient(rgba(139,92,246,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.06) 1px,transparent 1px)',
          backgroundSize:'40px 40px',
          pointerEvents:'none',
        }}/>

        <div style={{position:'relative',textAlign:'center',maxWidth:'340px'}}>
          {/* Logo mark */}
          <div style={{
            width:'72px',height:'72px',margin:'0 auto 28px',
            background:'linear-gradient(135deg,#8b5cf6,#06b6d4)',
            borderRadius:'22px',display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'32px',animation:'float 4s ease-in-out infinite, glow 3s ease-in-out infinite',
            boxShadow:'0 0 40px rgba(139,92,246,.4)',
          }}>✦</div>

          <h1 className="shimmer-logo" style={{fontWeight:'800',fontSize:'42px',marginBottom:'14px',letterSpacing:'-1.5px',lineHeight:1}}>
            Notely
          </h1>
          <p style={{color:'rgba(255,255,255,.45)',fontSize:'15px',lineHeight:'1.7',marginBottom:'40px'}}>
            Your personal thought space. Beautifully organized.
          </p>

          {/* Feature list */}
          <div style={{display:'flex',flexDirection:'column',gap:'12px',textAlign:'left'}}>
            {[
              {icon:'✦',text:'Dark-first, eye-friendly design'},
              {icon:'◆',text:'Pin & prioritize important notes'},
              {icon:'◈',text:'7 unique card color themes'},
              {icon:'◇',text:'Grid & list view modes'},
            ].map((f,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 14px',background:'rgba(255,255,255,.04)',borderRadius:'10px',border:'1px solid rgba(255,255,255,.06)'}}>
                <span style={{color:'#8b5cf6',fontSize:'14px',width:'18px',flexShrink:0}}>{f.icon}</span>
                <span style={{color:'rgba(255,255,255,.65)',fontSize:'13px',fontWeight:'500'}}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel fu" style={{
        width:'54%', display:'flex', alignItems:'center', justifyContent:'center',
        padding:'40px 32px',
        background:'#07070f',
      }}>
        <div style={{width:'100%',maxWidth:'400px'}}>

          {/* Top */}
          <div style={{marginBottom:'36px'}}>
            <p style={{fontSize:'12px',fontWeight:'700',color:'rgba(139,92,246,.7)',letterSpacing:'2px',marginBottom:'10px'}}>WELCOME BACK</p>
            <h2 style={{fontWeight:'800',fontSize:'30px',color:'#ede9ff',letterSpacing:'-1px',marginBottom:'8px',lineHeight:1.1}}>
              Sign in to<br/>your workspace
            </h2>
            <p style={{color:'rgba(255,255,255,.35)',fontSize:'14px'}}>Your notes are waiting for you.</p>
          </div>

          {/* Error */}
          {error&&(
            <div style={{
              background:'rgba(255,107,107,.1)',color:'#ff8a8a',
              padding:'12px 16px',borderRadius:'12px',marginBottom:'20px',
              fontSize:'13px',fontWeight:'500',border:'1px solid rgba(255,107,107,.2)',
              display:'flex',alignItems:'center',gap:'8px',
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={submit}>
            {/* Email */}
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:'rgba(255,255,255,.35)',letterSpacing:'1.5px',marginBottom:'8px'}}>
                EMAIL ADDRESS
              </label>
              <input
                className="auth-inp"
                type="email" value={form.email}
                onChange={e=>setForm({...form,email:e.target.value})}
                onFocus={()=>setFocused('email')}
                onBlur={()=>setFocused('')}
                placeholder="you@example.com"
                required
                style={{
                  width:'100%',padding:'14px 16px',
                  background:'rgba(255,255,255,.05)',
                  border:`1.5px solid ${focused==='email'?'#8b5cf6':'rgba(255,255,255,.08)'}`,
                  borderRadius:'12px',color:'#ede9ff',fontSize:'15px',
                }}
              />
            </div>

            {/* Password */}
            <div style={{marginBottom:'28px'}}>
              <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:'rgba(255,255,255,.35)',letterSpacing:'1.5px',marginBottom:'8px'}}>
                PASSWORD
              </label>
              <div style={{position:'relative'}}>
                <input
                  className="auth-inp"
                  type={showPass?'text':'password'} value={form.password}
                  onChange={e=>setForm({...form,password:e.target.value})}
                  onFocus={()=>setFocused('pass')}
                  onBlur={()=>setFocused('')}
                  placeholder="Enter your password"
                  required
                  style={{
                    width:'100%',padding:'14px 46px 14px 16px',
                    background:'rgba(255,255,255,.05)',
                    border:`1.5px solid ${focused==='pass'?'#8b5cf6':'rgba(255,255,255,.08)'}`,
                    borderRadius:'12px',color:'#ede9ff',fontSize:'15px',
                  }}
                />
                <button type="button" className="bp" onClick={()=>setShowPass(!showPass)} style={{
                  position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',
                  background:'none',border:'none',color:'rgba(255,255,255,.3)',fontSize:'16px',lineHeight:1,
                }}>{showPass?'◉':'○'}</button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="submit-btn bp" style={{
              width:'100%',padding:'15px',
              background:loading?'rgba(139,92,246,.5)':'linear-gradient(135deg,#8b5cf6,#7c3aed)',
              color:'white',border:'none',borderRadius:'14px',
              fontWeight:'800',fontSize:'15px',cursor:loading?'not-allowed':'pointer',
              fontFamily:'inherit',letterSpacing:'0.3px',
              boxShadow:'0 8px 30px rgba(139,92,246,.4)',
              display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
            }}>
              {loading?(
                <><div style={{width:'18px',height:'18px',border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin .7s linear infinite'}}/> Signing in...</>
              ):(
                <>Sign In ✦</>
              )}
            </button>
          </form>

          <p style={{textAlign:'center',marginTop:'28px',color:'rgba(255,255,255,.3)',fontSize:'14px'}}>
            New here?{' '}
            <Link to="/register" style={{color:'#a78bfa',fontWeight:'700',textDecoration:'none',letterSpacing:'0.2px'}}>
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}