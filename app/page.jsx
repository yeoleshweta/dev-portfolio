import Image from 'next/image';
import {ProjectGallery} from '../components/ProjectGallery';
import {profile,projects,experience,capabilities} from '../content/profile';
export default function Home(){
  return <main id="main"><section className="hero wrap"><div className="heroCopy">
    <div className="eyebrow"><span className="line"/>{profile.title}</div>
    <h1>Shweta<br/><em>Sharma.</em></h1>
    <p className="heroIntro">I build web applications, from the interface people touch to the models and APIs behind it.</p>
    <div className="actions"><a className="primary" href="#work">Explore my projects <i aria-hidden="true">↓</i></a><a className="textLink" href={profile.resume}>Résumé (PDF)</a></div>
    </div><figure className="portrait"><div className="portraitImage"><Image src="/shweta.jpg" alt="Shweta Sharma" width={943} height={1024} priority sizes="(max-width: 760px) 90vw, 40vw"/></div><figcaption><span>{profile.name}</span><span>{profile.location}</span></figcaption></figure></section>
    <section id="work" className="wrap block"><div className="heading"><div><p className="eyebrow">Portfolio</p><h2>Selected work.</h2></div><p>Three projects across software, product design, and applied ML.</p></div><ProjectGallery projects={projects}/></section>
    <section id="experience" className="dark"><div className="wrap split"><div><p className="eyebrow">Career</p><h2>Experience.</h2></div><div>{experience.map(([dates,company,role,detail])=><article className="job" key={company}><small>{dates}</small><h3>{company}</h3><strong>{role}</strong><p>{detail}</p></article>)}</div></div></section>
    <section id="skills" className="wrap block"><p className="eyebrow">Skills</p><h2>My toolkit.</h2><div className="skills">{capabilities.map(([name,tools,usage])=><article key={name}><h3>{name}</h3><strong>{tools}</strong><p>{usage}</p></article>)}</div></section>
    <section id="about" className="wrap about"><figure><Image src="/mountains.jpg" alt="A motorcycle trip in the mountains, from Shweta’s travel photos" width={900} height={700} sizes="(max-width: 760px) 90vw, 36vw"/></figure><div><p className="eyebrow">About me</p><h2>Hi, I’m Shweta.</h2><p>I came to development through design. At Urbanfit and John Deere, I spent years watching how people actually use software. That habit followed me into building web applications and studying AI and machine learning at Drexel.</p><p>I’m based in Philadelphia. Away from the screen, my camera roll runs from motorcycle trips in the mountains to scuba dives.</p></div></section>
    <section id="contact" className="contact"><div className="wrap split"><div><p className="eyebrow">What I’m looking for</p><h2>My next role.</h2></div><div><p>{profile.interests}</p><div className="actions"><a className="primary" href={'mailto:'+profile.email}>Email Shweta <i aria-hidden="true">↗</i></a><a className="textLink" href={profile.linkedin}>LinkedIn</a></div></div></div></section>
  </main>;
}
