import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';

const {
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  debug,
  stopClock,
  block,
  concat,
} = Animated;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.elementClock = new Clock(); //component used by the ReAnimated API to track each element's animation
    this.elementCurrent = new Value(0); //initial value for the animated element e.g 1
    this.elementNew = new Value(0); //where you want to move the element's value to e.g 10... so then then u run elementNew it animates from one to ten
    this.elementTrans = this.runTiming(
      // runTiming is a function used to proess the animation basically. receives a buncha arguments lik e below
      this.elementClock, // the element's clock
      this.elementCurrent, // the value to animate from
      this.elementNew, // the value to animate to
      {
        //config object
        duration: 500, // how long the animation should span
        toValue: this.elementNew, //same as above, value to animate to
        easing: Easing.bezier(0.22, 1, 0.36, 1), //easing value which actually needs to be imported from the reanimated library... not the same as the one imported from react-native and its animatef library
      },
    );

    this.elementScaleClock = new Clock();
    this.elementScaleCurrent = new Value(0);
    this.elementScaleNew = new Value(1);
    this.elementScaleTrans = this.runTiming(
      this.elementScaleClock,
      this.elementScaleCurrent,
      this.elementScaleNew,
      {
        duration: 500,
        toValue: this.elementScaleNew,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      },
    );
    //so these go in to the constructor when the componenet is getting intialized
  }

  runTiming(clock, value, dest, config) {
    // this is the run timing function i mentioned earlier...theres also one for spring functions decay funictions etc so u can check the docs for those
    const state = {
      finished: new Value(0),
      position: value,
      time: new Value(0),
      frameTime: new Value(0),
    };

    return block([
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock),
      ]),
      timing(clock, state, config),
      cond(state.finished, debug('stop clock', stopClock(clock))),
      state.position,
    ]);
  }

  elementToTop() {
    //
    this.elementNew.setValue(-500); //this is the exact function used to set new values to animate to but i usually wrap it in a helper method... this way i can usually throw in a bunch of them to run concurrently e.g
    this.elementScaleNew.setValue(2); // so the this other element will also be animated in this same function and u an delay it with settimeout or debouces.
  }

  elementToBottom() {
    this.elementNew.setValue(0);
    this.elementScaleNew.setValue(1);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <StatusBar barStyle="dark-content" />

        <Animated.View
          style={{
            width: 100,
            height: 100,
            position: 'absolute',
            bottom: 0,
            left: 50,
            backgroundColor: '#888',
            transform: [
              {translateY: this.elementTrans},
              {scale: this.elementScaleTrans},
            ], // this is the variable we assign the processed animated values to... so thats more or less all of the setup for the animations. gonna setup the triggers now
          }}></Animated.View>
        <TouchableOpacity
          onPress={() => {
            this.elementToTop(); // trigger to run the animation to move animated element to top
          }}
          style={{
            position: 'absolute',
            top: 150,
            right: 10,

            height: 50,
            paddingHorizontal: 15,
          }}>
          <Text>go up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.elementToBottom(); // trigger to move it to the bottom
          }}
          style={{
            position: 'absolute',
            top: 200,
            right: 10,
            height: 50,
            paddingHorizontal: 15,
          }}>
          <Text>go down</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default App;
