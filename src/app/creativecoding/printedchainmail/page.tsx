import Image from "next/image";
import Link from "next/link";
import { LightboxProvider } from "../_shared/LightboxContext";
import Reveal from "../_shared/Reveal";
import Zoomable from "../_shared/Zoomable";
import ChainmailStlViewer from "./ChainmailStlViewer";

export default function PrintedChainmailPage() {
  return (
    <LightboxProvider>
      <main className="ktPage">
        <nav className="ktNav" aria-label="Primary navigation">
          <Link href="/">home</Link>
          <Link href="/creativecoding">back to all projects</Link>
        </nav>

        <h1 className="cmTitle">3D Printed Chainmail</h1>

        <div className="ktContainer">
          <section className="ktSection">
            <div className="ktOverviewGrid">
              <div className="ktOverviewText">
                <h2 className="ktHeading">Overview</h2>
                <p className="ktBody">
                  This project explores computational design and fabrication.
                  We created an automated pipeline that turns a given 3D
                  object input into flexible, 3D-printable chain-mail fabric.
                  The pieces are then able to be printed on FDM printers
                  without the need for supports.
                </p>
              </div>
              <div className="ktOverviewMeta">
                <div>
                  <p className="ktMetaLabel">Year</p>
                  <p className="ktMetaValue">2024</p>
                </div>
                <div>
                  <p className="ktMetaLabel">Role</p>
                  <p className="ktMetaValue">Computational Design Researcher</p>
                </div>
                <div>
                  <p className="ktMetaLabel">Collaborators</p>
                  <p className="ktMetaValue">Daniel Cui</p>
                  <p className="ktMetaValue">Audrey Ballarin</p>
                </div>
              </div>
            </div>
          </section>

          <section className="ktSection">
            <h2 className="ktHeading">Computational Approach</h2>

            <h3 className="ktSubheading">Step 1: 3D Input Cutting &amp; Flattening</h3>
            <p className="ktBody">
              The input objects are cut using a technique called Variational
              Surface Cutting (an algorithm that cuts a 3D surface mesh along
              optimal seam lines to unfold it into 2D patches with minimal
              geometric distortion).
            </p>
            <Reveal>
              <Zoomable
                src="/chainmailpics/chainmail-variational-cutting.png"
                alt="A sphere in a mesh-cutting tool with red seam lines marking where the surface will be cut"
              >
                <Image
                  className="cmStepImage"
                  src="/chainmailpics/chainmail-variational-cutting.png"
                  alt="A sphere in a mesh-cutting tool with red seam lines marking where the surface will be cut"
                  width={2048}
                  height={1130}
                  sizes="100vw"
                />
              </Zoomable>
            </Reveal>

            <p className="ktBody">
              The cut mesh is then flattened using Blender&apos;s Geometry
              Nodes system.
            </p>
            <Reveal className="cmImageRow cmImageRow--nowrap">
              <Zoomable
                src="/chainmailpics/chainmail-blender-geonodes.png"
                alt="Blender Geometry Nodes graph used to flatten the cut mesh"
              >
                <Image
                  className="cmRowImage"
                  src="/chainmailpics/chainmail-blender-geonodes.png"
                  alt="Blender Geometry Nodes graph used to flatten the cut mesh"
                  width={2048}
                  height={647}
                  sizes="(max-width: 720px) 240px, 700px"
                />
              </Zoomable>
              <Zoomable
                src="/chainmailpics/chainmail-blender-flat-meshes.png"
                alt="Four flattened 2D mesh patches resulting from the cut and unfold"
              >
                <Image
                  className="cmRowImage"
                  src="/chainmailpics/chainmail-blender-flat-meshes.png"
                  alt="Four flattened 2D mesh patches resulting from the cut and unfold"
                  width={1296}
                  height={1166}
                  sizes="(max-width: 720px) 90px, 250px"
                />
              </Zoomable>
            </Reveal>

            <h3 className="ktSubheading">Step 2: Remeshing</h3>
            <p className="ktBody">
              We want meshes as close to equilateral triangles and we were
              able to remesh them using Petteri Aimonen&apos;s Triangle Fill.
              We dealt with boundary cases manually.
            </p>
            <Reveal className="cmHighlight">
              <div className="cmImageRow">
                <figure>
                  <p className="ktColHeading">Before Remeshing</p>
                  <Zoomable
                    src="/chainmailpics/chainmail-before-remesh.png"
                    alt="Triangulated mesh patch before remeshing, with irregular triangle sizes"
                  >
                    <Image
                      className="cmRowImage"
                      style={{ height: "340px" }}
                      src="/chainmailpics/chainmail-before-remesh.png"
                      alt="Triangulated mesh patch before remeshing, with irregular triangle sizes"
                      width={1078}
                      height={996}
                      sizes="(max-width: 480px) 90vw, 400px"
                    />
                  </Zoomable>
                </figure>
                <figure>
                  <p className="ktColHeading">After Remeshing</p>
                  <Zoomable
                    src="/chainmailpics/chainmail-after-remesh.png"
                    alt="The same mesh patch after remeshing into near-equilateral triangles"
                  >
                    <Image
                      className="cmRowImage"
                      style={{ height: "340px" }}
                      src="/chainmailpics/chainmail-after-remesh.png"
                      alt="The same mesh patch after remeshing into near-equilateral triangles"
                      width={1168}
                      height={1004}
                      sizes="(max-width: 480px) 90vw, 400px"
                    />
                  </Zoomable>
                </figure>
              </div>
            </Reveal>

            <h3 className="ktSubheading">Step 3: Link Propagation</h3>
            <p className="ktBody">
              Our link design is a single petal spline, but when propagated
              over the equilateral triangles, turn into three petal splines.
              In order to propagate the links, we wrote a Python script that
              we plugged into Blender.
            </p>
            <Reveal className="cmTwoUp">
              <div>
                <p className="ktColHeading">Our Script</p>
                <Zoomable
                  src="/chainmailpics/chainmail-python-script.png"
                  alt="Python script that propagates petal splines across each mesh edge in Blender"
                >
                  <div className="cmImgBox">
                    <Image
                      fill
                      src="/chainmailpics/chainmail-python-script.png"
                      alt="Python script that propagates petal splines across each mesh edge in Blender"
                      sizes="50vw"
                    />
                  </div>
                </Zoomable>
              </div>
              <div>
                <p className="ktColHeading">Single Petal</p>
                <Zoomable
                  src="/chainmailpics/chainmail-single-petal.png"
                  alt="A single petal spline, the base unit of the link design"
                >
                  <div className="cmImgBox">
                    <Image
                      fill
                      src="/chainmailpics/chainmail-single-petal.png"
                      alt="A single petal spline, the base unit of the link design"
                      sizes="50vw"
                    />
                  </div>
                </Zoomable>
              </div>
            </Reveal>
            <Reveal className="cmTwoUp">
              <div>
                <p className="ktColHeading">Propagation</p>
                <Zoomable
                  src="/chainmailpics/chainmail-meshpiece.png"
                  alt="The single petal pattern propagated across the triangulated mesh"
                >
                  <div className="cmImgBox">
                    <Image
                      fill
                      src="/chainmailpics/chainmail-meshpiece.png"
                      alt="The single petal pattern propagated across the triangulated mesh"
                      sizes="50vw"
                    />
                  </div>
                </Zoomable>
              </div>
              <div>
                <p className="ktColHeading">Triple Petal</p>
                <ChainmailStlViewer
                  src="/chainmailpics/chainmail-link.stl"
                  poster="/chainmailpics/chainmail-link-static.png"
                />
              </div>
            </Reveal>
          </section>

          <section className="ktSection">
            <h2 className="ktHeading">Fabrication Approach</h2>

            <h3 className="ktSubheading">Goal 1: Link Mobility + Stability</h3>
            <p className="ktBody">
              We experimented with many types of links (including
              ModeClix-inspired snap-fits, H-bar, 3-bar, and 4/6-loop flower
              pattern) and landed on the 3 petal pattern we have as it was
              the best for printing. We also iterated over different infill
              density, retraction speed to achieve support-free FDM with
              tough PLA. Since we also explored SLA resin printing
              challenges, but SLA print bed size posed major constraint for
              large-scale objects, so we ultimately decided to continue our
              designs for FDM.
            </p>
            <Reveal>
              <Zoomable
                src="/chainmailpics/chainmail-printing-links.jpeg"
                alt="An FDM 3D printer mid-print of the chain-mail link pattern in black filament"
              >
                <Image
                  className="cmStepImage"
                  src="/chainmailpics/chainmail-printing-links.jpeg"
                  alt="An FDM 3D printer mid-print of the chain-mail link pattern in black filament"
                  width={2048}
                  height={1632}
                  sizes="100vw"
                />
              </Zoomable>
            </Reveal>

            <h3 className="ktSubheading">Goal 2: Print Bed Adhesion</h3>
            <p className="ktBody">
              The beginning links had an open-middle design with a higher
              chance of failure due to low surface area for adhesion, so we
              decided to connect the middle of the links. Our final
              iteration also had higher surface area by rounding and slicing
              the link to achieve a flat bottom for better adhesion.
            </p>
            <Reveal className="cmHighlight">
              <div className="cmImageRow">
                <figure>
                  <p className="ktColHeading">Open middle</p>
                  <Zoomable
                    src="/chainmailpics/chainmail-open-link.png"
                    alt="Link design with an open, disconnected middle"
                  >
                    <Image
                      className="cmRowImage"
                      src="/chainmailpics/chainmail-open-link.png"
                      alt="Link design with an open, disconnected middle"
                      width={1354}
                      height={1244}
                      sizes="(max-width: 720px) 160px, 250px"
                    />
                  </Zoomable>
                </figure>
                <figure>
                  <p className="ktColHeading">Low surface area</p>
                  <Zoomable
                    src="/chainmailpics/chainmail-design1-link.png"
                    alt="Link design with thin struts and low bed contact area"
                  >
                    <Image
                      className="cmRowImage"
                      src="/chainmailpics/chainmail-design1-link.png"
                      alt="Link design with thin struts and low bed contact area"
                      width={1102}
                      height={1000}
                      sizes="(max-width: 720px) 160px, 250px"
                    />
                  </Zoomable>
                </figure>
                <figure>
                  <p className="ktColHeading">Rounding the links</p>
                  <Zoomable
                    src="/chainmailpics/chainmail-design2-link.png"
                    alt="Link design with rounded petal loops"
                  >
                    <Image
                      className="cmRowImage"
                      src="/chainmailpics/chainmail-design2-link.png"
                      alt="Link design with rounded petal loops"
                      width={529}
                      height={559}
                      sizes="(max-width: 720px) 140px, 220px"
                    />
                  </Zoomable>
                </figure>
                <figure>
                  <p className="ktColHeading">Rounded bottom</p>
                  <Zoomable
                    src="/chainmailpics/chainmail-round-bottom.png"
                    alt="Close-up render of the rounded link bottoms"
                  >
                    <Image
                      className="cmRowImage"
                      src="/chainmailpics/chainmail-round-bottom.png"
                      alt="Close-up render of the rounded link bottoms"
                      width={823}
                      height={400}
                      sizes="(max-width: 720px) 300px, 460px"
                    />
                  </Zoomable>
                </figure>
                <figure>
                  <p className="ktColHeading">Slicing by -0.1mm</p>
                  <Zoomable
                    src="/chainmailpics/chainmail-sliced-link.png"
                    alt="Schematic showing the link sliced by -0.1mm to create a flat bottom"
                  >
                    <Image
                      className="cmRowImage"
                      src="/chainmailpics/chainmail-sliced-link.png"
                      alt="Schematic showing the link sliced by -0.1mm to create a flat bottom"
                      width={847}
                      height={496}
                      sizes="(max-width: 720px) 250px, 390px"
                    />
                  </Zoomable>
                </figure>
              </div>
            </Reveal>
          </section>

          <section className="ktSection">
            <h2 className="ktHeading">Successful 3D Propagation</h2>
            <Reveal>
              <ChainmailStlViewer
                src="/chainmailpics/chainmail-sheet.stl"
                poster="/chainmailpics/chainmail-sheet-static.png"
              />
            </Reveal>
          </section>

          <section className="ktSection">
            <Reveal className="cmHighlight">
              <p className="ktBody cmBodyLarge">
                For the entirety of the project, we used a sphere as our
                reference. We thought it would be fun to construct our demo
                as a lamp. We created a round base and draped our printed
                chain-mail pieces over the sphere, creating a half dome.
              </p>
              <Zoomable
                src="/chainmailpics/chainmail-lamp.png"
                alt="The finished chain-mail dome draped over a round base and lit from within, resembling a lamp"
              >
                <Image
                  className="cmStepImage"
                  src="/chainmailpics/chainmail-lamp.png"
                  alt="The finished chain-mail dome draped over a round base and lit from within, resembling a lamp"
                  width={639}
                  height={852}
                  sizes="(max-width: 720px) 100vw, 640px"
                />
              </Zoomable>
            </Reveal>
          </section>
        </div>
      </main>
    </LightboxProvider>
  );
}
