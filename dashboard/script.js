// 这里存的是你密码的 SHA-256 指纹 (不可逆)
// 假设密码为 123456，其对应的 SHA-256 值如下：
const CORRECT_HASH = "74a49c698dbd3c12e36b0b287447d833f74f3937ff132ebff7054baa18623c35a705bb18b82e2ac0384b5127db97016e63609f712bc90e3506cfbea97599f46f";

async function verifyPassword(password) {
    // 1. 将输入的密码转换为字节数组
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // 2. 使用 Web Crypto API 计算 SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // 3. 将 Buffer 转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // 4. 比对指纹
    return hashHex === CORRECT_HASH;
}

// 在登录按钮逻辑中使用：
async function onLoginClick() {
    const userInput = document.getElementById("password-input").value;
    if (await verifyPassword(userInput)) {
        // 登录成功，跳转到工作台
        window.location.href = "/dashboard/content.html";
    } else {
        alert("密码错误！");
    }
}
