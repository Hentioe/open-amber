import classNames from "classnames";

export default (props: { enabled?: boolean; onSubmit?: (event: Event) => void }) => {
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (props.onSubmit) {
      props.onSubmit(e);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={!props.enabled}
      class={classNames([
        "mt-[1rem] px-[4rem] text-lg rounded-full cursor-pointer",
        { "bg-amber-500 hover:bg-amber-500/80": props.enabled },
        { "bg-zinc-500 cursor-not-allowed!": !props.enabled },
      ])}
    >
      提交
    </button>
  );
};
