// libs
import * as React from 'react';
import { Text, View } from 'react-native';

// src
import styles from './CarouselItemStyles';

const CarouselItem = ({ data }: { data: string }) => (
  <View style={styles.item}>
    <Text>{data}</Text>
  </View>
);

export default CarouselItem;
