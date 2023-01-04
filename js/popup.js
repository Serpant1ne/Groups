let tabsUrl = [];
chrome.windows.getAll({populate:true},function(windows){
    windows.forEach(function(window){
      window.tabs.forEach(function(tab){
        
        //collect all of the urls here, I will just log them instead
        let filtered = tab.url.split('/')[2]
        let tabObject = {
            'tab': tab, 'id': tab.id, 'url': filtered, 'window': tab.windowId
        }
        tabsUrl.push(tabObject);
        
      });
    });
});

let groupBtn = document.createElement('button');
groupBtn.textContent = 'Group all';
groupBtn.addEventListener('click',async()=>{
    let tabsTimeArray = [];
    for (let i = 0; i < tabsUrl.length; i++) {
        const el = tabsUrl[i];
        tabsTimeArray.push(el)
    }
    console.log(tabsTimeArray)
    while (tabsTimeArray.length > 0) {
        let tabInSearch = tabsTimeArray[0];
        let tabsInGroup = [];
        let tabIds = [];
        let windowId = tabInSearch.window;
        tabIds.push(tabInSearch.id);
        tabsInGroup.push(tabInSearch);
        tabsTimeArray.splice(0,1);
        for (let i = 0; i < tabsTimeArray.length; i++) {
            const el = tabsTimeArray[i];
            if(tabInSearch.url === el.url && tabInSearch.window === el.window){
                tabsInGroup.push(el);
                tabIds.push(el.id);
                tabsTimeArray.splice(i,1);
                i = i - 1;
            }
            
        }
        if(tabIds.length > 1){
            let group = await chrome.tabs.group({tabIds});
            console.log(windowId)
            await chrome.tabGroups.update(group, { collapsed: true , color: 'purple', title: tabInSearch.url })
            chrome.tabGroups.move(group, {index: 0, windowId: windowId});
        }
    }   
    
})

let ungroupBtn = document.createElement('button');
ungroupBtn.textContent = 'Ungroup all';
ungroupBtn.addEventListener('click',async()=>{
    tabsUrl.forEach(el => {
        let id = el.id
        chrome.tabs.ungroup(id)
    });
})

document.body.append(groupBtn)
document.body.append(ungroupBtn)



