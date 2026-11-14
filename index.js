/**
 * Host half of the MCP taskbar bundle.
 *
 * Every operation this plugin performs (reading the plugin inventory, opening
 * and closing an MCP client row) goes through the Client `remote.pluginManager`
 * namespace, so the Host half owns nothing and registers nothing.
 */
export function apply() {}
