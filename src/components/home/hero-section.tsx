import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="main-content"
      className="relative min-h-[46rem] overflow-hidden bg-[#302d2a] text-white md:min-h-screen"
    >
      <Image
        src="/hero-editorial.jpg"
        alt="Model in colorful sunglasses and a red top against a deep teal sky"
        fill
        preload
        sizes="100vw"
        className="object-cover object-[58%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/30" />
      <div className="page-shell relative flex min-h-[46rem] items-end pb-12 pt-36 md:min-h-screen md:pb-16">
        <div className="max-w-[55rem]">
          <p className="type-label mb-5">Autumn / Winter 2026</p>
          <h1 className="type-display max-w-[10ch]">Form, found in motion.</h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/collections"
              className="button button-fluid-mobile bg-white text-ink hover:bg-[#e8e6e0]"
            >
              Shop the collection
            </Link>
            <a
              href="#story"
              className="button button-fluid-mobile border border-white/70 text-white hover:bg-white hover:text-ink"
            >
              Discover the story
            </a>
          </div>
        </div>
      </div>
      <p className="type-label absolute bottom-5 right-gutter hidden [writing-mode:vertical-rl] md:block">
        Campaign 01 — Berlin
      </p>
    </section>
  );
}
