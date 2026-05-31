// =================== DATA ===================
const SERVICES = ["69","Anal Sex","BDSM","Belly-dance","Bisexual DUO","Blowjob With Condom","Blowjob Without Condom","Body to Body Massage","Couples","Cum In Mouth","Cum On Body","Cum On Face","Deep French Kissing","Deep Throat","Dirty Talk","Domination","Double Penetration","DUO","Erotic Massage","Face Sitting","Fetish","Filming With Mask","Filming Without Mask","Fingering","Fisting Giving","Foot Fetish","French Kissing","Girlfriend Experience","Group For Extra","Handcuffs","Lady's Services","Lap Dancing","Light Domination","Lomilomi Massage","Massage","MMF For Double Price","Nuru Massage","Open Minded","Party Girl","Peeing On Client","Peeing On Model","Photos With Mask","Poppers","Pornstar Experience","Professional Massage","Prostate Massage","Rimming Gives","Rimming Receives","Roleplay","Sensual Massage","Shower Together","Smoking Fetish","Snowballing","Soft Spanking Receiving","Spanking Giving","Strapon","Striptease","Swallow Sperm","Tantric Massage","Tie & Tease","Toys","Uniform","Women Clients"];

const NATIONALITIES = ["Albanian","Argentine","Belarusian","Brazilian","British","Bulgarian","Chilean","Chinese","Colombian","Costa Rican","Eastern European","Egyptian","Estonian","French","German","Hungarian","Italian","Kazakh","Latvian","Lithuanian","Mexican","Moldovan","Paraguayan","Polish","Portuguese","Romanian","Russian","Spanish","Thai","Ukrainian","Vietnamese"];

const STATIONS = ["Aldgate","Aldgate East","Angel","Baker Street","Bank","Barbican","Barons Court","Battersea Power Station","Bayswater","Bermondsey","Bethnal Green","Blackfriars","Bond Street","Borough","Bow Road","Brixton","Camden Town","Canada Water","Canary Wharf","Cannon Street","Chalk Farm","Chancery Lane","Charing Cross","Chelsea","Clapham Common","Clapham North","Clapham South","Covent Garden","Earl's Court","Edgware Road","Elephant & Castle","Embankment","Euston","Farringdon","Finchley Road","Finsbury Park","Fulham Broadway","Gloucester Road","Green Park","Hammersmith","High Street Kensington","Highbury & Islington","Holborn","Holland Park","Hyde Park Corner","Islington","Kennington","Kensington","King's Cross St. Pancras","Knightsbridge","Lambeth North","Lancaster Gate","Leicester Square","Liverpool Street","London Bridge","Maida Vale","Mansion House","Marble Arch","Marylebone","Mile End","Monument","Moorgate","Nine Elms","Notting Hill Gate","Old Street","Oval","Oxford Circus","Paddington","Parsons Green","Piccadilly Circus","Pimlico","Putney Bridge","Queensway","Regent's Park","Shepherd's Bush","Sloane Square","Soho","South Kensington","Southwark","St. James's Park","St. Paul's","Stepney Green","Stockwell","Stratford","Swiss Cottage","Temple","Tottenham Court Road","Tower Hill","Vauxhall","Victoria","Warren Street","Waterloo","West Brompton","Westminster","Whitechapel"];

const NAMES_F = ["Anastasia","Isabella","Valentina","Sophia","Natasha","Elena","Mia","Camille","Oksana","Alicia","Diana","Kate","Veronika","Lara","Monica","Zara","Nikita","Simone","Irina","Tatiana","Daria","Alina","Yvette","Chloe","Gabrielle","Polina","Roxana","Bianca","Jade","Crystal"];

const COLORS = [
  ['rgba(123,47,190,0.4)','rgba(74,24,128,0.7)'],
  ['rgba(155,89,208,0.4)','rgba(100,40,160,0.7)'],
  ['rgba(80,20,150,0.4)','rgba(50,10,100,0.7)'],
  ['rgba(140,60,200,0.4)','rgba(90,30,140,0.7)'],
];

