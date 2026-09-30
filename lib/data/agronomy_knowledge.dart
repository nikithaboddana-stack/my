import '../models/types.dart';

const List<ProblemCategoryItem> kProblemCategories = [
  ProblemCategoryItem(
    id: 'I want to save water',
    icon: '💧',
    title: 'I want to save water',
    description: 'Practical techniques to cut water loss without hurting yield',
    color: 'teal',
  ),
  ProblemCategoryItem(
    id: 'My irrigation needs improvement',
    icon: '🚿',
    title: 'My irrigation needs improvement',
    description: 'Fix emitter clogs, manage pressure, and maintain lines',
    color: 'cyan',
  ),
  ProblemCategoryItem(
    id: 'I want to understand my crop',
    icon: '🌾',
    title: 'I want to understand my crop',
    description: 'Match water amounts to crop growth stages and seasons',
    color: 'amber',
  ),
  ProblemCategoryItem(
    id: 'I want to understand my soil',
    icon: '🌱',
    title: 'I want to understand my soil',
    description: 'Sand, loam, and clay drainage and moisture holding capacity',
    color: 'emerald',
  ),
  ProblemCategoryItem(
    id: 'I have water shortage',
    icon: '☀️',
    title: 'I have water shortage',
    description: 'Manage dry spells, deficit irrigation, and protect yields',
    color: 'orange',
  ),
  ProblemCategoryItem(
    id: 'I want to use rainwater',
    icon: '🌧️',
    title: 'I want to use rainwater',
    description: 'Farm ponds, harvesting field runoff, and recharging wells',
    color: 'sky',
  ),
];

