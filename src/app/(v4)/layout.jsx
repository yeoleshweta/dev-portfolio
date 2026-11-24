import "@/styles/v4.css";

export const metadata = {
  title: {
    default: "Shweta Sharma — Creative Fullstack & Applied ML (v4)",
    template: "%s — Shweta Sharma",
  },
  description:
    "v4 interactive portfolio of Shweta Sharma — fullstack engineering, interaction design, and applied machine learning.",
};

export default function V4Layout({ children }) {
  return (
    <html lang="en" className="v4Html">
      <body className="v4Body">
        <a className="v4Skip" href="#main">
          Skip to content
        </a>
        <div className="v4Noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
