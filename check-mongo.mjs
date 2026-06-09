import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function checkTools() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "mongodb-mcp-server"]
  });
  const client = new Client({ name: "test", version: "1.0" }, { capabilities: {} });
  await client.connect(transport);
  const tools = await client.listTools();
  console.log(JSON.stringify(tools, null, 2));
  await transport.close();
}
checkTools().catch(console.error);
