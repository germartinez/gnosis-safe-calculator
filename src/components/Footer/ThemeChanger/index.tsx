import React, { useState, useEffect } from 'react'
import { FiSun } from 'react-icons/fi'
import { FiMoon } from 'react-icons/fi'
import './styles.scss'

const ThemeChanger = () => {
  const [themeState, setThemeState] = useState(false)

  useEffect(() => {
    const getTheme = localStorage.getItem('safe-calculator-theme')
    if (getTheme === 'dark') {
      setThemeState(true)
    }
  }, [])

  useEffect(() => {
    if (themeState) {
      localStorage.setItem('safe-calculator-theme', 'dark')
      document.body.classList.add('dark-mode')
    } else {
      localStorage.setItem('safe-calculator-theme', 'light')
      document.body.classList.remove('dark-mode')
    }
  }, [themeState])

  return (
    <div className="themeChanger" onClick={() => setThemeState(!themeState)}>
      {themeState ? (
        <FiSun color="white" size="40px" />
      ) : (
        <FiMoon color="black" size="40px" />
      )}
    </div>
  )
}

export default ThemeChanger
