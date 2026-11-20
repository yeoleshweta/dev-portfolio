import { Header } from '@/components/layout/Header';
import { Reveal } from '@/components/ui/Reveal';
import '@/styles/globals.css';
export const metadata = {
  title: {default:'Shweta Sharma | Fullstack Dev',template:'%s | Shweta Sharma'},
  description: 'Projects, experience, and contact details for Shweta Sharma, a Philadelphia-based fullstack developer working across web applications, UX, and applied machine learning.'
};
export default function Layout({children}) {
  return <html lang="en"><body><a className="skip" href="#main">Skip to content</a>
    <Header/>
    <Reveal>{children}</Reveal><footer className="wrap"><span>Shweta Sharma</span><span>Fullstack Dev</span><a href="#main">Back to top ↑</a></footer></body></html>;
}
