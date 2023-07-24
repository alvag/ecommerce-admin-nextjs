import { FC } from 'react';
import prismadb from '@/lib/prismadb';
import { BillboardForm } from './components/billboard-form';

interface BillboardProps {
    params: {
        billboardId: string;
    }
}

const BillboardPage: FC<BillboardProps> = async ( { params } ) => {
    const billboard = await prismadb.billboard.findUnique( {
        where: {
            id: params.billboardId
        }
    } );


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={ billboard }/>
            </div>
        </div>
    );
};

export default BillboardPage;
