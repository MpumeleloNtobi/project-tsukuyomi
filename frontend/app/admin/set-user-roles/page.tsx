// src/app/admin-dashboard/page.tsx (or your file path)

import { removeRole, setRole } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// --- INTERFACES (Defined above or import from types file) ---
interface ClerkApiUser {
    id: string;
    object: "user";
    external_id: string | null;
    primary_email_address_id: string | null;
    primary_phone_number_id: string | null;
    primary_web3_wallet_id: string | null;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    profile_image_url: string;
    image_url: string;
    has_image: boolean;
    public_metadata: Record<string, any> | null;
    private_metadata: Record<string, any> | null;
    unsafe_metadata: Record<string, any> | null;
    email_addresses: { id: string; object: "email_address"; email_address: string; verification: any; linked_to: any[]; created_at: number; updated_at: number; }[];
    phone_numbers: { id: string; object: "phone_number"; phone_number: string; reserved_for_second_factor: boolean; default_second_factor: boolean; verification: any; linked_to: any[]; backup_codes?: any; created_at: number; updated_at: number; }[];
    web3_wallets: { id: string; object: "web3_wallet"; web3_wallet: string; verification: any; created_at: number; updated_at: number; }[];
    passkeys: any[];
    password_enabled: boolean;
    two_factor_enabled: boolean;
    totp_enabled: boolean;
    backup_code_enabled: boolean;
    mfa_enabled_at: number | null;
    mfa_disabled_at: number | null;
    external_accounts: any[];
    saml_accounts: any[];
    last_sign_in_at: number | null;
    banned: boolean;
    locked: boolean;
    lockout_expires_in_seconds: number | null;
    verification_attempts_remaining: number;
    updated_at: number;
    created_at: number;
    delete_self_enabled: boolean;
    create_organization_enabled: boolean;
    create_organizations_limit: number;
    last_active_at: number | null;
    legal_accepted_at?: number | null;
}

interface DisplayUser {
    id: string;
    primaryEmail: string | null;
    role: string | null;
}
// --- END INTERFACES ---

interface AdminDashboardProps {
    searchParams: { search?: string };
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
    const query = searchParams.search;
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    const clerkApiUrl = process.env.CLERK_API_URL || "https://api.clerk.com/v1";

    let displayUsers: DisplayUser[] = [];

    if (!clerkSecretKey) {
        console.error("CLERK_SECRET_KEY environment variable is not set.");
        return <main className="container mx-auto p-4"><p className='text-red-500'>Server configuration error: Clerk Secret Key missing.</p></main>;
    }

    // --- Fetch User Data via Clerk Backend API ---
    try {
        const fetchUrl = new URL(`${clerkApiUrl}/users`);
        if (query) {
            fetchUrl.searchParams.append('query', query);
        }
        // fetchUrl.searchParams.append('limit', '20'); // Optional limit

        console.log(`Workspaceing users from Clerk API: ${fetchUrl.toString()}`);

        const response = await fetch(fetchUrl.toString(), {
            headers: {
                'Authorization': `Bearer ${clerkSecretKey}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Clerk API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const apiUsers: ClerkApiUser[] = await response.json(); // Use the comprehensive type
        console.log(`Workspaceed ${apiUsers.length} users from API.`);

        // Map API data to our simpler DisplayUser structure (WITHOUT names)
        displayUsers = apiUsers.map(user => {
            const primaryEmail = user.email_addresses.find(
                email => email.id === user.primary_email_address_id
            )?.email_address;
            const role = user.public_metadata?.role ?? null;

            return {
                id: user.id,
                // firstName: user.first_name, // Removed
                // lastName: user.last_name,   // Removed
                primaryEmail: primaryEmail ?? null,
                role: role,
            };
        });

    } catch (error) {
        console.error("Failed to fetch users from Clerk API:", error);
    }
    // --- End Fetch User Data ---


    return (
        <main className="container mx-auto flex-grow p-4">
            <h1 className="text-2xl font-bold mb-6">Admin User Management</h1>

            {/* Search Form - Remains the same */}
            <form className="mb-6">
                 <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                    <div className="flex-grow">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search users by email
                        </label>
                        <Input
                            id="search"
                            name="search"
                            type="text"
                            defaultValue={query || ''}
                            placeholder="Enter email, ID..."
                            className="flex-grow"
                        />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto">
                        Search
                    </Button>
                </div>
            </form>

            {/* User List Display - Updated to use DisplayUser structure (no names) */}
            {displayUsers.length > 0 ? (
                displayUsers.map((user) => ( // user is now type DisplayUser
                    <div key={user.id} className="mb-4 space-y-3 rounded-md bg-white p-4 shadow-md">
                        {/* Name Display Removed */}
                        {/*
                        <div className="text-lg font-semibold text-gray-800">
                            {user.firstName ?? '(No First Name)'} {user.lastName ?? '(No Last Name)'}
                        </div>
                         */}

                        {/* Display Email (make it more prominent maybe?) */}
                        <div className="text-md font-semibold text-gray-800"> {/* Increased font size */}
                            {user.primaryEmail ?? 'No primary email'}
                        </div>

                        {/* Display ID */}
                        <div className="text-sm font-mono text-gray-500">
                            ID: {user.id}
                        </div>


                        <div className="text-sm font-medium text-blue-600">
                            Role: {user.role ?? 'None'} {/* Use processed role */}
                        </div>

                        {/* Action Forms - Remain the same, still use user.id */}
                        <div className="mt-2 flex flex-wrap gap-2">
                             <form action={setRole}>
                                <input type="hidden" value={user.id} name="id" />
                                <input type="hidden" value="admin" name="role" />
                                <Button size="sm" type="submit">Make Admin</Button>
                            </form>
                            <form action={setRole}>
                                <input type="hidden" value={user.id} name="id" />
                                <input type="hidden" value="buyer" name="role" />
                                <Button size="sm" type="submit" variant="outline">Make Buyer</Button>
                            </form>
                            <form action={setRole}>
                                <input type="hidden" value={user.id} name="id" />
                                <input type="hidden" value="seller" name="role" />
                                <Button size="sm" type="submit" variant="outline">Make Seller</Button>
                            </form>
                            <form action={removeRole}>
                                <input type="hidden" value={user.id} name="id" />
                                <Button size="sm" type="submit" variant="destructive">
                                    Remove Role
                                </Button>
                            </form>
                        </div>
                    </div>
                ))
            ) : (
                 <p className="text-center text-gray-500 mt-10">
                    {query ? `No users found matching "${query}".` : 'No users found.'}
                 </p>
            )}
        </main>
    );
}