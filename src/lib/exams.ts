/**
 * Official photo / signature upload rules for exam application forms.
 *
 * EVERY figure here must come from the exam body's own notice or instructions — never from
 * coaching or calculator sites, which are often out of date (several still quote UPSC's old
 * 300 KB photo limit, NEET's old 4–30 KB signature limit, and a NEET postcard-photo upload that
 * 2026 doesn't require). Record the source and the date it was checked; re-check every exam
 * cycle, because these rules change. Where a notice contradicts itself, say so on the page
 * rather than silently picking one figure.
 */

export interface ExamUpload {
  /** Short id, unique within the exam, e.g. "photo". */
  id: string;
  label: string;
  /** File size limits in KB. When `uploadable` is false these are omitted. */
  minKb?: number;
  maxKb?: number;
  /** Dimensions as the notice words them, e.g. "200 × 230 pixels (preferred)". */
  dimensions?: string;
  format?: string;
  /** False for things captured live in the portal (nothing to resize). */
  uploadable: boolean;
  /** Plain-language rules from the notice. */
  rules: string[];
}

export interface ExamSource {
  title: string;
  url: string;
}

export interface Exam {
  /** URL slug: /exams/<slug>. */
  slug: string;
  /** Short name for cards and breadcrumbs, e.g. "SSC CGL 2026". */
  name: string;
  /** Full page title (H1). */
  title: string;
  /** Meta description. */
  description: string;
  conductingBody: string;
  /** One-paragraph summary shown under the H1. */
  summary: string;
  uploads: ExamUpload[];
  /** Important points that aren't tied to one upload (live photo, inconsistencies, cycle). */
  notes: string[];
  faqs: { question: string; answer: string }[];
  sources: ExamSource[];
  /** ISO date the figures were last checked against the sources. */
  lastChecked: string;
  keywords: string[];
}

