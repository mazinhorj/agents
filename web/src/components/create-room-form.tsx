import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { useCreateRoom } from '../http/use-create-room';
import { Button } from './ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const createRoomSchema = z.object({
    name: z.string().min(3, {
        message: 'O nome da sala é obrigatório e deve ter pelo menos 3 caracteres.',
    }),
    description: z.string(),
});

type CreateRoomFormData = z.infer<typeof createRoomSchema>;

export function CreateRoomForm() {
    const { mutateAsync: createRoom } = useCreateRoom();

    const createRoomForm = useForm<CreateRoomFormData>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    async function handleCreateRoom({name, description}: CreateRoomFormData) {
        // biome-ignore lint/suspicious/noConsole: vá se foder
        console.log('Criar sala com os dados:', name, description);
        await createRoom({ name, description });
        createRoomForm.reset();
    }

    return (
        <Card className="col-span-2 p-2">
            <CardHeader>
                <CardTitle className="font-semibold text-lg">Criar sala</CardTitle>
                <CardDescription>
                    Crie uma nova sala para começar a interagir com a I.A.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...createRoomForm}>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={createRoomForm.handleSubmit(handleCreateRoom)}
                    >
                        <FormField
                            control={createRoomForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome da sala</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Digite um nome para a sala."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={createRoomForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit">
                            Criar sala
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
