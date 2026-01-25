import { useEffect, useState } from "react";
import useRequest from "../hooks/useRequest";

const ModalCreateAgenda = ({setShowModal,setLoading,fetch,dateTimesAvailable}) => {
    const [idClient,setIdClient] = useState()
    const [clients,setClients] = useState([])
    const [date,setDate] = useState()
    const [hour,setHour] = useState()
    const dateNow = new Date().toLocaleDateString("sv-SE", {
        timeZone: "America/Sao_Paulo"
    })

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

    const handleSubmit = async (e)=>{
        e.preventDefault()

        const isDateAvailable = dateTimesAvailable.some(item => item.date === date)
        const isTimeAvailable = dateTimesAvailable.some(item=> item.time === hour)

        if(isDateAvailable && isTimeAvailable){
            const response = await useRequest("/agenda",setLoading, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${localStorage.getItem("barberToken")}`
                },
                body: JSON.stringify({idClient,datetime: `${date} ${hour}`})
            })
    
            if(response.status == "success")
                fetch()
        }else{
            alert("Data ou horário escolhidos não estão disponíveis, confira seus horários")
        }

        
        setShowModal(false)
    }

    useEffect(()=>{
        const clientsData = localStorage.getItem("clients")

        if(!clientsData){
            fetchClients()
        }else{
            setClients(JSON.parse(clientsData))
        }
    },[])
    
  return (
    <>
        <div className='modal d-block showModal' tabIndex='-1'>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Cadastrar agenda</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Cliente:</label>
                                <select className="form-select" onChange={(e)=>setIdClient(e.target.value)}>
                                    <option disabled value="" selected>{clients ? "Selecione" : "Não possui clientes"}</option>
                                    {clients.map(client=>(
                                        <option value={client.id} key={client.id}>{client.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Data:</label>
                                <input type="date" className="form-control" min={dateNow} onChange={(e)=>setDate(e.target.value)}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Hora:</label>
                                <input type="time" className="form-control" onChange={(e)=>setHour(e.target.value)} min={date == dateNow ? new Date().toTimeString().slice(0,5) : ""}/>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Cadastrar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="modal-backdrop fade show"></div>
    </>
  )
}

export default ModalCreateAgenda