para ejecutar el servidor

1. abrir carpeta con cd server
   activar entorno virtual en el server
2. con el comando activar el entorno virtual:
   venv\Scripts\activate

para ejecutar el client

1. cd client
2. correr pnpm run dev

Finalmente con un solo comando puedo correr los dos servidores
usando libreria concurrently
pnpm add -D concurrently

1. correr con pnpm dev
