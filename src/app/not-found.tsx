import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="font-display text-4xl sm:text-5xl mb-4">
        This page does not exist
      </h1>
      <p className="text-[#666666] mb-8">
        The thread you followed has ended.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center h-12 px-8 bg-black text-white text-sm font-semibold hover:bg-black/90 transition-colors"
      >
        Return home
      </Link>
    </div>
  );
}
