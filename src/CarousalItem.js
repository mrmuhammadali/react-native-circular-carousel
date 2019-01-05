// libs
import * as React from 'react';
import { Text, View } from 'react-native';

// src
import styles from './CarousalItem.styles';

const CarousalItem = ({ data }: { data: string }) => (
  <View style={styles.item}>
    <Text>{data}</Text>
  </View>
);

export default CarousalItem;
