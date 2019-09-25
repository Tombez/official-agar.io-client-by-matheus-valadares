function loadHandler() {
	canvas = document.getElementById("canvas");
	d = canvas.getContext("2d");
	canvas.onmousedown = function(a) {
		clientX = a.clientX;
		clientY = a.clientY;
		M();
		U()
	};
	canvas.onmousemove = function(a) {
		clientX = a.clientX;
		clientY = a.clientY;
		M()
	};
	canvas.onmouseup = function(a) {};
	window.onkeydown = function(a) {
		32 == a.keyCode && null != socket && socket.readyState == socket.OPEN &&
		(a = new ArrayBuffer(1), (new DataView(a)).setUint8(0, 17), socket.send(a))
	};
	N();
	window.onresize = V;
	V();
	window.requestAnimationFrame ? window.requestAnimationFrame(W) : setInterval(O, 1E3 / 60);
	setInterval(U, 100)
}

function ca() {
	for (var a =
			Number.POSITIVE_INFINITY, c = Number.POSITIVE_INFINITY, b = Number.NEGATIVE_INFINITY, f = Number.NEGATIVE_INFINITY, z = 0, e = 0; e < cells.length; e++) z = Math.max(cells[e].size, z), a = Math.min(cells[e].x, a), c = Math.min(cells[e].y, c), b = Math.max(cells[e].x, b), f = Math.max(cells[e].y, f);
	quadtree = QUAD.init({
		minX: a - (z + 100),
		minY: c - (z + 100),
		maxX: b + (z + 100),
		maxY: f + (z + 100)
	});
	for (e = 0; e < cells.length; e++)
		for (a = cells[e], c = 0; c < a.points.length; ++c) quadtree.insert(a.points[c])
}

function M() {
	mouseMapX = clientX + cameraX - width / 2;
	mouseMapY = clientY + cameraY - height / 2
}

function N() {
	jQuery.ajax("http://m.agar.io/", {
		error: function() {
			setTimeout(N, 1E3)
		},
		success: function(a) {
			a = a.split("\n");
			X("ws://" + a[0])
		},
		dataType: "text",
		method: "GET",
		cache: false
	})
}

function da() {
	N()
}

function X(a) {
	myCellIds = [];
	myCells = [];
	cellsById = {};
	cells = [];
	deadCells = [];
	leaderboardNames = [];
	console.log("Connecting to " + a);
	socket = new WebSocket(a);
	socket.binaryType = "arraybuffer";
	socket.onopen = ea;
	socket.onmessage = fa;
	socket.onclose = ga;
	socket.onerror = function() {
		console.log("socket error")
	}
}

function ea(a) {
	jQuery("#connecting").hide();
	console.log("socket open");
	a = new ArrayBuffer(5);
	var c = new DataView(a);
	c.setUint8(0, 255);
	c.setUint32(1, 1, true);
	socket.send(a);
	Y()
}

function ga(a) {
	console.log("socket close");
	setTimeout(da, 500)
}

function fa(a) {
	function c() {
		for (var a = "";;) {
			var c = f.getUint16(b, true);
			b += 2;
			if (0 == c) break;
			a += String.fromCharCode(c)
		}
		return a
	}
	var b = 1,
		f = new DataView(a.data);
	switch (f.getUint8(0)) {
		case 16:
			ha(f);
			break;
		case 32:
			myCellIds.push(f.getUint32(1, true));
			break;
		case 48:
			for (leaderboardNames = []; b < f.byteLength;) leaderboardNames.push(c());
			ia();
			break;
		case 64:
			mapMinX = f.getFloat64(1, true), mapMinY = f.getFloat64(9, true), mapMaxX = f.getFloat64(17, true), T = f.getFloat64(25, true), 0 == myCells.length && (cameraX = (mapMaxX + mapMinX) / 2, cameraY = (T + mapMinY) / 2)
	}
}

