import { ImageResponse } from "next/og";

export const alt = "TriageDesk: AI support ticket triage";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function chip(label: string, color: string, background: string) {
  return (
    <div
      key={label}
      style={{
        display: "flex",
        padding: "10px 22px",
        borderRadius: 999,
        fontSize: 28,
        fontWeight: 600,
        color,
        background,
      }}
    >
      {label}
    </div>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0a0c14 0%, #1b1f3a 100%)",
          color: "#e9ebf5",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#7b83ff",
              display: "flex",
            }}
          />
          TriageDesk
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
            }}
          >
            Triage support tickets in seconds, not hours.
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#8d95ab" }}>
            AI labels every ticket and drafts the reply.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {chip("Billing", "#7b83ff", "rgba(123,131,255,0.18)")}
          {chip("Urgency: High", "#fbbf24", "rgba(251,191,36,0.18)")}
          {chip("Sentiment: Negative", "#fb7185", "rgba(251,113,133,0.18)")}
        </div>
      </div>
    ),
    { ...size },
  );
}
