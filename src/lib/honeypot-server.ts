interface HoneypotResult {
  isValid: boolean
  reason?: string
}export function validateHoneypotServer(
  formData: Record<string, string>,
  serverTime: number = Date.now()
): HoneypotResult {
  // Check honeypot fields
  if (formData.website || formData._honeypot || formData._honeypot_field) {
    return {
      isValid: false,
      reason: "Honeypot field filled",
    }
  }

  // Check timestamp (if provided)
  const clientTimestamp = parseInt(formData._honeypot_timestamp || "0")
  if (clientTimestamp > 0) {
    const timeTaken = serverTime - clientTimestamp
    
    // Form submitted too quickly (less than 3 seconds)
    if (timeTaken < 3000) {
      return {
        isValid: false,
        reason: `Form submitted too quickly: ${timeTaken}ms`,
      }
    }

    // Form took suspiciously long (more than 1 hour)
    if (timeTaken > 3600000) {
      return {
        isValid: false,
        reason: "Form session expired",
      }
    }
  }

  return { isValid: true }
}

