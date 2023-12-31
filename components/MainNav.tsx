'use client';

import { cn } from '@/lib/utils';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
}

export const MainNav = ( { className, ...props }: MainNavProps ) => {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${ params.storeId }`,
            label: 'Overview',
            active: pathname === `/${ params.storeId }`,
        },
        {
            href: `/${ params.storeId }/billboards`,
            label: 'Billboards',
            active: pathname === `/${ params.storeId }/billboards`,
        },
        {
            href: `/${ params.storeId }/settings`,
            label: 'Settings',
            active: pathname === `/${ params.storeId }/settings`,
        }
    ];

    return (
        <nav className={ cn( "flex items-center space-x-4 lg:space-x-6", className ) }>
            { routes.map( ( route, i ) => (
                <Link key={ route.href }
                      href={ route.href }
                      className={ cn(
                          "text-sm font-medium transition-colors hover:text-primary",
                          route.active ? "text-black dark:text:white" : "text-muted-foreground",
                      ) }
                >
                    { route.label }
                </Link>
            ) ) }
        </nav>
    );
};
