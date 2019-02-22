// libs
import { Dimensions, PanResponderGestureState } from 'react-native';
import flow from 'lodash/fp/flow';
import inRange from 'lodash/inRange';
import isEqual from 'lodash/isEqual';
import reduce from 'lodash/fp/reduce';
import size from 'lodash/fp/size';
import some from 'lodash/fp/some';
import times from 'lodash/times';

// src
import type { CarouselItemData, Layout, ItemStyle, YMargins } from './types';

/**
 *
 * @param {string | Array<string>} key
 * @param {Object} thisProps
 * @param {Object} nextProps
 */
export const hasPropChanged = (
  key: string | string[],
  thisProps: {},
  nextProps: {}
): boolean => {
  if (typeof key === 'string') {
    return !isEqual(thisProps[key], nextProps[key]);
  }
  // @ts-ignore
  return some(value => !isEqual(thisProps[value], nextProps[value]))(key);
};

const ELEVATION_CONSTANT = Math.cos(Math.PI / 2.3);
const ITEM_PADDING = 30;
const SCREEN_WIDTH = Dimensions.get('screen').width;

type GetStylesProps = {
  style?: {},
  itemStyle?: {},
};

type GetStylesReturnType = {
  style: { width: number, height: number },
  itemStyle: { width: number, height: number },
};

export function getStyles(props: GetStylesProps): GetStylesReturnType {
  const {
    style = { width: SCREEN_WIDTH, height: SCREEN_WIDTH },
    itemStyle = {},
  } = props;

  return {
    style,
    itemStyle: {
      width: style.width / 3 + ITEM_PADDING,
      height: style.width / 3 + ITEM_PADDING,
      ...itemStyle,
    },
  };
}

/**
 * Calculation of position for every item in the carousel
 * @param {number} angle Starting angle if any for arranging the items
 * @param {number} radius Radius of the Circular Carousel
 * @param {number} containerWidth Width of the container containing Carousel
 * @param {ItemStyle} itemStyle items style containing width and height of item
 */
function calculateItemsPositions(
  angle: number,
  radius: number,
  containerWidth: number,
  itemStyle: ItemStyle
): (items: CarouselItemData[]) => CarouselItemData[] {
  return (items: CarouselItemData[]) => {
    return items.map(({ index: __index__, ...item }: CarouselItemData, i) => {
      const index = __index__ || 0;
      const q = ((i * 360) / size(items) + angle) % 360;
      const alpha = q * (Math.PI / 180);
      const sinalpha = Math.sin(alpha);
      const cosalpha = Math.cos(alpha);
      const x = radius * sinalpha + (containerWidth / 2 - itemStyle.width / 2);
      const y = radius * cosalpha * ELEVATION_CONSTANT + itemStyle.height / 3;

      return { ...item, X: x, Y: y, angle: q, index: index };
    });
  };
}

/**
 * Calculate the coefficient of every item visible in the carousel,
 * so that we can determine 'opacity' and 'zIndex' of the item in the Carousel
 * @param {YMargins} yMargins y axis min and max of the item
 * @param {CarouselItemData} item Properties of the item  whose coefficient is calculated
 */
export function getItemScalingCoefficient(
  yMargins: YMargins,
  item: CarouselItemData
): number {
  const { min, max } = yMargins;
  let d = (max - min) * 9;
  const { Y = 0 } = item || {};

  if (d === 0) {
    d = 1;
  }

  return Math.abs(1 - (max - Y) / d);
}

function rescale(
  A: number,
  B: number,
  C: number,
  D: number,
  x: number
): number {
  return C * (1 - (x - A) / (B - A)) + (D * (x - A)) / (B - A);
}

/**
 * Set items zIndex and opacity in the carousel
 * @param {ItemStyle} itemStyle  items style containing width and height of item
 * @param {YMarging} yMargins  y axis min and max of the item
 */
function rearrangeItemsDimensions(
  itemStyle: ItemStyle,
  yMargins: YMargins
): (items: CarouselItemData[]) => CarouselItemData[] {
  const { width, height } = itemStyle;

  return (items: CarouselItemData[]) => {
    return items.map((item: CarouselItemData) => {
      const coefficient = getItemScalingCoefficient(yMargins, item);
      const newWidth = width * coefficient;
      const diff = width - newWidth;
      const x = item.X || 0;

      return {
        ...item,
        X: x + diff / 2,
        w: newWidth,
        h: height * coefficient,
        zIndex: 100 * coefficient,
        opacity: coefficient < 0.7 ? 0 : rescale(0.6, 1, 0, 1, coefficient),
      };
    });
  };
}

/**
 * To show only 5 items in the circle
 */
