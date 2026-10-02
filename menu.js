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

const USERS_KEY = 'gitbank-users';
const SESSION_KEY = 'gitbank-user';
const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
};

let firebaseAuth = null;
let isFirebaseConfigured = false;

if (window.firebase) {
    const hasRealConfig = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('YOUR_');
    if (hasRealConfig) {
        try {
            const app = firebase.initializeApp(firebaseConfig);
            firebaseAuth = firebase.auth();
            isFirebaseConfigured = true;
        } catch (error) {
            console.warn('Firebase init failed:', error);
        }
    }
}

const btnLoginPopup = document.getElementById('btn-login-popup');
const btnRegisterPopup = document.getElementById('btn-register-popup');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const closeLogin = document.getElementById('close-login');
const closeRegister = document.getElementById('close-register');

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function updateAuthButtons() {
    const sessionUser = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    const loginBtn = document.getElementById('btn-login-popup');
    const registerBtn = document.getElementById('btn-register-popup');

    if (loginBtn) {
        loginBtn.textContent = sessionUser ? 'Mon compte' : 'Connexion';
    }

    if (registerBtn) {
        registerBtn.textContent = sessionUser ? 'Déconnexion' : 'Inscription';
    }
}

function openModal(modal) {
    if (modal) modal.style.display = 'flex';
}

function closeModal(modal) {
    if (modal) modal.style.display = 'none';
}

function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    updateAuthButtons();
    closeModal(registerModal);
    closeModal(loginModal);
}

function setUserSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    updateAuthButtons();
}

function findUserByEmail(email) {
    return getUsers().find(user => user.email.toLowerCase() === email.toLowerCase());
}

async function handleSocialAuth(providerName, mode) {
    const email = `${providerName.toLowerCase()}@gmail.com`;
    const baseUser = { email, provider: providerName, name: providerName };

    if (isFirebaseConfigured && firebaseAuth) {
        try {
            let provider;
            if (providerName === 'Google') {
                provider = new firebase.auth.GoogleAuthProvider();
            } else if (providerName === 'Facebook') {
                provider = new firebase.auth.FacebookAuthProvider();
            }

            if (!provider) {
                throw new Error('Provider inconnu');
            }

            const result = await firebaseAuth.signInWithPopup(provider);
            const user = result.user;
            const userData = {
                name: user.displayName || providerName,
                email: user.email || email,
                provider: providerName,
                password: ''
            };
            setUserSession(userData);
            if (mode === 'login') closeModal(loginModal);
            if (mode === 'register') closeModal(registerModal);
            return;
        } catch (error) {
            console.warn('Firebase social login failed:', error);
        }
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
        setUserSession(existingUser);
    } else {
        const users = getUsers();
        users.push({
            name: providerName,
            email,
            password: '',
            provider: providerName,
            birthdate: null
        });
        saveUsers(users);
        setUserSession(baseUser);
    }

    if (mode === 'login') closeModal(loginModal);
    if (mode === 'register') closeModal(registerModal);
}

function showFormError(formId, message) {
    const errorDiv = document.getElementById(formId);
    if (errorDiv) {
        errorDiv.textContent = message;
    }
}

if (btnLoginPopup && loginModal) {
    btnLoginPopup.addEventListener('click', () => {
        const sessionUser = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
        if (sessionUser) {
            alert(`Connecté comme : ${sessionUser.email}`);
            return;
        }
        openModal(loginModal);
    });
}

if (closeLogin && loginModal) {
    closeLogin.addEventListener('click', () => closeModal(loginModal));
}

if (btnRegisterPopup && registerModal) {
    btnRegisterPopup.addEventListener('click', () => {
        const sessionUser = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
        if (sessionUser) {
            logoutUser();
            return;
        }
        openModal(registerModal);
    });
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

const socialButtons = document.querySelectorAll('.social-btn');
socialButtons.forEach(button => {
    button.addEventListener('click', () => {
        const provider = button.dataset.provider || (button.textContent.includes('Google') ? 'Google' : 'Facebook');
        const mode = button.dataset.mode || 'login';
        handleSocialAuth(provider, mode);
    });
});

if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const birthdate = document.getElementById('birthdate').value;
        const idFront = document.getElementById('id-front').files[0];
        const idBack = document.getElementById('id-back').files[0];
        const errorDiv = document.getElementById('register-error');

        if (!fullname || !email || !password || !birthdate || !idFront || !idBack) {
            showFormError('register-error', 'Tous les champs sont obligatoires.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFormError('register-error', 'Email invalide.');
            return;
        }

        if (!/^.*(?=.{8,})(?=.*\d)(?=.*[a-zA-Z]).*$/.test(password)) {
            showFormError('register-error', 'Mot de passe trop faible (8 caractères, 1 lettre, 1 chiffre).');
            return;
        }

        const age = getAge(birthdate);
        if (age < 18) {
            showFormError('register-error', 'Vous devez avoir au moins 18 ans pour vous inscrire.');
            return;
        }

        if (isFirebaseConfigured && firebaseAuth) {
            try {
                const result = await firebaseAuth.createUserWithEmailAndPassword(email, password);
                await result.user.updateProfile({ displayName: fullname });
                setUserSession({
                    name: fullname,
                    email,
                    provider: 'Email'
                });
                showFormError('register-error', 'Inscription réussie !');
                closeModal(registerModal);
                return;
            } catch (error) {
                console.warn('Firebase email signup failed:', error);
            }
        }

        const users = getUsers();
        if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            showFormError('register-error', 'Un compte avec cet email existe déjà.');
            return;
        }

        const newUser = {
            name: fullname,
            email,
            password,
            provider: 'Email',
            birthdate
        };

        users.push(newUser);
        saveUsers(users);
        setUserSession(newUser);
        showFormError('register-error', 'Inscription réussie !');
        closeModal(registerModal);
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
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
            showFormError('login-error', 'Veuillez remplir tous les champs.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFormError('login-error', 'Email invalide.');
            return;
        }

        if (isFirebaseConfigured && firebaseAuth) {
            try {
                const result = await firebaseAuth.signInWithEmailAndPassword(email, password);
                const user = result.user;
                setUserSession({
                    name: user.displayName || 'Utilisateur',
                    email: user.email,
                    provider: 'Email'
                });
                showFormError('login-error', 'Connexion réussie !');
                closeModal(loginModal);
                return;
            } catch (error) {
                console.warn('Firebase email login failed:', error);
            }
        }

        const users = getUsers();
        const user = users.find(item => item.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            showFormError('login-error', 'Aucun compte trouvé pour cet email.');
            return;
        }

        if (user.password && user.password !== password) {
            showFormError('login-error', 'Mot de passe incorrect.');
            return;
        }

        setUserSession(user);
        showFormError('login-error', 'Connexion réussie !');
        closeModal(loginModal);
    });
}

updateAuthButtons();

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