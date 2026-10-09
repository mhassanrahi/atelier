import Image from "next/image";

import { ArrowIcon } from "@/components/home/icons";

export function StorySection() {
  return (
    <section id="story" className="bg-[#22211f] text-inverse-ink">
      <div className="grid lg:grid-cols-[1.25fr_.75fr]">
        <div className="relative min-h-[34rem] lg:min-h-[52rem]">
          <Image
            src="/atelier-story.jpg"
            alt="Atelier fitting in a softly lit studio"
            fill
            sizes="(max-width: 1024px) 100vw, 63vw"
            className="object-cover object-center"
          />
        </div>
        <div className="flex items-center px-gutter py-20 lg:py-24">
          <div className="max-w-[32rem]">
            <p className="type-label mb-8 text-white/65">Inside the atelier — No. 04</p>
            <h2 className="type-heading">Made slowly.<br />Worn endlessly.</h2>
            <p className="type-body-lg mt-8 max-w-[34rem] text-white/70">
              From the first paper pattern to the final hand-finished edge, each piece is shaped
              by people who know that lasting design begins with attention.
            </p>
            <a
              href="#"
              className="button mt-10 border border-white/70 text-white hover:bg-white hover:text-ink"
            >
              Meet our makers <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
