'use client';

import { Store } from '.prisma/client';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import { ApiAlert } from '@/components/ui/api-alert';

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object( {
    name: z.string().min( 1 )
} );

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm = ( { initialData }: SettingsFormProps ) => {
    const router = useRouter();
    const [ open, setOpen ] = useState( false );
    const [ isLoading, setIsLoading ] = useState( false );

    const form = useForm<SettingsFormValues>( {
        resolver: zodResolver( formSchema ),
        defaultValues: initialData
    } );

    const onSubmit = async ( values: SettingsFormValues ) => {
        try {
            setIsLoading( true );

            await axios.patch( `/api/stores/${ initialData.id }`, values );
            router.refresh();
            toast.success( 'Store updated.' );
        } catch ( error ) {
            toast.error( 'Something went wrong.' );
        } finally {
            setIsLoading( false );
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading( true );

            await axios.delete( `/api/stores/${ initialData.id }` );
            router.refresh();
            router.push( '/' );
            toast.success( 'Store deleted.' );
        } catch ( error ) {
            toast.error( 'Make sure you removed all products and categories first.' );
        } finally {
            setIsLoading( false );
            setOpen( false );
        }
    };

    return (
        <>
            <AlertModal isOpen={ open }
                        onClose={ () => setOpen( false ) }
                        onConfirm={ onDelete }
                        isLoading={ isLoading }/>

            <div className="flex items-center justify-between">
                <Heading title="Settings"
                         description="Manage store preferences"/>

                <Button disabled={ isLoading } variant="destructive" size="icon" onClick={ () => setOpen( true ) }>
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>

            <Separator/>

            <Form { ...form }>
                <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={ form.control } name="name" render={ ( { field } ) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={ isLoading } placeholder="Store name" { ...field }/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        ) }/>
                    </div>

                    <Button type="submit" disabled={ isLoading } className="ml-auto">
                        Save changes
                    </Button>
                </form>
            </Form>

            <Separator/>

            <ApiAlert title="NEXT_PUBLIC_API_URL"
                      description={ `${ origin }/api/${ initialData.id }` }
                      variant="public"/>
        </>
    );
};