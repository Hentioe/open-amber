import { useParams } from "@solidjs/router";
import { useQuery } from "@tanstack/solid-query";
import classNames from "classnames";
import { format as formatDate, parseISO } from "date-fns";
import { createEffect, createSignal, ErrorBoundary, JSX, onMount, Suspense } from "solid-js";
import { getRecord } from "../api";
import BottomNav from "../components/BottomNav";
import { showJoin } from "../state/bottom-nav";
import { setTitle } from "../state/meta";

const renderSuccess = (record: ServerData.Record) => {
  return (
    <main class="border-2 border-white/20 rounded-lg flex">
      <div class="border-r-2 border-white/20 shrink-0">
        <FieldName>网站名称</FieldName>
        <FieldName>网站域名</FieldName>
        <FieldName>网站首页</FieldName>
        <FieldName>网站信息</FieldName>
        <FieldName>喵备案号</FieldName>
        <FieldName>所有者</FieldName>
        <FieldName>更新时间</FieldName>
        <FieldName last>状态</FieldName>
      </div>
      <div class="flex-1 text-nowrap overflow-hidden overflow-ellipsis">
        <FieldValue>{record.siteName}</FieldValue>
        <FieldValue>{record.siteDomain}</FieldValue>
        <FieldValue>
          <a
            href={record.siteHome}
            target="_blank"
            class="text-amber-300 hover:underline transition-colors"
          >
            {record.siteHome}
          </a>
        </FieldValue>
        <FieldValue>{record.siteInfo || "无"}</FieldValue>
        <FieldValue>
          <Meow /> ICP {record.siteId} 号
        </FieldValue>
        <FieldValue>{record.siteOwner}</FieldValue>
        <FieldValue>{formatDate(parseISO(record.siteModify), "yyyy-MM-dd")}</FieldValue>
        <FieldValue last>
          {renderStatus(record.siteStatus)}
        </FieldValue>
      </div>
    </main>
  );
};

function renderStatus(status: string) {
  switch (status) {
    case "open":
      return (
        <>
          向<Meow />星人<span class="text-green-300">开放</span>浏览中
        </>
      );
    case "closed":
      return (
        <>
          <span class="text-red-300">已关闭</span>
        </>
      );
    default:
      return <span class="text-yellow-300">???</span>;
  }
}

function renderFailure(message: string) {
  return <p class="text-center text-red-400">{message}</p>;
}

function renderLoading() {
  return <p class="text-center">读取中……</p>;
}

export default () => {
  const params = useParams();
  const [cardEl, setCardEl] = createSignal<HTMLDivElement | null>(null);

  const recordQuery = useQuery(() => ({
    queryKey: ["record-info"],
    queryFn: () => getRecord(params.siteId),
    throwOnError: true,
  }));

  createEffect(() => {
    // 数据加载成功后，更新卡片高度
    if (recordQuery.status === "success") {
      cardEl()?.classList.add("h-fit");
    } else if (recordQuery.status === "pending") {
      setTitle("查询中……");
    } else {
      setTitle("查询失败");
    }
  });

  createEffect(() => {
    if (recordQuery.data?.success) {
      // 如果查询成功，设置标题为网站名称
      setTitle(recordQuery.data.payload.siteName);
    } else {
      // 如果查询失败，设置标题为错误信息
      setTitle(recordQuery.data?.message);
    }
  });

  onMount(() => {
    showJoin();
  });

  return (
    <main class="min-h-screen flex items-center justify-center text-white font-meow px-[1rem] md:px-0">
      <div
        ref={setCardEl}
        class={classNames([
          "w-full md:w-[42rem] backdrop-blur-md bg-white/15 shadow-strong rounded-xl my-[5rem]",
          "py-[1.5rem] px-[1rem] md:px-[4rem] h-[11rem] interpolate-allow-keywords transition-all overflow-hidden",
        ])}
      >
        <header class="mb-[1.5rem]">
          <p class="text-center text-2xl md:text-3xl font-bold">
            <Meow />星 ICP 备案
          </p>
        </header>
        {/* 获取过程中的错误将被 ErrorBoundary 捕获 */}
        <ErrorBoundary fallback={renderFailure("发生了一些错误！")}>
          {/* 在获取数据时，Suspense 将触发加载状态 */}
          <Suspense fallback={<div>{renderLoading()}</div>}>
            {recordQuery.data?.success
              ? renderSuccess(recordQuery.data.payload)
              : renderFailure(recordQuery.data?.message || "服务器返回了错误。")}
          </Suspense>
        </ErrorBoundary>

        <p class="mt-[1rem] text-sm md:text-sm text-center tracking-wide leading-6">
          <Meow />星人从地球人的网站了解地球，向喵星申请备案有助于促进地球与喵星的和平。
        </p>
      </div>
      <BottomNav />
    </main>
  );
};

const FieldName = (props: { children: JSX.Element; last?: boolean }) => {
  return (
    <p
      class={classNames(
        [
          "px-[1rem] md:px-[1.5rem] py-[0.5rem] align-last-justify tracking-wider",
          { "border-b-2 border-white/20": !props.last },
        ],
      )}
    >
      {props.children}
    </p>
  );
};

const FieldValue = (props: { children: JSX.Element; last?: boolean }) => {
  return (
    <p
      class={classNames(
        [
          "px-[1rem] md:px-[1.5rem] py-[0.5rem] tracking-wide",
          { "border-b-2 border-white/20": !props.last },
        ],
      )}
    >
      {props.children}
    </p>
  );
};

const Meow = () => {
  return <span class="text-amber-300">喵</span>;
};
