// *********************
// Role of the component: Projects Layout wrapper
// Purpose: Provides authentication check and consistent layout for all project pages
// Features: 
// - Checks for valid user session
// - Redirects to login if not authenticated
// - Provides consistent padding and maximum width for content
// *********************

import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for authenticated session
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    // Main container with consistent background and minimum height
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <main>
          {/* Content wrapper with maximum width and responsive padding */}
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
} 