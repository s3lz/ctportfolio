import Image from "next/image";
import Link from "next/link";
import KtSongPlayer from "./KtSongPlayer";

const SITE_URL = "https://kinetictypography-81sl.vercel.app";
const FOOTER_NOTES = "♫⋆｡♪ ₊˚♬ ".repeat(20);

const AUDIO_FEATURES_SNIPPET = `audioFeatures: {
  tempo: 59,
  energy: 0.6623124791449396,
  brightness: 0.05981839877616014,
  density: 0.1203168558487665,
  dynamics: 0.7157738456383201,
  semanticProfile: {
    moodHints: [Array],
    textureHints: [Array],
    spaceHints: [Array],
    motionHints: [Array],
    instrumentation: [Array]
  }
},
tempoInterpretation: {
  detectedTempo: 117,
  normalizedTempo: 59,
  tempoConfidence: 0.7931237164347841,
  correctionMultiplier: 2
}`;

const ANALYSIS_SIGNALS_SNIPPET = `analysisSignals: {
  tempo: 180,
  energy: 0.05981839877616014,
  brightness: 0.1203168558487665,
  density: 0.7157738456383201,
  dynamics: 0.6080280241679044,
  spectralFlatness: 0.09928094467625,
  transientSharpness: 0.6341679368335489,
  stereoWidth: 0.0879260190598982,
  silenceRatio: 0.3272099447513812,
  beatCadence: 0.14375,
  phraseCadence: 0.662897777463621,
  harmonicStability: 0.5143769746336088,
  repetitionScore: 0.7910811808228528,
  focalStability: 0.75,
  layerSpread: 0.35496481626270526,
  onsetClustering: 0.13540365644186553,
  centroidVariance: 0.6928,
  rmsVariance: 0.048326620141880199,
  subEnergy: 0.13450205000048754,
  highEnergy: 0.1345020500048754
}`;

const PROMPT_SNIPPET = `prompt: You are designing a KINETIC TYPOGRAPHY ENGINE

CORE PIPELINE:
Audio → Physical forces → Typography behavior → Animation mechanics → Color relationship → Render parameters

Font metadata affects ONLY: structural rigidity, density, stroke behavior, spacing tolerance
Font metadata does NOT determine: color, genre, mood, environment

(there is a lot more determining movement and colors, but these are just some information put into the prompt to guide the LLM toward something palatable)`;

const RESPONSE_SNIPPET = `visualWorld: {
  field: "Deep, velvety ambient field with subtle implied depth.",
  lighting: "Soft, diffused light originating gently from the text field, creating a warm, internal glow against the dark field.",
  material: "Text: Polished, warm organic surface with a subtle internal luminescence. Background: Matte, fine-textured 'velvet'.",
  description: "A deep, soft, subtly textured space where the typography is the singular, glowing focus, enhancing its intimate and warm presence without creating a literal scene."
}`;

