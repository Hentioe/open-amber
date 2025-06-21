import { Show } from "solid-js";
import { bottomNavState } from "../state";

export default () => {
  return (
    <div class="fixed bottom-0 flex flex-col gap-[0.35rem] md:gap-[0.75rem] font-meow h-[5.5rem]">
      <div class="h-[2.5rem] text-center">
        <Show when={bottomNavState.isJoinShow}>
          <a href="/join" class="text-center text-lg cursor-pointer hover:underline text-amber-300">
            加入喵星备案！
          </a>
        </Show>
      </div>
      <div class="flex items-end gap-[1.5rem] pb-[0.5rem]">
        <a href="/navigation">导航</a>
        <a href="/" class="w-[2.5rem] h-[2.5rem]">
          <img src="/favicon-96x96.png" />
        </a>
        <a href="https://blog.hentioe.dev/posts/miaoxing-icp.html" target="_blank">关于</a>
      </div>
    </div>
  );
};
