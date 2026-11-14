window.__ModuleLoader__.load({
  id: '@local/mcp-taskbar',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'mcpTaskbar'
    const CHIP_ID = 'mcp-taskbar.chip'
    const PANEL_ID = 'mcp-taskbar.panel'
    const MCP_MODULE = '@deepseek-ai/dsh-mcp-client'

    const CSS = [
      '.mcpTB_chip{height:28px;display:inline-flex;align-items:center;gap:6px;padding:0 8px;border-radius:var(--dsw-radius-sm,6px);border:none;outline:none;background:transparent;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:500;line-height:20px;cursor:pointer;white-space:nowrap}',
      '.mcpTB_chip:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}',
      '.mcpTB_chip:focus-visible{box-shadow:0 0 0 2px var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#2f6fbf))}',
      '.mcpTB_chip[aria-expanded="true"]{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary)}',
      '.mcpTB_icon{width:14px;height:14px;flex:none;display:inline-flex}',
      '.mcpTB_icon svg{width:14px;height:14px;display:block}',
      '.mcpTB_count{flex:none;font-size:11px;font-weight:500;letter-spacing:.2px;color:var(--dsw-alias-label-caption,var(--dsw-alias-label-secondary))}',
      '.mcpTB_count[data-tone="on"]{color:var(--dsw-alias-state-success-primary)}',
      '.mcpTB_count[data-tone="error"]{color:var(--dsw-alias-state-error-primary)}',
      '.mcpTB_scrim{position:fixed;inset:0;margin:0;padding:0;border:none;background:transparent;cursor:default;z-index:0}',
      '.mcpTB_panel{position:fixed;z-index:1;box-sizing:border-box;width:320px;max-height:min(60vh,440px);display:flex;flex-direction:column;border-radius:var(--dsw-radius-md,10px);border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 12px 32px rgba(0,0,0,.28);font-size:13px;overflow:hidden}',
      '.mcpTB_head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:.5px solid var(--dsw-alias-border-l2)}',
      '.mcpTB_headText{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
      '.mcpTB_title{font-weight:600;line-height:18px}',
      '.mcpTB_sub{font-size:11px;line-height:15px;color:var(--dsw-alias-label-secondary)}',
      '.mcpTB_iconBtn{flex:none;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;border:none;outline:none;border-radius:var(--dsw-radius-sm,6px);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}',
      '.mcpTB_iconBtn:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary)}',
      '.mcpTB_iconBtn:disabled{opacity:.45;cursor:default}',
      '.mcpTB_list{overflow-y:auto;padding:4px;display:flex;flex-direction:column}',
      '.mcpTB_row{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:var(--dsw-radius-sm,6px)}',
      '.mcpTB_row:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.10))}',
      '.mcpTB_dot{flex:none;width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-state-idle-primary)}',
      '.mcpTB_row[data-state="on"] .mcpTB_dot{background:var(--dsw-alias-state-success-primary)}',
      '.mcpTB_row[data-state="starting"] .mcpTB_dot{background:var(--dsw-alias-state-warn-primary)}',
      '.mcpTB_row[data-state="failed"] .mcpTB_dot{background:var(--dsw-alias-state-error-primary)}',
      '.mcpTB_name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.mcpTB_state{flex:none;font-size:11px;color:var(--dsw-alias-label-secondary)}',
      '.mcpTB_switch{position:relative;flex:none;width:32px;height:18px;padding:0;border-radius:999px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);cursor:pointer;outline:none;transition:background .12s,border-color .12s}',
      '.mcpTB_switch[aria-checked="true"]{background:var(--dsw-alias-state-business-primary,#2f6fbf);border-color:transparent}',
      '.mcpTB_switch:focus-visible{box-shadow:0 0 0 2px var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#2f6fbf))}',
      '.mcpTB_switch:disabled{opacity:.45;cursor:default}',
      '.mcpTB_knob{position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:#fff;transition:transform .12s}',
      '.mcpTB_switch[aria-checked="true"] .mcpTB_knob{transform:translateX(14px)}',
      '.mcpTB_note{padding:8px 12px;border-top:.5px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}',
      '.mcpTB_note[data-tone="error"]{color:var(--dsw-alias-state-error-primary)}',
      '.mcpTB_empty{padding:14px 12px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}',
    ].join('')

    const DICT = {
      en: {
        chipLabel: 'MCP',
        chipTitle: 'MCP servers — open or close one',
        panelTitle: 'MCP servers',
        panelSub: 'Each row is one MCP client in this profile.',
        refresh: 'Refresh',
        empty: 'No MCP client row is composed in this profile.',
        stateOn: 'Open',
        stateOff: 'Closed',
        stateStarting: 'Starting',
        stateFailed: 'Failed',
        stateStopping: 'Stopping',
        readOnly: 'This row is not editable from the UI.',
        overridden: 'A higher-priority layer overrides this row.',
        restart: 'Saved. Takes effect after a restart.',
        applied: 'Applied.',
        loadFailed: 'Could not read the plugin list.',
        toggleFailed: 'The change was rejected.',
        hint: 'Toggling a row unloads or loads its MCP client plugin, which opens or closes the server.',
      },
      zh: {
        chipLabel: 'MCP',
        chipTitle: 'MCP 服务器 — 就地开关',
        panelTitle: 'MCP 服务器',
        panelSub: '每一行是本配置里的一个 MCP 客户端条目。',
        refresh: '刷新',
        empty: '本配置里没有组合任何 MCP 客户端条目。',
        stateOn: '已开启',
        stateOff: '已关闭',
        stateStarting: '启动中',
        stateFailed: '失败',
        stateStopping: '停止中',
        readOnly: '该条目无法在界面里修改。',
        overridden: '被更高优先级的层覆盖。',
        restart: '已保存，重启后生效。',
        applied: '已生效。',
        loadFailed: '读取插件列表失败。',
        toggleFailed: '改动被拒绝。',
        hint: '切换条目会卸载或加载它的 MCP 客户端插件，从而关闭或打开对应服务器。',
      },
    }

    /** A tiny observable snapshot store; `set` replaces the snapshot identity. */
    function createStore(initial) {
      let snapshot = initial
      const listeners = new Set()
      return {
        get: () => snapshot,
        set(patch) {
          snapshot = Object.assign({}, snapshot, patch)
          for (const listener of Array.from(listeners)) listener()
        },
        subscribe(listener) {
          listeners.add(listener)
          return () => {
            listeners.delete(listener)
          }
        },
      }
    }

    function useStore(store) {
      const [snap, setSnap] = React.useState(store.get())
      React.useEffect(() => {
        setSnap(store.get())
        return store.subscribe(() => setSnap(store.get()))
      }, [store])
      return snap
    }

    /** `include:cc-switch-mcp-rea` → `rea`; a readable label for a Loader row. */
    function displayName(row) {
      const raw = row.patchId || row.entryId || row.moduleName || ''
      return String(raw)
        .replace(/^include:/, '')
        .replace(/^cc-switch-mcp-/, '')
        .replace(/^mcp-/, '')
    }

    function isMcpRow(row) {
      return typeof row.moduleName === 'string' && row.moduleName.indexOf('mcp-client') !== -1
    }

    function rowState(row) {
      if (!row.enabled) return 'off'
      const phase = row.phase
      if (phase === 'active') return 'on'
      if (phase === 'failed') return 'failed'
      if (phase === 'unloading') return 'stopping'
      return 'starting'
    }

    function describeFailure(error) {
      if (error === undefined || error === null) return ''
      const code = typeof error.code === 'string' ? error.code : ''
      const message = typeof error.message === 'string' ? error.message : String(error)
      return code ? code + ': ' + message : message
    }

    function PlugIcon() {
      return h(
        'svg',
        { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true },
        h('path', {
          d: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8zM12 17v4',
          stroke: 'currentColor',
          strokeWidth: 1.8,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )
    }

    function RefreshIcon() {
      return h(
        'svg',
        { viewBox: '0 0 16 16', width: 14, height: 14, fill: 'none', 'aria-hidden': true },
        h('path', {
          d: 'M13 8a5 5 0 1 1-1.6-3.7M13 2.5V5h-2.5',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )
    }

    function Switch(props) {
      return h(
        'button',
        {
          type: 'button',
          role: 'switch',
          className: 'mcpTB_switch',
          'aria-checked': props.checked ? 'true' : 'false',
          'aria-label': props.label,
          disabled: props.disabled === true,
          onClick: () => props.onChange(!props.checked),
        },
        h('span', { className: 'mcpTB_knob' }),
      )
    }

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, DICT), 'mcp-taskbar: dictionaries')
      const t = ctx.locale.bind(NS)

      ctx.effect(() => {
        const tag = document.createElement('style')
        tag.dataset.plugin = '@local/mcp-taskbar'
        tag.textContent = CSS
        document.head.appendChild(tag)
        return () => {
          tag.remove()
        }
      }, 'mcp-taskbar: styles')

      const list = createStore({
        status: 'idle',
        error: '',
        rows: [],
        pending: {},
        notice: '',
        noticeTone: 'info',
        loading: false,
      })

      const panel = createStore({ open: false, rect: null })

      const openPanel = (rect) => panel.set({ open: true, rect })
      const closePanel = () => panel.set({ open: false })

      let inFlight = false

      async function refresh() {
        if (inFlight) return
        inFlight = true
        list.set({ loading: true })
        try {
          const result = await ctx.remote.pluginManager.listPlugins()
          if (!result.ok) {
            list.set({
              loading: false,
              status: 'error',
              error: describeFailure(result.error) || t('loadFailed'),
            })
            return
          }
          const rows = (Array.isArray(result.value) ? result.value : [])
            .filter(isMcpRow)
            .map((row) => ({
              entryId: String(row.entryId),
              name: displayName(row),
              module: String(row.moduleName || ''),
              enabled: row.enabled === true,
              phase: typeof row.fiberPhase === 'string' ? row.fiberPhase : null,
              writable: typeof row.patchId === 'string' && row.readOnlyReason === undefined,
            }))
          list.set({ loading: false, status: 'ready', error: '', rows })
        } finally {
          inFlight = false
        }
      }

      async function toggle(row, next) {
        const pending = Object.assign({}, list.get().pending, { [row.entryId]: true })
        list.set({ pending, notice: '', noticeTone: 'info' })
        const result = await ctx.remote.pluginManager.setPluginEnabled(row.entryId, next)
        const cleared = Object.assign({}, list.get().pending)
        delete cleared[row.entryId]
        if (!result.ok) {
          list.set({
            pending: cleared,
            notice: describeFailure(result.error) || t('toggleFailed'),
            noticeTone: 'error',
          })
          return
        }
        const application = result.value && result.value.application
        if (application === 'overridden') {
          list.set({ pending: cleared, notice: t('overridden'), noticeTone: 'error' })
        } else if (application === 'failed') {
          const detail = describeFailure(result.value.error) || t('toggleFailed')
          list.set({ pending: cleared, notice: detail, noticeTone: 'error' })
        } else if (application === 'restart-required') {
          list.set({ pending: cleared, notice: t('restart'), noticeTone: 'info' })
        } else {
          list.set({ pending: cleared, notice: t('applied'), noticeTone: 'info' })
        }
        await refresh()
      }

      function stateText(row) {
        switch (rowState(row)) {
          case 'on':
            return t('stateOn')
          case 'off':
            return t('stateOff')
          case 'failed':
            return t('stateFailed')
          case 'stopping':
            return t('stateStopping')
          default:
            return t('stateStarting')
        }
      }

      function Chip() {
        const snap = useStore(list)
        const open = useStore(panel).open
        const total = snap.rows.length
        const on = snap.rows.filter((row) => row.enabled).length
        const broken = snap.rows.some((row) => rowState(row) === 'failed')
        const tone = broken ? 'error' : on > 0 ? 'on' : undefined
        return h(
          'button',
          {
            type: 'button',
            className: 'mcpTB_chip',
            title: t('chipTitle'),
            'aria-haspopup': 'dialog',
            'aria-expanded': open ? 'true' : 'false',
            onMouseDown: (event) => event.preventDefault(),
            onClick: (event) => {
              if (open) {
                closePanel()
                return
              }
              const rect = event.currentTarget.getBoundingClientRect()
              openPanel({ left: rect.left, top: rect.top })
              void refresh()
            },
          },
          h('span', { className: 'mcpTB_icon', key: 'icon' }, h(PlugIcon)),
          h('span', { key: 'label' }, t('chipLabel')),
          total > 0
            ? h('span', { className: 'mcpTB_count', key: 'count', 'data-tone': tone }, on + '/' + total)
            : null,
        )
      }

      function Panel() {
        const snap = useStore(list)
        const state = useStore(panel)

        React.useEffect(() => {
          if (!state.open) return undefined
          const onKey = (event) => {
            if (event.key === 'Escape') closePanel()
          }
          window.addEventListener('keydown', onKey)
          return () => window.removeEventListener('keydown', onKey)
        }, [state.open])

        if (!state.open || state.rect === null) return null

        const width = 320
        const margin = 8
        const viewportWidth = typeof window === 'undefined' ? 1280 : window.innerWidth
        const viewportHeight = typeof window === 'undefined' ? 800 : window.innerHeight
        const left = Math.max(
          margin,
          Math.min(state.rect.left, Math.max(margin, viewportWidth - width - margin)),
        )
        const bottom = Math.max(margin, viewportHeight - state.rect.top + 8)

        const rows = snap.rows.map((row) =>
          h(
            'div',
            { className: 'mcpTB_row', key: row.entryId, 'data-state': rowState(row) },
            h('span', { className: 'mcpTB_dot', key: 'dot' }),
            h('span', { className: 'mcpTB_name', key: 'name', title: row.module }, row.name),
            h('span', { className: 'mcpTB_state', key: 'state' }, stateText(row)),
            h(Switch, {
              key: 'switch',
              checked: row.enabled,
              disabled: !row.writable || snap.pending[row.entryId] === true,
              label: row.name,
              onChange: (next) => void toggle(row, next),
            }),
          ),
        )

        return h(
          React.Fragment,
          null,
          h('button', {
            type: 'button',
            className: 'mcpTB_scrim',
            tabIndex: -1,
            'aria-label': t('panelTitle'),
            onClick: closePanel,
          }),
          h(
            'div',
            {
              className: 'mcpTB_panel',
              role: 'dialog',
              'aria-label': t('panelTitle'),
              style: { left: left + 'px', bottom: bottom + 'px' },
            },
            h(
              'div',
              { className: 'mcpTB_head' },
              h(
                'div',
                { className: 'mcpTB_headText' },
                h('div', { className: 'mcpTB_title' }, t('panelTitle')),
                h('div', { className: 'mcpTB_sub' }, t('panelSub')),
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'mcpTB_iconBtn',
                  title: t('refresh'),
                  'aria-label': t('refresh'),
                  disabled: snap.loading,
                  onClick: () => void refresh(),
                },
                h(RefreshIcon),
              ),
            ),
            snap.status === 'error'
              ? h('div', { className: 'mcpTB_empty' }, snap.error || t('loadFailed'))
              : snap.rows.length === 0
                ? h('div', { className: 'mcpTB_empty' }, t('empty'))
                : h('div', { className: 'mcpTB_list' }, rows),
            snap.notice
              ? h(
                  'div',
                  { className: 'mcpTB_note', 'data-tone': snap.noticeTone },
                  snap.notice,
                )
              : h('div', { className: 'mcpTB_note' }, t('hint')),
          ),
        )
      }

      ctx.slots.inject('conversation.input.left', () =>
        ctx.slots.register({ name: 'conversation.input.left', id: CHIP_ID, order: 20 }, Chip),
      )

      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register({ name: 'shell.overlay', id: PANEL_ID, order: 40 }, Panel),
      )

      ctx.effect(() => {
        void refresh()
        return ctx.on('connection/reset', () => {
          void refresh()
        })
      }, 'mcp-taskbar: inventory')
    }

    return {
      inject: ['slots', 'locale', 'remote', 'remote.pluginManager'],
      apply,
    }
  },
})
