import { TriangleAlertIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-8/12 bg-zinc-100 space-y-4 rounded-lg shadow-md">
      <div className="flex flex-col justify-center items-center p-4 rounded-md">
        <h2 className="scroll-m-20 text-start text-4xl font-extrabold tracking-tight text-balance">
          Page not found!
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Sorry, it seems that this page doesn't exist
        </p>
      </div>
      <TriangleAlertIcon size={40} />
    </div>
  );
}
