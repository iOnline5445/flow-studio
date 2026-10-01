// Google Flow Team Studio - Main Application Logic
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
    this.userSelect = document.getElementById("userSwitcherSelect");
    this.currentUserAvatar = document.getElementById("currentUserAvatar");
    this.currentUserName = document.getElementById("currentUserName");
    this.currentUserBadge = document.getElementById("currentUserBadge");

    this.dutyIcon = document.getElementById("dutyIcon");
    this.dutyTitle = document.getElementById("dutyTitle");
    this.dutyDesc = document.getElementById("dutyDesc");
    this.dutyPerms = document.getElementById("dutyPerms");

    this.navBtns = document.querySelectorAll(".nav-tab-btn");
    this.sections = document.querySelectorAll(".content-section");

    // Modal elements
    this.projectModal = document.getElementById("projectModal");
    this.promptModal = document.getElementById("promptModal");
    this.toast = document.getElementById("toastNotice");
  }

  bindEvents() {
    // User Switcher
    if (this.userSelect) {
      this.userSelect.addEventListener("change", (e) => {
        this.currentUserId = e.target.value;
        this.data.currentUserId = this.currentUserId;
        this.saveData();
        this.renderUserContext();
        this.render();
        this.showToast(`สลับการทำงานเป็น: ${this.getCurrentUser().name}`);
      });
    }

    // Navigation Tabs
    this.navBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
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

  switchTab(tabName) {
    this.activeTab = tabName;
    this.navBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
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
      this.currentUserBadge.textContent = user.role;
      this.currentUserBadge.className = `current-user-badge ${user.badgeClass}`;
    }

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
        <span class="perm-tag ${perms.canExport ? 'active-perm' : ''}">Export Google Flow Prompt</span>
      `;
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
      bufferText.textContent = `สะสมพร้อมตรวจ/โพสต์: ${bufferCount}/7 คลิป (${pct}%) — ${bufferCount >= 5 ? '✅ อยู่ในเกณฑ์มาตรฐาน' : '⚠️ ควรเพิ่มคลังสำรองให้ถึง 5-7 คลิป'}`;
    }

    // Recent Activity List
    const activityContainer = document.getElementById("dashboardRecentList");
    if (activityContainer) {
      activityContainer.innerHTML = this.data.projects.slice(0, 5).map(proj => {
        const author = this.data.users.find(u => u.id === proj.authorId) || { name: 'ทีมงาน', avatar: '👤' };
        return `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 16px;">${author.avatar}</span>
              <div>
                <div style="font-weight: 600; font-size: 12.5px; color: #FFF;">${proj.title}</div>
                <div style="font-size: 11px; color: var(--text-dim);">โดย ${author.name} • ${proj.scenes.length} ฉาก • ${proj.targetFormat}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
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
            <div style="font-size: 10.5px; color: var(--text-dim); margin-top: 4px;">⏱️ ${s.duration}</div>
            <div style="font-size: 9.5px; color: var(--text-muted); margin-top: 4px;">${s.shotType}</div>
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
        <div style="background: var(--bg-card-sub); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="status-badge ${this.getStatusBadgeClass(proj.status)}">${this.getStatusLabel(proj.status)}</span>
                <span style="font-size: 11px; color: var(--text-dim);">${proj.id}</span>
                <span style="font-size: 11px; background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; color: #9CA3AF;">${proj.reviewBufferTag}</span>
              </div>
              <h3 style="font-size: 15px; font-weight: 700; color: #FFFFFF;">${proj.title}</h3>
              <div style="font-size: 11.5px; color: var(--text-dim); margin-top: 2px;">
                ผู้สร้าง: ${author.avatar} ${author.name} • สร้างเมื่อ: ${proj.createdAt} • ช่องทาง: ${proj.channel}
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline btn-sm" onclick="app.copyAllPrompts('${proj.id}')">📋 รวม Prompt ทั้งหมด</button>
              <a href="${proj.flowUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald btn-sm">🚀 เปิดใน Google Flow</a>
            </div>
          </div>

          <div class="scene-cards-list">
            ${scenesHtml}
          </div>

          ${proj.managerComment ? `
            <div style="margin-top: 14px; padding: 10px 14px; background: rgba(5, 150, 105, 0.1); border: 1px solid rgba(5, 150, 105, 0.25); border-radius: var(--radius-sm); font-size: 11.5px;">
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
    if (!tbody) return;

    let filtered = this.data.projects;
    if (searchTerm) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm) || p.id.toLowerCase().includes(searchTerm));
    }

    const currentUser = this.getCurrentUser();
    const canApprove = currentUser.permissions.canApprove;

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
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 10.5px; font-weight: 600; color: #818CF8; background: rgba(99, 102, 241, 0.15); padding: 2px 7px; border-radius: 4px;">
              ${item.category}
            </span>
            <div style="display: flex; gap: 4px;">
              ${item.tags.map(t => `<span style="font-size: 9.5px; color: var(--text-dim); background: rgba(255,255,255,0.05); padding: 1px 5px; border-radius: 3px;">#${t}</span>`).join('')}
            </div>
          </div>
          <h4 style="font-size: 13.5px; font-weight: 600; color: #FFF; margin-bottom: 6px;">${item.title}</h4>
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 10px;">${item.useFor}</div>
          <div style="background: var(--bg-input); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-sm); padding: 10px; font-size: 11.5px; color: #D1D5DB; font-family: monospace; line-height: 1.4; max-height: 120px; overflow-y: auto;">
            ${item.prompt}
          </div>
        </div>
        <div style="margin-top: 14px; display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn btn-primary btn-sm" onclick="app.copyToClipboard('${escape(item.prompt)}', 'คัดลอก Prompt สำหรับ Google Flow แล้ว')">
            📋 คัดลอก Prompt
          </button>
        </div>
      </div>
    `).join('');
  }

  renderAssets() {
    const tbody = document.getElementById("assetsTableBody");
    if (!tbody) return;

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

  // Helper Methods
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

  openNewProjectModal() {
    if (this.projectModal) {
      this.projectModal.classList.add("active");
    }
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
