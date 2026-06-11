# OpenAmber

OpenAmber 是[喵星备案](https://icp.hentioe.dev/)的开源实现。它是一个免登录的自助登记系统，当前作为民间娱乐性质的 ICP 备案使用。

## 介绍

此项目原本是我个人对 Bun 的一次线上尝试。但由于我对 Bun 后来的发展非常失望，**已彻底弃用了它**。好消息是 OpenAmber 已经完全移植到 Deno 上了 🎉。

_由于我不想让 Bun 污染代码库，已清空此前的代码。新版本的开源正在筹备中。_

此项目最初源于我对[萌国 ICP 备案](https://icp.gov.moe/)模仿的静态页面。后我开始对 Bun 感兴趣，便尝试用 Bun 将其完整实现。再后来又移植到 Deno 上。同时我还参考了[十年之约](https://www.foreverblog.cn/)。感谢这些项目带来的灵感，我打算将其整合到一个项目中。

本项目的主要代码皆用 TypeScript 编写：

- 后端通过 Deno 构建 & 同时作为运行时。
- 前端使用 SolidJS + TailwindCSS v4，通过 Node.js 构建（仅构建）。

由于使用嵌入式的 SQLite 来存储信息，不需要部署独立的数据库服务。其中敏感信息（如邮箱）是加密存储的。唯一依赖的外部服务是验证码功能（[Capinde](https://github.com/Hentioe/capinde)），它是用 Rust 实现的独立服务。

## 优势

得益于 Deno 的稳定性和优化，OpenAmber 在内存和性能方面十分平衡。比起此前的 Bun 版本在压力测试时的表现更好。如果你想进一步节省内存，试着硬性限制容器的资源分配。你将会体验到 v8 强大的自适应能力。Deno 完胜 Bun 🥳。

## 意义

我可能会思考如何尽量的通用化这个项目，让它可以发挥自助登记系统的真正用途，而不是部署一个又一个的民间备案系统。如果你有什么建议，请在 [Issues](https://github.com/Hentioe/open-amber/issues) 页面提出。

重要的是此项目是我对 Deno 用于后端的一个具体实践，至少向我证明了 Deno 的可靠。
