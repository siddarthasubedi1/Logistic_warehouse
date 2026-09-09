function UserFilters({
    searchTerm = "",
    roleFilter = "all",
    statusFilter = "all",
    onSearchChange,
    onRoleChange,
    onStatusChange,
}) {
    return (
        <div className="grid gap-3 md:grid-cols-3">
            {/* Search */}
            <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                    onSearchChange(
                        event.target.value
                    )
                }
                placeholder="Search name, username or email..."
                className="
                    rounded-lg
                    border
                    border-slate-300
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                "
            />


            {/* Role */}
            <select
                value={roleFilter}
                onChange={(event) =>
                    onRoleChange(
                        event.target.value
                    )
                }
                className="
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                "
            >
                <option value="all">
                    All Roles
                </option>

                <option value="trainer">
                    Trainer
                </option>

                <option value="trainee">
                    Trainee
                </option>
            </select>


            {/* Status */}
            <select
                value={statusFilter}
                onChange={(event) =>
                    onStatusChange(
                        event.target.value
                    )
                }
                className="
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                "
            >
                <option value="all">
                    All Statuses
                </option>

                <option value="active">
                    Active
                </option>

                <option value="deactivated">
                    Deactivated
                </option>
            </select>
        </div>
    );
}


export default UserFilters;