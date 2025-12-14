"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/Navbarr";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-32">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-zinc-800">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex justify-between items-center py-2">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
    );
  }

  if (!isAuthenticated) {
    
    return null;
  }

  return <>{children}</>;
}
