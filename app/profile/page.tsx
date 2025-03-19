"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const { user, userData, loading, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!loading && !user) {
      router.push("/sign-in");
    }
    
    if (userData) {
      setFullName(userData.fullName || "");
      setLocation(userData.location || "");
      setPhone(userData.phone || "");
    }
  }, [user, userData, loading, router]);

  const handleSaveProfile = async () => {
    if (!user || !userData) return;
    
    setIsSaving(true);
    
    try {
      await updateDoc(doc(db, "users", user.uid), {
        fullName,
        location,
        phone,
        updatedAt: new Date().toISOString(),
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className="container max-w-2xl py-10">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Email (Cannot be changed)</div>
            <div className="p-2 border rounded-md bg-muted/50">{userData.email}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Account Type</div>
            <div className="p-2 border rounded-md bg-muted/50 capitalize">{userData.userType}</div>
          </div>
          
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your contact number"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Full Name</div>
                <div className="p-2 border rounded-md">{userData.fullName || "Not provided"}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="p-2 border rounded-md">{userData.location || "Not provided"}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Phone Number</div>
                <div className="p-2 border rounded-md">{userData.phone || "Not provided"}</div>
              </div>
            </>
          )}
          
          <div className="pt-4">
            <div className="text-sm text-muted-foreground">Member Since</div>
            <div className="pt-1">
              {new Date(userData.createdAt).toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 