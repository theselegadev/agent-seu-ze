import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import useRequest from "../hooks/useRequest";

import Header from "../components/Header"


const Clients = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);


  const fetchClients = async () => {
    const response = await useRequest("/clients", setLoading, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("barberToken")}`
      }
    })

    if(response.status == "success"){
      setClients(response.data);
    }
  }

  useEffect(()=>{
    fetchClients()
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
              <h3>Clientes</h3>
              <button className="btn btn-success btn-sm">Novo</button>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.nome}</td>
                      <td>{client.telefone}</td>
                      <td className="d-flex gap-2">
                        <button className="btn btn-primary btn-sm">Editar</button>
                        <button className="btn btn-danger btn-sm"><Trash2 size={22} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clients.length == 0 && 
                <div className="alert alert-danger w-100" role="alert">
                  Nenhum cliente encontrado.
                </div>
              }
            </div>
          </div>
        }
    </>
  )
}

export default Clients