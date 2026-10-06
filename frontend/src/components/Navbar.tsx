import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
      <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand to-sky"><i className="h-2.5 w-2.5 rounded-full bg-white" /></span>
        KeyBoost AI
      </Link>
      <div className="hidden gap-7 text-sm text-mute md:flex">
        <Link href="/">Home</Link><Link href="/#how">How it works</Link><Link href="/#features">Features</Link><Link href="/#about">About</Link>
      </div>
      <Link href="/" className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-white shadow-lg shadow-brand/30">Get started</Link>
    </nav>
  );
}
