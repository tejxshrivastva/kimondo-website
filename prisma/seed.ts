import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LATIN_NAMES = [
  "Lorem", "Ipsum", "Dolor", "Amet", "Consect", "Adipis", "Tempor", "Incidi",
  "Labore", "Magna", "Veniam", "Nostrud", "Exerci", "Ullamco", "Laboris",
  "Aliquip", "Commodo", "Fugiat", "Pariatur", "Occaecat", "Cupida", "Proident",
  "Mollit", "Voluptas",
];

const TONES: [string, string][] = [
  ["#d4d4d4", "#a3a3a3"], ["#c4b5a0", "#9a8b78"], ["#8b7355", "#6b5b45"], ["#a0b0c0", "#7890a0"],
  ["#c8b8a8", "#a89888"], ["#b0c4b0", "#88a888"], ["#d4c0a0", "#b8a080"], ["#a8b8c8", "#8898a8"],
  ["#c0a890", "#a08870"], ["#b8c8b0", "#98a890"], ["#d0b8a0", "#b09880"], ["#a0a8b8", "#808898"],
  ["#c8c0b0", "#a8a090"], ["#b0b8c0", "#9098a0"], ["#d4c8b8", "#b4a898"], ["#a8b0a8", "#889088"],
  ["#c0b0a0", "#a09080"], ["#b8b0c0", "#9890a0"], ["#d0c0b0", "#b0a090"], ["#a0b8b0", "#809890"],
  ["#c8b0a8", "#a89088"], ["#b0c0b8", "#90a098"], ["#d4b8a8", "#b49888"], ["#a8c0b8", "#88a098"],
];

const ITEM_NAMES = [
  "Vestibulum", "Pellentesque", "Suspendisse", "Curabitur", "Fermentum",
  "Malesuada", "Venenatis", "Sagittis", "Porttitor", "Ultricies",
  "Faucibus", "Accumsan", "Eleifend", "Bibendum", "Placerat",
  "Pharetra", "Pulvinar", "Vehicula", "Interdum", "Praesent",
  "Maecenas", "Tristique", "Convallis", "Dignissim",
];

const SIZES_TOP = ["XS", "S", "M", "L", "XL"];
const SIZES_BOTTOM = ["28", "30", "32", "34"];

function randomStock() {
  return Math.floor(Math.random() * 10) + 1;
}

