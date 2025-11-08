import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Camera } from "lucide-react";

interface PostFoodFormProps {
  onSubmit?: (data: any) => void;
}

export default function PostFoodForm({ onSubmit }: PostFoodFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    category: "",
    location: "",
    pickupDate: "",
    pickupTimeStart: "",
    pickupTimeEnd: "",
  });

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        console.log("Image uploaded for AI analysis");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onSubmit?.(formData);
  };

  return (
    <Card data-testid="card-post-food-form">
      <CardHeader>
        <CardTitle className="text-2xl">Post Surplus Food</CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your surplus food with the community
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image">Food Photo (AI Analysis)</Label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="image-upload"
                className="flex-1 flex items-center justify-center gap-2 p-8 border-2 border-dashed rounded-md cursor-pointer hover-elevate"
              >
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded food"
                    className="max-h-48 rounded-md"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload photo for AI quality check
                    </p>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  data-testid="input-image-upload"
                />
              </label>
              <Button type="button" variant="outline" size="icon">
                <Camera className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Food Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Fresh Vegetables Mix"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category" data-testid="select-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produce">Produce</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="prepared">Prepared Food</SelectItem>
                  <SelectItem value="packaged">Packaged Goods</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the food items, dietary info, allergens..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              data-testid="input-description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              placeholder="e.g., 5 lbs, 10 servings"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              data-testid="input-quantity"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Pickup Location *</Label>
            <Input
              id="location"
              placeholder="Address or landmark"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              data-testid="input-location"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup-date">Pickup Date *</Label>
              <Input
                id="pickup-date"
                type="date"
                value={formData.pickupDate}
                onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                data-testid="input-pickup-date"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-start">Start Time *</Label>
              <Input
                id="time-start"
                type="time"
                value={formData.pickupTimeStart}
                onChange={(e) => setFormData({ ...formData, pickupTimeStart: e.target.value })}
                data-testid="input-time-start"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-end">End Time *</Label>
              <Input
                id="time-end"
                type="time"
                value={formData.pickupTimeEnd}
                onChange={(e) => setFormData({ ...formData, pickupTimeEnd: e.target.value })}
                data-testid="input-time-end"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" data-testid="button-submit-post">
            <span className="material-icons text-sm mr-2">publish</span>
            Post Food Listing
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
