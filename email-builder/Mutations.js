
import {Tree} from './Utilities.js';

const BranchGrowth = (inParent) =>
{
    var newBranch;
    newBranch = Tree.Grow(inParent);
    switch(newBranch.Depth)
    {
        case 0:
            // add table properties
            BranchGrowth(newBranch);
            break;
        case 1:
            // add row properties
            BranchGrowth(newBranch);
            break;
        case 2:
            // add column properties
            BranchGrowth(newBranch);
            break;
        case 3:
            // add cell properties
            break;
    }
}

export default {
    Color:(inValue, inModel, inEvent) =>
    {
        console.log(inEvent.target.value);
        inModel.Color = inEvent.target.value;
    },
    Create:(inBranch) =>
    {
        BranchGrowth(inBranch);
    },
    Clone:(inBranch) =>
    {
        Tree.Clone(inBranch)
    },
    Delete:(inBranch) =>
    {
        Tree.Disconnect(inBranch);
    },
    Select:(inBranch, inModel, inEvent)=>
    {
        var branch;

        inEvent.stopPropagation();
        inModel.Selection.forEach(s => s.ModeSelected = false);
        inModel.Selection = [];
        branch = inBranch;
        while(branch)
        {
            branch.ModeSelected = true;
            inModel.Selection.push(branch);
            branch = branch.Parent;
        }
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