import { create } from 'zustand';

export type Deal = {
  id: string;
  customer: string;
  vehicle: string;
  amount: number;
  status: 'Draft' | 'Pending' | 'Approved' | 'Funded' | 'Stuck';
  lender: string;
  daysOpen: number;
  fiManager: string;
  frontGross?: number;
  backGross?: number;
  creditTier?: 'Elite' | 'Prime' | 'Sub-Prime' | 'Deep-Sub';
  lenderStips?: string[];
  docStatus: 'Incomplete' | 'Ready' | 'Signed';
  // Advanced Desking Fields
  type: 'Finance' | 'Lease' | 'Cash';
  term?: number;
  apr?: number;
  downPayment?: number;
  tradeInValue?: number;
  tradeInPayoff?: number;
  rebates?: number;
  residualValue?: number;
  moneyFactor?: number;
  mileageLimit?: number;
  // F&I Products
  products: {
    id: string;
    name: string;
    price: number;
    cost: number;
    type: 'Warranty' | 'GAP' | 'Protection' | 'Maintenance';
    active: boolean;
  }[];
  // eContracting
  eContractingStatus: 'Not Started' | 'Sent' | 'Signed' | 'Funded';
  digitalDealJackets: {
    id: string;
    name: string;
    status: 'Pending' | 'Completed';
    type: 'Sales' | 'Lender' | 'Compliance';
  }[];
};

export type Vehicle = {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  msrp: number;
  invoice: number;
  pack: number;
  color: string;
  stockType: 'New' | 'Used';
  status: 'In Stock' | 'In Transit' | 'Sold';
  carfaxStatus: 'Clean' | 'Minor' | 'Alert';
  daysInStock: number;
  dealerFees?: number;
  mileage?: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  creditScore: number;
  lastVisit: string;
  status: 'Active' | 'Lead' | 'Past Customer';
};

