
import {Tree} from './Utilities.js';

export default {
    Grow:(inBranch) =>
    {
        Tree.Grow(inBranch);
    },
    Clone:(inBranch) =>
    {
        Tree.Clone(inBranch)
    },
    Delete:(inBranch) =>
    {
        Tree.Disconnect(inBranch);
    },
    DragStart:(inBranch, inModel, inEvent)=>
    {
        inEvent.stopPropagation();
        inModel.DragFrom = inBranch;
    },
    DragStop:(inBranch, inModel)=>
    {
        inEvent.stopPropagation();
        inModel.DragFrom = false;
    },
    DragDrop:(inBranch, inModel, inEvent)=>
    {
        var index;
        
        inEvent.stopPropagation();
        inModel.DragTo = inBranch;
        if(inModel.DragFrom.Depth == inModel.DragTo.Depth)// drag to sibling
        {
            Tree.Disconnect(inModel.DragFrom);
            index = Tree.GetIndex(inModel.DragTo);
            Tree.Connect(inModel.DragTo.Parent, inModel.DragFrom, index);
        }
        if(inModel.DragFrom.Depth-1 == inModel.DragTo.Depth)// drag to first parent
        {
            Tree.Disconnect(inModel.DragFrom);
            Tree.Connect(inModel.DragTo, inModel.DragFrom);
        }
        inModel.DragTo = false;
    }
};