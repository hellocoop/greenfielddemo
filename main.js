import { createAuthRequest, fetchToken, parseToken, validateToken } from '@hellocoop/helper-browser'

const INVITE_ENDPOINT = "https://wallet.hello.coop/invite";
const CONFIG = {
  client_id: "app_GreenfieldFitnessDemoApp_s9z",
  redirect_uri: "http://localhost:5173",
  scope: ['openid', 'profile', 'nickname'],
  domain_hint: "personal",
  wallet: "https://wallet.hello-dev.net"
}

// mappings
const loginBtn = document.querySelector('#login-btn')
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


let profile;

async function onLoad () {
  const search = window.location.search
  const hash = window.location.hash.substring(1)
  const params = new URLSearchParams(search || hash);
  
  if (params.has("iss")) {
      return login({
          loginHint: params.get('login_hint'),
          domainHint: params.get('domain_hint')
      });
  } else if (params.has("code")) {
    const token = await fetchToken({
      client_id: CONFIG.client_id,
      redirect_uri: CONFIG.redirect_uri,
      code_verifier: sessionStorage.getItem('code_verifier'),
      nonce: sessionStorage.getItem('nonce'),
      code: params.get('code'),
      wallet: "https://wallet.hello-dev.net"
    })
    const { payload: profile } = parseToken(token)
    sessionStorage.setItem("profile", JSON.stringify(profile));
    sendEvent({ u: "/profile" });
    hydrate(profile);
    profilePage.style.display = profilePageContent.style.display = "block";
  } else if (params.has("error")) {
      user_data = {
          error: params.get("error"),
          error_description: params.get("error_description"),
          error_uri: params.get("error_uri"),
      };

      modalContainer.style.display = "flex";

      if (user_data.error) {
          errorContainer.style.display = "block";
          switch (user_data.error) {
              case "access_denied":
                  error.innerText = "User cancelled request.";
                  break;
              default:
                  error.innerText = "Something went wrong.";
          }
      }

      if (user_data.error_description) {
          errorDescriptionContainer.style.display = "block";
          switch (user_data.error_description) {
              default:
                  error.innerText = "Something went wrong.";
          }
      }

      if (sessionStorage.getItem("data")) {
          getInfoFromSessionStorage()
      } else {
          showLoginPage();
      }
  } else if (sessionStorage.getItem("data")) {
      getInfoFromSessionStorage()
  } else {
      showLoginPage();
  }

  clearFragment();
  removeLoader();
};

async function login(event, update) {
  if (event) {
      event.target.classList.add('hello-btn-loader')
      event.target.disabled = true
  }

  const { url, nonce, code_verifier } = await createAuthRequest(CONFIG)
  
  // save this for later to fetch the token
  sessionStorage.setItem('nonce', nonce)
  sessionStorage.setItem('code_verifier', code_verifier)

  if (update) {
      url.searchParams.append("prompt", "consent");
      await sendEvent({ u: "/update", n: "action" });
  } else {
      await sendEvent({ u: "/start/login", n: "action" });
  }

  window.location.href = url;
}

function getInfoFromSessionStorage() {
    try {
        data = JSON.parse(sessionStorage.getItem("data"));
        hydrate();
        profilePage.style.display = profilePageContent.style.display = "block";
    } catch (err) {
        console.log(err);
        sessionStorage.removeItem("data");
        showLoginPage();
    }
}

async function getInfo(id_token) {
    const nonce = sessionStorage.getItem("nonce");
    await fetch(INTROSPECTION_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id_token=${id_token}&nonce=${nonce}&client_id=${CLIENT_ID}`,
    })
        .then((r) => r.json())
        .then((json) => {
            if (!json.active) throw json
            data = json
            sessionStorage.setItem("data", JSON.stringify(data));
            sendEvent({ u: "/profile" });
            hydrate();
            profilePage.style.display = profilePageContent.style.display = "block";
        })
        .catch((err) => {
            console.error(err);
            showLoginPage();
        })
}

function clearFragment() {
    if (!window.location.hash) return;
    window.location.replace("#");
    // slice off the remaining '#' in HTML5:
    if (typeof window.history.replaceState == "function") {
        history.replaceState({}, "", window.location.href.slice(0, -1));
    }
}

function closeModal() {
    modalContainer.style.display = "none";
}

function hydrate(profile) {
    const { name, nickname, picture, email } = profile;
    fullNameField.innerText = name;
    preferredNameField.innerText = nickname;
    emailField.innerText = email;
    pictureField.src = picture;
    pictureField.style.backgroundImage = `url('${picture}')`;
}

function removeLoader() {
    loadSpinner.style.display = "none"
}

function logout() {
    sendEvent({ u: "/logout", n: "action" });
    sessionStorage.removeItem("data");
    profilePage.style.display = "none";
    showLoginPage();
}

function showLoginPage() {
    let u = '/'
    if (window.location.search) {
        u += window.location.search
    }
    sendEvent({ u })
    //THIS IS A HACK ALTTERNATIVE FOR DISPLAY: NONE. 
    //DISPLAY: NONE CAUSES A BUG WHERE HELLO-BUTTON JS IS UNABLE TO ADD EVENT LISTENERS TO THE TOOLTIP
    loginPage.style.visibility = "visible";
    loginPage.style.position = "relative";
    profilePageContent.style.display = "none";
    document.body.style.backgroundImage = "url(/bg.jpg)";
}

async function sendEvent(body) {
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