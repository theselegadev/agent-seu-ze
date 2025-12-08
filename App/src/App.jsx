import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Welcome from './pages/welcome.jsx'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Welcome/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
