import "@/styles/v3.css";

export const metadata = {
  title: {
    default: "Shweta Sharma — Fullstack Engineer & Applied ML (v3)",
    template: "%s — Shweta Sharma",
  },
  description:
    "v3 portfolio of Shweta Sharma, a Philadelphia-based fullstack developer working across human-centered interfaces, APIs, and applied machine learning.",
};

export default function V3Layout({ children }) {
  return (
    <html lang="en" className="v3Html">
      <body className="v3Body">
        <a className="v3Skip" href="#main">
          Skip to content
        </a>
        <div className="v3FilmGrain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
