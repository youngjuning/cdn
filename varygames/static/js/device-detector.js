function isMobileDevice() {
    // 获取userAgent字符串
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // 使用正则表达式检查移动设备标识
    var mobile = /windows phone|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent.toLowerCase());

    return mobile;
}

// 检测设备类型并重定向
function redirectBasedOnDevice() {
    if (isMobileDevice()) {
        window.location.href = "mobile/index.html";
    } else {
        window.location.href = "pc/index.html";
    }
}

// 如果当前页面是根目录，则执行重定向
if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    redirectBasedOnDevice();
} 