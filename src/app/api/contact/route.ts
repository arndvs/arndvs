import { Resend } from "resend"
import { NextRequest, NextResponse } from "next/server"
import { ContactEmail } from "@/components/emails/contact-email"
import { validateHoneypotServer } from "@/lib/honeypot-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    const honeypotResult = validateHoneypotServer(body, Date.now())

    if (!honeypotResult.isValid)
      return NextResponse.json({ success: true }, { status: 200 })

    if (!name || !email || !message)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

    if (typeof name !== 'string' || name.length > 200)
      return NextResponse.json({ error: "Name too long" }, { status: 400 })

    if (typeof email !== 'string' || email.length > 254)
      return NextResponse.json({ error: "Email too long" }, { status: 400 })

    if (typeof message !== 'string' || message.length > 5000)
      return NextResponse.json({ error: "Message too long" }, { status: 400 })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email))
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })

    if (!process.env.RESEND_API_KEY)
      throw new Error("RESEND_API_KEY not configured")

    if (!process.env.CONTACT_EMAIL)
      throw new Error("CONTACT_EMAIL not configured")

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      react: ContactEmail({ name, email, message }),
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

