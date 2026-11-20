"use client";
import Image from "next/image";
import { useScrollScene } from "@/hooks/useScrollScene";

function SceneFooter({ phase, labels, detail }) {
  return (
    <div className="projectSceneFooter">
      <ol aria-label="Visual sequence">
        {labels.map((label, i) => (
          <li key={label} aria-current={phase === i ? "step" : undefined}>
            <span>0{i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <p>{detail[phase]}</p>
      <div className="sceneMeter" aria-hidden="true">
        <i />
      </div>
    </div>
  );
}

export function UrbanfitScene({ project }) {
  const { root, phase, reduced } = useScrollScene();
  return (
    <div
      ref={root}
      className="projectScroll urbanScroll"
      data-phase={phase}
      data-reduced={reduced}
    >
      <div className="projectPinned">
        <div className="sceneTopline">
          <span>Urbanfit / Interface architecture</span>
          <span>Scroll to bring the views together ↓</span>
        </div>
        <div className="urbanAssembly">
          <div className="assemblyGuide" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="assembledBrowser">
            <div className="browserBar">
              <span>● ● ●</span>
              <span>URBANFIT / CONTROL PANEL</span>
              <span>↗</span>
            </div>
            <Image
              src={project.image}
              alt={project.alt}
              width={1512}
              height={977}
              sizes="(max-width:767px) 85vw, 65vw"
            />
          </div>
          <div className="roleTile roleAdmin">
            <span className="tinyLabel">01 / Administrator</span>
            <h3>
              The whole
              <br />
              picture.
            </h3>
            <div className="miniChart" aria-hidden="true">
              {[35, 55, 40, 75, 60, 90, 72].map((height, i) => (
                <i key={i} style={{ height: `${height}%` }} />
              ))}
            </div>
            <p>Oversight & permissions</p>
          </div>
          <div className="roleTile roleWarehouse">
            <span className="tinyLabel">02 / Warehouse</span>
            <h3>
              Every item.
              <br />
              In its place.
            </h3>
            <div className="miniInventory" aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <p>Stock & movement</p>
          </div>
          <div className="roleTile roleShop">
            <span className="tinyLabel">03 / Franchise</span>
            <h3>
              A clearer
              <br />
              day-to-day.
            </h3>
            <div className="miniRows" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <p>Pricing & availability</p>
          </div>
        </div>
        <SceneFooter
          phase={phase}
          labels={["Separate needs", "Shared patterns", "One workspace"]}
          detail={[
            "Three roles, each with a different view of inventory.",
            "Common navigation and components connect those perspectives.",
            "The actual prototype: 30 screens and 484 interactions.",
          ]}
        />
      </div>
    </div>
  );
}

const landmarks = [
  [200, 352],
  [145, 278],
  [102, 227],
  [72, 185],
  [54, 147],
  [166, 221],
  [152, 146],
  [144, 91],
  [139, 48],
  [213, 205],
  [211, 119],
  [210, 62],
  [209, 25],
  [257, 216],
  [267, 139],
  [275, 84],
  [280, 48],
  [296, 242],
  [320, 186],
  [338, 146],
  [349, 117],
];
export function GestureScene() {
  const { root, phase, reduced } = useScrollScene();
  return (
    <div
      ref={root}
      className="projectScroll gestureScroll"
      data-phase={phase}
      data-reduced={reduced}
    >
      <div className="projectPinned">
        <div className="sceneTopline">
          <span>GesturePro / Motion into meaning</span>
          <span>Illustrated pipeline · no camera access</span>
        </div>
        <div className="gestureEvolution">
          <div className="handField">
            <div className="cameraCorners" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <svg
              viewBox="0 0 430 410"
              role="img"
              aria-label="Twenty-one scattered landmarks organize into a connected hand as you scroll"
            >
              <g
                className="handConnections"
                fill="none"
                stroke="#edbd9e"
                strokeWidth="1.2"
              >
                <path d="M200 352 145 278 102 227 72 185 54 147M200 352 166 221 152 146 144 91 139 48M166 221 213 205 211 119 210 62 209 25M213 205 257 216 267 139 275 84 280 48M257 216 296 242 320 186 338 146 349 117M296 242 200 352M166 221 102 227M213 205 200 352M257 216 200 352" />
              </g>
              {landmarks.map(([x, y], i) => (
                <g
                  className="handPoint"
                  key={i}
                  style={{
                    "--dx": `${Math.sin(i * 2.3) * 110}px`,
                    "--dy": `${Math.cos(i * 1.7) * 90}px`,
                  }}
                >
                  <circle cx={x} cy={y} r="4" fill="#f5d8b5" />
                  <circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill="none"
                    stroke="#edbd9e"
                    strokeOpacity=".2"
                  />
                </g>
              ))}
            </svg>
            <div className="handScan" aria-hidden="true" />
            <span className="handLegend">
              <i />
              21 hand landmarks / MediaPipe
            </span>
          </div>
          <div className="signalBridge" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>→</span>
          </div>
          <div className="messageShell">
            <div className="messageCore">
              <span className="tinyLabel">Human control / The final step</span>
              <h3>
                A prediction.
                <br />
                <em>Your message.</em>
              </h3>
              <label htmlFor="sample-message">Editable example — try it</label>
              <input
                id="sample-message"
                defaultValue="Hello."
                maxLength={120}
                autoComplete="off"
              />
              <p>The model suggests. The person can correct.</p>
              <span className="sampleNote">
                Illustration only. This is not live recognition.
              </span>
            </div>
          </div>
        </div>
        <SceneFooter
          phase={phase}
          labels={["Capture", "Connect", "Correct"]}
          detail={[
            "A webcam supplies the input.",
            "Hand landmarks give the classifier a structured signal.",
            "Editable text keeps the signer in charge of the message.",
          ]}
        />
      </div>
    </div>
  );
}

export function ClinicalScene() {
  const { root, phase, reduced } = useScrollScene();
  return (
    <div
      ref={root}
      className="projectScroll clinicalScroll"
      data-phase={phase}
      data-reduced={reduced}
    >
      <div className="projectPinned">
        <div className="sceneTopline">
          <span>Clinical communication / From dialogue to evidence</span>
          <span>Illustrative content</span>
        </div>
        <div className="clinicalEvolution">
          <div className="clinicalConnector" aria-hidden="true">
            <i />
          </div>
          <article className="evidenceCard dialogueCard">
            <div>
              <span className="tinyLabel">01 / The conversation</span>
              <h3>Listen closely.</h3>
              <div className="waveform" aria-hidden="true">
                {Array.from({ length: 30 }, (_, i) => (
                  <i
                    key={i}
                    style={{
                      height: `${10 + Math.abs(Math.sin(i * 1.7)) * 45}px`,
                      "--bar": i,
                    }}
                  />
                ))}
              </div>
              <blockquote>“What worries you most?”</blockquote>
              <p>Synthetic example dialogue</p>
            </div>
          </article>
          <article className="evidenceCard annotationCard">
            <div>
              <span className="tinyLabel">02 / The reference set</span>
              <h3>Find the behavior.</h3>
              <div className="annotationExample">
                <span>Question</span>
                <span>Emotion</span>
                <span>Context</span>
              </div>
              <p>Annotate dialogue against communication frameworks.</p>
              <span className="frameworkLabel">
                Label Studio / Reference data
              </span>
            </div>
          </article>
          <article className="evidenceCard reviewCard">
            <div>
              <span className="tinyLabel">03 / The review</span>
              <h3>Make it examinable.</h3>
              <div className="reviewSymbol" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <p>
                Connect predictions to named behaviors that a reviewer can
                examine.
              </p>
              <span className="frameworkLabel">Calgary-Cambridge / NURSE</span>
            </div>
          </article>
        </div>
        <SceneFooter
          phase={phase}
          labels={["Dialogue", "Annotation", "Review"]}
          detail={[
            "Start with the conversation, in context.",
            "Build a reference set before asking a model to identify behavior.",
            "Give reviewers a shared vocabulary for understanding predictions.",
          ]}
        />
      </div>
    </div>
  );
}
