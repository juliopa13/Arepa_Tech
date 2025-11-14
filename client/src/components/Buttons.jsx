import React, { useRef } from "react";
import "./Buttons.css";
function Buttons({ manejarArchivo }) {
  const inputRef = useRef();

  const manejarClick = () => {
    inputRef.current.click(); // simula el clic en el input
  };
  return (
    <div>
      <div className="container">
        <div className="container-buttons">
          <div className="btn-edit">
            <button>Editar columnas</button>
          </div>
          <div className="container-buttons-others">
            <button>Nuevo embarque</button>
            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
              <button onClick={manejarClick}>Importar datos</button>
            </label>

            <input
              id="file-upload"
              ref={inputRef}
              type="file"
              accept="application/json"
              onChange={manejarArchivo}
              style={{ display: "none" }} /* Oculta el input original */
            />
            <button>descargar reporte</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Buttons;
