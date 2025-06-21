import { createStore } from "solid-js/store";

type State = {
  isJoinShow?: boolean;
};

const [store, setStore] = createStore<State>({});

export function hiddenJoin() {
  setStore("isJoinShow", false);
}

export function showJoin() {
  setStore("isJoinShow", true);
}

export default store;
