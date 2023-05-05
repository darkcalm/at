var Gates = {},
	Lines = {},
	Params = {};
function updateParams() {
	Params = {
		separators: [":", ";", "."]
	};
}
updateParams();
function updateData() {
	Gates = {
		head: ["[]", "。", "↬", "n.", "←", "、", "→", "id", "⊸"],
		body: ['16.', '', 'A', 'method', '', ',', '', '', 'comprising', '', ':', '', '', '', '', '', '', 'transmitting', '', '', '', '', '', ',', '', '', 'via', '', '', 'a', 'lighting control network', '', ',', '', '', '', '', '', 'a', 'normal power active message', '1', '', '', '', 'to', '', '', 'a', 'lighting control group', '', '', '', '', 'repeatedly at', '', '', 'a', 'predetermined time interval', '', '', '', '', '', '', ';', '', '', '', '', '', '', 'tracking', '', '', 'an', 'active message gap time', '2', '', '', '', '', '', ';', '', '', '', '', '', '', 'in response to receiving', '', '', '', '', '', '', 'the', '1', 'from', '', '', 'a', 'member device', '', '', '', '', 'before', '', '', '', '', '', '', 'the tracked', '2', 'exceeds', '', '', 'an', 'active message timeout', '3', ',', '', '', 'resetting', '', '', '', '', '', '', 'the', '2', '', '', ';', '', '', '', '', '', '', 'in response to', '', '', '', '', '', '', 'the tracked', '2', 'exceeding', '', '', '', '', '', '', 'the', '3', '', '', '', '', '', '', ',', '', '', 'entering', '', '', 'an', 'emergency mode (EM) active state', '', '', '', '', 'by controlling', '', '', 'an', 'emergency luminaire light source', '', '', '', '', 'via', '', ',', 'an', 'emergency luminaire driver circuit', '', ',', '', '', 'to continuously emit illumination lighting', '', '.', '', '', '', '', '', '', '']
	};
	Lines = {
		head: ["[]", "...。"],
		body: [[]]
	};
}
updateData();
ceil = document.getElementById('ceil');
views = document.getElementById('views');
function updateGatesByData() {
	gates = newNodeWith("div", ["id", "gates", "class", "overflow"], [newNodeWith("table", [], [newNodeWith("thead", [], [newNodeWith("tr", [], newNodeFor("td", Array.from({
		length: Gates.head.length
	}, (_, col) => ["class", "th c" + col]), [], Gates.head))]), newNodeWith("tbody", [], Array.from({
		length: Gates.body.length / Gates.head.length
	}, (_, row) => newNodeWith("tr", ["class", "gate-tr r" + row], newNodeFor("td", Array.from({
		length: Gates.head.length
	}, (_, col) => ["class", "gate-td c" + col]), Array.from({
		length: Gates.head.length
	}, (_, col) => [newNodeWith("span", ["class", "gate-sp s" + col, "tabindex", row * Gates.head.length + col, "onclick", "locate()", "oninput", "input()", "contenteditable", "", "spandata", ""], null, Gates.body[row * Gates.head.length + col])])))))])]);
	views.appendChild(gates);
}
updateGatesByData();
function updateLinesByGate() {
	links = {
		o: [],
		a: [],
		z: []
	};
	Gates.body.forEach((str, index) => {
		if (index % Gates.head.length === 0 && str !== '') {
			links.o.push(index);
			links.a.push(index + 1);
			links.z.push(index - 1);
		} else if (Params.separators.includes(str)) {
			links.o.push(null);
			links.z.push(index);
			links.a.push(index + 1);
		}
	});
	links.z.push(Gates.body.length - 1);
	links.z.shift();
	lines = newNodeWith("div", ["id", "lines", "class", "overflow"], [newNodeWith("table", [], [newNodeWith("thead", [], [newNodeWith("tr", [], newNodeFor("td", Array.from({
		length: Lines.head.length
	}, (_, col) => ["class", "th c" + col]), [], Lines.head))]),
	//tbody
	newNodeWith("tbody", [], Array.from({
		length: links.z.length
	}, (_, row) => newNodeWith("tr", ["class", "line-tr r" + row], [newNodeWith("td", ["class", "line-td c0"], links.o[row] != null ? [newNodeWith("span", ["class", "line-sp s0", "contenteditable", ""], null, Gates.body[links.o[row]])] : null)].concat([newNodeWith("td", ["class", "line-td"], newNodeFor("span", Array.from({
		length: links.z[row] - links.a[row] + 1
	}, (_, sp) => ["class", "line-sp s" + (links.a[row] + sp) % Gates.head.length, "tabindex", links.a[row] + sp, "onclick", "locate()", "oninput", "input()", "contenteditable", "", "spandata", ""]), null, Gates.body.slice(links.a[row], links.z[row] + 1)))]))))])]);
	views.appendChild(lines);
}
updateLinesByGate();
graphs = newNodeWith("div", ["id", "graphs"], [newNodeWith("div", ["id", "graph-root"])]);
views.appendChild(graphs);
gatesGrip = newNodeWith("div", ["id", "gates-grip", "class", "grip"], [newNodeWith("div", ["class", "gates-gripline gripline"])]);
views.appendChild(gatesGrip);
linesGrip = newNodeWith("div", ["id", "lines-grip", "class", "grip"], [newNodeWith("div", ["class", "lines-gripline gripline"])]);
views.appendChild(linesGrip);

