<script>
	import {onMount} from 'svelte'
	import {fly, slide} from 'svelte/transition'
	const config = {
		AUTHORIZATION_ENDPOINT: 'https://wallet.hello.coop/authorize',
		CLIENT_ID: '1693bedb-58ac-4ba1-a95b-a72effc71dfb'
	}

	const localState = Object.preventExtensions({
		sub: '',
		email: [],
		phone: '',
		ethereum: ''
	})

	let isLoggedIn = false
	let notification = '' // for showing errors

	const introspectionEndpoint = new URL(config.AUTHORIZATION_ENDPOINT)
	introspectionEndpoint.searchParams.set('client_id', config.CLIENT_ID)
	introspectionEndpoint.searchParams.set('redirect_uri', window.location.origin + window.location.pathname)
	introspectionEndpoint.searchParams.set('response_type', 'id_token')

	$: {
		if(localState.sub) isLoggedIn = true
		const {email, phone, ethereum} = localState
		if(email.length || phone.length || ethereum.length) isLoggedIn = true
	}

	let mounted = false
	let darkMode = false
	onMount(async()=>{
		if (
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		) {
			darkMode = true
		}
		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', (event) => {
				if (event.matches) {
					darkMode = true
				} else {
					darkMode = false
				}
		})
		if(sessionStorage.data){
			try{
				const parsedData = JSON.parse(sessionStorage.data)
				for(const key in parsedData){
					localState[key] = parsedData[key]
				}
			} catch(err){
				console.error(err)
				sessionStorage.removeItem('data')
			}
		}
		if(window.location.hash){
			const params = new URLSearchParams(window.location.hash.substring(1))
			if(params.has('id_token')){
				const url = new URL('/oauth/introspect', config.AUTHORIZATION_ENDPOINT)
				const body = {
					token: params.get('id_token'),
					client_id: config.CLIENT_ID,
					nonce: sessionStorage.nonce
				}
				sessionStorage.removeItem('nonce')
				try{
					const res = await fetch(url, {
						method: 'POST',
						mode: 'cors',
						cache: 'no-cache',
						headers: {
							'Content-type': 'application/x-www-form-urlencoded'
						},
						body: new URLSearchParams(body).toString()
					})
					const json = await res.json()
					// if(!json.active) //TODO: throw error here
					for(const key in localState){
						if(!json[key]) continue
						if(Array.isArray(localState[key])){
							localState[key].push(json[key])
							localState[key] = [...new Set(localState[key])] //dedupe
						} else{
							localState[key] = json[key]
						}
					}
					sessionStorage.setItem('data', JSON.stringify(localState))
					console.info('Introspection Response:', JSON.stringify(json, null, 2))
				} catch(err){
					console.error(err)
				}
			}
			if(params.has('error')){
				const errorMap = {
					access_denied: 'User cancelled request'
				}
				const errorMsg = params.get('error')
				if(errorMap[errorMsg]){
					notification = errorMap[errorMsg]
				}
			}
			history.replaceState(null, null, ' ')
		}
		mounted = true //for triggering the fly in animations
	})

	function makeNonce() {
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
	}

	let loginAjax = false
	function login(){
		loginAjax = true
		const nonce = makeNonce()
		sessionStorage.setItem('nonce', nonce) //needed later for introspection call
		introspectionEndpoint.searchParams.set('scope', 'openid')
		introspectionEndpoint.searchParams.set('nonce', nonce)
		window.location.href = introspectionEndpoint.href
	}

	function logout(){
		sessionStorage.clear()
		isLoggedIn = false
		for (const key in localState){
			if(Array.isArray(localState[key])){
				localState[key] = []
			} else{
				localState[key] = ''
			}
		}
	}

	let addEmailAjax = false
	function addEmail(){
		addEmailAjax = true
		const nonce = makeNonce()
		sessionStorage.setItem('nonce', nonce) //needed later for introspection call
		introspectionEndpoint.searchParams.set('scope', 'openid email profile_update')
		introspectionEndpoint.searchParams.set('nonce', nonce)
		window.location.href = introspectionEndpoint.href
	}

	let addPhoneAjax = false
	function addPhone(){
		addPhoneAjax = true
		const nonce = makeNonce()
		sessionStorage.setItem('nonce', nonce) //needed later for introspection call
		introspectionEndpoint.searchParams.set('scope', 'openid phone profile_update')
		introspectionEndpoint.searchParams.set('nonce', nonce)
		window.location.href = introspectionEndpoint.href
	}

	let addEthereumAddressAjax = false
	function addEthereumAddress(){
		addEthereumAddressAjax = true
		const nonce = makeNonce()
		sessionStorage.setItem('nonce', nonce) //needed later for introspection call
		introspectionEndpoint.searchParams.set('scope', 'openid ethereum profile_update')
		introspectionEndpoint.searchParams.set('nonce', nonce)
		window.location.href = introspectionEndpoint.href
	}
</script>

