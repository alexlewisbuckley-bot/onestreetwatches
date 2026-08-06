/* ============================================================
   ONE STREET WATCHES — shared core
   currency · catalogue data · mega menu · header · carousels
   ============================================================ */
/* WhatsApp — the only conversion on this site. One source of truth.
   Short links carry the business's own pre-set greeting; ?text= is honoured
   by most clients but is only guaranteed on a wa.me/<number> link. */
const WA_LINK = 'https://wa.me/message/55ILJOASJYUAD1';
const waURL = msg => WA_LINK + (msg ? '?text=' + encodeURIComponent(msg) : '');

const RATE = 4.70;                      // AED per GBP (indicative — replace with a live feed)
let CUR = localStorage.getItem('osw-cur') || 'AED';
const money = aed => CUR === 'AED'
  ? 'Dhs. ' + aed.toLocaleString('en-US')
  : '£' + Math.round(aed / RATE).toLocaleString('en-GB');

/* ---------------- the catalogue ---------------- */
const SHOT = (a, b) => ({ ph: [a, b] });
const CATALOGUE = [
 {b:"Rolex",m:"Daytona",r:"116520",t:"Daytona 116520 Chronograph In Steel With White Dial And Black Sub-Dials, 2010 Full Set",y:2010,c:"Very good",box:1,pap:1,aed:82250,loc:"Dubai",tag:"Bestseller",dial:"White",size:40,cat:["Sports","Chronographs"],
  ims:[SHOT("Three-quarter","Steel Daytona at 45°, soft top light, sand plate"),SHOT("Dial macro","Sub-dials filling the frame"),SHOT("Caseback","Serial between the lugs"),SHOT("Box & papers","Full set laid flat")]},
 {b:"Rolex",m:"Submariner “Hulk”",r:"116610LV",t:"Submariner Date 116610LV “Hulk” In Steel With Green Dial And Green Ceramic Bezel 40mm, 2019 Full Set",y:2019,c:"Excellent",box:1,pap:1,aed:58500,loc:"Dubai",tag:"Bestseller",dial:"Green",size:40,cat:["Sports"],
  ims:[{img:"assets/img/rolex-submariner-hulk.cbc6259304.webp"},SHOT("Dial macro","Green dial, maxi markers, at 1:1"),SHOT("Clasp","Glidelock open"),SHOT("Box & papers","Card, booklets and green box")]},
 {b:"Rolex",m:"GMT-Master II “Sprite”",r:"126720VTNR",t:"GMT-Master II 126720VTNR “Sprite” Left-Hand Drive In Steel With Green And Black Bezel 40mm, 2023 Unworn Full Set",y:2023,c:"Unworn",box:1,pap:1,aed:74500,loc:"Dubai",tag:"New arrival",dial:"Black",size:40,cat:["Sports"],
  ims:[{img:"assets/img/rolex-gmt-sprite.d4cfc1f7c4.webp"},SHOT("Bezel detail","Green and black Cerachrom"),SHOT("Left-hand crown","Case profile"),SHOT("Box & papers","Full 2023 set")]},
 {b:"Rolex",m:"Submariner “Starbucks”",r:"126610LV",t:"Submariner Date 126610LV “Starbucks” In Steel With Black Dial And Green Ceramic Bezel 41mm, 2022 Box Only",y:2022,c:"Excellent",box:1,pap:0,aed:52800,loc:"United Kingdom",tag:"",dial:"Black",size:41,cat:["Sports"],
  ims:[{img:"assets/img/rolex-submariner-starbucks.678e9fb7db.webp"},SHOT("Dial macro","Black dial, green bezel"),SHOT("Caseback","Serial and rehaut"),SHOT("Box only","Box without papers")]},
 {b:"Rolex",m:"Submariner — White gold",r:"126619LB",t:"Submariner Date 126619LB In 18K White Gold With Black Dial And Blue Bezel 41mm, 2021 Full Set",y:2021,c:"Excellent",box:1,pap:1,aed:139000,loc:"United Kingdom",tag:"",dial:"Blue",size:41,cat:["Sports","Gold & two-tone"],
  ims:[{img:"assets/img/rolex-submariner-white-gold.3150d025fa.webp"},SHOT("Dial macro","Blue dial, white gold surrounds"),SHOT("Weight & profile","Case on its side"),SHOT("Box & papers","Full set")]},
 {b:"Rolex",m:"Datejust 41",r:"126334",t:"Datejust 41 126334 In Steel With Sunburst Blue Dial, Fluted Bezel And Jubilee Bracelet, 2020 Full Set",y:2020,c:"Very good",box:1,pap:1,aed:44600,loc:"Dubai",tag:"",dial:"Blue",size:41,cat:["Dress"],
  ims:[SHOT("Three-quarter","Datejust on sand, fluted bezel catching light"),SHOT("Dial macro","Sunburst blue, applied indices"),SHOT("Jubilee bracelet","Five-link detail"),SHOT("Box & papers","Full set")]},
 {b:"Rolex",m:"Day-Date 40",r:"228238",t:"Day-Date 40 228238 In 18K Yellow Gold With Champagne Dial And President Bracelet, 2018 Full Set",y:2018,c:"Very good",box:1,pap:1,aed:172000,loc:"Dubai",tag:"",dial:"Champagne",size:40,cat:["Dress","Gold & two-tone"],
  ims:[SHOT("Three-quarter","Yellow gold Day-Date, president bracelet"),SHOT("Dial macro","Champagne sunburst, day aperture"),SHOT("Clasp","Crownclasp detail"),SHOT("Box & papers","Full set")]},
 {b:"Rolex",m:"Explorer 36",r:"124270",t:"Explorer 36 124270 In Steel With Matte Black Dial 36mm, 2022 Unworn Full Set",y:2022,c:"Unworn",box:1,pap:1,aed:36900,loc:"United Kingdom",tag:"Unworn",dial:"Black",size:36,cat:["Sports"],
  ims:[SHOT("Three-quarter","Explorer at 45°, matte black dial"),SHOT("Dial macro","3-6-9 numerals and lume"),SHOT("Caseback","Plain steel back"),SHOT("Box & papers","Full 2022 set")]},
 {b:"Patek Philippe",m:"Nautilus",r:"5711/1A-010",t:"Nautilus 5711/1A-010 In Steel With Blue Embossed Dial 40mm, 2019 Full Set",y:2019,c:"Very good",box:1,pap:1,aed:446500,loc:"Dubai",tag:"Grail",hold:1,dial:"Blue",size:40,cat:["Sports"],
  ims:[SHOT("Three-quarter","Blue dial Nautilus 45°, single key light"),SHOT("Dial macro","Horizontal embossing raked left"),SHOT("Caseback","Sapphire back, movement visible"),SHOT("Box & papers","Full set with outer carton")]},
 {b:"Patek Philippe",m:"Aquanaut",r:"5167A-001",t:"Aquanaut 5167A-001 In Steel With Black Embossed Dial And Composite Strap 40mm, 2020 Full Set",y:2020,c:"Excellent",box:1,pap:1,aed:298000,loc:"Dubai",tag:"",dial:"Black",size:40,cat:["Sports"],
  ims:[SHOT("Three-quarter","Aquanaut on sand, tropical strap curled"),SHOT("Dial macro","Embossed grid pattern"),SHOT("Strap & buckle","Composite strap detail"),SHOT("Box & papers","Full set")]},
 {b:"Patek Philippe",m:"Calatrava",r:"5227G",t:"Calatrava 5227G In 18K White Gold With White Lacquer Dial And Officer's Caseback 39mm, 2017 With Papers",y:2017,c:"Very good",box:0,pap:1,aed:186000,loc:"United Kingdom",tag:"",dial:"White",size:39,cat:["Dress","Gold & two-tone"],
  ims:[SHOT("Three-quarter","White gold Calatrava, alligator strap"),SHOT("Dial macro","Applied gold indices"),SHOT("Officer's back","Hinged caseback open"),SHOT("Papers","Certificate flat, serial legible")]},
 {b:"Audemars Piguet",m:"Royal Oak",r:"15400ST",t:"Royal Oak 15400ST In Steel With Blue “Grande Tapisserie” Dial 41mm, 2018 With Papers",y:2018,c:"Good",box:0,pap:1,aed:112800,loc:"United Kingdom",tag:"",dial:"Blue",size:41,cat:["Sports"],
  ims:[SHOT("Three-quarter","Steel Royal Oak, bracelet fanned right"),SHOT("Tapisserie macro","Raking light across the dial"),SHOT("Bracelet & clasp","Integrated links"),SHOT("Papers","Certificate flat")]},
 {b:"Audemars Piguet",m:"Royal Oak Offshore",r:"26470ST",t:"Royal Oak Offshore 26470ST Chronograph In Steel With Black “Méga Tapisserie” Dial 42mm, 2019 Full Set",y:2019,c:"Excellent",box:1,pap:1,aed:158000,loc:"Dubai",tag:"",dial:"Black",size:42,cat:["Sports","Chronographs"],
  ims:[SHOT("Three-quarter","Offshore chronograph, rubber strap"),SHOT("Dial macro","Méga tapisserie and sub-dials"),SHOT("Pushers","Case flank showing pushers"),SHOT("Box & papers","Full set")]},
 {b:"Audemars Piguet",m:"Royal Oak Double Balance",r:"15468OR",t:"Royal Oak Double Balance Wheel Openworked 15468OR In 18K Rose Gold 41mm, 2022 Full Set",y:2022,c:"Excellent",box:1,pap:1,aed:214000,loc:"Dubai",tag:"",dial:"Grey",size:41,cat:["Sports","Gold & two-tone","Complications"],
  ims:[{img:"assets/img/rolex-submariner-white-gold.3150d025fa.webp"},SHOT("Dial macro","Openworked balance at 9"),SHOT("Rose gold bracelet","Link and bevel detail"),SHOT("Box & papers","Full set")]},
 {b:"Richard Mille",m:"RM 67-01 Extra Flat",r:"RM 67-01",t:"RM 67-01 Extra Flat In Titanium With Skeletonised Dial 38mm, 2019 Full Set",y:2019,c:"Excellent",box:1,pap:1,aed:780000,loc:"Dubai",tag:"Vault",dial:"Skeleton",size:38,cat:["Sports","Complications"],
  ims:[{img:"assets/img/rolex-gmt-sprite.d4cfc1f7c4.webp"},SHOT("Movement macro","Skeleton calibre filling the frame"),SHOT("Case profile","Showing the 7.75mm thickness"),SHOT("Box & papers","Full set with pouch")]},
 {b:"Richard Mille",m:"RM 011 Felipe Massa",r:"RM 011",t:"RM 011 Felipe Massa Flyback Chronograph In Titanium With Skeletonised Dial 44mm, 2016 Full Set",y:2016,c:"Very good",box:1,pap:1,aed:640000,loc:"Dubai",tag:"Vault",dial:"Skeleton",size:44,cat:["Sports","Chronographs","Complications"],
  ims:[SHOT("Three-quarter","RM 011 at 45°, rubber strap curled behind"),SHOT("Movement macro","Flyback chronograph bridges"),SHOT("Case band","Tripartite case screws"),SHOT("Box & papers","Full set")]},
 {b:"Cartier",m:"Santos — Large",r:"WSSA0018",t:"Santos De Cartier Large WSSA0018 In Steel With White Dial And QuickSwitch Bracelet, 2022 Full Set",y:2022,c:"Excellent",box:1,pap:1,aed:29140,loc:"United Kingdom",tag:"",dial:"White",size:40,cat:["Dress"],
  ims:[SHOT("Three-quarter","Santos on sand, bracelet curving behind"),SHOT("Dial macro","Roman numerals, railroad track"),SHOT("QuickSwitch","Bracelet detached, second strap"),SHOT("Box & papers","Full set with both straps")]},
 {b:"Cartier",m:"Santos — Green dial",r:"WSSA0062",t:"Santos De Cartier Large WSSA0062 In Steel With Green Lacquer Dial, 2023 Unworn Full Set",y:2023,c:"Unworn",box:1,pap:1,aed:31800,loc:"Dubai",tag:"New arrival",dial:"Green",size:40,cat:["Dress"],
  ims:[{img:"assets/img/rolex-submariner-starbucks.678e9fb7db.webp"},SHOT("Dial macro","Green lacquer, sword hands"),SHOT("Case profile","Exposed screws on the bezel"),SHOT("Box & papers","Full 2023 set")]},
 {b:"Cartier",m:"Tank Must — Large",r:"WSTA0053",t:"Tank Must Large WSTA0053 With Black Dial And Blued Hands On Leather, 2021 Box Only",y:2021,c:"Very good",box:1,pap:0,aed:16400,loc:"United Kingdom",tag:"",dial:"Black",size:36,cat:["Dress"],
  ims:[SHOT("Three-quarter","Tank Must on leather, three-quarter"),SHOT("Dial macro","Roman numerals, blued hands"),SHOT("Strap & buckle","Leather grain and pin buckle"),SHOT("Box only","Box without papers")]},
 {b:"Cartier",m:"Ballon Bleu 42",r:"W69012Z4",t:"Ballon Bleu 42 W69012Z4 In Steel And 18K Yellow Gold With Silver Guilloché Dial, 2015 Watch Only",y:2015,c:"Good",box:0,pap:0,aed:19800,loc:"United Kingdom",tag:"",dial:"Silver",size:42,cat:["Dress"],
  ims:[SHOT("Three-quarter","Ballon Bleu, two-tone bracelet"),SHOT("Crown guard","Blue cabochon detail"),SHOT("Dial macro","Guilloché silver dial"),SHOT("Watch only","Watch photographed alone on sand")]},
 {b:"Vacheron Constantin",m:"Overseas",r:"4500V/110A",t:"Overseas 4500V/110A In Steel With Sunburst Blue Dial And Three Straps 41mm, 2020 Full Set",y:2020,c:"Excellent",box:1,pap:1,aed:186500,loc:"Dubai",tag:"",dial:"Blue",size:41,cat:["Sports"],
  ims:[SHOT("Three-quarter","Overseas blue dial, bracelet fanned"),SHOT("Dial macro","Sunburst blue and applied indices"),SHOT("Interchangeable straps","All three straps laid out"),SHOT("Box & papers","Full set")]},
 {b:"Vacheron Constantin",m:"Patrimony",r:"81180/000G",t:"Patrimony 81180/000G In 18K White Gold With Silver Dial On Alligator 40mm, 2016 Full Set",y:2016,c:"Very good",box:1,pap:1,aed:98000,loc:"United Kingdom",tag:"",dial:"Silver",size:40,cat:["Dress","Gold & two-tone"],
  ims:[SHOT("Three-quarter","White gold Patrimony on alligator"),SHOT("Dial macro","Minimal baton indices"),SHOT("Caseback","Maltese cross hallmark"),SHOT("Box & papers","Full set")]},
 {b:"Hublot",m:"Big Bang Unico",r:"411.NX.1170.RX",t:"Big Bang Unico 411.NX.1170.RX In Titanium With Skeletonised Dial On Rubber 44mm, 2021 Full Set",y:2021,c:"Excellent",box:1,pap:1,aed:64200,loc:"Dubai",tag:"",dial:"Skeleton",size:44,cat:["Sports","Chronographs"],
  ims:[SHOT("Three-quarter","Big Bang Unico, titanium, rubber strap"),SHOT("Movement macro","Unico calibre through the dial"),SHOT("Bezel screws","H-screws on the bezel"),SHOT("Box & papers","Full set")]},
 {b:"Hublot",m:"Classic Fusion 45",r:"511.NX.1171.RX",t:"Classic Fusion 45 511.NX.1171.RX In Titanium With Matte Black Dial On Rubber, 2019 Full Set",y:2019,c:"Very good",box:1,pap:1,aed:38600,loc:"United Kingdom",tag:"",dial:"Black",size:45,cat:["Dress"],
  ims:[SHOT("Three-quarter","Classic Fusion titanium, matte black dial"),SHOT("Dial macro","Applied indices and date"),SHOT("Strap","Rubber strap with deployant"),SHOT("Box & papers","Full set")]}
,
 {b:"Patek Philippe",m:"Nautilus Moon Phase",r:"5712/1R-001",t:"Nautilus Moon Phase 5712/1R-001 In 18K Rose Gold With Brown Gradient Dial, Power Reserve And Date 40mm, 2021 Full Set",y:2021,c:"Excellent",box:1,pap:1,aed:705000,loc:"Dubai",tag:"Grail",dial:"Brown",size:40,cat:["Sports","Complications","Gold & two-tone"],
  ims:[{img:"assets/img/patek-nautilus-5712r.8fa27c9bf4.webp"},SHOT("Dial macro","Moonphase and pointer date at 7 o'clock"),SHOT("Caseback","Sapphire back, calibre 240 PS"),SHOT("Box & papers","Full set with outer carton")]},
 {b:"Patek Philippe",m:"Nautilus — Rose gold",r:"5711/1R-001",t:"Nautilus 5711/1R-001 In 18K Rose Gold With Brown Gradient Dial 40mm, 2020 Full Set",y:2020,c:"Very good",box:1,pap:1,aed:625000,loc:"Dubai",tag:"Vault",dial:"Brown",size:40,cat:["Sports","Gold & two-tone"],
  ims:[{img:"assets/img/patek-nautilus-5711r.e58d3ff86c.webp"},SHOT("Dial macro","Brown gradient, horizontal embossing"),SHOT("Bracelet","Rose gold integrated links"),SHOT("Box & papers","Full set")]},
 {b:"Patek Philippe",m:"Cubitus",r:"5821/1R-001",t:"Cubitus 5821/1R-001 In 18K Rose Gold With Brown Sunburst Dial 45mm, 2025 Unworn Full Set",y:2025,c:"Unworn",box:1,pap:1,aed:350000,loc:"United Kingdom",tag:"New arrival",dial:"Brown",size:45,cat:["Sports","Gold & two-tone"],
  ims:[{img:"assets/img/patek-cubitus-5821r.9007c9752f.webp"},SHOT("Dial macro","Square case, horizontal embossing"),SHOT("Caseback","Sapphire back, calibre 26-330"),SHOT("Box & papers","Full 2025 set")]},
 {b:"Patek Philippe",m:"Aquanaut Chronograph",r:"5968A-001",t:"Aquanaut Chronograph 5968A-001 In Steel With Black Dial And Orange Composite Strap 42mm, 2019 Full Set",y:2019,c:"Excellent",box:1,pap:1,aed:330000,loc:"United Kingdom",tag:"",dial:"Black",size:42,cat:["Sports","Chronographs"],
  ims:[{img:"assets/img/patek-aquanaut-5968a.ee1ae6e4ad.webp"},SHOT("Dial macro","Flyback chronograph, embossed grid"),SHOT("Strap","Orange composite with fold-over clasp"),SHOT("Box & papers","Full set with both straps")]}
];


