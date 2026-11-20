"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gallery } from "@/content/gallery";
import { usePhotoDesk } from "@/hooks/usePhotoDesk";
import { useGalleryViewer } from "@/hooks/useGalleryViewer";

// Art-directed positions in container-width units. The same prints rearrange.
const placements = [
  { x: 4, y: 13, width: 22, angle: -8, ratio: ".82", entry: 9 },
  { x: 37, y: 1, width: 19, angle: 7, ratio: "1.1", entry: -12 },
  { x: 75, y: 9, width: 22, angle: 8, ratio: "1.22", entry: -10 },
  { x: 17, y: 46, width: 21, angle: -6, ratio: "1.22", entry: 10 },
  { x: 69, y: 42, width: 18, angle: 8, ratio: ".95", entry: -8 },
];

export function PersonalGallery() {
  const [mode, setMode] = useState("scattered");
  const [front, setFront] = useState(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const desk = useRef(null);
  const drag = usePhotoDesk(desk, mode);
  const viewer = useGalleryViewer(desk, gallery.length);
  const photo = viewer.selected === null ? null : gallery[viewer.selected];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.intersectionRatio > 0.6) {
          setMobileIndex(Number(entry.target.dataset.index));
        }
      }
    }, { root: desk.current, threshold: 0.6 });
    desk.current.querySelectorAll(".galleryPrint").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  function changeMode(next) {
    drag.reset();
    setFront(null);
    setMode(next);
  }

  function scrollPhoto(direction) {
    const index = Math.max(0, Math.min(gallery.length - 1, mobileIndex + direction));
    const target = desk.current.children[index];
    desk.current.scrollTo({
      left: target.offsetLeft - desk.current.offsetLeft - 20,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <section className="photoGallery" id="gallery" aria-labelledby="gallery-title" data-mode={mode}>
      <div className="galleryToolbar wrap">
        <p className="eyebrow">06 / Collected moments</p>
        <span className="galleryEdition">PERSONAL ARCHIVE · VOL. 01</span>
        <div className="galleryMode" role="group" aria-label="Arrange photographs">
          <button aria-pressed={mode === "scattered"} onClick={() => changeMode("scattered")}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m3 6 6-2 2 8-6 2zM12 4l5 2-3 9-3-1" /></svg>
            Scattered
          </button>
          <button aria-pressed={mode === "ordered"} onClick={() => changeMode("ordered")}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 4h5v12H3zM12 4h5v12h-5z" /></svg>
            In order
          </button>
        </div>
      </div>

      <div className="galleryComposition">
        <div className="galleryHeading">
          <span className="galleryOverline">THERE’S A PERSON BEHIND THE PIXELS.</span>
          <h2 id="gallery-title">Life, in<br /><em>the margins.</em></h2>
          <p>A few things that don’t fit on a résumé.</p>
          <span className="galleryDeskHint"><span className="galleryDragHint">Drag a print. Follow a detour.</span><span className="gallerySwipeHint">Swipe to wander. Tap to look closer.</span></span>
        </div>
        <div className="galleryDesk" ref={desk} aria-label="Personal photographs">
          {gallery.map((item, index) => {
            const position = placements[index];
            return (
              <div
                key={item.src}
                className="galleryPrint"
                data-index={index}
                data-front={front === index}
                style={{
                  "--x": position.x, "--y": position.y,
                  "--print-width": position.width, "--angle": `${position.angle}deg`,
                  "--image-ratio": position.ratio, "--entry-angle": `${position.entry}deg`,
                  "--order-x": 3 + index * 19.2, "--order-scale": 17.2 / position.width,
                }}
              >
                <div className="galleryDrift">
                  <div className="galleryMovable">
                    <button
                      className="galleryCard"
                      aria-label={`Open photo: ${item.title}`}
                      aria-haspopup="dialog"
                      onPointerDown={(event) => { setFront(index); drag.onPointerDown(event, index); }}
                      onPointerMove={drag.onPointerMove}
                      onPointerUp={drag.onPointerUp}
                      onPointerCancel={drag.onPointerUp}
                      onLostPointerCapture={drag.onPointerUp}
                      onFocus={() => setFront(index)}
                      onClick={(event) => {
                        if (!drag.shouldOpen(event)) return;
                        viewer.open(index, event.currentTarget);
                      }}
                    >
                      <span className="galleryImage">
                        <Image src={item.src} alt={item.alt} width={900} height={1600}
                          draggable={false} sizes="(max-width: 767px) 82vw, 26vw"
                          style={{ objectPosition: item.position }} />
                        <span className="galleryExpand" aria-hidden="true">↗</span>
                      </span>
                      <span className="galleryCaption"><small>0{index + 1}</small><strong>{item.title}</strong></span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <span className="gallerySideNote" aria-hidden="true">A CAMERA ROLL, NOT A HIGHLIGHT REEL.</span>
        <span className="galleryDeskMark" aria-hidden="true">S.S. <i>off duty</i></span>
      </div>

      <div className="galleryColophon wrap">
        <span className="galleryCollectionCount"><i aria-hidden="true" />05 moments. A little more me.</span>
        <span className="galleryDesktopHint">CLICK ANY PHOTOGRAPH TO LOOK CLOSER</span>
        <button className="galleryReset" onClick={() => changeMode("scattered")}>Reset the desk <span aria-hidden="true">↺</span></button>
        <div className="galleryMobileControls">
          <button aria-label="Previous photograph in collection" disabled={mobileIndex === 0} onClick={() => scrollPhoto(-1)}>←</button>
          <span aria-live="polite">0{mobileIndex + 1} / 05</span>
          <button aria-label="Next photograph in collection" disabled={mobileIndex === gallery.length - 1} onClick={() => scrollPhoto(1)}>→</button>
        </div>
      </div>

      <dialog
        ref={viewer.dialog}
        className="galleryDialog"
        aria-labelledby="gallery-photo-title"
        onCancel={(event) => { event.preventDefault(); viewer.close(); }}
        onClick={(event) => { if (event.target === event.currentTarget) viewer.close(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); viewer.move(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); viewer.move(-1); }
        }}
      >
        {photo && (
          <>
            <div className="galleryVeil" aria-hidden="true" onClick={viewer.close} />
            <div className="galleryViewer">
              <div className="galleryViewerTop galleryViewerChrome">
                <span>COLLECTED MOMENTS / 0{viewer.selected + 1} OF 05</span>
                <button className="galleryViewerClose" aria-label="Close photo gallery" onClick={viewer.close} autoFocus>
                  <span>Back to the desk</span><i aria-hidden="true">×</i>
                </button>
              </div>
              <div ref={viewer.stage} className="galleryImageStage" onClick={(event) => { if (event.target === event.currentTarget) viewer.close(); }}>
                <button ref={viewer.hero} className="galleryHero" aria-label="Return photo to gallery" onClick={viewer.close}>
                  <Image ref={viewer.image} key={photo.src} src={photo.src} alt={photo.alt}
                    width={900} height={1600} sizes="90vw" loading="eager" draggable={false} />
                </button>
              </div>
              <div className="galleryViewerBottom galleryViewerChrome">
                <div aria-live="polite"><h3 id="gallery-photo-title">{photo.title}</h3><p>{photo.caption}</p></div>
                <div className="galleryControls">
                  <button aria-label="Previous photo" onClick={() => viewer.move(-1)}>←</button>
                  <span aria-hidden="true">0{viewer.selected + 1} / 05</span>
                  <button aria-label="Next photo" onClick={() => viewer.move(1)}>→</button>
                </div>
              </div>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
