import Link from "next/link";

const footerLinks = {
  Services: ["Contact us", "Shipping & returns", "Care guide", "Book an appointment"],
  Atelier: ["Our story", "Craftsmanship", "Journal", "Careers"],
  Legal: ["Privacy", "Terms", "Accessibility", "Cookies"],
} as const;

export function SiteFooter() {
  return (
    <footer id="footer" className="bg-inverse text-inverse-ink">
      <div className="page-shell py-14 md:py-20">
        <div className="grid gap-14 border-b border-white/20 pb-16 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Link
              href="/"
              aria-label="Atelier home"
              className="font-display text-3xl tracking-[0.16em] no-underline"
            >
              ATELIER
            </Link>
            <p className="mt-5 max-w-[24rem] text-sm leading-relaxed text-white/60">
              A study in modern form, made with enduring materials and an uncompromising eye.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h2 className="type-label mb-5 text-white/50">{group}</h2>
                <ul className="space-y-3 text-sm">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white/85 no-underline hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-[0.6875rem] uppercase tracking-[0.12em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Atelier Store</p>
          <div className="flex flex-wrap gap-6">
            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">English / USD</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
