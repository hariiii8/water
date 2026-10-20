import { Language } from './types';

export interface Translations {
  appName: string;
  appTagline: string;
  welcome: string;
  subtitle: string;
  continueBtn: string;
  selectLanguage: string;
  
  // Auth
  loginHeading: string;
  loginSubtitle: string;
  selectRole: string;
  citizenRole: string;
  citizenRoleDesc: string;
  officerRole: string;
  officerRoleDesc: string;
  adminRole: string;
  adminRoleDesc: string;
  mobileOrEmail: string;
  password: string;
  forgotPassword: string;
  loginBtn: string;
  dontHaveAccount: string;
  registerNow: string;
  demoAccountHint: string;
  quickDemoLogin: string;
  
  // Register
  registerHeading: string;
  registerSubtitle: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  confirmPassword: string;
  address: string;
  areaLocality: string;
  wardZone: string;
  pincode: string;
  termsAgreement: string;
  createAccountBtn: string;
  alreadyHaveAccount: string;
  
  // Nav
  navHome: string;
  navComplaints: string;
  navMap: string;
  navMore: string;
  
  // Home
  hello: string;
  howCanWeHelp: string;
  cardWaterSupply: string;
  cardWaterSupplyDesc: string;
  cardWaterQuality: string;
  cardWaterQualityDesc: string;
  cardProblems: string;
  cardProblemsDesc: string;
  cardAnnouncements: string;
  cardAnnouncementsDesc: string;
  reportProblemBtn: string;
  recentComplaints: string;
  viewAll: string;
  importantAlerts: string;
  emergencyWaterAlert: string;
  emergencyPipeMsg: string;
  emergencyTapToViewMap: string;
  viewOnMap: string;
  
  // Report
  reportTitle: string;
  problemCategory: string;
  complaintTitle: string;
  problemDescription: string;
  locationAddress: string;
  ward: string;
  dateTime: string;
  uploadPhoto: string;
  captureGPS: string;
  gpsCaptured: string;
  urgencyLevel: string;
  submitComplaint: string;
  cancel: string;
  
  // Complaints List
  myComplaints: string;
  totalComplaints: string;
  pending: string;
  inProgress: string;
  resolved: string;
  rejected: string;
  viewDetails: string;
  trackingTimeline: string;
  officerNotes: string;
  
  // Map
  waterServiceMap: string;
  searchLocation: string;
  filterAll: string;
  supplyPoints: string;
  waterTanks: string;
  leakages: string;
  
  // Officer
  officerDashboard: string;
  assignedToYou: string;
  updateStatus: string;
  addProgressNote: string;
  markResolved: string;
  officerBadge: string;
  officerOnline: string;
  officerNeedToVisit: string;
  officerWorkingOnIt: string;
  officerFixed: string;
  officerAvgRating: string;
  officerFieldTasks: string;
  officerAllTasks: string;
  officerQuickUpdate: string;
  officerWhatHappening: string;
  officerWriteNote: string;
  officerSaveUpdate: string;
  officerLatestUpdate: string;
  officerCitizenRating: string;
  officerAllCaughtUp: string;
  officerNoTasks: string;
  officerCallerPhone: string;
  officerLocation: string;
  officerSensorDetected: string;
  officerFixingNowOption: string;
  officerFixedOption: string;
  officerCannotFixOption: string;
  officerCallCitizen: string;
  officerActionTaken: string;

  // Statuses
  statusSubmitted: string;
  statusAssigned: string;
  statusInProgress: string;
  statusResolved: string;
  statusRejected: string;

  // Common UI
  close: string;
  save: string;
  rateWaterOfficer: string;
  rateWaterOfficerDesc: string;
  
  // Admin
  adminDashboard: string;
  assignComplaint: string;
  publishAnnouncement: string;
  registeredUsers: string;
  
  // More
  notifications: string;
  myProfile: string;
  waterUpdates: string;
  helpSupport: string;
  faq: string;
  languageSettings: string;
  privacyPolicy: string;
  aboutAquaCare: string;
  logout: string;
  logoutConfirm: string;
  // Extra Report keys
  reportSubtitle: string;
  reportFormTag: string;
  tapToPickProblem: string;
  autoFillBadge: string;
  tapToPickDesc: string;
  clearBtn: string;
  fillManuallyBtn: string;
  fillApplicationHeading: string;
  autoFilledStatus: string;
  manualEntryStatus: string;
  formAutoFilledPrefix: string;
  formAutoFilledHint: string;
  voiceDictation: string;
  voiceListening: string;
  voiceTapToSpeak: string;
  speakBtn: string;
  stopBtn: string;
  appSubmittedSuccess: string;
  trackApplication: string;
  backToHome: string;
  waitingOfficerReview: string;
  officerAlertedMsg: string;

  // Extra Home keys
  waterSupplyStatusLabel: string;
  tanksFull: string;
  nextSupplyTime: string;
  reportCtaSubtitle: string;
  quickWaterServices: string;
  officialUpdates: string;
  onTimeToday: string;
  leaksFixingCount: string;
  noticesCount: string;
  waterQualitySensorBadge: string;
  emergencyPipeTitle: string;
  pipeSensorIdentified: string;
  workersOnSiteTime: string;
  liveOnMap: string;
  chooseLanguage: string;
  categories: Record<string, string>;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'AquaCare',
    appTagline: 'Easy Water Help for Your Home',
    welcome: 'Welcome to AquaCare',
    subtitle: 'Easy Water Help for Your Home',
    continueBtn: 'Continue',
    selectLanguage: 'Choose Your Language',

    // Auth
    loginHeading: 'Welcome Back!',
    loginSubtitle: 'Sign in to use AquaCare',
    selectRole: 'Who is using this app?',
    citizenRole: 'Public User (Citizen)',
    citizenRoleDesc: 'Report leaks and check your water supply',
    officerRole: 'Water Officer',
    officerRoleDesc: 'Check places and fix reported problems',
    adminRole: 'Manager (Admin)',
    adminRoleDesc: 'Assign work to officers and post news',
    mobileOrEmail: 'Phone Number or Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    loginBtn: 'Sign In',
    dontHaveAccount: 'New to AquaCare?',
    registerNow: 'Create Account',
    demoAccountHint: 'Tap below to test with a sample account:',
    quickDemoLogin: 'Quick Test Login',

