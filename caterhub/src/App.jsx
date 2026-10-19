import { useState } from "react";
import { CATS0, I0, CAL0, USERS0, NOT0 } from "./data.js";
import Home from "./pages/Home.jsx";
import Dir from "./pages/Dir.jsx";
import Prof from "./pages/Prof.jsx";
import Pkg from "./pages/Pkg.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Inq from "./pages/Inq.jsx";
import Mine from "./pages/Mine.jsx";
import Owner from "./pages/owner/Owner.jsx";

export default function App() {
  const [users, setUsers] = useState(USERS0),
    [user, setUser] = useState(null),
    [pg, setPg] = useState({ n: "home" }),
    [cats, setCats] = useState(CATS0),
    [inqs, setInqs] = useState(I0),
    [cal, setCal] = useState(CAL0),
    [nots, setNots] = useState(NOT0),
    [flt, setFlt] = useState({ name: "", loc: "", ev: "", g: "", b: "" });
  const go = (n, p = {}) => {
    window.scrollTo(0, 0);
    const prot = ["mine", "inq", "own"].includes(n);
    if (prot && !user) {
      setPg({ n: "login" });
      return;
    }
    setPg({ n, ...p });
  };
  const login = (u) => {
    setUser(u);
    setPg({ n: u.role === "Caterer Owner" ? "own" : "mine" });
  };
  const logout = () => {
    setUser(null);
    setPg({ n: "home" });
  };
  const unread = nots.filter((n) => n.uid === user?.id && !n.read).length;
  const S = {
    users,
    setUsers,
    user,
    cats,
    setCats,
    inqs,
    setInqs,
    cal,
    setCal,
    nots,
    setNots,
    flt,
    setFlt,
    go,
    login,
    logout,
    unread,
  };
  const { n } = pg;
  if (n === "dir") return <Dir S={S} />;
  if (n === "prof") return <Prof S={S} cid={pg.cid} />;
  if (n === "pkg") return <Pkg S={S} cid={pg.cid} pid={pg.pid} />;
  if (n === "signup") return <Signup S={S} />;
  if (n === "login") return <Login S={S} />;
  if (n === "inq" && user?.role === "Customer")
    return <Inq S={S} cid={pg.cid} pid={pg.pid} />;
  if (n === "mine" && user?.role === "Customer")
    return <Mine S={S} ok={pg.ok} />;
  if (n === "own" && user?.role === "Caterer Owner") return <Owner S={S} />;
  return <Home S={S} />;
}
