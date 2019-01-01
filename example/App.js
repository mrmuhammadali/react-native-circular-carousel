import React from 'react';
import { registerRootComponent } from 'expo';
import Carousal from 'react-native-circular-carousal';

class Home extends React.Component {
  render() {
    return <Carousal dataSource={[1, 2, 3, 4, 5]} />;
  }
}

registerRootComponent(Home);
