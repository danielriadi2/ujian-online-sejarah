// ==============================
// KONFIGURASI SISTEM
// ==============================

// GANTI URL_INI dengan URL Web App dari Google Apps Script Anda
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygk9s36--qJDqpDLsmzPdLTjHiYzr7SFTZ2iH4zqoPs7Li-IIc6_bQ4DM3BYrT2oKs/exec';

// Soal ujian (materi Kerajaan Hindu-Budha)
const questions = [
    {
        id: 1,
        question: "Kerajaan Hindu pertama di Indonesia adalah...",
        options: [
            "Kutai",
            "Tarumanegara",
            "Sriwijaya",
            "Majapahit"
        ],
        correct: "Kutai",
        explanation: "Kerajaan Kutai di Kalimantan Timur adalah kerajaan Hindu pertama di Indonesia, berdiri sekitar abad ke-4 M."
    },
    {
        id: 2,
        question: "Raja yang terkenal dari Kerajaan Tarumanegara adalah...",
        options: [
            "Purnawarman",
            "Aswawarman",
            "Mulawarman",
            "Sanjaya"
        ],
        correct: "Purnawarman",
        explanation: "Raja Purnawarman adalah raja terbesar Kerajaan Tarumanegara yang memerintah sekitar abad ke-5 M."
    },
    {
        id: 3,
        question: "Peninggalan Kerajaan Kutai yang terkenal adalah...",
        options: [
            "Prasasti Yupa",
            "Candi Borobudur",
            "Prasasti Ciaruteun",
            "Candi Prambanan"
        ],
        correct: "Prasasti Yupa",
        explanation: "Prasasti Yupa adalah tujuh buah prasasti yang menjadi sumber sejarah Kerajaan Kutai."
    },
    {
        id: 4,
        question: "Kerajaan Mataram Kuno diperintah oleh dua dinasti, yaitu...",
        options: [
            "Sanjaya dan Syailendra",
            "Sailendra dan Warmadewa",
            "Rajasa dan Girindra",
            "Isyana dan Dharmawangsa"
        ],
        correct: "Sanjaya dan Syailendra",
        explanation: "Kerajaan Mataram Kuno diperintah oleh Dinasti Sanjaya (Hindu) dan Dinasti Syailendra (Buddha)."
    },
    {
        id: 5,
        question: "Candi Borobudur dibangun pada masa pemerintahan raja...",
        options: [
            "Samaratungga",
            "Balaputradewa",
            "Rakai Pikatan",
            "Dharmawangsa"
        ],
        correct: "Samaratungga",
        explanation: "Candi Borobudur dibangun sekitar tahun 800 M pada masa pemerintahan Raja Samaratungga dari Dinasti Syailendra."
    },
    {
        id: 6,
        question: "Kerajaan Sriwijaya mencapai puncak kejayaan pada masa pemerintahan...",
        options: [
            "Balaputradewa",
            "Jayanegara",
            "Kertanegara",
            "Hayam Wuruk"
        ],
        correct: "Balaputradewa",
        explanation: "Balaputradewa adalah raja Sriwijaya yang memerintah pada abad ke-9 dan membawa kerajaan ke puncak kejayaan."
    },
    {
        id: 7,
        question: "Raja yang mempersatukan kerajaan-kerajaan di Jawa Timur dan mendirikan Kerajaan Singasari adalah...",
        options: [
            "Ken Arok",
            "Kertanegara",
            "Airlangga",
            "Raden Wijaya"
        ],
        correct: "Ken Arok",
        explanation: "Ken Arok mendirikan Kerajaan Singasari setelah mengalahkan Kerajaan Kediri pada tahun 1222 M."
    },
    {
        id: 8,
        question: "Kitab Sutasoma karya Mpu Tantular mengandung semboyan yang kemudian menjadi semboyan Indonesia, yaitu...",
        options: [
            "Bhinneka Tunggal Ika",
            "Tut Wuri Handayani",
            "Ing Ngarsa Sung Tuladha",
            "Unity in Diversity"
        ],
        correct: "Bhinneka Tunggal Ika",
        explanation: "Kitab Sutasoma mengandung falsafah 'Bhinneka Tunggal Ika' yang berarti 'Berbeda-beda tetapi tetap satu'."
    },
    {
        id: 9,
        question: "Kerajaan Majapahit mencapai puncak kejayaan pada masa pemerintahan...",
        options: [
            "Hayam Wuruk",
            "Raden Wijaya",
            "Tribhuwana Tunggadewi",
            "Kertanegara"
        ],
        correct: "Hayam Wuruk",
        explanation: "Hayam Wuruk memerintah Majapahit dari 1350-1389 M dengan didampingi Mahapatih Gajah Mada."
    },
    {
        id: 10,
        question: "Sumpah Palapa yang diucapkan Gajah Mada bertujuan untuk...",
        options: [
            "Menyatukan Nusantara",
            "Mengusir penjajah",
            "Membangun candi terbesar",
            "Memajukan pertanian"
        ],
        correct: "Menyatukan Nusantara",
        explanation: "Sumpah Palapa adalah sumpah Gajah Mada untuk menyatukan wilayah Nusantara di bawah kekuasaan Majapahit."
    }
];