// Seeded LCG random number generator
function makeRng(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateModels() {
  return Array.from({length: 30}, (_, i) => {
    const rng = makeRng(i * 999 + 1);
    const rndInt = (a, b) => Math.floor(rng() * (b - a + 1)) + a;
    const pickN = (arr, n) => {
      const shuffled = [...arr];
      for (let j = shuffled.length - 1; j > 0; j--) {
        const k = Math.floor(rng() * (j + 1));
        [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
      }
      return shuffled.slice(0, n);
    };

    const age = rndInt(18, 45);
    const cats = [];
    if (rng() > 0.5) cats.push('recommended');
    if (age < 25) cats.push('under25');
    if (rng() > 0.5) cats.push('toprated');
    if (rng() > 0.7) cats.push('new');
    const svcs = pickN(SERVICES, rndInt(8, 20));
    const col = COLORS[i % COLORS.length];
    const name = NAMES_F[i % NAMES_F.length] + (i >= NAMES_F.length ? ` ${i + 1}` : '');
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return {
      id: i,
      name,
      slug,
      age,
      height: rndInt(158, 180),
      weight: rndInt(48, 72),
      nationality: NATIONALITIES[rndInt(0, NATIONALITIES.length - 1)],
      station: STATIONS[rndInt(0, STATIONS.length - 1)],
      cats,
      svcs,
      rateHour: rndInt(3, 8) * 50,
      color: col,
      initials: name.charAt(0),
      rating: (4 + rng()).toFixed(1),
      reviews: [],
      real: false,
    };
  });
}

// =================== REAL MODELS ===================
const ROSA_DATA = {
  id: 9998, real: true, folder: 'Rosa', slug: 'rosa',
  name: 'Rosa', age: 18, height: 168, weight: 55,
  nationality: 'Russian', station: 'Angel',
  rateHour: 600,
  color: ['rgba(190,60,120,0.4)', 'rgba(110,30,70,0.7)'],
  initials: 'RO',
  cats: ['recommended', 'new', 'under25'],
  breastSize: '32B', breastType: 'Natural', clothingSize: 'XS',
  eyeColor: 'Brown', hairColor: 'Brown', orientation: 'Heterosexual',
  languages: 'Russian (Fluent) · English (Intermediate)',
  svcs: ['69', 'Bisexual DUO', 'Blowjob With Condom', 'Dirty Talk', 'Domination', 'Face Sitting', 'Fingering', 'Foot Fetish', 'Handcuffs', "Lady's Services", 'Lap Dancing', 'Lomilomi Massage', 'MMF For Double Price', 'Open Minded', 'Peeing On Client', 'Peeing On Model', 'Prostate Massage', 'Rimming Receives', 'Roleplay', 'Shower Together', 'Smoking Fetish', 'Snowballing', 'Spanking Giving', 'Striptease', 'Tie & Tease'],
  extraSvcs: [
    {name: 'Anal Sex', price: 200},
    {name: 'Blowjob Without Condom', price: 50},
  ],
  incallRates: [
    {label: '30 min', price: 500},
    {label: '45 min', price: 550},
    {label: '1 Hour', price: 600},
    {label: '2 Hours', price: 1000},
    {label: '3 Hours', price: 1400},
    {label: '4 Hours', price: 1800},
    {label: '5 Hours', price: 2200},
    {label: 'Overnight', price: 3500},
  ],
  outcallRates: [
    {label: '30 min', price: 550},
    {label: '45 min', price: 600},
    {label: '1 Hour', price: 650},
    {label: '2 Hours', price: 1050},
    {label: '3 Hours', price: 1450},
    {label: '4 Hours', price: 1850},
    {label: '5 Hours', price: 2250},
    {label: 'Overnight', price: 3500},
  ],
  description: [
    'Rosa is a striking young Russian companion based in London, combining youthful energy with a naturally elegant presence. With soft brown hair, warm brown eyes, and a slender, graceful figure, she carries herself with a poise that belies her years and an easy charm that puts you at ease from the very first moment.',
    'Attentive, open-minded, and genuinely engaging, Rosa is the ideal companion for an intimate evening, a private dinner, or a relaxed social occasion. She takes pride in making every encounter feel personal and unhurried, bringing warmth and a playful spirit to her time with you.',
    'A native Russian speaker with conversational English, Rosa welcomes gentlemen with discretion and care. All appointments are arranged with complete respect for your privacy. Available daily across London for both incall and outcall bookings.',
  ],
  reviews: [],
};

const MANNY_DATA = {
  id: 9997, real: true, folder: 'Manny', slug: 'manny',
  name: 'Manny', age: 23, height: 173, weight: 60,
  nationality: 'British', station: 'Southwark',
  rateHour: 350,
  color: ['rgba(70,130,180,0.4)', 'rgba(30,80,130,0.7)'],
  initials: 'MA',
  cats: ['recommended', 'under25', 'new'],
  breastSize: '34C', breastType: 'Silicone', clothingSize: '8',
  eyeColor: 'Blue', hairColor: 'Blonde', orientation: 'Bisexual',
  languages: 'English (Fluent)',
  svcs: ['69', 'Bisexual DUO', 'Couples', 'Deep French Kissing', 'Erotic Massage', 'Group For Extra', 'Handcuffs', 'Lap Dancing', 'MMF For Double Price', 'Party Girl', 'Peeing On Model', 'Professional Massage', 'Roleplay', 'Sensual Massage', 'Strapon'],
  extraSvcs: [
    {name: 'Anal Sex', price: 150},
    {name: 'Blowjob Without Condom', price: 50},
  ],
  incallRates: [
    {label: '30 min', price: 300},
    {label: '45 min', price: 330},
    {label: '1 Hour', price: 350},
    {label: '2 Hours', price: 600},
    {label: '3 Hours', price: 850},
    {label: '4 Hours', price: 1100},
    {label: 'Overnight', price: 1900},
  ],
  outcallRates: [
    {label: '30 min', price: 350},
    {label: '45 min', price: 370},
    {label: '1 Hour', price: 400},
    {label: '2 Hours', price: 650},
    {label: '3 Hours', price: 900},
    {label: '4 Hours', price: 1150},
    {label: 'Overnight', price: 1900},
  ],
  description: [
    'Manny is a captivating young British companion based in London, combining natural confidence with a warm, open personality that puts you instantly at ease. With striking blonde hair, vivid blue eyes, and a tall, elegant figure, she carries herself with effortless poise and an understated sensuality that is entirely her own.',
    'Bisexual and genuinely open-minded, Manny welcomes a broad range of encounters — from intimate one-on-one meetings to couples experiences and group bookings. She takes real pleasure in creating a relaxed, unhurried atmosphere where every moment feels personal and entirely for you.',
    'A native English speaker, Manny is as engaging in conversation as she is in company. Available daily across London from her South Bank location, close to Southwark station, for both incall and outcall bookings — all arranged with complete discretion.',
  ],
  reviews: [],
};

const FAKE_MODELS = generateModels();
const MODELS = [ROSA_DATA, MANNY_DATA, ...FAKE_MODELS];

module.exports = { MODELS, ROSA_DATA, MANNY_DATA, SERVICES, NATIONALITIES, STATIONS, NAMES_F };
