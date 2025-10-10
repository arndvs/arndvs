import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface ContactEmailProps {
  name: string
  email: string
  message: string
}

/**
 * Email template for contact form submissions
 * Uses React Email components for consistent rendering across email clients
 */
export function ContactEmail({ name, email, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>
          
          <Section style={infoBox}>
            <Text style={paragraph}>
              <strong>From:</strong> {name}
            </Text>
            <Text style={paragraph}>
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Text>
          </Section>

          <Section style={messageBox}>
            <Text style={paragraph}>
              <strong>Message:</strong>
            </Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Text style={footer}>
            This message was sent from your portfolio contact form.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0 20px",
  padding: "0 40px",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 10px",
}

const infoBox = {
  backgroundColor: "#f5f5f5",
  padding: "20px",
  borderRadius: "8px",
  margin: "0 40px 20px",
}

const messageBox = {
  backgroundColor: "#fff",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  margin: "0 40px 20px",
}

const messageText = {
  fontSize: "16px",
  lineHeight: "26px",
  whiteSpace: "pre-wrap" as const,
  margin: "0",
}

const link = {
  color: "#0066cc",
  textDecoration: "none",
}

const footer = {
  color: "#666",
  fontSize: "14px",
  margin: "20px 40px 0",
}