function ha(a) {
	tickTime = +new Date;
	for (var c = Math.random(), b = 1, f = a.getUint16(b,
			true), b = b + 2, d = 0; d < f; ++d) {
		var e = cellsById[a.getUint32(b, true)],
			k = cellsById[a.getUint32(b + 4, true)],
			b = b + 8;
		e && k && (-1 != myCells.indexOf(k) && 1 == myCells.length && jQuery("#overlays").fadeIn(3E3), k.destroy(), k.ox = k.x, k.oy = k.y, k.oSize = k.size, k.nx = e.x, k.ny = e.y, k.nSize = 1, k.updateTime = tickTime)
	}
	for (;;) {
		f = a.getUint32(b, true);
		b += 4;
		if (0 == f) break;
		var d = a.getFloat64(b, true),
			b = b + 8,
			e = a.getFloat64(b, true),
			b = b + 8,
			k = a.getFloat64(b, true),
			b = b + 8,
			g = a.getUint8(b++),
			H;
		for (H = "";;) {
			var m = a.getUint16(b, true),
				b = b + 2;
			if (0 == m) break;
			H += String.fromCharCode(m)
		}
		m = null;
		cellsById.hasOwnProperty(f) ? (m = cellsById[f],
			m.updatePos(), m.ox = m.x, m.oy = m.y, m.oSize = m.size) : m = new Cell(f, d, e, k, g, H);
		m.nx = d;
		m.ny = e;
		m.nSize = k;
		m.updateCode = c;
		m.updateTime = tickTime; - 1 != myCellIds.indexOf(f) && -1 == myCells.indexOf(m) && (document.getElementById("overlays").style.display = "none", myCells.push(m), 1 == myCells.length && (cameraX = m.x, cameraY = m.y))
	}
	a.getUint16(b, true);
	b += 2;
	e = a.getUint32(b, true);
	b += 4;
	for (d = 0; d < e; d++) f = a.getUint32(b, true), b += 4, cellsById[f] && (cellsById[f].updateCode = c);
	for (d = 0; d < cells.length; d++) cells[d].updateCode != c && cells[d--].destroy()
}

function U() {
	if (null != socket && socket.readyState == socket.OPEN && (mouseSentX != mouseMapX || mouseSentY != mouseMapY)) {
		mouseSentX = mouseMapX;
		mouseSentY = mouseMapY;
		var a = new ArrayBuffer(21),
			c = new DataView(a);
		c.setUint8(0, 16);
		c.setFloat64(1, mouseMapX, true);
		c.setFloat64(9, mouseMapY, true);
		c.setUint32(17, 0, true);
		socket.send(a)
	}
}

function Y() {
	if (null != socket && socket.readyState == socket.OPEN && null != nick) {
		var a = new ArrayBuffer(1 + 2 * nick.length),
			c = new DataView(a);
		c.setUint8(0, 0);
		for (var b = 0; b < nick.length; ++b) c.setUint16(1 + 2 * b, nick.charCodeAt(b), true);
		socket.send(a)
	}
}

function W() {
	O();
	window.requestAnimationFrame(W)
}

function V() {
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
	O()
}

function ja() {
	for (var a = 0, c = 0; c < myCells.length; c++) a +=
		myCells[c].size;
	a = Math.pow(Math.min(64 / a, 1), .25) * Math.max(height / 965, width / 1920);
	p = (9 * p + a) / 10
}

function O() {
	var a = +new Date;
	++ka;
	ja();
	tickTime = +new Date;
	ca();
	if (0 < myCells.length) {
		for (var c = 0, b = 0, f = 0; f < myCells.length; f++) myCells[f].updatePos(), c += myCells[f].x / myCells.length, b += myCells[f].y / myCells.length;
		cameraX = (cameraX + c) / 2;
		cameraY = (cameraY + b) / 2
	}
	M();
	d.clearRect(0, 0, width, height);
	d.fillStyle = "#F2FBFF";
	d.fillRect(0, 0, width, height);
	d.save();
	d.fillStyle = "#000000";
	d.strokeStyle = "#000000";
	d.globalAlpha = .2;
	d.scale(p, p);
	c = width / p;
	b = height / p;
	for (f = -.5 + (-cameraX + c / 2) % 50; f < c; f += 50) d.beginPath(), d.moveTo(f, 0), d.lineTo(f, b), d.stroke();
	for (f = -.5 + (-cameraY + b / 2) % 50; f < b; f += 50) d.beginPath(), d.moveTo(0, f), d.lineTo(c, f), d.stroke();
	d.restore();
	cells.sort(function(a, b) {
		return a.size == b.size ? a.id - b.id : a.size - b.size
	});
	d.save();
	d.translate(width / 2, height / 2);
	d.scale(p, p);
	d.translate(-cameraX, -cameraY);
	for (f = 0; f < deadCells.length; f++) deadCells[f].draw();
	for (f = 0; f < cells.length; f++) cells[f].draw();
	d.restore();
	y && 0 != leaderboardNames.length && d.drawImage(y, width - y.width - 10, 10);
	a = +new Date - a;
	a > 1E3 / 60 ? v -= .01 : a < 1E3 / 65 && (v += .01);
	.4 > v && (v = .4);
	1 < v && (v = 1)
}

