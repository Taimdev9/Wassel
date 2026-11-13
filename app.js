'use strict';

// ================================================================
// ✅ إعدادات Firebase الخاصة بك
// ================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDZuv9fX_S_MMXhYs40VG3ddPobKkS-SEQ",
  authDomain: "tv-sc-aa5ce.firebaseapp.com",
  databaseURL: "https://tv-sc-aa5ce-default-rtdb.firebaseio.com",
  projectId: "tv-sc-aa5ce",
  storageBucket: "tv-sc-aa5ce.firebasestorage.app",
  messagingSenderId: "491093832911",
  appId: "1:491093832911:web:c9d8b84d432873f342f3ba",
  measurementId: "G-VQCL0748HP"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ================== Splash Screen ==================
const splashScreen = document.getElementById('splash-screen');
const mainApp = document.getElementById('main-app');
const btnContinue = document.getElementById('btn-continue');
const loaderSpinner = document.getElementById('loader-spinner');

setTimeout(() => {
  if (loaderSpinner) loaderSpinner.style.display = 'none'; 
  if (btnContinue) btnContinue.classList.remove('hidden'); 
}, 4000); 

if (btnContinue) {
  btnContinue.addEventListener('click', () => {
    splashScreen.classList.add('fade-out');
    mainApp.classList.remove('hidden');
    document.body.style.overflow = 'auto';
    setTimeout(() => splashScreen.remove(), 500); 
  });
}

// ================== Language Support ==================
let currentLang = 'en'; 

const translations = {
  en: {
    dir: 'ltr', app_title: 'Wassel', app_subtitle: 'Choose your device role',
    host_title: 'Target Device', host_desc: 'Generates a code to be connected to',
    viewer_title: 'Controller Device', viewer_desc: 'Enter code to view/control the device',
    host_screen_title: 'You are the Target', host_screen_desc: 'Give this code to the controller:',
    waiting: 'Waiting for connection...', stop_sharing: 'Stop Sharing',
    viewer_screen_title: 'You are the Controller', enter_code: 'Enter the 6-digit code:',
    connect_btn: 'Connect', disconnect: 'Disconnect', back_btn: 'Back',
    invalid_code: 'Enter a 6-digit code', no_device: '❌ No device found',
    connected: '✓ Connected', connecting: 'Connecting...', failed: 'Connection failed',
    disconnected: 'Disconnected', copied: 'Copied ✓', sharing_now: 'Sharing now',
    success_title: 'Connected!', success_status: 'Now', success_desc: 'Devices are linked.',
    send_media: '📁 Send Image/Video', received_media: 'Received Media',
    lang_btn: 'عربي',
    compat_mode: 'Compatibility Mode (PS4/TV)',
    mobile_warn: "Mobile browsers don't support live screen sharing.\nDo you want to open the room to send media only?",
    media_only_connected: "Connected (Media Only)",
    err_not_connected: "Connection is not ready yet. Wait a moment.",
    timeout_err: "Connection timed out. Your network is blocking the connection.",
    no_webrtc: "❌ Your browser (like PS4) does not support WebRTC. Please enable Compatibility Mode on the Host device."
  },
  ar: {
    dir: 'rtl', app_title: 'واصل', app_subtitle: 'اختر دور جهازك',
    host_title: 'الجهاز المتصل به', host_desc: 'يظهر كود لكي يتم الاتصال به',
    viewer_title: 'جهاز التحكم', viewer_desc: 'أدخل الكود للتحكم/المشاهدة',
    host_screen_title: 'أنت الجهاز المتصل به', host_screen_desc: 'أعطِ هذا الكود لجهاز التحكم:',
    waiting: 'بانتظار اتصال جهاز التحكم...', stop_sharing: 'إيقاف المشاركة',
    viewer_screen_title: 'أنت جهاز التحكم', enter_code: 'أدخل الكود المكوّن من 6 أرقام:',
    connect_btn: 'اتصال', disconnect: 'قطع الاتصال', back_btn: 'رجوع',
    invalid_code: 'أدخل كوداً من 6 أرقام', no_device: '❌ لا يوجد جهاز بهذا الكود',
    connected: '✓ متصل', connecting: 'جاري الاتصال...', failed: 'فشل الاتصال',
    disconnected: 'انقطع الاتصال', copied: 'تم النسخ ✓', sharing_now: 'جاري المشاركة',
    success_title: 'تم الاتصال!', success_status: 'الآن', success_desc: 'تم ربط الأجهزة بنجاح.',
    send_media: '📁 إرسال صورة/فيديو', received_media: 'الوسائط المستلمة',
    lang_btn: 'English',
    compat_mode: 'وضع التوافق (للبلايستيشن والتلفاز)',
    mobile_warn: "متصفح الهاتف لا يدعم مشاركة الشاشة الحية.\nهل تريد فتح الغرفة لإرسال الصور والفيديوهات فقط؟",
    media_only_connected: "متصل (إرسال وسائط فقط)",
    err_not_connected: "لم يكتمل الاتصال بعد، انتظر لحظة.",
    timeout_err: "انتهت مهلة الاتصال. شبكتك تمنع الاتصال.",
    no_webrtc: "❌ متصفحك (مثل البلايستيشن) لا يدعم البث المباشر. يرجى تفعيل (وضع التوافق) من جهاز الكمبيوتر."
  }
};

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.dir = translations[lang].dir;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  document.getElementById('lang-toggle').textContent = translations[lang].lang_btn;
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  setLanguage(currentLang === 'en' ? 'ar' : 'en');
});

