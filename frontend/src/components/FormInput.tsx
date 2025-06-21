import classNames from "classnames";

export default (
  props: {
    name: string;
    label: string;
    value?: string;
    placeholder?: string;
    autofocus?: boolean;
    disabled?: boolean;
    onChange?: (e: Event) => void;
    onInput?: (e: Event) => void;
    errorInput?: string;
    labelWidth?: string;
  },
) => {
  const handleChange = (e: Event) => {
    if (props.onChange) {
      props.onChange(e);
    }
  };
  const handleInput = (e: Event) => {
    if (props.onInput) {
      props.onInput(e);
    }
  };

  return (
    <div class="text-center">
      <label
        class="inline-block mb-[0.25rem] md:mb-0 align-last-justify"
        style={{
          width: props.labelWidth,
        }}
      >
        {props.label}
      </label>：
      <input
        type="text"
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        autofocus={props.autofocus}
        onChange={handleChange}
        onInput={handleInput}
        disabled={props.disabled}
        class={classNames([
          "w-[14rem] outline-0 bg-white/30 rounded text-center font-sans",
          { "bg-white/10!": props.disabled },
          { "outline-2 outline-red-400": props.errorInput === props.name },
        ])}
      />
    </div>
  );
};
