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
