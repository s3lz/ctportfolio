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

      <div className="landingMobile">
        <h1 className="titleMobile">selena zheng</h1>

        <div className="mobileSplice mobileSplice--1">
          <div className="mobileSpliceScene mobileSpliceScene--1">
            <Image
              src="/landingpagepics/background.png"
              alt=""
              width={1280}
              height={832}
              className="mobileSceneBg"
            />
            <Link
              href="/creativecoding"
              className="mobileFigure mobileComputerGroup"
              aria-label="Projects"
            >
              <Image
                src="/landingpagepics/comp.png"
                alt=""
                width={295}
                height={400}
                className="mobileFigureImage"
              />
            </Link>
          </div>
          <Link href="/creativecoding" className="mobileSpliceLabel mobileSpliceLabel--1">
            projects
          </Link>
        </div>

        <div className="mobileSplice mobileSplice--2">
          <div className="mobileSpliceScene mobileSpliceScene--2">
            <Image
              src="/landingpagepics/background.png"
              alt=""
              width={1280}
              height={832}
              className="mobileSceneBg"
            />
            <Link
              href="/sketchbook"
              className="mobileFigure mobileDrawingGroup"
              aria-label="Sketchbook"
            >
              <Image
                src="/landingpagepics/draw.png"
                alt=""
                width={420}
                height={506}
                className="mobileFigureImage"
              />
            </Link>
          </div>
          <Link href="/sketchbook" className="mobileSpliceLabel mobileSpliceLabel--2">
            sketchbook
          </Link>
        </div>

        <div className="mobileSplice mobileSplice--3">
          <div className="mobileSpliceScene mobileSpliceScene--3">
            <Image
              src="/landingpagepics/background.png"
              alt=""
              width={1280}
              height={832}
              className="mobileSceneBg"
            />
            <Link
              href="/aboutme"
              className="mobileFigure mobileStandingGroup"
              aria-label="About me"
            >
              <Image
                src="/landingpagepics/stand.png"
                alt=""
                width={238}
                height={611}
                className="mobileFigureImage"
              />
            </Link>
          </div>
          <Link href="/aboutme" className="mobileSpliceLabel mobileSpliceLabel--3">
            about me
          </Link>
        </div>
      </div>
    </main>
  );
}
