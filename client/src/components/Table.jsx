import React, { useEffect, useState } from "react";
import "./Table.css";
import Buttons from "./Buttons";
function Table({ manejarArchivo, resultado }) {
  const [nuevasFacturas, setNuevasFacturas] = useState([]);

  // cargar facturas desde localStorage solo al iniciar
  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem("resultado")) || [];
    setNuevasFacturas(guardadas);
  }, []);

  // Solo agregar nueva factura si existe y no está ya en el array
  useEffect(() => {
    if (!resultado) return;

    setNuevasFacturas((prev) => {
      // Evitar duplicados (opcional)
      const existe = prev.some(
        (f) => f.datos?.InvoiceNumber === resultado.datos?.InvoiceNumber
      );
      if (existe) return prev;

      const actualizado = [...prev, resultado];
      localStorage.setItem("resultado", JSON.stringify(actualizado));
      return actualizado;
    });
  }, [resultado]);
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
            <tbody>
              {nuevasFacturas.map((factura, index) => (
                <tr key={index} style={{}}>
                  <td>noti</td>
                  <td>{factura.datos?.InvoiceNumber || "—"}</td>
                  <td>{factura.datos?.MBL || "—"}</td>
                  <td>
                    <span
                      className="state-factura"
                      style={{
                        backgroundColor:
                          factura.estado === "Cumple" ? "green" : "red",
                      }}
                    >
                      {factura.estado || "—"}
                    </span>
                  </td>
                  <td>{factura.datos?.HBL || "—"}</td>
                  <td>{factura.datos?.OriginCountryAddress || "—"}</td>
                  <td>{factura.datos?.DestinationAddress || "—"}</td>
                  <td>{factura.datos?.ETA || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
