import type { Metadata } from "next";
import Link from "next/link";
import { HindiToolPage } from "@/components/hi/HindiToolPage";
import { AgeCalculator, type AgeLabels } from "@/components/tools/AgeCalculator";
import type { FaqItem } from "@/components/tools/ToolPage";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";

const englishPath = "/tools/age-calculator";
const path = `/hi${englishPath}`;
const title = "उम्र कैलकुलेटर";
const metaDescription =
  "मुफ़्त उम्र कैलकुलेटर: जन्म तिथि से अपनी सही उम्र साल, महीने और दिन में जानें। सरकारी फ़ॉर्म के लिए किसी तय तारीख़ पर उम्र और दो तारीख़ों के बीच के दिन भी निकालें।";

export const metadata: Metadata = buildMetadata({
  title: "उम्र कैलकुलेटर — जन्म तिथि से सही उम्र कैसे निकाले",
  description: metaDescription,
  path,
  keywords: [
    "उम्र कैलकुलेटर",
    "जन्म तिथि से उम्र",
    "उम्र कैसे निकाले",
    "आयु गणना",
    "age calculator in hindi",
  ],
});

const labels: AgeLabels = {
  dob: "जन्म तिथि",
  asOf: "इस तारीख़ को उम्र",
  asOfHint: "अपने-आप आज की तारीख़ रहती है।",
  errorDob: "कृपया सही जन्म तिथि डालें।",
  errorRef: "कृपया सही तारीख़ डालें।",
  errorOrder: "जन्म तिथि चुनी गई तारीख़ के बाद की नहीं हो सकती।",
  agePrefix: "आपकी उम्र",
  ageSuffix: "है।",
  years: "साल",
  months: "महीने",
  days: "दिन",
  and: "और",
  totalDays: "कुल दिन",
  totalMonths: "कुल महीने",
  daysToBirthday: "अगले जन्मदिन में दिन",
  bornOn: "जन्म का दिन",
  weekdays: {
    Sunday: "रविवार",
    Monday: "सोमवार",
    Tuesday: "मंगलवार",
    Wednesday: "बुधवार",
    Thursday: "गुरुवार",
    Friday: "शुक्रवार",
    Saturday: "शनिवार",
  },
  diffHeading: "दो तारीख़ों के बीच कितने दिन",
  start: "शुरू की तारीख़",
  end: "आख़िरी तारीख़",
  diffPrefix: "इन दोनों तारीख़ों के बीच",
  diffSuffix: "का अंतर है।",
  day: "दिन",
  dayPlural: "दिन",
};

const faqs: FaqItem[] = [
  {
    question: "जन्म तिथि से उम्र कैसे निकालें?",
    answer:
      "आज की तारीख़ में से जन्म तिथि घटाएँ: पहले दिन, फिर महीने, फिर साल। दिन कम पड़ें तो पिछले महीने के दिन (जैसे 31) उधार लें, और महीने कम पड़ें तो एक साल (12 महीने) उधार लें। ऊपर का कैलकुलेटर यह अपने-आप करता है।",
  },
  {
    question: "सरकारी नौकरी के फ़ॉर्म में किस तारीख़ की उम्र देखनी होती है?",
    answer:
      "आज की नहीं, बल्कि नोटिस में दी गई तारीख़ की, जैसे “1 जनवरी 2027 को उम्र”। “इस तारीख़ को उम्र” वाले बॉक्स में वही तारीख़ डालें। उम्र सीमा और छूट हमेशा अपने नोटिस से ही जाँचें।",
  },
  {
    question: "29 फ़रवरी को जन्म हो तो उम्र कैसे गिनी जाती है?",
    answer:
      "जिन सालों में 29 फ़रवरी नहीं आती, उनमें यह कैलकुलेटर 28 फ़रवरी को साल पूरा मानता है। अगले जन्मदिन की गिनती भी इसी नियम से होती है।",
  },
  {
    question: "क्या मेरी जन्म तिथि कहीं सेव होती है?",
    answer: "नहीं। गणना आपके ब्राउज़र में ही होती है और आपकी डाली कोई जानकारी हमारे सर्वर पर नहीं भेजी जाती।",
  },
];

