import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/profile";
import { RevealHeading } from "@/components/motion/RevealHeading";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

async function projectFor(params) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return project;
}

export async function generateMetadata({ params }) {
  const p = await projectFor(params);
  return { title: p.name, description: p.summary };
}

export default async function CaseStudy({ params }) {
  const p = await projectFor(params);
  const next = projects[(projects.indexOf(p) + 1) % projects.length];

  return (
    <main className="wrap study" id="main">
      <Link className="textLink" href="/#work">
        ← Back to selected work
      </Link>

      <header className="caseStudyHero">
        <p className="eyebrow">
          {p.field} / {p.context}
        </p>
        <RevealHeading as="h1" lines={[p.name]} intro />
        <p className="deck">{p.headline}</p>

        <div className="caseMetaGrid">
          <div>
            <small>My role</small>
            <p>{p.role}</p>
          </div>
          <div>
            <small>Toolkit</small>
            <p>{p.stack.join(" · ")}</p>
          </div>
          <div>
            <small>Reference</small>
            {p.repository ? (
              <p>
                <a
                  className="textLink"
                  href={p.repository}
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore source on GitHub ↗
                </a>
              </p>
            ) : (
              <p>{p.context}</p>
            )}
          </div>
        </div>
      </header>

      <article className="caseBody">
        <div className="caseMediaFrame">
          <Image
            className="caseImage"
            src={p.image}
            alt={p.alt}
            width={1200}
            height={720}
            sizes="(max-width: 760px) 94vw, 82vw"
          />
        </div>

        <div className="caseSections">
          {[
            ["01 / THE QUESTION", "The question", p.question],
            ["02 / CONTRIBUTION", "My contribution", p.contribution],
            ["03 / OUTCOME", "What came out of it", p.result],
          ].map(([kicker, heading, body]) => (
            <section className="caseChapter" key={heading}>
              <span>{kicker}</span>
              <h2>{heading}</h2>
              <p>{body}</p>
            </section>
          ))}
        </div>

        <div className="caseNextBar">
          <div>
            <small>NEXT CASE STUDY</small>
            <strong>{next.name}</strong>
          </div>
          <Link className="primary" href={`/work/${next.slug}/`}>
            Open {next.name}
            <i aria-hidden="true">↗</i>
          </Link>
        </div>
      </article>
    </main>
  );
}
