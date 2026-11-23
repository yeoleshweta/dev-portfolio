import Image from "next/image";
import { ContinuousPortfolio } from "@/components/portfolio/ContinuousPortfolio";
import { SkillsetsMatrix } from "@/components/portfolio/SkillsetsMatrix";
import { PersonalGallery } from "@/components/portfolio/PersonalGallery";
import { ContactInvitation } from "@/components/portfolio/ContactInvitation";
import { PortfolioMotion } from "@/components/motion/PortfolioMotion";
import { RevealHeading } from "@/components/motion/RevealHeading";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { profile, projects, experience } from "@/content/profile";
import { archive } from "@/content/engineering";
import { ProjectArchive } from "@/components/portfolio/ProjectArchive";

const impactByCompany = {
  "American Board of Internal Medicine": "Solo-built Bias Checker AI",
  "Drexel University": "Graduate AI & ML",
  "John Deere": "−60% setup time · 250+ products",
  "Urbanfit Wellness": "+35% engagement lift",
  "Capita, for Arcadia Group": "+11% conversion lift · 7 brands",
};

export default function Home() {
  return (
    <main id="main">
      <PortfolioMotion />
      <ContinuousPortfolio projects={projects} />

      <VelocityMarquee />

      <div className="practiceBridge wrap">
        <span className="eyebrow">The common thread</span>
        <div
          className="bridgeStatement"
          aria-label="Understand the person. Design the interaction. Build the whole thing."
        >
          <span aria-hidden="true">
            <i>01</i>Understand the person.
          </span>
          <span aria-hidden="true">
            <i>02</i>Design the interaction.
          </span>
          <span aria-hidden="true">
            <i>03</i>
            <em>Build the whole thing.</em>
          </span>
        </div>
        <a href="#skills" className="bridgeLink">
          Explore the craft <span aria-hidden="true">↓</span>
        </a>
      </div>

      <SkillsetsMatrix />

      <section className="archiveSection wrap" aria-labelledby="archive-title">
        <div className="archiveHeading">
          <span className="eyebrow">Still curious?</span>
          <RevealHeading id="archive-title" lines={["There’s more on the desk."]} />
          <a
            className="textLink"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            Explore GitHub ↗
          </a>
        </div>
        <ProjectArchive projects={archive} />
      </section>

      <section id="experience" className="journeySection">
        <div className="wrap journeyGrid">
          <div className="journeyIntro">
            <p className="eyebrow">04 / A practice built over time</p>
            <RevealHeading lines={["Different roles.", "One curiosity."]} italic={1} />
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
            <div className="educationShell" data-depth>
              <div className="educationCard">
                <span className="tinyLabel">Drexel University / 2024–2026</span>
                <h3>
                  Computer Science.
                  <br />
                  <em>AI &amp; Machine Learning.</em>
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
              <article key={company} data-reveal="career">
                <div className="timelineMetaRow">
                  <small>{dates}</small>
                  {impactByCompany[company] && (
                    <span className="impactBadge">{impactByCompany[company]}</span>
                  )}
                </div>
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
          <RevealHeading lines={["A little more", "human context."]} italic={1} />
          <p>
            The same curiosity.
            <br />A different kind of exploring.
          </p>
        </div>
        <div className="personalGrid">
          <figure className="personalPhotoShell" data-depth>
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
            <RevealHeading as="h3" lines={["I came to code", "through people."]} italic={1} />
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

      <ContactInvitation profile={profile} />
    </main>
  );
}
