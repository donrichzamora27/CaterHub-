import { useState } from "react";
import Hdr from "../components/Hdr.jsx";

export default function Signup({ S }) {
  const [role, setRole] = useState("Customer");
  const [f, setF] = useState({ name: "", email: "", phone: "", pw: "" });
  const [e, setE] = useState({});
  const set = (k) => (x) => setF({ ...f, [k]: x.target.value });
  const go = () => {
    const er = {};
    if (!f.name.trim()) er.name = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email.";
    else if (S.users.some((u) => u.email === f.email.toLowerCase()))
      er.email = "This email is already registered.";
    if (!f.phone.trim()) er.phone = "Contact number is required.";
    if (f.pw.length < 8) er.pw = "Use at least 8 characters.";
    setE(er);
    if (Object.keys(er).length) return;
    const u = {
      ...f,
      email: f.email.toLowerCase(),
      role,
      id: "u" + Date.now(),
      cid: null,
    };
    S.setUsers([...S.users, u]);
    S.login(u);
  };
  const F = (k, l, t = "text") => (
    <>
      <label>{l} *</label>
      <input
        type={t}
        className={e[k] ? "er" : ""}
        value={f[k]}
        onChange={set(k)}
      />
      {e[k] && <div className="err">{e[k]}</div>}
    </>
  );
  return (
    <>
      <Hdr S={S} />
      <div className="wrap" style={{ maxWidth: 540 }}>
        <div className="card">
          <h1>Create an account</h1>
          <div className="row" style={{ marginTop: 14 }}>
            {[
              ["Customer", "Find caterers and send inquiries"],
              ["Caterer Owner", "Manage one catering business"],
            ].map(([r, d]) => (
              <div
                key={r}
                className={"pick" + (role === r ? " on" : "")}
                onClick={() => setRole(r)}
              >
                <input type="radio" checked={role === r} readOnly />
                <div>
                  <b>{r}</b>
                  <div className="mut sm">{d}</div>
                </div>
              </div>
            ))}
          </div>
          {F("name", "Full name")}
          {F("email", "Email")}
          {F("phone", "Contact number")}
          {F("pw", "Password", "password")}
          <button
            className="btn w"
            style={{ margin: "18px 0 10px" }}
            onClick={go}
          >
            Create account
          </button>
          <p className="mut sm" style={{ textAlign: "center" }}>
            Caterer Owners set up their business profile after logging in.
            Already registered? <a onClick={() => S.go("login")}>Log in</a>
          </p>
        </div>
      </div>
    </>
  );
}
