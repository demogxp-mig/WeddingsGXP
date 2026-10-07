import { 
  WeddingSettings, 
  Guest, 
  Expense, 
  ChecklistTask, 
  ScheduleEvent 
} from '../types/wedding';

export const INITIAL_SETTINGS: WeddingSettings = {
  partner1Name: 'Eleanor Vance',
  partner2Name: 'Julian Montgomery',
  weddingDate: '2027-06-19T16:00',
  venueName: 'Villa Cetinale & Gardens',
  venueLocation: 'Sovicille, Tuscany, Italy',
  targetBudget: 55000,
  expectedGuests: 120,
  themeNotes: 'Understated Tuscan romance · Natural linen, olive leaves, warm champagne candlelight'
};

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'g-1',
    name: 'Clara Vance',
    email: 'clara.vance@example.com',
    phone: '+1 (555) 234-8901',
    rsvpStatus: 'attending',
    hasPlusOne: true,
    plusOneName: 'Jonathan Hayes',
    tableNumber: 'Table 01 - Florentine Olive',
    dietaryRequirement: 'Vegetarian',
    dietaryNotes: 'No wild mushrooms',
    invitationSent: true,
    notes: 'Maid of Honor. Needs early morning access to bridal suite.',
    partySize: 2
  },
  {
    id: 'g-2',
    name: 'Marcus Montgomery',
    email: 'marcus.m@example.com',
    phone: '+1 (555) 987-1234',
    rsvpStatus: 'attending',
    hasPlusOne: false,
    tableNumber: 'Table 01 - Florentine Olive',
    dietaryRequirement: 'None',
    invitationSent: true,
    notes: 'Best Man. Delivering toast around 19:30.',
    partySize: 1
  },
  {
    id: 'g-3',
    name: 'Dr. Arthur Vance',
    email: 'a.vance.md@example.com',
    phone: '+1 (555) 345-6789',
    rsvpStatus: 'attending',
    hasPlusOne: true,
    plusOneName: 'Beatrice Vance',
    tableNumber: 'Table 02 - White Dahlia',
    dietaryRequirement: 'Gluten-Free',
    invitationSent: true,
    notes: "Father of the bride. Toast during dinner.",
    partySize: 2
  },
  {
    id: 'g-4',
    name: 'Helena Montgomery',
    email: 'helena.mont@example.com',
    phone: '+1 (555) 876-5432',
    rsvpStatus: 'attending',
    hasPlusOne: true,
    plusOneName: 'Richard Montgomery',
    tableNumber: 'Table 02 - White Dahlia',
    dietaryRequirement: 'None',
    invitationSent: true,
    notes: 'Parents of the groom.',
    partySize: 2
  },
  {
    id: 'g-5',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@designstudio.fr',
    rsvpStatus: 'attending',
    hasPlusOne: true,
    plusOneName: 'Antoine Dubois',
    tableNumber: 'Table 03 - Tuscan Cypress',
    dietaryRequirement: 'Nut Allergy',
    dietaryNotes: 'Severe peanut and hazelnut allergy',
    invitationSent: true,
    notes: 'Traveling from Paris on Thursday.',
    partySize: 2
  },
  {
    id: 'g-6',
    name: 'David Chen',
    email: 'david.chen@technova.io',
    phone: '+1 (555) 456-1122',
    rsvpStatus: 'attending',
    hasPlusOne: false,
    tableNumber: 'Table 03 - Tuscan Cypress',
    dietaryRequirement: 'None',
    invitationSent: true,
    notes: 'College friend of Julian.',
    partySize: 1
  },
  {
    id: 'g-7',
    name: 'Aria Thorne',
    email: 'aria.thorne@literary.org',
    rsvpStatus: 'attending',
    hasPlusOne: true,
    plusOneName: 'Callum Murphy',
    tableNumber: 'Table 04 - Wild Ranunculus',
    dietaryRequirement: 'Vegan',
    invitationSent: true,
    notes: 'Requires plant-based entrée and dessert.',
    partySize: 2
  },
  {
    id: 'g-8',
    name: 'Nathaniel Ward',
    email: 'nathaniel.ward@archfirm.com',
    phone: '+1 (555) 612-8800',
    rsvpStatus: 'declined',
    hasPlusOne: false,
    tableNumber: undefined,
    dietaryRequirement: 'None',
    invitationSent: true,
    notes: 'Sent warm wishes; abroad on project commissioning.',
    partySize: 1
  },
  {
    id: 'g-9',
    name: 'Camilla Sterling',
    email: 'c.sterling@vogueedit.com',
    rsvpStatus: 'pending',
    hasPlusOne: true,
    plusOneName: 'Guest TBD',
    tableNumber: 'Table 04 - Wild Ranunculus',
    dietaryRequirement: 'Dairy-Free',
    invitationSent: true,
    notes: 'Awaiting confirmation on flight arrival.',
    partySize: 2
  },
  {
    id: 'g-10',
    name: 'Lucas Rossi',
    email: 'lucas.rossi@botanica.it',
    phone: '+39 055 982341',
    rsvpStatus: 'attending',
    hasPlusOne: true,
    plusOneName: 'Giulia Rossi',
    tableNumber: 'Table 05 - Lemon Blossom',
    dietaryRequirement: 'None',
    invitationSent: true,
    notes: 'Local family friends from Florence.',
    partySize: 2
  },
  {
    id: 'g-11',
    name: 'Evelyn St. Claire',
    email: 'evelyn.stclaire@galleryart.com',
    rsvpStatus: 'attending',
    hasPlusOne: false,
    tableNumber: 'Table 05 - Lemon Blossom',
    dietaryRequirement: 'Vegetarian',
    invitationSent: true,
    partySize: 1
  },
  {
    id: 'g-12',
    name: 'Oliver Blackwood',
    email: 'oliver.b@equitypartners.co',
    phone: '+1 (555) 789-2234',
    rsvpStatus: 'pending',
    hasPlusOne: true,
    tableNumber: undefined,
    dietaryRequirement: 'None',
    invitationSent: true,
    notes: 'Followed up via message last Tuesday.',
    partySize: 2
  },
  {
    id: 'g-13',
    name: 'Hannah Moreno',
    email: 'hannah.moreno@biolabs.org',
    rsvpStatus: 'attending',
    hasPlusOne: false,
    tableNumber: 'Table 03 - Tuscan Cypress',
    dietaryRequirement: 'Halal',
    invitationSent: true,
    notes: 'Confirmed attendance and shuttle pickup.',
    partySize: 1
  },
  {
    id: 'g-14',
    name: 'Sebastian Vane',
    email: 'sebastian@vanemusic.com',
    phone: '+1 (555) 901-4455',
    rsvpStatus: 'declined',
    hasPlusOne: true,
    dietaryRequirement: 'None',
    invitationSent: true,
    notes: 'Concert tour conflict; sent registry gift.',
    partySize: 2
  },
  {
    id: 'g-15',
    name: 'Miriam & Samuel Althaus',
    email: 'althaus.family@geneva.ch',
    rsvpStatus: 'attending',
    hasPlusOne: true,
    plusOneName: 'Samuel Althaus',
    tableNumber: 'Table 02 - White Dahlia',
    dietaryRequirement: 'Gluten-Free',
    invitationSent: true,
    notes: 'Grandparents of Eleanor.',
    partySize: 2
  },
  {
    id: 'g-16',
    name: 'Tobias Sterling',
    email: 'tobias.s@presshouse.co.uk',
    rsvpStatus: 'pending',
    hasPlusOne: false,
    dietaryRequirement: 'None',
    invitationSent: true,
    notes: 'Awaiting passport renewal confirmation.',
    partySize: 1
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'e-1',
    category: 'Venue & Ceremony',
    title: 'Villa Cetinale Exclusive 3-Day Rental',
    vendor: 'Villa Cetinale Estate Management',
    estimatedCost: 18500,
    actualCost: 18500,
    status: 'paid',
    dueDate: '2027-01-15',
    paidDate: '2027-01-14',
    notes: 'Full deposit and reservation balance cleared. Includes grounds, gardens, and 8 estate suites.'
  },
  {
    id: 'e-2',
    category: 'Venue & Ceremony',
    title: 'Historic Chapel Ceremony Permit & Fee',
    vendor: 'Sovicille Municipal Comune',
    estimatedCost: 950,
    actualCost: 900,
    status: 'paid',
    dueDate: '2027-03-01',
    paidDate: '2027-02-28',
    notes: 'Civil and ceremony officiant municipal fee certified.'
  },
  {
    id: 'e-3',
    category: 'Catering & Bar',
    title: '4-Course Tuscan Plated Dinner (120 covers)',
    vendor: 'Guido Guidi Ricevimenti',
    estimatedCost: 14400,
    actualCost: 13800,
    status: 'deposit',
    dueDate: '2027-05-20',
    notes: '50% deposit paid (€6,500). Final head count due 14 days prior.'
  },
  {
    id: 'e-4',
    category: 'Catering & Bar',
    title: 'Sommelier Wine Curation & Prosecco Bar',
    vendor: 'Enoteca I Terzi Siena',
    estimatedCost: 3200,
    actualCost: 2950,
    status: 'paid',
    dueDate: '2027-04-10',
    paidDate: '2027-04-08',
    notes: 'Brunello di Montalcino, Chianti Classico Riserva & Franciacorta toast.'
  },
  {
    id: 'e-5',
    category: 'Photography & Videography',
    title: 'Full Day Editorial Fine Art Photography',
    vendor: 'Marcus Miller Studio (Paris/Florence)',
    estimatedCost: 5200,
    actualCost: 5200,
    status: 'paid',
    dueDate: '2027-02-01',
    paidDate: '2027-01-28',
    notes: 'Includes 10 hours coverage, second shooter, 35mm film rolls + hi-res digital archive.'
  },
  {
    id: 'e-6',
    category: 'Photography & Videography',
    title: 'Super 8mm & 4K Cinematic Wedding Film',
    vendor: 'Cinematique Florence',
    estimatedCost: 3800,
    actualCost: 3600,
    status: 'deposit',
    dueDate: '2027-06-01',
    notes: '50% deposit paid. Includes 8-minute highlight film + raw ceremony footage.'
  },
  {
    id: 'e-7',
    category: 'Floral & Decor',
    title: 'Ceremony Arch, Imperial Table Olive Garlands & Florals',
    vendor: 'Floralia Event Design Siena',
    estimatedCost: 6500,
    actualCost: 6200,
    status: 'deposit',
    dueDate: '2027-05-15',
    notes: 'White garden roses, lisianthus, olive branches, and taper candles for 12 tables.'
  },
  {
    id: 'e-8',
    category: 'Attire & Beauty',
    title: 'Bespoke Silk Gown & Alterations',
    vendor: 'Danielle Frankel Atelier',
    estimatedCost: 4800,
    actualCost: 5100,
    status: 'paid',
    dueDate: '2027-03-15',
    paidDate: '2027-03-12',
    notes: 'Final fitting scheduled for May 10th in Milan.'
  },
  {
    id: 'e-9',
    category: 'Attire & Beauty',
    title: 'Custom Wool-Silk Tuxedo & Accessories',
    vendor: 'Sartoria Liverano & Liverano',
    estimatedCost: 2600,
    actualCost: 2500,
    status: 'paid',
    dueDate: '2027-04-01',
    paidDate: '2027-03-30',
    notes: 'Midnight navy with silk grosgrain lapels.'
  },
  {
    id: 'e-10',
    category: 'Music & Entertainment',
    title: 'Classical String Trio (Ceremony & Cocktails)',
    vendor: 'Quartetto d’Archi Toscana',
    estimatedCost: 1800,
    actualCost: 1800,
    status: 'paid',
    dueDate: '2027-04-15',
    paidDate: '2027-04-14',
    notes: 'Repertoire: Pachelbel Canon, Morricone Love Theme, Debussy Clair de Lune.'
  },
  {
    id: 'e-11',
    category: 'Music & Entertainment',
    title: 'DJ & Sound System + Late Night Lighting',
    vendor: 'Julian Soundworks Italy',
    estimatedCost: 2200,
    actualCost: 2100,
    status: 'pending',
    dueDate: '2027-06-10',
    notes: 'Wireless microphones for toasts + dance lighting package.'
  },
  {
    id: 'e-12',
    category: 'Stationery & Paper',
    title: 'Letterpress Invitations, Menus & Calligraphy Placecards',
    vendor: 'Papier Plume Atelier',
    estimatedCost: 1600,
    actualCost: 1550,
    status: 'paid',
    dueDate: '2027-02-15',
    paidDate: '2027-02-12',
    notes: 'Handmade deckle edge cotton paper with olive wax seals.'
  },
  {
    id: 'e-13',
    category: 'Favors & Miscellaneous',
    title: 'Artisan Olive Oil Bottles & Custom Wax Seals',
    vendor: 'Frantoio di Cetinale',
    estimatedCost: 950,
    actualCost: 880,
    status: 'pending',
    dueDate: '2027-06-05',
    notes: '120 x 100ml extra virgin cold-pressed olive oil in dark glass.'
  }
];

