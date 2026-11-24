import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/profile";

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
    <main className="atelierWrap studyPage" id="main">
      <Link className="atelierBtnOutline" href="/#works">
        ← Back to Selected Works
      </Link>

      <header className="studyHeader">
        <span className="chapterMarker">
          {p.field.toUpperCase()} / {p.context.toUpperCase()}
        </span>
        <h1>{p.name}</h1>
        <p className="studyDeck">{p.headline}</p>

        <div className="studyMeta">
          <div>
            <small>ROLE</small>
            <p>{p.role}</p>
          </div>
          <div>
            <small>TOOLKIT</small>
            <p>{p.stack.join(" · ")}</p>
          </div>
          <div>
            <small>REFERENCE</small>
            {p.repository ? (
              <p>
                <a
                  className="atelierLink"
                  style={{ marginTop: 0 }}
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

      <div className="studyImageFrame">
        <Image
          src={p.image}
          alt={p.alt}
          width={1200}
          height={720}
          sizes="(max-width: 760px) 94vw, 86vw"
        />
      </div>

      <div className="studyGrid">
        {[
          ["01 / THE QUESTION", "The question", p.question],
          ["02 / CONTRIBUTION", "My contribution", p.contribution],
          ["03 / OUTCOME", "What came out of it", p.result],
        ].map(([kicker, heading, body]) => (
          <section className="studyCard" key={heading}>
            <span>{kicker}</span>
            <h2>{heading}</h2>
            <p>{body}</p>
          </section>
        ))}
      </div>

      <div className="studyNext">
        <div>
          <span className="chapterMarker" style={{ marginBottom: "6px" }}>
            NEXT CASE STUDY
          </span>
          <strong style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 500 }}>
            {next.name}
          </strong>
        </div>
        <Link className="atelierBtnPrimary" href={`/work/${next.slug}/`}>
          Open {next.name} ↗
        </Link>
      </div>
    </main>
  );
}
