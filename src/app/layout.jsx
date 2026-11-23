import { AtelierHeader } from "@/components/layout/AtelierHeader";
import { CurtainIntro } from "@/components/motion/CurtainIntro";
import { CustomCursor } from "@/components/motion/CustomCursor";
import "@/styles/atelier.css";

export const metadata = {
  title: {
    default: "Shweta Sharma — Fullstack Engineer & Applied ML",
    template: "%s — Shweta Sharma",
  },
  description:
    "Editorial monograph and portfolio of Shweta Sharma, a Philadelphia-based fullstack developer working across human-centered interfaces, APIs, and applied machine learning.",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="grainOverlay" aria-hidden="true" />
        <CurtainIntro />
        <CustomCursor />
        <AtelierHeader />
        {children}
      </body>
    </html>
  );
}
