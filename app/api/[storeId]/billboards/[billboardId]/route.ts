import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

interface Props {
    params: {
        storeId: string;
        billboardId: string;
    }
}

export async function GET( req: Request, { params }: Props ) {
    try {

        const { billboardId } = params;

        if ( !billboardId ) {
            return NextResponse.json( 'Billboard ID is required', { status: 400 } );
        }

        const billboard = await prismadb.billboard.findUnique( {
            where: {
                id: billboardId
            }
        } );

        return NextResponse.json( billboard );

    } catch ( error ) {
        console.log( '[BILLBOARD_GET]', error );
        return NextResponse.json( 'Internal Server Error', { status: 500 } );
    }
}

export async function PATCH( req: Request, { params }: Props ) {
    try {
        const { userId } = auth();

        if ( !userId ) {
            return NextResponse.json( 'Unauthorized', { status: 401 } );
        }

        const { storeId, billboardId } = params;
        const { label, imageUrl } = await req.json();

        if ( !label ) {
            return NextResponse.json( 'Label is required', { status: 400 } );
        }

        if ( !imageUrl ) {
            return NextResponse.json( 'Image URL is required', { status: 400 } );
        }

        if ( !storeId ) {
            return NextResponse.json( 'Store ID is required', { status: 400 } );
        }

        if ( !billboardId ) {
            return NextResponse.json( 'Billboard ID is required', { status: 400 } );
        }

        const storeByUserId = await prismadb.store.findFirst( {
            where: {
                id: storeId,
                userId,
            }
        } );

        if ( !storeByUserId ) {
            return NextResponse.json( 'Unauthorized', { status: 403 } );
        }

        const billboard = await prismadb.billboard.updateMany( {
            where: {
                id: billboardId
            },
            data: {
                label,
                imageUrl,
            }
        } );

        return NextResponse.json( billboard );

    } catch ( error ) {
        console.log( '[BILLBOARD_PATCH]', error );
        return NextResponse.json( 'Internal Server Error', { status: 500 } );
    }
}

export async function DELETE( req: Request, { params }: Props ) {
    try {
        const { userId } = auth();

        if ( !userId ) {
            return NextResponse.json( 'Unauthorized', { status: 401 } );
        }

        const { storeId, billboardId } = params;

        if ( !storeId ) {
            return NextResponse.json( 'Store ID is required', { status: 400 } );
        }

        if ( !billboardId ) {
            return NextResponse.json( 'Billboard ID is required', { status: 400 } );
        }

        const storeByUserId = await prismadb.store.findFirst( {
            where: {
                id: storeId,
                userId,
            }
        } );

        if ( !storeByUserId ) {
            return NextResponse.json( 'Unauthorized', { status: 403 } );
        }

        const billboard = await prismadb.billboard.deleteMany( {
            where: {
                id: billboardId
            }
        } );

        return NextResponse.json( billboard );

    } catch ( error ) {
        console.log( '[BILLBOARD_DELETE]', error );
        return NextResponse.json( 'Internal Server Error', { status: 500 } );
    }
}
