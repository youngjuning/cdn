!function() {
	var currClientWidth, fontValue, originWidth;
	originWidth = 640;
	__resize();
	window.addEventListener('resize', __resize, false);
	function __resize() {
		currClientWidth = document.documentElement.clientWidth;
		fontValue = ((100 * currClientWidth) / originWidth).toFixed(2);
		document.documentElement.style.fontSize = fontValue + 'px';
	}
	let slug = HUHUSdk.getUrlParam("s");
	var showPageMenuBtn = document.getElementsByClassName("JS-showPageMenuBtn")[0],
		sidePanel = document.getElementsByClassName("JS-sidePanel")[0],
		sharePageMenuBtn = document.getElementsByClassName("JS-sharePageMenuBtn")[0];


	showPageMenuBtn.addEventListener("click", (function() {
		sidePanel.style.display = "block";
	}));

	sidePanel.addEventListener("click", (function() {
		sidePanel.style.display = "none";
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
	const w = document.getElementById("cate");
	const d = HUHUSdk.searchGames(slug);
	!function(t, n, a) {
		for (var i = 0; i < a; i++) {
			const e = n[i];
			let c = document.createElement("a");
			c.className = "page-list-itemcontainer-item";
			c.href = `game.html?id=${e.id}`;
			c.setAttribute("data-eventCategory","nav_to_category_more"),
			c.setAttribute("data-eventAction",`${e.name}`);
			let u = new Image;
			u.src = HUHUSdk.getImgUrl(e.image);
			u.className = "page-list-itemcontainer-item-icon";
			let g = document.createElement("div");
			g.className = "page-list-itemcontainer-item-center";
			let k = document.createElement("div");
			k.innerText = e.name,
			k.className = "page-list-itemcontainer-item-name";
			let v = document.createElement("div");
			v.className = "page-list-itemcontainer-item-count",
			v.innerText = e.id % 5 + 105 + "K+";
			let p = document.createElement("label");
			p.innerText = "Play";
			let f = document.createElement("div");
			f.className = "page-list-itemcontainer-item-playbtn",
            f.innerText = "Play";

			g.appendChild(k),
			v.appendChild(p),
			g.appendChild(v),
			c.appendChild(u),
			c.appendChild(g),
			c.appendChild(f),
			t.appendChild(c)
		}
	}(w,d, d.length);
}(window)
