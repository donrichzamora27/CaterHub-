import { useState } from "react";
import { STAT, now, H } from "../../data.js";
import Badge from "../../components/Badge.jsx";

export default function InqCal({ S, c, cal }) {
  const mine = S.inqs.filter((i) => i.cid === c.id);
  const [ref, setRef] = useState(
    mine.find((i) => i.status === "Pending")?.ref || mine[0]?.ref,
  );
  const cur = mine.find((i) => i.ref === ref);
  const [msg, setMsg] = useState("");
  const [st, setSt] = useState("Replied");
  const [er, setEr] = useState("");
  const [selD, setSelD] = useState(null);
  const [mark, setMark] = useState("Available");
  const open = (i) => ["Pending", "Replied", "Available"].includes(i.status);
  const pend = {};
  mine
    .filter(open)
    .forEach((i) => (pend[i.date] = (pend[i.date] || []).concat(i.ref)));
  const conf = mine.filter(
    (i) => open(i) && ["Reserved", "Unavailable"].includes(S.cal[i.date]),
  );
  const send = () => {
    if (!cur) return;
    if (["Unavailable", "Cancelled"].includes(st) && !msg.trim()) {
      setEr("A reply message is required for Unavailable or Cancelled.");
      return;
    }
    setEr("");
    S.setInqs(
      S.inqs.map((i) =>
        i.ref === cur.ref
          ? { ...i, status: st, hist: [...i.hist, H(i.status, st, msg, now())] }
          : i,
      ),
    );
    S.setNots([
      { uid: cur.uid, msg: `${cur.ref} is now ${st}.`, read: false },
      ...S.nots,
    ]);
    setMsg("");
  };
  const setDate = () => {
    if (!selD) return;
    const n = { ...S.cal };
    mark === "Available" ? delete n[selD] : (n[selD] = mark);
    S.setCal(n);
  };
  const days = [];
  for (let d = 1; d <= 30; d++) days.push(d);
  const key = (d) => "2026-11-" + String(d).padStart(2, "0");
  return (
    <>
      <h1>Inquiries & availability</h1>
      <p className="mut">
        Inquiries are not bookings. Mark a date Reserved only after you agree
        directly with the customer.
      </p>
      {conf.map((i) => (
        <div className="warn" key={i.ref}>
          <b>Date conflict:</b> Inquiry {i.ref} asks for{" "}
          {new Date(i.date + "T00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
          , which is already {S.cal[i.date]}.{" "}
          <a
            onClick={() => {
              setSelD(i.date);
              setRef(i.ref);
            }}
          >
            View date
          </a>
        </div>
      ))}
      <div
        className="two"
        style={{
          gridTemplateColumns: cal ? "1fr" : "minmax(0,1.3fr) minmax(0,1fr)",
        }}
      >
        {!cal && (
          <div className="card">
            <h3>Incoming inquiries</h3>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Ref. no.</th>
                    <th>Customer & event</th>
                    <th>Date & guests</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mine.map((i) => (
                    <tr
                      key={i.ref}
                      className="clk"
                      onClick={() => setRef(i.ref)}
                      style={i.ref === ref ? { background: "var(--sel)" } : {}}
                    >
                      <td>{i.ref}</td>
                      <td>
                        <b>{i.cust}</b>
                        <br />
                        <span className="mut">
                          {i.type} · {i.loc}
                        </span>
                      </td>
                      <td>
                        {new Date(i.date + "T00:00").toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}{" "}
                        · {i.guests} guests
                      </td>
                      <td>
                        <Badge s={i.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {cur && (
              <div style={{ marginTop: 14 }}>
                <div className="mut sm" style={{ marginBottom: 8 }}>
                  {cur.cust} · {cur.phone} · {cur.pkg}
                  {cur.budget && " · Budget ₱" + cur.budget}
                  {cur.notes && " · " + cur.notes}
                </div>
                <label>Set status</label>
                <select value={st} onChange={(e) => setSt(e.target.value)}>
                  {STAT.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <label>
                  Reply to {cur.ref} (required for Unavailable or Cancelled)
                </label>
                <textarea
                  rows="3"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
                {er && <div className="err">{er}</div>}
                <button
                  className="btn"
                  style={{ marginTop: 12 }}
                  onClick={send}
                >
                  Send reply & set status
                </button>
              </div>
            )}
          </div>
        )}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>November 2026</h3>
            {selD && (
              <span className="sm">
                <select
                  style={{ width: "auto", padding: "4px 8px" }}
                  value={mark}
                  onChange={(e) => setMark(e.target.value)}
                >
                  <option>Available</option>
                  <option>Unavailable</option>
                  <option>Reserved</option>
                </select>{" "}
                <button className="lk" onClick={setDate}>
                  <b>Mark selected date</b>
                </button>
              </span>
            )}
          </div>
          <div className="cal" style={{ marginTop: 12 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="mut sm">
                {d}
              </div>
            ))}
            {Array(0).fill(0)}
            {days.map((d) => {
              const k = key(d),
                s = S.cal[k];
              return (
                <button
                  key={d}
                  className={
                    "cd " +
                    (s || "") +
                    (pend[k] ? " pd" : "") +
                    (selD === k ? " sel" : "")
                  }
                  onClick={() => {
                    setSelD(k);
                    pend[k] && setRef(pend[k][0]);
                  }}
                >
                  {d}
                  {s ? (
                    <small>{s === "Unavailable" ? "Unavail." : s}</small>
                  ) : pend[k] ? (
                    <small>Pending</small>
                  ) : null}
                </button>
              );
            })}
          </div>
          <p className="mut sm" style={{ marginTop: 12 }}>
            White: Available · Grey: Unavailable · Navy: Reserved · Dashed:
            Pending inquiry
          </p>
          {selD && (
            <p className="sm">
              {selD}:{" "}
              {pend[selD]
                ? "Inquiries " + pend[selD].join(", ")
                : "No pending inquiries"}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
