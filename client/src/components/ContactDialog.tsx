import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactDialog() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  // Fetch contact email from settings
  const { data: contactEmailData } = useQuery<{ key: string; value: string | undefined }>({
    queryKey: ['/api/settings/contact_email'],
  });

  const contactEmail = contactEmailData?.value || 'nethania@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link with pre-filled content
    const subject = encodeURIComponent(`Contact from ${name} via CalculateThis.org`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const mailtoLink = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening email client",
      description: "Your email client will open with the pre-filled message.",
    });
    
    // Reset form
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          className="hover:text-white transition-colors text-left"
          data-testid="button-contact"
        >
          Contact Us
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-contact">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Send us a message and we'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              data-testid="input-contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              data-testid="input-contact-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              data-testid="input-contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              rows={5}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            data-testid="button-send-contact"
          >
            Send Message
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
