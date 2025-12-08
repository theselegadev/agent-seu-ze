import { Link } from "react-router-dom"

const Cadaster = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100">
        <form className="card p-5 shadow">
            <h1 className="mb-4 fw-medium">Cadastrar-se</h1>
            <div className="mb-3">
                <label className="form-label">Nome:</label>
                <input type="text" className="form-control" placeholder="Nome:"/>
            </div>
            <div className="mb-3">
                <label className="form-label">Telefone:</label>
                <input type="tel" className="form-control" placeholder="Telefone:"/>
            </div>
            <div className="mb-3">
                <label className="form-label">Endereço:</label>
                <textarea type="text" className="form-control" placeholder="Endereço:"/>
            </div>
            <div className="mb-3">
                <label className="form-label">Senha:</label>
                <input type="password" className="form-control" placeholder="Senha:"/>
            </div>
            <button className="btn btn-success mb-3" type="submit">Cadastrar-se</button>
            <Link to="/" className="btn btn-link ms-3">Já tenho uma conta</Link>
        </form>
    </div>
  )
}

export default Cadaster