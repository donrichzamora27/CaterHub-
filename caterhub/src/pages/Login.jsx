import { useState } from "react";

export default function Login({ S }) {
  const [role, setRole] = useState("Customer");
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [er, setEr] = useState("");
  const go = () => {
    const u = S.users.find(
      (x) => x.email === em.toLowerCase() && x.pw === pw && x.role === role,
    );
    u ? S.login(u) : setEr("Email, password or account type is incorrect.");
  };
  return (
    <div className="login">
      <div className="l">
        <span
          className="logo"
          style={{ fontSize: 24 }}
          onClick={() => S.go("home")}
        >
          CaterHub
        </span>
        <div>
          <h1>Find a caterer in Calbayog. Send one inquiry.</h1>
          <p style={{ opacity: 0.8 }}>
            Reservations, down payments and contracts stay between you and the
            caterer.
          </p>
        </div>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", padding: "30px 6vw" }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h1>Log in</h1>
          <div className="tabs">
            {["Customer", "Caterer Owner"].map((r) => (
              <button
                key={r}
                className={role === r ? "on" : ""}
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <label>Email</label>
          <input
            placeholder="you@example.com"
            value={em}
            onChange={(e) => setEm(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          {er && <div className="err">{er}</div>}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "12px 0 16px",
            }}
          >
            <label style={{ margin: 0, fontWeight: 400 }}>
              <input
                type="checkbox"
                style={{ width: "auto", marginRight: 8 }}
              />
              Remember me
            </label>
            <a>Forgot password?</a>
          </div>
          <button className="btn w" onClick={go}>
            Log in
          </button>
          <p className="mut sm" style={{ textAlign: "center" }}>
            New here? <a onClick={() => S.go("signup")}>Create an account</a>{" "}
            and choose Customer or Caterer Owner.
          </p>
          <p className="mut sm">
            Demo: ana@example.com / ana12345 (Customer) · owner@example.com /
            owner123 (Caterer Owner)
          </p>
        </div>
      </div>
    </div>
  );
}
