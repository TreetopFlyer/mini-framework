
import {Tree} from './Utilities.js';

export const RedistributeColumns = (inNode) =>
{
    var size;

    if(inNode.Depth != 1)
    {
        return;
    }
    size = 100/inNode.Members.length;
    inNode.Members.forEach( m => m.Display.Width = size );
    console.log("resized:", inNode.Members.map(m=>m.Display.Width));
};

export default {
    Create:(inBranch) =>
    {
        Tree.Grow(inBranch);
        RedistributeColumns(inBranch);
    },
    Clone:(inBranch) =>
    {
        Tree.Clone(inBranch);
        RedistributeColumns(inBranch.Parent);
    },
    Delete:(inBranch, inModel) =>
    {
        var parent = inBranch.Parent;
        Tree.Disconnect(inBranch);
        RedistributeColumns(parent);
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
            RedistributeColumns(inModel.DragTo.Parent);
        }
        if(inModel.DragFrom.Depth-1 == inModel.DragTo.Depth)// drag to first parent
        {
            var parent = inModel.DragFrom.Parent
            Tree.Disconnect(inModel.DragFrom);
            Tree.Connect(inModel.DragTo, inModel.DragFrom);
            RedistributeColumns(inModel.DragTo);
            RedistributeColumns(parent);
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