import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SETS = [
  {
    name: "Vanya",
    slug: "vanya",
    tagline: "Handspun cotton, naturally dyed",
    description: "Vanya is born from raw cotton spun on a charkha and coloured with indigo, pomegranate, and iron. Each piece takes shape on a pit loom in Maheshwar, where the weaver decides the rhythm of the weave. No two are identical.",
    productDetails: "Handspun kala cotton. Natural dyes: indigo, iron, pomegranate rind. Pit-loom woven in Maheshwar, Madhya Pradesh. Pre-washed and softened.",
    careInstructions: "Hand wash cold with mild detergent. Dry in shade. Natural dyes deepen with wear and age gracefully. Do not bleach.",
    toneFrom: "#c4b5a0",
    toneTo: "#9a8b78",
    items: [
      { name: "Vanya Tunic", category: "top" as const, priceBase: 349900 },
      { name: "Vanya Trousers", category: "bottom" as const, priceBase: 289900 },
      { name: "Vanya Scarf", category: "accessory" as const, priceBase: 149900 },
    ],
  },
  {
    name: "Kashi",
    slug: "kashi",
    tagline: "Woven on pit looms in Varanasi",
    description: "Kashi draws from the silk-weaving tradition of Varanasi. The fabric is a silk-cotton blend handwoven with a fine jamdani technique — each motif inserted by hand, one thread at a time. The result is cloth that breathes and catches light.",
    productDetails: "Silk-cotton blend (60/40). Jamdani handloom technique. Woven in Varanasi, Uttar Pradesh. Unlined, naturally structured.",
    careInstructions: "Dry clean recommended. If hand washing, use cold water and a pH-neutral soap. Press on reverse with a cool iron.",
    toneFrom: "#d4d4d4",
    toneTo: "#a3a3a3",
    items: [
      { name: "Kashi Shirt", category: "top" as const, priceBase: 449900 },
      { name: "Kashi Dhoti Pants", category: "bottom" as const, priceBase: 379900 },
      { name: "Kashi Stole", category: "accessory" as const, priceBase: 199900 },
    ],
  },
  {
    name: "Sutra",
    slug: "sutra",
    tagline: "Silk and cotton, interlocked by hand",
    description: "Sutra uses an interlock weave that binds silk warp to cotton weft without any mechanical intervention. The technique is native to Chanderi, where weavers have refined it across generations. The cloth is sheer, strong, and impossibly light.",
    productDetails: "Chanderi interlock weave. Silk warp, cotton weft. Handwoven in Chanderi, Madhya Pradesh. Naturally crisp hand feel.",
    careInstructions: "Hand wash in cold water. Do not wring. Lay flat to dry. Iron on low heat while slightly damp for best results.",
    toneFrom: "#b0c4b0",
    toneTo: "#88a888",
    items: [
      { name: "Sutra Kurta", category: "top" as const, priceBase: 529900 },
      { name: "Sutra Palazzos", category: "bottom" as const, priceBase: 419900 },
    ],
  },
  {
    name: "Dhara",
    slug: "dhara",
    tagline: "Raw linen, sun-bleached and softened",
    description: "Dhara is made from handwoven linen sourced from small-batch spinners. The yarn is sun-bleached rather than chemically whitened, then woven on a frame loom. The fabric softens dramatically with each wash — it is designed to be worn for years.",
    productDetails: "100% handwoven linen. Sun-bleached. Frame-loom woven. Enzyme-washed for initial softness. Gets better with every wear.",
    careInstructions: "Machine wash gentle cycle, cold water. Tumble dry low or line dry. Linen wrinkles are part of its character — iron only if preferred.",
    toneFrom: "#d4c0a0",
    toneTo: "#b8a080",
    items: [
      { name: "Dhara Overshirt", category: "top" as const, priceBase: 399900 },
      { name: "Dhara Wide Legs", category: "bottom" as const, priceBase: 349900 },
    ],
  },
  {
    name: "Neel",
    slug: "neel",
    tagline: "Indigo-dipped, resist-printed by hand",
    description: "Neel takes its name from the Hindi word for indigo. Each garment is hand-block printed using carved teak blocks and natural indigo paste, then dipped repeatedly until the colour reaches its depth. The prints evolve as the indigo fades with sunlight and wear.",
    productDetails: "Organic cotton khadi. Hand-block printed with natural indigo. Resist-print technique (dabu). Made in Bagru, Rajasthan.",
    careInstructions: "Wash separately for the first three washes. Hand wash cold. Indigo will soften over time — this is intentional. Avoid direct sunlight for storage.",
    toneFrom: "#8b7355",
    toneTo: "#6b5b45",
    items: [
      { name: "Neel Camp Collar", category: "top" as const, priceBase: 319900 },
      { name: "Neel Drawstring Pants", category: "bottom" as const, priceBase: 279900 },
      { name: "Neel Bandana", category: "accessory" as const, priceBase: 89900 },
    ],
  },
  {
    name: "Tara",
    slug: "tara",
    tagline: "Tussar silk with hand-embroidered detail",
    description: "Tara pairs wild tussar silk — harvested without killing the silkworm — with minimal hand embroidery drawn from Chikankari traditions. The embroidery is sparse by design: a single motif on a collar, a line of shadow work along a cuff.",
    productDetails: "Ahimsa tussar silk. Hand-embroidered Chikankari detail. Woven and finished in Lucknow, Uttar Pradesh. Naturally textured grain.",
    careInstructions: "Dry clean only. Store folded in muslin. Tussar silk has a natural slub texture — this is a mark of the wild cocoon, not a defect.",
    toneFrom: "#c8b8a8",
    toneTo: "#a89888",
    items: [
      { name: "Tara Blouse", category: "top" as const, priceBase: 579900 },
      { name: "Tara Skirt", category: "bottom" as const, priceBase: 499900 },
    ],
  },
  {
    name: "Rasa",
    slug: "rasa",
    tagline: "Khadi cotton, spun on the charkha",
    description: "Rasa is pure khadi — hand-spun, hand-woven, untouched by machinery. The cotton is grown in Gujarat and spun in self-help cooperatives. Each metre of fabric takes a full day to produce. Rasa exists because slowness is not a limitation but a value.",
    productDetails: "100% khadi cotton. Hand-spun on charkha, hand-woven. Sourced from Gujarat cooperatives. Naturally breathable and moisture-wicking.",
    careInstructions: "Hand wash cold. Khadi becomes softer and more comfortable with each wash. Line dry. Iron on medium heat.",
    toneFrom: "#a0b0c0",
    toneTo: "#7890a0",
    items: [
      { name: "Rasa Henley", category: "top" as const, priceBase: 269900 },
      { name: "Rasa Joggers", category: "bottom" as const, priceBase: 249900 },
    ],
  },
  {
    name: "Mira",
    slug: "mira",
    tagline: "Wool and silk, woven for winter",
    description: "Mira is a cold-weather cloth woven from a blend of Himalayan pashmina wool and mulberry silk. The weave is tight enough for warmth but light enough to drape. Made in the workshops of Kullu, where the loom sits beside the hearth.",
    productDetails: "Pashmina wool and mulberry silk blend (70/30). Handwoven in Kullu, Himachal Pradesh. Naturally warm, lightweight drape.",
    careInstructions: "Dry clean only. Fold and store with cedar or lavender. Do not hang — wool blends stretch under their own weight. Air out between wears.",
    toneFrom: "#a8b8c8",
    toneTo: "#8898a8",
    items: [
      { name: "Mira Wrap Jacket", category: "top" as const, priceBase: 699900 },
      { name: "Mira Trousers", category: "bottom" as const, priceBase: 549900 },
      { name: "Mira Shawl", category: "accessory" as const, priceBase: 399900 },
    ],
  },
];

