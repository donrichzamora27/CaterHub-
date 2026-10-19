import { useState } from "react";
import { now, H } from "../data.js";
import Badge from "../components/Badge.jsx";
import Hdr from "../components/Hdr.jsx";

export default function Mine({ S, ok }) {
  const mine = S.inqs.filter((i) => i.uid === S.user.id);
  const [ref, setRef] = useState(mine[0]?.ref);
  const cur = mine.find((i) => i.ref === ref);
  const cn = (i) => S.cats.find((c) => c.id === i.cid).name;
  const myN = S.nots.filter((n) => n.uid === S.user.id);
  const cancel = (i) => {
    S.setInqs(
      S.inqs.map((x) =>
        x.ref === i.ref
          ? {
              ...x,
              status: "Cancelled",
              hist: [
                ...x.hist,
                H("Pending", "Cancelled", "Cancelled by customer.", now()),
              ],
            }
          : x,
      ),
    );
    S.setNots([
      {
        uid: "owner",
        msg: `${i.ref} was cancelled by the customer.`,
        read: false,
      },
      ...S.nots,
    ]);
  };
  return (
    <>
      <Hdr S={S} />
      <div className="wrap">
        {ok && <div className="ok">{ok}</div>}
        <div className="two">
          <div className="card">
            <h1 style={{ fontSize: 28 }}>My inquiries</h1>
            {mine.length === 0 ? (
              <p className="mut">
                You have no inquiries yet.{" "}
                <a onClick={() => S.go("dir")}>Browse caterers</a> to send one.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Ref. no.</th>
                      <th>Caterer</th>
                      <th>Event date</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mine.map((i) => (
                      <tr
                        key={i.ref}
                        className="clk"
                        onClick={() => setRef(i.ref)}
                      >
                        <td>{i.ref}</td>
                        <td>
                          <b>{cn(i)}</b>
                        </td>
                        <td>
                          {new Date(i.date + "T00:00").toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </td>
                        <td>
                          <Badge s={i.status} />
                        </td>
                        <td>
                          {i.status === "Pending" && (
                            <a
                              onClick={(e) => {
                                e.stopPropagation();
                                cancel(i);
                              }}
                            >
                              Cancel
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mut sm">You can cancel only Pending inquiries.</p>
          </div>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              {cur ? (
                <>
                  <h3>
                    {cur.ref} · {cn(cur)}
                  </h3>
                  <div
                    style={{
                      background: "var(--chip)",
                      borderRadius: 10,
                      padding: 12,
                      margin: "12px 0",
                    }}
                  >
                    <b>Caterer reply</b>
                    <div>
                      {[...cur.hist]
                        .reverse()
                        .find((h) => h.msg && h.new !== "Cancelled")?.msg ||
                        "No reply yet."}
                    </div>
                  </div>
                  <b>Status history</b>
                  {cur.hist.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        fontWeight: i === cur.hist.length - 1 ? 700 : 400,
                        fontSize: 14,
                        marginTop: 6,
                      }}
                    >
                      {h.new} · {h.at}
                    </div>
                  ))}
                  <p className="mut sm" style={{ marginTop: 12 }}>
                    Available is not a booking. Finalize the quotation, down
                    payment and contract directly with the caterer.
                  </p>
                </>
              ) : (
                <p className="mut">Select an inquiry to see its history.</p>
              )}
            </div>
            <div className="card">
              <h3>Notifications ({S.unread})</h3>
              {myN.length === 0 && <p className="mut sm">Nothing new.</p>}
              {myN.map((n, i) => (
                <div
                  key={i}
                  className="sm"
                  style={{ marginTop: 8, fontWeight: n.read ? 400 : 700 }}
                >
                  {n.msg}
                </div>
              ))}
              {S.unread > 0 && (
                <button
                  className="lk sm"
                  style={{ marginTop: 10 }}
                  onClick={() =>
                    S.setNots(
                      S.nots.map((n) =>
                        n.uid === S.user.id ? { ...n, read: true } : n,
                      ),
                    )
                  }
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
