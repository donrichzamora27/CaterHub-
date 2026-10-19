export default function Hdr({ S }) {
  const u = S.user;
  return (
    <div className="hd">
      <span
        className="logo"
        onClick={() => S.go(u?.role === "Caterer Owner" ? "own" : "home")}
      >
        CaterHub
      </span>
      {!u ? (
        <div className="nav">
          <a onClick={() => S.go("dir")}>Browse caterers</a>
          <a onClick={() => S.go("home")}>How it works</a>
          <a onClick={() => S.go("login")}>Log in</a>
          <button className="btn" onClick={() => S.go("signup")}>
            Sign up
          </button>
        </div>
      ) : (
        <div className="nav">
          <a onClick={() => S.go("dir")}>Browse caterers</a>
          <a onClick={() => S.go("mine")}>My inquiries</a>
          <a onClick={() => S.go("mine")}>Notifications ({S.unread})</a>
          <span className="mut sm">Logged in as {u.name}</span>
          <a onClick={S.logout}>Log out</a>
        </div>
      )}
    </div>
  );
}
