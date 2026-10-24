import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/components/seo/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: `The terms for using ${SITE.name}'s free online tools.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="October 2026">
      <p>
        By using {SITE.name} (the &quot;Service&quot;), you agree to these terms. If you do not
        agree, please do not use the Service.
      </p>

      <h2>Free to use</h2>
      <p>
        The tools are provided free of charge for personal and commercial use. You are responsible
        for the content you process and for ensuring you have the right to use it.
      </p>

      <h2>Provided &quot;as is&quot;</h2>
      <p>
        The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without
        warranties of any kind, express or implied. While we aim for accurate results (for example
        in the EMI and unit-conversion calculations), we do not guarantee that outputs are
        error-free or fit for any particular purpose. Calculations are estimates for informational
        use and are not financial, legal or professional advice.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for any loss or damage arising
        from your use of, or inability to use, the Service, including any decisions made based on
        its output. Verify important results independently.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not use the Service for unlawful purposes.</li>
        <li>Do not attempt to disrupt, overload or reverse-engineer the Service.</li>
        <li>Do not use the Service to process content you are not permitted to handle.</li>
      </ul>

      <h2>Third-party services</h2>
      <p>
        The site displays advertising and uses analytics provided by third parties. Their use of
        your data is governed by their own policies; see our{" "}
        <Link href="/privacy">Privacy Policy</Link> for details.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms over time. Continued use after changes constitutes acceptance of
        the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Visit the <Link href="/contact">contact page</Link> or email {SITE.contactEmail}.
      </p>
    </LegalPage>
  );
}
