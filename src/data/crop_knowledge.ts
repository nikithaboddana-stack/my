import { CropDetail } from '../models/types';

export const CROPS_DATA: CropDetail[] = [
  {
    id: 'paddy-rice',
    name: 'Paddy / Rice',
    icon: '🌾',
    category: 'Grain',
    overview:
      'Paddy is a primary staple crop typically grown under flooded conditions, but modern water-smart methods can substantially cut water loss while sustaining yield.',
    waterConsiderations:
      'Paddy traditionally consumes large water depths due to continuous ponding, leading to high evaporation and percolation losses. Alternate Wetting and Drying (AWD) can save water without reducing yield.',
    growthStages: [
      { stage: 'Nursery & Transplanting', waterNeed: 'Moderate', description: 'Requires shallow standing water (2–3 cm) to establish root anchoring.' },
      { stage: 'Tillering', waterNeed: 'Moderate', description: 'Soil should stay saturated; water can be allowed to subside to hairline cracks.' },
      { stage: 'Panicle Initiation & Flowering', waterNeed: 'Critical', description: 'Moisture stress during flowering causes empty spikelets (chaffy grains). Maintain continuous moisture.' },
      { stage: 'Ripening / Grain Filling', waterNeed: 'Low', description: 'Drain field water completely 10–12 days prior to harvest to promote even grain drying.' }
    ],
    suitableMethods: ['Flood / Basin Irrigation', 'Drip Irrigation'],
    weatherConsiderations:
      'Cloudy monsoon days reduce water demand. Hold off pumping when monsoon downpours are forecast to prevent overflow of bunds.',
    commonProblems: [
      'Continuous standing water wasting energy and washing nutrients into deeper subsoil.',
      'Water stress at panicle emergence causing poor grain filling.',
      'Algal blooms and root rot under stagnant unmanaged water.'
    ],
    waterSavingTips: [
      'Install a simple perforated PVC field pipe to monitor water table and practice Alternate Wetting and Drying (AWD).',
      'Plaster field bunds with clay to stop lateral seepage into perimeter ditches.',
      'Level the field evenly using laser land levelers to eliminate dry spots and over-flooded patches.'
    ]
  },
  {
    id: 'wheat',
    name: 'Wheat',
    icon: '🌾',
    category: 'Grain',
    overview:
      'Wheat is a cool-season cereal grain that performs best with timely, targeted irrigations at specific physiological stages.',
    waterConsiderations:
      'Wheat generally needs 4 to 6 irrigations during the season depending on winter rain. Over-irrigation causes lodging (plants falling flat) and yellowing leaves from root asphyxiation.',
    growthStages: [
      { stage: 'Crown Root Initiation (CRI)', waterNeed: 'Critical', description: 'Occurs 20–25 days after sowing. The most vital irrigation; skipping this causes major yield drops.' },
      { stage: 'Tillering to Jointing', waterNeed: 'Moderate', description: 'Encourages productive tillers and strong straw development.' },
      { stage: 'Heading & Flowering', waterNeed: 'High', description: 'Supports pollen development and ear formation. Avoid high winds when irrigating.' },
      { stage: 'Milk to Dough Stage', waterNeed: 'Moderate', description: 'Aids grain weight and starch accumulation. Avoid excess water that causes lodging.' }
    ],
    suitableMethods: ['Sprinkler System', 'Furrow Irrigation', 'Flood / Basin Irrigation'],
    weatherConsiderations:
      'Winter showers reduce irrigation needs. Avoid overhead sprinkler irrigation during windy afternoons to prevent uneven application and lodging.',
    commonProblems: [
      'Missing the CRI stage irrigation resulting in shallow root crowns.',
      'Heavy late watering during gusty spring winds causing wheat lodging.',
      'Crusted heavy clay soil preventing seedling emergence after early flooding.'
    ],
    waterSavingTips: [
      'Use border strip or sprinkler irrigation rather than wild flooding.',
      'Prioritize water at Crown Root Initiation and Flowering if water supply is limited.',
      'Apply light irrigation before anticipated winter frost to protect crops from cold shock.'
    ]
  },
  {
    id: 'maize-corn',
    name: 'Maize / Corn',
    icon: '🌽',
    category: 'Grain',
    overview:
      'Maize is a fast-growing, heavy-feeding crop with deep roots that responds remarkably well to precision irrigation methods like drip and furrow.',
    waterConsiderations:
      'Maize is vulnerable to both drought and waterlogging. Standing water for more than 24 hours can suffocate roots and permanently stunt growth.',
    growthStages: [
      { stage: 'Early Vegetative (V3–V8)', waterNeed: 'Low', description: 'Deep roots explore soil moisture; avoid overwatering to encourage root depth.' },
      { stage: 'Tasseling & Silking', waterNeed: 'Critical', description: 'Most critical stage. Moisture stress dries silk and hampers pollination, causing barren cobs.' },
      { stage: 'Grain Filling (Blister to Dent)', waterNeed: 'High', description: 'Determines kernel size and weight. Maintain even moisture in the root zone.' },
      { stage: 'Maturity / Black Layer', waterNeed: 'Low', description: 'Irrigation should stop when grain moisture drops and husks turn brown.' }
    ],
    suitableMethods: ['Drip Irrigation', 'Furrow Irrigation'],
    weatherConsiderations:
      'Hot winds (>35°C) during pollination dry out silks rapidly. Maintain soil moisture before the heat wave to cushion the plants.',
    commonProblems: [
      'Water stress during silking causing uneven or scattered kernel set on cobs.',
      'Waterlogging in low spots causing stunted yellow plants.',
      'Applying water too late into maturity, delaying harvest.'
    ],
    waterSavingTips: [
      'Adopt paired-row drip irrigation to cover two crop rows with a single drip lateral line.',
      'Use furrow irrigation rather than flooding the entire soil surface.',
      'Maintain surface mulch between rows to cool soil and suppress evaporation.'
    ]
  },
  {
    id: 'tomato',
    name: 'Tomato',
    icon: '🍅',
    category: 'Vegetable',
    overview:
      'Tomato is a high-value vegetable that requires steady, consistent moisture. Irregular watering leads to blossom end rot and fruit splitting.',
    waterConsiderations:
      'Tomatoes have fibrous roots mostly in the upper 40 cm of soil. Fluctuating between dry soil and heavy soaking causes calcium deficiency and cracked skins.',
    growthStages: [
      { stage: 'Transplanting & Rooting', waterNeed: 'Moderate', description: 'Light frequent moisture ensures quick seedling survival and initial rooting.' },
      { stage: 'Vegetative & Branching', waterNeed: 'Moderate', description: 'Gradually increase irrigation depth to encourage root expansion.' },
      { stage: 'Flowering & Fruit Set', waterNeed: 'High', description: 'Stable moisture prevents flower drop and blossom end rot (black bottom spots).' },
      { stage: 'Fruit Ripening & Harvest', waterNeed: 'Moderate', description: 'Maintain consistent watering. Sudden heavy irrigation causes ripe fruit skins to crack.' }
    ],
    suitableMethods: ['Drip Irrigation', 'Sub-surface Drip'],
    weatherConsiderations:
      'Avoid overhead watering as wet leaves invite fungal blights. High humidity combined with wet foliage encourages disease.',
    commonProblems: [
      'Blossom End Rot caused by calcium transport failure during erratic soil moisture swings.',
      'Fruit cracking after sudden heavy watering following dry periods.',
      'Foliar fungal blights from wet leaves.'
    ],
    waterSavingTips: [
      'Always use drip irrigation with fertigation to supply water and soluble calcium directly to roots.',
      'Lay silver-black or organic straw mulch along planting ridges to keep moisture uniform.',
      'Irrigate early in the morning so surface moisture can dry before evening humidity rises.'
    ]
  },
  {
    id: 'chilli',
    name: 'Chilli / Pepper',
    icon: '🌶️',
    category: 'Vegetable',
    overview:
      'Chilli is sensitive to excess moisture in heavy soils, requiring well-drained conditions and moderate, uniform irrigation.',
    waterConsiderations:
      'Excess moisture triggers collar rot and flower drop. The soil should be moist but well aerated at all times.',
    growthStages: [
      { stage: 'Establishment', waterNeed: 'Moderate', description: 'Light watering to settle roots; avoid ponding around stems.' },
      { stage: 'Vegetative Growth', waterNeed: 'Moderate', description: 'Maintain uniform root-zone moisture; allow upper 3 cm soil to dry slightly before watering.' },
      { stage: 'Flowering & Pod Setting', waterNeed: 'High', description: 'Water stress causes massive bud and flower drop. Keep moisture steady.' },
      { stage: 'Pod Maturation & Picking', waterNeed: 'Moderate', description: 'Reduce irrigation slightly to enhance pungency and color development.' }
    ],
    suitableMethods: ['Drip Irrigation', 'Furrow Irrigation'],
    weatherConsiderations:
      'High rainfall during flowering leads to severe flower shedding and damping off in seedlings.',
    commonProblems: [
      'Collar rot and wilt from water standing around the base of the plant.',
      'Heavy flower drop triggered by either dry spells or saturated soil.',
      'Leaf curl intensified by drought stress and aphid pressure.'
    ],
    waterSavingTips: [
      'Plant chillies on raised beds or ridges to facilitate fast drainage during rains.',
      'Use inline drip emitters (2 to 4 LPH) spaced along the plant row.',
      'Incorporate organic compost to enhance drainage in heavy soil while retaining root moisture.'
    ]
  },
  {
    id: 'groundnut',
    name: 'Groundnut / Peanut',
    icon: '🥜',
    category: 'Legume',
    overview:
      'Groundnut is an oilseed legume capable of fixing atmospheric nitrogen, well-suited to light and sandy loam soils with moderate irrigation.',
    waterConsiderations:
      'Adequate moisture is essential during peg penetration into the soil. Hard, crusted, dry soil stops pegs from entering the ground, preventing pod formation.',
    growthStages: [
      { stage: 'Vegetative', waterNeed: 'Low', description: 'Mild moisture restriction encourages deep taproot penetration.' },
      { stage: 'Flowering & Pegging', waterNeed: 'Critical', description: 'Soil surface must be moist and friable so emerging pegs can easily penetrate the soil.' },
      { stage: 'Pod Development', waterNeed: 'High', description: 'Requires steady moisture for kernel filling inside underground pods.' },
      { stage: 'Pod Maturation', waterNeed: 'Low', description: 'Withhold water 7–10 days before pulling to prevent pod sprouting in the soil.' }
    ],
    suitableMethods: ['Sprinkler System', 'Drip Irrigation', 'Furrow Irrigation'],
    weatherConsiderations:
      'Sprinklers work exceptionally well for groundnut because they moisten the entire soil surface evenly, facilitating smooth peg entry.',
    commonProblems: [
      'Hard crusted soil preventing pegs from entering the ground.',
      'Aflatoxin contamination if pods suffer severe drought stress near harvest.',
      'Underground pod rotting under waterlogged conditions.'
    ],
    waterSavingTips: [
      'Use micro-sprinklers during the pegging stage to soften the topsoil with minimal water volume.',
      'Avoid irrigating immediately before digging up pods; allow the soil to reach workable friability.'
    ]
  },
  {
    id: 'cotton',
    name: 'Cotton',
    icon: '☁️',
    category: 'Commercial',
    overview:
      'Cotton has a deep taproot and can withstand short dry intervals, but requires precise water management to balance vegetative growth and boll production.',
    waterConsiderations:
      'Too much water makes cotton plants grow excessively tall with leafy branches (vegetative luxuriance) at the expense of boll development.',
    growthStages: [
      { stage: 'Early Vegetative', waterNeed: 'Low', description: 'Deep taproot seeks moisture; keep water modest to prevent leafy overgrowth.' },
      { stage: 'Squaring & Flowering', waterNeed: 'High', description: 'Moisture stress causes squares (flower buds) to drop off prematurely.' },
      { stage: 'Boll Development', waterNeed: 'Critical', description: 'Bolls require steady water for fiber elongation and seed weight.' },
      { stage: 'Boll Opening & Maturation', waterNeed: 'Low', description: 'Cease irrigation when 10–20% of bolls have opened to prevent fiber staining and fungal rot.' }
    ],
    suitableMethods: ['Drip Irrigation', 'Furrow Irrigation'],
    weatherConsiderations:
      'Heavy rain when bolls are open damages lint quality and encourages boll rot.',
    commonProblems: [
      'Excessive vegetative growth from over-watering, reducing lint yield.',
      'Square and young boll shedding due to sudden moisture deficit during peak flowering.',
      'Salinity buildup in root zone under low-flow deficit conditions.'
    ],
    waterSavingTips: [
      'Adopt skip-row or alternate-furrow irrigation if water is scarce to cover double the area.',
      'Use sub-surface drip or surface drip to deliver water directly to the deep taproot zone.',
      'Stop irrigation well before harvest to allow natural leaf defoliation and clean picking.'
    ]
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    icon: '🎋',
    category: 'Commercial',
    overview:
      'Sugarcane is a long-duration crop (10–14 months) requiring substantial total water, making high-efficiency drip systems particularly rewarding.',
    waterConsiderations:
      'Due to its long growing cycle, traditional flood irrigation loses massive water volume to soil evaporation. Sub-surface drip can cut water waste dramatically.',
    growthStages: [
      { stage: 'Germination (0–45 days)', waterNeed: 'Moderate', description: 'Requires moist soil bed for eye-bud sprouting.' },
      { stage: 'Tillering & Formative (45–120 days)', waterNeed: 'Critical', description: 'Determines the number of millable canes per clump. Severe stress drastically reduces tiller counts.' },
      { stage: 'Grand Growth / Elongation (120–270 days)', waterNeed: 'High', description: 'Canes grow rapidly in length; continuous moisture is required for internode expansion.' },
      { stage: 'Ripening (270–360 days)', waterNeed: 'Low', description: 'Gradually withdraw water 3–4 weeks prior to harvest to increase cane sugar (Brix) concentration.' }
    ],
    suitableMethods: ['Sub-surface Drip', 'Drip Irrigation', 'Furrow Irrigation'],
    weatherConsiderations:
      'Take advantage of monsoon rains; ensure drainage channels are open to prevent root asphyxiation during waterlogging.',
    commonProblems: [
      'Water stress during the formative stage causing low tiller survival.',
      'Over-irrigating during ripening stage diluting sucrose juice concentration.',
      'Cane lodging during storms if soil is saturated.'
    ],
    waterSavingTips: [
      'Install sub-surface drip irrigation (buried 15–20 cm) to eliminate surface evaporation.',
      'Trash mulching (laying dry cane leaves between rows) retains moisture and enriches organic carbon.',
      'Practice alternate-furrow watering during water-scarce summer months.'
    ]
  },
  {
    id: 'banana',
    name: 'Banana',
    icon: '🍌',
    category: 'Fruit',
    overview:
      'Banana has large broad leaves and shallow succulent roots, making it a high water-consuming plant that suffers quickly from dry spells.',
    waterConsiderations:
      'With shallow roots (mostly in the top 30 cm) and large surface leaf area, bananas transpire heavily. Water stress causes slow bunch emergence and undersized fingers.',
    growthStages: [
      { stage: 'Early Vegetative (0–3 months)', waterNeed: 'Moderate', description: 'Frequent light water applications to support rapid pseudostem leaf emergence.' },
      { stage: 'Shooting & Bunch Inflorescence (6–8 months)', waterNeed: 'Critical', description: 'Bunch initiation requires uninterrupted moisture; stress produces short bunches with fewer hands.' },
      { stage: 'Fruit Filling & Maturation', waterNeed: 'High', description: 'Fills banana fingers with pulp and sugars.' }
    ],
    suitableMethods: ['Drip Irrigation', 'Micro-sprinkler'],
    weatherConsiderations:
      'Hot winds tear banana leaves and spike transpiration. Windbreak trees around orchards reduce water evaporation.',
    commonProblems: [
      'Pseudostem choking (bunches failing to emerge fully) during dry stress.',
      'Shallow roots uprooting during storms in saturated mud.',
      'Nutrient leaching if flood irrigation is used.'
    ],
    waterSavingTips: [
      'Use paired drip laterals per tree row with 2 to 4 emitters around each plant basin.',
      'Mulch heavily with banana pseudostem shreds and dry leaves around the plant perimeter.',
      'Operate drip during cooler morning hours to keep root zones hydrated before midday heat.'
    ]
  },
  {
    id: 'mango',
    name: 'Mango',
    icon: '🥭',
    category: 'Fruit',
    overview:
      'Mango is an orchard fruit tree with an extensive, deep root system. Irrigation needs vary dramatically between vegetative growth, flowering, and fruit development.',
    waterConsiderations:
      'Adult mango trees require a period of moisture stress (dry spell) prior to flowering to trigger floral bud differentiation. Irrigating right before flowering stimulates unwanted vegetative leaf flushes instead of blossoms.',
    growthStages: [
      { stage: 'Pre-flowering Dry Rest (Oct–Nov)', waterNeed: 'Low', description: 'Withhold water to encourage floral bud differentiation over leafy shoots.' },
      { stage: 'Fruit Set to Marble Size', waterNeed: 'Moderate', description: 'Resume light irrigation once fruit has set to prevent young fruitlet drop.' },
      { stage: 'Fruit Sizing & Development', waterNeed: 'High', description: 'Maintain regular watering to reach optimal fruit dimensions and juiciness.' },
      { stage: 'Harvesting', waterNeed: 'Low', description: 'Withhold irrigation 10–14 days prior to harvest to enhance fruit sweetness, shelf life, and aroma.' }
    ],
    suitableMethods: ['Drip Irrigation', 'Micro-sprinkler'],
    weatherConsiderations:
      'Unseasonal rain during flowering washes away pollen and invites powdery mildew fungus.',
    commonProblems: [
      'Overwatering before flowering causing only leaf shoots and zero flowers.',
      'Premature fruit drop triggered by severe dry periods during fruit sizing.',
      'Fruit splitting or poor shelf-life caused by heavy irrigation near harvest.'
    ],
    waterSavingTips: [
      'Place circular ring drip lines matching the tree canopy drip line (where feeder roots thrive).',
      'Cover the tree basin with dried leaves or pruning residues to retain moisture.',
      'Strictly observe the pre-flowering dry rest period for consistent annual fruiting.'
    ]
  },
  {
    id: 'vegetables-general',
    name: 'Vegetables (General / Leafy)',
    icon: '🥬',
    category: 'Vegetable',
    overview:
      'Leafy greens and seasonal vegetables have shallow active root zones, making them sensitive to surface soil drying.',
    waterConsiderations:
      'Vegetables require frequent, low-volume water applications. Allowing soil to dry deeply causes bitterness, premature bolting (flowering early), and tough texture.',
    growthStages: [
      { stage: 'Germination & Nursery', waterNeed: 'Moderate', description: 'Top 5 cm must stay consistently moist.' },
      { stage: 'Active Leafing', waterNeed: 'High', description: 'Generates tender crisp leaves. Moisture deficit causes fibrous, bitter leaves.' },
      { stage: 'Harvest Window', waterNeed: 'Moderate', description: 'Water lightly in the evening before morning harvest to ensure crisp turgid produce.' }
    ],
    suitableMethods: ['Drip Irrigation', 'Micro-sprinkler'],
    weatherConsiderations:
      'Use shade nets during intense summer sun to lower surface evapotranspiration.',
    commonProblems: [
      'Premature bolting (running to seed) due to heat and water stress.',
      'Root rot and damping-off under saturated heavy soils.',
      'Uneven germination in crusted soils.'
    ],
    waterSavingTips: [
      'Deploy micro-sprinklers for light, uniform cooling mist.',
      'Incorporate coco-peat or rich organic matter into vegetable beds to retain moisture.',
      'Harvest during early morning when crop moisture content is highest.'
    ]
  }
];