/* ---------------- handbags ----------------
   A second department, deliberately its own small array: bags have
   their own vocabulary (size, leather, hardware) and do not belong
   inside a catalogue keyed on dials and case sizes. */
const BAGS=[
 {m:"Kelly",fam:"Kelly 25 Sellier",
  t:"Kelly 25 Sellier In Bleu Saphir Epsom Leather With Palladium Hardware, 2022 Full Set",
  y:2022,c:"Excellent",box:1,pap:1,aed:198000,loc:"Dubai",tag:"Bestseller",
  size:25,leather:"Epsom",colour:"Bleu Saphir",hex:"#22304F",hw:"Palladium",stamp:"U (2022)",
  d:"Sellier construction \u2014 stitched on the outside, so the bag holds its architecture rather than slouching. Bleu saphir reads navy indoors and deep blue in sun. Corners crisp, hardware unmarked, protective film still on the clasp.",
  img:"assets/img/hermes-kelly-25-bleu-saphir.a1abd7776b.webp"},
 {m:"Birkin",fam:"Birkin 30",
  t:"Birkin 30 In Craie Swift Leather With Palladium Hardware, 2021 Full Set",
  y:2021,c:"Excellent",box:1,pap:1,aed:172000,loc:"Dubai",tag:"",
  size:30,leather:"Swift",colour:"Craie",hex:"#E8E1D4",hw:"Palladium",stamp:"Y (2021)",
  d:"Craie is the chalk white that flatters everything and forgives nothing \u2014 this one has been kept properly. Swift takes the light softly and the grain stays fine. Clochette, lock and both keys present.",
  img:"assets/img/hermes-birkin-30-craie.afe0d5deb4.webp"},
 {m:"Birkin",fam:"Birkin 30",
  t:"Birkin 30 In \u00c9toupe Epsom Leather With Palladium Hardware And Contrast Stitch, 2020 Full Set",
  y:2020,c:"Very good",box:1,pap:1,aed:158000,loc:"United Kingdom",tag:"",
  size:30,leather:"Epsom",colour:"\u00c9toupe",hex:"#8A7D6E",hw:"Palladium",stamp:"Y (2020)",
  d:"The neutral that outlasts every trend, in Epsom \u2014 the hardest-wearing leather Herm\u00e8s uses. Light honest wear at the base corners, structure entirely intact, contrast saddle stitch clean throughout.",
  img:"assets/img/hermes-birkin-30-etoupe.18b4576cc0.webp"},
 {m:"Kelly",fam:"Kelly 20 Mini II",
  t:"Kelly 20 Mini II Sellier In Chai Matte Alligator With Palladium Hardware, 2023 Unworn Full Set",
  y:2023,c:"Unworn",box:1,pap:1,aed:445000,loc:"Dubai",tag:"Grail",
  size:20,leather:"Matte alligator",colour:"Chai",hex:"#C79A7C",hw:"Palladium",stamp:"B (2023)",
  d:"Mini Kelly II in matte alligator \u2014 the hardest of all to be offered, and unworn. Chai is the warm sand-rose that sits between neutral and blush. CITES paperwork present for travel.",
  img:"assets/img/hermes-kelly-20-alligator.23a9063bd1.webp"},
 {m:"Birkin",fam:"Birkin 25",
  t:"Birkin 25 In Gold Togo Leather With Gold Hardware, 2022 Full Set",
  y:2022,c:"Excellent",box:1,pap:1,aed:238000,loc:"Dubai",tag:"Bestseller",
  size:25,leather:"Togo",colour:"Gold",hex:"#B07C43",hw:"Gold",stamp:"U (2022)",
  d:"The combination people wait years for: Birkin 25, gold Togo, gold hardware. Togo\u2019s pebbled grain hides wear and keeps its shape. Corners sharp, feet unscuffed.",
  ph:["Three-quarter","Gold Togo Birkin 25 at 30\u00b0, palladium-free warm light"]},
 {m:"Birkin",fam:"Birkin 35",
  t:"Birkin 35 In Noir Togo Leather With Palladium Hardware, 2018 Full Set",
  y:2018,c:"Very good",box:1,pap:1,aed:145000,loc:"United Kingdom",tag:"",
  size:35,leather:"Togo",colour:"Noir",hex:"#1A1A1A",hw:"Palladium",stamp:"C (2018)",
  d:"The travelling size, in the colour that goes everywhere. Softened with use exactly as a 35 should, base corners honest, all hardware present including clochette and both keys.",
  ph:["Three-quarter","Black Togo Birkin 35, relaxed slouch, soft top light"]},
 {m:"Kelly",fam:"Kelly 28 Retourne",
  t:"Kelly 28 Retourne In Gold Togo Leather With Gold Hardware And Strap, 2021 Full Set",
  y:2021,c:"Excellent",box:1,pap:1,aed:185000,loc:"Dubai",tag:"",
  size:28,leather:"Togo",colour:"Gold",hex:"#B07C43",hw:"Gold",stamp:"Y (2021)",
  d:"Retourne \u2014 stitched inside then turned, so it sits softer than a sellier and wears every day. Shoulder strap included, unworn on its keeper.",
  ph:["Three-quarter","Gold Togo Kelly 28 retourne, strap coiled behind"]},
 {m:"Kelly",fam:"Kelly 32 Sellier",
  t:"Kelly 32 Sellier In Noir Box Calf With Gold Hardware, 2016 Full Set",
  y:2016,c:"Very good",box:1,pap:1,aed:168000,loc:"United Kingdom",tag:"",
  size:32,leather:"Box calf",colour:"Noir",hex:"#1A1A1A",hw:"Gold",stamp:"X (2016)",
  d:"Box calf develops a glass-like patina nothing else matches, and this one has begun. A few faint surface marks consistent with age, structure immaculate.",
  ph:["Three-quarter","Black box calf Kelly 32 sellier, hard light to show the shine"]},
 {m:"Constance",fam:"Constance 18",
  t:"Constance 18 In Rouge Casaque Epsom Leather With Palladium Hardware, 2023 Unworn Full Set",
  y:2023,c:"Unworn",box:1,pap:1,aed:142000,loc:"Dubai",tag:"New arrival",
  size:18,leather:"Epsom",colour:"Rouge Casaque",hex:"#B5252C",hw:"Palladium",stamp:"B (2023)",
  d:"The H-clasp shoulder bag, unworn, in the red Herm\u00e8s is known for. Epsom keeps the crisp edges the Constance depends on.",
  ph:["Three-quarter","Rouge casaque Constance 18, strap fanned, H clasp catching light"]},
 {m:"Constance",fam:"Constance 24",
  t:"Constance 24 In Noir Epsom Leather With Palladium Hardware, 2020 Full Set",
  y:2020,c:"Excellent",box:1,pap:1,aed:156000,loc:"Dubai",tag:"",
  size:24,leather:"Epsom",colour:"Noir",hex:"#1A1A1A",hw:"Palladium",stamp:"Y (2020)",
  d:"The larger Constance, black on palladium \u2014 the quietest combination in the range and the hardest to find in good order. Clasp tight, edges unrubbed.",
  ph:["Three-quarter","Black Epsom Constance 24, clean studio grey"]},
 {m:"Lindy",fam:"Lindy 26",
  t:"Lindy 26 In Gris Meyer Clemence Leather With Palladium Hardware, 2022 Full Set",
  y:2022,c:"Excellent",box:1,pap:1,aed:64000,loc:"United Kingdom",tag:"",
  size:26,leather:"Clemence",colour:"Gris Meyer",hex:"#8E8C88",hw:"Palladium",stamp:"U (2022)",
  d:"The one you actually use \u2014 two openings, a shoulder strap, and Clemence\u2019s soft fall. Grey that works against navy and black equally.",
  ph:["Three-quarter","Grey Clemence Lindy 26, slouched, strap across"]},
 {m:"Bolide",fam:"Bolide 27",
  t:"Bolide 27 In Noir Epsom Leather With Palladium Hardware, 2019 Full Set",
  y:2019,c:"Excellent",box:1,pap:1,aed:74000,loc:"Dubai",tag:"",
  size:27,leather:"Epsom",colour:"Noir",hex:"#1A1A1A",hw:"Palladium",stamp:"D (2019)",
  d:"The first bag ever fitted with a zip, still the most practical shape Herm\u00e8s makes. Structured Epsom, strap included.",
  ph:["Three-quarter","Black Epsom Bolide 27, zip curve catching light"]},
 {m:"Picotin",fam:"Picotin Lock 18",
  t:"Picotin Lock 18 In Craie Clemence Leather With Palladium Hardware, 2023 Unworn Full Set",
  y:2023,c:"Unworn",box:1,pap:1,aed:39000,loc:"Dubai",tag:"New arrival",
  size:18,leather:"Clemence",colour:"Craie",hex:"#E8E1D4",hw:"Palladium",stamp:"B (2023)",
  d:"The bucket that started as a feed bag and became a staple. Unworn, with the lock and both keys still bagged.",
  ph:["Three-quarter","Craie Clemence Picotin 18, open top, lock hanging"]},
 {m:"Evelyne",fam:"Evelyne 29",
  t:"Evelyne III 29 In Bleu Nuit Clemence Leather With Palladium Hardware, 2021 Full Set",
  y:2021,c:"Very good",box:1,pap:0,aed:34000,loc:"United Kingdom",tag:"",
  size:29,leather:"Clemence",colour:"Bleu Nuit",hex:"#2A3247",hw:"Palladium",stamp:"Y (2021)",
  d:"The everyday crossbody \u2014 perforated H, canvas strap, and enough room for a day. Honest wear on the strap edge, body excellent.",
  ph:["Three-quarter","Bleu nuit Evelyne 29, canvas strap laid across"]},
 {m:"Garden Party",fam:"Garden Party 30",
  t:"Garden Party 30 In \u00c9toupe Negonda Leather With Palladium Hardware, 2020 Box Only",
  y:2020,c:"Very good",box:1,pap:0,aed:29000,loc:"United Kingdom",tag:"",
  size:30,leather:"Negonda",colour:"\u00c9toupe",hex:"#8A7D6E",hw:"Palladium",stamp:"Y (2020)",
  d:"The tote that takes a beating and looks better for it. Negonda is treated to shrug off rain. Interior clean, handles unmarked.",
  ph:["Three-quarter","\u00c9toupe Negonda Garden Party 30, open tote, handles upright"]},
 {m:"Herbag",fam:"Herbag Zip 31",
  t:"Herbag Zip 31 In \u00c9cru Canvas And Noir Leather With Palladium Hardware, 2022 Full Set",
  y:2022,c:"Excellent",box:1,pap:1,aed:23500,loc:"Dubai",tag:"",
  size:31,leather:"Canvas & leather",colour:"\u00c9cru",hex:"#DCD4C2",hw:"Palladium",stamp:"U (2022)",
  d:"Canvas body, leather flap, and the Kelly silhouette at a fraction of it. The easiest way into the shape.",
  ph:["Three-quarter","\u00c9cru canvas Herbag Zip 31, flap closed, buckle centred"]}
];
const bagImg = g => g.img || null;
const nBags = f => BAGS.filter(f).length;
const bagsURL = o => 'bags.html' + (o && Object.keys(o).length
  ? '?' + Object.entries(o).map(([k,v]) => k + '=' + encodeURIComponent(v)).join('&') : '');


