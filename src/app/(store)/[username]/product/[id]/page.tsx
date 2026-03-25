import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckoutButton } from "@/components/store/CheckoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductCrossSells } from "@/components/store/ProductCrossSells";
import { ReviewsSection } from "@/components/dashboard/reviews/ReviewsSection";
import {
  getMockStore,
  getMockProduct,
} from "@/lib/mock-data/store";

interface ProductPageProps {
  params: Promise<{
    username: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { username, id } = await params;
  const product = getMockProduct(username, id);

  if (!product) {
    return {
      title: "Product Not Found | CreatorHub",
    };
  }

  return {
    title: `${product.title} | CreatorHub Store`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { username, id } = await params;
  const store = getMockStore(username);
  const product = getMockProduct(username, id);

  if (!store || !product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/${username}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to store</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
          >
            CreatorHub
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href={`/${username}`} className="hover:text-foreground">
            {store.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Category Badge */}
            {product.category && (
              <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                {product.category}
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title & Stats */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {product.title}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                {product.salesCount !== undefined && product.salesCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {product.salesCount.toLocaleString()} sold
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  Digital download
                </span>
              </div>
            </div>

            {/* Checkout Card */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-6">
                <CheckoutButton
                  price={product.price}
                  title={product.title}
                  productId={product.id}
                  type="product"
                />
              </CardContent>
            </Card>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* What's Included */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                What&apos;s Included
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-muted-foreground">
                  <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>High-quality digital files</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Instant download after purchase</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Lifetime access</span>
                </li>
              </ul>
            </div>

            <Separator />

            {/* Creator Info */}
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">
                Created by
              </h2>
              <Link
                href={`/${username}`}
                className="flex items-center gap-3 group"
              >
                <Avatar className="size-12 border-2 border-primary/20 group-hover:border-primary transition-colors">
                  <AvatarImage src={store.avatar} alt={store.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {store.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {store.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @{username}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Cross-Sells Section */}
        <ProductCrossSells productId={product.id} productPrice={product.price} />

        {/* Reviews Section */}
        <div className="mt-12">
          <ReviewsSection productId={product.id} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t mt-12">
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
