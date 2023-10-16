import puppeteer from "puppeteer";
import express from 'express'
import fs from 'fs';
import dotenv from 'dotenv'
import { time, timeEnd } from "console";
dotenv.config()

const _username_ = process.env.TWI_USERNAME //c5724130
const _useremail_ = process.env.TWI_USEREMAIL;
const _telefono_ = process.env.TWI_TELEFONO;
const _password_ = process.env.TWI_PASSWORD;
const _token_ = process.env.TWI_TOKEN
const PORT = process.env.TWI_PORT
const _TIMEOUT_ = process.env.TWI_TIMEOUT
const _MOD_ = process.env.TWI_MOD

//http://localhost:5002/auth?token=tktk9wv7I8UU26FGGhtsSyMgZvmco8caqygNgPVMrdDw02IZlnRhbK3s&username=Savvy_Coin

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

	const browserIni = async function(){
		let browser;
		if(_MOD_ == "prod"){
			browser = await puppeteer.launch({
				args: ['--no-sandbox'],
				slowMo: 100,
				defaultViewport: {
					width: 1366, //800
					height: 768 //600
				},
			});
		}else{
			await console.log('mode dev in local');
	
			browser = await puppeteer.launch({
				headless: false,
				args: ['--no-sandbox'],
				slowMo: 100,
				defaultViewport: {
					width: 1280, //800
					height: 720 //600
				},
				executablePath: "D:\\Trabajo\\Desarrollo Web\\Node Js\\instaladores\\chrome-win\\chrome.exe",
			});
		}
		return browser;
	}
	
    const browser = await browserIni()
    const page = await browser.newPage();
    //if(_cookies_) page.setCookie(... _cookies_);

    await page.goto('https://twitter.com/DarkRaimbos/followers', {waitUntil: 'load', timeout: _TIMEOUT_})
    
    var url = await page.url();

    if(url == 'https://twitter.com/DarkRaimbos/followers'){
        console.log('session iniciada con cookies')
    }
    else if(url == 'https://twitter.com/i/flow/login?redirect_after_login=%2FDarkRaimbos%2Ffollowers'){
        await console.log('la url es '+url)
        const user = await page.$('input[autocomplete="username"]');
		
        await user?.type(_useremail_);
        await console.log(_useremail_)

        //var searchResultSelector  = "#layers > div > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-kwpbio.r-rsyp9y.r-1pjcn9w.r-1279nm1.r-htvplk.r-1udh08x > div > div > div.css-1dbjc4n.r-14lw9ot.r-6koalj.r-16y2uox.r-1wbh5a2 > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div > div > div > div:nth-child(6)"
        //await page.waitForSelector(searchResultSelector);
        //await page.click(searchResultSelector);
		await page.keyboard.press('Enter')

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
				await page.keyboard.press('Enter')
				/*
                var btnNameUser  = "#layers > div > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1pi2tsx.r-1777fci.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-1867qdf.r-1wbh5a2.r-kwpbio.r-rsyp9y.r-1pjcn9w.r-1279nm1.r-htvplk.r-1udh08x > div > div > div.css-1dbjc4n.r-14lw9ot.r-6koalj.r-16y2uox.r-1wbh5a2 > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div.css-1dbjc4n.r-1isdzm1 > div > div > div > div"
                try{
					await page.waitForSelector(btnNameUser);
					await page.click(btnNameUser);
				}catch(e){
					await page.screenshot({path: './errorimg/2-continue.png'});
				}
				*/

				
            }else{
                await console.log("el no title funciona ")
            }
        }catch(e){
            await console.log("error", e)
        }

        const password = await page.$('input[name="password"]');
        await password?.type(_password_);
        await console.log(_password_)
		await page.keyboard.press('Enter')
		/*
        const [buttonLogin] = await page.$x("//span[contains(., 'Next')]");
        if (buttonLogin) {
            await buttonLogin.click();
            await console.log("funciona el metodo xpath")
        }else{
          var singIn  = 'div[data-testid="LoginForm_Login_Button"]'
          await page.waitForSelector(singIn);
          await page.click(singIn);
        }
		*/
    }
	
	await console.log('Se inicio session correctamente en el usuario '+_username_)
	const cookies = await page.cookies();
  	saveCookies(cookies);

	//Cambiando de cuenta a x6nge
	var account  = 'div[aria-label="Account menu"]'
	await page.waitForSelector(account, {waitUntil: 'load', timeout: _TIMEOUT_});
	await page.click(account);

	var x6nge = 'div[aria-label="Act as"][data-testid="UserCell"]'
	await page.waitForSelector(x6nge, {waitUntil: 'load', timeout: _TIMEOUT_});
	await page.click(x6nge);

	var sing = '[data-testid="sheetDialog"] div[style="background-color: rgb(15, 20, 25);"]'
	await page.waitForSelector(sing);
	await page.click(sing);

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
		const timeini = Date.now()
		if(!req.query.username || req.query.username == ''){
			res.send({'response': 'user_not_found'})
		}
      	const spaces = req.query.spaces || 0
		let textspace = ''
		/*
		if(spaces == 1) textspace = ' '
		if(spaces == 2) textspace = '  '
		if(spaces == 3) textspace = '   '
		*/
		if(spaces == 1) textspace = '%20'
		if(spaces == 2) textspace = '%20%20'
		if(spaces == 3) textspace = '%20%20%20'

		const username = req.query.username || '';

		let returndata = null
		const page = await sessions[_token_].page
		//returndata = await validateUsername(res, page, username, textspace);
		returndata = await validateUsernameFull(page, username, textspace);
		if(spaces == 3) page.goto('https://twitter.com/x6nge/followers', {waitUntil: 'load', timeout: _TIMEOUT_})
		
		if(returndata.error) res.send({'response': returndata.error})
		let timeEnd = (Date.now() - timeini) / 1000
		await console.log(`el tiempo de ejecucion ${timeEnd} segundos`)
		if(returndata.isexist){
			if(returndata.isfollow){
				console.log(` username ${username} code: username_follows`)
				res.send({'response': 'username_follows'})
			}
			else {
				console.log(` username ${username} code: username_not_follow`)
				res.send({'response': 'username_not_follow'})
			}
		}
		else{
			console.log(` username ${username} code: username_not_exist`)
			res.send({'response': 'username_not_exist'})
		}
	}catch(e){
		await console.log(e)
		await res.send({'response': 'error_in_validuser'})
	}
    
  }))
  .listen(PORT, () => console.log("listening on port "+PORT))
