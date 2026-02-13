import { useEffect, useState } from "react";
import Header from "../components/Header"
import useRequest from "../hooks/useRequest";

const Account = () => {
  const [loading, setLoading] = useState(false);
  const [edit,setEdit] = useState(false);
  const [barberData,setBarberData] = useState({});
  const [messageError,setMessageError] = useState("")
  
  const barberDataEdit = {name: barberData.nome,telefone: barberData.telefone, address: barberData.endereco}

  const fetchData = async () => {
    try{
      const response = await useRequest("/barber",setLoading,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("barberToken")
        }
      })
  
      setBarberData(response.data[0]);
    }catch(err){
      setMessageError("Infelizmente ocorreu um erro, tente recarregar a página ou tente mais tarde")
    }
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()

    try{
      await useRequest('/barber',setLoading,{
        method: "PUT",
        headers: {
          "Content-Type":"application/json",
          "Authorization": "Bearer " + localStorage.getItem("barberToken")
        },
        body: JSON.stringify(barberDataEdit)
      })
    }catch(err){
      setMessageError("Infelizmente ocorreu um erro, tente recarregar a página ou tente mais tarde")
    }

    setEdit(false)
  }

  
  const handleChange = (e) => {
    const { id, value } = e.target;

    setBarberData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  useEffect(() => {
    fetchData();
  }, [])

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
        <div className="card col-11 col-lg-6 m-auto mt-5 shadow-sm"> 
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3>Minha Conta</h3>
            {edit ? 
            <div className="d-flex gap-1">
              <button className="btn btn-success btn-sm" type="submit">Salvar</button>
              <button className="btn btn-secondary btn-sm" onClick={()=>setEdit(false)}>Cancelar</button>
            </div>
             : <button className="btn btn-primary btn-sm" onClick={()=>setEdit(true)}>Editar</button>}
          </div>
          <div className="card-body">
            {!messageError && <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nome:</label>
              <input type="text" className="form-control" id="nome" value={barberData.nome} disabled={!edit} onChange={handleChange}/> 
            </div>
            <div className="mb-3">
              <label htmlFor="tel" className="form-label">Telefone:</label>
              <input type="tel" className="form-control" id="telefone" value={barberData.telefone} disabled={!edit} onChange={handleChange}/> 
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Localização:</label>
              <textarea type="text" className="form-control" id="endereco" value={barberData.endereco} disabled={!edit} onChange={handleChange}/> 
            </div>
            </form>} 
             {messageError && 
               <div className="alert alert-danger w-100" role="alert">
                 {messageError}
               </div>
             }
          </div>
        </div>}
    </>
  )
}

export default Account