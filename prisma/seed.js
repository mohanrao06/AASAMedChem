const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: "Admin", email: "admin@test.com", password: "admin123", role: "ADMIN" },
    { name: "Seller", email: "seller@test.com", password: "seller123", role: "SELLER" },
    { name: "Buyer", email: "buyer@test.com", password: "buyer123", role: "BUYER" },
    { name: "Seller One", email: "seller1@test.com", password: "seller123", role: "SELLER" },
    { name: "Seller Two", email: "seller2@test.com", password: "seller123", role: "SELLER" },
    { name: "Buyer Two", email: "buyer2@test.com", password: "buyer123", role: "BUYER" },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  console.log("Users upserted");

  // create sample products for sellers
  const sellers = await prisma.user.findMany({ where: { role: "SELLER" } });

  const sampleProducts = [
    {
      name: "Acetic Acid",
      description: "Industrial grade glacial acetic acid.",
      sku: "ACET-001",
      dimension: "VOLUME",
      baseUnit: "ML",
      stockQuantity: "50000", // mL
      pricePerUnit: "0.5", // INR per mL
    },
    {
      name: "Sodium Chloride",
      description: "Analytical grade salt.",
      sku: "NACL-100",
      dimension: "WEIGHT",
      baseUnit: "G",
      stockQuantity: "100000", // g
      pricePerUnit: "0.05", // INR per g
    },
    {
      name: "Ethanol",
      description: "Laboratory ethanol.",
      sku: "ETH-500",
      dimension: "VOLUME",
      baseUnit: "ML",
      stockQuantity: "200000", // mL
      pricePerUnit: "0.8", // INR per mL
    },
    {
      name: "Test Tube Pack",
      description: "Pack of 100 disposable test tubes.",
      sku: "TT-100",
      dimension: "COUNT",
      baseUnit: "UNIT",
      stockQuantity: "1000",
      pricePerUnit: "150", // INR per unit
    },
  ];
  // Add programmatically generated products to increase sample size
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateProducts(count, startIndex = 1) {
    const prefixes = ["Hydro", "Sodium", "Potassium", "Calcium", "Magnesium", "Ethyl", "Methyl", "Iso", "Poly", "Mono"];
    const compounds = [
      "Chloride", "Hydroxide", "Sulfate", "Nitrate", "Acetate", "Propionate", "Formate", "Phosphate", "Bromide", "Iodide",
    ];
    const forms = ["Solution", "Powder", "Granules", "Liquid", "Concentrate", "Pellets"];
    const units = ["ML", "G", "UNIT"]; // ML -> VOLUME, G -> WEIGHT, UNIT -> COUNT

    const products = [];
    for (let i = 0; i < count; i++) {
      const idx = startIndex + i;
      const prefix = prefixes[randInt(0, prefixes.length - 1)];
      const comp = compounds[randInt(0, compounds.length - 1)];
      const form = forms[randInt(0, forms.length - 1)];
      const unit = units[randInt(0, units.length - 1)];
      const dimension = unit === "ML" ? "VOLUME" : unit === "G" ? "WEIGHT" : "COUNT";
      const name = `${prefix} ${comp} ${form}`;
      const sku = `${prefix.substring(0,3).toUpperCase()}-${comp.substring(0,3).toUpperCase()}-${idx}`;
      const stock = unit === "UNIT" ? String(randInt(50, 500)) : unit === "ML" ? String(randInt(1000, 200000)) : String(randInt(1000, 100000));
      const price = unit === "UNIT" ? String(randInt(20, 500)) : (Math.random() * (2 - 0.01) + 0.01).toFixed(4);

      products.push({
        name,
        description: `${name} — lab grade sample.`,
        sku,
        dimension,
        baseUnit: unit,
        stockQuantity: stock,
        pricePerUnit: String(price),
      });
    }

    return products;
  }

  const generated = generateProducts(50, 1000);
  const allProducts = sampleProducts.concat(generated);

  // assign products round-robin to sellers and upsert
  for (let i = 0; i < allProducts.length; i++) {
    const p = allProducts[i];
    const seller = sellers[i % sellers.length];

    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        name: p.name,
        description: p.description,
        sku: p.sku,
        dimension: p.dimension,
        baseUnit: p.baseUnit,
        stockQuantity: p.stockQuantity,
        pricePerUnit: p.pricePerUnit,
        sellerId: seller.id,
      },
    });
  }

  console.log("Sample products created/updated (including generated items)");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });