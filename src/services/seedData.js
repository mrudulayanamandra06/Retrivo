// RETRIVO STARTER DATA FOR LOCAL DEVELOPMENT AND PRESENTATION FLOWS
// Customized for Indian Campus Ecosystem (IIT / NIT / Central University Context)

export const INITIAL_USERS = [
  {
    id: 'user-lalli',
    full_name: 'Lalli',
    email: 'lalli@campus.ac.in',
    country: 'India',
    password: 'password123',
    role: 'student',
    department: 'Computer Science & Engineering',
    phone: '+91 98765 43210',
    avatar_url: '',
    created_at: '2026-11-01T10:00:00Z'
  },
  {
    id: 'user-maya',
    full_name: 'Maya Patel',
    email: 'maya.patel@campus.ac.in',
    country: 'India',
    password: 'password123',
    role: 'student',
    department: 'Biomedical Engineering',
    phone: '+91 98450 12345',
    avatar_url: '',
    created_at: '2026-11-01T11:00:00Z'
  },
  {
    id: 'user-admin',
    full_name: 'Inspector Rajesh Sharma',
    email: 'security.sharma@campus.ac.in',
    country: 'India',
    password: 'adminpassword',
    role: 'admin',
    department: 'Chief Security Officer & Proctor Office',
    phone: '+91 11 2659 1000',
    avatar_url: '',
    created_at: '2026-10-15T08:00:00Z'
  }
];

export const INITIAL_ITEMS = [
  {
    id: 'item-101',
    user_id: 'user-lalli',
    title: 'Space Gray MacBook Pro 14"',
    description: 'Left on quiet study desk in Central Library 2nd floor reading hall near the east wing windows. Has a dark matte shell casing with tech stickers.',
    category: 'Electronics',
    item_type: 'lost',
    location: 'Central Library, 2nd Floor Reading Hall',
    event_date: '2026-11-04',
    approximate_time: '14:30',
    image_url: '',
    distinguishing_features: 'React and GitHub Octocat stickers on bottom corner, tiny scratch near MagSafe port.',
    reward_information: '₹1,000 cash reward + sincere gratitude',
    storage_location: null,
    status: 'active',
    created_at: '2026-11-04T15:00:00Z',
    updated_at: '2026-11-04T15:00:00Z'
  },
  {
    id: 'item-201',
    user_id: 'user-maya',
    title: 'Apple MacBook Pro in Gray Protective Case',
    description: 'Found unattended on desk in Central Library study zone after afternoon closing rounds. Handed over safely to circulation desk.',
    category: 'Electronics',
    item_type: 'found',
    location: 'Central Library, 2nd Floor East Wing',
    event_date: '2026-11-04',
    approximate_time: '17:00',
    image_url: '',
    distinguishing_features: 'Dark protective hard cover with developer stickers on underside.',
    reward_information: null,
    storage_location: 'Central Library Circulation Desk (Ask for Security Supervisor Mr. Rao)',
    status: 'active',
    created_at: '2026-11-04T17:30:00Z',
    updated_at: '2026-11-04T17:30:00Z'
  },
  {
    id: 'item-102',
    user_id: 'user-lalli',
    title: 'Campus Student ID Card with Navy Lanyard',
    description: 'Dropped somewhere between Ramanujan Tech Block and Student Activity Centre (SAC) dining hall during afternoon rush.',
    category: 'ID Cards',
    item_type: 'lost',
    location: 'Student Activity Centre (SAC) Plaza',
    event_date: '2026-11-05',
    approximate_time: '12:15',
    image_url: '',
    distinguishing_features: 'Navy woven lanyard with blue Bengaluru Namma Metro card and college library barcode.',
    reward_information: 'Hot chai treat & sincere thanks!',
    storage_location: null,
    status: 'active',
    created_at: '2026-11-05T13:00:00Z',
    updated_at: '2026-11-05T13:00:00Z'
  },
  {
    id: 'item-202',
    user_id: 'user-maya',
    title: 'Found Student ID Card with Metro Pass & Navy Lanyard',
    description: 'Found resting on bench near the South Canteen entrance of Student Activity Centre (SAC).',
    category: 'ID Cards',
    item_type: 'found',
    location: 'Student Activity Centre (SAC) South Entrance',
    event_date: '2026-11-05',
    approximate_time: '13:00',
    image_url: '',
    distinguishing_features: 'Navy strap with electronic RFID campus gate pass and blue transit keycard.',
    reward_information: null,
    storage_location: 'SAC Helpdesk & Security Post',
    status: 'active',
    created_at: '2026-11-05T13:30:00Z',
    updated_at: '2026-11-05T13:30:00Z'
  },
  {
    id: 'item-103',
    user_id: 'user-maya',
    title: 'Olive Green Hydro Flask Steel Water Bottle 32oz',
    description: 'Left on the lower bleachers at Campus Gymnasium Court 2 during evening badminton practice.',
    category: 'Accessories',
    item_type: 'lost',
    location: 'Campus Gymnasium & Sports Complex',
    event_date: '2026-11-03',
    approximate_time: '18:45',
    image_url: '',
    distinguishing_features: 'Himalayan Trek sticker, small dent on lower metal rim.',
    reward_information: null,
    storage_location: null,
    status: 'active',
    created_at: '2026-11-03T19:00:00Z',
    updated_at: '2026-11-03T19:00:00Z'
  },
  {
    id: 'item-203',
    user_id: 'user-lalli',
    title: 'Sony WH-1000XM4 Noise Cancelling Headphones',
    description: 'Found resting on bench in Aryabhatta Lecture Hall Complex atrium next to hall LH-102.',
    category: 'Electronics',
    item_type: 'found',
    location: 'Aryabhatta Lecture Hall Complex LH-102',
    event_date: '2026-11-06',
    approximate_time: '09:15',
    image_url: '',
    distinguishing_features: 'Black zippered travel case containing gold plated audio adapter.',
    reward_information: null,
    storage_location: 'Proctor Office & Security Post 1',
    status: 'active',
    created_at: '2026-11-06T10:00:00Z',
    updated_at: '2026-11-06T10:00:00Z'
  },
  {
    id: 'item-104',
    user_id: 'user-maya',
    title: 'Texas Instruments TI-84 Plus Graphing Calculator',
    description: 'Forgotten in Ramanujan Block Room 204 after calculus recitation.',
    category: 'Electronics',
    item_type: 'lost',
    location: 'Ramanujan Tech Block Room 204',
    event_date: '2026-10-28',
    approximate_time: '11:00',
    image_url: '',
    distinguishing_features: 'Silver initials inscribed on inner side of slide cover.',
    reward_information: null,
    storage_location: null,
    status: 'recovered',
    created_at: '2026-10-28T12:00:00Z',
    updated_at: '2026-10-30T16:00:00Z'
  }
];

