import { RiCloseLine } from "react-icons/ri";
import "./Modal.css";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Modal({ setmodalOpen }) {
    const navigate = useNavigate();
    return (
        <div className="darkBg" onClick={() => setmodalOpen(false)}>
            <div className="centered">
                <div className="modal">
                    {/* modal header */}
                    <div className="modalHeader">
                        <h5 className="heading">Confirm</h5>
                    </div>
                    <button className="closeBtn" onClick={() => setmodalOpen(false)}>
                        <RiCloseLine />
                    </button>

                    {/* modal content */}
                    <div className="modalContent">Are you really want to log Out ?</div>
                    <div className="modalActions">
                        <div className="actionsContainer">
                            <button className="logOutBtn" onClick={() => { setmodalOpen(false); localStorage.clear(); navigate("/login") }}>
                                Log Out
                            </button>

                            <button className="cancelBtn" onClick={() => setmodalOpen(false)}>
                                cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