// ================== Elements ==================
const $ = id => document.getElementById(id);
const chooseScreen = $('choose-screen');
const hostScreen   = $('host-screen');
const viewerScreen = $('viewer-screen');
const codeDisplay  = $('code-display');
const codeInput    = $('code-input');
const localVideo   = $('local-video');
const remoteVideo  = $('remote-video');
const compatImage  = $('compat-image');
const statusEl     = $('status');
const hostStatus   = $('host-status');
const joinSection  = $('join-section');
const videoSection = $('video-section');
const mediaInput   = $('media-input');
const receivedMediaContainer = $('received-media-container');
const receivedImage = $('received-image');
const receivedVideo = $('received-video');
const compatModeCheckbox = $('compat-mode');

// ================== State ==================
let pc = null;
let roomRef = null;
let dataChannel = null;
let currentCode = null;
let localStream = null;
let pendingCandidates = [];
let connectionTimeout = null;
let compatInterval = null; // مؤقت وضع التوافق

// ================== Helpers ==================
function showScreen(el) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createPeerConnection(role) {
  const peer = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' }
    ]
  });

  peer.onicecandidate = e => {
    if (e.candidate && roomRef) {
      const key = role === 'host' ? 'hostCandidates' : 'viewerCandidates';
      roomRef.child(key).push(e.candidate.toJSON());
    }
  };

  return peer;
}

async function addCandidate(candidate) {
  if (!pc) return;
  if (!pc.currentRemoteDescription) { pendingCandidates.push(candidate); return; }
  try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) {}
}

async function flushCandidates() {
  while (pendingCandidates.length) {
    const c = pendingCandidates.shift();
    try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (e) {}
  }
}

function cleanupConnection() {
  if (connectionTimeout) clearTimeout(connectionTimeout); 
  if (compatInterval) clearInterval(compatInterval);
  if (pc) { try { pc.close(); } catch (e) {} pc = null; }
  if (roomRef) { try { roomRef.off(); } catch (e) {} roomRef = null; }
  if (dataChannel) { try { dataChannel.close(); } catch(e){} dataChannel = null; }
  pendingCandidates = [];
}

function showSuccessToast() {
  const toast = $('success-toast');
  if (!toast) return;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 5000);
}

// ================== Host Logic ==================
async function startHost() {
  const isCompatMode = compatModeCheckbox.checked;

  // فحص دعم المتصفح لمشاركة الشاشة
  const supportsScreenShare = !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);

  if (!supportsScreenShare) {
    alert(translations[currentLang].mobile_warn);
    localVideo.classList.add('hidden');
  } else {
    try {
      localStream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: true });
      localVideo.srcObject = localStream;
      localVideo.classList.remove('hidden');
    } catch (err) {
      const msg = currentLang === 'ar' ? "لم يتم مشاركة الشاشة. هل تريد الاستمرار لإرسال صور وفيديوهات فقط؟" : "Screen not shared. Continue to send media only?";
      if (!confirm(msg)) return;
      localVideo.classList.add('hidden');
    }
  }

  currentCode = generateCode();
  roomRef = db.ref('rooms/' + currentCode);

  try {
    await roomRef.set({ createdAt: Date.now(), host: true, mode: isCompatMode ? 'compat' : 'webrtc' });
    roomRef.onDisconnect().remove();
  } catch (err) {
    alert('Firebase Error:\n' + err.message);
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    return;
  }

  codeDisplay.textContent = currentCode;
  hostStatus.textContent = translations[currentLang].waiting;
  showScreen(hostScreen);

  // 🌟 إذا تم تفعيل وضع التوافق (للبلايستيشن)
  if (isCompatMode) {
    if (localStream) {
      // إرسال لقطة شاشة كل ثانية
      compatInterval = setInterval(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 640; // تصغير الحجم لتقليل استهلاك البيانات
        canvas.height = 480;
        canvas.getContext('2d').drawImage(localVideo, 0, 0, 640, 480);
        const base64 = canvas.toDataURL('image/jpeg', 0.3); // ضغط الصورة
        roomRef.child('compatFrame').set(base64);
      }, 1000); // كل ثانية
    }
  } else {
    // 🌟 الوضع العادي (WebRTC)
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) videoTrack.onended = stopHost;
    }

    roomRef.child('viewerJoined').on('value', async snap => {
      if (snap.val() === true && !pc) {
        await createHostConnection();
      }
    });

    roomRef.child('answer').on('value', async snap => {
      const answer = snap.val();
      if (answer && pc && !pc.currentRemoteDescription) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          await flushCandidates();
          hostStatus.textContent = localStream ? translations[currentLang].connected : translations[currentLang].media_only_connected;
        } catch (e) { console.error(e); }
      }
    });

    roomRef.child('viewerCandidates').on('child_added', snap => {
      const c = snap.val();
      if (c) addCandidate(c);
    });
  }

  // مراقبة ما إذا انضم أحد للغرفة
  roomRef.child('viewerJoined').on('value', snap => {
    if (snap.val() === true) {
      hostStatus.textContent = isCompatMode ? translations[currentLang].connected : translations[currentLang].waiting;
      showSuccessToast();
    }
  });
}

