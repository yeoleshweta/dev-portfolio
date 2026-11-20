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
  const p = await projectFor(params),
    next = projects[(projects.indexOf(p) + 1) % projects.length];
  return (
    <main className="wrap study" id="main">
      <Link className="textLink" href="/#work">
        ← Selected work
      </Link>
      <header>
        <p className="eyebrow">
          {p.field} / {p.context}
        </p>
        <h1>{p.name}</h1>
        <p className="deck">{p.headline}</p>
      </header>
      <div className="caseLayout">
        <aside>
          <small>My role</small>
          <p>{p.role}</p>
          <small>Toolkit</small>
          <p>{p.stack.join(" · ")}</p>
        </aside>
        <article>
          <Image
            className="caseImage"
            src={p.image}
            alt={p.alt}
            width={850}
            height={500}
            sizes="(max-width: 760px) 90vw, 60vw"
          />
          {[
            ["The question", p.question],
            ["My contribution", p.contribution],
            ["What came out of it", p.result],
          ].map(([heading, body]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </section>
          ))}
          <Link className="primary" href={"/work/" + next.slug + "/"}>
            Next project: {next.name}
          </Link>
        </article>
      </div>
    </main>
  );
}
