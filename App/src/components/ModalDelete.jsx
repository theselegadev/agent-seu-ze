import useRequest from "../hooks/useRequest";

const ModalDelete = ({route,id,setShowModalDelete,setLoading,fetch}) => {
    const handleDelete = async () => {
        const token = localStorage.getItem("barberToken");
        const response = await useRequest(`${route}/${id}`, setLoading, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        setShowModalDelete(false);
        fetch();
    }

  return (
    <>
        <div className='modal d-block showModal' tabIndex='-1'>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Atenção</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={()=>setShowModalDelete(false)}></button>
                    </div>
                    <div className="modal-body">
                        <p>Tem certeza que deseja deletar?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={()=>setShowModalDelete(false)}>Fechar</button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete}>Deletar</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="modal-backdrop fade show" onClick={()=>setShowModalDelete(false)}></div>
    </>  
  )
}

export default ModalDelete