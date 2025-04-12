function AdminHome() {
    return (
        <div className="ml-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">As an admin you can perform the following actions:</h1>
        <li><a href="/admin/set-user-roles">Manage users and roles</a></li>
        <li><a href="/admin/sellers">Manage seller stores</a></li>
        <li><a href="/admin/products">Manage products</a></li>
        </div>
    );
    }
export default AdminHome;