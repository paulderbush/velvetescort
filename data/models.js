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
const MILKYWAY_DATA = {
  id: 9999, real: true, folder: 'MILKYWAY', slug: 'milkyway',
  name: 'Milkyway', age: 23, height: 166, weight: 54,
  nationality: 'Brazilian', station: 'South Kensington',
  rateHour: 350,
  color: ['rgba(160,80,30,0.4)', 'rgba(100,45,15,0.7)'],
  initials: 'MW',
  cats: ['recommended', 'toprated', 'under25', 'new'],
  breastSize: '32B', breastType: 'Natural', clothingSize: 'S',
  eyeColor: 'Brown', hairColor: 'Brunette', orientation: 'Heterosexual',
  languages: 'English (Basic) · Portuguese (Fluent)',
  svcs: ['69', 'Blowjob With Condom', 'Cum On Body', 'Deep Throat', 'Face Sitting', 'MMF For Double Price', 'Group For Extra', 'Massage', 'Striptease', 'Lap Dancing', 'Toys', 'Light Domination', 'Soft Spanking Receiving', 'Spanking Giving'],
  extraSvcs: [
    {name: 'Blowjob Without Condom', price: 40},
    {name: 'Cum On Face', price: 50},
    {name: 'Peeing On Client', price: 60},
    {name: 'Rimming Gives', price: 80},
    {name: 'Strapon', price: 100},
    {name: 'Cum In Mouth', price: 80},
    {name: 'Prostate Massage', price: 40},
    {name: 'Filming Without Mask', price: 200},
  ],
  incallRates: [
    {label: '30 min', price: 300},
    {label: '45 min', price: 350},
    {label: '1 Hour', price: 350},
    {label: '2 Hours', price: 650},
    {label: '3 Hours', price: 950},
    {label: '4 Hours', price: 1250},
    {label: '5 Hours', price: 1550},
    {label: '9 Hours', price: 2700},
  ],
  outcallRates: [
    {label: '1 Hour', price: 400},
    {label: '2 Hours', price: 700},
    {label: '3 Hours', price: 1000},
    {label: '4 Hours', price: 1300},
    {label: '5 Hours', price: 1600},
    {label: '9 Hours', price: 2700},
  ],
  description: [
    'Milkyway is a captivating Brazilian companion based in London, known for her natural warmth, effortless elegance, and an innate ability to make every encounter feel genuinely special. With striking brunette hair, expressive brown eyes, and a naturally beautiful figure, she is as visually captivating as she is engaging in conversation.',
    'Whether you are looking for a refined companion for a private dinner, a social event, or an intimate experience, Milkyway brings attentiveness and genuine care to every meeting. Her easygoing nature and exotic charm make every moment feel relaxed, personal, and memorable.',
    'Fluent in Portuguese and conversational in English, she welcomes gentlemen from all backgrounds with warmth and discretion. All appointments are arranged with complete respect for your privacy. Available daily across London for both incall and outcall bookings.',
  ],
  reviews: [],
};

const FAKE_MODELS = generateModels();
const MODELS = [MILKYWAY_DATA, ...FAKE_MODELS];

module.exports = { MODELS, MILKYWAY_DATA, SERVICES, NATIONALITIES, STATIONS, NAMES_F };
