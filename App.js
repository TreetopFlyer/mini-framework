import {render} from './node_modules/lit-html/lit-html.js';
var App;
App = {
    _DOM:{},
    _Model:{},
    _Mutations:{},
    _Views:{},
    _View:{},
    Update: (inEnum, inPayload)=>
    {
        var mutation;
        mutation = App._Mutations[inEnum];
        if(mutation)
        {
            console.log(inEnum, inPayload);
            mutation(App._Model, inPayload);
        }
        render(App._View(App._Model, App.Update, App._Views), App._DOM);
    },
    Start:(inDOM, inView)=>
    {
        App._DOM = inDOM;
        App._View = App._Views[inView];
        render(App._View(App._Model, App.Update, App._Views), App._DOM);
    }
};
export default App;