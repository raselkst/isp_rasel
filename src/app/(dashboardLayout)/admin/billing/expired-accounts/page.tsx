import { AccountsPageShell } from "@/components/billing/accounts-page-shell";

export default function ExpiredAccountsPage() {
  return <AccountsPageShell title="Expired Accounts" statusFilter="expired" />;
}