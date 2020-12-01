import React from 'react'

const Info = ({ datum, children }) => {
  return datum == null ? null : <p className="weather__key">
    {children}
    <span className="weather__value" data-testid="info-datum">
      {datum}
    </span>
  </p>
}

export default Info