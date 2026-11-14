import type { Metadata } from "next";
import { HindiToolPage } from "@/components/hi/HindiToolPage";
import { EmiCalculator, type EmiLabels } from "@/components/tools/EmiCalculator";
import type { FaqItem } from "@/components/tools/ToolPage";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";

const englishPath = "/tools/emi-calculator";
const path = `/hi${englishPath}`;
const title = "EMI कैलकुलेटर";
const metaDescription =
  "मुफ़्त EMI कैलकुलेटर: होम लोन, कार लोन और पर्सनल लोन की मासिक EMI, कुल ब्याज और हर साल का हिसाब तुरंत निकालें। EMI का सूत्र और उदाहरण हिंदी में।";

export const metadata: Metadata = buildMetadata({
  title: "EMI कैलकुलेटर — होम, कार और पर्सनल लोन की EMI कैसे निकाले",
  description: metaDescription,
  path,
  keywords: ["emi कैलकुलेटर", "emi कैसे निकाले", "होम लोन emi", "लोन emi कैलकुलेटर", "emi calculator in hindi"],
});

const labels: EmiLabels = {
  loanAmount: "लोन की रकम (₹)",
  rate: "ब्याज दर (% सालाना)",
  tenure: "अवधि (साल)",
  errorAmount: "लोन की रकम 0 से ज़्यादा डालें।",
  errorRate: "ब्याज दर माइनस में नहीं हो सकती।",
  errorTenure: "अवधि 0 से ज़्यादा डालें।",
  monthlyEmi: "मासिक EMI",
  totalInterest: "कुल ब्याज",
  totalPayable: "कुल भुगतान",
  whereHeading: "आपका पैसा कहाँ जाता है",
  splitLabel: "कुल भुगतान, मूलधन और ब्याज में बँटा हुआ",
  principal: "मूलधन",
  interest: "ब्याज",
  eachYearHeading: "हर साल के भुगतान",
  yearlyHeading: "साल-दर-साल हिसाब",
  year: "साल",
  principalPaid: "चुकाया मूलधन",
  interestPaid: "चुकाया ब्याज",
  balance: "बाक़ी रकम",
  yearAxis: "{n}",
  summaryOne: "सालाना भुगतान का चार्ट: आपके भुगतान का {share}% ब्याज में जाता है।",
  summaryMany:
    "{years} साल के भुगतान का चार्ट, मूलधन और ब्याज में बँटा हुआ। पहले साल आपके भुगतान का {first}% ब्याज में जाता है; आख़िरी साल तक यह {last}% रह जाता है।",
};

const faqs: FaqItem[] = [
  {
    question: "EMI निकालने का सूत्र क्या है?",
    answer:
      "EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)। यहाँ P लोन की रकम है, r मासिक ब्याज दर है (सालाना दर ÷ 12 ÷ 100) और n महीनों की संख्या है।",
  },
  {
    question: "₹10 लाख के लोन की EMI कितनी होगी?",
    answer:
      "8.5% सालाना ब्याज पर 10 साल के लिए EMI लगभग ₹12,399 होगी, और कुल ब्याज लगभग ₹4,87,828। यही लोन 20 साल का लें तो EMI घटकर लगभग ₹8,678 हो जाती है, पर कुल ब्याज बढ़कर लगभग ₹10,82,776 हो जाता है।",
  },
  {
    question: "क्या यह होम, कार, पर्सनल और गोल्ड लोन के लिए काम करता है?",
    answer:
      "हाँ। सभी तरह के लोन में EMI का सूत्र एक ही है। बस अपने लोन की रकम, ब्याज दर और अवधि डालें।",
  },
  {
    question: "क्या इसमें प्रोसेसिंग फ़ीस या प्रीपेमेंट शामिल है?",
    answer:
      "नहीं। यह सामान्य EMI का अनुमान है, जिसमें प्रोसेसिंग फ़ीस, बीमा या प्रीपेमेंट शामिल नहीं हैं। योजना बनाने के लिए इसका इस्तेमाल करें और सही आँकड़े अपने बैंक से पक्के करें।",
  },
  {
    question: "क्या मेरी लोन की जानकारी सेव होती है?",
    answer: "नहीं। पूरी गणना आपके ब्राउज़र में होती है और आपके नंबर किसी सर्वर पर नहीं भेजे जाते।",
  },
];

const h2 = "text-xl font-semibold text-slate-900 dark:text-white";
const formula = "rounded-md bg-slate-100 px-3 py-2 font-medium text-slate-900 dark:bg-slate-800 dark:text-white";

export default function HindiEmiCalculatorPage() {
  return (
    <>
      <ToolJsonLd name={title} description={metaDescription} path={path} faqs={faqs} inLanguage="hi" />
      <HindiToolPage
        title={title}
        description="किसी भी लोन की मासिक EMI, कुल ब्याज और हर साल का हिसाब देखें।"
        path={path}
        englishPath={englishPath}
        hub={{ name: "फ़ाइनेंस कैलकुलेटर", href: "/finance-calculators" }}
        faqs={faqs}
        explainer={
          <>
            <h2 className={h2}>EMI क्या है</h2>
            <p>
              EMI (Equated Monthly Instalment) वह तय रकम है जो आप लोन पूरा होने तक हर महीने चुकाते हैं। हर EMI में
              थोड़ा ब्याज और थोड़ा मूलधन होता है। शुरू में ज़्यादातर हिस्सा ब्याज में जाता है, और जैसे-जैसे बाक़ी रकम घटती
              है, मूलधन का हिस्सा बढ़ता जाता है।
            </p>

            <h2 className={h2}>EMI कैसे निकाले (सूत्र)</h2>
            <p className={formula}>EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>P</strong> = लोन की रकम
              </li>
              <li>
                <strong>r</strong> = मासिक ब्याज दर = सालाना दर ÷ 12 ÷ 100
              </li>
              <li>
                <strong>n</strong> = कुल महीने = साल × 12
              </li>
            </ul>

            <h2 className={h2}>उदाहरण: ₹10 लाख का लोन, 8.5% ब्याज, 10 साल</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>r = 8.5 ÷ 12 ÷ 100 = 0.007083, और n = 10 × 12 = 120 महीने।</li>
              <li>
                सूत्र लगाने पर EMI ≈ <strong>₹12,399</strong>। 120 महीनों में कुल भुगतान ≈ ₹14,87,828, यानी कुल ब्याज ≈
                ₹4,87,828।
              </li>
              <li>
                पहली EMI में ब्याज ≈ ₹7,083 (₹10,00,000 × 0.007083) है, और सिर्फ़ ≈ ₹5,315 मूलधन घटता है। ऊपर के
                चार्ट में यही दिखता है: शुरू के सालों में ब्याज का हिस्सा बड़ा होता है।
              </li>
            </ul>

            <h2 className={h2}>लंबी अवधि या छोटी अवधि?</h2>
            <p>
              अवधि बढ़ाने से EMI कम होती है, पर कुल ब्याज बढ़ जाता है। ऊपर वाला लोन 20 साल का लें तो EMI घटकर ≈ ₹8,678
              हो जाती है, लेकिन कुल ब्याज ≈ ₹10,82,776 हो जाता है, यानी दोगुने से भी ज़्यादा। ऐसी EMI चुनें जो आपके
              महीने के बजट में आराम से आ जाए, और उससे ज़्यादा लंबी अवधि न लें।
            </p>
          </>
        }
      >
        <EmiCalculator labels={labels} />
      </HindiToolPage>
    </>
  );
}
