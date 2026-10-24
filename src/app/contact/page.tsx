import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/components/seo/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Get in touch with the ${SITE.name} team — suggestions, bug reports and questions welcome.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalPage title="Contact us">
      <p>
        We welcome your questions, suggestions for new tools and bug reports. The best way to reach
        us is by email:
      </p>
      <p>
        <a href={`mailto:${SITE.contactEmail}`} className="font-medium">
          {SITE.contactEmail}
        </a>
      </p>

      <h2>What to include</h2>
      <ul>
        <li>Which tool you were using (if reporting a problem).</li>
        <li>What you expected to happen and what actually happened.</li>
        <li>Your browser and device, if the issue looks technical.</li>
      </ul>

      <p>
        We read every message. Because our tools run in your browser and we don&apos;t store your
        data, we may ask for details to reproduce an issue — never send us sensitive files.
      </p>
    </LegalPage>
  );
}
