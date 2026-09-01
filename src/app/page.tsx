import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="landing">
      <h1 className="title">selena zheng</h1>

      <div className="overlayFrame">
        <Image
          src="/landingpagepics/background.png"
          alt=""
          priority
          width={1280}
          height={832}
          className="bgBase"
        />

        <Link href="/creativecoding" className="layer computerGroup" aria-label="Creative coding">
          <Image
            src="/landingpagepics/comp.png"
            alt=""
            width={295}
            height={400}
            className="figureImage figureBase"
          />
          <Image
            src="/landingpagepics/comp-shadow.png"
            alt="Creative coding"
            width={295}
            height={400}
            className="figureImage figureHover"
          />
        </Link>

        <Link href="/sketchbook" className="layer drawingGroup" aria-label="Sketchbook">
          <Image
            src="/landingpagepics/draw.png"
            alt=""
            width={420}
            height={506}
            className="figureImage figureBase"
          />
          <Image
            src="/landingpagepics/draw-shadow.png"
            alt="Sketchbook"
            width={420}
            height={506}
            className="figureImage figureHover"
          />
        </Link>

        <Link href="/aboutme" className="layer standingGroup" aria-label="About me">
          <Image
            src="/landingpagepics/stand.png"
            alt=""
            width={238}
            height={611}
            className="figureImage figureBase"
          />
          <Image
            src="/landingpagepics/stand-shadow.png"
            alt="About me"
            width={238}
            height={611}
            className="figureImage figureHover"
          />
        </Link>
      </div>
    </main>
  );
}
