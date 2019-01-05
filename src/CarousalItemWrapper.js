// libs
import * as React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// src
import CarousalItem from './CarousalItem';
import { CarousalItemData, DropAreaLayout } from './types';
import DraggableItem from './DraggableItem';

type Props = {
  isDraggable: boolean,
  item: CarousalItemData,
  data: any,
  dropAreaLayout: DropAreaLayout,
  renderItem?: (data: any) => JSX.Element,
  onItemPress: () => void,
  onItemDrop: () => void,
  setItemDraggingState: (isDragging: boolean) => void,
};

const CarousalItemWrapper = (props: Props) => {
  const {
    isDraggable,
    item,
    data,
    dropAreaLayout,
    renderItem,
    onItemPress,
    onItemDrop,
    setItemDraggingState,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  };
  let CarousalItemView = renderItem ? (
    renderItem(data)
  ) : (
    <CarousalItem data={data} />
  );
  CarousalItemView = isDraggable ? (
    <DraggableItem
      data={data}
      item={item}
      dropAreaLayout={dropAreaLayout}
      onPress={onItemPress}
      onDrop={onItemDrop}
      setDraggingState={setItemDraggingState}
    >
      {CarousalItemView}
    </DraggableItem>
  ) : (
    CarousalItemView
  );

  if (Platform.OS === 'ios') {
    return (
      <TouchableWithoutFeedback onPress={onItemPress}>
        <View style={wrapperStyle}>{CarousalItemView}</View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableNativeFeedback onPress={onItemPress}>
      <View style={wrapperStyle}>{CarousalItemView}</View>
    </TouchableNativeFeedback>
  );
};

export default CarousalItemWrapper;