;

async function validateUsername(res, page, username, textspace){
	try{
		const inpclick = 'input[data-testid="SearchBox_Search_Input"]';
		await page.waitForSelector(inpclick);
		await page.click(inpclick);

		const input = await page.$('input[data-testid="SearchBox_Search_Input"]');
		await input.click({ clickCount: 3 })
		await input?.type(`${textspace}@${username}`);

		var isexist = false, isfollow = false;
		var _username = 'div[data-testid="TypeaheadUser"]'
		await page.waitForSelector(_username)
		let element1 = await page.$(_username)
		let typeheaduser = String(await page.evaluate(el => el.textContent, element1))
		//typeheaduser = typeheaduser.replace(`@${username}`, ' ')
		console.log(`typeheaduser ${typeheaduser}`)

		var reg = new RegExp(`@${username}`, 'g'),
    	reg2 = new RegExp(`(Follows you|Te sigue|You follow each other|Se siguen mutuamente)`, 'g'),
    	reg3 = new RegExp(`(You follow each other|Se siguen mutuamente)`, 'g');
		//console.log("el patron es "+reg)
		//var estado = typeheaduser.split(`@${username}`)[0];
		
	  	if (reg.test(typeheaduser) || typeheaduser.includes(`@${username}`)){
			console.log('se encontro')
      		typeheaduser = typeheaduser.replace(username, " ")
			if(reg2.test(typeheaduser)){
				isfollow = true
			}else if(reg3.test(typeheaduser)){
				isfollow = true
			}else if(typeheaduser.includes('Se siguen mutuamente')){
				isfollow = true
			}else if(typeheaduser.includes('siguen mutuamente')){
				isfollow = true
			}
			else if(typeheaduser.includes('You follow each other')){
				isfollow = true
			}
			else if(typeheaduser.includes('follow each other')){
				isfollow = true
			}
			else if(typeheaduser.includes('follow each')){
				isfollow = true
			}else if(typeheaduser.includes('Follows you')){
				isfollow = true
			}else if(typeheaduser.includes('Te sigue')){
				isfollow = true
			}
			isexist = true
		}
		return {isexist, isfollow, error: false}
	}catch(e){
		await console.log(e)
    	await page.screenshot({path: `./errorimg/validateUsername_${username}.png`});
		return {isexist: false, isfollow: false, error: 'error_in_validuser'}
	}
	
}
async function validateUsernameFull(page, username, textspace){
	try{
		await page.goto(`https://twitter.com/search?q=${textspace}%40${username}&src=typed_query&f=user`);
		var isexist = false, isfollow = false;
		
		var _username1 = `div[aria-label="Timeline: Search timeline"]  div[data-testid="UserCell"] > div:nth-child(2)  > div:nth-child(2)  > div:nth-child(1)  > div:nth-child(1)`
		var _username2 = `div[aria-label="Timeline: Search timeline"]  div[data-testid="UserCell"]`
		let elementFin;
		try{
			let timeuser = Date.now()
			await page.waitForSelector(_username, {waitUntil: 'load', timeout: _TIMEOUT_})
			elementFin = [await page.$(_username1)]
			console.log(`se demora en encontrarlo usuario1 ${(Date.now() - timeuser)/1000}`)
		}catch(e){
			try{
				let timeuser = Date.now()
				await page.waitForSelector(_username2, {waitUntil: 'load', timeout: _TIMEOUT_})
				elementFin = await page.$$(_username2)
				console.log(`se demora en encontrarlo usuario2 ${(Date.now() - timeuser)/1000}`)
			}catch(e){
				console.log(e)
				return {isexist, isfollow, error: true}
			}
		}
		
		for(let element1 of elementFin){
			let typeheaduser = String(await page.evaluate(el => el.textContent, element1))
			//typeheaduser = typeheaduser.replace(`@${username}`, ' ')
			//console.log(`typeheaduser ${typeheaduser}`)

			var reg = new RegExp(`@${username}`, 'g'),
			reg2 = new RegExp(`(Follows you|Te sigue|You follow each other|Se siguen mutuamente)`, 'g'),
			reg3 = new RegExp(`(You follow each other|Se siguen mutuamente)`, 'g');
			//console.log("el patron es "+reg)
			//var estado = typeheaduser.split(`@${username}`)[0];
			
			if (reg.test(typeheaduser) || typeheaduser.includes(`@${username}`)){
				//console.log('se encontro')
				typeheaduser = typeheaduser.replace(username, " ")
				if(reg2.test(typeheaduser)){
					isfollow = true
				}else if(reg3.test(typeheaduser)){
					isfollow = true
				}else if(typeheaduser.includes('Se siguen mutuamente')){
					isfollow = true
				}else if(typeheaduser.includes('siguen mutuamente')){
					isfollow = true
				}
				else if(typeheaduser.includes('You follow each other')){
					isfollow = true
				}
				else if(typeheaduser.includes('follow each other')){
					isfollow = true
				}
				else if(typeheaduser.includes('follow each')){
					isfollow = true
				}else if(typeheaduser.includes('Follows you')){
					isfollow = true
				}else if(typeheaduser.includes('Te sigue')){
					isfollow = true
				}
				isexist = true
				break;
			}
		}
		return {isexist, isfollow, error: false}
	}catch(e){
		await console.log(e)
    	await page.screenshot({path: `./errorimg/validateUsername_${username}.png`});
		return {isexist: false, isfollow: false, error: 'error_in_validuser'}
	}
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
