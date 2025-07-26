import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { useState } from "react";
import Loading from "./loading";

export default function GenerateFaceRecognitionTokenButton() {
  const { sendFaceRecognitionTokenByEmail } = useEmployees();

  const [isSending, setIsSending] = useState(false);

  const handleSendFaceRecognitionTokenByEmail = async () => {
    setIsSending(true);
    await sendFaceRecognitionTokenByEmail();
    setIsSending(false);
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          disabled={isSending}
          onClick={handleSendFaceRecognitionTokenByEmail}
          variant="outline"
          className="cursor-pointer"
        >
          {isSending ? (
            <div className="flex justify-center items-center gap-2">
              <Loading />
              <p> Sending...</p>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <Mail />
              <p>Generate face recognition link</p>
            </div>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          Generate a new face recognition token, and send to all employees by
          email
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
