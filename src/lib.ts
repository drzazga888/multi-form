import { useRef } from "react";
import type { FieldValues, UseFormHandleSubmit } from "react-hook-form";

export function useMultiForm<T extends Record<string, FieldValues>>(
  onValid: (values: Partial<T>) => void
): {
  onSubmit: (event: React.BaseSyntheticEvent) => Promise<void>;
  register: (
    name: keyof T
  ) => (handleSubmit: UseFormHandleSubmit<T[keyof T]>) => () => void;
} {
  const handlersRef = useRef<
    Map<keyof T, (event: React.BaseSyntheticEvent) => Promise<void>>
  >(new Map());
  const dataRef = useRef<Partial<T>>({});
  const isErrorRef = useRef<boolean>(false);
  const setHandleSubmitRef = useRef<
    Map<keyof T, (handleSubmit: UseFormHandleSubmit<T[keyof T]>) => () => void>
  >(new Map());

  return {
    onSubmit: async (event) => {
      event.preventDefault();
      dataRef.current = {};
      isErrorRef.current = false;
      await Promise.all(
        Array.from(handlersRef.current.values()).map((onSubmit) =>
          onSubmit(event)
        )
      );
      if (!isErrorRef.current) {
        onValid(dataRef.current);
      }
    },
    register: (name) => {
      let setHandleSubmit = setHandleSubmitRef.current.get(name);
      if (!setHandleSubmit) {
        setHandleSubmit = (handleSubmit) => {
          const onSubmit = handleSubmit(
            (data) => {
              dataRef.current[name] = data;
            },
            () => {
              isErrorRef.current = true;
            }
          );
          handlersRef.current.set(name, onSubmit);
          return () => {
            handlersRef.current.delete(name);
          };
        };
        setHandleSubmitRef.current.set(name, setHandleSubmit);
      }
      return setHandleSubmit;
    },
  };
}
