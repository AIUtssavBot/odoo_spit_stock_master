export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-gray-600">Configure warehouses, locations, and system preferences</p>

      <div className="mt-4 rounded border bg-white p-4">
        <h2 className="text-lg font-semibold">Warehouses & Locations</h2>
        <p className="mt-1 text-sm text-gray-600">UI coming soon. Backend tables already defined (warehouses, locations).</p>
      </div>
    </main>
  );
}