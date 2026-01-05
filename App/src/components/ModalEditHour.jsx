import { useState } from 'react'
import useRequest from '../hooks/useRequest';

const ModalEditHour = ({setShowModalEditHour, date, time, available, id, setLoading, fetch}) => {
    const [newDate, setNewDate] = useState(date.split("T")[0]);
    const [newTime, setNewTime] = useState(time);
    const [isAvailable, setIsAvailable] = useState(available);
    const dateNow = new Date().toISOString().split("T")[0];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await useRequest(`/hours/${id}`, setLoading, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('barberToken')}`,
            },
            body: JSON.stringify({
                date: newDate,
                hour: newTime,
                available: isAvailable
            }),
        });

        setShowModalEditHour(false);
        fetch();
    }

  return (
    <>
        <div className='modal d-block showModal' tabIndex='-1'>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar horário</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={()=>setShowModalEditHour(false)}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Data:</label>
                                <input type="date" className="form-control" value={newDate} onChange={(e)=>setNewDate(e.target.value)} min={dateNow}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Hora:</label>
                                <input type="time" className="form-control" value={newTime} onChange={(e)=>setNewTime(e.target.value)} min={newDate == dateNow ? new Date().toTimeString().slice(0,5) : ""}/>
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)}/>
                                <label className="form-check-label">Disponivel:</label>
                            </div>
                            <button type="submit" className="btn btn-primary w-100" checked={available}>Editar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="modal-backdrop fade show" onClick={()=>setShowModalDelete(false)}></div>
    </>
  )
}

export default ModalEditHour