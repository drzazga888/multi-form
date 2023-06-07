import { useEffect, useState } from "react";
import { useForm, type UseFormHandleSubmit } from "react-hook-form";
import { useMultiForm } from "./lib";

export default function App() {
  const multiForm = useMultiForm<PersonWithExtraType>((values) =>
    alert(JSON.stringify(values, null, 2))
  );
  const [checked, setChecked] = useState<boolean>(false);
  return (
    <form onSubmit={multiForm.onSubmit}>
      <label>
        <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
        Unnecessary checkbox to check re-render optimization
      </label>
      <p>
        <PersonForm setHandleSubmit={multiForm.register("person")} />
      </p>
      <p>
        <ExtraForm setHandleSubmit={multiForm.register("extra")} />
      </p>
      <button type="submit">Submit</button>
    </form>
  );
}

function PersonForm({
  setHandleSubmit,
}: {
  setHandleSubmit: (handleSubmit: UseFormHandleSubmit<PersonType>) => void;
}) {
  const { handleSubmit, register } = useForm<PersonType>({
    shouldUseNativeValidation: true,
  });
  useEffect(
    () => setHandleSubmit(handleSubmit),
    [handleSubmit, setHandleSubmit]
  );
  return (
    <>
      <input
        type="text"
        {...register("firstName", { required: true })}
        placeholder="First name"
      />
      <input
        type="text"
        {...register("lastName", { required: true })}
        placeholder="Last name"
      />
    </>
  );
}

function ExtraForm({
  setHandleSubmit,
}: {
  setHandleSubmit: (handleSubmit: UseFormHandleSubmit<ExtraType>) => void;
}) {
  const { handleSubmit, register } = useForm<ExtraType>({
    shouldUseNativeValidation: true,
  });
  useEffect(
    () => {
      console.log('yyyy')
      setHandleSubmit(handleSubmit)
    },
    [handleSubmit, setHandleSubmit]
  );
  return (
    <>
      <input
        type="text"
        {...register("value", { required: true })}
        placeholder="Extra value"
      />
    </>
  );
}

type PersonType = {
  firstName: string;
  lastName: string;
};

type ExtraType = {
  value: string;
};

type PersonWithExtraType = {
  person: PersonType;
  extra: ExtraType;
};
