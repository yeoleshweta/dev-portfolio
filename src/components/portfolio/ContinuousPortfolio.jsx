"use client";
import Image from "next/image";
import Link from "next/link";
import { useContinuousStory } from "@/hooks/useContinuousStory";
import { SignalSculpture } from "./SignalSculpture";
import { HiringBrief } from "./HiringBrief";
import { profile } from "@/content/profile";
import { systems } from "@/content/engineering";
import { SystemNotes } from "./SystemNotes";
import { storyStages, lastStoryStage } from "@/lib/visuals/storyStages.mjs";

export function ContinuousPortfolio({ projects }) {
  const { root, progress, phase, reduced } = useContinuousStory();
  const [gesture, urban, clinical] = projects;
  const [bias, gestureSystem, pocket] = systems;
  return (
    <section
      ref={root}
      className="continuousPortfolio wrap"
      data-active-stage={phase}
      data-reduced={reduced}
      aria-label="From human insight to working systems"
    >
      <div className="continuousStage">
        <div className="stageRuler" aria-hidden="true">
          <span>SS / SELECTED SYSTEMS</span>
          <span>FORM → FUNCTION</span>
        </div>
        <div className="stageCrosshair crosshairOne" aria-hidden="true">
          +
        </div>
        <div className="stageCrosshair crosshairTwo" aria-hidden="true">
          +
        </div>
        <div className="continuousCanvas">
          <SignalSculpture progress={progress} reduced={reduced} />
        </div>
        <div className="continuityOrbit" aria-hidden="true">
          <span>HUMAN</span>
          <i />
          <span>SYSTEM</span>
        </div>
        <div
          className="stageOverlay interfaceOverlay"
          aria-hidden={phase !== 1}
          inert={phase !== 1}
        >
          <div className="interfaceImage">
            <Image
              src={urban.image}
              alt={urban.alt}
              width={1512}
              height={977}
              sizes="(max-width:767px) 72vw, 42vw"
            />
          </div>
          <div className="interfaceRoles">
            <span>ADMIN</span>
            <i />
            <span>WAREHOUSE</span>
            <i />
            <span>FRANCHISE</span>
          </div>
          <span className="objectFootnote">
            Actual prototype / Urbanfit Control Panel
          </span>
        </div>
        <div
          className="stageOverlay landmarkOverlay"
          aria-hidden={phase !== 2}
          inert={phase !== 2}
        >
          <span className="landmarkNotation">
            21 LANDMARKS
            <br />
            ONE HUMAN SIGNAL
          </span>
          <div className="continuousMessage">
            <label htmlFor="continuous-message">
              Model output → human control
            </label>
            <input
              id="continuous-message"
              defaultValue="Hello."
              maxLength={120}
              autoComplete="off"
            />
            <span>Editable example. No camera or live inference.</span>
          </div>
        </div>
        <div
          className="stageOverlay evidenceOverlay"
          aria-hidden={phase !== 3}
          inert={phase !== 3}
        >
          <div className="evidenceReadout">
            <div className="readoutHeader">
              <span>COMMUNICATION / PIPELINE</span>
              <span>03</span>
            </div>
            <div className="readoutRow">
              <small>01</small>
              <span>Dialogue</span>
              <code>source</code>
            </div>
            <div className="readoutRow">
              <small>02</small>
              <span>Annotated behaviors</span>
              <code>reference</code>
            </div>
            <div className="readoutRow">
              <small>03</small>
              <span>Supervised NLP</span>
              <code>prediction</code>
            </div>
            <div className="readoutRow">
              <small>04</small>
              <span>Human review</span>
              <code>interpretation</code>
            </div>
            <p>Calgary-Cambridge · NURSE</p>
          </div>
        </div>
        <div
          className="stageOverlay biasOverlay"
          aria-hidden={phase !== 4}
          inert={phase !== 4}
        >
          <span className="lensAnnotation">
            BIAS CHECKER
            <br />A CLOSER LOOK
          </span>
          <div className="biasLensContent">
            <span className="visualMicro">CLINICAL VIGNETTE</span>
            <h3>
              Read between
              <br />
              <em>the lines.</em>
            </h3>
            <div className="vignetteLines" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="biasLensTags">
              <span>Classify</span>
              <i aria-hidden="true">→</i>
              <span>Explain</span>
            </div>
          </div>
          <div className="biasServiceLabels">
            <span>RoBERTa + LoRA</span>
            <i />
            <span>GPT-4o</span>
          </div>
          <span className="objectFootnote">
            Model → explanation → human review
          </span>
        </div>
        <div
          className="stageOverlay pocketOverlay"
          aria-hidden={phase !== 5}
          inert={phase !== 5}
        >
          <div className="forecastHeading">
            <span className="visualMicro">
              POCKETSAVER / FINANCE & FORECASTING
            </span>
            <h3>
              A clearer view
              <br />
              <em>ahead.</em>
            </h3>
          </div>
          <div className="forecastPlot" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <div className="forecastSplit" />
            <span>ACTIVITY</span>
            <span>FORECAST</span>
          </div>
          <div className="forecastServices">
            <span>Web</span>
            <i>→</i>
            <span>API</span>
            <i>→</i>
            <span>Data</span>
            <i>→</i>
            <span>Prediction</span>
          </div>
          <span className="objectFootnote">
            Illustrative curve / not financial performance data
          </span>
        </div>
        <div className="continuousStageFooter">
          <span>
            <i aria-hidden="true" /> {storyStages[phase].caption}
          </span>
          <span>
            0{phase} / 0{lastStoryStage}
          </span>
          <div className="continuityProgress" aria-hidden="true">
            <i />
          </div>
        </div>
      </div>

      <div className="narrativeFlow">
        <section
          className="narrativeChapter narrativeIntro"
          data-story-chapter="0"
          id="intro"
        >
          <p className="narrativeKicker">
            <span className="liveDot" /> Shweta Sharma{" "}
            <span>/ Fullstack developer</span>
          </p>
          <h1>
            Human insight.
            <br />
            <em>Serious</em>
            <br />
            craft.
          </h1>
          <p className="narrativeLead">
            I turn the complicated parts
            <br />
            into the parts that just work.
          </p>
          <p className="narrativeBody">
            From the interface people touch to the APIs and models behind it.
            Built with a designer’s eye and a developer’s mind.
          </p>
          <div className="heroActions">
            <a className="narrativeAction" href="#work">
              Follow the thread <span aria-hidden="true">↓</span>
            </a>
            <HiringBrief />
          </div>
          <div className="heroCredentials">
            <span>
              MS <strong>AI & Machine Learning</strong>
            </span>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer">
              Résumé <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="introCoordinates">
            <span>PHILADELPHIA, PA</span>
            <span>DESIGN × DEVELOPMENT × ML</span>
          </div>
        </section>
        <section className="narrativeChapter" data-story-chapter="1" id="work">
          <p className="narrativeKicker">
            <span>01 / Urbanfit</span>
            <span>Product design</span>
          </p>
          <h2>
            Give complexity
            <br />
            <em>a structure.</em>
          </h2>
          <p className="narrativeLead">Three roles. One shared language.</p>
          <p className="narrativeBody">
            Administrators, warehouses, and franchise shops need different
            things from the same inventory. I designed role-specific dashboards
            around shared navigation and consistent interaction patterns.
          </p>
          <dl className="engineeringDetails">
            <div>
              <dt>My contribution</dt>
              <dd>UI/UX design · interaction system</dd>
            </div>
            <div>
              <dt>The decision</dt>
              <dd>Different views. Consistent rules.</dd>
            </div>
          </dl>
          <div className="proofNumbers">
            <span>
              <strong>30</strong>screens
            </span>
            <span>
              <strong>484</strong>interactions
            </span>
          </div>
          <Link className="narrativeAction" href={`/work/${urban.slug}/`}>
            Inside the project <span aria-hidden="true">↗</span>
          </Link>
          <p className="narrativeStack">
            Figma / Interaction design / Design systems
          </p>
        </section>
        <section
          className="narrativeChapter"
          data-story-chapter="2"
          id="gesturepro"
        >
          <p className="narrativeKicker">
            <span>02 / GesturePro</span>
            <span>Web + applied ML</span>
          </p>
          <h2>
            Give a gesture
            <br />
            <em>a voice.</em>
          </h2>
          <p className="narrativeLead">The prediction is only the beginning.</p>
          <p className="narrativeBody">
            I led UX and built the hand-landmark pipeline and classifier for a
            four-person capstone. The browser turns webcam input into editable
            text—because recognizing a sign means little if the signer can’t
            correct it.
          </p>
          <dl className="engineeringDetails">
            <div>
              <dt>My contribution</dt>
              <dd>UX lead · landmark pipeline · classifier</dd>
            </div>
            <div>
              <dt>The decision</dt>
              <dd>Keep correction inside the interaction.</dd>
            </div>
          </dl>
          <div className="proofNumbers">
            <span>
              <strong>21</strong>landmarks / frame
            </span>
            <span>
              <strong>6</strong>usability participants
            </span>
          </div>
          <Link className="narrativeAction" href={`/work/${gesture.slug}/`}>
            Trace the pipeline <span aria-hidden="true">↗</span>
          </Link>
          <p className="narrativeStack">
            Next.js / FastAPI / MediaPipe / TensorFlow
          </p>
          <SystemNotes system={gestureSystem} />
        </section>
        <section
          className="narrativeChapter"
          data-story-chapter="3"
          id="clinical"
        >
          <p className="narrativeKicker">
            <span>03 / Clinical communication</span>
            <span>NLP + evaluation</span>
          </p>
          <h2>
            Give intelligence
            <br />
            <em>some context.</em>
          </h2>
          <p className="narrativeLead">
            A result should be something you can question.
          </p>
          <p className="narrativeBody">
            At the American Board of Internal Medicine, I annotated clinical
            dialogue and trained a supervised NLP model to identify
            communication behaviors. The work connects predictions to a
            vocabulary reviewers can examine.
          </p>
          <dl className="engineeringDetails">
            <div>
              <dt>My contribution</dt>
              <dd>Reference data · supervised NLP</dd>
            </div>
            <div>
              <dt>The decision</dt>
              <dd>Make the behavior behind a prediction legible.</dd>
            </div>
          </dl>
          <div className="frameworkProof">
            <span>Calgary-Cambridge</span>
            <span>NURSE</span>
          </div>
          <Link className="narrativeAction" href={`/work/${clinical.slug}/`}>
            Examine the workflow <span aria-hidden="true">↗</span>
          </Link>
          <p className="narrativeStack">Python / NLP / Label Studio</p>
        </section>
        <section
          className="narrativeChapter"
          data-story-chapter="4"
          id="bias-checker"
        >
          <span id="engineering" className="storyAnchor" aria-hidden="true" />
          <p className="narrativeKicker">
            <span>04 / Bias Checker</span>
            <span>Full-stack + healthcare AI</span>
          </p>
          <h2>
            Bring the unseen
            <br />
            <em>into focus.</em>
          </h2>
          <p className="narrativeLead">A prediction needs an explanation.</p>
          <p className="narrativeBody">
            I solo-built a healthcare bias-detection system, from a fine-tuned
            RoBERTa classifier to a Flask API and Next.js interface. A separate
            explanation layer gives the finding context people can inspect.
          </p>
          <dl className="engineeringDetails">
            <div>
              <dt>My contribution</dt>
              <dd>Model · API · interface · deployment</dd>
            </div>
            <div>
              <dt>The decision</dt>
              <dd>Separate detection from explanation.</dd>
            </div>
          </dl>
          <div className="frameworkProof">
            <span>RoBERTa + LoRA</span>
            <span>GPT-4o</span>
          </div>
          <a
            className="narrativeAction"
            href={bias.repository}
            target="_blank"
            rel="noreferrer"
          >
            Explore the source <span aria-hidden="true">↗</span>
          </a>
          <p className="narrativeStack">
            Next.js / Flask / Hugging Face Spaces
          </p>
          <SystemNotes system={bias} />
        </section>
        <section
          className="narrativeChapter"
          data-story-chapter="5"
          id="pocketsaver"
        >
          <p className="narrativeKicker">
            <span>05 / PocketSaver</span>
            <span>Web + data + forecasting</span>
          </p>
          <h2>
            See the system.
            <br />
            <em>Look ahead.</em>
          </h2>
          <p className="narrativeLead">Follow a request all the way through.</p>
          <p className="narrativeBody">
            A finance application that connects a web interface, backend API,
            PostgreSQL database, and Python forecast service. Each part has a
            clear job, from capturing a request to returning a prediction.
          </p>
          <dl className="engineeringDetails">
            <div>
              <dt>The scope</dt>
              <dd>Web app · API · data · forecast service</dd>
            </div>
            <div>
              <dt>The decision</dt>
              <dd>Make service boundaries explicit.</dd>
            </div>
          </dl>
          <div className="serviceProof">
            <code>POST /api/forecast</code>
            <span>→</span>
            <code>POST /predict</code>
          </div>
          <a
            className="narrativeAction"
            href={pocket.repository}
            target="_blank"
            rel="noreferrer"
          >
            Follow the code <span aria-hidden="true">↗</span>
          </a>
          <p className="narrativeStack">
            Next.js / Node.js / PostgreSQL / Python / Docker
          </p>
          <SystemNotes system={pocket} />
        </section>
      </div>
      <nav className="continuityIndex" aria-label="Story chapters">
        {storyStages.map((stage, i) => (
          <a
            key={stage.id}
            href={`#${stage.id}`}
            aria-current={phase === i ? "step" : undefined}
          >
            <span>0{i}</span>
            {stage.label}
          </a>
        ))}
      </nav>
    </section>
  );
}
