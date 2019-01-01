// src

export type CarousalItemData = {
  X?: number,
  Y?: number,
  angle?: number,
  w?: number,
  h?: number,
  opacity?: number,
  zIndex?: number,
  index?: number,
  data?: {},
};

export type CircularCarousalProps = {
  dataSource: {}[],
  renderItem?: (data: any) => JSX.Element,
  onItemPress?: (index: number) => void,
  style?: {
    height?: number,
    width?: number,
  },
  itemStyle?: {
    height?: number,
    width?: number,
  },
  radius: number,
};

export type CircularCarousalState = {
  yMargins: { min: number, max: number },
  frontItemIndex: number,
  items: CarousalItemData[],
};
