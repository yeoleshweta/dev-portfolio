import { SiteHeader } from "@/components/layout/SiteHeader";
import { CurtainIntro } from "@/components/motion/CurtainIntro";
import { CustomCursor } from "@/components/motion/CustomCursor";
import "@/styles/redesign.css";

export const metadata = {
  title: {
    default: "Shweta Sharma | Fullstack Dev & Applied ML",
    template: "%s | Shweta Sharma",
  },
  description:
    "Projects, experience, skillsets, and contact details for Shweta Sharma, a Philadelphia-based fullstack developer working across web applications, UX, and applied machine learning.",
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
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
