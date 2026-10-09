"use client";

import Form from "next/form";
import { useEffect, useRef } from "react";

type CollectionSearchFormProps = {
  query: string;
  shouldFocus: boolean;
};

export function CollectionSearchForm({
  query,
  shouldFocus,
}: CollectionSearchFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
    }
  }, [shouldFocus]);

  return (
    <Form
      id="catalog-search"
      action="/collections#catalog-search"
      aria-label="Search the collection"
      className="grid scroll-mt-6 gap-4 border-b border-line py-7 md:grid-cols-[minmax(0,1fr)_auto]"
    >
      <div>
        <label htmlFor="collection-search" className="type-label block pb-3 text-ink-muted">
          Search the collection
        </label>
        <input
          ref={inputRef}
          id="collection-search"
          type="search"
          name="q"
          defaultValue={query}
          maxLength={100}
          autoFocus={shouldFocus}
          placeholder="Try “bag” or “eyewear”"
          className="h-14 w-full border border-line bg-canvas px-5 text-base text-ink placeholder:text-ink-muted"
        />
      </div>
      <button type="submit" className="button button-primary self-end md:min-w-36">
        Search
      </button>
    </Form>
  );
}