export const INITIAL_TASKS: ChecklistTask[] = [
  {
    id: 't-1',
    title: 'Determine overall wedding vision & target budget',
    milestone: '12+ Months Before',
    category: 'Planning',
    dueDate: '2026-06-01',
    priority: 'high',
    assignee: 'Couple',
    completed: true,
    notes: 'Settled on Tuscan countryside aesthetic with ~120 guests.'
  },
  {
    id: 't-2',
    title: 'Tour and secure villa venue contract & dates',
    milestone: '12+ Months Before',
    category: 'Venue',
    dueDate: '2026-07-15',
    priority: 'high',
    assignee: 'Couple',
    completed: true,
    notes: 'Villa Cetinale contract signed for June 18-21 weekend.'
  },
  {
    id: 't-3',
    title: 'Book lead fine art photographer and videographer',
    milestone: '9-11 Months Before',
    category: 'Vendors',
    dueDate: '2026-09-01',
    priority: 'high',
    assignee: 'Partner 1',
    completed: true,
    notes: 'Marcus Miller confirmed.'
  },
  {
    id: 't-4',
    title: 'Select and hire catering & beverage team',
    milestone: '9-11 Months Before',
    category: 'Catering',
    dueDate: '2026-10-15',
    priority: 'high',
    assignee: 'Couple',
    completed: true,
    notes: 'Tasting completed in Florence; 4-course menu finalized.'
  },
  {
    id: 't-5',
    title: 'Order wedding gown and schedule bespoke fittings',
    milestone: '6-8 Months Before',
    category: 'Attire',
    dueDate: '2026-12-10',
    priority: 'high',
    assignee: 'Partner 1',
    completed: true,
    notes: 'First fitting done; final fitting in Milan in May.'
  },
  {
    id: 't-6',
    title: 'Reserve hotel room block for traveling guests',
    milestone: '6-8 Months Before',
    category: 'Lodging',
    dueDate: '2027-01-20',
    priority: 'medium',
    assignee: 'Planner',
    completed: true,
    notes: 'Blocks reserved at Borgo San Felice & Siena boutique hotels.'
  },
  {
    id: 't-7',
    title: 'Mail printed letterpress invitations with RSVP cards',
    milestone: '3-5 Months Before',
    category: 'Stationery',
    dueDate: '2027-02-15',
    priority: 'high',
    assignee: 'Couple',
    completed: true,
    notes: 'All 85 invitation suites dispatched.'
  },
  {
    id: 't-8',
    title: 'Finalize floral proposals and ceremony arch structure',
    milestone: '3-5 Months Before',
    category: 'Decor',
    dueDate: '2027-03-30',
    priority: 'medium',
    assignee: 'Planner',
    completed: true,
    notes: 'Sample mockups approved with Floralia.'
  },
  {
    id: 't-9',
    title: 'Confirm ceremony musician setlist and processional song',
    milestone: '1-2 Months Before',
    category: 'Music',
    dueDate: '2027-05-01',
    priority: 'medium',
    assignee: 'Partner 2',
    completed: false,
    notes: 'Need to confirm exact timing for Canon in D.'
  },
  {
    id: 't-10',
    title: 'Collect all final RSVP replies & update seating chart',
    milestone: '1-2 Months Before',
    category: 'Guests',
    dueDate: '2027-05-15',
    priority: 'high',
    assignee: 'Couple',
    completed: false,
    notes: 'Follow up with 3 pending guest parties.'
  },
  {
    id: 't-11',
    title: 'Submit finalized dietary requirements list to caterer',
    milestone: '1-2 Months Before',
    category: 'Catering',
    dueDate: '2027-05-25',
    priority: 'high',
    assignee: 'Planner',
    completed: false,
    notes: 'Check gluten-free and severe nut allergy covers.'
  },
  {
    id: 't-12',
    title: 'Print day-of stationery (menus, escort cards, ceremony programs)',
    milestone: 'Week Of',
    category: 'Stationery',
    dueDate: '2027-06-12',
    priority: 'medium',
    assignee: 'Planner',
    completed: false,
    notes: 'Proofread name spellings against guest list.'
  },
  {
    id: 't-13',
    title: 'Prepare vendor tip envelopes & final payment balance checks',
    milestone: 'Week Of',
    category: 'Budget',
    dueDate: '2027-06-16',
    priority: 'high',
    assignee: 'Partner 2',
    completed: false,
    notes: 'Envelopes labeled for DJ, catering team, photo/video, officiant.'
  },
  {
    id: 't-14',
    title: 'Pack wedding rings, vows booklets, and legal marriage license',
    milestone: 'Day Of',
    category: 'Ceremony',
    dueDate: '2027-06-19',
    priority: 'high',
    assignee: 'Couple',
    completed: false,
    notes: 'Hand over rings to Best Man Marcus prior to 13:00.'
  },
  {
    id: 't-15',
    title: 'Confirm emergency kit (steamer, sewing kit, safety pins, pain relief)',
    milestone: 'Day Of',
    category: 'Attire',
    dueDate: '2027-06-19',
    priority: 'medium',
    assignee: 'Wedding Party',
    completed: false,
    notes: 'Stored in bridal suite master bathroom.'
  }
];

