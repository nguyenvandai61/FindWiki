

var btnSetOptions = document.getElementById('btnSetOptions'); 
btnSetOptions.addEventListener('click', setOptions);

function setOptions() {

	console.log("Set options");
	let lang; 
	var ele = document.getElementsByName('wikilang'); 
				  
	for(i = 0; i < ele.length; i++) { 
		if(ele[i].checked) {
			lang = ele[i].value;
			console.log(lang);
		}
					
	} 
	  
	chrome.storage.sync.set({
		"wikiLang": lang
	  }, function() {
		// Update status to let user know options were saved.
		console.log("Save data lang"+ lang);
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
		  status.textContent = '';
		}, 750);
	  });
	
	
}