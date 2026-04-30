// pages/class-detail/class-detail.js
// 引入请求模块
const request = require('../../utils/request.js');

// 页面状态
const state = {
  classes: [],
  currentClassId: null,
  pendingCount: 0,
  scrollHeight: 400,
  isLoading: true,
  isLoadingLock: false,
  isFromVideoPlay: false
};

// DOM元素
let classCountEl, classesGridEl, emptyStateEl, bottomNoticeEl, pendingCountEl, scrollContainerEl;

// 初始化
function init() {
  classCountEl = document.getElementById('classCount');
  classesGridEl = document.getElementById('classesGrid');
  emptyStateEl = document.getElementById('emptyState');
  bottomNoticeEl = document.getElementById('bottomNotice');
  pendingCountEl = document.getElementById('pendingCount');
  scrollContainerEl = document.getElementById('scrollContainer');

  calculateScrollHeight();
  loadClasses();

  // 绑定加入班级按钮
  document.getElementById('goToJoinClass').addEventListener('click', goToJoinClass);
  
  // 绑定底部通知点击
  bottomNoticeEl.addEventListener('click', goToPendingTasks);
}

// 加载班级数据
function loadClasses() {
  if (state.isLoadingLock) {
    console.log('⏳ 请求进行中，跳过重复调用');
    return;
  }
  
  state.isLoading = true;
  state.isLoadingLock = true;

  request.get('/api/v1/class/my-joined').then(res => {
    console.log('📡 获取班级列表响应:', res);

    let classes = [];
    let totalPending = 0;

    if ((res.code === 0 || res.code === 200) && res.data && res.data.class_list) {
      classes = res.data.class_list.map(c => ({
        id: c.class_id,
        name: c.class_name,
        teacherName: c.teacher_name,
        inviteCode: c.invite_code
      }));

      const todoPromises = classes.map(c =>
        request.get(`/api/v1/behavior/class-progress/${c.id}/todo`).then(todoRes => {
          if ((todoRes.code === 0 || todoRes.code === 200) && todoRes.data && todoRes.data.progress_list) {
            return todoRes.data.progress_list.length;
          }
          return 0;
        }).catch(() => 0)
      );

      return Promise.all(todoPromises).then(pendingCounts => {
        totalPending = pendingCounts.reduce((sum, count) => sum + count, 0);
        console.log('📋 处理后的班级列表:', classes);
        console.log('📊 待预习总数:', totalPending);
        
        state.classes = classes;
        state.pendingCount = totalPending;
        state.isLoading = false;
        state.isLoadingLock = false;
        
        render();
      });
    } else {
      state.classes = [];
      state.pendingCount = 0;
      state.isLoading = false;
      state.isLoadingLock = false;
      render();
    }
  }).catch(err => {
    console.error('❌ 获取班级列表失败:', err);
    state.isLoading = false;
    state.isLoadingLock = false;
    wxShowToast('获取班级列表失败');
  });
}

// 渲染页面
function render() {
  // 更新班级数量
  classCountEl.textContent = state.classes.length + ' 个';

  // 渲染班级列表
  if (state.classes.length === 0) {
    emptyStateEl.style.display = 'flex';
    classesGridEl.style.display = 'none';
  } else {
    emptyStateEl.style.display = 'none';
    classesGridEl.style.display = 'flex';
    
    classesGridEl.innerHTML = state.classes.map((item, index) => `
      <div class="class-card ${state.currentClassId === item.id ? 'active' : ''}" data-index="${index}">
        <div class="class-avatar">
          <span class="avatar-text">${item.name ? item.name.substring(0, 1) : '班'}</span>
        </div>
        <div class="class-content">
          <span class="class-name">${item.name}</span>
          <div class="class-teacher">
            <span class="teacher-icon">👨‍🏫</span>
            <span class="teacher-name">${item.teacherName}</span>
          </div>
          <div class="class-meta">
            <span class="meta-icon">👥</span>
            <span class="meta-text">${item.studentCount || 0}人</span>
          </div>
        </div>
      </div>
    `).join('');

    // 绑定班级卡片点击事件
    classesGridEl.querySelectorAll('.class-card').forEach(card => {
      card.addEventListener('click', function() {
        const index = parseInt(this.dataset.index);
        onClassTap(index);
      });
    });
  }

  // 显示底部通知
  if (state.pendingCount > 0) {
    bottomNoticeEl.style.display = 'flex';
    pendingCountEl.textContent = state.pendingCount;
  } else {
    bottomNoticeEl.style.display = 'none';
  }
}

// 计算滚动区域高度
function calculateScrollHeight() {
  const windowHeight = window.innerHeight;
  const statusBarHeight = 120;
  const statsHeight = 180;
  const bottomNoticeHeight = state.pendingCount > 0 ? 120 : 0;
  const bottomMargin = 40;
  
  const availableHeight = windowHeight - statusBarHeight - statsHeight - bottomNoticeHeight - bottomMargin;
  state.scrollHeight = Math.max(availableHeight, 300);

  if (scrollContainerEl) {
    scrollContainerEl.style.height = state.scrollHeight + 'px';
  }
}

// 点击班级卡片
function onClassTap(index) {
  const classData = state.classes[index];
  const classId = classData.id;
  
  console.log('点击班级:', classData.name);
  
  state.currentClassId = classId;
  
  wxNavigateTo({
    url: `/pages/class-course/class-course?classId=${classId}&className=${encodeURIComponent(classData.name)}`
  });
}

// 跳转到加入班级页面
function goToJoinClass() {
  wxNavigateTo({
    url: '/pages/join-class/join-class'
  });
}

// 跳转到未完成任务页面
function goToPendingTasks() {
  wxNavigateTo({
    url: '/pages/pending-tasks/pending-tasks'
  });
}

// 模拟wx.navigateTo
function wxNavigateTo(options) {
  const url = options.url.replace('/pages/', '').replace('/pages', '');
  window.location.href = url;
}

// 模拟wx.showToast
function wxShowToast(options) {
  const title = typeof options === 'string' ? options : options.title;
  alert(title);
}

// 页面显示时刷新数据
document.addEventListener('DOMContentLoaded', init);
