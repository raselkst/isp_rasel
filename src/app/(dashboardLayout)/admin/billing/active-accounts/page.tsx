import { AccountsPageShell } from "@/components/billing/accounts-page-shell";
import { AllAccountsTopbar } from "@/components/dashboard/all-accounts-topbar";

export default function AllAccountsRoute() {
  return (
    <AccountsPageShell 
      title="All Accounts" 
      statusFilter="all" 
      topbar={<AllAccountsTopbar />}
    />
  );
}