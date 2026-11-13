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

// ================== Splash Screen Logic (4 Seconds) ==================
const splashScreen = document.getElementById('splash-screen');
const mainApp = document.getElementById('main-app');
const btnContinue = document.getElementById('btn-continue');

setTimeout(() => {
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
    // رسائل الموبايل
    mobile_warn: "Your browser doesn't support screen sharing.\nDo you want to open the room to send images/videos only?",
    mobile_warn_cancel: "Screen sharing failed or was cancelled.\nDo you want to continue to send images/videos only?"
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
    // رسائل الموبايل
    mobile_warn: "متصفحك لا يدعم مشاركة الشاشة الحية.\nهل تريد فتح الغرفة لإرسال صور وفيديوهات فقط؟",
    mobile_warn_cancel: "تم إلغاء مشاركة الشاشة.\nهل تريد الاستمرار لإرسال صور وفيديوهات فقط؟"
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
const statusEl     = $('status');
const hostStatus   = $('host-status');
const joinSection  = $('join-section');
const videoSection = $('video-section');
const mediaInput   = $('media-input');
const receivedMediaContainer = $('received-media-container');
const receivedImage = $('received-image');
const receivedVideo = $('received-video');

// ================== State ==================
let pc = null;
let roomRef = null;
let dataChannel = null;
let currentCode = null;
let localStream = null;
let pendingCandidates = [];

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
      { urls: 'stun:stun1.l.google.com:19302' }
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

// ================== Host Logic (Modified for Mobile Support) ==================
async function startHost() {
  let stream = null;

  // التحقق من دعم المتصفح
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: true });
      localStream = stream;
      localVideo.srcObject = stream;
      localVideo.classList.remove('hidden'); // إظهار الفيديو لو اشتغل
    } catch (err) {
      // المستخدم ضغط إلغاء أو حصل خطأ
      const proceed = confirm(translations[currentLang].mobile_warn_cancel);
      if (!proceed) return;
      localVideo.classList.add('hidden'); // إخفاء الفيديو
    }
  } else {
    // المتصفح لا يدعم مشاركة الشاشة (موبايل)
    const proceed = confirm(translations[currentLang].mobile_warn);
    if (!proceed) return;
    localVideo.classList.add('hidden'); // إخفاء الفيديو
  }

  // إنشاء الغرفة
  currentCode = generateCode();
  roomRef = db.ref('rooms/' + currentCode);

  try {
    await roomRef.set({ createdAt: Date.now(), host: true });
    roomRef.onDisconnect().remove();
  } catch (err) {
    alert('Firebase Error:\n' + err.message);
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    localStream = null; roomRef = null;
    return;
  }

  codeDisplay.textContent = currentCode;
  hostStatus.textContent = translations[currentLang].waiting;
  showScreen(hostScreen);

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
        hostStatus.textContent = translations[currentLang].connected;
      } catch (e) { console.error(e); }
    }
  });

  roomRef.child('viewerCandidates').on('child_added', snap => {
    const c = snap.val();
    if (c) addCandidate(c);
  });
}

async function createHostConnection() {
  pc = createPeerConnection('host');
  
  // إضافة مسار الفيديو فقط إذا كان موجوداً (كمبيوتر)
  if (localStream) {
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  }

  // إنشاء قناة البيانات لنقل الملفات (تعمل على الكمبيوتر والموبايل)
  dataChannel = pc.createDataChannel("fileTransfer");
  dataChannel.binaryType = "arraybuffer";

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') {
      hostStatus.textContent = localStream ? translations[currentLang].sharing_now : translations[currentLang].connected;
      showSuccessToast(); 
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
  localVideo.classList.remove('hidden'); // إعادة ضبط الحالة
  showScreen(chooseScreen);
}

// ================== Send Media Logic ==================
$('btn-send-media').addEventListener('click', () => mediaInput.click());

mediaInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!dataChannel || dataChannel.readyState !== 'open') {
    alert('Connection is not fully established yet. Wait a moment.');
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
    if (dataChannel.bufferedAmount > 65535) {
      setTimeout(() => readSlice(file), 100);
      return;
    }
    dataChannel.send(event.target.result);
    offset += event.target.result.byteLength;
    if (offset < file.size) {
      readSlice(file);
    }
  };
  readSlice(file);
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
  pc = createPeerConnection('viewer');

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
            receivedVideo.src = url;
            receivedVideo.classList.remove('hidden');
            receivedImage.classList.add('hidden');
          } else {
            receivedImage.src = url;
            receivedImage.classList.remove('hidden');
            receivedVideo.classList.add('hidden');
          }
        }
      }
    };
  };

  pc.ontrack = e => {
    remoteVideo.srcObject = e.streams[0];
    remoteVideo.classList.remove('hidden'); // إظهار البث
    statusEl.textContent = translations[currentLang].connected;
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') {
      statusEl.textContent = translations[currentLang].connected;
      showSuccessToast(); 
    } else if (pc.connectionState === 'failed') {
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

  joinSection.classList.add('hidden');
  videoSection.classList.remove('hidden');
  statusEl.textContent = translations[currentLang].connecting;

  await roomRef.child('viewerJoined').set(true);
}

function leaveViewer() {
  cleanupConnection();
  currentCode = null; codeInput.value = ''; statusEl.textContent = '';
  remoteVideo.srcObject = null;
  remoteVideo.classList.add('hidden'); // إخفاء البث عند قطع الاتصال
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