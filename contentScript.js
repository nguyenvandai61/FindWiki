// Add bubble to the top of the page.
var lang;
var bubbleDOM, keysDOM, contentDOM, ulDOM;

// Create some Elements
bubbleDOM = document.createElement('div');
keysDOM = document.createElement('div');
contentDOM = document.createElement('div');
ulDOM = document.createElement('ul');
cbHoldOnDOM = document.createElement('input');
// Create a DOM tree.
// Body -> bubbleDOM 
// -1> keysDOM
// -2> contentDOM -> ulDOM
// 
document.body.appendChild(bubbleDOM);
bubbleDOM.appendChild(cbHoldOnDOM);
bubbleDOM.appendChild(keysDOM);
bubbleDOM.appendChild(contentDOM);
keysDOM.appendChild(ulDOM);

// Define classes for Elements
bubbleDOM.setAttribute('class', 'selection_bubble');
cbHoldOnDOM.setAttribute('class', 'hold_on');
cbHoldOnDOM.setAttribute('type', 'checkbox');
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

	
	let langmes = (lang == "en")?"English": "Vietnam";
	let message = "get"+langmes+"Key";
	switch (lang) {
		// Case: Search wikipedia
		case 'en':
		case 'vi':
			chrome.runtime.sendMessage({ Message: message, Query: selection }, function (response) {
				if (response) {
					let objsearch = response.query.search;
					searchKey2LiDom(objsearch);
				}
				else {
					console.log("No Response Received");
				}
			})
			break;
		// Case: Search Furigana
		case 'fu':
			chrome.runtime.sendMessage({ Message: "getFurigana", Query: selection }, function (response) {
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
						str = str.concat(item, " ");
					}
					console.log(str);
					keysDOM.innerText = str;
				});
			chrome.runtime.sendMessage({ Message: "getPinyin", Query: selection }, function (response) {
				if (response) {
					contentDOM.innerHTML = response.analyze;
				}
				else {
					console.log("No Response Received");
				}
			})
			break;
	}

	renderBubble(e.clientX, e.clientY);
}, false);

async function renderContent(e) {
	var wordValue = e.target.innerText;
	let langmes = (lang == "en")?"English": "Vietnam";
	let message = "get"+langmes+"Info"
	chrome.runtime.sendMessage({ Message: message, Query: wordValue }, function (response) {
		if (response) {
			let pages = response.query.pages;
			let id = Object.keys(pages)[0];
			let content = pages[id].extract;
			contentDOM.innerHTML = content;
		}
		else {
			console.log("No Response Received");
		}
	})
}

function searchKey2LiDom(objsearch) {
	objsearch.map(it => {
		let liDOM = document.createElement('li');
		liDOM.addEventListener('mouseover', renderContent);
		let lict = it.title;
		liDOM.innerText = lict;
		ulDOM.appendChild(liDOM);
	});
	contentDOM.innerHTML = "";
}

cbHoldOnDOM.addEventListener('mousedown', function () {
	console.log("cbDOM nhan click")
	if (!this.checked) {
		var preventUnselect = function () {
			this.checked = true;
			cbHoldOnDOM.removeEventListener('click', preventUnselect)
		};
		cbHoldOnDOM.addEventListener('click', preventUnselect)
		this.checked = true;
	}
});



// Close the bubble when we click on the screen.
document.addEventListener('mousedown', function (e) {
	// keysDOM.style.visibility = 'hidden';
	// contentDOM.style.visibility = 'hidden';
	if (cbHoldOnDOM.checked) {
		return;
	}
	ulDOM.innerText = '';
	contentDOM.innerHTML = '';
	bubbleDOM.style.visibility = 'hidden';
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
	//
	bubbleDOM.style.visibility = 'visible';
}

function getPinyin(word) {
	let res = "";
	let url = "https://helloacm.com/api/pinyin/?cached&s=" + word + "&t=1";

	return fetch(url, {
		method: 'GET'
	})
		.then(response => {console.log(response); return response.text()})
		.then(contents => {console.log(contents); return JSON.parse(contents).result})
		.catch((er) => console.log("Can’t access " + url + " response. Blocked by browser?" + er))
};

