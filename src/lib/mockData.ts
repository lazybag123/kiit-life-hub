export type ClassItem = {
  id: string;
  subject: string;
  faculty: string;
  room: string;
  building: string;
  start: string; // HH:MM
  end: string;
  type: "Lecture" | "Lab" | "Tutorial";
  status?: "scheduled" | "cancelled" | "rescheduled";
};

export const todaySchedule: ClassItem[] = [
  { id: "c1", subject: "Design & Analysis of Algorithms", faculty: "Prof. S. Mohanty", room: "C-302", building: "SCS Block, Campus 15", start: "09:00", end: "10:00", type: "Lecture" },
  { id: "c2", subject: "Computer Networks", faculty: "Dr. R. Pradhan", room: "C-204", building: "Campus 15", start: "10:15", end: "11:15", type: "Lecture" },
  { id: "c3", subject: "DBMS Lab", faculty: "Prof. A. Sahoo", room: "Lab-3", building: "Campus 17", start: "11:30", end: "13:30", type: "Lab" },
  { id: "c4", subject: "Software Engineering", faculty: "Dr. P. Mishra", room: "C-118", building: "Campus 15", start: "14:30", end: "15:30", type: "Lecture", status: "cancelled" },
  { id: "c5", subject: "Operating Systems", faculty: "Dr. K. Behera", room: "C-401", building: "Campus 15", start: "16:00", end: "17:00", type: "Lecture" },
];

export type MessMeal = {
  slot: "Breakfast" | "Lunch" | "Snacks" | "Dinner";
  time: string;
  items: { name: string; type: "veg" | "non-veg"; tag?: string }[];
  rating: number; // 0-5
  votes: number;
};

export const messMenu: MessMeal[] = [
  {
    slot: "Breakfast", time: "07:30 – 09:30", rating: 3.6, votes: 142,
    items: [
      { name: "Aloo Paratha", type: "veg" },
      { name: "Boiled Eggs", type: "non-veg" },
      { name: "Bread, Butter & Jam", type: "veg" },
      { name: "Tea / Coffee", type: "veg" },
    ],
  },
  {
    slot: "Lunch", time: "12:30 – 14:30", rating: 4.1, votes: 268,
    items: [
      { name: "Dal Tadka", type: "veg" },
      { name: "Mix Veg", type: "veg" },
      { name: "Chicken Curry", type: "non-veg", tag: "Special" },
      { name: "Steamed Rice & Roti", type: "veg" },
    ],
  },
  {
    slot: "Snacks", time: "17:00 – 18:00", rating: 3.9, votes: 88,
    items: [
      { name: "Samosa", type: "veg" },
      { name: "Masala Chai", type: "veg" },
    ],
  },
  {
    slot: "Dinner", time: "19:30 – 21:30", rating: 4.4, votes: 312,
    items: [
      { name: "Paneer Butter Masala", type: "veg", tag: "Special" },
      { name: "Chicken Handi", type: "non-veg", tag: "Special" },
      { name: "Jeera Rice", type: "veg" },
      { name: "Gulab Jamun", type: "veg", tag: "Dessert" },
    ],
  },
];

export type Cafeteria = {
  id: string;
  name: string;
  campus: string;
  open: boolean;
  crowd: "Low" | "Medium" | "High";
  waitMins: number;
  distance: string;
  rating: number;
  popular: string[];
  priceRange: string;
  category: "Cafeteria" | "Khao Galli" | "Cafe" | "Night Canteen";
};

export const cafeterias: Cafeteria[] = [
  { id: "f1", name: "Kings Food Court", campus: "Campus 15", open: true, crowd: "Low", waitMins: 5, distance: "120 m", rating: 4.3, popular: ["Cold Coffee", "Veg Roll", "Maggi"], priceRange: "₹40 – ₹120", category: "Cafeteria" },
  { id: "f2", name: "Sky Cafe", campus: "Campus 17", open: true, crowd: "Medium", waitMins: 12, distance: "650 m", rating: 4.1, popular: ["Pizza", "Pasta"], priceRange: "₹80 – ₹220", category: "Cafe" },
  { id: "f3", name: "Khao Galli — Anna's Dosa", campus: "Khao Galli", open: true, crowd: "High", waitMins: 18, distance: "1.2 km", rating: 4.6, popular: ["Masala Dosa", "Idli Vada"], priceRange: "₹50 – ₹110", category: "Khao Galli" },
  { id: "f4", name: "Night Hunger Hub", campus: "KP-7", open: true, crowd: "Low", waitMins: 4, distance: "80 m", rating: 4.0, popular: ["Maggi", "Omelette", "Tea"], priceRange: "₹20 – ₹70", category: "Night Canteen" },
  { id: "f5", name: "Cafe Coffee Day", campus: "Campus 6", open: false, crowd: "Low", waitMins: 0, distance: "900 m", rating: 3.9, popular: ["Frappe", "Sandwich"], priceRange: "₹150 – ₹350", category: "Cafe" },
];

export type FeedPost = {
  id: string;
  author: string;
  channel: "Anonymous" | "Lost & Found" | "Marketplace" | "Mess Reviews" | "Events";
  time: string;
  body: string;
  likes: number;
  comments: number;
};

export const feedPosts: FeedPost[] = [
  { id: "p1", author: "GhostUser", channel: "Anonymous", time: "12m", body: "Library AC is cranked again. Bring a hoodie if you're staying past 8.", likes: 42, comments: 7 },
  { id: "p2", author: "Aditi (CSE-12)", channel: "Lost & Found", time: "1h", body: "Found a black DSLR cap near C-Block lift. DM if it's yours.", likes: 12, comments: 2 },
  { id: "p3", author: "Rahul (KP-7)", channel: "Marketplace", time: "3h", body: "Selling DSA Cormen + Galvin OS — barely used. ₹450 for both.", likes: 28, comments: 11 },
  { id: "p4", author: "Mess Watch", channel: "Mess Reviews", time: "5h", body: "Tonight's paneer was actually decent for once. 4/5.", likes: 76, comments: 19 },
];

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  kind: "class" | "mess" | "exam" | "alert";
};

export const notifications: Notification[] = [
  { id: "n1", title: "Class in 23 min", body: "Algorithm Design • Room C-302, SCS Block", time: "now", kind: "class" },
  { id: "n2", title: "Software Engineering cancelled", body: "Dr. Mishra has cancelled the 2:30 PM lecture.", time: "10m", kind: "alert" },
  { id: "n3", title: "Dinner serving in 30 min", body: "Paneer Butter Masala + Chicken Handi tonight.", time: "1h", kind: "mess" },
  { id: "n4", title: "End-Sem in 12 days", body: "OS, DBMS, CN, DAA, SE — schedule released.", time: "2d", kind: "exam" },
];

export const userProfile = {
  name: "Aryan Mishra",
  rollNo: "22052478",
  hostel: "KP-7",
  branch: "CSE",
  semester: 5,
  cgpa: 8.92,
  attendance: 78,
  email: "22052478@kiit.ac.in",
};

export const upcomingExams = [
  { name: "Operating Systems", date: "Nov 04", room: "C-302", days: 12 },
  { name: "DBMS", date: "Nov 06", room: "C-204", days: 14 },
  { name: "Computer Networks", date: "Nov 09", room: "C-118", days: 17 },
];

export const friends = [
  { name: "Riya", branch: "CSE-12", nextClass: "DAA • 09:00", free: false },
  { name: "Karan", branch: "CSE-30", nextClass: "Free until 11:30", free: true },
  { name: "Meera", branch: "IT-04", nextClass: "ML Lab • 10:15", free: false },
];
