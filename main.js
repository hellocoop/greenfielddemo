const $ = (id) => document.getElementById(id);

const AUTHORIZATION_ENDPOINT = "https://wallet.hello.coop/authorize";
const INTROSPECTION_ENDPOINT = "https://wallet.hello.coop/oauth/introspect";
const INVITE_ENDPOINT = "https://wallet.hello.coop/invite";
const CLIENT_ID = "app_GreenfieldFitnessDemoApp_s9z";

let data;

window.onload = async () => {
    const search = window.location.search
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(search || hash);
    
    if (params.has("iss")) {
        return login({
            loginHint: params.get('login_hint'),
            domainHint: params.get('domain_hint')
        });
    } else if (params.has("id_token")) {
        const id_token = params.get("id_token");
        getInfo(id_token);
    } else if (params.has("error")) {
        user_data = {
            error: params.get("error"),
            error_description: params.get("error_description"),
            error_uri: params.get("error_uri"),
        };

        $("modal-container").style.display = "flex";

        if (user_data.error) {
            $("error-container").style.display = "block";
            switch (user_data.error) {
                case "access_denied":
                    $("error").innerText = "User cancelled request.";
                    break;
                default:
                    $("error").innerText = "Something went wrong.";
            }
        }

        if (user_data.error_description) {
            $("error-description-container").style.display = "block";
            switch (user_data.error_description) {
                default:
                    $("error").innerText = "Something went wrong.";
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

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
}

function getInfoFromSessionStorage() {
    try {
        data = JSON.parse(sessionStorage.getItem("data"));
        hydrate();
        $("profile-page").style.display = $("profile-page-content").style.display = "block";
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
            $("profile-page").style.display = $("profile-page-content").style.display = "block";
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
    $("modal-container").style.display = "none";
}

function hydrate() {
    const { name, nickname, picture, email, phone } = data;

    $("full-name").innerText = name;
    $("preferred-name").innerText = nickname;
    $("email").innerText = email;
    $("picture").src = picture;
    $("picture").style.backgroundImage = `url('${picture}')`;
    // $("phone").innerText = phone;
}

function removeLoader() {
    $("load-spinner").style.display = "none"
}

async function login({ event = null, update = false, loginHint = '', domainHint = '' } = {}) {
    if (event) {
        event.target.classList.add('hello-btn-loader')
        event.target.disabled = true
    }

    const nonce = uuidv4();
    sessionStorage.setItem("nonce", nonce);

    const url = new URL(AUTHORIZATION_ENDPOINT);
    url.searchParams.append("client_id", CLIENT_ID);
    url.searchParams.append("redirect_uri", window.location.origin + window.location.pathname);
    url.searchParams.append("nonce", nonce);
    url.searchParams.append("response_mode", "fragment");
    url.searchParams.append("response_type", "id_token");
    url.searchParams.append("domain_hint", "personal");
    url.searchParams.append("scope", "openid name nickname picture email");
    if(loginHint) {
        url.searchParams.append("login_hint", loginHint);
    }
    if(domainHint) { //set only in idp login flow
            //searchParams.set because we are replacing existing domain_hint value
        url.searchParams.set("domain_hint", domainHint);
    }
    if (update) {
        url.searchParams.append("prompt", "consent");
        await sendEvent({ u: "/update", n: "action" });
    } else {
        await sendEvent({ u: "/start/login", n: "action" });
    }
    window.location.href = url;
}

function logout() {
    sendEvent({ u: "/logout", n: "action" });
    sessionStorage.removeItem("data");
    $("profile-page").style.display = "none";
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
    $("login-page").style.visibility = "visible";
    $("login-page").style.position = "relative";
    $("profile-page-content").style.display = "none";
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