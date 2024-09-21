import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import React, { useState, useEffect, useMemo } from 'react';
import { getMoment } from './utils/helpers';
import WeatherCard from './views/WeatherCard';
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherSetting from './components/WeatherSetting';
import { findLocation } from './utils/helpers';

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({theme}) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const API_KEY = process.env.REACT_APP_CWB_API_AUTH_KEY

const App = () => {
  const storageCity = localStorage.getItem('cityName') || '臺北市';
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [currentCity, setCurrentCity] = useState(storageCity);
  const currentLocation = useMemo(() => findLocation(currentCity), [
    currentCity,
  ]);
  const { cityName, locationName, sunriseCityName } = currentLocation;
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  const [weatherElement, fetchData] = useWeatherAPI({
    locationName: locationName,
    cityName: cityName,
    authorizationKey: API_KEY,
  });
  const [currentPage, setCurrentPage] = useState('WeatherCard');

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light': 'dark');
  },[moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && 
        <WeatherCard
          cityName={cityName}
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
          handleCurrentPageChange={handleCurrentPageChange}/>}
        {currentPage === 'WeatherSetting' && 
        <WeatherSetting 
        cityName={cityName}
        handleCurrentPageChange={handleCurrentPageChange}
        handleCurrentCityChange={handleCurrentCityChange}/>}
      </Container>
    </ThemeProvider>
  );
};

export default App;