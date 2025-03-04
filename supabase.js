// 使用MCP Supabase工具
const supabase = {
    // 从表中选择数据
    from: function(table) {
        return {
            select: function(columns) {
                return {
                    order: function(column, options) {
                        return new Promise(async (resolve, reject) => {
                            try {
                                const response = await fetch(`/api/supabase/${table}?select=${columns}&orderBy=${column}&ascending=${options.ascending}`);
                                const result = await response.json();
                                resolve(result);
                            } catch (error) {
                                reject({ error });
                            }
                        });
                    },
                    eq: function(column, value) {
                        return new Promise(async (resolve, reject) => {
                            try {
                                const response = await fetch(`/api/supabase/${table}?select=${columns}&${column}=${value}`);
                                const result = await response.json();
                                resolve(result);
                            } catch (error) {
                                reject({ error });
                            }
                        });
                    }
                };
            },
            insert: function(records) {
                return new Promise(async (resolve, reject) => {
                    try {
                        const response = await fetch(`/api/supabase/${table}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(records)
                        });
                        const result = await response.json();
                        resolve(result);
                    } catch (error) {
                        reject({ error });
                    }
                });
            },
            update: function(updates) {
                return {
                    eq: function(column, value) {
                        return new Promise(async (resolve, reject) => {
                            try {
                                const response = await fetch(`/api/supabase/${table}?${column}=${value}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(updates)
                                });
                                const result = await response.json();
                                resolve(result);
                            } catch (error) {
                                reject({ error });
                            }
                        });
                    }
                };
            },
            delete: function() {
                return {
                    eq: function(column, value) {
                        return new Promise(async (resolve, reject) => {
                            try {
                                const response = await fetch(`/api/supabase/${table}?${column}=${value}`, {
                                    method: 'DELETE'
                                });
                                const result = await response.json();
                                resolve(result);
                            } catch (error) {
                                reject({ error });
                            }
                        });
                    }
                };
            }
        };
    }
};

// 导出Supabase客户端
window.supabase = supabase;

console.log('MCP Supabase工具已初始化');