/* ---------------- shared UI helpers ---------------- */
const inc = (on, label) => `<span class="inc ${on?'on':'off'}"><span class="bx"></span>${label}</span>`;

function productCard(w, i){
  const shots = w.ims.map((im,j)=>`
    <div class="pshot${j===0?' on':''}" data-s="${j}">
      ${im.img ? `<img src="${im.img}" alt="${w.b} ${w.m}">`
               : `<div class="ph"><div class="l1">${im.ph[0]}</div><div class="l2">${im.ph[1]}</div></div>`}
    </div>`).join('');
  /* v2 card — the Sellier grammar: image, small-caps brand, one long
     descriptive title that carries the spec, price. Nothing else. */
  const tag = w.hold ? '<span class="ptag ptag--hold">Reserved</span>'
            : w.tag  ? `<span class="ptag">${w.tag}</span>` : '';
  return `
  <a class="pcard${w.hold?' pcard--hold':''}" href="product.html" data-c="${i}">
    <div class="part">
      ${shots}
      ${tag}
      <div class="zones">${w.ims.map((_,j)=>`<span data-z="${j}"></span>`).join('')}</div>
      <div class="bars">${w.ims.map((_,j)=>`<i class="${j===0?'on':''}"></i>`).join('')}</div>
      <span class="pcta">View watch <em>→</em></span>
    </div>
    <div class="pbody">
      <div class="pbrand">${w.b}</div>
      <div class="pname">${w.t||w.m}</div>
      <div class="pprice money" data-aed="${w.aed}">${money(w.aed)}</div>
      <div class="pspec">${inc(w.box,'Box')}${inc(w.pap,'Papers')}<span class="cond">${w.c}</span></div>
    </div>
  </a>`;
}

