import React from 'react'
import { ReactDOM } from 'react'
import AgencyLogo from './components/AgencyLogo'
import Banner from './components/Banner'
import Greeting from './components/Greeting'
import RegistrationForm from './components/RegistrationForm'
import Footer from './components/Footer'
import "../src/stylesheets/App.css"
export default function App() {
  return (
    <div>
      <AgencyLogo />
      <Banner />
      <Greeting />
      <RegistrationForm />
      <Footer />
    </div>

  )
}