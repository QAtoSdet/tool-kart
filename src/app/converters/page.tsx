import type { Metadata } from "next";
import { CategoryHubView } from "@/components/hub/CategoryHubView";
import { buildMetadata } from "@/components/seo/metadata";
import { getHubBySlug } from "@/lib/categories";

const hub = getHubBySlug("converters")!;

export const metadata: Metadata = buildMetadata({
  title: hub.title,
  description: hub.description,
  path: `/${hub.slug}`,
});

export default function ConvertersHub() {
  return <CategoryHubView hub={hub} />;
}
