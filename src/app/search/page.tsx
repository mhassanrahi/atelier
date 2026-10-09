import { permanentRedirect } from "next/navigation";

import { normalizeProductSearchQuery } from "@/db/queries/products";

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const queryParam = (await searchParams).q;
  const rawQuery = Array.isArray(queryParam) ? queryParam[0] : queryParam;
  const query = normalizeProductSearchQuery(rawQuery ?? "");

  permanentRedirect(
    query
      ? `/collections?q=${encodeURIComponent(query)}#catalog-search`
      : "/collections?focus=search#catalog-search",
  );
}
