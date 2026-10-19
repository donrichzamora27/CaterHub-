import { supabase } from "./supabase.js";

const fmt = (d) =>
  new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export async function loadUser(id) {
  const { data: p, error } = await supabase
    .from("users")
    .select("user_id,full_name,contact_number,role_id")
    .eq("user_id", id)
    .single();
  if (error) throw error;
  const role = p.role_id === 2 ? "Caterer Owner" : "Customer";
  let cid = null;
  if (role === "Caterer Owner") {
    const { data: c } = await supabase
      .from("caterer_profiles")
      .select("caterer_id")
      .eq("owner_id", id)
      .maybeSingle();
    cid = c?.caterer_id ?? null;
  }
  return {
    id: p.user_id,
    name: p.full_name,
    phone: p.contact_number,
    role,
    cid,
  };
}

export async function loadAll(user) {
  const { data: cs, error: e1 } = await supabase
    .from("caterer_profiles")
    .select(
      "*, service_areas(*), caterer_event_types(*), catering_packages(*, package_menu_items(*))",
    );
  if (e1) throw e1;
  const cats = (cs || []).map((c) => ({
    id: c.caterer_id,
    name: c.business_name,
    desc: c.description || "",
    phone: c.contact_number || "",
    min: c.min_guests || 0,
    max: c.max_guests || 0,
    status: c.profile_status,
    area: c.service_areas.map((a) => a.location_name),
    oot: c.service_areas.some((a) => a.out_of_town_allowed),
    note: c.service_areas.find((a) => a.travel_note)?.travel_note || "",
    events: c.caterer_event_types.map((e) => e.event_type),
    pkgs: c.catering_packages.map((p) => ({
      id: p.package_id,
      name: p.package_name,
      price: Number(p.price_per_head || 0),
      min: p.minimum_guests || 0,
      max: p.maximum_guests || 0,
      cust: p.customizable,
      tc: p.tables_chairs,
      active: p.status === "Active",
      incl: (p.inclusions || "").split("\n").filter(Boolean),
      menu: Object.fromEntries(
        p.package_menu_items.map((m) => [m.category || "Item", m.item_name]),
      ),
    })),
  }));

  let inqs = [],
    cal = {},
    nots = [];
  if (user) {
    const { data: iq, error: e2 } = await supabase
      .from("inquiries")
      .select(
        "*, cust:users!customer_id(full_name), pk:catering_packages(package_name), inquiry_status_history(*)",
      )
      .order("created_at", { ascending: false });
    if (e2) throw e2;
    inqs = (iq || []).map((i) => ({
      id: i.inquiry_id,
      ref: i.reference_number,
      cid: i.caterer_id,
      uid: i.customer_id,
      cust: i.cust?.full_name || "Customer",
      pkg: i.pk?.package_name || "Custom",
      date: i.event_date,
      type: i.event_type,
      loc: i.event_location,
      guests: i.guest_count,
      phone: i.contact_number,
      budget: i.budget ?? "",
      notes: i.notes || "",
      status: i.status,
      hist: [...i.inquiry_status_history]
        .sort((a, b) => a.history_id - b.history_id)
        .map((h) => ({
          old: h.old_status || "—",
          new: h.new_status,
          msg: h.response_message || "",
          at: fmt(h.changed_at),
        })),
    }));
    if (user.cid) {
      const { data } = await supabase
        .from("availability_calendar")
        .select("event_date,status")
        .eq("caterer_id", user.cid);
      (data || []).forEach((r) => {
        cal[r.event_date] = r.status;
      });
    }
    const { data: nt } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    nots = (nt || []).map((n) => ({
      id: n.notification_id,
      uid: user.id,
      msg: n.message,
      read: n.is_read,
    }));
  }
  return { cats, inqs, cal, nots };
}
