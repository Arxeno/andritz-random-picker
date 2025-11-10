/**
 * Dummy data for development and testing
 * Used in /dummy-spin page for development without affecting real database
 */

export interface DummyPrize {
  id: string;
  name: string;
  imageUrl?: string;
  status: "available" | "won";
}

export interface DummyParticipant {
  id: string;
  fullName: string;
  department: string;
}

// Dummy Prizes (minimum 3)
export const DUMMY_PRIZES: DummyPrize[] = [
  {
    id: "prize-1",
    name: "Bugatti Chiron",
    imageUrl: "/bugatti.png",
    status: "available",
  },
  {
    id: "prize-2",
    name: "Jam Tangan Rolex 24 Karat",
    imageUrl: "/rolex.png",
    status: "available",
  },
  {
    id: "prize-3",
    name: "5 Kavling di Menteng",
    imageUrl: "rumah.jpg",
    status: "available",
  },
  {
    id: "prize-4",
    name: "19 Juta Lapangan Kerja",
    imageUrl: "lapangan-kerja.jpg",
    status: "available",
  },
];

// Dummy Participants (minimum 20)
export const DUMMY_PARTICIPANTS: DummyParticipant[] = [
  { id: "p-1", fullName: "John Anderson", department: "Engineering (PKW)" },
  { id: "p-2", fullName: "Sarah Williams", department: "HR" },
  { id: "p-3", fullName: "Michael Chen", department: "IT" },
  { id: "p-4", fullName: "Emily Rodriguez", department: "Sales (PKW)" },
  { id: "p-5", fullName: "David Thompson", department: "Accounting" },
  { id: "p-6", fullName: "Jessica Martinez", department: "Engineering (PKF)" },
  { id: "p-7", fullName: "Robert Johnson", department: "Field Service (PKW)" },
  { id: "p-8", fullName: "Amanda Davis", department: "Management" },
  { id: "p-9", fullName: "Christopher Lee", department: "Sales (PKF)" },
  { id: "p-10", fullName: "Michelle Brown", department: "Field Service (PKF)" },
  {
    id: "p-11",
    fullName: "Daniel Garcia",
    department: "Field Service Turn Knife (PKW)",
  },
  { id: "p-12", fullName: "Jennifer Wilson", department: "Engineering (PKW)" },
  { id: "p-13", fullName: "Matthew Taylor", department: "IT" },
  { id: "p-14", fullName: "Ashley Moore", department: "HR" },
  { id: "p-15", fullName: "Joshua Jackson", department: "Sales (PKW)" },
  { id: "p-16", fullName: "Stephanie White", department: "Accounting" },
  { id: "p-17", fullName: "Andrew Harris", department: "Field Service (PKW)" },
  { id: "p-18", fullName: "Nicole Martin", department: "Engineering (PKF)" },
  { id: "p-19", fullName: "Ryan Thompson", department: "Management" },
  { id: "p-20", fullName: "Lauren Garcia", department: "Sales (PKF)" },
  { id: "p-21", fullName: "Kevin Martinez", department: "Field Service (PKF)" },
  { id: "p-22", fullName: "Samantha Robinson", department: "IT" },
  { id: "p-23", fullName: "Brandon Clark", department: "Engineering (PKW)" },
  { id: "p-24", fullName: "Rachel Lewis", department: "HR" },
  { id: "p-25", fullName: "Justin Walker", department: "Sales (PKW)" },
  { id: "p-26", fullName: "Megan Hall", department: "Accounting" },
  { id: "p-27", fullName: "Tyler Allen", department: "Field Service (PKW)" },
  { id: "p-28", fullName: "Brittany Young", department: "Engineering (PKF)" },
  { id: "p-29", fullName: "Eric King", department: "Management" },
  { id: "p-30", fullName: "Kayla Wright", department: "Sales (PKF)" },
];
