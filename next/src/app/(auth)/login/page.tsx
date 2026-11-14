"use client";
import { useState,Suspense } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { LockKeyhole, Mail } from "lucide-react";
import { Button, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";

type LoginValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  async function handleSubmit(values: LoginValues) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        messageApi.error(data.message || "Login failed");
        return;
      }
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/user`,
        { credentials: "include" },
      );

      if (!userResponse.ok) {
        messageApi.error("Login worked, but the session could not be verified");
        return;
      }

      messageApi.success("Logged in successfully");
      router.replace("/dashboard");
    } catch {
      messageApi.error("Could not connect to the server");
    }
  }

  return (
    <div className={styles.container}>
      {/* Left Side */}
      {contextHolder}
      <div className={styles.leftSection}>
        <div className={styles.gridOverlay} />

        <div>
          <div className={styles.topBadge}>
            <span className={styles.statusDot}></span>
            <span className={styles.gridTitle}>TELEMETRY GRID ONLINE</span>
            <span className={styles.gridVersion}>• Core v4.12</span>
          </div>

          <h1 className={styles.mainHeading}>
            The Real-Time Neural Core for Enterprise Logistics & Smart Dispatch.
          </h1>

          <p className={styles.mainDesc}>
            Autonomous route arbitration, geofence orchestration, and intermodal
            dynamic routing powering next-generation freight networks.
          </p>

          <div className={styles.statsBox}>
            <div>
              <div className={styles.statLabel}>CONSORTIUM LIVE NODE FEED</div>
              <div className={styles.statValue}>1,428</div>
              <div className={styles.statSub}>ACTIVE DISPATCHES</div>
            </div>
            <div>
              <div className={styles.statLabel}>&nbsp;</div>
              <div className={styles.statValueLime}>98.4%</div>
              <div className={styles.statSub}>ON-TIME SLA</div>
            </div>
            <div>
              <div className={styles.statLabel} style={{ textAlign: "right" }}>
                0.42ms Latency
              </div>
              <div className={styles.statValue}>42</div>
              <div className={styles.statSub}>HUBS SYNCED</div>
            </div>
          </div>

          <div className={styles.quoteBox}>
            <p className={styles.quoteText}>
              RouteFlow transformed our cross-dock latency by 34% within 90
              days. It gives our flight & trailer dispatchers total spatial
              certainty
            </p>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>MV</div>
              <div>
                <div className={styles.authorName}>Marcus Vance</div>
                <div className={styles.authorTitle}>
                  VP Global Fleet Operations, Apex Intermodal
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBadges}>
          <span>🛡️ SOC-2 Type II</span>
          <span>🔒 ISO 27001</span>
          <span>🛡️ FedRAMP Ready</span>
          <span>🌐 TLS 1.3 FIPS</span>
        </div>
      </div>

      {/* Right Side */}
      <div className={styles.rightSection}>
        <div className={styles.loginWrapper}>
          <div className={styles.gatewayBadge}>• IDENTITY GATEWAY</div>

          <h2 className={styles.welcomeTitle}>Welcome back</h2>
          <p className={styles.welcomeDesc}>
            Sign in to access your dispatch console, facility gates, and fleet
            telematics.
          </p>

          <div className={styles.dividerContainer}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>SIGN IN WITH CREDENTIALS</span>
            <div className={styles.dividerLine}></div>
          </div>
          <Suspense fallback={<p>Loading sign-in form...</p>}>
            <Form<LoginValues>
              onFinish={handleSubmit}
              className={styles.formGroup}
              requiredMark={false}
            >
              <div className={styles.inputGroup}>
                <label htmlFor="login-email">Corporate Work Email</label>
                <div className={styles.inputWrapper}>
                  <Mail
                    className={`${styles.inputIcon} ${styles.inputIconStatic}`}
                  />
                  <Form.Item
                    name="email"
                    style={{ marginBottom: 0 }}
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Enter a valid email address" },
                    ]}
                  >
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      className={styles.textInput}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <label htmlFor="login-password" style={{ margin: 0 }}>
                    Password
                  </label>
                  <Link href="/password-reset" className={styles.forgotLink}>
                    Forgot password?
                  </Link>
                </div>
                <div className={styles.inputWrapper}>
                  <Button
                    type="text"
                    htmlType="button"
                    className={styles.inputIconButton}
                    style={{ padding: 0, height: "auto", lineHeight: 0 }}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <LockKeyhole className={styles.inputIcon} />
                  </Button>
                  <Form.Item
                    name="password"
                    style={{ marginBottom: 0 }}
                    rules={[
                      { required: true, message: "Please enter your password" },
                    ]}
                  >
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className={styles.textInputPassword}
                    />
                  </Form.Item>
                </div>
              </div>

              <Button
                htmlType="submit"
                className={styles.submitBtn}
                style={{
                  backgroundColor: "var(--color-green-primary)",
                  color: "var(--color-bg-dark)",
                  border: "none",
                }}
              >
                Sign In →
              </Button>
            </Form>
          </Suspense>

          <div className={styles.requestAccessBox}>
            New logistics carrier or terminal manager?{" "}
            <a href="#" className={styles.requestLink}>
              Request Carrier Access ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
