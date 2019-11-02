import {render} from 'lit-html';
const App = {
    User: false,
    GetMutation: (inEnum, inPayload)=>
    {
        var mutation;
        mutation = App.User.Mutations[inEnum];
        if(mutation)
        {
            return ()=>
            {
                mutation(inPayload, App.User.Model);
                App.Render();
            }
        }
    },
    GetComponent:(inEnum, inPayload, inArray)=>
    {
        var view;
        view = App.User.Views[inEnum];
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
        render(App.User.View(App.User.Model, App.GetMutation, App.GetComponent), App.User.DOM);
    },
    Initialize: (inModel, inMutations, inViews, inDOM, inLayout)=>
    {
        App.User = {
            Model: inModel,
            Mutations: inMutations,
            Views: inViews,
            View: inViews[inLayout],
            DOM: inDOM
        };
        App.Render();
    }
};

var init = App.Initialize;
export { html } from 'lit-html';
export { init as App };