    // Register
    registerHeading: 'Create Your Account',
    registerSubtitle: 'Sign up to report problems and get water news',
    fullName: 'Your Name',
    mobileNumber: 'Phone Number (10 digits)',
    emailAddress: 'Email (Optional)',
    confirmPassword: 'Type Password Again',
    address: 'House / Street Address',
    areaLocality: 'Area / Street Name',
    wardZone: 'Your Area / Ward',
    pincode: 'PIN Code',
    termsAgreement: 'I agree to the simple service rules',
    createAccountBtn: 'Sign Up',
    alreadyHaveAccount: 'Already have an account? Sign in',

    // Nav
    navHome: 'Home',
    navComplaints: 'My Complaints',
    navMap: 'Water Map',
    navMore: 'More',

    // Home
    hello: 'Hello',
    howCanWeHelp: 'How can we help you today?',
    cardWaterSupply: 'Water Timings',
    cardWaterSupplyDesc: 'Check morning and evening drinking water timings',
    cardWaterQuality: 'Water Cleanliness',
    cardWaterQualityDesc: 'Checked: Clean & safe for drinking',
    cardProblems: 'Active Leaks',
    cardProblemsDesc: 'See reported pipe leaks near you',
    cardAnnouncements: 'Water Notices',
    cardAnnouncementsDesc: 'Notices about water cuts and repair work',
    reportProblemBtn: 'Report a Water Problem',
    recentComplaints: 'Your Recent Complaints',
    viewAll: 'See All',
    importantAlerts: 'Important Water Notices',
    emergencyWaterAlert: 'Priority Water Alert',
    emergencyPipeMsg: 'A broken water pipe on Sector 4 Main Road was detected. Repair workers are on site fixing it now.',
    emergencyTapToViewMap: 'Tap to see exact spot on Map',
    viewOnMap: 'View on Map',

    // Report
    reportTitle: 'Report a Water Problem',
    problemCategory: 'What is the problem?',
    complaintTitle: 'Problem name (e.g. Broken pipe or leak)',
    problemDescription: 'Tell us what happened',
    locationAddress: 'Where is the problem? (Street / House / Landmark)',
    ward: 'Your Area',
    dateTime: 'When did you notice it?',
    uploadPhoto: 'Add a Photo (Optional)',
    captureGPS: 'Save My Location',
    gpsCaptured: 'Location Saved',
    urgencyLevel: 'How fast do you need help?',
    submitComplaint: 'Submit Complaint',
    cancel: 'Cancel',

    // Complaints List
    myComplaints: 'My Complaints',
    totalComplaints: 'All',
    pending: 'Registered',
    inProgress: 'Work in Progress',
    resolved: 'Problem Fixed',
    rejected: 'Closed',
    viewDetails: 'See Details',
    trackingTimeline: 'Current Status',
    officerNotes: 'Note from Lineman',

    // Map
    waterServiceMap: 'Water Map',
    searchLocation: 'Search street, area or tank...',
    filterAll: 'All',
    supplyPoints: 'Pumping Stations',
    waterTanks: 'Water Tanks',
    leakages: 'Broken Pipes',

    // Officer
    officerDashboard: 'Officer Duty Desk',
    assignedToYou: 'Assigned Complaints',
    updateStatus: 'Update Status',
    addProgressNote: 'Add Field Note',
    markResolved: 'Mark as Fixed',
    officerBadge: 'Water Lineman / Officer',
    officerOnline: 'Available on Duty',
    officerNeedToVisit: 'Need to Visit',
    officerWorkingOnIt: 'Working on It',
    officerFixed: 'Fixed & Cleared',
    officerAvgRating: 'Citizen Rating',
    officerFieldTasks: 'Assigned Field Complaints',
    officerAllTasks: 'All Tasks',
    officerQuickUpdate: 'Quick Update',
    officerWhatHappening: 'What is happening now?',
    officerWriteNote: 'Write a note for citizen *',
    officerSaveUpdate: 'Save Update',
    officerLatestUpdate: 'Latest Update from Lineman',
    officerCitizenRating: 'Citizen Rating',
    officerAllCaughtUp: 'All caught up!',
    officerNoTasks: 'No pending complaints in this category.',
    officerCallerPhone: 'Citizen Phone',
    officerLocation: 'Problem Location',
    officerSensorDetected: 'Sensor Detected',
    officerFixingNowOption: 'Fixing Now (Workers on the spot)',
    officerFixedOption: 'Fixed (Work is completed & water restored)',
    officerCannotFixOption: 'Not Possible (Closed / False report)',
    officerCallCitizen: 'Call Citizen',
    officerActionTaken: 'Action Taken',

    // Statuses
    statusSubmitted: 'Registered',
    statusAssigned: 'Lineman Assigned',
    statusInProgress: 'Work in Progress',
    statusResolved: 'Problem Fixed',
    statusRejected: 'Closed',

    // Common UI
    close: 'Close',
    save: 'Save',
    rateWaterOfficer: 'Rate Water Lineman',
    rateWaterOfficerDesc: 'Rate the lineman for checked and repaired work',

    // Admin
    adminDashboard: 'Manager Office',
    assignComplaint: 'Give to Officer',
    publishAnnouncement: 'Post Water News',
    registeredUsers: 'People & Officers',

    // More
    notifications: 'Messages & Alerts',
    myProfile: 'My Profile',
    waterUpdates: 'Water Timetable',
    helpSupport: 'How to Use This App',
    faq: 'Common Questions',
    languageSettings: 'Change Language',
    privacyPolicy: 'Privacy Rules',
    aboutAquaCare: 'About AquaCare',
    logout: 'Log Out',
    logoutConfirm: 'Do you want to log out of AquaCare?',

    // Extra Report
    reportSubtitle: 'Fill the details below or choose a common problem:',
    reportFormTag: 'Water Form',
    tapToPickProblem: 'Choose Common Problem:',
    autoFillBadge: 'Quick Pick',
    tapToPickDesc: 'Tap any common problem below to quickly fill details, or write details below.',
    clearBtn: 'Clear',
    fillManuallyBtn: 'Type Manually',
    fillApplicationHeading: 'Complaint Details',
    autoFilledStatus: 'Selected Problem (You can edit)',
    manualEntryStatus: 'Manual Typing Mode',
    formAutoFilledPrefix: 'Selected Problem:',
    formAutoFilledHint: 'You can change any details below or submit directly.',
    voiceDictation: 'Speak Your Problem (Voice Note)',
    voiceListening: 'Listening now... speak clearly',
    voiceTapToSpeak: 'Tap to speak your water problem',
    speakBtn: 'Speak',
    stopBtn: 'Stop',
    appSubmittedSuccess: 'Complaint Submitted Successfully!',
    trackApplication: 'Track My Complaint',
    backToHome: 'Back to Home',
    waitingOfficerReview: 'Waiting for Lineman Visit',
    officerAlertedMsg: 'The local water lineman has been notified and will inspect the site today.',

