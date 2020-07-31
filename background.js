// console.log("Atleast reached background.js")
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
        var resp = sendResponse;
        console.log("have a message");
        if (request.Message == "getFurigana") {
            console.log("Get IF statement");
            var url = "https://apilearnlanguage.herokuapp.com/api/furigana/" +
				encodeURIComponent(request.Query);
		    fetch(url)
			.then(response => response.text())
			.then(text => JSON.parse(text))
			.then(res => {
                resp(res);
			})
            .catch(error => console.log(error))
            
        return true;
        } else {
            console.log("Did not receive the response!!!")
        }
        
  });;