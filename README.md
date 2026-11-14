# mcp-taskbar

把 MCP 服务器开关放进 DeepSeek Harness 的输入框工具栏。

Harness 里 MCP 客户端是 profile 的插件行，开/关要改配置或翻插件面板。这个 bundle 在
`conversation.input.left` 插一个 `MCP` chip，点开是一个浮层，逐行列出当前 profile
里所有 MCP 客户端条目，每行一个开关，就地 open / close。

## 行为

- **chip**：显示当前已开启的服务器数量，全部正常时是绿色，有 `failed` 行时转红。
- **面板**：每行一个 MCP client —— 状态点（`on` / `starting` / `failed` / 空闲）、
  条目名、状态文字、右侧开关。
- **开关**：走 `ctx.remote.pluginManager.setPluginEnabled(entryId, next)`，等价于在
  插件面板里启用/停用那一行；切换条目会卸载或加载对应 MCP 客户端插件，从而关闭或
  打开服务器。
- **刷新**：`listPlugins()` 重新拉一遍 inventory，过滤出 MCP 客户端行。
- `connection/reset` 时清空本地列表，等下一次打开重新拉取。

## 结构

| 文件 | 作用 |
| --- | --- |
| `index.js` | Host 半边：空实现，所有操作都走 Client 的 `remote.pluginManager` |
| `client.js` | Client 半边：chip + 浮层面板，`window.__ModuleLoader__` 模块格式 |
| `cordis.patch.yml` | bundle patch，插入一条 `mcp-taskbar` 行 |
| `locale/{zh,en}.json` | 插件元信息文案 |
| `.smoke.mjs` | headless 冒烟测试：假 React + 假 Cordis ctx 渲染组件 |

注入的 slot：`conversation.input.left`（chip）、`shell.overlay`（面板）。
依赖的服务：`slots`、`locale`、`remote`、`remote.pluginManager`。

## 安装

```bash
git clone <this-repo> mcp-taskbar
```

`package.json` 里 `dsh.bundle.patch` 指向 `cordis.patch.yml`，`dsh.client.immediately`
为 true，重启 Harness 后生效。

## 冒烟测试

```bash
node .smoke.mjs
```

用假的 React / Cordis ctx 渲染一遍注册的组件，`apply()` 或组件里的运行时错误会在这里
暴露，而不是等到页面里。全部断言通过时最后打印 `all smoke assertions passed`。

## 许可

未声明。
