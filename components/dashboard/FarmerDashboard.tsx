"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

type Contract = {
  id: string;
  cropName: string;
  quantity: number;
  price: number;
  buyerId: string;
  buyerName: string;
  status: "pending" | "active" | "completed" | "cancelled";
  createdAt: string;
  deliveryDate: string;
};

export function FarmerDashboard() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "contracts"),
          where("farmerId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const contractsData: Contract[] = [];
        
        querySnapshot.forEach((doc) => {
          contractsData.push({ id: doc.id, ...doc.data() } as Contract);
        });
        
        setContracts(contractsData);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [user]);

  const getContractsByStatus = (status: Contract["status"]) => {
    return contracts.filter((contract) => contract.status === status);
  };

  if (loading) {
    return <div className="text-center py-10">Loading your dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
        <Link href="/create-listing">
          <Button>Create New Listing</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {getContractsByStatus("active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {getContractsByStatus("pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Completed Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {getContractsByStatus("completed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        {["active", "pending", "completed", "cancelled"].map((status) => (
          <TabsContent key={status} value={status}>
            <div className="grid gap-4">
              {getContractsByStatus(status as Contract["status"]).length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">
                  No {status} contracts found.
                </p>
              ) : (
                getContractsByStatus(status as Contract["status"]).map((contract) => (
                  <Card key={contract.id}>
                    <CardHeader>
                      <CardTitle>{contract.cropName}</CardTitle>
                      <CardDescription>
                        Contract with {contract.buyerName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p>{contract.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p>₹{contract.price} per kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Value</p>
                          <p>₹{contract.price * contract.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery Date</p>
                          <p>{new Date(contract.deliveryDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Details</Button>
                      {status === "pending" && (
                        <div className="space-x-2">
                          <Button variant="outline" className="text-red-500">Decline</Button>
                          <Button>Accept</Button>
                        </div>
                      )}
                      {status === "active" && (
                        <Button>Mark as Delivered</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 