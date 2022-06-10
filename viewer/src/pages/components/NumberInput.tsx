import { FC } from "react";

type NumberInputProps = { value: number };
const NumberInput: FC<JSX.IntrinsicElements["input"] & NumberInputProps> = (
  props
) => {
  return <input {...props} style={{ width: "6rem", textAlign: "right" }} />;
};

export default NumberInput;
