import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCT_COUNT = 24;
const ARCHIVE_COUNT = 16;

const SIZES_TOP = ["XS", "S", "M", "L", "XL"];
const SIZES_BOTTOM = ["28", "30", "32", "34"];

function randomStock() {
  return Math.floor(Math.random() * 10) + 1;
}

function itemsForProduct(n: number): { category: "top" | "bottom" | "accessory"; priceBase: number }[] {
  if (n % 3 === 1) return [
    { category: "top", priceBase: 299900 + n * 10000 },
    { category: "bottom", priceBase: 249900 + n * 10000 },
    { category: "accessory", priceBase: 99900 + n * 5000 },
  ];
  if (n % 3 === 2) return [
    { category: "top", priceBase: 349900 + n * 10000 },
    { category: "bottom", priceBase: 299900 + n * 10000 },
  ];
  return [
    { category: "top", priceBase: 399900 + n * 10000 },
    { category: "bottom", priceBase: 349900 + n * 10000 },
    { category: "accessory", priceBase: 149900 + n * 5000 },
  ];
}

function toneForProduct(n: number): { from: string; to: string } {
  const tones = [
    { from: "#c4b5a0", to: "#9a8b78" },
    { from: "#d4d4d4", to: "#a3a3a3" },
    { from: "#b0c4b0", to: "#88a888" },
    { from: "#d4c0a0", to: "#b8a080" },
    { from: "#8b7355", to: "#6b5b45" },
    { from: "#c8b8a8", to: "#a89888" },
    { from: "#a0b0c0", to: "#7890a0" },
    { from: "#a8b8c8", to: "#8898a8" },
    { from: "#c0a890", to: "#a08870" },
    { from: "#b8b8b8", to: "#909090" },
    { from: "#a8c0a8", to: "#80a080" },
    { from: "#c8c0b0", to: "#a8a090" },
  ];
  return tones[(n - 1) % tones.length];
}

