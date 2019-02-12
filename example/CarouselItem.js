// libs
import React from 'react';
import { Image, Text, View } from 'react-native';
import { LinearGradient } from 'expo';

// src
import styles from './CarouselItemStyles';

type CarousalItemProps = {
  data: {
    name: string,
    icon: string,
    isSelected: boolean,
  },
  onLayoutChange: (event: any) => void,
};

const CarouselItem = ({ data, onLayoutChange }: CarousalItemProps) => {
  const { name = '', icon = '', isSelected = false } = data;

  return (
    <View style={styles.slideContainer}>
      <LinearGradient
        style={[
          styles.slides,
          { borderWidth: isSelected ? 0.5 : 0.0, borderColor: '#FFF' },
        ]}
        locations={[0.2, 1.0]}
        colors={['#0d7966', '#013738']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Image
          resizeMode="contain"
          style={{ flex: 1, height: 110, width: 110 }}
          source={icon}
        />
      </LinearGradient>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
};

export default CarouselItem;