// ==============================
// VARIABEL GLOBAL
// ==============================

let studentData = {
    nama: '',
    kelas: ''
};

let examData = {
    startTime: null,
    endTime: null,
    answers: {},
    shuffledQuestions: [],
    cheatingAttempts: 0,
    cheatingDetected: false
};

let currentQuestionIndex = 0;
let timerInterval = null;
let timeLeft = 15 * 60; // 15 menit dalam detik
let totalTime = 15 * 60;

// ==============================
// FUNGSI INISIALISASI
// ==============================

// Fungsi untuk mengacak array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fungsi untuk mengacak soal
function shuffleQuestions() {
    // Buat salinan soal
    let shuffled = [...questions];
    
    // Acak urutan soal
    shuffled = shuffleArray(shuffled);
    
    // Acak pilihan jawaban untuk setiap soal
    shuffled.forEach(q => {
        // Simpan jawaban yang benar
        const correctAnswer = q.correct;
        const correctIndex = q.options.indexOf(correctAnswer);
        
        // Acak pilihan jawaban
        q.options = shuffleArray(q.options);
        
        // Update jawaban yang benar sesuai dengan posisi baru
        q.correct = q.options[correctIndex];
    });
    
    return shuffled;
}

// ==============================
// FUNGSI DETEKSI KECURANGAN
// ==============================

// Deteksi ketika user mencoba membuka tab baru atau keluar dari halaman
function setupCheatingDetection() {
    // Deteksi ketika user kehilangan fokus dari halaman
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            // User berpindah tab atau minimize window
            handleCheatingDetected();
        }
    });
    
    // Deteksi sebelum window ditutup
    window.addEventListener('beforeunload', function(e) {
        if (examData.startTime && !examData.endTime) {
            // Hanya tampilkan peringatan jika ujian sedang berlangsung
            e.preventDefault();
            e.returnValue = 'Jika Anda keluar, ujian akan otomatis terkumpul dan dicatat sebagai kecurangan. Yakin ingin keluar?';
            handleCheatingDetected();
        }
    });
    
    // Deteksi ketika user mencoba membuka konteks menu (klik kanan)
    document.addEventListener('contextmenu', function(e) {
        if (examData.startTime && !examData.endTime) {
            e.preventDefault();
            showCheatingWarning();
        }
    });
    
    // Deteksi kombinasi tombol Ctrl+C, Ctrl+V, dll.
    document.addEventListener('keydown', function(e) {
        if (examData.startTime && !examData.endTime) {
            // Blokir screenshot (Print Screen)
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                showCheatingWarning();
            }
            
            // Blokir developer tools (F12, Ctrl+Shift+I, Ctrl+Shift+J)
            if (e.key === 'F12' || 
               (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
               (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                handleCheatingDetected();
            }
        }
    });
}

