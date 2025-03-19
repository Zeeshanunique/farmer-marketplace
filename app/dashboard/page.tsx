"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FarmerDashboard } from "@/components/dashboard/FarmerDashboard";
import { BuyerDashboard } from "@/components/dashboard/BuyerDashboard";

export default function DashboardPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  if (loading || !isClient) {
    return (
      <div className="container py-10">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user || !userData) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container py-10">
      {userData.userType === "farmer" ? (
        <FarmerDashboard />
      ) : (
        <BuyerDashboard />
      )}
    </div>
  );
} 