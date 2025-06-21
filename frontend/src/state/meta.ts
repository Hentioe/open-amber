import { createStore } from "solid-js/store";

type State = {
  title?: string;
};

// 获取当前页面的标题
const baseTitle = "喵星 ICP 备案";

const [store, setStore] = createStore<State>({
  title: baseTitle,
});

export function setTitle(title?: string) {
  if (title) {
    setStore("title", title + " | " + baseTitle);
  } else {
    setStore("title", baseTitle);
  }
}

export default store;