function handleCheatingDetected() {
    if (!examData.cheatingDetected && examData.startTime && !examData.endTime) {
        examData.cheatingAttempts++;
        examData.cheatingDetected = true;
        
        // Tampilkan peringatan
        document.getElementById('cheatingWarning').style.display = 'flex';
        showModal();
        
        // Tambahkan efek visual pada timer
        document.querySelector('.timer').classList.add('warning');
        
        // Jika sudah 3 kali kecurangan, langsung kumpulkan
        if (examData.cheatingAttempts >= 3) {
            setTimeout(submitExam, 2000);
        }
    }
}

function showCheatingWarning() {
    examData.cheatingAttempts++;
    if (examData.cheatingAttempts <= 2) {
        alert(`PERINGATAN (${examData.cheatingAttempts}/3): Tindakan ini terdeteksi sebagai upaya kecurangan. Jika dilakukan 3 kali, ujian akan otomatis terkumpul.`);
    }
}

// ==============================
// FUNGSI TAMPILAN
// ==============================

// Tampilkan modal peringatan
function showModal() {
    document.getElementById('warningModal').classList.add('active');
}

// Sembunyikan modal
function hideModal() {
    document.getElementById('warningModal').classList.remove('active');
}

// Tampilkan halaman login
function showLoginPage() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('examPage').classList.remove('active');
    document.getElementById('resultPage').classList.remove('active');
    
    // Reset form
    document.getElementById('studentForm').reset();
    
    // Reset data ujian
    resetExamData();
}

// Tampilkan halaman ujian
function showExamPage() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('examPage').classList.add('active');
    document.getElementById('resultPage').classList.remove('active');
    
    // Mulai timer
    startTimer();
    
    // Setup deteksi kecurangan
    setupCheatingDetection();
    
    // Tampilkan soal pertama
    displayQuestion(currentQuestionIndex);
    updateQuestionButtons();
}

// Tampilkan halaman hasil
function showResultPage() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('examPage').classList.remove('active');
    document.getElementById('resultPage').classList.add('active');
    
    // Tampilkan data siswa
    document.getElementById('resultNama').textContent = studentData.nama;
    document.getElementById('resultKelas').textContent = studentData.kelas;
    
    // Hitung skor
    calculateAndDisplayResults();
}

// Reset data ujian
function resetExamData() {
    examData = {
        startTime: null,
        endTime: null,
        answers: {},
        shuffledQuestions: [],
        cheatingAttempts: 0,
        cheatingDetected: false
    };
    
    currentQuestionIndex = 0;
    timeLeft = totalTime;
    clearInterval(timerInterval);
    
    // Reset tampilan timer
    document.getElementById('timer').textContent = formatTime(timeLeft);
    document.getElementById('progress').style.width = '100%';
}

// ==============================
// FUNGSI UJIAN
// ==============================

// Mulai timer
function startTimer() {
    examData.startTime = new Date();
    
    // Update timer setiap detik
    timerInterval = setInterval(function() {
        timeLeft--;
        
        // Update tampilan timer
        const timerElement = document.getElementById('timer');
        timerElement.textContent = formatTime(timeLeft);
        
        // Update progress bar
        const progressPercent = (timeLeft / totalTime) * 100;
        document.getElementById('progress').style.width = `${progressPercent}%`;
        
        // Ubah warna dan efek timer jika waktu hampir habis
        if (timeLeft <= 60) { // 1 menit terakhir
            timerElement.style.color = '#fff';
            timerElement.parentElement.classList.add('warning');
        } else if (timeLeft <= 300) { // 5 menit terakhir
            timerElement.style.color = '#ff9800';
        }
        
        // Jika waktu habis, kumpulkan otomatis
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000);
    
    // Buat timer floating saat scroll
    makeTimerSticky();
}
// Buat timer selalu terlihat saat scroll
function makeTimerSticky() {
    const timerElement = document.querySelector('.timer');
    const examHeader = document.querySelector('.exam-header');
    let isTimerFloating = false;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100 && !isTimerFloating) {
            // Buat timer floating
            timerElement.style.position = 'fixed';
            timerElement.style.top = '10px';
            timerElement.style.right = '20px';
            timerElement.style.zIndex = '1000';
            timerElement.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            timerElement.style.transform = 'scale(1.1)';
            isTimerFloating = true;
            
            // Tambahkan padding di header agar konten tidak tertutup
            examHeader.style.paddingBottom = '50px';
        } else if (scrollTop <= 100 && isTimerFloating) {
            // Kembalikan timer ke posisi semula
            timerElement.style.position = 'relative';
            timerElement.style.top = 'auto';
            timerElement.style.right = 'auto';
            timerElement.style.zIndex = 'auto';
            timerElement.style.boxShadow = '0 4px 12px rgba(26, 35, 126, 0.2)';
            timerElement.style.transform = 'scale(1)';
            isTimerFloating = false;
            
            // Hapus padding tambahan
            examHeader.style.paddingBottom = '15px';
        }
    });
}

