const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// 导入MCP Supabase工具
const { use_mcp_tool } = require('./mcp-supabase');

// Supabase API路由
app.get('/api/supabase/:table', async (req, res) => {
    try {
        const { table } = req.params;
        const { select, orderBy, ascending } = req.query;
        
        // 使用MCP Supabase工具
        const result = await use_mcp_tool({
            server_name: 'supabase',
            tool_name: 'query',
            arguments: {
                table: table,
                select: select || '*',
                orderBy: orderBy,
                ascending: ascending === 'true'
            }
        });
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/supabase/:table', async (req, res) => {
    try {
        const { table } = req.params;
        const records = req.body;
        
        // 使用MCP Supabase工具
        const result = await use_mcp_tool({
            server_name: 'supabase',
            tool_name: 'insert',
            arguments: {
                table: table,
                records: records
            }
        });
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
