import { Link } from 'react-router-dom'
import Logo from '../assets/Logo.png'
import {ReactTyped} from 'react-typed'

const Welcome = () => {
  return (
    <div className="d-flex justify-content-center flex-column align-items-center vh-100">
        <div className="d-flex flex-column align-items-center">
            <img src={Logo} alt="logo" className='mb-4' style={{width: "150px", height:"150px",filter: "drop-shadow(0px 1px 5px rgba(0,0,0,0.20))"}}/>
            <h1 className="mb-4 fs-2">Seja bem-vindo ao Seu Zé IA!</h1>
            <h3 className='mb-5 fs-4 fw-normal text-center'>Seu agente de IA para automatizar <ReactTyped
            strings={['seu agendamento', 'seus horários', 'seu trabalho', 'sua gestão','sua barbearia']}
            typeSpeed={60}
            backSpeed={60}
            /></h3>
        </div>
        <div className="d-flex justify-content-center align-items-center w-100">
            <Link to="/entrar" className="btn btn-primary mx-2">Entrar</Link>
            <Link to="/cadastrar" className="btn btn-success">Cadastrar-se</Link>
        </div>     
    </div>
  )
}

export default Welcome