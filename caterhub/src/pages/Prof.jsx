import { peso } from "../data.js";
import Hdr from "../components/Hdr.jsx";
import Photos from "../components/Photos.jsx";

export default function Prof({ S, cid }) {
  const c = S.cats.find((x) => x.id === cid);
  const pk = c.pkgs.filter((p) => p.active);
  return (
    <>
      <Hdr S={S} />
      <div className="wrap">
        <p className="mut sm">
          <a onClick={() => S.go("dir")}>Caterers</a> / {c.name}
        </p>
        <Photos />
        <div className="two">
          <div>
            <h1>{c.name}</h1>
            <div style={{ margin: "8px 0" }}>
              {c.events.map((e) => (
                <span className="chip" key={e}>
                  {e}
                </span>
              ))}
            </div>
            <p>{c.desc}</p>
            <div className="card" style={{ margin: "16px 0" }}>
              <b>Capacity:</b> {c.min}–{c.max} guests
              <br />
              <b>Service areas:</b> {c.area.join(", ")}
              <br />
              <b>Out-of-town events:</b> {c.oot ? "Accepted" : "Not accepted"}
              <br />
              <b>Travel note:</b> {c.note}
            </div>
            <h2>Packages</h2>
            <div className="card" style={{ marginTop: 12 }}>
              {pk.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    flexWrap: "wrap",
                    padding: "12px 0",
                    borderTop: i ? "1px solid var(--ln)" : 0,
                  }}
                >
                  <div>
                    <b>{p.name}</b>
                    <div className="mut sm">
                      {p.min}–{p.max} guests{p.cust && " · Customizable"}
                    </div>
                  </div>
                  <div>
                    <b>{peso(p.price)}/head</b>{" "}
                    <a onClick={() => S.go("pkg", { cid, pid: p.id })}>
                      View details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3>Send an inquiry</h3>
            {S.user?.role === "Customer" ? (
              <>
                <p className="mut">
                  Choose a package or send a custom inquiry.
                </p>
                <button className="btn w" onClick={() => S.go("inq", { cid })}>
                  Send an inquiry
                </button>
              </>
            ) : S.user ? (
              <p className="mut">Caterer Owners cannot send inquiries.</p>
            ) : (
              <>
                <p className="mut">
                  Log in to send an inquiry to this caterer. Guests can browse
                  only.
                </p>
                <button className="btn w" onClick={() => S.go("login")}>
                  Log in to continue
                </button>
              </>
            )}
            <hr
              style={{
                border: 0,
                borderTop: "1px solid var(--ln)",
                margin: "16px 0",
              }}
            />
            <b>Contact:</b> {c.phone}
            <div className="mut sm">
              Reserved or Unavailable dates cannot be accepted. The caterer
              confirms availability when replying.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
