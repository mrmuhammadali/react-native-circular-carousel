import React from 'react';
import CircularCarousel from 'react-native-circular-carousel';
import { registerRootComponent } from 'expo';
import { Image, View } from 'react-native';

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
  },
  dropArea: {
    position: 'absolute',
    backgroundColor: '#888',
    // width: '100%',
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingTop: 50,
    // paddingBottom: 50,
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
    isColliding: false,
  };

  handleDropAreaLayoutChange = event => {
    const { layout } = event.nativeEvent;
    this.setState(() => ({ dropAreaLayout: layout }));
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
    const { dropAreaLayout, entries, isColliding } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.carouselView}>
          <CircularCarousel
            style={{ height: 450, width: 350 }}
            dataSource={entries}
            dropAreaLayout={dropAreaLayout}
            onItemDrop={this.handleItemDrop}
            setItemCollision={this.setItemCollision}
            renderItem={data => <CarouselItem data={data} />}
          />
        </View>

        <Image
          onLayout={this.handleDropAreaLayoutChange}
          style={[styles.dropArea, isColliding ? styles.collidingArea : {}]}
          source={require('./assets/agent.png')}
        />
      </View>
    );
  }
}

registerRootComponent(App);
