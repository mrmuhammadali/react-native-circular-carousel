// libs
import flow from 'lodash/fp/flow';
import inRange from 'lodash/inRange';
import isEqual from 'lodash/isEqual';
import reduce from 'lodash/fp/reduce';
import size from 'lodash/fp/size';
import some from 'lodash/fp/some';
import times from 'lodash/times';
import { Dimensions } from 'react-native';

// src
import { CarouselItemData } from './types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

type GetStylesProps = {
  style?: {},
  itemStyle?: {},
};

type GetStylesReturnType = {
  style: { width: number, height: number },
  itemStyle: { width: number, height: number },
};

export function getStyles(props: GetStylesProps): GetStylesReturnType {
  const { style = {}, itemStyle = {} } = props;

  return {
    style: { width: 350, height: 200, ...style },
    itemStyle: { width: 110, height: 120, ...itemStyle },
  };
}

function calculateItemsPositions(
  angle: number,
  radius: number,
  containerWidth: number,
  itemStyle: { width: number, height: number }
): (items: CarouselItemData[]) => CarouselItemData[] {
  return (items: CarouselItemData[]) => {
    return items.map(({ index: __index__, ...item }: CarouselItemData) => {
      const index = __index__ || 0;
      const q = ((index * 360) / size(items) + angle) % 360;
      const alpha = q * (Math.PI / 180);
      const sinalpha = Math.sin(alpha);
      const cosalpha = Math.cos(alpha);
      const x = radius * sinalpha + (containerWidth / 2 - itemStyle.width / 2);
      const y = radius * cosalpha * ELEVATION_CONSTANT + itemStyle.height / 3;

      return { ...item, X: x, Y: y, angle: q };
    });
  };
}

export function getItemScalingCoefficient(
  yMargins: { min: number, max: number },
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

function rescale(A: number, B: number, C: number, D: number, x: number) {
  return C * (1 - (x - A) / (B - A)) + (D * (x - A)) / (B - A);
}

function rearrangeItemsDimensions(
  itemStyle: { width: number, height: number },
  yMargins: { min: number, max: number }
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
        opacity: coefficient < 0.7 ? 0 : rescale(0.7, 1, 0, 1, coefficient),
      };
    });
  };
}

export function initializeCarouselItems(
  radius: number,
  containerWidth: number,
  itemStyle: { width: number, height: number },
  dataSource: {}[]
): CarouselItemData[] {
  return flow(
    (thisItems: {}[]) =>
      thisItems.map((data: {}, index: number) => ({ data, index })),
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

export function arrangeItemsInCircle(
  frontIndex: number,
  angle: number,
  radius: number,
  containerWidth: number,
  itemStyle: { width: number, height: number },
  yMargins: { min: number, max: number },
  items: CarouselItemData[]
): CarouselItemData[] {
  const indices = getItemsIndices(frontIndex)(size(items));

  return flow(
    (thisItems: CarouselItemData[]) =>
      thisItems.map((item, index) => ({ ...item, index: indices[index] })),
    calculateItemsPositions(angle, radius, containerWidth, itemStyle),
    rearrangeItemsDimensions(itemStyle, yMargins)
  )(items);
}

export const isCollidingWithDropArea = (
  dropAreaLayout: DropAreaLayout,
  gesture: PanResponderGestureState,
  item: CarouselItemData,
  itemLayout
) => {
  const dAX0 = dropAreaLayout.x;
  const dAX1 = dAX0 + dropAreaLayout.width;
  const dAY0 = dropAreaLayout.y;
  const dAY1 = dAY0 + dropAreaLayout.height;
  const x0 = (screenWidth - itemLayout.width) / 2;
  const x1 = x0 + itemLayout.width;
  const y0 = item.Y;
  const y1 = y0 + itemLayout.height;
  const dx0 = gesture.x0 - x0;
  const dx1 = x1 - gesture.x0;
  const dy0 = gesture.y0 - y0;
  const dy1 = y1 - gesture.y0;
  const mx0 =
    gesture.moveX > gesture.x0 ? gesture.moveX - dx0 : gesture.moveX + dx0;
  const mx1 =
    gesture.moveX > gesture.x0 ? gesture.moveX + dx1 : gesture.moveX - dx1;
  const my0 =
    gesture.moveY > gesture.y0 ? gesture.moveY - dy0 : gesture.moveY + dy0;
  const my1 =
    gesture.moveY > gesture.y0 ? gesture.moveY + dy1 : gesture.moveY - dy1;

  console.log(
    'droplayout area',
    dAX0,
    dAX1,
    dAY0,
    dAY1,
    dropAreaLayout.width,
    dropAreaLayout.height
  );
  // console.log('item layout ', screenWidth, screenHeight);
  // console.log('draggable', x0, x1, y0, y1);
  // console.log('gesture', gesture.x0, gesture.y0, gesture.moveX, gesture.moveY);
  // console.log('distance', dx0, dx1, dy0, dy1);
  console.log('move', mx0, mx1, my0, my1);

  // console.log('x0=>', mx0, item);
  // console.log('x1=>', mx1, dAX0, dAX1);
  console.log('new ', gesture.moveX - (dx0 - x0));
  console.log(
    'x positions',
    inRange(mx0, dAX0, dAX1) || inRange(mx1, dAX0, dAX1)
  );
  console.log(
    'y positions ',
    inRange(my0, dAY0, dAY1) || inRange(my1, dAY0, dAY1)
  );

  return (
    (inRange(mx0, dAX0, dAX1) || inRange(mx1, dAX0, dAX1)) &&
    (inRange(my0, dAY0, dAY1) || inRange(my1, dAY0, dAY1))
  );
};
