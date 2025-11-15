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
    <body class="font-display bg-secondary-900 text-secondary-300">
      <div class="flex min-h-screen">
        <aside class="w-full max-w-xs flex-shrink-0 bg-secondary-700 flex flex-col border-r border-secondary-600">
          <div class="h-16 flex items-center px-6 border-b border-secondary-600 flex-shrink-0">
            <div class="flex items-center space-x-2">
              <svg
                aria-label="Kila logo"
                class="text-secondary-100"
                fill="none"
                height="32"
                role="img"
                viewBox="0 0 24 24"
                width="32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
                <path
                  d="M2 7L12 12M22 7L12 12M12 22V12M17 4.5L7 9.5"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
              <span class="text-xl font-bold text-secondary-100">Kila</span>
            </div>
            <button class="ml-auto text-secondary-400">
              <span class="material-icons-outlined">chevron_left</span>
            </button>
          </div>
          <div class="flex-grow p-4 overflow-y-auto">
            <div class="bg-primary-500/10 text-primary-500 p-3 rounded-lg mb-6">
              <p class="font-medium text-sm text-secondary-200">
                ¡Consulta nuevas actualizaciones!
              </p>
              <div class="mt-2 bg-secondary-700 rounded-md p-2 flex justify-between items-center text-sm shadow-sm">
                <div class="flex items-center">
                  <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  <span class="text-secondary-100">Versión 1.3.0</span>
                </div>
                <span class="material-icons-outlined text-base">
                  chevron_right
                </span>
              </div>
            </div>
            <nav class="flex flex-col space-y-2">
              <span class="px-3 text-xs font-bold uppercase tracking-wider text-secondary-400">
                Operaciones
              </span>
              <a
                class="flex items-center px-3 py-2 rounded-md hover:bg-secondary-600 transition-colors"
                href="#"
              >
                <span class="material-icons-outlined mr-3">public</span>
                <span>Tracking Universal</span>
              </a>
              <a
                class="flex items-center px-3 py-2 rounded-md bg-primary-500/10 text-primary-500 font-medium transition-colors"
                href="#"
              >
                <span class="material-icons-outlined mr-3">local_shipping</span>
                <span>Embarques</span>
              </a>
              <a
                class="flex items-center px-3 py-2 rounded-md hover:bg-secondary-600 transition-colors"
                href="#"
              >
                <span class="material-icons-outlined mr-3">request_quote</span>
                <span>Cotizaciones</span>
              </a>
            </nav>
            <nav class="flex flex-col space-y-2 mt-8">
              <span class="px-3 text-xs font-bold uppercase tracking-wider text-secondary-400">
                Sistema
              </span>
              <a
                class="flex items-center px-3 py-2 rounded-md hover:bg-secondary-600 transition-colors"
                href="#"
              >
                <span class="material-icons-outlined mr-3">settings</span>
                <span>Configuración</span>
              </a>
            </nav>
          </div>
          <div class="p-4 border-t border-secondary-600 flex-shrink-0">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                AP
              </div>
              <div class="ml-3">
                <p class="font-medium text-sm text-secondary-100">
                  Antonio Perez
                </p>
                <p class="text-xs">Plan actual: Trial Premium</p>
              </div>
            </div>
          </div>
        </aside>
        <main class="flex-1 flex flex-col">
          <header class="h-16 md:h-20 bg-secondary-700 border-b border-secondary-600 flex items-center px-4 md:px-6 flex-shrink-0">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-primary-500/20 text-primary-500 flex items-center justify-center font-bold text-sm">
                D
              </div>
              <span class="ml-3 font-medium text-secondary-100">
                DWP CORPORATION
              </span>
              <span class="material-icons-outlined ml-1 text-base">
                expand_more
              </span>
            </div>
            <div class="flex-1 flex justify-center px-8">
              <div class="relative w-full max-w-md">
                <span class="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                  search
                </span>
                <input
                  class="w-full bg-secondary-900 border border-secondary-600 rounded-md pl-10 pr-4 py-2 text-sm text-secondary-200 placeholder:text-secondary-400 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Buscar embarques, reportes..."
                  type="text"
                />
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <img
                alt="Spanish flag"
                class="w-6 h-auto rounded-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKVyLquW0pQarCnhPC8sZSANqnKSwwBeGyHuwyPa5du5lEiF4i2hqJPdHKTUSpoedE7O97Cv73S7bLp0LxFydOgF4xSdO_lSYrC0G0JoW03r-EL0MCbGAs5-EOMqOYJfQyY__3D1SWMWBXN0f0VfTNu9xL6_3F8NUCgIHOBYSRjOBMvMNiUWSCXu3KoU30MYw1JVWmjmls5d9rzNxbRdzvtPwViMXgLARnxuzAKFk-_IQrOZm83N3g56nETt4FLzrRDkVl8SBUURNn"
              />
              <button class="text-secondary-400">
                <span class="material-icons-outlined">wb_sunny</span>
              </button>
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
                  AP
                </div>
                <span class="ml-2 text-sm text-secondary-100">
                  Antonio Perez
                </span>
              </div>
            </div>
          </header>
          <div class="flex-1 p-6 overflow-y-auto">
            <h1 class="text-2xl font-bold text-secondary-100">Embarques</h1>
            <p class="mt-1 text-secondary-400">
              Gestiona y monitorea tus embarques en tiempo real.
            </p>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-6 mt-6">
              <div class="bg-secondary-700 p-4 rounded-lg shadow-sm">
                <p class="text-sm">Total de Embarques</p>
                <p class="text-3xl font-bold text-secondary-100 mt-1">91</p>
              </div>
              <div class="bg-secondary-700 p-4 rounded-lg shadow-sm">
                <p class="text-sm">En Tránsito</p>
                <p class="text-3xl font-bold text-secondary-100 mt-1">41</p>
              </div>
              <div class="bg-secondary-700 p-4 rounded-lg shadow-sm">
                <p class="text-sm">Retrasados</p>
                <p class="text-3xl font-bold text-secondary-100 mt-1">4</p>
              </div>
              <div class="bg-secondary-700 p-4 rounded-lg shadow-sm">
                <p class="text-sm">Adelantados</p>
                <p class="text-3xl font-bold text-secondary-100 mt-1">2</p>
              </div>
              <div class="bg-secondary-700 p-4 rounded-lg shadow-sm">
                <p class="text-sm">Completados</p>
                <p class="text-3xl font-bold text-secondary-100 mt-1">1</p>
              </div>
            </div>
            <div class="mt-8 bg-secondary-700 p-6 rounded-lg shadow-sm">
              <div style={{ padding: "20px" }}>
                <Table manejarArchivo={manejarArchivo} resultado={resultado} />
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
                            {Object.entries(resultado.datos).map(
                              ([key, val]) => (
                                <tr key={key}>
                                  <td>
                                    <strong>{key}</strong>
                                  </td>
                                  <td>{val || "—"}</td>
                                </tr>
                              )
                            )}
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
            </div>
          </div>
        </main>
      </div>
    </body>
  );
}

export default App;
