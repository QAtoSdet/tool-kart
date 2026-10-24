import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { QrCodeGenerator } from "@/components/tools/QrCodeGenerator";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("qr-code-generator")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "QR Code Generator — Free Online QR Maker",
  description:
    "Generate QR codes from any text or URL for free. Customize size and colour, then download as PNG or SVG. Runs in your browser — nothing is stored.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "Is this QR code generator free?",
    answer: "Yes, it is completely free with no sign-up and no watermark on your QR codes.",
  },
  {
    question: "Can I download the QR code as SVG?",
    answer:
      "Yes. You can download as a PNG for everyday use or as an SVG for print and high-resolution needs.",
  },
  {
    question: "Do the QR codes expire?",
    answer:
      "No. The codes are static and encode your text/URL directly, so they never expire or depend on our servers.",
  },
];

export default function QrCodeGeneratorPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} />
      <ToolPage
        slug={tool.slug}
        title="QR Code Generator"
        description="Turn any text or link into a downloadable QR code, instantly and privately."
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Create a QR code in seconds
            </h2>
            <p>
              QR codes are a quick way to share a link, Wi-Fi detail, UPI ID or any text. Type your
              content, and a scannable code is generated live in your browser. Download it as a PNG
              for screens or an SVG for crisp printing.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">How to use it</h3>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Enter the text or URL you want to encode.</li>
              <li>Adjust the size and colours if you like.</li>
              <li>Download the QR code and test it with your phone camera.</li>
            </ol>
          </>
        }
        faqs={faqs}
      >
        <QrCodeGenerator />
      </ToolPage>
    </>
  );
}
