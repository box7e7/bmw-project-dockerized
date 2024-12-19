'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

export function SessionChecker({ interval = 60000 }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
;

  useEffect(() => {
    const checkSession = async () => {
      console.log("%%%%%%%%%%%%% checking session executed %%%%%%%%%%%%%%%")
      try {
        const response = await fetch('/api/getSession');
        const responseJson=await response.json()
        console.log("%%%%%%%%%%%%% response %%%%%%%%%%%%%%%",responseJson)
        // if (!response.ok) {
        if (responseJson.error) {  
          router.push('/api/auth/logout');
          throw new Error('Session expired');
        }
  
      } catch (error) {
        console.error('Session check failed:', error);
        router.push('/api/auth/logout');
      }
    };

    if (!isLoading && user) {
      const intervalId = setInterval(checkSession, interval);
      checkSession(); // Immediate check on mount
      // return () => clearInterval(intervalId);
    }
  }, [user, isLoading, router, interval]);

  return null; // This component doesn't render anything
}