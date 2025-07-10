export type OrderInfo = {
  date: string;
  loading: number;
  working: number;
  target: number;
  inspect: number;
  pass: number;
  cncm: number;
  balance: number;
  defect_percentage: number;
  progress_percentage: number;
};

export type ManPower = {
  man_power: number;
  man_operator: number;
  helper: number;
  iron: number;
  qc: number;
  qc_finishing: number;
  hangtag: number;
  folding: number;
};
