import CreativeCodingView, { type CreativeCodingDisc } from "./CreativeCodingView";

const discs: CreativeCodingDisc[] = [
  {
    id: "kinetic-typography",
    color: "pink",
    title: "kinetic typography",
    description: [
      "a web app that turns any song into custom animated typography through audio processing and AI",
    ],
    href: "/creativecoding/kinetictypography",
  },
  {
    id: "printed-chainmail",
    color: "blue",
    title: "3d printed chainmail",
    description: ["a project exploring 3d meshing and printing by generating chain-mail links from a given input object"],
    href: "/creativecoding/printedchainmail",
  },
  {
    id: "interactive-installation",
    color: "orange",
    title: "interactive installation",
    description: ["a interactive art app that is responsive to environmental factors and motion control"],
    href: "/creativecoding/interactiveinstallation",
  },
];

export default function CreativeCodingPage() {
  return <CreativeCodingView discs={discs} />;
}
