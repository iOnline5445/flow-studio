// Google Flow Team Studio - Initial Mock & Configuration Data
const INITIAL_DATA = {
  users: [
    {
      id: "admin",
      name: "คุณกรองเกียรติ (ผม)",
      role: "Admin & Executive Producer",
      avatar: "👑",
      color: "#6366F1", // Indigo
      badgeClass: "badge-admin",
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canApprove: true,
        canExport: true,
        canManageUsers: true,
        canAuditCompliance: true
      },
      description: "ผู้ดูแลระบบและควบคุมการผลิตทั้งหมด กำกับภาพรวม เชื่อมโยงทีมงานทุกฝ่าย"
    },
    {
      id: "boss",
      name: "คุณบอส",
      role: "Executive Approver & Manager",
      avatar: "💼",
      color: "#059669", // Emerald
      badgeClass: "badge-boss",
      permissions: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canApprove: true,
        canExport: true,
        canManageUsers: false,
        canAuditCompliance: true
      },
      description: "ผู้อนุมัติงานขั้นสุดท้าย (Review & Approval Gatekeeper) ตรวจสอบความถูกต้องและทิศทางก่อนโพสต์จริง"
    },
    {
      id: "lean",
      name: "คุณลีน",
      role: "Nutrition Strategist & Brand Lead",
      avatar: "🥗",
      color: "#10B981", // Teal/Green
      badgeClass: "badge-lean",
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canApprove: false,
        canExport: true,
        canManageUsers: false,
        canAuditCompliance: true
      },
      description: "ผู้เชี่ยวชาญด้านโภชนาการ leanbybenz ตรวจสอบเนื้อหาวิชาการ ป้องกันคำเคลมเกินจริงตามกฎหมาย/อย."
    },
    {
      id: "kae",
      name: "คุณเก๋",
      role: "Creative Director & Host Persona",
      avatar: "🎙️",
      color: "#EC4899", // Rose/Pink
      badgeClass: "badge-kae",
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canApprove: false,
        canExport: true,
        canManageUsers: false,
        canAuditCompliance: false
      },
      description: "ผู้วาง Storyboard และบทพากย์เสียงเอกลักษณ์คุณเก๋ นุ่มนวล อบอุ่น เป็นมิตร สื่อสารเข้าใจง่าย"
    },
    {
      id: "cod",
      name: "คุณคอด",
      role: "Lead Developer & AI Prompt Engineer",
      avatar: "💻",
      color: "#0284C7", // Sky/Blue
      badgeClass: "badge-cod",
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canApprove: false,
        canExport: true,
        canManageUsers: false,
        canAuditCompliance: false
      },
      description: "วิศวกร AI และระบบ ปรับแต่ง Google Veo/Imagen Prompt ให้ภาพคมชัดตรงสไตล์ พร้อมดูแล Automation"
    }
  ],

  projects: [
    {
      id: "PROJ-001",
      title: "5 สัญญาณเตือนร่างกายเริ่มขาดโปรตีน โดยไม่รู้ตัว",
      channel: "leanbybenz",
      targetFormat: "TikTok / Reels / YouTube Shorts (9:16)",
      authorId: "kae",
      status: "pending_review", // draft, pending_review, approved, published
      reviewBufferTag: "Buffer 1/7",
      createdAt: "2026-09-30 14:30",
      complianceStatus: "passed", // passed, warning, unverified
      complianceNotes: "ผ่านเกณฑ์ ไม่มีการเคลมระยะเวลารักษา ใช้คำว่า 'การปรับสมดุลโภชนาการ'",
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
          shotType: "Hook / Close-up",
          visualPrompt: "Cinematic close-up of a tired office worker rubbing temple, soft natural morning window light, high details, realistic skin texture, 4K shot, Google Veo smooth pan.",
          script: "เคยรู้สึกไหมคะ ตื่นนอนมาแล้วเพลีย สมองล้า ทั้งที่นอนพอ... บางทีร่างกายอาจไม่ได้แค่เหนื่อย แต่กำลังขาดสิ่งนี้ค่ะ",
          audioMood: "Soft Warm Acoustic Guitar, curious tempo"
        },
        {
          sceneNumber: 2,
          duration: "6s",
          shotType: "Body / Nutrition Focus",
          visualPrompt: "Photorealistic macro shot of clean plant-based protein shake and fresh organic almonds on warm wooden table, morning sunlight, dust motes, studio commercial quality, 60fps.",
          script: "โปรตีนคือโครงสร้างหลักของฮอร์โมนและกล้ามเนื้อ ถ้าเราทานไม่ถึง ร่างกายจะดึงพลังงานสะรองมาใช้จนระบบเผาผลาญชะลอตัวลงค่ะ",
          audioMood: "Inspiring Gentle Rhythm"
        },
        {
          sceneNumber: 3,
          duration: "5s",
          shotType: "Host Kae / Helpful Advice",
          visualPrompt: "Thai female health expert 'Khun Kae' around 35 years old, warm friendly smile, modern white and sage-green wellness kitchen, explaining with hands softly gesturing, crisp bokeh.",
          script: "ลองเริ่มง่ายๆ วันนี้ ด้วยการเช็คโปรตีนในแต่ละมื้อให้อย่างน้อย 1 ฝ่ามือ แล้วสังเกตความสดชื่นใน 3 วันดูนะคะ",
          audioMood: "Uplifting Calm Tone"
        },
        {
          sceneNumber: 4,
          duration: "3s",
          shotType: "Call to Action / Outro",
          visualPrompt: "Minimalist pastel green motion graphic with clean logo 'leanbybenz' in soft modern font, warm organic vibe, 4K smooth fade.",
          script: "กดติดตาม ลีน บาย เบนซ์ เพื่อสุขภาพและหุ่นดีอย่างยั่งยืนไปด้วยกันนะคะ",
          audioMood: "Friendly Chime Outro"
        }
      ],
      managerComment: "เนื้อหาดีมาก น้ำเสียงกำลังดี รอนำเข้าเจนวิดีโอบน Google Flow แล้วส่งตรวจคลิปเต็ม",
      flowUrl: "https://labs.google/flow",
      assetsCount: 3
    },
    {
      id: "PROJ-002",
      title: "ทำไมกินน้อยแต่น้ำหนักไม่ลด? ปลดล็อคระบบเผาผลาญ",
      channel: "leanbybenz",
      targetFormat: "9:16 Vertical Video",
      authorId: "lean",
      status: "approved",
      reviewBufferTag: "Buffer 2/7",
      createdAt: "2026-09-29 11:15",
      complianceStatus: "passed",
      complianceNotes: "ไม่การันตีกิโลกรัม เน้นอธิบายกลไก Starvation Mode ถูกต้องตามหลักการแพทย์",
      ttsConfig: {
        voice: "th-TH-PremwadeeNeural",
        rate: "-15%",
        hostName: "คุณเก๋",
        brandAudio: "ลีน บาย เบนซ์"
      },
      scenes: [
        {
          sceneNumber: 1,
          duration: "5s",
          shotType: "Hook",
          visualPrompt: "Split screen comparison of salad bowl vs full balanced meal plate, bright clean aesthetic, studio lighting, hyperrealistic, 4K.",
          script: "อดข้าว เย็นไม่กิน แต่ทำไมตาชั่งไม่ขยับเลย? วันนี้เก๋มีคำตอบจากวิทยาศาสตร์ระบบเผาผลาญมาเล่าให้ฟังค่ะ",
          audioMood: "Soft Synth Intro"
        },
        {
          sceneNumber: 2,
          duration: "7s",
          shotType: "Educational Infographic Motion",
          visualPrompt: "3D stylized metabolic engine glowing softly in green and gold, representing basal metabolic rate, smooth camera rotation, cinematic blur.",
          script: "เมื่อเราทานน้อยเกินไป ร่างกายจะเข้าสู่โหมดประหยัดพลังงาน เผาผลาญลดลง และสะสมไขมันแทนค่ะ",
          audioMood: "Educational Rhythmic"
        }
      ],
      managerComment: "อนุมัติแล้ว สามารถนำ Prompt ไปรันวิดีโอบน Google Flow Studio ได้เลยครับ - บอส",
      flowUrl: "https://labs.google/flow",
      assetsCount: 4
    },
    {
      id: "PROJ-003",
      title: "เทคนิคเลือกสารอาหารสู้ภาวะบวมน้ำช่วงทำงานหนัก",
      channel: "leanbybenz",
      targetFormat: "9:16 Vertical Video",
      authorId: "kae",
      status: "draft",
      reviewBufferTag: "Buffer 3/7",
      createdAt: "2026-10-01 08:45",
      complianceStatus: "unverified",
      complianceNotes: "รอคุณลีนตรวจสอบส่วนประกอบโพแทสเซียมในอาหาร",
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
          visualPrompt: "Close-up of female hand drinking clear glass of infused lemon water, natural sunshine, serene minimalist kitchen.",
          script: "ตื่นเช้ามาหน้าบวม แขนขาบวม อึดอัดตัว... อาจเกิดจากสมดุลโซเดียมและน้ำในเซลล์ค่ะ",
          audioMood: "Calm Acoustic"
        }
      ],
      managerComment: "",
      flowUrl: "https://labs.google/flow",
      assetsCount: 1
    }
  ],

  promptPresets: [
    {
      id: "PRM-001",
      category: "Google Veo (Video)",
      title: "Thai Health Host 'Khun Kae' Persona",
      tags: ["Host", "Veo", "Cinematic", "9:16"],
      prompt: "Cinematic portrait shot of a gentle Thai female wellness expert in her mid-30s named Khun Kae, smiling warmly at the camera, wearing an elegant neutral pastel sage linen shirt, modern bright kitchen filled with green potted herbs in the background, soft warm morning lighting, shot on 35mm lens, f/1.8, 4K resolution, photorealistic, fluid natural movements.",
      useFor: "สร้างช็อตเปิดตัวและพูดคุยของพิธีกรคุณเก๋"
    },
    {
      id: "PRM-002",
      category: "Google Veo (Video)",
      title: "Macro Nutrition & Fresh Superfood",
      tags: ["Food", "Macro", "Veo", "60fps"],
      prompt: "Ultra-close macro slow motion 60fps of fresh raspberries, blueberries, and pure golden organic honey drizzling smoothly over high-protein Greek yogurt, studio lighting, water droplet condensation on bowl, shallow depth of field, hyper-realistic 8K.",
      useFor: "สร้างฉาก B-Roll ประกอบคำอธิบายสารอาหาร"
    },
    {
      id: "PRM-003",
      category: "Google Imagen (Images)",
      title: "Minimalist Wellness Studio Infographic Backdrop",
      tags: ["Background", "Imagen", "Clean"],
      prompt: "Clean Scandinavian-Japanese minimalist living space, warm light wood furniture, large window with soft sunlight, lush fiddle leaf fig plant in clay pot, peaceful atmosphere, muted earthy and sage green palette, professional interior photography style.",
      useFor: "สร้างภาพนิ่งสำหรับนำไปต่อยอดภาพเคลื่อนไหวบน Flow"
    },
    {
      id: "PRM-004",
      category: "Google Flow Tools (Custom Mini-App)",
      title: "Vertical 9:16 Video Resizer & Safe Zone Overlay",
      tags: ["Tool Prompt", "Flow Tools", "Workflow"],
      prompt: "Create a Flow tool that takes any 16:9 cinematic video clip generated from Veo, centers the primary subject using intelligent tracking, crops to 9:16 vertical ratio, and renders a subtle translucent safe-zone overlay for TikTok and YouTube Shorts UI.",
      useFor: "ป้อนลงในช่องสร้างเครื่องมืออัตโนมัติของ Google Flow"
    }
  ],

  assets: [
    {
      id: "AST-001",
      name: "veo_hook_fatigue_office_v1.mp4",
      type: "video",
      size: "14.2 MB",
      dimensions: "1080x1920 (9:16)",
      source: "Google Veo (Flow)",
      duration: "00:04",
      status: "Ready",
      linkedProject: "PROJ-001"
    },
    {
      id: "AST-002",
      name: "imagen_plant_protein_shake.png",
      type: "image",
      size: "3.8 MB",
      dimensions: "2048x2048",
      source: "Google Imagen",
      duration: "-",
      status: "Ready",
      linkedProject: "PROJ-001"
    },
    {
      id: "AST-003",
      name: "tts_kae_hook_001.mp3",
      type: "audio",
      size: "620 KB",
      dimensions: "128 kbps stereo",
      source: "Premwadee Neural (-15%)",
      duration: "00:04",
      status: "Ready",
      linkedProject: "PROJ-001"
    }
  ]
};
