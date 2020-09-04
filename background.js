// console.log("Atleast reached background.js")
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        var resp = sendResponse;
        console.log("have a message");
        switch (request.Message) {
            case "getFurigana":
                var url = "https://apilearnlanguage.herokuapp.com/api/furigana/" +
                    encodeURIComponent(request.Query);
                fetchData(url, resp);
                return true;
            case "getPinyin":
                var url = "https://apilearnlanguage.herokuapp.com/api/pinyin/" +
                    encodeURIComponent(request.Query);
                fetchData(url, resp);
                return true;
            case "getEnglishKey":
                var url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&exsentences=10&format=json&origin=*&srsearch=' + request.Query;
                fetchData(url, resp);
                return true;
            case "getEnglishInfo":
                var url = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&origin=*&titles=' + request.Query;
                fetchData(url, resp);
                return true;
            case "getVietnamKey":
                var url = 'https://vi.wikipedia.org/w/api.php?action=query&list=search&exsentences=10&format=json&origin=*&srsearch=' + request.Query;
                fetchData(url, resp);
                return true;
            case "getVietnamInfo":
                var url = 'https://vi.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&origin=*&titles=' + request.Query;
                fetchData(url, resp);
                return true;
        }


        console.log("Did not receive the response!!!")

    });;


const fetchData = (url, resp) => {
    fetch(url)
        .then(response => response.text())
        .then(text => JSON.parse(text))
        .then(res => {
            resp(res);
        })
        .catch(error => console.log(error))
}