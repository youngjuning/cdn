!function(tt) {
	var currClientWidth, fontValue, originWidth;
	originWidth = 640;
	__resize();
	window.addEventListener('resize', __resize, false);
	function __resize() {
		currClientWidth = document.documentElement.clientWidth;
		fontValue = ((100 * currClientWidth) / originWidth).toFixed(2);
		document.documentElement.style.fontSize = fontValue + 'px';
	}
	var showPageMenuBtn = document.getElementsByClassName("JS-showPageMenuBtn")[0],
		sidePanel = document.getElementsByClassName("JS-sidePanel")[0],
		sharePageMenuBtn = document.getElementsByClassName("JS-sharePageMenuBtn")[0],
		closeSearchBtn = document.getElementById("close-search-btn"),
		search = document.getElementById('search');


	showPageMenuBtn.addEventListener("click", (function() {
		sidePanel.style.display = "block";
	}));

	sidePanel.addEventListener("click", (function() {
		sidePanel.style.display = "none";
	}));

	sharePageMenuBtn.addEventListener("click", (function() {
		search.style.display = "block";
	}));

	closeSearchBtn.addEventListener("click", (function() {
		search.style.display = "none";
	}));

	const cates = HUHUSdk.getCategory();

	var u = document.getElementById("menu")
	  , v = document.createElement("a");
	v.className = "ui-sidepanel-content-catelist-item",
	v.innerText = "Home",
	v.href = "index.html",
	v.setAttribute("data-eventCategory","nav_to_category"),
	v.setAttribute("data-eventAction","/"),
	u.appendChild(v);
	for (let e = 0; e < Object.keys(cates).length; e++) {
		var p = document.createElement("a");
		p.className = "ui-sidepanel-content-catelist-item",
		p.innerText = Object.keys(cates)[e],
		p.href = `category.html?tag=${Object.keys(cates)[e]}`,
		p.setAttribute("data-eventCategory","nav_to_category"),
		p.setAttribute("data-eventAction",`${Object.keys(cates)[e]}`),
		u.appendChild(p)
	}
	var g = document.getElementById("first");
	var glist = document.getElementById("first-game-list");
	!function(e,l, t, n) {
		var b = document.createElement("label");
		b.innerText = Object.keys(cates)[0] + " Games";
		var c = document.createElement("a");
		c.className = "page-home-catepanel-title-more";
		c.href = `category.html?tag=${Object.keys(cates)[0]}`;
		c.setAttribute("data-eventCategory","nav_to_category_more"),
		c.setAttribute("data-eventAction",`${Object.keys(cates)[0]}`),
		c.innerText = "More";
		e.appendChild(b),
		e.appendChild(c);
		for (var m = 0; m < t.length; m++) {
			const a = t[m];
			var s = document.createElement("a");
			s.className = "page-home-catepanel-poplist-item";
			s.setAttribute("data-eventcategory","nav_to_game");
			s.setAttribute("data-eventAction",n[a].name);
			s.href = `game.html?id=${n[a].id}`;
			var u = new Image;
			u.src = HUHUSdk.getImgUrl(n[a].image);
			u.className = "page-home-catepanel-poplist-item-icon";
			var g = document.createElement("div");
			g.innerText = n[a].name,
			g.className = "page-home-catepanel-poplist-item-name";
			var v = document.createElement("div");
			v.className = "page-home-catepanel-poplist-item-count",
			v.innerText = n[a].id % 5 + 105 + "K+";
			var p = document.createElement("label");
			p.innerText = "Play";

			s.appendChild(u),
			s.appendChild(g),
			v.appendChild(p),
			s.appendChild(v),
			l.appendChild(s)
		}
	}(g,glist,HUHUSdk.getRandomData(cates.Shooting.length, 2), cates.Shooting);
	const f = document.getElementsByClassName("second");
	const k = document.getElementsByClassName("second-game-list");
	var E = 0;
	for (let e = 1; e < f.length + 1; e++) {
		var key = Object.keys(cates)[e];
		var b = document.createElement("label");
		b.innerText = Object.keys(cates)[e] + " Games";
		var c = document.createElement("a");
		c.className = "page-home-catepanel-title-more";
		c.href = `category.html?tag=${Object.keys(cates)[e]}`;
		c.setAttribute("data-eventCategory","nav_to_category_more"),
		c.setAttribute("data-eventAction",`${Object.keys(cates)[e]}`),
		c.innerText = "More";
		f[E].appendChild(b),
		f[E].appendChild(c);
		if(cates[key].length >= 6) {
			I(k[E], HUHUSdk.getRandomData(cates[key].length, 6), cates[key])
		} else {
			I(k[E], HUHUSdk.getRandomData(cates[key].length, 3), cates[key])
		}
		E++;
	}
	function I(e, t, n) {
		for (var m = 0; m < t.length; m++) {
			const a = t[m];
			var s = document.createElement("a");
			s.className = "page-home-catepanel-list-item";
			s.setAttribute("data-eventcategory","nav_to_game");
			s.setAttribute("data-eventAction",n[a].name);
			s.href = `game.html?id=${n[a].id}`;
			var u = new Image;
			u.src = HUHUSdk.getImgUrl(n[a].image);
			u.className = "page-home-catepanel-list-item-icon";
			var g = document.createElement("div");
			g.innerText = n[a].name,
			g.className = "page-home-catepanel-list-item-name";
			var v = document.createElement("div");
			v.className = "page-home-catepanel-list-item-count",
			v.innerText = n[a].id % 5 + 105 + "K+";
			var p = document.createElement("label");
			p.innerText = "Play";

			s.appendChild(u),
			s.appendChild(g),
			v.appendChild(p),
			s.appendChild(v),
			e.appendChild(s)
		}
	}

	tt.gSearch = function(){
		let _search = document.getElementById('search-input');
		if(_search){
			window.location.href = "search.html?s="+_search.value;
		}
	}

}(window)
