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

async function test2() {
	let res = await getPinyin("我的朋友昨天在纽约。");
	console.log(res);
};

// test2(); 