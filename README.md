# React Native Circular Carousel

Circular Carousel for use on iOS and Android.

![Demo](./demo.gif)

## Installation

Open a Terminal in your project's folder and run,

```sh

yarn add react-native-circular-carousel
					or
npm install --save react-native-circular-carousel

```

## Usage

```js

import CircularCarousel from  'react-native-circular-carousel';

const dataSource = [
  {name: 'Ahmed'},
  {name: 'Ali'},
  {name: 'Umar'},
  {name: 'Bilal'}
]

<CircularCarousel
	style={{ width: 350 }}
	dataSource={dataSource}
	renderItem={(data) => <CarouselItem data={data} />}
	onItemPress={handleItemPress}
/>;

```

## Props

| Prop           | Type                            | Description                                                                     |
| -------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| dataSource\*   | Array                           | Items datasource                                                                |
| dropAreaLayout | Object: { height, width, x, y } | Layout of component where carousel items are going to be dropped                |
| renderItem     | (data) => Component             | Render a single carousel item component                                         |
| onItemPress    | (index) => void                 | This handler function is called when front carousel item is tapped.             |
| onItemDrop     | (index) => void                 | This handler function is called when carousel item is dropped upon Drop Area.   |
| style          | Object: { width, height }       | Styles given to container component. Default: { width: 350, height: 200 }       |
| itemStyle      | Object: { width, height }       | Styles given to a carousel item component. Default: { width: 110, height: 120 } |

\*\*Provide correct styles as these are used in arranging items in circle.

#### Thanks to contributors:

- [Shamshad Khan](https://github.com/khanshamshad32)
- [Umar Ashfaq](https://github.com/umarashfaq)
- [Asad Ullah](https://github.com/asadUllah58) for creating a beautiful demo
