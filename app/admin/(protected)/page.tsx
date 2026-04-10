export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">
        Admin functionality is disabled in the static version of this site.
        To use the admin panel, deploy to a platform that supports server-side rendering
        like Vercel or Netlify.
      </p>
    </div>
  );
}