import { useParams } from "@solidjs/router";
import { useQuery } from "@tanstack/solid-query";
import classNames from "classnames";
import { format as formatDate, parseISO } from "date-fns";
import { createEffect, createSignal, ErrorBoundary, JSX, Match, onMount, Suspense, Switch } from "solid-js";
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

const renderReviewPending = (siteId: string) => {
  return (
    <div>
      <p class="text-center mt-[1.5rem] md:mt-[2rem] tracking-wide">
        ✮喵备{siteId}号✮
      </p>
      <div class="my-[1rem] border-t border-zinc-300" />
      <p class="text-center text-yellow-400 tracking-wide">喵星大使馆已收到此站点的备案申请，预计一周内处理此事项</p>
      <p class="mt-[1rem] mb-[0.5rem] text-center">1. 请确保以下代码在您的网页中</p>
      <pre class="mt-[1rem] overflow-x-auto text-center text-red-400 bg-black/40">
        <code>
          {`<a href="https://icp.hentioe.dev/sites/${siteId}" target="_blank">喵ICP备${siteId}号</a>`}
        </code>
      </pre>
      <p class="my-[1rem] text-center">
        2. 站点类型符合申请要求
      </p>
      <p class="text-center text-red-200">如果审核时间超过一个星期，可主动向我们发邮件催促。</p>
    </div>
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
  const [isReviewPending, setIsReviewPending] = createSignal(false);
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
      if (recordQuery.data?.reason === "REVIEW_PENDING") {
        setIsReviewPending(true);
      }
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
          { "md:w-[60rem]!": isReviewPending(), "h-fit!": isReviewPending() },
        ])}
      >
        <header class="mb-[1.5rem]">
          <p class="text-center text-2xl md:text-3xl font-bold">
            <Switch>
              <Match when={isReviewPending()}>
                <p class="tracking-wide">此备案正在审核</p>
              </Match>
              <Match when={true}>
                <Meow />星 ICP 备案
              </Match>
            </Switch>
          </p>
        </header>
        {/* 获取过程中的错误将被 ErrorBoundary 捕获 */}
        <ErrorBoundary fallback={renderFailure("发生了一些错误！")}>
          {/* 在获取数据时，Suspense 将触发加载状态 */}
          <Suspense fallback={<div>{renderLoading()}</div>}>
            <Switch>
              <Match when={isReviewPending()}>
                {renderReviewPending(params.siteId)}
              </Match>
              <Match when={true}>
                {recordQuery.data?.success
                  ? renderSuccess(recordQuery.data.payload)
                  : renderFailure(recordQuery.data?.message || "服务器返回了错误。")}
              </Match>
            </Switch>
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
