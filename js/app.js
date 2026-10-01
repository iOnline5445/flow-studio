// Google Flow Team Studio - Main Application Logic (Responsive & Mobile-ready)
class FlowStudioApp {
  constructor() {
    this.storageKey = "google_flow_studio_state_v1";
    this.data = this.loadData();
    this.currentUserId = this.data.currentUserId || "admin";
    this.activeTab = "dashboard";
    this.selectedProject = null;

    this.initElements();
    this.bindEvents();
    this.render();
  }

  loadData() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse storage, using initial data", e);
      }
    }
    return {
      currentUserId: "admin",
      users: INITIAL_DATA.users,
      projects: INITIAL_DATA.projects,
      promptPresets: INITIAL_DATA.promptPresets,
      assets: INITIAL_DATA.assets
    };
  }

  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  getCurrentUser() {
    return this.data.users.find(u => u.id === this.currentUserId) || this.data.users[0];
  }

  initElements() {
    // Desktop & Mobile user switcher
    this.userSelect = document.getElementById("userSwitcherSelect");
    this.currentUserAvatar = document.getElementById("currentUserAvatar");
    this.currentUserName = document.getElementById("currentUserName");
    this.currentUserBadge = document.getElementById("currentUserBadge");

    this.mobileUserAvatar = document.getElementById("mobileUserAvatar");
    this.mobileUserName = document.getElementById("mobileUserName");

    this.dutyIcon = document.getElementById("dutyIcon");
    this.dutyTitle = document.getElementById("dutyTitle");
    this.dutyDesc = document.getElementById("dutyDesc");
    this.dutyPerms = document.getElementById("dutyPerms");

    this.navBtns = document.querySelectorAll(".nav-tab-btn");
    this.bottomNavItems = document.querySelectorAll(".bottom-nav-item");
    this.sections = document.querySelectorAll(".content-section");

    // Modal elements
    this.userModal = document.getElementById("userModal");
    this.projectModal = document.getElementById("projectModal");
    this.promptModal = document.getElementById("promptModal");
    this.toast = document.getElementById("toastNotice");
  }

  bindEvents() {
    // User Switcher (Desktop Select)
    if (this.userSelect) {
      this.userSelect.addEventListener("change", (e) => {
        this.switchUser(e.target.value);
      });
    }

    // Navigation Tabs (Desktop)
    this.navBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    // Bottom Navigation Bar (Mobile)
    this.bottomNavItems.forEach(item => {
      item.addEventListener("click", () => {
        this.switchTab(item.dataset.tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Search inputs
    const promptSearch = document.getElementById("promptSearchInput");
    if (promptSearch) {
      promptSearch.addEventListener("input", (e) => {
        this.renderPromptPresets(e.target.value.trim().toLowerCase());
      });
    }

    const reviewSearch = document.getElementById("reviewSearchInput");
    if (reviewSearch) {
      reviewSearch.addEventListener("input", (e) => {
        this.renderReviewTable(e.target.value.trim().toLowerCase());
      });
    }
  }

  switchUser(userId) {
    this.currentUserId = userId;
    this.data.currentUserId = this.currentUserId;
    this.saveData();
    this.renderUserContext();
    this.render();
    this.closeModal("userModal");
    this.showToast(`สลับโปรไฟล์เป็น: ${this.getCurrentUser().name}`);
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    // Update Desktop Nav
    this.navBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
    // Update Mobile Bottom Nav
    this.bottomNavItems.forEach(item => {
      item.classList.toggle("active", item.dataset.tab === tabName);
    });
    // Toggle Sections
    this.sections.forEach(sec => {
      sec.classList.toggle("active", sec.id === `section-${tabName}`);
    });
    this.render();
  }

  showToast(message) {
    if (!this.toast) return;
    this.toast.textContent = message;
    this.toast.style.display = "block";
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast.style.display = "none";
    }, 2500);
  }

  render() {
    this.renderUserContext();
    if (this.activeTab === "dashboard") {
      this.renderDashboard();
    } else if (this.activeTab === "storyboards") {
      this.renderStoryboards();
    } else if (this.activeTab === "review") {
      this.renderReviewTable();
    } else if (this.activeTab === "prompts") {
      this.renderPromptPresets();
    } else if (this.activeTab === "assets") {
      this.renderAssets();
    }
  }

  renderUserContext() {
    const user = this.getCurrentUser();
    if (this.userSelect) {
      this.userSelect.value = user.id;
    }
    if (this.currentUserAvatar) this.currentUserAvatar.textContent = user.avatar;
    if (this.currentUserName) this.currentUserName.textContent = user.name;
    if (this.currentUserBadge) {
      this.currentUserBadge.textContent = user.role.split(' ')[0] || user.role;
      this.currentUserBadge.className = `current-user-badge ${user.badgeClass}`;
    }

    if (this.mobileUserAvatar) this.mobileUserAvatar.textContent = user.avatar;
    if (this.mobileUserName) this.mobileUserName.textContent = user.name.split(' ')[0] || user.name;

    // Role Duty Banner
    if (this.dutyIcon) this.dutyIcon.textContent = user.avatar;
    if (this.dutyTitle) this.dutyTitle.textContent = `${user.name} — ${user.role}`;
    if (this.dutyDesc) this.dutyDesc.textContent = user.description;

    if (this.dutyPerms) {
      const perms = user.permissions;
      this.dutyPerms.innerHTML = `
        <span class="perm-tag ${perms.canCreate ? 'active-perm' : ''}">สร้าง Storyboard</span>
        <span class="perm-tag ${perms.canApprove ? 'active-perm' : ''}">อนุมัติงาน (Review Gate)</span>
        <span class="perm-tag ${perms.canAuditCompliance ? 'active-perm' : ''}">ตรวจข้อห้ามเคลมเกินจริง</span>
        <span class="perm-tag ${perms.canExport ? 'active-perm' : ''}">Export Veo Prompt</span>
      `;
    }

    // Render User Selection Modal List
    const userListContainer = document.getElementById("userSelectionList");
    if (userListContainer) {
      userListContainer.innerHTML = this.data.users.map(u => `
        <div onclick="app.switchUser('${u.id}')" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: ${u.id === user.id ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)'}; border: 1px solid ${u.id === user.id ? 'var(--color-primary)' : 'var(--border-color)'}; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">${u.avatar}</span>
            <div>
              <div style="font-weight: 700; font-size: 12.5px; color: #FFF;">${u.name}</div>
              <div style="font-size: 11px; color: var(--text-dim);">${u.role}</div>
            </div>
          </div>
          ${u.id === user.id ? '<span style="color: #818CF8; font-size: 14px;">✓</span>' : ''}
        </div>
      `).join('');
    }
  }

  renderDashboard() {
    const totalProjects = this.data.projects.length;
    const pendingCount = this.data.projects.filter(p => p.status === "pending_review").length;
    const approvedCount = this.data.projects.filter(p => p.status === "approved").length;
    const totalAssets = this.data.assets.length;

    document.getElementById("statTotalProjects").textContent = totalProjects;
    document.getElementById("statPendingReview").textContent = pendingCount;
    document.getElementById("statApproved").textContent = approvedCount;
    document.getElementById("statAssets").textContent = totalAssets;

    // Buffer Status Notice (Rules: buffer of 5-7 clips)
    const bufferCount = approvedCount + pendingCount;
    const bufferBar = document.getElementById("bufferProgressBar");
    const bufferText = document.getElementById("bufferStatusText");
    if (bufferBar && bufferText) {
      const pct = Math.min(100, Math.round((bufferCount / 7) * 100));
      bufferBar.style.width = `${pct}%`;
      bufferText.textContent = `สะสม: ${bufferCount}/7 คลิป (${pct}%) — ${bufferCount >= 5 ? '✅ พอดีเกณฑ์' : '⚠️ ควรเพิ่มคลังสำรอง'}`;
    }

    // Recent Activity List
    const activityContainer = document.getElementById("dashboardRecentList");
    if (activityContainer) {
      activityContainer.innerHTML = this.data.projects.slice(0, 5).map(proj => {
        const author = this.data.users.find(u => u.id === proj.authorId) || { name: 'ทีมงาน', avatar: '👤' };
        return `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 10px; min-width: 200px; flex: 1;">
              <span style="font-size: 18px;">${author.avatar}</span>
              <div>
                <div style="font-weight: 600; font-size: 12.5px; color: #FFF;">${proj.title}</div>
                <div style="font-size: 11px; color: var(--text-dim);">${author.name} • ${proj.scenes.length} ฉาก • ${proj.targetFormat}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="status-badge ${this.getStatusBadgeClass(proj.status)}">${this.getStatusLabel(proj.status)}</span>
              <button class="btn btn-outline btn-sm" onclick="app.viewProject('${proj.id}')">ดูรายละเอียด</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  renderStoryboards() {
    const list = document.getElementById("storyboardProjectsList");
    if (!list) return;

    list.innerHTML = this.data.projects.map(proj => {
      const author = this.data.users.find(u => u.id === proj.authorId) || { name: 'ทีมงาน', avatar: '👤' };
      const scenesHtml = proj.scenes.map(s => `
        <div class="scene-card">
          <div class="scene-num-badge">
            <div>Scene ${s.sceneNumber}</div>
            <div style="font-size: 10.5px; color: var(--text-dim);">⏱️ ${s.duration}</div>
            <div style="font-size: 9.5px; color: var(--text-muted);">${s.shotType}</div>
          </div>
          <div class="scene-detail-box">
            <div class="scene-box-label">
              <span>Google Veo Prompt (Visual)</span>
              <button class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 10px;" onclick="app.copyToClipboard('${escape(s.visualPrompt)}', 'คัดลอก Prompt สำหรับ Veo แล้ว')">
                📋 คัดลอก
              </button>
            </div>
            <div class="scene-box-content">${s.visualPrompt}</div>
          </div>
          <div class="scene-detail-box">
            <div class="scene-box-label">
              <span>Voiceover (เสียงคุณเก๋)</span>
              <span style="font-size: 9.5px; color: #F472B6;">Premwadee (-15%)</span>
            </div>
            <div class="scene-box-content" style="color: #FDE047;">"${s.script}"</div>
          </div>
          <div class="scene-detail-box">
            <div class="scene-box-label">
              <span>Mood / Flow Music</span>
            </div>
            <div class="scene-box-content" style="font-size: 11px; color: var(--text-muted);">${s.audioMood}</div>
          </div>
        </div>
      `).join('');

      return `
        <div style="background: var(--bg-card-sub); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <div>
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px; flex-wrap: wrap;">
                <span class="status-badge ${this.getStatusBadgeClass(proj.status)}">${this.getStatusLabel(proj.status)}</span>
                <span style="font-size: 11px; color: var(--text-dim);">${proj.id}</span>
                <span style="font-size: 10.5px; background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; color: #9CA3AF;">${proj.reviewBufferTag}</span>
              </div>
              <h3 style="font-size: 14.5px; font-weight: 700; color: #FFFFFF;">${proj.title}</h3>
              <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">
                โดย: ${author.avatar} ${author.name} • ${proj.createdAt} • ${proj.targetFormat}
              </div>
            </div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="btn btn-outline btn-sm" onclick="app.copyAllPrompts('${proj.id}')">📋 รวม Prompt</button>
              <a href="${proj.flowUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm">🚀 เปิดใน Flow</a>
            </div>
          </div>

          <div class="scene-cards-list">
            ${scenesHtml}
          </div>

          ${proj.managerComment ? `
            <div style="margin-top: 12px; padding: 10px 12px; background: rgba(5, 150, 105, 0.1); border: 1px solid rgba(5, 150, 105, 0.25); border-radius: var(--radius-sm); font-size: 11.5px;">
              <span style="font-weight: 600; color: #34D399;">💬 ข้อคิดเห็นจากผู้จัดการ/คุณบอส:</span>
              <span style="color: #E5E7EB; margin-left: 6px;">${proj.managerComment}</span>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  renderReviewTable(searchTerm = "") {
    const tbody = document.getElementById("reviewTableBody");
    const mobileCards = document.getElementById("reviewMobileCards");
    if (!tbody && !mobileCards) return;

    let filtered = this.data.projects;
    if (searchTerm) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm) || p.id.toLowerCase().includes(searchTerm));
    }

    const currentUser = this.getCurrentUser();
    const canApprove = currentUser.permissions.canApprove;

    // Desktop Table Rows
    if (tbody) {
      tbody.innerHTML = filtered.map(proj => {
        const author = this.data.users.find(u => u.id === proj.authorId) || { name: 'ทีมงาน', avatar: '👤' };
        const dateParts = proj.createdAt.split(' ');
        const dateStr = dateParts[0] || '';
        const timeStr = dateParts[1] || '';

        return `
          <tr>
            <td style="font-weight: 600; color: #9CA3AF; width: 85px;">${proj.id}</td>
            <td>
              <div style="font-weight: 600; color: #FFFFFF; font-size: 12.5px;">${proj.title}</div>
              <div style="font-size: 11px; color: var(--text-dim);">${proj.scenes.length} ฉาก • ${proj.targetFormat}</div>
            </td>
            <td style="width: 130px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span>${author.avatar}</span>
                <span style="font-size: 11.5px;">${author.name}</span>
              </div>
            </td>
            <td style="width: 100px;">
              <div class="date-twoline">
                <span class="date-part">${dateStr}</span>
                <span class="time-part">${timeStr}</span>
              </div>
            </td>
            <td style="width: 110px;">
              <span class="status-badge ${this.getStatusBadgeClass(proj.status)}">${this.getStatusLabel(proj.status)}</span>
            </td>
            <td class="col-hide-md" style="width: 130px;">
              <span style="font-size: 11px; color: ${proj.complianceStatus === 'passed' ? '#34D399' : '#FBBF24'};">
                ${proj.complianceStatus === 'passed' ? '🛡️ ผ่านเกณฑ์ (No Overclaim)' : '⚠️ รอตรวจสอบ'}
              </span>
            </td>
            <td style="width: 160px; text-align: right;">
              <div style="display: flex; justify-content: flex-end; gap: 6px;">
                ${canApprove && proj.status !== 'approved' ? `
                  <button class="btn btn-emerald btn-sm" onclick="app.approveProject('${proj.id}')" title="อนุมัติ">
                    ✓ อนุมัติ
                  </button>
                  <button class="btn btn-danger-outline btn-sm" onclick="app.requestChanges('${proj.id}')" title="ขอแก้ไข">
                    ✕ แก้ไข
                  </button>
                ` : `
                  <button class="btn btn-outline btn-sm" onclick="app.viewProject('${proj.id}')">
                    👁️ ดูรายละเอียด
                  </button>
                `}
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Mobile Card List (Touch-friendly for smartphones)
    if (mobileCards) {
      mobileCards.innerHTML = filtered.map(proj => {
        const author = this.data.users.find(u => u.id === proj.authorId) || { name: 'ทีมงาน', avatar: '👤' };
        return `
          <div class="mobile-data-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; color: var(--text-dim); font-weight: 600;">${proj.id}</span>
              <span class="status-badge ${this.getStatusBadgeClass(proj.status)}">${this.getStatusLabel(proj.status)}</span>
            </div>
            <div style="font-weight: 700; font-size: 13px; color: #FFFFFF;">${proj.title}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--text-dim); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
              <div style="display: flex; align-items: center; gap: 4px;">
                <span>${author.avatar}</span>
                <span>${author.name}</span>
              </div>
              <span>${proj.createdAt}</span>
            </div>
            <div style="font-size: 10.5px; color: ${proj.complianceStatus === 'passed' ? '#34D399' : '#FBBF24'};">
              ${proj.complianceStatus === 'passed' ? '🛡️ ผ่านเกณฑ์ อย./ไม่เคลมเกินจริง' : '⚠️ รอตรวจข้อความ'}
            </div>
            <div style="display: flex; gap: 8px; margin-top: 4px;">
              ${canApprove && proj.status !== 'approved' ? `
                <button class="btn btn-emerald btn-sm" style="flex: 1;" onclick="app.approveProject('${proj.id}')">✓ อนุมัติ</button>
                <button class="btn btn-danger-outline btn-sm" style="flex: 1;" onclick="app.requestChanges('${proj.id}')">✕ ขอแก้ไข</button>
              ` : `
                <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="app.viewProject('${proj.id}')">👁️ ดูรายละเอียดสตอรี่บอร์ด</button>
              `}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  renderPromptPresets(searchTerm = "") {
    const container = document.getElementById("promptPresetsGrid");
    if (!container) return;

    let filtered = this.data.promptPresets;
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm) || 
        p.prompt.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    }

    container.innerHTML = filtered.map(item => `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 10px; font-weight: 600; color: #818CF8; background: rgba(99, 102, 241, 0.15); padding: 2px 6px; border-radius: 4px;">
              ${item.category}
            </span>
            <div style="display: flex; gap: 4px;">
              ${item.tags.map(t => `<span style="font-size: 9px; color: var(--text-dim); background: rgba(255,255,255,0.05); padding: 1px 4px; border-radius: 3px;">#${t}</span>`).join('')}
            </div>
          </div>
          <h4 style="font-size: 13px; font-weight: 600; color: #FFF; margin-bottom: 4px;">${item.title}</h4>
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px;">${item.useFor}</div>
          <div style="background: var(--bg-input); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-sm); padding: 8px 10px; font-size: 11px; color: #D1D5DB; font-family: monospace; line-height: 1.4; max-height: 100px; overflow-y: auto;">
            ${item.prompt}
          </div>
        </div>
        <div style="margin-top: 12px; display: flex; justify-content: flex-end;">
          <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="app.copyToClipboard('${escape(item.prompt)}', 'คัดลอก Prompt แล้ว')">
            📋 คัดลอก Prompt
          </button>
        </div>
      </div>
    `).join('');
  }

  renderAssets() {
    const tbody = document.getElementById("assetsTableBody");
    const mobileCards = document.getElementById("assetsMobileCards");
    if (!tbody && !mobileCards) return;

    if (tbody) {
      tbody.innerHTML = this.data.assets.map(asset => `
        <tr>
          <td style="font-weight: 600; color: #FFFFFF;">${asset.name}</td>
          <td>
            <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.08); text-transform: uppercase;">
              ${asset.type}
            </span>
          </td>
          <td>${asset.dimensions}</td>
          <td>${asset.duration}</td>
          <td>${asset.size}</td>
          <td><span style="color: #818CF8;">${asset.source}</span></td>
          <td><span class="status-badge status-approved">${asset.status}</span></td>
        </tr>
      `).join('');
    }

    if (mobileCards) {
      mobileCards.innerHTML = this.data.assets.map(asset => `
        <div class="mobile-data-card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; font-size: 12px; color: #FFF;">${asset.name}</span>
            <span class="status-badge status-approved">${asset.status}</span>
          </div>
          <div style="font-size: 11px; color: var(--text-dim); display: flex; gap: 8px; flex-wrap: wrap;">
            <span>ชนิด: ${asset.type.toUpperCase()}</span>
            <span>ขนาด: ${asset.size}</span>
            <span>ความยาว: ${asset.duration}</span>
          </div>
          <div style="font-size: 10.5px; color: #818CF8;">สร้างโดย: ${asset.source}</div>
        </div>
      `).join('');
    }
  }

  // Helpers
  getStatusBadgeClass(status) {
    switch (status) {
      case "draft": return "status-draft";
      case "pending_review": return "status-pending";
      case "approved": return "status-approved";
      case "published": return "status-published";
      default: return "status-draft";
    }
  }

  getStatusLabel(status) {
    switch (status) {
      case "draft": return "📝 ร่างฉบับ";
      case "pending_review": return "⏳ รอตรวจ (Queue)";
      case "approved": return "✅ อนุมัติแล้ว";
      case "published": return "🚀 โพสต์แล้ว";
      default: return status;
    }
  }

  approveProject(id) {
    const proj = this.data.projects.find(p => p.id === id);
    if (!proj) return;
    proj.status = "approved";
    proj.managerComment = `อนุมัติแล้วเมื่อ ${new Date().toLocaleTimeString()} โดย ${this.getCurrentUser().name}`;
    this.saveData();
    this.render();
    this.showToast(`อนุมัติโครงการ ${proj.id} เรียบร้อยแล้ว`);
  }

  requestChanges(id) {
    const reason = prompt("กรุณาระบุสิ่งที่ต้องการให้ทีมงานปรับปรุงแก้ไข:");
    if (!reason) return;
    const proj = this.data.projects.find(p => p.id === id);
    if (!proj) return;
    proj.status = "draft";
    proj.managerComment = `ขอแก้ไข: ${reason} (โดย ${this.getCurrentUser().name})`;
    this.saveData();
    this.render();
    this.showToast(`ส่งข้อคิดเห็นขอแก้ไข ${proj.id} แล้ว`);
  }

  copyToClipboard(encodedText, successMsg) {
    const text = unescape(encodedText);
    navigator.clipboard.writeText(text).then(() => {
      this.showToast(successMsg || "คัดลอกลง Clipboard เรียบร้อยแล้ว");
    }).catch(err => {
      console.error(err);
      this.showToast("เกิดข้อผิดพลาดในการคัดลอก");
    });
  }

  copyAllPrompts(projectId) {
    const proj = this.data.projects.find(p => p.id === projectId);
    if (!proj) return;
    const combined = proj.scenes.map(s => `[Scene ${s.sceneNumber} - ${s.duration} - ${s.shotType}]\nVisual Prompt: ${s.visualPrompt}\nVoiceover (${proj.ttsConfig.hostName}): "${s.script}"\nAudio Mood: ${s.audioMood}\n`).join("\n---\n\n");
    navigator.clipboard.writeText(combined).then(() => {
      this.showToast(`คัดลอก Prompt ทุก Scene ของ ${proj.id} แล้ว`);
    });
  }

  viewProject(id) {
    this.switchTab("storyboards");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  openUserModal() {
    if (this.userModal) this.userModal.classList.add("active");
  }

  openNewProjectModal() {
    if (this.projectModal) this.projectModal.classList.add("active");
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("active");
  }

  saveNewProjectFromModal() {
    const title = document.getElementById("newProjTitle").value.trim();
    const format = document.getElementById("newProjFormat").value;
    const prompt1 = document.getElementById("newProjPrompt1").value.trim();
    const script1 = document.getElementById("newProjScript1").value.trim();

    if (!title) {
      alert("กรุณากรอกชื่อคลิป/โครงการ");
      return;
    }

    const newId = `PROJ-${String(this.data.projects.length + 1).padStart(3, '0')}`;
    const newProj = {
      id: newId,
      title: title,
      channel: "leanbybenz",
      targetFormat: format,
      authorId: this.currentUserId,
      status: "pending_review",
      reviewBufferTag: `Buffer ${this.data.projects.length + 1}/7`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      complianceStatus: "passed",
      complianceNotes: "ผ่านการตรวจสอบคำเคลมเบื้องต้น",
      ttsConfig: {
        voice: "th-TH-PremwadeeNeural",
        rate: "-15%",
        hostName: "คุณเก๋",
        brandAudio: "ลีน บาย เบนซ์"
      },
      scenes: [
        {
          sceneNumber: 1,
          duration: "4s",
          shotType: "Hook",
          visualPrompt: prompt1 || "Cinematic 9:16 vertical video of wellness lifestyle, morning light, high definition 4K Google Veo.",
          script: script1 || "ยินดีต้อนรับสู่ ลีน บาย เบนซ์ กับคุณเก๋นะคะ",
          audioMood: "Warm Acoustic Rhythms"
        }
      ],
      managerComment: "",
      flowUrl: "https://labs.google/flow",
      assetsCount: 0
    };

    this.data.projects.unshift(newProj);
    this.saveData();
    this.closeModal("projectModal");
    this.render();
    this.showToast(`สร้าง Storyboard ${newId} สำเร็จ`);
  }
}

// Global instance
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new FlowStudioApp();
});
