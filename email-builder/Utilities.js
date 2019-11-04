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
            Content:{}
        };
        if(inParent)
        {
            Tree.Connect(inParent, obj);
        }
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
        const resetIDs = (inBranch) =>
        {
            inBranch.ID = Math.random();
            inBranch.Members.forEach(resetIDs);
        };

        var parent, clone;
        var index;

        parent = inBranch.Parent;
        clearParents(inBranch);//clear circular parent references
        clone = JSON.parse(JSON.stringify(inBranch));//deep clone the node
        resetParents(inBranch);   // put the references back
        inBranch.Parent = parent; //

        resetParents(clone);   // restore the references within the clone
        resetIDs(clone);       //
        clone.Parent = parent; //

        index = Tree.GetIndex(inBranch);
        inBranch.Parent.Members.splice(index+1, 0, clone);//put the clone back next to the original node

        return clone;
    }
};