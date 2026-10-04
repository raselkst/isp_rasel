import { AccountsPageShell } from "@/components/billing/accounts-page-shell";
import { AllAccountsTopbar } from "@/components/dashboard/all-accounts-topbar";

export default function TodaysClientPage() {
  return (
    <AccountsPageShell 
      title="Todays Client" 
      statusFilter="today" 
      topbar={<AllAccountsTopbar />}
    />
  );
}