const CATEGORY_LABEL: Record<string, string> = { top: "Top", bottom: "Bottom", accessory: "Accessory" };
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

  // ── Archive stories (16, individually created for campaignMap linking) ──
  const campaignIds: string[] = [];

  for (let i = 1; i <= ARCHIVE_COUNT; i++) {
    const c = await prisma.campaign.create({
      data: {
        slug: `archive-${i}`,
        title: `Archive ${i}`,
        subtitle: `Subtitle for Archive ${i}`,
        body: `Body content for Archive ${i} — replace this with your editorial story.`,
        credits: JSON.stringify([
          { role: "Photography", name: "Photographer name" },
          { role: "Words", name: "Writer name" },
        ]),
        location: `Location for Archive ${i}`,
        date: `${MONTHS[(i - 1) % 12]} 2026`,
        status: "live",
        publishedAt: new Date(),
        sortOrder: i - 1,
      },
    });
    campaignIds.push(c.id);
  }

  // ── Products (24) ──
  const setIds: string[] = [];

  for (let n = 1; n <= PRODUCT_COUNT; n++) {
    const skuPrefix = `P${n}`;
    const templates = itemsForProduct(n);
    const tone = toneForProduct(n);

    const items = templates.map((tmpl, j) => {
      const sizes =
        tmpl.category === "accessory"
          ? [{ size: "One size", sku: `${skuPrefix}-OS-A${j}`, stock: randomStock() }]
          : tmpl.category === "top"
            ? SIZES_TOP.map((sz) => ({ size: sz, sku: `${skuPrefix}-${sz}-T${j}`, stock: randomStock() }))
            : SIZES_BOTTOM.map((sz) => ({ size: sz, sku: `${skuPrefix}-${sz}-B${j}`, stock: randomStock() }));

      return {
        name: `Product ${n} — ${CATEGORY_LABEL[tmpl.category]}`,
        category: tmpl.category,
        price: tmpl.priceBase,
        sortOrder: j,
        variants: { create: sizes },
      };
    });

    const set = await prisma.set.create({
      data: {
        slug: `product-${n}`,
        name: `Product ${n}`,
        tagline: `Tagline for Product ${n}`,
        description: `Description for Product ${n} — replace this with your product story.`,
        productDetails: `Product details for Product ${n} — material, origin, technique.`,
        careInstructions: `Care instructions for Product ${n}.`,
        toneFrom: tone.from,
        toneTo: tone.to,
        status: "live",
        campaignId: n <= ARCHIVE_COUNT ? campaignIds[n - 1] : null,
        sortOrder: n - 1,
        items: { create: items },
      },
    });

    setIds.push(set.id);
  }

  // ── Badges (first 8 products) ──
  for (let i = 0; i < Math.min(8, PRODUCT_COUNT); i++) {
    await prisma.badge.create({
      data: { name: `Product ${i + 1}`, setId: setIds[i] },
    });
  }

  // ── FAQ ──
  await prisma.faq.createMany({
    data: [
      { question: "What does handloom mean?", answer: "Every Kimondo garment is woven on a manually operated loom — no electricity, no automation. The weaver controls the tension, the pattern, and the pace. This is what gives handloom cloth its distinctive texture and slight irregularity.", section: "The cloth", sortOrder: 0 },
      { question: "Are your dyes natural?", answer: "Most of our dyes are plant-derived: indigo from the indigofera leaf, ochre from iron-rich earth, yellow from pomegranate rind. Some sets use azo-free synthetic dyes where colour fastness requires it. Each product page specifies the dye method used.", section: "The cloth", sortOrder: 1 },
      { question: "How should I care for handloom garments?", answer: "Hand wash in cold water with a mild detergent. Do not wring — press gently and lay flat to dry. Handloom fabrics soften with each wash. Specific care instructions are listed on every product page and printed on the garment label.", section: "Care", sortOrder: 2 },
      { question: "Do you offer free shipping?", answer: "Yes. All orders ship free across India. We use a domestic courier partner with tracking. Delivery typically takes 5–7 business days depending on your location.", section: "Orders", sortOrder: 3 },
      { question: "What is your return policy?", answer: "We accept returns within 7 days of delivery and exchanges within 14 days, provided the garment is unworn, unwashed, and in its original packaging. Return shipping is on us. Refunds are processed to the original payment method within 5 business days.", section: "Orders", sortOrder: 4 },
      { question: "How do sizes work?", answer: "Each product page includes a size guide with measurements in inches. If you are between sizes, we recommend sizing up — handloom cloth does not stretch. You can save your size profile in your account for faster checkout.", section: "Fit", sortOrder: 5 },
      { question: "Can I buy individual pieces from a set?", answer: "Yes. Every item in a product is sold individually. You can buy the full set or any single piece — a top on its own, a scarf without the kurta. The product page lists each piece with its own price.", section: "Orders", sortOrder: 6 },
      { question: "What are badges?", answer: "When you purchase from a product, you earn that product's badge. Badges solidify after the return window closes and live permanently on your profile. They are a record of the cloth you have chosen to wear.", section: "Your account", sortOrder: 7 },
    ],
  });

  // ── Policies ──
  await prisma.policy.createMany({
    data: [
      { slug: "privacy", title: "Privacy Policy", body: "Kimondo collects your name, email address, phone number, and delivery address when you create an account or place an order. This information is used solely to process orders, communicate delivery updates, and improve your experience on the site.\n\nWe do not sell, rent, or share your personal information with third parties for marketing purposes. Payment processing is handled by Razorpay; we do not store card details on our servers.\n\nCookies are used to maintain your session and remember your preferences. You may disable cookies in your browser settings, though this may affect site functionality.\n\nFor questions about your data, write to hello@kimondo.in." },
      { slug: "terms", title: "Terms of Service", body: "By using kimondo.in, you agree to these terms. Kimondo is operated by Aman Bashera as a sole proprietorship registered in India.\n\nAll prices are listed in Indian Rupees and are inclusive of GST. Prices may change without notice, but confirmed orders are honoured at the price shown at checkout.\n\nProduct images are representative. Due to the handmade nature of our garments, slight variations in colour, texture, and pattern are inherent and expected. These are not defects.\n\nKimondo reserves the right to cancel orders in cases of pricing errors, suspected fraud, or stock discrepancies. In such cases, a full refund will be issued." },
      { slug: "shipping", title: "Shipping Policy", body: "All orders ship free within India. We dispatch within 2 business days of order confirmation.\n\nDelivery typically takes 5–7 business days, depending on your location. Remote pincodes may take up to 10 business days.\n\nOnce shipped, you will receive a tracking reference by email. You can also track your order from your profile page.\n\nWe do not currently ship internationally. If you are outside India and interested in Kimondo, write to the founder — we may be able to arrange something." },
      { slug: "returns", title: "Returns Policy", body: "We accept returns within 7 days of delivery. The garment must be unworn, unwashed, and returned in its original packaging with all tags attached.\n\nTo initiate a return, go to your profile, find the order, and select 'Return'. We will arrange a reverse pickup at no cost to you.\n\nRefunds are processed within 5 business days of receiving the returned item, to the original payment method.\n\nItems purchased during a sale or at a reduced price are eligible for exchange only, not refund." },
      { slug: "cancellation", title: "Cancellation Policy", body: "Orders can be cancelled before they are dispatched. Once an order has shipped, it cannot be cancelled — you may return it after delivery under our returns policy.\n\nTo cancel, write to hello@kimondo.in with your order number. If the order has not yet been handed to the courier, we will cancel it and issue a full refund within 3 business days." },
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
  console.log(`Seed complete — ${PRODUCT_COUNT} products, ${campaignCount} archive stories, 8 FAQs, 5 policies.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
