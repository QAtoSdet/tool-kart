import type { Metadata } from "next";
import { HindiToolPage } from "@/components/hi/HindiToolPage";
import { GstCalculator, type GstLabels } from "@/components/tools/GstCalculator";
import type { FaqItem } from "@/components/tools/ToolPage";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";

const englishPath = "/tools/gst-calculator";
const path = `/hi${englishPath}`;
const title = "GST कैलकुलेटर";
const metaDescription =
  "मुफ़्त GST कैलकुलेटर: किसी भी रकम में 5%, 18% या 40% GST जोड़ें या घटाएँ और CGST/SGST का हिसाब देखें। 22 सितंबर 2025 से लागू नई GST दरों के साथ।";

export const metadata: Metadata = buildMetadata({
  title: "GST कैलकुलेटर — GST कैसे निकाले (नई दरें 5%, 18%, 40%)",
  description: metaDescription,
  path,
  keywords: ["gst कैलकुलेटर", "gst कैसे निकाले", "gst जोड़ें", "gst घटाएँ", "gst calculator in hindi"],
});

const labels: GstLabels = {
  amount: "रकम (₹)",
  rate: "GST दर",
  currentRates: "मौजूदा दरें (22 सितंबर 2025 से)",
  oldRates: "पुरानी दरें (22 सितंबर 2025 से पहले के बिल)",
  mode: "क्या करना है",
  add: "GST जोड़ें (रकम में GST नहीं है)",
  remove: "GST घटाएँ (रकम में GST शामिल है)",
  base: "मूल रकम",
  totalGst: "कुल GST",
  total: "कुल रकम",
  copyTotal: "कुल रकम कॉपी करें",
  copied: "कॉपी हो गया!",
};

const faqs: FaqItem[] = [
  {
    question: "अभी GST की दरें क्या हैं?",
    answer:
      "22 सितंबर 2025 से ज़्यादातर चीज़ों पर 5% या 18% GST है, और तंबाकू, पान मसाला, मीठे और गैस वाले पेय जैसी चीज़ों और लग्ज़री सामान पर 40%। ज़रूरी चीज़ों पर 0% है, और सोने पर 3% की ख़ास दर है। पुराने 12% और 28% स्लैब ख़त्म कर दिए गए।",
  },
  {
    question: "किसी कीमत में GST कैसे जोड़ें?",
    answer: "कीमत को GST दर से गुणा करके 100 से भाग दें, फिर उसे कीमत में जोड़ें। ₹1,000 पर 18% GST = ₹180, यानी कुल ₹1,180।",
  },
  {
    question: "GST वाली कीमत से GST कैसे घटाएँ?",
    answer:
      "कुल कीमत को (1 + दर ÷ 100) से भाग दें। ₹1,180 में 18% GST शामिल हो, तो मूल रकम = 1,180 ÷ 1.18 = ₹1,000 और GST = ₹180। कुल रकम का सीधा 18% (₹212.40) घटाना ग़लत है।",
  },
  {
    question: "CGST और SGST क्या हैं?",
    answer:
      "राज्य के अंदर बिक्री पर GST दो बराबर हिस्सों में बँटता है: CGST (केंद्र का) और SGST (राज्य का)। 18% GST में 9% CGST और 9% SGST होता है। दूसरे राज्य में बिक्री पर पूरा GST IGST के रूप में लगता है।",
  },
  {
    question: "पुराने बिल के लिए 12% या 28% कैसे निकालें?",
    answer:
      "GST दर वाली सूची में “पुरानी दरें” के नीचे 12% और 28% दिए गए हैं। इन्हें सिर्फ़ 22 सितंबर 2025 से पहले के बिल जाँचने के लिए इस्तेमाल करें।",
  },
];

const h2 = "text-xl font-semibold text-slate-900 dark:text-white";
const formula = "rounded-md bg-slate-100 px-3 py-2 font-medium text-slate-900 dark:bg-slate-800 dark:text-white";

export default function HindiGstCalculatorPage() {
  return (
    <>
      <ToolJsonLd name={title} description={metaDescription} path={path} faqs={faqs} inLanguage="hi" />
      <HindiToolPage
        title={title}
        description="किसी भी रकम में GST जोड़ें या घटाएँ, और CGST/SGST का हिसाब तुरंत देखें।"
        path={path}
        englishPath={englishPath}
        hub={{ name: "फ़ाइनेंस कैलकुलेटर", href: "/finance-calculators" }}
        faqs={faqs}
        explainer={
          <>
            <h2 className={h2}>नई GST दरें (22 सितंबर 2025 से)</h2>
            <p>
              GST काउंसिल की 56वीं बैठक के बाद GST में मुख्य रूप से दो दरें रह गई हैं, 5% और 18%, और कुछ चीज़ों पर 40%।
              पुराने 12% और 28% स्लैब ख़त्म कर दिए गए।
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>0%</strong> — ज़रूरी चीज़ें, और व्यक्तिगत स्वास्थ्य व जीवन बीमा।
              </li>
              <li>
                <strong>5%</strong> — रोज़मर्रा की कई चीज़ें, जैसे बालों का तेल, साबुन और शैम्पू, और खेती की मशीनें।
              </li>
              <li>
                <strong>18%</strong> — ज़्यादातर सामान और सेवाएँ, जैसे AC, टीवी, सीमेंट, छोटी कारें और 350cc तक की
                मोटरसाइकिल।
              </li>
              <li>
                <strong>40%</strong> — तंबाकू, पान मसाला, गैस वाले पेय और लग्ज़री सामान।
              </li>
              <li>
                <strong>3%</strong> — सोना और दूसरी क़ीमती धातुएँ (ख़ास दर)।
              </li>
            </ul>
            <p>
              किसी ख़ास चीज़ की दर के लिए उसका HSN कोड और सरकारी अधिसूचना देखें। ऊपर दी गई सूची सिर्फ़ आम उदाहरण है।
            </p>

            <h2 className={h2}>GST जोड़ना</h2>
            <p className={formula}>GST = मूल रकम × दर ÷ 100, और कुल रकम = मूल रकम + GST</p>
            <p>उदाहरण: ₹1,000 पर 18% GST = ₹180, कुल ₹1,180। इसमें ₹90 CGST और ₹90 SGST है।</p>

            <h2 className={h2}>GST घटाना (जब कीमत में GST शामिल हो)</h2>
            <p className={formula}>मूल रकम = कुल रकम ÷ (1 + दर ÷ 100)</p>
            <p>
              उदाहरण: ₹1,180 में 18% GST शामिल है, तो मूल रकम = 1,180 ÷ 1.18 = ₹1,000, और GST = ₹180। ध्यान दें: कुल
              रकम का सीधा 18% घटाने से (₹1,180 − ₹212.40 = ₹967.60) ग़लत जवाब आता है।
            </p>
          </>
        }
      >
        <GstCalculator labels={labels} />
      </HindiToolPage>
    </>
  );
}
