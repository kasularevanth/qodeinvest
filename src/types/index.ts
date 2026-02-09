export interface NAVDataPoint {
  date: Date;
  nav: number;
}

export interface TrailingReturns {
  name: string;
  ytd: number;
  '1d': number;
  '1w': number;
  '1m': number;
  '3m': number;
  '6m': number;
  '1y': number;
  '3y': number;
  si: number;
  dd: number;
  maxdd: number;
}

export interface BlogPost {
  date: string;
  title: string;
  excerpt: string;
  link: string;
}

export interface ChartDataPoint {
  date: Date;
  focused: number;
  nifty50: number;
  drawdown: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}
