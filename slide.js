/**
 *  author   hanyang
 *  date     2014-11-30
 *  email    513915503@qq.com
 **/

(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		define(factory);
	} else if (typeof exports === "object") {
		module.exports = factory;
	} else {
		root.Slide = factory(root);
	}
})(this, function(root) {
	"use strict";

	var Slide = function(config) {
		this.slide = typeof config.target === "string" ? document.querySelector(config.target) : config.target;
		this.imgs = config.imgs;
		this.length = config.imgs.length;
		this.contents = config.contents;
		this.interval = config.interval || 3000;
		this.promptStyle = config.promptStyle || "text";
		this.x = 1;
		this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
		this.isPromptText = true;
		this.isPromptList = true;
	};

	Slide.prototype = {
		init: function() {
			var i,
				slideListHTML = "",
				that = this;

			// this.slideList 是幻灯片列表的父元素
			this.slideList = document.createElement("div");

			if (this.contents) {
				for (i = 0; i < this.length; i++) {
					slideListHTML += "<a href=" + this.contents[i] + " data-index=" + i + "><img src=" + this.imgs[i] + " width='100%' />" + "</a>";
				}

				this.slideList.innerHTML = slideListHTML;
				this.slide.appendChild(this.slideList);

				// this.slideItems 是 幻灯片列表的个体
				this.slideItems = this.slide.querySelectorAll("a");
			} else {
				for (i = 0; i < this.length; i++) {
					slideListHTML += "<img src=" + this.imgs[i] + " data-index=" + i + " />";
				}

				this.slideList.innerHTML = slideListHTML;
				this.slide.appendChild(this.slideList);
				this.slideItems = this.slide.querySelectorAll("img");
			}

			this.slide.children[0].style.width = this.length * this.clientWidth + "px";

			for (i = 0; i < this.length; i++) {
				this.slideItems[i].style.width = this.clientWidth + "px";
				this.slideItems[i].style.left = -i * this.clientWidth + "px";

				if (i === 0) {
					this.slideItems[i].style["-webkit-transform"] = "translate3d(0, 0, 0)";
				} else if (i === 1) {
					this.slideItems[i].style["-webkit-transform"] = "translate3d(" + this.clientWidth + "px, 0, 0)";
				} else {
					this.slideItems[i].style["-webkit-transform"] = "translate3d(" + -this.clientWidth + "px, 0, 0)";
				}

				// 挂载clientWidth 
				this.slideItems[i].clientWidth = this.clientWidth;

				// 挂载 touch 事件
				this.slideItems[i].addEventListener("touchstart", this.touchStart, false);
			}

			if (this.promptStyle === "text") {
				this.promptText();
				this.isPromptText = false;
				this.slideList.promptStyle = "text";
			} else {
				this.promptList();
				this.isPromptList = false;
			}

			this.timer = setInterval(function() {
				that.swipe();
			}, this.interval);
			
			document.addEventListener("webkitvisibilitychange", function() {
				if (document.webkitVisibilityState == "visible") {
					console.log("页面可见");
					that.timer = setInterval(function() {
						that.swipe(that.clientWidth);
					}, that.interval);
				} else if (document.webkitVisibilityState == "hidden") {
					console.log("页面隐藏");
					clearInterval(that.timer);
				}
			}, false);

			// 挂载 this对象
			this.slideList.slide = this;
		},
		swipe: function() {
			var i;

			if (!this.slideItems[0].style["-webkit-transition"]) {
				for (i = 0; i < this.length; i++) {
					this.slideItems[i].style["-webkit-transition"] = "all 0.3s ease";
				}
			}

			this.slideItems[this.x - 1].style["-webkit-transform"] = "translate3d(" + -this.clientWidth + "px, 0, 0)";

			if (this.x === this.length) {
				this.slideItems[0].style["-webkit-transition"] = "all 0.3s ease";
				this.slideItems[0].style["-webkit-transform"] = "translate3d(0, 0, 0)";
			} else {
				this.slideItems[this.x].style["-webkit-transition"] = "all 0.3s ease";
				this.slideItems[this.x].style["-webkit-transform"] = "translate3d(0, 0, 0)";
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
		promptText: function() {
			if (this.isPromptText) {
				this.p = document.createElement("p");
				this.p.innerHTML = "<span>1</span>/" + this.length;
				this.slide.appendChild(this.p);
				this.span = this.p.querySelector("span");
				this.slideList.span = this.span;
			}

			if (this.x > this.length) {
				this.span.innerHTML = 1;
			} else {
				this.span.innerHTML = this.x;
			}
		},
		promptList: function() {
			var i = 0;

			if (this.isPromptList) {
				this.p = document.createElement("p");
				this.p.className = "prompt-p";

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
		touchStart: function(e) {
			// 避免定时器和手动触摸同时进行
			if (/3d\(0/.test(this.style["-webkit-transform"])) {
				this.startX = e.touches[0].clientX;
				this.startY = e.touches[0].clientY;
				this.direction = false;
				this.first = true;

				this.nextIndex = +this.getAttribute("data-index") + 1;
				if (this.nextIndex === this.parentNode.children.length) {
					this.nextIndex = 0;
				}

				this.previousIndex = this.getAttribute("data-index") - 1;
				if (this.previousIndex === -1) {
					this.previousIndex = this.parentNode.children.length - 1;
				}

				this.time = + new Date();

				this.addEventListener("touchmove", this.parentNode.slide.touchMove, false);
				this.addEventListener("touchend", this.parentNode.slide.touchEnd, false);
			}
		},
		touchMove: function(e) {
			if (this.first) {
				if (Math.abs(e.touches[0].clientX - this.startX) > 0 && Math.abs(e.touches[0].clientY - this.startY) < 10) {
					this.direction = true;
					this.first = false;
					clearInterval(this.parentNode.slide.timer);
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
					this.parentNode.children[this.nextIndex].style["-webkit-transform"] = "translate3d(" + (this.clientWidth + (e.touches[0].clientX - this.startX)) + "px, 0, 0)";
					this.parentNode.children[this.previousIndex].style["-webkit-transform"] = "translate3d(" + -(this.clientWidth - (e.touches[0].clientX - this.startX)) + "px, 0, 0)";
				} else {
					this.parentNode.children[this.nextIndex].style["-webkit-transform"] = "translate3d(" + (this.clientWidth - (this.startX - e.touches[0].clientX)) + "px, 0, 0)";
					this.parentNode.children[this.previousIndex].style["-webkit-transform"] = "translate3d(" + -(this.clientWidth + (this.startX - e.touches[0].clientX)) + "px, 0, 0)";
				}

				e.preventDefault();
			}
		},
		move: function(e, slide) {
			this.style["-webkit-transition"] = "all 0.3s ease";
			this.style["-webkit-transform"] = e.changedTouches[0].clientX - this.startX > 0 ? "translate3d(" + this.clientWidth + "px, 0, 0)" : "translate3d(" + -this.clientWidth + "px, 0, 0)";

			if (e.changedTouches[0].clientX - this.startX > 0) {
				this.parentNode.children[this.nextIndex].style["-webkit-transition"] = "none";
				this.parentNode.children[this.nextIndex].style["-webkit-transform"] = "translate3d(" + -this.clientWidth + "px, 0, 0)";

				this.parentNode.children[this.previousIndex].style["-webkit-transition"] = "all 0.3s ease";
				this.parentNode.children[this.previousIndex].style["-webkit-transform"] = "translate3d(" + 0 + "px, 0, 0)";
			} else {
				this.parentNode.children[this.nextIndex].style["-webkit-transition"] = "all 0.3s ease";
				this.parentNode.children[this.nextIndex].style["-webkit-transform"] = "translate3d(" + 0 + "px, 0, 0)";

				this.parentNode.children[this.previousIndex].style["-webkit-transform"] = "translate3d(" + -this.clientWidth + "px, 0, 0)";

				this.parentNode.children[this.nextIndex + 1 === this.parentNode.children.length ? 0 : this.nextIndex + 1].style["-webkit-transition"] = "none";
				this.parentNode.children[this.nextIndex + 1 === this.parentNode.children.length ? 0 : this.nextIndex + 1].style["-webkit-transform"] = "translate3d(" + this.clientWidth + "px, 0, 0)";
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
		},
		touchEnd: function(e) {
			var slide = this.parentNode.slide;

			if ((+ new Date() - this.time) < 300) {
				slide.move.call(this, e, slide);

			} else {
				if (this.direction) {
					if (Math.abs(e.changedTouches[0].clientX - this.startX) >= this.clientWidth / 2) {
						slide.move.call(this, e, slide);
					} else {
						this.style["-webkit-transition"] = "all 0.3s ease";
						this.style["-webkit-transform"] = "translate3d(" + 0 + "px, 0, 0)";

						this.parentNode.children[this.nextIndex].style["-webkit-transition"] = "all 0.3s ease";
						this.parentNode.children[this.nextIndex].style["-webkit-transform"] = "translate3d(" + this.clientWidth + "px, 0, 0)";

						this.parentNode.children[this.previousIndex].style["-webkit-transition"] = "all 0.3s ease";
						this.parentNode.children[this.previousIndex].style["-webkit-transform"] = "translate3d(" + -this.clientWidth + "px, 0, 0)";
					}
				}
			}

			if (this.direction) {
				slide.timer = setInterval(function() {
					slide.swipe();
				}, slide.interval);
			}
		}
	};

	return Slide;
});
