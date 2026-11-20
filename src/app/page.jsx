import Image from 'next/image';
import Link from 'next/link';
import { StoryCenterpiece } from '@/components/portfolio/StoryCenterpiece';
import { profile, projects, experience, capabilities } from '@/content/profile';

function Action({ href, children }) {
  return <a className="primary" href={href}>{children}<i aria-hidden="true">↗</i></a>;
}

export default function Home() {
  const [gesture, urban, clinical] = projects;
  return <main id="main">
    <section className="storyHero wrap">
      <div className="heroMeta"><span>Shweta Sharma · Fullstack developer</span><span>Based in Philadelphia, PA</span></div>
      <p className="eyebrow centered">A designer’s eye. A developer’s mind.</p>
      <h1>Technology, with<br/><em>a human center.</em></h1>
      <p className="heroDeck">I came to code through people.<br/>Now I build the systems that connect them.</p>
      <StoryCenterpiece/>
      <div className="heroFoot"><span>Research / Design / Development</span><a href="#work">Follow the story <i aria-hidden="true">↓</i></a><span>Selected work · 01—03</span></div>
    </section>

    <section id="work" className="chapterSection wrap">
      <div className="chapterHeading"><p className="eyebrow">01 / Understanding becomes an interface</p><span className="chapterIndex" aria-hidden="true">01</span></div>
      <div className="storySplit"><h2>First, make the<br/><em>complex feel clear.</em></h2><div><p>Design taught me that the same system can mean very different things to different people.</p><p>At Urbanfit, that meant bringing administrators, warehouse teams, and franchise shops into one shared workspace.</p></div></div>
      <Link className="projectStage urbanStage" href={`/work/${urban.slug}/`} aria-label="Read the Urbanfit Control Panel case study"><div className="stageCore"><div className="stageCaption"><span>Urbanfit / Product design</span><span>Three perspectives. One system.</span></div><div className="browserFrame"><div className="browserBar"><span>● ● ●</span><span>urbanfit / control panel</span><span>↗</span></div><Image src={urban.image} alt={urban.alt} width={1200} height={800} sizes="(max-width: 767px) 90vw, 80vw"/></div><div className="stageBottom"><span>30 screens <b>·</b> 484 interactions</span><span className="roundArrow" aria-hidden="true">↗</span></div></div></Link>
      <div className="projectAfter"><h3>{urban.name}</h3><span>{urban.stack.join(' / ')}</span><Link className="textLink" href={`/work/${urban.slug}/`}>Read the case study ↗</Link></div>
    </section>

    <section className="intelligenceChapter">
      <div className="wrap"><p className="eyebrow">02 / The interface becomes intelligent</p><div className="storySplit"><h2>Then, make room<br/>for <em>possibility.</em></h2><div><p>Moving into development and machine learning opened another question: what if software could understand a gesture?</p><p>GesturePro connects a webcam, a hand-landmark model, and an editable message. The person stays in control.</p></div></div>
        <div className="gestureStage"><div className="gestureCore"><div className="gestureVisual"><span className="tinyLabel">GesturePro / A browser prototype</span><svg viewBox="0 0 430 410" role="img" aria-label="Illustration of a hand landmark network"><defs><radialGradient id="handGlow"><stop stopColor="#b98c74" stopOpacity=".2"/><stop offset="1" stopColor="#b98c74" stopOpacity="0"/></radialGradient></defs><circle cx="215" cy="200" r="195" fill="url(#handGlow)"/><g fill="none" stroke="#e5b39c" strokeWidth="1.2"><path d="M200 352 145 278 102 227 72 185 54 147M200 352 166 221 152 146 144 91 139 48M166 221 213 205 211 119 210 62 209 25M213 205 257 216 267 139 275 84 280 48M257 216 296 242 320 186 338 146 349 117M296 242 200 352M166 221 102 227M213 205 200 352M257 216 200 352"/></g><g fill="#f9dfc4">{[[200,352],[145,278],[102,227],[72,185],[54,147],[166,221],[152,146],[144,91],[139,48],[213,205],[211,119],[210,62],[209,25],[257,216],[267,139],[275,84],[280,48],[296,242],[320,186],[338,146],[349,117]].map(([x,y], i)=><circle key={i} cx={x} cy={y} r={i===0?6:4}/>)}</g><circle cx="200" cy="352" r="15" fill="none" stroke="#e5b39c" strokeOpacity=".4"/></svg><span className="diagramCaption">21 landmarks / illustrated model pipeline</span></div><div className="gestureDetails"><span className="tinyLabel">From motion to meaning</span><h3>A hand.<br/>A signal.<br/><em>A message.</em></h3><div className="pipeline"><span>Camera</span><i>→</i><span>Model</span><i>→</i><span>Editable text</span></div><p>Recognition is only part of the experience. A prediction must also be something a person can correct.</p><Action href={`/work/${gesture.slug}/`}>Explore GesturePro</Action></div></div></div>
        <div className="projectAfter"><span>{gesture.role}</span><span>{gesture.stack.join(' / ')}</span><span>Four-person capstone</span></div>
      </div>
    </section>

    <section className="chapterSection wrap clinicalChapter"><p className="eyebrow">03 / Intelligence needs interpretation</p><div className="storySplit"><h2>Keep the human<br/><em>in the conversation.</em></h2><div><p>At the American Board of Internal Medicine, I worked with clinical dialogue: turning conversations into annotated data and model predictions into named communication behaviors.</p><Action href={`/work/${clinical.slug}/`}>Explore the NLP workflow</Action></div></div><div className="conversationVisual"><div className="conversationCore"><span className="tinyLabel">Clinical communication / Workflow illustration</span><div className="conversationFlow"><div><span className="flowNumber">01</span><h3>Listen.</h3><div className="waveform" aria-hidden="true">{Array.from({length:36},(_,i)=><i key={i} style={{height:`${14+Math.abs(Math.sin(i*1.7))*54}px`}}/>)}</div><p>Doctor–patient dialogue</p></div><span className="flowArrow" aria-hidden="true">→</span><div><span className="flowNumber">02</span><h3>Understand.</h3><div className="annotationTags"><span>Calgary-Cambridge</span><span>NURSE</span></div><p>Annotated communication behaviors</p></div><span className="flowArrow" aria-hidden="true">→</span><div><span className="flowNumber">03</span><h3>Evaluate.</h3><div className="evaluationMark" aria-hidden="true">↗</div><p>Predictions that reviewers can examine</p></div></div></div></div></section>

    <section id="experience" className="journeySection"><div className="wrap journeyGrid"><div className="journeyIntro"><p className="eyebrow">The thread that connects it all</p><h2>Different roles.<br/><em>One curiosity.</em></h2><p>How do people use technology—and how can I make that experience better?</p><a className="textLink" href={profile.resume}>View my résumé (PDF) ↗</a></div><div className="timeline">{experience.map(([dates,company,role,detail])=><article key={company}><small>{dates}</small><h3>{company}</h3><strong>{role}</strong><p>{detail}</p></article>)}</div></div></section>

    <section id="about" className="aboutStory wrap"><div className="travelShell"><Image src="/mountains.jpg" alt="Shweta’s motorcycle trip in the mountains" width={900} height={700} sizes="(max-width: 767px) 90vw, 45vw"/><span>Off screen / Still exploring</span></div><div><p className="eyebrow">The person behind the work</p><h2>Curiosity doesn’t<br/><em>clock out.</em></h2><p>I’m Shweta, a Philadelphia-based developer who came to code through design and studied AI and machine learning at Drexel.</p><p>Away from the screen, my camera roll runs from motorcycle trips in the mountains to scuba dives. I like seeing what’s beyond the familiar.</p><div className="toolkit"><span className="tinyLabel">What I build with</span>{capabilities.map(([name,tools])=><p key={name}><strong>{name}</strong><span>{tools}</span></p>)}</div></div></section>
    <section id="contact" className="storyContact"><div className="wrap"><p className="eyebrow centered">The next chapter</p><h2>Let’s build something<br/><em>for someone.</em></h2><p>I’m looking for a fullstack role where thoughtful interfaces<br className="desktopBreak"/> meet the systems that make them work.</p><div className="actions"><Action href={`mailto:${profile.email}`}>Start a conversation</Action><a className="textLink" href={profile.linkedin}>LinkedIn ↗</a></div></div></section>
  </main>;
}
