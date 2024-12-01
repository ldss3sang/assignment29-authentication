import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function SuccessMessage() {
  return (
    <div className={"w-full flex items-center gap-4 py-3 pl-7 rounded-2xl bg-emerald-500"}>
      <CheckCircleIcon className="size-7 stroke-2" />
      <span className="font-semibold">Welcome back!</span>
    </div>
  );
}
