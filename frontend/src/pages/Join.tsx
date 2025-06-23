import classNames from "classnames";
import { createSignal, Match, onMount, Switch } from "solid-js";
import { getSubmitUnverifiedPrepare, submitUnverified } from "../api";
import BottomNav from "../components/BottomNav";
import FormInput from "../components/FormInput";
import MeowFont from "../components/MeowFont";
import PrimaryCard from "../components/PrimaryCard";
import SubmitButton from "../components/SubmitButton";
import { hiddenJoin } from "../state/bottom-nav";
import { setTitle } from "../state/meta";

export default () => {
  const [siteId, setSiteId] = createSignal<string>("00000000");
  const [email, setEmail] = createSignal<string>("");
  const [serverCaptcha, setServerCaptcha] = createSignal<ServerData.Captcha | null>(null);
  const [captchaText, setCaptchaText] = createSignal<string>("");
  const [submiited, setSubmitted] = createSignal<ServerData.SubmittedUnverified | undefined>(undefined);
  const [error, setError] = createSignal<string | undefined>(undefined);
  const [errorInput, setErrorInput] = createSignal<"email" | "captcha_code" | undefined>(undefined);
  const [isPreparing, setIsPreparing] = createSignal<boolean>(false);

  const handleEmailChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setEmail(target.value);
  };

  const handleCaptchaChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setCaptchaText(target.value);
  };

  const handleEmailInput = () => {
    if (errorInput() === "email") {
      setErrorInput(undefined);
      setError(undefined);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (siteId().trim() === "" || email().trim() === "" || captchaText().trim() === "") {
      alert("请填写完整信息");
      return;
    }
    const captchaUniqueId = serverCaptcha()?.uniqueId;
    if (!captchaUniqueId) {
      alert("验证码还未加载，请刷新页面重试");
      return;
    }

    const resp = await submitUnverified({
      siteId: siteId(),
      email: email(),
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
      } else if (resp.reason === "EMAIL_INVALID") {
        // 邮箱格式错误
        setErrorInput("email");
      }

      setError(message);
    }
  };

  onMount(async () => {
    setTitle("备案申请");
    hiddenJoin();
    // 页面加载时刷新获取数据
    refresh();
  });

  const refresh = async () => {
    // 请求备案代和验证码
    const resp = await getSubmitUnverifiedPrepare();

    if (resp.success) {
      setSiteId(resp.payload.siteId);
      setServerCaptcha(resp.payload.captcha);
      setIsPreparing(true);
    } else {
      setError(resp.message);
      setIsPreparing(false);
    }
  };

  return (
    <main class="min-h-screen flex items-center justify-center text-white font-meow px-[1rem] md:px-0">
      <PrimaryCard>
        <header class="mb-[1rem] pb-[1rem] border-b border-zinc-200/50">
          <p class="text-center text-2xl md:text-3xl font-bold">
            <MeowFont />星 ICP 备案申请
          </p>
          <p class="text-center mt-[1.5rem] md:mt-[2rem]">
            ✮请准备好✮
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
              name="siteId"
              label="喵号"
              disabled
              value={siteId()}
            />
            <FormInput
              name="email"
              label="邮箱"
              autofocus
              disabled={!!submiited()}
              placeholder="输入接收邮箱"
              onChange={handleEmailChange}
              onInput={handleEmailInput}
              value={email()}
              errorInput={errorInput()}
            />
            <FormInput
              name="captcha_code"
              label="验证"
              disabled={!!submiited()}
              placeholder="输入验证代码"
              onChange={handleCaptchaChange}
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
                  <div class="text-center">
                    <p class="text-green-300">{submiited()?.message}</p>
                    <p class="text-yellow-300 mt-[0.5rem] text-sm">
                      <span>留意邮件发送者：</span>
                      <span class="font-sans">{submiited()?.sender}</span>
                    </p>
                  </div>
                </Match>
                <Match when={!serverCaptcha()}>
                  <p class="text-sm text-zinc-300">加载中……</p>
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
