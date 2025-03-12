"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeToggle from '@/components/Toggle/ThemeToggle';
import axios from 'axios';

interface LoginProps {
    onSuccess: (token: string) => void;
}

export default function Login({ onSuccess }: LoginProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ email: string; password: string }>();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: { email: string; password: string }) => {
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/login', {
                email: data.email,
                password: data.password,
            });

            const { token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('authToken', token);
            onSuccess(token);

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    return (
        <div className="h-screen flex flex-col dark:bg-[#1e1e1e] bg-[#f5f5f5]">
            <div className="w-full flex justify-end p-6">
                <ThemeToggle />
            </div>
            <div className=" h-full flex items-center justify-center ">
                <div className=" p-6 rounded-xl shadow-md w-96 dark:bg-[#3f3d3d]">
                    <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="seu@email.com"
                                {...register('email', { required: 'O email é obrigatório' })}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Senha</label>
                            <Input
                                type="password"
                                placeholder="********"
                                {...register('password', { required: 'A senha é obrigatória' })}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}