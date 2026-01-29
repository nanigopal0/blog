import { Loader2 } from "lucide-react";

function LoadingIndicator({size = 32}) {
  return (
    <div className="w-full flex justify-center mb-4">
      <Loader2 className="animate-spin" size={size} />
    </div>
  );
}

export default LoadingIndicator;
