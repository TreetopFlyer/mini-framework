
import {Tree, BranchGrowth} from './Utilities.js';

export default {
    Create:(inBranch) =>
    {
        BranchGrowth(inBranch);
    },
    Clone:(inBranch) =>
    {
        Tree.Clone(inBranch);
    },
    Delete:(inBranch, inModel) =>
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
    },
    DisplayWidth:(inSettings, inModel, inEvent)=>
    {
        inSettings.Width = inEvent.target.valueAsNumber;
    },
    DisplayColorOuter:(inSettings, inModel, inEvent)=>
    {
        inSettings.ColorOuter = inEvent.target.value;
    },
    DisplayColorInner:(inSettings, inModel, inEvent)=>
    {
        inSettings.ColorInner = inEvent.target.value;
    },
    ContentMode:(inContent, inModel, inEvent)=>
    {
        inContent.Mode = inEvent.target.value;
    },
    ContentMessage:(inContent, inModel, inEvent)=>
    {
        inContent.Message = inEvent.target.value;
    },
    ContentURLImage:(inContent, inModel, inEvent)=>
    {
        inContent.URLImage = inEvent.target.value;
    },
    ContentURLAction:(inContent, inModel, inEvent)=>
    {
        inContent.URLAction = inEvent.target.value;
    }
};