// ═══════════════════════════════════════════════════════════════════════════════
// REAL INVENTORY — Modeled from a multi-franchise dealer (Ford/Chevy/Toyota) in DFW TX
// ═══════════════════════════════════════════════════════════════════════════════
const realInventory: Vehicle[] = [
  // ─── NEW FORD ──────────────────────────────────────────────
  { id: 'STK-F1201', vin: '1FTFW1E85RFA14823', year: 2025, make: 'Ford', model: 'F-150', trim: 'XLT SuperCrew 4x4', msrp: 56890, invoice: 52340, pack: 500, color: 'Iconic Silver', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 14, dealerFees: 799, mileage: 12 },
  { id: 'STK-F1202', vin: '1FTFW3L82RFA27691', year: 2025, make: 'Ford', model: 'F-150', trim: 'Lariat SuperCrew 4x4', msrp: 64995, invoice: 59810, pack: 500, color: 'Antimatter Blue', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 22, dealerFees: 799, mileage: 8 },
  { id: 'STK-F1203', vin: '1FMCU9J95RUA44102', year: 2025, make: 'Ford', model: 'Escape', trim: 'ST-Line Elite', msrp: 38890, invoice: 35780, pack: 400, color: 'Vapor Blue', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 31, dealerFees: 799, mileage: 5 },
  { id: 'STK-F1204', vin: '1FMSK8DH7RGA55234', year: 2025, make: 'Ford', model: 'Explorer', trim: 'ST 4WD', msrp: 58450, invoice: 53770, pack: 500, color: 'Carbonized Gray', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 8, dealerFees: 799, mileage: 6 },
  { id: 'STK-F1205', vin: '1FMJK2AT3REA19847', year: 2025, make: 'Ford', model: 'Expedition', trim: 'Max Limited 4x4', msrp: 82750, invoice: 76130, pack: 600, color: 'Star White', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 5, dealerFees: 799, mileage: 3 },
  { id: 'STK-F1206', vin: '3FMCR9B69RRE21456', year: 2025, make: 'Ford', model: 'Bronco Sport', trim: 'Big Bend AWD', msrp: 34590, invoice: 31820, pack: 400, color: 'Area 51', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 18, dealerFees: 799, mileage: 9 },
  { id: 'STK-F1207', vin: '3FTTW8E31RRA89012', year: 2025, make: 'Ford', model: 'Maverick', trim: 'Lariat AWD', msrp: 36200, invoice: 33300, pack: 400, color: 'Cactus Gray', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 27, dealerFees: 799, mileage: 4 },
  { id: 'STK-F1208', vin: '1FA6P8CF2R5112039', year: 2025, make: 'Ford', model: 'Mustang', trim: 'GT Premium', msrp: 49890, invoice: 45900, pack: 500, color: 'Race Red', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 42, dealerFees: 799, mileage: 7 },
  // ─── NEW CHEVROLET ─────────────────────────────────────────
  { id: 'STK-C2301', vin: '3GCUYEED5RG218445', year: 2025, make: 'Chevrolet', model: 'Silverado 1500', trim: 'RST Crew Cab 4WD', msrp: 57490, invoice: 52890, pack: 500, color: 'Summit White', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 11, dealerFees: 799, mileage: 10 },
  { id: 'STK-C2302', vin: '3GCUYEED8RG245612', year: 2025, make: 'Chevrolet', model: 'Silverado 1500', trim: 'LT Trail Boss', msrp: 61890, invoice: 56940, pack: 500, color: 'Black', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 19, dealerFees: 799, mileage: 14 },
  { id: 'STK-C2303', vin: '1GNSKDKD4RR178934', year: 2025, make: 'Chevrolet', model: 'Tahoe', trim: 'LT 4WD', msrp: 63290, invoice: 58230, pack: 600, color: 'Empire Beige', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 15, dealerFees: 799, mileage: 8 },
  { id: 'STK-C2304', vin: '3GNAXKEV4RS112876', year: 2025, make: 'Chevrolet', model: 'Equinox', trim: 'RS AWD', msrp: 36490, invoice: 33570, pack: 400, color: 'Sterling Gray', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 28, dealerFees: 799, mileage: 6 },
  { id: 'STK-C2305', vin: '1G1FE1R72R0134567', year: 2025, make: 'Chevrolet', model: 'Camaro', trim: 'LT1 Coupe', msrp: 39990, invoice: 36790, pack: 400, color: 'Rapid Blue', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 38, dealerFees: 799, mileage: 11 },
  { id: 'STK-C2306', vin: '1GNERNKW0RR198234', year: 2025, make: 'Chevrolet', model: 'Traverse', trim: 'Premier AWD', msrp: 51290, invoice: 47190, pack: 500, color: 'Lakeshore Blue', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 9, dealerFees: 799, mileage: 5 },
  // ─── NEW TOYOTA ────────────────────────────────────────────
  { id: 'STK-T3401', vin: '4T1G11AK4SU012845', year: 2025, make: 'Toyota', model: 'Camry', trim: 'SE AWD', msrp: 31590, invoice: 29060, pack: 400, color: 'Celestial Silver', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 12, dealerFees: 699, mileage: 4 },
  { id: 'STK-T3402', vin: '4T1G11AK8SU034921', year: 2025, make: 'Toyota', model: 'Camry', trim: 'XLE V6', msrp: 37890, invoice: 34860, pack: 400, color: 'Underground', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 7, dealerFees: 699, mileage: 3 },
  { id: 'STK-T3403', vin: '2T3P1RFV5SW087123', year: 2025, make: 'Toyota', model: 'RAV4', trim: 'XLE Premium AWD', msrp: 38340, invoice: 35270, pack: 400, color: 'Blueprint', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 16, dealerFees: 699, mileage: 6 },
  { id: 'STK-T3404', vin: '5TDGZRBH2SS912456', year: 2025, make: 'Toyota', model: 'Highlander', trim: 'Limited AWD', msrp: 52450, invoice: 48250, pack: 500, color: 'Wind Chill Pearl', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 10, dealerFees: 699, mileage: 5 },
  { id: 'STK-T3405', vin: '5TFCZ5AN1SX034789', year: 2025, make: 'Toyota', model: 'Tacoma', trim: 'TRD Sport 4x4', msrp: 42890, invoice: 39460, pack: 500, color: 'Lunar Rock', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 21, dealerFees: 699, mileage: 9 },
  { id: 'STK-T3406', vin: 'JTDKN3DU8S5012983', year: 2025, make: 'Toyota', model: 'Corolla Cross', trim: 'Hybrid XSE', msrp: 33490, invoice: 30810, pack: 400, color: 'Cavalry Blue', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 6, dealerFees: 699, mileage: 2 },
  { id: 'STK-T3407', vin: 'JTEBU5JR8S5678234', year: 2025, make: 'Toyota', model: '4Runner', trim: 'TRD Pro', msrp: 62890, invoice: 57860, pack: 600, color: 'Terra', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 3, dealerFees: 699, mileage: 4 },
  { id: 'STK-T3408', vin: '5TDBY5G14SS045123', year: 2025, make: 'Toyota', model: 'Sequoia', trim: 'Platinum 4WD', msrp: 76890, invoice: 70740, pack: 600, color: 'Midnight Black', stockType: 'New', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 13, dealerFees: 699, mileage: 7 },
  // ─── USED / CPO ────────────────────────────────────────────
  { id: 'STK-U4501', vin: '1FTFW1E50NFA89234', year: 2022, make: 'Ford', model: 'F-150', trim: 'Platinum SuperCrew', msrp: 47900, invoice: 42800, pack: 800, color: 'Smoked Quartz', stockType: 'Used', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 24, dealerFees: 799, mileage: 31240 },
  { id: 'STK-U4502', vin: '5TDGZRBH8NS456789', year: 2022, make: 'Toyota', model: 'Highlander', trim: 'XLE AWD', msrp: 38500, invoice: 34200, pack: 700, color: 'Celestial Silver', stockType: 'Used', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 18, dealerFees: 699, mileage: 28450 },
  { id: 'STK-U4503', vin: '3GCUYEED7NG234567', year: 2022, make: 'Chevrolet', model: 'Silverado 1500', trim: 'LT Crew 4WD', msrp: 42800, invoice: 38100, pack: 750, color: 'Oxford White', stockType: 'Used', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 33, dealerFees: 799, mileage: 42100 },
  { id: 'STK-U4504', vin: '2T3P1RFV3NW112345', year: 2022, make: 'Toyota', model: 'RAV4', trim: 'XLE Premium', msrp: 31200, invoice: 27800, pack: 600, color: 'Magnetic Gray', stockType: 'Used', status: 'In Stock', carfaxStatus: 'Minor', daysInStock: 41, dealerFees: 699, mileage: 38900 },
  { id: 'STK-U4505', vin: '1FMSK8DH5NGA78901', year: 2022, make: 'Ford', model: 'Explorer', trim: 'Limited 4WD', msrp: 41900, invoice: 37400, pack: 700, color: 'Forged Green', stockType: 'Used', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 15, dealerFees: 799, mileage: 26800 },
  { id: 'STK-U4506', vin: '1G1YY22G565109845', year: 2023, make: 'Chevrolet', model: 'Corvette', trim: 'Stingray 3LT', msrp: 68900, invoice: 63200, pack: 1000, color: 'Torch Red', stockType: 'Used', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 9, dealerFees: 799, mileage: 8420 },
  { id: 'STK-U4507', vin: 'JTEBU5JR2N5234567', year: 2022, make: 'Toyota', model: '4Runner', trim: 'TRD Off-Road Premium', msrp: 42500, invoice: 38100, pack: 700, color: 'Army Green', stockType: 'Used', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 20, dealerFees: 699, mileage: 34200 },
  { id: 'STK-U4508', vin: '1FA6P8TH8N5123456', year: 2022, make: 'Ford', model: 'Mustang', trim: 'Mach 1 Premium', msrp: 51900, invoice: 46800, pack: 800, color: 'Fighter Jet Gray', stockType: 'Used', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 29, dealerFees: 799, mileage: 12450 },
  { id: 'STK-U4509', vin: '5TFCZ5AN6NX098765', year: 2022, make: 'Toyota', model: 'Tacoma', trim: 'TRD Pro 4x4', msrp: 44800, invoice: 40100, pack: 750, color: 'Lime Rush', stockType: 'Used', status: 'In Stock', carfaxStatus: 'Clean', daysInStock: 12, dealerFees: 699, mileage: 22100 },
  { id: 'STK-U4510', vin: '1GCUYEED2NZ345678', year: 2022, make: 'Chevrolet', model: 'Tahoe', trim: 'Z71 4WD', msrp: 54900, invoice: 49200, pack: 800, color: 'Shadow Gray', stockType: 'Used', status: 'In Stock', carfaxStatus: 'Minor', daysInStock: 26, dealerFees: 799, mileage: 35800 },
  // ─── IN TRANSIT ────────────────────────────────────────────
  { id: 'STK-F1209', vin: '1FTFW1E82RFA99001', year: 2025, make: 'Ford', model: 'F-150', trim: 'Raptor SuperCrew', msrp: 78890, invoice: 72580, pack: 600, color: 'Code Orange', stockType: 'New', status: 'In Transit', carfaxStatus: 'Clean', daysInStock: 0, dealerFees: 799, mileage: 0 },
  { id: 'STK-T3409', vin: '5TDBY5G12SS098765', year: 2025, make: 'Toyota', model: 'Tundra', trim: 'Capstone CrewMax', msrp: 73530, invoice: 67650, pack: 600, color: 'Wind Chill Pearl', stockType: 'New', status: 'In Transit', carfaxStatus: 'Clean', daysInStock: 0, dealerFees: 699, mileage: 0 },
  { id: 'STK-C2307', vin: '1GNSKDKD6RR298765', year: 2025, make: 'Chevrolet', model: 'Suburban', trim: 'High Country 4WD', msrp: 79890, invoice: 73500, pack: 600, color: 'Black', stockType: 'New', status: 'In Transit', carfaxStatus: 'Clean', daysInStock: 0, dealerFees: 799, mileage: 0 },
  // ─── SOLD (recent) ─────────────────────────────────────────
  { id: 'STK-F1210', vin: '1FMCU9J92RUA33001', year: 2025, make: 'Ford', model: 'Escape', trim: 'Platinum AWD', msrp: 42890, invoice: 39460, pack: 400, color: 'Star White', stockType: 'New', status: 'Sold', carfaxStatus: 'Clean', daysInStock: 19, dealerFees: 799, mileage: 6 },
  { id: 'STK-T3410', vin: '4T1G11AK2SU078901', year: 2025, make: 'Toyota', model: 'Camry', trim: 'TRD V6', msrp: 37990, invoice: 34950, pack: 400, color: 'Ice Cap', stockType: 'New', status: 'Sold', carfaxStatus: 'Clean', daysInStock: 8, dealerFees: 699, mileage: 5 },
];

