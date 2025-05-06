

var categoryId;
var categoryName;
var searchContentEl;
var noSearchTipEl;
var searchPanelEl;
var bgEl;
var gameDisplayEl;
var searchBtnEl;
var closeSearchBtnEl;
var categorypath = "/assets/icons/category/";
var gamepath  = "/assets/icons/game/"
var isDesk;
var inputSearchEl;

window.onload = function(){   
    preInit();
    getCategory();
    initElement();
    initUIHandle();
    ShowCategoryContent();
}

function preInit(){
    isDesk = document.body.className == "DeskVersion" ? true : false;
}


function initElement()
{
    navEl = document.querySelector("#nav");
    searchContentEl = isDesk ? document.querySelector(".AbPoNGztukbS1wl5bcmt.yanfEXzbvdGsPis_ItLV"):document.querySelector(".AbPoNGztukbS1wl5bcmt.lcdG68I_Um0yTmQFfvKY"); //搜索显示元素
    noSearchTipEl = document.querySelector("div.zuKNfnid1j68xnLS9ZiH > div.dT3EegLpfzUUgPdDhOfx"); //没有搜索到元素提示显示
    searchPanelEl = isDesk?document.querySelector(".kWQWzdYW881_EYiVCO5J"):document.querySelector(".kWQWzdYW881_EYiVCO5J.JfwQbhsyFVjMXL4TciK2");
    bgEl = isDesk ? document.querySelector(".idzxSUf9DX32i1uhNIuG") : document.querySelector(".L0oRsqu8KbQFOxjDFdbv");
    gameDisplayEl = document.body;
    searchBtnEl =document.querySelector(".ltAYdgxBAJy9br2MmQME > use") ;
    closeSearchBtnEl = isDesk? document.querySelector(".buttonReset.Y8WvtyOECzLsN3k0_OFx") :document.querySelector(".buttonReset.Y8WvtyOECzLsN3k0_OFx.qL3lVMIHyY8jhn2udhLe") ;
}



function filterSearchContent() {
    var searchValue = inputSearchEl.value==""?"##############################":inputSearchEl.value.toLowerCase();
    var searchData = games_infos.gameList.filter((item) => item.gname.toLowerCase().indexOf(searchValue) > -1);

    searchContentEl.innerHTML = "";
    
    isDesk?showDeskSearchContent(searchData):showMobileSearchContent(searchData);

}

function showDeskSearchContent(filterData){
    for (var i = 0; i < filterData.length; i++) {
        var game_icon = gamepath + filterData[i].icon;
        var a = document.createElement("a");
        var game_name = filterData[i].gname.replaceAll("_"," ");
        var game_name = game_name.replaceAll("-"," ");
        a.href = filterData[i].url;
        a.className = "I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR";
        a.innerHTML = '<img src="' + game_icon + '" ' + game_icon + ' 1x, ' + game_icon + ' 2x" alt="' + game_icon + '" loading="lazy" decoding="async" width="94" height="94" class="omIThBX9w3QarB_pnFby"><span class="MHaP7Us7V6KqGxb8muHM global-cq-title">' + game_name + '</span>'

        searchContentEl.appendChild(a);
    }
}


function showMobileSearchContent(filterData){

    for (var i = 0; i < filterData.length; i++) {
        var game_icon = gamepath + filterData[i].icon;
        var name = filterData[i].gname;
        var a = document.createElement("a");
        a.href = filterData[i].url;
        a.className = "Rb7HuIF8jKcIe2nU91ai UoAfP265z4mp2pLVnJgN KoHkUVmXR7joVgQZvggn";
        a.innerHTML = '<img alt="' + name + '" src="' + game_icon + '" srcset="' + game_icon + ' 1x, ' + game_icon + ' 2x" decoding="async" width="40" height="40" class="YBUdSAqsfPvMt4mvmjkA WM2RGMygSCak_g50DlI3"><div class="dyYMg3HqmmbjhYCLC8lg Qsj6z4yh8zGCZDhl_KML"><div class="L7rv0e7LkdrpUjPZq3gH">' + name + '</div><span class="pyOBngxafEnwWKrr93IQ"></span></div><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="lGtOMKHvtki_BSIeZKa5"><use href="#thinArrowIcon"></use></svg>'
        searchContentEl.appendChild(a);
    }
}




