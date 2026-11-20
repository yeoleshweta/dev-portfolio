import Image from "next/image";
import { ContinuousPortfolio } from "@/components/portfolio/ContinuousPortfolio";
import { PersonalGallery } from "@/components/portfolio/PersonalGallery";
import { profile, projects, experience } from "@/content/profile";
import { disciplines, archive } from "@/content/engineering";

function Action({ href, children }) {
  return (
    <a className="primary" href={href}>
      {children}
      <i aria-hidden="true">↗</i>
    </a>
  );
}

export default function Home() {
  return (
    <main id="main">
      <ContinuousPortfolio projects={projects} />
      <div className="practiceBridge wrap">
        <span className="eyebrow">The common thread</span>
        <p>
          Understand the person.
          <br />
          Design the interaction.
          <br />
          <em>Build the whole thing.</em>
        </p>
        <a href="#skills" className="bridgeLink">
          A little more about the practice <span aria-hidden="true">↓</span>
        </a>
      </div>

      <section className="archiveSection wrap" aria-labelledby="archive-title">
        <div className="archiveHeading">
          <span className="eyebrow">Still curious?</span>
          <h2 id="archive-title">There’s more on the desk.</h2>
          <a
            className="textLink"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            Explore GitHub ↗
          </a>
        </div>
        <div className="projectArchive">
          {archive.map((project, i) => (
            <details className="archiveItem" key={project.title}>
              <summary>
                <span className="archiveNumber">0{i + 1}</span>
                <span className="archiveName">{project.title}</span>
                <span className="archiveType">{project.type}</span>
                <span className="archivePlus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="archiveBody">
                <p>{project.description}</p>
                <span>{project.stack}</span>
                {project.href && (
                  <a className="textLink" href={project.href}>
                    Read the case study ↗
                  </a>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section
        className="skillsSection wrap"
        id="skills"
        aria-labelledby="skills-title"
      >
        <div className="skillsIntro">
          <p className="eyebrow">03 / Working range</p>
          <h2 id="skills-title">
            Across the stack.
            <br />
            <em>Close to the person.</em>
          </h2>
          <p>
            Design experience shapes how I build. Technical fluency changes the
            questions I can ask.
          </p>
          <div className="disciplineMark" aria-hidden="true">
            <span>DESIGN</span>
            <i />
            <span>CODE</span>
            <i />
            <span>INTELLIGENCE</span>
          </div>
        </div>
        <div className="disciplineList">
          {disciplines.map((discipline, i) => (
            <article className="discipline" key={discipline.name}>
              <div className="disciplineTop">
                <small>0{i + 1}</small>
                <span>{discipline.note}</span>
              </div>
              <h3>{discipline.name}</h3>
              <p>{discipline.detail}</p>
              <div className="skillTags">
                {discipline.tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
              <a href={discipline.href}>
                See it in {discipline.proof} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="journeySection">
        <div className="wrap journeyGrid">
          <div className="journeyIntro">
            <p className="eyebrow">04 / A practice built over time</p>
            <h2>
              Different roles.
              <br />
              <em>One curiosity.</em>
            </h2>
            <p>
              How do people use technology—and how can I make that experience
              better?
            </p>
            <a
              className="textLink"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              View my résumé (PDF) ↗
            </a>
            <div className="educationShell">
              <div className="educationCard">
                <span className="tinyLabel">Drexel University / 2024–2026</span>
                <h3>
                  Computer Science.
                  <br />
                  <em>AI & Machine Learning.</em>
                </h3>
                <div>
                  <span>Master of Science</span>
                  <strong>
                    3.97<small> / 4.0 GPA</small>
                  </strong>
                </div>
              </div>
            </div>
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

      <section id="about" className="personalSection wrap">
        <div className="personalHeading">
          <p className="eyebrow">05 / Off screen</p>
          <h2>
            A little more
            <br />
            <em>human context.</em>
          </h2>
          <p>
            The same curiosity.
            <br />A different kind of exploring.
          </p>
        </div>
        <div className="personalGrid">
          <figure className="personalPhotoShell">
            <div className="personalPhoto">
              <Image
                src="/mountains.jpg"
                alt="Shweta at Grace Hopper Celebration 2025"
                width={900}
                height={700}
                sizes="(max-width: 767px) 90vw, 48vw"
              />
              <figcaption>
                <span>FIELD NOTE / 01</span>
                <strong>In good company.</strong>
                <span>Grace Hopper Celebration · 2025</span>
              </figcaption>
            </div>
          </figure>
          <div className="personalNotes">
            <span className="tinyLabel">Hello again. I’m Shweta.</span>
            <h3>
              I came to code
              <br />
              <em>through people.</em>
            </h3>
            <p>
              My path runs through research, product design, and a master’s in
              AI and machine learning. I like the space where a thoughtful
              interaction meets a difficult technical problem.
            </p>
            <p>
              Away from the screen, that curiosity looks like motorcycle trips
              in the mountains and scuba dives. There’s usually something worth
              seeing beyond the familiar.
            </p>
            <div className="offscreenInterests">
              <span>01 / Mountain roads</span>
              <span>02 / Below the surface</span>
              <span>03 / New perspectives</span>
            </div>
            <span className="personalSignature">Shweta.</span>
          </div>
        </div>
      </section>

      <PersonalGallery />

      <section id="contact" className="storyContact">
        <div className="wrap">
          <div className="contactStatus">
            <span className="liveDot" /> Open to full-stack opportunities{" "}
            <span>Philadelphia · Open to relocate</span>
          </div>
          <p className="eyebrow centered">07 / The next chapter</p>
          <h2>
            Thoughtful people.
            <br />
            <em>Ambitious things.</em>
          </h2>
          <p>
            I’m looking for a team that cares how it works
            <br className="desktopBreak" /> and how it feels to use.
          </p>
          <div className="actions">
            <Action href={`mailto:${profile.email}`}>Let’s talk</Action>
            <a
              className="textLink"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              View résumé ↗
            </a>
          </div>
          <div className="contactLinks">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
