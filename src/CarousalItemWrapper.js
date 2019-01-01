// libs
import * as React from 'react';
import {
  Platform,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// src
import { CarousalItemData } from './types';
import styles from './CarousalItemWrapperStyles';

type Props = {
  index: number,
  item: CarousalItemData,
  data: any,
  renderItem?: (data: any) => JSX.Element,
  itemPressed: () => void,
};

const Item = ({ data }: { data: string }) => <Text>{data}</Text>;

const CarousalItemWrapper = (props: Props) => {
  const { item, data, renderItem, itemPressed } = props;
  const imageStyle = {
    marginTop: item.Y,
    marginLeft: item.X,
    zIndex: item.zIndex,
    width: item.w,
    height: item.h,
    opacity: item.opacity,
  };

  if (Platform.OS === 'ios') {
    return (
      <TouchableWithoutFeedback onPress={itemPressed}>
        <View style={[styles.image, imageStyle]}>
          {renderItem ? renderItem(data) : <Item data={data} />}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableNativeFeedback onPress={itemPressed}>
      <View style={[styles.image, imageStyle]}>
        {renderItem ? renderItem(data) : <Item data={data} />}
      </View>
    </TouchableNativeFeedback>
  );
};

export default CarousalItemWrapper;
