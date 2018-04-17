function elfactory(node) {
    let el;
    if (typeof node === "string") {
        el = node === undefined ? document : document.querySelector(node);
    } else {
        el = node;
    }
    return {
        el: el,
        click: function (callback) {
            this.el.onclick = callback;
            return this;
        },
        change: function (callback) {
            this.el.onchange = callback;
            return this;
        },
        html: function (markup) {
            if (markup === undefined) {
                return this.el.innerHTML;
            }
            this.el.innerHTML = markup;
            return this;
        },
        val: function (v) {
            if (v === undefined) {
                return this.el.value;
            }
            this.el.value = v;
            return this;
        },
        hide() {
            this.el.style.display = 'none';
            return this;
        },
        show(disp) {
            if (disp === undefined) disp = '';
            this.el.style.display = disp;
            return this;
        }
    };
}

function domu(...args) {
    if (args.length < 2) {
        return elfactory(args[0]);
    }

}
