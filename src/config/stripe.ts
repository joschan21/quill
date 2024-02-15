export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    pagesPerPdf: 5,
    price: {
      amount: 0,
      // currency: "brl",
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Premium",
    slug: "premium",
    quota: 50,
    pagesPerPdf: 25,
    price: {
      amount: 1,
      // currency: "brl",
      priceIds: {
        test: "price_1OjvsHAUqlgdOC29wYIVfWzL",
        production: "",
      },
    },
  },
];