export const INITIAL_SCHEDULE: ScheduleEvent[] = [
  {
    id: 's-1',
    startTime: '08:30',
    endTime: '11:30',
    activity: 'Bridal Suite Hair & Makeup Preparation',
    location: 'Villa Master Suite (2nd Floor)',
    assignedLead: 'Clara Vance (Maid of Honor) & Glam Team',
    vendorContact: 'Studio Bellezza (+39 055 33219)',
    cuesNotes: 'Light mimosa brunch served at 09:30. Photographer arrives at 11:00 for detail shots.'
  },
  {
    id: 's-2',
    startTime: '10:00',
    endTime: '11:45',
    activity: 'Groom & Groomsmen Dressing & Espresso',
    location: 'Guest Pavilion & Lemon Terrace',
    assignedLead: 'Marcus Montgomery (Best Man)',
    cuesNotes: 'Boutonnières delivered and pinned by 11:30.'
  },
  {
    id: 's-3',
    startTime: '11:45',
    endTime: '12:45',
    activity: 'Private First Look & Couple Portraits',
    location: 'Historic Cypress Alley & Garden Fountain',
    assignedLead: 'Marcus Miller (Lead Photo)',
    vendorContact: 'Marcus Studio (+33 6 42 19 88)',
    cuesNotes: 'Strict privacy: guests directed away from garden perimeter.',
    isMilestone: true
  },
  {
    id: 's-4',
    startTime: '13:00',
    endTime: '14:00',
    activity: 'Wedding Party & Immediate Family Group Photos',
    location: 'Villa Cetinale Stone Loggia',
    assignedLead: 'Elena (Wedding Coordinator)',
    cuesNotes: 'Family list pre-printed. Refreshments available between group rotations.'
  },
  {
    id: 's-5',
    startTime: '15:15',
    endTime: '15:50',
    activity: 'Guest Arrival & Welcome Spritz Station',
    location: 'Courtyard of Olives',
    assignedLead: 'Catering Captain Marco',
    cuesNotes: 'Acoustic classical guitar playing softly in courtyard.'
  },
  {
    id: 's-6',
    startTime: '16:00',
    endTime: '16:45',
    activity: 'Marriage Ceremony & Exchange of Vows',
    location: 'The Roman Garden Allée',
    assignedLead: 'Officiant Father Matteo & Planner',
    vendorContact: 'Quartetto d’Archi Toscana',
    cuesNotes: 'Music cue: Canon in D for entrance. Rose petal toss on recessional march.',
    isMilestone: true
  },
  {
    id: 's-7',
    startTime: '16:45',
    endTime: '18:15',
    activity: 'Cocktail Hour & Passed Tuscan Antipasti',
    location: 'Terrace overlooking Siena Hills',
    assignedLead: 'Guido Guidi Catering Team',
    cuesNotes: 'String trio transitions to upbeat Italian jazz. Couple takes golden hour portraits from 17:30 to 18:00.'
  },
  {
    id: 's-8',
    startTime: '18:30',
    endTime: '18:45',
    activity: 'Grand Entrance & Welcome Remarks',
    location: 'The Glass Conservatory & Imperial Tables',
    assignedLead: 'DJ Julian',
    cuesNotes: 'Guests seated. Couple introduced under chandelier arch.'
  },
  {
    id: 's-9',
    startTime: '19:00',
    endTime: '20:30',
    activity: '4-Course Plated Dinner & Speeches',
    location: 'Grand Conservatory Tables',
    assignedLead: 'Elena (Coordinator) & Maitre d’',
    cuesNotes: 'Toast 1: Father of the bride (19:30). Toast 2: Best man Marcus (19:50). Toast 3: Maid of honor Clara (20:10).'
  },
  {
    id: 's-10',
    startTime: '20:45',
    endTime: '21:15',
    activity: 'Traditional Millefoglie Cake Assembly & Cutting',
    location: 'Terrace under Fairy Lights',
    assignedLead: 'Pastry Chef Andrea',
    cuesNotes: 'Live pastry assembly with wild berries. Champagne flutes passed for toast.',
    isMilestone: true
  },
  {
    id: 's-11',
    startTime: '21:15',
    endTime: '21:30',
    activity: 'Couple First Dance & Parent Dances',
    location: 'Ballroom Floor & Loggia',
    assignedLead: 'DJ Julian',
    cuesNotes: 'Song: "La Vie En Rose" acoustic version. Fog effect active.'
  },
  {
    id: 's-12',
    startTime: '21:30',
    endTime: '01:00',
    activity: 'Late Night Dancing, Gelato Cart & Open Bar',
    location: 'Loggia & Lawn Lounge',
    assignedLead: 'DJ Julian & Bar Staff',
    cuesNotes: 'Midnight wood-fired pizza snack served at 23:30.'
  },
  {
    id: 's-13',
    startTime: '01:00',
    endTime: '01:15',
    activity: 'Sparkler Grand Exit & Vintage Alpha Spider Departure',
    location: 'Main Villa Driveway',
    assignedLead: 'Elena (Coordinator) & Best Man',
    cuesNotes: 'Sparklers handed out to all guests with safety matches.',
    isMilestone: true
  }
];

