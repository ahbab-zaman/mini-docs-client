import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
      <FaSpinner className="animate-spin text-blue-600 text-4xl" />
    </div>
  );
}
