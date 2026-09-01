import Link from "next/link";

type CreativeCodingProjectPageProps = {
  title: string;
};

export default function CreativeCodingProjectPage({
  title,
}: CreativeCodingProjectPageProps) {
  return (
    <main className="creativeCoding is-project">
      <div className="creativeCodingFrame">
        <nav className="creativeCodingNav" aria-label="Primary navigation">
          <Link href="/">home</Link>
          <span className="creativeCodingNavGroup">
            <Link href="/creativecoding">back to all projects</Link>
          </span>
        </nav>

        <header className="creativeCodingHeader">
          <h1>{title}</h1>
        </header>
      </div>
    </main>
  );
}
