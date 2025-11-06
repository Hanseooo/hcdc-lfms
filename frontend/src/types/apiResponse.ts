

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  user_type: "student" | "admin";
  id_number?: string | null;
  contact_number?: string | null;
  profile_avatar_url?: string;
};

export type LoginResponse = {
  key: string;
};


export interface BaseReport {
  id: number;
  reported_by: User;
  type: "lost" | "found";
  date_time: string;
  status: "pending" | "approved" | "rejected" | "resolved";
}


export interface LostItem {
  id: number;
  report: number; //report id
  item_name: string;
  description: string;
  category: string;
  location_last_seen: string;
  photo_url?: string | null;
  date_lost?: string | null;
}


export interface FoundItem {
  id: number;
  report: number;
  item_name: string;
  description: string;
  category: string;
  location_found: string;
  photo_url?: string | null;
  supervised_by?: User | null;
  date_found?: string | null;
}


export interface LostReport extends BaseReport {
  type: "lost";
  lost_item: LostItem;
  found_item?: never;
}

export interface FoundReport extends BaseReport {
  type: "found";
  found_item: FoundItem;
  lost_item?: never;
}

export type Report = LostReport | FoundReport;

export interface Comment {
  id: number;
  report: number;
  user: User;
  content: string;
  created_at: string;
}

export interface Claim {
  id: number;
  report: number;
  claimed_by: User;
  received_from?: User | null;
  supervised_by?: User | null;
  verified_by?: User | null;
  message?: string | null;
  received: boolean;
  date_claimed: string;
  date_received?: string | null;
}

export interface Notification {
  id: number;
  user: User;
  message: string;
  detailed_message?: string | null;
  related_report?: Report | null;
  is_read: boolean;
  created_at: string;
}

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
