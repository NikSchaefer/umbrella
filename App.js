import React, { useState } from 'react';
import { TouchableOpacity, Button, Image, StyleSheet, Text, View, TextInput } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import * as Location from 'expo-location';
import * as BackgroundFetch  from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';


export default function App() {

  function kToF(value) { // kelvin to fahrinheit
    return (value - 273.15) * 9 / 5 + 32;
  }

  const weatherEmojis = ['☁️', '❄️', '🌧️', '🌩️', '☀️', '🌫️']
  const [displayEmoji, setDisplayEmoji] = useState('') 

  const [city, setCity] = useState('Minneapolis, mn, us');


  const [weatherType, setweatherType] = useState('');
  const [degrees, setdegrees] = useState('');
  const [mindegrees, setmindegrees] = useState('');
  const [maxdegrees, setmaxdegrees] = useState('');


  const [humidity, setHumidity] = useState('');
  const [wind, setWind] = useState('');

  const key = 'd7c3d924d2d80ad96c29dd924a218873';

  const refresh = () => { // Calls API

    const warn = () => { //sends notification to bring umbrella
      //TODO noti for umbrella
    }
    var cityID = city;
    cityID = cityID.split(" ").join("")
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + cityID + '&APPID=' + key)
      .then(function (resp) { return resp.json() }) // Convert data to json
      .then(function (data) {

        setweatherType(data.weather[0].description)
        setWind(data.wind.speed)
        setHumidity(data.main.humidity)

        setdegrees(Math.round(kToF(Math.round(data.main.temp))))
        setmindegrees(Math.round(kToF(Math.round(data.main.temp_min))))
        setmaxdegrees(Math.round(kToF(Math.round(data.main.temp_max))))

        const findDisplayEmoji = () => {
          if (data.weather[0].main === 'Rain') {
            return weatherEmojis[2]
          } else if (data.weather[0].main === 'Thunderstorm') {
            return weatherEmojis[3]
          } else if (data.weather[0].main === 'Drizzle') {
            return weatherEmojis[2]
          } else if (data.weather[0].main === 'Snow') {
            return weatherEmojis[1]
          } else if (data.weather[0].main === 'Clear') {
            return weatherEmojis[4]
          } else if (data.weather[0].main === 'Clouds') {
            return weatherEmojis[0]
          } else { 
            return weatherEmojis[5]
          }
        }
        setDisplayEmoji(findDisplayEmoji())
        if (data.main === 'Rain') { warn() }
        else if (data.main === 'Thunderstorm') { warn() }
      })
      .catch(function () {
        console.log('not found')
      });

  }
  TaskManager.defineTask('task', refresh) // assigning as background task
  BackgroundFetch.registerTaskAsync('task') // running background task

  refresh() // calls on load
  return (
    <View style={styles.container}>

      <LinearGradient
        // Background Linear Gradient
        colors={['#00eaff', '#00daff', '#00eaff']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 180,
        }}
      ></LinearGradient>
      <View style={styles.header}>

        <Text style={styles.headerText}>☂ Umbrella ☂</Text>
      </View>
      <Text style={{ color: 'white', padding: 10 }}>City</Text>
      <TextInput style={styles.input}
        value={city}
        onChangeText={text => setCity(text)}
        placeholder="Minneapolis, mn, us"
        placeholderTextColor="#e0e0e0"
      />
      <Text style={{ fontSize:10, color:'white'}}>
        City, State, Country{"\n"}
      </Text>

      <View style={styles.infoBox}>
        <Text style={{ fontSize: 20, paddingLeft: 50 }}>
          {city}{"\n"}
          {"\n"}
          {weatherType}{"\n"}
          {degrees} °F{"\n"}
          High {mindegrees} °F{"\n"}
          Low {maxdegrees} °F{"\n"}
          {"\n"}{"\n"}
          Humidity: {humidity}%{"\n"}
          Wind: {wind} mph{"\n"}

        </Text>
        <Text style={{ fontSize: 80, padding: 30 }}>{displayEmoji}</Text>
      </View>

      <TouchableOpacity title="Refresh" onPress={refresh} style={styles.butonContainer}>
        <Text style={{
          color: 'white',
          fontWeight: "bold",
          alignSelf: "center",
          textTransform: "uppercase"
        }}>Refresh</Text>
      </TouchableOpacity>


      <View style={styles.footer}>
        <Text style={styles.footerText}>Footer</Text>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',

  },
  infoBox: {
    marginTop: 70,
    display: 'flex',
    flexDirection: 'row',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.74,
    shadowRadius: 13.97,

    elevation: 21,
  },
  header: {
    width: '100%',
    height: '10%',
    position: 'relative',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginBottom: 20,

  },
  headerText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
  },
  input: {
    borderColor: '#fff',
    borderWidth: 1,
    width: '70%',
    textAlign: 'center',
    color: 'white',
  },

  butonContainer: {
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#00eaff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.74,
    shadowRadius: 13.97,

    elevation: 21,

  },


  footer: {
    width: '100%',
    backgroundColor: '#f3f3f3',
    position: 'absolute',
    bottom: 0,
  },
  footerText: {
    padding: 20,
    textAlign: 'center',
    color: 'white'
  },

});
