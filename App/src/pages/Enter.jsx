import { Link } from "react-router-dom";

const Enter = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100 bg-light">
        <form className="col-12 col-lg-6 d-flex flex-column align-items-center border p-2 pt-4 pb-4 p-lg-4 rounded-3 shadow bg-white">
            <h1 className="mb-4 fw-medium">Entrar</h1>
            <div className="mb-3 col-11">
                <label className="form-label">Nome:</label>
                <input type="text" className="form-control" placeholder="Nome:"/>
            </div>
            <div className="mb-3 col-11">
                <label className="form-label">Senha:</label>
                <input type="password" className="form-control" placeholder="Senha:"/>
            </div>
            <div className="d-flex flex-column col-11">
                <button className="btn btn-primary mb-3" type="submit">Entrar</button>
                <Link to="/cadastrar" className="btn btn-link ms-3">Não tenho uma conta</Link>
            </div>
        </form>
    </div>
  )
}

export default Enter