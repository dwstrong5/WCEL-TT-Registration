import React from 'react'
import { ReactDOM } from 'react'
import Banner from './components/Banner'
import Greeting from './components/Greeting'
import RegistrationForm from './components/RegistrationForm'

export default function App() {
  return (
    <div>
      <Banner />
      <Greeting />
      <RegistrationForm />
    </div>

  )
}