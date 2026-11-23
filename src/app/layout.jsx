import { Header } from "@/components/layout/Header";
import "@/styles/palette.css";
import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/continuity.css";
import "@/styles/portfolio-depth.css";
import "@/styles/gallery.css";
import "@/styles/motion.css";
import "@/styles/carbon.css";
export const metadata = {
  title: {
    default: "Shweta Sharma | Fullstack Dev",
    template: "%s | Shweta Sharma",
  },
  description:
    "Projects, experience, and contact details for Shweta Sharma, a Philadelphia-based fullstack developer working across web applications, UX, and applied machine learning.",
};
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="carbonPreview">
        <Header />
        {children}
        <footer className="wrap">
          <span>Shweta Sharma</span>
          <span>Fullstack Dev</span>
          <a href="#main">Back to top ↑</a>
        </footer>
        </div>
      </body>
    </html>
  );
}
