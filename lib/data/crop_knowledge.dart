import '../models/types.dart';

const List<CropDetail> kCropKnowledgeList = [
  CropDetail(
    id: 'paddy-rice',
    name: 'Paddy / Rice',
    icon: '🌾',
    category: 'Grain',
    overview:
        'Paddy is a high water-demanding cereal crop historically grown in flooded fields. Modern techniques such as Alternate Wetting and Drying (AWD) can save 20–30% of irrigation water without hurting yield.',
    waterConsiderations:
        'Continuous ponding of 5–10 cm is common tradition but wastes enormous water through seepage, deep percolation, and methane emissions. AWD allows the water table to drop 15 cm below soil surface before re-flooding.',
    growthStages: [
      CropGrowthStage(
        stage: 'Nursery & Transplanting (0–20 days)',
        waterNeed: 'High',
        description: 'Requires saturated soil to prevent seedling wilt and support root anchor.',
      ),
      CropGrowthStage(
        stage: 'Tillering (20–40 days)',
        waterNeed: 'Moderate',
        description: 'Ideal stage to implement Alternate Wetting and Drying (AWD).',
      ),
      CropGrowthStage(
        stage: 'Panicle Initiation to Flowering (40–70 days)',
        waterNeed: 'Critical',
        description:
            'Extremely sensitive to moisture stress; drought here triggers spikelet sterility.',
      ),
      CropGrowthStage(
        stage: 'Grain Filling & Ripening (70–110 days)',
        waterNeed: 'Low',
        description:
            'Gradually withdraw irrigation 10–14 days prior to harvest to facilitate mechanical harvesting.',
      ),
    ],
    suitableMethods: ['Flood / Basin Irrigation', 'Drip Irrigation'],
    weatherConsiderations:
        'Monsoon rains should be conserved in field bunds with spillways; avoid fertilizing before heavy downpours.',
    commonProblems: [
      'Iron deficiency in non-flooded calcareous soils.',
      'Weed outbreaks during dry cycles of AWD if herbicides or mulches are omitted.',
      'Spikelet emptiness if heat and drought hit simultaneously during anthesis.',
    ],
    waterSavingTips: [
      'Install a perforated field water tube (pani pipe) to monitor subsurface water levels for AWD.',
      'Level the field using laser land levelers to eliminate high dry spots and low drowned areas.',
      'Adopt direct-seeded rice (DSR) to avoid wet puddling requirements.',
    ],
  ),
  CropDetail(
    id: 'wheat',
    name: 'Wheat',
    icon: '🌾',
    category: 'Grain',
    overview:
        'Wheat is a cool-season rabi cereal requiring 4 to 6 critical irrigations depending on winter rain and soil water-holding capacity.',
    waterConsiderations:
        'Crown Root Initiation (CRI) occurs around 20–25 days after sowing and is the single most critical moisture window. Missing water at CRI can slash yield by up to 30%.',
    growthStages: [
      CropGrowthStage(
        stage: 'Crown Root Initiation - CRI (20–25 DAS)',
        waterNeed: 'Critical',
        description: 'Primary anchor roots form; missing water here permanently stunts tillering.',
      ),
      CropGrowthStage(
        stage: 'Tillering to Jointing (40–45 DAS)',
        waterNeed: 'Moderate',
        description: 'Stems elongate and form internodes; moderate soil moisture is required.',
      ),
      CropGrowthStage(
        stage: 'Booting / Heading (60–65 DAS)',
        waterNeed: 'High',
        description: 'Spikes swell inside leaf sheaths; water stress reduces ear length.',
      ),
      CropGrowthStage(
        stage: 'Flowering & Milking (80–85 DAS)',
        waterNeed: 'Critical',
        description: 'Grains expand with milky starch; heat and dry winds cause premature shriveling.',
      ),
      CropGrowthStage(
        stage: 'Dough & Maturity (100–115 DAS)',
        waterNeed: 'Low',
        description: 'Grain hardens; cease irrigation to avoid lodging and grain fungal blackening.',
      ),
    ],
    suitableMethods: ['Sprinkler System', 'Furrow Irrigation', 'Flood / Basin Irrigation'],
    weatherConsiderations:
        'Terminal heat stress in February/March accelerates crop maturity. Light sprinkler irrigation can cool the micro-canopy.',
    commonProblems: [
      'Lodging (plants collapsing) when irrigating during windy March days.',
      'Yellow rust outbreaks during cold humid spells.',
      'Termite attacks in light soils under water deficit.',
    ],
    waterSavingTips: [
      'Use portable sprinkler sets for uniform shallow applications rather than wild flooding.',
      'Apply pre-sowing irrigation (palewa) thoroughly to recharge the root profile down to 60 cm.',
      'Retain paddy residue mulch (Happy Seeder technology) to retain 20–25% soil moisture.',
    ],
  ),
  CropDetail(
    id: 'maize',
    name: 'Maize / Corn',
    icon: '🌽',
    category: 'Grain',
    overview:
        'Maize has high biomass productivity and responds remarkably well to precision irrigation and fertigation.',
    waterConsiderations:
        'Tasseling (pollen shed) and silking (silk emergence) are non-negotiable critical moisture periods. Water deficit causes silk delay, leading to barren cobs with missing kernels.',
    growthStages: [
      CropGrowthStage(
        stage: 'Early Vegetative (V3–V6)',
        waterNeed: 'Low',
        description: 'Plants establish taproots; moderate water stress encourages deeper root searching.',
      ),
      CropGrowthStage(
        stage: 'Knee-High Rapid Growth (V8–V12)',
        waterNeed: 'Moderate',
        description: 'Leaf area expands rapidly; nutrient and moisture uptake accelerate.',
      ),
      CropGrowthStage(
        stage: 'Tasseling & Silking (VT–R1)',
        waterNeed: 'Critical',
        description: 'Pollen shedding and fertilization; drought causes incomplete cob tip-fill.',
      ),
      CropGrowthStage(
        stage: 'Blister & Dough Stage (R2–R4)',
        waterNeed: 'High',
        description: 'Kernel starch accumulation; requires sustained soil moisture.',
      ),
      CropGrowthStage(
        stage: 'Black Layer / Maturity (R6)',
        waterNeed: 'Low',
        description: 'Physiological maturity reached; cease irrigation to allow drydown.',
      ),
    ],
    suitableMethods: ['Drip Irrigation', 'Furrow Irrigation', 'Sprinkler System'],
    weatherConsiderations:
        'Waterlogging for longer than 24 hours at the young knee-high stage chokes root oxygen and yellows crops.',
    commonProblems: [
      'Fall Armyworm damage during warm, dry cycles.',
      'Cob barrenness due to asynchronous silk emergence in heat/water stress.',
      'Nitrogen leaching in coarse sands under heavy furrow watering.',
    ],
    waterSavingTips: [
      'Pair maize rows with drip laterals for 35% water savings and automated fertigation.',
      'Practice ridge and furrow planting so roots stay aerated while furrows channel water.',
      'Avoid irrigating right when forecast shows rain within 24 hours.',
    ],
  ),
  CropDetail(
    id: 'cotton',
    name: 'Cotton',
    icon: '☁️',
    category: 'Commercial',
    overview:
        'Cotton is a deep-rooted taproot commercial fiber crop. While drought tolerant, commercial yield depends heavily on timely moisture during square formation and boll filling.',
    waterConsiderations:
        'Over-irrigating early produces rank, leggy vegetative foliage with little fruiting. Regulated deficit before flowering stimulates reproductive balance.',
    growthStages: [
      CropGrowthStage(
        stage: 'Seedling Establishment (0–30 days)',
        waterNeed: 'Low',
        description: 'Encourage deep taproot exploration; water only if topsoil completely desulfurizes.',
      ),
      CropGrowthStage(
        stage: 'Square (Bud) Formation (30–60 days)',
        waterNeed: 'Moderate',
        description: 'Squares appear; steady moisture prevents early square shedding.',
      ),
      CropGrowthStage(
        stage: 'Peak Flowering & Boll Development (60–100 days)',
        waterNeed: 'Critical',
        description: 'Maximal daily transpiration; moisture deficit triggers massive boll drop.',
      ),
      CropGrowthStage(
        stage: 'Boll Bursting to Picking (100–150 days)',
        waterNeed: 'Low',
        description: 'Cease irrigation to allow bolls to crack open cleanly without staining lint.',
      ),
    ],
    suitableMethods: ['Drip Irrigation', 'Furrow Irrigation'],
    weatherConsiderations:
        'Heavy rain during open boll stage ruins lint grade and triggers boll rot. Good drainage channels are vital.',
    commonProblems: [
      'Excessive vegetative rank growth if overwatered alongside high nitrogen.',
      'Sucking pest flare-up (whitefly, jassids) during hot dry spells.',
      'Square and boll abscission under sudden wet-to-dry soil swings.',
    ],
    waterSavingTips: [
      'Implement drip irrigation with inline emitters spaced at 40–50 cm along crop rows.',
      'Use alternate furrow irrigation if drip is unavailable to halve water volume per pass.',
      'Terminate irrigation when 10–15% of bolls have naturally cracked open.',
    ],
  ),
  CropDetail(
    id: 'tomato',
    name: 'Tomato',
    icon: '🍅',
    category: 'Vegetable',
    overview:
        'Tomato is a high-value horticultural crop with shallow-to-medium roots. It is sensitive to both water deficit and soil saturation.',
    waterConsiderations:
        'Irregular soil moisture causes blossom end rot (calcium deficiency induced by moisture swings) and fruit skin cracking. Consistent, measured drip watering is essential.',
    growthStages: [
      CropGrowthStage(
        stage: 'Transplanting & Rooting (0–20 days)',
        waterNeed: 'Moderate',
        description: 'Frequent light waterings ensure high seedling survival without stem rot.',
      ),
      CropGrowthStage(
        stage: 'Vegetative Canopy Growth (20–45 days)',
        waterNeed: 'Moderate',
        description: 'Supports vigorous lateral branches and cluster flower trusses.',
      ),
      CropGrowthStage(
        stage: 'Flowering & Fruit Setting (45–70 days)',
        waterNeed: 'Critical',
        description: 'Moisture swings here trigger blossom abortion and flower drop.',
      ),
      CropGrowthStage(
        stage: 'Fruit Sizing & Color Break (70–100 days)',
        waterNeed: 'High',
        description: 'High water volume is needed, but soil must never be waterlogged.',
      ),
    ],
    suitableMethods: ['Drip Irrigation', 'Micro-sprinkler'],
    weatherConsiderations:
        'High humidity coupled with overhead sprinkler water invites fungal early blight and bacterial leaf spots.',
    commonProblems: [
      'Blossom End Rot (black sunken bottoms) caused by uneven watering preventing calcium uptake.',
      'Fruit splitting/cracking if heavy irrigation follows a prolonged dry spell.',
      'Bacterial wilt and damping-off under saturated root-zones.',
    ],
    waterSavingTips: [
      'Always use drip irrigation underneath silver/black plastic mulch to conserve 40% water.',
      'Maintain an even soil moisture curve; never allow root-zones to oscillate from bone dry to muddy.',
      'Fertigate soluble calcium and potassium directly through drip lines during fruit swell.',
    ],
  ),
  CropDetail(
    id: 'sugarcane',
    name: 'Sugarcane',
    icon: '🎋',
    category: 'Commercial',
    overview:
        'Sugarcane is a long-duration (10–14 month) perennial grass requiring 1,500 to 2,200 mm of water throughout its cycle.',
    waterConsiderations:
        'The Formative stage (60–130 days after planting) decides tiller density and stalk count. Stress here causes permanent tonnage loss.',
    growthStages: [
      CropGrowthStage(
        stage: 'Germination & Sprouting (0–45 days)',
        waterNeed: 'Moderate',
        description: 'Keeps sett buds moist for rapid eye sprouting.',
      ),
      CropGrowthStage(
        stage: 'Formative / Tillering Stage (45–120 days)',
        waterNeed: 'Critical',
        description: 'Determines number of millable canes per clump. Severe stress drastically reduces tiller counts.',
      ),
      CropGrowthStage(
        stage: 'Grand Growth / Elongation (120–270 days)',
        waterNeed: 'High',
        description: 'Canes grow rapidly in length; continuous moisture is required for internode expansion.',
      ),
      CropGrowthStage(
        stage: 'Ripening (270–360 days)',
        waterNeed: 'Low',
        description: 'Gradually withdraw water 3–4 weeks prior to harvest to increase cane sugar (Brix) concentration.',
      ),
    ],
    suitableMethods: ['Sub-surface Drip', 'Drip Irrigation', 'Furrow Irrigation'],
    weatherConsiderations:
        'Take advantage of monsoon rains; ensure drainage channels are open to prevent root asphyxiation during waterlogging.',
    commonProblems: [
      'Water stress during the formative stage causing low tiller survival.',
      'Over-irrigating during ripening stage diluting sucrose juice concentration.',
      'Cane lodging during storms if soil is saturated.',
    ],
    waterSavingTips: [
      'Install sub-surface drip irrigation (buried 15–20 cm) to eliminate surface evaporation.',
      'Trash mulching (laying dry cane leaves between rows) retains moisture and enriches organic carbon.',
      'Practice alternate-furrow watering during water-scarce summer months.',
    ],
  ),
  CropDetail(
    id: 'banana',
    name: 'Banana',
    icon: '🍌',
    category: 'Fruit',
    overview:
        'Banana has large broad leaves and shallow succulent roots, making it a high water-consuming plant that suffers quickly from dry spells.',
    waterConsiderations:
        'With shallow roots (mostly in the top 30 cm) and large surface leaf area, bananas transpire heavily. Water stress causes slow bunch emergence and undersized fingers.',
    growthStages: [
      CropGrowthStage(
        stage: 'Early Vegetative (0–3 months)',
        waterNeed: 'Moderate',
        description: 'Frequent light water applications to support rapid pseudostem leaf emergence.',
      ),
      CropGrowthStage(
        stage: 'Shooting & Bunch Inflorescence (6–8 months)',
        waterNeed: 'Critical',
        description: 'Bunch initiation requires uninterrupted moisture; stress produces short bunches with fewer hands.',
      ),
      CropGrowthStage(
        stage: 'Fruit Filling & Maturation',
        waterNeed: 'High',
        description: 'Fills banana fingers with pulp and sugars.',
      ),
    ],
    suitableMethods: ['Drip Irrigation', 'Micro-sprinkler'],
    weatherConsiderations:
        'Hot winds tear banana leaves and spike transpiration. Windbreak trees around orchards reduce water evaporation.',
    commonProblems: [
      'Pseudostem choking (bunches failing to emerge fully) during dry stress.',
      'Shallow roots uprooting during storms in saturated mud.',
      'Nutrient leaching if flood irrigation is used.',
    ],
    waterSavingTips: [
      'Use paired drip laterals per tree row with 2 to 4 emitters around each plant basin.',
      'Mulch heavily with banana pseudostem shreds and dry leaves around the plant perimeter.',
      'Operate drip during cooler morning hours to keep root zones hydrated before midday heat.',
    ],
  ),
  CropDetail(
    id: 'mango',
    name: 'Mango',
    icon: '🥭',
    category: 'Fruit',
    overview:
        'Mango is an orchard fruit tree with an extensive, deep root system. Irrigation needs vary dramatically between vegetative growth, flowering, and fruit development.',
    waterConsiderations:
        'Adult mango trees require a period of moisture stress (dry spell) prior to flowering to trigger floral bud differentiation. Irrigating right before flowering stimulates unwanted vegetative leaf flushes instead of blossoms.',
    growthStages: [
      CropGrowthStage(
        stage: 'Pre-flowering Dry Rest (Oct–Nov)',
        waterNeed: 'Low',
        description: 'Withhold water to encourage floral bud differentiation over leafy shoots.',
      ),
      CropGrowthStage(
        stage: 'Fruit Set to Marble Size',
        waterNeed: 'Moderate',
        description: 'Resume light irrigation once fruit has set to prevent young fruitlet drop.',
      ),
      CropGrowthStage(
        stage: 'Fruit Sizing & Development',
        waterNeed: 'High',
        description: 'Maintain regular watering to reach optimal fruit dimensions and juiciness.',
      ),
      CropGrowthStage(
        stage: 'Harvesting',
        waterNeed: 'Low',
        description: 'Withhold irrigation 10–14 days prior to harvest to enhance fruit sweetness, shelf life, and aroma.',
      ),
    ],
    suitableMethods: ['Drip Irrigation', 'Micro-sprinkler'],
    weatherConsiderations:
        'Unseasonal rain during flowering washes away pollen and invites powdery mildew fungus.',
    commonProblems: [
      'Overwatering before flowering causing only leaf shoots and zero flowers.',
      'Premature fruit drop triggered by severe dry periods during fruit sizing.',
      'Fruit splitting or poor shelf-life caused by heavy irrigation near harvest.',
    ],
    waterSavingTips: [
      'Place circular ring drip lines matching the tree canopy drip line (where feeder roots thrive).',
      'Cover the tree basin with dried leaves or pruning residues to retain moisture.',
      'Strictly observe the pre-flowering dry rest period for consistent annual fruiting.',
    ],
  ),
  CropDetail(
    id: 'vegetables-general',
    name: 'Vegetables (General / Leafy)',
    icon: '🥬',
    category: 'Vegetable',
    overview:
        'Leafy greens and seasonal vegetables have shallow active root zones, making them sensitive to surface soil drying.',
    waterConsiderations:
        'Vegetables require frequent, low-volume water applications. Allowing soil to dry deeply causes bitterness, premature bolting (flowering early), and tough texture.',
    growthStages: [
      CropGrowthStage(
        stage: 'Germination & Nursery',
        waterNeed: 'Moderate',
        description: 'Top 5 cm must stay consistently moist.',
      ),
      CropGrowthStage(
        stage: 'Active Leafing',
        waterNeed: 'High',
        description: 'Generates tender crisp leaves. Moisture deficit causes fibrous, bitter leaves.',
      ),
      CropGrowthStage(
        stage: 'Harvest Window',
        waterNeed: 'Moderate',
        description: 'Water lightly in the evening before morning harvest to ensure crisp turgid produce.',
      ),
    ],
    suitableMethods: ['Drip Irrigation', 'Micro-sprinkler'],
    weatherConsiderations:
        'Use shade nets during intense summer sun to lower surface evapotranspiration.',
    commonProblems: [
      'Premature bolting (running to seed) due to heat and water stress.',
      'Root rot and damping-off under saturated heavy soils.',
      'Uneven germination in crusted soils.',
    ],
    waterSavingTips: [
      'Deploy micro-sprinklers for light, uniform cooling mist.',
      'Incorporate coco-peat or rich organic matter into vegetable beds to retain moisture.',
      'Harvest during early morning when crop moisture content is highest.',
    ],
  ),
];