export const EXAMS: Exam[] = [
  {
    slug: "ssc-cgl-photo-signature-size",
    name: "SSC CGL 2026",
    title: "SSC CGL 2026 Photo and Signature Size (10–20 KB Signature)",
    description:
      "Official SSC CGL 2026 upload rules: the photo is captured live, and the signature must be a 10–20 KB JPG. Resize your signature to the right size here, free and private.",
    conductingBody: "Staff Selection Commission (SSC)",
    summary:
      "For CGL 2026 you no longer upload a passport photo. The portal captures a live photo through your webcam or the mobile app. The only image you upload is your signature, which must be a JPG between 10 KB and 20 KB.",
    uploads: [
      {
        id: "photo",
        label: "Photograph",
        uploadable: false,
        rules: [
          "Captured live during the application through a webcam or the mobile app. You can't upload an existing photo.",
          "No cap, mask or spectacles. Your face must be fully inside the area marked by the camera, neither too close nor too far.",
          "Applications that capture an existing photo instead of a live one are rejected.",
        ],
      },
      {
        id: "signature",
        label: "Signature",
        minKb: 10,
        maxKb: 20,
        format: "JPEG/JPG",
        dimensions: "About 6.0 cm × 2.0 cm (para 9.6) — the how-to-apply annexure says about 4.0 cm × 2.0 cm",
        uploadable: true,
        rules: [
          "Blurred or miniature (very small) signatures are rejected summarily.",
          "PwD (VH) candidates may use a thumb impression.",
        ],
      },
    ],
    notes: [
      "The notice is inconsistent on the signature's shape: paragraph 9.6 says about 6.0 × 2.0 cm, while the how-to-apply annexure says about 4.0 × 2.0 cm. Both agree on JPG and 10–20 KB. Sign wide rather than tall, and follow what the portal accepts.",
      "Older articles quote a 12 KB limit. That's out of date: the 2026 notice allows 10–20 KB.",
      "The notice says applications submitted through Aadhaar-based authentication won't be rejected on these photo and signature grounds.",
      "These rules are from the CGL 2026 notice. Other SSC exams (CHSL, MTS, GD and so on) publish their own notices, so check yours.",
    ],
    faqs: [
      {
        question: "Do I need to upload a photo for SSC CGL 2026?",
        answer:
          "No. The photo is captured live during the application through your webcam or the mobile app. Only the signature is uploaded as a file.",
      },
      {
        question: "What is the SSC CGL 2026 signature size?",
        answer:
          "A JPG or JPEG between 10 KB and 20 KB. The notice describes it as about 6.0 cm wide and 2.0 cm high (one annexure says 4.0 × 2.0 cm).",
      },
      {
        question: "Why was my signature rejected?",
        answer:
          "The most common reasons are a file outside 10–20 KB, or a signature that is blurred or very small within the image. Crop close to the signature, sign in dark ink, and resize to just under 20 KB.",
      },
    ],
    sources: [
      {
        title: "SSC notice: Combined Graduate Level Examination, 2026 (published on ssc.gov.in, 21 May 2026), para 9.5–9.6 and how-to-apply annexure",
        url: "https://ssc.gov.in",
      },
    ],
    lastChecked: "2026-11-14",
    keywords: ["ssc cgl signature size", "ssc cgl photo size 2026", "ssc signature 10 to 20 kb", "ssc cgl signature resize"],
  },
  {
    slug: "upsc-photo-signature-size",
    name: "UPSC",
    title: "UPSC Photo and Signature Size (Photo 20–200 KB, Triple Signature 20–100 KB)",
    description:
      "Official UPSC upload rules: photo JPG 20–200 KB with the face covering 75%, plus a triple signature JPG of 20–100 KB. Resize both here, free and private.",
    conductingBody: "Union Public Service Commission (UPSC)",
    summary:
      "UPSC applications need a passport-size photo, a live photo captured in the portal, and a triple signature: your signature written three times, one below the other, scanned as a single image.",
    uploads: [
      {
        id: "photo",
        label: "Passport-size photograph",
        minKb: 20,
        maxKb: 200,
        format: "JPG, file name “photo”",
        uploadable: true,
        rules: [
          "Your face must cover at least 75% (three-quarters) of the photo.",
          "Plain white background. Full face from the front, head in the centre, both ears visible, eyes open.",
          "Natural expression. No dark glasses, no uniform, no shadows on the face or background, hair not covering the eyes.",
          "Don't sign the photo.",
        ],
      },
      {
        id: "live-photo",
        label: "Live photograph",
        uploadable: false,
        rules: [
          "Mandatory. Captured in the portal through your device's webcam or by scanning a QR code with your phone.",
          "Matched against your uploaded passport photo. If they don't match, you can't continue the application.",
        ],
      },
      {
        id: "signature",
        label: "Triple signature",
        minKb: 20,
        maxKb: 100,
        format: "JPG, file name “signature”",
        dimensions: "350–500 pixels (as stated in the instructions)",
        uploadable: true,
        rules: [
          "Sign three times, one below the other, on plain white paper in black ink, with space between each.",
          "Scan all three in a single image: clear, sharp, well lit, upright, with no lines or colours on the paper.",
          "Signature files that don't meet the specification are rejected.",
        ],
      },
    ],
    notes: [
      "Some sites still quote a 20–300 KB photo limit. UPSC's current instructions say 20–200 KB.",
      "UPSC uses the same portal and instructions across its exams (Civil Services, NDA, CDS and others).",
    ],
    faqs: [
      {
        question: "What is the UPSC photo size?",
        answer:
          "A JPG between 20 KB and 200 KB named “photo”, with your face covering at least 75% of the image against a plain white background.",
      },
      {
        question: "What is a triple signature for UPSC?",
        answer:
          "Your normal signature written three times, one below the other, on white paper in black ink, scanned as one JPG of 20–100 KB named “signature”.",
      },
      {
        question: "Why does UPSC need a live photo as well?",
        answer:
          "The live photo taken in the portal is matched against your uploaded passport photo. If they don't match, the application can't go ahead, so use a recent photo that looks like you now.",
      },
    ],
    sources: [
      {
        title: "UPSC: Instructions for uploading the photo & signature (upsconline.nic.in)",
        url: "https://upsconline.nic.in/candidate/resources/bzh30/login/upsc-candidates-portal/dist/assets/instruction-photo-signature-upload-upsc-CCLCIgId.pdf",
      },
    ],
    lastChecked: "2026-11-14",
    keywords: ["upsc photo size", "upsc signature size", "upsc triple signature", "upsc photo 20 to 200 kb"],
  },
  {
    slug: "ibps-sbi-photo-signature-size",
    name: "IBPS & SBI bank exams",
    title: "IBPS & SBI Photo, Signature, Thumb Impression and Declaration Size",
    description:
      "Official IBPS and SBI upload rules: photo 20–50 KB, signature 10–20 KB, left thumb impression 20–50 KB, handwritten declaration 50–100 KB. Resize each here, free and private.",
    conductingBody: "Institute of Banking Personnel Selection (IBPS); SBI's 2026 recruitment form uses the same IBPS-hosted portal",
    summary:
      "IBPS bank applications and SBI's Junior Associates 2026 form (on the same IBPS-hosted portal) ask for four scanned images: photo, signature, left thumb impression and a handwritten declaration. You also capture a live photo. The portal won't let you continue until every file meets its size.",
    uploads: [
      {
        id: "photo",
        label: "Photograph",
        minKb: 20,
        maxKb: 50,
        format: "JPG/JPEG",
        dimensions: "200 × 230 pixels (preferred), 4.5 cm × 3.5 cm",
        uploadable: true,
        rules: [
          "Recent passport-style colour photo against a light, preferably white, background.",
          "Look straight at the camera with a relaxed face. No harsh shadows, squinting or red-eye.",
          "Caps, hats and dark glasses aren't allowed. Religious headwear is allowed if it doesn't cover the face.",
          "A live photo is also captured in the portal by webcam or phone.",
        ],
      },
      {
        id: "signature",
        label: "Signature",
        minKb: 10,
        maxKb: 20,
        format: "JPG/JPEG",
        dimensions: "140 × 60 pixels (preferred)",
        uploadable: true,
        rules: ["Sign on white paper with a black ink pen.", "Not in CAPITAL LETTERS."],
      },
      {
        id: "thumb",
        label: "Left thumb impression",
        minKb: 20,
        maxKb: 50,
        format: "JPG/JPEG",
        dimensions: "240 × 240 pixels at 200 DPI (3 cm × 3 cm)",
        uploadable: true,
        rules: [
          "On white paper with black or blue ink.",
          "No left thumb? Use the right thumb (the notice lists further alternatives and says to state which finger was used).",
        ],
      },
      {
        id: "declaration",
        label: "Handwritten declaration",
        minKb: 50,
        maxKb: 100,
        format: "JPG/JPEG",
        dimensions: "800 × 400 pixels at 200 DPI (10 cm × 5 cm)",
        uploadable: true,
        rules: [
          "Written in English, in your own handwriting, on white paper with black ink. Not in CAPITAL LETTERS.",
          "Copy the exact wording from your notice. The IBPS Clerk 2026 text reads: “I, _______ (Name of the candidate), hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required.”",
          "The SBI 2026 version also asks for your date of birth and adds: “The signature, photograph and left thumb impression is of mine.”",
        ],
      },
    ],
    notes: [
      "The pixel sizes are “preferred”; the KB limits are what the portal checks. If forcing the exact pixel size makes a file fall below its minimum, keep it larger.",
      "Small images are the usual problem here: a tightly cropped signature can be under 10 KB even at top quality. Scan at 200 DPI as the notice suggests, and don't shrink it to tiny dimensions first.",
      "If your signature on the exam-day attendance sheet doesn't match the uploaded one, you can be disqualified.",
    ],
    faqs: [
      {
        question: "What is the IBPS photo and signature size?",
        answer:
          "Photo: JPG, 20–50 KB, 200 × 230 pixels preferred. Signature: JPG, 10–20 KB, 140 × 60 pixels preferred, black ink, not in capitals.",
      },
      {
        question: "What size is the left thumb impression and handwritten declaration?",
        answer:
          "Left thumb impression: JPG, 20–50 KB, 240 × 240 pixels at 200 DPI. Handwritten declaration: JPG, 50–100 KB, 800 × 400 pixels at 200 DPI, in English and not in capitals.",
      },
      {
        question: "My signature is under 10 KB. What do I do?",
        answer:
          "Rescan it at 200 DPI or take a sharper, larger photo of it, and don't crop it to a tiny size. The tool on this page raises quality to reach the minimum where it can, and warns you if the image is simply too small.",
      },
    ],
    sources: [
      {
        title: "IBPS Clerk (CRP CSA-XVI) 2026 notification, Annexure IV: Guidelines for scanning and upload of documents (ibpsreg.ibps.in)",
        url: "https://ibpsreg.ibps.in/csaxvijul26/uploads/loadpdf.php?file=k7m5p%20fQ15erzczr19LP39WYoJS%20pdGTpaeV6Kqlcg%3D%3D&t=1LHArOLA2di0yczXwNDa083LmNWypw%3D%3D",
      },
      {
        title: "SBI Junior Associates 2026, Annexure II: Guidelines for scanning and upload (ibpsreg.ibps.in)",
        url: "https://ibpsreg.ibps.in/sbijajul26/uploads/loadpdf.php?file=k7m5p%20fQ15e7vNTdwtPa1pucmdWyp5rXppSo3aRx&t=1LHArOLA2di0yczXwNDa083LmNWypw%3D%3D",
      },
    ],
    lastChecked: "2026-11-14",
    keywords: [
      "ibps photo signature size",
      "ibps thumb impression size",
      "ibps handwritten declaration size",
      "sbi clerk photo signature size",
    ],
  },
  {
    slug: "neet-ug-photo-signature-size",
    name: "NEET UG 2026",
    title: "NEET UG 2026 Photo, Signature and Thumb Impression Size",
    description:
      "Official NEET UG 2026 rules from the NTA bulletin: photo 10–200 KB, signature 10–100 KB, finger and thumb impressions in JPG. Resize them here, free and private.",
    conductingBody: "National Testing Agency (NTA)",
    summary:
      "The NEET UG 2026 application needed a live photo, a recent passport-size photo, a signature, and left and right hand finger and thumb impressions, all as JPG files.",
    uploads: [
      {
        id: "photo",
        label: "Passport-size photograph",
        minKb: 10,
        maxKb: 200,
        format: "JPG/JPEG",
        uploadable: true,
        rules: [
          "Taken on or after 1 January 2026.",
          "Colour or black and white. Your face (without a mask), including the ears, should fill 80% of the image, against a white background.",
          "A live photo is also captured during the form through your webcam or a QR code on your phone.",
        ],
      },
      {
        id: "signature",
        label: "Signature",
        minKb: 10,
        maxKb: 100,
        format: "JPG/JPEG",
        uploadable: true,
        rules: ["Must be clearly legible."],
      },
      {
        id: "fingers",
        label: "Left and right hand finger and thumb impressions",
        minKb: 50,
        maxKb: 200,
        format: "JPG/JPEG",
        uploadable: true,
        rules: [
          "Unclear impressions are rejected.",
          "The bulletin gives two ranges in different sections (10–200 KB and 50–300 KB). The preset here aims for 50–200 KB, which satisfies both.",
        ],
      },
    ],
    notes: [
      "Many sites say the NEET signature must be 4–30 KB. The NEET (UG) 2026 bulletin says 10–100 KB.",
      "A postcard-size photo was not uploaded in 2026: the bulletin only asks you to keep 4–6 printed copies of the passport-size and postcard-size photos.",
      "NTA doesn't allow correction of these uploads later, so check them before submitting.",
      "The 2026 cycle has finished. NTA publishes a new bulletin each year (usually around February), so check the NEET 2027 bulletin before applying.",
    ],
    faqs: [
      {
        question: "What is the NEET photo size?",
        answer:
          "A JPG between 10 KB and 200 KB, taken on or after 1 January 2026, with your face including ears filling 80% of the image against a white background.",
      },
      {
        question: "What is the NEET signature size?",
        answer: "A clearly legible JPG between 10 KB and 100 KB, according to the NEET (UG) 2026 bulletin.",
      },
      {
        question: "Do I need to upload a postcard-size photo for NEET?",
        answer:
          "Not for 2026. The bulletin asks you to upload a passport-size photo and capture a live photo, and to keep printed passport- and postcard-size copies for later.",
      },
    ],
    sources: [
      {
        title: "NTA: Information Bulletin NEET (UG)-2026 (neet.nta.nic.in)",
        url: "https://cdnbbsr.s3waas.gov.in/s37bc1ec1d9c3426357e69acd5bf320061/uploads/2026/02/202602231394640855.pdf",
      },
    ],
    lastChecked: "2026-11-14",
    keywords: ["neet photo size", "neet signature size", "neet thumb impression size", "neet ug 2026 photo size"],
  },
];

export function getAvailableExams(): Exam[] {
  return EXAMS;
}

export function getExamBySlug(slug: string): Exam | undefined {
  return EXAMS.find((e) => e.slug === slug);
}

export function getExamRoutes(): string[] {
  return EXAMS.map((e) => `/exams/${e.slug}`);
}

/** "10–20 KB" for an upload with limits, else null. */
export function sizeRange(u: ExamUpload): string | null {
  if (u.maxKb === undefined) return null;
  return u.minKb ? `${u.minKb}–${u.maxKb} KB` : `up to ${u.maxKb} KB`;
}
