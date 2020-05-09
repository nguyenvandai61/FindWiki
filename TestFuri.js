
	async function getFurigana(sentence) {
		let res = "";
		let data = [
			{
			  japanese: sentence,
			}
		];
		let url = "https://cors-anywhere.herokuapp.com/https://api.furiousgana.com";
		
		return fetch(url, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		
		body:  JSON.stringify(data),
		})
		.then(response => response.json())
		.then(contents => contents.result)
		.then(res => res[0].furigana)
		.catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
		
	}
	//text.
	function test() {
		getFurigana("約束")
		.then(res => {
			console.log(res);
		});
	}
	