async function createHostConnection() {
  pc = createPeerConnection('host');
  if (localStream) localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  dataChannel = pc.createDataChannel("fileTransfer");
  dataChannel.binaryType = "arraybuffer";

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') {
      if (connectionTimeout) clearTimeout(connectionTimeout);
      hostStatus.textContent = translations[currentLang].sharing_now;
    } else if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
      hostStatus.textContent = translations[currentLang].disconnected;
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await roomRef.child('offer').set({ type: offer.type, sdp: offer.sdp });
}

function stopHost() {
  if (localStream) localStream.getTracks().forEach(t => t.stop());
  if (roomRef) { try { roomRef.remove(); } catch (e) {} }
  cleanupConnection();
  localStream = null; localVideo.srcObject = null; currentCode = null;
  localVideo.classList.remove('hidden'); 
  showScreen(chooseScreen);
}

// ================== Send Media Logic ==================
$('btn-send-media').addEventListener('click', () => mediaInput.click());

mediaInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const isCompatMode = compatModeCheckbox.checked;

  if (isCompatMode) {
    // إرسال عبر Firebase للبلايستيشن
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result.length > 1000000) {
        alert(currentLang === 'ar' ? "حجم الملف كبير جداً لوضع التوافق. اختر ملفاً أصغر." : "File too large for compat mode.");
        return;
      }
      roomRef.child('compatMedia').set({ data: reader.result, type: file.type });
    };
    reader.readAsDataURL(file);
  } else {
    // إرسال عبر WebRTC
    if (!dataChannel || dataChannel.readyState !== 'open') {
      alert(translations[currentLang].err_not_connected);
      return;
    }
    const CHUNK_SIZE = 16384; 
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileInfo = { name: file.name, size: file.size, type: file.type, totalChunks };
    dataChannel.send(JSON.stringify(fileInfo));

    let offset = 0;
    const readSlice = f => {
      const slice = f.slice(offset, offset + CHUNK_SIZE);
      fileReader.readAsArrayBuffer(slice);
    };
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      if (dataChannel.bufferedAmount > 65535) { setTimeout(() => readSlice(file), 100); return; }
      dataChannel.send(event.target.result);
      offset += event.target.result.byteLength;
      if (offset < file.size) readSlice(file);
    };
    readSlice(file);
  }
  mediaInput.value = ''; 
});

