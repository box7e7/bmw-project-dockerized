'use client';
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { SessionChecker } from '../components/userSessionChecker';


import Hero from '../components/Hero';
import Content from '../components/Content';

export default function Index() {

  const { user, error, isLoading } = useUser();
  return (
    <>
      <SessionChecker/>
      <Hero />
      <hr />
      {isLoading ? null : (!user ? <Content /> : null) }
    </>
  );
}
