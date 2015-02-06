/**
 *	@author hanyang
 *  date    2014-11-30
 *  email   513915503@qq.com
 *
 *  @param {Object} slide The operation object
 *  @param {Array} imgs The picture collection
 *  @param {Boolean} link Whether you need a hyperlink
 *  @param {Array} links Hyperlink collection
 *  @param {Number} interval Interval time
 *  @param {String} promptStyle The lower right corner to remind the way
 *  @param {Number} x Core of Timer
 *  @param {Object} slideItems The img tag or a tag collection
 *  @param {Boolean} isPromptTextInit Whether it is the first time
 *  @param {Boolean} isPromptListInit Whether it is the first time
 **/

var Slide = function (config) {
	this.slide = typeof config.target === "string" ? document.querySelector(config.target) : config.target;
	this.imgs = config.imgs;
	this.length = config.imgs.length;
	this.link = config.link;
	this.links = config.links;
	this.interval = config.interval || 3000;
	this.promptStyle = config.promptStyle || "text";
	this.x = 1;
	this.renderer = true;
	this.slideWrap = null;
	this.slideItems = null;
	this.clientWidth = document.documentElement.clientWidth;
	this.timer = null;
	this.isPromptTextInit = true;
	this.isPromptListInit = true;
	this.p = null;
	this.span = null;
};
Slide.prototype = {
	init: function () {
		var i,
			slideWrapHTML = "",
			that = this;

		this.slideWrap = document.createElement("div");

		if (this.link) {
			for (i = 0; i < this.length; i++) {
				slideWrapHTML += "<a href=" + this.links[i] + " data-index=" + i + "><img src=" + this.imgs[i] + " width='100%' />" + "</a>";
			}

			this.slideWrap.innerHTML = slideWrapHTML;
			this.slide.appendChild(this.slideWrap);
			this.slideItems = this.slide.querySelectorAll("a");
		} else {
			for (i = 0; i < this.length; i++) {
				slideWrapHTML += "<img src=" + this.imgs[i] + " data-index=" + i + " />";
			}

			this.slideWrap.innerHTML = slideWrapHTML;
			this.slide.appendChild(this.slideWrap);
			this.slideItems = this.slide.querySelectorAll("img");
		}

		this.slide.children[0].style.width = this.length * this.clientWidth + "px";

		for (i = 0; i < this.length; i++) {
			this.slideItems[i].style.width = this.clientWidth + "px";
			this.slideItems[i].style.left = i * -this.clientWidth + "px";

			if (i === 0) {
				this.slideItems[i].style["-webkit-transform"] = "translate3d(0, 0, 0)";
			} else if (i === 1) {
				this.slideItems[i].style["-webkit-transform"] = "translate3d(" + this.clientWidth + "px, 0, 0)";
			} else {
				this.slideItems[i].style["-webkit-transform"] = "translate3d(" + -this.clientWidth + "px, 0, 0)";
			}

			this.slideItems[i].addEventListener("touchstart", this.touchStart, false);
			this.slideItems[i].addEventListener("touchmove", this.touchMove, false);
			this.slideItems[i].addEventListener("touchend", this.touchEnd, false);
		}

		if (this.promptStyle === "text") {
			this.promptText();
			this.isPromptTextInit = false;
			this.slideWrap.promptStyle = "text";
		} else {
			this.promptList();
			this.isPromptListInit = false;
		}

		this.timer = setInterval(function () {
			that.swipe(that.clientWidth);
		}, this.interval);

		// window.onblur = function () {
		// 	clearInterval(that.timer);
		// };
		// window.onfocus = function () {
		// 	console.log(111);
		// 	clearInterval(that.timer);
		// 	that.timer = setInterval(function () {
		// 		that.swipe(that.clientWidth);
		// 	}, that.interval);
		// };
		
		this.slideWrap.clientWidths = this.clientWidth;
		this.slideWrap.x = this.x;
		window.slide = this;
	},
	swipe: function (distance) {
		if (this.renderer) {
			for (i = 0; i < this.length; i++) {
				this.slideItems[i].style["-webkit-transition"] = "all 0.3s ease";
			}

			this.renderer = false;
		}

		this.slideItems[this.x - 1].style["-webkit-transform"] = "translate3d(" + -distance + "px, 0, 0)";

		if (this.x === this.length) {
			this.slideItems[0].style["-webkit-transition"] = "all 0.3s ease";
			this.slideItems[0].style["-webkit-transform"] = "translate3d(" + (this.clientWidth - distance) + "px, 0, 0)";
		} else {
			this.slideItems[this.x].style["-webkit-transition"] = "all 0.3s ease";
			this.slideItems[this.x].style["-webkit-transform"] = "translate3d(" + (this.clientWidth - distance) + "px, 0, 0)";
		}
		
		if (this.x + 1 > this.length) {
			this.slideItems[1].style["-webkit-transition"] = "none";
			this.slideItems[1].style["-webkit-transform"] = "translate3d(" + this.clientWidth + "px, 0, 0)";
			this.x = 1;
		} else if (this.x + 1 === this.length) {
			this.slideItems[0].style["-webkit-transition"] = "none";
			this.slideItems[0].style["-webkit-transform"] = "translate3d(" + this.clientWidth + "px, 0, 0)";
			this.x++;
		} else {
			this.slideItems[this.x + 1].style["-webkit-transition"] = "none";
			this.slideItems[this.x + 1].style["-webkit-transform"] = "translate3d(" + this.clientWidth + "px, 0, 0)";
			this.x++;
		}

		if (this.promptStyle === "text") {
			this.promptText();
		} else {
			this.promptList();
		}
	},
	promptText: function () {
		// var p,
		// 	span = null;

		if (this.isPromptTextInit) {
			this.p = document.createElement("p");
			this.p.innerHTML = "<span>1</span>/" + this.length;
			this.slide.appendChild(this.p);
			this.span = this.p.querySelector("span");
			this.slideWrap.span = this.span;
		}

		if (this.x > this.length) {
			this.span.innerHTML = 1;
		} else {
			this.span.innerHTML = this.x;
		}
	},
	promptList: function () {
		var i = 0;

		if (this.isPromptListInit) {
			this.p = document.createElement("p");
			this.p.className = "prompt-p";
			this.p.innerHTML = "";

			while (i < this.length) {
				this.p.innerHTML += "<span class='prompt-span'></span>";
				i++;
			}

			this.slide.appendChild(this.p);
			this.span = this.p.querySelectorAll("span");
		}

		if (this.x - 2 < 0) {
			this.span[this.length - 1].className = "prompt-span";
		} else {
			this.span[this.x - 2].className = "prompt-span";
		}

		this.span[this.x - 1].className += " prompt-span-current";
	},
	touchStart: function (e) {
		this.startX = e.touches[0].clientX;
		this.startY = e.touches[0].clientY;
		this.direction = false;
		this.first = true;

		this.nextIndex = + this.getAttribute("data-index") + 1;
		if (this.nextIndex === this.parentNode.children.length) {
			this.nextIndex = 0;
		}

		this.previousIndex = this.getAttribute("data-index") - 1;
		if (this.previousIndex === -1) {
			this.previousIndex = this.parentNode.children.length - 1;
		}
	},
	touchMove: function (e) {
		if (this.first) {
			if (Math.abs(e.touches[0].clientX - this.startX) > 0 && Math.abs(e.touches[0].clientY - this.startY) < 10) {
				this.direction = true;
				this.first = false;
				clearInterval(slide.timer);
			} else {
				this.first = false;
				return false;
			}
		}

		if (this.direction) {
			console.log("左右");
			this.direction = true;
			this.style["-webkit-transition"] = "none";
			this.style["-webkit-transform"] = "translate3d(" + (e.touches[0].clientX - this.startX) + "px, 0, 0)";
			this.parentNode.children[this.nextIndex].style["-webkit-transition"] = "none";
			this.parentNode.children[this.previousIndex].style["-webkit-transition"] = "none";

			if (e.touches[0].clientX - this.startX > 0) {
				this.parentNode.children[this.nextIndex].style["-webkit-transform"] = "translate3d(" + (this.parentNode.clientWidths + (e.touches[0].clientX - this.startX)) + "px, 0, 0)";
				this.parentNode.children[this.previousIndex].style["-webkit-transform"] = "translate3d(" + -(this.parentNode.clientWidths - (e.touches[0].clientX - this.startX)) + "px, 0, 0)";
			} else {
				this.parentNode.children[this.nextIndex].style["-webkit-transform"] = "translate3d(" + (this.parentNode.clientWidths - (this.startX - e.touches[0].clientX)) + "px, 0, 0)";
				this.parentNode.children[this.previousIndex].style["-webkit-transform"] = "translate3d(" + -(this.parentNode.clientWidths + (this.startX - e.touches[0].clientX)) + "px, 0, 0)";
			}

			e.preventDefault();
		}
	},
	touchEnd: function (e) {
		if (this.direction) {
			if (Math.abs(e.changedTouches[0].clientX - this.startX) >= this.parentNode.clientWidths / 2) {
				this.style["-webkit-transition"] = "all 0.3s ease";
				this.style["-webkit-transform"] = e.changedTouches[0].clientX - this.startX > 0 ? "translate3d(" + this.parentNode.clientWidths + "px, 0, 0)" : "translate3d(" + -this.parentNode.clientWidths + "px, 0, 0)";

				if (e.changedTouches[0].clientX - this.startX > 0) {
					this.parentNode.children[this.nextIndex].style["-webkit-transition"] = "none";
					this.parentNode.children[this.nextIndex].style["-webkit-transform"] = "translate3d(" + -this.parentNode.clientWidths + "px, 0, 0)";

					this.parentNode.children[this.previousIndex].style["-webkit-transition"] = "all 0.3s ease";
					this.parentNode.children[this.previousIndex].style["-webkit-transform"] = "translate3d(" + 0 + "px, 0, 0)";
				} else {
					this.parentNode.children[this.nextIndex].style["-webkit-transition"] = "all 0.3s ease";
					this.parentNode.children[this.nextIndex].style["-webkit-transform"] = "translate3d(" + 0 + "px, 0, 0)";

					this.parentNode.children[this.previousIndex].style["-webkit-transform"] = "translate3d(" + -this.parentNode.clientWidths + "px, 0, 0)";

					this.parentNode.children[this.nextIndex + 1 === this.parentNode.children.length ? 0 : this.nextIndex + 1].style["-webkit-transition"] = "none";
					this.parentNode.children[this.nextIndex + 1 === this.parentNode.children.length ? 0 : this.nextIndex + 1].style["-webkit-transform"] = "translate3d(" + this.parentNode.clientWidths + "px, 0, 0)";
				}

				if (slide.promptStyle === "text") {
					if (e.changedTouches[0].clientX - this.startX > 0) {
						slide.span.innerHTML = slide.x = slide.x - 1 === 0 ? slide.length : slide.x - 1;
					} else {
						slide.span.innerHTML = slide.x = slide.x + 1 > slide.length ? 1 : slide.x + 1;
					}
					
				} else {
					if (e.changedTouches[0].clientX - this.startX > 0) {
						slide.x = slide.x - 1 === 0 ? slide.length : slide.x - 1;

						if (slide.x < slide.length) {
							slide.span[slide.x].className = "prompt-span";
						} else {
							slide.span[0].className = "prompt-span";
						}

						slide.span[slide.x - 1].className += " prompt-span-current";
					} else {
						slide.x = slide.x + 1 > slide.length ? 1 : slide.x + 1;

						if (slide.x - 2 < 0) {
							slide.span[slide.length - 1].className = "prompt-span";
						} else {
							slide.span[slide.x - 2].className = "prompt-span";
						}

						slide.span[slide.x - 1].className += " prompt-span-current";
					}
				}
			} else {
				this.style["-webkit-transition"] = "all 0.3s ease";
				this.style["-webkit-transform"] = "translate3d(" + 0 + "px, 0, 0)";

				this.parentNode.children[this.nextIndex].style["-webkit-transition"] = "all 0.3s ease";
				this.parentNode.children[this.nextIndex].style["-webkit-transform"] = "translate3d(" + this.parentNode.clientWidths + "px, 0, 0)";

				this.parentNode.children[this.previousIndex].style["-webkit-transition"] = "all 0.3s ease";
				this.parentNode.children[this.previousIndex].style["-webkit-transform"] = "translate3d(" + -this.parentNode.clientWidths + "px, 0, 0)";
			}

			slide.timer = setInterval(function () {
				slide.swipe(slide.clientWidth);
			}, slide.interval);
		}
	}
};
