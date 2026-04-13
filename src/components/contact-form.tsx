"use client";

import { Mail } from "lucide-react";
import { toast } from "sonner";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SpamProtectionFields, useHoneypot } from "@/lib/honeypot";
import { cn } from "@/lib/utils";

interface ContactFormProps {
    triggerText?: string;
    triggerVariant?: "default" | "outline" | "ghost" | "link";
    triggerSize?: "default" | "sm" | "lg" | "icon";
    showIcon?: boolean;
    triggerIcon?: React.ReactNode;
    triggerClassName?: string;
}
export function ContactForm({
    triggerText = "Get in touch",
    triggerVariant = "default",
    triggerSize = "lg",
    showIcon = true,
    triggerIcon,
    triggerClassName = "",
}: ContactFormProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const { validateHoneypot, getHoneypotFormData } = useHoneypot({
        minSubmitTime: 3000,
        enableTimeValidation: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const honeypotFields: Record<string, string> = {};
        if (formRef.current) {
            const fd = new FormData(formRef.current);
            for (const [key, value] of fd.entries()) {
                if (key === "website" || key === "_honeypot") {
                    honeypotFields[key] = value as string;
                }
            }
        }

        const honeypotResult = validateHoneypot({ ...formData, ...honeypotFields });
        if (!honeypotResult.isValid) {
            // Silent rejection - fake success to avoid alerting bots
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                setOpen(false);
                setFormData({ name: "", email: "", message: "" });
                toast.success("Message sent!", {
                    description: "Thank you for your message! I'll get back to you soon.",
                });
            }, 1000);
            return;
        }

        setIsSubmitting(true);

        try {
            // Add honeypot data to submission
            const submissionData = {
                ...formData,
                ...getHoneypotFormData(),
            };

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error("API Error:", responseData);
                throw new Error(responseData.error || "Failed to send message");
            }

            setOpen(false);
            setFormData({ name: "", email: "", message: "" });
            toast.success("Message sent!", {
                description: "Thank you for your message! I'll get back to you soon.",
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Sorry, there was an error. Please try again.";
            toast.error("Failed to send message", {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={triggerVariant}
                    size={triggerSize}
                    className={cn(triggerClassName, "hover:cursor-pointer")}
                >
                    {showIcon && !triggerIcon && <Mail className="mr-2 h-4 w-4" />}
                    {triggerIcon}
                    {triggerText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Get in touch</DialogTitle>
                    <DialogDescription>
                        Send me a message and I&apos;ll get back to you as soon as possible.
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Tell me about your project or inquiry..."
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send message"}
                        </Button>
                    </div>

                    {/* Honeypot spam protection fields */}
                    <SpamProtectionFields />
                </form>
            </DialogContent>
        </Dialog>
    );
}
