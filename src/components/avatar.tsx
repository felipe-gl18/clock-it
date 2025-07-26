import { User } from "lucide-react";

export default function Avatar({
  className,
  img,
}: {
  className?: string;
  img: string | null;
}) {
  return (
    <div>
      {img ? (
        <div
          className={`inset-0 bg-cover bg-center rounded-full ${
            className ?? ""
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ) : (
        <div
          className={`flex justify-center items-center bg-gray-100 rounded-full ${
            className ?? ""
          }`}
        >
          <User />
        </div>
      )}
    </div>
  );
}
