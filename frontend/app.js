// --- CONFIGURATION ---
const API_BASE_URL = 'http://127.0.0.1:8000/api/';
const PROJECTS_URL = `${API_BASE_URL}projects/`;
const LOGIN_URL = `${API_BASE_URL}token/`;
const REFRESH_URL = `${API_BASE_URL}token/refresh/`;
const REGISTER_URL = `${API_BASE_URL}register/`;

// --- DOM ELEMENTS ---
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const projectsGrid = document.getElementById('projects-grid');
const searchInput = document.getElementById('search-input');
const btnRefresh = document.getElementById('btn-refresh');
const btnOpenAddModal = document.getElementById('btn-open-add-modal');
const projectModal = document.getElementById('project-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const projectForm = document.getElementById('project-form');
const toastContainer = document.getElementById('toast-container');

// Forms & Auth DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const linkShowRegister = document.getElementById('link-show-register');
const linkShowLogin = document.getElementById('link-show-login');
const authSubtitle = document.getElementById('auth-subtitle');
const sidebarUsername = document.getElementById('sidebar-username');
const btnLogout = document.getElementById('btn-logout');

// Form inputs (Auth)
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const registerUsernameInput = document.getElementById('register-username');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const registerConfirmPasswordInput = document.getElementById('register-confirm-password');

// Stats elements
const statTotalProjects = document.getElementById('stat-total-projects');
const statTotalTechs = document.getElementById('stat-total-techs');
const statDbStatus = document.getElementById('stat-db-status');

// Form inputs (Projects)
const formProjectId = document.getElementById('project-id');
const formTitle = document.getElementById('form-title');
const formTechnology = document.getElementById('form-technology');
const formDescription = document.getElementById('form-description');
const modalTitle = document.getElementById('modal-title');

// App state
let projects = [];

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-circle-check';
    if (type === 'danger') iconClass = 'fa-circle-xmark';
    if (type === 'warning') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${iconClass} toast-icon"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

// --- AUTHENTICATION STATE HANDLING ---

function getAccessToken() {
    return localStorage.getItem('access_token');
}

function getRefreshToken() {
    return localStorage.getItem('refresh_token');
}

function saveTokens(access, refresh) {
    if (access) localStorage.setItem('access_token', access);
    if (refresh) localStorage.setItem('refresh_token', refresh);
}

function clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
}

function checkAuthState() {
    const access = getAccessToken();
    const username = localStorage.getItem('username');
    
    if (access && username) {
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        sidebarUsername.textContent = username;
        fetchProjects();
    } else {
        authContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');
    }
}

// Custom Fetch Wrapper with Automatic JWT Token Refresh
async function authFetch(url, options = {}) {
    let accessToken = getAccessToken();
    if (!accessToken) {
        logout();
        throw new Error('No access token available');
    }

    // Set Authorization Header
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
    };

    let response = await fetch(url, options);

    // If Access Token is expired, try to refresh
    if (response.status === 401) {
        const refresh = getRefreshToken();
        if (refresh) {
            try {
                const refreshResponse = await fetch(REFRESH_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh })
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    saveTokens(data.access);
                    
                    // Retry original request with new token
                    options.headers['Authorization'] = `Bearer ${data.access}`;
                    response = await fetch(url, options);
                } else {
                    // Refresh token also expired
                    logout();
                    throw new Error('Sesión expirada');
                }
            } catch (err) {
                logout();
                throw err;
            }
        } else {
            logout();
            throw new Error('No refresh token available');
        }
    }

    return response;
}

// Log out user
function logout() {
    clearTokens();
    showLoginView();
    checkAuthState();
    showToast('Sesión cerrada.', 'warning');
}

// --- LOGIN & REGISTER ACTIONS ---

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value;

    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Credenciales incorrectas');
        }

        const data = await response.json();
        saveTokens(data.access, data.refresh);
        localStorage.setItem('username', username);
        
        showToast(`¡Bienvenido, ${username}!`);
        loginForm.reset();
        checkAuthState();
    } catch (error) {
        console.error(error);
        showToast('Error: Usuario o contraseña incorrectos.', 'danger');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = registerUsernameInput.value.trim();
    const email = registerEmailInput.value.trim();
    const password = registerPasswordInput.value;
    const confirmPassword = registerConfirmPasswordInput.value;

    if (password !== confirmPassword) {
        showToast('Las contraseñas no coinciden.', 'danger');
        return;
    }

    try {
        const response = await fetch(REGISTER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            const data = await response.json();
            const message = data.username ? `Usuario: ${data.username[0]}` : 'Error al registrar usuario';
            throw new Error(message);
        }

        showToast('Registro exitoso. Iniciando sesión...');
        
        // Auto Login after successful registration
        const loginResponse = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            saveTokens(loginData.access, loginData.refresh);
            localStorage.setItem('username', username);
            registerForm.reset();
            checkAuthState();
        } else {
            showLoginView();
        }
    } catch (error) {
        console.error(error);
        showToast(error.message || 'Error en el registro.', 'danger');
    }
});

// View Toggle
linkShowRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterView();
});

linkShowLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginView();
});

function showRegisterView() {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    authSubtitle.textContent = 'Crea tu nueva cuenta';
}

function showLoginView() {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    authSubtitle.textContent = 'Ingresa a tu panel de control';
}

btnLogout.addEventListener('click', logout);


// --- PROJECTS API CRUD OPERATIONS ---

