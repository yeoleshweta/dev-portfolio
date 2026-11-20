import Link from 'next/link';
import './portfolio.css';
export const metadata = {
  title: {default:'Shweta Sharma | Fullstack Dev',template:'%s | Shweta Sharma'},
  description: 'Projects, experience, and contact details for Shweta Sharma, a Philadelphia-based fullstack developer working across web applications, UX, and applied machine learning.'
};
export default function Layout({children}) {
  return <html lang="en"><body><a className="skip" href="#main">Skip to content</a>
    <header className="wrap top"><Link className="brand" href="/" aria-label="Shweta Sharma, home"><i aria-hidden="true">s.</i> Shweta Sharma</Link>
      <nav aria-label="Main navigation"><Link href="/#work">Projects</Link><Link href="/#experience">Experience</Link><Link href="/#about">About</Link><Link className="navContact" href="/#contact">Contact</Link></nav></header>
    {children}<footer className="wrap"><span>Shweta Sharma</span><span>Fullstack Dev</span><a href="#main">Back to top ↑</a></footer></body></html>;
}
