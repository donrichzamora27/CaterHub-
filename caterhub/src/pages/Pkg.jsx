import { peso } from "../data.js";
import Hdr from "../components/Hdr.jsx";

export default function Pkg({ S, cid, pid }) {
  const c = S.cats.find((x) => x.id === cid),
    p = c.pkgs.find((x) => x.id === pid);
  return (
    <>
      <Hdr S={S} />
      <div className="wrap">
        <p className="mut sm">
          <a onClick={() => S.go("dir")}>Caterers</a> /{" "}
          <a onClick={() => S.go("prof", { cid })}>{c.name}</a> /{" "}
          {p.name.split(" ·")[0]}
        </p>
        <div className="two">
          <div>
            <div className="ph" style={{ minHeight: 200, marginBottom: 12 }}>
              Package photo
            </div>
            <h1>{p.name}</h1>
            <p>Package description from the caterer.</p>
            <div className="row" style={{ marginTop: 14 }}>
              <div className="card">
                <h3>Inclusions</h3>
                <ul>
                  {p.incl.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <h3>Sample menu</h3>
                {Object.entries(p.menu).map(([k, v]) => (
                  <div key={k}>
                    <span className="mut">{k}</span> {v}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <h1 style={{ fontSize: 28 }}>{peso(p.price)}/head</h1>
            <p className="mut">
              Price range {peso(p.price - 50)} – {peso(p.price + 100)}
            </p>
            <b>Capacity:</b> {p.min}–{p.max} guests
            <br />
            <b>Customizable:</b> {p.cust ? "Yes" : "No"}
            <br />
            <b>Tables and chairs:</b> {p.tc}
            <button
              className="btn w"
              style={{ margin: "16px 0 8px" }}
              onClick={() =>
                S.user?.role === "Customer"
                  ? S.go("inq", { cid, pid })
                  : S.go("login")
              }
            >
              Inquire about this package
            </button>
            <div className="mut sm">
              This sends an inquiry only. It is not a booking.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