    // Extra Home
    waterSupplyStatusLabel: 'Water Supply:',
    tanksFull: 'Normal (Tanks Full)',
    nextSupplyTime: 'Next Supply: 5:00 PM - 7:30 PM',
    reportCtaSubtitle: 'Report pipe leaks, dirty water, or no supply to get it fixed',
    quickWaterServices: 'Quick Water Services',
    officialUpdates: 'Official Updates',
    onTimeToday: 'On time today',
    leaksFixingCount: '2 leaks being fixed',
    noticesCount: '3 notices posted',
    waterQualitySensorBadge: 'Sensor: pH 7.2 • TDS 210 ppm',
    emergencyPipeTitle: 'Broken Water Pipe on Sector 4 Main Road',
    pipeSensorIdentified: 'Identified by Pipe Pressure Sensor',
    workersOnSiteTime: 'Workers on site • Time left: ~1 hour',
    liveOnMap: 'Live on Map',
    chooseLanguage: 'Choose Language',
    categories: {
      'Water Leakage': 'Water Leakage',
      'No Water': 'No Water',
      'Dirty Water': 'Dirty Water',
      'Slow Water Flow': 'Slow Water Flow',
      'Broken Tap': 'Broken Tap',
      'Bad Smell or Taste': 'Bad Smell or Taste',
      'Broken Pipe': 'Broken Pipe',
      'Other Problem': 'Other Problem'
    }
  },
  ta: {
    appName: 'AquaCare',
    appTagline: 'எளிய குடிநீர் சேவை உங்கள் கையில்',
    welcome: 'அக்வாகேர்-க்கு நல்வரவு',
    subtitle: 'எளிய குடிநீர் சேவை உங்கள் கையில்',
    continueBtn: 'தொடரவும்',
    selectLanguage: 'மொழியைத் தேர்வு செய்க',

    // Auth
    loginHeading: 'மீண்டும் நல்வரவு!',
    loginSubtitle: 'தொடர உள்நுழையவும்',
    selectRole: 'நீங்கள் யார்?',
    citizenRole: 'பொது மக்கள்',
    citizenRoleDesc: 'புகார் தெரிவிக்க மற்றும் நிலையை பார்க்க',
    officerRole: 'குடிநீர் அதிகாரி',
    officerRoleDesc: 'சிக்கல்களை சரிசெய்யும் பணிக்கு',
    adminRole: 'மேலாளர் (அட்மின்)',
    adminRoleDesc: 'பணிகளை ஒதுக்க மற்றும் அறிவிப்பு வெளியிட',
    mobileOrEmail: 'மொபைல் எண் அல்லது மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    loginBtn: 'உள்நுழையவும்',
    dontHaveAccount: 'புதியவரா?',
    registerNow: 'கணக்கு தொடங்க',
    demoAccountHint: 'சோதனை செய்ய கீழே தொடவும்:',
    quickDemoLogin: 'எளிய மாதிரி உள்நுழைவு',

    // Register
    registerHeading: 'புதிய கணக்கு தொடங்க',
    registerSubtitle: 'குடிநீர் சேவைகளுக்காக பதிவு செய்க',
    fullName: 'உங்கள் பெயர்',
    mobileNumber: 'மொபைல் எண் (10 இலக்கம்)',
    emailAddress: 'மின்னஞ்சல் (விருப்பமிருந்தால்)',
    confirmPassword: 'கடவுச்சொல்லை மீண்டும் எழுதவும்',
    address: 'வீட்டு முகவரி',
    areaLocality: 'தெரு / பகுதி',
    wardZone: 'வார்டு / பகுதி எண்',
    pincode: 'அஞ்சல் குறியீடு (Pincode)',
    termsAgreement: 'விதிமுறைகளை ஒப்புக்கொள்கிறேன்',
    createAccountBtn: 'கணக்கு தொடங்க',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்',

    // Nav
    navHome: 'முகப்பு',
    navComplaints: 'என் புகார்கள்',
    navMap: 'வரைபடம்',
    navMore: 'கூடுதல்',

    // Home
    hello: 'வணக்கம்',
    howCanWeHelp: 'உங்களுக்கு என்ன உதவி வேண்டும்?',
    cardWaterSupply: 'குடிநீர் நேரம்',
    cardWaterSupplyDesc: 'குடிநீர் வரும் நேரத்தை பார்க்க',
    cardWaterQuality: 'நீர் சென்சார் அளவீடு',
    cardWaterQualityDesc: 'நேரடி சென்சார்: pH 7.2 • TDS 182 ppm • தூய்மை',
    cardProblems: 'குடிநீர் கசிவு',
    cardProblemsDesc: 'உங்கள் அருகில் உள்ள குழாய் கசிவுகள்',
    cardAnnouncements: 'குடிநீர் செய்தி',
    cardAnnouncementsDesc: 'தண்ணீர் நிறுத்தம் மற்றும் சீரமைப்பு தகவல்',
    reportProblemBtn: 'குடிநீர் புகார் பதிவு செய்க',
    recentComplaints: 'உங்கள் சமீபத்திய புகார்கள்',
    viewAll: 'அனைத்தும்',
    importantAlerts: 'முக்கிய குடிநீர் செய்தி',
    emergencyWaterAlert: 'சென்சார் மூலம் கண்டறியப்பட்ட அறிவிப்பு (Sensor Alert)',
    emergencyPipeMsg: 'Alert Message: It is identified by sensor - பிரஷர் சென்சார் மூலம் கண்டறியப்பட்ட செக்டர் 4 மெயின் ரோடு உடைந்த குழாயை ஊழியர்கள் இப்போது சரிசெய்து வருகின்றனர்.',
    emergencyTapToViewMap: 'வரைபடத்தில் பார்க்கவும்',
    viewOnMap: 'வரைபடத்தில் பார்க்க',

    // Report
    reportTitle: 'குடிநீர் பிரச்சனை பதிவு',
    problemCategory: 'என்ன பிரச்சனை?',
    complaintTitle: 'சுருக்கமான பெயர் (எ.கா: உடைந்த குழாய்)',
    problemDescription: 'என்ன நடந்தது என்று சொல்லுங்கள்',
    locationAddress: 'எந்த இடம்? (தெரு / வீடு)',
    ward: 'உங்கள் பகுதி',
    dateTime: 'எப்போது பார்த்தீர்கள்?',
    uploadPhoto: 'புகைப்படம் சேர்க்க (தேவைப்பட்டால்)',
    captureGPS: 'என் இடத்தை சேமிக்க',
    gpsCaptured: 'இடம் சேமிக்கப்பட்டது',
    urgencyLevel: 'எவ்வளவு சீக்கிரம் வேண்டும்?',
    submitComplaint: 'புகார் அனுப்பவும்',
    cancel: 'ரத்து',

    // Complaints List
    myComplaints: 'என் புகார்கள்',
    totalComplaints: 'மொத்தம்',
    pending: 'காத்திருப்பு',
    inProgress: 'சரிசெய்கிறார்கள்',
    resolved: 'சரிசெய்தாச்சு',
    rejected: 'முடியாது',
    viewDetails: 'விவரம் பார்க்க',
    trackingTimeline: 'நடவடிக்கை',
    officerNotes: 'அதிகாரியின் குறிப்பு',

    // Map
    waterServiceMap: 'குடிநீர் வரைபடம்',
    searchLocation: 'தெரு அல்லது தொட்டியை தேட...',
    filterAll: 'அனைத்தும்',
    supplyPoints: 'பம்ப் நிலையங்கள்',
    waterTanks: 'நீர் தொட்டிகள்',
    leakages: 'உடைந்த குழாய்கள்',

    // Officer
    officerDashboard: 'கள அதிகாரி பணி மேசை',
    assignedToYou: 'களப் பணிகள் மற்றும் ஆய்வுகள்',
    updateStatus: 'நிலையை மாற்றுக',
    addProgressNote: 'களக் குறிப்பு சேர்க்க',
    markResolved: 'சரிசெய்ததாக குறிக்கவும்',
    officerBadge: 'கள அதிகாரி',
    officerOnline: 'பணியில் உள்ளார் • தயார் நிலை',
    officerNeedToVisit: 'பார்வையிட வேண்டும்',
    officerWorkingOnIt: 'சரிசெய்கிறார்கள்',
    officerFixed: 'சரிசெய்தாச்சு',
    officerAvgRating: 'மக்கள் மதிப்பீடு',
    officerFieldTasks: 'ஒதுக்கப்பட்ட களப் புகார்கள்',
    officerAllTasks: 'அனைத்து பணிகள்',
    officerQuickUpdate: 'உடனடி புதுப்பிப்பு',
    officerWhatHappening: 'தற்போதைய நிலை என்ன?',
    officerWriteNote: 'களக் குறிப்பை எழுதவும் *',
    officerSaveUpdate: 'நிலையைச் சேமிக்கவும்',
    officerLatestUpdate: 'கடைசி களக் குறிப்பு',
    officerCitizenRating: 'குடிமக்கள் மதிப்பீடு',
    officerAllCaughtUp: 'அனைத்து பணிகளும் முடிக்கப்பட்டன!',
    officerNoTasks: 'இப்பிரிவில் நிலுவையில் உள்ள பணிகள் எதுவும் இல்லை.',
    officerCallerPhone: 'குடிமக்கள் தொடர்பு',
    officerLocation: 'பிரச்சனை உள்ள இடம்',
    officerSensorDetected: 'சென்சார் மூலம் கண்டறியப்பட்டது',
    officerFixingNowOption: 'சரிசெய்கிறார்கள் (ஊழியர்கள் களத்தில் உள்ளனர்)',
    officerFixedOption: 'சரிசெய்தாச்சு (பணி முடிந்தது)',
    officerCannotFixOption: 'முடியாது (சரிசெய்ய இயலாது)',
    officerCallCitizen: 'அழைக்கவும்',
    officerActionTaken: 'நடவடிக்கை எடுக்கப்பட்டது',

    // Statuses
    statusSubmitted: 'பதிவு செய்யப்பட்டது',
    statusAssigned: 'ஒதுக்கப்பட்டது',
    statusInProgress: 'சரிசெய்கிறார்கள்',
    statusResolved: 'சரிசெய்தாச்சு',
    statusRejected: 'நிராகரிக்கப்பட்டது',

    // Common UI
    close: 'மூடு',
    save: 'சேமிக்க',
    rateWaterOfficer: 'அதிகாரியை மதிப்பிடவும்',
    rateWaterOfficerDesc: 'சரிசெய்யப்பட்ட பணிகளுக்கு அதிகாரியை மதிப்பிடவும்',

    // Admin
    adminDashboard: 'நிர்வாக அலுவலகம்',
    assignComplaint: 'அதிகாரிக்கு ஒதுக்க',
    publishAnnouncement: 'செய்தி வெளியிட',
    registeredUsers: 'பொதுமக்கள் & அதிகாரிகள்',

    // More
    notifications: 'தகவல் மற்றும் செய்திகள்',
    myProfile: 'என் கணக்கு விவரம்',
    waterUpdates: 'குடிநீர் அட்டவணை',
    helpSupport: 'பயன்படுத்துவது எப்படி?',
    faq: 'கேள்வி - பதில்',
    languageSettings: 'மொழி மாற்ற',
    privacyPolicy: 'தனியுரிமை விதிகள்',
    aboutAquaCare: 'அக்வாகேர் பற்றி',
    logout: 'வெளியேறு',
    logoutConfirm: 'வெளியேற விரும்புகிறீர்களா?',

    // Extra Report
    reportSubtitle: 'விண்ணப்பத்தை நீங்களே பூர்த்தி செய்யலாம், அல்லது உடனே தானாக நிரப்ப கீழே தொடவும்',
    reportFormTag: 'பொதுமக்கள் விண்ணப்பம்',
    tapToPickProblem: 'பிரச்சனையை தேர்வு செய்ய தொடவும்:',
    autoFillBadge: 'தானியங்கி நிரப்புதல்',
    tapToPickDesc: 'கீழே உள்ள ஏதேனும் ஒரு பிரச்சனையை தொட்டு தானாக நிரப்பவும், அல்லது கீழே விவரங்களை எழுதவும்.',
    clearBtn: 'அழிக்க',
    fillManuallyBtn: 'நீங்களே எழுத',
    fillApplicationHeading: 'புகார் விண்ணப்பத்தை நிரப்புக',
    autoFilledStatus: 'தானாக நிரப்பப்பட்டது (மாற்றிக்கொள்ளலாம்)',
    manualEntryStatus: 'கைமுறை உள்ளீடு நிலை',
    formAutoFilledPrefix: 'விண்ணப்பம் தானாக நிரப்பப்பட்டது:',
    formAutoFilledHint: 'கீழே உள்ள எந்த புலத்தையும் மாற்றலாம் அல்லது நேரடியாக அனுப்பலாம்.',
    voiceDictation: 'குரல் பதிவு (விரும்பினால்)',
    voiceListening: 'கேட்கிறது... தெளிவாகப் பேசுங்கள்',
    voiceTapToSpeak: 'பேசி விவரிக்க தொடவும்',
    speakBtn: 'பேசுக',
    stopBtn: 'நிறுத்து',
    appSubmittedSuccess: 'விண்ணப்பம் வெற்றிகரமாக அனுப்பப்பட்டது!',
    trackApplication: 'என் விண்ணப்பத்தை கண்காணிக்க',
    backToHome: 'முகப்புக்குச் செல்க',
    waitingOfficerReview: 'அதிகாரியின் பார்வைக்காக காத்திருக்கிறது',
    officerAlertedMsg: 'உள்ளூர் நகராட்சி குடிநீர் குழுவுக்கு தகவல் அனுப்பப்பட்டுள்ளது. இதன் நிலையை என் புகார்கள் பக்கத்தில் பார்க்கலாம்.',

    // Extra Home
    waterSupplyStatusLabel: 'குடிநீர் விநியோகம்:',
    tanksFull: 'வழக்கமான நிலை (தொட்டி முழுமை)',
    nextSupplyTime: 'அடுத்த விநியோகம்: மாலை 5:00 - 7:30',
    reportCtaSubtitle: 'விண்ணப்பத்தை நீங்களே பூர்த்தி செய்க அல்லது தொட்டு தானாக நிரப்புக',
    quickWaterServices: 'விரைவு குடிநீர் சேவைகள்',
    officialUpdates: 'அதிகாரப்பூர்வ தகவல்கள்',
    onTimeToday: 'இன்று சரியான நேரத்தில்',
    leaksFixingCount: '2 கசிவுகள் சரிசெய்யப்படுகின்றன',
    noticesCount: '3 அறிவிப்புகள் உள்ளன',
    waterQualitySensorBadge: 'சென்சார்: pH 7.2 • TDS 210 ppm',
    emergencyPipeTitle: 'செக்டர் 4 மெயின் ரோட்டில் உடைந்த குடிநீர் குழாய்',
    pipeSensorIdentified: 'அழுத்த சென்சார் மூலம் கண்டறியப்பட்டது',
    workersOnSiteTime: 'ஊழியர்கள் பணியில் உள்ளனர் • எஞ்சிய நேரம்: ~1 மணி',
    liveOnMap: 'வரைபடத்தில் பார்க்க',
    chooseLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    categories: {
      'Water Leakage': 'குடிநீர் கசிவு',
      'No Water': 'தண்ணீர் வரவில்லை',
      'Dirty Water': 'அழுக்கு நீர்',
      'Slow Water Flow': 'குறைந்த நீர் அழுத்தம்',
      'Broken Tap': 'உடைந்த குழாய்',
      'Bad Smell or Taste': 'துர்நாற்றம் / சுவை மாற்றம்',
      'Broken Pipe': 'உடைந்த பிரதான குழாய்',
      'Other Problem': 'பிற பிரச்சனைகள்'
    }
  },
  hi: {
    appName: 'AquaCare',
    appTagline: 'घर के लिए आसान जल सेवा',
    welcome: 'एक्वाकेयर में आपका स्वागत है',
    subtitle: 'घर के लिए आसान जल सेवा',
    continueBtn: 'आगे बढ़ें',
    selectLanguage: 'अपनी भाषा चुनें',

    // Auth
    loginHeading: 'स्वागत है!',
    loginSubtitle: 'जारी रखने के लिए लॉगिन करें',
    selectRole: 'आप कौन हैं?',
    citizenRole: 'आम नागरिक',
    citizenRoleDesc: 'समस्या दर्ज करें और जल सेवा देखें',
    officerRole: 'जल अधिकारी',
    officerRoleDesc: 'समस्याओं की जांच करें और ठीक करें',
    adminRole: 'प्रबंधक (एडमिन)',
    adminRoleDesc: 'कार्य सौंपें और सूचना जारी करें',
    mobileOrEmail: 'फ़ोन नंबर या ईमेल',
    password: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    loginBtn: 'लॉगिन करें',
    dontHaveAccount: 'नए हैं?',
    registerNow: 'नया खाता बनाएं',
    demoAccountHint: 'परीक्षण हेतु नीचे टैप करें:',
    quickDemoLogin: 'त्वरित टेस्ट लॉगिन',

    // Register
    registerHeading: 'नया खाता बनाएं',
    registerSubtitle: 'जल समस्याओं की शिकायत दर्ज करने के लिए जुड़ें',
    fullName: 'आपका नाम',
    mobileNumber: 'फ़ोन नंबर (10 अंक)',
    emailAddress: 'ईमेल (वैकल्पिक)',
    confirmPassword: 'पासवर्ड दोबारा लिखें',
    address: 'मकान / गली का पता',
    areaLocality: 'मोहल्ला / सड़क का नाम',
    wardZone: 'आपका वार्ड या इलाका',
    pincode: 'पिन कोड',
    termsAgreement: 'मैं सरल नियमों से सहमत हूँ',
    createAccountBtn: 'खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है? लॉगिन करें',

    // Nav
    navHome: 'होम',
    navComplaints: 'शिकायतें',
    navMap: 'नक्शा',
    navMore: 'अधिक',

    // Home
    hello: 'नमस्ते',
    howCanWeHelp: 'आज हम आपकी क्या मदद कर सकते हैं?',
    cardWaterSupply: 'पानी का समय',
    cardWaterSupplyDesc: 'देखें पानी कब आता है',
    cardWaterQuality: 'जल सेंसर वैल्यू',
    cardWaterQualityDesc: 'लाइव IoT सेंसर: pH 7.2 • TDS 182 ppm • सुरक्षित',
    cardProblems: 'पाइप लीकेज',
    cardProblemsDesc: 'आस-पास टूटे हुए पाइप और लीकेज',
    cardAnnouncements: 'जल समाचार',
    cardAnnouncementsDesc: 'पानी की कटौती और मरम्मत की सूचना',
    reportProblemBtn: 'जल समस्या दर्ज करें',
    recentComplaints: 'आपकी शिकायतें',
    viewAll: 'सभी देखें',
    importantAlerts: 'ज़रूरी जल सूचना',
    emergencyWaterAlert: 'सेंसर द्वारा पहचानी गई सूचना (Sensor Alert)',
    emergencyPipeMsg: 'Alert Message: It is identified by sensor - सेक्टर 4 मेन रोड पर टूटा पाइप प्रेशर सेंसर द्वारा पहचाना गया। मरम्मत दल मौके पर इसे ठीक कर रहा है।',
    emergencyTapToViewMap: 'नक्शे पर सटीक जगह देखें',
    viewOnMap: 'नक्शे पर देखें',

    // Report
    reportTitle: 'पानी की समस्या बताएं',
    problemCategory: 'क्या समस्या है?',
    complaintTitle: 'समस्या का नाम (जैसे: टूटा पाइप)',
    problemDescription: 'बताएं क्या हुआ',
    locationAddress: 'कहाँ है? (सड़क या मकान)',
    ward: 'आपका इलाका',
    dateTime: 'कब देखा?',
    uploadPhoto: 'फ़ोटो जोड़ें (यदि हो तो)',
    captureGPS: 'मेरी लोकेशन जोड़ें',
    gpsCaptured: 'लोकेशन जुड़ गई',
    urgencyLevel: 'कितनी जल्दी मदद चाहिए?',
    submitComplaint: 'शिकायत भेजें',
    cancel: 'रद्द',

    // Complaints List
    myComplaints: 'मेरी शिकायतें',
    totalComplaints: 'कुल',
    pending: 'प्रतीक्षा में',
    inProgress: 'काम जारी है',
    resolved: 'ठीक हो गया',
    rejected: 'रद्द',
    viewDetails: 'विवरण देखें',
    trackingTimeline: 'काम की प्रगति',
    officerNotes: 'अधिकारी की बात',

    // Map
    waterServiceMap: 'पानी का नक्शा',
    searchLocation: 'सड़क, टंकी या इलाका खोजें...',
    filterAll: 'सभी',
    supplyPoints: 'पंपिंग केंद्र',
    waterTanks: 'पानी की टंकियां',
    leakages: 'टूटे पाइप / लीकेज',

    // Officer
    officerDashboard: 'फील्ड अधिकारी कमान',
    assignedToYou: 'फील्ड कार्य व निरीक्षण',
    updateStatus: 'स्थिति अपडेट करें',
    addProgressNote: 'फील्ड नोट जोड़ें',
    markResolved: 'ठीक हो गया मार्क करें',
    officerBadge: 'फील्ड अधिकारी',
    officerOnline: 'ड्यूटी पर तैनात • सक्रिय',
    officerNeedToVisit: 'दौरा करना है',
    officerWorkingOnIt: 'कार्य जारी है',
    officerFixed: 'समस्या हल हुई',
    officerAvgRating: 'नागरिक रेटिंग',
    officerFieldTasks: 'आवंटित फील्ड शिकायतें',
    officerAllTasks: 'सभी कार्य',
    officerQuickUpdate: 'त्वरित अपडेट',
    officerWhatHappening: 'वर्तमान स्थिति क्या है?',
    officerWriteNote: 'फील्ड नोट लिखें *',
    officerSaveUpdate: 'अपडेट सहेजें',
    officerLatestUpdate: 'नवीनतम फील्ड नोट',
    officerCitizenRating: 'नागरिक रेटिंग एवं समीक्षा',
    officerAllCaughtUp: 'सभी कार्य पूरे हो चुके हैं!',
    officerNoTasks: 'इस श्रेणी में फिलहाल कोई लंबित कार्य नहीं है।',
    officerCallerPhone: 'नागरिक संपर्क',
    officerLocation: 'घटना स्थल',
    officerSensorDetected: 'IoT सेंसर द्वारा अलर्ट',
    officerFixingNowOption: 'कार्य जारी है (कर्मचारी मौके पर हैं)',
    officerFixedOption: 'ठीक हो गया (कार्य पूर्ण एवं सामान्य)',
    officerCannotFixOption: 'संभव नहीं (अमान्य या हल नहीं हो सकता)',
    officerCallCitizen: 'कॉल करें',
    officerActionTaken: 'की गई कार्रवाई',

    // Statuses
    statusSubmitted: 'दर्ज किया गया',
    statusAssigned: 'सौंपा गया',
    statusInProgress: 'कार्य जारी',
    statusResolved: 'ठीक हुआ',
    statusRejected: 'अस्वीकृत',

    // Common UI
    close: 'बंद करें',
    save: 'सहेजें',
    rateWaterOfficer: 'जल अधिकारी का मूल्यांकन करें',
    rateWaterOfficerDesc: 'जांची और ठीक की गई समस्याओं के लिए अधिकारी को रेट करें',

    // Admin
    adminDashboard: 'प्रबंधक कार्यालय',
    assignComplaint: 'अधिकारी को सौंपें',
    publishAnnouncement: 'सूचना जारी करें',
    registeredUsers: 'नागरिक व अधिकारी',

    // More
    notifications: 'संदेश और सूचनाएं',
    myProfile: 'मेरी प्रोफाइल',
    waterUpdates: 'पानी का समय-सारणी',
    helpSupport: 'ऐप कैसे चलाएं?',
    faq: 'अक्सर पूछे जाने वाले सवाल',
    languageSettings: 'भाषा बदलें',
    privacyPolicy: 'सरल नियम',
    aboutAquaCare: 'एक्वाकेयर के बारे में',
    logout: 'लॉग आउट',
    logoutConfirm: 'क्या आप लॉग आउट करना चाहते हैं?',

    // Extra Report
    reportSubtitle: 'आवेदन स्वयं भरें, या तुरंत ऑटो-फिल करने के लिए नीचे टैप करें',
    reportFormTag: 'नागरिक आवेदन पत्र',
    tapToPickProblem: 'समस्या चुनने के लिए टैप करें:',
    autoFillBadge: 'ऑटो-फिल',
    tapToPickDesc: 'आवेदन में विवरण स्वतः भरने के लिए नीचे किसी समस्या पर टैप करें, या नीचे स्वयं भरें।',
    clearBtn: 'हटाएं',
    fillManuallyBtn: 'स्वयं भरें',
    fillApplicationHeading: 'शिकायत आवेदन पत्र भरें',
    autoFilledStatus: 'स्वतः भरा गया (संपादनीय)',
    manualEntryStatus: 'मैन्युअल प्रविष्टि मोड',
    formAutoFilledPrefix: 'आवेदन स्वतः भरा गया:',
    formAutoFilledHint: 'आप नीचे किसी भी विवरण को बदल सकते हैं या सीधे सबमिट कर सकते हैं।',
    voiceDictation: 'आवाज से बोलें (वैकल्पिक)',
    voiceListening: 'सुन रहे हैं... स्पष्ट बोलें',
    voiceTapToSpeak: 'समस्या का विवरण बोलने के लिए टैप करें',
    speakBtn: 'बोलें',
    stopBtn: 'रोकें',
    appSubmittedSuccess: 'आवेदन सफलतापूर्वक दर्ज हो गया!',
    trackApplication: 'मेरा आवेदन ट्रैक करें',
    backToHome: 'होम पर जाएं',
    waitingOfficerReview: 'अधिकारी की समीक्षा की प्रतीक्षा',
    officerAlertedMsg: 'स्थानीय नगर जल विभाग को सूचित कर दिया गया है। आप इसे मेरी शिकायतें में ट्रैक कर सकते हैं।',

    // Extra Home
    waterSupplyStatusLabel: 'जल आपूर्ति:',
    tanksFull: 'सामान्य (टंकियां भरी हैं)',
    nextSupplyTime: 'अगली आपूर्ति: शाम 5:00 - 7:30',
    reportCtaSubtitle: 'आवेदन स्वयं भरें या सामान्य जल समस्याओं को तुरंत ऑटो-फिल करें',
    quickWaterServices: 'त्वरित जल सेवाएं',
    officialUpdates: 'आधिकारिक सूचनाएं',
    onTimeToday: 'आज निर्धारित समय पर',
    leaksFixingCount: '2 लीकेज ठीक किए जा रहे हैं',
    noticesCount: '3 नोटिस जारी',
    waterQualitySensorBadge: 'सेंसर: pH 7.2 • TDS 210 ppm',
    emergencyPipeTitle: 'सेक्टर 4 मेन रोड पर मुख्य जल पाइप क्षतिग्रस्त',
    pipeSensorIdentified: 'प्रेशर सेंसर द्वारा अलर्ट जारी',
    workersOnSiteTime: 'कर्मचारी मौके पर हैं • शेष समय: ~1 घंटा',
    liveOnMap: 'नक्शे पर देखें',
    chooseLanguage: 'भाषा चुनें',
    categories: {
      'Water Leakage': 'पानी का रिसाव (लीकेज)',
      'No Water': 'पानी नहीं आ रहा',
      'Dirty Water': 'गंदा / मटमैला पानी',
      'Slow Water Flow': 'धीमा पानी बहाव',
      'Broken Tap': 'टूटा हुआ नल',
      'Bad Smell or Taste': 'दुर्गंध या खराब स्वाद',
      'Broken Pipe': 'टूटा हुआ पाइप',
      'Other Problem': 'अन्य समस्याएं'
    }
  }
};

