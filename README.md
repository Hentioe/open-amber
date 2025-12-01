# OpenAmber

[![.github/workflows/publish.yml](https://github.com/hentioe/open-amber/actions/workflows/docker-image.yaml/badge.svg?branch=main)](https://github.com/hentioe/open-amber/actions/workflows/docker-image.yaml)
[![Docker Image Version (tag)](https://img.shields.io/docker/v/hentioe/open-amber/dev)](https://hub.docker.com/r/hentioe/open-amber/tags)

OpenAmber 是[喵星备案](https://icp.hentioe.dev/)的开源实现。它是一个免登录的自助登记系统，当前作为民间娱乐性质的 ICP 备案使用。

## 介绍

本项目起源于我对[萌国 ICP 备案](https://icp.gov.moe/)模仿的静态页面。后我开始对 Bun 感兴趣，便尝试用 Bun 将其完整实现。所以这也是将 Bun 用于后端的一个现实案例。

本项目的主要代码皆用 TypeScript 编写：

- 后端通过 Bun 构建和同时作为运行时。
- 前端使用 SolidJS + TailwindCSS v4，通过 Node.js 构建（仅构建）。

由于使用嵌入式的 SQLite 来存储信息，不需要部署独立的数据库服务。其中敏感信息（如邮箱）是加密存储的。唯一依赖的外部服务是验证码功能（[Capinde](https://github.com/Hentioe/capinde)），它是用 Rust 实现的独立服务。

## 优势

得益于 Bun 的优化，OpenAmber 的内存占用非常低。在早期实现较为简单时，长时间运行内存仍保持在 20MB 以下（`--smol`）。即使现在由于库的增加和代码实现的复杂度提升，低访问量下的内存占用也基本不超过 50MB。

## 意义

我可能会思考如何尽量的通用化这个项目，让它可以发挥自助登记系统的真正用途，而不是部署一个又一个的民间备案系统。如果你有什么建议，请在 [Issues](https://github.com/Hentioe/open-amber/issues) 中提出。

重要的是此项目是我对 Bun 用于后端的一个具体实践，至少向我证明了 Bun 的可靠和轻量。
