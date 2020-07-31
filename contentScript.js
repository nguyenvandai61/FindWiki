// Add bubble to the top of the page.
var lang;
var bubbleDOM, keysDOM, contentDOM, ulDOM;

// Create some Elements
bubbleDOM = document.createElement('div');
keysDOM = document.createElement('div');
contentDOM = document.createElement('div');
ulDOM = document.createElement('ul');

// Create a DOM tree.
// Body -> bubbleDOM 
// -1> keysDOM
// -2> contentDOM -> ulDOM
// 
document.body.appendChild(bubbleDOM);
bubbleDOM.appendChild(keysDOM);
bubbleDOM.appendChild(contentDOM);
keysDOM.appendChild(ulDOM);

// Define classes for Elements
bubbleDOM.setAttribute('class', 'selection_bubble');
keysDOM.setAttribute('class', 'keywords_bubble');
contentDOM.setAttribute('class', 'content_bubble');
ulDOM.setAttribute('class', 'keywordsul_bubble');



// Lets listen to mouseup DOM events.
document.addEventListener('mouseup', async function (e) {
	if (chrome.storage.sync) {
		chrome.storage.sync.get("wikiLang", function (obj) {
			if (!obj) return;
			lang = obj.wikiLang;
		});
	}

	if (lang == 'undefined') lang = "en";
	if (lang == 'off') return;
	var selection = window.getSelection().toString();
	if (selection.length == 0) return;
	switch (lang) {
		// Case: Search wikipedia
		case 'en':
		case 'vi':
			let keyObjs = await getObjKeywords(selection, lang);

			for (let keyObj of keyObjs) {

				let liDOM = document.createElement('li');
				liDOM.addEventListener('mouseover', renderContent);

				let lict = keyObj.title;
				liDOM.innerText = lict;
				ulDOM.appendChild(liDOM);
			}
			break;
		// Case: Search Furigana
		case 'fu':
 			chrome.runtime.sendMessage({Message: "getFurigana", Query: selection}, function (response) {
                if (response) {
					keysDOM.innerHTML = response.furigana;
					contentDOM.innerHTML = response.analyze;
                }
                else {
                    console.log("No Response Received");
                }
            })
			break;
		case 'pi':
			getPinyin(selection)
				.then(res => {
					console.log(res.length);
					let str = "";
					for (let item of res) {
						str = str.concat(item, "\n");

						console.log(item);
						console.log(str);
					}
					console.log(str);
					contentDOM.innerText = str;
				});
			break;
	}

	renderBubble(e.clientX, e.clientY);
}, false);

async function renderContent(e) {
	var wordValue = e.target.innerText;
	let content = await getInfoWiki(wordValue, lang);
	contentDOM.innerHTML = content;
}


// Close the bubble when we click on the screen.
document.addEventListener('mousedown', function (e) {
	bubbleDOM.style.visibility = 'hidden';
	ulDOM.innerText = '';
	contentDOM.innerHTML = '';
}, false);

// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY) {
	bubbleDOM.style.position = 'fixed';
	bubbleDOM.style.backgroundColor = '#FFF';
	bubbleDOM.style.padding = '10px';
	bubbleDOM.style.maxWidth = '600px';
	bubbleDOM.style.top = mouseY + 'px';
	bubbleDOM.style.left = mouseX + 'px';
	bubbleDOM.style.height = '400px';
	bubbleDOM.style.overflow = 'scroll';
	bubbleDOM.style.zIndex = '999999';
	bubbleDOM.style.visibility = 'visible';
}
function getInfoWiki(word, lang = "en") {

	console.log("GetInfoWiki");
	switch (lang) {
		case "en": url = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&origin=*&titles=' + word;
			break;
		case "vi": url = 'https://vi.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&origin=*&titles=' + word;
	}

	console.log(url);
	return fetch(url, {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'API-Key': 'secret'
		}
	})
		.then(response => response.text())
		.then(contents => JSON.parse(contents))
		.then(obj => {
			let page = obj.query.pages;
			let id = Object.keys(page)[0];
			return page[id].extract;
		})
		.catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))

}


// Get 10 suggested keywords
function getObjKeywords(word, lang = "en") {

	console.log("GetKeys");
	switch (lang) {
		case "en": url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&exsentences=10&format=json&origin=*&srsearch=' + word;
			break;
		case "vi": url = 'https://vi.wikipedia.org/w/api.php?action=query&list=search&exsentences=10&format=json&origin=*&srsearch=' + word;
	}
	return fetch(url, {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'API-Key': 'secret'
		}
	})
		.then(response => response.text())
		.then(contents => JSON.parse(contents))
		.then(obj => {
			return obj.query.search;
		})
		.catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))

}



test();