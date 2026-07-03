// src/data/mockProfile.js
export const profile = {
  name: "Catherine Ojong",
  initials: "CO",
  id: "1234567",
  email: "catherineojong002@gmail.com",
  emailDisplay: "Catherineojong002@gmail.com",
  phone: "+292 6272 6272 813",
  countryCode: "+292",
  phoneNumber: "6272 6272 813",
  nationality: "Nigeria",
  country: "UAE",
  city: "California",
  rating: 3.5,
  totalReviews: 650,
  vehicle: {
    brand: "Lexus",
    model: "RX 350 (2020)",
    plateNumber: "9FQG766",
  },
};

export const reviewStats = {
  totalReviews: 300,
  averageRating: 3.5,
  breakdown: [
    { stars: 5, color: "#22C55E", percentage: 25 },
    { stars: 4, color: "#3B82F6", percentage: 55 },
    { stars: 3, color: "#FBBF24", percentage: 26 },
    { stars: 2, color: "#8B5CF6", percentage: 4 },
    { stars: 1, color: "#EF4444", percentage: 0 },
  ],
};

export const reviews = Array(5).fill({
  reviewer: "Daniel Okafor",
  initials: "CO",
  rating: 3.5,
  date: "13-01-26",
  text: "The tailor was super professional, delivered my custom suit on time, and the fit was perfect. Highly recommended!.",
});
