import { useNavigate } from "@solidjs/router";
import { AiFillGithub } from "solid-icons/ai";
import { FaBrandsBloggerB, FaSolidPlaceOfWorship } from "solid-icons/fa";
import { IoDocumentText } from "solid-icons/io";
import { createSignal, Match, onMount, Switch } from "solid-js";
import { searchRecord } from "../api";
import BottomNav from "../components/BottomNav";
import MeowFont from "../components/MeowFont";
import { showJoin } from "../state/bottom-nav";
import { setTitle } from "../state/meta";

export default () => {
  const navigation = useNavigate();
  const [inputKeyword, setInputKeyword] = createSignal<string>("");
  const [searchError, setSearchError] = createSignal<string | undefined>(undefined);
  const [isSearching, setIsSearching] = createSignal<boolean>(false);

  const handleKeywordInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setInputKeyword(target.value);
    if (searchError()) {
      setSearchError(undefined); // 清除错误信息
    }
  };

  const handleInputEnter = async (e: KeyboardEvent) => {
    const keyword = inputKeyword().trim();
    if (e.key === "Enter" && keyword !== "") {
      setIsSearching(true);
      const resp = await searchRecord(keyword);
      setIsSearching(false);
      if (resp.success) {
        // 获得查询结果，导航到记录详情页
        const record = resp.payload;
        navigation(`/sites/${record.siteId}`);
      } else {
        setSearchError(resp.message);
      }
    }
  };

  onMount(() => {
    // 设置页面标题
    setTitle(undefined);
    showJoin();
  });

  return (
    <main class="min-h-screen flex items-center justify-center text-white">
      <div class="flex flex-col items-center gap-[2rem]">
        <span class="text-2xl md:text-3xl font-bold font-meow tracking-wide">
          <MeowFont />星 ICP 备案查询
        </span>
        <input
          autofocus
          type="text"
          value={inputKeyword()}
          onInput={handleKeywordInput}
          onKeyDown={handleInputEnter}
          placeholder="输入喵备号或域名"
          class="text-center outline-0 border-2 border-zinc-300/70 py-[0.5rem] md:py-[0.75rem] px-[1rem] md:px-[10rem] rounded-full tracking-wide font-bold"
        />
        <div class="h-[1rem] font-meow">
          <Switch>
            <Match when={isSearching()}>
              <p class="text-yellow-400">搜索中……</p>
            </Match>
            <Match when={searchError()}>
              <p class="text-red-400">{searchError()}</p>
            </Match>
            <Match when={true}>
              <div class="flex items-center gap-[2rem] text-xl md:text-2xl">
                <a href="https://github.com/Hentioe/open-amber" target="_blank">
                  <AiFillGithub />
                </a>
                <a href="https://blog.hentioe.dev/" target="_blank">
                  <FaBrandsBloggerB />
                </a>
                <a>
                  <FaSolidPlaceOfWorship />
                </a>
                <a href="https://blog.hentioe.dev/posts/open-amber.html" target="_blank">
                  <IoDocumentText />
                </a>
              </div>
            </Match>
          </Switch>
        </div>
        <BottomNav />
      </div>
    </main>
  );
};