function initUIHandle(){
    isDesk?initDeskUIHandle():initMobileUIHandle();
}

function initDeskUIHandle(){
        
    document.querySelector(".B_5ykBA46kDOxiz_R9wm").parentElement.addEventListener('click', function () {
        openShowSearchPanel();
    }, false);

    document.querySelector(".QhChQVv3CuMGGXzujgBd").parentElement.addEventListener('click', function () {
        closeShowSearchPanel();
    }, false);

    document.querySelector("div.N_0UqJKlXjVZcfq8sKkD > button").addEventListener('click', function () {
        closeShowSearchPanel();
    }, false);

    closeSearchBtnEl.addEventListener('click', function () {
        showElement(searchBtnEl);
        hideElement(closeSearchBtnEl);
        inputSearchEl.value = "";
        filterSearchContent()
    }, false);

    inputSearchEl = document.querySelector('.rReA1JktpILd2Q36MPl6');
    inputSearchEl.addEventListener('keyup', () => {
        showElement(closeSearchBtnEl);
        hideElement(searchBtnEl);
        filterSearchContent();
    });
}

function initMobileUIHandle(){
    document.querySelector(".buttonReset.Ms6HEJ826qeso4NBVCoW.dh2x0Msr5tQ9qK1KUc6A").addEventListener('click', function () {
        openShowSearchPanel();
    }, false); 
    document.querySelector(".buttonReset.cASKzCoNR2uSR8G9mVE4").addEventListener('click', function () {
        closeShowSearchPanel();
    }, false);
    
    closeSearchBtnEl.addEventListener('click', function () {
        showElement(searchBtnEl);
        hideElement(closeSearchBtnEl);
        inputSearchEl.value = "";
        filterSearchContent()
    }, false);

    inputSearchEl = document.querySelector('.rReA1JktpILd2Q36MPl6');
    inputSearchEl.addEventListener('keyup', () => {

        searchValue = inputSearchEl.value;
        showElement(closeSearchBtnEl);
        hideElement(searchBtnEl);

        filterSearchContent();
    });
}


function getCategory()
{
    var url = window.location.href;
    
    // 创建一个 URL 对象
    var urlObj = new URL(url);
    
    // 使用 URLSearchParams 对象来解析查询字符串
    var params = new URLSearchParams(urlObj.search);
    // 获取参数值
    categoryId = params.get('id');
    
    

    if(categoryId == null){
         window.location.href = "/";
         return;
    }

    categoryName = category_infos.categoryList.filter((item)=>item.id == categoryId)[0].name;
    document.title = categoryName;
}

function ShowCategoryContent(){
    isDesk?showDeskCategoryContent():showMobileCategoryContent();
}


function showDeskCategoryContent()
{
    var liCount  = 5;
    var categoryTittleEl = document.querySelector(".WkgGPoj56g0c5Rdpt85Z");
    var luEl = document.querySelector(".Wz4fsOmhQR4bEYpqHqhc");
    var categoryContentEl = document.querySelector(".vtbwTfQNi80Hes0DzmGs.JgLfL7LclbiAmVJ1BGIg");
    categoryTittleEl.innerHTML = categoryName
    
     var category_games = games_infos.gameList.filter((item)=>item.category.indexOf(categoryId) > -1);
 
     for (var i = 0; i < liCount; i++) {
        var oLi = document.createElement("li");
        var icon = gamepath + category_games[i].icon;
        var ahref = "/detail.html?id=" + category_games[i].id;
        var name= category_games[i].gname.replaceAll("_"," ");
        name = name.replaceAll("-"," ");
        oLi.innerHTML = '<a href="' + ahref + '" class="I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR XxuAeockFFccwluXvlEw ip' + i.toString() + '" style="background-image: url(' + icon + ');"><img src="' + icon + '" srcset="' + icon + ' 1x, ' + icon + ' 2x" alt="11-11" loading="eager" decoding="async" width="204" height="204" class="omIThBX9w3QarB_pnFby"><span class="MHaP7Us7V6KqGxb8muHM global-cq-title">' + name + '</span></a>'
    
        luEl.appendChild(oLi);
    }

    for (var i = liCount; i < category_games.length; i++) {
        var aEl = document.createElement("a");
        aEl.className = "I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR XxuAeockFFccwluXvlEw";
        aEl.href = "/detail.html?id=" + category_games[i].id;
        var icon = gamepath + category_games[i].icon;
        var name= category_games[i].gname.replaceAll("_"," ");
        name = name.replaceAll("-"," ");
        aEl.innerHTML = '<picture class="EtaFjSLj6ZlVyLWzxjzK"><source srcset="' + icon + ' 1x, ' + icon + ' 2x" media="(min-width: 1541px)" width="204" height="204"><img src="' + icon + '" alt="' + name + '" srcset="' + icon + ' 1x, ' + icon + ' 2x" loading="lazy" decoding="async" width="94" height="94" class="omIThBX9w3QarB_pnFby"></picture><span class="MHaP7Us7V6KqGxb8muHM global-cq-title">' + name + '</span>'
    
        categoryContentEl.appendChild(aEl);
    }

}



