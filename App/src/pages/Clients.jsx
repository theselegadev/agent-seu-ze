import { useEffect, useState } from "react";
import useRequest from "../hooks/useRequest";

import Header from "../components/Header"
import ModalCreateUser from "../components/ModalCreateUser";
import ModalEditClient from "../components/ModalEditClient";


const Clients = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [showModalCreateUser, setShowModalCreateUser] = useState(false);
  const [showModalEditClient, setShowModalEditClient] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

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
              <button className="btn btn-success btn-sm" onClick={() => setShowModalCreateUser(true)}>Novo</button>
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
                      <td>
                        <button className="btn btn-primary btn-sm" onClick={()=>{
                            setShowModalEditClient(true)
                            setClientToEdit(client)
                          }}>Editar</button>
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

        {showModalCreateUser && <ModalCreateUser setShowModal={setShowModalCreateUser} fetch={fetchClients} setLoading={setLoading}/>}

        {showModalEditClient && <ModalEditClient setShowModalEditClient={setShowModalEditClient} client={clientToEdit} setLoading={setLoading} fetch={fetchClients}/>}
    </>
  )
}

export default Clients