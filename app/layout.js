import "./globals.css";

export const metadata = {
  title: "oliveclear",
  description:
    "Oliveclear is an AI-powered skincare platform offering personalized skin analysis, skin type detection, and expert insights to help you achieve healthier, clearer skin. Trusted for accurate skin diagnostics and tailored recommendations.",
  icons:{
    icon: "/favicon.ico",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