function showMobileCategoryContent()
{
     var categoryTittleEl = document.querySelector(".WkgGPoj56g0c5Rdpt85Z");
     var luEl = document.querySelector(".Wz4fsOmhQR4bEYpqHqhc");
     categoryTittleEl.innerHTML = categoryName;
     var titleParentEl = categoryTittleEl.parentElement;
     removeStyle(titleParentEl);
     var category_games = games_infos.gameList.filter((item)=>item.category.indexOf(categoryId) > -1);
 
     var oLi = document.createElement("li");
     var icon = gamepath + category_games[0].icon;
     var ahref = "/detail.html?id=" + category_games[0].id;
     var name= category_games[0].gname.replaceAll("_"," ");
     name = name.replaceAll("-"," ");
     oLi.innerHTML = '<a href="' + ahref + '" class="I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR XxuAeockFFccwluXvlEw ip0" style="background-image: url(' + icon + ');"><img src="' + icon + '" srcset="' + icon + ' 1x, ' + icon + ' 2x" alt="Watermelon Drop" loading="eager" decoding="async" width="204" height="204" class="omIThBX9w3QarB_pnFby"><span class="MHaP7Us7V6KqGxb8muHM global-cq-title">' + name + '</span></a>'
     luEl.appendChild(oLi);


     for (var i = 1; i < category_games.length; i++) {
        var oLi = document.createElement("li");
        var icon = gamepath + category_games[i].icon;
        var ahref = "/detail.html?id=" + category_games[i].id;
        var name= category_games[i].gname.replaceAll("_"," ");
        name = name.replaceAll("-"," ");
        oLi.innerHTML = '<a href="' + ahref + '" class="I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR ip' + i.toString() + '" style="background-image: url(' + icon + ');"><img src="' + icon + '" srcset="' + icon + ' 1x, ' + icon + ' 2x" alt="Kawaii Fruits 3D" loading="eager" decoding="async" width="94" height="94" class="omIThBX9w3QarB_pnFby"><span class="MHaP7Us7V6KqGxb8muHM global-cq-title">' + name + '</span></a>'
    
        luEl.appendChild(oLi);
    }
 
}
///显示搜索页面
function openShowSearchPanel(){

    showElement(searchPanelEl);
    showElement(bgEl);
    gameDisplayEl.style.overflow = "hidden";
    filterSearchContent();
}

///显示搜索页面
function closeShowSearchPanel(){
    // searchContent = document.querySelector(".QCGUTwEkRDqr001zXx8o");
    hideElement(searchPanelEl);
    hideElement(bgEl);
    gameDisplayEl.style.overflow = "auto";
}


// 隐藏元素
function hideElement(element) {
    element.style.display = 'none';
  }
   
  // 显示元素
  function showElement(element) {
    element.style.display = 'block'; // 或者之前的值
  }

  function removeStyle(element){
    element.removeAttribute("style");
  }
   