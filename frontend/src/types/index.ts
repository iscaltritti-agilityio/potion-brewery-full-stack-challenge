export interface PotionOrder {
  id: string;
  customer_name: string;
  location: string;
  potion: string;
  assigned_alchemist: string;
  status: string;
  notes: string;
}

export interface PotionOrderInput {
  customer_name: string;
  location: string;
  potion: string;
  assigned_alchemist: string;
  notes: string;
}

export interface AlchemistProfile {
  id: number;
  name: string;
  service_start_date: string;
  potions_completed: number;
  profile_image: string | null;
  created_at: string;
}

export interface AlchemistProfileMinimal {
  profile_image?: string | null;
}
