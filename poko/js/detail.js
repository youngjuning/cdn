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
	let id = HUHUSdk.getUrlParam("id");
	var game = HUHUSdk.getGameById(id);
	var head_title = document.getElementsByClassName('page-head-title')[0];
	head_title.innerText = game.name;
	document.title = game.name;

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
	let tag = HUHUSdk.getUrlParam("tag");
	var u = document.getElementById("menu"),
	v = document.createElement("a");
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
	let w = document.getElementById("game_content");
	let c = document.createElement("a");
	c.className = "page-game-detail";
	c.href = `play.html?id=${game.id}&tag=${tag}`;
	c.setAttribute("data-eventCategory","nav_to_play"),
	c.setAttribute("data-eventAction",`${game.name}`);
	let u1 = new Image;
	u1.src = HUHUSdk.getImgUrl(game.image);
	u1.className = "page-game-detail-icon";
	let g = document.createElement("div");
	g.className = "page-game-detail-right";
	let k = document.createElement("div");
	k.innerText = game.name,
	k.className = "page-game-detail-right-name";
	let review = document.createElement("div");
	review.className = "page-game-detail-right-review";
	let stars = document.createElement("div");
	stars.className = "page-game-detail-right-stars";
	let score = document.createElement("div");
	score.className = "page-game-detail-right-stars-score";
	score.style.width = "93.8%";
	let right_score = document.createElement("div");
	right_score.className = "page-game-detail-right-score";
	right_score.innerText = "4.7";
	let count = document.createElement("div");
	count.className = "page-game-detail-right-count";
	count.innerText = game.id % 5 + 105 + "K+";
	let p1 = document.createElement("label");
	p1.innerText = "Play";

	count.appendChild(p1),
	stars.appendChild(score),
	review.appendChild(stars),
	review.appendChild(right_score),
	g.appendChild(k),
	g.appendChild(review),
	g.appendChild(count),
	c.appendChild(u1),
	c.appendChild(g),
	w.appendChild(c);


	let play_btn = document.getElementById("play_btn");
	let playa = document.createElement("a");
	playa.className = "page-game-preview-foot-playbtn";
	playa.href = `play.html?id=${game.id}`;
	playa.setAttribute("data-eventCategory","nav_to_play"),
	playa.setAttribute("data-eventvalue",`${game.id}`),
	playa.setAttribute("data-eventAction",`${game.name}`),
	playa.innerText = "PLAY";
	play_btn.appendChild(playa);

	let game_desc = document.getElementById("game-desc");
	game_desc.innerText = game.description;

	let w1 = document.getElementById("like");
	!function(t, n, a) {
		for (var i = 0; i < n.length; i++) {
			const e = HUHUSdk.list[n[i]];
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
	}(w1,HUHUSdk.getRandomData(HUHUSdk.list.length, 3), HUHUSdk.list.length);
}(window)
