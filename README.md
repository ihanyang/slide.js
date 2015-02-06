# slide.js
slide.js 是专为移动端设计的幻灯片组件，性能高，稳定性强，兼容性好等诸多优点<br>
# <a href="http://hanyang.me/demo/slide" target="_blank">Try the demo</a>
### Usage:
params: <br>
* `target` 幻灯片的容器<br>
* `imgs` 图片数组<br>
* `links` 超链接数组<br>
* `interval` 幻灯片间隔<br>
* `promptStyle` 显示方式<br>

引入<br>
```javascript
<script src="slide.js"></script>
```
写一点点<br>
```javascript
var slide = new Slide({
	target: ".slide",
	imgs: ["images/a.jpg", "images/b.jpg", "images/c.jpg", "images/d.jpg", "images/e.jpg"],
	links: ["baidu.com", "baidu.com", "baidu.com", "baidu.com", "baidu.com"],
	interval: 3000,
	promptStyle: "text"
});

slide.init();
