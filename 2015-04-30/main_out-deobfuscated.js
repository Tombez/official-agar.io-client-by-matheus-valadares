function loadHandler() {
	x = canvas = document.getElementById("canvas");
	d = x.getContext("2d");
	x.onmousedown = function(a) {
		K = a.clientX;
		L = a.clientY;
		M();
		U()
	};
	x.onmousemove = function(a) {
		K = a.clientX;
		L = a.clientY;
		M()
	};
	x.onmouseup = function(a) {};
	window.onkeydown = function(a) {
		32 == a.keyCode && null != g && g.readyState == g.OPEN &&
		(a = new ArrayBuffer(1), (new DataView(a)).setUint8(0, 17), g.send(a))
	};
	N();
	window.onresize = V;
	V();
	window.requestAnimationFrame ? window.requestAnimationFrame(W) : setInterval(O, 1E3 / 60);
	setInterval(U, 100)
}

function ca() {
	for (var a =
			Number.POSITIVE_INFINITY, c = Number.POSITIVE_INFINITY, b = Number.NEGATIVE_INFINITY, f = Number.NEGATIVE_INFINITY, z = 0, e = 0; e < l.length; e++) z = Math.max(l[e].size, z), a = Math.min(l[e].x, a), c = Math.min(l[e].y, c), b = Math.max(l[e].x, b), f = Math.max(l[e].y, f);
	P = QUAD.init({
		minX: a - (z + 100),
		minY: c - (z + 100),
		maxX: b + (z + 100),
		maxY: f + (z + 100)
	});
	for (e = 0; e < l.length; e++)
		for (a = l[e], c = 0; c < a.points.length; ++c) P.insert(a.points[c])
}

function M() {
	F = K + s - q / 2;
	G = L + t - r / 2
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
		cache: !1
	})
}

function da() {
	N()
}

function X(a) {
	C = [];
	h = [];
	u = {};
	l = [];
	A = [];
	w = [];
	console.log("Connecting to " + a);
	g = new WebSocket(a);
	g.binaryType = "arraybuffer";
	g.onopen = ea;
	g.onmessage = fa;
	g.onclose = ga;
	g.onerror = function() {
		console.log("socket error")
	}
}

function ea(a) {
	jQuery("#connecting").hide();
	console.log("socket open");
	a = new ArrayBuffer(5);
	var c = new DataView(a);
	c.setUint8(0, 255);
	c.setUint32(1, 1, !0);
	g.send(a);
	Y()
}

function ga(a) {
	console.log("socket close");
	setTimeout(da, 500)
}

