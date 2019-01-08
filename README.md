# React Native Circular Carousal

Circular Carousal for use on iOS and Android.

## Installation

Open a Terminal in your project's folder and run,

```sh

yarn add react-native-circular-carousal
					or
npm install --save react-native-circular-carousal

```

## Usage

```js
import CircularCarousal from 'react-native-circular-carousal';

<CircularCarousal
  style={{ width: 350 }}
  dataSource={entries}
  renderItem={data => <CarousalItem data={data} />}
  onItemPress={handleItemPress}
/>;
```

## Props

| Prop           | Type                            | Description                                                                     |
| -------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| dataSource\*   | Array                           | Items datasource                                                                |
| dropAreaLayout | Object: { height, width, x, y } | Layout of component where carousal items are going to be dropped                |
| renderItem     | (data) => Component             | Render a single carousal item component                                         |
| onItemPress    | (index) => void                 | This handler function is called when front carousal item is tapped.             |
| onItemDrop     | (index) => void                 | This handler function is called when carousal item is dropped upon Drop Area.   |
| style          | Object: { width, height }       | Styles given to container component. Default: { width: 350, height: 200 }       |
| itemStyle      | Object: { width, height }       | Styles given to a carousal item component. Default: { width: 110, height: 120 } |

\*\*Provide correct styles as these are used in arranging items in circle.

#### Thanks to contributors:

[Shamshad Khan](https://github.com/khanshamshad32)
[Umar Ashfaq](https://github.com/umarashfaq)
