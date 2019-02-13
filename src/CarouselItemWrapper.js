// libs
import * as React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// src
import CarouselItem from './CarouselItem';
import { CarouselItemData, DropAreaLayout } from './types';
import DraggableItem from './DraggableItem';

type Props = {
  isDraggable: boolean,
  item: CarouselItemData,
  data: any,
  dropAreaLayout: DropAreaLayout,
  renderItem?: (data: any) => JSX.Element,
  onItemPress: () => void,
  onItemDrop: () => void,
  setItemDraggingState: (isDragging: boolean) => void,
  setItemCollision: (isColliding: boolean) => void,
};

const CarouselItemWrapper = (props: Props) => {
  const {
    isDraggable,
    item,
    data,
    dropAreaLayout,
    renderItem = CarouselItem,
    onItemPress,
    onItemDrop,
    setItemDraggingState,
    setItemCollision,
  } = props;
  const { h, opacity, w, X, Y, zIndex } = item;
  const wrapperStyle = {
    opacity,
    zIndex,
    marginTop: Y,
    marginLeft: X,
    width: w,
    height: h,
    position: 'absolute',
  };
  const CarouselItemView = isDraggable ? (
    <DraggableItem
      style={wrapperStyle}
      data={data}
      item={item}
      dropAreaLayout={dropAreaLayout}
      onPress={onItemPress}
      onDrop={onItemDrop}
      setDraggingState={setItemDraggingState}
      setItemCollision={setItemCollision}
    >
      {renderItem(data)}
    </DraggableItem>
  ) : (
    <View style={wrapperStyle}>{renderItem(data)}</View>
  );

  if (Platform.OS === 'ios') {
    return (
      <TouchableWithoutFeedback onPress={onItemPress}>
        {CarouselItemView}
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableNativeFeedback onPress={onItemPress}>
      {CarouselItemView}
    </TouchableNativeFeedback>
  );
};

export default CarouselItemWrapper;
