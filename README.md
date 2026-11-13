
<!-- Header -->
<div align="center">
  
  <img src="https://raw.githubusercontent.com/Taimdev9/Wassel/main/logo.png" alt="Wassel Logo" width="150" height="150" onerror="this.style.display='none'"/>
  
  # 📺 Wassel | واصل
  
  **The Ultimate Peer-to-Peer Screen Sharing Web Application**
  **التطبيق الأسرع والأكثر أماناً لمشاركة الشاشة عبر الويب**

  [![Live Demo](https://img.shields.io/badge/Live_Demo-taimdev9.github.io/Wassel-10b981?style=for-the-badge&logo=github&logoColor=white)](https://taimdev9.github.io/Wassel/)
  [![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)](https://github.com/Taimdev9/Wassel)
  [![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/Taimdev9/Wassel/graphs/commit-activity)
  
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
  [![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)]()
  [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)]()

  <br>

  [🌐 English](#-english-documentation) • [🌍 العربية](#-الدليل-العربي)
  
</div>

---

<!-- Table of Contents -->
## 📑 Table of Contents | جدول المحتويات

<details open>
<summary><b>Click to expand | اضغط للفتح</b></summary>

- [🇬🇧 English Documentation](#-english-documentation)
  - [About The Project](#-about-the-project)
  - [Key Features](#-key-features)
  - [System Architecture](#-system-architecture)
  - [Tech Stack](#-tech-stack)
  - [Getting Started](#-getting-started)
  - [Firebase Setup](#-firebase-setup)
  - [Deployment](#-deployment)
  - [Usage](#-usage)
  - [Security & Privacy](#-security--privacy)
  - [Roadmap](#-roadmap)
- [🇸🇦 الدليل العربي](#-الدليل-العربي)
  - [عن التطبيق](#-عن-التطبيق)
  - [المميزات الرئيسية](#-المميزات-الرئيسية)
  - [هيكلية النظام](#-هيكلية-النظام)
  - [التقنيات المستخدمة](#-التقنيات-المستخدمة)
  - [طريقة التشغيل محلياً](#-طريقة-التشغيل-محلياً)
  - [إعداد Firebase](#-إعداد-firebase)
  - [النشر على الإنترنت](#-النشر-على-الإنترنت)
  - [طريقة الاستخدام](#-طريقة-الاستخدام)
  - [الخصوصية والأمان](#-الخصوصية-والأمان)
  - [خطط المستقبل](#-خطط-المستقبل)
- [🤝 Contributing | المساهمة](#-contributing--المساهمة)
- [📄 License | الترخيص](#-license--الترخيص)

</details>

---

<!-- English Section -->
<div id="-english-documentation" align="left">

# 🇬🇧 English Documentation

## 🚀 About The Project

**Wassel** (واصل) is a state-of-the-art, open-source web application designed to provide seamless, ultra-low latency screen sharing between any two devices. Built entirely on top of **WebRTC** for direct Peer-to-Peer (P2P) media streaming, and **Firebase Realtime Database** strictly for signaling.

Unlike traditional screen sharing tools that rely on heavy server infrastructure and require installations, Wassel runs completely in the browser. It provides a native-like experience with a beautiful UI, bilingual support, and absolute privacy. No video data ever touches a server; your screen is streamed directly to the viewer.

### 🌟 Why Wassel?
* **Zero Friction:** No downloads, no installations, no account creation.
* **Privacy First:** End-to-End encryption via WebRTC standards (DTLS-SRTP).
* **Global Accessibility:** Fully responsive design with complete Arabic (RTL) and English (LTR) localization.
* **Free to Host:** Lightweight enough to be hosted entirely on GitHub Pages for free.

---

## ✨ Key Features

* 📡 **Direct P2P Streaming:** Uses `RTCPeerConnection` to stream video and audio directly between browsers.
* 🔢 **6-Digit Secure Rooms:** Generates a random 6-digit code to pair the Host and Viewer instantly.
* 🌍 **Bilingual Interface:** Seamless toggle between English and Arabic with dynamic RTL/LTR layouts.
* ⏳ **Splash Screen:** Professional 5-second loading screen with developer credits (FROM TAIMDEV9).
* 🎨 **Modern UI/UX:** Built with a sleek, dark-themed interface using CSS Variables and Flexbox/Grid.
* 🔒 **No Backend Media Servers:** Firebase is used *only* to exchange SDP (Session Description Protocol) and ICE candidates.
* 📱 **Cross-Platform:** Works on Desktop, Laptop, and Tablets. (Note: Mobile devices can act as viewers, but screen sharing as a host requires desktop browsers).

---

## 🏗 System Architecture

Wassel uses a standard WebRTC architecture with Firebase as the signaling server.

```text
+----------+          +-----------------------+          +----------+
|   HOST   | <------> |       FIREBASE        | <------> |  VIEWER  |
| (Device) |          | (Realtime Database)   |          | (Device) |
+----------+          +-----------------------+          +----------+
     |                                                        |
     |                    WebRTC P2P Connection               |
     +--------------------------------------------------------+
                     (Direct Media Stream)
```

1. Host generates a 6-digit code and saves it to Firebase.
2. Viewer enters the code, checks Firebase if the room exists.
3. Host creates a WebRTC Offer and pushes it to Firebase.
4. Viewer receives the Offer, creates an Answer, and pushes it back.
5. Both devices exchange ICE candidates via Firebase.
6. Once connected, Firebase is no longer used. The Media Stream flows directly P2P.

---

💻 Tech Stack

Technology Purpose
HTML5 Semantic structure and WebRTC API integration.
CSS3 Custom properties, Flexbox, Grid, CSS Animations (Splash Screen).
Vanilla JS Core logic, DOM manipulation, i18n (Internationalization), Firebase SDK integration.
WebRTC API getDisplayMedia for capturing, RTCPeerConnection for streaming.
Firebase Realtime Database for signaling and room management.
GitHub Pages Fast, free, and secure hosting with HTTPS enforcement.

---

🛠 Getting Started

To get a local copy up and running, follow these simple steps.

Prerequisites

· A modern web browser (Chrome, Edge, Firefox, Safari).
· A code editor (VS Code recommended).
· A Firebase account.

Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Taimdev9/Wassel.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Wassel
   ```
3. Open index.html in your browser, or use a local server (e.g., Live Server extension in VS Code).

---

🔥 Firebase Setup

To make the app work, you need your own Firebase project.

1. Go to Firebase Console.
2. Create a new project.
3. Navigate to Realtime Database and create a database in Test Mode.
4. Go to Project Settings > General > Your apps > Web (</>).
5. Copy the firebaseConfig object.
6. Open app.js and paste your config:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
     projectId: "YOUR_PROJECT",
     // ... rest of config
   };
   ```
7. Update Realtime Database Rules to:
   ```json
   {
     "rules": {
       "rooms": {
         "$roomId": {
           ".read": true,
           ".write": true,
           ".validate": "newData.hasChildren(['createdAt']) || newData.val() == null"
         }
       }
     }
   }
   ```

---

🌐 Deployment

1. Push your code to a GitHub repository.
2. Go to Settings > Pages.
3. Under Build and deployment, select Deploy from a branch.
4. Choose the main branch and /(root) folder.
5. Click Save. Your app will be live at https://<username>.github.io/<repo>/.

---

📖 Usage

1. Open the live URL on two different devices.
2. Choose your language (English / Arabic).
3. Host: Click Share Screen, select the window/screen you want to share, and copy the 6-digit code.
4. Viewer: Click View Screen, enter the 6-digit code, and click Connect.
5. Enjoy real-time screen sharing!

---

🔒 Security & Privacy

· No Recording: The app does not have the capability to record or store your screen.
· End-to-End Encryption: WebRTC enforces DTLS-SRTP encryption for all media streams by default.
· Ephemeral Rooms: As soon as the host disconnects, the Firebase room is deleted automatically (onDisconnect().remove()).

---

🗺 Roadmap

☑ Initial Release (v1.0.0)
☑ Bilingual Support (AR/EN)
☑ Firebase Signaling
☐ Add TURN Server support for strict NATs.
☐ Multi-viewer support (SFU architecture).
☐ In-room text chat.
☐ Audio-only mode.

</div>

---

<!-- Arabic Section -->

<div id="-الدليل-العربي" align="right" dir="rtl">

🇸🇦 الدليل العربي

🚀 عن التطبيق

واصل (Wassel) هو تطبيق ويب مفتوح المصدر، متطور، ومصمم لتوفير مشاركة شاشة سلسة وبزمن تأخير منخفض جداً بين أي جهازين. التطبيق مبني بالكامل على تقنية WebRTC للبث المباشر (Peer-to-Peer)، ويستخدم قاعدة بيانات Firebase فقط لتبادل بيانات الاتصال الأولية (Signaling).

على عكس أدوات مشاركة الشاشة التقليدية التي تعتمد على سيرفرات ضخمة وتتطلب تثبيت برامج، يعمل "واصل" بالكامل من خلال المتصفح. يوفر تجربة احترافية بواجهة مستخدم جميلة، دعم لعدة لغات، وخصوصية مطلقة. لا يتم إرسال أي فيديو إلى أي سيرفر؛ يتم بث شاشتك مباشرة إلى المشاهد.

🌟 لماذا "واصل"؟

· بدون تعقيدات: لا تحميل، لا تثبيت، ولا حاجة لإنشاء حساب.
· الخصوصية أولاً: تشفير كامل من طرف إلى طرف (End-to-End) عبر معايير WebRTC.
· إتاحة عالمية: تصميم متجاوب بالكامل مع دعم كامل للغة العربية (RTL) والإنجليزية (LTR).
· مجاني للاستضافة: خفيف جداً لدرجة أنه يمكن استضافته مجاناً بالكامل على GitHub Pages.

---

✨ المميزات الرئيسية

· 📡 بث مباشر (P2P): يستخدم RTCPeerConnection لبث الفيديو والصوت مباشرة بين المتصفحات دون وسيط.
· 🔢 غرف آمنة بـ 6 أرقام: يُنشئ كوداً عشوائياً من 6 أرقام لربط جهاز الناشر بجهاز المشاهد فوراً.
· 🌍 واجهة ثنائية اللغة: تبديل سلس بين الإنجليزية والعربية مع تغيير اتجاه الواجهة (RTL/LTR).
· ⏳ شاشة تحميل احترافية: شاشة بداية (Splash Screen) لمدة 5 ثوانٍ تعرض اسم المطور (FROM TAIMDEV9).
· 🎨 تصميم عصري: واجهة مستخدم مظلمة وأنيقة (Dark Mode) باستخدام CSS Variables و Flexbox/Grid.
· 🔒 بدون سيرفرات وسائط: يُستخدم Firebase فقط لتبادل بيانات الاتصال (SDP و ICE)، ولا يمر الفيديو عبره أبداً.
· 📱 يعمل على جميع الأجهزة: يعمل على الحواسيب والأجهزة اللوحية. (ملاحظة: الأجهزة اللوحية والجوالات يمكنها المشاهدة، بينما مشاركة الشاشة تتطلب متصفح حاسوب).

---

🏗 هيكلية النظام

يستخدم "واصل" بنية WebRTC القياسية مع Firebase كسيرفر إشارات (Signaling Server).

```text
+----------+          +-----------------------+          +----------+
| الناشر   | <------> |       FIREBASE        | <------> | المشاهد  |
|  (Host)  |          | (Realtime Database)   |          | (Viewer) |
+----------+          +-----------------------+          +----------+
     |                                                        |
     |                  اتصال مباشر (WebRTC P2P)             |
     +--------------------------------------------------------+
                     (بث الوسائط المباشر)
```

1. الناشر يُنشئ كوداً من 6 أرقام ويحفظه في Firebase.
2. المشاهد يُدخل الكود، ويتحقق من Firebase إذا كانت الغرفة موجودة.
3. الناشر يُنشئ عرض اتصال (Offer) ويضعه في Firebase.
4. المشاهد يستقبل العرض، يُنشئ رداً (Answer)، ويعيد إرساله عبر Firebase.
5. يت exchanges الجهازان بيانات الاتصال (ICE candidates) عبر Firebase.
6. بمجرد اكتمال الاتصال، لا يُستخدم Firebase بعد ذلك. تتدفق الوسائط مباشرة بين الجهازين.

---

💻 التقنيات المستخدمة

التقنية الغرض
HTML5 الهيكل الأساسي وتكامل واجهة WebRTC.
CSS3 المتغيرات، Flexbox، Grid، التأثيرات الحركية (شاشة التحميل).
Vanilla JS المنطق الأساسي، التلاعب بـ DOM، دعم اللغات (i18n)، تكامل Firebase.
WebRTC API استخدام getDisplayMedia لالتقاط الشاشة و RTCPeerConnection للبث.
Firebase Realtime Database لإدارة الغرف وتبادل الإشارات.
GitHub Pages استضافة سريعة، مجانية، وآمنة مع دعم HTTPS الإلزامي.

---

🛠 طريقة التشغيل محلياً

لتشغيل نسخة محلية من المشروع، اتبع الخطوات التالية:

المتطلبات الأساسية

· متصفح ويب حديث (Chrome, Edge, Firefox, Safari).
· محرر أكواد (يفضل VS Code).
· حساب على Firebase.

التشغيل المحلي

1. استنسخ المستودع (Clone):
   ```bash
   git clone https://github.com/Taimdev9/Wassel.git
   ```
2. انتقل إلى مجلد المشروع:
   ```bash
   cd Wassel
   ```
3. افتح ملف index.html في متصفحك، أو استخدم سيرفر محلي (مثل إضافة Live Server في VS Code).

---

🔥 إعداد Firebase

لكي يعمل التطبيق، تحتاج إلى إنشاء مشروع Firebase خاص بك.

1. اذهب إلى Firebase Console.
2. أنشئ مشروعاً جديداً.
3. اذهب إلى Realtime Database وأنشئ قاعدة بيانات في Test Mode.
4. اذهب إلى Project Settings > General > Your apps > Web (</>).
5. انسخ كائن firebaseConfig.
6. افتح ملف app.js وضع إعداداتك:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
     projectId: "YOUR_PROJECT",
     // ... باقي الإعدادات
   };
   ```
7. قم بتحديث قواعد قاعدة البيانات (Realtime Database Rules) إلى:
   ```json
   {
     "rules": {
       "rooms": {
         "$roomId": {
           ".read": true,
           ".write": true,
           ".validate": "newData.hasChildren(['createdAt']) || newData.val() == null"
         }
       }
     }
   }
   ```

---

🌐 النشر على الإنترنت

1. ارفع الكود إلى مستودع على GitHub.
2. اذهب إلى Settings > Pages.
3. تحت قسم Build and deployment، اختر Deploy from a branch.
4. اختر فرع main والمجلد /(root).
5. اضغط Save. سيكون تطبيقك متاحاً على الرابط: https://<username>.github.io/<repo>/.

---

📖 طريقة الاستخدام

1. افتح رابط الموقع المباشر على جهازين مختلفين.
2. اختر لغتك المفضلة (العربية / الإنجليزية).
3. جهاز الناشر (Host): اضغط على مشاركة الشاشة، اختر النافذة أو الشاشة التي تريد مشاركتها، وانسخ الكود المكون من 6 أرقام.
4. جهاز المشاهد (Viewer): اضغط على عرض الشاشة، أدخل الكود المكون من 6 أرقام، واضغط اتصال.
5. استمتع بمشاركة الشاشة في الوقت الفعلي!

---

🔒 الخصوصية والأمان

· بدون تسجيل: التطبيق لا يمتلك أي خاصية لتسجيل أو تخزين شاشتك.
· تشفير كامل: يفرض WebRTC تشفير DTLS-SRTP لجميع تدفقات الوسائط بشكل افتراضي.
· غرف مؤقتة: بمجرد قطع اتصال الناشر، يتم حذف الغرفة من Firebase تلقائياً (onDisconnect().remove()).

---

🗺 خطط المستقبل

☑ الإصدار الأولي (v1.0.0)
☑ دعم اللغتين (عربي/إنجليزي)
☑ إشارات Firebase
☐ إضافة خادم TURN لدعم الشبكات المقيدة (Strict NATs).
☐ دعم عدة مشاهدين في نفس الوقت (بنية SFU).
☐ إضافة دردشة نصية داخل الغرفة.
☐ وضع الصوت فقط (Audio-only mode).

</div>

---

<!-- Footer -->

🤝 Contributing | المساهمة

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

<br>

📄 License | الترخيص

Distributed under the MIT License. See LICENSE for more information.

<br>

<div align="center">
  <b>Developed with ❤️ by <a href="https://github.com/Taimdev9">Taimdev9</a></b>
  <br>
  <i>Don't forget to ⭐ the repository if you like it!</i>
  <br><br>
  <a href="https://taimdev9.github.io/Wassel/">🌐 Live Demo</a> • <a href="https://github.com/Taimdev9/Wassel/issues">🐛 Report Bug</a> • <a href="https://github.com/Taimdev9/Wassel/issues">💡 Request Feature</a>
</div>
