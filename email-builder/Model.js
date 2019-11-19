import {Tree} from './Utilities.js';

Tree.HandleCreate = (inNode) =>
{
    inNode.Type = "";
    inNode.Display = {};
    inNode.Content = {};
    inNode.Mode = {Selected:false, Edit:false};

    if(inNode.Parent)
    {
        inNode.Mode.Edit = inNode.Parent.Mode.Edit;
    }
    switch(inNode.Depth)
    {
        case 0:
            // add table properties
            inNode.Type = "Table";
            inNode.Display = {
                Width:600,
                Padding:0
            };
            Tree.Grow(inNode);
            break;
        case 1:
            // add row properties
            inNode.Type = "Row"
            inNode.Display = {
                Width:100,
                Padding:0,
                ColorOuter:false,
                ColorInner:false
            };
            Tree.Grow(inNode);
            break;
        case 2:
            // add column properties
            inNode.Type = "Column";
            inNode.Display = {
                Width:100,
                Padding:0,
                ColorOuter:false,
                ColorInner:false
            };
            Tree.Grow(inNode);
            break;
        case 3:
            // add cell properties
            inNode.Type = "Cell"
            inNode.Display = {
                Padding:0,
                ColorOuter:false,
                ColorInner:false,
            },
            inNode.Content = {
                Mode:"Copy", /* Copy | CTA | Image */
                URLAction:"https://isitchristmas.com/",
                URLImage:"https://placekitten.com/800/300",
                Message:"Act <strong>now</strong>!"
            }
            break;
    }
};

export default {
    DragFrom:false,
    DragTo:false,
    Table:Tree.Grow()
};