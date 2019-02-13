// libs
import React from 'react';
import { Text, View } from 'react-native';

// src
import styles from './CarouselItemStyles';

const CarouselItem = ({ name }: { name: string }) => {
  return (
    <View style={styles.slideContainer}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
};

export default CarouselItem;
