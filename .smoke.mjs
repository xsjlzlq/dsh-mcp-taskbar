// Headless smoke test for the MCP taskbar client half.
// Renders the registered components against a fake React + fake Cordis ctx,
// so a runtime error in apply() or a component surfaces here instead of in the page.
import fs from 'node:fs'
import vm from 'node:vm'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const source = fs.readFileSync(join(HERE, 'client.js'), 'utf8')

const errors = []
const log = (...args) => console.log(...args)
const assert = (condition, message) => {
  if (!condition) {
    errors.push(message)
    console.log('FAIL: ' + message)
  }
}

// ---- fake React -------------------------------------------------------------
const FRAGMENT = Symbol('Fragment')
const effects = []
const React = {
  Fragment: FRAGMENT,
  createElement(type, props, ...children) {
    const merged = Object.assign({}, props)
    const flat = children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false)
    if (flat.length === 1) merged.children = flat[0]
    else if (flat.length > 1) merged.children = flat
    return { type, props: merged }
  },
  useState(initial) {
    const value = typeof initial === 'function' ? initial() : initial
    return [value, (next) => { void next }]
  },
  useEffect(fn) {
    effects.push(fn)
  },
}

// ---- fake browser -----------------------------------------------------------
const loaded = []
const styleTags = []
const windowStub = {
  __ModuleLoader__: {
    load(module) {
      loaded.push(module)
    },
  },
  innerWidth: 1440,
  innerHeight: 900,
  addEventListener() {},
  removeEventListener() {},
}
const documentStub = {
  createElement(tag) {
    const node = { tag, dataset: {}, textContent: '' }
    node.remove = () => {
      const index = styleTags.indexOf(node)
      if (index !== -1) styleTags.splice(index, 1)
    }
    return node
  },
  head: {
    appendChild(node) {
      styleTags.push(node)
    },
  },
  querySelector() {
    return null
  },
}

const sandbox = {
  window: windowStub,
  document: documentStub,
  console,
  Set,
  Map,
  Object,
  Array,
  String,
  Math,
  JSON,
  Promise,
}
vm.createContext(sandbox)
vm.runInContext(source, sandbox, { filename: 'client.js' })

assert(loaded.length === 1, 'the bundle registers exactly one module factory')
const module = loaded[0]
assert(module.id === '@local/dsh-mcp-taskbar', 'module id is the package name')

const exported = module.factory((specifier) => {
  if (specifier === 'react') return React
  throw new Error('unexpected require: ' + specifier)
})

assert(
  Array.isArray(exported.inject) && exported.inject.includes('remote.pluginManager'),
  'the plugin declares remote.pluginManager as a dependency',
)

// ---- fake MCP inventory -----------------------------------------------------
const inventory = [
  {
    entryId: 'include:cc-switch-mcp-ida-pro-mcp',
    moduleName: '@deepseek-ai/dsh-mcp-client',
    enabled: true,
    fiberPhase: 'active',
    patchId: 'cc-switch-mcp-ida-pro-mcp',
  },
  {
    entryId: 'include:cc-switch-mcp-x64dbg',
    moduleName: '@deepseek-ai/dsh-mcp-client',
    enabled: false,
    fiberPhase: null,
    patchId: 'cc-switch-mcp-x64dbg',
  },
  {
    entryId: 'include:cc-switch-mcp-rea',
    moduleName: '@deepseek-ai/dsh-mcp-client',
    enabled: true,
    fiberPhase: 'active',
    patchId: 'cc-switch-mcp-rea',
  },
  {
    entryId: 'include:cc-switch-mcp-ida-pro',
    moduleName: '@deepseek-ai/dsh-mcp-client',
    enabled: true,
    fiberPhase: 'failed',
    patchId: 'cc-switch-mcp-ida-pro',
  },
  {
    entryId: 'include:cc-switch-mcp-locked',
    moduleName: '@deepseek-ai/dsh-mcp-client',
    enabled: true,
    fiberPhase: 'active',
    readOnlyReason: 'management-required',
  },
  {
    entryId: 'include:tools',
    moduleName: '@deepseek-ai/dsh-tools',
    enabled: true,
    fiberPhase: 'active',
    patchId: 'tools',
  },
]

const toggleCalls = []
const listCalls = []
const dictionaries = new Map()
const registrations = []
const effectsRegistered = []

const ctx = {
  effect(fn, label) {
    const dispose = fn()
    effectsRegistered.push({ label, dispose })
    return () => {
      if (typeof dispose === 'function') dispose()
    }
  },
  on(name) {
    return () => {
      void name
    }
  },
  locale: {
    register(ns, dicts) {
      dictionaries.set(ns, dicts)
      return () => {}
    },
    bind(ns) {
      const dicts = dictionaries.get(ns)
      return (key) => {
        const value = dicts && dicts.zh ? dicts.zh[key] : undefined
        if (value === undefined) throw new Error('missing dictionary key: ' + key)
        return value
      }
    },
  },
  slots: {
    inject(slot, callback) {
      registrations.push({ slot, dispose: callback() })
    },
    register(options, component) {
      registrations.push({ slot: options.name, options, component })
      return () => {}
    },
  },
  remote: {
    pluginManager: {
      async listPlugins() {
        listCalls.push(1)
        return { ok: true, value: inventory }
      },
      async setPluginEnabled(id, enabled) {
        toggleCalls.push([id, enabled])
        return { ok: true, value: { changed: true, application: 'applied', stage: 'enable', target: id, enabled } }
      },
    },
  },
}

