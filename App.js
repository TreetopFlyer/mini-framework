import {render} from './node_modules/lit-html/lit-html.js';
var Tower;
Tower = {
    _DOM:{},
    _Model:{},
    _Mutations:(inModel, inEnum, inPayload)=>{},
    _View:(inModel, inSignal)=>{},
    Update: (inEnum, inPayload)=>
    {
        Tower._Mutations(Tower._Model, inEnum, inPayload);
        render(Tower._View(Tower._Model, Tower.Update), Tower._DOM);
    },
    Start:(inDOM, inModel, inMutations, inView)=>
    {
        Tower._DOM = inDOM;
        Tower._Model = inModel;
        Tower._Mutations = inMutations;
        Tower._View = inView;
        Tower.Update();
    }
};
export default Tower;