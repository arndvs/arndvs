import { Resend } from "resend";

import { NextRequest, NextResponse } from "next/server";

import { ContactEmail } from "@/components/emails/contact-email";
import { validateHoneypotServer } from "@/lib/honeypot-server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
    try {
        const ip = getClientIp(request.headers);

        try {
            const { allowed, retryAfterSeconds } = checkRateLimit(ip);

            if (!allowed)
                return NextResponse.json(
                    { error: "Too many requests. Please try again later." },
                    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
                );
        } catch (error) {
            console.error("Rate limit check failed, allowing request:", error);
        }

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        if (!body || typeof body !== "object" || Array.isArray(body))
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

        const bodyRecord = body as Record<string, unknown>;
        const { name, email, message } = bodyRecord;

        const honeypotResult = validateHoneypotServer(
            {
                website: typeof bodyRecord.website === "string" ? bodyRecord.website : "",
                _honeypot: typeof bodyRecord._honeypot === "string" ? bodyRecord._honeypot : "",
                _honeypot_timestamp:
                    typeof bodyRecord._honeypot_timestamp === "string"
                        ? bodyRecord._honeypot_timestamp
                        : "",
            },
            Date.now(),
        );

        if (!honeypotResult.isValid) return NextResponse.json({ success: true }, { status: 200 });

        if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string")
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

        const normalizedName = name.trim();
        const normalizedEmail = email.trim();
        const normalizedMessage = message.trim();

        if (!normalizedName || !normalizedEmail || !normalizedMessage)
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

        if (normalizedName.length > 200)
            return NextResponse.json({ error: "Name too long" }, { status: 400 });

        if (normalizedEmail.length > 254)
            return NextResponse.json({ error: "Email too long" }, { status: 400 });

        if (normalizedMessage.length > 5000)
            return NextResponse.json({ error: "Message too long" }, { status: 400 });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail))
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });

        if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

        if (!process.env.CONTACT_EMAIL) throw new Error("CONTACT_EMAIL not configured");

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { error } = await resend.emails.send({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: process.env.CONTACT_EMAIL,
            replyTo: normalizedEmail,
            subject: `New contact form submission from ${normalizedName}`,
            react: ContactEmail({
                name: normalizedName,
                email: normalizedEmail,
                message: normalizedMessage,
            }),
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
