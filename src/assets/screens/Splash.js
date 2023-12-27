import React, { useEffect, useRef } from 'react';
import { View, Text, ImageBackground, Animated, StyleSheet, StatusBar, Image } from 'react-native';


const Splash = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadingAnimation = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(progressValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]);

    // const animation = Animated.parallel([loadingAnimation]).start();

    const timeout = setTimeout(() => {
      // navigation.replace("Home"); // Navigasi ke halaman Home setelah 3 detik\
      navigation.navigate("Home")
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [fadeAnim, progressValue, navigation]);

  const widthInterpolate = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        source={require('../image+icon/beautiful-mountains.jpg')}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <Animated.View style={[styles.weatherContainer, { opacity: fadeAnim }]}>
            <Image
              source={require('../image+icon/Berawan.png')}
              style={styles.weatherImage}
            />
            <Text style={styles.appName}>WeatherWise</Text>
          </Animated.View>
          <View style={styles.progressBar}>
            <Animated.View
              style={{
                backgroundColor: '#4facfe',
                height: 10,
                width: widthInterpolate,
              }}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  
  appName: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  progressBar: {
    marginTop: 20,
    width: 200,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default Splash;