const List<KnowledgeArticle> kAgronomyArticles = [
  KnowledgeArticle(
    id: 'drip-irrigation-maintenance',
    title: 'Drip Irrigation Efficiency & Emitter Clog Prevention',
    category: 'Irrigation Technology',
    problemCategory: 'My irrigation needs improvement',
    readTime: '6 min read',
    benefitLabel: 'Can save 30–50% water vs flood irrigation',
    keywords: [
      'drip',
      'emitter',
      'clogging',
      'filter',
      'flush',
      'pressure',
      'venturi',
      'fertigation',
      'acid treatment',
      'submain'
    ],
    whatIsIt:
        'Drip irrigation delivers small, measured amounts of water directly to the crop root zone through a network of valves, pipes, tubing, and emitters. Rather than wetting the entire field surface, water is localized right where active feeder roots thrive.',
    howWaterReachesRoots:
        'Water passes from the water source through a filtration unit, flows into mainline and submain conduits under regulated pressure (typically 1.0–1.5 bar / 14–21 psi), and enters polyethylene laterals. Emitters dissipate pressure, dripping water slowly (usually 1.0 to 4.0 liters per hour) into the soil, creating a wetted onion-shaped moisture bulb below each dripper.',
    benefits: [
      'Cuts evaporative loss from bare soil between crop rows.',
      'Prevents deep percolation and groundwater leaching of costly fertilizers.',
      'Keeps crop foliage completely dry, drastically reducing fungal diseases.',
      'Maintains stable soil moisture, avoiding water-stress shocks.'
    ],
    whyItMatters:
        'When emitters clog from silt, algae, or calcium carbonate scales, water distribution becomes severely uneven. Some crops receive zero water while others drown, destroying harvest uniformity.',
    whatCanFarmerDo: [
      'Inspect filter pressure gauges daily: If differential pressure between inlet and outlet exceeds 0.5 bar (7 psi), backwash sand media filters or flush disc rings immediately.',
      'Flush lateral ends every two weeks: Open end-caps while the pump runs to discharge accumulated silt and fine particles.',
      'Check operating pressure at the farthest lateral tail-end using a handheld pressure gauge to ensure minimum 1.0 bar pressure.',
      'Conduct organic biological shock or mineral acid treatment if emitters display carbonate crusting, guided by water test results.'
    ],
    filtrationAndPressure:
        'Filtration is the heart of a drip system. Sand media filters remove organic debris from open ponds/canals; screen or disc filters catch inorganic mineral grains. Operating without a filter guarantees emitter failure within weeks.',
    lateralFlushingAndInspection:
        'Walk laterals early in the morning. Inspect the soil wetted bulb around each plant. Dry patches or pooling puddles indicate clogged emitters or punctured lateral tubing.',
    signsOfClogging: [
      'Uneven plant height along the same lateral row.',
      'Emitters dribbling mist instead of steady periodic drops.',
      'White chalky crusts around emitter orifices (indicates hard water carbonates).',
      'Punctured tubes spurting water jets due to high upstream pressure.'
    ],
    maintenanceSteps: [
      'Daily: Clean secondary screen/disc filter rings with clean water and a soft nylon brush.',
      'Bi-weekly: Open end-line flush valves on 3–4 laterals at a time until discharged water runs crystal clear.',
      'Monthly: Check pressure regulator valves and clean air release vacuum valves.',
      'Seasonal: Inject food-grade dilute hydrochloric or phosphoric acid (target pH 4.0–4.5 for 30–60 min) to dissolve hard calcium carbonate scale, followed by thorough flushing.'
    ],
    thingsToCheck: [
      'Is pump pressure adequate at the tail-end of your farthest field plot?',
      'Are disc filter rings tightly compressed and intact without cracks?',
      'Do laterals show rodent bites or tractor wheel crimping?'
    ],
    importantCaution:
        'Always consult a certified drip technician or agricultural extension officer before handling concentrated acids for emitter cleaning. Wear protective eyewear and acid-resistant gloves. Never pour water into acid.',
    relatedTool: ArticleRelatedTool(
      label: 'Log Water Record for Drip Lines',
      targetTab: 'records',
      description: 'Record water volume delivered today to verify your emitter output rate.',
    ),
    references: [
      'FAO Irrigation and Drainage Paper 29 — Water quality for agriculture',
      'FAO Training Manual 5 — Irrigation Methods & Drip Operation'
    ],
  ),
  KnowledgeArticle(
    id: 'soil-texture-awc',
    title: 'Soil Texture & Available Water Capacity (AWC)',
    category: 'Soil Moisture',
    problemCategory: 'I want to understand my soil',
    readTime: '5 min read',
    benefitLabel: 'Prevents over-watering and leaching in light soils',
    keywords: [
      'soil',
      'texture',
      'clay',
      'sand',
      'loam',
      'silt',
      'awc',
      'field capacity',
      'wilting point',
      'infiltration'
    ],
    whatIsIt:
        'Soil texture describes the proportion of sand, silt, and clay mineral particles. Available Water Capacity (AWC) is the quantity of water that a soil can retain between its Field Capacity (after excess gravitational water has drained) and Permanent Wilting Point (when roots can no longer extract tightly bound water).',
    howWaterReachesRoots:
        'When rain or irrigation enters soil pores, gravity pulls surplus water downward. Coarse sands have large pores that drain within hours. Fine clays have millions of microscopic pores that hold water tightly through capillary force.',
    benefits: [
      'Knowing soil AWC determines exactly how many days you can safely wait between irrigations.',
      'Prevents over-irrigating sandy soils where water drains beyond root reach within minutes.',
      'Avoids saturating heavy clay soils where lack of aeration chokes feeder roots.'
    ],
    whyItMatters:
        'Treating sandy soil like clay causes severe crop drought stress. Treating clay like sand creates stagnant waterlogging, anaerobic root rot, and fungal root collapse.',
    whatCanFarmerDo: [
      'Perform a simple field ribbon test: Take a handful of moist soil, roll into a ball, and squeeze it between thumb and forefinger to form a ribbon.',
      'If it crumbles and cannot ribbon: Coarse Sandy soil. Infiltration is rapid (>50 mm/hr) but AWC is very low (60–90 mm/m). Irrigate frequently with low water quantities.',
      'If it forms a smooth ribbon 2.5 to 5 cm long: Loam / Silt Loam. Ideal balance of drainage and moisture retention. AWC is high (140–200 mm/m).',
      'If it forms a flexible, shiny ribbon >5 cm and feels sticky: Heavy Clay. Infiltration is very slow (<5 mm/hr). Apply water slowly to prevent runoff and allow sufficient aeration time.'
    ],
    thingsToCheck: [
      'Does water pond on the surface for hours after irrigation (sign of compacted clay or hardpan)?',
      'Does topsoil bake into brick-like cracks during dry spells (high montmorillonite clay)?',
      'Can you increase organic matter with compost or green manuring to boost moisture retention?'
    ],
    importantCaution:
        'Do not till or irrigate heavy clay soils when excessively wet; doing so destroys soil crumb structure and causes severe compaction pans that prevent roots from breathing.',
    relatedTool: ArticleRelatedTool(
      label: 'Update Soil Type in Farm Profile',
      targetTab: 'dashboard',
      description: 'Set your farm soil texture to personalize irrigation schedules.',
    ),
    references: [
      'FAO Soils Bulletin 79 — Soil water management',
      'USDA Natural Resources Conservation Service (NRCS) — Soil Texture & AWC Guide'
    ],
  ),
  KnowledgeArticle(
    id: 'crop-evapotranspiration-etc',
    title: 'Crop Evapotranspiration (ETc): Matching Water to Growth Stages',
    category: 'Crop Water Needs',
    problemCategory: 'I want to understand my crop',
    readTime: '6 min read',
    benefitLabel: 'Saves 20–35% water by eliminating guess-work watering',
    keywords: [
      'etc',
      'et0',
      'evapotranspiration',
      'crop coefficient',
      'kc',
      'water requirement',
      'growth stage',
      'transpiration'
    ],
    whatIsIt:
        'Crop Evapotranspiration (ETc) represents the total water lost to the atmosphere through soil evaporation and crop transpiration combined. It is calculated with the internationally standardized FAO formula: ETc = ET₀ × Kc.',
    howWaterReachesRoots:
        'ET₀ (Reference Evapotranspiration) is determined by live weather factors: solar radiation, air temperature, relative humidity, and wind speed. Kc (Crop Coefficient) accounts for crop canopy coverage, leaf area, and developmental growth stage.',
    benefits: [
      'Provides an exact scientific benchmark for daily crop water needs in millimeters per day.',
      'Avoids applying full-season water during small seedling stages when canopy coverage is only 10%.',
      'Ensures critical flowering stages receive 100% of required moisture.'
    ],
    whyItMatters:
        'A wheat or tomato seedling at 15 days has a small canopy with Kc of 0.4. Giving it the same water volume as peak flowering (Kc 1.15) wastes over 60% of applied water and washes nitrogen past shallow root zones.',
    whatCanFarmerDo: [
      'Check live temperature and humidity: On dry, hot, windy days, ET₀ surges to 7–9 mm/day; on cool humid days, it drops to 2–4 mm/day.',
      'Adjust irrigation run times according to crop growth stage (e.g. increase duration during fruit filling, reduce duration near harvest).',
      'Withhold excess water during ripening stages to raise sugar concentration and prevent fungal decay.'
    ],
    thingsToCheck: [
      'Has the crop reached peak canopy expansion (when leaves fully shade inter-row ground)?',
      'Is the weather station forecast predicting high wind and temperature spikes today?',
      'Are you checking root-zone dampness 15 cm below surface with a soil probe or spade?'
    ],
    importantCaution:
        'Calculations of ETc are agricultural planning benchmarks. Real field conditions depend on soil moisture reserves, water table depth, and irrigation efficiency.',
    relatedTool: ArticleRelatedTool(
      label: 'Open Irrigation Planner',
      targetTab: 'planner',
      description: 'Schedule your upcoming irrigation intervals aligned with crop growth stage.',
    ),
    references: [
      'FAO Irrigation and Drainage Paper 56 — Crop evapotranspiration (Allen et al.)',
      'FAO Water Development and Management Unit'
    ],
  ),
  KnowledgeArticle(
    id: 'mulching-soil-moisture-conservation',
    title: 'Mulching Techniques & Reducing Evaporative Topsoil Loss',
    category: 'Soil Moisture',
    problemCategory: 'I want to save water',
    readTime: '4 min read',
    benefitLabel: 'Reduces soil evaporation by 30–50%',
    keywords: [
      'mulch',
      'organic mulch',
      'straw',
      'plastic mulch',
      'weed suppression',
      'evaporation',
      'soil temperature',
      'root zone'
    ],
    whatIsIt:
        'Mulching is the practice of covering the bare soil surface surrounding crops with organic biomass (crop residues, dry straw, shredded cane trash, wood chips) or manufactured impermeable films (silver/black polyethylene mulch).',
    howWaterReachesRoots:
        'Mulch acts as a physical thermal shield against direct sunlight. Unshaded bare soil can heat up to 50°C, causing rapid moisture evaporation. Mulched soil stays cooler (24–28°C), retaining humidity around feeder roots.',
    benefits: [
      'Drastically reduces evaporative loss, keeping water in root zones 2 to 3 times longer.',
      'Smothers weed seeds by blocking sunlight, eliminating weed-crop water competition.',
      'Organic mulches decompose into rich humus, improving long-term soil structure and worm activity.',
      'Prevents soil crusting and rain droplet erosion.'
    ],
    whyItMatters:
        'In arid and semi-arid regions during hot seasons, up to 40% of applied irrigation water is lost to direct surface evaporation before roots can absorb it. Mulch preserves that water inside the profile.',
    whatCanFarmerDo: [
      'Spread a 7–10 cm layer of dry crop residues (paddy straw, wheat straw, or shredded sugarcane leaves) along crop beds.',
      'For high-value vegetable crops (tomato, chili, melons), lay 25–30 micron silver/black reflective plastic mulch over drip laterals before transplanting.',
      'Keep organic mulch 2–3 cm away from plant stems to maintain air circulation and prevent collar rot.'
    ],
    thingsToCheck: [
      'Is mulch thickness sufficient to completely shade the soil surface?',
      'Are drip lines laid flat and pressure tested beneath the mulch before covering?',
      'In termite-prone regions, monitor organic straw residues regularly.'
    ],
    importantCaution:
        'Avoid applying heavy organic mulch on poorly drained waterlogged clay soils during continuous heavy monsoons, as this may hinder root oxygen aeration.',
    relatedTool: ArticleRelatedTool(
      label: 'Explore Crop Specific Mulch Tips',
      targetTab: 'crops',
      description: 'See which mulch methods work best for tomato, banana, or sugarcane.',
    ),
    references: [
      'FAO Soils Portal — Conservation Agriculture & Soil Management',
      'University Extension Soil Moisture Conservation Guides'
    ],
  ),
  KnowledgeArticle(
    id: 'farm-pond-rainwater-harvesting',
    title: 'Farm Pond Design & Groundwater Recharge Tactics',
    category: 'Rainwater',
    problemCategory: 'I want to use rainwater',
    readTime: '5 min read',
    benefitLabel: 'Provides critical dry-spell buffer and groundwater recharge',
    keywords: [
      'rainwater',
      'rainwater harvesting',
      'farm pond',
      'pond',
      'runoff',
      'supplemental irrigation',
      'groundwater',
      'recharge',
      'catchment',
      'storage',
      'silt'
    ],
    whatIsIt:
        'A farm pond is an excavated or banked earthen catchment designed to capture and store excess surface runoff generated during intense monsoon rains, providing supplemental irrigation for critical dry spells and aiding in local aquifer recharge.',
    howWaterReachesRoots:
        'Stored rainwater is pumped or gravity-fed to crops through high-efficiency drip or sprinkler systems when canal or well supplies dwindle during dry spells. In unlined recharge ponds, stored water slowly percolates into shallow groundwater aquifers, elevating regional water tables.',
    benefits: [
      'Drought Buffer: Provides life-saving supplemental irrigation during prolonged dry spells between rainfall events.',
      'Erosion Control: Slows rushing surface runoff, trapping fertile topsoil on the farm rather than losing it to gullies.',
      'Aquifer Replenishment: Enhances local groundwater recharge, supporting surrounding open wells and borewells.',
      'Water Security: Gives farmers greater autonomy over seasonal irrigation timing.'
    ],
    whyItMatters:
        'Intense storm events often discharge massive quantities of rainfall off farmland in a matter of hours, taking fertile topsoil along with them. Storing a portion of this storm runoff converts potential soil erosion into a life-saving water reserve for crops.',
    whatCanFarmerDo: [
      'Observe field runoff patterns during heavy storms to locate natural convergence depressions suitable for pond siting.',
      'Incorporate a silt-settling pit at the pond inlet so heavy mud and sediment settle out before clear water enters the main pond.',
      'Plant deep-rooted, non-spreading grass (such as vetiver) along embankments to stabilize earthen bunds against wave wash.',
      'Connect pond outlets to filtration units and micro-irrigation lines to maximize the acreage protected by harvested water.'
    ],
    thingsToCheck: [
      'Is there an engineered emergency spillway of adequate width to discharge extreme flood flows safely without breaching bunds?',
      'Is the pond sited safely away from pesticide mixing areas and livestock pens to protect water quality?',
      'Are physical safety barriers, warning signs, and escape ramps installed to safeguard children and farm animals?'
    ],
    importantCaution:
        'This guide is educational. Sizing and building a farm pond involves soil stability, compaction, and local water safety laws. Always consult a certified agricultural engineer and local irrigation authorities before excavating water storage structures.',
    relatedTool: ArticleRelatedTool(
      label: 'Check Live Weather for Rain Events',
      targetTab: 'weather',
      description: 'Check rainfall forecasts to anticipate runoff inflows into your farm storage.',
    ),
    references: [
      'FAO Watershed Management Field Manual — Gullies and Farm Ponds',
      'FAO Land and Water Bulletins — Small Earth Dams and Reservoirs'
    ],
  ),
  KnowledgeArticle(
    id: 'regulated-deficit-irrigation-rdi',
    title: 'Regulated Deficit Irrigation (RDI) for Orchards & Field Crops',
    category: 'Drought Resilience',
    problemCategory: 'I have water shortage',
    readTime: '5 min read',
    benefitLabel: 'Water-saving potential varies by farm conditions',
    keywords: [
      'rdi',
      'deficit',
      'deficit irrigation',
      'drought',
      'regulated deficit irrigation',
      'crop sensitivity',
      'flowering',
      'fruit',
      'orchard',
      'stress',
      'growth stage'
    ],
    whatIsIt:
        'Regulated Deficit Irrigation (RDI) is an advanced water management strategy where irrigation is intentionally and precisely reduced during specific crop growth stages that are drought-tolerant, conserving water reserves for critical flowering and fruit development stages.',
    howWaterReachesRoots:
        'Irrigation volume is calibrated to satisfy only a portion of full evaporative demand during tolerant vegetative or post-harvest stages. Crops adapt by slowing shoot expansion while root systems explore deeper soil layers for moisture.',
    benefits: [
      'Conserves Scarce Groundwater: Saves water during hardy vegetative periods so wells do not run dry during critical fruit-fill.',
      'Balanced Shoot Growth: In fruit orchards, controlled deficit restricts excessive vegetative foliage, allowing sunlight to penetrate fruit canopies.',
      'Enhanced Fruit Quality: Controlled mild deficit in certain fruits can enhance sugar content and firmness without harming overall yield.'
    ],
    whyItMatters:
        'When borehole water is scarce or canal turns are spaced far apart, trying to apply maximum water constantly can deplete farm reserves before harvest. RDI strategically reserves your limited water supply for periods when water stress would cause irreversible flower drop or yield collapse.',
    whatCanFarmerDo: [
      'Identify drought-tolerant stages: In many deciduous fruit trees and hardy field crops, late vegetative and post-harvest periods can tolerate controlled moisture reduction.',
      'Strictly protect critical stages: Never apply deficit during flowering, pollination, or early fruit/pod expansion, as moisture stress here triggers flower and fruit drop.',
      'Inspect root dampness frequently: Dig test holes to verify that soil around active roots remains moderately moist rather than baking into dry, hardened crusts.'
    ],
    thingsToCheck: [
      'Are you completely confident of your crop’s specific stage before reducing water volume?',
      'Do you have a reliable way to monitor soil moisture at active root depths during the deficit period?',
      'Is your irrigation system primed to resume full water delivery immediately when the sensitive stage arrives?'
    ],
    importantCaution:
        'Results vary depending on crop, timing, climate, soil, and management. If deficit stress is applied during reproductive flowering stages, substantial crop loss can occur. Implement RDI only with proven crop-specific protocols and local extension guidance.',
    relatedTool: ArticleRelatedTool(
      label: 'Ask a Farming Doubt in Help',
      targetTab: 'help',
      description: 'Have doubts about when to reduce water for your specific crop? Post a question in Farmer Help.',
    ),
    references: [
      'FAO Water Reports 22 — Deficit irrigation practices',
      'FAO Irrigation and Drainage Paper 56 — Yield response to water'
    ],
  ),
];
