"use client";

import { useEffect, useRef } from "react";

interface HoneypotConfig {
    minSubmitTime?: number; // Minimum time in ms before form can be submitted
    enableTimeValidation?: boolean;
}

interface HoneypotResult {
    isValid: boolean;
    reason?: string;
}
export function useHoneypot(config: HoneypotConfig = {}) {
    const { minSubmitTime = 3000, enableTimeValidation = true } = config;
    const formStartTime = useRef<number>(0);

    useEffect(() => {
        formStartTime.current = Date.now();
    }, []);
    const validateHoneypot = (formData: Record<string, string>): HoneypotResult => {
        // Check if honeypot field was filled (bot behavior)
        if (formData.website || formData._honeypot) {
            return {
                isValid: false,
                reason: "Honeypot field filled",
            };
        }

        // Check if form was submitted too quickly (bot behavior)
        if (enableTimeValidation) {
            const timeTaken = Date.now() - formStartTime.current;
            if (timeTaken < minSubmitTime) {
                return {
                    isValid: false,
                    reason: `Form submitted too quickly: ${timeTaken}ms`,
                };
            }
        }

        return { isValid: true };
    };
    const getHoneypotFormData = () => ({
        _honeypot_timestamp: formStartTime.current.toString(),
    });

    return {
        validateHoneypot,
        getHoneypotFormData,
    };
}
export function SpamProtectionFields() {
    return (
        <>
            {/* Looks like a legitimate optional field but hidden with CSS */}
            <div
                style={{
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: 0,
                    width: 0,
                    zIndex: -1,
                }}
                aria-hidden="true"
            >
                <label htmlFor="company_website">Company Website (optional)</label>
                <input
                    type="text"
                    id="company_website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>
            <div
                style={{
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: 0,
                    width: 0,
                    zIndex: -1,
                }}
                aria-hidden="true"
            >
                <label htmlFor="confirm_email">Confirm Email (optional)</label>
                <input
                    type="text"
                    id="confirm_email"
                    name="_honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>
        </>
    );
}
