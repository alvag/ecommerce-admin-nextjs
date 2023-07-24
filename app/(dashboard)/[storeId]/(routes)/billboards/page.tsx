import { FC } from 'react';
import { format } from 'date-fns';
import { BillboardClient } from './components/billboard-client';
import prismadb from '@/lib/prismadb';
import { BillboardColumn } from '@/app/(dashboard)/[storeId]/(routes)/billboards/components/columns';

interface BillboardsProps {
    params: {
        storeId: string;
    }
}

const BillboardsPage: FC<BillboardsProps> = async ( { params } ) => {
    const billboards = await prismadb.billboard.findMany( {
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    } );

    const formattedBillboards: BillboardColumn[] = billboards.map( ( billboard ) => ( {
        id: billboard.id,
        label: billboard.label,
        createdAt: format( billboard.createdAt, 'MMMM do, yyyy' )
    } ) );

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={ formattedBillboards }/>
            </div>
        </div>
    );
};

export default BillboardsPage;