const SIZES_TOP = ["XS", "S", "M", "L", "XL"];
const SIZES_BOTTOM = ["28", "30", "32", "34"];

function randomStock() {
  return Math.floor(Math.random() * 10) + 1;
}

async function main() {
  await prisma.badgeAward.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.notifyRequest.deleteMany();
  await prisma.returnRequest.deleteMany();
  await prisma.orderLine.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartLine.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.item.deleteMany();
  await prisma.set.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.homepageSetting.deleteMany();
  await prisma.siteSettings.deleteMany();

  // ── Campaigns ──
  const campaign1 = await prisma.campaign.create({
    data: {
      slug: "thread-and-time",
      title: "Thread and Time",
      subtitle: "A journey to the pit looms of Maheshwar",
      body: "We travelled to the banks of the Narmada to meet the weavers behind Vanya. In Maheshwar, the loom sits in the courtyard and the day begins before sunrise. The warp is dressed by hand, the shuttle thrown in rhythm with breath. What arrives as a finished garment began as a conversation between cotton and colour, held together by patience.\n\nThis campaign documents three days in the workshop — the dyeing vats, the warping posts, the quiet concentration of a weaver counting threads. No garment is rushed. No shortcut exists.",
      credits: JSON.stringify([
        { role: "Photography", name: "Arjun Menon" },
        { role: "Words", name: "Aman Bashera" },
        { role: "Production", name: "Kimondo Studio" },
      ]),
      location: "Maheshwar, Madhya Pradesh",
      date: "September 2026",
      status: "live",
      publishedAt: new Date(),
      sortOrder: 0,
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      slug: "the-colour-indigo",
      title: "The Colour Indigo",
      subtitle: "Hand-block printing in the villages of Bagru",
      body: "Indigo is not a dye — it is a fermentation. The leaves are composted, reduced to a paste, dissolved in a vat with lime and jaggery, and left to breathe. The printer carves teak blocks by hand, presses them into the resist paste, and stamps each metre of cloth before it enters the vat.\n\nIn Bagru, outside Jaipur, this process has not changed in four hundred years. The Neel set was born here — each piece carrying the fingerprint of its maker in the slight irregularity of every print.",
      credits: JSON.stringify([
        { role: "Photography", name: "Priya Kapoor" },
        { role: "Words", name: "Aman Bashera" },
      ]),
      location: "Bagru, Rajasthan",
      date: "August 2026",
      status: "live",
      publishedAt: new Date(),
      sortOrder: 1,
    },
  });

  const campaign3 = await prisma.campaign.create({
    data: {
      slug: "silk-and-shadow",
      title: "Silk and Shadow",
      subtitle: "Chikankari embroidery in Lucknow",
      body: "Chikankari is embroidery done on the wrong side of the fabric so the pattern appears as shadow on the right side. In Lucknow, entire families practise the craft — one person traces the pattern, another stitches, a third washes and finishes. The Tara set carries this tradition in its most restrained form: a single motif where it matters most.",
      credits: JSON.stringify([
        { role: "Photography", name: "Kavya Sharma" },
        { role: "Styling", name: "Rhea Malhotra" },
        { role: "Words", name: "Aman Bashera" },
      ]),
      location: "Lucknow, Uttar Pradesh",
      date: "July 2026",
      status: "live",
      publishedAt: new Date(),
      sortOrder: 2,
    },
  });

  const campaign4 = await prisma.campaign.create({
    data: {
      slug: "winter-in-kullu",
      title: "Winter in Kullu",
      subtitle: "Pashmina and silk from the Himalayan workshops",
      body: "At 1200 metres above sea level, the looms of Kullu produce some of India's finest wool textiles. The pashmina comes from Changthang, the silk from Karnataka — they meet on a handloom in a workshop heated by a single bukhari stove. The Mira set is the result: cloth that holds warmth without weight, drapes without bulk, and ages like good leather.",
      credits: JSON.stringify([
        { role: "Photography", name: "Vikram Joshi" },
        { role: "Words", name: "Aman Bashera" },
      ]),
      location: "Kullu, Himachal Pradesh",
      date: "December 2026",
      status: "live",
      publishedAt: new Date(),
      sortOrder: 3,
    },
  });

  await prisma.campaign.createMany({
    data: [
      {
        slug: "the-warp-and-the-weft",
        title: "The Warp and the Weft",
        subtitle: "Understanding the two directions of cloth",
        body: "Every piece of handloom cloth is a conversation between two sets of threads. The warp runs lengthwise, held taut on the loom. The weft crosses it, carried by the shuttle. Neither is the cloth alone — the cloth is what happens when they meet. This essay traces the mechanics of a single metre of fabric from raw fibre to finished edge.",
        credits: JSON.stringify([{ role: "Words", name: "Aman Bashera" }]),
        location: "Studio",
        date: "June 2026",
        status: "live",
        publishedAt: new Date(),
        sortOrder: 4,
      },
      {
        slug: "earth-to-colour",
        title: "Earth to Colour",
        subtitle: "The mineral and plant dyes behind every shade",
        body: "Before synthetic dyes existed, every colour came from the ground or a leaf. Iron gave black. Turmeric gave yellow. Indigo — fermented, reduced, oxidised — gave blue. At Kimondo, we work with dyers who still extract colour this way. The process is slower, the palette narrower, but the result is cloth that changes with time rather than fading into nothing.",
        credits: JSON.stringify([{ role: "Photography", name: "Sana Iqbal" }, { role: "Words", name: "Aman Bashera" }]),
        location: "Jaipur, Rajasthan",
        date: "May 2026",
        status: "live",
        publishedAt: new Date(),
        sortOrder: 5,
      },
      {
        slug: "hands-at-work",
        title: "Hands at Work",
        subtitle: "Portraits of the makers behind the cloth",
        body: "We asked twelve weavers and dyers across four states to show us their hands. Calluses from the shuttle. Indigo stains that never fully wash out. The particular bend of a finger that has thrown a bobbin ten thousand times. These are the hands that make your clothes. This series is a record of labour that leaves its mark on the body as much as on the cloth.",
        credits: JSON.stringify([{ role: "Photography", name: "Arjun Menon" }, { role: "Portraits", name: "Deepa Nair" }]),
        location: "Multiple locations",
        date: "April 2026",
        status: "live",
        publishedAt: new Date(),
        sortOrder: 6,
      },
      {
        slug: "a-day-on-the-loom",
        title: "A Day on the Loom",
        subtitle: "Twelve hours with a Maheshwari weaver",
        body: "Ramesh Malviya begins at five in the morning. He dresses the warp before the heat arrives, weaves through the morning, breaks when the sun is directly overhead, and returns to the loom at three. By evening he has woven roughly one and a half metres. We spent a full day beside him, documenting the rhythm that produces the Vanya set.",
        credits: JSON.stringify([{ role: "Photography", name: "Kavya Sharma" }, { role: "Words", name: "Aman Bashera" }]),
        location: "Maheshwar, Madhya Pradesh",
        date: "March 2026",
        status: "live",
        publishedAt: new Date(),
        sortOrder: 7,
      },
      {
        slug: "the-khadi-question",
        title: "The Khadi Question",
        subtitle: "Why hand-spun cotton still matters",
        body: "Khadi was a political act before it was a fabric. Gandhi made it a symbol of self-reliance. Today it is something else: a choice to value time over speed, texture over uniformity, the hand over the machine. The Rasa set is made entirely from khadi spun in Gujarat cooperatives. This piece asks what khadi means now — not as a symbol, but as cloth.",
        credits: JSON.stringify([{ role: "Words", name: "Aman Bashera" }]),
        location: "Ahmedabad, Gujarat",
        date: "February 2026",
        status: "live",
        publishedAt: new Date(),
        sortOrder: 8,
      },
      {
        slug: "between-seasons",
        title: "Between Seasons",
        subtitle: "Dressing for the months that have no name",
        body: "India does not have four seasons. It has transitions — the weeks when monsoon gives way to a dry heat, when winter arrives not as snow but as a shift in the morning air. Most of what we make is for these in-between months. Linen that breathes when it is warm and layers when it is not. Cotton that works in October and again in March.",
        credits: JSON.stringify([{ role: "Styling", name: "Rhea Malhotra" }, { role: "Photography", name: "Priya Kapoor" }]),
        location: "Mumbai, Maharashtra",
        date: "October 2026",
        status: "live",
        publishedAt: new Date(),
        sortOrder: 9,
      },
      {
        slug: "the-geometry-of-weaving",
        title: "The Geometry of Weaving",
        subtitle: "Pattern, repetition, and the mathematics of the loom",
        body: "A weave pattern is a grid. Plain weave: over one, under one. Twill: over two, under one, shifted by one thread each row. Satin: over four, under one. Every pattern on a handloom is a mathematical instruction executed by hand. The weaver holds the sequence in memory — no printout, no computer. This piece maps the geometry behind six of the weaves used in Kimondo cloth.",
        credits: JSON.stringify([{ role: "Illustration", name: "Ankit Patel" }, { role: "Words", name: "Aman Bashera" }]),
        location: "Studio",
        date: "January 2026",
        status: "live",
        publishedAt: new Date(),
        sortOrder: 10,
      },
      {
        slug: "varanasi-after-dark",
        title: "Varanasi After Dark",
        subtitle: "The silk weavers who work by lamplight",
        body: "In the narrow lanes of the Sarai Mohana quarter, silk looms run past midnight. The Kashi set comes from these workshops — rooms no wider than the loom itself, lit by a single tube light. The jamdani technique requires the weaver to insert each motif thread by hand, one at a time, into a ground weave that never stops moving. We photographed three workshops over two nights.",
        credits: JSON.stringify([{ role: "Photography", name: "Vikram Joshi" }, { role: "Words", name: "Aman Bashera" }]),
        location: "Varanasi, Uttar Pradesh",
        date: "November 2026",
        status: "live",
        publishedAt: new Date(),
        sortOrder: 11,
      },
      {
        slug: "raw-material",
        title: "Raw Material",
        subtitle: "From fibre to yarn before the loom begins",
        body: "Before weaving starts, the fibre must become yarn. Cotton is ginned, carded, drawn into rovings, and spun — by hand on a charkha, or on a spinning wheel. Silk is reeled from boiled cocoons in a single unbroken filament. Wool is sheared, washed, combed, and twisted. This campaign follows the raw materials behind four Kimondo sets from their source to the moment they are ready for the loom.",
        credits: JSON.stringify([{ role: "Photography", name: "Sana Iqbal" }, { role: "Words", name: "Aman Bashera" }]),
        location: "Gujarat & Karnataka",
        date: "September 2025",
        status: "live",
        publishedAt: new Date(),
        sortOrder: 12,
      },
      {
        slug: "the-finishing-table",
        title: "The Finishing Table",
        subtitle: "What happens after the cloth leaves the loom",
        body: "Weaving is not the last step. The cloth is washed to remove sizing. It is beaten on stone to soften the hand. It is inspected — every metre — for broken threads or tension errors. It is cut, hemmed, and pressed. The finishing table is where fabric becomes garment. This piece documents the final stage of production, the one that never appears in marketing but determines everything you feel when you put the cloth on.",
        credits: JSON.stringify([{ role: "Photography", name: "Deepa Nair" }, { role: "Words", name: "Aman Bashera" }]),
        location: "Maheshwar, Madhya Pradesh",
        date: "August 2025",
        status: "live",
        publishedAt: new Date(),
        sortOrder: 13,
      },
      {
        slug: "monsoon-cloth",
        title: "Monsoon Cloth",
        subtitle: "Dressing for rain without plastic",
        body: "Polyester repels water. Cotton absorbs it. Neither is ideal for the monsoon, but cotton dries and polyester traps heat. Every Kimondo garment for the wet months is made from cotton or linen — fabrics that get wet honestly and dry within hours. This lookbook was shot in Mumbai during the first week of July, in actual rain, on actual streets.",
        credits: JSON.stringify([{ role: "Photography", name: "Priya Kapoor" }, { role: "Styling", name: "Rhea Malhotra" }, { role: "Words", name: "Aman Bashera" }]),
        location: "Mumbai, Maharashtra",
        date: "July 2025",
        status: "live",
        publishedAt: new Date(),
        sortOrder: 14,
      },
      {
        slug: "why-handloom",
        title: "Why Handloom",
        subtitle: "The case for cloth made without electricity",
        body: "A power loom produces sixty metres of fabric per hour. A handloom produces one. The economics are absurd. The environmental argument is clear but insufficient — people do not wear arguments. The real case for handloom is simpler: it produces better cloth. Irregular tension creates texture. Variable beating creates drape. The human hand creates what no machine can replicate — variation within consistency. This is our founding essay.",
        credits: JSON.stringify([{ role: "Words", name: "Aman Bashera" }]),
        location: "Studio",
        date: "June 2025",
        status: "live",
        publishedAt: new Date(),
        sortOrder: 15,
      },
    ],
  });

  const campaignMap: Record<string, string> = {
    vanya: campaign1.id,
    neel: campaign2.id,
    tara: campaign3.id,
    mira: campaign4.id,
  };

  // ── Sets with Items and Variants ──
  const setIds: string[] = [];

  for (let i = 0; i < SETS.length; i++) {
    const s = SETS[i];
    const skuPrefix = s.slug.toUpperCase().slice(0, 3);

    const items = s.items.map((item, j) => {
      const sizes =
        item.category === "accessory"
          ? [{ size: "One size", sku: `${skuPrefix}-OS-A`, stock: randomStock() }]
          : item.category === "top"
            ? SIZES_TOP.map((sz) => ({ size: sz, sku: `${skuPrefix}-${sz}-T${j}`, stock: randomStock() }))
            : SIZES_BOTTOM.map((sz) => ({ size: sz, sku: `${skuPrefix}-${sz}-B${j}`, stock: randomStock() }));

      return {
        name: item.name,
        category: item.category,
        price: item.priceBase,
        sortOrder: j,
        variants: { create: sizes },
      };
    });

    const set = await prisma.set.create({
      data: {
        slug: s.slug,
        name: s.name,
        tagline: s.tagline,
        description: s.description,
        productDetails: s.productDetails,
        careInstructions: s.careInstructions,
        toneFrom: s.toneFrom,
        toneTo: s.toneTo,
        status: "live",
        campaignId: campaignMap[s.slug] || null,
        sortOrder: i,
        items: { create: items },
      },
    });

    setIds.push(set.id);
  }

  // ── Badges (one per set, first 8) ──
  for (let i = 0; i < Math.min(8, setIds.length); i++) {
    await prisma.badge.create({
      data: { name: SETS[i].name, setId: setIds[i] },
    });
  }

  // ── FAQ ──
  await prisma.faq.createMany({
    data: [
      {
        question: "What does handloom mean?",
        answer: "Every Kimondo garment is woven on a manually operated loom — no electricity, no automation. The weaver controls the tension, the pattern, and the pace. This is what gives handloom cloth its distinctive texture and slight irregularity.",
        section: "The cloth",
        sortOrder: 0,
      },
      {
        question: "Are your dyes natural?",
        answer: "Most of our dyes are plant-derived: indigo from the indigofera leaf, ochre from iron-rich earth, yellow from pomegranate rind. Some sets use azo-free synthetic dyes where colour fastness requires it. Each product page specifies the dye method used.",
        section: "The cloth",
        sortOrder: 1,
      },
      {
        question: "How should I care for handloom garments?",
        answer: "Hand wash in cold water with a mild detergent. Do not wring — press gently and lay flat to dry. Handloom fabrics soften with each wash. Specific care instructions are listed on every set page and printed on the garment label.",
        section: "Care",
        sortOrder: 2,
      },
      {
        question: "Do you offer free shipping?",
        answer: "Yes. All orders ship free across India. We use a domestic courier partner with tracking. Delivery typically takes 5–7 business days depending on your location.",
        section: "Orders",
        sortOrder: 3,
      },
      {
        question: "What is your return policy?",
        answer: "We accept returns within 7 days of delivery and exchanges within 14 days, provided the garment is unworn, unwashed, and in its original packaging. Return shipping is on us. Refunds are processed to the original payment method within 5 business days.",
        section: "Orders",
        sortOrder: 4,
      },
      {
        question: "How do sizes work?",
        answer: "Each set page includes a size guide with measurements in inches. If you are between sizes, we recommend sizing up — handloom cloth does not stretch. You can save your size profile in your account for faster checkout.",
        section: "Fit",
        sortOrder: 5,
      },
      {
        question: "Can I buy individual pieces from a set?",
        answer: "Yes. Every item in a set is sold individually. You can buy the full set or any single piece — a top on its own, a scarf without the kurta. The set page lists each piece with its own price.",
        section: "Orders",
        sortOrder: 6,
      },
      {
        question: "What are badges?",
        answer: "When you purchase from a set, you earn that set's badge. Badges solidify after the return window closes and live permanently on your profile. They are a record of the cloth you have chosen to wear.",
        section: "Your account",
        sortOrder: 7,
      },
    ],
  });

  // ── Policies ──
  await prisma.policy.createMany({
    data: [
      {
        slug: "privacy",
        title: "Privacy Policy",
        body: "Kimondo collects your name, email address, phone number, and delivery address when you create an account or place an order. This information is used solely to process orders, communicate delivery updates, and improve your experience on the site.\n\nWe do not sell, rent, or share your personal information with third parties for marketing purposes. Payment processing is handled by Razorpay; we do not store card details on our servers.\n\nCookies are used to maintain your session and remember your preferences. You may disable cookies in your browser settings, though this may affect site functionality.\n\nFor questions about your data, write to hello@kimondo.in.",
      },
      {
        slug: "terms",
        title: "Terms of Service",
        body: "By using kimondo.in, you agree to these terms. Kimondo is operated by Aman Bashera as a sole proprietorship registered in India.\n\nAll prices are listed in Indian Rupees and are inclusive of GST. Prices may change without notice, but confirmed orders are honoured at the price shown at checkout.\n\nProduct images are representative. Due to the handmade nature of our garments, slight variations in colour, texture, and pattern are inherent and expected. These are not defects.\n\nKimondo reserves the right to cancel orders in cases of pricing errors, suspected fraud, or stock discrepancies. In such cases, a full refund will be issued.",
      },
      {
        slug: "shipping",
        title: "Shipping Policy",
        body: "All orders ship free within India. We dispatch within 2 business days of order confirmation.\n\nDelivery typically takes 5–7 business days, depending on your location. Remote pincodes may take up to 10 business days.\n\nOnce shipped, you will receive a tracking reference by email. You can also track your order from your profile page.\n\nWe do not currently ship internationally. If you are outside India and interested in Kimondo, write to the founder — we may be able to arrange something.",
      },
      {
        slug: "returns",
        title: "Returns Policy",
        body: "We accept returns within 7 days of delivery. The garment must be unworn, unwashed, and returned in its original packaging with all tags attached.\n\nTo initiate a return, go to your profile, find the order, and select 'Return'. We will arrange a reverse pickup at no cost to you.\n\nRefunds are processed within 5 business days of receiving the returned item, to the original payment method.\n\nItems purchased during a sale or at a reduced price are eligible for exchange only, not refund.",
      },
      {
        slug: "cancellation",
        title: "Cancellation Policy",
        body: "Orders can be cancelled before they are dispatched. Once an order has shipped, it cannot be cancelled — you may return it after delivery under our returns policy.\n\nTo cancel, write to hello@kimondo.in with your order number. If the order has not yet been handed to the courier, we will cancel it and issue a full refund within 3 business days.",
      },
    ],
  });

  // ── Homepage Settings ──
  await prisma.homepageSetting.create({
    data: {
      ctaLabel: "Enter the collection",
      ctaTarget: "/store",
      featuredSetIds: JSON.stringify(setIds.slice(0, 4)),
    },
  });

  // ── Site Settings ──
  await prisma.siteSettings.create({
    data: {
      returnWindowDays: 7,
      exchangeWindowDays: 14,
      founderEmail: "hello@kimondo.in",
      socialLinks: JSON.stringify(["https://instagram.com/kimondo"]),
    },
  });

  // ── Admin User ──
  await prisma.user.upsert({
    where: { email: "tejxshrivastava@gmail.com" },
    update: { role: "admin" },
    create: {
      email: "tejxshrivastava@gmail.com",
      name: "Tejas Shrivastava",
      role: "admin",
    },
  });

  const campaignCount = await prisma.campaign.count();
  console.log(`Seed complete — ${SETS.length} sets, ${campaignCount} campaigns, 8 FAQs, 5 policies.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