const realCustomers: Customer[] = [
  { id: 'C-2001', name: 'Robert Hernandez', email: 'rhernandez84@gmail.com', phone: '(817) 445-2190', creditScore: 712, lastVisit: '5/18/2026', status: 'Active' },
  { id: 'C-2002', name: 'Jennifer Walsh', email: 'jwalsh.realty@outlook.com', phone: '(469) 832-4517', creditScore: 748, lastVisit: '5/17/2026', status: 'Active' },
  { id: 'C-2003', name: 'David Gonzalez', email: 'dgonzalez_dfw@yahoo.com', phone: '(682) 910-3844', creditScore: 685, lastVisit: '5/19/2026', status: 'Active' },
  { id: 'C-2004', name: 'Anthony Richards', email: 'a.richards@techforward.io', phone: '(214) 557-6283', creditScore: 621, lastVisit: '5/16/2026', status: 'Active' },
  { id: 'C-2005', name: 'Tiffany Nguyen', email: 'tiffany.nguyen@gmail.com', phone: '(972) 341-8890', creditScore: 779, lastVisit: '5/20/2026', status: 'Active' },
  { id: 'C-2006', name: 'James Patterson', email: 'jpatterson_law@outlook.com', phone: '(817) 228-5041', creditScore: 802, lastVisit: '5/20/2026', status: 'Active' },
  { id: 'C-2007', name: 'Carlos Martinez', email: 'carlos.m.martinez@hotmail.com', phone: '(469) 712-9934', creditScore: 658, lastVisit: '5/14/2026', status: 'Active' },
  { id: 'C-2008', name: 'Kevin O\'Brien', email: 'kobrien.sales@gmail.com', phone: '(214) 890-1127', creditScore: 734, lastVisit: '5/12/2026', status: 'Past Customer' },
  { id: 'C-2009', name: 'Samantha Brooks', email: 'sambrooks22@icloud.com', phone: '(682) 445-6712', creditScore: 761, lastVisit: '5/15/2026', status: 'Active' },
  { id: 'C-2010', name: 'Marcus Taylor', email: 'marcus.t@taylorplumbing.com', phone: '(972) 668-3390', creditScore: 695, lastVisit: '5/11/2026', status: 'Active' },
  { id: 'C-2011', name: 'Daniel Kim', email: 'dkim.eng@protonmail.com', phone: '(817) 992-4401', creditScore: 788, lastVisit: '5/19/2026', status: 'Active' },
  { id: 'C-2012', name: 'Patricia Owens', email: 'pat.owens@sbcglobal.net', phone: '(469) 114-7829', creditScore: 542, lastVisit: '5/13/2026', status: 'Lead' },
  { id: 'C-2013', name: 'Raymond Butler', email: 'raybutler77@gmail.com', phone: '(214) 337-5568', creditScore: 498, lastVisit: '5/10/2026', status: 'Lead' },
  { id: 'C-2014', name: 'Lisa Tran', email: 'lisatran.dds@gmail.com', phone: '(682) 223-8845', creditScore: 815, lastVisit: '5/20/2026', status: 'Active' },
  { id: 'C-2015', name: 'William Foster', email: 'wfoster@fosterranch.com', phone: '(972) 880-2214', creditScore: 752, lastVisit: '5/18/2026', status: 'Active' },
  { id: 'C-2016', name: 'Michelle Reeves', email: 'michelle.r@kw.com', phone: '(817) 330-4518', creditScore: 724, lastVisit: '5/9/2026', status: 'Lead' },
  { id: 'C-2017', name: 'Christopher Davis', email: 'cdavis_oilfield@outlook.com', phone: '(940) 556-8812', creditScore: 691, lastVisit: '5/7/2026', status: 'Lead' },
  { id: 'C-2018', name: 'Angela Washington', email: 'awashington@teacherisd.edu', phone: '(682) 770-2234', creditScore: 756, lastVisit: '5/6/2026', status: 'Past Customer' },
];

