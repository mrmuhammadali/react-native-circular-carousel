// libs
import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
} from 'react-native';

// src
import { CarouselItemData, Layout } from './types';
import { isCollidingWithDropArea } from './utils';

type Props = {
  style: {},
  item: CarouselItemData,
  dropAreaLayout: Layout,
  onDrop: () => void,
  onPress: () => void,
  setDraggingState: (isDragging: boolean) => void,
};

type State = {
  pan: any,
};

export default class DraggableItem extends React.Component<Props, State> {
  panResponder: PanResponderInstance = null;
  _val = null;
  state = {
    pan: new Animated.ValueXY(),
    scale: new Animated.ValueXY({ x: 1, y: 1 }),
  };

  UNSAFE_componentWillMount() {
    // Add a listener for the delta value change
    this._val = { x: 0, y: 0 };
    const { pan, scale } = this.state;

    pan.addListener(value => (this._val = value));

    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (
        e: GestureResponderEvent,
        gesture: PanResponderGestureState
      ) => {
        const {
          dropAreaLayout,
          item,
          setDraggingState,
          setItemCollision,
        } = this.props;
        const { moveY, y0 } = gesture;
        const dropAreaDistance = dropAreaLayout.y - item.Y;

        let normalized = (gesture.dy - 0) / (dropAreaDistance - 0);
        if (moveY - y0 > 20) {
          setDraggingState(true);

          if (setItemCollision) {
            setItemCollision(
              isCollidingWithDropArea(dropAreaLayout, gesture, item)
            );
          }

          if (normalized < 0.4) {
            scale.setValue({ x: 1 - normalized, y: 1 - normalized });
          }

          return Animated.event([null, { dx: pan.x, dy: pan.y }])(e, gesture);
        }
      },
      onPanResponderRelease: (
        e: GestureResponderEvent,
        gesture: PanResponderGestureState
      ) => {
        const {
          item,
          dropAreaLayout,
          onPress,
          onDrop,
          setDraggingState,
        } = this.props;
        const { moveX, moveY, x0, y0 } = gesture;

        scale.setValue({ x: 1, y: 1 });

        if (onPress && (moveX === x0 && moveY === y0)) {
          onPress();
        } else if (isCollidingWithDropArea(dropAreaLayout, gesture, item)) {
          onDrop();
        }
        setDraggingState(false);
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
        }).start();
      },
    });
    // adjusting delta value
    pan.setValue({ x: 0, y: 0 });
    scale.setValue({ x: 1, y: 1 });
  }

  render() {
    const { pan, scale } = this.state;
    const { children, style } = this.props;
    const panHandlers = this.panResponder.panHandlers;
    const panStyle = {
      transform: [
        { translateX: pan.x },
        { translateY: pan.y },
        { scaleX: scale.x },
        { scaleY: scale.y },
      ],
    };

    return (
      <Animated.View {...panHandlers} style={[panStyle, style]}>
        {children}
      </Animated.View>
    );
  }
}
