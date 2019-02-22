// src

export type DropAreaLayout = {
  x: number,
  y: number,
  width: number,
  height: number,
};

export type Layout = {
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
  itemStyle?: ItemStyle,
  radius?: number,
  dropAreaLayout: DropAreaLayout,
  renderItem?: (data: any) => JSX.Element,
  onItemPress?: (index: number) => void,
  onItemDrop?: (index: number) => void,
  disableDragScaling?: boolean,
  setDraggingProps?: (props: ItemDraggingProps) => void,
};

export type CircularCarouselState = {
  yMargins: YMargins,
  frontItemIndex: number,
  items: CarouselItemData[],
  isDragging: boolean,
  itemLayout: Layout,
};

export type ItemStyle = {
  width: number,
  height: number,
};

export type YMargins = {
  min: number,
  max: number,
};

export type ItemDraggingProps = {
  isColliding: boolean,
  translationFactor: number,
};