function positionFiveItemsInCircle() {
  return items => {
    return size(items) >= 5
      ? items.slice(0, 3).concat(items.slice(size(items) - 2))
      : items;
  };
}

/**
 * Initialize carousel items in circle by calculating positions
 * of items in circle
 * @param {number} radius  Radius of the Circular Carousel
 * @param {number} containerWidth  Width of the container containing Carousel
 * @param {ItemStyle} itemStyle  Width and height of single item displayed in the carousel
 * @param {{}[]} dataSource Array of the Items to be displayed in Circular Carousel
 */
export function initializeCarouselItems(
  radius: number,
  containerWidth: number,
  itemStyle: { width: number, height: number },
  dataSource: {}[]
): CarouselItemData[] {
  return flow(
    (thisItems: {}[]) =>
      thisItems.map((data: {}, index: number) => ({ data, index })),
    positionFiveItemsInCircle(),
    calculateItemsPositions(0, radius, containerWidth, itemStyle)
  )(dataSource);
}

function getItemsIndices(
  frontIndex: number
): (total: number) => { [index: number]: number } {
  let previousIndex = frontIndex;

  return (total: number) =>
    flow(
      times,
      reduce((final, index) => {
        if (index === 0) {
          return { ...final, [frontIndex]: index };
        }

        previousIndex = (previousIndex + 1) % total;

        return { ...final, [previousIndex]: index };
      }, {})
    )(total);
}

/**
 * Arrange the items in the circle
 * @param {number} frontIndex Item in the front of the carousel, aka Active Item
 * @param {number} angle  Starting angle if any for arranging the items
 * @param {number} radius Radius of the Circular Carousel
 * @param {number} containerWidth Width of the container containing Carousel
 * @param {ItemStyle} itemStyle Width and height of the Single item in Carousel
 * @param {YMargins} yMargins y axis min and max of the item
 * @param {CarouselItemData[]} items Array of items to be placed in Carousel
 */
export function arrangeItemsInCircle(
  frontIndex: number,
  angle: number,
  radius: number,
  containerWidth: number,
  itemStyle: ItemStyle,
  yMargins: YMargins,
  items: CarouselItemData[]
): CarouselItemData[] {
  return flow(
    (thisItems: CarouselItemData[]) =>
      // thisItems.map((item, index) => ({ ...item, index: indices[index] })),
      // positionFiveItemsInCircle(),
      thisItems.map(item => item),
    calculateItemsPositions(angle, radius, containerWidth, itemStyle),
    rearrangeItemsDimensions(itemStyle, yMargins)
  )(items);
}

/**
 * Detect the collision of Item with Drop Area
 * @param {Layout} dropAreaLayout layout of the drop area containing width and height of the drop area
 * @param {PanResponderGestureState} gesture Gesture object contaning the variables of gestures like x,y,moveX,moveY
 * @param {CarouselItemData} item Properties of the item  whose collision is being detected with drop area
 * @param {number} scaleFactor Scaling factor [0-1] of the item while moving
 */
export const isCollidingWithDropArea = (
  dropAreaLayout: Layout,
  gesture: PanResponderGestureState,
  item: CarouselItemData,
  scaleFactor: number = 1
) => {
  const dimensionFactor =
    parseFloat(JSON.stringify(scaleFactor)) === 1 ? 1 : 0.6 + scaleFactor / 3;
  const xFactor =
    parseFloat(JSON.stringify(scaleFactor)) === 1 ? 1 : 0.6 + scaleFactor / 2;
  const dAX0 = dropAreaLayout.x;
  const dAX1 = dAX0 + dropAreaLayout.width;
  const dAY0 = dropAreaLayout.y;
  const dAY1 = dAY0 + dropAreaLayout.height;
  const x0 = item.X;
  const x1 = x0 + item.w * dimensionFactor;
  const y0 = item.Y;
  const y1 = y0 + item.h * dimensionFactor;
  const dx0 = gesture.x0 * xFactor - x0;
  const dx1 = x1 - gesture.x0;
  const dy0 = gesture.y0 * dimensionFactor - y0;
  const dy1 = y1 - gesture.y0;
  const mx0 = gesture.moveX - dx0;
  const mx1 = gesture.moveX + dx1;
  const my0 = gesture.moveY - dy0;
  const my1 = gesture.moveY + dy1;

  return (
    (inRange(mx0, dAX0, dAX1) ||
      inRange((mx0 + mx1) / 2, dAX0, dAX1) ||
      inRange(mx1, dAX0, dAX1)) &&
    (inRange(my0, dAY0, dAY1) ||
      inRange((my0 + my1) / 2, dAY0, dAY1) ||
      inRange(my1, dAY0, dAY1))
  );
};
