// define model (low and high detail)
let models = [
	{ name: "very detailed (14MB)", filename: "models/sagrada-familia.glb", poster: "models/cathedral.webp" },
	{ name: "less detailed (2MB)", filename: "models/sagrada-familia.glb", poster: "models/cathedral.webp" }
]

// call all functions 
resizeModel();
zoomModel();
setAutoRotateModel();
initModelSelector();
//initVariantSelector();
switchModelExample();
zoomModel();
setRotateSpeedOfModel();
setOrbitSensitivityForModel();
//showDimensionLines();


// all functions are written here, most are for setting the model up (zoom, annotations, size, etc.)
function initModelSelector() {
	const parentElement = document.getElementById("model-chooser")
	models.map(function (model) {
		const template = document.getElementById("model-select").content;
		const input = template.querySelector("input")
		input.id = model.name;
		input.value = model.name;

		const label = template.querySelector("label")
		label.setAttribute("for", model.name);
		label.innerText = model.name;

		return template.cloneNode(true);
	}).forEach(function (element) {
		parentElement.appendChild(element)
	});
}

const defaultVariantChooserContent = document.getElementById("variant-chooser").innerHTML

function initVariantSelector() {
	const parentElement = document.getElementById("variant-chooser")
	parentElement.innerHTML = defaultVariantChooserContent;
	//	console.log(document.querySelector("#model-auto-mit-artefakten-texturiert"))
	const viewer = document.querySelector("#Basílica-de-la-Sagrada-Familía")
	viewer.availableVariants.map(function (variant) {
		const template = document.getElementById("variant-select").content;
		const input = template.querySelector("input")
		input.id = variant
		input.value = variant;

		const label = template.querySelector("label")
		label.setAttribute("for", variant);
		label.innerText = variant;

		const currentVariant = viewer.variantName === null ? viewer.availableVariants[0] : viewer.variantName
		if (currentVariant === variant) {
			input.checked = true;
		}
		else {
			input.checked = false;
		}

		return template.cloneNode(true);
	}).forEach(function (element) {
		parentElement.appendChild(element)
	});
}
function resizeModel() {
	var new_height = document.getElementById("model-size").value;
	var new_width = new_height * 1.5;
	document.getElementById("Basílica-de-la-Sagrada-Familía").style.width = new_width + "px";
	document.getElementById("Basílica-de-la-Sagrada-Familía").style.height = new_height + "px";
}

async function zoomModel() {
	var slider = document.getElementById("model-zoom");
	var zoom = parseInt(slider.getAttribute("max")) - slider.value + parseInt(slider.getAttribute("min"));

	console.log("zoom to " + zoom + "%");

	var old_camera_orbit = document.getElementById("Basílica-de-la-Sagrada-Familía").getAttribute("camera-orbit");
	var old_camera_orbit_array = old_camera_orbit.split(" ");
	var new_camera_orbit = old_camera_orbit_array[0] + " " + old_camera_orbit_array[1] + " " + zoom + "%";
	document.getElementById("Basílica-de-la-Sagrada-Familía").setAttribute("camera-orbit", new_camera_orbit);

	await reloadModel();
}

async function setAutoRotateModel() {
	if (document.querySelector('#auto-rotate').checked) {
		console.log("auto-rotate on");
		document.getElementById("Basílica-de-la-Sagrada-Familía").setAttribute("auto-rotate", "on");
	} else {
		console.log("auto-rotate off");
		document.getElementById("Basílica-de-la-Sagrada-Familía").removeAttribute("auto-rotate");
	}

	await reloadModel();
}

async function setRotateSpeedOfModel() {
	var new_rotate_speed = document.getElementById("model-rotate-speed").value;
	console.log("set rotate speed to " + new_rotate_speed + "%");
	document.getElementById("Basílica-de-la-Sagrada-Familía").setAttribute("rotation-per-second", new_rotate_speed + "%");

	await reloadModel();
}


