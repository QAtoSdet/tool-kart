import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/components/seo/metadata";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${SITE.name} handles your data: tools run in your browser and your files are never uploaded. Learn about cookies and third-party ads.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 2026">
      <p>
        This Privacy Policy explains what data {SITE.name} (&quot;we&quot;, &quot;us&quot;) does
        and does not collect when you use our tools. In plain terms: the content you process with
        our tools stays on your device, while standard advertising and analytics services collect
        limited usage data, as described below.
      </p>

      <h2>The content you process stays on your device</h2>
      <p>
        All of our tools — the image compressor, QR code generator, age calculator, EMI calculator
        and unit converter — run entirely in your web browser. The files you select and the values
        you type are processed locally and are <strong>never uploaded to or stored on our
        servers</strong>. We have no database of your files or inputs because that data never
        reaches us. You can verify this yourself using your browser&apos;s developer tools (Network
        tab): no upload requests are made when you use a tool.
      </p>

      <h2>Data collected by third-party services</h2>
      <p>
        To keep the site free, we use third-party services that do collect limited data:
      </p>
      <ul>
        <li>
          <strong>Advertising (Google AdSense).</strong> When ads are enabled, Google and its
          partners may use cookies and similar technologies to serve ads based on your visits to
          this and other sites. Google&apos;s use of advertising cookies enables it and its partners
          to serve ads based on your visits. You can learn more and opt out of personalised
          advertising at{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          <strong>Analytics.</strong> We may use a privacy-conscious analytics tool to count page
          views and understand which tools are popular. This collects aggregate usage data such as
          page, referrer, approximate location and device type.
        </li>
        <li>
          <strong>Hosting.</strong> Our host records standard server logs (such as IP address and
          requested page) for security and reliability, as any website does.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We do not set our own tracking cookies for the tools. Third-party services described above
        (notably advertising) may set cookies. You can control or delete cookies through your
        browser settings. Third parties such as Google may use cookies to serve ads based on your
        prior visits to this website or other websites.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        Our tools are general-purpose utilities and are not directed at children under 13. We do not
        knowingly collect personal information from children.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Use your browser settings to block or clear cookies.</li>
        <li>Opt out of personalised ads via Google Ads Settings (linked above).</li>
        <li>Because the tools run locally, simply closing the tab removes any data from memory.</li>
      </ul>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the site evolves. Material changes will be reflected by the
        &quot;Last updated&quot; date above.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Reach us via the{" "}
        <Link href="/contact">contact page</Link> or at {SITE.contactEmail}.
      </p>
    </LegalPage>
  );
}
