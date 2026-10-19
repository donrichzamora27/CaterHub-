import { sk } from "../data.js";

export default function Badge({ s }) {
  return <span className={"bd s-" + sk(s)}>{s}</span>;
}
