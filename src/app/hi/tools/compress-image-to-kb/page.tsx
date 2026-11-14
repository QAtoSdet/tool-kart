import type { Metadata } from "next";
import Link from "next/link";
import { HindiToolPage } from "@/components/hi/HindiToolPage";
import { ImageToKb, type ImageToKbLabels } from "@/components/tools/ImageToKb";
import type { FaqItem } from "@/components/tools/ToolPage";
import { ToolJsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/components/seo/metadata";

const englishPath = "/tools/compress-image-to-kb";
const path = `/hi${englishPath}`;
const title = "फ़ोटो का साइज़ KB में कम करें";
const metaDescription =
  "फ़ोटो या हस्ताक्षर का साइज़ 20 KB, 50 KB, 100 KB या अपनी ज़रूरत के KB में कम करें, SSC, रेलवे, बैंक और सरकारी फ़ॉर्म के लिए। मुफ़्त, और फ़ोटो कहीं अपलोड नहीं होती।";

export const metadata: Metadata = buildMetadata({
  title: "फ़ोटो का साइज़ KB में कम करें — 20 KB, 50 KB, 100 KB (फ़ॉर्म के लिए)",
  description: metaDescription,
  path,
  keywords: [
    "फोटो का साइज कम करें",
    "फोटो को kb में कैसे करें",
    "फोटो 50 kb कैसे करें",
    "सिग्नेचर का साइज कम करें",
    "photo size kb kaise kare",
  ],
});

const labels: ImageToKbLabels = {
  errNotImage: "कृपया कोई इमेज फ़ाइल चुनें (JPG, PNG या WebP)।",
  errTooBig: "इस फ़ोटो को बहुत छोटा किए बिना {kb} KB से कम नहीं किया जा सका। थोड़ी बड़ी साइज़ सीमा चुनकर देखें।",
  errGeneric: "कुछ गड़बड़ हो गई। कोई दूसरी फ़ोटो चुनकर देखें।",
  dropPrompt: "फ़ोटो यहाँ खींचकर छोड़ें, या",
  choose: "फ़ोटो चुनें",
  maxSize: "ज़्यादा से ज़्यादा फ़ाइल साइज़",
  customSize: "अपना साइज़ KB में",
  errRange: "5 से 5000 KB के बीच का साइज़ डालें।",
  maxWidth: "ज़्यादा से ज़्यादा चौड़ाई, पिक्सल में (ज़रूरी नहीं)",
  maxWidthHint: "सिर्फ़ तब भरें जब फ़ॉर्म में पिक्सल साइज़ भी तय हो।",
  maxWidthPlaceholder: "जैसे 600",
  working: "काम चल रहा है…",
  makeUnder: "{kb} KB से कम करें",
  resultAlt: "छोटी की गई फ़ोटो",
  belowMinBefore: "⚠ यह फ़ाइल",
  belowMinAfter:
    " की है, जो {min} KB की न्यूनतम सीमा से कम है, इसलिए पोर्टल इसे अस्वीकार कर सकता है। फ़ोटो इतनी छोटी है कि इसे बढ़ाया नहीं जा सकता: बड़ी फ़ोटो लें या ज़्यादा रेज़ोल्यूशन (कम से कम 200 dpi) पर स्कैन करें, फिर दोबारा कोशिश करें।",
  done: "हो गया:",
  allowed: "(सीमा {min}–{max} KB)",
  limit: "(सीमा {max} KB)",
  dims: "{w} × {h} पिक्सल · JPG क्वालिटी {q}%",
  original: "मूल फ़ाइल: {size}",
  alreadyUnder: " — यह पहले से ही सीमा के अंदर थी।",
  download: "JPG डाउनलोड करें",
  footnote:
    "नतीजा हमेशा JPG फ़ाइल होता है, जिसे लगभग हर फ़ॉर्म स्वीकार करता है। साइज़ में 1 KB = 1,000 बाइट गिना जाता है, ताकि फ़ाइल उन पोर्टल पर भी सीमा के अंदर रहे जो 1 KB = 1,024 बाइट मानते हैं।",
};

const faqs: FaqItem[] = [
  {
    question: "फ़ोटो को 50 KB या 20 KB में कैसे करें?",
    answer:
      "फ़ोटो चुनें, 50 KB (या 20 KB) बटन दबाएँ, फिर “KB से कम करें” दबाएँ। टूल अपने-आप सबसे अच्छी क्वालिटी ढूँढता है जो सीमा के अंदर आए, और नई JPG फ़ाइल डाउनलोड के लिए देता है।",
  },
  {
    question: "क्या फ़ाइल ठीक 50 KB की बनेगी?",
    answer:
      "फ़ाइल 50 KB या उससे थोड़ी कम होगी, उससे ज़्यादा कभी नहीं। फ़ॉर्म में अधिकतम सीमा होती है, इसलिए थोड़ा कम होना ही सही है।",
  },
  {
    question: "हस्ताक्षर बहुत छोटा (जैसे 10 KB से कम) बन रहा है, क्या करूँ?",
    answer:
      "कुछ फ़ॉर्म, जैसे IBPS (10–20 KB) और RRB (30–49 KB), न्यूनतम साइज़ भी माँगते हैं। हस्ताक्षर की फ़ोटो बड़ी और साफ़ लें या ज़्यादा DPI पर स्कैन करें, और उसे बहुत छोटा क्रॉप न करें। छोटी फ़ोटो को बड़ा करने से उसमें नई जानकारी नहीं आती।",
  },
  {
    question: "नतीजा हमेशा JPG क्यों होता है?",
    answer:
      "लगभग सभी परीक्षा और सरकारी पोर्टल JPG स्वीकार करते हैं, और JPG फ़ोटो एक जैसी क्वालिटी पर PNG से बहुत छोटी होती है। PNG डालने पर वह JPG में बदल जाती है और पारदर्शी हिस्से सफ़ेद हो जाते हैं।",
  },
  {
    question: "क्या मेरी फ़ोटो कहीं अपलोड होती है?",
    answer: "नहीं। फ़ोटो आपके फ़ोन या कंप्यूटर के ब्राउज़र में ही छोटी होती है। आपकी फ़ोटो, हस्ताक्षर या ID कहीं नहीं भेजी जाती।",
  },
];

const h2 = "text-xl font-semibold text-slate-900 dark:text-white";
const link = "text-blue-600 underline dark:text-blue-400";

export default function HindiCompressImageToKbPage() {
  return (
    <>
      <ToolJsonLd name={title} description={metaDescription} path={path} faqs={faqs} inLanguage="hi" />
      <HindiToolPage
        title={title}
        description="फ़ॉर्म जितना साइज़ माँगता है, फ़ोटो या हस्ताक्षर को उतने KB के अंदर एक बार में लाएँ।"
        path={path}
        englishPath={englishPath}
        hub={{ name: "इमेज टूल", href: "/image-tools" }}
        faqs={faqs}
        privacyText="फ़ोटो आपके ब्राउज़र में ही छोटी होती है। आपकी फ़ोटो या हस्ताक्षर हमारे सर्वर पर न भेजे जाते हैं, न सेव होते हैं।"
        explainer={
          <>
            <h2 className={h2}>कैसे इस्तेमाल करें</h2>
            <ol className="list-decimal space-y-1 pl-5">
              <li>अपनी फ़ोटो या हस्ताक्षर चुनें, या बॉक्स पर खींचकर छोड़ें।</li>
              <li>फ़ॉर्म में दी गई साइज़ सीमा चुनें (जैसे 50 KB), या अपना साइज़ लिखें।</li>
              <li>फ़ॉर्म में पिक्सल साइज़ भी तय हो, तो चौड़ाई भरें। नहीं तो खाली छोड़ दें।</li>
              <li>बटन दबाएँ और JPG डाउनलोड करें।</li>
            </ol>

            <h2 className={h2}>परीक्षा और नौकरी के फ़ॉर्म के लिए</h2>
            <p>
              SSC, रेलवे, बैंक, UPSC और यूनिवर्सिटी के पोर्टल तय साइज़ से बड़ी फ़ोटो और हस्ताक्षर अस्वीकार कर देते हैं।
              यह सीमा आम तौर पर 10 KB से 200 KB के बीच होती है। क्वालिटी का अंदाज़ा लगाकर बार-बार कोशिश करने के बजाय,
              बस सीमा चुनें। टूल सबसे अच्छी दिखने वाली फ़ाइल बनाता है जो उस सीमा में आए।
            </p>
            <p>
              अपनी परीक्षा का सही साइज़ जानना है? हमारे{" "}
              <Link href="/exams" className={link}>
                परीक्षा फ़ोटो और हस्ताक्षर साइज़ पेज
              </Link>{" "}
              (अंग्रेज़ी में) SSC, RRB, UPSC, IBPS, SBI, JEE Main, NEET और CTET के आधिकारिक नियम बताते हैं, और यही
              टूल उस परीक्षा की सीमा पर पहले से सेट रहता है।
            </p>

            <h2 className={h2}>अच्छे नतीजे के लिए सुझाव</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>फ़ोटो को पहले क्रॉप करें, ताकि सिर्फ़ चेहरा या सिर्फ़ हस्ताक्षर रहे। बेकार हिस्सा भी KB खाता है।</li>
              <li>हस्ताक्षर सफ़ेद काग़ज़ पर काले पेन से करें और दिन की रोशनी में फ़ोटो लें।</li>
              <li>
                फ़ॉर्म में न्यूनतम साइज़ भी हो (जैसे 10–20 KB), तो बहुत छोटी फ़ोटो से शुरू न करें। टूल ज़रूरत पड़ने पर क्वालिटी
                बढ़ाता है, और फिर भी साइज़ कम रहे तो चेतावनी दिखाता है।
              </li>
            </ul>
          </>
        }
      >
        <ImageToKb labels={labels} />
      </HindiToolPage>
    </>
  );
}
