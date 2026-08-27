const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.classList.toggle('active');
});

// Optionnel : fermer le menu au clic sur un lien
nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.classList.remove('active');
    });
});

// Affichage de la modale
const btnAuthPopup = document.getElementById('btn-auth-popup');
const authModal = document.getElementById('auth-modal');
const closeAuth = document.getElementById('close-auth');

btnAuthPopup.addEventListener('click', () => {
    authModal.style.display = 'flex';
});
closeAuth.addEventListener('click', () => {
    authModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.style.display = 'none';
});

// Auth tabs
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

btnLogin.addEventListener('click', () => {
    btnLogin.classList.add('active');
    btnRegister.classList.remove('active');
    loginForm.style.display = '';
    registerForm.style.display = 'none';
});
btnRegister.addEventListener('click', () => {
    btnRegister.classList.add('active');
    btnLogin.classList.remove('active');
    loginForm.style.display = 'none';
    registerForm.style.display = '';
});

// Inscription : vérification avancée
document.getElementById('form-register').addEventListener('submit', function(e) {
    e.preventDefault();
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const birthdate = document.getElementById('birthdate').value;
    const idFront = document.getElementById('id-front').files[0];
    const idBack = document.getElementById('id-back').files[0];
    const errorDiv = document.getElementById('register-error');

    // Vérification des champs
    if (!fullname || !email || !password || !birthdate || !idFront || !idBack) {
        errorDiv.textContent = "Tous les champs sont obligatoires.";
        return;
    }
    // Vérification email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorDiv.textContent = "Email invalide.";
        return;
    }
    // Vérification mot de passe (min 8 caractères, 1 chiffre, 1 lettre)
    if (!/^.*(?=.{8,})(?=.*\d)(?=.*[a-zA-Z]).*$/.test(password)) {
        errorDiv.textContent = "Mot de passe trop faible (8 caractères, 1 lettre, 1 chiffre).";
        return;
    }
    // Vérification âge
    const age = getAge(birthdate);
    if (age < 18) {
        errorDiv.textContent = "Vous devez avoir au moins 18 ans pour vous inscrire.";
        return;
    }
    errorDiv.textContent = "Inscription réussie ! (simulation)";
    // Ici, vous pouvez ajouter la logique d'envoi vers un serveur
});

// Connexion : vérification simple
document.querySelector('#login-form form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value.trim();
    const password = this.querySelector('input[type="password"]').value;
    // Ajout d'un message d'erreur si besoin
    let errorDiv = document.getElementById('login-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'login-error';
        errorDiv.style.color = '#ff4c4c';
        this.appendChild(errorDiv);
    }
    if (!email || !password) {
        errorDiv.textContent = "Veuillez remplir tous les champs.";
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorDiv.textContent = "Email invalide.";
        return;
    }
    errorDiv.textContent = "Connexion réussie ! (simulation)";
    // Ici, vous pouvez ajouter la logique de vérification réelle
});

// Connexion
const btnLoginPopup = document.getElementById('btn-login-popup');
const loginModal = document.getElementById('login-modal');
const closeLogin = document.getElementById('close-login');
btnLoginPopup.addEventListener('click', () => loginModal.style.display = 'flex');
closeLogin.addEventListener('click', () => loginModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
});

// Inscription
const btnRegisterPopup = document.getElementById('btn-register-popup');
const registerModal = document.getElementById('register-modal');
const closeRegister = document.getElementById('close-register');
btnRegisterPopup.addEventListener('click', () => registerModal.style.display = 'flex');
closeRegister.addEventListener('click', () => registerModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === registerModal) registerModal.style.display = 'none';
});

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