// Format waktu dari detik ke MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Tampilkan soal
function displayQuestion(index) {
    const question = examData.shuffledQuestions[index];
    
    // Update judul soal
    document.getElementById('currentQuestion').textContent = index + 1;
    
    // Kosongkan container soal
    const container = document.querySelector('.questions-container');
    container.innerHTML = '';
    
    // Buat elemen soal
    const questionElement = document.createElement('div');
    questionElement.className = `question-item ${index === currentQuestionIndex ? 'active' : ''}`;
    questionElement.innerHTML = `
        <div class="question-text">
            <strong>Soal ${index + 1}:</strong> ${question.question}
        </div>
        <div class="options-container">
            ${question.options.map((option, i) => `
                <div class="option ${examData.answers[question.id] === option ? 'selected' : ''}" 
                     data-question-id="${question.id}" 
                     data-option="${option}">
                    <div class="option-letter">${String.fromCharCode(65 + i)}</div>
                    <div class="option-text">${option}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.appendChild(questionElement);
    
    // Tambahkan event listener untuk pilihan
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const questionId = parseInt(this.getAttribute('data-question-id'));
            const selectedOption = this.getAttribute('data-option');
            
            // Simpan jawaban
            examData.answers[questionId] = selectedOption;
            
            // Update tampilan
            document.querySelectorAll(`[data-question-id="${questionId}"]`).forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Update tombol navigasi
            updateQuestionButtons();
        });
    });
    
    // Update tombol navigasi
    updateNavigationButtons();
}

// Update tombol navigasi soal
function updateNavigationButtons() {
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    document.getElementById('nextBtn').disabled = currentQuestionIndex === examData.shuffledQuestions.length - 1;
}

// Update tombol nomor soal
function updateQuestionButtons() {
    const container = document.querySelector('.question-buttons');
    container.innerHTML = '';
    
    examData.shuffledQuestions.forEach((question, index) => {
        const button = document.createElement('button');
        button.className = `question-btn ${index === currentQuestionIndex ? 'active' : ''} ${examData.answers[question.id] ? 'answered' : ''}`;
        button.textContent = index + 1;
        button.addEventListener('click', () => {
            currentQuestionIndex = index;
            displayQuestion(currentQuestionIndex);
            updateQuestionButtons();
        });
        container.appendChild(button);
    });
}

// Pindah ke soal sebelumnya
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
        updateQuestionButtons();
    }
}

// Pindah ke soal berikutnya
function nextQuestion() {
    if (currentQuestionIndex < examData.shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
        updateQuestionButtons();
    }
}

// ==============================
// FUNGSI PENGUMPULAN DAN HASIL
// ==============================

