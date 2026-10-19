import { useState } from "react";
import { EVT, AREAS } from "../data.js";
import Hdr from "../components/Hdr.jsx";

export default function Home({ S }) {
  const [f, setF] = useState({ name: "", loc: "", ev: "", g: "", b: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <>
      <Hdr S={S} />
      <div className="wrap">
        <h1
          style={{
            fontSize: "clamp(32px,5vw,52px)",
            maxWidth: 760,
            lineHeight: 1.1,
          }}
        >
          Find a caterer in Calbayog. Send an inquiry.
        </h1>
        <p className="mut">
          Browse caterers, compare packages and check dates. Payments and
          contracts are arranged directly with the caterer.
        </p>
        <div className="card" style={{ margin: "26px 0" }}>
          <div className="row" style={{ alignItems: "end" }}>
            <div>
              <label>Business name</label>
              <input
                placeholder="Search by name"
                value={f.name}
                onChange={set("name")}
              />
            </div>
            <div>
              <label>Location</label>
              <select value={f.loc} onChange={set("loc")}>
                <option value="">Any area</option>
                {AREAS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Event type</label>
              <select value={f.ev} onChange={set("ev")}>
                <option value="">Any event</option>
                {EVT.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Guests</label>
              <input
                type="number"
                min="1"
                placeholder="Number"
                value={f.g}
                onChange={set("g")}
              />
            </div>
            <div>
              <label>Budget</label>
              <select value={f.b} onChange={set("b")}>
                <option value="">Any budget</option>
                <option value="0-400">Up to ₱400/head</option>
                <option value="400-600">₱400–600/head</option>
                <option value="600-99999">₱600+/head</option>
              </select>
            </div>
            <button
              className="btn"
              style={{ flex: "0 0 auto" }}
              onClick={() => {
                S.setFlt(f);
                S.go("dir");
              }}
            >
              Search
            </button>
          </div>
        </div>
        <h2>How it works</h2>
        <div className="grid" style={{ margin: "14px 0 26px" }}>
          {[
            [
              "1. Browse and filter",
              "Search by name, location, event type, guest count and budget. No account needed.",
            ],
            [
              "2. Send an inquiry",
              "Log in, choose a package or custom inquiry, and enter your event details.",
            ],
            [
              "3. Track the reply",
              "The caterer checks their calendar and replies. You see the status in your dashboard.",
            ],
          ].map(([a, b]) => (
            <div className="card" key={a}>
              <h3 style={{ fontSize: 17 }}>{a}</h3>
              <p className="mut" style={{ margin: "6px 0 0" }}>
                {b}
              </p>
            </div>
          ))}
        </div>
        <h2>Browse by event type</h2>
        <div style={{ margin: "12px 0" }}>
          {EVT.map((e) => (
            <button
              key={e}
              className="chip"
              onClick={() => {
                S.setFlt({ name: "", loc: "", ev: e, g: "", b: "" });
                S.go("dir");
              }}
            >
              {e}
            </button>
          ))}
        </div>
        <p className="mut sm">
          CaterHub is for discovery and inquiries only. It does not process
          payments or confirm bookings.
        </p>
      </div>
    </>
  );
}
