// .env ichidagi MONGO_URL ni o'qish uchun
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import ProductModel from "../schema/Product.model";

import {
  ProductCollection,
  ProductStatus,
  ProductUnit,
} from "../libs/enums/product.enum";


// ======================================================
// PRODUCT DATA
// ======================================================

const products = [

  // ====================================================
  // 1. FRUIT & VEGETABLE
  // ====================================================

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Fresh Apple",
    productPrice: 6900,
    productLeftCount: 50,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh and juicy apples.",
    productImages: ["uploads/products/fresh-apple.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Banana",
    productPrice: 4500,
    productLeftCount: 45,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh and sweet bananas.",
    productImages: ["uploads/products/banana.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Tomato",
    productPrice: 5900,
    productLeftCount: 35,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh red tomatoes.",
    productImages: ["uploads/products/tomato.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Potato",
    productPrice: 3900,
    productLeftCount: 60,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh potatoes.",
    productImages: ["uploads/products/potito.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Onion",
    productPrice: 3500,
    productLeftCount: 55,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh onions.",
    productImages: ["uploads/products/onion.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Carrot",
    productPrice: 4200,
    productLeftCount: 40,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh carrots.",
    productImages: ["uploads/products/carret.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Cucumber",
    productPrice: 3900,
    productLeftCount: 40,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh green cucumbers.",
    productImages: ["uploads/products/cuocunber.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Lettuce",
    productPrice: 3200,
    productLeftCount: 30,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Fresh green lettuce.",
    productImages: ["uploads/products/barg.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Mango",
    productPrice: 5900,
    productLeftCount: 25,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Sweet and fresh mango.",
    productImages: ["uploads/products/mango.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Kiwi",
    productPrice: 6900,
    productLeftCount: 25,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh kiwi fruit.",
    productImages: ["uploads/products/kiwe.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Green Onion",
    productPrice: 2900,
    productLeftCount: 30,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Fresh green onions.",
    productImages: ["uploads/products/kuk-piyoz.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Eggplant",
    productPrice: 4500,
    productLeftCount: 30,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh eggplant.",
    productImages: ["uploads/products/baqalajon.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Bell Pepper",
    productPrice: 5900,
    productLeftCount: 30,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh colorful bell peppers.",
    productImages: ["uploads/products/bulgor.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.FRUIT_VEGETABLE,
    productName: "Pineapple",
    productPrice: 6500,
    productLeftCount: 20,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Fresh sweet pineapple.",
    productImages: ["uploads/products/ananas.webp"],
    productViews: 0,
  },


  // ====================================================
  // 2. MEAT
  // ====================================================

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Korean Beef",
    productPrice: 29900,
    productLeftCount: 20,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh premium Korean beef.",
    productImages: ["uploads/products/korean-beef.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Beef Tenderloin",
    productPrice: 26900,
    productLeftCount: 20,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh tender beef cut.",
    productImages: ["uploads/products/Mol-Lahim.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Beef Shoulder",
    productPrice: 21900,
    productLeftCount: 20,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh beef shoulder meat.",
    productImages: ["uploads/products/Mol-yelka.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Ground Beef",
    productPrice: 15900,
    productLeftCount: 25,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh ground beef.",
    productImages: ["uploads/products/Mol-Qiyma.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Lamb Ribs",
    productPrice: 23900,
    productLeftCount: 20,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh lamb ribs.",
    productImages: ["uploads/products/Qo'y-qovurga.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Premium Lamb Ribs",
    productPrice: 29900,
    productLeftCount: 15,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Premium quality lamb ribs.",
    productImages: ["uploads/products/Qo'y-premium.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Lamb Leg",
    productPrice: 25900,
    productLeftCount: 18,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh lamb leg meat.",
    productImages: ["uploads/products/Qo'y-son.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Smoked Sausage",
    productPrice: 12900,
    productLeftCount: 25,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Smoked sausage with rich flavor.",
    productImages: ["uploads/products/kalbasa-dudlangan.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Hunter Sausage",
    productPrice: 10900,
    productLeftCount: 25,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Classic hunter style sausage.",
    productImages: ["uploads/products/oxotichniy-kolbasa.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Whole Chicken",
    productPrice: 11900,
    productLeftCount: 30,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh whole chicken.",
    productImages: ["uploads/products/Tovuq.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Chicken Breast",
    productPrice: 9900,
    productLeftCount: 30,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh boneless chicken breast.",
    productImages: ["uploads/products/tovuq-kukrak.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Chicken Legs",
    productPrice: 7900,
    productLeftCount: 30,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh chicken legs.",
    productImages: ["uploads/products/tovuq-oyog'i.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.MEAT,
    productName: "Chicken Wings",
    productPrice: 8900,
    productLeftCount: 30,
    productUnit: ProductUnit.KG,
    productVolume: 1,
    productDesc: "Fresh chicken wings.",
    productImages: ["uploads/products/tovuq-qanotlari.png"],
    productViews: 0,
  },


  // ====================================================
  // 3. DAIRY
  // ====================================================

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.DAIRY,
    productName: "Fresh Milk",
    productPrice: 3200,
    productLeftCount: 40,
    productUnit: ProductUnit.LITER,
    productVolume: 1,
    productDesc: "Fresh dairy milk.",
    productImages: ["uploads/products/Sut.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.DAIRY,
    productName: "Greek Yogurt",
    productPrice: 4900,
    productLeftCount: 30,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Creamy Greek yogurt.",
    productImages: ["uploads/products/Greek-yogurt.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.DAIRY,
    productName: "Strawberry Yogurt",
    productPrice: 3900,
    productLeftCount: 30,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Creamy strawberry yogurt.",
    productImages: ["uploads/products/yogurt-qulupnay.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.DAIRY,
    productName: "Cream",
    productPrice: 4500,
    productLeftCount: 25,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Fresh dairy cream.",
    productImages: ["uploads/products/Qaymoq.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.DAIRY,
    productName: "Mozzarella Cheese",
    productPrice: 6900,
    productLeftCount: 25,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Soft mozzarella cheese.",
    productImages: ["uploads/products/Mozarella.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.DAIRY,
    productName: "Anhor Cheese",
    productPrice: 5900,
    productLeftCount: 25,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Rich and creamy cheese.",
    productImages: ["uploads/products/Anhor-pishloq.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.DAIRY,
    productName: "Lyubimiy Cheese",
    productPrice: 6200,
    productLeftCount: 25,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Delicious everyday cheese.",
    productImages: ["uploads/products/lyubimiy-pishloq.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.DAIRY,
    productName: "Mayonnaise",
    productPrice: 4500,
    productLeftCount: 30,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Creamy mayonnaise.",
    productImages: ["uploads/products/mayonez.png"],
    productViews: 0,
  },


  // ====================================================
  // 4. BAKERY
  // ====================================================

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BAKERY,
    productName: "White Bread",
    productPrice: 3500,
    productLeftCount: 30,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Fresh soft white bread.",
    productImages: ["uploads/products/oq-non.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BAKERY,
    productName: "Whole Wheat Bread",
    productPrice: 4500,
    productLeftCount: 25,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Fresh whole wheat bread.",
    productImages: ["uploads/products/qora-non.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BAKERY,
    productName: "Butter Croissant",
    productPrice: 2900,
    productLeftCount: 35,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Fresh buttery croissant.",
    productImages: ["uploads/products/kurasan.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BAKERY,
    productName: "Baguette",
    productPrice: 3000,
    productLeftCount: 25,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Fresh crispy baguette.",
    productImages: ["uploads/products/bagute.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BAKERY,
    productName: "Chocolate Muffin",
    productPrice: 3500,
    productLeftCount: 25,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Soft chocolate muffin.",
    productImages: ["uploads/products/choko.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BAKERY,
    productName: "Donut",
    productPrice: 2500,
    productLeftCount: 30,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Fresh sweet donut.",
    productImages: ["uploads/products/Donuc.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BAKERY,
    productName: "Chocolate Cake",
    productPrice: 18900,
    productLeftCount: 15,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Rich chocolate cake.",
    productImages: ["uploads/products/choko-ceci.png"],
    productViews: 0,
  },


  // ====================================================
  // 5. BEVERAGE
  // ====================================================

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BEVERAGE,
    productName: "Apple Juice",
    productPrice: 4500,
    productLeftCount: 35,
    productUnit: ProductUnit.LITER,
    productVolume: 1,
    productDesc: "Refreshing apple juice.",
    productImages: ["uploads/products/olma-sharbati.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BEVERAGE,
    productName: "Orange Juice",
    productPrice: 4500,
    productLeftCount: 35,
    productUnit: ProductUnit.LITER,
    productVolume: 1,
    productDesc: "Refreshing orange juice.",
    productImages: ["uploads/products/apelsin-sharbati.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BEVERAGE,
    productName: "Grape Juice",
    productPrice: 4900,
    productLeftCount: 30,
    productUnit: ProductUnit.LITER,
    productVolume: 1,
    productDesc: "Sweet black grape juice.",
    productImages: ["uploads/products/uzum sharbati.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BEVERAGE,
    productName: "Cola",
    productPrice: 2000,
    productLeftCount: 50,
    productUnit: ProductUnit.LITER,
    productVolume: 0.5,
    productDesc: "Refreshing carbonated cola drink.",
    productImages: ["uploads/products/Kola.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BEVERAGE,
    productName: "Mojito",
    productPrice: 2500,
    productLeftCount: 40,
    productUnit: ProductUnit.LITER,
    productVolume: 0.5,
    productDesc: "Refreshing mojito flavored drink.",
    productImages: ["uploads/products/Moxito.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.BEVERAGE,
    productName: "Energy Drink",
    productPrice: 2900,
    productLeftCount: 40,
    productUnit: ProductUnit.LITER,
    productVolume: 0.5,
    productDesc: "Refreshing energy drink.",
    productImages: ["uploads/products/redbull.png"],
    productViews: 0,
  },


  // ====================================================
  // 6. SNACK
  // ====================================================

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.SNACK,
    productName: "Potato Chips",
    productPrice: 2500,
    productLeftCount: 45,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Crispy potato chips.",
    productImages: ["uploads/products/Lays.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.SNACK,
    productName: "Tortilla Chips",
    productPrice: 3500,
    productLeftCount: 35,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Crunchy tortilla chips.",
    productImages: ["uploads/products/cheps.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.SNACK,
    productName: "Milk Chocolate",
    productPrice: 2900,
    productLeftCount: 40,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Sweet milk chocolate.",
    productImages: ["uploads/products/chocolat.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.SNACK,
    productName: "Roasted Pistachios",
    productPrice: 6900,
    productLeftCount: 25,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Crunchy roasted pistachios.",
    productImages: ["uploads/products/pista.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.SNACK,
    productName: "Salted Peanuts",
    productPrice: 3500,
    productLeftCount: 35,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Crunchy salted peanuts.",
    productImages: ["uploads/products/yeryongoq.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.SNACK,
    productName: "Butter Cookies",
    productPrice: 3900,
    productLeftCount: 30,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Classic butter cookies.",
    productImages: ["uploads/products/pechini.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.SNACK,
    productName: "Popcorn",
    productPrice: 2900,
    productLeftCount: 40,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Classic popcorn snack.",
    productImages: ["uploads/products/popcorn.png"],
    productViews: 0,
  },

  {
    productStatus: ProductStatus.PROCESS,
    productCollection: ProductCollection.SNACK,
    productName: "Crackers",
    productPrice: 3200,
    productLeftCount: 35,
    productUnit: ProductUnit.PIECE,
    productVolume: 1,
    productDesc: "Crispy crackers.",
    productImages: ["uploads/products/Ritz-pichini.png"],
    productViews: 0,
  },
];


// ======================================================
// SEED FUNCTION
// ======================================================

async function seedProducts() {
  try {
    // MongoDB bilan bog'lanamiz
    await mongoose.connect(process.env.MONGO_URL as string);

    console.log("MongoDB connected");


    // Productlarni bir martada MongoDB'ga yozamiz
    await ProductModel.insertMany(products);

    console.log(
      `${products.length} products inserted successfully`
    );


    // Ish tugagach connectionni yopamiz
    await mongoose.disconnect();

    console.log("MongoDB disconnected");

  } catch (err) {
    console.error("Product seed failed:", err);

    await mongoose.disconnect();

    process.exit(1);
  }
}


// Seedni ishga tushiramiz
seedProducts();