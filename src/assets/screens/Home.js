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
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image 
        blurRadius={5} 
        source={require('../image+icon/RainForest.jpg')} 
        className="absolute w-full h-full" />
        {
          loading? (
            <View className="flex-1 flex-row justify-center items-center">
              <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
            </View>
          ):(
            <SafeAreaView className="flex flex-1">
              {/* search section */}
              <View style={{height: '7%'}} className="mx-4 relative z-50">
                <View 
                  className="flex-row justify-end items-center rounded-full" 
                  style={{backgroundColor: showSearch? theme.bgWhite(0.2): 'transparent'}}>
                  
                    {
                      showSearch? (
                        <TextInput 
                          onChangeText={handleTextDebounce} 
                          placeholder="Search city" 
                          placeholderTextColor={'lightgray'} 
                          className="pl-6 h-10 pb-1 flex-1 text-base text-white" 
                        />
                      ):null}
                      
                    <TouchableOpacity 
                      onPress={()=> toggleSearch(!showSearch)} 
                      className="rounded-full p-3 m-1" 
                      style={{backgroundColor: theme.bgWhite(0.3)}}>
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
                    <View className="absolute w-full bg-gray-300 top-16 rounded-3xl ">
                      {
                        locations.map((loc, index)=>{
                          let showBorder = index+1 != locations.length;
                          let borderClass = showBorder? ' border-b-2 border-b-gray-400':'';
                          return (
                            <TouchableOpacity 
                              key={index}
                              onPress={()=> handleLocation(loc)} 
                              className={"flex-row items-center border-0 p-3 px-4 mb-1 "+borderClass}>
                                <Image style={{width:20, height:20}} source={require("../image+icon/pin.png")}/>
                                <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                            </TouchableOpacity>
                          )
                        })
                      }
                    </View>
                  ):null
                }
                
              </View>

              {/* forecast section */}
              <View className="mx-4 flex justify-around flex-1 mb-2">
                {/* location */}
                <Text className="text-white text-center text-2xl font-bold">
                  {location?.name}, 
                  <Text className="text-lg font-semibold text-gray-300">{location?.country}</Text>
                </Text>
                {/* weather icon */}
                <View className="flex-row justify-center">
                  <Image 
                    // source={{uri: 'https:'+current?.condition?.icon}} 
                    source={weatherImages[current?.condition?.text || 'other']} 
                    className="w-52 h-52" />
                  
                </View>
                {/* degree celcius */}
                <View className="space-y-2">
                    <Text className="text-center font-bold text-white text-6xl ml-5">
                      {current?.temp_c}&#176;
                    </Text>
                    <Text className="text-center text-white text-xl tracking-widest">
                      {current?.condition?.text}
                    </Text>
                </View>

                {/* other stats */}
                <View className="flex-row justify-between mx-4">
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../image+icon/wind.png')} className="w-6 h-6" />
                    <Text className="text-white font-semibold text-base">{current?.wind_kph}km</Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../image+icon/drop.png')} className="w-6 h-6" />
                    <Text className="text-white font-semibold text-base">{current?.humidity}%</Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../image+icon/sun.png')} className="w-6 h-6" />
                    <Text className="text-white font-semibold text-base">
                      { weather?.forecast?.forecastday[0]?.astro?.sunrise }
                    </Text>
                  </View>
                  
                </View>
              </View>

              {/* forecast for next days */}
              <View className="mb-2 space-y-3">
                <View className="flex-row items-center mx-5 space-x-2">
                <Image style={{width:22, height:22, tintColor:'white'}} source={require("../image+icon/calendar.png")}/>
                  <Text className="text-white text-base">Daily forecast</Text>
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
                          className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4" 
                          style={{backgroundColor: theme.bgWhite(0.15)}}
                        >
                          <Image 
                            // source={{uri: 'https:'+item?.day?.condition?.icon}}
                            source={weatherImages[item?.day?.condition?.text || 'other']}
                              className="w-11 h-11" />
                          <Text className="text-white">{dayName}</Text>
                          <Text className="text-white text-xl font-semibold">
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








    
//     <View style={{ flex: 1 }}>
//        <StatusBar barStyle="dark-content" />

//        {

//         loading?(
// <View className=" flex-1 flex-row justify-center items-center">
// <Progress.CircleSnail thickness={10} size={140} color={['red', 'green', 'blue']} />
// </View>
//         ):(
        

// <ImageBackground 
// source={require("../image+icon/bg.png")}
//  className="absolute w-full h-full"
// blurRadius={60}
// >

// <View style={{ height: 50, marginHorizontal: 20, marginTop: 20 }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', borderRadius: showSearch ? 25 : 0, backgroundColor: showSearch ? 'rgba(255, 255, 255, 0.2)' : 'transparent' }}>
//             {showSearch ? (
//               <TextInput
//                 onChangeText={handleTextDebounce}
//                 placeholder="Search city"
//                 placeholderTextColor={'lightgray'}
//                 style={{ flex: 1, fontSize: 16, color:"white", marginLeft: 10, fontWeight: 'bold' }}
//                 />

