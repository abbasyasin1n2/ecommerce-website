import {
  HeroSection,
  FeaturedCategories,
  FeaturedProducts,
  WhyChooseUs,
  NewsletterSection,
} from "@/components/home";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <WhyChooseUs />
      <NewsletterSection />
    </main>
  );
}
