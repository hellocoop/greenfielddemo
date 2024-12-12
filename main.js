import { createAuthRequest, fetchToken, parseToken, createInviteRequest } from '@hellocoop/helper-browser';

const CONFIG = {
    client_id: 'app_GreenfieldFitnessDemoApp_s9z',
    redirect_uri: 'https://www.greenfielddemo.com/',
    scope: ['openid', 'profile', 'nickname'],
    response_mode: 'fragment',
    domain_hint: 'personal',
};

// refs
const loginBtn = document.querySelector('#login-btn');
const logoutBtn = document.querySelector('#logout-btn');
const updateBtn = document.querySelector('#update-btn');
const inviteBtn = document.querySelector('#invite-btn');
const profilePage = document.querySelector('#profile-page');
const loginPage = document.querySelector('#login-page');
const profilePageContent = document.querySelector('#profile-page-content');
const modalContainer = document.querySelector('#modal-container');
const errorContainer = document.querySelector('#error-container');
const errorField = document.querySelector('#error');
const fullNameField = document.querySelector('#full-name');
const preferredNameField = document.querySelector('#preferred-name');
const emailField = document.querySelector('#email');
const pictureField = document.querySelector('#picture');
const loadSpinner = document.querySelector('#load-spinner');
const closeModalBtn = document.querySelector('#close-modal-btn');

// bindings
window.addEventListener('load', onLoad);
loginBtn.addEventListener('click', loginEvent);
logoutBtn.addEventListener('click', logout);
updateBtn.addEventListener('click', update);
inviteBtn.addEventListener('click', invite);
closeModalBtn.addEventListener('click', closeModal);

async function onLoad() {
    const { search } = window.location;
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(search || hash);

    if (params.has('iss')) // 3P initiated login
        return login(params);

    if (params.has('code')) // successful login from Hellō
        processCode(params);
    else {
        const profile = JSON.parse(sessionStorage.getItem('profile'));
        if (params.has('error')) // we got back an error from Hellō
            processError(params, profile);
        else if (profile) // we are logged in
            showProfile(profile);
        else 
            showLoginPage();
    }

    clearFragment();
    removeLoader();
}

function loginEvent(event, params) {
    // we don't use the event
    return login(params);
}

async function login(params) {
    loginBtn.classList.add('hello-btn-loader');
    loginBtn.disabled = true;

    const { url, nonce, code_verifier } = await createAuthRequest({
        ...CONFIG,

        // set only in idp flow
        login_hint: params?.get('login_hint') || undefined,
        domain_hint: params?.get('domain_hint') || CONFIG.domain_hint,
    });

    // needed later for fetching the token
    sessionStorage.setItem('nonce', nonce);
    sessionStorage.setItem('code_verifier', code_verifier);

    await sendPlausibleEvent({ path: '/start/login', n: 'action' });

    window.location.href = url;
}

async function update() {
    updateBtn.classList.add('hello-btn-loader');
    updateBtn.disabled = true;

    const { url, nonce, code_verifier } = await createAuthRequest({
        ...CONFIG,
        prompt: 'consent',
    });

    // needed later for fetching the token
    sessionStorage.setItem('nonce', nonce);
    sessionStorage.setItem('code_verifier', code_verifier);

    await sendPlausibleEvent({ path: '/update', n: 'action' });

    window.location.href = url;
}

function logout() {
    sendPlausibleEvent({ path: '/logout', n: 'action' });
    sessionStorage.clear();
    showLoginPage();
}

async function processCode(params) {
    try {
        const code_verifier = sessionStorage.getItem('code_verifier');
        const nonce = sessionStorage.getItem('nonce');
        const code = params.get('code');
        if (!code_verifier)
            throw new Error('Missing code_verifier');
        if (!nonce)
            throw new Error('Missing nonce');
        if (!code)
            throw new Error('Missing code');

        const token = await fetchToken({
            client_id: CONFIG.client_id,
            redirect_uri: CONFIG.redirect_uri,
            code_verifier,
            nonce,
            code,
        });
        if (!token)
            throw new Error('Did not get response from token endpoint');
        const { payload: profile } = parseToken(token);
        if (!profile)
            throw new Error('Did not get profile from token');
       
        sessionStorage.clear();  // clean code_verifier, nonce
    
        sessionStorage.setItem('profile', JSON.stringify(profile));
        sendPlausibleEvent({ path: '/profile' });
        showProfile(profile);
    } catch (err) {
        console.error(err)
        sessionStorage.clear();
        showLoginPage();
        processError(params);
    }
}

function processError(params, profile) {
    const error = params && params.get('error');

    modalContainer.style.display = 'flex';
    errorContainer.style.display = 'block';

    if (error === 'access_denied') 
        errorField.innerText = 'User cancelled request.';
    else 
        errorField.innerText = 'Something went wrong.';

    if (profile) 
        showProfile(profile);
    else 
        showLoginPage();
}

function closeModal() {
    modalContainer.style.display = 'none';
}

function clearFragment() {
    if (!window.location.hash) return;
    window.location.replace('#');
    // slice off the remaining '#' in HTML5:
    if (typeof window.history.replaceState === 'function') {
        history.replaceState({}, '', window.location.href.slice(0, -1));
    }
}

function removeLoader() {
    loadSpinner.style.display = 'none';
}

function showLoginPage() {
    let path = '/';
    if (window.location.search) {
        path += window.location.search;
    }
    sendPlausibleEvent({ path });
    loginPage.style.visibility = 'visible';
    loginPage.style.position = 'relative';
    profilePage.style.display = 'none';
    profilePageContent.style.display = 'none';
    document.body.style.backgroundImage = 'url(/bg.jpg)';
}

const plausibleIgnore = localStorage.getItem('plausible_ignore') == 'true' 
    || window.location.origin !== 'https://www.greenfielddemo.com';

async function sendPlausibleEvent(pEvent) {
    if (plausibleIgnore)
        return console.info('Ignoring Event: localStorage flag');

    const { path, n = 'pageview' } = pEvent;

    const u = new URL(path, 'https://www.greenfielddemo.com') 
    const body = { u, n, 
        w: window.innerWidth,
        d: 'greenfielddemo.com',
        r: document.referrer || null,
    };
    try {
        await fetch('/api/event', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        console.info(`Event sent: ${body.u} (${body.n})`);
    } catch (err) {
        console.error(err);
    }
}

function showProfile(profile) {
    const { name, nickname, picture, email } = profile;

    fullNameField.innerText = name;
    preferredNameField.innerText = nickname;
    emailField.innerText = email;
    pictureField.src = picture;
    pictureField.style.backgroundImage = `url('${picture}')`;
    profilePage.style.display = profilePageContent.style.display = 'block';
}

async function invite() {
    inviteBtn.classList.add('hello-btn-loader');
    inviteBtn.disabled = true;

    try {
        const { sub } = JSON.parse(sessionStorage.getItem('profile'));
        if (!sub)
            throw new Error('Missing sub')

        const { url } = createInviteRequest({
            inviter: sub,
            client_id: CONFIG.client_id,
            initiate_login_uri: window.location.origin,
            return_uri: window.location.origin
        })
        window.location.href = url;
    } catch(err) {
        console.error(err)
        inviteBtn.classList.remove('hello-btn-loader');
        inviteBtn.disabled = false;
        sessionStorage.clear();
        processError();
    }
}

/*
 * If browser back button was used, flush cache
 * This ensures that user will always see an accurate, up-to-date view based on their state
 * https://stackoverflow.com/questions/8788802/prevent-safari-loading-from-cache-when-back-button-is-clicked
 */
(function () {
    window.onpageshow = function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    };
}());
