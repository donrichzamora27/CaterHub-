import { supabase } from '../../lib/supabase.js';
import { useState } from 'react';
import Hdr from '../../components/Hdr.jsx';
import InqCal from './InqCal.jsx';
import Pkgs from './Pkgs.jsx';
import ProfEd from './ProfEd.jsx';

export default function Owner({S}){const c=S.cats.find(x=>x.id===S.user.cid);const [tab,setTab]=useState('inq');
 if(!c)return <div className="main" style={{marginLeft:0,maxWidth:760,margin:'auto'}}><p><a onClick={S.logout}>Log out</a></p><p className="mut">Set up your business profile to start receiving inquiries.</p><ProfEd S={S} c={null}/></div>;
 const myN=S.nots,un=myN.filter(n=>!n.read).length;
 const T=[['dash','Dashboard'],['inq','Inquiries'],['cal','Availability Calendar'],['pk','Packages & Photos'],['prof','Business Profile'],['not','Notifications ('+un+')']];
 return <div><div className="sb"><span className="logo" onClick={()=>setTab('inq')}>CaterHub</span>{T.map(([k,l])=><button key={k} className={tab===k?'on':''} onClick={()=>setTab(k)}>{l}</button>)}<div style={{marginTop:'auto',fontSize:13,opacity:.8,padding:'0 10px'}}>{c.name}<br/>Profile: {c.status}<br/><button style={{padding:'8px 0',textDecoration:'underline'}} onClick={S.logout}>Log out</button></div></div>
 <div className="main">{(tab==='inq'||tab==='cal'||tab==='dash')&&<InqCal S={S} c={c} cal={tab==='cal'}/>}
 {tab==='pk'&&<Pkgs S={S} c={c}/>}{tab==='prof'&&<ProfEd S={S} c={c}/>}
 {tab==='not'&&<div className="card"><h1 style={{fontSize:28}}>Notifications</h1>{myN.map((n,i)=><div key={i} style={{marginTop:10,fontWeight:n.read?400:700}}>{n.msg}</div>)}<button className="btn" style={{marginTop:16}} onClick={async()=>{await supabase.from('notifications').update({is_read:true}).eq('user_id',S.user.id);await S.reload(S.user)}}>Mark all read</button></div>}</div></div>}
