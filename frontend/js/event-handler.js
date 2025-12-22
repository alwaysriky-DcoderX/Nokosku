// event-handler.js
// Handler notifikasi realtime NOKOSKU, Bahasa Indonesia

const socket = io('http://localhost:3000'); // Ganti ke domain production jika sudah live

function showToast(msg, type = 'info') {
  const id = 'toast_' + Date.now();
  let color = 'bg-secondary';
  if (type === 'success') color = 'bg-success';
  if (type === 'primary') color = 'bg-primary';
  if (type === 'danger') color = 'bg-danger';
  if (type === 'warning') color = 'bg-warning';
  document.getElementById('toast-container').innerHTML += `
    <div class="toast show ${color} text-white mb-2" id="${id}" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="6500">
      <div class="toast-header ${color} text-white">
        <strong class="me-auto">NOKOSKU</strong>
        <small>Sekarang</small>
        <button type="button" class="btn-close btn-close-white" onclick="document.getElementById('${id}').remove()"></button>
      </div>
      <div class="toast-body">${msg}</div>
    </div>`;
  setTimeout(() => document.getElementById(id)?.remove(), 6500);
}

// Realtime event listener
socket.on('deposit:created', data => showToast(data.message, 'primary'));
socket.on('deposit:paid', data => {
  showToast(data.message, 'success');
  if (window.mountLottie && window.lottieUrls) {
    const el = document.getElementById('lottie-container');
    window.mountLottie(el, window.lottieUrls.successGreen, { loop: false, autoplay: true, size: 150 });
  }
});
socket.on('deposit:expired', () => showToast('Deposit expired, saldo kamu aman', 'warning'));
socket.on('order:created', data => showToast(data.message, 'primary'));
socket.on('order:otp_received', data => {
  showToast(`OTP masuk! Nomor: ${data.nomor}, kode: <b>${data.otp}</b>`, 'success');
  notifyOtp(data.nomor, data.otp);
  if (window.mountLottie && window.lottieUrls) {
    const el = document.getElementById('lottie-container');
    window.mountLottie(el, window.lottieUrls.success, { loop: false, autoplay: true, size: 150 });
  }
});
socket.on('order:expired', data => {
  showToast(data.message, 'warning');
  if (window.mountLottie && window.lottieUrls) {
    const el = document.getElementById('lottie-container');
    window.mountLottie(el, window.lottieUrls.expired, { loop: false, autoplay: true, size: 150 });
  }
});

function notifyOtp(nomor, otp) {
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(res => {
      if (res === 'granted') {
        new Notification('OTP masuk!', {
          body: `Nomor ${nomor}\nKode OTP: ${otp}`,
        });
      }
    });
  } else if (Notification.permission === 'granted') {
    new Notification('OTP masuk!', {
      body: `Nomor ${nomor}\nKode OTP: ${otp}`,
    });
  }
}

// Call when waiting OTP
window.askOtpNotif = function() {
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(res => {
      if (res === 'granted') showToast('Notifikasi OTP diaktifkan.', 'primary');
    });
  }
};
