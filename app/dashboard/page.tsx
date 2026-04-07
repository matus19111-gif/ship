import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <ButtonAccount />
        <h1 className="text-3xl md:text-4xl font-extrabold">Private Page</h1>
      </section>
    </main>
  );
}

// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        ✅ Dashboard Works!
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>
        If you can see this, your dashboard route is working.
      </p>
      <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#999' }}>
        Location: /app/dashboard/page.tsx
      </p>
    </div>
  );
}
