import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import useRequest from "../hooks/useRequest"

const Cadaster = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { name, telefone: phone, address, password };

        try {
            const response = await useRequest("/barber", setLoading, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            localStorage.setItem("barberToken", response.data[0].token);
            navigate("/home")
        } catch (error) {
            console.error("Error registering user:", error);
        }
    }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100 bg-light">
        {loading && 
        <div className="d-flex flex-column justify-content-center align-items-center gap-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="fs-5 fw-medium">Carregando...</p>
        </div>
        }
        
        {!loading &&
        <form className="col-12 col-lg-6 d-flex flex-column align-items-center border p-2 pt-4 pb-4 p-lg-4 rounded-3 shadow bg-white" onSubmit={handleSubmit}>
            <h1 className="mb-4 fw-medium">Cadastrar-se</h1>
            <div className="mb-3 col-11">
                <label className="form-label">Nome:</label>
                <input type="text" className="form-control" placeholder="Nome:" required onChange={e=>setName(e.target.value)}/>
            </div>
            <div className="mb-3 col-11">
                <label className="form-label">Telefone:</label>
                <input type="tel" className="form-control" placeholder="Telefone:" required onChange={e=>setPhone(e.target.value)}/>
            </div>
            <div className="mb-3 col-11">
                <label className="form-label">Endereço:</label>
                <textarea type="text" className="form-control" placeholder="Endereço:" required onChange={e=>setAddress(e.target.value)}/>
            </div>
            <div className="mb-3 col-11">
                <label className="form-label">Senha:</label>
                <input type="password" className="form-control" placeholder="Senha:" required onChange={e=>setPassword(e.target.value)}/>
            </div>
            <div className="d-flex flex-column col-11">
                <button className="btn btn-success mb-3" type="submit">Cadastrar-se</button>
                <Link to="/entrar" className="btn btn-link ms-3">Já tenho uma conta</Link>
            </div>
        </form>}
    </div>
  )
}

export default Cadaster