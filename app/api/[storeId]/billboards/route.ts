import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

interface Params {
    params: {
        storeId: string;
    }
}

export async function POST( req: Request, { params }: Params ) {
    try {
        const { userId } = auth();
        if ( !userId ) {
            return NextResponse.json( 'Unauthorized', { status: 401 } );
        }

        const { label, imageUrl } = await req.json();

        if ( !label ) {
            return NextResponse.json( 'Label is required', { status: 400 } );
        }

        if ( !imageUrl ) {
            return NextResponse.json( 'Image URL is required', { status: 400 } );
        }

        if ( !params.storeId ) {
            return NextResponse.json( 'Store ID is required', { status: 400 } );
        }

        const storeByUserId = await prismadb.store.findFirst( {
            where: {
                id: params.storeId,
                userId,
            }
        } );

        if ( !storeByUserId ) {
            return NextResponse.json( 'Unauthorized', { status: 403 } );
        }

        const billboard = await prismadb.billboard.create( {
            data: {
                label,
                imageUrl,
                storeId: params.storeId,
            }
        } );

        return NextResponse.json( billboard );
    } catch ( error ) {
        console.log( '[BILLBOARDS_POST_ERROR]', error );
        return NextResponse.json( 'Internal Server Error', { status: 500 } );
    }
}

export async function GET( req: Request, { params }: Params ) {
    try {

        if ( !params.storeId ) {
            return NextResponse.json( 'Store ID is required', { status: 400 } );
        }

        const billboards = await prismadb.billboard.findMany( {
            where: {
                storeId: params.storeId,
            }
        } );

        return NextResponse.json( billboards );
    } catch ( error ) {
        console.log( '[BILLBOARDS_GET_ERROR]', error );
        return NextResponse.json( 'Internal Server Error', { status: 500 } );
    }
}
