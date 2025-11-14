import { useState } from "react";

import "./App.css";
import Table from "./components/Table";

function App() {
  const [resultado, setResultado] = useState(null);

  const manejarArchivo = async (e) => {
    const archivo = e.target.files[0];

    if (!archivo) return;

    const texto = await archivo.text();
    const jsonData = JSON.parse(texto);

    const respuesta = await fetch("http://localhost:5000/api/dian/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    const data = await respuesta.json();
    setResultado(data);
  };
  return (
    <div style={{ padding: "20px" }}>
      <Table manejarArchivo={manejarArchivo} />
      <h1>Validador DIAN</h1>
      <div className="file-upload-container">
        <label htmlFor="file-upload" className="custom-file-button">
          Elegir Archivo JSON
        </label>

        <input
          id="file-upload"
          type="file"
          accept="application/json"
          onChange={manejarArchivo}
          style={{ display: "none" }} /* Oculta el input original */
        />
      </div>
      {resultado && (
        <div style={{ marginTop: "20px" }}>
          <h2>Estado: {resultado.estado}</h2>

          {resultado.estado === "No cumple" && (
            <>
              {resultado.datos.InvoiceType && (
                <p>
                  <strong>Tipo de Factura Analizado:</strong>{" "}
                  {resultado.datos.InvoiceType}
                </p>
              )}
              <h3>Errores:</h3>
              <ul>
                {resultado.errores.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </>
          )}

          {resultado.estado === "Cumple" && (
            <>
              <h3>Datos generales:</h3>
              <table border="1">
                <tbody>
                  {Object.entries(resultado.datos).map(([key, val]) => (
                    <tr key={key}>
                      <td>
                        <strong>{key}</strong>
                      </td>
                      <td>{val || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Items:</h3>
              <table border="1">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>UnitPrice</th>
                    <th>NetValuePerItem</th>
                  </tr>
                </thead>

                <tbody>
                  {resultado.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.Description || "—"}</td>
                      <td>{item.Quantity || "—"}</td>
                      <td>{item.UnitPrice || "—"}</td>
                      <td>{item.NetValuePerItem || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
