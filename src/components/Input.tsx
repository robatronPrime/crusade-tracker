import { JSX } from "react";

type InputProps = {
    name: string;
    type: string;
    label: string;
    value?: string | number;
    onChange?: React.ChangeEventHandler<HTMLInputElement>; 
}

const Input = (inputProps: InputProps): JSX.Element => {
    const {name, type, label, value, onChange} = inputProps;
    return (
        <label htmlFor={name} className="flex gap-4">
          {label}
          <input name={name} type={type} className="input border-2 border-yellow-500 rounded-s" value={value} onChange={onChange} />
        </label>
    )
}

export default Input;