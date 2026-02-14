import { useState } from 'react'
import useRequest from "../hooks/useRequest";

const ModalCreateUser = ({setShowModal, fetch, setLoading, setMessageError}) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await useRequest("/clients",setLoading, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("barberToken")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    telefone: phone
                })
            })
            
            await fetch();
        }catch(err){
            setMessageError("Infelizmente ocorreu um erro, tente recarregar a página ou tente mais tarde")
        }
        
        setShowModal(false);
    }

  return (
    <>
        <div className='modal d-block showModal' tabIndex='-1'>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Cadastrar Cliente</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Nome do Cliente:</label>
                                <input type="text" className="form-control" onChange={(e)=>setName(e.target.value)} required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Telefone do Cliente:</label>
                                <input type="tel" className="form-control" onChange={(e)=>setPhone(e.target.value)} required/>
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

export default ModalCreateUser