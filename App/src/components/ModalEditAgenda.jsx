import { useEffect, useState } from "react";
import { FormatIsoInDateAndTime } from "../Utils/Format";
import useRequest from "../hooks/useRequest";

const ModalEditAgenda = ({agenda, setShowModal, setLoading, fetch, dateTimesAvailable}) => {
    const [clients,setClients] = useState([])
    const {date, time} = FormatIsoInDateAndTime(agenda.datetime)
    const [newDate,setNewDate] = useState(date)
    const [newTime,setNewTime] = useState(time)
    const [newIdClient,setNewIdClient] = useState(agenda.idClient)
    const dateNow = new Date().toLocaleDateString("sv-SE", {
        timeZone: "America/Sao_Paulo"
    })

    console.log(dateNow,newDate, newDate === dateNow)

    const fetchClients = async () => {
        const response = await useRequest("/clients", setLoading, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("barberToken")}`
            }
        })

        if(response.status == "success"){
            setClients(response.data);
            localStorage.setItem("clients",JSON.stringify(response.data))
        }
    }

    useEffect(()=>{
        const clientsData = localStorage.getItem("clients")
    
        if(!clientsData){
            fetchClients()
        }else{
            setClients(JSON.parse(clientsData))
        }
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const isDateAvailable = dateTimesAvailable.some(item => item.date === newDate)
        const isTimeAvailable = dateTimesAvailable.some(item=> item.time === newTime)
        console.log(isDateAvailable,isTimeAvailable)
        if(isDateAvailable && isTimeAvailable){
            const response = await useRequest("/agenda",setLoading,{
                method: "PUT",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${localStorage.getItem("barberToken")}`
                },
                body: JSON.stringify({id: agenda.id, idClient: newIdClient, datetime: newDate + " " + newTime})
            })
    
            if(response.status == "success")
                fetch()
            setShowModal(false)
        }else{
            alert("Data ou horário escolhidos não estão disponíveis, confira seus horários")
        }
    }

  return (
    <>
        <div className='modal d-block showModal' tabIndex='-1'>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar agenda</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Cliente:</label>
                                <select className="form-select" value={newIdClient} onChange={(e)=>setNewIdClient(e.target.value)} required>
                                    {clients.map(client=>(
                                        <option value={client.id} key={client.id}>{client.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Data:</label>
                                <input type="date" className="form-control" value={newDate} min={dateNow} onChange={(e)=>setNewDate(e.target.value)} required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Hora:</label>
                                <input type="time" className="form-control" value={newTime} onChange={(e)=>setNewTime(e.target.value)} min={newDate == dateNow ? new Date().toTimeString().slice(0,5) : ""} required/>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Editar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="modal-backdrop fade show"></div>
    </>
  )
}

export default ModalEditAgenda