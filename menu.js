const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('open');
        burger.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            burger.classList.remove('active');
        });
    });
}

const btnLoginPopup = document.getElementById('btn-login-popup');
const btnRegisterPopup = document.getElementById('btn-register-popup');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const closeLogin = document.getElementById('close-login');
const closeRegister = document.getElementById('close-register');

function openModal(modal) {
    if (modal) modal.style.display = 'flex';
}

function closeModal(modal) {
    if (modal) modal.style.display = 'none';
}

if (btnLoginPopup && loginModal) {
    btnLoginPopup.addEventListener('click', () => openModal(loginModal));
}

if (closeLogin && loginModal) {
    closeLogin.addEventListener('click', () => closeModal(loginModal));
}

if (btnRegisterPopup && registerModal) {
    btnRegisterPopup.addEventListener('click', () => openModal(registerModal));
}

if (closeRegister && registerModal) {
    closeRegister.addEventListener('click', () => closeModal(registerModal));
}

window.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal(loginModal);
    if (e.target === registerModal) closeModal(registerModal);
});

const loginForm = document.getElementById('form-login');
const registerForm = document.getElementById('form-register');

if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const birthdate = document.getElementById('birthdate').value;
        const idFront = document.getElementById('id-front').files[0];
        const idBack = document.getElementById('id-back').files[0];
        const errorDiv = document.getElementById('register-error');

        if (!fullname || !email || !password || !birthdate || !idFront || !idBack) {
            errorDiv.textContent = 'Tous les champs sont obligatoires.';
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorDiv.textContent = 'Email invalide.';
            return;
        }

        if (!/^.*(?=.{8,})(?=.*\d)(?=.*[a-zA-Z]).*$/.test(password)) {
            errorDiv.textContent = 'Mot de passe trop faible (8 caractères, 1 lettre, 1 chiffre).';
            return;
        }

        const age = getAge(birthdate);
        if (age < 18) {
            errorDiv.textContent = 'Vous devez avoir au moins 18 ans pour vous inscrire.';
            return;
        }

        errorDiv.textContent = 'Inscription réussie ! (simulation)';
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = this.querySelector('input[type="email"]').value.trim();
        const password = this.querySelector('input[type="password"]').value;
        let errorDiv = document.getElementById('login-error');

        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'login-error';
            errorDiv.style.color = '#ff4c4c';
            this.appendChild(errorDiv);
        }

        if (!email || !password) {
            errorDiv.textContent = 'Veuillez remplir tous les champs.';
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorDiv.textContent = 'Email invalide.';
            return;
        }

        errorDiv.textContent = 'Connexion réussie ! (simulation)';
    });
}

function getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}