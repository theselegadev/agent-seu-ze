import { useEffect, useState } from "react"
import Header from "../components/Header.jsx"
import useRequest from "../hooks/useRequest.js"

const Home = () => {
  const [loading,setLoading] = useState(false)
  const [dataAgenda,setDataAgenda] = useState([])

  const fetchData = async ()=>{
    const response = await useRequest("/agenda",setLoading,{
      method: "GET",
      headers: {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${localStorage.getItem("barberToken")}`
      }
    })

    setDataAgenda(response.data)
  }

  useEffect(()=>{
    fetchData()
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
              <h3>Agenda: </h3>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tel</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  
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
    </>
  )
}

export default Home