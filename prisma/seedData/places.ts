import type { PlaceCategory, FeatureKey, FeatureValue } from "../../src/lib/constants";

export interface SeedFeature {
  key: FeatureKey;
  value: FeatureValue;
  note?: string;
}

export interface SeedPlace {
  name: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  address?: string;
  city: string;
  description?: string;
  features: SeedFeature[];
}

export const seedPlaces: SeedPlace[] = [
  {
    name: "台北車站",
    category: "TRAIN_STATION",
    latitude: 25.0478,
    longitude: 121.517,
    city: "台北市",
    address: "台北市中正區北平西路3號",
    description: "台鐵、高鐵、捷運共構大站",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
      { key: "STEP_FREE_ENTRANCE", value: "YES" },
      { key: "RAMP", value: "YES" },
    ],
  },
  {
    name: "台北101/世貿站",
    category: "MRT_STATION",
    latitude: 25.033,
    longitude: 121.5654,
    city: "台北市",
    address: "台北市信義區忠孝東路五段",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
      { key: "STEP_FREE_ENTRANCE", value: "YES" },
    ],
  },
  {
    name: "板橋車站",
    category: "TRAIN_STATION",
    latitude: 25.0138,
    longitude: 121.4626,
    city: "新北市",
    address: "新北市板橋區縣民大道二段7號",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
      { key: "RAMP", value: "YES" },
    ],
  },
  {
    name: "高雄捷運美麗島站",
    category: "MRT_STATION",
    latitude: 22.6322,
    longitude: 120.3018,
    city: "高雄市",
    address: "高雄市新興區中山一路115號",
    description: "以光之穹頂公共藝術聞名",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
      { key: "STEP_FREE_ENTRANCE", value: "YES" },
    ],
  },
  {
    name: "士林捷運站",
    category: "MRT_STATION",
    latitude: 25.0919,
    longitude: 121.5259,
    city: "台北市",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "PARTIAL", note: "僅出口1有無障礙廁所" },
    ],
  },
  {
    name: "西門捷運站",
    category: "MRT_STATION",
    latitude: 25.0421,
    longitude: 121.5079,
    city: "台北市",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "STEP_FREE_ENTRANCE", value: "PARTIAL", note: "部分出口需繞路才有電梯" },
    ],
  },
  {
    name: "淡水捷運站",
    category: "MRT_STATION",
    latitude: 25.1683,
    longitude: 121.4448,
    city: "新北市",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
      { key: "ACCESSIBLE_PARKING", value: "UNKNOWN" },
    ],
  },
  {
    name: "台中高鐵站",
    category: "TRAIN_STATION",
    latitude: 24.1131,
    longitude: 120.6151,
    city: "台中市",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
      { key: "ACCESSIBLE_PARKING", value: "YES" },
      { key: "STEP_FREE_ENTRANCE", value: "YES" },
    ],
  },
  {
    name: "台南車站",
    category: "TRAIN_STATION",
    latitude: 22.9975,
    longitude: 120.213,
    city: "台南市",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "RAMP", value: "YES" },
    ],
  },
  {
    name: "花蓮車站",
    category: "TRAIN_STATION",
    latitude: 23.993,
    longitude: 121.6015,
    city: "花蓮縣",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_PARKING", value: "YES" },
    ],
  },
  {
    name: "桃園高鐵站",
    category: "TRAIN_STATION",
    latitude: 25.0021,
    longitude: 121.2146,
    city: "桃園市",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
    ],
  },
  {
    name: "新竹車站",
    category: "TRAIN_STATION",
    latitude: 24.8025,
    longitude: 120.9714,
    city: "新竹市",
    description: "現存最古老的火車站建築之一",
    features: [
      { key: "ELEVATOR", value: "PARTIAL", note: "古蹟建築部分區域僅有階梯" },
      { key: "RAMP", value: "YES" },
    ],
  },
  {
    name: "高雄車站",
    category: "TRAIN_STATION",
    latitude: 22.6395,
    longitude: 120.3023,
    city: "高雄市",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
      { key: "STEP_FREE_ENTRANCE", value: "YES" },
    ],
  },
  {
    name: "嘉義車站",
    category: "TRAIN_STATION",
    latitude: 23.4801,
    longitude: 120.4327,
    city: "嘉義市",
    features: [
      { key: "ELEVATOR", value: "UNKNOWN" },
      { key: "RAMP", value: "YES" },
    ],
  },
  {
    name: "台北市政府",
    category: "GOVERNMENT",
    latitude: 25.0375,
    longitude: 121.5637,
    city: "台北市",
    address: "台北市信義區市府路1號",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
      { key: "ACCESSIBLE_PARKING", value: "YES" },
      { key: "STEP_FREE_ENTRANCE", value: "YES" },
    ],
  },
  {
    name: "高雄市政府",
    category: "GOVERNMENT",
    latitude: 22.6273,
    longitude: 120.3014,
    city: "高雄市",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
    ],
  },
  {
    name: "新北市政府",
    category: "GOVERNMENT",
    latitude: 25.0083,
    longitude: 121.4629,
    city: "新北市",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_PARKING", value: "YES" },
    ],
  },
  {
    name: "大安森林公園",
    category: "PARK",
    latitude: 25.0296,
    longitude: 121.5352,
    city: "台北市",
    features: [
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
      { key: "RAMP", value: "YES" },
    ],
  },
  {
    name: "高雄中央公園",
    category: "PARK",
    latitude: 22.6297,
    longitude: 120.3007,
    city: "高雄市",
    features: [
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
      { key: "ACCESSIBLE_PARKING", value: "UNKNOWN" },
    ],
  },
  {
    name: "台中公園",
    category: "PARK",
    latitude: 24.1454,
    longitude: 120.6837,
    city: "台中市",
    features: [
      { key: "RAMP", value: "PARTIAL", note: "部分步道為碎石路面，輪椅較難通行" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
    ],
  },
  {
    name: "誠品書店信義店",
    category: "STORE",
    latitude: 25.0402,
    longitude: 121.5648,
    city: "台北市",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
    ],
  },
  {
    name: "全聯福利中心 信義店",
    category: "STORE",
    latitude: 25.03,
    longitude: 121.55,
    city: "台北市",
    features: [{ key: "STEP_FREE_ENTRANCE", value: "YES" }],
  },
  {
    name: "好市多 內湖店",
    category: "STORE",
    latitude: 25.083,
    longitude: 121.577,
    city: "台北市",
    features: [
      { key: "ACCESSIBLE_PARKING", value: "YES" },
      { key: "STEP_FREE_ENTRANCE", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
    ],
  },
  {
    name: "鼎泰豐 信義店",
    category: "RESTAURANT",
    latitude: 25.0339,
    longitude: 121.5645,
    city: "台北市",
    features: [
      { key: "STEP_FREE_ENTRANCE", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "UNKNOWN" },
    ],
  },
  {
    name: "春水堂 台中總店",
    category: "RESTAURANT",
    latitude: 24.1477,
    longitude: 120.6736,
    city: "台中市",
    features: [{ key: "STEP_FREE_ENTRANCE", value: "PARTIAL", note: "門口有一階小台階" }],
  },
  {
    name: "台北松山機場",
    category: "OTHER",
    latitude: 25.0697,
    longitude: 121.5522,
    city: "台北市",
    features: [
      { key: "ELEVATOR", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
      { key: "ACCESSIBLE_PARKING", value: "YES" },
    ],
  },
  {
    name: "中正紀念堂",
    category: "OTHER",
    latitude: 25.0359,
    longitude: 121.5178,
    city: "台北市",
    features: [
      { key: "RAMP", value: "YES" },
      { key: "ACCESSIBLE_RESTROOM", value: "YES" },
    ],
  },
];
