import React from 'react'
import ThemeChanger from './ThemeChanger'
import { SiGithub } from 'react-icons/si'
import './styles.scss'

const Footer = () => (
  <footer>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/germartinez/gnosis-safe-calculator"
    >
      <SiGithub className="github" />
    </a>
    <ThemeChanger />
  </footer>
)

export default Footer
