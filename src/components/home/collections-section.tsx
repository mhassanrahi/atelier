import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/components/home/icons";

const collections = [
  {
    number: "01",
    title: "The Women's Edit",
    imageSrc: "/collection-women.jpg",
    imageAlt: "Woman in sunglasses holding shopping bags",
    imageClassName: "object-cover",
  },
  {
    number: "02",
    title: "The Men's Edit",
    imageSrc: "/collection-men.jpg",
    imageAlt: "Man adjusting a denim jacket outdoors",
    imageClassName: "object-cover object-center",
  },
] as const;

export function CollectionsSection() {
  return (
    <section id="collections" className="section-space">
      <div className="page-shell">
        <div className="mb-10 flex items-end justify-between gap-8 md:mb-16">
          <div>
            <p className="type-label mb-4 text-ink-muted">Explore the house</p>
            <h2 className="type-heading">Two points of view</h2>
          </div>
          <Link className="link-nav desktop-only" href="/collections">
            View all collections
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.number}
              href="/collections"
              className="group relative min-h-[33rem] overflow-hidden bg-surface-subtle text-white no-underline md:min-h-[48rem]"
            >
              <Image
                src={collection.imageSrc}
                alt={collection.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`${collection.imageClassName} transition duration-700 ease-out group-hover:scale-[1.025]`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/5" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-10">
                <div>
                  <p className="type-label mb-3">Collection {collection.number}</p>
                  <h3 className="type-subheading text-3xl md:text-5xl">{collection.title}</h3>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/70 transition group-hover:bg-white group-hover:text-ink">
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
