import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message: string;
}

/**
 * Catches runtime render errors so a single broken component never blanks the
 * whole site. Shows a calm, on-brand recovery screen with reload + WhatsApp.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || "Unexpected error" };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Surface to console for diagnostics; never crash silently.
    console.error("[XIYORA] Render error caught by ErrorBoundary:", error, info);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F6F2",
          fontFamily: "'Jost', system-ui, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 460, textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 34,
              letterSpacing: 6,
              color: "#1c1c1c",
              marginBottom: 18,
            }}
          >
            XIYORA
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              fontWeight: 500,
              color: "#1c1c1c",
              marginBottom: 12,
            }}
          >
            Something interrupted this page
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#888",
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            Your basket and saved items are safe. Please reload to continue, or
            reach us on WhatsApp and we&apos;ll help right away.
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "#1c1c1c",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: 2,
                fontSize: 12,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "'Jost', sans-serif",
              }}
            >
              Reload Page
            </button>
            <a
              href="https://wa.me/917028311226"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#25D366",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: 2,
                fontSize: 12,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                textDecoration: "none",
                fontFamily: "'Jost', sans-serif",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    );
  }
}
