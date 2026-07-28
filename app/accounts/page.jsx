import AccountFilters from "../_components/accounts/AccountsFilter"
import AccountsTable from "../_components/accounts/AccountsTable"

function page() {
    return (
        <div className="w-full h-[91vh] p-2 flex flex-col gap-3">
            <AccountFilters />
            <AccountsTable />
        </div>
    )
}

export default page
