// 使用Supabase加载通知数据
let notifications = [];
let notificationList;

// 渲染通知列表
function renderNotifications() {
    if (!notificationList) {
        notificationList = document.querySelector('.notification-list');
    }
    
    if (notificationList) {
        notificationList.innerHTML = notifications.map(notification => `
            <div class="notification-item" data-type="${notification.type}">
                <div class="notification-header">
                    <span class="notification-type">${notification.type}</span>
                    <span class="notification-time">${notification.timestamp}</span>
                </div>
                <div class="notification-content">${notification.content}</div>
            </div>
        `).join('');
    }
}

async function loadNotifications() {
    try {
        // 使用Supabase MCP工具获取通知数据
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('timestamp', { ascending: false });
            
        if (error) throw error;
        
        notifications = data;
        renderNotifications();
    } catch (error) {
        console.error('無法從Supabase加載通知數據:', error);
        
        // 使用静态数据作为回退
        notifications = [
            {
                id: 1,
                type: '包裹',
                content: '您有一個新的包裹已送達',
                timestamp: '2025-03-04 13:45',
                expire: '2025-03-11'
            },
            {
                id: 2,
                type: '系統',
                content: '系統將於今晚12點進行維護',
                timestamp: '2025-03-04 10:30',
                expire: '2025-03-05'
            },
            {
                id: 3,
                type: '安全',
                content: '請注意大樓門禁系統更新',
                timestamp: '2025-03-04 09:15',
                expire: '2025-03-06'
            }
        ];
        renderNotifications();
    }
}

// 添加新通知到Supabase
async function addNotification(notification) {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .insert([notification]);
            
        if (error) throw error;
        
        // 重新加载通知
        loadNotifications();
    } catch (error) {
        console.error('無法添加通知:', error);
    }
}

// 初始化通知系統
document.addEventListener('DOMContentLoaded', function() {
    notificationList = document.querySelector('.notification-list');
    
    // 初始化渲染
    loadNotifications();

    // 設置WebSocket連接
    try {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onmessage = function(event) {
            const newNotification = JSON.parse(event.data);
            notifications.unshift(newNotification);
            renderNotifications();
            
            // 顯示瀏覽器通知
            if (Notification.permission === 'granted') {
                new Notification(newNotification.type, {
                    body: newNotification.content
                });
            }
        };
        
        ws.onerror = function(error) {
            console.log('WebSocket連接失敗，實時通知將不可用');
        };
    } catch (error) {
        console.log('WebSocket初始化失敗，實時通知將不可用');
    }

    // 請求通知權限
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
});
