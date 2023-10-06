import puppeteer from "puppeteer";
import express from 'express'
import fs from 'fs';

const _username_ = 'x6nge' //c5724130
const _useremail_ = 'thekeyoftrue@x6nge.io';
const _telefono_ = '+5358538095';
const _password_ = 'KuendaCongo7.';
const _token_ = 'tktk9wv7I8UU26FGGhtsSyMgZvmco8caqygNgPVMrdDw02IZlnRhbK3s'
const PORT = 5001

let _cookies_;
try{
    let readCookie = fs.readFileSync('cookies.txt', 'utf8');
    _cookies_ = JSON.parse(readCookie);
}catch(e){
    _cookies_ = false;
}

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
;

const startPuppeteerSession = async () => {
    const browser = await puppeteer.launch({
        headless: false,
    	slowMo: 100,
    	defaultViewport: {
			width: 1280, //800
			height: 720 //600
    	},
        executablePath: "D:\\Trabajo\\Desarrollo Web\\Node Js\\instaladores\\chrome-win\\chrome.exe",
    });
    
    const page = await browser.newPage();
    if(_cookies_) page.setCookie(... _cookies_);

    await page.goto('https://twitter.com/x6nge/followers', {waitUntil: 'load', timeout: 180000})
    
    var url = await page.url();

    if(url == 'https://twitter.com/x6nge/followers'){
        console.log('session iniciada con cookies')
    }
    else if(url == 'https://twitter.com/i/flow/login?redirect_after_login=%2Fx6nge%2Ffollowers'){
        await console.log('la url es '+url)
        const user = await page.$('input[autocomplete="username"]');
        await user?.type(_useremail_);
        await console.log(_useremail_)

        var searchResultSelector  = "#layers > div > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-kwpbio.r-rsyp9y.r-1pjcn9w.r-1279nm1.r-htvplk.r-1udh08x > div > div > div.css-1dbjc4n.r-14lw9ot.r-6koalj.r-16y2uox.r-1wbh5a2 > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div > div > div > div:nth-child(6)"
        await page.waitForSelector(searchResultSelector);
        await page.click(searchResultSelector);

        try{
            var title = '#modal-header > span > span';
            await page.waitForSelector(title)
            let element = await page.$(title)
            let fullTitle = await page.evaluate(el => el.textContent, element)
            
            await console.log(fullTitle)
            
            if(fullTitle){
                await console.log("el title funciona ")
                
                const name = await page.$('input[name="text"]');
                await name?.type(_username_);
                await console.log(_username_)

                var btnNameUser  = "#layers > div > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-kwpbio.r-rsyp9y.r-1pjcn9w.r-1279nm1.r-htvplk.r-1udh08x > div > div > div.css-1dbjc4n.r-14lw9ot.r-6koalj.r-16y2uox.r-1wbh5a2 > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div.css-1dbjc4n.r-1isdzm1 > div > div > div > div"
                try{
					await page.waitForSelector(btnNameUser);
					await page.click(btnNameUser);
				}catch(e){
					//await page.screenshot({path: '2-continue.png'});
				}
				
            }else{
                await console.log("el no title funciona ")
            }
        }catch(e){
            await console.log("error", e)
        }

        const password = await page.$('input[name="password"]');
        await password?.type(_password_);
        await console.log(_password_)

        var singIn  = 'div[data-testid="LoginForm_Login_Button"]'
        await page.waitForSelector(singIn);
        await page.click(singIn);
        
    }
	
	await console.log('Se inicio session correctamente en el usuario '+_username_)
	const cookies = await page.cookies();
  	saveCookies(cookies);
	//page.screenshot({path: 'atrt_session.png'});
  	return {browser, page};
};

const sessions = {};

sessions[_token_] = await startPuppeteerSession();

express()
  .use((req, res, next) => 
    req.query.token === undefined ? res.sendStatus(401) : next()
  )
  .get("/start", asyncHandler(async (req, res) => {
    sessions[req.query.token] = await startPuppeteerSession();
    res.sendStatus(200);
  }))
  .get("/content", asyncHandler(async (req, res) => {
    const page = await sessions[req.query.token].page;
    res.send(await page.content());
  }))
  .get("/kill", asyncHandler(async (req, res) => {
    const browser = await sessions[req.query.token].browser;
    await browser.close();
    delete sessions[req.query.token];
    res.sendStatus(200);
  }))
  .get("/auth", asyncHandler(async (req, res) => {
    try{
      
		const username = req.query.username || '';
		if(username == ''){
			res.send({'response': 'user_not_found'})
		}
		
		let returndata = null
		console.log("se activa la pagina 1")
		const page = await sessions[_token_].page
		returndata = await validateUsername(page, username);
      
		if(returndata.isexist){
			if(returndata.isfollow) res.send({'response': 'username_follows'})
			else res.send({'response': 'username_not_follow'})
		}else 
			res.send({'response': 'username_not_exist'})
		}catch(e){
			console.log(e)
		}
    
  }))
  .use((err, req, res, next) => res.sendStatus(500))
  .listen(PORT, () => console.log("listening on port "+PORT))
;

async function validateUsername(page, username){
	//await page.screenshot({path: '2-continue.png'});
	console.log("el username es "+username)
	const inpclick = 'input[data-testid="SearchBox_Search_Input"]';
	await page.waitForSelector(inpclick);
	await page.click(inpclick);

	const input = await page.$('input[data-testid="SearchBox_Search_Input"]');
	await input.click({ clickCount: 3 })
	await input?.type(`@${username}`);

	var isexist = false, isfollow = false;
	var _username = 'div[data-testid="TypeaheadUser"]'
	await page.waitForSelector(_username)
	let element1 = await page.$(_username)
	let typeheaduser = await page.evaluate(el => el.textContent, element1)
	console.log(`typeheaduser ${typeheaduser}`)

	var reg = new RegExp(`@${username}`, 'g'), reg2 = new RegExp(`(Follows you|Te sigue)`, 'g');
	console.log("el patron es "+reg)
	var busq = typeheaduser.matchAll(reg);
	
	if (reg.test(typeheaduser)){
		if(reg2.test(typeheaduser)){
			isfollow = true
		}
		isexist = true
	}
	return {isexist, isfollow}
}
function saveCookies(data){ 
    let cookies = []
    data.map(value => {
        cookies.push(value)
    });

    fs.writeFile('cookies.txt', JSON.stringify(cookies), (err)=>{
        if(err) return console.error(err);
    })
}
async function storequeve(username, lista){
	while (1){
		for( let mPage of lista){
			if(mPage.isactive == false){
				const page = await mPage.page;
				return await validateUsername(page, username);
			}
			
		}
		await sleep(1000)
	}
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}