/* a bag wears the same card grammar as a watch */
function bagCard(g,i){
  return `
  <a class="pcard" href="bag.html?i=${i}">
    <div class="part">
      <div class="pshot on">${g.img
        ? `<img src="${g.img}" alt="Hermès ${g.fam}">`
        : `<div class="ph"><div class="l1">${g.ph[0]}</div><div class="l2">${g.ph[1]}</div></div>`}</div>
      ${g.tag?`<span class="ptag">${g.tag}</span>`:''}
    </div>
    <div class="pbody">
      <div class="pbrand">Hermès</div>
      <div class="pname">${g.t}</div>
      <div class="pprice money" data-aed="${g.aed}">${money(g.aed)}</div>
      <div class="pspec">${inc(g.box,'Box')}${inc(g.pap,'Receipt')}<span class="cond">${g.c}</span></div>
    </div>
  </a>`;
}

function bindZones(scope){
  (scope||document).querySelectorAll('.pcard').forEach(card=>{
    if(card.dataset.bound) return; card.dataset.bound=1;
    const shots=card.querySelectorAll('.pshot'), bars=card.querySelectorAll('.bars i');
    card.querySelectorAll('.zones span').forEach(z=>{
      z.addEventListener('mouseenter',()=>{const k=+z.dataset.z;
        shots.forEach(s=>s.classList.toggle('on',+s.dataset.s===k));
        bars.forEach((b,j)=>b.classList.toggle('on',j===k));});
    });
    card.addEventListener('mouseleave',()=>{
      shots.forEach(s=>s.classList.toggle('on',+s.dataset.s===0));
      bars.forEach((b,j)=>b.classList.toggle('on',j===0));});
  });
}

function carousel(trackId,prevId,nextId,arrowsId,perStep){
  const track=document.getElementById(trackId); if(!track) return;
  const prev=document.getElementById(prevId), next=document.getElementById(nextId), arrows=document.getElementById(arrowsId);
  const step=()=>{const c=track.firstElementChild;return c?c.offsetWidth+parseFloat(getComputedStyle(track).gap||14):340;};
  next.addEventListener('click',()=>track.scrollBy({left:step()*perStep,behavior:'smooth'}));
  prev.addEventListener('click',()=>track.scrollBy({left:-step()*perStep,behavior:'smooth'}));
  function edges(){const over=track.scrollWidth>track.clientWidth+4;
    arrows.classList.toggle('hide',!over);
    prev.disabled=track.scrollLeft<8;
    next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-8;}
  track.addEventListener('scroll',edges);addEventListener('resize',edges);requestAnimationFrame(edges);
}

/* ---------------- mega menus ---------------- */
/* Every figure below is derived from real stock, and every link carries the
   filter state it promises — so a click always lands on the count shown. */
const famOf = w => w.m.split(/\s*[—–]\s*|\s*“/)[0].trim();
const CAT_ORDER = ["Sports","Dress","Chronographs","Complications","Gold & two-tone","Ladies","Vintage — pre-2000"];
const DIAL_ORDER = ["Black","Blue","Green","White","Silver","Champagne","Grey","Skeleton"];
const DIALHEX = {Black:'#1C1B19',Blue:'#24406B',Green:'#2C5B41',White:'#F4F1EA',
                 Silver:'#C3C2BF',Champagne:'#D8C295',Grey:'#8B8A86',Skeleton:null};
const nWhere = f => CATALOGUE.filter(f).length;
const shopURL = o => 'shop.html' + (o && Object.keys(o).length
  ? '?' + Object.entries(o).map(([k,v]) => k + '=' + encodeURIComponent(v)).join('&') : '');
const AEDMAX = Math.max(...CATALOGUE.map(w => w.aed));
const YMAX = Math.max(...CATALOGUE.map(w => w.y));

const UNDER = () => CUR === 'AED' ? ['Under Dhs. 50,000', 0, 50000] : ['Under £10,000', 0, 47000];
const VAULT = () => CUR === 'AED' ? ['The vault — Dhs. 250,000 +', 250000, null] : ['The vault — £50,000 +', 235000, null];
const BANDS = () => CUR === 'AED'
  ? [['Under 25,000',0,25000],['25,000 – 50,000',25000,50000],['50,000 – 150,000',50000,150000],['150,000 +',150000,null]]
  : [['Under £5,000',0,23500],['£5,000 – £10,000',23500,47000],['£10,000 – £30,000',47000,141000],['£30,000 +',141000,null]];
const inBand = (lo,hi) => nWhere(w => w.aed >= lo && (hi == null || w.aed < hi));
const bandURL = (lo,hi) => shopURL({aed: lo + '-' + (hi == null ? AEDMAX : hi)});

const BROWSE = () => {
  const u = UNDER(), v = VAULT();
  return [
    ['All ' + CATALOGUE.length + ' watches', CATALOGUE.length, shopURL({})],
    ['Latest arrivals',            nWhere(w => w.y >= YMAX - 1), shopURL({y:(YMAX-1)+'-'+YMAX, sort:'year'})],
    ['Unworn',                     nWhere(w => w.c === 'Unworn'), shopURL({cond:'Unworn'})],
    ['Full set — box and papers',  nWhere(w => w.box && w.pap), shopURL({kit:'full'})],
    [u[0],                         inBand(u[1], u[2]), bandURL(u[1], u[2])],
    [v[0],                         inBand(v[1], v[2]), bandURL(v[1], v[2])],
    ['Held in Dubai',              nWhere(w => w.loc === 'Dubai'), shopURL({loc:'Dubai'})],
    ['Held in the UK',             nWhere(w => w.loc === 'United Kingdom'), shopURL({loc:'United Kingdom'})]
  ];
};
const CATS = () => CAT_ORDER
  .map(c => [c, nWhere(w => (w.cat||[]).includes(c)), shopURL({cat:c})])
  .filter(x => x[1]);
