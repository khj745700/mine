export interface IAchievement {
  achievementId: number;
  title: string;
  description: string;
  amount: number;
  count: number;
  achievedDate?: string;
}

export interface IAchievedCountResponseData {
  count: number;
}
