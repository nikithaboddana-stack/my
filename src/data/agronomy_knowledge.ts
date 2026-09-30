import { KnowledgeArticle, ProblemCategory, AgronomyCategory } from '../models/types';

export const AGRONOMY_CATEGORIES: { id: AgronomyCategory; label: string; icon: string; color: string }[] = [
  { id: 'Irrigation Technology', label: 'Irrigation Technology', icon: '🚿', color: 'teal' },
  { id: 'Soil Moisture', label: 'Soil Moisture', icon: '🌱', color: 'emerald' },
  { id: 'Crop Water Needs', label: 'Crop Water Needs', icon: '🌾', color: 'amber' },
  { id: 'Drought Resilience', label: 'Drought Resilience', icon: '☀️', color: 'orange' },
  { id: 'Rainwater', label: 'Rainwater', icon: '🌧️', color: 'sky' },
];

export const AGRONOMY_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'drip-irrigation-maintenance',
    title: 'Drip Irrigation Efficiency & Emitter Clog Prevention',
    category: 'Irrigation Technology',
    problemCategory: 'My irrigation needs improvement',
    readTime: '4 min read',
    benefitLabel: 'Can help reduce unnecessary water loss',
    keywords: [
      'drip',
      'irrigation',
      'clogging',
      'emitter',
      'filter',
      'filtration',
      'flush',
      'lateral',
      'pressure',
      'water loss',
      'uniformity',
      'root zone',
      'runoff',
      'maintenance'
    ],
    whatIsIt:
      'Drip irrigation is a pressurized micro-irrigation system that distributes water through a network of valves, mainline pipes, submains, and lateral tubing fitted with small emission devices called drippers or emitters.',
    howWaterReachesRoots:
      'Water trickles out of emitters at low pressure directly onto the soil surface adjacent to each plant. It infiltrates downward and spreads outward by capillary action, creating a moist onion-shaped "wetting bulb" precisely where feeding roots absorb moisture and dissolved nutrients.',
    benefits: [
      'Reduced Surface Runoff: Water is applied at a rate the soil can naturally absorb, preventing puddling, surface crusting, and hillside runoff.',
      'Improved Application Control: Irrigation duration and volume can be matched directly to root-zone depth and plant growth stages.',
      'Minimized Weed Growth: Inter-row soil stays dry because water is localized to the plant root line, starving surface weeds of moisture.',
      'Lower Evaporative Loss: Because water drips near the ground rather than spraying into the air, wind drift and air evaporation are substantially minimized.'
    ],
    whyItMatters:
      'If emitters become clogged by mineral precipitates, algae, or silt particles, emission uniformity drops. Plants nearest the obstruction get underwatered and stunt, while other rows may receive excess water, causing uneven crop stands and wasted pumping energy.',
    filtrationAndPressure:
      'Filtration is the first line of defense: Screen, disc, or media filters must remove coarse sand, organic debris, and suspended silt before water enters narrow lateral tubes. Regularly checking the pressure gauges installed before and after the filter is crucial: a pressure differential higher than manufacturer limits indicates the filter is choked and requires immediate backwashing. Operating at normal operating pressure prevents emitter burst and ensures uniform flow along the entire line.',
    lateralFlushingAndInspection:
      'Lateral lines accumulate fine silt and slime over time. Every 10 to 14 days, open the end caps or flush valves of laterals while the pump runs until clean, clear water discharges. While walking crop rows, inspect emitters for consistent droplet discharge, leaks at joiners, and kinks in the tubing.',
    signsOfClogging: [
      'Irregular dry soil circles beneath specific plants along the lateral.',
      'Noticeable pressure drop or surge on sub-main pressure gauges.',
      'Sediment deposits or discolored slime accumulating inside lateral end caps.',
      'Uneven plant vigor or wilting in localized row segments.'
    ],
    maintenanceSteps: [
      'Clean primary disc or screen filters after every 1–2 irrigation cycles or whenever the pressure differential rises.',
      'Flush sub-main lines and lateral tubing periodically until discharge is crystal clear.',
      'Walk lateral lines during operation to inspect emitters for uniform dripping and promptly replace broken emitters.',
      'Inspect intake foot-valves and suction screens at the farm well or pond to prevent sand ingestion into pumps.',
      'Elevate lateral drip lines on beds or stakes if soil pests or ants tend to chew through tubing.'
    ],
    whatCanFarmerDo: [
      'Inspect your primary screen or disc filter before starting each irrigation cycle; clean filter elements whenever pressure drops noticeably across the unit.',
      'Flush lateral line end caps every 10–14 days while the pump is pressurized until the flushed water runs crystal clear.',
      'Walk your crop rows during watering to visually inspect emitters and verify that water is dripping at an even, steady pace without spurting or dripping dry.',
      'Keep drip tubes elevated or anchored to plant beds so ground dirt and insects do not enter or block emitter discharge orifices.'
    ],
    thingsToCheck: [
      'Is the pressure gauge before and after the filter within the manufacturer’s recommended operating range?',
      'Are the end caps of lateral lines regularly flushed free of sediment and organic silt?',
      'Is the soil wetting circle (moist bulb) uniform around all crop roots down the entire row?'
    ],
    importantCaution:
      'For severe mineral scaling or emitter blockage, consult an irrigation specialist or extension officer before using chemical treatments. Wear safety equipment and avoid mixing acids with fertilizers.',
    relatedTool: {
      label: 'Record Irrigation in Water Logs',
      targetTab: 'records',
      description: 'After checking your drip lines, record your irrigation duration and water usage in Water Logs.'
    },
    references: [
      'FAO Irrigation and Drainage Paper 56 — Crop Evapotranspiration',
      'FAO Irrigation Water Management Training Manual No. 5 — Irrigation Methods'
    ]
  },
  {
    id: 'soil-texture-awc',
    title: 'Soil Texture & Available Water Capacity (AWC)',
    category: 'Soil Moisture',
    problemCategory: 'I want to understand my soil',
    readTime: '5 min read',
    benefitLabel: 'Water-saving potential varies by farm conditions',
    keywords: [
      'soil',
      'soil texture',
      'sand',
      'sandy soil',
      'clay',
      'loam',
      'awc',
      'available water capacity',
      'field capacity',
      'wilting point',
      'moisture',
      'drainage',
      'infiltration'
    ],
    whatIsIt:
      'Soil texture describes the proportion of sand, silt, and clay particles in your field. Available Water Capacity (AWC) is the specific portion of stored soil water that plant roots can readily extract, defined as the moisture retained between Field Capacity (after excess gravitational water has drained) and the Permanent Wilting Point (when remaining water is held too tightly for roots to draw).',
    howWaterReachesRoots:
      'Soil pores hold water like a sponge. Coarse sandy soils have large pores that drain quickly, while clay soils have tiny micropores that retain moisture tenaciously. Water migrates toward root hairs via capillary tension as crops transpire.',
    benefits: [
      'Prevents Deep Leaching: Knowing your soil water-holding limits avoids over-irrigating and washing costly fertilizers into deep subsoil.',
      'Prevents Root Suffocation: Understanding clay drainage prevents waterlogging that rots plant roots and triggers fungal blights.',
      'Optimizes Irrigation Run Time: Tailors watering frequency—short frequent pulses for sand, deeper spaced cycles for loam and clay.'
    ],
    whyItMatters:
      'Sandy soil drains rapidly and holds minimal water, requiring frequent light irrigation. Heavy clay soil holds large water volumes but absorbs it slowly, risking waterlogging and root suffocation if flooded. Matching irrigation schedules to your soil texture protects both plant health and water reserves.',
    whatCanFarmerDo: [
      'Perform a simple "hand-feel ribbon test": Take a handful of moist soil from 15 cm depth and knead it; if it feels gritty and falls apart, it is sand; if it feels like smooth flour, it is silt/loam; if it forms a sticky, pliable ribbon over 5 cm long, it is clay.',
      'For coarse sandy soils: Use short, frequent irrigation cycles to keep moisture in the active root zone without leaching below.',
      'For heavy clay soils: Apply water at slow delivery rates to allow complete infiltration without pooling, allowing adequate drying intervals between waterings.',
      'Incorporate organic compost or well-rotted farmyard manure: Organic matter acts like a sponge, increasing water retention in sandy soils and improving porosity and drainage in tight clay soils.'
    ],
    thingsToCheck: [
      'Does water pond on the surface for hours after irrigation (indicating slow infiltration or clay compaction)?',
      'Does topsoil dry out within hours of watering (indicating low retention in coarse sand)?',
      'Are crop roots spreading deeply and freely or obstructed by a compacted plow layer (hardpan)?'
    ],
    importantCaution:
      'Soil water behavior varies widely across different field patches, slopes, and depths. A local laboratory soil test or guidance from an agricultural extension officer gives the most reliable measurement for your specific land.',
    relatedTool: {
      label: 'Understand Your Crops for this Soil',
      targetTab: 'crops',
      description: 'See which crops and irrigation methods match your specific soil texture.'
    },
    references: [
      'FAO Soils Portal — Conservation Agriculture & Soil Management',
      'University Extension Soil and Water Management Bulletins'
    ]
  },
  {
    id: 'crop-evapotranspiration-etc',
    title: 'Calculating Crop Evapotranspiration (ETc = ET₀ × Kc)',
    category: 'Crop Water Needs',
    problemCategory: 'I want to understand my crop',
    readTime: '5 min read',
    benefitLabel: 'Helps match water application to crop demand',
    keywords: [
      'et',
      'etc',
      'et0',
      'kc',
      'evapotranspiration',
      'crop water',
      'crop coefficient',
      'reference et',
      'growth stage',
      'water demand',
      'scheduling'
    ],
    whatIsIt:
      'Crop Evapotranspiration (ETc) represents the total daily volume of water lost through direct evaporation from wet soil and plant transpiration through leaf stomata. It is estimated with the formula: ETc = ET₀ × Kc, where ET₀ represents local atmospheric evaporative demand and Kc is the crop coefficient for its specific growth stage.',
    howWaterReachesRoots:
      'Solar radiation, air temperature, relative humidity, and wind speed pull water upward through the plant stem from the root zone. ETc calculates the replenishment volume needed to maintain optimal root hydration without under- or over-supplying.',
    benefits: [
      'Stage-Specific Precision: Eliminates applying a flat, unvarying water volume throughout the entire season.',
      'Protection of Critical Yield Stages: Pinpoints flowering and fruit development as stages demanding priority watering.',
      'Weather Responsiveness: Automatically lowers water targets during cool, cloudy, or humid spells.'
    ],
    whyItMatters:
      'Crops need very little water as young seedlings, experience peak water demand during flowering and fruit/grain filling, and require less water again during ripening. Applying ETc principles prevents applying excessive water early in the season while ensuring crops do not suffer stress during critical yield formation.',
    whatCanFarmerDo: [
      'Identify the current growth stage: Increase water delivery during flowering and grain/fruit filling, and decrease application during initial establishment and late senescence.',
      'Adjust for prevailing weather: On overcast, humid, or cooler days, evaporative demand (ET₀) naturally drops—shorten pump runtimes accordingly.',
      'Educational Calculation Example: If a warm sunny day produces an estimated reference ET₀ of 5 mm/day, and a vegetable crop in mid-season flowering has a Kc factor of 1.1, estimated crop water demand is approximately 5.5 mm/day (5 × 1.1). Note: This is an educational reference value, not an automatic prescription.'
    ],
    thingsToCheck: [
      'Is the crop currently in its flowering, pollination, or fruit-setting stage (highest water sensitivity)?',
      'Has there been recent rainfall that partially or fully replenished soil moisture in the root zone?',
      'Are leaves showing signs of midday dullness or temporary curling before evening recovery?'
    ],
    importantCaution:
      'Do not rely solely on textbook formulas to decide irrigation. Actual irrigation timing depends on recent rain, soil moisture, root depth, irrigation efficiency, and field observations. Always check soil moisture before running pumps.',
    relatedTool: {
      label: 'Plan Your Next Irrigation',
      targetTab: 'planner',
      description: 'Use your crop growth stage knowledge to schedule upcoming irrigation cycles in the Planner.'
    },
    references: [
      'FAO Irrigation and Drainage Paper 56 — Crop Evapotranspiration',
      'FAO Land and Water Digital Media Resources'
    ]
  },
  {
    id: 'organic-mulching-evaporation',
    title: 'Organic Mulching & Evaporative Loss Mitigation',
    category: 'Soil Moisture',
    problemCategory: 'I want to save water',
    readTime: '4 min read',
    benefitLabel: 'Can help reduce unnecessary water loss',
    keywords: [
      'mulch',
      'mulching',
      'straw',
      'crop residue',
      'leaves',
      'evaporation',
      'soil moisture',
      'weed suppression',
      'soil temperature',
      'drought'
    ],
    whatIsIt:
      'Organic mulching is the practice of spreading a loose protective layer of dry plant residues—such as paddy straw, dried leaves, sugarcane trash, or chipped biomass—over bare soil surfaces between crop rows and around plant crowns.',
    howWaterReachesRoots:
      'Mulch acts as a physical thermal shield over the topsoil. Sunlight heats the mulch layer rather than directly heating soil moisture, significantly slowing down the escape of water vapor and preserving the moist root-zone microclimate beneath.',
    benefits: [
      'Slower Evaporation: Protects moist topsoil from hot sunlight and drying winds.',
      'Temperature Moderation: Keeps soil root zones cooler during scorching daytime heat and warmer during cool nights.',
      'Natural Weed Suppression: Blocks sunlight from weed seeds, preventing moisture-stealing weeds from establishing.',
      'Soil Structure Enrichment: Slowly decomposes into soil humus, increasing long-term organic matter and soil health.'
    ],
    whyItMatters:
      'Bare ground exposed to blazing sunlight loses precious moisture into the atmosphere within hours of irrigation. Organic mulching keeps the topsoil shaded and damp, allowing crop roots to feed in the nutrient-dense upper soil profile rather than retreating downward.',
    whatCanFarmerDo: [
      'Collect clean crop residues (dry straw, dried grass clippings, mature leaves) and spread an even 5–8 cm layer over the crop beds.',
      'Keep mulch 5 cm away from green seedling stems and tree trunks to maintain good air circulation and prevent collar rot.',
      'In orchard groves, create a mulch ring covering the canopy drip-line where active feeder roots reside.',
      'At season end, lightly till decomposed organic mulch into the soil to boost humus and soil water retention for subsequent crops.'
    ],
    thingsToCheck: [
      'Is the mulching material free of invasive weed seeds, pest larvae, or diseased plant residues?',
      'Does soil stay visibly damp under the mulch layer 2–3 days longer than unshaded bare soil nearby?',
      'Is water from drip emitters or light rain penetrating cleanly through the mulch layer into the soil?'
    ],
    importantCaution:
      'Water conservation varies with climate, mulch material, thickness, soil, and management. In poorly drained soils during prolonged rainy periods, overly thick mulch can keep soil too wet and encourage root fungal diseases.',
    relatedTool: {
      label: 'Monitor Water Savings in Logs',
      targetTab: 'records',
      description: 'Track your irrigation frequency in Water Logs to observe how mulching extends intervals between watering.'
    },
    references: [
      'FAO Soils Portal — Conservation Agriculture & Soil Management',
      'University Extension Soil Moisture Conservation Guides'
    ]
  },
  {
    id: 'farm-pond-rainwater-harvesting',
    title: 'Farm Pond Design & Groundwater Recharge Tactics',
    category: 'Rainwater',
    problemCategory: 'I want to use rainwater',
    readTime: '5 min read',
    benefitLabel: 'Water-saving potential varies by farm conditions',
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
    relatedTool: {
      label: 'Check Live Weather for Rain Events',
      targetTab: 'weather',
      description: 'Check rainfall forecasts to anticipate runoff inflows into your farm storage.'
    },
    references: [
      'FAO Watershed Management Field Manual — Gullies and Farm Ponds',
      'FAO Land and Water Bulletins — Small Earth Dams and Reservoirs'
    ]
  },
  {
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
    relatedTool: {
      label: 'Ask a Farming Doubt in Help',
      targetTab: 'help',
      description: 'Have doubts about when to reduce water for your specific crop? Post a question in Farmer Help.'
    },
    references: [
      'FAO Water Reports 22 — Deficit irrigation practices',
      'FAO Irrigation and Drainage Paper 56 — Yield response to water'
    ]
  }
];

export const PROBLEM_CATEGORIES: { id: ProblemCategory; icon: string; title: string; description: string; color: string }[] = [
  { id: 'I want to save water', icon: '💧', title: 'I want to save water', description: 'Practical techniques to cut water loss without hurting yield', color: 'teal' },
  { id: 'My irrigation needs improvement', icon: '🚿', title: 'My irrigation needs improvement', description: 'Fix emitter clogs, manage pressure, and maintain lines', color: 'cyan' },
  { id: 'I want to understand my crop', icon: '🌾', title: 'I want to understand my crop', description: 'Match water amounts to crop growth stages and seasons', color: 'amber' },
  { id: 'I want to understand my soil', icon: '🌱', title: 'I want to understand my soil', description: 'Sand, loam, and clay drainage and moisture holding capacity', color: 'emerald' },
  { id: 'I have water shortage', icon: '☀️', title: 'I have water shortage', description: 'Manage dry spells, deficit irrigation, and protect yields', color: 'orange' },
  { id: 'I want to use rainwater', icon: '🌧️', title: 'I want to use rainwater', description: 'Farm ponds, harvesting field runoff, and recharging wells', color: 'sky' },
];
