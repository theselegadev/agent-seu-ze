import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FormatDate,FormatHour } from "../Utils/Format"
import useRequest from "../hooks/useRequest"
import Header from "../components/Header"
import {Trash2} from "lucide-react"
import "../assets/styles.css"

import ModalDelete from "../components/ModalDelete"
import ModalEditHour from "../components/ModalEditHour"

const Hours = () => {
  const [hours,setHours] = useState([])
  const [loading,setLoading] = useState(false)
  const [date,setDate] = useState("")
  const [hour,setHour] = useState("")
  const [showModal,setShowModal] = useState(false)
  const [showModalDelete,setShowModalDelete] = useState(false)
  const [hourIdToDelete,setHourIdToDelete] = useState(null)
  const [showModalEditHour,setShowModalEditHour] = useState(false)
  const [dateEdit,setDateEdit] = useState(null)
  const [availableEdit,setAvailableEdit] = useState(false)
  const [timeEdit,setTimeEdit] = useState("")
  const [hourIdToEdit,setHourIdToEdit] = useState(null)

  const navigate = useNavigate()
  const dateNow = new Date().toISOString().split("T")[0]
  
  const fetchHours = async () => {
      const token = localStorage.getItem("barberToken");
      const barberId = localStorage.getItem("barberId");

      if (!token || !barberId) navigate('/');

      const response = await useRequest(`/hours`, setLoading, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      setHours(response.data);
  }
    

  useEffect(()=>{
    fetchHours()
  },[])

  const handleSubmit = async (e) => { 
    e.preventDefault();
    const token = localStorage.getItem("barberToken");
    const barberId = localStorage.getItem("barberId");

    const response = await useRequest(`/hours`, setLoading, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        barberId,
        date,
        hour
      })
    });

    console.log(response);
    setShowModal(false);
    fetchHours()
  }

  return (
    <div className="vh-100 vw-100">
        <Header/>
        {loading &&
        <div className="d-flex flex-column justify-content-center align-items-center gap-5" style={{position: "absolute",transform: "translate(-50%)",top: "50%",left: "50%"}}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>}

        {!loading && <div className="card col-11 col-lg-9 m-auto mt-5 shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title">Horas Cadastradas</h5>
            <button className="btn btn-success btn-sm" onClick={()=>setShowModal(true)}>Nova</button>
          </div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Hora</th>
                  <th scope="col">Livre</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {hours.map((hour)=>(
                  <tr key={hour.id}>
                    <td>{FormatDate(hour.data)}</td>
                    <td>{FormatHour(hour.hora)}</td>
                    <td>{hour.disponivel ? "✅" : "❌"}</td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-primary btn-sm" onClick={()=>{
                          setShowModalEditHour(true)
                          setDateEdit(hour.data)
                          setTimeEdit(hour.hora)
                          setAvailableEdit(hour.disponivel)
                          setHourIdToEdit(hour.id)
                        }}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>{
                          setShowModalDelete(true)
                          setHourIdToDelete(hour.id)
                        }}><Trash2 size={22}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             {hours.length == 0 && 
                <div className="alert alert-danger w-100" role="alert">
                  Nenhuma hora cadastrada.
                </div>
              }
          </div>
        </div>}

        {/* Modal para criar nova hora */}
        {showModal && <>
        <div className="modal show d-block showModal" id="newHourModal" tabIndex="-1" aria-labelledby="newHourModalLabel" aria-hidden="true" onClick={()=>setShowModal(false)}>
          <div className="modal-dialog" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="newHourModalLabel">Novo Horário</h5>
                <button type="button" className="btn-close" onClick={()=>setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="date">Data:</label>
                    <input type="date" id="date" min={new Date().toISOString().split("T")[0]} name="date" className="form-control" required onChange={(e) => setDate(e.target.value)}/>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="hour">Hora:</label>
                    <input type="time" id="hour" name="hour" min={date == dateNow ? new Date().toTimeString().slice(0,5) : ""} className="form-control" required onChange={(e) => setHour(e.target.value)}/>
                  </div>
                  <div className="mb-3 col-12">
                    <button className="btn btn-success w-100" type="submit">Cadastrar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show" onClick={()=>setShowModal(false)}></div>
        </>}

        {showModalDelete && <ModalDelete route="/hours" id={hourIdToDelete} setShowModalDelete={setShowModalDelete} setLoading={setLoading} fetch={fetchHours}/>}

        {showModalEditHour && <ModalEditHour setShowModalEditHour={setShowModalEditHour} date={dateEdit} time={timeEdit} available={availableEdit} id={hourIdToEdit} setLoading={setLoading} fetch={fetchHours}/>}
    </div>
  )
}

export default Hours