// utility

function newNodeWith(tag, attr = [], append = null, text = null) {
	let e = document.createElement(tag);
	if (text) e.appendChild(document.createTextNode(text));
	for (let i = 0; i < attr.length / 2; i++) e.setAttribute(attr[2 * i], attr[2 * i + 1]);
	if (append) for (let i = 0; i < append.length; i++) if (append[i]) e.appendChild(append[i]);
	return e;
}
function newNodeFor(tag, iterattr = [[]], append = null, itertext = null) {
	let r = [];
	for (i = 0; i < iterattr.length; i++) r.push(newNodeWith(tag, iterattr[i], append ? append[i] : null, itertext ? itertext[i] : null));
	return r;
}

//// DOMs
////
////
//// pointers

V = [{
	coln: 9,
	rows: document.getElementsByClassName("gate-tr"),
	cells: document.getElementsByClassName("gate-td"),
	spans: document.getElementsByClassName("gate-sp")
}, {
	rows: document.getElementsByClassName("line-tr"),
	cells: document.getElementsByClassName("line-td"),
	spans: document.getElementsByClassName("line-sp")
}];
viewi = 0;
spani = 0;
//offset

root = document.documentElement;
gatesEngaged = false;
gatesGrip = document.getElementById('gates-grip');
root.style.setProperty('--l3', `42vw`);
function focus(e) {
	setTimeout(function(e) {
		if (e) e.focus();
	}, 10, e);
}
function gatesEngage(e) {
	e.preventDefault(), gatesEngaged = true;
}
function gatesDisengage(e) {
	gatesEngaged = false;
}
function gatesEngagement(e) {
	if (gatesEngaged && e.clientX < document.body.clientWidth && e.clientX > gatesGrip.clientWidth) root.style.setProperty('--l3', `${e.clientX / document.body.clientWidth * 100}vw`);
}
gatesGrip.addEventListener('mousedown', gatesEngage);
document.addEventListener('mouseup', gatesDisengage);
document.addEventListener('mousemove', gatesEngagement);
linesEngaged = false;
linesGrip = document.getElementById('lines-grip');
root.style.setProperty('--l4', `calc(100vh - var(--l2) - var(--l3))`);
function linesEngage(e) {
	e.preventDefault(), linesEngaged = true;
}
function linesDisengage(e) {
	linesEngaged = false;
}
function linesEngagement(e) {
	if (linesEngaged && e.clientY > ceil.clientHeight + linesGrip.clientHeight && e.clientY < document.body.clientHeight) root.style.setProperty('--l4', `${(views.clientHeight + ceil.clientHeight - e.clientY) / document.body.clientWidth * 100}vw`);
}
linesGrip.addEventListener('mousedown', linesEngage);
document.addEventListener('mouseup', linesDisengage);
document.addEventListener('mousemove', linesEngagement);
resizeTimeout = null;
root.style.setProperty('--l0', `${window.innerHeight}px`);
window.addEventListener('resize', () => {
	if (resizeTimeout) {
		clearTimeout(resizeTimeout);
	}
	resizeTimeout = setTimeout(() => {
		root.style.setProperty('--l0', `${window.innerHeight}px`);
		resizeTimeout = null;
	}, 10);
});
const collapseBtn = document.querySelector('.chat-btn');
const chatContainer = document.querySelector('.chat-container');
collapseBtn.addEventListener('click', () => {
	chatContainer.classList.toggle('collapsed');
});
function locate() {
	const activeElement = document.activeElement;
	let parentNode = activeElement.parentNode;
	while (parentNode && parentNode.tagName !== "BODY") {
		if (parentNode.id === "lines") {
			viewi = 1;
			break;
		} else if (parentNode.id === "gates") {
			viewi = 0;
			break;
		}
		parentNode = parentNode.parentNode;
	}
	spani = Array.from(V[viewi].spans).indexOf(activeElement);
}
function input() {
	here = V[viewi].spans[spani];
	there = V[+(viewi == 0)].spans[spani];
	there.innerText = here.innerText;
	//chain reaction
}