const DIALS = () => DIAL_ORDER
  .filter(d => nWhere(w => w.dial === d))
  .map(d => [d, DIALHEX[d], nWhere(w => w.dial === d), shopURL({dial:d})]);
const SIZES = () => [...new Set(CATALOGUE.map(w => w.size))].sort((a,b) => a-b)
  .map(s => [s + ' mm', shopURL({size:s + '-' + s})]);
const BRANDLIST = () => [...new Set(CATALOGUE.map(w => w.b))].map(b => ({
  n: b,
  c: nWhere(w => w.b === b),
  m: [...new Set(CATALOGUE.filter(w => w.b === b).map(famOf))]
       .map(f => [f, nWhere(w => w.b === b && famOf(w) === f)])
       .sort((x,y) => y[1] - x[1])
}));

const $m = id => document.getElementById(id);
const linkList = items => items.map(([a,b,href]) =>
  `<a href="${href || 'shop.html'}">${a}${b ? `<span>${b}</span>` : ''}</a>`).join('');
const miniRow=(w,i)=>{const im=w.ims.find(x=>x.img);
  return `<a class="ni" href="product.html?i=${i}"><span class="im">${im?`<img src="${im.img}" alt="">`:''}</span>
    <span><span class="n">${w.b} ${w.m}</span><span class="p money" data-aed="${w.aed}">${money(w.aed)}</span></span></a>`;};

function buildShopPanel(){
  if(!$m('sh-browse')) return;
  /* re-run on every currency switch — the price language changes with it */
  window.bands = () => {
    $m('sh-browse').innerHTML = linkList(BROWSE());
    const p = $m('sh-prices');
    if(p) p.innerHTML = BANDS().map(([l,lo,hi]) =>
      `<a class="chip" href="${bandURL(lo,hi)}">${l}</a>`).join('');
  };
  window.bands();
  $m('sh-cat').innerHTML = linkList(CATS());
  $m('sh-cond').innerHTML = linkList(['Unworn','Excellent','Very good','Good']
    .map(c => [c, nWhere(w => w.c === c), shopURL({cond:c})]).filter(x => x[1]));
  $m('sh-dials').innerHTML = DIALS().map(([n,hex,c,href]) =>
    `<a class="dial" href="${href}"><i style="background:${hex||'transparent'};${hex?'':'box-shadow:inset 0 0 0 1px #1C1B19'}"></i>${n}<em>${c}</em></a>`).join('');
  $m('sh-sizes').innerHTML = SIZES().map(([l,href]) => `<a class="chip" href="${href}">${l}</a>`).join('');
  $m('sh-new').innerHTML = CATALOGUE.map((w,i) => ({w,i})).sort((a,b) => b.w.y - a.w.y)
    .slice(0,4).map(o => miniRow(o.w,o.i)).join('');
  const full = $m('mb-full'); if(full) full.textContent = nWhere(w => w.box && w.pap);
}

function buildBrandPanel(){
  if(!$m('br-list')) return;
  const BR = BRANDLIST();
  const mm = $m('mb-maisons'); if(mm) mm.textContent = BR.length;
  $m('br-list').innerHTML = BR.map((b,i) =>
    `<button class="mbrand" data-b="${i}" aria-selected="${i===0}">${b.n}<em>${b.c}</em></button>`).join('');
  const show = i => {
    const b = BR[i];
    $m('br-modelh').textContent = b.n + ' — by model';
    $m('br-models').innerHTML =
      `<a href="${shopURL({brand:b.n})}">All ${b.n}<span>${b.c}</span></a>` +
      linkList(b.m.map(([f,c]) => [f, c, shopURL({brand:b.n, fam:f})]));
    $m('br-sigh').textContent = 'In stock — ' + b.n;
    const stock = CATALOGUE.map((w,k) => ({w,k})).filter(o => o.w.b === b.n).slice(0,3);
    $m('br-sig').innerHTML = stock.length
      ? stock.map(o => miniRow(o.w,o.k)).join('')
      : `<p class="mnone">None in the case this week — our concierge can source one.</p>`;
    document.querySelectorAll('.mbrand').forEach(x => x.setAttribute('aria-selected', String(+x.dataset.b === i)));
    repaintMoney();
  };
  show(0);
  document.querySelectorAll('.mbrand').forEach(b => {
    const go = () => show(+b.dataset.b);
    b.addEventListener('mouseenter',go); b.addEventListener('focus',go);
    /* click on a maison goes straight to the filtered case */
    b.addEventListener('click',()=>{ location.href = shopURL({brand: BR[+b.dataset.b].n}); });
  });
}

function initMega(){
  const panels={shop:$m('mega-shop'), bags:$m('mega-bags'),
                services:$m('mega-services'), brands:$m('mega-brands')};
  const scrim=$m('scrim'), navEl=document.querySelector('nav');
  if(!panels.shop || !navEl) return;
  let openT=null, closeT=null, current=null;
  const shut=()=>{clearTimeout(openT);clearTimeout(closeT);current=null;
    Object.values(panels).forEach(p=>p&&p.classList.remove('on'));
    scrim.classList.remove('on');
    document.querySelectorAll('.mtrigger').forEach(t=>{t.classList.remove('open');t.setAttribute('aria-expanded','false')});};
  const open=key=>{clearTimeout(openT);clearTimeout(closeT);current=key;
    Object.entries(panels).forEach(([k,p])=>p&&p.classList.toggle('on',k===key));
    scrim.classList.add('on');
    document.querySelectorAll('.mtrigger').forEach(t=>{
      const on=t.dataset.mega===key;
      t.classList.toggle('open',on); t.setAttribute('aria-expanded',String(on));});};
  const schedClose=()=>{clearTimeout(openT);clearTimeout(closeT);closeT=setTimeout(shut,240)};

  document.querySelectorAll('.mtrigger').forEach(t=>{
    t.setAttribute('aria-expanded','false');
    t.addEventListener('mouseenter',()=>{clearTimeout(closeT);clearTimeout(openT);
      openT=setTimeout(()=>open(t.dataset.mega),90);});
    t.addEventListener('focus',()=>open(t.dataset.mega));
    /* click follows the link — the panel is a preview, not a gate */
  });
  document.querySelectorAll('.links a:not(.mtrigger)').forEach(a=>a.addEventListener('mouseenter',schedClose));
  navEl.addEventListener('mouseenter',()=>clearTimeout(closeT));
  navEl.addEventListener('mouseleave',schedClose);
  Object.values(panels).forEach(p=>p&&p.addEventListener('mouseenter',()=>{clearTimeout(closeT);clearTimeout(openT)}));
  scrim.addEventListener('click',shut);
  addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
}

function buildBagPanel(){
  if(!$m('bg-browse')) return;
  const B=CUR==='AED'
    ? [['Under Dhs. 50,000',0,50000],['Dhs. 250,000 +',250000,null]]
    : [['Under £10,000',0,47000],['£55,000 +',258500,null]];
  const band=(lo,hi)=>bagsURL({band:lo+'-'+(hi==null?'x':hi)});
  const YB=Math.max(...BAGS.map(g=>g.y));
  $m('bg-browse').innerHTML=[
    ['All '+BAGS.length+' handbags', BAGS.length, bagsURL({})],
    ['Latest arrivals', nBags(g=>g.y>=YB), bagsURL({sort:'new'})],
    ['Unworn', nBags(g=>g.c==='Unworn'), bagsURL({cond:'Unworn'})],
    ['Full set — box and receipt', nBags(g=>g.box&&g.pap), bagsURL({})],
    [B[0][0], nBags(g=>g.aed<B[0][2]), band(B[0][1],B[0][2])],
    [B[1][0], nBags(g=>g.aed>=B[1][1]), band(B[1][1],B[1][2])],
    ['Held in Dubai', nBags(g=>g.loc==='Dubai'), bagsURL({loc:'Dubai'})],
    ['Held in the UK', nBags(g=>g.loc==='United Kingdom'), bagsURL({loc:'United Kingdom'})]
  ].map(([a,b,href])=>`<a href="${href}">${a}<span>${b}</span></a>`).join('');

  $m('bg-model').innerHTML=[...new Set(BAGS.map(g=>g.m))].sort()
    .map(m=>`<a href="${bagsURL({model:m})}">${m}<span>${nBags(g=>g.m===m)}</span></a>`).join('');

  const cols=[...new Set(BAGS.map(g=>g.colour))].sort();
  $m('bg-colour').innerHTML=cols.map(col=>{
    const hex=(BAGS.find(g=>g.colour===col)||{}).hex;
    return `<a class="dial" href="${bagsURL({colour:col})}"><i style="background:${hex}"></i>${col}
      <em>${nBags(g=>g.colour===col)}</em></a>`;}).join('');

  $m('bg-size').innerHTML=[...new Set(BAGS.map(g=>g.size))].sort((a,b)=>a-b)
    .map(s=>`<a class="chip" href="${bagsURL({size:s})}">${s} cm</a>`).join('');
  $m('bg-leather').innerHTML=[...new Set(BAGS.map(g=>g.leather))].sort()
    .map(l=>`<a class="chip" href="${bagsURL({leather:l})}">${l}</a>`).join('');

  const newest=BAGS.map((g,i)=>({g,i})).sort((a,b)=>b.g.y-a.g.y).slice(0,4);
  $m('bg-new').innerHTML=newest.map(({g,i})=>`
    <a class="ni" href="bag.html?i=${i}">
      <span class="im">${g.img?`<img src="${g.img}" alt="">`:''}</span>
      <span><span class="n">${g.fam}</span>
      <span class="p money" data-aed="${g.aed}">${money(g.aed)}</span></span></a>`).join('');
  $m('bg-count').textContent=BAGS.length;
}

