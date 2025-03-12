"use client"; 
import { useRouter } from 'next/navigation'; 
import Login from './_components/Login';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(()=>{
    localStorage.clear();
  },[])

  const handleLoginSuccess = (token: string) => {
    console.log('Login bem-sucedido com token:', token);
    localStorage.setItem('token', token);
    router.push('/tasks');
  };

  return <Login onSuccess={handleLoginSuccess} />; 
}
