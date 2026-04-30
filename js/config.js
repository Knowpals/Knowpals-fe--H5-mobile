// H5 版本配置文件
const CONFIG = {
  // API 基础地址（修改为你的后端地址）
  BASE_URL: 'http://localhost:8080',
  
  // 存储键名
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER_INFO: 'userInfo'
  }
};

// 获取 token
function getToken() {
  return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
}

// 设置 token
function setToken(token) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
}

// 获取用户信息
function getUserInfo() {
  const info = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_INFO);
  return info ? JSON.parse(info) : null;
}

// 设置用户信息
function setUserInfo(info) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.USER_INFO, JSON.stringify(info));
}

// 清除登录信息
function clearLogin() {
  localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
  localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_INFO);
}

// 检查是否登录
function isLoggedIn() {
  return !!getToken();
}

// 跳转到登录页
function goToLogin() {
  window.location.href = '/pages/login.html';
}

// 通用 fetch 请求封装
async function request(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const token = getToken();
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(CONFIG.BASE_URL + url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });
  
  if (response.status === 401) {
    clearLogin();
    goToLogin();
    throw new Error('请先登录');
  }
  
  return response.json();
}

// GET 请求
function get(url, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return request(fullUrl, { method: 'GET' });
}

// POST 请求
function post(url, data) {
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 显示提示信息
function showToast(message, duration = 2000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.75);
      color: #fff;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10000;
      font-size: 14px;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, duration);
}

// 显示加载中
function showLoading(text = '加载中...') {
  let loading = document.getElementById('loading');
  if (!loading) {
    loading = document.createElement('div');
    loading.id = 'loading';
    loading.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    loading.innerHTML = '<div style="background:#fff;padding:20px 40px;border-radius:8px;color:#333;">' + text + '</div>';
    document.body.appendChild(loading);
  }
  loading.style.display = 'flex';
}

// 隐藏加载
function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'none';
  }
}
