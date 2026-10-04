import { AccountsPageShell } from "@/components/billing/accounts-page-shell";

export default function PendingAccountsPage() {
  return <AccountsPageShell title="Pending Accounts" statusFilter="pending" />;
}