function fa(a) {
	function c() {
		for (var a = "";;) {
			var c = f.getUint16(b, !0);
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
			C.push(f.getUint32(1, !0));
			break;
		case 48:
			for (w = []; b < f.byteLength;) w.push(c());
			ia();
			break;
		case 64:
			Q = f.getFloat64(1, !0), R = f.getFloat64(9, !0), S = f.getFloat64(17, !0), T = f.getFloat64(25, !0), 0 == h.length && (s = (S + Q) / 2, t = (T + R) / 2)
	}
}

function ha(a) {
	B = +new Date;
	for (var c = Math.random(), b = 1, f = a.getUint16(b,
			!0), b = b + 2, d = 0; d < f; ++d) {
		var e = u[a.getUint32(b, !0)],
			k = u[a.getUint32(b + 4, !0)],
			b = b + 8;
		e && k && (-1 != h.indexOf(k) && 1 == h.length && jQuery("#overlays").fadeIn(3E3), k.destroy(), k.ox = k.x, k.oy = k.y, k.oSize = k.size, k.nx = e.x, k.ny = e.y, k.nSize = 1, k.updateTime = B)
	}
	for (;;) {
		f = a.getUint32(b, !0);
		b += 4;
		if (0 == f) break;
		var d = a.getFloat64(b, !0),
			b = b + 8,
			e = a.getFloat64(b, !0),
			b = b + 8,
			k = a.getFloat64(b, !0),
			b = b + 8,
			g = a.getUint8(b++),
			H;
		for (H = "";;) {
			var m = a.getUint16(b, !0),
				b = b + 2;
			if (0 == m) break;
			H += String.fromCharCode(m)
		}
		m = null;
		u.hasOwnProperty(f) ? (m = u[f],
			m.updatePos(), m.ox = m.x, m.oy = m.y, m.oSize = m.size) : m = new Cell(f, d, e, k, g, H);
		m.nx = d;
		m.ny = e;
		m.nSize = k;
		m.updateCode = c;
		m.updateTime = B; - 1 != C.indexOf(f) && -1 == h.indexOf(m) && (document.getElementById("overlays").style.display = "none", h.push(m), 1 == h.length && (s = m.x, t = m.y))
	}
	a.getUint16(b, !0);
	b += 2;
	e = a.getUint32(b, !0);
	b += 4;
	for (d = 0; d < e; d++) f = a.getUint32(b, !0), b += 4, u[f] && (u[f].updateCode = c);
	for (d = 0; d < l.length; d++) l[d].updateCode != c && l[d--].destroy()
}

function U() {
	if (null != g && g.readyState == g.OPEN && ($ != F || aa != G)) {
		$ = F;
		aa = G;
		var a = new ArrayBuffer(21),
			c = new DataView(a);
		c.setUint8(0, 16);
		c.setFloat64(1, F, !0);
		c.setFloat64(9, G, !0);
		c.setUint32(17, 0, !0);
		g.send(a)
	}
}

function Y() {
	if (null != g && g.readyState == g.OPEN && null != D) {
		var a = new ArrayBuffer(1 + 2 * D.length),
			c = new DataView(a);
		c.setUint8(0, 0);
		for (var b = 0; b < D.length; ++b) c.setUint16(1 + 2 * b, D.charCodeAt(b), !0);
		g.send(a)
	}
}

function W() {
	O();
	window.requestAnimationFrame(W)
}

function V() {
	q = window.innerWidth;
	r = window.innerHeight;
	canvas.width = x.width = q;
	canvas.height = x.height = r;
	O()
}

function ja() {
	for (var a = 0, c = 0; c < h.length; c++) a +=
		h[c].size;
	a = Math.pow(Math.min(64 / a, 1), .25) * Math.max(r / 965, q / 1920);
	p = (9 * p + a) / 10
}

function O() {
	var a = +new Date;
	++ka;
	ja();
	B = +new Date;
	ca();
	if (0 < h.length) {
		for (var c = 0, b = 0, f = 0; f < h.length; f++) h[f].updatePos(), c += h[f].x / h.length, b += h[f].y / h.length;
		s = (s + c) / 2;
		t = (t + b) / 2
	}
	M();
	d.clearRect(0, 0, q, r);
	d.fillStyle = "#F2FBFF";
	d.fillRect(0, 0, q, r);
	d.save();
	d.fillStyle = "#000000";
	d.strokeStyle = "#000000";
	d.globalAlpha = .2;
	d.scale(p, p);
	c = q / p;
	b = r / p;
	for (f = -.5 + (-s + c / 2) % 50; f < c; f += 50) d.beginPath(), d.moveTo(f, 0), d.lineTo(f, b), d.stroke();
	for (f = -.5 + (-t + b / 2) % 50; f < b; f += 50) d.beginPath(), d.moveTo(0, f), d.lineTo(c, f), d.stroke();
	d.restore();
	l.sort(function(a, b) {
		return a.size == b.size ? a.id - b.id : a.size - b.size
	});
	d.save();
	d.translate(q / 2, r / 2);
	d.scale(p, p);
	d.translate(-s, -t);
	for (f = 0; f < A.length; f++) A[f].draw();
	for (f = 0; f < l.length; f++) l[f].draw();
	d.restore();
	y && 0 != w.length && d.drawImage(y, q - y.width - 10, 10);
	a = +new Date - a;
	a > 1E3 / 60 ? v -= .01 : a < 1E3 / 65 && (v += .01);
	.4 > v && (v = .4);
	1 < v && (v = 1)
}

function ia() {
	if (0 != w.length) {
		y = document.createElement("canvas");
		var a =
			y.getContext("2d"),
			c = 60 + 24 * w.length;
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
		for (var b = 0; b < w.length; ++b) c = b + 1 + ". " + (w[b] || "An unnamed cell"), a.fillText(c, 100 - a.measureText(c).width / 2, 70 + 24 * b)
	}
}

function Cell(a, c, b, f, d, e) {
	l.push(this);
	u[a] = this;
	this.id = a;
	this.ox = this.x = c;
	this.oy = this.y = b;
	this.oSize = this.size = f;
	if (0 ==
		d) this.isVirus = !0, this.color = "#33FF33";
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
	var canvas, d, x, q, r, P = null,
		g = null,
		s = 0,
		t = 0,
		C = [],
		h = [],
		u = {},
		l = [],
		A = [],
		w = [],
		K = 0,
		L = 0,
		F = -1,
		G = -1,
		ka = 0,
		B = 0,
		D = null,
		Q = 0,
		R = 0,
		S = 1E4,
		T = 1E4,
		p = 1;
	window.setNick = function(a) {
		D = a;
		Y();
		jQuery("#overlays").hide()
	};
	window.connect = X;
	var $ = -1,
		aa = -1,
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
		destroyed: !1,
		isVirus: !1,
		destroy: function() {
			var a;
			for (a = 0; a < l.length; a++)
				if (l[a] == this) {
					l.splice(a, 1);
					break
				} delete u[this.id];
			a = h.indexOf(this); - 1 != a && h.splice(a, 1);
			a = C.indexOf(this.id); - 1 != a && C.splice(a, 1);
			this.destroyed = !0;
			A.push(this)
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
					l = !1,
					m = this,
					n = a[e].x,
					p = a[e].y;
				P.retrieve({
					x: n - 5,
					y: p - 5,
					w: 10,
					h: 10
				}, function(a) {
					a.c != m && 25 > (n - a.x) * (n - a.x) + (p - a.y) * (p - a.y) && (l = !0)
				});
				!l && (a[e].x < Q || a[e].y < R || a[e].x > S || a[e].y > T) && (l = !0);
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
			a = (B - this.updateTime) / 120;
			a = 0 > a ? 0 : 1 < a ? 1 : a;
			a = a * a * (3 - 2 * a);
			var c = this.getNameSize();
			if (this.destroyed &&
				1 <= a) {
				var b = A.indexOf(this); - 1 != b && A.splice(b, 1)
			}
			this.x = a * (this.nx - this.ox) + this.ox;
			this.y = a * (this.ny - this.oy) + this.oy;
			this.size = a * (this.nSize - this.oSize) + this.oSize;
			this.destroyed || c == this.getNameSize() || this.setName(this.name);
			return a
		},
		draw: function() {
			if (!(this.x + this.size + 20 < s - q / 2 / p || this.y + this.size + 20 < t - r / 2 / p || this.x - this.size - 20 > s + q / 2 / p || this.y - this.size - 20 > t + r / 2 / p)) {
				d.save();
				this.drawTime = B;
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
