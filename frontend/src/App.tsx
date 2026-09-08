import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Navigation from './components/Navigation/Navigation'
import { TextInput } from '@cfa/react-core'
import { Table } from '@cfa/system-icons'
import TableDisplay from './components/TableDisplay'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <h1>   </h1>
        <h2>Messaging Board</h2>
      </section>
      <TableDisplay />
      <Navigation />
    </>
  )
}

export default App
