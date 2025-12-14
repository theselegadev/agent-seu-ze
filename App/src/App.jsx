import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Welcome from './pages/welcome.jsx'
import Cadaster from './pages/Cadaster.jsx'
import Enter from './pages/Enter.jsx'
import  Home  from './pages/Home.jsx'
import Account from './pages/Account.jsx'
import Hours from './pages/Hours.jsx'
import Clients from './pages/Clients.jsx'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Welcome/>} />
          <Route path='/cadastrar' element={<Cadaster/>} />
          <Route path='/entrar' element={<Enter/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/conta' element={<Account/>}/>
          <Route path='/horarios' element={<Hours/>}/>
          <Route path='/clientes' element={<Clients/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
