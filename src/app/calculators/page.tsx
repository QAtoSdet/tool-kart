import type { Metadata } from "next";
import { CategoryHubView } from "@/components/hub/CategoryHubView";
import { buildMetadata } from "@/components/seo/metadata";
import { getHubBySlug } from "@/lib/categories";

const hub = getHubBySlug("calculators")!;

export const metadata: Metadata = buildMetadata({
  title: hub.title,
  description: hub.description,
  path: `/${hub.slug}`,
});

export default function CalculatorsHub() {
  return <CategoryHubView hub={hub} />;
}