// Fetch projects
async function fetchProjects() {
    renderSkeleton();
    try {
        const response = await authFetch(PROJECTS_URL);
        if (!response.ok) throw new Error('Error al obtener proyectos');
        
        projects = await response.json();
        renderProjects(projects);
        updateStats(projects);
        
        statDbStatus.textContent = 'Online';
        statDbStatus.className = 'stat-value text-success';
    } catch (error) {
        console.error(error);
        if (getAccessToken()) {
            showToast('No se pudo conectar con el servidor Django.', 'danger');
            renderEmptyState('Error de conexión', 'Asegúrate de que la API de Django está corriendo.');
            statDbStatus.textContent = 'Offline';
            statDbStatus.className = 'stat-value text-danger';
        }
    }
}

// Create project
async function createProject(projectData) {
    try {
        const response = await authFetch(PROJECTS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        
        if (!response.ok) throw new Error('Error al crear el proyecto');
        
        showToast('Proyecto creado con éxito.');
        closeModal();
        fetchProjects();
    } catch (error) {
        console.error(error);
        showToast('Error al crear el proyecto.', 'danger');
    }
}

// Update project
async function updateProject(id, projectData) {
    try {
        const response = await authFetch(`${PROJECTS_URL}${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        
        if (!response.ok) throw new Error('Error al actualizar el proyecto');
        
        showToast('Proyecto actualizado con éxito.');
        closeModal();
        fetchProjects();
    } catch (error) {
        console.error(error);
        showToast('Error al actualizar el proyecto.', 'danger');
    }
}

// Delete project
async function deleteProject(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return;
    
    try {
        const response = await authFetch(`${PROJECTS_URL}${id}/`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar el proyecto');
        
        showToast('Proyecto eliminado correctamente.', 'warning');
        fetchProjects();
    } catch (error) {
        console.error(error);
        showToast('Error al eliminar el proyecto.', 'danger');
    }
}

// --- UI RENDERING ---

function renderSkeleton() {
    projectsGrid.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-card glass';
        skeleton.innerHTML = `
            <div>
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-badge"></div>
                <div class="skeleton-line skeleton-desc"></div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%; border-top:1px solid rgba(255,255,255,0.03); padding-top:10px;">
                <div class="skeleton-line" style="width:30%; height:12px;"></div>
                <div class="skeleton-line" style="width:20%; height:20px;"></div>
            </div>
        `;
        projectsGrid.appendChild(skeleton);
    }
}

function renderProjects(projectsList) {
    projectsGrid.innerHTML = '';
    
    if (projectsList.length === 0) {
        renderEmptyState('Sin proyectos', 'Comienza agregando un nuevo proyecto usando el botón de arriba.');
        return;
    }
    
    projectsList.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card glass';
        
        const formattedDate = project.created_at 
            ? new Date(project.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'Hoy';
            
        card.innerHTML = `
            <div class="project-header">
                <h4 class="project-title">${escapeHTML(project.title)}</h4>
                <span class="tech-badge">${escapeHTML(project.technology)}</span>
            </div>
            <p class="project-description">${escapeHTML(project.description)}</p>
            <div class="project-footer">
                <span class="project-date">${formattedDate}</span>
                <div class="card-actions">
                    <button class="btn-action edit" onclick="openEditModal(${project.id})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-action delete" onclick="deleteProject(${project.id})" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `;
        projectsGrid.appendChild(card);
    });
}

function renderEmptyState(title, subtitle) {
    projectsGrid.innerHTML = `
        <div class="empty-state glass">
            <i class="fa-regular fa-folder-open empty-icon"></i>
            <h3>${title}</h3>
            <p>${subtitle}</p>
        </div>
    `;
}

function updateStats(projectsList) {
    statTotalProjects.textContent = projectsList.length;
    
    const uniqueTechs = new Set(
        projectsList
            .map(p => p.technology ? p.technology.trim().toLowerCase() : '')
            .filter(t => t !== '')
    );
    statTotalTechs.textContent = uniqueTechs.size;
}

function filterProjects() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        renderProjects(projects);
        return;
    }
    
    const filtered = projects.filter(project => {
        const titleMatch = project.title && project.title.toLowerCase().includes(query);
        const techMatch = project.technology && project.technology.toLowerCase().includes(query);
        return titleMatch || techMatch;
    });
    
    renderProjects(filtered);
}

// --- MODAL CONTROLS ---

function openAddModal() {
    modalTitle.textContent = 'Nuevo Proyecto';
    formProjectId.value = '';
    projectForm.reset();
    projectModal.classList.add('open');
}

window.openEditModal = function(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    modalTitle.textContent = 'Editar Proyecto';
    formProjectId.value = project.id;
    formTitle.value = project.title;
    formTechnology.value = project.technology;
    formDescription.value = project.description;
    
    projectModal.classList.add('open');
}

function closeModal() {
    projectModal.classList.remove('open');
    projectForm.reset();
}

projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = formProjectId.value;
    const projectData = {
        title: formTitle.value.trim(),
        technology: formTechnology.value.trim(),
        description: formDescription.value.trim()
    };
    
    if (id) {
        updateProject(id, projectData);
    } else {
        createProject(projectData);
    }
});

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// --- EVENT LISTENERS ---
btnOpenAddModal.addEventListener('click', openAddModal);
btnCloseModal.addEventListener('click', closeModal);
btnCancelModal.addEventListener('click', closeModal);
btnRefresh.addEventListener('click', fetchProjects);
searchInput.addEventListener('input', filterProjects);

projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeModal();
});

// Initial Auth State Verification
document.addEventListener('DOMContentLoaded', checkAuthState);
