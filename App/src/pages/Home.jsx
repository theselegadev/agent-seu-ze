import { useEffect, useState } from "react"
import Header from "../components/Header.jsx"
import useRequest from "../hooks/useRequest.js"
import ModalCreateAgenda from "../components/ModalCreateAgenda.jsx"
import { Trash2 } from "lucide-react"

const Home = () => {
  const [loading,setLoading] = useState(false)
  const [dataAgenda,setDataAgenda] = useState([])
  const [showModalCreateAgenda,setShowModalCreateAgenda] = useState(false)
  const [dateTimesAvailable,setDateTimesAvailable] = useState([])

  const fetchData = async ()=>{
    const response = await useRequest("/agenda",setLoading,{
      method: "GET",
      headers: {
        "Authorization":`Bearer ${localStorage.getItem("barberToken")}`
      }
    })

    setDataAgenda(response.data)
  }

  const fetchHours = async ()=>{
    const response = await useRequest("/hours",setLoading,{
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("barberToken")}`
      }
    })
    
    const hours = response.data
    const hoursAvailable = hours.filter(item => item.disponivel == 1)

    if(hoursAvailable){
      hoursAvailable.map(hour => {
        setDateTimesAvailable(prev=>
          [...prev, {
            date: new Date(hour.data).toLocaleDateString("sv-SE",{
              timeZone: "America/Sao_Paulo"
            }),
            time: hour.hora.slice(0,5)
          }]
        )
      })
    }
  }

  useEffect(()=>{
    fetchData()
    fetchHours()
  },[])

  return (
    <>
        <Header/>

        {loading &&
        <div className="d-flex flex-column justify-content-center align-items-center gap-5" style={{position: "absolute",transform: "translate(-50%)",top: "50%",left: "50%"}}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>}

        {!loading &&
          <div className="card col-11 col-lg-9 m-auto mt-5 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>Agenda</h3>
              <button className="btn btn-success btn-sm" onClick={() => dateTimesAvailable.length > 0 ? setShowModalCreateAgenda(true) : alert("Não há nenhum horário disponível cadastrado para agendamento")}>Novo</button>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Data</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dataAgenda.map(item=>(
                    <tr>
                      <td>{item.nome}</td>
                      <td>{new Date(item.data).toLocaleDateString("pt-BR",{timeZone:"America/Sao_Paulo",day:"2-digit",month:"2-digit"})+" "+new Date(item.data).toLocaleTimeString("pt-BR",{timeZone:"America/Sao_Paulo",hour:"2-digit",minute:"2-digit",hour12:false})
                      }</td>
                      <td className="d-flex gap-2">
                        <button className="btn btn-primary btn-sm">Editar</button>
                        <button className="btn btn-danger btn-sm"><Trash2 size={22}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dataAgenda.length == 0 && 
                <div className="alert alert-danger w-100" role="alert">
                  Nenhum agendamento encontrado.
                </div>
              }
            </div>
          </div>
        }

        {showModalCreateAgenda && <ModalCreateAgenda setShowModal={setShowModalCreateAgenda} fetch={fetchData} setLoading={setLoading} dateTimesAvailable={dateTimesAvailable}/>}
    </>
  )
}

export default Home