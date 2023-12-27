import React, { useState, useCallback,useEffect } from 'react';
import { StyleSheet, 
Text,
View,
ImageBackground, 
StatusBar,
TouchableOpacity,
TextInput,
Image,
SafeAreaView,
ScrollView,
KeyboardAvoidingView,
Platform } from 'react-native';
import { debounce } from 'lodash';
import { theme } from '../../../theme';
import { fetchLocations, fetchWeatherForecast } from '../../../api/ApiWeather';
import { weatherImages } from '../../../constants';
import * as Progress from 'react-native-progress';
import { getData, storeData } from '../../../utils/asyncStorage';


export default function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({})
  const [loading,setLoading] = useState (true)


  const toggleSearch = (value) => {
    setShowSearch(value);
  };

const handleLocation = loc=>{
// console.log('location:',loc);
setLoading(false)
setLocations([]);
toggleSearch(false);
fetchWeatherForecast({
cityName: loc.name,
days: '7'
}).then(data=>{
  setWeather(data);
  console.log('got forecast:',data  );
  storeData('city',loc.name)
})}


  const handleSearch = (value) => {
    // ＷＡＫＥ ＵＰ！！！！！！
    
if (value.length>2){
  fetchLocations({cityName:value}).then(data=>{
    setLocations(data)
  })
}

  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 500), []);
  const {location, current} = weather;
  


  useEffect(()=>{
    fetchMyWeatherData();
  },[]);
  
  const fetchMyWeatherData= async ()=>{
    let myCity=await getData('city')
let cityName ='Bekasi'
if (myCity) cityName=myCity
    fetchWeatherForecast({
cityName,
days: '7'
}).then(data=>{
  setWeather(data)
  setLoading(false)
})
  }

  return (
    <View style={{flex:1, position:"relative"}}>
      <StatusBar style="light" />
      <Image source={require("../Image+Icon/RainForest.jpg")} 
      style={{flex:1,width:'100%',height:'100%',position:'absolute'}} />
        {
          loading? (
            <View 
            style={{  flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',}}
            >
              <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
            </View>
          ):(
            <SafeAreaView style={{flex: 1,}}>
              {/* search section */}
              <View style={{height: '7%',marginHorizontal: 4, position: 'relative', zIndex: 50, }} >
                <View 
                  
                  style={{backgroundColor: showSearch? theme.bgWhite(0.2): 'transparent',
                  flexDirection: 'row', 
                  justifyContent: 'flex-end', 
                  alignItems: 'center', 
                  borderRadius: 999, 
                  }}
                  >
                  
                    {
                      showSearch? (
                        <TextInput 
                          onChangeText={handleTextDebounce} 
                          placeholder="Search city" 
                          placeholderTextColor={'lightgray'} 
                        style={{ paddingLeft: 6, height: 10, paddingBottom: 1,flex: 1, }}
                        />
                      ):null}
                      
                    <TouchableOpacity 
                      onPress={()=> toggleSearch(!showSearch)} 
                      
                      style={{backgroundColor: theme.bgWhite(0.3),  borderRadius: 999,  padding: 3, margin: 1, }}>
                      {
                        showSearch? (
                          <Image source={require("../image+icon/XmarkIcon.png")} 
                          style={{height:25, width:25 }}/>
                        ):(
                          <Image style={{width:25, height:25, tintColor:'white'}}
                          source={require("../image+icon/magnifying-glass.png")}
                          />
                        )
                      }
                      
                  </TouchableOpacity>
                </View>
                {
                  locations.length>0 && showSearch?(
                    <View style={{
                      position: 'absolute',
                      width: '100%',
                      backgroundColor: '#ccc',
                      top: 16,
                      borderRadius: 20,
                    }}>
                      {
                        locations.map((loc, index)=>{
                          let showBorder = index+1 != locations.length;
                          let borderClass = showBorder?  { borderBottomWidth: 2, borderBottomColor: '#ccc' }
                          : null
                          return (
                            <TouchableOpacity
                            key={index}
                            onPress={() => handleLocation(loc)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              borderWidth: 0,
                              padding: 3,
                              paddingHorizontal: 4,
                              marginBottom: 1,
                              ...borderClass, 
                            }}
                          >
                            <Image style={{ width: 20, height: 20 }} source={require("../image+icon/pin.png")} />
                            <Text 
                            style={{ color: 'black', fontSize: 16, marginLeft: 8 }}
                            >
                              {loc?.name}, {loc?.country}
                            </Text>
                          </TouchableOpacity>
                          )
                        })
                      } borderBottomWidth: 2, borderBottomColor: '#ccc',:'';
                    </View>
                  ):null
                }
                
              </View>

              {/* forecast section */}
              <View style={{ marginHorizontal: 4,
      flexDirection: 'row',
      justifyContent: 'space-around',
      flex: 1,
      marginBottom: 2,}}>
                {/* location */}
                <Text style={{ color: 'white',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',}}>
                  {location?.name}, 
                  <Text style={{
        fontSize: 18, 
        fontWeight: '600', 
        color: '#ccc', 
      }}>{location?.country}</Text>
                </Text>
                {/* weather icon */}
                <View style={{   flexDirection: 'row', justifyContent: 'center', }}>
                  <Image 
                    // source={{uri: 'https:'+current?.condition?.icon}} 
                    source={weatherImages[current?.condition?.text || 'other']} 
                    style={{width: 52, 
                    height: 52, 
                  }} />
                  
                </View>
                {/* degree celcius */}
                <View style={{
                   width: '100%',
                   height: 50,
                   backgroundColor: 'blue', 
                   marginBottom: 2, 
                }}>
                    <Text  style={{  fontWeight: 'bold', color: 'white', fontSize: 48, marginLeft: 5,textAlign:'center'}}>
                      {current?.temp_c}&#176;
                    </Text>
                    <Text style={{
                     textAlign: 'center', 
                     color: 'white', 
                     fontSize: 18, 
                     letterSpacing: 2, 
                    }}>
                      {current?.condition?.text}
                    </Text>
                </View>

                {/* other stats */}
                <View style={{
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    marginHorizontal: 4, 
 }}>
                  <View style={{
                       flexDirection: 'row', 
                       alignItems: 'center', 
                       justifyContent: 'space-between', 
                       marginHorizontal: 2, 
                  }}>
                    <Image source={require('../image+icon/wind.png')} style={{
                        width: 24, 
                        height: 24, 
                    }} />
                    <Text style={{
                       color: 'white', 
                       fontWeight: '600',
                       fontSize: 16, 
                    }}>{current?.wind_kph}km</Text>
                  </View>
                  <View style={{
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      marginHorizontal: 2, 
                  }}>
                    <Image source={require('../image+icon/drop.png')} style={{
                          width: 24, 
                          height: 24, 
                      
                    }} />
                    <Text style={{
                       color: 'white', 
                       fontWeight: '600', 
                       fontSize: 16, 
                    }}>{current?.humidity}%</Text>
                  </View>
                  <View style={{
                       flexDirection: 'row', 
                       alignItems: 'center', 
                       marginHorizontal: 2,
                  }}>
                    <Image source={require('../image+icon/sun.png')} style={{
                      width: 24, 
                      height: 24, 
                    }} />
                    <Text style={{
                       color: 'white', 
                       fontWeight: '600', 
                       fontSize: 16, 
                    }}>
                      { weather?.forecast?.forecastday[0]?.astro?.sunrise }
                    </Text>
                  </View>
                  
                </View>
              </View>

              {/* forecast for next days */}
              <View style={{
                marginBottom: 2, // mb-2
                paddingVertical: 3,
              }}/>
                <View style={{
                      flexDirection: 'row', // flex-row
                      alignItems: 'center', // items-center
                      marginHorizontal: 5, // mx-5
                      justifyContent: 'space-between', // space-x-2: gunakan justifyContent dengan space-between untuk mencapai efek space-x-2
                  
                }}>
                <Image style={{width:22, height:22, tintColor:'white'}} source={require("../image+icon/calendar.png")}/>
                  <Text style={{
                      color: 'white', // text-white
                      fontSize: 16, // text-base
                  }}>Daily forecast</Text>
                </View>
                <ScrollView   
                  horizontal
                  contentContainerStyle={{paddingHorizontal: 15}}
                  showsHorizontalScrollIndicator={false}
                >
                  {
                    weather?.forecast?.forecastday?.map((item,index)=>{
                      const date = new Date(item.date);
                      const options = { weekday: 'long' };
                      let dayName = date.toLocaleDateString('en-US', options);
                      dayName = dayName.split(',')[0];

                      return (
                        <View 
                          key={index} 
                          style={{backgroundColor: theme.bgWhite(0.15),
                            flexDirection: 'row', // flex
                            justifyContent: 'center', // justify-center
                            alignItems: 'center', // items-center
                            width: 96, // w-24
                            borderRadius: 12, // rounded-3xl: dihitung berdasarkan w-24
                            paddingVertical: 9, // py-3: dihitung berdasarkan w-24
                            paddingHorizontal: 0, // space-y-1: dihitung berdasarkan w-24
                            marginRight: 4, // mr-4
                          }}
                        >
                          <Image 
                            // source={{uri: 'https:'+item?.day?.condition?.icon}}
                            source={weatherImages[item?.day?.condition?.text || 'other']}
                              style={{ width: 44, height: 44}}/>
                          <Text style={{ color: 'white' }}>{dayName}</Text>
                          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                            {item?.day?.avgtemp_c}&#176;
                          </Text>
                        </View>
                      )
                    })
                  }
                  
                </ScrollView>
              </View>
              
            
            </SafeAreaView>
          )
        }
      
    </View>

)}



