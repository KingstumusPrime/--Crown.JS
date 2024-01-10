

class myObj {
  constructor(value = 0) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    console.log("SETTNG");
    this._value = newValue;
  }
}
  

class UI {
    constructor(obj){
        this.elem;
        this.obj = obj;
        this.valMap = {};
    }
    addDomElement(pointer){
        this.elem = document.createElement("p");
        this.elem.innerText = pointer._value;
        pointer.onChange = function() {
            console.log(this.valMap);
        }


        document.body.appendChild(this.elem);
    }
}