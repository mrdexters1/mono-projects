export const InputField = ({ label, ...props }: React.ComponentProps<"input">) => {
  return (
    <div>
      <label>{label}</label>
      <input {...props} />
    </div>
  );
};
