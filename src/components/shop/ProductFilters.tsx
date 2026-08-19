"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/types";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ProductFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "";
  const search = params.get("search") ?? "";
  const minPrice = params.get("minPrice") ?? "";
  const maxPrice = params.get("maxPrice") ?? "";

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`/shop?${next.toString()}`);
  };

  const clear = () => router.push("/shop");

  return (
    <form
      className="arena-glow rounded-sm bg-arena-surface p-5 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const next = new URLSearchParams();
        for (const [k, v] of fd.entries()) {
          if (v) next.set(k, String(v));
        }
        router.push(`/shop?${next.toString()}`);
      }}
    >
      <Input name="search" label="Search" defaultValue={search} placeholder="Search products..." />
      <Select
        name="category"
        label="Category"
        value={category}
        onChange={(e) => update("category", e.target.value)}
        options={[
          { value: "", label: "All Categories" },
          ...PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c })),
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input name="minPrice" label="Min Price" type="number" defaultValue={minPrice} placeholder="0" />
        <Input name="maxPrice" label="Max Price" type="number" defaultValue={maxPrice} placeholder="9999" />
      </div>
      <Select
        name="sort"
        label="Sort By"
        value={sort}
        onChange={(e) => update("sort", e.target.value)}
        options={[
          { value: "", label: "Featured" },
          { value: "price-asc", label: "Price: Low to High" },
          { value: "price-desc", label: "Price: High to Low" },
          { value: "name-asc", label: "Name: A-Z" },
        ]}
      />
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Apply
        </Button>
        <Button type="button" variant="ghost" onClick={clear}>
          Clear
        </Button>
      </div>
    </form>
  );
}
