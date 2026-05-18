"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// AUDIT #19: schema-driven, field-level validation
const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  company: z.string().optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur", // validate on blur for clean UX
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Registration failed");
      setRegisteredEmail(data.email);
      setRegistered(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // AUDIT #17: input style with visible focus-visible ring (set in globals.css)
  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    background: "var(--bg-primary)",
    border: `1px solid ${hasError ? "#ef4444" : "var(--border-default)"}`,
    color: "var(--text-primary)",
    fontSize: 15,
    fontFamily: "'Sora', sans-serif",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  });

  const errorTextStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 800,
              color: "white",
            }}
          >
            E
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
            EcomRevHub
          </span>
        </a>

        <div
          style={{
            background: "rgba(28,28,32,0.6)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 20,
            padding: "40px 36px",
          }}
        >
          {registered ? (
            <div style={{ textAlign: "center" as const }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>✉️</div>
              <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Check your email</h1>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: 12,
                }}
              >
                We sent a verification link to{" "}
                <strong style={{ color: "var(--text-primary)" }}>{registeredEmail}</strong>.
              </p>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                Click the link to activate your account and start your 14-day free trial.
              </p>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                Can&apos;t find it? Check your spam folder. Link expires in 24 hours.
              </p>
            </div>
          ) : (
            <>
              <h1
                style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: "center" }}
              >
                Create Account
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text-secondary)",
                  textAlign: "center",
                  marginBottom: 32,
                }}
              >
                Start your free 14-day trial. No credit card required.
              </p>
              {error && (
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#ef4444",
                    fontSize: 14,
                    marginBottom: 20,
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? "firstName-err" : undefined}
                      style={inputStyle(!!errors.firstName)}
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p id="firstName-err" style={errorTextStyle}>{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? "lastName-err" : undefined}
                      style={inputStyle(!!errors.lastName)}
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p id="lastName-err" style={errorTextStyle}>{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-err" : undefined}
                    style={inputStyle(!!errors.email)}
                    {...register("email")}
                  />
                  {errors.email && <p id="email-err" style={errorTextStyle}>{errors.email.message}</p>}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Company (optional)"
                    style={inputStyle(false)}
                    {...register("company")}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "pw-err" : undefined}
                    style={inputStyle(!!errors.password)}
                    {...register("password")}
                  />
                  {errors.password ? (
                    <p id="pw-err" style={errorTextStyle}>{errors.password.message}</p>
                  ) : (
                    <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 6 }}>
                      At least 8 characters with one uppercase letter and one number
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || !isValid}
                  style={{
                    width: "100%",
                    padding: "14px 24px",
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "white",
                    fontSize: 16,
                    fontWeight: 600,
                    border: "none",
                    cursor: loading || !isValid ? "not-allowed" : "pointer",
                    fontFamily: "'Sora', sans-serif",
                    transition: "all 0.3s",
                    opacity: loading || !isValid ? 0.5 : 1,
                  }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                  textAlign: "center",
                  marginTop: 16,
                  lineHeight: 1.6,
                }}
              >
                By creating an account you agree to our{" "}
                <a href="/terms" style={{ color: "var(--accent-primary, #818cf8)", textDecoration: "none" }}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" style={{ color: "var(--accent-primary, #818cf8)", textDecoration: "none" }}>
                  Privacy Policy
                </a>
                .
              </p>
              <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-tertiary)", marginTop: 16 }}>
                Already have an account?{" "}
                <a href="/auth/login" style={{ color: "#818cf8", textDecoration: "none", fontWeight: 500 }}>
                  Log in
                </a>
              </p>
            </>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 24,
            fontSize: 12,
            color: "var(--text-tertiary)",
          }}
        >
          <span>256-bit SSL</span>
          <span>SOC 2 Type II in progress</span>
          <span>14-day free trial</span>
        </div>
      </div>
    </div>
  );
}
