// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素
    const header = document.querySelector('header h1');
    const main = document.querySelector('main');
    const navLinks = document.querySelectorAll('nav a');
    const serviceCards = document.querySelectorAll('.service-card');
    
    // 移除标题点击事件，改为导航链接点击效果
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 如果是当前页面链接，阻止默认行为
            if(link.getAttribute('href') === location.pathname.split('/').pop()) {
                e.preventDefault();
                alert('您已經在此頁面');
            }
        });
    });
    
    // 添加服务卡片点击事件
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h2').textContent.trim();
            
            // 根据卡片标题跳转到相应页面
            switch(cardTitle) {
                case '通知中心':
                    window.location.href = 'https://pppeee861005.github.io/building/notifications.html';
                    break;
                default:
                    alert('此功能即將推出');
            }
        });
    });
    
    // 检查通知
    checkNotifications();
});

// 检查通知
async function checkNotifications() {
    try {
        // 使用fetch API获取通知数据
        const response = await fetch('/api/supabase/notifications');
        const result = await response.json();
        
        if(result.data && result.data.length > 0) {
            showNotificationBadge(result.data.length);
        }
    } catch (error) {
        console.error('無法檢查通知:', error);
        
        // 使用静态数据作为回退
        showNotificationBadge(3); // 显示3条通知
    }
}

// 显示通知徽章
function showNotificationBadge(count) {
    // 创建通知徽章
    const notificationBadge = document.createElement('span');
    notificationBadge.className = 'notification-badge';
    notificationBadge.textContent = count;
    
    // 找到通知链接并添加徽章
    const notificationLink = document.querySelector('nav a[href="https://pppeee861005.github.io/building/notifications.html"]');
    if(notificationLink) {
        // 移除已有的徽章（如果有）
        const existingBadge = notificationLink.querySelector('.notification-badge');
        if(existingBadge) {
            notificationLink.removeChild(existingBadge);
        }
        
        notificationLink.appendChild(notificationBadge);
        
        // 添加闪烁效果
        notificationLink.classList.add('has-notifications');
    }
}
