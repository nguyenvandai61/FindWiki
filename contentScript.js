// Add bubble to the top of the page.

var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
document.body.appendChild(bubbleDOM);

var keysDOM = document.createElement('div');
keysDOM.setAttribute('class', 'keywords_bubble');

var contentDOM = document.createElement('div');
contentDOM.setAttribute('class', 'content_bubble');

bubbleDOM.appendChild(keysDOM);
bubbleDOM.appendChild(contentDOM);

var ulDOM = document.createElement('ul');
ulDOM.setAttribute('class', 'keywordsul_bubble');
keysDOM.appendChild(ulDOM);

// Lets listen to mouseup DOM events.
document.addEventListener('mouseup', async function (e) {
	
  var selection = window.getSelection().toString();
  if (selection.length > 0) {
	  
	console.log(selection);
	let keyObjs = await getObjKeywords(selection);
	console.log(keyObjs);
	for(let keyObj of keyObjs) {
		
	console.log("nap tu");
		let liDOM = document.createElement('li');
		liDOM.addEventListener('mouseover', renderContent);

		let lict = keyObj.title;
		liDOM.innerText = lict;
		ulDOM.appendChild(liDOM);
	}
    renderBubble(e.clientX, e.clientY);
  }
}, false);

async function renderContent(e) {
	console.log(e.target.innerText);
	let content = await getInfoWiki(e.target.innerText);
	contentDOM.innerHTML = content;
	
}


// Close the bubble when we click on the screen.
document.addEventListener('mousedown', function (e) {
  bubbleDOM.style.visibility = 'hidden';
  ulDOM.innerText = '';
  contentDOM.innerHTML='';
}, false);

// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY) {
  bubbleDOM.style.position = 'fixed';
  bubbleDOM.style.backgroundColor = '#FFF';
  bubbleDOM.style.padding = '10px';
  bubbleDOM.style.maxWidth = '600px';
  bubbleDOM.style.top = mouseY + 'px';
  bubbleDOM.style.left = mouseX + 'px';
  bubbleDOM.style.visibility = 'visible';
}

function getInfoWiki(word) {
	
	console.log("GetInfoWiki");
	let url = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&format=json&origin=*&titles='+word;
	
	return fetch(url, {
		method: 'GET',
		mode: 'cors',
		  headers: {
			'Content-Type': 'application/json',
			'API-Key': 'secret'
	}})
	.then(response => response.text())
	.then(contents => JSON.parse(contents))
	.then(obj => {
		let page = obj.query.pages;
		let id = Object.keys(page)[0];
		return page[id].extract;
	}
		
		)
	.catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))

}

async function getObjKeywords(word) {
	
	console.log("GetKeys");
	let url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch='+word;

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


