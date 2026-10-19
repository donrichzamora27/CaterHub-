import { useState } from "react";
import { EVT, AREAS, peso } from "../data.js";
import Hdr from "../components/Hdr.jsx";

export default function Dir({ S }) {
  const [f, setF] = useState(S.flt);
  const [ap, setAp] = useState(S.flt);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const list = S.cats
    .filter((c) => c.status === "Published")
    .filter((c) => {
      const g = +ap.g;
      const [lo, hi] = (ap.b || "0-99999").split("-").map(Number);
      return (
        (!ap.name || c.name.toLowerCase().includes(ap.name.toLowerCase())) &&
        (!ap.loc || c.area.includes(ap.loc)) &&
        (!ap.ev || c.events.includes(ap.ev)) &&
        (!g || (g >= c.min && g <= c.max)) &&
        c.pkgs.some((p) => p.active && p.price >= lo && p.price <= hi)
      );
    });
  return (
    <>
      <Hdr S={S} />
      <div className="wrap">
        <h1>Caterers</h1>
        <p className="mut">
          Showing {list.length} active caterer{list.length !== 1 && "s"}
        </p>
        <div
          className="two"
          style={{
            gridTemplateColumns: "minmax(0,280px) minmax(0,1fr)",
            marginTop: 18,
          }}
        >
          <div className="card">
            <h3>Search and filter</h3>
            <label>Business name</label>
            <input value={f.name} onChange={set("name")} />
            <label>Location</label>
            <select value={f.loc} onChange={set("loc")}>
              <option value="">Any area</option>
              {AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <label>Event type</label>
            <select value={f.ev} onChange={set("ev")}>
              <option value="">Any event</option>
              {EVT.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <label>Guest count</label>
            <input type="number" min="1" value={f.g} onChange={set("g")} />
            <label>Budget per head</label>
            <select value={f.b} onChange={set("b")}>
              <option value="">Any budget</option>
              <option value="0-400">Up to ₱400</option>
              <option value="400-600">₱400–600</option>
              <option value="600-99999">₱600+</option>
            </select>
            <button
              className="btn w"
              style={{ marginTop: 16 }}
              onClick={() => {
                setAp(f);
                S.setFlt(f);
              }}
            >
              Apply filters
            </button>
            <p style={{ textAlign: "center", margin: "12px 0 0" }}>
              <a
                onClick={() => {
                  const e = { name: "", loc: "", ev: "", g: "", b: "" };
                  setF(e);
                  setAp(e);
                  S.setFlt(e);
                }}
              >
                Clear all
              </a>
            </p>
          </div>
          <div>
            {list.length === 0 ? (
              <div className="card">
                <b>No caterer matches your filters.</b>
                <p className="mut">
                  Try a different location, guest count or budget.
                </p>
              </div>
            ) : (
              <div className="grid">
                {list.map((c) => (
                  <div
                    className="card"
                    key={c.id}
                    style={{ padding: 0, overflow: "hidden" }}
                  >
                    <div
                      className="ph"
                      style={{ borderRadius: 0, minHeight: 130 }}
                    >
                      Photo
                    </div>
                    <div style={{ padding: 18 }}>
                      <h3>{c.name}</h3>
                      <div className="mut sm" style={{ margin: "3px 0 8px" }}>
                        {c.area.join(", ")} ·{" "}
                        {c.oot ? "Out-of-town accepted" : "Local events only"}
                      </div>
                      {c.events.slice(0, 3).map((e) => (
                        <span className="chip" key={e}>
                          {e}
                        </span>
                      ))}
                      <p style={{ margin: "4px 0 12px" }}>
                        {c.min}–{c.max} guests · from{" "}
                        <b>
                          {peso(Math.min(...c.pkgs.map((p) => p.price)))}/head
                        </b>
                      </p>
                      <button
                        className="btn"
                        onClick={() => S.go("prof", { cid: c.id })}
                      >
                        View profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
