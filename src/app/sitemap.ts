import type { MetadataRoute } from "next";
import { site } from "@/lib/constants";
import { architectureStudies } from "@/data/architecture-studies";
import { blogPosts } from "@/data/blog";
import { calculators } from "@/data/calculators";
import { products } from "@/data/products";

const staticRoutes = [
  "",
  "/workflow",
  "/products",
  "/lens",
  "/pulse",
  "/tools",
  "/docs",
  "/architecture-studies",
  "/blog",
  "/company",
  "/contact",
  "/open-source",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/workflow" || path === "/lens" ? 0.9 : 0.7,
  }));

  const studies = architectureStudies.map((s) => ({
    url: `${base}/architecture-studies/${s.slug}`,
    lastModified: new Date(s.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blog = blogPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const tools = calculators.map((c) => ({
    url: `${base}/tools/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const productPages = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...studies, ...blog, ...tools, ...productPages];
}
