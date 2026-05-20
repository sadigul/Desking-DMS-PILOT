// ═══════════════════════════════════════════════════════════════════════════════
// DMSPilot — Demo Data (Modeled after a high-volume multi-franchise dealer in DFW, TX)
// Dealership: AutoNation Ford / Chevrolet / Toyota — North Richland Hills
// ═══════════════════════════════════════════════════════════════════════════════

export const MOCK_DEALS = [
  { id: "DL-24-0847", customer: "Robert Hernandez", vehicle: "2025 Ford F-150 XLT SuperCrew", amount: 54890, status: "Pending", lender: "Ford Motor Credit", daysOpen: 1, fiManager: "Marcus Williams" },
  { id: "DL-24-0848", customer: "Jennifer Walsh", vehicle: "2024 Toyota RAV4 XLE Premium", amount: 37450, status: "Pending", lender: "Toyota Motor Credit", daysOpen: 0, fiManager: "Amanda Chen" },
  { id: "DL-24-0849", customer: "David & Maria Gonzalez", vehicle: "2025 Chevrolet Tahoe LT", amount: 62750, status: "Submitted", lender: "GM Financial", daysOpen: 1, fiManager: "Marcus Williams" },
  { id: "DL-24-0850", customer: "Anthony Richards", vehicle: "2024 Ford Bronco Sport Big Bend", amount: 34200, status: "Submitted", lender: "Ally Financial", daysOpen: 2, fiManager: "Amanda Chen" },
  { id: "DL-24-0851", customer: "Tiffany Nguyen", vehicle: "2025 Toyota Camry SE", amount: 30850, status: "Approved", lender: "Capital One Auto", daysOpen: 1, fiManager: "Marcus Williams" },
  { id: "DL-24-0852", customer: "James Patterson", vehicle: "2024 Ford Explorer ST", amount: 58400, status: "Approved", lender: "Chase Auto Finance", daysOpen: 0, fiManager: "Amanda Chen" },
  { id: "DL-24-0853", customer: "Brenda & Carlos Martinez", vehicle: "2025 Chevrolet Equinox RS", amount: 35900, status: "Approved", lender: "Wells Fargo Dealer Services", daysOpen: 3, fiManager: "Marcus Williams" },
  { id: "DL-24-0854", customer: "Kevin O'Brien", vehicle: "2023 Ford Mustang GT Premium", amount: 46800, status: "Funded", lender: "Ford Motor Credit", daysOpen: 6, fiManager: "Amanda Chen" },
  { id: "DL-24-0855", customer: "Samantha Brooks", vehicle: "2024 Toyota Highlander Limited", amount: 51200, status: "Funded", lender: "USAA", daysOpen: 5, fiManager: "Marcus Williams" },
  { id: "DL-24-0856", customer: "Marcus & Jasmine Taylor", vehicle: "2025 Chevrolet Silverado 1500 RST", amount: 57300, status: "Funded", lender: "Ally Financial", daysOpen: 7, fiManager: "Amanda Chen" },
  { id: "DL-24-0857", customer: "Daniel Kim", vehicle: "2024 Ford Maverick Lariat", amount: 33900, status: "Funded", lender: "Capital One Auto", daysOpen: 4, fiManager: "Marcus Williams" },
  { id: "DL-24-0858", customer: "Patricia Owens", vehicle: "2022 Toyota 4Runner TRD Off-Road", amount: 41500, status: "Declined", lender: "Westlake Financial", daysOpen: 3, fiManager: "Amanda Chen" },
  { id: "DL-24-0859", customer: "Raymond Butler", vehicle: "2024 Chevrolet Camaro LT1", amount: 38700, status: "Declined", lender: "Credit Acceptance", daysOpen: 2, fiManager: "Marcus Williams" },
  { id: "DL-24-0860", customer: "Lisa Tran", vehicle: "2025 Toyota Corolla Cross Hybrid", amount: 32400, status: "Submitted", lender: "Toyota Motor Credit", daysOpen: 1, fiManager: "Amanda Chen" },
  { id: "DL-24-0861", customer: "William & Sarah Foster", vehicle: "2025 Ford Expedition Max Limited", amount: 78900, status: "Pending", lender: "Chase Auto Finance", daysOpen: 0, fiManager: "Marcus Williams" },
];

