import { useQuery } from "@tanstack/solid-query";
import classNames from "classnames";
import { AiFillGithub } from "solid-icons/ai";
import { FaBrandsBloggerB } from "solid-icons/fa";
import { FaSolidPlaceOfWorship } from "solid-icons/fa";
import { IoDocumentText } from "solid-icons/io";
import { For, JSX, Match, onMount, Switch } from "solid-js";
import { recentlyRecords } from "../api";
import BottomNav from "../components/BottomNav";
import { showJoin } from "../state/bottom-nav";
import { setTitle } from "../state/meta";

function renderSites(records: ServerData.Record[]) {
  return (
    <For each={records}>
      {(record) => (
        <SiteCeil
          siteId={record.siteId.toString()}
          name={record.siteName}
          info={record.siteInfo}
        />
      )}
    </For>
  );
}
export default () => {
  const recentlyQuery = useQuery(() => ({
    queryKey: ["recently-records"],
    queryFn: () => recentlyRecords(),
    throwOnError: true,
  }));

  onMount(() => {
    setTitle("导航");
    showJoin();
  });

  return (
    <main class="min-h-screen flex justify-center text-white">
      <div class="w-full md:w-[60rem] mx-[1rem] md:mx-0 flex flex-col gap-[1rem] mb-[5rem]">
        <div
          class="w-full h-[14.3rem] md:h-[40rem] mt-[1rem] rounded overflow-hidden bg-full-center flex "
          style={{ "background-image": "url(/images/banner-1080.avif)" }}
        >
          <div class="w-full mt-[1rem] md:mt-[8rem]">
            <h2 class="text-[1.5rem] md:text-[5rem] text-center text-[#C86941] font-bold tracking-wider">
              这里是喵备导航
            </h2>
            <p class="mt-0 md:mt-[0.5rem] text-sm md:text-2xl text-center text-[#C86941] font-medium md:font-bold tracking-wider">
              向喵星人展示地球的知识和智慧
            </p>
            <div class="mt-1 md:mt-[1rem] flex justify-center gap-[1rem] md:gap-[2rem] text-base md:text-[2rem] text-zinc-500 *:hover:text-zinc-600 *:cursor-pointer">
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
            <div class="mt-2 md:mt-[1rem] text-center">
              <a href="https://blog.hentioe.dev/posts/miaoxing-icp.html" target="_blank">
                <button class="py-[0.25rem] md:py-[0.5rem] px-[1rem] md:px-[2rem] bg-[#61A58F] hover:bg-[#79b2a0] rounded-full text-white font-bold text-sm md:text-2xl cursor-pointer">
                  了解更多
                </button>
              </a>
            </div>
          </div>
        </div>
        <div class="px-[1rem] py-[0.75rem] bg-amber-50 text-rose-500 border-4 border-dashed border-amber-500 rounded">
          <p class="text-sm md:text-base tracking-wide leading-[1.5rem]">
            <span class="bg-rose-400 text-white px-[0.5rem] py-[0.15rem] mr-[0.5rem]">公告</span>
            喵星备案的开源实现是{" "}
            <a href="https://github.com/Hentioe/open-amber" target="_blank" class="underline">OpenAmber</a>{" "}
            项目，它是一个运行于 Bun 的免登陆自助登记系统。
          </p>
        </div>
        <GridCard title="喵星 ICP 备案">
          <NavLinkCeil href="/" text="首页" color="DarkSeaGreen" />
          <NavLinkCeil
            href="/join"
            text="加入"
            color="PaleVioletRed"
          />
          <NavLinkCeil
            href="https://blog.hentioe.dev/posts/miaoxing-icp.html"
            text="关于"
            color="CornflowerBlue"
            targetBlank
          />
        </GridCard>
        <Card title="近期备案">
          <Switch>
            <Match when={recentlyQuery.isLoading}>
              <div class="bg-zinc-50 text-zinc-700">
                <p class="text-center py-[1rem]">
                  加载中……
                </p>
              </div>
            </Match>
            <Match when={recentlyQuery.data?.success}>
              <GridMain>
                {recentlyQuery.data?.success && renderSites(recentlyQuery.data?.payload)}
              </GridMain>
            </Match>
          </Switch>
        </Card>
        <div class="flex justify-center">
          <BottomNav />
        </div>
      </div>
    </main>
  );
};

const Card = (props: { title: string; children: JSX.Element }) => {
  return (
    <div class="rounded overflow-hidden">
      <header class="py-[0.5rem] px-[1rem] bg-amber-500">
        <p class="text-xl md:text-2xl font-bold font-meow">{props.title}</p>
      </header>
      {props.children}
    </div>
  );
};

const GridCard = (props: { title: string; children: JSX.Element }) => {
  return (
    <Card title={props.title}>
      <GridMain>
        {props.children}
      </GridMain>
    </Card>
  );
};

const GridMain = (props: { children: JSX.Element }) => {
  return (
    <main class="bg-zinc-50 text-zinc-700 grid grid-cols-2 md:grid-cols-3 gap-[0.5rem] p-[0.5rem]">
      {props.children}
    </main>
  );
};

const NavLinkCeil = (props: { href: string; text: string; color: string; targetBlank?: boolean }) => {
  return (
    <a
      href={props.href}
      target={props.targetBlank ? "_blank" : undefined}
      class={classNames([
        "py-[0.5rem] text-center text-lg font-bold hover:bg-amber-500 hover:text-white! transition-colors duration-300",
        "border border-zinc-200 rounded tracking-wide",
      ])}
      style={{ color: props.color }}
    >
      {props.text}
    </a>
  );
};

const SiteCeil = (props: { siteId: string; name: string; info: string | null }) => {
  return (
    <a
      href={`/sites/${props.siteId}`}
      class={classNames([
        "py-[0.5rem] text-center text-zinc-600 hover:bg-amber-500 hover:text-white! transition-colors duration-300",
        "border border-zinc-200 rounded tracking-wide",
      ])}
    >
      <span class="font-bold">{props.name}</span>
      <p class="text-sm mt-[0.25rem] font-meow line-clamp-1">{props.info || "什么介绍也没有"}</p>
    </a>
  );
};
