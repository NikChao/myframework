class VirtualDOMNode {
    minUpdate(newState) {
        return function () {
            console.log(
                'here we will return a function, that will do the minimum change to the dom',
                'to achieve the new state'
            );
        }
    }

    bindLoops(data) {

        for (let child of this.el.children) {
            const key = child.getAttribute("f-for");
            if (key == null) continue;
            const [itemName, listName] = key.split(" in ");

            const list = data[listName];
            if (list === undefined) continue;
            let childMarkup = domu(child).html();

            let markup = "";
            for (const item of list) {
                if (typeof item !== "object") {
                    markup += childMarkup.replace(`{{ ${itemName} }}`, item);
                    continue;
                }

                let temp = childMarkup;
                for (const k of Object.keys(item)) {
                    temp = temp.replace(`{{ ${itemName}.${k} }}`, item[k]);
                }
                markup += temp;
                domu(child).html(markup);
            }
        }
    }

    /**
     * Optimize this for if you only have to update one branch or w/e
     * basically do a min-diff type of thing
     * 
     * @param {this state passed by reference} data 
     */
    render(frame) {
        let markup = this.elMarkup;

        Object.keys(frame.data).forEach((key) => {
            const template = `{{ ${key} }}`;
            markup = markup.replace(template, frame.data[key]);
        });

        this.bindLoops(frame.data);

        domu(this.el).html(markup);

        for (let child of this.children) {
            child.render(frame);
        }
    }

    constructor(el) {
        // list of either VirtualDOMNodes OR Frames
        el = domu(el).el;
        this.el = el;
        this.elMarkup = el.outerHTML;
        this.elIsFrame = false;
        this.children = [];
        let children = el.children;
        if (children !== undefined && children.length > 0) {
            for (let child of children) {
                this.children = [...this.children, new VirtualDOMNode(child)]
            }
        }
    }
}

class Frame {
    setState(data) {
        this.data = data;
        this.draw();
    }

    build() {
    }

    bindMethods() {
        // bind methods
        let children = this.el.el.children[0].children
        for (let child of children) {

            const attrs = child.getAttributeNames()
                .filter(n => n.startsWith('f-on'))
                .map(n => n.split(':')[1]);
            if (attrs.length === 0) {
                continue;
            }

            for (const attr of attrs) {
                if (attr === "click") {
                    const methodName = child.getAttribute(`f-on:${attr}`);
                    this.methods[methodName] = this.methods[methodName].bind(this.data);
                    domu(child).click(() => {
                        this.methods[methodName]();
                        this.draw(this);
                        this.methods[methodName] = this.methods[methodName].bind(this.data);
                    });
                }
            }
        }
    }

    bindConditionals() {
        let children = this.el.el.children[0].children
        for (let child of children) {
            const key = child.getAttribute("f-if");
            if (key !== undefined && Object.keys(this.data).includes(key)) {
                if (!this.data[key]) {
                    domu(child).hide();
                }
            }
        }
    }

    draw() {
        this.virtualDOM.render(this);
        this.bindMethods();
        this.bindConditionals();
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
        this.virtualDOM = new VirtualDOMNode(el);
        this.draw();
        this.bindMethods();
        this.bindConditionals();
    }
}
