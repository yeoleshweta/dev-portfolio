import "@/styles/v5.css";

export const metadata = {
  title: {
    default: "Shweta Sharma — Fullstack & Applied ML (v5)",
    template: "%s — Shweta Sharma",
  },
  description:
    "v5 atmospheric dusk monograph portfolio of Shweta Sharma — human-centered interfaces, fullstack APIs, and applied machine learning.",
};

export default function V5Layout({ children }) {
  return (
    <html lang="en" className="v5Html">
      <body className="v5Body">
        <a className="v5Skip" href="#main">
          Skip to content
        </a>
        <div className="v5MistGrain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