function buildMega(){ buildShopPanel(); buildBagPanel(); buildBrandPanel(); initMega(); }

/* ---------------- currency ---------------- */
function repaintMoney(){
  document.querySelectorAll('.money').forEach(el=>el.textContent=money(+el.dataset.aed));
  const cn=document.getElementById('curName'); if(cn) cn.textContent=CUR;
  if(typeof window.bands==='function') window.bands();
  if(typeof window.onCurrency==='function') window.onCurrency();
}
function initCurrency(){
  document.querySelectorAll('.seg button').forEach(b=>{
    b.setAttribute('aria-pressed', String(b.dataset.cur===CUR));
    b.addEventListener('click',()=>{
      CUR=b.dataset.cur; localStorage.setItem('osw-cur',CUR);
      document.querySelectorAll('.seg button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.cur===CUR)));
      repaintMoney();
    });
  });
}

/* ---------------- header elevation ---------------- */
function initHeader(){
  const n=document.querySelector('nav'); if(!n) return;
  const f=()=>n.classList.toggle('stuck', window.scrollY>10);
  addEventListener('scroll',f,{passive:true}); f();
  document.querySelectorAll('.nstock').forEach(e => e.textContent = CATALOGUE.length);
  const maisons = new Set(CATALOGUE.map(w => w.b)).size;
  document.querySelectorAll('.nmaisons').forEach(e => e.textContent = maisons);
  const page=document.body.dataset.page;
  document.querySelectorAll('.links a, .links .mtrigger').forEach(a=>{
    if(a.dataset.nav===page) a.classList.add('current');
  });
}

/* ---------------- header search ---------------- */
const PAGES=[
 ['Sell or part-exchange','A firm offer within 24 hours, paid the same day','sell.html'],
 ['Concierge sourcing','Name the reference — we hunt it down','sourcing.html'],
 ['Servicing &amp; polishing','Swiss-trained watchmakers, our own bench','servicing.html'],
 ['Authentication','41 checks and a written report','servicing.html'],
 ['Visit us','Dubai daily, the UK by appointment','visit.html'],
 ['The journal','Notes from the case','journal.html'],
 ['About One Street','Who we are and why we started','about.html'],
 ['Contact','A real person, seven days a week','contact.html']
];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const hl = (t,q) => {
  if(!q) return esc(t);
  const i = t.toLowerCase().indexOf(q.toLowerCase());
  return i < 0 ? esc(t)
    : esc(t.slice(0,i)) + '<mark>' + esc(t.slice(i,i+q.length)) + '</mark>' + esc(t.slice(i+q.length));
};

function initSearch(){
  const input = $m('q'), box = $m('sug');
  if(!input || !box) return;
  let items = [], cur = -1;
  const shut = () => { box.classList.remove('on'); input.setAttribute('aria-expanded','false'); cur = -1; };

  const quick = (k,label,href) =>
    `<a class="quick" href="${href}" role="option"><span class="k">${k||''}</span>
     <span class="tx"><span class="n">${label}</span></span></a>`;
  const pageRow = (p,q) =>
    `<a href="${p[2]}" role="option"><span class="k" style="width:42px;flex:none"></span>
     <span class="tx"><span class="n">${q?hl(p[0],q):p[0]}</span><span class="s">${p[1]}</span></span></a>`;
  const watchRow = (w,i,q) => {
    const im = w.ims.find(x => x.img);
    return `<a href="product.html?i=${i}" role="option">
      <span class="im">${im?`<img src="${im.img}" alt="">`:`<span>${esc(w.b.slice(0,3))}</span>`}</span>
      <span class="tx"><span class="n">${hl(w.b+' '+w.m,q)}</span>
      <span class="s">Ref. ${hl(w.r,q)} &nbsp;·&nbsp; ${w.y} &nbsp;·&nbsp; ${w.c}</span></span>
      <span class="p money" data-aed="${w.aed}">${money(w.aed)}</span></a>`;
  };

  function paint(){
    const q = input.value.trim();
    let h = '';
    if(!q){
      h += `<div class="sughead">By brand</div>`;
      BRANDLIST().slice(0,4).forEach(b => { h += quick(b.c, b.n, shopURL({brand:b.n})); });
      const u = UNDER();
      h += `<div class="sughead sep">Jump straight to</div>`
         + quick('', 'Unworn only', shopURL({cond:'Unworn'}))
         + quick('', 'Full set — box and papers', shopURL({kit:'full'}))
         + quick('', u[0], bandURL(u[1],u[2]))
         + `<div class="sughead sep">Elsewhere on the site</div>`
         + PAGES.slice(0,5).map(p => pageRow(p,'')).join('')
         + `<a class="all" href="shop.html">Browse all ${CATALOGUE.length} watches →</a>`;
    } else {
      const ql = q.toLowerCase();
      const hits = CATALOGUE.map((w,i) => ({w,i})).filter(o =>
        (o.w.b+' '+o.w.m+' '+o.w.r+' '+o.w.dial+' '+o.w.y+' '+o.w.loc).toLowerCase().includes(ql));
      const brands = [...new Set(CATALOGUE.map(w => w.b))].filter(b => b.toLowerCase().includes(ql));
      const fams = [...new Set(CATALOGUE.map(famOf))].filter(f => f.toLowerCase().includes(ql));
      const pages = PAGES.filter(p => (p[0]+' '+p[1]).toLowerCase().includes(ql));
      if(!hits.length && !brands.length && !fams.length && !pages.length){
        h = `<div class="none">Nothing in the case matches “${esc(q)}” right now.<br>
             Tell our concierge what you are after — average time to source is 48 hours.</div>
             <a class="all" href="sourcing.html">Start a sourcing request →</a>`;
      } else {
        if(brands.length || fams.length){
          h += `<div class="sughead">Collections</div>`;
          brands.slice(0,3).forEach(b => { h += quick(nWhere(w => w.b === b), hl(b,q), shopURL({brand:b})); });
          fams.slice(0,4).forEach(f => {
            const b = CATALOGUE.find(w => famOf(w) === f).b;
            h += quick(nWhere(w => famOf(w) === f), esc(b)+' '+hl(f,q), shopURL({brand:b, fam:f}));
          });
        }
        if(hits.length){
          h += `<div class="sughead${(brands.length||fams.length)?' sep':''}">Watches<em>${hits.length} in stock</em></div>`;
          hits.slice(0,5).forEach(o => { h += watchRow(o.w, o.i, q); });
        }
        if(pages.length){
          h += `<div class="sughead sep">Pages</div>` + pages.slice(0,3).map(p => pageRow(p,q)).join('');
        }
        h += `<a class="all" href="${shopURL({q})}">See ${hits.length} result${hits.length===1?'':'s'} for “${esc(q)}” →</a>`;
      }
    }
    box.innerHTML = h;
    box.querySelectorAll('.money').forEach(e => e.textContent = money(+e.dataset.aed));
    items = [...box.querySelectorAll('a')];
    cur = -1;
    box.classList.add('on');
    input.setAttribute('aria-expanded','true');
  }

  input.addEventListener('input', paint);
  input.addEventListener('focus', paint);
  input.addEventListener('keydown', e => {
    if(e.key === 'Escape'){ shut(); input.blur(); return; }
    if(e.key === 'ArrowDown' || e.key === 'ArrowUp'){
      if(!box.classList.contains('on')){ paint(); return; }
      e.preventDefault();
      if(!items.length) return;
      cur = e.key === 'ArrowDown' ? (cur+1) % items.length : (cur-1+items.length) % items.length;
      items.forEach((a,j) => a.classList.toggle('cursor', j === cur));
      items[cur].scrollIntoView({block:'nearest'});
      return;
    }
    if(e.key === 'Enter'){
      e.preventDefault();
      if(cur >= 0 && items[cur]) location.href = items[cur].getAttribute('href');
      else if(input.value.trim()) location.href = shopURL({q: input.value.trim()});
    }
  });
  document.addEventListener('click', e => { if(!e.target.closest('.srchwrap')) shut(); });
  /* the mega menu and the suggestion list must never be open together */
  document.querySelectorAll('.mtrigger').forEach(t => t.addEventListener('mouseenter', shut));
}

/* ---------------- book a viewing — drawdown ----------------
   Desktop only: the header link opens a compact request panel under the
   mast instead of leaving the page. The full calendar stays one click
   away, and the link still navigates if JS never runs. */
function initBookPanel(){
  if(!matchMedia('(min-width:980px)').matches) return;
  const trig=document.querySelector('a.bag'); if(!trig) return;
  const nav=document.querySelector('nav'); if(!nav) return;

  const days=[];
  const now=new Date();
  for(let i=0;i<7;i++){
    const d=new Date(now); d.setDate(now.getDate()+i);
    days.push({v:d.toISOString().slice(0,10),
      l:i===0?'Today':i===1?'Tomorrow':d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})});
  }
  const chip=(k,v,l)=>`<button class="bpc" data-k="${k}" data-v="${v}">${l}</button>`;
  const panel=document.createElement('div');
  panel.className='bookpanel'; panel.id='bookpanel';
  panel.setAttribute('role','dialog'); panel.setAttribute('aria-label','Book a viewing');
  panel.innerHTML=`
    <div class="bph"><span>Book a viewing</span><button class="bpx" aria-label="Close">×</button></div>
    <div class="bpl">Where</div>
    <div class="bpchips">${chip('type','Dubai boutique','Dubai boutique')}${chip('type','United Kingdom','United Kingdom')}${chip('type','Video call','Video call')}</div>
    <div class="bpl">Day</div>
    <div class="bpchips">${days.map(d=>chip('day',d.v,d.l)).join('')}</div>
    <div class="bpl">Time</div>
    <div class="bpchips">${chip('time','Morning','Morning')}${chip('time','Afternoon','Afternoon')}${chip('time','Evening','Evening')}</div>
    <input class="bpin" id="bp-name" type="text" placeholder="Your name" autocomplete="name">
    <input class="bpin" id="bp-contact" type="text" placeholder="Email or phone" autocomplete="email">
    <button class="bpgo" id="bp-go" disabled>Request this viewing <span class="a">→</span></button>
    <div class="bperr" id="bp-err" hidden>That didn’t send — <a href="book.html">use the full calendar</a>
      or <a href="https://wa.me/message/55ILJOASJYUAD1">WhatsApp us</a>.</div>
    <a class="bpfull" href="book.html">Prefer an exact slot? Open the full calendar →</a>`;
  nav.appendChild(panel);

  const S={}; let sending=false;
  const go=panel.querySelector('#bp-go');
  const name=panel.querySelector('#bp-name'), contact=panel.querySelector('#bp-contact');
  const contactOK=v=>/@.+\./.test(v)||(v.replace(/\D/g,'').length>=7);
  const refresh=()=>{ go.disabled=sending||!(S.type&&S.day&&S.time&&name.value.trim()&&contactOK(contact.value.trim())); };
  panel.querySelectorAll('.bpc').forEach(c=>c.addEventListener('click',()=>{
    const k=c.dataset.k, on=S[k]===c.dataset.v;
    S[k]=on?null:c.dataset.v;
    panel.querySelectorAll(`.bpc[data-k="${k}"]`).forEach(x=>x.classList.toggle('on',!on&&x===c));
    refresh();
  }));
  [name,contact].forEach(i=>i.addEventListener('input',refresh));

  go.addEventListener('click',async()=>{
    if(go.disabled) return;
    sending=true; refresh(); go.innerHTML='Sending…';
    panel.querySelector('#bp-err').hidden=true;
    try{
      const r=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({page:'viewing',brand:S.type,model:S.day+' — '+S.time,
          contact:name.value.trim()+' · '+contact.value.trim(),photos:[]})});
      if(!r.ok) throw 0;
      panel.querySelector('.bph span').textContent='Requested';
      panel.innerHTML=`<div class="bph"><span>Requested</span><button class="bpx" aria-label="Close">×</button></div>
        <p class="bpdone">Thank you — we will confirm your ${S.type} viewing for
        <b>${S.day}, ${S.time.toLowerCase()}</b> shortly, usually within the hour.</p>
        <a class="bpfull" href="book.html">Or pick an exact slot on the calendar →</a>`;
      panel.querySelector('.bpx').addEventListener('click',close);
    }catch(e){
      sending=false; go.innerHTML='Request this viewing <span class="a">→</span>';
      panel.querySelector('#bp-err').hidden=false; refresh();
    }
  });

  const open=()=>{ panel.classList.add('on'); trig.setAttribute('aria-expanded','true'); };
  const close=()=>{ panel.classList.remove('on'); trig.setAttribute('aria-expanded','false'); };
  trig.setAttribute('aria-haspopup','dialog'); trig.setAttribute('aria-expanded','false');
  trig.addEventListener('click',e=>{
    e.preventDefault();
    panel.classList.contains('on')?close():open();
  });
  panel.querySelector('.bpx').addEventListener('click',close);
  document.addEventListener('click',e=>{
    if(!e.target.closest('#bookpanel') && !e.target.closest('a.bag')) close();
  });
  addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  /* opening a mega closes the panel and vice versa */
  document.querySelectorAll('.mtrigger').forEach(t=>t.addEventListener('mouseenter',close));
}

