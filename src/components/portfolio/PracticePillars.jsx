"use client";

const pillars = [
  {
    num: "01",
    eyebrow: "PEOPLE & RESEARCH",
    title: "Diagnose before building.",
    body: "Six years leading UX research and behavioral personalization across enterprise and retail teams taught me to solve the human problem before writing production code.",
    metric: "−60%",
    metricLabel: "Survey setup time across 250+ John Deere products",
  },
  {
    num: "02",
    eyebrow: "INTERACTION & SYSTEMS",
    title: "Give complexity one grammar.",
    body: "From multi-role inventory control panels to real-time webcam sign recognition, I build responsive interfaces where the person always remains in command.",
    metric: "484",
    metricLabel: "Connected prototype interactions in Urbanfit Control Panel",
  },
  {
    num: "03",
    eyebrow: "APPLIED ML & EVALUATION",
    title: "Models you can question.",
    body: "Combining an MS in AI & Machine Learning with clinical NLP work at ABIM, I pair fine-tuned classifiers with inspectable explanation layers and clean APIs.",
    metric: "3.97",
    metricLabel: "MS Computer Science (AI & ML) GPA · Drexel University",
  },
];

/**
 * Ultra-clean 3-pillar Swiss architectural practice overview.
 * Zero heavy cards, zero drop shadows — pure typography, hairlines, and quantified proof.
 */
export function PracticePillars() {
  return (
    <section id="story" className="practiceSection atelierWrap">
      <div className="practiceHeader" data-reveal>
        <span className="chapterMarker">01 / PRACTICE</span>
        <p className="practiceLead">
          A rare bridge between qualitative human insight, full-stack web
          architecture, and interpretable machine learning.
        </p>
      </div>

      <div className="practiceGrid">
        {pillars.map((item) => (
          <article key={item.num} className="practiceCol" data-reveal>
            <div className="practiceColRule" aria-hidden="true" />
            <div className="practiceColMeta">
              <span>{item.num}</span>
              <small>{item.eyebrow}</small>
            </div>
            <h2>{item.title}</h2>
            <p className="practiceColBody">{item.body}</p>
            <div className="practiceMetric">
              <strong>{item.metric}</strong>
              <span>{item.metricLabel}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
