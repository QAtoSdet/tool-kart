import type { Metadata } from "next";
import { ToolPage, type FaqItem } from "@/components/tools/ToolPage";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("password-generator")!;
const path = `/tools/${tool.slug}`;

export const metadata: Metadata = buildMetadata({
  title: "Password Generator — Strong Random Passwords",
  description:
    "Generate strong, random passwords in your browser. Choose length and character types. Nothing is sent anywhere — passwords are created on your device.",
  path,
  keywords: tool.keywords,
});

const faqs: FaqItem[] = [
  {
    question: "Are the generated passwords safe / private?",
    answer:
      "Yes. Passwords are created in your browser using its cryptographically secure random generator and are never transmitted or stored on any server.",
  },
  {
    question: "What makes a strong password?",
    answer:
      "Length and variety. Aim for at least 12–16 characters mixing uppercase, lowercase, numbers and symbols. The strength label updates as you change the options.",
  },
  {
    question: "Can I use this for important accounts?",
    answer:
      "Yes, and consider storing the result in a reputable password manager. Because generation is local, nothing about your password leaves your device.",
  },
];

export default function PasswordGeneratorPage() {
  return (
    <>
      <ToolJsonLd name={tool.name} description={tool.description} path={path} faqs={faqs} />
      <ToolPage
        slug={tool.slug}
        title="Password Generator"
        description="Create strong, random passwords right in your browser."
        explainer={
          <>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Generate a strong password
            </h2>
            <p>
              Weak or reused passwords are the easiest way for accounts to get compromised. This
              generator creates random passwords to your chosen length and character mix, entirely
              on your device. Nothing is sent over the network.
            </p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tips</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Use at least 12–16 characters.</li>
              <li>Include all four character types for the strongest result.</li>
              <li>Use a different password for every account, and a password manager to store them.</li>
            </ul>
          </>
        }
        faqs={faqs}
      >
        <PasswordGenerator />
      </ToolPage>
    </>
  );
}