// ================== Viewer Logic ==================
async function joinViewer() {
  const code = codeInput.value.trim();
  if (!/^\d{6}$/.test(code)) {
    statusEl.textContent = translations[currentLang].invalid_code;
    return;
  }

  statusEl.textContent = translations[currentLang].connecting;
  const snap = await db.ref('rooms/' + code).get();
  if (!snap.exists()) {
    statusEl.textContent = translations[currentLang].no_device;
    return;
  }

  currentCode = code;
  roomRef = db.ref('rooms/' + code);
  const roomMode = snap.val().mode;

  joinSection.classList.add('hidden');
  videoSection.classList.remove('hidden');

  // 🌟 وضع التوافق (للبلايستيشن)
  if (roomMode === 'compat') {
    statusEl.textContent = translations[currentLang].connected;
    remoteVideo.classList.add('hidden');
    compatImage.classList.remove('hidden');
    showSuccessToast();

    roomRef.child('compatFrame').on('value', s => {
      if (s.val()) compatImage.src = s.val();
    });

    roomRef.child('compatMedia').on('value', s => {
      const media = s.val();
      if (media && media.data) {
        receivedMediaContainer.classList.remove('hidden');
        if (media.type.startsWith('video/')) {
          receivedVideo.src = media.data;
          receivedVideo.classList.remove('hidden');
          receivedImage.classList.add('hidden');
        } else {
          receivedImage.src = media.data;
          receivedImage.classList.remove('hidden');
          receivedVideo.classList.add('hidden');
        }
      }
    });
    return; // إنهاء الدالة هنا، لا حاجة لـ WebRTC
  }

  // 🌟 الوضع العادي (WebRTC)
  if (typeof window.RTCPeerConnection === 'undefined') {
    statusEl.textContent = translations[currentLang].no_webrtc;
    return;
  }

  pc = createPeerConnection('viewer');
  connectionTimeout = setTimeout(() => {
    if (pc && pc.connectionState !== 'connected') {
      statusEl.textContent = translations[currentLang].timeout_err;
      cleanupConnection();
    }
  }, 15000);

  pc.ondatachannel = event => {
    const channel = event.channel;
    channel.binaryType = "arraybuffer";
    let receivedBuffers = [];
    let fileInfo = {};

    channel.onmessage = event => {
      if (typeof event.data === 'string') {
        fileInfo = JSON.parse(event.data);
        receivedBuffers = [];
      } else {
        receivedBuffers.push(event.data);
        if (receivedBuffers.length === fileInfo.totalChunks) {
          const blob = new Blob(receivedBuffers, { type: fileInfo.type });
          const url = URL.createObjectURL(blob);
          receivedMediaContainer.classList.remove('hidden');
          if (fileInfo.type.startsWith('video/')) {
            receivedVideo.src = url; receivedVideo.classList.remove('hidden'); receivedImage.classList.add('hidden');
          } else {
            receivedImage.src = url; receivedImage.classList.remove('hidden'); receivedVideo.classList.add('hidden');
          }
        }
      }
    };
  };

  pc.ontrack = e => {
    remoteVideo.srcObject = e.streams[0];
    remoteVideo.classList.remove('hidden'); 
    statusEl.textContent = translations[currentLang].connected;
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') {
      if (connectionTimeout) clearTimeout(connectionTimeout);
      statusEl.textContent = translations[currentLang].connected;
      showSuccessToast(); 
    } else if (pc.connectionState === 'failed') {
      if (connectionTimeout) clearTimeout(connectionTimeout);
      statusEl.textContent = translations[currentLang].failed;
    } else if (pc.connectionState === 'disconnected') {
      statusEl.textContent = translations[currentLang].disconnected;
    }
  };

  roomRef.child('offer').on('value', async s => {
    const offer = s.val();
    if (offer && pc && !pc.currentRemoteDescription) {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      await flushCandidates();
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await roomRef.child('answer').set({ type: answer.type, sdp: answer.sdp });
    }
  });

  roomRef.child('hostCandidates').on('child_added', snap => {
    const c = snap.val();
    if (c) addCandidate(c);
  });

  statusEl.textContent = translations[currentLang].connecting;
  await roomRef.child('viewerJoined').set(true);
}

function leaveViewer() {
  cleanupConnection();
  currentCode = null; codeInput.value = ''; statusEl.textContent = '';
  remoteVideo.srcObject = null; remoteVideo.classList.add('hidden'); 
  compatImage.classList.add('hidden'); compatImage.src = '';
  receivedVideo.src = ''; receivedImage.src = '';
  receivedMediaContainer.classList.add('hidden');
  joinSection.classList.remove('hidden');
  videoSection.classList.add('hidden');
  showScreen(chooseScreen);
}

// ================== Events ==================
$('btn-host').addEventListener('click', startHost);
$('btn-viewer').addEventListener('click', () => showScreen(viewerScreen));
$('btn-connect').addEventListener('click', joinViewer);
codeInput.addEventListener('keydown', e => { if (e.key === 'Enter') joinViewer(); });
$('btn-stop-host').addEventListener('click', stopHost);
$('btn-back').addEventListener('click', leaveViewer);
$('btn-back-host').addEventListener('click', stopHost);
$('btn-back-viewer').addEventListener('click', leaveViewer);

codeDisplay.addEventListener('click', () => {
  if (!currentCode) return;
  navigator.clipboard.writeText(currentCode).then(() => {
    const original = currentCode;
    codeDisplay.classList.add('copied');
    codeDisplay.textContent = translations[currentLang].copied;
    setTimeout(() => {
      codeDisplay.textContent = original;
      codeDisplay.classList.remove('copied');
    }, 1200);
  }).catch(() => {});
});