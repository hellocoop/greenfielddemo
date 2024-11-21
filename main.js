import { createAuthRequest, fetchToken, parseToken } from '@hellocoop/helper-browser';

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
loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);
updateBtn.addEventListener('click', update);
inviteBtn.addEventListener('click', invite);
closeModalBtn.addEventListener('click', closeModal);

async function onLoad() {
    const { search } = window.location;
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(search || hash);

    const idpFlow = params.has('iss');
    const code = params.has('code');
    const error = params.has('error');
    const profile = JSON.parse(sessionStorage.getItem('profile'));

    if (idpFlow) return login(null, params);
    if (code) processCode(params);
    else if (error) processError(params, profile);
    else if (profile) showProfile(profile);
    else showLoginPage();

    clearFragment();
    removeLoader();
}

async function login(_, params) {
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

    await sendPlausibleEvent({ u: '/start/login', n: 'action' });

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

    await sendPlausibleEvent({ u: '/update', n: 'action' });

    window.location.href = url;
}

function logout() {
    sendPlausibleEvent({ u: '/logout', n: 'action' });
    sessionStorage.clear();
    showLoginPage();
}

async function processCode(params) {
    try {
        const token = await fetchToken({
            client_id: CONFIG.client_id,
            redirect_uri: CONFIG.redirect_uri,
            code_verifier: sessionStorage.getItem('code_verifier'),
            nonce: sessionStorage.getItem('nonce'),
            code: params.get('code'),
        });
        const { payload: profile } = parseToken(token);
    
        // clean code_verifier, nonce
        sessionStorage.clear();
    
        sessionStorage.setItem('profile', JSON.stringify(profile));
        sendPlausibleEvent({ u: '/profile' });
        showProfile(profile);
    } catch (err) {
        console.error(err)
        sessionStorage.clear();
        showLoginPage();
        processError(params);
    } finally {
        clearFragment();
    }
}

function processError(params, profile) {
    const error = params.get('error');

    modalContainer.style.display = 'flex';

    errorContainer.style.display = 'block';
    if (error === 'access_denied') errorField.innerText = 'User cancelled request.';
    else errorField.innerText = 'Something went wrong.';

    if (profile) showProfile(profile);
    else showLoginPage();
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
    let u = '/';
    if (window.location.search) {
        u += window.location.search;
    }
    sendPlausibleEvent({ u });
    loginPage.style.visibility = 'visible';
    loginPage.style.position = 'relative';
    profilePage.style.display = 'none';
    profilePageContent.style.display = 'none';
    document.body.style.backgroundImage = 'url(/assets/bg.jpg)';
}

async function sendPlausibleEvent(body) {
    if (
        localStorage.getItem('plausible_ignore') == 'true'
        || window.location.origin !== 'https://www.greenfielddemo.com'
    ) {
        console.info('Ignoring Event: localStorage flag');
        return;
    }
    const _body = {
        w: window.innerWidth,
        d: 'greenfielddemo.com',
        ...body,
        n: body.n || 'pageview',
        r: body.r || document.referrer || null,
        u: new URL(body.u, 'https://www.greenfielddemo.com'),
    };
    try {
        await fetch('/api/event', {
            method: 'POST',
            body: JSON.stringify(_body),
        });
        console.info(`Event sent: ${_body.u} (${_body.n})`);
    } catch (err) {
        console.error(err);
    }
}

function showProfile(profile) {
    const {
        name, nickname, picture, email,
    } = profile;
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

    const { sub } = JSON.parse(sessionStorage.getItem('profile'));

    // TBD Uncomment and use this to create invite request URL when npm package is updated
    // const { url } = createInviteRequest({
    //   inviter: sub,
    //   client_id: CONFIG.client_id,
    //   initiate_login_uri: window.location.origin,
    //   return_uri: window.location.origin
    // })
    // window.location.href = url.href;

    const url = new URL('https://wallet.hello.coop/invite');

    url.searchParams.append('inviter', sub);
    url.searchParams.append('client_id', CONFIG.client_id);
    url.searchParams.append('initiate_login_uri', window.location.origin);
    url.searchParams.append('return_uri', window.location.origin);

    window.location.href = url.href;
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
