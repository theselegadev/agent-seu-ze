import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FormatDate,FormatHour } from "../Utils/Format"
import useRequest from "../hooks/useRequest"
import Header from "../components/Header"

const Hours = () => {
  const [hours,setHours] = useState([])
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    const fetchHours = async () => {
      const token = localStorage.getItem("barberToken");
      const barberId = localStorage.getItem("barberId");

      if (!token || !barberId) navigate('/');

      const response = await useRequest(`/hours/${barberId}`, setLoading, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      setHours(response.data);
    }
    fetchHours()
  },[])

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
            <button className="btn btn-success btn-sm">Nova</button>
          </div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Hora</th>
                  <th scope="col">Disponivel</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {hours.map((hour)=>(
                  <tr key={hour.id}>
                    <td>{FormatDate(hour.data)}</td>
                    <td>{FormatHour(hour.hora)}</td>
                    <td>{hour.disponivel ? "✅" : "❌"}</td>
                    <td><button className="btn btn-primary btn-sm">Editar</button></td>
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
    </div>
  )
}

export default Hours