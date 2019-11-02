import {render} from './node_modules/lit-html/lit-html.js';
var App;
App = {

    _Model:{},
    _Mutations:{},
    _Views:{},
    _View:{},
    _DOM:{},

    Mutate: (inEnum, inPayload)=>
    {
        var mutation;
        mutation = App._Mutations[inEnum];
        if(mutation)
        {
            return ()=>
            {
                mutation(App._Model, inPayload);
                App.Render();
            }
        }
    },
    Component:(inEnum, inPayload, inArray)=>
    {
        var view;
        view = App._Views[inEnum];
        if(view)
        {
            if(inPayload == null)
            {
                return inArray.map(item => view(item, App.Mutate, App.Component));
            }
            else
            {
                return view(inPayload, App.Mutate, App.Component);
            }
            
        }
    },
    Render:()=>
    {
        render(App._View(App._Model, App.Mutate, App.Component), App._DOM);
    },
    Start:(inDOM, inView)=>
    {
        App._DOM = inDOM;
        App._View = App._Views[inView];
        App.Render();
    }
};
export default App;