// Kumpulkan ujian
function submitExam() {
    clearInterval(timerInterval);
    examData.endTime = new Date();
    
    // Hitung durasi dalam detik
    const durationMs = examData.endTime - examData.startTime;
    const durationSeconds = Math.floor(durationMs / 1000);
    
    // Hitung skor
    let correctCount = 0;
    examData.shuffledQuestions.forEach(question => {
        if (examData.answers[question.id] === question.correct) {
            correctCount++;
        }
    });
    
    const score = Math.round((correctCount / examData.shuffledQuestions.length) * 100);
    
    // Siapkan data untuk dikirim ke Google Sheets
    const submissionData = {
        nama: studentData.nama,
        kelas: studentData.kelas,
        waktuMulai: examData.startTime.toLocaleString("id-ID"),
        waktuSelesai: examData.endTime.toLocaleString("id-ID"),
        durasiDetik: durationSeconds,
        skor: score,
        jawaban: examData.answers,
        logKecurangan: examData.cheatingAttempts > 0 ? `${examData.cheatingAttempts} kali` : "-",
        statusKecurangan: examData.cheatingDetected ? "Ya" : "Tidak"
    };
    
    // Kirim data ke Google Sheets
    sendDataToGoogleSheets(submissionData);
    
    // Tampilkan halaman hasil
    showResultPage();
}

// Kirim data ke Google Sheets via Google Apps Script
async function sendDataToGoogleSheets(data) {
    try {
        // Periksa apakah URL Google Script sudah dikonfigurasi
        if (GOOGLE_SCRIPT_URL.includes('URL_WEB_APP_ANDA')) {
            console.warn('URL Google Apps Script belum dikonfigurasi. Data tidak dikirim.');
            return;
        }
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Mode no-cors karena Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Catat di console (tidak bisa mendapatkan response karena no-cors)
        console.log('Data berhasil dikirim ke Google Sheets');
    } catch (error) {
        console.error('Error mengirim data:', error);
    }
}

// Hitung dan tampilkan hasil
function calculateAndDisplayResults() {
    // Hitung jawaban benar dan salah
    let correctCount = 0;
    let wrongQuestions = [];
    
    examData.shuffledQuestions.forEach(question => {
        const userAnswer = examData.answers[question.id];
        const isCorrect = userAnswer === question.correct;
        
        if (isCorrect) {
            correctCount++;
        } else {
            wrongQuestions.push({
                question: question.question,
                explanation: question.explanation
            });
        }
    });
    
    const score = Math.round((correctCount / examData.shuffledQuestions.length) * 100);
    
    // Update tampilan hasil
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('correctAnswers').textContent = correctCount;
    document.getElementById('wrongAnswers').textContent = examData.shuffledQuestions.length - correctCount;
    
    // Hitung durasi
    const durationMs = examData.endTime - examData.startTime;
    const durationMinutes = Math.floor(durationMs / 60000);
    const durationSeconds = Math.floor((durationMs % 60000) / 1000);
    document.getElementById('durationResult').textContent = `${durationMinutes} menit ${durationSeconds} detik`;
    document.getElementById('resultWaktu').textContent = `${durationMinutes} menit ${durationSeconds} detik`;
    
    // Animasikan lingkaran skor
    animateScoreCircle(score);
    
    // Tampilkan soal yang salah
    displayWrongAnswers(wrongQuestions);
    
    // Tampilkan pesan motivasi
    displayMotivationMessage(score);
}

// Animasi lingkaran skor
function animateScoreCircle(score) {
    const circle = document.getElementById('scoreCircle');
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    
    // Set animasi CSS
    circle.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
    circle.style.strokeDashoffset = offset;
    
    // Ubah warna berdasarkan skor
    if (score >= 80) {
        circle.style.stroke = '#4CAF50'; // Hijau
    } else if (score >= 60) {
        circle.style.stroke = '#FF9800'; // Oranye
    } else {
        circle.style.stroke = '#f44336'; // Merah
    }
}

// Tampilkan soal yang salah TANPA koreksi
function displayWrongAnswers(wrongQuestions) {
    const container = document.getElementById('wrongAnswersContainer');
    const listContainer = container.querySelector('.wrong-answers-list');
    
    if (wrongQuestions.length === 0) {
        container.innerHTML = `
            <div class="success-message">
                <h3><i class="fas fa-check-circle"></i> SELAMAT! SEMUA JAWABAN BENAR</h3>
                <div class="motivation-message">
                    <p>Anda telah menjawab semua soal dengan benar. Pertahankan prestasi ini!</p>
                </div>
            </div>
        `;
        return;
    }
    
    listContainer.innerHTML = '';
    
    wrongQuestions.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'wrong-answer-item';
        itemElement.innerHTML = `
            <p><strong>Soal ${index + 1}:</strong> ${item.question}</p>
            <p><i class="fas fa-exclamation-triangle"></i> <em>Jawaban Anda salah pada soal ini. Pelajari kembali materinya.</em></p>
        `;
        listContainer.appendChild(itemElement);
    });
}

