export const Tree = {
    Grow:(inParent)=>
    {
        var obj;
        obj = {
            ID:Math.random()+"-"+Math.random(),
            Depth:0,
            Parent:false,
            Members:[],
            Type:"",
            Display:{},
            Content:{},
            Mode:{Selected:false, Edit:false}
        };
        if(inParent)
        {
            Tree.Connect(inParent, obj);
            obj.Mode.Edit = inParent.Mode.Edit;
        }

        /*********************************** */
        switch(obj.Depth)
        {
            case 0:
                // add table properties
                obj.Type = "Table";
                obj.Display = {
                    Width:600
                };
                Tree.Grow(obj);
                break;
            case 1:
                // add row properties
                obj.Type = "Row"
                obj.Display = {
                    Width:100,
                    ColorOuter:false,
                    ColorInner:false
                };
                Tree.Grow(obj);
                break;
            case 2:
                // add column properties
                obj.Type = "Column";
                obj.Display = {
                    Width:100,
                    ColorOuter:false,
                    ColorInner:false
                };
                Tree.Grow(obj);
                break;
            case 3:
                // add cell properties
                obj.Type = "Cell"
                obj.Display = {
                    ColorOuter:false,
                    ColorInner:false,
                    Padding:0,
                },
                obj.Content = {
                    Mode:"Copy", /* Copy | CTA | Image */
                    URLAction:false,
                    URLImage:false,
                    Message:false
                }
                break;
        }
        /********************************************************** */

        return obj;
    },
    GetIndex:(inBranch)=>
    {
        return inBranch.Parent.Members.findIndex(n => n.ID === inBranch.ID);
    },
    Disconnect:(inChild)=>
    {
        var index;
        if(inChild.Parent)
        {
            index = Tree.GetIndex(inChild);
            if(index != -1)
            {
                inChild.Parent.Members.splice(index, 1);
                inChild.Parent = false;
            }
        }
    },
    Connect:(inParent, inChild, inIndex)=>
    {
        if(inChild.Parent)
        {
            Tree.Disconnect(inChild);
        }
        if(inIndex != undefined)
        {
            console.log("inserting at", inIndex);
            inParent.Members.splice(inIndex, 0, inChild);
        }
        else
        {
            console.log("inserting at end");
            inParent.Members.push(inChild);
        }
        inChild.Parent = inParent;
        inChild.Depth = inParent.Depth+1;
    },
    Clone:(inBranch)=>
    {
        const clearParents = (inBranch) =>
        {
            inBranch.Parent = false;
            inBranch.Members.forEach(clearParents);
        };
        const resetParents = (inBranch) =>
        {
            inBranch.Members.forEach((inChild)=>
            {
                inChild.Parent = inBranch;
                resetParents(inChild);
            });
        };
        const resetFields = (inBranch) =>
        {
            inBranch.ID = Math.random();
            inBranch.ModeSelected = false;
            inBranch.Members.forEach(resetFields);
        };

        var parent, clone;
        var index;

        parent = inBranch.Parent;
        clearParents(inBranch);//clear circular parent references
        clone = JSON.parse(JSON.stringify(inBranch));//deep clone the node
        resetParents(inBranch);   // put the references back
        inBranch.Parent = parent; //

        resetParents(clone);   // restore the references within the clone
        resetFields(clone);       //
        clone.Parent = parent; //

        index = Tree.GetIndex(inBranch);
        inBranch.Parent.Members.splice(index+1, 0, clone);//put the clone back next to the original node

        return clone;
    },
    ItrDecendents:(inBranch, inFunction)=>
    {
        inFunction(inBranch);
        inBranch.Members.forEach( m => Tree.ItrDecendents(m, inFunction) );
    },
    ItrAncestors:(inBranch, inFunction)=>
    {
        inFunction(inBranch);
        if(inBranch.Parent)
        {
            Tree.ItrAncestors(inBranch.Parent, inFunction);
        }
    },
};