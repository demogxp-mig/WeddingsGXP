export type RSVPStatus = 'attending' | 'declined' | 'pending';

export type DietaryRequirement = 
  | 'None'
  | 'Vegetarian'
  | 'Vegan'
  | 'Gluten-Free'
  | 'Nut Allergy'
  | 'Dairy-Free'
  | 'Halal'
  | 'Custom';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rsvpStatus: RSVPStatus;
  hasPlusOne: boolean;
  plusOneName?: string;
  tableNumber?: string;
  dietaryRequirement: DietaryRequirement;
  dietaryNotes?: string;
  invitationSent: boolean;
  notes?: string;
  partySize: number; // 1 or 2 (if hasPlusOne)
}

export type BudgetCategory = 
  | 'Venue & Ceremony'
  | 'Catering & Bar'
  | 'Photography & Videography'
  | 'Attire & Beauty'
  | 'Floral & Decor'
  | 'Music & Entertainment'
  | 'Stationery & Paper'
  | 'Transportation & Stay'
  | 'Favors & Miscellaneous';

export type PaymentStatus = 'paid' | 'deposit' | 'pending';

export interface Expense {
  id: string;
  category: BudgetCategory;
  title: string;
  vendor: string;
  estimatedCost: number;
  actualCost: number;
  status: PaymentStatus;
  dueDate?: string;
  paidDate?: string;
  notes?: string;
}

export type ChecklistMilestone = 
  | '12+ Months Before'
  | '9-11 Months Before'
  | '6-8 Months Before'
  | '3-5 Months Before'
  | '1-2 Months Before'
  | 'Week Of'
  | 'Day Of';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface ChecklistTask {
  id: string;
  title: string;
  milestone: ChecklistMilestone;
  category: string;
  dueDate?: string;
  priority: TaskPriority;
  assignee: 'Couple' | 'Partner 1' | 'Partner 2' | 'Planner' | 'Wedding Party';
  completed: boolean;
  notes?: string;
}

export interface ScheduleEvent {
  id: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "11:30"
  activity: string;
  location: string;
  assignedLead: string;
  vendorContact?: string;
  cuesNotes?: string;
  isMilestone?: boolean;
}

export interface WeddingSettings {
  partner1Name: string;
  partner2Name: string;
  weddingDate: string; // ISO date string e.g. "2027-06-19T16:00"
  venueName: string;
  venueLocation: string;
  targetBudget: number;
  expectedGuests: number;
  themeNotes?: string;
}

export interface WeddingProject {
  id: string;
  coupleName: string;
  settings: WeddingSettings;
  guests: Guest[];
  expenses: Expense[];
  tasks: ChecklistTask[];
  schedule: ScheduleEvent[];
  createdAt: string;
  updatedAt: string;
}

export type NavigationTab = 'dashboard' | 'guests' | 'budget' | 'checklist' | 'schedule' | 'settings';

