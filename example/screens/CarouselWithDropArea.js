import React from 'react';
import CircularCarousel from 'react-native-circular-carousel';
import { View, Animated } from 'react-native';

import CarouselItem from './../CarouselItem';

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    backgroundColor: '#33333d',
  },
  carouselView: {
    alignSelf: 'flex-start',
    height: 550,
  },
  dropArea: {
    position: 'absolute',
    bottom: 0,
    left: 130,
  },
  wrappingDropArea: {
    width: 200,
    height: 120,
    backgroundColor: 'transparent',
    bottom: 0,
    left: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagonalDropArea: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 100,
    borderTopWidth: 60,
    borderRightColor: 'transparent',
    borderTopColor: '#0d7966',
  },
  collidingArea: {
    backgroundColor: 'green',
  },
};

class CarsouselWithDropArea extends React.Component {
  state = {
    entries: [
      { name: 'Lion', icon: require('./../assets/lion.png') },
      { name: 'Wolf', icon: require('./../assets/wolf.png') },
      { name: 'Jaguar', icon: require('./../assets/jaguar.png') },
      { name: 'One', icon: require('./../assets/lion.png') },
      { name: 'Two', icon: require('./../assets/wolf.png') },
      { name: 'Three', icon: require('./../assets/jaguar.png') },
      { name: 'Four', icon: require('./../assets/lion.png') },
      { name: 'Five', icon: require('./../assets/wolf.png') },
      { name: 'Six', icon: require('./../assets/jaguar.png') },
      { name: 'Seven', icon: require('./../assets/lion.png') },
      { name: 'Eight', icon: require('./../assets/wolf.png') },
      { name: 'Nine', icon: require('./../assets/jaguar.png') },
      { name: 'Ten', icon: require('./../assets/lion.png') },
      { name: 'Eleve', icon: require('./../assets/wolf.png') },
      { name: 'Twelve', icon: require('./../assets/jaguar.png') },
      { name: 'Thirteen', icon: require('./../assets/lion.png') },
      { name: 'Fourteen', icon: require('./../assets/wolf.png') },
      { name: 'Fifteen', icon: require('./../assets/jaguar.png') },
    ],
    droppedEntries: [],
    dropAreaLayout: { width: 0, height: 0, x: 0, y: 0 },
    diagonalDropAreaLayout: { width: 0, height: 0, x: 0, y: 0 },
    isColliding: false,
    diagonalDropAreaHorizontal: 0,
    diagonalDropAreaVertical: 0,
    animatedNormalization: new Animated.Value(0),
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title'),
  });

  handleDropAreaLayoutChange = event => {
    const { layout } = event.nativeEvent;
    this.setState(
      () => ({ dropAreaLayout: layout }),
      this.setLeftAndTopAnimations
    );
  };

  handleDiagonalDropAreaLayoutChange = event => {
    const { layout } = event.nativeEvent;
    const { diagonalDropAreaLayout } = this.state;
    if (diagonalDropAreaLayout.width !== 0) return;
    this.setState(() => ({ diagonalDropAreaLayout: layout }));
  };

  setLeftAndTopAnimations = () => {
    const { dropAreaLayout, diagonalDropAreaLayout } = this.state;
    const horizontalAnimate =
      (dropAreaLayout.width - diagonalDropAreaLayout.width) / 2;
    const verticalAnimate =
      (dropAreaLayout.height - diagonalDropAreaLayout.height) / 2;
    this.setState(() => ({
      diagonalDropAreaHorizontal: horizontalAnimate,
      diagonalDropAreaVertical: verticalAnimate,
    }));
  };

  handleItemDrop = (index: number): void => {
    const { entries } = this.state;
    const [droppedEntry] = entries.filter((_, i) => i === index);
    this.setState(({ entries, droppedEntries }) => ({
      isColliding: false,
      entries: entries.filter((_, i) => i !== index),
      droppedEntries: [...droppedEntries, droppedEntry],
    }));
  };

  /**
   * Set the Props while the item is in Dragging state
   * @param {Object} obj - Dragging Props Object
   * @param {boolean} obj.isColliding - Collision of Dragging Item with Drop Area
   * @param {number} obj.translationFactor - Translation factor 0-1 , to determine the animation of Drop Area
   */
  setDraggingProps = ({ isColliding, translationFactor }): void => {
    const { animatedNormalization } = this.state;
    animatedNormalization.setValue(translationFactor);
    if (this.state.isColliding !== isColliding) {
      this.setState(() => ({ isColliding }));
    }
  };

  render() {
    const {
      dropAreaLayout,
      entries,
      diagonalDropAreaHorizontal,
      diagonalDropAreaVertical,
      animatedNormalization,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.carouselView}>
          <CircularCarousel
            style={{ height: 550, width: 350 }}
            dataSource={entries}
            dropAreaLayout={dropAreaLayout}
            onItemDrop={this.handleItemDrop}
            setDraggingProps={this.setDraggingProps}
            renderItem={data => <CarouselItem data={data} />}
            //disableDragScaling
          />

          <View
            onLayout={this.handleDropAreaLayoutChange}
            style={styles.wrappingDropArea}
          >
            <Animated.View
              onLayout={this.handleDiagonalDropAreaLayoutChange}
              style={[
                styles.diagonalDropArea,
                {
                  transform: [
                    {
                      translateX: animatedNormalization.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -diagonalDropAreaHorizontal],
                      }),
                    },
                    {
                      translateY: animatedNormalization.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -diagonalDropAreaVertical],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.diagonalDropArea,
                {
                  transform: [
                    { rotate: '180deg' },
                    {
                      translateX: animatedNormalization.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -diagonalDropAreaHorizontal],
                      }),
                    },
                    {
                      translateY: animatedNormalization.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -diagonalDropAreaVertical],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default CarsouselWithDropArea;
