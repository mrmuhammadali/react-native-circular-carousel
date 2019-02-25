import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';

class Home extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  render() {
    return (
      <View style={styles.homeContainer}>
        <TouchableHighlight
          style={styles.buttons}
          onPress={() =>
            this.props.navigation.navigate('SimpleCarousel', {
              title: 'Circular Carousel',
            })
          }
        >
          <Text style={styles.buttonText}>Circlar Carousel</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.buttons}
          onPress={() =>
            this.props.navigation.navigate('CarouselWithDropArea', {
              title: 'Circular Carousel With DropArea',
            })
          }
        >
          <Text style={styles.buttonText}>Circular Carousel with DropArea</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  buttons: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 15,
    margin: 10,
  },
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default Home;