function robin() {
	viewi = +(viewi == 0);
	focus(V[viewi].spans[spani]);
}
function achro() {
	root.classList.toggle('no-colors');
}
achro();
document.addEventListener("keydown", function(event) {
	locate();
	if (spani != -1) {
		let key = event.keyCode;
		if (key >= 37 && key <= 40 && !event.shiftKey) {
			let end = document.activeElement.textContent.length;
			let offset = window.getSelection().getRangeAt(0).startOffset;
			let intended_offset = offset == 0 ? {
				37: 0,
				38: 0,
				39: Math.min(1, end),
				40: end
			} : offset == end ? {
				37: Math.max(end - 1, 0),
				38: 0,
				39: end,
				40: end
			} : {
				37: offset - 1,
				38: 0,
				39: offset + 1,
				40: end
			};
			intended_offset = intended_offset[key];
			if (intended_offset == offset) {
				let span_range = document.activeElement.parentNode.getElementsByTagName("span");
				let span_offset = Array.from(span_range).indexOf(document.activeElement);
				let span_end = span_range.length - 1;
				let intended_span_offset = span_offset == 0 ? {
					37: 0,
					38: 0,
					39: Math.min(1, span_end),
					40: span_end
				} : span_offset == span_end ? {
					37: Math.max(span_end - 1, 0),
					38: 0,
					39: span_end,
					40: span_end
				} : {
					37: span_offset - 1,
					38: 0,
					39: span_offset + 1,
					40: span_end
				};
				intended_span_offset = intended_span_offset[key];
				if (intended_span_offset != span_offset) focus(span_range[intended_span_offset]); else {
					let intended_spani = viewi == 0 ? {
						37: spani - 1,
						38: spani - V[0].coln,
						39: spani + 1,
						40: spani + V[0].coln
					} : {
						37: spani - 1,
						38: spani - 1,
						39: spani + 1,
						40: spani + 1
					};
					intended_spani = intended_spani[key];
					focus(V[viewi].spans[Math.min(Math.max(intended_spani, 0), V[viewi].spans.length - 1)]);
				}
			} else if (viewi == 1) {
				focus(V[viewi].spans[spani]);
			}
		}
	}
});

//// pointers
////
////
//// parsers

blank = [undefined, "", "\n", null, false];
flags = {
	0: {
		"claim": ["^[0-9]*\."]
	},
	1: {
		"claim": [":", ";", "."]
	},
	2: {
		"claim": ["A", "An", "a", "an"]
	},
	5: {
		"claim": [","]
	},
	6: {
		"claim": ["^the(.*)"]
	}
};
renderflags = {
	"nospb": [":", ";", "."],
	"linsp": [";"]
};
function parseClaim() { }

//// parsers
////
////
////
