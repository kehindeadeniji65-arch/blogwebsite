'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleLoginButton({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: "897473764449-qv7dnsoe6rohh2mv9trgbcanfls8d5th.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });
      // @ts-ignore
      window.google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        { theme: 'outline', size: 'large' }
      );
    };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    const endpoint = mode === 'signup' ? '/api/auth/google/signup' : '/api/auth/google/login';
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential }),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    localStorage.setItem('token', data.token);
    router.push('/dashboard');
  };

  return <div id="google-btn"></div>;
}