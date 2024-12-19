import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function DriversLayout({ children }) {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    );
}
