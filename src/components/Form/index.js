import React, { useReducer } from 'react'

const initialState = {
  city: 'Madrid',
  country: 'es'
}

const ACTIONS = {
  change: 'change'
}

const Form = ({ onSubmit, working = false }) => {

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case ACTIONS.change:
        return {
          ...state,
          [action.field]: action.value
        }

      default:
        return state
    }
  }, initialState)

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (onSubmit != null) {
      onSubmit(state)
    }
  }

  return <form onSubmit={onSubmitHandler}>
    <input type="text" name="city" placeholder="Madrid" onChange={e => dispatch({ type: 'change', field: 'city', value: e.target.value })} data-testid="city-field" />
    <input type="text" name="country" placeholder="es" onChange={e => dispatch({ type: 'change', field: 'country', value: e.target.value })} data-testid="country-field" />
    <button disabled={working}>Get Weather</button>
  </form>
}

export default Form