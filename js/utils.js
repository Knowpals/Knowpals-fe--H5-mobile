// utils/request.js - H5版本
// 基础配置
const config = {
  baseUrl: 'https://student.knowpals.xyz',
  timeout: 60000
};

// 封装请求方法 - 与原小程序request.js一致
const request = {
  // 基础请求方法
  _request(method, url, data) {
    const token = localStorage.getItem('token') || '';
    const fullUrl = config.baseUrl + url;
    
    console.log('========== 请求开始 ==========');
    console.log('>>> 方法:', method);
    console.log('>>> URL:', fullUrl);
    console.log('>>> Token:', token ? token.substring(0, 20) + '...' : '无');
    console.log('================================');
    
    const headers = {
      'Authorization': token ? `Bearer ${token}` : ''
    };
    
    // 只有 POST/PUT/PATCH 请求才设置 Content-Type
    if (method !== 'GET' && method !== 'DELETE') {
      headers['Content-Type'] = 'application/json';
    }
    
    const options = {
      method: method,
      headers: headers,
      mode: 'cors'
    };
    
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }
    
    return fetch(fullUrl, options)
      .then(res => {
        console.log('>>> 状态码:', res.status);
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        } else if (res.status === 403 || res.status === 401) {
          console.error('>>> 认证失败!');
          return { code: res.status, data: null, msg: '认证失败，请重新登录' };
        } else {
          return { code: res.status, data: null, msg: '请求失败' };
        }
      })
      .then(data => {
        console.log('>>> 响应数据:', data);
        return data;
      })
      .catch(err => {
        console.error('>>> 请求失败:', err);
        return { code: -1, data: null, msg: '网络错误' };
      });
  },

  get(url, data = {}) {
    return this._request('GET', url, data);
  },

  post(url, data = {}) {
    return this._request('POST', url, data);
  },

  put(url, data = {}) {
    return this._request('PUT', url, data);
  },

  delete(url, data = {}) {
    return this._request('DELETE', url, data);
  }
};

// API接口层
const API = {
  // 用户相关
  user: {
    register: (data) => request.post('/api/v1/user/register', data),
    sendCode: (data) => request.post('/api/v1/user/sendCode', data),
    loginByCode: (data) => request.post('/api/v1/user/loginByCode', data),
    loginByPassword: (data) => request.post('/api/v1/user/loginByPassword', data),
    forgotPassword: (data) => request.post('/api/v1/user/forgotPassword', data),
    getUserInfo: () => request.get('/api/v1/user/getUserInfo')
  },
  
  // 班级相关
  class: {
    create: (data) => request.post('/api/v1/class/create', data),
    join: (data) => request.post('/api/v1/class/join', data),
    quit: (classId) => request.post(`/api/v1/class/quit/${classId}`),
    getMyCreated: () => request.get('/api/v1/class/my-created'),
    getMyJoined: () => request.get('/api/v1/class/my-joined'),
    getInfo: (classId) => request.get(`/api/v1/class/info/${classId}`),
    getStudents: (classId) => request.get(`/api/v1/class/students/${classId}`)
  },
  
  // 视频相关
  video: {
    getTasks: (classId) => request.get(`/api/v1/video/getTasks/${classId}`),
    getDetail: (videoId) => request.get(`/api/v1/video/getDetail/${videoId}`),
    postToClass: (data) => request.post('/api/v1/video/post-to-class', data),
    upload: (data) => request.post('/api/v1/video/upload', data)
  },
  
  // 行为相关
  behavior: {
    record: (data) => request.post('/api/v1/behavior/record', data),
    updateProgress: (data) => request.post('/api/v1/behavior/update-progress', data),
    getMyUnfinished: () => request.get('/api/v1/behavior/my/unfinished'),
    getClassProgress: (classId, status = 'all') => request.get(`/api/v1/behavior/class-progress/${classId}/${status}`),
    getClassProgressTodo: (classId) => request.get(`/api/v1/behavior/class-progress/${classId}/todo`)
  },
  
  // 题目相关
  question: {
    answer: (data) => request.post('/api/v1/question/answer', data),
    generate: (videoId) => request.get(`/api/v1/question/generate/${videoId}`)
  },
  
  // 统计相关
  stat: {
    getClassStat: (data) => request.post('/api/v1/stat/class', data),
    getStudentStat: (videoId) => request.get(`/api/v1/stat/student/${videoId}`),
    getStudentOverview: () => request.get('/api/v1/stat/student/overview')
  },
  
  // Agent AI相关
  agent: {
    chat: (data) => request.post('/api/v1/agent/chat', data),
    getHistory: (params = {}) => request.get('/api/v1/agent/history', params),
    generateQuiz: (data) => request.post('/api/v1/agent/quiz', data),
    generateReport: (data) => request.post('/api/v1/agent/report', data),
    getReport: (videoId) => request.get('/api/v1/agent/report', { video_id: videoId })
  }
};

