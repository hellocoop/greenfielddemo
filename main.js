import { createAuthRequest, fetchToken, parseToken, validateToken } from '@hellocoop/helper-browser'

const INVITE_ENDPOINT = "https://wallet.hello.coop/invite";
const CONFIG = {
  client_id: "app_GreenfieldFitnessDemoApp_s9z",
  redirect_uri: "http://localhost:5173",
  scope: ['openid', 'profile', 'nickname'],
  response_mode: "fragment",
  domain_hint: "personal",
  wallet: "https://wallet.hello-dev.net"
}

// mappings
const loginBtn = document.querySelector('#login-btn')
const logoutBtn = document.querySelector('#logout-btn')
const updateBtn = document.querySelector('#update-btn')
const profilePage = document.querySelector('#profile-page')
const loginPage = document.querySelector('#login-page')
const profilePageContent = document.querySelector('#profile-page-content')
const modalContainer = document.querySelector('#modal-container')
const errorContainer = document.querySelector('#error-container')
const error = document.querySelector('#error')
const errorDescriptionContainer = document.querySelector('#error-description-container')
const fullNameField = document.querySelector('#full-name')
const preferredNameField = document.querySelector('#preferred-name')
const emailField = document.querySelector('#email')
const pictureField = document.querySelector('#picture')
const loadSpinner = document.querySelector('#load-spinner')

// bindings
window.addEventListener('load', onLoad)
loginBtn.addEventListener('click', login)
logoutBtn.addEventListener('click', logout)
updateBtn.addEventListener('click', update)

async function onLoad () {
  const search = window.location.search
  const hash = window.location.hash.substring(1)
  const params = new URLSearchParams(search || hash);
  
  const idpFlow = params.has('iss')
  const code = params.has('code')
  const error = params.has('error')
  const profileFetched = sessionStorage.getItem('profile')

  if (idpFlow) console.log(123)
  else if (code) processCode(params)
  else if (error) processError(params)
  else if (profileFetched) {
    const profile = JSON.parse(sessionStorage.getItem('profile'))
    hydrate(profile)
  }
  else showLoginPage()

  clearFragment();
  removeLoader();
};

async function login() {
  loginBtn.classList.add('hello-btn-loader')
  loginBtn.disabled = true
    
  const { url, nonce, code_verifier } = await createAuthRequest(CONFIG)
  
  // needed later when fetching the token
  sessionStorage.setItem('nonce', nonce)
  sessionStorage.setItem('code_verifier', code_verifier)

  await sendPlausibleEvent({ u: "/start/login", n: "action" });

  window.location.href = url;
}

async function update() {
  updateBtn.classList.add('hello-btn-loader')
  updateBtn.disabled = true
    
  const { url, nonce, code_verifier } = await createAuthRequest({
    ...CONFIG,
    prompt: 'consent'
  })
  
  // needed later when fetching the token
  sessionStorage.setItem('nonce', nonce)
  sessionStorage.setItem('code_verifier', code_verifier)

  await sendPlausibleEvent({ u: "/update", n: "action" });
  
  window.location.href = url;
}

async function processCode(params) {
  const token = await fetchToken({
    client_id: CONFIG.client_id,
    redirect_uri: CONFIG.redirect_uri,
    code_verifier: sessionStorage.getItem('code_verifier'),
    nonce: sessionStorage.getItem('nonce'),
    code: params.get('code'),
    wallet: "https://wallet.hello-dev.net"
  })
  const { payload: profile } = parseToken(token)
  sessionStorage.clear();
  sessionStorage.setItem("profile", JSON.stringify(profile));
  sendPlausibleEvent({ u: "/profile" });
  hydrate(profile); 
  clearFragment();
}

function clearFragment() {
    if (!window.location.hash) return;
    window.location.replace("#");
    // slice off the remaining '#' in HTML5:
    if (typeof window.history.replaceState == "function") {
        history.replaceState({}, "", window.location.href.slice(0, -1));
    }
}

function removeLoader() {
    loadSpinner.style.display = "none"
}

function logout() {
    sendPlausibleEvent({ u: "/logout", n: "action" });
    sessionStorage.clear();
    showLoginPage();
}


function showLoginPage() {
    let u = '/'
    if (window.location.search) {
        u += window.location.search
    }
    sendPlausibleEvent({ u })
    loginPage.style.visibility = "visible";
    loginPage.style.position = "relative";
    profilePage.style.display = "none";
    profilePageContent.style.display = "none";
    document.body.style.backgroundImage = "url(/bg.jpg)";
}

async function sendPlausibleEvent(body) {
    if (
        localStorage.getItem("plausible_ignore") == "true" ||
        window.location.origin !== "https://www.greenfielddemo.com"
    ) {
        console.info("Ignoring Event: localStorage flag");
        return;
    }
    const _body = {
        w: window.innerWidth,
        d: "greenfielddemo.com",
        ...body,
        n: body.n || "pageview",
        r: body.r || document.referrer || null,
        u: new URL(body.u, "https://www.greenfielddemo.com"),
    };
    try {
        await fetch("/api/event", {
            method: "POST",
            body: JSON.stringify(_body),
        });
        console.info(`Event sent: ${_body.u} (${_body.n})`);
    } catch (err) {
        console.error(err);
    }
}

function hydrate(profile) {
  const { name, nickname, picture, email, phone } = profile;

  fullNameField.innerText = name;
  preferredNameField.innerText = nickname;
  emailField.innerText = email;
  pictureField.src = picture;
  pictureField.style.backgroundImage = `url('${picture}')`;
  profilePage.style.display = profilePageContent.style.display = "block";
}

async function invite({event = null} = {}) {
    if (event) {
        event.target.classList.add('hello-btn-loader')
        event.target.disabled = true
    }

    const url = new URL(INVITE_ENDPOINT);
    let sub;
    try {
        sub = JSON.parse(sessionStorage.data).sub
    } catch(err) {
        console.error('Error fetching sub from sessionStorage')
        return logout();
    }

    url.searchParams.append("inviter", sub);
    url.searchParams.append("client_id", CLIENT_ID);
    url.searchParams.append("initiate_login_uri", window.location.origin);
    url.searchParams.append("return_uri", window.location.origin);
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
})();