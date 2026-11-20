import Image from "next/image";
import Link from "next/link";
import { StoryCenterpiece } from "@/components/portfolio/StoryCenterpiece";
import {
  UrbanfitScene,
  GestureScene,
  ClinicalScene,
} from "@/components/portfolio/ProjectScenes";
import { profile, projects, experience, capabilities } from "@/content/profile";

function Action({ href, children }) {
  return (
    <a className="primary" href={href}>
      {children}
      <i aria-hidden="true">↗</i>
    </a>
  );
}

export default function Home() {
  const [gesture, urban, clinical] = projects;
  return (
    <main id="main">
      <section className="storyHero wrap">
        <div className="heroMeta">
          <span>Shweta Sharma · Fullstack developer</span>
          <span>Based in Philadelphia, PA</span>
        </div>
        <StoryCenterpiece />
        <div className="heroFoot">
          <span>Research / Design / Development</span>
          <a href="#work">
            Follow the story <i aria-hidden="true">↓</i>
          </a>
          <span>Selected work · 01—03</span>
        </div>
      </section>

      <section id="work" className="chapterSection wrap">
        <div className="chapterHeading">
          <p className="eyebrow">01 / Understanding becomes an interface</p>
          <span className="chapterIndex" aria-hidden="true">
            01
          </span>
        </div>
        <div className="storySplit">
          <h2>
            First, make the
            <br />
            <em>complex feel clear.</em>
          </h2>
          <div>
            <p>
              Design taught me that the same system can mean very different
              things to different people.
            </p>
            <p>
              At Urbanfit, that meant bringing administrators, warehouse teams,
              and franchise shops into one shared workspace.
            </p>
          </div>
        </div>
        <UrbanfitScene project={urban} />
        <div className="projectAfter">
          <h3>{urban.name}</h3>
          <span>{urban.stack.join(" / ")}</span>
          <Link className="textLink" href={`/work/${urban.slug}/`}>
            Read the case study ↗
          </Link>
        </div>
      </section>

      <section className="intelligenceChapter">
        <div className="wrap">
          <p className="eyebrow">02 / The interface becomes intelligent</p>
          <div className="storySplit">
            <h2>
              Then, make room
              <br />
              for <em>possibility.</em>
            </h2>
            <div>
              <p>
                Moving into development and machine learning opened another
                question: what if software could understand a gesture?
              </p>
              <p>
                GesturePro connects a webcam, a hand-landmark model, and an
                editable message. The person stays in control.
              </p>
            </div>
          </div>
          <GestureScene />
          <div className="projectAfter">
            <span>{gesture.role}</span>
            <span>{gesture.stack.join(" / ")}</span>
            <Link className="textLink" href={`/work/${gesture.slug}/`}>
              Read the GesturePro case study ↗
            </Link>
          </div>
        </div>
      </section>

      <section className="chapterSection wrap clinicalChapter">
        <p className="eyebrow">03 / Intelligence needs interpretation</p>
        <div className="storySplit">
          <h2>
            Keep the human
            <br />
            <em>in the conversation.</em>
          </h2>
          <div>
            <p>
              At the American Board of Internal Medicine, I worked with clinical
              dialogue: turning conversations into annotated data and model
              predictions into named communication behaviors.
            </p>
            <Action href={`/work/${clinical.slug}/`}>
              Explore the NLP workflow
            </Action>
          </div>
        </div>
        <ClinicalScene />
      </section>

      <section id="experience" className="journeySection">
        <div className="wrap journeyGrid">
          <div className="journeyIntro">
            <p className="eyebrow">The thread that connects it all</p>
            <h2>
              Different roles.
              <br />
              <em>One curiosity.</em>
            </h2>
            <p>
              How do people use technology—and how can I make that experience
              better?
            </p>
            <a className="textLink" href={profile.resume}>
              View my résumé (PDF) ↗
            </a>
          </div>
          <div className="timeline">
            {experience.map(([dates, company, role, detail]) => (
              <article key={company}>
                <small>{dates}</small>
                <h3>{company}</h3>
                <strong>{role}</strong>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="aboutStory wrap">
        <div className="travelShell">
          <Image
            src="/mountains.jpg"
            alt="Shweta at Grace Hopper Celebration 2025"
            width={900}
            height={700}
            sizes="(max-width: 767px) 90vw, 45vw"
          />
          <span>Off screen / Still exploring</span>
        </div>
        <div>
          <p className="eyebrow">The person behind the work</p>
          <h2>
            Curiosity doesn’t
            <br />
            <em>clock out.</em>
          </h2>
          <p>
            I’m Shweta, a Philadelphia-based developer who came to code through
            design and studied AI and machine learning at Drexel.
          </p>
          <p>
            Away from the screen, my camera roll runs from motorcycle trips in
            the mountains to scuba dives. I like seeing what’s beyond the
            familiar.
          </p>
          <div className="toolkit">
            <span className="tinyLabel">What I build with</span>
            {capabilities.map(([name, tools]) => (
              <p key={name}>
                <strong>{name}</strong>
                <span>{tools}</span>
              </p>
            ))}
          </div>
        </div>
      </section>
      <section id="contact" className="storyContact">
        <div className="wrap">
          <p className="eyebrow centered">The next chapter</p>
          <h2>
            Let’s build something
            <br />
            <em>for someone.</em>
          </h2>
          <p>
            I’m looking for a fullstack role where thoughtful interfaces
            <br className="desktopBreak" /> meet the systems that make them
            work.
          </p>
          <div className="actions">
            <Action href={`mailto:${profile.email}`}>
              Start a conversation
            </Action>
            <a className="textLink" href={profile.linkedin}>
              LinkedIn ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
