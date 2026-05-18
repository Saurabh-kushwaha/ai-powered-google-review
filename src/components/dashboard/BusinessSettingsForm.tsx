"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface BusinessSettingsFormProps {
  business: {
    id: string;
    name: string;
    category: string;
    googleReviewUrl: string;
    shortLinkId: string;
  };
}

export default function BusinessSettingsForm({ business }: BusinessSettingsFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: business.name,
    category: business.category,
    googleReviewUrl: business.googleReviewUrl,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string | null) => {
    if (value) {
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/business", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update business");
      }

      toast.success("Success", {
        description: "Your business settings have been updated.",
      });

      router.refresh();
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Business Name
          </label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Central Perk Cafe"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-zinc-50 dark:bg-zinc-900/50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Category
          </label>
          <Select
            value={formData.category}
            onValueChange={handleCategoryChange}
            required
          >
            <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900/50">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RESTAURANT">Restaurant / Cafe</SelectItem>
              <SelectItem value="RETAIL">Retail Store</SelectItem>
              <SelectItem value="SERVICE">Professional Service</SelectItem>
              <SelectItem value="HEALTHCARE">Healthcare / Clinic</SelectItem>
              <SelectItem value="BEAUTY">Beauty / Salon</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="googleReviewUrl" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Google Review URL
          </label>
          <Input
            id="googleReviewUrl"
            name="googleReviewUrl"
            placeholder="https://g.page/r/..."
            value={formData.googleReviewUrl}
            onChange={handleChange}
            required
            className="bg-zinc-50 dark:bg-zinc-900/50"
          />
          <p className="text-sm text-zinc-500">
            This is the link where customers will be redirected to leave a 5-star review.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
