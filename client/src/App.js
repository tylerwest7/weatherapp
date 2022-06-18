import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import '../src/App.scss';
import lottie from 'lottie-web';
import { useForm, useWatch } from 'react-hook-form';
import PlaceholderCards from './Components/PlaceholderCards';
import CardDetail from './Components/CardDetail';

function App() {

  //Hello world
  
  const apiKey = "8bd04b4c4bc8f493a35b227dba34ae78";

  const [latitude, setLatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);
  const [userLocation, setUserLocation] = useState([]);
  const [weather, setWeather] = useState([]);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customLocation, setCustomLocation] = useState({
    customLatitude: null,
    customLongitude: null
  })
  const [cardDetail, setCardDetail] = useState([]);
  const [cardDetailVisible, setCardDetailVisible] = useState(false);
  const [usingCurrentLocation, setUsingCurrentLocation] =useState(null);
  const [errorState, setErrorState] = useState(true);
  const [animationDestroyed, setAnimationDestroyed] = useState(null);

  const [error, setError] = useState(null);

  //Weather animations
  const sunny = require('../src/svg/sunny.json');
  const snow = require('../src/svg/rainy.json');
  const cloudy = require('../src/svg/cloudy.json');
  const rainy = require('../src/svg/rainy.json');

  //Submit custom data
  const onSubmit = (e) => {
    e.preventDefault();

    const inputData = new FormData(e.target);
    const iLatitude = inputData.get('latitude')
    const iLongitude = inputData.get('longitude');

    const data = {
      inputLatitude: iLatitude,
      inputLongitude: iLongitude
    }

    getCustomLocation(data);
  }

  const container = useRef(null);

  const loaderAnim = () => {
    lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../src/svg/loader.json')
    })
  }

  const sunnyAnim = (card,weather) => {
    lottie.loadAnimation({
      container: card,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: weather
    })
    console.log('loading sunny anim');
  }


    //State changed
    useEffect(() => {
      checkPermissions();
      setLoading(true);
      loaderAnim();
    },[])

////////////////
    function getPosition() {
      // Simple wrapper
      return new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej);
      });
    }

    function main() {
      getPosition().then(console.log('Hello world heres some coordinates')); // wait for getPosition to complete
    }

    main();