function ia() {
	if (0 != leaderboardNames.length) {
		y = document.createElement("canvas");
		var a =
			y.getContext("2d"),
			c = 60 + 24 * leaderboardNames.length;
		y.width = 200;
		y.height = c;
		a.globalAlpha = .4;
		a.fillStyle = "#000000";
		a.fillRect(0, 0, 200, c);
		a.globalAlpha = 1;
		a.fillStyle = "#FFFFFF";
		c = null;
		c = "Scoreboard";
		a.font = "30px Ubuntu";
		a.fillText(c, 100 - a.measureText(c).width / 2, 40);
		a.font = "20px Ubuntu";
		for (var b = 0; b < leaderboardNames.length; ++b) c = b + 1 + ". " + (leaderboardNames[b] || "An unnamed cell"), a.fillText(c, 100 - a.measureText(c).width / 2, 70 + 24 * b)
	}
}

function Cell(a, c, b, f, d, e) {
	cells.push(this);
	cellsById[a] = this;
	this.id = a;
	this.ox = this.x = c;
	this.oy = this.y = b;
	this.oSize = this.size = f;
	if (0 ==
		d) this.isVirus = true, this.color = "#33FF33";
	else {
		a = 63487 | d << 16;
		b = (a >> 16 & 255) / 255 * 360;
		d = (a >> 8 & 255) / 255;
		a = (a >> 0 & 255) / 255;
		if (0 == d) a = a << 16 | a << 8 | a << 0;
		else {
			b /= 60;
			c = ~~b;
			var k = b - c;
			b = a * (1 - d);
			f = a * (1 - d * k);
			d = a * (1 - d * (1 - k));
			var g = k = 0,
				h = 0;
			switch (c % 6) {
				case 0:
					k = a;
					g = d;
					h = b;
					break;
				case 1:
					k = f;
					g = a;
					h = b;
					break;
				case 2:
					k = b;
					g = a;
					h = d;
					break;
				case 3:
					k = b;
					g = f;
					h = a;
					break;
				case 4:
					k = d;
					g = b;
					h = a;
					break;
				case 5:
					k = a, g = b, h = f
			}
			a = (~~(255 * k) & 255) << 16 | (~~(255 * g) & 255) << 8 | ~~(255 * h) & 255
		}
		for (a = a.toString(16); 6 > a.length;) a = "0" + a;
		this.color = "#" + a
	}
	this.points = [];
	this.pointsAcc = [];
	this.createPoints();
	this.setName(e)
}
if ("agar.io" != window.location.hostname && "localhost" != window.location.hostname) window.location = "http://agar.io/";
else {
	var canvas, d, width, height, quadtree = null,
		socket = null,
		cameraX = 0,
		cameraY = 0,
		myCellIds = [],
		myCells = [],
		cellsById = {},
		cells = [],
		deadCells = [],
		leaderboardNames = [],
		clientX = 0,
		clientY = 0,
		mouseMapX = -1,
		mouseMapY = -1,
		ka = 0,
		tickTime = 0,
		nick = null,
		mapMinX = 0,
		mapMinY = 0,
		mapMaxX = 1E4,
		T = 1E4,
		p = 1;
	window.setNick = function(a) {
		nick = a;
		Y();
		jQuery("#overlays").hide()
	};
	window.connect = X;
	var mouseSentX = -1,
		mouseSentY = -1,
		y = null,
		v = 1,
		I = {};
	Cell.prototype = {
		id: 0,
		points: null,
		pointsAcc: null,
		name: null,
		cachedName: null,
		x: 0,
		y: 0,
		size: 0,
		ox: 0,
		oy: 0,
		oSize: 0,
		nx: 0,
		ny: 0,
		nSize: 0,
		updateTime: 0,
		updateCode: 0,
		drawTime: 0,
		destroyed: false,
		isVirus: false,
		destroy: function() {
			var a;
			for (a = 0; a < cells.length; a++)
				if (cells[a] == this) {
					cells.splice(a, 1);
					break
				} delete cellsById[this.id];
			a = myCells.indexOf(this); - 1 != a && myCells.splice(a, 1);
			a = myCellIds.indexOf(this.id); - 1 != a && myCellIds.splice(a, 1);
			this.destroyed = true;
			deadCells.push(this)
		},
		getNameSize: function() {
			return Math.max(~~(.3 * this.size), 24)
		},
		setName: function(a) {
			if (this.name = a) {
				var c = document.createElement("canvas"),
					b = c.getContext("2d"),
					d = this.getNameSize(),
					g = d - 2 + "px Ubuntu";
				b.font = g;
				var e = b.measureText(a).width;
				c.width =
					e + 6;
				c.height = d + 10;
				b.font = g;
				b.globalAlpha = 1;
				b.lineWidth = 3;
				b.strokeStyle = "#000000";
				b.fillStyle = "#FFFFFF";
				b.strokeText(a, 3, d - 5);
				b.fillText(a, 3, d - 5);
				this.cachedName = c
			}
		},
		createPoints: function() {
			for (var a = this.getNumPoints(); this.points.length > a;) this.points.splice(~~(Math.random() * this.points.length), 1);
			0 == this.points.length && 0 < a && (this.points.push({
				c: this,
				v: this.size,
				x: this.x,
				y: this.y
			}), this.pointsAcc.push(Math.random() - .5));
			for (; this.points.length < a;) {
				var c = ~~(Math.random() * this.points.length),
					b = this.points[c];
				this.points.splice(c, 0, {
					c: this,
					v: b.v,
					x: b.x,
					y: b.y
				});
				this.pointsAcc.splice(c, 0, this.pointsAcc[c])
			}
		},
		getNumPoints: function() {
			return ~~Math.max(this.size * p * v, this.isVirus ? 10 : 5)
		},
		movePoints: function() {
			this.createPoints();
			for (var a = this.points, c = this.pointsAcc, b = c.concat(), d = a.concat(), g = d.length, e = 0; e < g; ++e) {
				var k = b[(e - 1 + g) % g],
					h = b[(e + 1) % g];
				c[e] += Math.random() - .5;
				c[e] *= .7;
				10 < c[e] && (c[e] = 10); - 10 > c[e] && (c[e] = -10);
				c[e] = (k + h + 8 * c[e]) / 10
			}
			for (e = 0; e < g; ++e) {
				var b = d[e].v,
					k = d[(e - 1 + g) % g].v,
					h = d[(e + 1) % g].v,
					l = false,
					m = this,
					n = a[e].x,
					p = a[e].y;
				quadtree.retrieve({
					x: n - 5,
					y: p - 5,
					w: 10,
					h: 10
				}, function(a) {
					a.c != m && 25 > (n - a.x) * (n - a.x) + (p - a.y) * (p - a.y) && (l = true)
				});
				!l && (a[e].x < mapMinX || a[e].y < mapMinY || a[e].x > mapMaxX || a[e].y > T) && (l = true);
				l && (0 < c[e] && (c[e] = 0), c[e] -= 1);
				b += c[e];
				0 > b && (b = 0);
				b = (9 * b + this.size) / 10;
				a[e].v = (k + h + 8 * b) / 10;
				k = 2 * Math.PI / g;
				h = this.points[e].v;
				this.isVirus && 0 == e % 2 && (h += 5);
				a[e].x = this.x + Math.cos(k * e) * h;
				a[e].y = this.y + Math.sin(k * e) * h
			}
		},
		updatePos: function() {
			var a;
			a = (tickTime - this.updateTime) / 120;
			a = 0 > a ? 0 : 1 < a ? 1 : a;
			a = a * a * (3 - 2 * a);
			var c = this.getNameSize();
			if (this.destroyed &&
				1 <= a) {
				var b = deadCells.indexOf(this); - 1 != b && deadCells.splice(b, 1)
			}
			this.x = a * (this.nx - this.ox) + this.ox;
			this.y = a * (this.ny - this.oy) + this.oy;
			this.size = a * (this.nSize - this.oSize) + this.oSize;
			this.destroyed || c == this.getNameSize() || this.setName(this.name);
			return a
		},
		draw: function() {
			if (!(this.x + this.size + 20 < cameraX - width / 2 / p || this.y + this.size + 20 < cameraY - height / 2 / p || this.x - this.size - 20 > cameraX + width / 2 / p || this.y - this.size - 20 > cameraY + height / 2 / p)) {
				d.save();
				this.drawTime = tickTime;
				var a = this.updatePos();
				this.destroyed && (d.globalAlpha *= 1 - a);
				this.movePoints();
				d.fillStyle = this.color;
				d.strokeStyle = this.color;
				d.beginPath();
				d.lineWidth = 10;
				d.lineCap = "round";
				d.lineJoin = this.isVirus ? "mitter" : "round";
				for (var a = this.getNumPoints(), c = 0; c <= a; ++c) {
					var b = c % a;
					0 == c ? d.moveTo(this.points[b].x, this.points[b].y) : d.lineTo(this.points[b].x, this.points[b].y)
				}
				d.closePath();
				a = this.name;
				a = a.toLowerCase(); - 1 != "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;north korea;south korea;japan".split(";").indexOf(a) ? (I.hasOwnProperty(a) || (I[a] = new Image, I[a].src = "skins/" +
					a + ".png"), a = I[a]) : a = null;
				d.stroke();
				null != a && 0 < a.width ? (d.save(), d.clip(), d.drawImage(a, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size), d.restore()) : d.fill();
				15 < this.size && (d.strokeStyle = "#000000", d.globalAlpha *= .1, d.stroke());
				this.name && this.cachedName && (d.globalAlpha = 1, d.drawImage(this.cachedName, ~~this.x - ~~(this.cachedName.width / 2), ~~this.y - ~~(this.cachedName.height / 2)));
				d.restore()
			}
		}
	};
	window.onload = loadHandler;
}
