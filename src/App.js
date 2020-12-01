import React, { useMemo } from 'react'

// Hooks
import useFetch from './hooks/useFetch'

// Services
import openWeatherApi from './services/weatherApi'

// Components
import { Form, Info } from './components'

import "./App.css";

const App = () => {
  const [fetchState, fetch] = useFetch(openWeatherApi)

  const datum = useMemo(() => {
    if (fetchState.status === 'fetched') {
      const { main, name, sys, weather } = fetchState.data

      const country = sys != null ? sys.country : null
      const humidity = main != null ? main.humidity : null
      const temperature = main != null ? main.temp : null
      const description = weather != null && weather.length > 0 ? weather[0].description || null : null

      const location = country != null ? `${name}, ${country}` : name

      return {
        location,
        humidity,
        temperature,
        description
      }
    }

    return {
      location: null,
      temperature: null,
      humidity: null,
      description: null
    }
  }, [fetchState.data, fetchState.status])

  const onSubmit = ({ city, country }) => fetch({ country, city })

  return <div className="wrapper">
    <div className="main">
      <div className="container-fluid">
        <div className="row">
          <div className="col-5 title-container">
            <div>
              <h1 className="title-container__title">Weather Finder</h1>
              <h3 className="title-container__subtitle">
                Find out temperature, conditions and more...
            </h3>
            </div>
          </div>
          <div className="col-7 form-container">
            <Form working={fetchState.status === 'fetching'} onSubmit={onSubmit} />

            <div className="weather__info">
              <Info datum={datum.location}>Location: </Info>
              <Info datum={datum.temperature}>Temperature: </Info>
              <Info datum={datum.humidity}>Humidity: </Info>
              <Info datum={datum.description}>Description: </Info>


              {fetchState.status === 'errored' && (
                <p className="weather__error">{fetchState.error.message}</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
}

export default App