/////////////////////////

  //Check for location permissions
  const checkPermissions = () => {


    //Check if browser is safari or chrome
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

    if(isSafari){
      console.log('Browser is safari');
    }else{
      console.log('Browser is chrome');

    navigator.permissions.query({name:'geolocation'}).then(function(result) {
      // Will return ['granted', 'prompt', 'denied']
      console.log(result.state);
      if(result.state === 'granted'){
        getLocation();
      }else{
        console.log('Enable location to use current location');
        const data = {
          latitude: 37.7749,
          longitude: 122.4194
        }
        getWeather(data)
      }
    });
  }
  
  }


 //Get location
 const getLocation = async () => {


  //Safari check locations
  navigator.geolocation.getCurrentPosition(showMap);

  function showMap(position) {
    console.log('Hello');
  }
  /////////

  setLoading(true);
  if(animationDestroyed){
    loaderAnim();
  }

  //Get current location
  await navigator.geolocation.getCurrentPosition((position)=> {
    setLoading(false);
    const currentLocation = position.coords;
    console.log(`https://api.openweathermap.org/data/2.5/onecall?lat=${currentLocation.latitude}&lon=${currentLocation.longitude}&units=imperial&appid=${apiKey}`);
    getWeather(currentLocation);
    setUsingCurrentLocation(true);
  })

 }

  //Get custom location
  const getCustomLocation = async (data) => {
    console.log(data);
    setLoading(true);
    if(animationDestroyed){
      loaderAnim();
    }
    await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.inputLatitude}&lon=${data.inputLongitude}&units=imperial&appid=${apiKey}`)
      .then(response => response.json())
      .then((data) => {
        setLoading(false);

        lottie.destroy();
        setAnimationDestroyed(true);

        setUsingCurrentLocation(false);

        console.log(data);

        //User location
        setUserLocation(data);

        const weatherData = data.daily;
        setWeather(weatherData);

        //Set days
        let newDays = [];
        data.daily.map((day) => {
          let dayInt = new Date(day.dt*1000).toDateString();
          newDays.push(dayInt);
        })

        //Loading set to false
        //setLoading(false);

        setDays(newDays);

        //Add emoji to each day
        data.daily.map((day, index) => {

          const id = day.weather[0].id;

          //Assign
          const card = document.getElementById(`card-image-${index}`)

          //Filter weather and pass animation
          if(id >= 200 && id < 300){
            //Thunderstorm
            const weather = rainy;
            sunnyAnim(card,weather);
          }else if(id >= 300 && id < 400){
            //Drizzle
            const weather = rainy;
            sunnyAnim(card,weather);
          }else if(id >= 300 && id < 400){
            //Rain
            const weather = rainy;
            sunnyAnim(card,weather);
          }else if(id >= 500 && id < 600){
            //Snow
            const weather = snow;
            sunnyAnim(card,weather);
          }else if(id >= 600 && id < 700){
            //Atmosphere
            const weather = cloudy;
            sunnyAnim(card,weather);
          }else if(id === 800){
            //Clear
            const weather = sunny;
            sunnyAnim(card,weather);
          }else if(id > 800){
            //Clouds
            const weather = cloudy;
            sunnyAnim(card,weather);
          }
        })
        
      })
      .catch(function(err){
        setError(true);
        console.log(`${err} sorry cannot display data`);
        setLoading(true);
        setErrorState(false);
      });
   }


  //Get weather
  const getWeather = async (currentLocation) => {
    await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${currentLocation.latitude}&lon=${currentLocation.longitude}&units=imperial&appid=${apiKey}`)
      .then(response => response.json())
      .then((data) => {
        lottie.destroy();
        setAnimationDestroyed(true);



        console.log(data);

        setUsingCurrentLocation(true);

        //User location
        setUserLocation(data);

        //Set coordinates
        setLatitude(currentLocation.latitude);
        setlongitude(currentLocation.longitude);

        const weatherData = data.daily;
        setWeather(weatherData);

        //Set days
        let newDays = [];
        data.daily.map((day) => {
          let dayInt = new Date(day.dt*1000).toDateString();
          newDays.push(dayInt);
        })
        setDays(newDays);

        //Loading set to false
        setLoading(false);

        //Add emoji to each day
        data.daily.map((day, index) => {

          const id = day.weather[0].id;

          //Assign
          const card = document.getElementById(`card-image-${index}`)

          //Filter weather and pass animation
          if(id >= 200 && id < 300){
            //Thunderstorm
            const weather = sunny;
            sunnyAnim(card,weather);
          }else if(id >= 300 && id < 400){
            //Drizzle
            const weather = sunny;
            sunnyAnim(card,weather);
          }else if(id >= 300 && id < 400){
            //Rain
            const weather = sunny;
            sunnyAnim(card,weather);
          }else if(id >= 500 && id < 600){
            //Snow
            const weather = snow;
            sunnyAnim(card,weather);
          }else if(id >= 600 && id < 700){
            //Atmosphere
            const weather = cloudy;
            sunnyAnim(card,weather);
          }else if(id === 800){
            //Clear
            const weather = sunny;
            sunnyAnim(card,weather);
          }else if(id > 800){
            //Clouds
            const weather = cloudy;
            sunnyAnim(card,weather);
          }
        })
      })
      .then(()=>{
        console.log('Weather data displayed');
      })
      .catch(function(err){
        setError(true);
        console.log(`${err} sorry cannot display data`);
        setLoading(true);
        setErrorState(false);
      });
    }

    //Card
    function cardHandler(e, day) {
      e.preventDefault();
      console.log(day);
      setCardDetail(day);
      setCardDetailVisible(true);
    }

    function handleCardClose(){
      console.log('Closing card');
      setCardDetailVisible(false);
    }

    function arrowLeftHandler(){
      console.log("Left tapped");
      const container = document.getElementById("day-card-container");
      container.scrollLeft -= container.scrollWidth;
    }

    function arrowRightHandler(){
      console.log("Right tapped");
      const container = document.getElementById("day-card-container");
      container.scrollLeft = container.scrollWidth;
    }

  return (
    <div id='page-container'>
      <h1 id='footer'>Made with love from the help of Lottie, OpenWeather API, and React - <a id='site-link' href="https://www.tylerwest.co/">Tylerwest.co</a></h1>
      <CardDetail handleCardClose={() => handleCardClose} cardDetailVisible={cardDetailVisible} dailyDetails={cardDetail}/>
      <div id='weather-container'>
      <div id='weather'>
        <div id='loader' ref={container} className={loading ? "loader-state" : ""} ></div>
        <div id='weather-form'>
          {loading ? <h1>Predicting weather for...</h1> : <h1>{userLocation.timezone}</h1>}
          <div id='input'>
            <form onSubmit={(e) => onSubmit(e)}>
              <input name='latitude' type="number" step="any" required="required" id='inputField' placeholder='Latitude'></input>
              <input name='longitude' type="number" step="any" id='inputField' placeholder='longitude'></input>
              <button>Search location</button>
              {usingCurrentLocation ? <button type="button" onClick={() => getLocation()}>{userLocation.timezone}</button> : <button type="button" onClick={() => getLocation()}>Use current location</button>}
            </form>
          </div>
        </div>
        {loading ? <PlaceholderCards errorState={errorState}/> :
        <div id='day-card-container'>
          <div onClick={() => arrowLeftHandler()} id='arrow-left'>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="29.5" fill="#2C2C2C" stroke="white"/><path d="M26.6066 19L37.2132 29.6066L26.6066 40.2132" stroke="white"/></svg>
          </div>
          <div id='arrow-right' onClick={() => arrowRightHandler()}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="29.5" fill="#2C2C2C" stroke="white"/><path d="M26.6066 19L37.2132 29.6066L26.6066 40.2132" stroke="white"/></svg>
          </div>
          {userLocation.daily?.map((day,index) => (
          <div id='day-card' key={index} onClick={(e) => cardHandler(e, day)}>
              <div className='card-image' id={`card-image-${index}`}></div>
              <h3 id='weather-text'>{day.weather[0].main}</h3>
              <h2 id='day-text'>{moment.unix(day.dt).format("dddd MM/DD")}</h2>
              <ul id='weather-list'>
                <li>
                  <h4 id='list-sub'>Day</h4>
                  <h4 id='list-header'>{day.temp.day}</h4>
                </li>
                <li>
                  <h4 id='list-sub'>Morning</h4>
                  <h4 id='list-header'>{day.temp.morn}</h4>
                </li>
                <li>
                  <h4 id='list-sub'>Evening</h4>
                  <h4 id='list-header'>{day.temp.eve}</h4>
                </li>
                <li>
                  <h4 id='list-sub'>Night</h4>
                  <h4 id='list-header'>{day.temp.night}</h4>
                </li>
              </ul>
            </div>
        ))}</div>}
      </div>
      </div>
    </div>
  );
}

export default App;