// ---- run apply --------------------------------------------------------------
exported.apply(ctx)
await new Promise((resolve) => setTimeout(resolve, 20))

assert(dictionaries.has('mcpTaskbar'), 'the plugin registers its dictionary namespace')
const dicts = dictionaries.get('mcpTaskbar')
assert(dicts.zh && dicts.en, 'the dictionary carries both zh and en')
const zhKeys = Object.keys(dicts.zh).sort()
const enKeys = Object.keys(dicts.en).sort()
assert(JSON.stringify(zhKeys) === JSON.stringify(enKeys), 'zh and en carry identical key sets')
assert(styleTags.length === 1, 'the stylesheet is inserted once')
assert(styleTags[0].textContent.includes('.mcpTB_chip'), 'the stylesheet carries the chip rule')

const chipEntry = registrations.find((r) => r.options && r.options.id === 'dsh-mcp-taskbar.chip')
const panelEntry = registrations.find((r) => r.options && r.options.id === 'dsh-mcp-taskbar.panel')
assert(chipEntry !== undefined, 'the chip registers in conversation.input.left')
assert(chipEntry && chipEntry.options.name === 'conversation.input.left', 'the chip slot is the composer tool row')
assert(panelEntry !== undefined, 'the panel registers in shell.overlay')
assert(panelEntry && panelEntry.options.name === 'shell.overlay', 'the panel slot is the frame overlay')

// ---- render the chip --------------------------------------------------------
function walk(node, visit) {
  if (node === null || node === undefined || node === false) return
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit)
    return
  }
  if (typeof node === 'string' || typeof node === 'number') {
    visit({ text: String(node) })
    return
  }
  if (typeof node.type === 'function') {
    walk(node.type(node.props), visit)
    return
  }
  visit(node)
  walk(node.props.children, visit)
}

const chipTree = chipEntry.component({})
let chipText = ''
walk(chipTree, (node) => {
  if (node.text !== undefined) chipText += node.text + ' '
})
assert(chipText.includes('MCP'), 'the chip shows its label: ' + chipText.trim())
assert(chipText.includes('4/5'), 'the chip shows open/total for MCP rows only: ' + chipText.trim())
assert(chipTree.props['aria-expanded'] === 'false', 'the chip starts collapsed')

// ---- open the panel ---------------------------------------------------------
chipTree.props.onClick({ currentTarget: { getBoundingClientRect: () => ({ left: 120, top: 760 }) } })
await new Promise((resolve) => setTimeout(resolve, 20))

const panelTree = panelEntry.component({})
assert(panelTree !== null, 'the panel renders once opened')

const texts = []
const switches = []
walk(panelTree, (node) => {
  if (node.text !== undefined) texts.push(node.text)
  if (node.type === 'button' && node.props && node.props.role === 'switch') switches.push(node)
})
const joined = texts.join(' | ')
log('panel text:', joined)
assert(joined.includes('MCP 服务器'), 'the panel header is localized')
for (const name of ['ida-pro-mcp', 'x64dbg', 'rea', 'ida-pro', 'locked']) {
  assert(joined.includes(name), 'the panel lists the row ' + name)
}
assert(!joined.includes('@deepseek-ai/dsh-tools'), 'non-MCP rows are filtered out')
assert(switches.length === 5, 'one switch per MCP row, got ' + switches.length)
assert(
  switches.filter((s) => s.props.disabled === true).length === 1,
  'the unaddressable row is the only disabled switch',
)
assert(
  switches.some((s) => s.props['aria-checked'] === 'false'),
  'a closed row renders as unchecked',
)

const failedRowState = joined.includes('失败')
assert(failedRowState, 'a failed fiber is reported as failed')

// ---- toggle one row ---------------------------------------------------------
const openSwitch = switches[0]
await openSwitch.props.onClick()
await new Promise((resolve) => setTimeout(resolve, 20))
assert(toggleCalls.length === 1, 'one toggle call reached the Host, got ' + toggleCalls.length)
assert(toggleCalls[0][0] === 'include:cc-switch-mcp-ida-pro-mcp', 'the toggle names the entry id')
assert(toggleCalls[0][1] === false, 'an open row is closed')
assert(listCalls.length >= 2, 'the inventory is re-read after a toggle')

// ---- cleanup ----------------------------------------------------------------
for (const entry of effectsRegistered) {
  if (typeof entry.dispose === 'function') entry.dispose()
}
for (const registration of registrations) {
  if (typeof registration.dispose === 'function') registration.dispose()
}
assert(styleTags.length === 0, 'style teardown ran through the effect disposer')

if (errors.length > 0) {
  console.log('\n' + errors.length + ' assertion(s) failed')
  process.exit(1)
}
console.log('\nall smoke assertions passed')
