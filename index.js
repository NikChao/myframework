class Frame {

    bindHandlers() {

    }

    bindConditionals() {
        for (let child of this.el.el.children) {
            const key = child.getAttribute("f-if");
            if (key !== undefined && Object.keys(this.data).includes(key)) {
                if (this.data[key]) {
                    domu(child).hide();
                }
            }
        }
    }

    bindLoops() {

    }

    build() {
        this.bindConditionals();
    }

    draw() {
        let markup = this.el.html();
        Object.keys(this.data).forEach((key) => {
            const template = `{{ ${key} }}`;
            markup = markup.replace(template, this.data[key]);
        });
        this.el.html(markup);
    }

    constructor(options) {
        const { el, data, methods } = options;

        if (el === undefined) {
            throw new Error("Must provide an app template");
        }
        this.el = domu(el);

        this.data = data === undefined ?
            {} :
            data;
        this.methods = methods === undefined ?
            {} :
            methods;

        this.build();
        this.draw();
    }
}