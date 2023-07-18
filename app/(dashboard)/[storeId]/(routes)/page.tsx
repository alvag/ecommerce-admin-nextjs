import { FC } from 'react';
import prismadb from '@/lib/prismadb';

interface DashboardProps {
    params: {
        storeId: string;
    }
}

const DashboardPage: FC<DashboardProps> = async ( { params } ) => {
    const store = await prismadb.store.findFirst( {
        where: {
            id: params.storeId
        }
    } );

    return (
        <div>
            Active Store: { store?.name }
        </div>
    );
};

export default DashboardPage;