export default function KineticTypographyPage() {
  return (
    <main className="ktPage">
      <nav className="ktNav" aria-label="Primary navigation">
        <Link href="/">home</Link>
        <Link href="/creativecoding">back to all projects</Link>
      </nav>

      <div className="ktBanner">
        <Image
          src="/kinetictypographypics/kt-banner.png"
          alt="Kinetic Typography — generate motion typography through audio"
          width={3456}
          height={996}
          sizes="100vw"
          priority
        />
      </div>

      <div className="ktContainer">
        <section className="ktSection">
          <div className="ktOverviewGrid">
            <div className="ktOverviewText">
              <h2 className="ktHeading">Overview</h2>
              <p className="ktBody">
                Kinetic Typography is a web app that is able to turn audio into
                custom animated typography. The app analyzes audio, then uses AI
                to interpret mood and rhythm as visual design, letting you refine
                and export the result as video.
              </p>
            </div>
            <div className="ktOverviewMeta">
              <div>
                <p className="ktMetaLabel">Year</p>
                <p className="ktMetaValue">2026</p>
              </div>
              <div>
                <p className="ktMetaLabel">Role</p>
                <p className="ktMetaValue">Creator</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ktSection">
          <div className="ktVideoFrame">
            <video controls autoPlay muted loop playsInline preload="auto">
              <source src="/kinetictypographypics/kt-demo.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        <section className="ktSection">
          <h2 className="ktHeading">Example using song I created</h2>
          <KtSongPlayer
            src="/kinetictypographypics/kt-song.wav"
            title="heartbeat (alive)"
          />

          <div className="ktTwoCol">
            <div>
              <p className="ktColHeading">AI generated base</p>
              <div className="ktVideoFrame">
                <video controls autoPlay muted loop playsInline preload="auto">
                  <source src="/kinetictypographypics/kt-ai-base.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div>
              <p className="ktColHeading">My edits</p>
              <div className="ktVideoFrame">
                <video controls autoPlay muted loop playsInline preload="auto">
                  <source src="/kinetictypographypics/kt-my-edits.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>

        <section className="ktSection">
          <h2 className="ktHeading">Process</h2>

          <h3 className="ktSubheading">Why I built this</h3>
          <p className="ktBody">
            After being settled into working full-time as a backend engineer, I
            wanted to build a project that would allow me to explore web design.
            I knew I didn&apos;t want to build a traditional application, but rather
            something for fun. As someone who has always been drawn to
            audio-visual projects, I wanted to explore how AI deals with
            multi-media. I find audio-visual design to be something very human
            and sensual, and I was curious how AI would approach it. I also
            wanted the option to tweak it at the end in case the user doesn&apos;t
            agree with the AI generation, which I imagine would be most of the
            time. A big factor of this is also my curiosity of how AI would
            interpret audio that I have personally created.
          </p>

          <h3 className="ktSubheading">How I built this</h3>
          <p className="ktBody">
            Technology stack: Figma, Cursor, Vercel, Gemini API
          </p>

          <div className="ktFlowPanel">
            <Image
              className="ktFlowImage"
              src="/kinetictypographypics/kt-flow.png"
              alt="Pipeline: audio input to audio info extraction to LLM processing via the Gemini API to video generation, then to either user edits or a direct export"
              width={3065}
              height={642}
              sizes="100vw"
            />
          </div>

          <p className="ktBody">
            The bulk of the heavy processing happens between the audio
            extraction and the LLM processing. Since an LLM isn&apos;t actually
            able to &quot;listen&quot; to audio, it has to be broken down into micro data
            to be fed into AI for further processing.
          </p>

          <p className="ktBody">
            For example, the audio processor may output information like this:
          </p>

          <div className="ktCodeGrid">
            <pre className="ktCodeBlock">{AUDIO_FEATURES_SNIPPET}</pre>
            <pre className="ktCodeBlock">{ANALYSIS_SIGNALS_SNIPPET}</pre>
          </div>

          <p className="ktBody">
            With this information, the AI (Gemini) is able to generate
            its response based on the prompt given.
          </p>

          <div className="ktPromptGrid">
            <div>
              <p className="ktColHeading">Snippets of prompt</p>
              <pre className="ktPromptBlock">{PROMPT_SNIPPET}</pre>
            </div>
            <div>
              <p className="ktColHeading">Example of response</p>
              <pre className="ktPromptBlock">{RESPONSE_SNIPPET}</pre>
            </div>
          </div>
        </section>

        <section className="ktSection">
          <h2 className="ktHeading">Website Design</h2>

          <div className="ktPalette" aria-hidden="true">
            <span className="ktSwatch" style={{ background: "#eaedf5" }} />
            <span className="ktSwatch" style={{ background: "#ede2e1" }} />
            <span className="ktSwatch" style={{ background: "#fdf6ef" }} />
            <span className="ktSwatch" style={{ background: "#9c4a49" }} />
          </div>

          <Image
            className="ktDesignImage"
            src="/kinetictypographypics/kt-figma-main.png"
            alt="Kinetic Typography site design: landing and upload, how it works, contact, generating state, and the user control / editor page"
            width={2144}
            height={1380}
            sizes="100vw"
          />

          <div className="ktComponentsGrid">
            <Image
              src="/kinetictypographypics/kt-components-1.png"
              alt="Kinetic Typography component library: generating state animation, wordmark, upload and export buttons"
              width={1204}
              height={880}
              sizes="50vw"
            />
            <Image
              src="/kinetictypographypics/kt-components-2.png"
              alt="Kinetic Typography component library: transport controls, color picker, loading bar, sliders, and exporting screen"
              width={1414}
              height={1246}
              sizes="50vw"
            />
          </div>
        </section>
      </div>

      <footer className="ktFooter">
        <span className="ktFooterNotes" aria-hidden="true">
          {FOOTER_NOTES}
        </span>
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
          go to site
        </a>
        <span className="ktFooterNotes" aria-hidden="true">
          {FOOTER_NOTES}
        </span>
      </footer>
    </main>
  );
}
