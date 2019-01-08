// libs
import * as React from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderCallbacks,
  PanResponderGestureState,
  PanResponderInstance,
  Platform,
  View,
} from 'react-native';
import findIndex from 'lodash/fp/findIndex';
import maxBy from 'lodash/fp/maxBy';
import Math from 'mathjs';

// src
import {
  CarouselItemData,
  CircularCarouselProps,
  CircularCarouselState,
} from './types';
import CarouselItemWrapper from './CarouselItemWrapper';
import {
  arrangeItemsInCircle,
  getStyles,
  hasPropChanged,
  initializeCarouselItems,
} from './utils';

const styles = {
  containerStyle: {
    backgroundColor: 'transparent',
    width: 300,
    height: 200,
    overflow: 'hidden',
  },
};

const DURATION = Platform.OS === 'ios' ? 1 : 0;
const ROTATION_RATE = Platform.OS === 'ios' ? 5 : 10;
const PAN_ROTATION_RATE = 1;

export default class CircularCarousel extends React.Component<
  CircularCarouselProps,
  CircularCarouselState
> {
  panResponder: PanResponderInstance | { panHandlers: {} } = {
    panHandlers: {},
  };

  static defaultProps = {
    radius: 100,
  };

  constructor(props: CircularCarouselProps) {
    super(props);
    const { dataSource, radius } = props;
    const { style, itemStyle } = getStyles(props);
    const items: CarouselItemData[] = initializeCarouselItems(
      radius,
      style.width,
      itemStyle,
      dataSource
    );

    this.state = {
      items,
      frontItemIndex: 0,
      yMargins: { min: items[items.length - 1].Y, max: items[0].Y },
      isDragging: false,
    };
  }

  UNSAFE_componentWillMount() {
    const { yMargins, items } = this.state;
    this.arrangeItemsInCircle(0, 0, yMargins, items);
    this.addPanGesture();
  }

  UNSAFE_componentWillReceiveProps(nextProps: CircularCarouselProps) {
    const { dataSource, radius } = nextProps;
    if (dataSource.length < 1) {
      this.setState(() => ({ items: [] }));
    } else if (hasPropChanged('dataSource', this.props, nextProps)) {
      const { style, itemStyle } = getStyles(nextProps);
      const items: CarouselItemData[] = initializeCarouselItems(
        radius,
        style.width,
        itemStyle,
        dataSource
      );
      const yMargins = { min: items[items.length - 1].Y, max: items[0].Y };

      this.arrangeItemsInCircle(0, 0, yMargins, items);
    }
  }

  arrangeItemsInCircle(
    angle: number,
    frontItemIndex: number,
    yMargins: { min: number, max: number },
    prevItems: CarouselItemData[]
  ): void {
    const { radius } = this.props;
    const {
      style: { width: containerWidth },
      itemStyle,
    } = getStyles(this.props);
    const arrangedItems = arrangeItemsInCircle(
      frontItemIndex,
      angle,
      radius,
      containerWidth,
      itemStyle,
      yMargins,
      prevItems
    );

    this.setState(() => ({
      yMargins,
      frontItemIndex,
      items: arrangedItems,
    }));
  }

  rotateCarousel = (activeItem: number): void => {
    const { yMargins, items } = this.state;
    const cAngle = items[activeItem].angle;
    let rotationAngle = (360 - cAngle) % 360;

    if (rotationAngle > 180) {
      rotationAngle = rotationAngle - 360;
    } // make angle negative

    const rotateItems = (i: number) => {
      const ang = (rotationAngle < 0 ? -ROTATION_RATE : ROTATION_RATE) * i++;

      if (Math.abs(ang) > Math.abs(rotationAngle)) {
        this.arrangeItemsInCircle(0, activeItem, yMargins, items);
        return;
      }
      this.arrangeItemsInCircle(cAngle + ang, activeItem, yMargins, items);

      setTimeout(() => {
        rotateItems(i);
      }, DURATION);
    };

    rotateItems(1);
  };

  addPanGesture() {
    const panResponderCallbacks: PanResponderCallbacks = {
      onMoveShouldSetPanResponder: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) =>
        // Since we want to handle presses on individual items as well
        // Only start the pan responder when there is some movement
        this.state.items.length > 1 && Math.abs(gestureState.dx) > 10,

      onPanResponderMove: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const { frontItemIndex, yMargins, items } = this.state;
        const angle =
          (gestureState.moveX - gestureState.x0) * PAN_ROTATION_RATE;

        this.arrangeItemsInCircle(angle, frontItemIndex, yMargins, items);
      },

      onPanResponderRelease: () => {
        const { items } = this.state;
        const maxYItem = maxBy('Y')(items);
        const frontItemIndex = findIndex(maxYItem)(items);

        this.rotateCarousel(frontItemIndex);
      },
    };
    const panResponder: PanResponderInstance = PanResponder.create(
      panResponderCallbacks
    );
    this.panResponder = panResponder;
  }

  handleItemPress = (index: number): void => {
    const { frontItemIndex } = this.state;
    const { onItemPress } = this.props;

    if (index === frontItemIndex && onItemPress) {
      onItemPress(index);
      return;
    }

    this.rotateCarousel(index);
  };

  handleItemDrop = (index: number): void => {
    const { onItemDrop } = this.props;

    if (onItemDrop) {
      onItemDrop(index);
    }
  };

  setItemDraggingState = (isDragging: boolean) => {
    if (isDragging !== this.state.isDragging) {
      this.setState(() => ({ isDragging }));
    }
  };

  render() {
    const { items, frontItemIndex, isDragging } = this.state;
    const { style = {}, dropAreaLayout, renderItem, onItemDrop } = this.props;
    const panHandlers = isDragging ? {} : this.panResponder.panHandlers;

    return (
      <View style={[styles.containerStyle, style]} {...panHandlers}>
        {items.map(({ data, ...item }, index) => (
          <CarouselItemWrapper
            key={index}
            isDraggable={
              frontItemIndex === index && onItemDrop && dropAreaLayout
            }
            data={data}
            item={item}
            dropAreaLayout={dropAreaLayout}
            renderItem={renderItem}
            onItemPress={() => this.handleItemPress(index)}
            onItemDrop={() => this.handleItemDrop(index)}
            setItemDraggingState={this.setItemDraggingState}
          />
        ))}
      </View>
    );
  }
}
