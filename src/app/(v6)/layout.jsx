import "@/styles/v6.css";

export const metadata = {
  title: {
    default: "Shweta Sharma — Fullstack Engineer & Applied ML",
    template: "%s — Shweta Sharma",
  },
  description:
    "Scroll-choreographed portfolio of Shweta Sharma: watch a product transform live from UX research to frontend UI, backend APIs, applied AI, and evaluation.",
};

export default function V6Layout({ children }) {
  return (
    <html lang="en" className="v6Html">
      <body className="v6Body">
        <a className="v6Skip" href="#main">
          Skip to content
        </a>
        <div className="v6Grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
