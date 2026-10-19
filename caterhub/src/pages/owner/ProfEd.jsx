import { useState } from 'react';
import { AREAS, EVT } from '../../data.js';
import { supabase } from '../../lib/supabase.js';

export default function ProfEd({ S, c }) {
  const c0 = c || { name: '', desc: '', phone: S.user.phone || '', note: '', min: '', max: '', oot: false, area: [], events: [] };
  const [f, setF] = useState({ name: c0.name, desc: c0.desc, phone: c0.phone, note: c0.note, min: c0.min, max: c0.max, oot: c0.oot, area: c0.area, events: c0.events });
  const [er, setEr] = useState(''), [ok, setOk] = useState(''), [busy, setBusy] = useState(false);
  const tg = (k, v) => setF({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] });

  const save = async pub => {
    setOk('');
    const miss = !f.name || !f.desc || !f.phone || !f.area.length || !f.events.length || !+f.min || !+f.max;
    if (pub && miss) { setEr('Complete business name, description, contact number, one service area, one event type and guest capacity before publishing.'); return; }
    if (!f.name.trim()) { setEr('Business name is required.'); return; }
    setEr(''); setBusy(true);
    const row = { business_name: f.name, description: f.desc, contact_number: f.phone, min_guests: +f.min || null, max_guests: +f.max || null, profile_status: pub ? 'Published' : 'Draft' };
    let id = c?.id;
    if (id) {
      const { error } = await supabase.from('caterer_profiles').update(row).eq('caterer_id', id);
      if (error) { setBusy(false); setEr(error.message); return; }
    } else {
      const { data, error } = await supabase.from('caterer_profiles').insert({ ...row, owner_id: S.user.id }).select('caterer_id').single();
      if (error) { setBusy(false); setEr(error.message); return; }
      id = data.caterer_id;
    }
    await supabase.from('service_areas').delete().eq('caterer_id', id);
    if (f.area.length) await supabase.from('service_areas').insert(f.area.map((a, i) => ({ caterer_id: id, location_name: a, out_of_town_allowed: f.oot, travel_note: i === 0 ? f.note : null })));
    await supabase.from('caterer_event_types').delete().eq('caterer_id', id);
    if (f.events.length) await supabase.from('caterer_event_types').insert(f.events.map(e => ({ caterer_id: id, event_type: e })));
    await S.refresh(); setBusy(false); setOk(pub ? 'Published.' : 'Saved as draft.');
  };

  return <div className="card"><h1 style={{ fontSize: 28 }}>Business profile</h1>
    <p className="mut sm">Status: {c ? c.status : 'Not created yet'}. Only published profiles appear in the directory.</p>
    <label>Business name *</label><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
    <label>Description *</label><textarea rows="3" value={f.desc} onChange={e => setF({ ...f, desc: e.target.value })} />
    <div className="row"><div><label>Contact number *</label><input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></div>
      <div><label>Min guests *</label><input value={f.min} onChange={e => setF({ ...f, min: e.target.value })} /></div>
      <div><label>Max guests *</label><input value={f.max} onChange={e => setF({ ...f, max: e.target.value })} /></div></div>
    <label>Service areas *</label>{AREAS.map(a => <label key={a} style={{ display: 'inline-block', marginRight: 16, fontWeight: 400 }}><input type="checkbox" style={{ width: 'auto', marginRight: 6 }} checked={f.area.includes(a)} onChange={() => tg('area', a)} />{a}</label>)}
    <label>Event types *</label>{EVT.map(a => <label key={a} style={{ display: 'inline-block', marginRight: 16, fontWeight: 400 }}><input type="checkbox" style={{ width: 'auto', marginRight: 6 }} checked={f.events.includes(a)} onChange={() => tg('events', a)} />{a}</label>)}
    <label><input type="checkbox" style={{ width: 'auto', marginRight: 8 }} checked={f.oot} onChange={e => setF({ ...f, oot: e.target.checked })} />Accept out-of-town events</label>
    <label>Travel note</label><input value={f.note} onChange={e => setF({ ...f, note: e.target.value })} />
    {er && <div className="err">{er}</div>}{ok && <div className="ok" style={{ marginTop: 12 }}>{ok}</div>}
    <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
      <button className="btn" disabled={busy} onClick={() => save(true)}>Publish profile</button>
      <button className="btn" disabled={busy} style={{ background: 'var(--ink)', color: 'var(--bg)' }} onClick={() => save(false)}>Save as draft</button></div></div>;
}
