import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Welcome from './pages/welcome.jsx'
import Cadaster from './pages/Cadaster.jsx'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Welcome/>} />
          <Route path='/cadastrar' element={<Cadaster/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
