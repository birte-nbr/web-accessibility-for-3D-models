// define model (low and high detail)
let models = [
	{name: "very detailed (14MB)", filename: "models/sagrada-familia.glb", poster: "models/cathedral.webp"},
	{name: "less detailed (2MB)", filename: "models/sagrada-familia.glb", poster: "models/cathedral.webp"}
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
function initModelSelector(){
	const parentElement = document.getElementById("model-chooser")
	models.map(function(model){
		const template = document.getElementById("model-select").content;
		const input = template.querySelector("input")
		input.id = model.name;
		input.value = model.name;
		
		const label = template.querySelector("label")
		label.setAttribute("for", model.name);
		label.innerText = model.name;

		return template.cloneNode(true);
	}).forEach(function(element){
		parentElement.appendChild(element)
	});
}

const defaultVariantChooserContent = document.getElementById("variant-chooser").innerHTML

function initVariantSelector(){
	const parentElement = document.getElementById("variant-chooser")
	parentElement.innerHTML = defaultVariantChooserContent;
//	console.log(document.querySelector("#model-auto-mit-artefakten-texturiert"))
	const viewer = document.querySelector("#Basílica-de-la-Sagrada-Familía")
	viewer.availableVariants.map(function(variant){
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
	}).forEach(function(element){
		parentElement.appendChild(element)
	});
}
function resizeModel(){
    var new_height = document.getElementById("model-size").value;
    var new_width = new_height * 1.5;
    document.getElementById("Basílica-de-la-Sagrada-Familía").style.width = new_width + "px";
    document.getElementById("Basílica-de-la-Sagrada-Familía").style.height = new_height + "px";
}

async function zoomModel(){
    var slider = document.getElementById("model-zoom");
    var zoom = parseInt(slider.getAttribute("max")) - slider.value + parseInt(slider.getAttribute("min"));

    console.log("zoom to " + zoom + "%");            
    
    var old_camera_orbit = document.getElementById("Basílica-de-la-Sagrada-Familía").getAttribute("camera-orbit");
    var old_camera_orbit_array = old_camera_orbit.split(" ");
    var new_camera_orbit = old_camera_orbit_array[0] + " " + old_camera_orbit_array[1] + " " + zoom + "%";
    document.getElementById("Basílica-de-la-Sagrada-Familía").setAttribute("camera-orbit", new_camera_orbit);

    await reloadModel();
}

async function setAutoRotateModel(){
    if(document.querySelector('#auto-rotate').checked){
        console.log("auto-rotate on");
        document.getElementById("Basílica-de-la-Sagrada-Familía").setAttribute("auto-rotate", "on");
    }else{
        console.log("auto-rotate off");
        document.getElementById("Basílica-de-la-Sagrada-Familía").removeAttribute("auto-rotate");
    }

    await reloadModel();                
}

async function setRotateSpeedOfModel(){
    var new_rotate_speed = document.getElementById("model-rotate-speed").value;
    console.log("set rotate speed to " + new_rotate_speed + "%");
    document.getElementById("Basílica-de-la-Sagrada-Familía").setAttribute("rotation-per-second", new_rotate_speed + "%");

    await reloadModel();                
}


async function switchModelExample(){
	for (const model of models) {
    	if(document.querySelector('input[name="switch-model"]:checked').value == model.name) {
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

async function switchVariantExample(){
	for (const variant of document.querySelector("#Basílica-de-la-Sagrada-Familía").availableVariants) {
    	if(document.querySelector('input[name="switch-variant"]:checked').value == variant) {
	        console.log("switch variant to " + variant);
			document.querySelector('#Basílica-de-la-Sagrada-Familía').variantName = variant
		}
	}

    await reloadModel();                
}

async function setOrbitSensitivityForModel(){
    var new_orbit_sensitivity = document.getElementById("model-orbit-sensitivity").value;
    console.log("set orbit sensitivity to " + new_orbit_sensitivity);
    document.getElementById("Basílica-de-la-Sagrada-Familía").setAttribute("orbit-sensitivity", new_orbit_sensitivity);
    await reloadModel();                
}    

function setShowAnnotations(){
	var display_state;
	if(document.getElementById("show-annotations").checked){
		display_state = "block";
	}else{
		display_state = "none";
	}
	console.log("setting annotation display to " + display_state);
	document.querySelectorAll(".Hotspot").forEach(function(x) {
		x.style.display = display_state;
	});
}

async function reloadModel(){                
    var model_element = document.getElementById("model-container");
    await model_element.updateComplete;
	setShowAnnotations();
}
// here is the code for the dimension lines 
// this code currently doesn't work but it is also not interfering with anything so 
/*
function showDimensionLines() {
	var model_element = document.getElementById("model-container");
	

	model_element.addEventListener('loaded', () => {
		const dimLines = modelViewer.querySelectorAll('line.dimensionLine');
		
		// dimLines.setAttribute('x1', 'newX1');
		// svgLine.setAttribute('y1', 'newY1');
		// svgLine.setAttribute('x2', 'newX2');
		// svgLine.setAttribute('y2', 'newY2');
	  });


	  const renderSVG = () => {
		// Retrieve positions of dots
		const start_point = model_element.queryHotspot('hotspot-dot-X+Y-Z');
		const middle_point = model_element.queryHotspot('hotspot-dot-X-Y-Z');
		const end_point = model_element.queryHotspot('hotspot-dim-X-Z');
	
		// Calculate coordinates for the lines based on dot positions
		const line1 = document.getElementById('line1');
		line1.setAttribute('x1', start_point.x);
		line1.setAttribute('y1', start_point.y);
		line1.setAttribute('x2', middle_point.x);
		line1.setAttribute('y2', middle_point.y);
	
		const line2 = document.getElementById('line2');
		line2.setAttribute('x1', middle_point.x);
		line2.setAttribute('y1', middle_point.y);
		line2.setAttribute('x2', end_point.x);
		line2.setAttribute('y2', end_point.y);
	
		const line3 = document.getElementById('line3');
		line3.setAttribute('x1', end_point.x);
		line3.setAttribute('y1', end_point.y);
		line3.setAttribute('x2', start_point.x);
		line3.setAttribute('y2', start_point.y);
	};
	
	// Call renderSVG function
	renderSVG();
} */
// add functionality to annotations
// to be added yet: line to textbox (maybe), connection to sidebar is missing 
// can be written more effiently for sure! maybe put this all in a function as well
//function showTextBox(){

// retrieves the id from clicked dot
function getHotspotID(hotspot){
	hotspot.addEventListener('click', function() {
		
		console.log('annotation clicked!');
		hotspot.classList.add('-visited');
		let annotationID = hotspot.getAttribute("slot"); // equals to hotspot-1
		//console.log(annotationID);
		
		let id = annotationID.split('-');   // only get number
		annotationID = id[1];
		showTextBox(annotationID);
	});
}

function getNavID(dot){
	dot.addEventListener('click', function() {
		
		console.log('nav clicked!');
		dot.classList.add('-visited');
		let annotationID = dot.getAttribute("id"); // equals to nav-1
		//console.log(annotationID);
		
		let id = annotationID.split('-');   // only get number
		annotationID = id[1];
		showTextBox(annotationID);
	});
}

	
document.querySelectorAll(".Hotspot").forEach(function(hotspot) {
	getHotspotID(hotspot);
});

document.querySelectorAll(".navigation-point").forEach(function(point){
	getNavID(point);
});

// needs altering with closing logic bc rn two or more boxes can show up
function showTextBox(id){
	let textbox = document.getElementById("textbox-"+id);
	textbox.style.display = (textbox.style.display === 'block') ? 'none' : 'block'; 
	// close 
	let closeButton = document.getElementById("cl-"+id);
	closeButton.addEventListener('click', function() {
	textbox.style.display = 'none';
	});
}






// dismiss poster once model is loaded 

document.querySelector('#button-load').addEventListener('click',
    function(){
		document.querySelector('#Basílica-de-la-Sagrada-Familía').dismissPoster();
	});

document.querySelector("#Basílica-de-la-Sagrada-Familía").addEventListener("load", function () {
	initVariantSelector();
});


