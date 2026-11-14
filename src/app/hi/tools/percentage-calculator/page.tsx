import type { Metadata } from "next";
import Link from "next/link";
import { HindiToolPage } from "@/components/hi/HindiToolPage";
import { PercentageCalculator, type PercentageLabels } from "@/components/tools/PercentageCalculator";
import type { FaqItem } from "@/components/tools/ToolPage";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";

const englishPath = "/tools/percentage-calculator";
const path = `/hi${englishPath}`;
const title = "प्रतिशत कैलकुलेटर";
const metaDescription =
  "मुफ़्त प्रतिशत कैलकुलेटर: किसी संख्या का प्रतिशत, अंकों का प्रतिशत और प्रतिशत बढ़ोतरी या कमी तुरंत निकालें। सूत्र और आसान उदाहरणों के साथ।";

export const metadata: Metadata = buildMetadata({
  title: "प्रतिशत कैलकुलेटर — प्रतिशत कैसे निकाले (सूत्र और उदाहरण)",
  description: metaDescription,
  path,
  keywords: [
    "प्रतिशत कैलकुलेटर",
    "प्रतिशत कैसे निकाले",
    "प्रतिशत निकालने का सूत्र",
    "अंकों का प्रतिशत कैसे निकाले",
    "percentage calculator in hindi",
  ],
});

const labels: PercentageLabels = {
  ofHeading: "किसी संख्या का X% कितना होता है?",
  percent: "प्रतिशत",
  value: "किस संख्या का?",
  percentOfJoiner: "%",
  whatHeading: "X, Y का कितना प्रतिशत है? (जैसे अंकों का प्रतिशत)",
  x: "प्राप्त (X)",
  y: "कुल (Y)",
  ofJoiner: "/",
  changeHeading: "प्रतिशत बढ़ोतरी / कमी",
  from: "पुराना मान",
  to: "नया मान",
  toJoiner: "से",
  copy: "कॉपी करें",
  copied: "कॉपी हो गया!",
  copyResult: "नतीजा कॉपी करें",
};

const faqs: FaqItem[] = [
  {
    question: "प्रतिशत निकालने का सूत्र क्या है?",
    answer: "प्रतिशत = (भाग ÷ कुल) × 100। उदाहरण के लिए, 50 में से 40 = 40 ÷ 50 × 100 = 80%।",
  },
  {
    question: "अंकों का प्रतिशत कैसे निकालें?",
    answer:
      "प्राप्त अंकों को कुल अंकों से भाग दें और 100 से गुणा करें। 600 में से 510 अंक = 510 ÷ 600 × 100 = 85%। ऊपर के दूसरे बॉक्स में 510 और 600 डालें।",
  },
  {
    question: "किसी संख्या का 10%, 20% या 25% जल्दी कैसे निकालें?",
    answer:
      "10% के लिए संख्या को 10 से भाग दें: 450 का 10% = 45। 20% इसका दोगुना है (90) और 5% इसका आधा (22.5)। 25% संख्या का एक-चौथाई होता है (112.5)।",
  },
  {
    question: "प्रतिशत बढ़ोतरी कैसे निकालें?",
    answer:
      "नए और पुराने मान का अंतर निकालें, उसे पुराने मान से भाग दें और 100 से गुणा करें। 200 से 250 = 50 ÷ 200 × 100 = 25% बढ़ोतरी। जवाब माइनस में आए तो वह कमी है।",
  },
  {
    question: "क्या 20% बढ़ाने के बाद 20% घटाने से पुराना मान वापस आ जाता है?",
    answer:
      "नहीं। 100 में 20% जोड़ने पर 120 होता है। फिर 120 का 20% (यानी 24) घटाने पर 96 बचता है, 100 नहीं, क्योंकि दूसरी बार प्रतिशत बड़े मान पर लगता है।",
  },
];

const h2 = "text-xl font-semibold text-slate-900 dark:text-white";
const h3 = "text-lg font-semibold text-slate-900 dark:text-white";
const formula = "rounded-md bg-slate-100 px-3 py-2 font-medium text-slate-900 dark:bg-slate-800 dark:text-white";

export default function HindiPercentageCalculatorPage() {
  return (
    <>
      <ToolJsonLd name={title} description={metaDescription} path={path} faqs={faqs} inLanguage="hi" />
      <HindiToolPage
        title={title}
        description="प्रतिशत के तीन सबसे आम सवाल, एक ही जगह। नंबर बदलते ही जवाब तुरंत दिखता है।"
        path={path}
        englishPath={englishPath}
        hub={{ name: "कैलकुलेटर", href: "/calculators" }}
        faqs={faqs}
        explainer={
          <>
            <h2 className={h2}>प्रतिशत कैसे निकाले</h2>
            <p>
              प्रतिशत का मतलब है &ldquo;सौ में से कितना&rdquo;। 25% यानी हर 100 में से 25। नीचे तीनों सवालों के
              सूत्र और उदाहरण दिए गए हैं। ऊपर का कैलकुलेटर यही गणना अपने-आप करता है।
            </p>

            <h3 className={h3}>1. किसी संख्या का प्रतिशत</h3>
            <p className={formula}>सूत्र: संख्या × प्रतिशत ÷ 100</p>
            <p>उदाहरण: 200 का 15% = 200 × 15 ÷ 100 = 30</p>

            <h3 className={h3}>2. अंकों का प्रतिशत (X, Y का कितना प्रतिशत है)</h3>
            <p className={formula}>सूत्र: (प्राप्त अंक ÷ कुल अंक) × 100</p>
            <p>उदाहरण: 500 में से 435 अंक = 435 ÷ 500 × 100 = 87%</p>
            <p>
              कई विषयों का कुल प्रतिशत निकालना हो, तो सभी विषयों के प्राप्त अंक जोड़ें और सभी के कुल अंक जोड़ें,
              फिर यही सूत्र लगाएँ। अगर विषयों के कुल अंक अलग-अलग हों, तो हर विषय के प्रतिशत का औसत लेने से
              सही जवाब नहीं आता।
            </p>

            <h3 className={h3}>3. प्रतिशत बढ़ोतरी या कमी</h3>
            <p className={formula}>सूत्र: (नया मान − पुराना मान) ÷ पुराना मान × 100</p>
            <p>
              उदाहरण: तनख़्वाह ₹20,000 से ₹23,000 हुई, तो (23,000 − 20,000) ÷ 20,000 × 100 = 15% बढ़ोतरी। जवाब
              माइनस में आए तो वह कमी है।
            </p>

            <h3 className={h3}>छूट (डिस्काउंट) के बाद की कीमत</h3>
            <p>
              ₹1,200 की चीज़ पर 25% छूट हो, तो छूट = 1,200 × 25 ÷ 100 = ₹300, यानी आपको ₹900 देने होंगे। पहले
              बॉक्स में 25 और 1200 डालकर छूट की रकम देखें।
            </p>

            <p>
              CGPA को प्रतिशत में बदलना है?{" "}
              <Link href="/tools/cgpa-to-percentage" className="text-blue-600 underline dark:text-blue-400">
                CGPA से प्रतिशत कैलकुलेटर
              </Link>{" "}
              (अंग्रेज़ी में) देखें।
            </p>
          </>
        }
      >
        <PercentageCalculator labels={labels} />
      </HindiToolPage>
    </>
  );
}
