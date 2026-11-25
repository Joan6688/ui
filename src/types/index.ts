export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
  axis?: 'left' | 'right';
}

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'tag' | 'text';
}