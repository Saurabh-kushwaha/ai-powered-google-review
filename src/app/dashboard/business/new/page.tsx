"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function NewBusinessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    googleReviewUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryChange = (val: string | null) => {
    if (val) {
      setFormData((prev) => ({ ...prev, category: val }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Business added successfully!");
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add business");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add your business</CardTitle>
          <CardDescription>
            Enter your business details to start collecting AI-powered reviews.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="E.g., Central Perk Cafe"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={handleCategoryChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="RESTAURANT">🍽️ Restaurant / Cafe</SelectItem>
                  <SelectItem value="CAFE">☕ Cafe / Coffee Shop</SelectItem>
                  <SelectItem value="BAKERY">🥐 Bakery</SelectItem>
                  <SelectItem value="BAR">🍸 Bar / Pub</SelectItem>
                  <SelectItem value="HOTEL">🏨 Hotel / Accommodation</SelectItem>
                  <SelectItem value="RETAIL">🛍️ Retail Store</SelectItem>
                  <SelectItem value="GROCERY">🛒 Grocery / Supermarket</SelectItem>
                  <SelectItem value="BEAUTY">💅 Beauty / Salon / Spa</SelectItem>
                  <SelectItem value="GYM">🏋️ Gym / Fitness</SelectItem>
                  <SelectItem value="HEALTHCARE">🏥 Healthcare / Clinic</SelectItem>
                  <SelectItem value="PHARMACY">💊 Pharmacy</SelectItem>
                  <SelectItem value="DENTIST">🦷 Dentist</SelectItem>
                  <SelectItem value="SERVICE">🤝 Professional Service</SelectItem>
                  <SelectItem value="AUTOMOTIVE">🚗 Automotive / Garage</SelectItem>
                  <SelectItem value="PET">🐾 Pet Store / Vet</SelectItem>
                  <SelectItem value="TECH">💻 Tech / Electronics</SelectItem>
                  <SelectItem value="TRAVEL">✈️ Travel / Agency</SelectItem>
                  <SelectItem value="SCHOOL">🏫 Education / School</SelectItem>
                  <SelectItem value="BANK">🏦 Bank / Finance</SelectItem>
                  <SelectItem value="OTHER">🏪 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleReviewUrl">Google Review URL</Label>
              <Input
                id="googleReviewUrl"
                name="googleReviewUrl"
                placeholder="https://g.page/r/..."
                required
                value={formData.googleReviewUrl}
                onChange={handleChange}
              />
              <p className="text-xs text-zinc-500">
                This is the link where customers will be redirected to paste their AI-generated review.
              </p>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Business"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
