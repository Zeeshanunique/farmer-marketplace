"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Listing = {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  cropCategory: string;
  availableQuantity: number;
  minPrice: number;
  description: string;
  location: string;
  harvestDate: string;
  createdAt: string;
};

export default function MarketplacePage() {
  const { user, userData } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const categories = ["Vegetables", "Fruits", "Grains", "Dairy", "Poultry"];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "listings"));
        const listingsData: Listing[] = [];
        
        querySnapshot.forEach((doc) => {
          listingsData.push({ id: doc.id, ...doc.data() } as Listing);
        });
        
        setListings(listingsData);
        setFilteredListings(listingsData);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    let result = listings;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (listing) =>
          listing.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (listing) => listing.cropCategory === selectedCategory
      );
    }

    setFilteredListings(result);
  }, [searchTerm, selectedCategory, listings]);

  const handleProposeContract = (listing: Listing) => {
    setSelectedListing(listing);
    setPrice(listing.minPrice);
    setQuantity(Math.min(10, listing.availableQuantity));
    setOpenDialog(true);
  };

  const handleSubmitProposal = () => {
    // In a real application, this would create a contract in Firestore
    console.log("Creating contract proposal:", {
      listingId: selectedListing?.id,
      farmerId: selectedListing?.farmerId,
      farmerName: selectedListing?.farmerName,
      buyerId: user?.uid,
      buyerName: userData?.fullName,
      cropName: selectedListing?.cropName,
      quantity,
      price,
      status: "pending",
      createdAt: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    });
    
    setOpenDialog(false);
    alert("Contract proposal submitted successfully!");
  };

  if (loading) {
    return (
      <div className="container py-10">
        <div className="text-center">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Marketplace</h1>
      
      {/* Search and Filter */}
      <div className="flex flex-col gap-4 mb-8 md:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Search crops, farmers, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Listings */}
      {filteredListings.length === 0 ? (
        <div className="p-10 text-center text-muted-foreground">
          No listings found. Try adjusting your search or filters.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <Card key={listing.id}>
              <CardHeader>
                <CardTitle>{listing.cropName}</CardTitle>
                <CardDescription>
                  by {listing.farmerName} • {listing.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{listing.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Available</p>
                      <p>{listing.availableQuantity} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Min. Price</p>
                      <p>₹{listing.minPrice} per kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p>{listing.cropCategory}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Harvest Date</p>
                      <p>{new Date(listing.harvestDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {userData?.userType === "buyer" ? (
                  <Button
                    className="w-full"
                    onClick={() => handleProposeContract(listing)}
                  >
                    Propose Contract
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    You are a Farmer
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Contract Proposal Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Propose Contract</DialogTitle>
            <DialogDescription>
              Create a contract proposal for {selectedListing?.cropName} from {selectedListing?.farmerName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity (kg)
              </Label>
              <Input
                id="quantity"
                type="number"
                className="col-span-3"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                max={selectedListing?.availableQuantity}
                min={1}
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="price" className="text-right">
                Price per kg (₹)
              </Label>
              <Input
                id="price"
                type="number"
                className="col-span-3"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={selectedListing?.minPrice}
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label className="text-right">Total Value</Label>
              <div className="col-span-3">₹{(price * quantity).toFixed(2)}</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitProposal}>Submit Proposal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 