interface AppState {
  deals: Deal[];
  inventory: Vehicle[];
  customers: Customer[];
  addDeal: (deal: Deal) => void;
  updateDealStatus: (id: string, status: Deal['status']) => void;
  removeDeal: (id: string) => void;
  updateVehicleStatus: (id: string, status: Vehicle['status']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  deals: [
    {
      id: 'D-24-0847',
      customer: 'Robert Hernandez',
      vehicle: '2025 Ford F-150 XLT SuperCrew 4x4',
      amount: 54890,
      status: 'Pending',
      lender: 'Ford Motor Credit',
      daysOpen: 1,
      fiManager: 'Marcus Williams',
      frontGross: 2450,
      backGross: 1890,
      creditTier: 'Prime',
      docStatus: 'Ready',
      type: 'Finance',
      term: 72,
      apr: 5.9,
      downPayment: 5000,
      products: [
        { id: 'p1', name: 'EasyCare Platinum VSC', price: 2995, cost: 1150, type: 'Warranty', active: true },
        { id: 'p2', name: 'GAP Waiver', price: 895, cost: 275, type: 'GAP', active: true },
      ],
      eContractingStatus: 'Not Started',
      digitalDealJackets: [
        { id: 'DDJ-1', name: 'Retail Installment Contract', status: 'Pending', type: 'Sales' },
        { id: 'DDJ-2', name: 'Credit Application', status: 'Completed', type: 'Lender' },
      ]
    },
    {
      id: 'D-24-0848',
      customer: 'Jennifer Walsh',
      vehicle: '2024 Toyota RAV4 XLE Premium AWD',
      amount: 37450,
      status: 'Pending',
      lender: 'Toyota Motor Credit',
      daysOpen: 0,
      fiManager: 'Amanda Chen',
      frontGross: 1800,
      backGross: 2450,
      creditTier: 'Prime',
      docStatus: 'Incomplete',
      type: 'Finance',
      term: 60,
      apr: 4.9,
      downPayment: 3000,
      tradeInValue: 14500,
      tradeInPayoff: 8200,
      products: [
        { id: 'p1', name: 'Toyota Care Plus', price: 1495, cost: 650, type: 'Maintenance', active: true },
        { id: 'p2', name: 'GAP Waiver', price: 895, cost: 275, type: 'GAP', active: true },
        { id: 'p3', name: 'Perma-Plate Appearance', price: 799, cost: 175, type: 'Protection', active: true },
      ],
      eContractingStatus: 'Not Started',
      digitalDealJackets: []
    },
    {
      id: 'D-24-0851',
      customer: 'Tiffany Nguyen',
      vehicle: '2025 Toyota Camry SE AWD',
      amount: 30850,
      status: 'Approved',
      lender: 'Capital One Auto',
      daysOpen: 1,
      fiManager: 'Marcus Williams',
      frontGross: 1200,
      backGross: 3180,
      creditTier: 'Elite',
      docStatus: 'Ready',
      type: 'Finance',
      term: 60,
      apr: 3.9,
      downPayment: 2500,
      products: [
        { id: 'p1', name: 'EasyCare Powertrain Plus', price: 1895, cost: 750, type: 'Warranty', active: true },
        { id: 'p2', name: 'GAP Waiver', price: 895, cost: 275, type: 'GAP', active: true },
        { id: 'p3', name: 'Tire & Wheel Protection', price: 899, cost: 320, type: 'Protection', active: true },
        { id: 'p4', name: 'Key Replacement', price: 499, cost: 110, type: 'Protection', active: true },
      ],
      eContractingStatus: 'Sent',
      digitalDealJackets: [
        { id: 'DDJ-1', name: 'Retail Installment Contract', status: 'Completed', type: 'Sales' },
        { id: 'DDJ-2', name: 'Credit Application', status: 'Completed', type: 'Lender' },
        { id: 'DDJ-3', name: 'OFAC/Red Flags Compliance', status: 'Completed', type: 'Compliance' },
      ]
    },
    {
      id: 'D-24-0852',
      customer: 'James Patterson',
      vehicle: '2024 Ford Explorer ST 4WD',
      amount: 58400,
      status: 'Approved',
      lender: 'Chase Auto Finance',
      daysOpen: 0,
      fiManager: 'Amanda Chen',
      frontGross: 3200,
      backGross: 2750,
      creditTier: 'Elite',
      docStatus: 'Ready',
      type: 'Finance',
      term: 72,
      apr: 4.49,
      downPayment: 10000,
      products: [
        { id: 'p1', name: 'EasyCare Platinum VSC', price: 3295, cost: 1250, type: 'Warranty', active: true },
        { id: 'p2', name: 'Prepaid Maintenance', price: 1495, cost: 700, type: 'Maintenance', active: true },
      ],
      eContractingStatus: 'Sent',
      digitalDealJackets: [
        { id: 'DDJ-1', name: 'Bill of Sale', status: 'Completed', type: 'Sales' },
        { id: 'DDJ-2', name: 'Retail Installment Contract', status: 'Pending', type: 'Sales' },
        { id: 'DDJ-3', name: 'Credit Application', status: 'Completed', type: 'Lender' },
      ]
    },
    {
      id: 'D-24-0854',
      customer: 'Kevin O\'Brien',
      vehicle: '2023 Ford Mustang GT Premium',
      amount: 46800,
      status: 'Funded',
      lender: 'Ford Motor Credit',
      daysOpen: 6,
      fiManager: 'Amanda Chen',
      frontGross: 4100,
      backGross: 2890,
      creditTier: 'Prime',
      docStatus: 'Signed',
      type: 'Finance',
      term: 72,
      apr: 5.49,
      downPayment: 8000,
      products: [
        { id: 'p1', name: 'EasyCare Platinum VSC', price: 3295, cost: 1250, type: 'Warranty', active: true },
        { id: 'p2', name: 'GAP Waiver', price: 895, cost: 275, type: 'GAP', active: true },
        { id: 'p3', name: 'VIN Etch + Theft', price: 399, cost: 75, type: 'Protection', active: true },
      ],
      eContractingStatus: 'Funded',
      digitalDealJackets: [
        { id: 'DDJ-1', name: 'Bill of Sale', status: 'Completed', type: 'Sales' },
        { id: 'DDJ-2', name: 'Retail Installment Contract', status: 'Completed', type: 'Sales' },
        { id: 'DDJ-3', name: 'Lender Funding Packet', status: 'Completed', type: 'Lender' },
        { id: 'DDJ-4', name: 'OFAC/Red Flags', status: 'Completed', type: 'Compliance' },
      ]
    },
    {
      id: 'D-24-0855',
      customer: 'Samantha Brooks',
      vehicle: '2024 Toyota Highlander Limited AWD',
      amount: 51200,
      status: 'Funded',
      lender: 'USAA',
      daysOpen: 5,
      fiManager: 'Marcus Williams',
      frontGross: 2800,
      backGross: 3450,
      creditTier: 'Elite',
      docStatus: 'Signed',
      type: 'Finance',
      term: 60,
      apr: 3.79,
      downPayment: 12000,
      tradeInValue: 18500,
      tradeInPayoff: 0,
      products: [
        { id: 'p1', name: 'EasyCare Platinum VSC', price: 3295, cost: 1250, type: 'Warranty', active: true },
        { id: 'p2', name: 'GAP Waiver', price: 895, cost: 275, type: 'GAP', active: true },
        { id: 'p3', name: 'Perma-Plate Appearance', price: 799, cost: 175, type: 'Protection', active: true },
        { id: 'p4', name: 'Prepaid Maintenance', price: 1495, cost: 700, type: 'Maintenance', active: true },
      ],
      eContractingStatus: 'Funded',
      digitalDealJackets: [
        { id: 'DDJ-1', name: 'Bill of Sale', status: 'Completed', type: 'Sales' },
        { id: 'DDJ-2', name: 'Retail Installment Contract', status: 'Completed', type: 'Sales' },
        { id: 'DDJ-3', name: 'Lender Funding Confirmation', status: 'Completed', type: 'Lender' },
      ]
    },
  ],
  inventory: realInventory,
  customers: realCustomers,
  addDeal: (deal) => set((state) => ({ deals: [deal, ...state.deals] })),
  updateDealStatus: (id, status) => set((state) => ({
    deals: state.deals.map(d => d.id === id ? { ...d, status } : d)
  })),
  removeDeal: (id) => set((state) => ({
    deals: state.deals.filter(d => d.id !== id)
  })),
  updateVehicleStatus: (id, status) => set((state) => ({
    inventory: state.inventory.map(v => v.id === id ? { ...v, status } : v)
  }))
}));
