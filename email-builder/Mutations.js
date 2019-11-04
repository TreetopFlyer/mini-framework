
import {Tree} from './Utilities.js';

export default {
    Color:(inValue, inModel, inEvent) =>
    {
        console.log(inEvent.target.value);
        inModel.Color = inEvent.target.value;
    },
    Create:(inBranch) =>
    {
        var newBranch;
        newBranch = Tree.Grow(inBranch);
        switch(newBranch.Depth)
        {
            case 0:
                // add table properties
                break;
            case 1:
                // add row properties
                break;
            case 2:
                // add column properties
                break;
            case 3:
                // add cell properties
                break;
        }
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
    DragStop:(inBranch, inModel, inEvent)=>
    {
        inEvent.stopPropagation();
        inModel.DragFrom = false;
    },
    DragDrop:(inBranch, inModel, inEvent)=>
    {
        var index;
        
        inEvent.stopPropagation();
        inModel.DragTo = inBranch;
        if(inModel.DragFrom.ID === inModel.DragTo.ID)// drag to self
        {
            return;
        }
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