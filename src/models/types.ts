export type SoilType = 'Loam' | 'Clay' | 'Sandy' | 'Silt' | 'Peat' | 'Saline';

export type IrrigationMethod =
  | 'Drip Irrigation'
  | 'Sprinkler System'
  | 'Furrow Irrigation'
  | 'Flood / Basin Irrigation'
  | 'Sub-surface Drip'
  | 'Micro-sprinkler';

export type WaterSource =
  | 'Borewell / Groundwater'
  | 'Canal / Irrigation Network'
  | 'River / Stream'
  | 'Rainwater Harvesting Pond'
  | 'Municipal / Tanker Supply';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  location?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FarmDetails {
  userId: string;
  farmName: string;
  farmArea?: number;
  areaUnit?: 'acres' | 'hectares' | 'm²';
  soilType?: SoilType;
  crops?: string;
  irrigationMethod?: IrrigationMethod;
  waterSource?: WaterSource;
  latitude?: number;
  longitude?: number;
  cityName?: string;
  updatedAt?: string;
}

export interface WaterUsageRecord {
  id: string;
  userId: string;
  crop: string;
  date: string;
  waterUsed: number; // in liters
  unit: 'Liters' | 'Gallons' | 'Cubic Meters (m³)';
  irrigationMethod: IrrigationMethod;
  durationHours?: number;
  areaCovered?: number;
  notes?: string;
  createdAt: string;
}

export interface FavoriteItem {
  itemId: string;
  userId: string;
  title: string;
  category: string;
  savedAt: string;
}

export interface IrrigationSchedule {
  id: string;
  userId: string;
  crop: string;
  scheduledDate: string;
  scheduledTime?: string;
  plannedWater?: number;
  durationHours?: number;
  irrigationMethod?: IrrigationMethod;
  notes?: string;
  status: 'pending' | 'completed' | 'skipped_weather' | 'cancelled';
  weatherAlert?: string;
  createdAt: string;
}

export interface FarmerQuestion {
  id: string;
  userId: string;
  question: string;
  crop: string;
  category: 'Irrigation & Water' | 'Leaf / Crop Health' | 'Soil & Moisture' | 'Pest & Growth' | 'General';
  status: 'Open' | 'Reviewed';
  adviceNotes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  createdAt: string;
  relatedGuide?: {
    id: string;
    title: string;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
  rainProbability: number;
  isRaining: boolean;
  precipitation: number;
  timestamp: string;
}

export interface DailyForecastItem {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  weatherCode: number;
  advisory?: string;
}

export interface WeatherReport {
  city: string;
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  forecast: DailyForecastItem[];
  agriAdvice: string;
  isLive: boolean;
  fetchedAt: string;
  source: string;
}

export type AgronomyCategory =
  | 'Irrigation Technology'
  | 'Soil Moisture'
  | 'Crop Water Needs'
  | 'Drought Resilience'
  | 'Rainwater';

export type ProblemCategory =
  | 'I want to save water'
  | 'My irrigation needs improvement'
  | 'I want to understand my crop'
  | 'I want to understand my soil'
  | 'I have water shortage'
  | 'I want to use rainwater';

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: AgronomyCategory;
  problemCategory: ProblemCategory;
  readTime: string;
  benefitLabel: string;
  keywords: string[];
  whatIsIt: string;
  howWaterReachesRoots?: string;
  benefits?: string[];
  whyItMatters: string;
  whatCanFarmerDo: string[];
  filtrationAndPressure?: string;
  lateralFlushingAndInspection?: string;
  signsOfClogging?: string[];
  maintenanceSteps?: string[];
  thingsToCheck: string[];
  importantCaution: string;
  relatedTool: {
    label: string;
    targetTab: 'dashboard' | 'records' | 'crops' | 'planner' | 'weather' | 'help' | 'knowledge';
    description: string;
  };
  references: string[];
}

export interface CropDetail {
  id: string;
  name: string;
  icon: string;
  category: 'Grain' | 'Vegetable' | 'Commercial' | 'Fruit' | 'Legume';
  overview: string;
  waterConsiderations: string;
  growthStages: { stage: string; waterNeed: 'Low' | 'Moderate' | 'High' | 'Critical'; description: string }[];
  suitableMethods: IrrigationMethod[];
  weatherConsiderations: string;
  commonProblems: string[];
  waterSavingTips: string[];
}
