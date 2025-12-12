import {Menu,User,Calendar,Clock3, Users, Scissors} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Logo from '../assets/logo.png'

const Header = () => {
  return (
    <header className='navbar bg-body-tertiary shadow-sm px-3 px-lg-5 d-flex justify-content-between align-items-center'>
        <button className='btn btn-light' data-bs-toggle="offcanvas" data-bs-target="#offcanvas"><Menu size={25}/></button>
        <h1 className='fs-3 m-0'>Seu Zé IA <Scissors size={25}/></h1>
        <nav className='offcanvas offcanvas-start w-75' tabIndex="-1" id="offcanvas" aria-label='offcanvas'>
            <div className='offcanvas-header'>
                <img src={Logo} alt="logo" width="70px" height="70px"/>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className='offcanvas-body p-0'>
                <ul className='d-flex flex-column w-100 p-0 border-top mt-3 gap-2 pt-3'>
                    <NavLink className={({isActive})=>`btn btn-outline-light w-100 text-body border-0 d-flex align-items-center gap-3 fs-5 ${isActive ? 'bg-light' : ''}`} to="/conta"><User size={25} fontWeight={5}/> Conta</NavLink>
                    <NavLink className={({isActive})=>`btn btn-outline-light w-100 text-body border-0 d-flex align-items-center gap-3 fs-5 ${isActive ? 'bg-light' : ''}`} to="/home"><Calendar size={23}/> Agenda</NavLink>
                    <NavLink className={({isActive})=>`btn btn-outline-light w-100 text-body border-0 d-flex align-items-center gap-3 fs-5 ${isActive ? 'bg-light' : ''}`} to="/horarios"><Clock3 size={25}/> Horários</NavLink>
                    <NavLink className={({isActive})=>`btn btn-outline-light w-100 text-body border-0 d-flex align-items-center gap-3 fs-5 ${isActive ? 'bg-light' : ''}`} to="/clientes"><Users size={25}/> Clientes</NavLink>
                </ul>
            </div>
        </nav>
    </header>
  )
}

export default Header