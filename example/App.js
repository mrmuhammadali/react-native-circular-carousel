import React from 'react';
import CircularCarousel from 'react-native-circular-carousel';
import { registerRootComponent } from 'expo';
import { Image, View, Animated } from 'react-native';

import CarouselItem from './CarouselItem';

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
    backgroundColor: '#eee',
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
    borderTopColor: 'red',
    // left: 25,
    // bottom: 25,
  },
  collidingArea: {
    backgroundColor: 'green',
  },
};

class App extends React.Component {
  state = {
    entries: [
      { name: 'Lion', icon: require('./assets/lion.png') },
      { name: 'Wolf', icon: require('./assets/wolf.png') },
      { name: 'Jaguar', icon: require('./assets/jaguar.png') },
    ],
    dropAreaLayout: { width: 0, height: 0, x: 0, y: 0 },
    diagonalDropAreaLayout: { width: 0, height: 0, x: 0, y: 0 },
    isColliding: false,
    diagonalDropAreaHorizontal: 0,
    diagonalDropAreaVertical: 0,
    animatedNormalization: new Animated.Value(0),
  };

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

  animatedNormalization = value => {
    const { animatedNormalization } = this.state;
    animatedNormalization.setValue(value);
  };

  handleItemDrop = (index: number): void => {
    this.setState(({ entries }) => ({
      isColliding: false,
      entries: entries.filter((_, i) => i !== index),
    }));
  };

  setItemCollision = (isColliding: boolean): void => {
    if (this.state.isColliding !== isColliding) {
      this.setState(() => ({ isColliding }));
    }
  };

  render() {
    const {
      dropAreaLayout,
      entries,
      isColliding,
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
            setItemCollision={this.setItemCollision}
            renderItem={data => <CarouselItem data={data} />}
            animatedNormalization={this.animatedNormalization}
            //disableDragScaling
          />

          {/* <Image
            onLayout={this.handleDropAreaLayoutChange}
            style={[styles.dropArea, isColliding ? styles.collidingArea : {}]}
            source={require('./assets/agent.png')}
          /> */}

          <View
            onLayout={this.handleDropAreaLayoutChange}
            style={styles.wrappingDropArea}
          >
            <Animated.View
              onLayout={this.handleDiagonalDropAreaLayoutChange}
              style={[
                styles.diagonalDropArea,
                {
                  //left: diagonalDropAreaHorizontal,
                  //top: diagonalDropAreaVertical,
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

registerRootComponent(App);
