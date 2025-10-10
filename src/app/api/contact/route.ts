import { Resend } from "resend"
import { NextRequest, NextResponse } from "next/server"
import { ContactEmail } from "@/components/emails/contact-email"
import { validateHoneypotServer } from "@/lib/honeypot-server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    console.log("📧 Contact form submission received:", { name, email })

    // Validate honeypot - server-side protection
    const honeypotResult = validateHoneypotServer(body, Date.now())
    if (!honeypotResult.isValid) {
      console.log("🚫 Server honeypot triggered:", honeypotResult.reason)
      // Silent rejection - return success to avoid alerting bots
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Validate required fields
    if (!name || !email || !message) {
      console.error("❌ Missing required fields:", { name: !!name, email: !!email, message: !!message })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error("❌ Invalid email format:", email)
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Check environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY not configured")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    if (!process.env.CONTACT_EMAIL) {
      console.error("❌ CONTACT_EMAIL not configured")
      return NextResponse.json({ error: "Recipient email not configured" }, { status: 500 })
    }

    console.log("📤 Sending email via Resend...")
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Change this to your verified domain
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      react: ContactEmail({ name, email, message }),
    })

    if (error) {
      console.error("❌ Resend error:", error)
      return NextResponse.json({ error: `Failed to send email: ${error.message}` }, { status: 500 })
    }

    console.log("✅ Email sent successfully:", data)
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("❌ Contact form error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Internal server error: ${errorMessage}` }, { status: 500 })
  }
}

