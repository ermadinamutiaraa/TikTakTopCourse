document.addEventListener('DOMContentLoaded', function () {
  console.log('Tik Tak Top Course Script Loaded');

  /* ================= GOOGLE APPS SCRIPT ================= */
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwxQd45T50t4QifrMl2Q0K6dqQx0DoAt9PN53A_yXi9UJNjp8zFlRi0E0hWBe6ehsQNUg/exec";

  /* ================= MOBILE MENU ================= */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.querySelector('i').classList.toggle('fa-bars');
      hamburger.querySelector('i').classList.toggle('fa-times');
    });
  }

  /* ================= PILIH KELAS ================= */
  document.querySelectorAll('.course-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseName = btn.dataset.courseName;
      const select = document.getElementById('anggotaProgram');
      if (!select) return;
      Array.from(select.options).forEach(option => {
        option.selected = option.text.trim() === courseName.trim();
      });
      document
        .getElementById('register')
        ?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ================= FORM ================= */
  const registrationForm = document.getElementById('registrationForm');
  const responseMessage = document.getElementById('responseMessage');

  function showResponseMessage(message, type) {
    responseMessage.innerHTML = message;
    responseMessage.className = `response-message ${type}`;
    responseMessage.style.display = 'block';

    setTimeout(() => {
      responseMessage.style.display = 'none';
    }, 7000);
  }

  function formatPhone(phone) {
    let p = phone.replace(/\D/g, '');
    if (p.startsWith('0')) return '62' + p.slice(1);
    if (p.startsWith('8')) return '62' + p;
    return p;
  }

  if (registrationForm) {
    registrationForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('.submit-btn');
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
      submitBtn.disabled = true;

      const formData = new FormData();
      formData.append('anggotaNama', this.anggotaNama.value);
      formData.append(
        'anggotaProgram',
        document.getElementById('anggotaProgram').selectedOptions[0].text
      );
      formData.append('anggotaNIK', this.anggotaNIK.value);
      formData.append('anggotaAlamat', this.anggotaAlamat.value);
      formData.append(
        'anggotaWhatsApp',
        formatPhone(this.anggotaWhatsApp.value)
      );

      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwxQd45T50t4QifrMl2Q0K6dqQx0DoAt9PN53A_yXi9UJNjp8zFlRi0E0hWBe6ehsQNUg/exec", {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
          const memberId =
            'TTTC-' +
            Math.random().toString(36).substring(2, 10).toUpperCase();

          showResponseMessage(
            `✅ <strong>Pendaftaran Berhasil!</strong><br>
            Nama: <strong>${this.anggotaNama.value}</strong><br>
            Kelas: <strong>${formData.get('anggotaProgram')}</strong><br>
            ID Anggota: <strong>${memberId}</strong>`,
            'success'
          );

          registrationForm.reset();
        } else {
          showResponseMessage(
            `❌ <strong>Gagal menyimpan data</strong><br>${result.message || ''}`,
            'error'
          );
        }
      } catch (error) {
        console.error(error);
        showResponseMessage(
          `⚠️ <strong>Koneksi bermasalah</strong><br>Silakan coba lagi.`,
          'warning'
        );
      }

      submitBtn.innerHTML =
        '<i class="fas fa-user-plus"></i> Daftar sebagai Anggota';
      submitBtn.disabled = false;
    });
  }

  /* ================= COUNTER ================= */
  function animateCounter(el, target) {
    let current = 0;
    const step = target / 100;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, 20);
  }

  const statsContainer = document.getElementById('statsContainer');
  if (statsContainer) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statsContainer
            .querySelectorAll('h3[data-count]')
            .forEach(el => {
              animateCounter(el, parseInt(el.dataset.count));
            });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsContainer);
  }

  console.log('All scripts initialized successfully');
});
