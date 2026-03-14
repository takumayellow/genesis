"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

interface HeaderProps {
  readonly breadcrumbs?: readonly BreadcrumbItem[];
}

export function Header({ breadcrumbs = [] }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-black"
        >
          DevClub
        </Link>
        {breadcrumbs.length > 0 && (
          <>
            <div className="h-4 w-px bg-gray-200" />
            <nav className="flex items-center gap-2">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <span key={item.label} className="flex items-center gap-2">
                    {index > 0 && (
                      <span className="text-sm text-gray-300">/</span>
                    )}
                    {isLast || !item.href ? (
                      <span
                        className={
                          isLast
                            ? "text-sm font-medium text-black"
                            : "text-sm text-gray-400"
                        }
                      >
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-gray-400 hover:text-gray-600"
                      >
                        {item.label}
                      </Link>
                    )}
                  </span>
                );
              })}
            </nav>
          </>
        )}
      </div>
      {user && (
        <div className="size-8 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
          {user.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.githubUsername}
              className="size-full object-cover"
            />
          )}
        </div>
      )}
    </header>
  );
}
