import React from 'react';
import CircularCarousal from 'react-native-circular-carousal';
import { registerRootComponent } from 'expo';
import { Text, View } from 'react-native';

const style = {
  height: 200,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ddd',
  marginTop: 200,
};

class Home extends React.Component {
  state = {
    entries: ['Muhammad', 'Ali', 'Ahmed', 'Umar', 'Bilal'],
    dropAreaLayout: { width: 0, height: 0, x: 0, y: 0 },
  };

  handleItemDrop = (index: number): void => {
    this.setState(({ entries }) => ({
      entries: entries.filter((_, i) => i !== index),
    }));
  };

  handleDropAreaLayoutChange = event => {
    const { layout } = event.nativeEvent;
    this.setState(() => ({ dropAreaLayout: layout }));
  };

  render() {
    const { entries, dropAreaLayout } = this.state;

    return (
      <View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularCarousal
            style={{ width: 350 }}
            dataSource={entries}
            dropAreaLayout={dropAreaLayout}
            onItemDrop={this.handleItemDrop}
          />
        </View>
        <View style={style} onLayout={this.handleDropAreaLayoutChange}>
          <Text>Drop Area Layout</Text>
        </View>
      </View>
    );
  }
}

registerRootComponent(Home);
