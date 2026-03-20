"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  moduleCount?: number;
  lessonCount?: number;
  enrollmentCount?: number;
  rating?: number;
  username: string;
  className?: string;
}

export function CourseCard({
  id,
  title,
  description,
  coverImage,
  price,
  moduleCount,
  lessonCount,
  enrollmentCount,
  rating,
  username,
  className,
}: CourseCardProps) {
  return (
    <Link href={`/${username}/course/${id}`}>
      <Card
        className={cn(
          "group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card h-full",
          className
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Course Badge */}
          <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground">
            Course
          </Badge>

          {/* Rating */}
          {rating && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="text-xs text-white font-medium">{rating}</span>
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="bg-white/90 text-foreground font-bold">
              {price === 0 ? "Free" : `$${price}`}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            {moduleCount !== undefined && (
              <span>{moduleCount} modules</span>
            )}
            {lessonCount !== undefined && (
              <>
                <span className="size-1 rounded-full bg-muted-foreground/50" />
                <span>{lessonCount} lessons</span>
              </>
            )}
            {enrollmentCount !== undefined && enrollmentCount > 0 && (
              <>
                <span className="size-1 rounded-full bg-muted-foreground/50" />
                <span>{enrollmentCount.toLocaleString()} students</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
