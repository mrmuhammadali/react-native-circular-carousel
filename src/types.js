// src

export type DropAreaLayout = {
  x: number,
  y: number,
  width: number,
  height: number,
};

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
  style?: {
    height?: number,
    width?: number,
  },
  itemStyle?: {
    height?: number,
    width?: number,
  },
  radius?: number,
  dropAreaLayout: DropAreaLayout,
  renderItem?: (data: any) => JSX.Element,
  onItemPress?: (index: number) => void,
  onItemDrop?: (index: number) => void,
};

export type CircularCarousalState = {
  yMargins: { min: number, max: number },
  frontItemIndex: number,
  items: CarousalItemData[],
  isDragging: boolean,
};
