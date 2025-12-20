document.addEventListener('DOMContentLoaded', function () {
    console.log('Tik Tak Top Course Script Loaded');

    /* ================= VARIABEL GLOBAL ================= */
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwxQd45T50t4QifrMl2Q0K6dqQx0DoAt9PN53A_yXi9UJNjp8zFlRi0E0hWBe6ehsQNUg/exec";
    let isSubmitting = false;

    /* ================= ELEMEN DOM ================= */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const registrationForm = document.getElementById('registrationForm');
    const responseMessage = document.getElementById('responseMessage');
    const backToTopBtn = document.getElementById('backToTop');
    const courseNotification = document.getElementById('courseNotification');
    const closeNotificationBtn = document.getElementById('closeNotification');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');

    /* ================= MOBILE MENU ================= */
    function initMobileMenu() {
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                navMenu.classList.toggle('active');
                const icon = hamburger.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
                
                // Toggle body scroll
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                    navMenu.classList.remove('active');
                    hamburger.querySelector('i').classList.remove('fa-times');
                    hamburger.querySelector('i').classList.add('fa-bars');
                    document.body.style.overflow = '';
                }
            });

            // Close menu when clicking on nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    hamburger.querySelector('i').classList.remove('fa-times');
                    hamburger.querySelector('i').classList.add('fa-bars');
                    document.body.style.overflow = '';
                });
            });

            // Close dropdowns on mobile
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                });
            });
        }
    }

    /* ================= PILIH KELAS OTOMATIS ================= */
    function initCourseSelection() {
        document.querySelectorAll('.course-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const courseName = btn.dataset.courseName;
                const courseValue = btn.dataset.course;
                const select = document.getElementById('anggotaProgram');
                
                if (select) {
                    // Find and select the matching option
                    const options = Array.from(select.options);
                    const matchingOption = options.find(option => 
                        option.value === courseValue || 
                        option.text.includes(courseName)
                    );
                    
                    if (matchingOption) {
                        select.value = matchingOption.value;
                        
                        // Trigger change event
                        select.dispatchEvent(new Event('change'));
                    }
                }
                
                // Show notification
                showNotification(`Kelas "${courseName}" telah dipilih!`);
                
                // Scroll to form
                document.getElementById('register')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the selected field
                if (select) {
                    select.style.borderColor = '#00d4ff';
                    select.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.2)';
                    setTimeout(() => {
                        select.style.borderColor = '';
                        select.style.boxShadow = '';
                    }, 2000);
                }
            });
        });
    }

    /* ================= NOTIFICATION SYSTEM ================= */
    function initNotificationSystem() {
        // Show notification
        function showNotification(message) {
            if (courseNotification) {
                const notificationBody = courseNotification.querySelector('.notification-body p');
                if (notificationBody) {
                    notificationBody.textContent = message;
                }
                
                courseNotification.style.display = 'block';
                
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    hideNotification();
                }, 5000);
            }
        }
        
        // Hide notification
        function hideNotification() {
            if (courseNotification) {
                courseNotification.style.display = 'none';
            }
        }
        
        // Close notification button
        if (closeNotificationBtn) {
            closeNotificationBtn.addEventListener('click', hideNotification);
        }
        
        // Close notification when clicking outside
        document.addEventListener('click', (e) => {
            if (courseNotification && courseNotification.style.display === 'block' && 
                !courseNotification.contains(e.target) && 
                !e.target.closest('.course-btn')) {
                hideNotification();
            }
        });
        
        return { showNotification, hideNotification };
    }

    /* ================= LIGHTBOX SYSTEM ================= */
    function initLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('h3').textContent;
                const description = item.querySelector('p').textContent;
                
                if (img && lightboxModal) {
                    lightboxImage.src = img.src;
                    lightboxImage.alt = img.alt;
                    lightboxTitle.textContent = title;
                    lightboxDescription.textContent = description;
                    
                    lightboxModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
            
            // Add keyboard support
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
        
        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close lightbox when clicking outside
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* ================= FORM VALIDASI DAN SUBMIT ================= */
    function initForm() {
        if (!registrationForm || !responseMessage) return;

        // Format phone number
        function formatPhone(phone) {
            if (!phone) return '';
            let p = phone.replace(/\D/g, '');
            
            // Handle various formats
            if (p.startsWith('0')) {
                return '62' + p.slice(1);
            } else if (p.startsWith('8')) {
                return '62' + p;
            } else if (!p.startsWith('62')) {
                return '62' + p;
            }
            return p;
        }

        // Validate phone number
        function validatePhone(phone) {
            const formatted = formatPhone(phone);
            return /^62\d{9,12}$/.test(formatted);
        }

        // Validate NIK/Student ID
        function validateNIK(nik) {
            // Bersihkan dulu dari semua karakter non-digit termasuk -
            const cleaned = nik.replace(/\D/g, '');
            // Accept: 16-digit NIK or 6-20 digit student ID
            return /^\d{16}$/.test(cleaned) || /^\d{6,20}$/.test(cleaned);
        }

        // Function untuk membersihkan NIK dari tanda -
        function cleanNIK(nik) {
            if (!nik) return '';
            // Hapus semua karakter non-digit termasuk tanda -
            return nik.replace(/\D/g, '');
        }

        // Show response message
        function showResponseMessage(message, type = 'success') {
            responseMessage.innerHTML = message;
            responseMessage.className = `response-message ${type}`;
            responseMessage.style.display = 'block';
            
            // Auto-hide after 7 seconds
            setTimeout(() => {
                responseMessage.style.display = 'none';
            }, 7000);
            
            // Scroll to message
            responseMessage.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }

        // Show loading state
        function showLoading(button, isLoading) {
            if (isLoading) {
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
                button.disabled = true;
            } else {
                button.innerHTML = '<i class="fas fa-user-plus"></i> Daftar sebagai Anggota';
                button.disabled = false;
            }
        }

        // Real-time validation
        function initRealTimeValidation() {
            const inputs = registrationForm.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                // Validate on blur
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                // Clear error on focus
                input.addEventListener('focus', function() {
                    this.style.borderColor = '';
                    this.style.boxShadow = '';
                    const errorElement = this.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('field-error')) {
                        errorElement.remove();
                    }
                });
            });
        }

        // Validate individual field
        function validateField(field) {
            let isValid = true;
            let errorMessage = '';
            
            switch(field.id) {
                case 'anggotaNama':
                    if (!field.value.trim()) {
                        isValid = false;
                        errorMessage = 'Nama lengkap harus diisi';
                    } else if (field.value.trim().length < 3) {
                        isValid = false;
                        errorMessage = 'Nama minimal 3 karakter';
                    }
                    break;
                    
                case 'anggotaProgram':
                    if (!field.value) {
                        isValid = false;
                        errorMessage = 'Pilih program kelas';
                    }
                    break;
                    
                case 'anggotaNIK':
                    if (!field.value.trim()) {
                        isValid = false;
                        errorMessage = 'NIK/Nomor induk harus diisi';
                    } else if (!validateNIK(field.value)) {
                        isValid = false;
                        errorMessage = 'NIK 16 digit atau nomor induk 6-20 digit';
                    }
                    break;
                    
                case 'anggotaAlamat':
                    if (!field.value.trim()) {
                        isValid = false;
                        errorMessage = 'Alamat harus diisi';
                    } else if (field.value.trim().length < 10) {
                        isValid = false;
                        errorMessage = 'Alamat terlalu pendek';
                    }
                    break;
                    
                case 'anggotaWhatsApp':
                    if (!field.value.trim()) {
                        isValid = false;
                        errorMessage = 'Nomor WhatsApp harus diisi';
                    } else if (!validatePhone(field.value)) {
                        isValid = false;
                        errorMessage = 'Format nomor WhatsApp tidak valid';
                    }
                    break;
            }
            
            // Show/hide error
            if (!isValid) {
                field.style.borderColor = '#ff6b6b';
                field.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
                
                // Remove existing error
                const existingError = field.nextElementSibling;
                if (existingError && existingError.classList.contains('field-error')) {
                    existingError.remove();
                }
                
                // Add new error
                const errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                errorElement.style.color = '#ff6b6b';
                errorElement.style.fontSize = '0.85rem';
                errorElement.style.marginTop = '8px';
                errorElement.style.padding = '8px 12px';
                errorElement.style.background = 'rgba(255, 107, 107, 0.1)';
                errorElement.style.borderRadius = '6px';
                errorElement.style.borderLeft = '3px solid #ff6b6b';
                errorElement.innerHTML = errorMessage;
                
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            } else {
                field.style.borderColor = '#00d4ff';
                field.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.2)';
                
                // Remove existing error
                const existingError = field.nextElementSibling;
                if (existingError && existingError.classList.contains('field-error')) {
                    existingError.remove();
                }
                
                // Reset border after 2 seconds
                setTimeout(() => {
                    field.style.borderColor = '';
                    field.style.boxShadow = '';
                }, 2000);
            }
            
            return isValid;
        }

        // Validate entire form
        function validateForm() {
            let isValid = true;
            const fields = [
                'anggotaNama',
                'anggotaProgram',
                'anggotaNIK',
                'anggotaAlamat',
                'anggotaWhatsApp'
            ];
            
            fields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !validateField(field)) {
                    isValid = false;
                }
            });
            
            // Validate terms checkbox
            const termsCheckbox = document.getElementById('anggotaTerms');
            if (!termsCheckbox.checked) {
                isValid = false;
                const checkboxGroup = termsCheckbox.closest('.checkbox-group');
                checkboxGroup.style.border = '1px solid #ff6b6b';
                checkboxGroup.style.padding = '12px';
                checkboxGroup.style.borderRadius = '8px';
                checkboxGroup.style.background = 'rgba(255, 107, 107, 0.05)';
            } else {
                const checkboxGroup = termsCheckbox.closest('.checkbox-group');
                checkboxGroup.style.border = '';
                checkboxGroup.style.padding = '';
                checkboxGroup.style.background = '';
            }
            
            return isValid;
        }

        // Form submission
        registrationForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            // Prevent double submission
            if (isSubmitting) {
                showResponseMessage(
                    '⚠️ <strong>Sedang memproses...</strong><br>Harap tunggu sebentar.',
                    'warning'
                );
                return;
            }
            
            // Validate form
            if (!validateForm()) {
                showResponseMessage(
                    '❌ <strong>Form tidak valid</strong><br>Harap periksa kembali data yang Anda masukkan.',
                    'error'
                );
                return;
            }
            
            const submitBtn = this.querySelector('.submit-btn');
            isSubmitting = true;
            showLoading(submitBtn, true);
            
            // Bersihkan NIK dari tanda - sebelum dikirim
            const cleanedNIK = cleanNIK(this.anggotaNIK.value.trim());
            
            // Prepare form data dengan NIK yang sudah dibersihkan
            const formData = new FormData();
            formData.append('timestamp', new Date().toISOString());
            formData.append('anggotaNama', this.anggotaNama.value.trim());
            formData.append('anggotaProgram', 
                document.getElementById('anggotaProgram').selectedOptions[0].text
            );
            // Kirim NIK yang sudah dibersihkan (tanpa tanda -)
            formData.append('anggotaNIK', cleanedNIK);
            formData.append('anggotaAlamat', this.anggotaAlamat.value.trim());
            formData.append('anggotaWhatsApp', formatPhone(this.anggotaWhatsApp.value));
            formData.append('anggotaTerms', this.anggotaTerms.checked ? 'Ya' : 'Tidak');
            
            try {
                console.log('Mengirim data ke Google Sheets...');
                console.log('NIK yang dikirim (setelah dibersihkan):', cleanedNIK);
                
                // Send to Google Sheets
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                });
                
                // Generate member ID
                const memberId = 'TTTC-' + Date.now().toString().slice(-8);
                
                // Success message
                showResponseMessage(
                    `✅ <strong>Pendaftaran Berhasil!</strong><br>
                    <strong>ID Anggota:</strong> ${memberId}<br>
                    <strong>Nama:</strong> ${formData.get('anggotaNama')}<br>
                    <strong>Program:</strong> ${formData.get('anggotaProgram')}<br><br>
                    Tim kami akan menghubungi Anda via WhatsApp dalam 1x24 jam.`,
                    'success'
                );
                
                // Reset form
                registrationForm.reset();
                
                // Reset form styles
                document.querySelectorAll('.field-error').forEach(error => error.remove());
                document.querySelectorAll('input, select, textarea').forEach(field => {
                    field.style.borderColor = '';
                    field.style.boxShadow = '';
                });
                
                // Reset checkbox group
                const checkboxGroup = document.querySelector('.checkbox-group');
                if (checkboxGroup) {
                    checkboxGroup.style.border = '';
                    checkboxGroup.style.padding = '';
                    checkboxGroup.style.background = '';
                }
                
            } catch (error) {
                console.error('Error submitting form:', error);
                showResponseMessage(
                    `⚠️ <strong>Terjadi kesalahan</strong><br>
                    Silakan coba lagi atau hubungi admin di WhatsApp.<br>
                    Error: ${error.message}`,
                    'error'
                );
            } finally {
                isSubmitting = false;
                showLoading(submitBtn, false);
            }
        });

        // Reset form button
        const resetBtn = registrationForm.querySelector('.reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Clear all errors
                document.querySelectorAll('.field-error').forEach(error => error.remove());
                document.querySelectorAll('input, select, textarea').forEach(field => {
                    field.style.borderColor = '';
                    field.style.boxShadow = '';
                });
                
                // Reset checkbox group
                const checkboxGroup = document.querySelector('.checkbox-group');
                if (checkboxGroup) {
                    checkboxGroup.style.border = '';
                    checkboxGroup.style.padding = '';
                    checkboxGroup.style.background = '';
                }
                
                // Hide response message
                responseMessage.style.display = 'none';
            });
        }

        // Initialize real-time validation
        initRealTimeValidation();
    }

    /* ================= STATS COUNTER ANIMATION ================= */
    function initStatsCounter() {
        const statsContainer = document.getElementById('statsContainer');
        if (!statsContainer) return;

        function animateCounter(el, target) {
            let current = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statsContainer.querySelectorAll('h3[data-count]').forEach(el => {
                        const target = parseInt(el.dataset.count);
                        animateCounter(el, target);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsContainer);
    }

    /* ================= BACK TO TOP BUTTON ================= */
    function initBackToTop() {
        if (!backToTopBtn) return;

        // Show/hide button
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ================= ACTIVE NAV LINK ================= */
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    /* ================= FORM INPUT MASK ================= */
    function initInputMask() {
        const phoneInput = document.getElementById('anggotaWhatsApp');
        const nikInput = document.getElementById('anggotaNIK');
        
        // Phone number mask
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    value = value.replace(/^(\d{0,4})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) => {
                        let result = '';
                        if (p1) result += p1;
                        if (p2) result += '-' + p2;
                        if (p3) result += '-' + p3;
                        return result;
                    });
                }
                
                e.target.value = value;
            });
        }
        
        // NIK mask
        if (nikInput) {
            nikInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    value = value.replace(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/, 
                        (match, p1, p2, p3, p4) => {
                            let result = '';
                            if (p1) result += p1;
                            if (p2) result += '-' + p2;
                            if (p3) result += '-' + p3;
                            if (p4) result += '-' + p4;
                            return result;
                        }
                    );
                }
                
                e.target.value = value;
            });
            
            // Tambahkan event untuk membersihkan nilai sebelum submit (untuk preview di console)
            nikInput.addEventListener('change', function() {
                console.log('NIK sebelum dibersihkan:', this.value);
                console.log('NIK setelah dibersihkan:', cleanNIK(this.value));
            });
        }
    }

    /* ================= INITIALIZE ALL FUNCTIONS ================= */
    function initAll() {
        initMobileMenu();
        initCourseSelection();
        initNotificationSystem();
        initLightbox();
        initForm();
        initStatsCounter();
        initBackToTop();
        initActiveNav();
        initInputMask();
        
        console.log('All scripts initialized successfully');
    }

    /* ================= ERROR HANDLING ================= */
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
    });

    /* ================= START APPLICATION ================= */
    initAll();
});