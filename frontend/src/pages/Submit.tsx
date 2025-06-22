import classNames from "classnames";
import { createSignal, Match, onMount, Switch } from "solid-js";
import { getSubmitPrepare, submit } from "../api";
import BottomNav from "../components/BottomNav";
import FormInput from "../components/FormInput";
import MeowFont from "../components/MeowFont";
import PrimaryCard from "../components/PrimaryCard";
import SubmitButton from "../components/SubmitButton";
import { hiddenJoin } from "../state/bottom-nav";
import { setTitle } from "../state/meta";

export default () => {
  const [siteId, setSiteId] = createSignal<string>("00000000");
  const [name, setName] = createSignal<string>("");
  const [domain, setDomain] = createSignal<string>("");
  const [home, setHome] = createSignal<string>("");
  const [owner, setOwner] = createSignal<string>("");
  const [info, setInfo] = createSignal<string>("");
  const [captchaText, setCaptchaText] = createSignal<string>("");
  const [serverCaptcha, setServerCaptcha] = createSignal<ServerData.Captcha | null>(null);
  const [submiited, setSubmitted] = createSignal<ServerData.Submitted | undefined>(undefined);
  const [error, setError] = createSignal<string | undefined>(undefined);
  const [errorInput, setErrorInput] = createSignal<
    "name" | "domain" | "home" | "owner" | "info" | "captcha_code" | undefined
  >(undefined);
  const [isPreparing, setIsPreparing] = createSignal<boolean>(false);

  const handleNameChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setName(target.value.trim());
  };

  const handleDomainChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setDomain(target.value.trim());
  };

  const handleHomeChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setHome(target.value.trim());
  };

  const handleOwnerChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setOwner(target.value);
  };

  const handleInfoChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setInfo(target.value);
  };

  const handleCaptchaCodeChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setCaptchaText(target.value.trim());
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.name === errorInput()) {
      setErrorInput(undefined);
      setError(undefined);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (domain().trim() === "" || home().trim() === "" || owner().trim() === "") {
      alert("请填写完整信息");
      return;
    }
    const captchaUniqueId = serverCaptcha()?.uniqueId;
    if (!captchaUniqueId) {
      alert("验证码还未加载，请刷新页面重试");
      return;
    }

    const resp = await submit({
      name: name(),
      domain: domain(),
      home: home(),
      owner: owner(),
      info: info(),
      captcha: { text: captchaText(), uniqueId: captchaUniqueId },
    });

    if (resp.success) {
      setSubmitted(resp.payload);
    } else {
      let message = resp.message;
      if (resp.reason === "CAPTCHA_INVALID") {
        // 验证码错误，自动刷新
        setErrorInput("captcha_code");
        setTimeout(() => {
          refresh();
          setError(undefined);
          setErrorInput(undefined);
          setCaptchaText("");
        }, 3000);
        message = message + "，重新加载中……";
        setError(message);
      } else if (resp.reason === "NAME_INVALID") {
        setErrorInput("name");
      } else if (resp.reason === "DOMAIN_INVALID") {
        setErrorInput("domain");
      } else if (resp.reason === "HOME_INVALID") {
        setErrorInput("home");
      } else if (resp.reason === "OWNER_INVALID") {
        setErrorInput("owner");
      } else if (resp.reason === "INFO_INVALID") {
        setErrorInput("info");
      }

      setError(message);
    }
  };

  onMount(async () => {
    setTitle("备案提交");
    hiddenJoin();
    // 页面加载时刷新获取数据
    refresh();
  });

  const refresh = async () => {
    // 请求提交者信息和验证码
    const resp = await getSubmitPrepare();

    if (resp.success) {
      setSiteId(resp.payload.siteId);
      setServerCaptcha(resp.payload.captcha);
      setIsPreparing(true);
    } else {
      if (resp.reason === "RECORD_EXISTS") {
        const payload = resp.payload as ServerData.Record;
        setName(payload.siteName);
        setDomain(payload.siteDomain);
        setHome(payload.siteHome);
        setOwner(payload.siteOwner);
        setInfo(payload.siteInfo || "");
        setSiteId(payload.siteId.toString().padStart(8, "0"));
        setServerCaptcha(null);
      }

      setError(resp.message);
      setIsPreparing(false);
    }
  };

  return (
    <main class="min-h-screen flex items-center justify-center text-white font-meow px-[1rem] md:px-0">
      <PrimaryCard>
        <header class="mb-[1rem] pb-[1rem] border-b border-zinc-200/50">
          <p class="text-center text-2xl md:text-3xl font-bold">
            <MeowFont />星 ICP 备案提交
          </p>
          <p class="text-center mt-[1.5rem] md:mt-[2rem]">
            ✮即将完成✮
          </p>
        </header>
        <main>
          <a
            target="_blank"
            href="https://blog.hentioe.dev/posts/miaoxing-icp.html#%E5%8A%A0%E5%85%A5%E5%96%B5%E5%A4%87"
          >
            <p class="text-center text-sm text-yellow-400 hover:underline">
              注意：暂不接受非个人/商业网站、自动生成内容、影视/小说、破解/灰产、违法等类型
            </p>
          </a>
          <p class="mt-[1.5rem] mb-[0.5rem] text-center">1. 请将以下代码复制到您的网页中</p>
          <pre class="mt-[1rem] overflow-x-auto text-center text-red-400 bg-black/40">
            <code>
              {`<a href="https://icp.hentioe.dev/sites/${siteId()}" target="_blank">喵ICP备${siteId()}号</a>`}
            </code>
          </pre>
          <p class="mt-[1rem] md:mt-[1.5rem] mb-[0.5rem] md:mb-[1rem] text-center">2. 请填写以下表单内容</p>
          <form class="flex flex-col items-center gap-[0.5rem]">
            <FormInput
              name="name"
              label="名称"
              labelWidth="3rem"
              autofocus
              disabled={!!submiited()}
              placeholder="输入网站名称"
              onChange={handleNameChange}
              onInput={handleInput}
              value={name()}
              errorInput={errorInput()}
            />
            <FormInput
              name="domain"
              label="域名"
              labelWidth="3rem"
              disabled={!!submiited()}
              placeholder="输入网站域名"
              onChange={handleDomainChange}
              onInput={handleInput}
              value={domain()}
              errorInput={errorInput()}
            />
            <FormInput
              name="home"
              label="主页"
              labelWidth="3rem"
              disabled={!!submiited()}
              placeholder="输入网站主页"
              onChange={handleHomeChange}
              onInput={handleInput}
              value={home()}
              errorInput={errorInput()}
            />
            <FormInput
              name="owner"
              label="所有者"
              labelWidth="3rem"
              disabled={!!submiited()}
              placeholder="输入网站作者"
              onChange={handleOwnerChange}
              onInput={handleInput}
              value={owner()}
              errorInput={errorInput()}
            />
            <FormInput
              name="info"
              label="信息"
              labelWidth="3rem"
              disabled={!!submiited()}
              placeholder="输入网站介绍"
              onChange={handleInfoChange}
              onInput={handleInput}
              value={info()}
              errorInput={errorInput()}
            />
            <FormInput
              name="captcha_code"
              label="验证"
              labelWidth="3rem"
              disabled={!!submiited()}
              placeholder="输入验证代码"
              onChange={handleCaptchaCodeChange}
              onInput={handleInput}
              value={captchaText()}
              errorInput={errorInput()}
            />
            <div
              class={classNames([
                "w-[150px] h-[50px] flex justify-center items-center",
                { "w-full!": submiited() || error() },
              ])}
            >
              <Switch>
                <Match when={error()}>
                  <p class="text-yellow-400">{error()}</p>
                </Match>
                <Match when={!submiited() && serverCaptcha()}>
                  <img src={serverCaptcha()?.url} />
                </Match>
                <Match when={submiited()}>
                  <p class="text-green-500">{submiited()?.message}</p>
                </Match>
                <Match when={serverCaptcha() === undefined}>
                  <p class="text-sm text-zinc-400">加载中……</p>
                </Match>
              </Switch>
            </div>
            <SubmitButton onSubmit={handleSubmit} enabled={isPreparing() && !error() && !submiited()} />
          </form>
        </main>
      </PrimaryCard>
      <BottomNav />
    </main>
  );
};
