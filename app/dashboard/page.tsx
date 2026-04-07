import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <ButtonAccount />
        
        {/* Replace the "Private Page" heading with your content */}
        <h1 className="text-3xl md:text-4xl font-extrabold">
          ✅ Dashboard Works!
        </h1>
        
        <p className="text-gray-600">
          If you can see this, your dashboard route is working.
        </p>
        
        {/* Your actual dashboard content goes here */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold">Your Data</h2>
          <p>Start building your dashboard here...</p>
        </div>
      </section>
    </main>
  );
}
