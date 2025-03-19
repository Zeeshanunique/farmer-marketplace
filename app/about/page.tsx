import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold text-center">About FarmConnect</h1>
      
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              FarmConnect aims to transform agricultural commerce by building a robust platform that connects
              farmers directly with buyers through assured contract farming. We're dedicated to creating
              stable market access for farmers while ensuring quality produce for buyers.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">For Farmers</h3>
                <p>
                  List your crops, negotiate fair prices, and secure guaranteed contracts before harvest.
                  Reduce market uncertainty and focus on what you do best - growing quality produce.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">For Buyers</h3>
                <p>
                  Discover reliable farmers, establish direct relationships, and secure consistent supply
                  of quality agricultural products. Streamline your procurement process and support
                  sustainable farming practices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Benefits of Contract Farming</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Guaranteed market access for farmers</li>
              <li>Price stability and income security</li>
              <li>Reduced market risks and uncertainties</li>
              <li>Direct farmer-buyer relationships</li>
              <li>Transparent and secure transactions</li>
              <li>Quality assurance for buyers</li>
              <li>Consistent supply chain management</li>
              <li>Support for sustainable agricultural practices</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <p className="font-medium">Email: contact@farmconnect.com</p>
            <p className="font-medium">Phone: +91 1234567890</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 