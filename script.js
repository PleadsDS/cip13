window.addEventListener("DOMContentLoaded", (event) => {
	const contentIds = ["#subjectContent", "#plaintiffContent", "#defendantContent", "#summaryContent", "#memoryContent"]
	
	const filterIds = ["#plaintiffContent", "#defendantContent", "#summaryContent"]
	
	const fileInput = document.getElementById("file-input");
	const fileDisplay = document.getElementById("fileDisplay");
	let initialMessage = "";
	let caseArray = [];
	let caseCount = 0;
	fileInput.addEventListener("change", handleFileSelectionPapa);

	const hideSummaryCheck = document.getElementById("hideSubject");
	const hideMemoryCheck = document.getElementById("hideMemory");
	
	hideSummaryCheck.addEventListener("change", toggleShowingSubject);
	hideMemoryCheck.addEventListener("change", toggleShowingMemory);

	const randomizeButton = document.getElementById("randomizeButton");
	
	randomizeButton.addEventListener("click", randomizeDisplayedCase);


	// Parse cases.csv file from github
	// https://github.com/PleadsDS/cip13/blob/main/cases.csv
	Papa.parse("./cases.csv", {
		download: true,
		complete: function(results) {
			console.log("Finished:", results.data);
			caseArray = results;
			caseCount = caseArray.data.length - 1
		}
	});

	function handleFileSelection(event) {
		const file = event.target.files[0];
		//fileContentDisplay.textContent = ""; // Clear previous file content

		// Validate file existence and type
		if (!file) {
		showMessage("No file selected. Please choose a file.", "error");
		return;
		}

		if (!file.type.startsWith("text")) {
		showMessage("Unsupported file type. Please select a text file.", "error");
		return;
		}

		// Read the file
		const reader = new FileReader();
		reader.onload = () => {
			initialMessage = reader.result;
			fileDisplay.textContent = reader.result;
			};
			reader.onerror = () => {
				showMessage("Error reading the file. Please try again.", "error");
			};
			reader.readAsText(file);
		  
			// Parse the dang thing into an array
			console.log("File read");
			console.log(initialMessage);
	}
	
	function handleFileSelectionPapa(event) {
		const file = event.target.files[0];
		
		if (!file) {
			showMessage("No file selected. Please choose a file.", "error");
			return;
			}

		if (!file.type.startsWith("text")) {
			showMessage("Unsupported file type. Please select a text file.", "error");
			return;
		}
		
		// Parse local CSV file
		Papa.parse(file, {
			complete: function(results) {
				// console.log("Finished:", results.data);
				caseArray = results;
				caseCount = caseArray.data.length - 1
			}
		});
	}

	function randomizeDisplayedCase() {
		let caseRow = getRandomRowNumber();
		let newCase = caseArray.data[caseRow];
		
		// Change font colours as needed
		// Reset first
		$.each(filterIds, function(i) {
			$(filterIds[i]).css('color', 'black');
			$("#vdiv").css('color', 'black');
		});
		
		// Check for values what need whiting
		// Filter type - filterType
		switch($("#filterType").val()) {
			case "none":
				break;
			case "pvd":
				$(filterIds[0]).css('color', 'white');
				$(filterIds[1]).css('color', 'white');
				$("#vdiv").css('color', 'white');
				break;
			case "summary":
				$(filterIds[2]).css('color', 'white');
				break;
			case "random":
				const rnd = Math.floor((Math.random() * 2) + 1);
				if (rnd == 1) {
					$(filterIds[0]).css('color', 'white');
					$(filterIds[1]).css('color', 'white');
					$("#vdiv").css('color', 'white');
				} else {
					$(filterIds[2]).css('color', 'white');
				}
				break;
		}
		
		// Assign text values	
		$.each(contentIds, function(i) {
			$(contentIds[i]).text(newCase[i]);
		});
		
	}
	
	function toggleShowingSubject() {
		console.log("Toggling subject display");
		if ($("#hideSubject").is(":checked")) {
			$("#subjectContent").css('color', 'white');
		} else {
			$("#subjectContent").css('color', 'black');
		}
	}
	
	function toggleShowingMemory() {
		console.log("Toggling memory display");
		if ($("#hideMemory").is(":checked")) {
			$("#memoryContent").css('color', 'white');
		} else {
			$("#memoryContent").css('color', 'black');
		}
	}
	
	function getRandomRowNumber() {
		return Math.floor(Math.random() * caseCount) + 1;
	} 
});