document.addEventListener('DOMContentLoaded',()=>{ buildMega(); initCurrency(); initHeader(); initSearch(); initBookPanel(); repaintMoney(); });

/* ============================================================
   MOBILE — header menu and search.
   No dock, no bottom sheets. The phone gets the same site as the
   desktop, navigated the way the web is normally navigated.
   ============================================================ */
const MQ = matchMedia('(max-width:979px)');
const ICON = {
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  close:'<path d="M5 5l14 14M19 5L5 19"/>',
  wa:'<path d="M3 21l1.6-4.4A8.5 8.5 0 1 1 12 20.5a8.4 8.4 0 0 1-4.2-1.1L3 21Z"/>'
};
const svg = d => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;

/* every destination, visible — nothing hidden behind "More" */
/* Three things people come to do, then the rest. Labels in their words,
   not ours — "Find me a watch", not "Concierge sourcing". */
const PRIMARY = [
  {t:'Browse all watches', s:'', href:'shop.html', k:'case'},
  {t:'Ask us anything', s:'On WhatsApp, seven days', href:'#wa', k:'wa'},
  {t:'Book a viewing',  s:'Dubai, the UK or on camera', href:'book.html', k:'book'}
];
const NAV = [
  /* Watches repeats the first tile as a plain link — the tile is easy to
     read past, and the list is where people look for a category. */
  {t:'Watches',             href:'shop.html'},
  {t:'Handbags',            href:'bags.html'},
  {t:'Sell a watch',        href:'sell.html'},
  {t:'Find me a watch',     href:'sourcing.html'},
  {t:'Services & repairs',  href:'servicing.html'},
  {t:'Visit us',            href:'visit.html'},
  {t:'The community',       href:'community.html'},
  {t:'About One Street',    href:'about.html'}
];
const WANO=WA_LINK;