async function main() {
  // Clear existing data
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
      slug: "lorem-ipsum-dolor",
      title: "Lorem ipsum dolor",
      subtitle: "Sed ut perspiciatis unde",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      credits: JSON.stringify([
        { role: "Lorem", name: "Ipsum Dolor" },
        { role: "Amet", name: "Consectetur Elit" },
        { role: "Tempor", name: "Incididunt Labore" },
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
      slug: "consectetur-adipiscing",
      title: "Consectetur adipiscing",
      subtitle: "Nemo enim ipsam voluptatem",
      body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      credits: JSON.stringify([
        { role: "Lorem", name: "Magna Aliqua" },
        { role: "Amet", name: "Veniam Nostrud" },
      ]),
      location: "Chanderi, Madhya Pradesh",
      date: "August 2026",
      status: "live",
      publishedAt: new Date(),
      sortOrder: 1,
    },
  });

  const campaign3 = await prisma.campaign.create({
    data: {
      slug: "sit-amet-elit",
      title: "Sit amet elit",
      subtitle: "Quis autem vel eum",
      body: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
      credits: JSON.stringify([
        { role: "Lorem", name: "Ullamco Laboris" },
      ]),
      location: "Varanasi, Uttar Pradesh",
      date: "July 2026",
      status: "live",
      publishedAt: new Date(),
      sortOrder: 2,
    },
  });

  const campaign4 = await prisma.campaign.create({
    data: {
      slug: "sed-do-eiusmod",
      title: "Sed do eiusmod",
      subtitle: "At vero eos et accusamus",
      body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      credits: JSON.stringify([
        { role: "Lorem", name: "Exercitation Ullamco" },
        { role: "Amet", name: "Aliquip Commodo" },
        { role: "Tempor", name: "Fugiat Pariatur" },
      ]),
      location: "Bhagalpur, Bihar",
      date: "June 2026",
      status: "live",
      publishedAt: new Date(),
      sortOrder: 3,
    },
  });

  const campaigns = [campaign1, campaign2, campaign3, campaign4];

  // ── 24 Sets with Items and Variants ──
  const setIds: string[] = [];

  for (let i = 0; i < 24; i++) {
    const name = LATIN_NAMES[i];
    const slug = name.toLowerCase();
    const [tFrom, tTo] = TONES[i];
    const campaignId = i < 4 ? campaigns[i].id : (i < 8 ? campaigns[i % 4].id : null);
    const basePrice = 120000 + Math.floor(Math.random() * 300000);
    const itemNameOffset = i % ITEM_NAMES.length;
    const skuPrefix = `S${String(i).padStart(2, "0")}`;

    const items = [];

    // Every set gets a top
    items.push({
      name: ITEM_NAMES[(itemNameOffset) % ITEM_NAMES.length],
      category: "top",
      price: basePrice,
      sortOrder: 0,
      variants: {
        create: SIZES_TOP.map((s) => ({
          size: s,
          sku: `${skuPrefix}-${s}-T`,
          stock: randomStock(),
        })),
      },
    });

    // Most sets get a bottom
    if (i % 5 !== 4) {
      items.push({
        name: ITEM_NAMES[(itemNameOffset + 1) % ITEM_NAMES.length],
        category: "bottom",
        price: basePrice + 30000,
        sortOrder: 1,
        variants: {
          create: SIZES_BOTTOM.map((s) => ({
            size: s,
            sku: `${skuPrefix}-${s}-B`,
            stock: randomStock(),
          })),
        },
      });
    }

    // Some sets get an accessory
    if (i % 3 === 0) {
      items.push({
        name: ITEM_NAMES[(itemNameOffset + 2) % ITEM_NAMES.length],
        category: "accessory",
        price: Math.floor(basePrice * 0.6),
        sortOrder: 2,
        variants: {
          create: [{ size: "One size", sku: `${skuPrefix}-OS-A`, stock: randomStock() }],
        },
      });
    }

    const set = await prisma.set.create({
      data: {
        slug,
        name,
        tagline: "Lorem ipsum dolor sit amet",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
        productDetails:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        careInstructions:
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
        toneFrom: tFrom,
        toneTo: tTo,
        status: "live",
        campaignId,
        sortOrder: i,
        items: { create: items },
      },
    });

    setIds.push(set.id);
  }

  // ── Badges (one per set, first 8) ──
  for (let i = 0; i < 8; i++) {
    await prisma.badge.create({
      data: { name: LATIN_NAMES[i], setId: setIds[i] },
    });
  }

  // ── FAQ ──
  await prisma.faq.createMany({
    data: [
      {
        question: "Lorem ipsum dolor sit amet?",
        answer:
          "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
        section: "Lorem",
        sortOrder: 0,
      },
      {
        question: "Ut enim ad minim veniam?",
        answer:
          "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
        section: "Lorem",
        sortOrder: 1,
      },
      {
        question: "Duis aute irure dolor?",
        answer:
          "In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
        section: "Ipsum",
        sortOrder: 2,
      },
      {
        question: "Excepteur sint occaecat?",
        answer:
          "Cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error.",
        section: "Dolor",
        sortOrder: 3,
      },
      {
        question: "Sed ut perspiciatis unde?",
        answer:
          "Omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.",
        section: "Dolor",
        sortOrder: 4,
      },
    ],
  });

  // ── Policies ──
  await prisma.policy.createMany({
    data: [
      {
        slug: "privacy",
        title: "Lorem Ipsum",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      },
      {
        slug: "terms",
        title: "Dolor Sit Amet",
        body: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.\n\nQuis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
      {
        slug: "shipping",
        title: "Sed Do Eiusmod",
        body: "Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.\n\nUllamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
      },
      {
        slug: "returns",
        title: "Ut Enim Ad Minim",
        body: "Veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.\n\nIn reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.\n\nSunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis.",
      },
      {
        slug: "cancellation",
        title: "Quis Nostrud",
        body: "Exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.\n\nVelit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      },
    ],
  });

  // ── Homepage Settings ──
  await prisma.homepageSetting.create({
    data: {
      ctaLabel: "Lorem ipsum",
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
    where: { email: "admin@kimondo.in" },
    update: { role: "admin" },
    create: {
      email: "admin@kimondo.in",
      name: "Lorem Admin",
      role: "admin",
    },
  });

  console.log("Seed complete — 24 sets created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
