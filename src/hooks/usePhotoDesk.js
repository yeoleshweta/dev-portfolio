"use client";

import { useRef } from "react";

// Keep pointer movement out of React's render cycle. Only the dragged print moves.
export function usePhotoDesk(desk, mode) {
  const gesture = useRef(null);
  const suppressClick = useRef(false);
  const offsets = useRef(new Map());

  function reset() {
    offsets.current.clear();
    desk.current?.querySelectorAll(".galleryMovable").forEach((element) => {
      element.style.removeProperty("--drag-x");
      element.style.removeProperty("--drag-y");
    });
  }

  function onPointerDown(event, index) {
    suppressClick.current = false;
    if (
      mode !== "scattered" ||
      event.button !== 0 ||
      event.pointerType === "touch" ||
      !window.matchMedia("(min-width: 768px)").matches
    ) return;
    const button = event.currentTarget;
    const bounds = desk.current.getBoundingClientRect();
    const rect = button.getBoundingClientRect();
    const offset = offsets.current.get(index) ?? { x: 0, y: 0 };
    gesture.current = {
      index, button, movable: button.parentElement,
      startX: event.clientX, startY: event.clientY, offset,
      minX: bounds.left - rect.left + 12,
      maxX: bounds.right - rect.right - 12,
      minY: bounds.top - rect.top + 12,
      maxY: bounds.bottom - rect.bottom - 12,
      moved: false,
    };
    button.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    const drag = gesture.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    drag.moved = true;
    drag.button.dataset.dragging = "true";
    const x = drag.offset.x + Math.max(drag.minX, Math.min(drag.maxX, dx));
    const y = drag.offset.y + Math.max(drag.minY, Math.min(drag.maxY, dy));
    drag.movable.style.setProperty("--drag-x", `${x}px`);
    drag.movable.style.setProperty("--drag-y", `${y}px`);
    offsets.current.set(drag.index, { x, y });
  }

  function onPointerUp(event) {
    const drag = gesture.current;
    if (!drag) return;
    suppressClick.current = drag.moved;
    delete drag.button.dataset.dragging;
    gesture.current = null;
    if (drag.button.hasPointerCapture(event.pointerId)) {
      drag.button.releasePointerCapture(event.pointerId);
    }
  }

  function shouldOpen(event) {
    // Keyboard activation must work even immediately after a pointer gesture.
    if (event.detail !== 0 && suppressClick.current) {
      suppressClick.current = false;
      return false;
    }
    return true;
  }

  return { onPointerDown, onPointerMove, onPointerUp, shouldOpen, reset };
}
