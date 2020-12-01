const { REACT_APP_OPENWEATHERMAP_API_KEY } = process.env;

const apiClient = async ({ city, country }) => {
  try {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${REACT_APP_OPENWEATHERMAP_API_KEY}&units=metric`);
    const json = await response.json();
    if (response.ok) {
      return json;
    }

    return Promise.reject(json);
  } catch (e) {
    return {
      message: 'Unkonwn error'
    }
  }
};

export default apiClient