async function switchModelExample() {
	for (const model of models) {
		if (document.querySelector('input[name="switch-model"]:checked').value == model.name) {
			console.log("switch model to " + model.name);
			const viewer = document.querySelector('#Basílica-de-la-Sagrada-Familía');
			//viewer.poster = model.poster;
			document.querySelector("#lazy-load-poster").style.backgroundImage = "url(" + model.poster + ")";
			viewer.querySelector("#button-load").innerText = "Load 3D model: " + model.name;
			//viewer.showPoster();
			viewer.setAttribute("src", model.filename);

		}
	}

	await reloadModel();
	initVariantSelector();
}

async function switchVariantExample() {
	for (const variant of document.querySelector("#Basílica-de-la-Sagrada-Familía").availableVariants) {
		if (document.querySelector('input[name="switch-variant"]:checked').value == variant) {
			console.log("switch variant to " + variant);
			document.querySelector('#Basílica-de-la-Sagrada-Familía').variantName = variant
		}
	}

	await reloadModel();
}

async function setOrbitSensitivityForModel() {
	var new_orbit_sensitivity = document.getElementById("model-orbit-sensitivity").value;
	console.log("set orbit sensitivity to " + new_orbit_sensitivity);
	document.getElementById("Basílica-de-la-Sagrada-Familía").setAttribute("orbit-sensitivity", new_orbit_sensitivity);
	await reloadModel();
}

function setShowAnnotations() {
	var display_state;
	if (document.getElementById("show-annotations").checked) {
		display_state = "block";
	} else {
		display_state = "none";
	}
	console.log("setting annotation display to " + display_state);
	document.querySelectorAll(".Hotspot").forEach(function (x) {
		x.style.display = display_state;
	});
}

async function reloadModel() {
	var model_element = document.getElementById("model-container");
	await model_element.updateComplete;
	setShowAnnotations();
}


// add functionality to annotations

// to be added yet: line to textbox (maybe)

const modelViewer = document.querySelector("#Basílica-de-la-Sagrada-Familía");

// camera target moves when annotation is clicked 
function handleAnnotationClick(annotation) {
	const dataset = annotation.dataset;
	modelViewer.cameraOrbit = dataset.orbit;
	modelViewer.cameraTarget = dataset.target;
	modelViewer.fieldOfView = dataset.zoom || '25deg'; // Use the specified zoom level, or default to 25 degrees
	modelViewer.style.setProperty('--primary-color', 'red'); // Change 'red' to the color you want // NOT WORKING
}




//let textboxVisible = false;
// retrieves the id from clicked dot
function getHotspotID(hotspot) {
	hotspot.addEventListener('click', function () {

		//console.log('annotation clicked!');
		hotspot.classList.add('-visited');
		let annotationID = hotspot.getAttribute("slot"); // equals to hotspot-1
		//console.log(annotationID);

		let id = annotationID.split('-');   // only get number
		annotationID = id[1];
		showTextBox(annotationID);
		//closeTextBox(annotationID);
	});
}

function getNavID(dot) {
	dot.addEventListener('click', function () {

		console.log('nav clicked!');
		dot.classList.add('-visited');
		let annotationID = dot.getAttribute("id"); // equals to nav-1

		let id = annotationID.split('-');   // only get number
		annotationID = id[1];
		// textboxVisible = true; // set it here before going into the function?
		showTextBox(annotationID);
		//closeTextBox(annotationID);
	});
}

