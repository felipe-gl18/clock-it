import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { useState } from "react";

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
          <Mail />
          {isSending ? "Sending..." : "Generate face recognition link"}
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
