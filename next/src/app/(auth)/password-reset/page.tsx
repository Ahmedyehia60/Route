"use client";

import { ClipboardEvent, KeyboardEvent, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import { Button, Form, Input } from "antd";
import styles from "../login/page.module.css";
import pageStyles from "./page.module.css";

type RequestCodeValues = { email: string };
type ResetPasswordValues = { newPassword: string; confirmPassword: string };

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [code, setCode] = useState(Array(8).fill(""));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function getResponseMessage(response: Response) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong. Please try again.");
    }
    return data.message as string | undefined;
  }

  async function sendResetCode(targetEmail = email) {
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const responseMessage = await getResponseMessage(response);
      setMessage(responseMessage || "If the account exists, a reset code will be sent.");
      setStep("code");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not send the code.");
    } finally {
      setIsLoading(false);
    }
  }

  function requestCode(values: RequestCodeValues) {
    setEmail(values.email);
    void sendResetCode(values.email);
  }

  function updateCode(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCode((currentCode) => currentCode.map((item, itemIndex) => itemIndex === index ? digit : item));
    if (digit && index < codeInputRefs.current.length - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  }

  function pasteCode(event: ClipboardEvent<HTMLInputElement>) {
    const pastedCode = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    if (!pastedCode) return;
    event.preventDefault();
    setCode(Array.from({ length: 8 }, (_, index) => pastedCode[index] ?? ""));
    codeInputRefs.current[Math.min(pastedCode.length, 8) - 1]?.focus();
  }

  function handleCodeKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) codeInputRefs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 7) codeInputRefs.current[index + 1]?.focus();
  }

  async function resetPassword(values: ResetPasswordValues) {
    setError("");
    setMessage("");

    if (code.join("").length !== 8) {
      setError("Enter all 8 digits from the email.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password-reset/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          resetCode: code.join(""),
          newPassword: values.newPassword,
        }),
      });
      const responseMessage = await getResponseMessage(response);
      setMessage(responseMessage || "Your password has been reset.");
      setStep("done");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not reset your password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.container}>
      <section className={styles.leftSection}>
        <div className={styles.gridOverlay} />
        <div>
          <div className={styles.topBadge}>
            <span className={styles.statusDot} />
            <span className={styles.gridTitle}>TELEMETRY GRID ONLINE</span>
            <span className={styles.gridVersion}>â€¢ Core v4.12</span>
          </div>
          <h1 className={styles.mainHeading}>The Real-Time Neural Core for Enterprise Logistics &amp; Smart Dispatch.</h1>
          <p className={styles.mainDesc}>Autonomous route arbitration, geofence orchestration, and intermodal dynamic routing powering next-generation freight networks.</p>
          <div className={styles.statsBox}>
            <div><div className={styles.statLabel}>CONSORTIUM LIVE NODE FEED</div><div className={styles.statValue}>1,428</div><div className={styles.statSub}>ACTIVE DISPATCHES</div></div>
            <div><div className={styles.statLabel}>&nbsp;</div><div className={styles.statValueLime}>98.4%</div><div className={styles.statSub}>ON-TIME SLA</div></div>
            <div><div className={styles.statLabel} style={{ textAlign: "right" }}>0.42ms Latency</div><div className={styles.statValue}>42</div><div className={styles.statSub}>HUBS SYNCED</div></div>
          </div>
          <div className={styles.quoteBox}>
            <p className={styles.quoteText}>RouteFlow transformed our cross-dock latency by 34% within 90 days. It gives our flight &amp; trailer dispatchers total spatial certainty.</p>
            <div className={styles.authorInfo}><div className={styles.authorAvatar}>MV</div><div><div className={styles.authorName}>Marcus Vance</div><div className={styles.authorTitle}>VP Global Fleet Operations, Apex Intermodal</div></div></div>
          </div>
        </div>
        <div className={styles.footerBadges}><span>ðŸ›¡ï¸ SOC-2 Type II</span><span>ðŸ”’ ISO 27001</span><span>ðŸ›¡ï¸ FedRAMP Ready</span><span>ðŸŒ TLS 1.3 FIPS</span></div>
      </section>

      <section className={styles.rightSection}>
        <div className={styles.loginWrapper}>
          <div className={styles.gatewayBadge}>â€¢ IDENTITY GATEWAY</div>
          {step === "email" && <>
            <h2 className={styles.welcomeTitle}>Reset your password</h2>
            <p className={styles.welcomeDesc}>Enter your account email and weâ€™ll send you a one-time reset code.</p>
            <div className={styles.dividerContainer}><div className={styles.dividerLine} /><span className={styles.dividerText}>PASSWORD RECOVERY</span><div className={styles.dividerLine} /></div>
            <Form<RequestCodeValues> onFinish={requestCode} className={styles.formGroup} requiredMark={false}>
              <div className={styles.inputGroup}><label htmlFor="email">Corporate Work Email</label><div className={styles.inputWrapper}><Mail className={`${styles.inputIcon} ${styles.inputIconStatic}`} /><Form.Item name="email" style={{ marginBottom: 0 }} rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Enter a valid email address" }]}><Input id="email" type="email" autoComplete="email" className={styles.textInput} /></Form.Item></div></div>
              <Button htmlType="submit" className={styles.submitBtn} loading={isLoading} style={{ backgroundColor: "var(--color-green-primary)", color: "var(--color-bg-dark)", border: "none" }}>{isLoading ? "Sending codeâ€¦" : "Send reset code â†’"}</Button>
            </Form>
          </>}

          {step === "code" && <>
            <h2 className={styles.welcomeTitle}>Check your email</h2>
            <p className={styles.welcomeDesc}>Enter the 8-digit code sent to <strong>{email}</strong>, then choose a new password.</p>
            <div className={styles.dividerContainer}><div className={styles.dividerLine} /><span className={styles.dividerText}>VERIFY YOUR CODE</span><div className={styles.dividerLine} /></div>
            <Form<ResetPasswordValues> onFinish={resetPassword} className={styles.formGroup} requiredMark={false}>
              <div className={styles.inputGroup}>
                <label id="reset-code-label">One-time code</label>
                <div className={pageStyles.codeInputs} role="group" aria-labelledby="reset-code-label">
                  {code.map((digit, index) => <Input key={index} ref={(element) => { codeInputRefs.current[index] = element?.input ?? null; }} aria-label={`Code digit ${index + 1}`} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={1} value={digit} onChange={(event) => updateCode(index, event.target.value)} onKeyDown={(event) => handleCodeKeyDown(index, event)} onPaste={pasteCode} className={pageStyles.codeInput} />)}
                </div>
              </div>
              <div className={styles.inputGroup}><label htmlFor="new-password">New password</label><div className={styles.inputWrapper}><LockKeyhole className={`${styles.inputIcon} ${styles.inputIconStatic}`} /><Form.Item name="newPassword" style={{ marginBottom: 0 }} rules={[{ required: true, message: "Please enter a new password" }, { min: 12, message: "Use at least 12 characters" }]}><Input id="new-password" type="password" autoComplete="new-password" className={styles.textInputPassword} /></Form.Item></div><small className={pageStyles.hint}>Use at least 12 characters.</small></div>
              <div className={styles.inputGroup}><label htmlFor="confirm-password">Confirm new password</label><div className={styles.inputWrapper}><LockKeyhole className={`${styles.inputIcon} ${styles.inputIconStatic}`} /><Form.Item name="confirmPassword" dependencies={["newPassword"]} style={{ marginBottom: 0 }} rules={[{ required: true, message: "Please confirm your new password" }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue("newPassword") === value) return Promise.resolve(); return Promise.reject(new Error("The passwords do not match")); } })]}><Input id="confirm-password" type="password" autoComplete="new-password" className={styles.textInputPassword} /></Form.Item></div></div>
              <Button htmlType="submit" className={styles.submitBtn} loading={isLoading} style={{ backgroundColor: "var(--color-green-primary)", color: "var(--color-bg-dark)", border: "none" }}>{isLoading ? "Resetting passwordâ€¦" : "Reset password â†’"}</Button>
            </Form>
            <Button type="link" className={pageStyles.textButton} onClick={() => void sendResetCode()} disabled={isLoading}>Send a new code</Button>
          </>}

          {step === "done" && <>
            <h2 className={styles.welcomeTitle}>Password updated</h2>
            <p className={styles.welcomeDesc}>{message}</p>
            <Link href="/login" className={`${styles.submitBtn} ${pageStyles.loginLink}`}>Back to sign in â†’</Link>
          </>}

          {message && step !== "done" && <p className={pageStyles.message} role="status">{message}</p>}
          {error && <p className={pageStyles.error} role="alert">{error}</p>}
          {step !== "done" && <Link href="/login" className={pageStyles.backLink}><ArrowLeft size={15} /> Back to sign in</Link>}
        </div>
      </section>
    </main>
  );
}
