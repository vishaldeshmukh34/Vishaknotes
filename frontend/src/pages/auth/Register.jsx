import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if(form.password.length < 6){ setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/register', form);
      setDone(true);
      setTimeout(()=>navigate('/login'), 2000);
    } catch(err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3;
  const sColor = ['transparent','#ff6b6b','#ffd32a','#26de81'][strength];
  const sLabel = ['','Weak','Good','Strong'][strength];
  const sDesc  = ['','Keep going...','Almost there!','Excellent!'][strength];

  return (
    <div style={{minHeight:'100vh',display:'flex',fontFamily:"'Syne','DM Sans',sans-serif",background:'#07070f'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:#8b5cf622;color:#8b5cf6;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.04)}}
        @keyframes orb1{0%,100%{transform:translate(0,0)}50%{transform:translate(-25px,20px)}}
        @keyframes orb2{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-15px)}}
        @keyframes shimmer{from{background-position:-200% center}to{background-position:200% center}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes checkIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
        @keyframes successPulse{0%,100%{box-shadow:0 0 20px #26de8133}50%{box-shadow:0 0 60px #26de8166}}

        .fu{animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both;}
        .shimmer-logo{
          background:linear-gradient(90deg,#06b6d4 0%,#8b5cf6 40%,#fd79a8 60%,#06b6d4 100%);
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
        .bar-fill{transition:width .4s cubic-bezier(.22,1,.36,1),background .3s;}
        @media(max-width:768px){
          .left-panel{display:none!important;}
          .right-panel{width:100%!important;padding:28px 20px!important;}
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="left-panel" style={{
        width:'44%',position:'relative',overflow:'hidden',
        background:'linear-gradient(145deg,#060610 0%,#0e0818 50%,#060c14 100%)',
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        padding:'60px 44px',
        borderRight:'1px solid rgba(255,255,255,.05)',
      }}>
        <div style={{position:'absolute',top:'5%',right:'-5%',width:'320px',height:'320px',borderRadius:'50%',background:'radial-gradient(circle,rgba(6,182,212,.16) 0%,transparent 65%)',animation:'orb1 14s ease-in-out infinite',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'5%',left:'-5%',width:'280px',height:'280px',borderRadius:'50%',background:'radial-gradient(circle,rgba(253,121,168,.13) 0%,transparent 65%)',animation:'orb2 18s ease-in-out infinite',pointerEvents:'none'}}/>

        {/* Dot grid */}
        <div style={{
          position:'absolute',inset:0,
          backgroundImage:'radial-gradient(rgba(139,92,246,.2) 1px,transparent 1px)',
          backgroundSize:'28px 28px',
          pointerEvents:'none',
        }}/>

        <div style={{position:'relative',textAlign:'center',maxWidth:'320px'}}>
          <div style={{
            width:'68px',height:'68px',margin:'0 auto 26px',
            background:'linear-gradient(135deg,#06b6d4,#8b5cf6)',
            borderRadius:'22px',display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'30px',animation:'float 5s ease-in-out infinite',
            boxShadow:'0 0 40px rgba(6,182,212,.4)',
          }}>🚀</div>

          <h1 className="shimmer-logo" style={{fontWeight:'800',fontSize:'40px',marginBottom:'12px',letterSpacing:'-1.5px',lineHeight:1}}>
            Join Notely
          </h1>
          <p style={{color:'rgba(255,255,255,.4)',fontSize:'14px',lineHeight:'1.7',marginBottom:'36px'}}>
            Free forever. No credit card. Just pure productivity.
          </p>

          {/* Steps */}
          <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
            {[
              {n:'01',title:'Create account',sub:'Takes less than a minute'},
              {n:'02',title:'Write your first note',sub:'Any thought, any idea'},
              {n:'03',title:'Stay organized',sub:'Pin, color, search, repeat'},
            ].map((s,i,arr)=>(
              <div key={i} style={{display:'flex',gap:'14px',alignItems:'flex-start',paddingBottom:i<arr.length-1?'20px':'0',position:'relative'}}>
                {i<arr.length-1&&<div style={{position:'absolute',left:'15px',top:'32px',bottom:0,width:'1px',background:'linear-gradient(to bottom,rgba(139,92,246,.4),rgba(139,92,246,.1))'}}/>}
                <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'rgba(139,92,246,.2)',border:'1px solid rgba(139,92,246,.4)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'11px',fontWeight:'800',color:'#a78bfa'}}>
                  {s.n}
                </div>
                <div style={{paddingTop:'4px'}}>
                  <p style={{fontWeight:'700',color:'rgba(255,255,255,.75)',fontSize:'13px',marginBottom:'2px'}}>{s.title}</p>
                  <p style={{color:'rgba(255,255,255,.3)',fontSize:'12px'}}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel fu" style={{
        width:'56%',display:'flex',alignItems:'center',justifyContent:'center',
        padding:'40px 32px',background:'#07070f',
      }}>
        {done ? (
          <div className="fu" style={{textAlign:'center',maxWidth:'320px'}}>
            <div style={{
              width:'80px',height:'80px',margin:'0 auto 24px',
              background:'rgba(38,222,129,.15)',borderRadius:'50%',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:'36px',animation:'checkIn .6s cubic-bezier(.22,1,.36,1) both, successPulse 2s ease-in-out infinite',
              border:'2px solid rgba(38,222,129,.3)',
            }}>✓</div>
            <h2 style={{fontWeight:'800',fontSize:'24px',color:'#ede9ff',marginBottom:'8px',letterSpacing:'-0.5px'}}>You're in!</h2>
            <p style={{color:'rgba(255,255,255,.4)',fontSize:'14px'}}>Redirecting to login...</p>
          </div>
        ) : (
          <div style={{width:'100%',maxWidth:'400px'}}>
            <div style={{marginBottom:'32px'}}>
              <p style={{fontSize:'12px',fontWeight:'700',color:'rgba(6,182,212,.7)',letterSpacing:'2px',marginBottom:'10px'}}>GET STARTED</p>
              <h2 style={{fontWeight:'800',fontSize:'30px',color:'#ede9ff',letterSpacing:'-1px',marginBottom:'8px',lineHeight:1.1}}>
                Create your<br/>free account
              </h2>
              <p style={{color:'rgba(255,255,255,.3)',fontSize:'14px'}}>No spam. Just your notes.</p>
            </div>

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
              {/* Username */}
              <div style={{marginBottom:'14px'}}>
                <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:'rgba(255,255,255,.3)',letterSpacing:'1.5px',marginBottom:'8px'}}>USERNAME</label>
                <input
                  className="auth-inp"
                  type="text" value={form.username}
                  onChange={e=>setForm({...form,username:e.target.value})}
                  onFocus={()=>setFocused('user')}
                  onBlur={()=>setFocused('')}
                  placeholder="cooluser"
                  required
                  style={{
                    width:'100%',padding:'13px 16px',
                    background:'rgba(255,255,255,.05)',
                    border:`1.5px solid ${focused==='user'?'#8b5cf6':'rgba(255,255,255,.07)'}`,
                    borderRadius:'12px',color:'#ede9ff',fontSize:'15px',
                  }}
                />
              </div>

              {/* Email */}
              <div style={{marginBottom:'14px'}}>
                <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:'rgba(255,255,255,.3)',letterSpacing:'1.5px',marginBottom:'8px'}}>EMAIL</label>
                <input
                  className="auth-inp"
                  type="email" value={form.email}
                  onChange={e=>setForm({...form,email:e.target.value})}
                  onFocus={()=>setFocused('email')}
                  onBlur={()=>setFocused('')}
                  placeholder="you@example.com"
                  required
                  style={{
                    width:'100%',padding:'13px 16px',
                    background:'rgba(255,255,255,.05)',
                    border:`1.5px solid ${focused==='email'?'#8b5cf6':'rgba(255,255,255,.07)'}`,
                    borderRadius:'12px',color:'#ede9ff',fontSize:'15px',
                  }}
                />
              </div>

              {/* Password */}
              <div style={{marginBottom:'8px'}}>
                <label style={{display:'block',fontSize:'11px',fontWeight:'700',color:'rgba(255,255,255,.3)',letterSpacing:'1.5px',marginBottom:'8px'}}>PASSWORD</label>
                <div style={{position:'relative'}}>
                  <input
                    className="auth-inp"
                    type={showPass?'text':'password'} value={form.password}
                    onChange={e=>setForm({...form,password:e.target.value})}
                    onFocus={()=>setFocused('pass')}
                    onBlur={()=>setFocused('')}
                    placeholder="Min 6 characters"
                    required
                    style={{
                      width:'100%',padding:'13px 46px 13px 16px',
                      background:'rgba(255,255,255,.05)',
                      border:`1.5px solid ${focused==='pass'?'#8b5cf6':'rgba(255,255,255,.07)'}`,
                      borderRadius:'12px',color:'#ede9ff',fontSize:'15px',
                    }}
                  />
                  <button type="button" className="bp" onClick={()=>setShowPass(!showPass)} style={{
                    position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',
                    background:'none',border:'none',color:'rgba(255,255,255,.3)',fontSize:'16px',lineHeight:1,
                  }}>{showPass?'◉':'○'}</button>
                </div>
              </div>

              {/* Strength meter */}
              {form.password.length>0&&(
                <div style={{marginBottom:'22px'}}>
                  <div style={{display:'flex',gap:'4px',marginBottom:'5px'}}>
                    {[1,2,3].map(i=>(
                      <div key={i} style={{flex:1,height:'3px',borderRadius:'2px',background:'rgba(255,255,255,.08)',overflow:'hidden'}}>
                        <div className="bar-fill" style={{height:'100%',width:i<=strength?'100%':'0%',background:sColor,borderRadius:'2px'}}/>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:'11px',fontWeight:'700',color:sColor,letterSpacing:'0.5px'}}>{sLabel.toUpperCase()}</span>
                    <span style={{fontSize:'11px',color:'rgba(255,255,255,.25)'}}>{sDesc}</span>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="submit-btn bp" style={{
                width:'100%',padding:'15px',marginTop:form.password.length>0?'0':'22px',
                background:loading?'rgba(139,92,246,.4)':'linear-gradient(135deg,#8b5cf6,#7c3aed)',
                color:'white',border:'none',borderRadius:'14px',
                fontWeight:'800',fontSize:'15px',cursor:loading?'not-allowed':'pointer',
                fontFamily:'inherit',letterSpacing:'0.3px',
                boxShadow:'0 8px 30px rgba(139,92,246,.4)',
                display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
              }}>
                {loading?(
                  <><div style={{width:'18px',height:'18px',border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin .7s linear infinite'}}/> Creating account...</>
                ):(
                  <>Create Account ✦</>
                )}
              </button>
            </form>

            <p style={{textAlign:'center',marginTop:'28px',color:'rgba(255,255,255,.28)',fontSize:'14px'}}>
              Already have an account?{' '}
              <Link to="/login" style={{color:'#a78bfa',fontWeight:'700',textDecoration:'none'}}>
                Sign in →
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}