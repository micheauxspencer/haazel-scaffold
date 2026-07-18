/**
 * Demo content for /showcase ONLY — never import fixtures in a real page.
 * Real builds pass client content via props (see SECTION_SPEC.md §1).
 *
 * Themed as an event-platform admin (VendorSpace: organizers + vendors,
 * bookings, payouts) to match the saas/ pack's fixtures. All names, amounts
 * and activity are fabricated for demonstration only.
 */
import type { AppShellProps } from "./AppShell";
import type { DataTableColumn, DataTableProProps } from "./DataTablePro";
import type { KpiCardsProps } from "./KpiCards";
import type { ChartPanelProps } from "./ChartPanel";
import type { ActivityFeedProps } from "./ActivityFeed";
import type { SettingsFormProps } from "./SettingsForm";
import type { EmptyStateProps } from "./EmptyState";
import type { CommandPaletteProps } from "./CommandPalette";

export const appShellFixture: Omit<AppShellProps, "children" | "onSearchClick"> = {
  brand: { name: "VendorSpace" },
  user: { name: "Priya Nandakumar", email: "priya@vendorspace.io" },
  breadcrumb: [{ label: "Dashboard" }],
  navSections: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: "#", active: true },
        { label: "Bookings", href: "#" },
        { label: "Vendors", href: "#" },
        { label: "Payouts", href: "#" },
      ],
    },
    {
      label: "Manage",
      items: [
        { label: "Events", href: "#" },
        { label: "Applications", href: "#" },
        { label: "Messages", href: "#" },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Settings", href: "#" },
        { label: "Support", href: "#" },
      ],
    },
  ],
};

const bookingsColumns: DataTableColumn[] = [
  { key: "vendor", header: "Vendor", sortable: true },
  { key: "event", header: "Event" },
  { key: "date", header: "Date", sortable: true },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    align: "right",
    render: (row) => `$${Number(row.amount).toLocaleString("en-US")}`,
  },
  { key: "status", header: "Status", align: "center" },
];

const bookingsRows: Record<string, unknown>[] = [
  { id: "BK-1042", vendor: "Nomad Coffee Collective", event: "Riverside Night Market", date: "2026-07-12", amount: 480, status: "confirmed" },
  { id: "BK-1041", vendor: "Maple & Vine Co.", event: "Harbourfront Craft Fair", date: "2026-07-11", amount: 320, status: "pending" },
  { id: "BK-1040", vendor: "Salt & Ember Kitchen", event: "Riverside Night Market", date: "2026-07-11", amount: 610, status: "confirmed" },
  { id: "BK-1039", vendor: "Loom & Thread Studio", event: "Old Town Makers Market", date: "2026-07-09", amount: 275, status: "completed" },
  { id: "BK-1038", vendor: "Northbound Ceramics", event: "Harbourfront Craft Fair", date: "2026-07-08", amount: 340, status: "cancelled" },
  { id: "BK-1037", vendor: "Fernweh Candle Co.", event: "Old Town Makers Market", date: "2026-07-07", amount: 210, status: "completed" },
  { id: "BK-1036", vendor: "Birchwood Books", event: "Riverside Night Market", date: "2026-07-05", amount: 190, status: "completed" },
  { id: "BK-1035", vendor: "Golden Hour Florals", event: "Harbourfront Craft Fair", date: "2026-07-03", amount: 385, status: "confirmed" },
  { id: "BK-1034", vendor: "Cast Iron Provisions", event: "Old Town Makers Market", date: "2026-07-02", amount: 295, status: "pending" },
];

export const bookingsTableFixture: DataTableProProps = {
  caption: "Recent bookings",
  pageSize: 6,
  columns: bookingsColumns,
  rows: bookingsRows,
  statusBadge: {
    key: "status",
    variant: (value) => {
      switch (value) {
        case "confirmed":
          return "default";
        case "completed":
          return "secondary";
        case "pending":
          return "outline";
        case "cancelled":
          return "destructive";
        default:
          return "outline";
      }
    },
  },
};

export const revenueKpiFixture: KpiCardsProps = {
  columns: 4,
  items: [
    {
      label: "Gross revenue",
      value: "$48,210",
      delta: { value: "+12.4%", direction: "up" },
      sparkline: [28, 31, 30, 34, 38, 36, 41, 44, 42, 48],
      caption: "Last 30 days",
    },
    {
      label: "Active bookings",
      value: "186",
      delta: { value: "+8", direction: "up" },
      sparkline: [140, 148, 151, 149, 160, 165, 170, 174, 179, 186],
      caption: "Across 6 markets",
    },
    {
      label: "Avg. booking value",
      value: "$259",
      delta: { value: "-3.1%", direction: "down" },
      sparkline: [268, 265, 270, 262, 264, 259, 261, 257, 260, 259],
      caption: "vs. last period",
    },
    {
      label: "Payout success rate",
      value: "99.6%",
      delta: { value: "0.0%", direction: "flat" },
      sparkline: [99.4, 99.5, 99.6, 99.5, 99.6, 99.6, 99.7, 99.6, 99.6, 99.6],
      caption: "Stripe payouts",
    },
  ],
};

