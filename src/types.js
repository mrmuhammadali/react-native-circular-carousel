// src

export type DropAreaLayout = {
  x: number,
  y: number,
  width: number,
  height: number,
};

export type CarouselItemData = {
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

export type CircularCarouselProps = {
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

export type CircularCarouselState = {
  yMargins: { min: number, max: number },
  frontItemIndex: number,
  items: CarouselItemData[],
  isDragging: boolean,
};
