export interface Piano {
  name: string;
  model: string;
  category: string;
  price: string;
  originalPrice: string;
  savings: string;
  monthlyPayment: string;
  remaining: number;
  features: string[];
  badge: string;
  image: string;
}

export const pianos: Piano[] = [
  {
    name: "Kawai ES120 Digital Piano",
    model: "ES120",
    category: "Digital",
    price: "$949",
    originalPrice: "$1,099",
    savings: "$150",
    monthlyPayment: "$79",
    remaining: 12,
    features: ["88 Weighted Keys", "Premium Sound Engine", "Bluetooth Ready", "SHSU Approved"],
    badge: "STUDENT FAVORITE",
    image: "/images/pianos/es120.jpeg"
  },
  {
    name: "Kawai ES520 Digital Piano",
    model: "ES520",
    category: "Digital Premium",
    price: "$999",
    originalPrice: "$1,399",
    savings: "$400",
    monthlyPayment: "$83",
    remaining: 8,
    features: ["88 Keys", "Bluetooth Ready", "App Compatible", "Faculty Choice"],
    badge: "BEST VALUE",
    image: "/images/pianos/ES520W_above.png"
  },
  {
    name: "K200 Upright Acoustic Piano",
    model: "K200",
    category: "Upright",
    price: "$6,390",
    originalPrice: "$8,395",
    savings: "$2,005",
    monthlyPayment: "$532",
    remaining: 4,
    features: ["Perfect Home Size", "Rich Acoustic Tone", "SHSU Standard", "Free Setup"],
    badge: "FAMILY FAVORITE",
    image: "/images/pianos/K-200_EP_styling.jpg"
  },
  {
    name: "GL10 Grand Piano",
    model: "GL10",
    category: "Grand",
    price: "$12,950",
    originalPrice: "$18,995",
    savings: "$6,045",
    monthlyPayment: "$1,079",
    remaining: 2,
    features: ["Performance Grade", "Concert Quality", "Faculty Approved", "White Glove Delivery"],
    badge: "PREMIUM SELECTION",
    image: "/images/pianos/GL10.jpg"
  }
];