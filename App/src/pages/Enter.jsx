import { useState } from "react";
import useRequest from "../hooks/useRequest";
import { Link } from "react-router-dom";

const Enter = () => {
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [loading,setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { name, password };

        try {
            const data = await useRequest("/barber/login",setLoading, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            console.log("Login successful:", data);
        }catch (error) {
            console.error("Erro ao fazer login: ", error);
            throw error;
        }
    }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100 bg-light">
        {loading && 
        <div className="d-flex flex-column justify-content-center align-items-center gap-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p className="fs-5 fw-medium">Carregando...</p>
        </div>
        }

        {!loading && 
        <form className="col-12 col-lg-6 d-flex flex-column align-items-center border p-2 pt-4 pb-4 p-lg-4 rounded-3 shadow bg-white" onSubmit={handleSubmit}>
            <h1 className="mb-4 fw-medium">Entrar</h1>
            <div className="mb-3 col-11">
                <label className="form-label">Nome:</label>
                <input type="text" className="form-control" placeholder="Nome:" required onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div className="mb-3 col-11">
                <label className="form-label">Senha:</label>
                <input type="password" className="form-control" placeholder="Senha:" required onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <div className="d-flex flex-column col-11">
                <button className="btn btn-primary mb-3" type="submit">Entrar</button> 
                <Link to="/cadastrar" className="btn btn-link ms-3">Não tenho uma conta</Link>
            </div>
        </form>}
    </div>
  )
}

export default Enter