{#if notification}
	<div class="bg-red-500 h-12 px-4 text-white text-center flex items-center justify-between" transition:slide>
		<span class="w-8" />
		<span>{notification}</span>
		<span class="w-8 inline-flex items-center justify-center">
			<button on:click={()=>notification = ''}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
		  			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</span>
	</div>
{/if}

<header class="h-56 w-full flex justify-center px-4 bg-top bg-no-repeat bg-cover from-red-500 to-transparent" style="background-image: url(banner.jpeg);">
	<h1 class="mt-16 text-3xl font-semibold text-center z-50 text-gray-700 dark:text-white">Incremental Profile Demo</h1>
	<span class="absolute w-full left-0 h-56 bg-gradient-to-b from-transparent to-white dark:to-[#161616]"></span>
</header>
{#if mounted}
	<main class="z-50 relative pb-20">	
	<section class="px-4 -mt-16 max-w-2xl mx-auto space-y-4">
		{#if !isLoggedIn}
			<li class="relative rounded-2xl bg-white dark:bg-[#262626] shadow-lg p-8 flex items-center justify-center">
				<button id="hello-login-btn" on:click={login} class:hello-btn-loader={loginAjax} class="{darkMode ? "hello-btn-black-on-dark hello-btn-hover-flare" : "hello-btn-white-on-light"}">ō&nbsp;&nbsp;&nbsp;Continue with Hellō</button>
			</li>
		{/if}

		<li in:fly={{y: 40, delay: 0}} class:opacity-30={!isLoggedIn} class="rounded-2xl bg-white dark:bg-[#262626] shadow-lg p-8">
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clip-rule="evenodd" />
						<path fill-rule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.83z" clip-rule="evenodd" />
						<path fill-rule="evenodd" d="M10 10a1 1 0 011 1c0 2.236-.46 4.368-1.29 6.304a1 1 0 01-1.838-.789A13.952 13.952 0 009 11a1 1 0 011-1z" clip-rule="evenodd" />
					</svg>
					<label for="user-id" class="font-bold tracking-widest ml-2 uppercase">User ID</label>
				</div>
				{#if isLoggedIn}
					<button on:click={logout} id="log-out-btn" class="hover:underline font-medium">Log Out</button>
				{/if}
			</div>
			{#if isLoggedIn}
				<span id="user-id" class="block text-xl mt-3 break-all font-mono">
					{localState.sub}
				</span>
			{/if}
		</li>

		<li in:fly={{y: 40, delay: 100}} class:opacity-30={!isLoggedIn} class="opacity-30 rounded-2xl bg-white dark:bg-[#262626] shadow-lg p-8">
			<div class="flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
					<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
				</svg>
				<label for="email" class="font-bold tracking-widest ml-2 uppercase">Email</label>
			</div>
			{#if localState.email?.length}
				<ul id="email" class="text-xl mt-3 space-y-2">
					{#each localState.email as email}
						<li class="break-all">
							{email}
						</li>
					{/each}
				</ul>
			{/if}
			{#if isLoggedIn}
				<button
					on:click={addEmail}
					disabled={addEmailAjax}
					class:hello-btn-loader={addEmailAjax}
					class="{darkMode ? "hello-btn-white-and-static" : "hello-btn-white-on-light"} mt-3"
				>
					{@html localState.email.length ? 'ō&nbsp;&nbsp;&nbsp;Add another with Hellō' : 'ō&nbsp;&nbsp;&nbsp;Add with Hellō'}
				</button>
			{/if}
		</li>

		<li in:fly={{y: 40, delay: 200}} class:opacity-30={!isLoggedIn} class="opacity-30 rounded-2xl bg-white dark:bg-[#262626] shadow-lg p-8">
			<div class="flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
				</svg>
			<label for="phone" class="font-bold tracking-widest ml-2 uppercase">Phone</label>
			</div>
			{#if localState.phone}
				<ul id="phone" class="text-xl mt-3 space-y-2">
					<li class="break-all">
						{localState.phone}
					</li>
				</ul>
			{/if}
			{#if isLoggedIn}
				<button
					on:click={addPhone}
					disabled={addPhoneAjax}
					class:hello-btn-loader={addPhoneAjax}
					class="{darkMode ? "hello-btn-white-and-static" : "hello-btn-white-on-light"} mt-3"
				>
					{@html localState.phone ? 'ō&nbsp;&nbsp;&nbsp;Update with Hellō' : 'ō&nbsp;&nbsp;&nbsp;Add with Hellō'}
				</button>
			{/if}
		</li>

		<li in:fly={{y: 40, delay: 300}} class:opacity-30={!isLoggedIn} class="opacity-30 rounded-2xl bg-white dark:bg-[#262626] shadow-lg p-8">
			<div class="flex items-center">
				<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor">
					<path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
				</svg>
				<label for="ethereum-address" class="font-bold tracking-widest ml-2 uppercase">Ethereum Address</label>
			</div>
			{#if localState.ethereum}
				<ul id="ethereum-address" class="text-xl mt-3 space-y-2">
					<li class="break-all font-mono">
						{localState.ethereum}
					</li>
				</ul>
			{/if}
			{#if isLoggedIn}
				<button
					on:click={addEthereumAddress}
					disabled={addEthereumAddressAjax}
					class:hello-btn-loader={addEthereumAddressAjax}
					class="{darkMode ? "hello-btn-white-and-static" : "hello-btn-white-on-light"} mt-3"
				>
					{@html localState.ethereum ? 'ō&nbsp;&nbsp;&nbsp;Update with Hellō' : 'ō&nbsp;&nbsp;&nbsp;Add with Hellō'}
				</button>
			{/if}
		</li>
	</section>
	</main>
{/if}