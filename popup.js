var btnSetOptions = document.getElementById('btnSetOptions');
var eles = document.getElementsByName('wikilang'); 
btnSetOptions.addEventListener('click', setOptions);
var lang; // Language that user choose.
tickRadio();

function setOptions() {
	for(i = 0; i < eles.length; i++) { 
		if(eles[i].checked) {
			lang = eles[i].value;
			console.log(lang);
		}
	} 
	  
	chrome.storage.sync.set({
		"wikiLang": lang
	  }, function() {
		// Update status to let user know options were saved.
		console.log("Save data lang"+ lang);
		let status = document.getElementById('status');
		status.textContent = 'Options '+lang+' saved.';

		setTimeout(function() {
		  status.textContent = '';
		}, 750);
	  });
}

function tickRadio() {
	if (chrome.storage.sync)
	{
		chrome.storage.sync.get("wikiLang", function (obj) {
			if (!obj) return;
			lang = obj.wikiLang;
			// tick radio
			for(i = 0; i < eles.length; i++) { 
				if(eles[i].value == lang) {
					eles[i].checked = true;
				}
			} 
		});
	}
}