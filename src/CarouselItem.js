// libs
import React from 'react';
import { Text, View } from 'react-native';

// src
import styles from './CarouselItemStyles';

type CarouselItemProps = {
  data: string,
};

const CarouselItem = ({ data }: CarouselItemProps) => {
  return (
    <View style={styles.slideContainer}>
      <Text style={styles.text}>{data}</Text>
    </View>
  );
};

export default CarouselItem;