const h2 = "text-xl font-semibold text-slate-900 dark:text-white";
const h3 = "text-lg font-semibold text-slate-900 dark:text-white";
const cell = "border border-slate-200 px-3 py-1.5 dark:border-slate-700";

export default function HindiAgeCalculatorPage() {
  return (
    <>
      <ToolJsonLd name={title} description={metaDescription} path={path} faqs={faqs} inLanguage="hi" />
      <HindiToolPage
        title={title}
        description="जन्म तिथि डालें और अपनी सही उम्र साल, महीने और दिन में देखें, साथ में अगले जन्मदिन तक के दिन।"
        path={path}
        englishPath={englishPath}
        hub={{ name: "कैलकुलेटर", href: "/calculators" }}
        faqs={faqs}
        explainer={
          <>
            <h2 className={h2}>कैसे इस्तेमाल करें</h2>
            <ol className="list-decimal space-y-1 pl-5">
              <li>अपनी जन्म तिथि चुनें।</li>
              <li>
                किसी तय तारीख़ की उम्र चाहिए (जैसे किसी परीक्षा की कट-ऑफ़ तारीख़), तो &ldquo;इस तारीख़ को
                उम्र&rdquo; बदलें। नहीं तो आज की तारीख़ रहने दें।
              </li>
              <li>उम्र, कुल दिन, कुल महीने और अगले जन्मदिन तक के दिन देखें।</li>
            </ol>

            <h2 className={h2}>हाथ से उम्र कैसे निकालें (उदाहरण)</h2>
            <p>
              मान लीजिए जन्म तिथि 15 अगस्त 2001 है और 1 जनवरी 2027 को उम्र चाहिए। दोनों तारीख़ों के साल, महीना और दिन
              अलग-अलग लिखें, फिर दाएँ से (दिन से) घटाना शुरू करें:
            </p>
            <div className="overflow-x-auto">
              <table className="text-sm">
                <thead>
                  <tr>
                    <th className={cell}></th>
                    <th className={cell}>साल</th>
                    <th className={cell}>महीना</th>
                    <th className={cell}>दिन</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className={cell}>तय तारीख़</th>
                    <td className={cell}>2027</td>
                    <td className={cell}>1</td>
                    <td className={cell}>1</td>
                  </tr>
                  <tr>
                    <th scope="row" className={cell}>जन्म तिथि</th>
                    <td className={cell}>2001</td>
                    <td className={cell}>8</td>
                    <td className={cell}>15</td>
                  </tr>
                  <tr>
                    <th scope="row" className={cell}>उम्र</th>
                    <td className={cell}>25</td>
                    <td className={cell}>4</td>
                    <td className={cell}>17</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>दिन:</strong> 1 में से 15 नहीं घटता, इसलिए पिछले महीने (दिसंबर) के 31 दिन उधार लें: 1 + 31 =
                32, और 32 − 15 = 17 दिन। महीना 1 से घटकर 0 रह गया।
              </li>
              <li>
                <strong>महीने:</strong> 0 में से 8 नहीं घटता, इसलिए एक साल (12 महीने) उधार लें: 12 − 8 = 4 महीने।
                साल 2027 से घटकर 2026 रह गया।
              </li>
              <li>
                <strong>साल:</strong> 2026 − 2001 = 25 साल।
              </li>
            </ul>
            <p>
              यानी उम्र <strong>25 साल, 4 महीने और 17 दिन</strong>। ऊपर कैलकुलेटर में यही दोनों तारीख़ें डालकर जाँच
              सकते हैं।
            </p>

            <h3 className={h3}>परीक्षा और नौकरी के फ़ॉर्म के लिए</h3>
            <p>
              भर्ती नोटिस में उम्र सीमा किसी तय तारीख़ पर गिनी जाती है, आज की तारीख़ पर नहीं। वही तारीख़ ऊपर डालें।
              फ़ॉर्म में फ़ोटो और हस्ताक्षर का साइज़ भी चाहिए, तो{" "}
              <Link href="/exams" className="text-blue-600 underline dark:text-blue-400">
                परीक्षा के फ़ोटो और हस्ताक्षर साइज़ पेज
              </Link>{" "}
              (अंग्रेज़ी में) देखें।
            </p>
          </>
        }
      >
        <AgeCalculator labels={labels} />
      </HindiToolPage>
    </>
  );
}
