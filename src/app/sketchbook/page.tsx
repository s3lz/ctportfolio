import { getSketches } from "./getSketches";
import SketchbookView from "./SketchbookView";

export default function SketchbookPage() {
  const sketches = getSketches();
  return <SketchbookView sketches={sketches} />;
}
