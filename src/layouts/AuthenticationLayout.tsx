import { Outlet } from "react-router-dom";

export function AuthenticationLayout() {
  return (
    <div className="relative w-full h-screen flex justify-center items-center text-center overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover z-[-2]"
        src="/working.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black opacity-40 z-[-1]" />

      {/* Conteúdo principal */}
      <div className="flex lg:w-4/6 md:w-11/12 w-11/12 min-h-10/12 rounded-md bg-zinc-100 p-6 z-10">
        {/* Lado esquerdo com imagem e texto */}
        <div className="md:flex hidden justify-center items-center w-full rounded-l-md">
          <div className="relative w-full h-full rounded-xl shadow-lg overflow-hidden">
            <video
              className="absolute inset-0 w-full h-full object-cover z-[-2]"
              src="/working.mp4"
              autoPlay
              muted
              loop
              playsInline
            />

            {/* Camada escura por cima */}
            <div className="absolute inset-0 bg-black/70" />

            {/* Conteúdo visível acima da imagem + overlay */}
            <div className="absolute bottom-0 z-10 p-6 text-white text-start space-y-8">
              <h2 className="scroll-m-20 text-start text-4xl font-extrabold tracking-tight text-balance">
                Have a better control of your employees
              </h2>
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                With us you can manage better your employees working hours
              </p>
            </div>
          </div>
        </div>

        {/* Lado direito com logo e formulário */}
        <div className="flex flex-col items-center sm:space-y-8 w-full rounded-r-md">
          <div className="w-24 h-24 py-4">
            <img src="/logo.png" alt="Logo" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
