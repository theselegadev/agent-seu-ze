import { useState } from "react";
import useRequest from "../hooks/useRequest";

const ModalEditClient = ({setShowModalEditClient, client, setLoading, fetch,setMessageError}) => {
    const [newName, setNewName] = useState(client.nome);
    const [newPhone, setNewPhone] = useState(client.telefone);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("barberToken");

        try{
            await useRequest(`/clients/${client.id}`, setLoading, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newName,
                    telefone: newPhone
                })
            });
            
            await fetch();
        }catch(err){
            setMessageError("Infelizmente ocorreu um erro, tente recarregar a página ou tente mais tarde")
        }
        
        setShowModalEditClient(false);
    }

  return (
    <>
        <div className='modal d-block showModal' tabIndex='-1'>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Cliente</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={()=>setShowModalEditClient(false)}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Nome:</label>
                                <input type="text" className="form-control" value={newName} onChange={(e) => setNewName(e.target.value)}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Telefone:</label>
                                <input type="tel" className="form-control" value={newPhone} onChange={(e) => setNewPhone(e.target.value)}/>
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

export default ModalEditClient