export const INITIAL_PROJECTS: import('../types/wedding').WeddingProject[] = [
  {
    id: 'proj-eleanor-julian',
    coupleName: 'Eleanor & Julian',
    settings: INITIAL_SETTINGS,
    guests: INITIAL_GUESTS,
    expenses: INITIAL_EXPENSES,
    tasks: INITIAL_TASKS,
    schedule: INITIAL_SCHEDULE,
    createdAt: '2026-04-10T10:00:00.000Z',
    updatedAt: '2026-10-02T15:30:00.000Z'
  },
  {
    id: 'proj-sophia-alexander',
    coupleName: 'Sophia & Alexander',
    settings: {
      partner1Name: 'Sophia Reyes',
      partner2Name: 'Alexander Sterling',
      weddingDate: '2027-09-11T16:30',
      venueName: 'The Glasshouse Conservatory',
      venueLocation: 'Hudson Valley, New York',
      targetBudget: 72000,
      expectedGuests: 160,
      themeNotes: 'Modern botanical elegance · Sculptural white orchids, champagne linen, brass & amber candlelight'
    },
    guests: [
      {
        id: 'g-sa-1',
        name: 'Isabella Reyes',
        email: 'isabella.reyes@example.com',
        phone: '+1 (555) 777-1122',
        rsvpStatus: 'attending',
        hasPlusOne: true,
        plusOneName: 'Liam Martinez',
        tableNumber: 'Table 01 - Glass Orchid',
        dietaryRequirement: 'Gluten-Free',
        invitationSent: true,
        notes: 'Sister of the bride & Maid of Honor.',
        partySize: 2
      },
      {
        id: 'g-sa-2',
        name: 'Julian Sterling',
        email: 'j.sterling@financehub.com',
        phone: '+1 (555) 888-3344',
        rsvpStatus: 'attending',
        hasPlusOne: false,
        tableNumber: 'Table 01 - Glass Orchid',
        dietaryRequirement: 'None',
        invitationSent: true,
        notes: 'Brother of the groom & Best Man.',
        partySize: 1
      },
      {
        id: 'g-sa-3',
        name: 'Victoria & Edward Reyes',
        email: 'v.reyes@architects.ny',
        rsvpStatus: 'attending',
        hasPlusOne: true,
        plusOneName: 'Edward Reyes',
        tableNumber: 'Table 02 - Magnolia Grove',
        dietaryRequirement: 'None',
        invitationSent: true,
        notes: 'Parents of the bride.',
        partySize: 2
      },
      {
        id: 'g-sa-4',
        name: 'Maya Lin-Dubois',
        email: 'maya.lin@curator.org',
        rsvpStatus: 'attending',
        hasPlusOne: true,
        plusOneName: 'Henri Dubois',
        tableNumber: 'Table 03 - Birch Terrace',
        dietaryRequirement: 'Vegan',
        invitationSent: true,
        notes: 'Close college roommate.',
        partySize: 2
      },
      {
        id: 'g-sa-5',
        name: 'Benjamin Vance-Smith',
        email: 'bvance@smithlegal.com',
        rsvpStatus: 'pending',
        hasPlusOne: true,
        tableNumber: 'Table 03 - Birch Terrace',
        dietaryRequirement: 'None',
        invitationSent: true,
        notes: 'Followed up on RSVP card last Friday.',
        partySize: 2
      },
      {
        id: 'g-sa-6',
        name: 'Dr. Sanjay Patel',
        email: 'sanjay.patel@biotech.org',
        rsvpStatus: 'declined',
        hasPlusOne: false,
        dietaryRequirement: 'None',
        invitationSent: true,
        notes: 'Sabbatical in Tokyo.',
        partySize: 1
      }
    ],
    expenses: [
      {
        id: 'e-sa-1',
        category: 'Venue & Ceremony',
        title: 'Glasshouse Estate Weekend Rental',
        vendor: 'The Glasshouse Hudson Valley',
        estimatedCost: 24000,
        actualCost: 24000,
        status: 'paid',
        dueDate: '2027-02-15',
        paidDate: '2027-02-10',
        notes: 'Ceremony glasshouse + reception terrace included.'
      },
      {
        id: 'e-sa-2',
        category: 'Catering & Bar',
        title: 'Farm-to-Table Plated Dinner & Cocktails (160 guests)',
        vendor: 'Local Roots Catering Co.',
        estimatedCost: 21000,
        actualCost: 20500,
        status: 'deposit',
        dueDate: '2027-07-01',
        notes: 'Seasonal Hudson Valley harvest menu.'
      },
      {
        id: 'e-sa-3',
        category: 'Floral & Decor',
        title: 'Suspended Orchid Installations & Tablescapes',
        vendor: 'Botanica Studio Brooklyn',
        estimatedCost: 9500,
        actualCost: 9200,
        status: 'deposit',
        dueDate: '2027-07-15',
        notes: 'Phalaenopsis orchids with brass candlesticks.'
      },
      {
        id: 'e-sa-4',
        category: 'Photography & Videography',
        title: 'Editorial 35mm & Drone Photography Package',
        vendor: 'Kaufman Fine Art Photography',
        estimatedCost: 6800,
        actualCost: 6800,
        status: 'paid',
        dueDate: '2027-03-01',
        paidDate: '2027-02-28'
      }
    ],
    tasks: [
      {
        id: 't-sa-1',
        title: 'Sign conservatory venue lease and deposit',
        milestone: '12+ Months Before',
        category: 'Venue',
        dueDate: '2026-08-01',
        priority: 'high',
        assignee: 'Couple',
        completed: true
      },
      {
        id: 't-sa-2',
        title: 'Contract farm-to-table caterer and craft bar',
        milestone: '9-11 Months Before',
        category: 'Catering',
        dueDate: '2026-11-15',
        priority: 'high',
        assignee: 'Couple',
        completed: true
      },
      {
        id: 't-sa-3',
        title: 'Floral suspension mockup review with Brooklyn florist',
        milestone: '6-8 Months Before',
        category: 'Decor',
        dueDate: '2027-02-20',
        priority: 'medium',
        assignee: 'Planner',
        completed: true
      },
      {
        id: 't-sa-4',
        title: 'Coordinate guest shuttles from Hudson train station',
        milestone: '3-5 Months Before',
        category: 'Transportation',
        dueDate: '2027-05-15',
        priority: 'high',
        assignee: 'Planner',
        completed: false,
        notes: 'Van block for 160 passengers.'
      },
      {
        id: 't-sa-5',
        title: 'Finalize jazz quintet setlist for cocktail hour',
        milestone: '1-2 Months Before',
        category: 'Music',
        dueDate: '2027-07-20',
        priority: 'medium',
        assignee: 'Partner 2',
        completed: false
      }
    ],
    schedule: [
      {
        id: 's-sa-1',
        startTime: '10:00',
        endTime: '13:00',
        activity: 'Bridal Party Hair & Champagne Brunch',
        location: 'Estate Bridal Suite',
        assignedLead: 'Isabella (Maid of Honor)',
        cuesNotes: 'Acoustic playlist, mimosa station.'
      },
      {
        id: 's-sa-2',
        startTime: '13:30',
        endTime: '15:00',
        activity: 'First Look & Arboretum Portraits',
        location: 'Glasshouse Arboretum',
        assignedLead: 'Lead Photographer Kaufman',
        isMilestone: true
      },
      {
        id: 's-sa-3',
        startTime: '16:30',
        endTime: '17:15',
        activity: 'Glasshouse Ceremony & Vow Exchange',
        location: 'Grand Conservatory Hall',
        assignedLead: 'Officiant & Planner',
        isMilestone: true
      },
      {
        id: 's-sa-4',
        startTime: '17:30',
        endTime: '19:00',
        activity: 'Cocktail Hour & Passed Oysters',
        location: 'Terrace & Lawn',
        assignedLead: 'Catering Captain'
      },
      {
        id: 's-sa-5',
        startTime: '19:15',
        endTime: '21:30',
        activity: 'Plated Dinner & Toast Speeches',
        location: 'Conservatory Dining Pavillion',
        assignedLead: 'Elena (Coordinator)'
      },
      {
        id: 's-sa-6',
        startTime: '21:45',
        endTime: '00:30',
        activity: 'Dancing & Late-Night Gelato Truck',
        location: 'Main Conservatory Floor',
        assignedLead: 'DJ & Sound Tech',
        isMilestone: true
      }
    ],
    createdAt: '2026-05-14T09:00:00.000Z',
    updatedAt: '2026-10-04T11:20:00.000Z'
  },
  {
    id: 'proj-amara-tariq',
    coupleName: 'Amara & Tariq',
    settings: {
      partner1Name: 'Amara Kanso',
      partner2Name: 'Tariq Al-Mansoor',
      weddingDate: '2027-11-06T17:00',
      venueName: 'Amanjena Palace & Courtyard',
      venueLocation: 'Marrakech, Morocco',
      targetBudget: 95000,
      expectedGuests: 185,
      themeNotes: 'Nocturnal desert romance · Moroccan lantern glow, terracotta arches, rose petals & oud'
    },
    guests: [
      {
        id: 'g-at-1',
        name: 'Nour Kanso',
        email: 'nour.kanso@beirut.lb',
        rsvpStatus: 'attending',
        hasPlusOne: true,
        plusOneName: 'Ziad Haddad',
        tableNumber: 'Palace Table 01 - Oasis Rose',
        dietaryRequirement: 'Halal',
        invitationSent: true,
        notes: 'Sister & Lead Organizer.',
        partySize: 2
      },
      {
        id: 'g-at-2',
        name: 'Karim Al-Mansoor',
        email: 'karim.m@dubaiholdings.ae',
        rsvpStatus: 'attending',
        hasPlusOne: true,
        plusOneName: 'Leila Mansoor',
        tableNumber: 'Palace Table 01 - Oasis Rose',
        dietaryRequirement: 'Halal',
        invitationSent: true,
        partySize: 2
      },
      {
        id: 'g-at-3',
        name: 'Soraya Benali',
        email: 'soraya@casablanca.ma',
        rsvpStatus: 'attending',
        hasPlusOne: false,
        tableNumber: 'Palace Table 02 - Amber Lantern',
        dietaryRequirement: 'Vegetarian',
        invitationSent: true,
        partySize: 1
      },
      {
        id: 'g-at-4',
        name: 'Charles & Diane Montgomery',
        email: 'c.montgomery@london.co.uk',
        rsvpStatus: 'pending',
        hasPlusOne: true,
        tableNumber: 'Palace Table 02 - Amber Lantern',
        dietaryRequirement: 'None',
        invitationSent: true,
        partySize: 2
      }
    ],
    expenses: [
      {
        id: 'e-at-1',
        category: 'Venue & Ceremony',
        title: 'Amanjena Palace 3-Day Resort Buyout',
        vendor: 'Aman Resorts Marrakech',
        estimatedCost: 38000,
        actualCost: 38000,
        status: 'paid',
        dueDate: '2027-01-30',
        paidDate: '2027-01-28',
        notes: 'Exclusive basin and palace pavilions.'
      },
      {
        id: 'e-at-2',
        category: 'Catering & Bar',
        title: 'Moroccan Royal Feast & Traditional Tea Service (185 guests)',
        vendor: 'Palais Soleiman Catering',
        estimatedCost: 26000,
        actualCost: 25000,
        status: 'deposit',
        dueDate: '2027-08-15'
      },
      {
        id: 'e-at-3',
        category: 'Floral & Decor',
        title: '1,000 Moroccan Copper Lanterns, Rose Basin & Carpets',
        vendor: 'Artisanat Marrakech Decor',
        estimatedCost: 14500,
        actualCost: 14000,
        status: 'deposit',
        dueDate: '2027-09-01'
      }
    ],
    tasks: [
      {
        id: 't-at-1',
        title: 'Confirm Marrakech airport private escort for international arrivals',
        milestone: '6-8 Months Before',
        category: 'Logistics',
        dueDate: '2027-04-10',
        priority: 'high',
        assignee: 'Planner',
        completed: true
      },
      {
        id: 't-at-2',
        title: 'Finalize Arabic lute (Oud) trio & Andalusian musicians',
        milestone: '3-5 Months Before',
        category: 'Music',
        dueDate: '2027-07-05',
        priority: 'high',
        assignee: 'Couple',
        completed: true
      },
      {
        id: 't-at-3',
        title: 'Send digital calligraphy invitations in English and French',
        milestone: '3-5 Months Before',
        category: 'Stationery',
        dueDate: '2027-06-01',
        priority: 'high',
        assignee: 'Partner 1',
        completed: true
      },
      {
        id: 't-at-4',
        title: 'Arrange custom amber and cedar perfume favors',
        milestone: '1-2 Months Before',
        category: 'Favors',
        dueDate: '2027-09-15',
        priority: 'medium',
        assignee: 'Couple',
        completed: false
      }
    ],
    schedule: [
      {
        id: 's-at-1',
        startTime: '15:30',
        endTime: '16:45',
        activity: 'Guest Arrival to Moroccan Mint Tea & Sweets',
        location: 'Palace Olive Grove Courtyard',
        assignedLead: 'Palace Hospitality Captain'
      },
      {
        id: 's-at-2',
        startTime: '17:00',
        endTime: '18:00',
        activity: 'Sunset Marriage Ceremony by the Water Basin',
        location: 'Reflecting Pool Arcade',
        assignedLead: 'Officiant & Coordinator',
        isMilestone: true
      },
      {
        id: 's-at-3',
        startTime: '18:30',
        endTime: '21:00',
        activity: 'Royal Feast & Andalusian Music under Lanterns',
        location: 'Great Courtyard Loggias',
        assignedLead: 'Chef & Banquet Manager'
      },
      {
        id: 's-at-4',
        startTime: '21:30',
        endTime: '02:00',
        activity: 'Midnight Celebration & Fire Dancers',
        location: 'Palace Poolside Pavilion',
        assignedLead: 'Entertainment Director',
        isMilestone: true
      }
    ],
    createdAt: '2026-06-01T14:00:00.000Z',
    updatedAt: '2026-09-28T18:40:00.000Z'
  }
];