// 页面跳转方法 - 模拟小程序wx.navigateTo
function navigateTo(url) {
  window.location.href = url;
}

// switchTab 跳转到tabBar页面
function switchTab(url) {
  // 去掉前缀路径
  window.location.href = url.replace('/pages/', '');
}

// 返回上一页
function navigateBack() {
  window.history.back();
}

// 重新加载到首页
function reLaunch(url) {
  window.location.href = url.replace('/pages/', '');
}

// 显示提示
function showToast(message, duration = 1500) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.7);
    color: #fff;
    padding: 15px 30px;
    border-radius: 8px;
    z-index: 9999;
    font-size: 14px;
    text-align: center;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// 显示加载中
function showLoading(title = '加载中...') {
  let loading = document.getElementById('loadingMask');
  if (loading) loading.remove();
  
  loading = document.createElement('div');
  loading.id = 'loadingMask';
  loading.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;
  loading.innerHTML = `<div style="background:#fff;padding:20px 40px;border-radius:8px;font-size:14px;">${title}</div>`;
  document.body.appendChild(loading);
}

function hideLoading() {
  const loading = document.getElementById('loadingMask');
  if (loading) loading.remove();
}

// 显示确认框
function showModal(options) {
  return new Promise((resolve) => {
    const { title = '提示', content = '', showCancel = true, confirmText = '确定' } = options;
    
    // 生成唯一 ID 避免冲突
    const modalId = 'modal_' + Date.now();
    const confirmId = 'modal_confirm_' + Date.now();
    const cancelId = 'modal_cancel_' + Date.now();
    
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;
    
    const box = document.createElement('div');
    box.style.cssText = `
      background: #fff;
      border-radius: 12px;
      width: 280px;
      overflow: hidden;
    `;
    
    box.innerHTML = `
      <div style="padding:20px;text-align:center;">
        <div style="font-size:16px;font-weight:bold;margin-bottom:10px;">${title}</div>
        <div style="font-size:14px;color:#666;line-height:1.5;">${content}</div>
      </div>
      <div style="display:flex;border-top:1px solid #eee;">
        ${showCancel ? `<button id="${cancelId}" style="flex:1;padding:15px;border:none;background:#fff;font-size:14px;color:#666;">取消</button>` : ''}
        <button id="${confirmId}" style="flex:1;padding:15px;border:none;background:#fff;font-size:14px;color:#7B68EE;font-weight:bold;">${confirmText}</button>
      </div>
    `;
    
    modal.appendChild(box);
    document.body.appendChild(modal);
    
    // 点击遮罩层也可关闭弹窗
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
        resolve({ confirm: false });
      }
    };
    
    // 使用动态 ID 获取按钮
    document.getElementById(confirmId).onclick = () => {
      modal.remove();
      resolve({ confirm: true });
    };
    
    if (showCancel) {
      document.getElementById(cancelId).onclick = () => {
        modal.remove();
        resolve({ confirm: false });
      };
    }
  });
}

// 获取页面参数
function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}
