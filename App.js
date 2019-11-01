import {render} from './node_modules/lit-html/lit-html.js';
var App;
App = {
    _DOM:{},
    _Model:{},
    _Mutations:{},
    _View:(inModel, inSignal)=>{},
    Update: (inEnum, inPayload)=>
    {
        var mutation;
        mutation = App._Mutations[inEnum];
        if(mutation)
        {
            console.log(inEnum, inPayload);
            mutation(App._Model, inPayload);
        }
        render(App._View(App._Model, App.Update), App._DOM);
    },
    Start:(inDOM, inModel, inMutations, inView)=>
    {
        App._DOM = inDOM;
        App._Model = inModel;
        App._Mutations = inMutations;
        App._View = inView;
        App.Update();
    }
};
export default App;