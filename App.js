import {render} from 'lit-html';
var App;
App = {

    _Model:{},
    _Mutations:{},
    _Views:{},
    _View:{},
    _DOM:{},

    GetMutation: (inEnum, inPayload)=>
    {
        var mutation;
        mutation = App._Mutations[inEnum];
        if(mutation)
        {
            return ()=>
            {
                mutation(inPayload, App._Model);
                App.Render();
            }
        }
    },
    GetComponent:(inEnum, inPayload, inArray)=>
    {
        var view;
        view = App._Views[inEnum];
        if(view)
        {
            if(inPayload == null)
            {
                return inArray.map(item => view(item, App.GetMutation, App.GetComponent));
            }
            else
            {
                return view(inPayload, App.GetMutation, App.GetComponent);
            }
            
        }
    },
    Render:()=>
    {
        render(App._View(App._Model, App.GetMutation, App.GetComponent), App._DOM);
    },
    Start:(inDOM, inView)=>
    {
        App._DOM = inDOM;
        App._View = App._Views[inView];
        App.Render();
    }
};
export default App;