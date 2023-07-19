import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

interface Props {
    params: {
        storeId: string;
    }
}

export async function PATCH( req: Request, { params }: Props ) {
    try {
        const { userId } = auth();

        if ( !userId ) {
            return NextResponse.json( 'Unauthorized', { status: 401 } );
        }

        const { storeId } = params;
        const { name } = await req.json();

        if ( !name ) {
            return NextResponse.json( 'Name is required', { status: 400 } );
        }

        if ( !storeId ) {
            return NextResponse.json( 'Store ID is required', { status: 400 } );
        }

        const store = await prismadb.store.updateMany( {
            where: {
                id: storeId,
                userId
            },
            data: {
                name
            }
        } );

        return NextResponse.json( store );

    } catch ( error ) {
        console.log( '[STORE_PATCH]', error );
        return NextResponse.json( 'Internal Server Error', { status: 500 } );
    }
}

export async function DELETE( req: Request, { params }: Props ) {
    try {
        const { userId } = auth();

        if ( !userId ) {
            return NextResponse.json( 'Unauthorized', { status: 401 } );
        }

        const { storeId } = params;

        if ( !storeId ) {
            return NextResponse.json( 'Store ID is required', { status: 400 } );
        }

        const store = await prismadb.store.deleteMany( {
            where: {
                id: storeId,
                userId
            }
        } );

        return NextResponse.json( store );

    } catch ( error ) {
        console.log( '[STORE_DELETE]', error );
        return NextResponse.json( 'Internal Server Error', { status: 500 } );
    }
}