export const MOCK_LENDERS = [
  { id: "L-1", name: "Ford Motor Credit", approvalRate: 82, avgFundingTime: "24h", tier: "A+ / A / B" },
  { id: "L-2", name: "Toyota Motor Credit", approvalRate: 88, avgFundingTime: "18h", tier: "A+ / A / B" },
  { id: "L-3", name: "GM Financial", approvalRate: 80, avgFundingTime: "24h", tier: "A+ / A / B / C" },
  { id: "L-4", name: "Ally Financial", approvalRate: 84, avgFundingTime: "12h", tier: "A+ / A / B" },
  { id: "L-5", name: "Capital One Auto", approvalRate: 91, avgFundingTime: "8h", tier: "A / B / C" },
  { id: "L-6", name: "Chase Auto Finance", approvalRate: 76, avgFundingTime: "36h", tier: "A+ / A" },
  { id: "L-7", name: "Wells Fargo Dealer Services", approvalRate: 79, avgFundingTime: "24h", tier: "A+ / A / B" },
  { id: "L-8", name: "Westlake Financial", approvalRate: 96, avgFundingTime: "72h", tier: "C / D / Deep Sub" },
  { id: "L-9", name: "Credit Acceptance", approvalRate: 98, avgFundingTime: "96h", tier: "D / Deep Sub" },
  { id: "L-10", name: "USAA", approvalRate: 89, avgFundingTime: "6h", tier: "A+ / A" },
  { id: "L-11", name: "Navy Federal Credit Union", approvalRate: 87, avgFundingTime: "12h", tier: "A+ / A / B" },
  { id: "L-12", name: "Bank of America", approvalRate: 74, avgFundingTime: "48h", tier: "A+ / A" },
];

export const MOCK_CUSTOMERS = [
  { id: "C-1", name: "Robert Hernandez", phone: "(817) 445-2190", email: "rhernandez84@gmail.com", score: 712 },
  { id: "C-2", name: "Jennifer Walsh", phone: "(469) 832-4517", email: "jwalsh.realty@outlook.com", score: 748 },
  { id: "C-3", name: "David Gonzalez", phone: "(682) 910-3844", email: "dgonzalez_dfw@yahoo.com", score: 685 },
  { id: "C-4", name: "Anthony Richards", phone: "(214) 557-6283", email: "a.richards@techforward.io", score: 621 },
  { id: "C-5", name: "Tiffany Nguyen", phone: "(972) 341-8890", email: "tiffany.nguyen@gmail.com", score: 779 },
  { id: "C-6", name: "James Patterson", phone: "(817) 228-5041", email: "jpatterson_law@outlook.com", score: 802 },
  { id: "C-7", name: "Carlos Martinez", phone: "(469) 712-9934", email: "carlos.m.martinez@hotmail.com", score: 658 },
  { id: "C-8", name: "Kevin O'Brien", phone: "(214) 890-1127", email: "kobrien.sales@gmail.com", score: 734 },
  { id: "C-9", name: "Samantha Brooks", phone: "(682) 445-6712", email: "sambrooks22@icloud.com", score: 761 },
  { id: "C-10", name: "Marcus Taylor", phone: "(972) 668-3390", email: "marcus.t@taylorplumbing.com", score: 695 },
  { id: "C-11", name: "Daniel Kim", phone: "(817) 992-4401", email: "dkim.eng@protonmail.com", score: 788 },
  { id: "C-12", name: "Patricia Owens", phone: "(469) 114-7829", email: "pat.owens@sbcglobal.net", score: 542 },
  { id: "C-13", name: "Raymond Butler", phone: "(214) 337-5568", email: "raybutler77@gmail.com", score: 498 },
  { id: "C-14", name: "Lisa Tran", phone: "(682) 223-8845", email: "lisatran.dds@gmail.com", score: 815 },
  { id: "C-15", name: "William Foster", phone: "(972) 880-2214", email: "wfoster@fosterranch.com", score: 752 },
];