export interface CropWaterBenchmark {
  crop: string;
  waterPerHaM3: string;
  recommendedMethod: string;
  criticalStage: string;
}

export const GENERAL_CROP_WATER_BENCHMARKS: CropWaterBenchmark[] = [
  {
    crop: 'Paddy Rice',
    waterPerHaM3: '9,000 - 15,000',
    recommendedMethod: 'AWD or Drip',
    criticalStage: 'Panicle initiation & flowering',
  },
  {
    crop: 'Wheat',
    waterPerHaM3: '3,500 - 5,000',
    recommendedMethod: 'Sprinkler / Furrow',
    criticalStage: 'Crown root initiation (CRI)',
  },
  {
    crop: 'Maize / Corn',
    waterPerHaM3: '4,000 - 6,500',
    recommendedMethod: 'Drip / Furrow',
    criticalStage: 'Tasseling & silking',
  },
  {
    crop: 'Cotton',
    waterPerHaM3: '6,000 - 8,000',
    recommendedMethod: 'Drip Irrigation',
    criticalStage: 'Boll development',
  },
  {
    crop: 'Tomato / Vegetables',
    waterPerHaM3: '3,000 - 5,000',
    recommendedMethod: 'Drip with Fertigation',
    criticalStage: 'Flowering & fruit sizing',
  },
  {
    crop: 'Sugarcane',
    waterPerHaM3: '15,000 - 22,000',
    recommendedMethod: 'Sub-surface Drip',
    criticalStage: 'Formative / Tillering stage',
  },
  {
    crop: 'Chilli / Pepper',
    waterPerHaM3: '3,500 - 5,500',
    recommendedMethod: 'Drip Irrigation',
    criticalStage: 'Flowering & pod setting',
  },
  {
    crop: 'Groundnut / Peanut',
    waterPerHaM3: '2,500 - 4,000',
    recommendedMethod: 'Sprinkler / Micro-sprinkler',
    criticalStage: 'Pegging & pod development',
  },
  {
    crop: 'Mango / Orchards',
    waterPerHaM3: '4,500 - 7,500',
    recommendedMethod: 'Ring Drip / Micro-sprinkler',
    criticalStage: 'Fruit sizing (withhold pre-bloom)',
  },
  {
    crop: 'Banana',
    waterPerHaM3: '12,000 - 18,000',
    recommendedMethod: 'Drip with Mulch',
    criticalStage: 'Shooting & bunch emergence',
  },
];
