import React from 'react';
import CircularCarousel from 'react-native-circular-carousel';
import { View } from 'react-native';

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
    alignSelf: 'center',
    height: 550,
  },
};

class SimpleCarousel extends React.Component {
  state = {
    entries: [
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
      { name: 'Sixteen', icon: require('./../assets/lion.png') },
      { name: 'Seventeen', icon: require('./../assets/wolf.png') },
      { name: 'Eighteen', icon: require('./../assets/jaguar.png') },
    ],
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title'),
  });

  render() {
    const { entries } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.carouselView}>
          <CircularCarousel
            style={{ height: 550, width: 350 }}
            dataSource={entries}
            renderItem={data => <CarouselItem data={data} />}
          />
        </View>
      </View>
    );
  }
}

export default SimpleCarousel;
