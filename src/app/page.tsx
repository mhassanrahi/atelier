import { CollectionsSection } from "@/components/home/collections-section";
import { CommitmentsSection } from "@/components/home/commitments-section";
import { HeroSection } from "@/components/home/hero-section";
import { NewArrivalsSection } from "@/components/home/new-arrivals-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { SiteHeader } from "@/components/home/site-header";
import { StorySection } from "@/components/home/story-section";
import { SiteFooter } from "@/components/site-footer";
import { getHomepageProducts } from "@/db/queries/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getHomepageProducts();

  return (
    <main>
      <SiteHeader />
      <HeroSection />

      <CollectionsSection />
      <NewArrivalsSection products={products} />

      <StorySection />
      <CommitmentsSection />
      <NewsletterSection />

      <SiteFooter />
    </main>
  );
}