// needs altering with closing logic 
function showTextBox(id) {
	//textboxVisible = true;
	if (document.querySelectorAll('.textbox[style="display: block;"]').length == 0) { //check if any textbox is visible
	let currentTextbox = document.getElementById("textbox-" + id);   // if no, show
	let textboxArea = document.querySelector(".textbox-area");
	if (currentTextbox.style.display === 'block') {
		document.querySelector('.model-box').style.gridColumn = 'span 2';
		currentTextbox.style.display = 'none';
		textboxArea.style.display = 'none';
		document.getElementById('last').style.visibility = 'hidden';  // also hide the skip buttons
		document.getElementById('next').style.visibility = 'hidden';
	} else{
		document.querySelector('.model-box').style.gridColumn = 'span 1';
		currentTextbox.style.display = 'block';
		textboxArea.style.display = 'block';
		document.getElementById('last').style.visibility = 'visible';
		document.getElementById('next').style.visibility = 'visible';
	}
	} else {   // if yes, hide first
		document.querySelectorAll('.textbox[style="display: block;"]').forEach((textbox=>{ 
			textbox.style.display === 'none';
		}))
	}
}
// problem is rn that this function works on click call
// not on skip call bc it will not be given the button element 
// easiest would be to call function without parameter
// but then how track which box was closed?
function closeTextBox(button) {
	console.log(button);
	let id = button.getAttribute('id');
	console.log(id);
	let textbox = document.getElementById("textbox-" + id);
	if (textbox.style.display == 'block'){
			textbox.style.display = 'none';
			document.getElementById('next').style.visibility = 'hidden';
			document.getElementById('last').style.visibility = 'hidden';
	}
	//textbox.style.display = (textbox.style.display === 'block') ? 'none' : 'block';

}


// skip between text boxes 
// forward

function skipForward(arrow) {
	const currentTextbox = document.querySelector('.textbox[style="display: block;"]'); // check for textbox on display
    const previousTextbox = currentTextbox.nextElementSibling;
    
    if (previousTextbox && previousTextbox.classList.contains('textbox')) {
        currentTextbox.style.display = 'none';
        previousTextbox.style.display = 'block';
    } else {
		currentTextbox.style.display = 'none';
		document.getElementById("textbox-1").style.display = 'block'; // begin at 1 
	}

}

// same functionality for the left arrow

function skipBackward() {
	const currentTextbox = document.querySelector('.textbox[style="display: block;"]');
    const previousTextbox = currentTextbox.previousElementSibling;
    
    if (previousTextbox && previousTextbox.classList.contains('textbox')) {
        currentTextbox.style.display = 'none';
        previousTextbox.style.display = 'block';
    } else {
		currentTextbox.style.display = 'none';
		document.getElementById("textbox-7").style.display = 'block'; // go back to 7
	}

}


// scrolling text disappears 
let textbox = document.querySelectorAll(".textbox").forEach((textbox) => {
	textbox.addEventListener('scroll', function() {
		let content = document.querySelector(".textbox-content");
		const lineHeight = parseInt(window.getComputedStyle(content).lineHeight);
		const bufferHeight = lineHeight * 2;  // last two lines 
		if (content.offsetHeight > textbox.offsetHeight) {
			console.log("text was scrolled", content.offsetHeight, textbox.scrollTop, textbox.offsetHeight, bufferHeight);
			const isScrollable = (content.offsetHeight - textbox.scrollTop) > (textbox.offsetHeight + bufferHeight);
			content.classList.toggle('hidden-text', isScrollable);
		}
	});
}); 






// color model 

const modelViewerColor = document.querySelector("model-viewer#color");

document.querySelectorAll('#color-controls button').forEach((button) => {
	button.addEventListener('click', (event) => {
		const colorString = event.target.dataset.color;
		const modelViewer = document.querySelector("#Basílica-de-la-Sagrada-Familía");
		const [material] = modelViewer.model.materials;
		material.pbrMetallicRoughness.setBaseColorFactor(colorString);
	});
});

// annotations 

document.querySelectorAll(".Hotspot").forEach((hotspot) => {
	getHotspotID(hotspot);
});

document.querySelectorAll("circle").forEach((point) => {
	getNavID(point);
});

document.querySelectorAll('.Hotspot').forEach((hotspot) => {
	hotspot.addEventListener('click', () => handleAnnotationClick(hotspot));
});

// textbox events 
document.querySelectorAll('.close').forEach((button) => {
	button.addEventListener('click', () => closeTextBox(button));
});



// dismiss poster once model is loaded 

document.querySelector('#button-load').addEventListener('click',
	function () {
		document.querySelector('#Basílica-de-la-Sagrada-Familía').dismissPoster();
	});

document.querySelector("#Basílica-de-la-Sagrada-Familía").addEventListener("load", function () {
	initVariantSelector();
});


