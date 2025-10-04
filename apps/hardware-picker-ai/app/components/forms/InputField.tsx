import { cn } from "@toolbox/lib/utils";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { ErrorMessage } from "./ErrorMessage";

export const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  validation,
  disabled,
  value,
}: FormInputProps) => {
  return (
    <div className="flex flex-col">
      <Label
        htmlFor={name}
        className="text-sm font-medium text-gray-200 mb-2"
      >
        {label}
      </Label>
      <Input
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn(
          "h-12 px-4 rounded-lg border border-gray-700 bg-gray-900/40 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition",
          { "opacity-50 cursor-not-allowed": disabled },
        )}
        {...register(name, validation)}
      />

      <ErrorMessage message={error?.message} />
    </div>
  );
};