export interface LocalizedPresetProblem {
  category: string;
  shortLabel: string;
  tagline: string;
  title: string;
  description: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
}

export function getLocalizedPresets(lang: Language): LocalizedPresetProblem[] {
  if (lang === 'ta') {
    return [
      {
        category: 'Water Leakage',
        shortLabel: 'குழாய் கசிவு',
        tagline: 'தெருவில் குடிநீர் வீணாகிறது',
        title: 'தெருவில் உடைந்த குழாயிலிருந்து தண்ணீர் கசிகிறது',
        description: 'எங்கள் தெருவில் பிரதான குடிநீர் குழாய் உடைந்து நல்ல குடிநீர் பெருமளவில் வீணாக சாலையில் ஓடுகிறது. இதனால் மக்கள் பயன்பாட்டுக்கு தண்ணீர் தட்டுப்பாடு ஏற்படுகிறது. உடனே அதிகாரியை அனுப்பி சரிசெய்ய வேண்டுகிறேன்.',
        urgency: 'High'
      },
      {
        category: 'No Water',
        shortLabel: 'குடிநீர் வரவில்லை',
        tagline: 'இன்று குழாயில் தண்ணீர் வரவில்லை',
        title: 'இன்று எங்கள் பகுதியில் குழாயில் குடிநீர் வரவில்லை',
        description: 'வழக்கமான விநியோக நேரத்தில் இன்று எங்கள் தெரு குழாய்களில் குடிநீர் வரவில்லை. வீட்டில் குடிநீர் தொட்டி முழுமையாக காலியாக உள்ளது. அவசிய தேவைகளுக்காக குடிநீர் விநியோகத்தை உடனே வழங்கிட வேண்டுகிறேன்.',
        urgency: 'High'
      },
      {
        category: 'Dirty Water',
        shortLabel: 'அழுக்கு / சேற்று நீர்',
        tagline: 'மங்கலான சேற்று நீர் வருகிறது',
        title: 'குழாயில் சேறும் சகதியுமாக அழுக்கு நீர் வருகிறது',
        description: 'குழாயில் வரும் குடிநீர் பழுப்பு நிறத்தில் சேற்றுடன் கலங்கலாக வருகிறது. குடிப்பதற்கும் சமைப்பதற்கும் முற்றிலும் பாதுகாப்பற்ற நிலையில் உள்ளது. தயவுசெய்து குழாயை ஆய்வு செய்து தூய நீர் வர நடவடிக்கை எடுக்கவும்.',
        urgency: 'High'
      },
      {
        category: 'Slow Water Flow',
        shortLabel: 'குறைந்த நீர் அழுத்தம்',
        tagline: 'மிக மெதுவாக நீர் வருகிறது',
        title: 'குழாயில் மிக குறைந்த அழுத்தத்துடன் மெதுவாக நீர் வருகிறது',
        description: 'எங்கள் பகுதி குழாயில் தண்ணீர் மிக மெதுவாக சொட்டு சொட்டாக மட்டுமே வருகிறது. ஒரு வாளி நிரம்பவே அதிக நேரம் ஆகிறது. தண்ணீர் அழுத்த வால்வை சரிசெய்து போதுமான நீர் வரத்து ஏற்படுத்த வேண்டுகிறேன்.',
        urgency: 'Medium'
      },
      {
        category: 'Broken Tap',
        shortLabel: 'உடைந்த பொது குழாய்',
        tagline: 'தெரு பொது குழாய் உடைந்துள்ளது',
        title: 'தெரு பொது குடிநீர் குழாய் உடைந்து நிற்காமல் ஓடுகிறது',
        description: 'எங்கள் தெரு பொது குடிநீர் குழாயின் வால்வு உடைந்து நிற்காமல் தண்ணீர் தொடர்ந்து வீணாக வெளியேறி பாதையில் தேங்குகிறது. உடனே வால்வை மாற்றி பழுதுநீக்க வேண்டுகிறேன்.',
        urgency: 'Medium'
      },
      {
        category: 'Bad Smell or Taste',
        shortLabel: 'துர்நாற்றம் / சுவை மாற்றம்',
        tagline: 'கெட்ட வாடை அல்லது ரசாயன சுவை',
        title: 'குடிநீரில் கடுமையான துர்நாற்றமும் மாறுபட்ட சுவையும் உள்ளது',
        description: 'இன்று குடிநீரில் கடுமையான துர்நாற்றமும் விரும்பத்தகாத ரசாயன சுவையும் வருகிறது. கழிவுநீர் கலந்திருக்குமோ என்ற அச்சம் உள்ளது. உடனடியாக குடிநீர் மாதிரியை பரிசோதித்து நடவடிக்கை எடுக்க வேண்டுகிறேன்.',
        urgency: 'Emergency'
      }
    ];
  }

  if (lang === 'hi') {
    return [
      {
        category: 'Water Leakage',
        shortLabel: 'पाइप लीकेज',
        tagline: 'सड़क पर पानी बह रहा है',
        title: 'सड़क पर टूटे पाइप से पानी बह रहा है',
        description: 'सड़क पर मुख्य पेयजल पाइप टूट गया है और साफ पानी भारी मात्रा में बहकर बर्बाद हो रहा है। कृपया जल्द से जल्द मरम्मत दल भेजकर इसे ठीक करवाएं।',
        urgency: 'High'
      },
      {
        category: 'No Water',
        shortLabel: 'पानी नहीं आ रहा',
        tagline: 'आज नल में पानी नहीं आया',
        title: 'घर में नल से पीने का पानी नहीं आया',
        description: 'आज निर्धारित समय पर नल से नगर निगम का पानी नहीं आया। हमारे घर की पानी की टंकी खाली है और दैनिक कार्यों के लिए पानी नहीं है। कृपया जल्द जल आपूर्ति बहाल करें।',
        urgency: 'High'
      },
      {
        category: 'Dirty Water',
        shortLabel: 'गंदा / मटमैला पानी',
        tagline: 'पीने योग्य साफ पानी नहीं है',
        title: 'नल से गंदा और मटमैला पानी आ रहा है',
        description: 'नल से मटमैला, बदरंग और गंदा पानी निकल रहा है जो पीने और खाना बनाने योग्य बिल्कुल नहीं है। कृपया मुख्य पाइपलाइन की जांच करवाएं और स्वच्छ जल आपूर्ति सुनिश्चित करें।',
        urgency: 'High'
      },
      {
        category: 'Slow Water Flow',
        shortLabel: 'धीमा पानी बहाव',
        tagline: 'नल में बहुत कम प्रेशर है',
        title: 'नल में पानी का प्रेशर बहुत धीमा है',
        description: 'नल में पानी का प्रेशर बहुत ही कम है और पानी बहुत धीरे-धीरे आ रहा है। एक बाल्टी भरने में भी बहुत समय लगता है। कृपया प्रेशर वाल्व और वितरण लाइन की जांच करें।',
        urgency: 'Medium'
      },
      {
        category: 'Broken Tap',
        shortLabel: 'टूटा हुआ सार्वजनिक नल',
        tagline: 'सार्वजनिक नल टूट गया है',
        title: 'सड़क का सार्वजनिक नल टूट गया है और पानी बह रहा है',
        description: 'सड़क पर लगा सार्वजनिक पेयजल नल टूट गया है और लगातार पानी बह रहा है। कृपया नया वाल्व लगाकर इसे तुरंत ठीक करवाएं।',
        urgency: 'Medium'
      },
      {
        category: 'Bad Smell or Taste',
        shortLabel: 'दुर्गंध या खराब स्वाद',
        tagline: 'अजीब गंध या रसायनों का स्वाद',
        title: 'पीने के पानी से दुर्गंध और अजीब स्वाद आ रहा है',
        description: 'आज नल के पानी से बहुत तेज दुर्गंध और अजीब रासायनिक स्वाद आ रहा है। संदूषण का गंभीर खतरा है। कृपया तुरंत पानी की जांच करें और सुरक्षित आपूर्ति सुनिश्चित करें।',
        urgency: 'Emergency'
      }
    ];
  }

  // English (default)
  return [
    {
      category: 'Water Leakage',
      shortLabel: 'Water Pipe Leak',
      tagline: 'Water leaking on street or road',
      title: 'Water leaking from broken pipe on street',
      description: 'Water pipe is broken on the road and drinking water is leaking heavily. Water is getting wasted on the street. Please send a repair team or lineman to fix it quickly.',
      urgency: 'High'
    },
    {
      category: 'No Water',
      shortLabel: 'No Water Supply',
      tagline: 'No water received today',
      title: 'No water supply in house tap',
      description: 'No drinking water came from the tap today during supply hours. We have no water for basic household needs. Please restore water supply.',
      urgency: 'High'
    },
    {
      category: 'Dirty Water',
      shortLabel: 'Dirty / Muddy Water',
      tagline: 'Brown or dirty tap water',
      title: 'Tap water is brown and dirty',
      description: 'Tap water is coming out muddy and dirty with bad color. It is unsafe for drinking or cooking. Please inspect and clean the main water pipe.',
      urgency: 'High'
    },
    {
      category: 'Slow Water Flow',
      shortLabel: 'Slow Water Flow',
      tagline: 'Very slow water pressure',
      title: 'Water flow is very weak and slow',
      description: 'Water pressure in the tap is very weak. Water comes out very slowly and takes over an hour to fill a bucket. Please check pipe pressure.',
      urgency: 'Medium'
    },
    {
      category: 'Broken Tap',
      shortLabel: 'Broken Public Tap',
      tagline: 'Damaged street water tap',
      title: 'Public water tap is broken and leaking',
      description: 'Public street tap is damaged and running without stopping. Water is overflowing on the walkway. Please repair or replace the tap.',
      urgency: 'Medium'
    },
    {
      category: 'Bad Smell or Taste',
      shortLabel: 'Bad Smell or Taste',
      tagline: 'Unusual bad smell or taste',
      title: 'Tap water has bad smell and foul taste',
      description: 'Tap water has a bad smell and strange taste today. Please test the drinking water and check for any contamination quickly.',
      urgency: 'Emergency'
    }
  ];
}

export function getStatusTranslation(status: string, t: Translations): string {
  switch (status) {
    case 'Submitted':
      return t.statusSubmitted;
    case 'Assigned':
      return t.statusAssigned;
    case 'In Progress':
      return t.statusInProgress;
    case 'Resolved':
      return t.statusResolved;
    case 'Rejected':
      return t.statusRejected;
    default:
      return status;
  }
}
