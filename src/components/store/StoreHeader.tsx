"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface StoreHeaderProps {
  username: string;
  name: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  className?: string;
}

export function StoreHeader({
  username,
  name,
  bio,
  avatar,
  coverImage,
  className,
}: StoreHeaderProps) {
  return (
    <header className={cn("relative", className)}>
      {/* Cover Image */}
      {coverImage && (
        <div className="relative h-32 sm:h-40 md:h-48 w-full overflow-hidden">
          <Image
            src={coverImage}
            alt={`${name}'s cover`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        </div>
      )}

      {/* Profile Section */}
      <div className={cn("px-4", coverImage ? "-mt-12 relative z-10" : "pt-6")}>
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <Avatar className={cn("border-4 border-background shadow-lg", coverImage ? "size-24" : "size-20")}>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          <h1 className="mt-3 text-xl sm:text-2xl font-bold text-foreground">
            {name}
          </h1>

          {/* Username */}
          <Link
            href={`/${username}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            @{username}
          </Link>

          {/* Bio */}
          {bio && (
            <p className="mt-3 max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed px-4">
              {bio}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
