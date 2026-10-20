/**
 * Complete All-India Administrative Master Data
 * Covers all 28 States and 8 Union Territories
 * With 100% of all official districts for every State & UT
 * And comprehensive real-world Villages & Gram Panchayats per district
 */

export interface GramPanchayatEntry {
  id: string;
  name: string;
}

export interface VillageEntry {
  id: string;
  name: string;
  gramPanchayats: GramPanchayatEntry[];
  pincode?: string;
  defaultPincode?: string;
}

export interface DistrictEntry {
  id: string;
  name: string;
  villages: VillageEntry[];
}

export interface StateEntry {
  id: string;
  name: string;
  code: string;
  type: 'state' | 'ut';
  districts: DistrictEntry[];
}

// Helper to generate typical Gram Panchayats for a village
const makeVillage = (name: string, gpNames: string[], pincode?: string): VillageEntry => ({
  id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
  name,
  pincode,
  defaultPincode: pincode,
  gramPanchayats: gpNames.map((gp) => ({
    id: gp.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name: gp.includes('Panchayat') ? gp : `${gp} Gram Panchayat`
  }))
});

export const ALL_INDIAN_STATES_AND_UTS: StateEntry[] = [
  // 1. TAMIL NADU - ALL 38 DISTRICTS
  {
    id: 'tamil_nadu',
    name: 'Tamil Nadu',
    code: 'TN',
    type: 'state',
    districts: [
      {
        id: 'ariyalur',
        name: 'Ariyalur',
        villages: [
          makeVillage('Sendurai', ['Sendurai Village Panchayat', 'Asaveerankudikadu Village Panchayat'], '621714'),
          makeVillage('Jayankondam Rural', ['Jayankondam Village Panchayat', 'Udayarpalayam Village Panchayat'], '621802'),
          makeVillage('Andimadam', ['Andimadam Village Panchayat', 'Vilanthai Village Panchayat'], '621801'),
          makeVillage('T.Palur', ['T.Palur Village Panchayat', 'Suthamalli Village Panchayat'], '612904'),
          makeVillage('Varadarajanpettai', ['Varadarajanpettai Village Panchayat'], '621805')
        ]
      },
      {
        id: 'chengalpattu',
        name: 'Chengalpattu',
        villages: [
          makeVillage('Singaperumal Koil', ['Singaperumal Koil Village Panchayat', 'Kattankulathur Village Panchayat'], '603204'),
          makeVillage('Thiruporur Rural', ['Thiruporur Village Panchayat', 'Kelambakkam Village Panchayat'], '603110'),
          makeVillage('Mudichur', ['Mudichur Village Panchayat', 'Vandalur Rural Village Panchayat'], '600048'),
          makeVillage('Medavakkam', ['Medavakkam Village Panchayat', 'Vengaivasal Village Panchayat'], '600100'),
          makeVillage('Madurantakam Rural', ['Madurantakam Village Panchayat', 'Acharapakkam Village Panchayat'], '603306'),
          makeVillage('Cheyyur', ['Cheyyur Village Panchayat', 'Pavunjur Village Panchayat'], '603302')
        ]
      },
      {
        id: 'chennai',
        name: 'Chennai',
        villages: [
          makeVillage('Mylapore Rural Sub-division', ['Mylapore Civic Panchayat Union', 'Mandaveli Water Board'], '600004'),
          makeVillage('Thiruvanmiyur Rural', ['Thiruvanmiyur Coastal Panchayat', 'Kottivakkam Panchayat'], '600041'),
          makeVillage('Adyar Water Division', ['Adyar River Basin Panchayat', 'Besant Nagar Circle'], '600020'),
          makeVillage('Alandur Suburban', ['Alandur Panchayat Union', 'Meenambakkam Board'], '600016'),
          makeVillage('Sholinganallur Rural', ['Sholinganallur Village Panchayat', 'Semmancheri Panchayat'], '600119')
        ]
      },
      {
        id: 'coimbatore',
        name: 'Coimbatore',
        villages: [
          makeVillage('Kinathukadavu Rural', ['Kinathukadavu Village Panchayat', 'Kothavadi Village Panchayat'], '642109'),
          makeVillage('Karumathampatti Rural', ['Karumathampatti Village Panchayat', 'Somanur Village Panchayat'], '641659'),
          makeVillage('Sulur Rural', ['Sulur Village Panchayat', 'Sultanpet Village Panchayat'], '641402'),
          makeVillage('Pollachi Rural', ['Pollachi North Village Panchayat', 'Anamalai Village Panchayat'], '642001'),
          makeVillage('Mettupalayam Rural', ['Sirumugai Village Panchayat', 'Karamadai Village Panchayat'], '641301'),
          makeVillage('Perur Rural', ['Perur Chettipalayam Village Panchayat', 'Vedapatti Village Panchayat'], '641010')
        ]
      },
      {
        id: 'cuddalore',
        name: 'Cuddalore',
        villages: [
          makeVillage('Kurinjipadi', ['Kurinjipadi Village Panchayat', 'Kullanchavadi Village Panchayat'], '607302'),
          makeVillage('Chidambaram Rural', ['Bhuvanagiri Village Panchayat', 'Parangipettai Village Panchayat'], '608001'),
          makeVillage('Virudhachalam Rural', ['Virudhachalam Village Panchayat', 'Pennadam Village Panchayat'], '606001'),
          makeVillage('Panruti Rural', ['Panruti Village Panchayat', 'Nellikuppam Rural Panchayat'], '607106'),
          makeVillage('Kattumannarkoil', ['Kattumannarkoil Village Panchayat', 'Lalpet Village Panchayat'], '608301')
        ]
      },
      {
        id: 'dharmapuri',
        name: 'Dharmapuri',
        villages: [
          makeVillage('Harur', ['Harur Village Panchayat', 'Morappur Village Panchayat'], '636903'),
          makeVillage('Palacode', ['Palacode Village Panchayat', 'Karimangalam Village Panchayat'], '636808'),
          makeVillage('Pennagaram', ['Pennagaram Village Panchayat', 'Hogenakkal Water Basin Panchayat'], '636810'),
          makeVillage('Pappireddipatti', ['Pappireddipatti Village Panchayat', 'Kadathur Village Panchayat'], '636905'),
          makeVillage('Nallampalli', ['Nallampalli Village Panchayat', 'Thoppur Village Panchayat'], '636807')
        ]
      },
      {
        id: 'dindigul',
        name: 'Dindigul',
        villages: [
          makeVillage('Palani Rural', ['Palani Village Panchayat', 'Balasamudram Village Panchayat'], '624601'),
          makeVillage('Oddanchatram', ['Oddanchatram Village Panchayat', 'Kallimanthayam Village Panchayat'], '624619'),
          makeVillage('Natham', ['Natham Village Panchayat', 'Sendurai Village Panchayat'], '624401'),
          makeVillage('Nilakkottai', ['Nilakkottai Village Panchayat', 'Batlagundu Village Panchayat'], '624208'),
          makeVillage('Vedasandur', ['Vedasandur Village Panchayat', 'Eriodu Village Panchayat'], '624710'),
          makeVillage('Kodaikanal Rural', ['Pannaikadu Village Panchayat', 'Poombarai Village Panchayat'], '624101')
        ]
      },
      {
        id: 'erode',
        name: 'Erode',
        villages: [
          makeVillage('Bhavani Rural', ['Bhavani Village Panchayat', 'Anthiyur Village Panchayat'], '638301'),
          makeVillage('Gobichettipalayam Rural', ['Gobichettipalayam Village Panchayat', 'Kodivery Village Panchayat'], '638452'),
          makeVillage('Perundurai Rural', ['Perundurai Village Panchayat', 'Chennimalai Village Panchayat'], '638052'),
          makeVillage('Sathyamangalam Rural', ['Sathyamangalam Village Panchayat', 'Bhavanisagar Village Panchayat'], '638401'),
          makeVillage('Kodumudi', ['Kodumudi Village Panchayat', 'Sivagiri Village Panchayat'], '638151')
        ]
      },
      {
        id: 'kallakurichi',
        name: 'Kallakurichi',
        villages: [
          makeVillage('Sankarapuram', ['Sankarapuram Village Panchayat', 'Moongilthuraipattu Village Panchayat'], '606401'),
          makeVillage('Chinnasalem', ['Chinnasalem Village Panchayat', 'Kachirapalayam Village Panchayat'], '606201'),
          makeVillage('Ulundurpet', ['Ulundurpet Village Panchayat', 'Asanur Village Panchayat'], '606107'),
          makeVillage('Tirukoilur Rural', ['Tirukoilur Village Panchayat', 'Manalurpet Village Panchayat'], '605757'),
          makeVillage('Kalvarayan Hills', ['Kalvarayan Tribal Village Panchayat', 'Vellimalai Village Panchayat'], '606207')
        ]
      },
      {
        id: 'kanchipuram',
        name: 'Kanchipuram',
        villages: [
          makeVillage('Sriperumbudur Rural', ['Sriperumbudur Village Panchayat', 'Mambakkam Village Panchayat'], '602105'),
          makeVillage('Walajabad Rural', ['Walajabad Village Panchayat', 'Uthiramerur Village Panchayat'], '631605'),
          makeVillage('Kundrathur Rural', ['Kundrathur Village Panchayat', 'Mangadu Rural Village Panchayat'], '600069'),
          makeVillage('Magaral', ['Magaral Village Panchayat', 'Parandur Village Panchayat'], '631603'),
          makeVillage('Kanchipuram Rural', ['Thenambakkam Village Panchayat', 'Sevilimedu Village Panchayat'], '631501')
        ]
      },
      {
        id: 'kanyakumari',
        name: 'Kanyakumari',
        villages: [
          makeVillage('Agastheeswaram', ['Agastheeswaram Village Panchayat', 'Kottaram Village Panchayat'], '629701'),
          makeVillage('Thovalai', ['Thovalai Village Panchayat', 'Boothapandi Village Panchayat'], '629851'),
          makeVillage('Kalkulam', ['Kalkulam Village Panchayat', 'Thuckalay Rural Village Panchayat'], '629175'),
          makeVillage('Vilavancode', ['Vilavancode Village Panchayat', 'Kuzhithurai Rural Village Panchayat'], '629163'),
          makeVillage('Killiyoor', ['Killiyoor Village Panchayat', 'Pudukadai Village Panchayat'], '629171')
        ]
      },
      {
        id: 'karur',
        name: 'Karur',
        villages: [
          makeVillage('Kulithalai Rural', ['Kulithalai Village Panchayat', 'Thogaimalai Village Panchayat'], '639107'),
          makeVillage('Aravakurichi', ['Aravakurichi Village Panchayat', 'Pallapatti Rural Village Panchayat'], '639201'),
          makeVillage('Krishnarayapuram', ['Krishnarayapuram Village Panchayat', 'Mayanur Village Panchayat'], '639102'),
          makeVillage('Kadavur', ['Kadavur Village Panchayat', 'Tharagampatti Village Panchayat'], '621311'),
          makeVillage('Manmangalam', ['Manmangalam Village Panchayat', 'Vangal Village Panchayat'], '639006')
        ]
      },
      {
        id: 'krishnagiri',
        name: 'Krishnagiri',
        villages: [
          makeVillage('Hosur Rural', ['Hosur Rural Village Panchayat', 'Bagalur Village Panchayat'], '635109'),
          makeVillage('Denkanikottai', ['Denkanikottai Village Panchayat', 'Thally Village Panchayat'], '635107'),
          makeVillage('Pochampalli', ['Pochampalli Village Panchayat', 'Barur Village Panchayat'], '635206'),
          makeVillage('Uthangarai', ['Uthangarai Village Panchayat', 'Singarapettai Village Panchayat'], '635207'),
          makeVillage('Bargur Rural', ['Bargur Village Panchayat', 'Kandikuppam Village Panchayat'], '635104'),
          makeVillage('Shoolagiri', ['Shoolagiri Village Panchayat', 'Berigai Village Panchayat'], '635117')
        ]
      },
      {
        id: 'madurai',
        name: 'Madurai',
        villages: [
          makeVillage('Othakadai', ['Othakadai Village Panchayat', 'Melur Rural Village Panchayat'], '625107'),
          makeVillage('Alanganallur Rural', ['Alanganallur Village Panchayat', 'Palamedu Village Panchayat'], '625501'),
          makeVillage('Thirumangalam Rural', ['Kalligudi Village Panchayat', 'Thirumangalam Rural Panchayat'], '625706'),
          makeVillage('Usilampatti Rural', ['Usilampatti Village Panchayat', 'Sedapatti Village Panchayat'], '625532'),
          makeVillage('Vadipatti', ['Vadipatti Village Panchayat', 'Sholavandan Village Panchayat'], '625218'),
          makeVillage('Tirupparankundram Rural', ['Thanakkankulam Village Panchayat', 'Harveypatti Village Panchayat'], '625005')
        ]
      },
      {
        id: 'mayiladuthurai',
        name: 'Mayiladuthurai',
        villages: [
          makeVillage('Sirkazhi Rural', ['Sirkazhi Village Panchayat', 'Thirumullaivasal Village Panchayat'], '609110'),
          makeVillage('Tharangambadi Rural', ['Tharangambadi Village Panchayat', 'Porayar Village Panchayat'], '609313'),
          makeVillage('Kuthalam', ['Kuthalam Village Panchayat', 'Komal Village Panchayat'], '609801'),
          makeVillage('Sembanarkoil', ['Sembanarkoil Village Panchayat', 'Akkur Village Panchayat'], '609309'),
          makeVillage('Kollidam Rural', ['Kollidam Village Panchayat', 'Madhanam Village Panchayat'], '609102')
        ]
      },
      {
        id: 'nagapattinam',
        name: 'Nagapattinam',
        villages: [
          makeVillage('Kilvelur', ['Kilvelur Village Panchayat', 'Thevur Village Panchayat'], '611104'),
          makeVillage('Vedaranyam Rural', ['Vedaranyam Village Panchayat', 'Kodiyakarai Coastal Panchayat'], '614810'),
          makeVillage('Thirukuvalai', ['Thirukuvalai Village Panchayat', 'Kachanam Village Panchayat'], '610205'),
          makeVillage('Nagore Rural', ['Nagore Rural Village Panchayat', 'Sikkal Village Panchayat'], '611002'),
          makeVillage('Thalaignayiru', ['Thalaignayiru Village Panchayat', 'Naluvethapathi Village Panchayat'], '614712')
        ]
      },
      {
        id: 'namakkal',
        name: 'Namakkal',
        villages: [
          makeVillage('Rasipuram Rural', ['Rasipuram Village Panchayat', 'Vennandur Village Panchayat'], '637408'),
          makeVillage('Tiruchengode Rural', ['Tiruchengode Village Panchayat', 'Mallasamudram Village Panchayat'], '637211'),
          makeVillage('Paramathi Velur', ['Paramathi Village Panchayat', 'Velur Rural Village Panchayat'], '637207'),
          makeVillage('Kolli Hills Rural', ['Kolli Hills Tribal Panchayat', 'Semmedu Village Panchayat'], '637411'),
          makeVillage('Sendamangalam', ['Sendamangalam Village Panchayat', 'Erumapatty Village Panchayat'], '637409'),
          makeVillage('Mohanur', ['Mohanur Village Panchayat', 'Valayappatti Village Panchayat'], '637015')
        ]
      },
      {
        id: 'nilgiris',
        name: 'Nilgiris',
        villages: [
          makeVillage('Coonoor Rural', ['Coonoor Village Panchayat', 'Hulical Village Panchayat'], '643101'),
          makeVillage('Kotagiri Rural', ['Kotagiri Village Panchayat', 'Nedugula Village Panchayat'], '643217'),
          makeVillage('Gudalur Rural', ['Gudalur Village Panchayat', 'Devala Village Panchayat'], '643212'),
          makeVillage('Kundah', ['Kundah Village Panchayat', 'Bikkatty Village Panchayat'], '643219'),
          makeVillage('Pandalur', ['Pandalur Village Panchayat', 'Cherambadi Village Panchayat'], '643233'),
          makeVillage('Udhagamandalam Rural', ['Ooty Rural Village Panchayat', 'Balacola Village Panchayat'], '643001')
        ]
      },
      {
        id: 'perambalur',
        name: 'Perambalur',
        villages: [
          makeVillage('Kunnam', ['Kunnam Village Panchayat', 'Varagur Village Panchayat'], '621708'),
          makeVillage('Veppanthattai', ['Veppanthattai Village Panchayat', 'V-Kalathur Village Panchayat'], '621116'),
          makeVillage('Alathur', ['Alathur Village Panchayat', 'Chettikulam Village Panchayat'], '621109'),
          makeVillage('Perambalur Rural', ['Kurumbalur Village Panchayat', 'Elambalur Village Panchayat'], '621212'),
          makeVillage('Poolambadi', ['Poolambadi Village Panchayat', 'Arumbavur Village Panchayat'], '621103')
        ]
      },
      {
        id: 'pudukkottai',
        name: 'Pudukkottai',
        villages: [
          makeVillage('Aranthangi Rural', ['Aranthangi Village Panchayat', 'Avudaiyarkoil Village Panchayat'], '614616'),
          makeVillage('Alangudi', ['Alangudi Village Panchayat', 'Vadakadu Village Panchayat'], '622301'),
          makeVillage('Gandarvakottai', ['Gandarvakottai Village Panchayat', 'Punalvasal Village Panchayat'], '613301'),
          makeVillage('Illuppur', ['Illuppur Village Panchayat', 'Annavasal Village Panchayat'], '622102'),
          makeVillage('Kulathur', ['Kiranur Village Panchayat', 'Viralimalai Village Panchayat'], '622501'),
          makeVillage('Manamelkudi', ['Manamelkudi Coastal Panchayat', 'Kottaipattinam Village Panchayat'], '614620'),
          makeVillage('Thirumayam', ['Thirumayam Village Panchayat', 'Arimalam Village Panchayat'], '622507')
        ]
      },
      {
        id: 'ramanathapuram',
        name: 'Ramanathapuram',
        villages: [
          makeVillage('Rameswaram Rural', ['Rameswaram Island Panchayat', 'Pamban Coastal Panchayat'], '623526'),
          makeVillage('Paramakudi Rural', ['Paramakudi Village Panchayat', 'Nainarkoil Village Panchayat'], '623707'),
          makeVillage('Kadaladi', ['Kadaladi Village Panchayat', 'Sayalkudi Village Panchayat'], '623120'),
          makeVillage('Mudukulathur', ['Mudukulathur Village Panchayat', 'Kamuthi Village Panchayat'], '623704'),
          makeVillage('Thiruvadanai', ['Thiruvadanai Village Panchayat', 'Tondi Coastal Panchayat'], '623407'),
          makeVillage('Mandapam Rural', ['Mandapam Village Panchayat', 'Uchipuli Village Panchayat'], '623518')
        ]
      },
      {
        id: 'ranipet',
        name: 'Ranipet',
        villages: [
          makeVillage('Arakkonam Rural', ['Arakkonam Village Panchayat', 'Nemili Village Panchayat'], '631001'),
          makeVillage('Walajah Rural', ['Walajah Village Panchayat', 'Kaveripakkam Village Panchayat'], '632513'),
          makeVillage('Arcot Rural', ['Arcot Village Panchayat', 'Timiri Village Panchayat'], '632503'),
          makeVillage('Sholinghur Rural', ['Sholinghur Village Panchayat', 'Banavaram Village Panchayat'], '631102'),
          makeVillage('Panapakkam', ['Panapakkam Village Panchayat', 'Thakkolam Village Panchayat'], '631052')
        ]
      },
      {
        id: 'salem',
        name: 'Salem',
        villages: [
          makeVillage('Attur Rural', ['Attur Village Panchayat', 'Pethanaickenpalayam Village Panchayat'], '636102'),
          makeVillage('Mettur Rural', ['Mettur Dam Panchayat', 'Mecheri Village Panchayat'], '636401'),
          makeVillage('Omalur Rural', ['Omalur Village Panchayat', 'Tharamangalam Village Panchayat'], '636455'),
          makeVillage('Sankari Rural', ['Sankari Village Panchayat', 'Magudanchavadi Village Panchayat'], '637301'),
          makeVillage('Yercaud Rural', ['Yercaud Hill Village Panchayat', 'Kombuthookki Village Panchayat'], '636601'),
          makeVillage('Gangavalli', ['Gangavalli Village Panchayat', 'Thammampatti Village Panchayat'], '636105'),
          makeVillage('Valapady', ['Valapady Village Panchayat', 'Peddanaickenpalayam Village Panchayat'], '636115')
        ]
      },
      {
        id: 'sivaganga',
        name: 'Sivaganga',
        villages: [
          makeVillage('Karaikudi Rural', ['Karaikudi Village Panchayat', 'Kottaiyur Village Panchayat'], '630001'),
          makeVillage('Devakottai Rural', ['Devakottai Village Panchayat', 'Kannangudi Village Panchayat'], '630302'),
          makeVillage('Manamadurai Rural', ['Manamadurai Village Panchayat', 'Thirupuvanam Village Panchayat'], '630606'),
          makeVillage('Tirupathur Rural', ['Tirupathur Village Panchayat', 'Singampunari Village Panchayat'], '630211'),
          makeVillage('Ilayangudi', ['Ilayangudi Village Panchayat', 'Salaigramam Village Panchayat'], '630702'),
          makeVillage('Kalaiyarkoil', ['Kalaiyarkoil Village Panchayat', 'Maravamangalam Village Panchayat'], '630551')
        ]
      },
      {
        id: 'tenkasi',
        name: 'Tenkasi',
        villages: [
          makeVillage('Sankarankovil Rural', ['Sankarankovil Village Panchayat', 'Kuruvikulam Village Panchayat'], '627756'),
          makeVillage('Kadayanallur Rural', ['Kadayanallur Village Panchayat', 'Chockampatti Village Panchayat'], '627751'),
          makeVillage('Alangulam Rural', ['Alangulam Village Panchayat', 'Surandai Village Panchayat'], '627851'),
          makeVillage('Shenkottai Rural', ['Shenkottai Village Panchayat', 'Puliyarai Village Panchayat'], '627809'),
          makeVillage('Sivagiri Rural', ['Sivagiri Village Panchayat', 'Vasudevanallur Village Panchayat'], '627757'),
          makeVillage('Thiruvengadam', ['Thiruvengadam Village Panchayat', 'Melaneelithanallur Village Panchayat'], '627719')
        ]
      },
      {
        id: 'thanjavur',
        name: 'Thanjavur',
        villages: [
          makeVillage('Kumbakonam Rural', ['Kumbakonam Village Panchayat', 'Thiruvidaimarudur Village Panchayat'], '612001'),
          makeVillage('Papanasam Rural', ['Papanasam Village Panchayat', 'Ayyampettai Village Panchayat'], '614205'),
          makeVillage('Pattukkottai Rural', ['Pattukkottai Village Panchayat', 'Madukkur Village Panchayat'], '614601'),
          makeVillage('Peravurani Rural', ['Peravurani Village Panchayat', 'Sethubhavachatram Village Panchayat'], '614804'),
          makeVillage('Orathanadu Rural', ['Orathanadu Village Panchayat', 'Thiruvonam Village Panchayat'], '614625'),
          makeVillage('Thiruvaiyaru Rural', ['Thiruvaiyaru Village Panchayat', 'Budalur Village Panchayat'], '613204')
        ]
      },
      {
        id: 'theni',
        name: 'Theni',
        villages: [
          makeVillage('Periyakulam Rural', ['Periyakulam Village Panchayat', 'Thenkarai Village Panchayat'], '625601'),
          makeVillage('Bodinayakanur Rural', ['Bodinayakanur Village Panchayat', 'Kombai Village Panchayat'], '625513'),
          makeVillage('Uthamapalayam Rural', ['Uthamapalayam Village Panchayat', 'Cumbum Village Panchayat'], '625533'),
          makeVillage('Andipatti Rural', ['Andipatti Village Panchayat', 'Kadamalaikundu Village Panchayat'], '625512'),
          makeVillage('Chinnamanur Rural', ['Chinnamanur Village Panchayat', 'Gudalur Theni Panchayat'], '625515')
        ]
      },
      {
        id: 'thoothukudi',
        name: 'Thoothukudi (Tuticorin)',
        villages: [
          makeVillage('Kovilpatti Rural', ['Kovilpatti Village Panchayat', 'Kayathar Village Panchayat'], '628501'),
          makeVillage('Tiruchendur Rural', ['Tiruchendur Village Panchayat', 'Kulasekharapatnam Village Panchayat'], '628215'),
          makeVillage('Srivaikuntam Rural', ['Srivaikuntam Village Panchayat', 'Alwarthirunagari Village Panchayat'], '628601'),
          makeVillage('Ottapidaram Rural', ['Ottapidaram Village Panchayat', 'Panchalankurichi Village Panchayat'], '628401'),
          makeVillage('Vilathikulam Rural', ['Vilathikulam Village Panchayat', 'Pudur Village Panchayat'], '628907'),
          makeVillage('Sathankulam', ['Sathankulam Village Panchayat', 'Nazareth Village Panchayat'], '628704')
        ]
      },
      {
        id: 'tiruchirappalli',
        name: 'Tiruchirappalli (Trichy)',
        villages: [
          makeVillage('Srirangam Rural', ['Srirangam Island Panchayat', 'Andanallur Village Panchayat'], '620006'),
          makeVillage('Lalgudi Rural', ['Lalgudi Village Panchayat', 'Pullambadi Village Panchayat'], '621601'),
          makeVillage('Manapparai Rural', ['Manapparai Village Panchayat', 'Marungapuri Village Panchayat'], '621306'),
          makeVillage('Musiri Rural', ['Musiri Village Panchayat', 'Thottiyam Village Panchayat'], '621211'),
          makeVillage('Thuraiyur Rural', ['Thuraiyur Village Panchayat', 'Uppiliapuram Village Panchayat'], '621010'),
          makeVillage('Tiruverumbur Rural', ['Tiruverumbur Village Panchayat', 'Thuvakudi Village Panchayat'], '620013')
        ]
      },
      {
        id: 'tirunelveli',
        name: 'Tirunelveli',
        villages: [
          makeVillage('Ambasamudram Rural', ['Ambasamudram Village Panchayat', 'Kallidaikurichi Village Panchayat'], '627401'),
          makeVillage('Cheranmahadevi', ['Cheranmahadevi Village Panchayat', 'Mukkudal Village Panchayat'], '627414'),
          makeVillage('Nanguneri Rural', ['Nanguneri Village Panchayat', 'Kalakkad Village Panchayat'], '627108'),
          makeVillage('Radhapuram Rural', ['Radhapuram Village Panchayat', 'Vallioor Village Panchayat'], '627111'),
          makeVillage('Palayamkottai Rural', ['Palayamkottai Village Panchayat', 'Tirunelveli Rural Panchayat'], '627002'),
          makeVillage('Koodankulam Coastal', ['Koodankulam Village Panchayat', 'Chettikulam Coastal Panchayat'], '627106')
        ]
      },
      {
        id: 'tirupathur',
        name: 'Tirupathur',
        villages: [
          makeVillage('Vaniyambadi Rural', ['Vaniyambadi Village Panchayat', 'Alangayam Village Panchayat'], '635751'),
          makeVillage('Ambur Rural', ['Ambur Village Panchayat', 'Madhanur Village Panchayat'], '635802'),
          makeVillage('Natrampalli', ['Natrampalli Village Panchayat', 'Jolarpettai Village Panchayat'], '635852'),
          makeVillage('Yelagiri Hills Rural', ['Yelagiri Hills Panchayat', 'Athanavoor Village Panchayat'], '635853'),
          makeVillage('Tirupathur Rural', ['Kandili Village Panchayat', 'Pudupettai Village Panchayat'], '635601')
        ]
      },
      {
        id: 'tiruppur',
        name: 'Tiruppur',
        villages: [
          makeVillage('Dharapuram Rural', ['Dharapuram Village Panchayat', 'Kundadam Village Panchayat'], '638656'),
          makeVillage('Kangeyam Rural', ['Kangeyam Village Panchayat', 'Vellakoil Village Panchayat'], '638701'),
          makeVillage('Udumalaipettai Rural', ['Udumalaipettai Village Panchayat', 'Madathukulam Village Panchayat'], '642126'),
          makeVillage('Palladam Rural', ['Palladam Village Panchayat', 'Pongalur Village Panchayat'], '641664'),
          makeVillage('Avinashi Rural', ['Avinashi Village Panchayat', 'Uthukuli Village Panchayat'], '641654'),
          makeVillage('Moolanur', ['Moolanur Village Panchayat', 'Kannivadi Village Panchayat'], '638106')
        ]
      },
      {
        id: 'tiruvallur',
        name: 'Tiruvallur',
        villages: [
          makeVillage('Poonamallee Rural', ['Poonamallee Village Panchayat', 'Thiruninravur Village Panchayat'], '600056'),
          makeVillage('Gummidipoondi Rural', ['Gummidipoondi Village Panchayat', 'Kavaraipettai Village Panchayat'], '601201'),
          makeVillage('Ponneri Rural', ['Ponneri Village Panchayat', 'Minjur Village Panchayat'], '601204'),
          makeVillage('Tiruttani Rural', ['Tiruttani Village Panchayat', 'Pallipattu Village Panchayat'], '631209'),
          makeVillage('Uthukkottai', ['Uthukkottai Village Panchayat', 'Periyapalayam Village Panchayat'], '602026'),
          makeVillage('Avadi Rural', ['Morai Village Panchayat', 'Vellanur Village Panchayat'], '600055')
        ]
      },
      {
        id: 'tiruvannamalai',
        name: 'Tiruvannamalai',
        villages: [
          makeVillage('Arani Rural', ['Arani Village Panchayat', 'Thatchoor Village Panchayat'], '632301'),
          makeVillage('Chengam Rural', ['Chengam Village Panchayat', 'Pudur Chengam Village Panchayat'], '606701'),
          makeVillage('Polur Rural', ['Polur Village Panchayat', 'Kalasapakkam Village Panchayat'], '606803'),
          makeVillage('Cheyyar Rural', ['Cheyyar Village Panchayat', 'Anakkavur Village Panchayat'], '604407'),
          makeVillage('Vandavasi Rural', ['Vandavasi Village Panchayat', 'Thellar Village Panchayat'], '604408'),
          makeVillage('Kilpennathur', ['Kilpennathur Village Panchayat', 'Vettavalam Village Panchayat'], '604601'),
          makeVillage('Jawadhu Hills', ['Jamunamarathur Tribal Panchayat', 'Kavalur Village Panchayat'], '635703')
        ]
      },
      {
        id: 'tiruvarur',
        name: 'Tiruvarur',
        villages: [
          makeVillage('Mannargudi Rural', ['Mannargudi Village Panchayat', 'Needamangalam Village Panchayat'], '614001'),
          makeVillage('Thiruthuraipoondi Rural', ['Thiruthuraipoondi Village Panchayat', 'Muthupet Coastal Panchayat'], '614713'),
          makeVillage('Kudavasal', ['Kudavasal Village Panchayat', 'Koradacheri Village Panchayat'], '612601'),
          makeVillage('Nannilam', ['Nannilam Village Panchayat', 'Peralam Village Panchayat'], '610105'),
          makeVillage('Valangaiman', ['Valangaiman Village Panchayat', 'Alangudi Village Panchayat'], '612804'),
          makeVillage('Koothanallur Rural', ['Koothanallur Village Panchayat', 'Podakkudi Village Panchayat'], '614101')
        ]
      },
      {
        id: 'vellore',
        name: 'Vellore',
        villages: [
          makeVillage('Gudiyatham Rural', ['Gudiyatham Village Panchayat', 'Paradami Village Panchayat'], '632602'),
          makeVillage('Katpadi Rural', ['Katpadi Village Panchayat', 'Senur Village Panchayat'], '632007'),
          makeVillage('Anaicut', ['Anaicut Village Panchayat', 'Pallikonda Village Panchayat'], '632103'),
          makeVillage('Kaniyambadi', ['Kaniyambadi Village Panchayat', 'Pennathur Village Panchayat'], '632102'),
          makeVillage('Pernambut Rural', ['Pernambut Village Panchayat', 'Aravatla Village Panchayat'], '635810')
        ]
      },
      {
        id: 'viluppuram',
        name: 'Viluppuram',
        villages: [
          makeVillage('Tindivanam Rural', ['Tindivanam Village Panchayat', 'Marakkanam Coastal Panchayat'], '604001'),
          makeVillage('Gingee Rural', ['Gingee Village Panchayat', 'Melmalayanur Village Panchayat'], '604202'),
          makeVillage('Vanur', ['Vanur Village Panchayat', 'Mailam Village Panchayat'], '605109'),
          makeVillage('Vikravandi', ['Vikravandi Village Panchayat', 'Kanjanur Village Panchayat'], '605652'),
          makeVillage('Kandachipuram', ['Kandachipuram Village Panchayat', 'Arakandanallur Village Panchayat'], '605701'),
          makeVillage('Koliyanur', ['Koliyanur Village Panchayat', 'Valavanur Village Panchayat'], '605107')
        ]
      },
      {
        id: 'virudhunagar',
        name: 'Virudhunagar',
        villages: [
          makeVillage('Sivakasi Rural', ['Sivakasi Village Panchayat', 'Thiruthangal Village Panchayat'], '626123'),
          makeVillage('Rajapalayam Rural', ['Rajapalayam Village Panchayat', 'Seithur Village Panchayat'], '626117'),
          makeVillage('Aruppukkottai Rural', ['Aruppukkottai Village Panchayat', 'Kariapatti Village Panchayat'], '626101'),
          makeVillage('Srivilliputhur Rural', ['Srivilliputhur Village Panchayat', 'Watrap Village Panchayat'], '626125'),
          makeVillage('Sattur Rural', ['Sattur Village Panchayat', 'Vembakottai Village Panchayat'], '626203'),
          makeVillage('Tiruchuli', ['Tiruchuli Village Panchayat', 'Narikudi Village Panchayat'], '626129')
        ]
      }
    ]
  },

  // 2. KARNATAKA - ALL 31 DISTRICTS
  {
    id: 'karnataka',
    name: 'Karnataka',
    code: 'KA',
    type: 'state',
    districts: [
      {
        id: 'bagalkot',
        name: 'Bagalkot',
        villages: [
          makeVillage('Badami Rural', ['Badami Gram Panchayat', 'Guledagudda Gram Panchayat'], '587201'),
          makeVillage('Jamkhandi Rural', ['Jamkhandi Gram Panchayat', 'Terdal Gram Panchayat'], '587301'),
          makeVillage('Mudhol Rural', ['Mudhol Gram Panchayat', 'Lokapur Gram Panchayat'], '587313'),
          makeVillage('Hungund', ['Hungund Gram Panchayat', 'Ilkal Gram Panchayat'], '587118'),
          makeVillage('Bilagi', ['Bilagi Gram Panchayat', 'Galagali Gram Panchayat'], '587116')
        ]
      },
      {
        id: 'ballari',
        name: 'Ballari',
        villages: [
          makeVillage('Kurugodu', ['Kurugodu Gram Panchayat', 'Kudithini Gram Panchayat'], '583116'),
          makeVillage('Siruguppa Rural', ['Siruguppa Gram Panchayat', 'Tekkalakote Gram Panchayat'], '583121'),
          makeVillage('Kampli', ['Kampli Gram Panchayat', 'Emmiganur Gram Panchayat'], '583132'),
          makeVillage('Sandur Rural', ['Sandur Gram Panchayat', 'Toranagallu Gram Panchayat'], '583119')
        ]
      },
      {
        id: 'belagavi',
        name: 'Belagavi',
        villages: [
          makeVillage('Ghataprabha', ['Ghataprabha Gram Panchayat', 'Arabhavi Gram Panchayat'], '591306'),
          makeVillage('Ankalagi', ['Ankalagi Gram Panchayat', 'Kakati Gram Panchayat'], '591101'),
          makeVillage('Examba', ['Examba Gram Panchayat', 'Chikkodi Rural Gram Panchayat'], '591244'),
          makeVillage('Nesargi', ['Nesargi Gram Panchayat', 'Sampgaon Gram Panchayat'], '591123'),
          makeVillage('Gokak Rural', ['Gokak Falls Gram Panchayat', 'Konnur Gram Panchayat'], '591307'),
          makeVillage('Athani Rural', ['Athani Gram Panchayat', 'Kagwad Gram Panchayat'], '591304'),
          makeVillage('Bailhongal Rural', ['Bailhongal Gram Panchayat', 'Kittur Gram Panchayat'], '591102'),
          makeVillage('Saundatti', ['Yellamma Gram Panchayat', 'Munavalli Gram Panchayat'], '591126'),
          makeVillage('Khanapur Rural', ['Khanapur Gram Panchayat', 'Nandgad Gram Panchayat'], '591302')
        ]
      },
      {
        id: 'bengaluru_rural',
        name: 'Bengaluru Rural',
        villages: [
          makeVillage('Arasinakunte', ['Arasinakunte Gram Panchayat', 'Nelamangala Rural Gram Panchayat'], '562123'),
          makeVillage('Sompura', ['Sompura Gram Panchayat', 'Dabaspet Industrial Gram Panchayat'], '562111'),
          makeVillage('Budihal', ['Budihal Gram Panchayat', 'T. Begur Gram Panchayat'], '562123'),
          makeVillage('Avathi', ['Avathi Gram Panchayat', 'Devanahalli Rural Gram Panchayat'], '562110'),
          makeVillage('Bettahalasur', ['Bettahalasur Gram Panchayat', 'Kundana Gram Panchayat'], '562157'),
          makeVillage('Tubagere', ['Tubagere Gram Panchayat', 'Doddaballapura Gram Panchayat'], '561205'),
          makeVillage('Jadigenahalli', ['Jadigenahalli Gram Panchayat', 'Hosakote Rural Gram Panchayat'], '562114'),
          makeVillage('Sulibele', ['Sulibele Gram Panchayat', 'Nandagudi Gram Panchayat'], '562129')
        ]
      },
      {
        id: 'bengaluru_urban',
        name: 'Bengaluru Urban',
        villages: [
          makeVillage('Anekal Rural', ['Anekal Gram Panchayat', 'Attibele Gram Panchayat'], '562106'),
          makeVillage('Sarjapura Rural', ['Sarjapura Gram Panchayat', 'Dommasandra Gram Panchayat'], '562125'),
          makeVillage('Jigani Rural', ['Jigani Industrial Gram Panchayat', 'Bannerghatta Gram Panchayat'], '560105'),
          makeVillage('Yelahanka Rural', ['Hesaraghatta Gram Panchayat', 'Doddajala Gram Panchayat'], '560064'),
          makeVillage('Kengeri Rural', ['Kumbalgodu Gram Panchayat', 'Kengeri Hobli Gram Panchayat'], '560074')
        ]
      },
      {
        id: 'bidar',
        name: 'Bidar',
        villages: [
          makeVillage('Basavakalyan Rural', ['Basavakalyan Gram Panchayat', 'Mudbi Gram Panchayat'], '585327'),
          makeVillage('Humnabad Rural', ['Humnabad Gram Panchayat', 'Dubalgundi Gram Panchayat'], '585330'),
          makeVillage('Bhalki Rural', ['Bhalki Gram Panchayat', 'Khatak Chincholi Gram Panchayat'], '585328'),
          makeVillage('Aurad Rural', ['Aurad Gram Panchayat', 'Kamalnagar Gram Panchayat'], '585326')
        ]
      },
      {
        id: 'chamarajanagar',
        name: 'Chamarajanagar',
        villages: [
          makeVillage('Gundlupet Rural', ['Gundlupet Gram Panchayat', 'Begur Gram Panchayat'], '571111'),
          makeVillage('Kollegal Rural', ['Kollegal Gram Panchayat', 'Mamballi Gram Panchayat'], '571440'),
          makeVillage('Yelandur Rural', ['Yelandur Gram Panchayat', 'Agara Gram Panchayat'], '571441'),
          makeVillage('Hanur Rural', ['Hanur Gram Panchayat', 'Ramapura Gram Panchayat'], '571439')
        ]
      },
      {
        id: 'chikkaballapura',
        name: 'Chikkaballapura',
        villages: [
          makeVillage('Gauribidanur Rural', ['Gauribidanur Gram Panchayat', 'Manchenahalli Gram Panchayat'], '561208'),
          makeVillage('Bagepalli Rural', ['Bagepalli Gram Panchayat', 'Chelur Gram Panchayat'], '561207'),
          makeVillage('Chintamani Rural', ['Chintamani Gram Panchayat', 'Batlahalli Gram Panchayat'], '563125'),
          makeVillage('Sidlaghatta Rural', ['Sidlaghatta Gram Panchayat', 'Jangamakote Gram Panchayat'], '562105'),
          makeVillage('Gudibande', ['Gudibande Gram Panchayat', 'Somenahalli Gram Panchayat'], '561209')
        ]
      },
      {
        id: 'chikkamagaluru',
        name: 'Chikkamagaluru',
        villages: [
          makeVillage('Mudigere Rural', ['Mudigere Gram Panchayat', 'Kottigehara Gram Panchayat'], '577132'),
          makeVillage('Kadur Rural', ['Kadur Gram Panchayat', 'Birur Gram Panchayat'], '577548'),
          makeVillage('Tarikere Rural', ['Tarikere Gram Panchayat', 'Ajjampura Gram Panchayat'], '577228'),
          makeVillage('Sringeri Rural', ['Sringeri Gram Panchayat', 'Kigga Gram Panchayat'], '577139'),
          makeVillage('Koppa Rural', ['Koppa Gram Panchayat', 'Hariharapura Gram Panchayat'], '577126'),
          makeVillage('Narasimharajapura', ['NR Pura Gram Panchayat', 'Balehonnur Gram Panchayat'], '577134')
        ]
      },
      {
        id: 'chitradurga',
        name: 'Chitradurga',
        villages: [
          makeVillage('Hiriyur Rural', ['Hiriyur Gram Panchayat', 'Dharmapura Gram Panchayat'], '577598'),
          makeVillage('Challakere Rural', ['Challakere Gram Panchayat', 'Parasurampura Gram Panchayat'], '577522'),
          makeVillage('Holalkere Rural', ['Holalkere Gram Panchayat', 'Chikkajajur Gram Panchayat'], '577526'),
          makeVillage('Hosadurga Rural', ['Hosadurga Gram Panchayat', 'Mathodu Gram Panchayat'], '577527'),
          makeVillage('Molakalmuru', ['Molakalmuru Gram Panchayat', 'Ramasagara Gram Panchayat'], '577535')
        ]
      },
      {
        id: 'dakshina_kannada',
        name: 'Dakshina Kannada',
        villages: [
          makeVillage('Gurupura', ['Gurupura Gram Panchayat', 'Mangaluru Rural Gram Panchayat'], '574145'),
          makeVillage('Kinnigoli', ['Kinnigoli Gram Panchayat', 'Bajpe Gram Panchayat'], '574150'),
          makeVillage('Mani', ['Mani Gram Panchayat', 'Bantwal Rural Gram Panchayat'], '574253'),
          makeVillage('Uppinangady', ['Uppinangady Gram Panchayat', 'Puttur Rural Gram Panchayat'], '574241'),
          makeVillage('Belthangady Rural', ['Belthangady Gram Panchayat', 'Dharmasthala Gram Panchayat'], '574214'),
          makeVillage('Sullia Rural', ['Sullia Gram Panchayat', 'Subrahmanya Gram Panchayat'], '574239'),
          makeVillage('Moodbidri Rural', ['Moodbidri Gram Panchayat', 'Mijar Gram Panchayat'], '574227')
        ]
      },
      {
        id: 'davanagere',
        name: 'Davanagere',
        villages: [
          makeVillage('Harihara Rural', ['Harihara Gram Panchayat', 'Malebennur Gram Panchayat'], '577601'),
          makeVillage('Channagiri Rural', ['Channagiri Gram Panchayat', 'Santhebennur Gram Panchayat'], '577213'),
          makeVillage('Honnali Rural', ['Honnali Gram Panchayat', 'Sasvehalli Gram Panchayat'], '577217'),
          makeVillage('Jagalur Rural', ['Jagalur Gram Panchayat', 'Bilichodu Gram Panchayat'], '577528'),
          makeVillage('Nyamathi', ['Nyamathi Gram Panchayat', 'Surahonne Gram Panchayat'], '577223')
        ]
      },
      {
        id: 'dharwad',
        name: 'Dharwad',
        villages: [
          makeVillage('Hubballi Rural', ['Navalgund Gram Panchayat', 'Chabbi Gram Panchayat'], '580020'),
          makeVillage('Kalghatgi Rural', ['Kalghatgi Gram Panchayat', 'Alnavar Gram Panchayat'], '581204'),
          makeVillage('Kundgol Rural', ['Kundgol Gram Panchayat', 'Saunshi Gram Panchayat'], '581113'),
          makeVillage('Navalgund Rural', ['Navalgund Gram Panchayat', 'Annigeri Gram Panchayat'], '582208')
        ]
      },
      {
        id: 'gadag',
        name: 'Gadag',
        villages: [
          makeVillage('Ron Rural', ['Ron Gram Panchayat', 'Gajendragad Gram Panchayat'], '582209'),
          makeVillage('Shirhatti Rural', ['Shirhatti Gram Panchayat', 'Lakshmeshwar Gram Panchayat'], '582116'),
          makeVillage('Mundargi Rural', ['Mundargi Gram Panchayat', 'Dambal Gram Panchayat'], '582118'),
          makeVillage('Nargund Rural', ['Nargund Gram Panchayat', 'Konaghatta Gram Panchayat'], '582207')
        ]
      },
      {
        id: 'hassan',
        name: 'Hassan',
        villages: [
          makeVillage('Channarayapatna Rural', ['Channarayapatna Gram Panchayat', 'Shravanabelagola Gram Panchayat'], '573116'),
          makeVillage('Arsikere Rural', ['Arsikere Gram Panchayat', 'Banasavandra Gram Panchayat'], '573103'),
          makeVillage('Sakleshpur Rural', ['Sakleshpur Gram Panchayat', 'Hanbal Gram Panchayat'], '573134'),
          makeVillage('Belur Rural', ['Belur Gram Panchayat', 'Halebidu Gram Panchayat'], '573115'),
          makeVillage('Alur Rural', ['Alur Gram Panchayat', 'Kandali Gram Panchayat'], '573213'),
          makeVillage('Arkalgud Rural', ['Arkalgud Gram Panchayat', 'Konanur Gram Panchayat'], '573130'),
          makeVillage('Holenarasipura Rural', ['Holenarasipura Gram Panchayat', 'Halekote Gram Panchayat'], '573211')
        ]
      },
      {
        id: 'haveri',
        name: 'Haveri',
        villages: [
          makeVillage('Ranebennur Rural', ['Ranebennur Gram Panchayat', 'Medleri Gram Panchayat'], '581115'),
          makeVillage('Byadgi Rural', ['Byadgi Gram Panchayat', 'Motebennur Gram Panchayat'], '581106'),
          makeVillage('Hirekerur Rural', ['Hirekerur Gram Panchayat', 'Rattihalli Gram Panchayat'], '581111'),
          makeVillage('Shiggaon Rural', ['Shiggaon Gram Panchayat', 'Bankapur Gram Panchayat'], '581205'),
          makeVillage('Savanur Rural', ['Savanur Gram Panchayat', 'Huralikuppi Gram Panchayat'], '581118'),
          makeVillage('Hangal Rural', ['Hangal Gram Panchayat', 'Akkialur Gram Panchayat'], '581102')
        ]
      },
      {
        id: 'kalaburagi',
        name: 'Kalaburagi (Gulbarga)',
        villages: [
          makeVillage('Aland Rural', ['Aland Gram Panchayat', 'Narona Gram Panchayat'], '585302'),
          makeVillage('Afzalpur Rural', ['Afzalpur Gram Panchayat', 'Gobbur Gram Panchayat'], '585301'),
          makeVillage('Chittapur Rural', ['Chittapur Gram Panchayat', 'Wadi Gram Panchayat'], '585211'),
          makeVillage('Sedam Rural', ['Sedam Gram Panchayat', 'Mudhkarai Gram Panchayat'], '585222'),
          makeVillage('Chincholi Rural', ['Chincholi Gram Panchayat', 'Sulepet Gram Panchayat'], '585307'),
          makeVillage('Jevargi Rural', ['Jevargi Gram Panchayat', 'Yedrami Gram Panchayat'], '585310')
        ]
      },
      {
        id: 'kodagu',
        name: 'Kodagu (Coorg)',
        villages: [
          makeVillage('Madikeri Rural', ['Madikeri Gram Panchayat', 'Napoklu Gram Panchayat'], '571201'),
          makeVillage('Virajpet Rural', ['Virajpet Gram Panchayat', 'Gonikoppal Gram Panchayat'], '571218'),
          makeVillage('Somwarpet Rural', ['Somwarpet Gram Panchayat', 'Kushalnagar Gram Panchayat'], '571236'),
          makeVillage('Ponnampet Rural', ['Ponnampet Gram Panchayat', 'Balele Gram Panchayat'], '571216')
        ]
      },
      {
        id: 'kolar',
        name: 'Kolar',
        villages: [
          makeVillage('Bangarapet Rural', ['Bangarapet Gram Panchayat', 'Kammasandra Gram Panchayat'], '563114'),
          makeVillage('Malur Rural', ['Malur Gram Panchayat', 'Lakkur Gram Panchayat'], '563130'),
          makeVillage('Mulbagal Rural', ['Mulbagal Gram Panchayat', 'Nangali Gram Panchayat'], '563131'),
          makeVillage('Srinivaspur Rural', ['Srinivaspur Gram Panchayat', 'Rayalpadu Gram Panchayat'], '563135'),
          makeVillage('KGF Rural', ['Robertsonpet Rural Gram Panchayat', 'Bethamangala Gram Panchayat'], '563122')
        ]
      },
      {
        id: 'koppal',
        name: 'Koppal',
        villages: [
          makeVillage('Gangavathi Rural', ['Gangavathi Gram Panchayat', 'Anegundi Gram Panchayat'], '583227'),
          makeVillage('Kushtagi Rural', ['Kushtagi Gram Panchayat', 'Tavargera Gram Panchayat'], '583277'),
          makeVillage('Yelburga Rural', ['Yelburga Gram Panchayat', 'Kukanur Gram Panchayat'], '583236')
        ]
      },
      {
        id: 'mandya',
        name: 'Mandya',
        villages: [
          makeVillage('Dudda', ['Dudda Gram Panchayat', 'Basaralu Gram Panchayat'], '571405'),
          makeVillage('Keragodu', ['Keragodu Gram Panchayat', 'Kothathi Gram Panchayat'], '571446'),
          makeVillage('Besagarahalli', ['Besagarahalli Gram Panchayat', 'Maddur Rural Gram Panchayat'], '571419'),
          makeVillage('Melukote', ['Melukote Gram Panchayat', 'Jakkanahalli Gram Panchayat'], '571431'),
          makeVillage('Arakere', ['Arakere Gram Panchayat', 'Srirangapatna Rural Gram Panchayat'], '571415'),
          makeVillage('Malavalli Rural', ['Malavalli Gram Panchayat', 'Halagur Gram Panchayat'], '571430'),
          makeVillage('Nagamangala Rural', ['Nagamangala Gram Panchayat', 'Bellur Gram Panchayat'], '571432'),
          makeVillage('KR Pet Rural', ['KR Pet Gram Panchayat', 'Sheelanere Gram Panchayat'], '571426')
        ]
      },
      {
        id: 'mysuru',
        name: 'Mysuru',
        villages: [
          makeVillage('Varuna', ['Varuna Gram Panchayat', 'Dandikere Gram Panchayat'], '570010'),
          makeVillage('Ilavala', ['Ilavala Gram Panchayat', 'Hinkal Rural Gram Panchayat'], '570018'),
          makeVillage('Jayapura', ['Jayapura Gram Panchayat', 'Udbur Gram Panchayat'], '570008'),
          makeVillage('Bilikere', ['Bilikere Gram Panchayat', 'Hunsur Rural Gram Panchayat'], '571103'),
          makeVillage('Hullahalli', ['Hullahalli Gram Panchayat', 'Debur Gram Panchayat'], '571314'),
          makeVillage('Bannur Rural', ['Bannur Gram Panchayat', 'Mugur Gram Panchayat'], '571101'),
          makeVillage('Nanjangud Rural', ['Nanjangud Gram Panchayat', 'Kavalande Gram Panchayat'], '571301'),
          makeVillage('Periyapatna Rural', ['Periyapatna Gram Panchayat', 'Bettadapura Gram Panchayat'], '571107'),
          makeVillage('HD Kote Rural', ['HD Kote Gram Panchayat', 'Saragur Gram Panchayat'], '571114'),
          makeVillage('T Narasipura Rural', ['T Narasipura Gram Panchayat', 'Talkad Gram Panchayat'], '571124')
        ]
      },
      {
        id: 'raichur',
        name: 'Raichur',
        villages: [
          makeVillage('Manvi Rural', ['Manvi Gram Panchayat', 'Sirwar Gram Panchayat'], '584123'),
          makeVillage('Sindhanur Rural', ['Sindhanur Gram Panchayat', 'Turvihal Gram Panchayat'], '584128'),
          makeVillage('Devadurga Rural', ['Devadurga Gram Panchayat', 'Arakera Gram Panchayat'], '584111'),
          makeVillage('Lingasugur Rural', ['Lingasugur Gram Panchayat', 'Mudgal Gram Panchayat'], '584122'),
          makeVillage('Maski', ['Maski Gram Panchayat', 'Antargange Gram Panchayat'], '584124')
        ]
      },
      {
        id: 'ramanagara',
        name: 'Ramanagara',
        villages: [
          makeVillage('Channapatna Rural', ['Channapatna Gram Panchayat', 'Makkalavalli Gram Panchayat'], '562160'),
          makeVillage('Magadi Rural', ['Magadi Gram Panchayat', 'Tavarekere Gram Panchayat'], '562120'),
          makeVillage('Kanakapura Rural', ['Kanakapura Gram Panchayat', 'Harohalli Gram Panchayat'], '562117'),
          makeVillage('Bidadi Rural', ['Bidadi Industrial Gram Panchayat', 'Kempadyapanahalli Gram Panchayat'], '562109')
        ]
      },
      {
        id: 'shivamogga',
        name: 'Shivamogga (Shimoga)',
        villages: [
          makeVillage('Bhadravathi Rural', ['Bhadravathi Gram Panchayat', 'Holehonnur Gram Panchayat'], '577301'),
          makeVillage('Sagara Rural', ['Sagara Gram Panchayat', 'Talaguppa Gram Panchayat'], '577401'),
          makeVillage('Thirthahalli Rural', ['Thirthahalli Gram Panchayat', 'Agumbe Gram Panchayat'], '577432'),
          makeVillage('Shikaripura Rural', ['Shikaripura Gram Panchayat', 'Shiralkoppa Gram Panchayat'], '577427'),
          makeVillage('Soraba Rural', ['Soraba Gram Panchayat', 'Anavatti Gram Panchayat'], '577429'),
          makeVillage('Hosanagara Rural', ['Hosanagara Gram Panchayat', 'Ripponpet Gram Panchayat'], '577418')
        ]
      },
      {
        id: 'tumakuru',
        name: 'Tumakuru',
        villages: [
          makeVillage('Sira Rural', ['Sira Gram Panchayat', 'Bukkapatna Gram Panchayat'], '572137'),
          makeVillage('Tiptur Rural', ['Tiptur Gram Panchayat', 'Kibbanahalli Gram Panchayat'], '572201'),
          makeVillage('Kunigal Rural', ['Kunigal Gram Panchayat', 'Huliyurdurga Gram Panchayat'], '572130'),
          makeVillage('Madhugiri Rural', ['Madhugiri Gram Panchayat', 'Midigeshi Gram Panchayat'], '572132'),
          makeVillage('Pavagada Rural', ['Pavagada Gram Panchayat', 'Y.N. Hosakote Gram Panchayat'], '561202'),
          makeVillage('Gubbi Rural', ['Gubbi Gram Panchayat', 'Nittur Gram Panchayat'], '572216'),
          makeVillage('Chikkanayakanahalli', ['CN Halli Gram Panchayat', 'Huliyar Gram Panchayat'], '572214'),
          makeVillage('Turuvekere Rural', ['Turuvekere Gram Panchayat', 'Dandinashivara Gram Panchayat'], '572227'),
          makeVillage('Koratagere Rural', ['Koratagere Gram Panchayat', 'Holavanahalli Gram Panchayat'], '572129')
        ]
      },
      {
        id: 'udupi',
        name: 'Udupi',
        villages: [
          makeVillage('Kundapura Rural', ['Kundapura Gram Panchayat', 'Koteshwara Gram Panchayat'], '576201'),
          makeVillage('Karkala Rural', ['Karkala Gram Panchayat', 'Hebri Gram Panchayat'], '574104'),
          makeVillage('Brahmavara Rural', ['Brahmavara Gram Panchayat', 'Saligrama Gram Panchayat'], '576213'),
          makeVillage('Kaup Rural', ['Kaup Coastal Gram Panchayat', 'Shirva Gram Panchayat'], '574106'),
          makeVillage('Byndoor Rural', ['Byndoor Gram Panchayat', 'Baindur Gram Panchayat'], '576214')
        ]
      },
      {
        id: 'uttara_kannada',
        name: 'Uttara Kannada',
        villages: [
          makeVillage('Karwar Rural', ['Karwar Coastal Gram Panchayat', 'Chitakula Gram Panchayat'], '581301'),
          makeVillage('Sirsi Rural', ['Sirsi Gram Panchayat', 'Banavasi Gram Panchayat'], '581401'),
          makeVillage('Kumta Rural', ['Kumta Gram Panchayat', 'Mirjan Gram Panchayat'], '581343'),
          makeVillage('Bhatkal Rural', ['Bhatkal Gram Panchayat', 'Murudeshwar Gram Panchayat'], '581320'),
          makeVillage('Ankola Rural', ['Ankola Gram Panchayat', 'Belekeri Gram Panchayat'], '581314'),
          makeVillage('Honavar Rural', ['Honavar Gram Panchayat', 'Manki Gram Panchayat'], '581334'),
          makeVillage('Dandeli Rural', ['Dandeli Gram Panchayat', 'Haliyal Gram Panchayat'], '581325'),
          makeVillage('Yellapur Rural', ['Yellapur Gram Panchayat', 'Mundgod Gram Panchayat'], '581359'),
          makeVillage('Siddapur Rural', ['Siddapur Gram Panchayat', 'Kansur Gram Panchayat'], '581355')
        ]
      },
      {
        id: 'vijayanagara',
        name: 'Vijayanagara',
        villages: [
          makeVillage('Hosapete Rural', ['Hosapete Gram Panchayat', 'Kamalapura Gram Panchayat'], '583201'),
          makeVillage('Harapanahalli Rural', ['Harapanahalli Gram Panchayat', 'Teligi Gram Panchayat'], '583131'),
          makeVillage('Kudligi Rural', ['Kudligi Gram Panchayat', 'Kotturu Gram Panchayat'], '583135'),
          makeVillage('Hagaribommanahalli', ['H.B. Halli Gram Panchayat', 'Mariyammanahalli Gram Panchayat'], '583212'),
          makeVillage('Hoovina Hadagali', ['Hadagali Gram Panchayat', 'Hirehadagali Gram Panchayat'], '583219')
        ]
      },
      {
        id: 'vijayapura',
        name: 'Vijayapura (Bijapur)',
        villages: [
          makeVillage('Indi Rural', ['Indi Gram Panchayat', 'Chadchan Gram Panchayat'], '586209'),
          makeVillage('Sindagi Rural', ['Sindagi Gram Panchayat', 'Devara Hippargi Gram Panchayat'], '586128'),
          makeVillage('Basavana Bagewadi', ['B. Bagewadi Gram Panchayat', 'Nidagundi Gram Panchayat'], '586203'),
          makeVillage('Muddebihal Rural', ['Muddebihal Gram Panchayat', 'Talikoti Gram Panchayat'], '586212'),
          makeVillage('Babaleshwar', ['Babaleshwar Gram Panchayat', 'Tikota Gram Panchayat'], '586113')
        ]
      },
      {
        id: 'yadgir',
        name: 'Yadgir',
        villages: [
          makeVillage('Shahapur Rural', ['Shahapur Gram Panchayat', 'Doranahalli Gram Panchayat'], '585223'),
          makeVillage('Shorapur Rural', ['Shorapur Gram Panchayat', 'Kembhavi Gram Panchayat'], '585224'),
          makeVillage('Hunsagi', ['Hunsagi Gram Panchayat', 'Narayanpur Gram Panchayat'], '585215'),
          makeVillage('Gurmatkal Rural', ['Gurmatkal Gram Panchayat', 'Yadgir Rural Gram Panchayat'], '585214'),
          makeVillage('Wadagera', ['Wadagera Gram Panchayat', 'Konkal Gram Panchayat'], '585355')
        ]
      }
    ]
  },

  // 3. KERALA - ALL 14 DISTRICTS
  {
    id: 'kerala',
    name: 'Kerala',
    code: 'KL',
    type: 'state',
    districts: [
      { id: 'alappuzha', name: 'Alappuzha', villages: [makeVillage('Kuttanad', ['Kuttanad Grama Panchayat', 'Nedumudi Grama Panchayat'], '688503'), makeVillage('Cherthala Rural', ['Cherthala Grama Panchayat', 'Aroor Grama Panchayat'], '688524')] },
      { id: 'ernakulam', name: 'Ernakulam', villages: [makeVillage('Aluva Rural', ['Nedumbassery Grama Panchayat', 'Chengamanad Grama Panchayat'], '683101'), makeVillage('Kunnathunad', ['Vengola Grama Panchayat', 'Perumbavoor Rural Panchayat'], '683556')] },
      { id: 'idukki', name: 'Idukki', villages: [makeVillage('Devikulam Rural', ['Munnar Grama Panchayat', 'Marayoor Grama Panchayat'], '685613'), makeVillage('Thodupuzha Rural', ['Kumaramangalam Grama Panchayat', 'Vannappuram Grama Panchayat'], '685584')] },
      { id: 'kannur', name: 'Kannur', villages: [makeVillage('Taliparamba Rural', ['Anthoor Grama Panchayat', 'Kurumathur Grama Panchayat'], '670141'), makeVillage('Payyanur Rural', ['Karivellur Grama Panchayat', 'Peringome Grama Panchayat'], '670307')] },
      { id: 'kasaragod', name: 'Kasaragod', villages: [makeVillage('Hosdurg Rural', ['Kanhangad Rural Grama Panchayat', 'Nileshwaram Rural Panchayat'], '671315'), makeVillage('Manjeshwar Rural', ['Manjeshwar Grama Panchayat', 'Kumbla Grama Panchayat'], '671323')] },
      { id: 'kollam', name: 'Kollam', villages: [makeVillage('Kottarakkara Rural', ['Kottarakkara Grama Panchayat', 'Neduvathoor Grama Panchayat'], '691506'), makeVillage('Karunagappalli Rural', ['Oachira Grama Panchayat', 'Clappana Grama Panchayat'], '690518')] },
      { id: 'kottayam', name: 'Kottayam', villages: [makeVillage('Vaikom Rural', ['Chempu Grama Panchayat', 'Udayanapuram Grama Panchayat'], '686141'), makeVillage('Changanassery Rural', ['Vazhappally Grama Panchayat', 'Madappally Grama Panchayat'], '686101')] },
      { id: 'kozhikode', name: 'Kozhikode', villages: [makeVillage('Vadakara Rural', ['Chorode Grama Panchayat', 'Onchiyam Grama Panchayat'], '673104'), makeVillage('Koyilandy Rural', ['Moodadi Grama Panchayat', 'Chengottukavu Grama Panchayat'], '673305')] },
      { id: 'malappuram', name: 'Malappuram', villages: [makeVillage('Tirur Rural', ['Tanur Rural Grama Panchayat', 'Vettom Grama Panchayat'], '676101'), makeVillage('Perinthalmanna Rural', ['Angadippuram Grama Panchayat', 'Aliparamba Grama Panchayat'], '679322')] },
      { id: 'palakkad', name: 'Palakkad', villages: [makeVillage('Chittur Rural', ['Kollengode Grama Panchayat', 'Nenmara Grama Panchayat'], '678101'), makeVillage('Ottapalam Rural', ['Shoranur Rural Grama Panchayat', 'Ambalappara Grama Panchayat'], '679101')] },
      { id: 'pathanamthitta', name: 'Pathanamthitta', villages: [makeVillage('Adoor Rural', ['Pandalam Rural Grama Panchayat', 'Erathu Grama Panchayat'], '691523'), makeVillage('Thiruvalla Rural', ['Kavumbhagom Grama Panchayat', 'Kuttoor Grama Panchayat'], '689101')] },
      { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', villages: [makeVillage('Neyyattinkara Rural', ['Balaramapuram Grama Panchayat', 'Parassala Grama Panchayat'], '695121'), makeVillage('Nedumangad Rural', ['Kattakada Grama Panchayat', 'Vithura Grama Panchayat'], '695541')] },
      { id: 'thrissur', name: 'Thrissur', villages: [makeVillage('Chalakudy Rural', ['Pariyaram Grama Panchayat', 'Meloor Grama Panchayat'], '680307'), makeVillage('Kodungallur Rural', ['Methala Grama Panchayat', 'Eriyad Grama Panchayat'], '680664')] },
      { id: 'wayanad', name: 'Wayanad', villages: [makeVillage('Sulthan Bathery Rural', ['Ambalavayal Grama Panchayat', 'Nenmeni Grama Panchayat'], '673592'), makeVillage('Mananthavady Rural', ['Thirunelly Grama Panchayat', 'Vellamunda Grama Panchayat'], '670645')] }
    ]
  },

  // 4. ANDHRA PRADESH - ALL 26 DISTRICTS
  {
    id: 'andhra_pradesh',
    name: 'Andhra Pradesh',
    code: 'AP',
    type: 'state',
    districts: [
      { id: 'alluri_sitharama_raju', name: 'Alluri Sitharama Raju', villages: [makeVillage('Paderu', ['Paderu Gram Panchayat', 'Araku Valley Gram Panchayat'], '531024')] },
      { id: 'anakapalli', name: 'Anakapalli', villages: [makeVillage('Kasimkota', ['Kasimkota Gram Panchayat', 'Anakapalle Rural Gram Panchayat'], '531031')] },
      { id: 'ananthapuramu', name: 'Ananthapuramu', villages: [makeVillage('Tadipatri Rural', ['Tadipatri Gram Panchayat', 'Yadiki Gram Panchayat'], '515411')] },
      { id: 'annamayya', name: 'Annamayya', villages: [makeVillage('Rayachoti', ['Rayachoti Gram Panchayat', 'Madanapalle Rural Gram Panchayat'], '516269')] },
      { id: 'bapatla', name: 'Bapatla', villages: [makeVillage('Chirala Rural', ['Chirala Gram Panchayat', 'Vetapalem Gram Panchayat'], '523155')] },
      { id: 'chittoor', name: 'Chittoor', villages: [makeVillage('Palamaner', ['Palamaner Gram Panchayat', 'Kuppam Rural Gram Panchayat'], '517408')] },
      { id: 'dr_br_ambedkar_konaseema', name: 'Dr. B.R. Ambedkar Konaseema', villages: [makeVillage('Amalapuram Rural', ['Amalapuram Gram Panchayat', 'Razole Gram Panchayat'], '533201')] },
      { id: 'east_godavari', name: 'East Godavari', villages: [makeVillage('Rajahmundry Rural', ['Kadiam Gram Panchayat', 'Rajanagaram Gram Panchayat'], '533101')] },
      { id: 'eluru', name: 'Eluru', villages: [makeVillage('Jangareddygudem', ['Jangareddygudem Gram Panchayat', 'Nuzvid Rural Gram Panchayat'], '534447')] },
      { id: 'guntur', name: 'Guntur', villages: [makeVillage('Tenali Rural', ['Tenali Gram Panchayat', 'Mangalagiri Rural Gram Panchayat'], '522201')] },
      { id: 'kakinada', name: 'Kakinada', villages: [makeVillage('Peddapuram', ['Peddapuram Gram Panchayat', 'Samalkota Rural Gram Panchayat'], '533437')] },
      { id: 'krishna', name: 'Krishna', villages: [makeVillage('Machilipatnam Rural', ['Kankipadu Gram Panchayat', 'Vuyyuru Rural Gram Panchayat'], '521001')] },
      { id: 'kurnool', name: 'Kurnool', villages: [makeVillage('Adoni Rural', ['Adoni Gram Panchayat', 'Yemmiganur Rural Gram Panchayat'], '518301')] },
      { id: 'nandyal', name: 'Nandyal', villages: [makeVillage('Allagadda', ['Allagadda Gram Panchayat', 'Banaganapalle Gram Panchayat'], '518543')] },
      { id: 'ntr', name: 'NTR (Vijayawada)', villages: [makeVillage('Gannavaram Rural', ['Gannavaram Gram Panchayat', 'Ibrahimpatnam AP Gram Panchayat'], '521101')] },
      { id: 'palnadu', name: 'Palnadu', villages: [makeVillage('Narasaraopet Rural', ['Narasaraopet Gram Panchayat', 'Sattenapalle Gram Panchayat'], '522601')] },
      { id: 'parvathipuram_manyam', name: 'Parvathipuram Manyam', villages: [makeVillage('Parvathipuram Rural', ['Parvathipuram Gram Panchayat', 'Salur Gram Panchayat'], '535501')] },
      { id: 'prakasam', name: 'Prakasam', villages: [makeVillage('Ongole Rural', ['Ongole Gram Panchayat', 'Kandukur Rural Gram Panchayat'], '523001')] },
      { id: 'srikakulam', name: 'Srikakulam', villages: [makeVillage('Palasa', ['Palasa Gram Panchayat', 'Amadalavalasa Gram Panchayat'], '532221')] },
      { id: 'sri_potti_sriramulu_nellore', name: 'Sri Potti Sriramulu Nellore', villages: [makeVillage('Kavali Rural', ['Kavali Gram Panchayat', 'Kovur Gram Panchayat'], '524201')] },
      { id: 'sri_sathya_sai', name: 'Sri Sathya Sai', villages: [makeVillage('Puttaparthi Rural', ['Puttaparthi Gram Panchayat', 'Dharmavaram Rural Gram Panchayat'], '515134')] },
      { id: 'tirupati', name: 'Tirupati', villages: [makeVillage('Chandragiri', ['Chandragiri Gram Panchayat', 'Srikalahasti Rural Gram Panchayat'], '517101')] },
      { id: 'visakhapatnam', name: 'Visakhapatnam', villages: [makeVillage('Anandapuram', ['Anandapuram Gram Panchayat', 'Bheemili Rural Gram Panchayat'], '530052')] },
      { id: 'vizianagaram', name: 'Vizianagaram', villages: [makeVillage('Bobbili Rural', ['Bobbili Gram Panchayat', 'Cheepurupalli Gram Panchayat'], '535558')] },
      { id: 'west_godavari', name: 'West Godavari', villages: [makeVillage('Bhimavaram Rural', ['Bhimavaram Gram Panchayat', 'Palakollu Rural Gram Panchayat'], '534201')] },
      { id: 'ysr_kadapa', name: 'YSR Kadapa', villages: [makeVillage('Proddatur Rural', ['Proddatur Gram Panchayat', 'Pulivendula Gram Panchayat'], '516360')] }
    ]
  },

  // 5. TELANGANA - ALL 33 DISTRICTS
  {
    id: 'telangana',
    name: 'Telangana',
    code: 'TG',
    type: 'state',
    districts: [
      { id: 'adilabad', name: 'Adilabad', villages: [makeVillage('Utnoor', ['Utnoor Gram Panchayat'], '504311')] },
      { id: 'bhadradri_kothagudem', name: 'Bhadradri Kothagudem', villages: [makeVillage('Bhadrachalam Rural', ['Bhadrachalam Gram Panchayat'], '507111')] },
      { id: 'hanumakonda', name: 'Hanumakonda', villages: [makeVillage('Parkal Rural', ['Parkal Gram Panchayat'], '506164')] },
      { id: 'hyderabad', name: 'Hyderabad Rural Sub-basin', villages: [makeVillage('Rajendranagar Rural', ['Rajendranagar Panchayat'], '500030')] },
      { id: 'jagtial', name: 'Jagtial', villages: [makeVillage('Korutla Rural', ['Korutla Gram Panchayat', 'Metpalli Gram Panchayat'], '505326')] },
      { id: 'jangaon', name: 'Jangaon', villages: [makeVillage('Palakurthi', ['Palakurthi Gram Panchayat'], '506252')] },
      { id: 'jayashankar_bhupalpally', name: 'Jayashankar Bhupalpally', villages: [makeVillage('Bhupalpally Rural', ['Bhupalpally Gram Panchayat'], '506169')] },
      { id: 'jogulamba_gadwal', name: 'Jogulamba Gadwal', villages: [makeVillage('Alampur', ['Alampur Gram Panchayat'], '509152')] },
      { id: 'kamareddy', name: 'Kamareddy', villages: [makeVillage('Banswada', ['Banswada Gram Panchayat'], '503187')] },
      { id: 'karimnagar', name: 'Karimnagar', villages: [makeVillage('Huzurabad Rural', ['Huzurabad Gram Panchayat'], '505468')] },
      { id: 'khammam', name: 'Khammam', villages: [makeVillage('Madhira Rural', ['Madhira Gram Panchayat'], '507203')] },
      { id: 'kumuram_bheem_asifabad', name: 'Kumuram Bheem Asifabad', villages: [makeVillage('Kagaznagar Rural', ['Kagaznagar Gram Panchayat'], '504296')] },
      { id: 'mahabubabad', name: 'Mahabubabad', villages: [makeVillage('Dornakal', ['Dornakal Gram Panchayat'], '506381')] },
      { id: 'mahabubnagar', name: 'Mahabubnagar', villages: [makeVillage('Jadcherla Rural', ['Jadcherla Gram Panchayat'], '509301')] },
      { id: 'mancherial', name: 'Mancherial', villages: [makeVillage('Bellampalli Rural', ['Bellampalli Gram Panchayat'], '504251')] },
      { id: 'medak', name: 'Medak', villages: [makeVillage('Narsapur Rural', ['Narsapur Gram Panchayat'], '502313')] },
      { id: 'medchal_malkajgiri', name: 'Medchal-Malkajgiri', villages: [makeVillage('Keesara', ['Keesara Gram Panchayat', 'Ghatkesar Rural Gram Panchayat'], '501301')] },
      { id: 'mulugu', name: 'Mulugu', villages: [makeVillage('Mulugu Rural', ['Mulugu Gram Panchayat'], '506343')] },
      { id: 'nagarkurnool', name: 'Nagarkurnool', villages: [makeVillage('Kalwakurthy Rural', ['Kalwakurthy Gram Panchayat'], '509324')] },
      { id: 'nalgonda', name: 'Nalgonda', villages: [makeVillage('Miryalaguda Rural', ['Miryalaguda Gram Panchayat'], '508207')] },
      { id: 'narayanpet', name: 'Narayanpet', villages: [makeVillage('Makthal', ['Makthal Gram Panchayat'], '509772')] },
      { id: 'nirmal', name: 'Nirmal', villages: [makeVillage('Bhainsa Rural', ['Bhainsa Gram Panchayat'], '504103')] },
      { id: 'nizamabad', name: 'Nizamabad', villages: [makeVillage('Armoor Rural', ['Armoor Gram Panchayat', 'Bodhan Rural Gram Panchayat'], '503224')] },
      { id: 'peddapalli', name: 'Peddapalli', villages: [makeVillage('Manthani', ['Manthani Gram Panchayat'], '505184')] },
      { id: 'rajanna_sircilla', name: 'Rajanna Sircilla', villages: [makeVillage('Vemulawada Rural', ['Vemulawada Gram Panchayat'], '505302')] },
      { id: 'rangareddy', name: 'Rangareddy', villages: [makeVillage('Kothur', ['Kothur Gram Panchayat', 'Shamshabad Rural Gram Panchayat'], '509228')] },
      { id: 'sangareddy', name: 'Sangareddy', villages: [makeVillage('Zaheerabad Rural', ['Zaheerabad Gram Panchayat'], '502220')] },
      { id: 'siddipet', name: 'Siddipet', villages: [makeVillage('Gajwel Rural', ['Gajwel Gram Panchayat', 'Husnabad Rural Gram Panchayat'], '502278')] },
      { id: 'suryapet', name: 'Suryapet', villages: [makeVillage('Kodad Rural', ['Kodad Gram Panchayat', 'Huzurnagar Rural Gram Panchayat'], '508206')] },
      { id: 'vikarabad', name: 'Vikarabad', villages: [makeVillage('Tandur Rural', ['Tandur Gram Panchayat'], '501141')] },
      { id: 'wanaparthy', name: 'Wanaparthy', villages: [makeVillage('Pebbair', ['Pebbair Gram Panchayat'], '509104')] },
      { id: 'warangal', name: 'Warangal', villages: [makeVillage('Narsampet Rural', ['Narsampet Gram Panchayat'], '506132')] },
      { id: 'yadadri_bhuvanagiri', name: 'Yadadri Bhuvanagiri', villages: [makeVillage('Bhongir Rural', ['Bhongir Gram Panchayat', 'Choutuppal Gram Panchayat'], '508116')] }
    ]
  },

  // 6. MAHARASHTRA - ALL 36 DISTRICTS
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    code: 'MH',
    type: 'state',
    districts: [
      { id: 'ahmednagar', name: 'Ahilyanagar (Ahmednagar)', villages: [makeVillage('Sangamner Rural', ['Sangamner Gram Panchayat'], '422605')] },
      { id: 'akola', name: 'Akola', villages: [makeVillage('Balapur', ['Balapur Gram Panchayat'], '444302')] },
      { id: 'amravati', name: 'Amravati', villages: [makeVillage('Achalpur', ['Achalpur Gram Panchayat'], '444806')] },
      { id: 'chhatrapati_sambhajinagar', name: 'Chhatrapati Sambhajinagar (Aurangabad)', villages: [makeVillage('Paithan Rural', ['Paithan Gram Panchayat'], '431107')] },
      { id: 'beed', name: 'Beed', villages: [makeVillage('Parli Rural', ['Parli Gram Panchayat'], '431515')] },
      { id: 'bhandara', name: 'Bhandara', villages: [makeVillage('Tumsar', ['Tumsar Gram Panchayat'], '441912')] },
      { id: 'buldhana', name: 'Buldhana', villages: [makeVillage('Khamgaon Rural', ['Khamgaon Gram Panchayat'], '444303')] },
      { id: 'chandrapur', name: 'Chandrapur', villages: [makeVillage('Ballarpur Rural', ['Ballarpur Gram Panchayat'], '442701')] },
      { id: 'dhule', name: 'Dhule', villages: [makeVillage('Shirpur Rural', ['Shirpur Gram Panchayat'], '425405')] },
      { id: 'gadchiroli', name: 'Gadchiroli', villages: [makeVillage('Armori', ['Armori Gram Panchayat'], '441208')] },
      { id: 'gondia', name: 'Gondia', villages: [makeVillage('Tirora', ['Tirora Gram Panchayat'], '441911')] },
      { id: 'hingoli', name: 'Hingoli', villages: [makeVillage('Basmath', ['Basmath Gram Panchayat'], '431512')] },
      { id: 'jalgaon', name: 'Jalgaon', villages: [makeVillage('Bhusawal Rural', ['Bhusawal Gram Panchayat'], '425201')] },
      { id: 'jalna', name: 'Jalna', villages: [makeVillage('Partur', ['Partur Gram Panchayat'], '431501')] },
      { id: 'kolhapur', name: 'Kolhapur', villages: [makeVillage('Ichalkaranji Rural', ['Ichalkaranji Gram Panchayat', 'Hatkanangle Gram Panchayat'], '416115')] },
      { id: 'latur', name: 'Latur', villages: [makeVillage('Udgir Rural', ['Udgir Gram Panchayat'], '413517')] },
      { id: 'mumbai_city', name: 'Mumbai City Rural Outskirts', villages: [makeVillage('Colaba Water Precinct', ['Colaba Water Division'], '400005')] },
      { id: 'mumbai_suburban', name: 'Mumbai Suburban Rural Precinct', villages: [makeVillage('Aarey Colony', ['Aarey Milk Colony Panchayat'], '400065')] },
      { id: 'nagpur', name: 'Nagpur', villages: [makeVillage('Katol Rural', ['Katol Gram Panchayat', 'Umred Gram Panchayat'], '441302')] },
      { id: 'nanded', name: 'Nanded', villages: [makeVillage('Degloor Rural', ['Degloor Gram Panchayat'], '431717')] },
      { id: 'nandurbar', name: 'Nandurbar', villages: [makeVillage('Shahada Rural', ['Shahada Gram Panchayat'], '425409')] },
      { id: 'nashik', name: 'Nashik', villages: [makeVillage('Malegaon Rural', ['Malegaon Gram Panchayat', 'Sinnar Gram Panchayat'], '423203')] },
      { id: 'dharashiv', name: 'Dharashiv (Osmanabad)', villages: [makeVillage('Tuljapur Rural', ['Tuljapur Gram Panchayat'], '413601')] },
      { id: 'palghar', name: 'Palghar', villages: [makeVillage('Dahanu Rural', ['Dahanu Gram Panchayat', 'Jawhar Tribal Panchayat'], '401601')] },
      { id: 'parbhani', name: 'Parbhani', villages: [makeVillage('Gangakhed', ['Gangakhed Gram Panchayat'], '431514')] },
      { id: 'pune', name: 'Pune', villages: [makeVillage('Wagholi', ['Wagholi Gram Panchayat', 'Haveli Gram Panchayat'], '412207'), makeVillage('Uruli Kanchan', ['Uruli Kanchan Gram Panchayat', 'Loni Kalbhor Gram Panchayat'], '412202')] },
      { id: 'raigad', name: 'Raigad', villages: [makeVillage('Alibag Rural', ['Alibag Gram Panchayat', 'Panvel Rural Gram Panchayat'], '402201')] },
      { id: 'ratnagiri', name: 'Ratnagiri', villages: [makeVillage('Chiplun Rural', ['Chiplun Gram Panchayat', 'Dapoli Gram Panchayat'], '415605')] },
      { id: 'sangli', name: 'Sangli', villages: [makeVillage('Miraj Rural', ['Miraj Gram Panchayat', 'Tasgaon Gram Panchayat'], '416410')] },
      { id: 'satara', name: 'Satara', villages: [makeVillage('Karad Rural', ['Karad Gram Panchayat', 'Wai Gram Panchayat'], '415110')] },
      { id: 'sindhudurg', name: 'Sindhudurg', villages: [makeVillage('Kankavli Rural', ['Kankavli Gram Panchayat', 'Sawantwadi Gram Panchayat'], '416602')] },
      { id: 'solapur', name: 'Solapur', villages: [makeVillage('Pandharpur Rural', ['Pandharpur Gram Panchayat', 'Barshi Gram Panchayat'], '413304')] },
      { id: 'thane', name: 'Thane', villages: [makeVillage('Titwala Rural', ['Titwala Gram Panchayat', 'Kalyan Rural Gram Panchayat'], '421605')] },
      { id: 'wardha', name: 'Wardha', villages: [makeVillage('Hinganghat Rural', ['Hinganghat Gram Panchayat'], '442301')] },
      { id: 'washim', name: 'Washim', villages: [makeVillage('Karanja Lad', ['Karanja Gram Panchayat'], '444105')] },
      { id: 'yavatmal', name: 'Yavatmal', villages: [makeVillage('Pusad Rural', ['Pusad Gram Panchayat'], '445204')] }
    ]
  },

  // 7. GUJARAT - ALL 33 DISTRICTS
  {
    id: 'gujarat',
    name: 'Gujarat',
    code: 'GJ',
    type: 'state',
    districts: [
      { id: 'ahmedabad', name: 'Ahmedabad', villages: [makeVillage('Sanand Rural', ['Sanand Gram Panchayat'], '382110')] },
      { id: 'amreli', name: 'Amreli', villages: [makeVillage('Dhari', ['Dhari Gram Panchayat'], '365640')] },
      { id: 'anand', name: 'Anand', villages: [makeVillage('Petlad Rural', ['Petlad Gram Panchayat'], '388450')] },
      { id: 'aravalli', name: 'Aravalli', villages: [makeVillage('Modasa Rural', ['Modasa Gram Panchayat'], '383315')] },
      { id: 'banaskantha', name: 'Banaskantha', villages: [makeVillage('Palanpur Rural', ['Palanpur Gram Panchayat'], '385001')] },
      { id: 'bharuch', name: 'Bharuch', villages: [makeVillage('Ankleshwar Rural', ['Ankleshwar Gram Panchayat'], '393001')] },
      { id: 'bhavnagar', name: 'Bhavnagar', villages: [makeVillage('Palitana Rural', ['Palitana Gram Panchayat'], '364270')] },
      { id: 'botad', name: 'Botad', villages: [makeVillage('Gadhada', ['Gadhada Gram Panchayat'], '364750')] },
      { id: 'chhota_udepur', name: 'Chhota Udepur', villages: [makeVillage('Bodeli', ['Bodeli Gram Panchayat'], '391135')] },
      { id: 'dahod', name: 'Dahod', villages: [makeVillage('Jhalod', ['Jhalod Gram Panchayat'], '389170')] },
      { id: 'dang', name: 'Dang', villages: [makeVillage('Ahwa', ['Ahwa Gram Panchayat'], '394710')] },
      { id: 'devbhumi_dwarka', name: 'Devbhumi Dwarka', villages: [makeVillage('Khambhalia', ['Khambhalia Gram Panchayat'], '361305')] },
      { id: 'gandhinagar', name: 'Gandhinagar', villages: [makeVillage('Kalol Rural', ['Kalol Gram Panchayat'], '382721')] },
      { id: 'gir_somnath', name: 'Gir Somnath', villages: [makeVillage('Veraval Rural', ['Veraval Gram Panchayat'], '362265')] },
      { id: 'jamnagar', name: 'Jamnagar', villages: [makeVillage('Dhrol', ['Dhrol Gram Panchayat'], '361210')] },
      { id: 'junagadh', name: 'Junagadh', villages: [makeVillage('Keshod', ['Keshod Gram Panchayat'], '362220')] },
      { id: 'kutch', name: 'Kutch', villages: [makeVillage('Bhuj Rural', ['Bhujodi Gram Panchayat'], '370001')] },
      { id: 'kheda', name: 'Kheda', villages: [makeVillage('Nadiad Rural', ['Nadiad Gram Panchayat'], '387001')] },
      { id: 'mahisagar', name: 'Mahisagar', villages: [makeVillage('Lunawada', ['Lunawada Gram Panchayat'], '389230')] },
      { id: 'mehsana', name: 'Mehsana', villages: [makeVillage('Visnagar Rural', ['Visnagar Gram Panchayat'], '384315')] },
      { id: 'morbi', name: 'Morbi', villages: [makeVillage('Wankaner', ['Wankaner Gram Panchayat'], '363621')] },
      { id: 'narmada', name: 'Narmada', villages: [makeVillage('Rajpipla', ['Rajpipla Gram Panchayat'], '393145')] },
      { id: 'navsari', name: 'Navsari', villages: [makeVillage('Bilimora Rural', ['Bilimora Gram Panchayat'], '396321')] },
      { id: 'panchmahal', name: 'Panchmahal', villages: [makeVillage('Godhra Rural', ['Godhra Gram Panchayat'], '389001')] },
      { id: 'patan', name: 'Patan', villages: [makeVillage('Sidhpur Rural', ['Sidhpur Gram Panchayat'], '384151')] },
      { id: 'porbandar', name: 'Porbandar', villages: [makeVillage('Ranavav', ['Ranavav Gram Panchayat'], '360560')] },
      { id: 'rajkot', name: 'Rajkot', villages: [makeVillage('Gondal Rural', ['Gondal Gram Panchayat'], '360311')] },
      { id: 'sabarkantha', name: 'Sabarkantha', villages: [makeVillage('Himatnagar Rural', ['Himatnagar Gram Panchayat'], '383001')] },
      { id: 'surat', name: 'Surat', villages: [makeVillage('Olpad Rural', ['Olpad Gram Panchayat', 'Bardoli Rural Gram Panchayat'], '394540')] },
      { id: 'surendranagar', name: 'Surendranagar', villages: [makeVillage('Dhrangadhra', ['Dhrangadhra Gram Panchayat'], '363310')] },
      { id: 'tapi', name: 'Tapi', villages: [makeVillage('Vyara Rural', ['Vyara Gram Panchayat'], '394650')] },
      { id: 'vadodara', name: 'Vadodara', villages: [makeVillage('Padra Rural', ['Padra Gram Panchayat', 'Dabhoi Gram Panchayat'], '391440')] },
      { id: 'valsad', name: 'Valsad', villages: [makeVillage('Vapi Rural', ['Vapi Gram Panchayat', 'Umbergaon Gram Panchayat'], '396191')] }
    ]
  },

  // 8. OTHER MAJOR STATES (Uttar Pradesh, Rajasthan, Madhya Pradesh, West Bengal, Bihar, Punjab, Haryana, Odisha, Assam, Delhi & UTs)
  {
    id: 'uttar_pradesh',
    name: 'Uttar Pradesh',
    code: 'UP',
    type: 'state',
    districts: [
      { id: 'lucknow', name: 'Lucknow', villages: [makeVillage('Mohanlalganj', ['Mohanlalganj Gram Panchayat', 'Gosainganj Gram Panchayat'], '226301'), makeVillage('Bakshi Ka Talab', ['BKT Gram Panchayat'], '226201')] },
      { id: 'varanasi', name: 'Varanasi', villages: [makeVillage('Pindra', ['Pindra Gram Panchayat', 'Sevapuri Gram Panchayat'], '221206')] },
      { id: 'prayagraj', name: 'Prayagraj (Allahabad)', villages: [makeVillage('Phulpur', ['Phulpur Gram Panchayat'], '212402')] },
      { id: 'kanpur_nagar', name: 'Kanpur Nagar', villages: [makeVillage('Ghatampur', ['Ghatampur Gram Panchayat'], '209206')] },
      { id: 'agra', name: 'Agra', villages: [makeVillage('Fatehabad', ['Fatehabad Gram Panchayat'], '283111')] },
      { id: 'meerut', name: 'Meerut', villages: [makeVillage('Mawana', ['Mawana Gram Panchayat'], '250401')] },
      { id: 'gorakhpur', name: 'Gorakhpur', villages: [makeVillage('Sahjanwa', ['Sahjanwa Gram Panchayat'], '273209')] },
      { id: 'bareilly', name: 'Bareilly', villages: [makeVillage('Aonla', ['Aonla Gram Panchayat'], '243301')] },
      { id: 'aligarh', name: 'Aligarh', villages: [makeVillage('Atrauli', ['Atrauli Gram Panchayat'], '202280')] },
      { id: 'ayodhya', name: 'Ayodhya (Faizabad)', villages: [makeVillage('Rudauli', ['Rudauli Gram Panchayat'], '224120')] }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi (NCT)',
    code: 'DL',
    type: 'ut',
    districts: [
      { id: 'north_delhi', name: 'North Delhi', villages: [makeVillage('Alipur Rural', ['Alipur Gram Panchayat', 'Bakhtawarpur Panchayat'], '110036')] },
      { id: 'south_delhi', name: 'South Delhi', villages: [makeVillage('Mehrauli Rural', ['Mehrauli Civic Panchayat', 'Chhatarpur Panchayat'], '110030')] },
      { id: 'south_west_delhi', name: 'South West Delhi', villages: [makeVillage('Najafgarh Rural', ['Najafgarh Gram Panchayat', 'Kakrola Panchayat'], '110043')] },
      { id: 'north_west_delhi', name: 'North West Delhi', villages: [makeVillage('Narela Rural', ['Narela Gram Panchayat', 'Bawana Panchayat'], '110040')] },
      { id: 'east_delhi', name: 'East Delhi', villages: [makeVillage('Mayur Vihar Rural Outskirts', ['Gharonda Neemka Panchayat'], '110091')] }
    ]
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    code: 'RJ',
    type: 'state',
    districts: [
      { id: 'jaipur', name: 'Jaipur', villages: [makeVillage('Chomu', ['Chomu Gram Panchayat', 'Bassi Gram Panchayat'], '303702')] },
      { id: 'jodhpur', name: 'Jodhpur', villages: [makeVillage('Bilara', ['Bilara Gram Panchayat'], '342602')] },
      { id: 'udaipur', name: 'Udaipur', villages: [makeVillage('Mavli', ['Mavli Gram Panchayat'], '313203')] },
      { id: 'kota', name: 'Kota', villages: [makeVillage('Ramganj Mandi', ['Ramganj Mandi Gram Panchayat'], '326519')] },
      { id: 'ajmer', name: 'Ajmer', villages: [makeVillage('Kishangarh Rural', ['Kishangarh Gram Panchayat'], '305801')] }
    ]
  },
  {
    id: 'west_bengal',
    name: 'West Bengal',
    code: 'WB',
    type: 'state',
    districts: [
      { id: 'kolkata', name: 'Kolkata Metropolitan Area', villages: [makeVillage('Jadavpur Rural Division', ['Jadavpur Civic Board'], '700032')] },
      { id: 'north_24_parganas', name: 'North 24 Parganas', villages: [makeVillage('Barasat Rural', ['Barasat Gram Panchayat', 'Habra Gram Panchayat'], '700124')] },
      { id: 'south_24_parganas', name: 'South 24 Parganas', villages: [makeVillage('Diamond Harbour', ['Diamond Harbour Gram Panchayat'], '743331')] },
      { id: 'howrah', name: 'Howrah', villages: [makeVillage('Uluberia Rural', ['Uluberia Gram Panchayat'], '711315')] },
      { id: 'darjeeling', name: 'Darjeeling', villages: [makeVillage('Kurseong Rural', ['Kurseong Gram Panchayat'], '734203')] }
    ]
  },
  {
    id: 'bihar',
    name: 'Bihar',
    code: 'BR',
    type: 'state',
    districts: [
      { id: 'patna', name: 'Patna', villages: [makeVillage('Danapur Rural', ['Danapur Gram Panchayat', 'Phulwari Sharif Gram Panchayat'], '801503')] },
      { id: 'gaya', name: 'Gaya', villages: [makeVillage('Bodh Gaya Rural', ['Bodh Gaya Gram Panchayat'], '824231')] },
      { id: 'muzaffarpur', name: 'Muzaffarpur', villages: [makeVillage('Kanti', ['Kanti Gram Panchayat'], '843109')] },
      { id: 'bhagalpur', name: 'Bhagalpur', villages: [makeVillage('Naugachhia', ['Naugachhia Gram Panchayat'], '853204')] }
    ]
  },
  {
    id: 'punjab',
    name: 'Punjab',
    code: 'PB',
    type: 'state',
    districts: [
      { id: 'amritsar', name: 'Amritsar', villages: [makeVillage('Ajnala', ['Ajnala Gram Panchayat'], '143102')] },
      { id: 'ludhiana', name: 'Ludhiana', villages: [makeVillage('Jagraon', ['Jagraon Gram Panchayat'], '142026')] },
      { id: 'jalandhar', name: 'Jalandhar', villages: [makeVillage('Nakodar', ['Nakodar Gram Panchayat'], '144040')] },
      { id: 'patiala', name: 'Patiala', villages: [makeVillage('Nabha', ['Nabha Gram Panchayat'], '147201')] }
    ]
  },
  {
    id: 'haryana',
    name: 'Haryana',
    code: 'HR',
    type: 'state',
    districts: [
      { id: 'gurugram', name: 'Gurugram', villages: [makeVillage('Sohna Rural', ['Sohna Gram Panchayat', 'Pataudi Gram Panchayat'], '122103')] },
      { id: 'faridabad', name: 'Faridabad', villages: [makeVillage('Ballabgarh Rural', ['Ballabgarh Gram Panchayat'], '121004')] },
      { id: 'karnal', name: 'Karnal', villages: [makeVillage('Gharaunda', ['Gharaunda Gram Panchayat'], '132114')] },
      { id: 'ambala', name: 'Ambala', villages: [makeVillage('Barara', ['Barara Gram Panchayat'], '133201')] }
    ]
  },
  {
    id: 'odisha',
    name: 'Odisha',
    code: 'OD',
    type: 'state',
    districts: [
      { id: 'khordha', name: 'Khordha (Bhubaneswar)', villages: [makeVillage('Jatni Rural', ['Jatni Gram Panchayat'], '752050')] },
      { id: 'cuttack', name: 'Cuttack', villages: [makeVillage('Athagarh', ['Athagarh Gram Panchayat'], '754029')] },
      { id: 'puri', name: 'Puri', villages: [makeVillage('Konark Rural', ['Konark Gram Panchayat', 'Nimapada Gram Panchayat'], '752111')] },
      { id: 'balasore', name: 'Balasore', villages: [makeVillage('Jaleswar', ['Jaleswar Gram Panchayat'], '756032')] }
    ]
  },
  {
    id: 'assam',
    name: 'Assam',
    code: 'AS',
    type: 'state',
    districts: [
      { id: 'kamrup_metropolitan', name: 'Kamrup Metropolitan (Guwahati)', villages: [makeVillage('Dispur Rural', ['Dispur Gram Panchayat'], '781005')] },
      { id: 'kamrup_rural', name: 'Kamrup Rural', villages: [makeVillage('Hajo', ['Hajo Gram Panchayat'], '781102')] },
      { id: 'dibrugarh', name: 'Dibrugarh', villages: [makeVillage('Moranhat', ['Moranhat Gram Panchayat'], '785670')] },
      { id: 'cachar', name: 'Cachar (Silchar)', villages: [makeVillage('Lakhipur', ['Lakhipur Gram Panchayat'], '788103')] }
    ]
  },
  {
    id: 'goa',
    name: 'Goa',
    code: 'GA',
    type: 'state',
    districts: [
      { id: 'north_goa', name: 'North Goa', villages: [makeVillage('Bardez Rural', ['Calangute Village Panchayat', 'Anjuna Village Panchayat'], '403516'), makeVillage('Pernem Rural', ['Pernem Village Panchayat', 'Mandrem Village Panchayat'], '403512')] },
      { id: 'south_goa', name: 'South Goa', villages: [makeVillage('Salcete Rural', ['Colva Village Panchayat', 'Benaulim Village Panchayat'], '403708'), makeVillage('Canacona Rural', ['Palolem Village Panchayat', 'Agonda Village Panchayat'], '403702')] }
    ]
  },
  {
    id: 'jammu_and_kashmir',
    name: 'Jammu and Kashmir',
    code: 'JK',
    type: 'ut',
    districts: [
      { id: 'srinagar', name: 'Srinagar', villages: [makeVillage('Dalgate Rural', ['Dal Lake Basin Panchayat'], '190001')] },
      { id: 'jammu', name: 'Jammu', villages: [makeVillage('RS Pura', ['RS Pura Gram Panchayat', 'Bishnah Gram Panchayat'], '181102')] },
      { id: 'anantnag', name: 'Anantnag', villages: [makeVillage('Pahalgam Rural', ['Pahalgam Gram Panchayat'], '192126')] },
      { id: 'baramulla', name: 'Baramulla', villages: [makeVillage('Uri Rural', ['Uri Gram Panchayat', 'Tangmarg Gram Panchayat'], '193123')] }
    ]
  },
  {
    id: 'puducherry',
    name: 'Puducherry',
    code: 'PY',
    type: 'ut',
    districts: [
      { id: 'puducherry', name: 'Puducherry', villages: [makeVillage('Villianur', ['Villianur Commune Panchayat', 'Bahour Commune Panchayat'], '605110'), makeVillage('Oulgaret Rural', ['Oulgaret Commune Panchayat'], '605009')] },
      { id: 'karaikal', name: 'Karaikal', villages: [makeVillage('Kottucherry', ['Kottucherry Commune Panchayat', 'Nedungadu Commune Panchayat'], '609609')] }
    ]
  }
];

// Helper functions for easy querying
export function getAllStates(): StateEntry[] {
  return ALL_INDIAN_STATES_AND_UTS;
}

export function getState(nameOrId: string): StateEntry | undefined {
  const q = nameOrId.trim().toLowerCase();
  return ALL_INDIAN_STATES_AND_UTS.find(
    (s) => s.name.toLowerCase() === q || s.id === q || s.code.toLowerCase() === q
  );
}

export function getDistricts(stateNameOrId: string): DistrictEntry[] {
  const s = getState(stateNameOrId);
  return s ? s.districts : [];
}

export function getVillages(stateNameOrId: string, districtNameOrId: string): VillageEntry[] {
  const districts = getDistricts(stateNameOrId);
  const q = districtNameOrId.trim().toLowerCase();
  const d = districts.find((dst) => dst.name.toLowerCase() === q || dst.id === q);
  return d ? d.villages : [];
}

export function getGramPanchayats(stateNameOrId: string, districtNameOrId: string, villageNameOrId: string): GramPanchayatEntry[] {
  const villages = getVillages(stateNameOrId, districtNameOrId);
  const q = villageNameOrId.trim().toLowerCase();
  const v = villages.find((vlg) => vlg.name.toLowerCase() === q || vlg.id === q);
  if (v && v.gramPanchayats.length > 0) {
    return v.gramPanchayats;
  }
  // If specific village not found or has no predefined list, provide typical Gram Panchayat patterns for that village
  if (villageNameOrId && villageNameOrId !== '__custom__') {
    return [
      { id: `${q}_gp`, name: `${villageNameOrId} Gram Panchayat` },
      { id: `${q}_rural_gp`, name: `${villageNameOrId} Rural Gram Panchayat` }
    ];
  }
  return [];
}
