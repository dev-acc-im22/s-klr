import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { StoreHeader } from "@/components/store/StoreHeader";
import { SocialLinks } from "@/components/store/SocialLinks";
import { ProductCard } from "@/components/store/ProductCard";
import { CourseCard } from "@/components/store/CourseCard";
import { Separator } from "@/components/ui/separator";
import {
  getMockStore,
  getMockProducts,
  getMockCourses,
} from "@/lib/mock-data/store";

interface StorePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { username } = await params;
  const store = getMockStore(username);

  if (!store) {
    return {
      title: "Store Not Found | CreatorHub",
    };
  }

  return {
    title: `${store.name} | CreatorHub Store`,
    description: store.bio,
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { username } = await params;
  const store = getMockStore(username);

  if (!store) {
    notFound();
  }

  const products = getMockProducts(username);
  const courses = getMockCourses(username);
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Store Header */}
      <StoreHeader
        username={store.username}
        name={store.name}
        bio={store.bio}
        avatar={store.avatar}
        coverImage={store.coverImage}
      />

      {/* Social Links */}
      <div className="mt-4 px-4">
        <SocialLinks links={store.socialLinks} />
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  image={product.images[0]}
                  category={product.category}
                  featured={product.featured}
                  salesCount={product.salesCount}
                  username={username}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Products Section */}
        {products.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  image={product.images[0]}
                  category={product.category}
                  featured={product.featured}
                  salesCount={product.salesCount}
                  username={username}
                />
              ))}
            </div>
          </section>
        )}

        {/* Courses Section */}
        {courses.length > 0 && (
          <section className="mb-8">
            <Separator className="mb-6" />
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course) => {
                const lessonCount = course.modules.reduce(
                  (acc, m) => acc + m.lessons.length,
                  0
                );
                return (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    coverImage={course.coverImage}
                    price={course.price}
                    moduleCount={course.modules.length}
                    lessonCount={lessonCount}
                    enrollmentCount={course.enrollmentCount}
                    rating={course.rating}
                    username={username}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Empty State */}
        {products.length === 0 && courses.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground">No products yet</h3>
            <p className="text-muted-foreground mt-1">
              This creator hasn't added any products or courses yet.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="font-semibold text-primary">CreatorHub</span>
            <span>•</span>
            <span>Create your own store</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