export function createDefaultWeddingProject(settings: import('../types/wedding').WeddingSettings): import('../types/wedding').WeddingProject {
  const id = `proj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const coupleName = `${settings.partner1Name.split(' ')[0]} & ${settings.partner2Name.split(' ')[0]}`;
  
  return {
    id,
    coupleName,
    settings,
    guests: [],
    expenses: [
      {
        id: `e-${Date.now()}-1`,
        category: 'Venue & Ceremony',
        title: `${settings.venueName || 'Venue'} Reservation Deposit`,
        vendor: settings.venueName || 'Venue Management',
        estimatedCost: Math.round(settings.targetBudget * 0.35),
        actualCost: 0,
        status: 'pending',
        notes: 'Initial allocation budget estimate'
      },
      {
        id: `e-${Date.now()}-2`,
        category: 'Catering & Bar',
        title: 'Catering & Beverage Service Package',
        vendor: 'Catering Vendor TBD',
        estimatedCost: Math.round(settings.targetBudget * 0.28),
        actualCost: 0,
        status: 'pending'
      },
      {
        id: `e-${Date.now()}-3`,
        category: 'Photography & Videography',
        title: 'Lead Photographer Full Day Coverage',
        vendor: 'Photography Studio TBD',
        estimatedCost: Math.round(settings.targetBudget * 0.12),
        actualCost: 0,
        status: 'pending'
      },
      {
        id: `e-${Date.now()}-4`,
        category: 'Floral & Decor',
        title: 'Ceremony Arch & Reception Tablescapes',
        vendor: 'Floral Studio TBD',
        estimatedCost: Math.round(settings.targetBudget * 0.10),
        actualCost: 0,
        status: 'pending'
      }
    ],
    tasks: [
      {
        id: `t-${Date.now()}-1`,
        title: 'Define overall design concept, color palette and guest count',
        milestone: '12+ Months Before',
        category: 'Planning',
        dueDate: '',
        priority: 'high',
        assignee: 'Couple',
        completed: false
      },
      {
        id: `t-${Date.now()}-2`,
        title: `Tour and secure contract for ${settings.venueName || 'ceremony and reception venue'}`,
        milestone: '12+ Months Before',
        category: 'Venue',
        dueDate: '',
        priority: 'high',
        assignee: 'Couple',
        completed: false
      },
      {
        id: `t-${Date.now()}-3`,
        title: 'Interview and book lead wedding photographer & videographer',
        milestone: '9-11 Months Before',
        category: 'Vendors',
        dueDate: '',
        priority: 'high',
        assignee: 'Planner',
        completed: false
      },
      {
        id: `t-${Date.now()}-4`,
        title: 'Schedule menu tastings and beverage package pairings',
        milestone: '6-8 Months Before',
        category: 'Catering',
        dueDate: '',
        priority: 'medium',
        assignee: 'Couple',
        completed: false
      },
      {
        id: `t-${Date.now()}-5`,
        title: 'Order bespoke wedding attire and schedule first alteration fittings',
        milestone: '6-8 Months Before',
        category: 'Attire',
        dueDate: '',
        priority: 'high',
        assignee: 'Partner 1',
        completed: false
      },
      {
        id: `t-${Date.now()}-6`,
        title: 'Design and mail formal printed invitation suites',
        milestone: '3-5 Months Before',
        category: 'Stationery',
        dueDate: '',
        priority: 'high',
        assignee: 'Couple',
        completed: false
      },
      {
        id: `t-${Date.now()}-7`,
        title: 'Finalize RSVP guest count and update reception seating chart',
        milestone: '1-2 Months Before',
        category: 'Guests',
        dueDate: '',
        priority: 'high',
        assignee: 'Planner',
        completed: false
      },
      {
        id: `t-${Date.now()}-8`,
        title: 'Distribute finalized run of show timeline to all vendors',
        milestone: 'Week Of',
        category: 'Coordination',
        dueDate: '',
        priority: 'high',
        assignee: 'Planner',
        completed: false
      },
      {
        id: `t-${Date.now()}-9`,
        title: 'Confirm wedding rings, vows booklets, and legal license',
        milestone: 'Day Of',
        category: 'Ceremony',
        dueDate: '',
        priority: 'high',
        assignee: 'Couple',
        completed: false
      }
    ],
    schedule: [
      {
        id: `s-${Date.now()}-1`,
        startTime: '09:00',
        endTime: '12:00',
        activity: 'Hair, Makeup & Morning Preparations',
        location: 'Bridal Suite',
        assignedLead: 'Maid of Honor & Glam Team'
      },
      {
        id: `s-${Date.now()}-2`,
        startTime: '12:30',
        endTime: '13:30',
        activity: 'First Look & Couple Portraits',
        location: 'Garden Grounds',
        assignedLead: 'Lead Photographer',
        isMilestone: true
      },
      {
        id: `s-${Date.now()}-3`,
        startTime: '15:30',
        endTime: '16:00',
        activity: 'Guest Arrival & Pre-Ceremony Refreshments',
        location: 'Welcome Lounge',
        assignedLead: 'Lead Coordinator'
      },
      {
        id: `s-${Date.now()}-4`,
        startTime: '16:00',
        endTime: '16:45',
        activity: 'Marriage Ceremony & Exchange of Vows',
        location: settings.venueName || 'Main Ceremony Lawn',
        assignedLead: 'Officiant & Coordinator',
        isMilestone: true
      },
      {
        id: `s-${Date.now()}-5`,
        startTime: '17:00',
        endTime: '18:30',
        activity: 'Cocktail Hour & Passed Hors d’oeuvres',
        location: 'Terrace',
        assignedLead: 'Catering Lead'
      },
      {
        id: `s-${Date.now()}-6`,
        startTime: '18:45',
        endTime: '21:00',
        activity: 'Dinner Service & Celebration Toasts',
        location: 'Grand Reception Room',
        assignedLead: 'Banquet Captain & Planner'
      },
      {
        id: `s-${Date.now()}-7`,
        startTime: '21:15',
        endTime: '00:00',
        activity: 'First Dance, Cake Cutting & Open Party',
        location: 'Main Ballroom',
        assignedLead: 'DJ / Band Lead',
        isMilestone: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