//             ) : null}
//             <TouchableOpacity
//               onPress={() => toggleSearch(!showSearch)}
//               style={{
//                 borderRadius: 25,
//                 padding: 12,
//                 margin: 4,
//                 backgroundColor: showSearch ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
//               }}
              
//             >

//               {/* Menggunakan gambar lokal sebagai ikon */}
//               <Image style={{ width: 25, height: 25, tintColor: 'white' }} source={require("../image+icon/magnifying-glass.png")} />
//             </TouchableOpacity>
//           </View>
// </View>

// <View style={{ marginHorizontal: 4, justifyContent: 'space-around', flex: 1, marginBottom: 2, }}>
//   <View style={{top:20}}>
//              <Text style={{ color: 'white', textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>
//              {location?.name},
//           <Text style={{ fontSize: 16, fontWeight: '600', color: 'lightgray' }}> 
//           {"".location?.country}

//           </Text>
//           </Text>                                                                                                                                                                         


//           </View>
//           {/* <weater image/> */}
//           <View className="flex-row justify-center">
//             <Image source={weatherImages[current?.condition?.text]}
//             className="w-52 h-52"
//             />
//           </View>
//           {/* <Degrees/> */}
//           <View className=" space-y-2">  
// {/* Someone To You */}

//           {
// locations.length>0 && showSearch?(
// <View className="absolute w-full bg-gray-300   rounded-3xl " style={{flex:1,bottom:230}}>
// {
// locations.map((loc,index)=>{

// let showBorder= index+1 != locations.length;
// let borderClass= showBorder? 'border-b-2 border-b-grey-400':''

//   return(
//     <TouchableOpacity
//     key={index}
//     className={"flex-row items-center border-0 p-3 px-4 mb-2 "+borderClass}
//     onPress={()=> handleLocation(loc)}
//     >


//       <Image style={{width:25,height:25,tintColor:"gray"}} source={require('../image+icon/pin.png')}/>
//       <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
      
//     </TouchableOpacity>
//   )
// })
// }
// </View>
// ):null} 
// {/* Someone To You */}

// <Text className="text-center font-bold text-white text-6xl ml-5">
//   {current?.temp_c}&#176;
//   </Text>
// <Text className="text-center  text-white text-xl tracking-widest">
//   {current?.condition?.text}
//   </Text>

//           </View>
//           {/* Other fucking stats/> */}
//           <View className="flex-row justify-between mx-4">
            
// <View className="flex-row space--x-2 items-center">
// <Image source={require("../image+icon/wind.png")} className="h-6 w-6" />

// <Text className="text-white font-semibold text-base">
// {current?.wind_kph}Km
// </Text>

// </View>

// <View className="flex-row space--x-2 items-center">
// <Image source={require("../image+icon/drop.png")} className="h-6 w-6" />

// <Text className="text-white font-semibold text-base">
// {current?.humidity}%
// </Text>

// </View>

// <View className="flex-row space--x-2 items-center">
// <Image source={require("../image+icon/sun.png")} className="h-6 w-6" />

// <Text className="text-white font-semibold text-base">
// { weather?.forecast?.forecastday[0]?.astro?.sunrise  }


// </Text>

// </View>
//  </View>

// <View className="mb-1 space-y-3 ">

// <View className="flex-row items-center   mx-5  space-x-2">
// <Image style={{width:22,height:22,tintColor:'white'}} source={require("../image+icon/calendar.png")}/>
// <Text className=" text-white text-base"> Ｄａｉｌｙ Ｆｏｒｅｃａｓｔ</Text>
// </View>


// <ScrollView
// horizontal
// contentContainerStyle={{paddingHorizontal:15}}
// showsHorizontalScrollIndicator={false}
// >
// {/*  */}


// {
//   weather?.forecast?.forecastday?.map((item, index)=>{
// let date = new Date(item.date)
// let options = {weekday: `long`}
// let dayname = date.toLocaleDateString('en-Us',options)
// dayname= dayname.split(',') [0]


//     return(
//       <View className=" flex  justify-center items-center  w-24   rounded-3xl py-3 space-y-1 mr-4"
//       style={{backgroundColor: theme.bgWhite(0.15)}}
//       key={index}
//       >
//     <Image  source={weatherImages[item?.day?.condition?.text]}
//      className="w-11 h-11"
//     />
    
//     <Text className="text-white">{dayname}</Text>

//     <Text className=" text-white font-semibold text-xl">
//       {item?.day?.avgtemp_c}&#176;
//       </Text>
//       </View>
//     )
//   })
// }

 
  
// </ScrollView>
// </View>
// </View>
// </ImageBackground>
//   )
// }
//     </View>
    // </KeyboardAvoidingView>
  );
}


