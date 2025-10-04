import { Label } from "@ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage";

export const SelectField = ({ name, label, placeholder, options, control, error, required }: SelectInputProps) => {
  return (
    <div className="flex flex-col">
      <Label
        htmlFor={name}
        className="text-sm font-medium text-gray-200 mb-2"
      >
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className="h-12 w-full px-4 rounded-lg border border-gray-700 bg-gray-900/60 
                         text-white placeholder-gray-500 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-white mt-2 w-full"
              position="popper"
              sideOffset={4}
            >
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer px-3 py-2 rounded-md 
                             hover:bg-gray-700 
                             data-[state=checked]:bg-blue-600 
                             data-[state=checked]:text-white 
                             focus:bg-gray-700 focus:text-white transition"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <ErrorMessage message={error?.message} />
    </div>
  );
};
