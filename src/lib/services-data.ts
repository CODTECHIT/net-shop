import {
  IdCard,
  FileText,
  Home as HomeIcon,
  Building2,
  Zap,
  Car,
  Landmark,
  type LucideIcon,
} from "lucide-react";

export type Service = { name: string; description: string };
export type ServiceCategory = {
  key: string;
  title: string;
  emoji: string;
  icon: LucideIcon;
  blurb: string;
  services: Service[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    key: "identity",
    title: "Identity & Government Cards",
    emoji: "📋",
    icon: IdCard,
    blurb: "Aadhar, PAN, Voter ID, DL, Passport & more.",
    services: [
      {
        name: "Ration Card",
        description: "Apply for or update your ration card for food subsidy benefits.",
      },
      {
        name: "Aadhar Card",
        description: "New enrollment, corrections, and address updates for Aadhar.",
      },
      {
        name: "PAN Card",
        description: "Apply for new PAN or make corrections to existing PAN card.",
      },
      { name: "Voter ID Card", description: "New voter ID registration and modifications." },
      { name: "Driving Licence", description: "Apply for learner's or permanent driving licence." },
      { name: "Health Card", description: "Government health scheme card registration." },
      {
        name: "Passport of India",
        description: "Fresh passport application and renewal assistance.",
      },
      {
        name: "Senior Citizen Card",
        description: "Registration and documentation for senior citizens.",
      },
      {
        name: "UDID Card",
        description: "Unique Disability ID card for differently-abled citizens.",
      },
    ],
  },
  {
    key: "certificates",
    title: "Certificates",
    emoji: "📜",
    icon: FileText,
    blurb: "Birth, death, marriage, income & possession certs.",
    services: [
      {
        name: "Birth & Death Certificate",
        description: "Official birth and death certificate issuance and corrections.",
      },
      {
        name: "Family Member Certificate",
        description: "Certificate for family composition and relationships.",
      },
      {
        name: "Marriage Certificate",
        description: "Legal marriage certificate application and registration.",
      },
      {
        name: "Certificate of Possession",
        description: "Land or property possession certificate issuance.",
      },
      {
        name: "No Earning Certificate",
        description: "Income/no earning certificate for government schemes.",
      },
      { name: "Saderam Certificate", description: "Saderam-related official documentation." },
    ],
  },
  {
    key: "property",
    title: "Property & Land Services",
    emoji: "🏘️",
    icon: HomeIcon,
    blurb: "Adangal, mutations, conversions & passbook work.",
    services: [
      { name: "Adangal / ROR-1B", description: "Official land record extract for AP properties." },
      {
        name: "Possession Certificate",
        description: "Legal certificate proving land/property possession.",
      },
      { name: "Manual Adangal", description: "Manual land record requests and submissions." },
      {
        name: "Mutations of Passbook",
        description: "Land mutation for ownership transfer in passbooks.",
      },
      {
        name: "Pattadar Adhar Seeding",
        description: "Link Aadhaar with Pattadar passbook for farmers.",
      },
      { name: "Land Conversion", description: "Agricultural to non-agricultural land conversion." },
      {
        name: "Revenue Sub Division",
        description: "Revenue department sub-division related services.",
      },
    ],
  },
  {
    key: "municipal",
    title: "Municipal Services",
    emoji: "🏙️",
    icon: Building2,
    blurb: "Property tax, water tax, assessments & transfers.",
    services: [
      { name: "Property Tax", description: "Payment and assessment of property tax." },
      { name: "New Assessment", description: "New property assessment and registration." },
      { name: "Revision Petition", description: "File revision petitions for property disputes." },
      { name: "Title Transfer", description: "Transfer of property title to new owner." },
      { name: "Water Tax", description: "Municipal water connection tax payment." },
    ],
  },
  {
    key: "apspdcl",
    title: "APSPDCL (Electricity)",
    emoji: "⚡",
    icon: Zap,
    blurb: "Bill pay, new connections, seeding & transfers.",
    services: [
      {
        name: "Payments of Property, Tax and Water Tax",
        description: "Official government payments facilitated online.",
      },
      { name: "New Customer Application", description: "New electricity connection application." },
      { name: "Title Transfer", description: "Transfer electricity connection to new owner." },
      { name: "Aadhar Deseeding", description: "Remove Aadhaar linkage from electricity account." },
      { name: "Aadhar Seeding", description: "Link Aadhaar to electricity account." },
      { name: "Current Bill Pay", description: "Instant APSPDCL electricity bill payment." },
    ],
  },
  {
    key: "transport",
    title: "Transport Department",
    emoji: "🚗",
    icon: Car,
    blurb: "LLR slots, DL applications & corrections.",
    services: [
      {
        name: "Slot Booking LLR",
        description: "Online slot booking for Learner's Licence Road test.",
      },
      { name: "Driving Licence", description: "Transport department DL application and tracking." },
      {
        name: "Corrections and Address Change",
        description: "DL corrections and address update services.",
      },
    ],
  },
  {
    key: "register",
    title: "Register Office",
    emoji: "🏛️",
    icon: Landmark,
    blurb: "Document registration, EC, notary & insurance.",
    services: [
      {
        name: "Documents Registration",
        description: "Property and agreement document registration.",
      },
      {
        name: "Market Value Certificate",
        description: "Official property market value certificate.",
      },
      { name: "Encumbrance Certificate", description: "EC for property transaction history." },
      { name: "Certified Copies", description: "Certified document copies from register office." },
      { name: "Society Registration", description: "Cooperative or housing society registration." },
      {
        name: "Firms Registration",
        description: "Partnership firm or proprietorship registration.",
      },
      { name: "Hindu Marriage Certificate", description: "Certificate as per Hindu Marriage Act." },
      {
        name: "Special Marriage Registration",
        description: "Certificate under Special Marriage Act.",
      },
      { name: "E-Chits Registration", description: "Online chit fund registration." },
      { name: "Notary / Affidavits", description: "Notary attestation and affidavit preparation." },
      { name: "Reg Payments", description: "Registration payment processing." },
      { name: "Slot Booking", description: "Document registration slot booking." },
      { name: "PM Kissan", description: "PM Kisan enrollment and status verification." },
      { name: "Labour Insurance", description: "Labour department insurance schemes." },
      {
        name: "All Types of Insurance",
        description: "General and government insurance facilitation.",
      },
    ],
  },
];

export const WHATSAPP_NUMBER = "919100080233";
export const waLink = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const TOTAL_SERVICES = SERVICE_CATEGORIES.reduce((sum, c) => sum + c.services.length, 0);
