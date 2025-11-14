import React, { useEffect, useState } from "react";
import "./Table.css";
import Buttons from "./Buttons";
import { AiFillBell, AiOutlineBell } from "react-icons/ai";
import ModalAlert from "./ModalAlert";

function Table({ manejarArchivo, resultado }) {
  const [nuevasFacturas, setNuevasFacturas] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
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

  const openModal = (factura) => {
    setSelectedFactura(factura);
    setIsOpen(true);
  };
  return (
    <div>
      {/* this is a component where is the buttons with new, edit and export, import*/}
      <div className="container-table">
        <Buttons manejarArchivo={manejarArchivo} />
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <AiFillBell style={{ color: "orange", fontSize: "1.2rem" }} />
                  <span>Notificaciones</span>
                </th>
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
                  <td>
                    <button
                      onClick={() => openModal(factura)}
                      style={{ background: "transparent" }}
                    >
                      <AiOutlineBell
                        style={{ color: "orange", fontSize: "1.5rem" }}
                      />
                    </button>
                  </td>
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
        <ModalAlert
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`Factura: ${selectedFactura?.datos?.InvoiceNumber || ""}`}
        >
          {selectedFactura && (
            <div>
              <p>
                <strong>MBL:</strong> {selectedFactura.datos?.MBL}
              </p>
              <p>
                <strong>HBL:</strong> {selectedFactura.datos?.HBL}
              </p>
              <p>
                <strong>Origen:</strong>{" "}
                {selectedFactura.datos?.OriginCountryAddress}
              </p>
              <p>
                <strong>Destino:</strong>{" "}
                {selectedFactura.datos?.DestinationAddress}
              </p>
              <p>
                <strong>ETA:</strong> {selectedFactura.datos?.ETA}
              </p>
              <p>
                <strong>Estado:</strong> {selectedFactura.estado}
              </p>
            </div>
          )}
        </ModalAlert>
      </div>
    </div>
  );
}

export default Table;