export const revenueChartFixture: ChartPanelProps = {
  title: "Revenue trend",
  meta: "Last 8 weeks",
  variant: "area",
  data: [
    { label: "W1", value: 9200 },
    { label: "W2", value: 10450 },
    { label: "W3", value: 9800 },
    { label: "W4", value: 11600 },
    { label: "W5", value: 12850 },
    { label: "W6", value: 12100 },
    { label: "W7", value: 13950 },
    { label: "W8", value: 15200 },
  ],
};

export const bookingsByMarketChartFixture: ChartPanelProps = {
  title: "Bookings by market",
  meta: "This month",
  variant: "bar",
  data: [
    { label: "Riverside", value: 62 },
    { label: "Harbourfront", value: 48 },
    { label: "Old Town", value: 39 },
    { label: "Midtown", value: 27 },
    { label: "Docklands", value: 18 },
  ],
};

export const activityFeedFixture: ActivityFeedProps = {
  groupByDay: true,
  entries: [
    { date: "Today", time: "9:41 AM", actor: { name: "Priya Nandakumar" }, action: "approved a payout for", target: "Nomad Coffee Collective" },
    { date: "Today", time: "8:55 AM", actor: { name: "System" }, action: "flagged a failed payment on", target: "booking BK-1038" },
    { date: "Today", time: "8:02 AM", actor: { name: "Marcus Webb" }, action: "published", target: "Riverside Night Market — August" },
    { date: "Yesterday", time: "6:14 PM", actor: { name: "Simone Ashworth" }, action: "approved a vendor application from", target: "Salt & Ember Kitchen" },
    { date: "Yesterday", time: "2:37 PM", actor: { name: "Marcus Webb" }, action: "replied to a message from", target: "Loom & Thread Studio" },
    { date: "Yesterday", time: "11:20 AM", actor: { name: "System" }, action: "processed payouts for", target: "12 vendors" },
  ],
};

export const organizationSettingsFixture: Omit<SettingsFormProps, "onSubmit" | "errors"> = {
  submitLabel: "Save changes",
  sections: [
    {
      title: "Organization",
      description: "Basic details shown to vendors and shoppers.",
      fields: [
        { name: "orgName", label: "Organization name", type: "text", defaultValue: "VendorSpace Markets", required: true },
        { name: "supportEmail", label: "Support email", type: "email", defaultValue: "support@vendorspace.io", required: true },
        {
          name: "timezone",
          label: "Timezone",
          type: "select",
          defaultValue: "america-toronto",
          options: [
            { label: "Eastern Time (Toronto)", value: "america-toronto" },
            { label: "Central Time (Chicago)", value: "america-chicago" },
            { label: "Pacific Time (Vancouver)", value: "america-vancouver" },
          ],
        },
      ],
    },
    {
      title: "Notifications",
      description: "How the team hears about bookings and payouts.",
      fields: [
        {
          name: "payoutAlerts",
          label: "Payout alerts",
          type: "select",
          defaultValue: "instant",
          options: [
            { label: "Instant", value: "instant" },
            { label: "Daily digest", value: "daily" },
            { label: "Off", value: "off" },
          ],
        },
        {
          name: "bookingNotes",
          label: "Booking notes",
          type: "textarea",
          placeholder: "Internal notes shown on new booking emails…",
          defaultValue: "",
          description: "Visible to your team only.",
        },
      ],
    },
  ],
};

export const bookingsEmptyStateFixture: EmptyStateProps = {
  heading: "No bookings yet",
  description: "Bookings will appear here once vendors start applying to your markets.",
  primaryAction: { label: "Invite vendors", href: "#" },
  secondaryAction: { label: "View application form", href: "#" },
};

export const commandPaletteFixture: Omit<CommandPaletteProps, "open" | "onOpenChange"> = {
  placeholder: "Jump to a page or run a command…",
  groups: [
    {
      heading: "Navigate",
      items: [
        { label: "Dashboard", shortcut: "G D", onSelect: () => {} },
        { label: "Bookings", shortcut: "G B", onSelect: () => {} },
        { label: "Vendors", shortcut: "G V", onSelect: () => {} },
      ],
    },
    {
      heading: "Actions",
      items: [
        { label: "Create booking", onSelect: () => {} },
        { label: "Invite a vendor", onSelect: () => {} },
        { label: "Export payouts CSV", onSelect: () => {} },
      ],
    },
  ],
};