export const INITIAL_MATCHES = [
  {
    id: 'match-301',
    lost_item_id: 'item-101',
    found_item_id: 'item-201',
    score: 93.0,
    explanation: 'High confidence match: Exact category match (Electronics, +25pts), strongly similar title ("MacBook Pro", +28.5pts), exact location match (Central Library 2nd floor, +20pts), same reporting date (+15pts), and aligned protective case descriptions (+4.5pts).',
    matched_attributes: {
      category: 25,
      name: 28.5,
      location: 20,
      date: 15,
      description: 4.5
    },
    status: 'suggested',
    created_at: '2026-11-04T17:35:00Z'
  },
  {
    id: 'match-302',
    lost_item_id: 'item-102',
    found_item_id: 'item-202',
    score: 95.5,
    explanation: 'High confidence match: Exact category match (ID Cards, +25pts), identical key phrases ("Student ID Card / Lanyard", +29pts), contiguous location (Student Activity Centre SAC, +19.5pts), exact same calendar date (+15pts), and matching navy lanyard description (+7pts).',
    matched_attributes: {
      category: 25,
      name: 29,
      location: 19.5,
      date: 15,
      description: 7
    },
    status: 'suggested',
    created_at: '2026-11-05T13:35:00Z'
  }
];

export const INITIAL_CLAIMS = [
  {
    id: 'claim-401',
    item_id: 'item-201',
    claimant_id: 'user-lalli',
    proof_description: 'I can provide the serial number from my Apple invoice (C02G...); the laptop lockscreen has a wallpaper of Ladakh valley and my user profile name is "lalli_cs".',
    private_verification_details: 'Serial: C02GQ184MD6R, Admin login name: lalli_cs, Password hint mentions CS204 lab assignment.',
    status: 'under_review',
    reviewer_id: 'user-maya',
    review_note: 'Details match the laptop lockscreen info. Physical verification arranged at Central Library circulation desk.',
    handover_date: null,
    handover_location: 'Central Library Circulation Desk',
    created_at: '2026-11-04T18:00:00Z',
    updated_at: '2026-11-05T09:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-501',
    user_id: 'user-lalli',
    title: 'Potential Match Discovered! (93%)',
    message: 'Retrivo Matching Engine found a 93% match for your lost Space Gray MacBook Pro 14" at Central Library.',
    notification_type: 'match_found',
    related_item_id: 'item-201',
    related_claim_id: null,
    is_read: false,
    created_at: '2026-11-04T17:35:00Z'
  },
  {
    id: 'notif-502',
    user_id: 'user-maya',
    title: 'New Ownership Claim Submitted',
    message: 'Lalli submitted an ownership verification claim for Apple MacBook Pro.',
    notification_type: 'claim_received',
    related_item_id: 'item-201',
    related_claim_id: 'claim-401',
    is_read: true,
    created_at: '2026-11-04T18:00:00Z'
  },
  {
    id: 'notif-503',
    user_id: 'user-lalli',
    title: 'Claim Moved Under Review',
    message: 'Finder Maya Patel is reviewing your ownership proof for Apple MacBook Pro.',
    notification_type: 'claim_under_review',
    related_item_id: 'item-201',
    related_claim_id: 'claim-401',
    is_read: true,
    created_at: '2026-11-05T09:00:00Z'
  }
];

export const INITIAL_ACTIVITY = [
  {
    id: 'act-601',
    actor_id: 'user-lalli',
    action: 'item_reported_lost',
    entity_type: 'item',
    entity_id: 'item-101',
    metadata: { title: 'Space Gray MacBook Pro 14"', location: 'Central Library' },
    created_at: '2026-11-04T15:00:00Z'
  },
  {
    id: 'act-602',
    actor_id: 'user-maya',
    action: 'item_reported_found',
    entity_type: 'item',
    entity_id: 'item-201',
    metadata: { title: 'Apple MacBook Pro in Gray Protective Case', location: 'Central Library' },
    created_at: '2026-11-04T17:30:00Z'
  },
  {
    id: 'act-603',
    actor_id: 'system',
    action: 'smart_match_computed',
    entity_type: 'match',
    entity_id: 'match-301',
    metadata: { score: 93, lost_title: 'MacBook Pro', found_title: 'MacBook Pro' },
    created_at: '2026-11-04T17:35:00Z'
  },
  {
    id: 'act-604',
    actor_id: 'user-lalli',
    action: 'claim_submitted',
    entity_type: 'claim',
    entity_id: 'claim-401',
    metadata: { item_title: 'Apple MacBook Pro in Gray Protective Case' },
    created_at: '2026-11-04T18:00:00Z'
  }
];
