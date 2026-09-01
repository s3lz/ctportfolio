import Image from "next/image";
import Link from "next/link";
import { LightboxProvider } from "../_shared/LightboxContext";
import Reveal from "../_shared/Reveal";
import Zoomable from "../_shared/Zoomable";

const GITHUB_URL = "https://github.com/MikeTheMichaelS/Synth-Sense";
const WEBSITE_URL = "https://synth-sense1.web.app/";

export default function InteractiveInstallationPage() {
  return (
    <LightboxProvider>
      <main className="ktPage">
        <nav className="ktNav" aria-label="Primary navigation">
          <Link href="/">home</Link>
          <Link href="/creativecoding">back to all projects</Link>
        </nav>

        <div className="ktContainer">
          <div className="iiBannerRow">
            <Image
              className="iiBannerBlob"
              src="/interactiveinstallationpics/ii-logo.png"
              alt="Synth-Sense logo: an orange blob"
              width={1800}
              height={1800}
              sizes="(max-width: 720px) 190px, 300px"
            />
            <h1 className="iiBannerTitle">Interactive Art Installation</h1>
          </div>

          <section className="ktSection">
            <div className="ktOverviewGrid">
              <div className="ktOverviewText">
                <h2 className="ktHeading">Overview</h2>
                <p className="ktBody">
                  Synth-Sense is an interactive art installation responds to
                  real-time data, such as weather, noise, and motion. The
                  project adapts to the environment while engaging with the
                  audience by providing information about the weather. The
                  aim is to make conference rooms or other open spaces more
                  interesting by providing clean, minimal art without
                  interfering with work.
                </p>
              </div>
              <div className="ktOverviewMeta">
                <div>
                  <p className="ktMetaLabel">Year</p>
                  <p className="ktMetaValue">2023</p>
                </div>
                <div>
                  <p className="ktMetaLabel">Role</p>
                  <p className="ktMetaValue">Software Engineer</p>
                </div>
                <div>
                  <p className="ktMetaLabel">Collaborators</p>
                  <p className="ktMetaValue">Jack Campbell</p>
                  <p className="ktMetaValue">Mustafa Taybah</p>
                  <p className="ktMetaValue">Michael Sun</p>
                </div>
              </div>
            </div>

            <Reveal style={{ marginTop: "56px" }}>
              <Zoomable
                src="/interactiveinstallationpics/ii-weather-demo.png"
                alt="Live demo: a weather-reactive blob with orbiting circles, a sunrise/temperature/sunset readout, and a live clock"
              >
                <Image
                  className="iiDemoImage"
                  src="/interactiveinstallationpics/ii-weather-demo.png"
                  alt="Live demo: a weather-reactive blob with orbiting circles, a sunrise/temperature/sunset readout, and a live clock"
                  width={1139}
                  height={583}
                  sizes="100vw"
                />
              </Zoomable>
            </Reveal>
          </section>

          <section className="ktSection">
            <h2 className="ktHeading">Tools and Libraries</h2>
            <p className="ktBody">
              The most complex part of the project was the utilization of
              machine learning libraries and learning p5.js. Although
              technically a full-stack project, the front-end portion is the
              major portion of this webapp.
            </p>

            <h3 className="ktSubheading">Frontend</h3>
            <p className="ktBody">Framework: React</p>
            <p className="ktBody">Libraries:</p>
            <ul className="iiList">
              <li>
                p5.js (react-p5) drives the visual rendering and particle
                behaviors
              </li>
              <li>
                ml5.js library is a machine learning library used in this
                project to track camera based interactions and detecting
                human motions
              </li>
              <li>Axios is used to fetch weather data and handle HTTP requests</li>
            </ul>

            <h3 className="ktSubheading">Backend</h3>
            <p className="ktBody">Node.js</p>

            <a
              className="iiRepoRow"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <video
                className="iiRepoBlob"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source
                  src="/interactiveinstallationpics/ii-movingblob.mp4"
                  type="video/mp4"
                />
              </video>
              <span>view Github repository</span>
            </a>
          </section>

          <section className="ktSection">
            <h2 className="ktHeading">How It Works</h2>
            <p className="ktBody">
              The web application features a main moving blob that responds
              to different factors. It is camera enabled, and moves around
              based on the position of the person in front of it. Our team
              also decided that it could have a hardware component, with a
              RaspberryPi to capture human movement instead.
            </p>

            <p className="ktColHeading">System Diagram</p>
            <Reveal>
              <Zoomable
                src="/interactiveinstallationpics/ii-tech-diagram.png"
                alt="System diagram: a RaspberryPi with a sensor and processing algorithm feeding an image to a display and to a server's file system, served via HTTP to the browser"
              >
                <Image
                  className="iiDemoImage iiDemoImage--small"
                  src="/interactiveinstallationpics/ii-tech-diagram.png"
                  alt="System diagram: a RaspberryPi with a sensor and processing algorithm feeding an image to a display and to a server's file system, served via HTTP to the browser"
                  width={796}
                  height={533}
                  sizes="100vw"
                />
              </Zoomable>
            </Reveal>

            <p className="ktBody">
              The blob changes color based on the current weather, with
              cooler weather showing a bluer hue versus hot weather showing
              an orange hue.
            </p>
            <Reveal className="iiBlobRow">
              <Zoomable
                src="/interactiveinstallationpics/ii-blueblob.png"
                alt="The blob in a cool blue hue for cold weather"
              >
                <Image
                  className="iiBlobImage"
                  src="/interactiveinstallationpics/ii-blueblob.png"
                  alt="The blob in a cool blue hue for cold weather"
                  width={1098}
                  height={1089}
                  sizes="(max-width: 480px) 60vw, 230px"
                />
              </Zoomable>
              <Zoomable
                src="/interactiveinstallationpics/ii-orangeblob.png"
                alt="The blob in a warm orange hue for hot weather"
              >
                <Image
                  className="iiBlobImage"
                  src="/interactiveinstallationpics/ii-orangeblob.png"
                  alt="The blob in a warm orange hue for hot weather"
                  width={858}
                  height={897}
                  sizes="(max-width: 480px) 55vw, 220px"
                />
              </Zoomable>
            </Reveal>

            <p className="ktBody">
              The motion tracking of the app moves the blob where the person
              is on camera, while hand motion is able to reveal details
              hidden little circles on the page. The little circle reveals
              information such as weather and the ambient noise levels of
              the environment.
            </p>
            <Reveal className="iiVideoInput">
              <video controls preload="metadata">
                <source
                  src="/interactiveinstallationpics/ii-decibels.mp4"
                  type="video/mp4"
                />
              </video>
            </Reveal>
          </section>
        </div>

        <footer className="iiFooter">
          <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer">
            go to website
          </a>
        </footer>
      </main>
    </LightboxProvider>
  );
}