// Tampilkan pesan motivasi berdasarkan skor
function displayMotivationMessage(score) {
    const container = document.getElementById('motivationMessage');
    let message = '';
    
    if (score >= 90) {
        message = "Luar biasa! Skor Anda sangat memuaskan. Pertahankan semangat belajar Anda dan teruslah berprestasi!";
    } else if (score >= 80) {
        message = "Bagus sekali! Anda telah memahami materi dengan baik. Tingkatkan lagi dengan belajar lebih giat.";
    } else if (score >= 70) {
        message = "Sudah baik, namun masih ada ruang untuk perbaikan. Pelajari kembali materi yang kurang dikuasai.";
    } else if (score >= 60) {
        message = "Cukup baik, tetapi perlu peningkatan. Jangan menyerah, belajar lebih giat lagi untuk hasil yang lebih baik.";
    } else if (score >= 50) {
        message = "Anda perlu lebih serius dalam belajar. Identifikasi kelemahan Anda dan fokus untuk memperbaikinya.";
    } else {
        message = "Jangan berkecil hati. Kegagalan adalah awal dari kesuksesan. Pelajari kembali materi dengan tekun dan coba lagi!";
    }
    
    container.innerHTML = `<p>"${message}"</p>`;
}

// ==============================
// EVENT LISTENERS
// ==============================

// Form login siswa
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Ambil data siswa
    studentData.nama = document.getElementById('nama').value.trim();
    studentData.kelas = document.getElementById('kelas').value;
    
    // Validasi
    if (!studentData.nama || !studentData.kelas) {
        alert('Harap isi nama lengkap dan pilih kelas!');
        return;
    }
    
    // Acak soal
    examData.shuffledQuestions = shuffleQuestions();
    
    // Tampilkan data siswa di halaman ujian
    document.getElementById('displayNama').textContent = studentData.nama;
    document.getElementById('displayKelas').textContent = studentData.kelas;
    document.getElementById('totalQuestions').textContent = examData.shuffledQuestions.length;
    
    // Tampilkan halaman ujian
    showExamPage();
});

// Tombol navigasi soal
document.getElementById('prevBtn').addEventListener('click', prevQuestion);
document.getElementById('nextBtn').addEventListener('click', nextQuestion);

// Tombol kumpulkan ujian
document.getElementById('submitBtn').addEventListener('click', function() {
    const confirmSubmit = confirm('Apakah Anda yakin ingin mengumpulkan ujian? Pastikan semua soal telah terjawab.');
    if (confirmSubmit) {
        submitExam();
    }
});

// Tombol modal
document.getElementById('modalOkBtn').addEventListener('click', function() {
    hideModal();
    submitExam();
});

// Tombol ujian lagi
document.getElementById('restartBtn').addEventListener('click', showLoginPage);

// ==============================
// INISIALISASI SAAT HALAMAN DIMUAT
// ==============================

document.addEventListener('DOMContentLoaded', function() {
    // Tampilkan halaman login saat pertama kali dimuat
    showLoginPage();
    
    // Cek apakah URL Google Script sudah dikonfigurasi
    if (GOOGLE_SCRIPT_URL.includes('URL_WEB_APP_ANDA')) {
        console.warn('PERINGATAN: URL Google Apps Script belum dikonfigurasi. Data hasil ujian tidak akan disimpan.');
        
        // Tampilkan peringatan di console
        setTimeout(() => {
            alert('PERINGATAN SISTEM: URL Google Apps Script belum dikonfigurasi. Silakan ikuti langkah-langkah di dokumentasi untuk mengonfigurasi penyimpanan data.');
        }, 1000);
    }
});
