import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { useCreateInquiry } from "@/features/inquiryApi";

interface ContactFormProps {
  preselectedDestination?: string;
  compact?: boolean;
}

const destinations = [
  { value: "dubai", label: "Dubai" },
  { value: "turkey", label: "Turkey" },
  { value: "greece", label: "Greece" },
  { value: "thailand", label: "Thailand" },
  { value: "indonesia", label: "Indonesia" },
];

export function ContactForm({ preselectedDestination, compact }: ContactFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: preselectedDestination || "",
    message: "",
  });

  const { mutate: createInquiry, isLoading } = useCreateInquiry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createInquiry(
      { 
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        destination: formData.destination,
        message: formData.message,
      },
      {
        onSuccess: () => {
          toast({
            title: "Inquiry Sent!",
            description: "We'll get back to you within 24 hours.",
          });
          setFormData({
            name: "",
            email: "",
            phone: "",
            destination: preselectedDestination || "",
            message: "",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.response?.data?.message || "Something went wrong",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>
      <div className={compact ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(774) 487-6389"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">Interested Destination</Label>
          <Select
            value={formData.destination}
            onValueChange={(value) => setFormData({ ...formData, destination: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((dest) => (
                <SelectItem key={dest.value} value={dest.value}>
                  {dest.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Your Message</Label>
        <Textarea
          id="message"
          placeholder="Tell us about your dream vacation..."
          rows={compact ? 3 : 5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-accent hover:bg-accent/90"
        disabled={isLoading}
      >
        {isLoading ? (
          "Sending..."
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Inquiry
          </>
        )}
      </Button>
    </form>
  );
}
