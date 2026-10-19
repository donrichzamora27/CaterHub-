import { useState } from 'react';
import { EVT, peso, now, H } from '../data.js';

export default function Inq({S,cid,pid}){const c=S.cats.find(x=>x.id===cid);const [sel,setSel]=useState(pid||'custom');
 const [f,setF]=useState({date:'',type:'',loc:'',guests:'',phone:S.user.phone||'',budget:'',notes:''});const [e,setE]=useState({});const [busy,setBusy]=useState(false);const set=k=>x=>setF({...f,[k]:x.target.value});
 const go=()=>{if(busy)return;const er={};const today=new Date().toISOString().slice(0,10);
  if(!f.date)er.date='Event date is required.';else if(f.date<today)er.date='Past dates are not accepted.';
  if(!f.type)er.type='Choose an event type.';if(!f.loc.trim())er.loc='Event location is required.';
  if(!/^[1-9]\d*$/.test(String(f.guests)))er.guests='Enter a whole number, 1 or more.';if(!f.phone.trim())er.phone='Contact number is required.';
  setE(er);if(Object.keys(er).length)return;setBusy(true);
  setTimeout(()=>{const ref='CH-'+String(44+S.inqs.length-7+0).padStart(4,'0');const p=c.pkgs.find(x=>x.id===sel);
   S.setInqs([{ref,cid,uid:S.user.id,cust:S.user.name,pkg:p?p.name:'Custom',...f,guests:+f.guests,status:'Pending',hist:[H('—','Pending','',now())]},...S.inqs]);
   S.setNots([{uid:'owner',msg:`New inquiry ${ref} from ${S.user.name}.`,read:false},...S.nots]);S.go('mine',{ok:`Inquiry ${ref} sent. Status: Pending.`})},500)};
 const E=k=>e[k]&&<div className="err">{e[k]}</div>;
 return <><div className="hd"><span className="logo" onClick={()=>S.go('home')}>CaterHub</span><span className="mut sm">Logged in as {S.user.name} · <a onClick={S.logout}>Log out</a></span></div><div className="wrap"><div className="two">
 <div className="card"><h1 style={{fontSize:28}}>Send an inquiry to {c.name}</h1><p className="mut sm">Fields marked * are required. This is an inquiry, not a booking.</p><label>Package or custom inquiry *</label>
 {[...c.pkgs.filter(p=>p.active).map(p=>({id:p.id,t:p.name,d:`${peso(p.price)}/head · ${p.min}–${p.max} guests`})),{id:'custom',t:'Custom inquiry',d:'Describe what you need below'}].map(o=><div key={o.id} className={'pick'+(sel===o.id?' on':'')} onClick={()=>setSel(o.id)}><input type="radio" checked={sel===o.id} readOnly/><div><b>{o.t}</b><div className="mut sm">{o.d}</div></div></div>)}
 <div className="row"><div><label>Event date *</label><input type="date" className={e.date?'er':''} value={f.date} onChange={set('date')}/>{E('date')||<div className="mut sm">Past dates are not accepted.</div>}</div>
 <div><label>Event type *</label><select value={f.type} onChange={set('type')}><option value="">Select</option>{EVT.map(a=><option key={a}>{a}</option>)}</select>{E('type')}</div></div>
 <div className="row"><div><label>Event location *</label><input className={e.loc?'er':''} value={f.loc} onChange={set('loc')}/>{E('loc')}</div>
 <div><label>Guest count *</label><input inputMode="numeric" className={e.guests?'er':''} value={f.guests} onChange={set('guests')}/>{E('guests')||<div className="mut sm">Whole number, 1 or more.</div>}</div></div>
 <div className="row"><div><label>Contact number *</label><input className={e.phone?'er':''} value={f.phone} onChange={set('phone')}/>{E('phone')}</div><div><label>Budget (optional)</label><input placeholder="₱" value={f.budget} onChange={set('budget')}/></div></div>
 <label>Special requests (optional)</label><textarea rows="3" value={f.notes} onChange={set('notes')}/><button className="btn" style={{marginTop:16}} disabled={busy} onClick={go}>{busy?'Sending…':'Send inquiry'}</button></div>
 <div><div className="card" style={{marginBottom:16}}><h3>What happens next</h3><ol style={{paddingLeft:20}}><li>You get a reference number. Status: Pending.</li><li>The caterer checks their calendar and replies.</li><li>You see the reply and status in your dashboard.</li><li>Quotation, down payment and contract are arranged directly with the caterer.</li></ol></div>
 <div className="card"><h3>Service area</h3>{c.area.join(', ')} and nearby areas<br/>Out-of-town events: {c.oot?'accepted':'not accepted'}<div className="mut sm">Travel note: {c.note}</div></div></div></div></div></>}
