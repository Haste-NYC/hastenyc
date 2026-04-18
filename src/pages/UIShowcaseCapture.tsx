import { Suspense, lazy } from "react";

const UIShowcase = lazy(() => import("@/components/UIShowcase"));

export default function UIShowcaseCapture() {
  const params = new URLSearchParams(window.location.search);
  const staticCamera = params.get("static") === "1";
  const videoStart = Number(params.get("offset") ?? 0) || 0;
  const transparent = params.get("transparent") !== "0";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "transparent",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Suspense fallback={null}>
        <UIShowcase
          transparent={transparent}
          staticCamera={staticCamera}
          videoStart={videoStart}
        />
      </Suspense>
    </div>
  );
}