let built=false;
function buildShell(){
  if(built) return; built=true;
  const nav=document.querySelector('nav');

  if(nav && !nav.querySelector('.mact')){
    const a=document.createElement('div');
    a.className='mact';
    a.innerHTML=`<button class="mbtn" id="m-search" aria-label="Search">${svg(ICON.search)}</button>
      <button class="mbtn" id="m-menu" aria-label="Menu" aria-expanded="false">${svg(ICON.menu)}</button>`;
    nav.appendChild(a);
  }

  if(!document.getElementById('navmenu')){
    const m=document.createElement('div');
    m.id='navmenu'; m.className='navmenu';
    m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-label','Menu');
    m.innerHTML=`<div class="navmenu__bar">
        <span class="t-label">Menu</span>
        <button class="mbtn" id="m-close" aria-label="Close menu">${svg(ICON.close)}</button>
      </div>
      <div class="navmenu__body">
        <div class="navbig">
          ${PRIMARY.map(r=>`<a class="navtile" href="${r.k==='wa'?WANO:r.href}" data-k="${r.k}">
            <span class="navtile__t">${r.t}</span>
            ${r.s?`<span class="navtile__s">${r.s}</span>`:'<span class="navtile__s" data-n="stock"></span>'}
            <span class="navtile__a">→</span></a>`).join('')}
        </div>
        <div class="navrest">
          ${NAV.map(r=>`<a class="navlink" href="${r.href}">${r.t}</a>`).join('')}
        </div>
        <div class="navfoot">
          <div class="navcur">
            <button data-c="AED" aria-pressed="${CUR==='AED'}">AED</button>
            <button data-c="GBP" aria-pressed="${CUR==='GBP'}">GBP</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(m);
    document.getElementById('m-close').addEventListener('click',closeMenu);
    const sc=m.querySelector('[data-n="stock"]'); if(sc) sc.textContent=CATALOGUE.length+' in stock now';
    m.querySelectorAll('.navcur button').forEach(b=>b.addEventListener('click',()=>{
      CUR=b.dataset.c; localStorage.setItem('osw-cur',CUR);
      m.querySelectorAll('.navcur button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.c===CUR)));
      document.querySelectorAll('.seg button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.cur===CUR)));
      repaintMoney();
    }));
  }

  if(!document.getElementById('msearch')){
    const s=document.createElement('div');
    s.id='msearch'; s.className='msearch';
    s.innerHTML=`<div class="msbar">
        <label class="fld">${svg(ICON.search)}
          <input id="mq" type="search" enterkeyhint="search" autocomplete="off"
                 placeholder="Search a model or a reference"></label>
        <button class="cancel" id="mcancel">Cancel</button>
      </div><div class="msres" id="msres"></div>`;
    document.body.appendChild(s);
    document.getElementById('mcancel').addEventListener('click',closeSearch);
    document.getElementById('mq').addEventListener('input',paintSearch);
  }

  document.getElementById('m-menu').addEventListener('click',openMenu);
  document.getElementById('m-search').addEventListener('click',openSearch);
  addEventListener('keydown',e=>{ if(e.key==='Escape'){closeMenu();closeSearch();} });

  const shade=()=>nav&&nav.classList.toggle('stuck',scrollY>4);
  addEventListener('scroll',shade,{passive:true}); shade();

  const page=document.body.dataset.page||'';
  const here={shop:'shop.html',sell:'sell.html',sourcing:'sourcing.html',
              servicing:'servicing.html',visit:'visit.html',book:'book.html'}[page];
  if(here) document.querySelectorAll(`.navlink[href="${here}"]`).forEach(a=>a.classList.add('on'));
}

function openMenu(){
  const m=document.getElementById('navmenu'); if(!m) return;
  m.classList.add('on');
  document.getElementById('m-menu').setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden';
}
function closeMenu(){
  const m=document.getElementById('navmenu'); if(!m) return;
  m.classList.remove('on');
  document.getElementById('m-menu')?.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}
function openSearch(){
  const s=document.getElementById('msearch'); if(!s) return;
  s.classList.add('on');
  document.body.style.overflow='hidden';
  paintSearch();
  setTimeout(()=>document.getElementById('mq').focus(),60);
}
function closeSearch(){
  const s=document.getElementById('msearch'); if(!s) return;   /* never built on desktop */
  s.classList.remove('on');
  document.body.style.overflow='';
}
function paintSearch(){
  const q=(document.getElementById('mq').value||'').trim();
  const box=document.getElementById('msres');
  const row=(w,i)=>{const im=w.ims.find(x=>x.img);
    return `<a class="navlink navlink--w" href="product.html?i=${i}">
      <span class="im">${im?`<img src="${im.img}" alt="">`:''}</span>
      <span class="tx"><span class="n">${w.b} ${w.m}</span>
      <span class="s">Ref. ${w.r} · ${w.y}</span></span>
      <span class="p">${money(w.aed)}</span></a>`;};
  if(!q){
    box.innerHTML=`<div class="navgroup"><div class="t-label">By brand</div>`+
      BRANDLIST().map(b=>`<a class="navlink" href="${shopURL({brand:b.n})}">${b.n}<em>${b.c}</em></a>`).join('')+
      `</div><div class="navgroup"><div class="t-label">Jump to</div>`+
      [['Unworn only',shopURL({cond:'Unworn'})],['Full set',shopURL({kit:'full'})],
       ['All watches','shop.html']]
      .map(([t,h])=>`<a class="navlink" href="${h}">${t}</a>`).join('')+`</div>`;
    return;
  }
  const ql=q.toLowerCase();
  const hits=CATALOGUE.map((w,i)=>({w,i})).filter(o=>
    (o.w.b+' '+o.w.m+' '+o.w.r+' '+o.w.dial+' '+o.w.y).toLowerCase().includes(ql));
  box.innerHTML = hits.length
    ? `<div class="navgroup"><div class="t-label">${hits.length} watch${hits.length>1?'es':''}</div>`+
      hits.map(o=>row(o.w,o.i)).join('')+
      `<a class="navwa navwa--plain" href="${shopURL({q})}">Open in the case</a></div>`
    : `<div class="navgroup"><div class="t-label">No match</div>
       <p class="t-body">Nothing in the case matches “${q}”. Our concierge can source it.</p>
       <a class="navwa navwa--plain" href="sourcing.html">Start a sourcing request</a></div>`;
}

function sync(){ if(MQ.matches) buildShell(); else { closeMenu(); closeSearch(); } }
window.osMobile=()=>MQ.matches;
document.addEventListener('DOMContentLoaded',()=>{ sync(); MQ.addEventListener?.('change',sync); });

/* ============================================================
   SELL & SOURCING — mobile
   Both pages asked for 16 fields before giving anything back, on a site
   where the only conversion is a WhatsApp message. They become a short
   composer: three taps and a model name produce a complete enquiry.
   ============================================================ */
const MAISONS=['Rolex','Patek Philippe','Audemars Piguet','Cartier','Omega','Other'];
const FLOW={
  sell:{
    eyebrow:'Free valuation',
    title:'What is your watch worth?',
    lede:'Four photographs and two minutes is usually enough for a real number.',
    fields:[
      {k:'brand', l:'What are you selling?', type:'chips', opts:MAISONS, otherPh:'Which brand? e.g. Tudor'},
      {k:'model', l:'Model or reference',    type:'text',  ph:'Submariner 116610LV'},
      {k:'cond',  l:'Condition',             type:'chips', opts:['Unworn','Excellent','Very good','Good']},
      {k:'kit',   l:'What is included',      type:'chips', opts:['Full set','Box only','Papers only','Watch only']}
    ],
    cta:'Get a valuation on WhatsApp',
    note:'Send four photos — front, back, clasp and papers — and we come back with a firm number within 24 hours.',
    msg:v=>`Hello — I would like a valuation.\n\n${v.brand||''} ${v.model||''}\n`+
           `Condition: ${v.cond||'—'}\nIncludes: ${v.kit||'—'}\n\nI will send photographs next.`
  },
  sourcing:{
    eyebrow:'No fee unless we find it',
    title:'Name the reference.',
    lede:'Tell us what you are after. Most searches close in about 48 hours.',
    fields:[
      {k:'brand',  l:'Which brand?',         type:'chips', opts:MAISONS, otherPh:'Which brand? e.g. Vacheron Constantin'},
      {k:'model',  l:'Model or reference',   type:'text',  ph:'Daytona 116500LN, white dial'},
      {k:'budget', l:'Budget',               type:'chips', opts:['Under 50k','50–150k','150–350k','350k +','Open']}
    ],
    cta:'Start the search on WhatsApp',
    note:'One person looks after your search from the first message to the handover. No fee unless we find it.',
    msg:v=>`Hello — I am looking for a watch.\n\n${v.brand||''} ${v.model||''}\n`+
           `Budget: ${v.budget||'—'}\n\nCan you find it?`
  }
};

function buildFlowPage(){
  const page=document.body.dataset.page;
  const cfg=FLOW[page]; if(!cfg) return;
  const head=document.querySelector('.phead'); if(!head) return;

  /* compact intro — the 40-word lede goes */
  const h1=head.querySelector('h1'); if(h1) h1.textContent=cfg.title;
  const lede=head.querySelector('.lede'); if(lede) lede.textContent=cfg.lede;
  if(h1 && !head.querySelector('.t-label')){
    const e=document.createElement('div'); e.className='t-label';
    e.textContent=cfg.eyebrow; h1.before(e);       /* h1 may be nested in .wrap */
  }

  /* SEL is what was tapped; V is what we actually send. They differ for
     "Other", where the tap only asks a question and the typed answer is
     the value. */
  const SEL={}, V={};
  const box=document.createElement('section');
  box.className='mflow';
  box.innerHTML=cfg.fields.map(f=>`
    <div class="mfield" data-k="${f.k}">
      <div class="t-label">${f.l}</div>
      ${f.type==='chips'
        ? `<div class="mchipset">${f.opts.map(o=>`<button class="mchip2" data-v="${o}">${o}</button>`).join('')}</div>`
          + (f.opts.indexOf('Other')>-1
             ? `<input class="mtext mother" type="text" autocomplete="off"
                       placeholder="${f.otherPh||'Tell us which'}" aria-label="${f.otherPh||'Tell us which'}">`
             : '')
        : `<input class="mtext" data-k="${f.k}" type="text" placeholder="${f.ph}" autocomplete="off">`}
    </div>`).join('')
    + `<button class="mflowgo" id="mflowgo" disabled>${cfg.cta} <span class="a">→</span></button>
       <p class="mflownote">${cfg.note}</p>`;
  head.after(box);

  const go=document.getElementById('mflowgo');
  const refresh=()=>{
    const ok=V.brand && (V.model||'').trim().length>1;
    go.disabled=!ok;
    go.onclick=ok?()=>{ location.href=waURL(cfg.msg(V)); }:null;
  };
  box.querySelectorAll('.mchipset').forEach(set=>{
    const field=set.parentElement, k=field.dataset.k;
    const other=field.querySelector('.mother');
    const settle=()=>{ V[k]=SEL[k]==='Other' ? ((other&&other.value.trim())||null) : (SEL[k]||null); refresh(); };
    set.querySelectorAll('.mchip2').forEach(c=>c.addEventListener('click',()=>{
      const on=SEL[k]===c.dataset.v;                 /* tapping the live chip clears it */
      SEL[k]=on?null:c.dataset.v;
      set.querySelectorAll('.mchip2').forEach(x=>x.classList.toggle('on',!on&&x===c));
      if(other){
        const ask=SEL[k]==='Other';
        field.classList.toggle('askother',ask);
        if(ask) requestAnimationFrame(()=>other.focus());
        else other.value='';
      }
      settle();
    }));
    if(other) other.addEventListener('input',settle);
  });
  box.querySelectorAll('.mtext[data-k]').forEach(t=>
    t.addEventListener('input',()=>{V[t.dataset.k]=t.value;refresh();}));
  refresh();

  /* the numbered process list becomes taps, like the authentication section */
  const list=document.querySelector('.nlist');
  if(list){
    const rows=[...list.querySelectorAll('.nrow')].map(r=>[
      (r.querySelector('.n')||{}).textContent||'',
      (r.querySelector('h4')||{}).textContent||'',
      (r.querySelector('p')||{}).textContent||'']);
    if(rows.length){
      list.classList.add('msteps');
      list.innerHTML=`<div class="mstepchips" role="tablist">${rows.map((r,i)=>
          `<button role="tab" aria-selected="${i===0}" data-i="${i}"><b>${r[0].trim()}</b><span>${r[1]}</span></button>`).join('')}</div>
        <div class="msteppanel"></div>`;
      const panel=list.querySelector('.msteppanel');
      const show=i=>{panel.innerHTML=`<h4>${rows[i][1]}</h4><p>${rows[i][2]}</p>`;
        list.querySelectorAll('[role=tab]').forEach((t,j)=>t.setAttribute('aria-selected',String(j===i)));};
      list.querySelectorAll('[role=tab]').forEach(t=>t.addEventListener('click',()=>{
        show(+t.dataset.i); t.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});}));
      show(0);
    }
  }
}
document.addEventListener('DOMContentLoaded',()=>{
  if(window.osMobile && osMobile()) setTimeout(buildFlowPage,0);
});
