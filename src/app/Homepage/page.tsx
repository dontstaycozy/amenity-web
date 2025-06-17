'use client';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null; // Or show a loading spinner
  }

  if (!session) {
    return <p>Access denied</p>;
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}!</h1>
    </div>
  );
}
