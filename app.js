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

// ================== DOM ==================
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

// ================== State ==================
let pc = null;
let roomRef = null;
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
  if (!pc.currentRemoteDescription) {
    pendingCandidates.push(candidate);
    return;
  }
  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (e) {
    console.warn('addIceCandidate failed:', e);
  }
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
  pendingCandidates = [];
}

// ================== المضيف (اللي بيعرض) ==================
async function startHost() {
  let stream;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30 },
      audio: true
    });
  } catch (err) {
    alert('تعذّر الوصول إلى الشاشة: ' + err.message);
    return;
  }

  localStream = stream;
  localVideo.srcObject = stream;
  currentCode = generateCode();
  roomRef = db.ref('rooms/' + currentCode);

  try {
    await roomRef.set({ createdAt: Date.now(), host: true });
    roomRef.onDisconnect().remove();
  } catch (err) {
    alert('تعذّر الاتصال بـ Firebase. تحقق من إعداداتك:\n' + err.message);
    localStream.getTracks().forEach(t => t.stop());
    localStream = null;
    roomRef = null;
    return;
  }

  codeDisplay.textContent = currentCode;
  hostStatus.textContent = 'بانتظار اتصال الجهاز الثاني...';
  showScreen(hostScreen);

  const videoTrack = localStream.getVideoTracks()[0];
  if (videoTrack) videoTrack.onended = stopHost;

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
        hostStatus.textContent = '✓ متصل — جاري المشاركة';
      } catch (e) {
        console.error(e);
      }
    }
  });

  roomRef.child('viewerCandidates').on('child_added', snap => {
    const c = snap.val();
    if (c) addCandidate(c);
  });
}

async function createHostConnection() {
  pc = createPeerConnection('host');
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') {
      hostStatus.textContent = '✓ متصل';
    } else if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
      hostStatus.textContent = 'انقطع الاتصال';
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
  localStream = null;
  localVideo.srcObject = null;
  currentCode = null;
  showScreen(chooseScreen);
}

// ================== المشاهد ==================
async function joinViewer() {
  const code = codeInput.value.trim();
  if (!/^\d{6}$/.test(code)) {
    statusEl.textContent = 'أدخل كوداً من 6 أرقام';
    return;
  }

  statusEl.textContent = 'جاري التحقق...';

  const checkRef = db.ref('rooms/' + code);
  const snap = await checkRef.get();

  if (!snap.exists()) {
    statusEl.textContent = '❌ لا يوجد جهاز بهذا الكود';
    return;
  }

  currentCode = code;
  roomRef = db.ref('rooms/' + code);
  pc = createPeerConnection('viewer');

  pc.ontrack = e => {
    remoteVideo.srcObject = e.streams[0];
    statusEl.textContent = '✓ متصل';
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') statusEl.textContent = '✓ متصل';
    else if (pc.connectionState === 'failed') statusEl.textContent = 'فشل الاتصال';
    else if (pc.connectionState === 'disconnected') statusEl.textContent = 'انقطع الاتصال';
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
  statusEl.textContent = 'جاري الاتصال...';

  await roomRef.child('viewerJoined').set(true);
}

function leaveViewer() {
  cleanupConnection();
  currentCode = null;
  codeInput.value = '';
  statusEl.textContent = '';
  remoteVideo.srcObject = null;
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

codeDisplay.addEventListener('click', () => {
  if (!currentCode) return;
  navigator.clipboard.writeText(currentCode).then(() => {
    const original = codeDisplay.textContent;
    codeDisplay.classList.add('copied');
    codeDisplay.textContent = 'تم النسخ ✓';
    setTimeout(() => {
      codeDisplay.textContent = original;
      codeDisplay.classList.remove('copied');
    }, 1200);
  }).catch(() => {});
});