const List<CropWaterBenchmark> kCropWaterBenchmarks = [
  CropWaterBenchmark(
    crop: 'Paddy Rice',
    waterPerHaM3: '9,000 - 15,000',
    recommendedMethod: 'AWD or Drip',
    criticalStage: 'Panicle initiation & flowering',
  ),
  CropWaterBenchmark(
    crop: 'Wheat',
    waterPerHaM3: '3,500 - 5,000',
    recommendedMethod: 'Sprinkler / Furrow',
    criticalStage: 'Crown root initiation (CRI)',
  ),
  CropWaterBenchmark(
    crop: 'Maize / Corn',
    waterPerHaM3: '4,000 - 6,500',
    recommendedMethod: 'Drip / Furrow',
    criticalStage: 'Tasseling & silking',
  ),
  CropWaterBenchmark(
    crop: 'Cotton',
    waterPerHaM3: '6,000 - 8,000',
    recommendedMethod: 'Drip Irrigation',
    criticalStage: 'Boll development',
  ),
  CropWaterBenchmark(
    crop: 'Tomato / Vegetables',
    waterPerHaM3: '3,000 - 5,000',
    recommendedMethod: 'Drip with Fertigation',
    criticalStage: 'Flowering & fruit sizing',
  ),
  CropWaterBenchmark(
    crop: 'Sugarcane',
    waterPerHaM3: '15,000 - 22,000',
    recommendedMethod: 'Sub-surface Drip',
    criticalStage: 'Formative / Tillering stage',
  ),
  CropWaterBenchmark(
    crop: 'Chilli / Pepper',
    waterPerHaM3: '3,500 - 5,500',
    recommendedMethod: 'Drip Irrigation',
    criticalStage: 'Flowering & pod setting',
  ),
  CropWaterBenchmark(
    crop: 'Groundnut / Peanut',
    waterPerHaM3: '2,500 - 4,000',
    recommendedMethod: 'Sprinkler / Micro-sprinkler',
    criticalStage: 'Pegging & pod development',
  ),
  CropWaterBenchmark(
    crop: 'Mango / Orchards',
    waterPerHaM3: '4,500 - 7,500',
    recommendedMethod: 'Ring Drip / Micro-sprinkler',
    criticalStage: 'Fruit sizing (withhold pre-bloom)',
  ),
  CropWaterBenchmark(
    crop: 'Banana',
    waterPerHaM3: '12,000 - 18,000',
    recommendedMethod: 'Drip with Mulch',
    criticalStage: 'Shooting & bunch emergence',
  ),
];
