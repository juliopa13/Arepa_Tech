import React from "react";
import "./Table.css";
import Buttons from "./Buttons";
function Table({ manejarArchivo }) {
  return (
    <div>
      {/* this is a component where is the buttons with new, edit and export, import*/}
      <div className="container-table">
        <Buttons manejarArchivo={manejarArchivo} />
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Notificaciones</th>
                <th>ID</th>
                <th>MBL</th>
                <th>Estado</th>
                <th>HBL</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>ETA Estimated Time of Arrival</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
