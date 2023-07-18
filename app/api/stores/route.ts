import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

export async function POST( req: Request ) {
    try {
        const { userId } = auth();
        if ( !userId ) {
            return NextResponse.json( 'Unauthorized', { status: 401 } );
        }

        const { name } = await req.json();

        if ( !name ) {
            return NextResponse.json( 'Name is required', { status: 400 } );
        }

        const store = await prismadb.store.create( {
            data: {
                name,
                userId
            }
        } );

        return NextResponse.json( store );
    } catch ( error ) {
        console.log( '[STORES_POST_ERROR]', error );
        return NextResponse.json( 'Internal Server Error', { status: 500 } );
    }
}
