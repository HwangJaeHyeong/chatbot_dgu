import { MainPage } from 'pages/Main'
import { FC, useEffect, useState } from 'react'
import './style.css'

type TempPageProps = {
  className?: string
}

type ChatBotDisplayType = 'MEDICAL_CHATBOT' | 'DAILY_LIFE_CHATBOT'

export const TempPage: FC<TempPageProps> = ({ className }) => {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [weather, setWeather] = useState({ temp: '', description: '' })
  const [displayType, setDisplayType] = useState<ChatBotDisplayType>('MEDICAL_CHATBOT')

  const fetchWeatherData = async () => {
    const apiKey = 'f1cef7b165c88799efea5d7fb5b458d7'
    const city = 'Seoul'
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},kr&APPID=${apiKey}&units=metric`

    try {
      const response = await fetch(url)
      const data = await response.json()
      setWeather({
        temp: `${data.main.temp.toFixed(1)}°Celcius`,
        description: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1), // Capitalize the first letter
      })
    } catch (error) {
      console.error('Error fetching weather data: ', error)
    }
  }

  const [showMenu, setShowMenu] = useState(false)

  const toggleMenu = () => {
    setShowMenu(!showMenu)
    return
  }

  const onClickButtonMedicalChatBot = () => {
    setDisplayType('MEDICAL_CHATBOT')
    setShowMenu(false)
    return
  }

  const onClickButtonDailyLifeChatBot = () => {
    setDisplayType('DAILY_LIFE_CHATBOT')
    setShowMenu(false)
    return
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setDate(now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })) // Format the date as "26 March 2024"
    }, 1000)

    fetchWeatherData()

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`${className} App`}>
      <div className="App-header">
        <div className="time">{time}</div>
        <div className="date">{date}</div>
        <div className="weather">
          <div className="temperature">{weather.temp}</div>
          <div className="description">{weather.description}</div>
        </div>
        {displayType === 'DAILY_LIFE_CHATBOT' && <MainPage />}
      </div>
      <div className="bottom-left" onClick={toggleMenu}>
        ITRC-DGU
      </div>
      {showMenu && (
        <div className="menu">
          <div className="menu-item" onClick={onClickButtonMedicalChatBot}>
            Medical ChatBot
          </div>
          <div className="menu-item" onClick={onClickButtonDailyLifeChatBot}>
            Daily Life Chatbot
          </div>
        </div>
      )}
    </div>
  )
}
