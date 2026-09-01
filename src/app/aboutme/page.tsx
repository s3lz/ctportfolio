import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaLinkedinIn, FaSpotify } from "react-icons/fa";

const EMAIL = "selzheng@gmail.com";
const LINKEDIN_URL = "https://linkedin.com/in/selzheng";
const SPOTIFY_URL = "https://open.spotify.com/user/.selena.?si=4285586024f746f5";

export default function AboutMePage() {
  return (
    <main className="ktPage">
      <nav className="ktNav" aria-label="Primary navigation">
        <Link href="/">home</Link>
        <span className="creativeCodingNavGroup">
          <Link href="/creativecoding">creative coding</Link>
          <Link href="/sketchbook">sketchbook</Link>
        </span>
      </nav>

      <div className="amHero">
        <div className="ktContainer">
          <div className="amHeroGrid">
            <div className="amPhotos">
              <Image
                src="/aboutmepics/am-photo1.jpg"
                alt="Selena leaning against a wall by a window"
                width={1600}
                height={1200}
                sizes="(max-width: 900px) 100vw, 380px"
              />
              <Image
                src="/aboutmepics/am-photo2.jpg"
                alt="Selena sitting outside with a temporary tattoo on her arm"
                width={1600}
                height={1066}
                sizes="(max-width: 900px) 100vw, 380px"
              />
            </div>
            <div className="amText">
              <p>
                I am a software engineer and creative technologist from New
                York City with a background in music and a love for
                multimedia art.
              </p>
              <p>
                After studying computer science at Boston University and
                interning in front-end engineering and data engineering, I
                started working full time as a back-end software engineer.
                After 2 years of building distributed systems, I wanted to
                find a way to combine the things that I know how to do and
                love to do, coding and art. Through creative coding, I am
                able to use my software background to create visual and
                computational experiments.
              </p>
              <p>
                Outside of my job, I am usually playing guitar, drawing, or
                baking in my kitchen. You can also probably find me at a
                concert venue or at the park basking in the sun.
              </p>
              <p>
                (If we ever hop on a call, my cat, Harold Applejuice is a
                frequent guest)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="amConnect">
        <div className="ktContainer">
          <h2 className="amConnectHeading">Connect With Me</h2>
          <div className="amButtons">
            <a className="amButton" href={`mailto:${EMAIL}`}>
              <span className="amButtonIcon" aria-hidden="true">
                <FaEnvelope />
              </span>
              email me
            </a>
            <a
              className="amButton"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="amButtonIcon" aria-hidden="true">
                <FaLinkedinIn />
              </span>
              linkedin
            </a>
            <a
              className="amButton"
              href={SPOTIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="amButtonIcon" aria-hidden="true">
                <FaSpotify />
              </span>
              spotify
            </a>
          </div>
          <a
            className="amResumeLink"
            href="/resume/selena-zheng-resume.pdf"
            download
          >
            Download PDF Resume
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 4v12" />
              <path d="M6 12l6 6 6-6" />
              <path d="M4 20h16" />
            </svg>
          </a>
        </div>

        <Image
          className="amCat"
          src="/aboutmepics/am-cat.png"
          alt="Harold Applejuice, a tabby cat, sitting and looking up"
          width={1271}
          height={3017}
          sizes="260px"
        />
      </div>
    </main>
  );
}
