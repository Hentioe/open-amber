import classNames from "classnames";
import { JSX } from "solid-js";

export default (props: { children: JSX.Element }) => {
  return (
    <div
      class={classNames([
        "w-full md:w-fit backdrop-blur-md bg-white/15 shadow-strong rounded-xl mt-[2rem] mb-[5rem]",
        "py-[1.5rem] px-[1rem] md:px-[4rem] interpolate-allow-keywords transition-all overflow-hidden",
      ])}
    >
      {props.children}
    </div>
  );
};
