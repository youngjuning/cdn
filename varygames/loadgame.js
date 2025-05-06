// "...  ...  ip0  ip0  ip0  ip1  ip1"
// "...  ...  ip0  ip0  ip0  ip1  ip1"
// "ip2  ip2  ip0  ip0  ip0  ...  ..."
// "ip2  ip2  ...  ip3  ip3  ...  ..."
// "...  ...  ...  ip3  ip3  ip4  ip4"
// "...  ...  ...  ...  ...  ip4  ip4"
// "ip5  ip5  ip5  ...  ...  ...  ..."
// "ip5  ip5  ip5  ...  ip6  ip6  ..."
// "ip5  ip5  ip5  ...  ip6  ip6  ..."
// "...  ...  ip7  ip7  ...  ...  ..."
// "...  ...  ip7  ip7  ...  ...  ..."
// "...  ...  ...  ip8  ip8  ip8  ..."
// "...  ...  ...  ip8  ip8  ip8  ..."
// "ip9  ip9  ...  ip8  ip8  ip8  ..."
// "ip9  ip9  ...  ...  ...  ip10 ip10"
// "...  ...  ...  ...  ...  ip10 ip10"
// "ip11 ip11 ip11 ...  ip13 ip13 ..."
// "ip11 ip11 ip11 ...  ip13 ip13 ..."
// "ip11 ip11 ip11 ...  ...  ...  ..."
// "...  ...  ip14 ip14 ...  ...  ..."
// "...  ...  ip14 ip14 ip12 ip12 ip12"
// "...  ...  ...  ...  ip12 ip12 ip12"
// "...  ...  ...  ...  ip12 ip12 ip12"
// "ip15 ip15 ...  ...  ...  ...  ..."
// "ip15 ip15 ...  ...  ...  ...  ..."
// "...  ...  ip16 ip16 ...  ...  ..."
// "...  ...  ip16 ip16 ...  ...  ..."
// "...  ...  ...  ip17 ip17 ...  ..."
// "...  ip18 ip18 ip17 ip17 ...  ..."
// "...  ip18 ip18 ...  ...  ip19 ip19"
// "...  ...  ...  ...  ...  ip19 ip19"




// 添加预渲染检测
const isPrerendering = navigator.userAgent.toLowerCase().includes('prerender');

// 性能监控
let loadStartTime = performance.now();

// 游戏加载状态管理
const LoadingState = {
    INITIAL: 'initial',
    LOADING: 'loading',
    LOADED: 'loaded',
    ERROR: 'error'
};

let currentLoadingState = LoadingState.INITIAL;

// 错误处理和重试机制
const MAX_RETRIES = 3;
let retryCount = 0;

// 性能监控函数
function logPerformance(action) {
    const duration = performance.now() - loadStartTime;
    console.log(`Performance: ${action} took ${duration}ms`);
    
    // 发送性能数据到分析服务
    if (typeof gtag !== 'undefined') {
        gtag('event', 'performance', {
            'event_category': 'loading',
            'event_label': action,
            'value': Math.round(duration)
        });
    }
}

// 更新加载状态
function updateLoadingState(state, message = '') {
    currentLoadingState = state;
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.innerHTML = `
            <h2>加载游戏列表...</h2>
            <p>${message}</p>
            ${state === LoadingState.ERROR ? '<button onclick="retryLoading()">重试</button>' : ''}
        `;
    }
}

// 重试加载
async function retryLoading() {
    if (retryCount < MAX_RETRIES) {
        retryCount++;
        updateLoadingState(LoadingState.LOADING, `正在重试 (${retryCount}/${MAX_RETRIES})`);
        await loadGames();
    } else {
        updateLoadingState(LoadingState.ERROR, '加载失败，请刷新页面重试');
    }
}

// 优化的游戏加载函数
async function loadGames() {
    try {
        updateLoadingState(LoadingState.LOADING);
        
        // 如果是预渲染，使用简化版本
        if (isPrerendering) {
            await loadPrerenderedContent();
            return;
        }

        // 根据设备类型加载
        if (isDesk) {
            await loadDeskGames();
        } else {
            await LoadMobileGames();
        }

        logPerformance('loadGames');
        updateLoadingState(LoadingState.LOADED);
    } catch (error) {
        console.error('Error loading games:', error);
        updateLoadingState(LoadingState.ERROR, '加载出错，请稍后重试');
    }
}

// 预渲染内容加载
async function loadPrerenderedContent() {
    const gamesList = document.createElement('div');
    gamesList.className = 'games-list';
    
    // 只加载前5个游戏的基本信息
    const previewGames = games_infos.gameList.slice(0, 5);
    
    previewGames.forEach(game => {
        const gameElement = document.createElement('div');
        gameElement.className = 'game-preview';
        gameElement.innerHTML = `
            <h3>${game.gname}</h3>
            <img src="${gamepath}${game.icon}" alt="${game.gname}" loading="lazy">
            <p>${game.des}</p>
        `;
        gamesList.appendChild(gameElement);
    });
    
    document.body.appendChild(gamesList);
}

// 优化的桌面版游戏加载
async function loadDeskGames() {
    const data = games_infos;
    const oUl0 = document.getElementsByTagName("ul")[0];

    // 使用 DocumentFragment 优化 DOM 操作
    const fragment = document.createDocumentFragment();

    // 添加结构化数据
    const gameListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };

    // 加载前5个游戏
    for (let i = 0; i < 5; i++) {
        const game = data.gameList[i];
        const oLi = createGameElement(game, i);
        fragment.appendChild(oLi);

        // 添加到结构化数据
        gameListSchema.itemListElement.push({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
                "@type": "Game",
                "name": game.gname.replaceAll("_", " ").replaceAll("-", " "),
                "image": gamepath + game.icon,
                "url": "/detail.html?id=" + game.id
            }
        });
    }

    oUl0.appendChild(fragment);

    // 添加结构化数据到页面
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(gameListSchema);
    document.head.appendChild(schemaScript);

    // 延迟加载其余游戏
    setTimeout(() => loadRemainingDeskGames(data), 100);
}

// 创建游戏元素
function createGameElement(game, index) {
    const oLi = document.createElement("li");
    const game_icon = gamepath + game.icon;
    const game_name = game.gname.replaceAll("_", " ").replaceAll("-", " ");
    const ahref = "/detail.html?id=" + game.id;

    oLi.innerHTML = `
        <a href="${ahref}" class="I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR XxuAeockFFccwluXvlEw ip${index}">
            <picture class="EtaFjSLj6ZlVyLWzxjzK">
                <source srcset="${game_icon} 1x, ${game_icon} 2x" media="(min-width: 991px)" width="314" height="314">
                <img src="${game_icon}" alt="${game_name}" srcset="${game_icon} 1x,${game_icon} 2x" loading="lazy" decoding="async" width="204" height="204" class="omIThBX9w3QarB_pnFby">
            </picture>
            <span class="MHaP7Us7V6KqGxb8muHM global-cq-title">${game_name}</span>
        </a>
    `;

    return oLi;
}

// 加载剩余的桌面游戏
async function loadRemainingDeskGames(data) {
    const oUl = document.querySelectorAll("#app-root > div.lStd1276e_IhuA3g3FIs.s9w4UjUUDL2klmhRDNdo > div:nth-child(1) > div:nth-child(2)")[0];
    const fragment = document.createDocumentFragment();

    for (let i = 5; i < data.gameList.length; i++) {
        const game = data.gameList[i];
        const gameElement = createGameElement(game, i);
        fragment.appendChild(gameElement);
    }

    oUl.appendChild(fragment);
}

// 优化的移动版游戏加载
async function LoadMobileGames() {
    gameLen = games_infos.gameList.length;
    const len = Math.min(gameLen, lenPerDiv);
    
    await loadMobileGameByStartPos(currentPos, len - 1);
    currentPos += len - 1;

    // 添加无限滚动
    if (typeof IntersectionObserver !== 'undefined') {
        setupInfiniteScroll();
    }
}

// 设置无限滚动
function setupInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && currentPos < gameLen) {
                LoadMoreMobileGames();
            }
        });
    });

    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.height = '20px';
    document.querySelector('.lStd1276e_IhuA3g3FIs.ADMPJVcFvhX6udYDGs_x').appendChild(sentinel);
    observer.observe(sentinel);
}

var currentPos = 0;//当前游戏数量
var lenPerDiv = 24;
var gameLen;

//加载更多的手机游戏
function LoadMoreMobileGames()
{
    var gameLen  = games_infos.gameList.length;
    if(currentPos + lenPerDiv < gameLen ){
        loadMobileGameByStartPos(currentPos,lenPerDiv);
        currentPos += lenPerDiv;
        console.log(currentPos);
    }
    else if(gameLen - currentPos > 0){
        loadMobileGameByStartPos(currentPos,gameLen - currentPos,false);
        currentPos = gameLen;
        console.log(currentPos);
    }

}


function loadMobileGameByStartPos(startPos,divLen,hasBigIcon = true){   
    var data = games_infos;
    mobileGameDisplayEl = document.querySelector(".lStd1276e_IhuA3g3FIs.ADMPJVcFvhX6udYDGs_x");
    var divE = document.createElement("Div");
    divE.className = "vtbwTfQNi80Hes0DzmGs sVO_yY3sP6R0A04SxJ_L";
     for(var i = 0; i < divLen; i++){
        if(startPos + i > data.gameList.length-1){
            break;
        }
        var a = document.createElement("a");
        a.href =  "/detail.html?id=" + data.gameList[startPos + i].id;

        if(i < 10 && hasBigIcon){
            a.className = "I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR XxuAeockFFccwluXvlEw ip" + i.toString();
        }
        else{
            a.className = "I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR";
        }
        
        var game_icon = gamepath + data.gameList[startPos + i].icon;
        var game_name = data.gameList[startPos + i].gname.replaceAll("_"," ");
        var game_name = game_name.replaceAll("-"," ");
        a.innerHTML = '<picture class="EtaFjSLj6ZlVyLWzxjzK"><source srcset="' + game_icon+ ' 1x, ' +game_icon + ' 2x" media="(min-width: 1211px)" width="204" height="204"><img src="' + game_icon + '" alt="Make It Meme" srcset="' +game_icon + ' 1x, ' + game_icon + ' 2x" loading="lazy" decoding="async" width="314" height="314" class="omIThBX9w3QarB_pnFby"></picture><span class="MHaP7Us7V6KqGxb8muHM global-cq-title">' + game_name + '</span>';
        divE.appendChild(a);
     }

     $(".lStd1276e_IhuA3g3FIs.ADMPJVcFvhX6udYDGs_x").children().last().before(divE);
}


function loadCategory(){
    isDesk?loadDeskCategory():loadMobileCategory();
}


function loadDeskCategory() {
    var data = category_infos;
    var cEl1 = document.querySelector("#app-root > div.lStd1276e_IhuA3g3FIs.s9w4UjUUDL2klmhRDNdo > div:nth-child(2) > div:nth-child(1)");
    for (var i = 0; i < 6; i++) {
        var a = document.createElement("a");
        var categoryid = data.categoryList[i].id
        a.href = "./category.html?id=" + categoryid;
        a.className = "DIxbY_Wd8M99mMzbD9Jz WNKx5SMWQkliDlBi9d5r";
        a.innerHTML = '<img src="' + categorypath + data.categoryList[i].icon + '" width="204" height="204" alt="' + data.categoryList[i].name + '" loading="lazy" class="VrWOfVJtTjn2FNJx0TFc" /><span class="QGnVckPD11ZTkQr8o8ci">' + data.categoryList[i].name + '</span>'

        cEl1.appendChild(a);
    }
    var cEl2 = document.querySelector("#app-root > div.lStd1276e_IhuA3g3FIs.s9w4UjUUDL2klmhRDNdo > div:nth-child(2) > div:nth-child(2)");

    for (var i = 6; i < data.categoryList.length; i++) {
        var a = document.createElement("a");
        var categoryid = data.categoryList[i].id
        a.href = "./category.html?id=" + categoryid;
        a.className = "DIxbY_Wd8M99mMzbD9Jz Ll7V72dm63WTr1buD4lg";
        a.innerHTML = '<img src="' + categorypath+ data.categoryList[i].icon + '" width="94" height="94" alt="' + data.categoryList[i].name + '" loading="lazy" class="VrWOfVJtTjn2FNJx0TFc" /><span class="QGnVckPD11ZTkQr8o8ci">' + data.categoryList[i].name + '</span></a>'

        cEl2.appendChild(a);
    }
}

function loadMobileCategory(){
    var data = category_infos;
    mobileGameDisplayEl = document.querySelector(".lStd1276e_IhuA3g3FIs.ADMPJVcFvhX6udYDGs_x");
    var divE = document.createElement("Div");
    divE.className = "vtbwTfQNi80Hes0DzmGs sVO_yY3sP6R0A04SxJ_L";
    for(var i = 0; i < data.categoryList.length; i++){
        var a = document.createElement("a");
        var categoryid = data.categoryList[i].id
        a.href = "./category.html?id=" + categoryid;
        a.className = "DIxbY_Wd8M99mMzbD9Jz Ll7V72dm63WTr1buD4lg";
        a.innerHTML = '<img src="' + categorypath+ data.categoryList[i].icon + '" width="94" height="94" alt="' + data.categoryList[i].name + '" loading="lazy" class="VrWOfVJtTjn2FNJx0TFc" /><span class="QGnVckPD11ZTkQr8o8ci">' + data.categoryList[i].name + '</span></a>'

        divE.appendChild(a);
    }
    mobileGameDisplayEl.appendChild(divE);
}


var searchValue = "";


///显示搜索页面
function openShowSearchPanel() {
    showElement(searchPanelEl);
    showElement(bgEl);
    gameDisplayEl.style.overflow = "hidden";
    filterSearchContent();
}

///显示搜索页面
function closeShowSearchPanel() {
    hideElement(searchPanelEl);
    hideElement(bgEl);
    gameDisplayEl.style.overflow = "auto";
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

        a.href = "/detail.html?id=" + filterData[i].id ;
        a.className = "I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR";
        a.innerHTML = '<img src="' + game_icon + '" ' + game_icon + ' 1x, ' + game_icon + ' 2x" alt="' + game_icon + '" loading="lazy" decoding="async" width="94" height="94" class="omIThBX9w3QarB_pnFby"><span class="MHaP7Us7V6KqGxb8muHM global-cq-title">' + filterData[i].gname + '</span>'

        searchContentEl.appendChild(a);
    }
}


function showMobileSearchContent(filterData){

    for (var i = 0; i < filterData.length; i++) {
        var game_icon = gamepath + filterData[i].icon;
        var name = filterData[i].gname;
        var a = document.createElement("a");
        a.href = "/detail.html?id=" + filterData[i].id ;
        a.className = "Rb7HuIF8jKcIe2nU91ai UoAfP265z4mp2pLVnJgN KoHkUVmXR7joVgQZvggn";
        a.innerHTML = '<img alt="' + name + '" src="' + game_icon + '" srcset="' + game_icon + ' 1x, ' + game_icon + ' 2x" decoding="async" width="40" height="40" class="YBUdSAqsfPvMt4mvmjkA WM2RGMygSCak_g50DlI3"><div class="dyYMg3HqmmbjhYCLC8lg Qsj6z4yh8zGCZDhl_KML"><div class="L7rv0e7LkdrpUjPZq3gH">' + name + '</div><span class="pyOBngxafEnwWKrr93IQ"></span></div><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="lGtOMKHvtki_BSIeZKa5"><use href="#thinArrowIcon"></use></svg>'

        searchContentEl.appendChild(a);
    }


   
}




var last_scroll_top = 0;

window.onload = function () {  
    window.sessionStorage&&(last_scroll_top =window.sessionStorage.getItem("last_scroll_top"),console.log("get:"  + window.sessionStorage.getItem("last_scroll_top")));
    preInit();
    
    loadCategory();
    loadGames();
   
    initElement();
    initUIHandle();
}




var navEl;
var searchContentEl;
var noSearchTipEl;
var searchPanelEl;
var bgEl;
var gameDisplayEl;

var searchBtnEl;
var closeSearchBtnEl;
var categorypath = "/assets/icons/category/";
var gamepath  = "/assets/icons/game/";
var isDesk = true;
var inputSearchEl;

var last_scroll_top = 0;

var userScroll = false;  

function preInit(){

    $(function() { 
    
        // reset flag on back/forward 
        // $.history.init(function(hash){ 
        //     userScroll = false; 
        // }); 
    
        $(document).keydown(function(e) { 
            if(e.which == 33        // page up 
               || e.which == 34     // page dn 
               || e.which == 32     // spacebar
               || e.which == 38     // up 
               || e.which == 40     // down 
               || (e.ctrlKey && e.which == 36)     // ctrl + home 
               || (e.ctrlKey && e.which == 35)     // ctrl + end 
              ) { 
                userScroll = true; 
            } 
        }); 
    
        // detect user scroll through mouse
        // Mozilla/Webkit 
        if(window.addEventListener) {
            document.addEventListener('DOMMouseScroll', mouseEvent, false); 
        }
    
        //for IE/OPERA etc 
        document.onmousewheel = mouseEvent; 
    
    
      
    }); 
    
    userScroll =false;
    isDesk = document.body.className == "DeskVersion" ? true : false;
}

function initElement() {
    navEl = document.querySelector("#nav");
    searchContentEl = isDesk ? document.querySelector(".AbPoNGztukbS1wl5bcmt.yanfEXzbvdGsPis_ItLV"):document.querySelector(".AbPoNGztukbS1wl5bcmt.lcdG68I_Um0yTmQFfvKY"); //搜索显示元素
    noSearchTipEl = document.querySelector("div.zuKNfnid1j68xnLS9ZiH > div.dT3EegLpfzUUgPdDhOfx"); //没有搜索到元素提示显示
    searchPanelEl = isDesk?document.querySelector("#app-root > div:nth-child(1) > section"):document.querySelector(".kWQWzdYW881_EYiVCO5J.JfwQbhsyFVjMXL4TciK2");
    bgEl = document.querySelector(".idzxSUf9DX32i1uhNIuG");
    gameDisplayEl = document.body;
    searchBtnEl =document.querySelector(".ltAYdgxBAJy9br2MmQME > use") ;
    closeSearchBtnEl = isDesk? document.querySelector(".buttonReset.Y8WvtyOECzLsN3k0_OFx") :document.querySelector(".buttonReset.Y8WvtyOECzLsN3k0_OFx.qL3lVMIHyY8jhn2udhLe") ;

}


function initUIHandle() {
    isDesk?initDeskHandle(): initMobileHandle();

}

function initDeskHandle(){
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

        searchValue = inputSearchEl.value;
        showElement(closeSearchBtnEl);
        hideElement(searchBtnEl);

        filterSearchContent();
    });
}


var loadMoreGameFlag = false;

function initMobileHandle(){
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


    document.addEventListener('wheel', function(event) {
       
        loadMoreGameFlag = true;
        userScroll = true;
    });

 
    document.addEventListener('touchstart', function(event) {

        loadMoreGameFlag = true;
        userScroll = true;
    });

    document.addEventListener('touchend', function(event) {
        loadMoreGameFlag = false;
    });

    document.addEventListener('visibilitychange', function logData() {
        if (document.visibilityState === 'hidden') {
            window.sessionStorage && window.sessionStorage.setItem("last_scroll_top",document.body.scrollTop);
            window.sessionStorage && window.sessionStorage.setItem("last_game_count",currentPos);
        }
    });



    window.onscroll = () => {
        var categoryHeight = $(".lStd1276e_IhuA3g3FIs.ADMPJVcFvhX6udYDGs_x").children().last().height();

        if(userScroll){
       
            if(document.body.scrollTop + document.body.clientHeight >= document.body.scrollHeight - categoryHeight - 250){
                if(currentPos + 24 < gameLen || gameLen - currentPos -1 > 0)
                 LoadMoreMobileGames();
                
                
            }
        }
        else{



            if(document.body.scrollTop + document.body.clientHeight >= document.body.scrollHeight - categoryHeight - 250){
                if(currentPos + 24 < gameLen || gameLen - currentPos -1 > 0)
                 if(currentPos <  window.sessionStorage.getItem("last_game_count"))
                     LoadMoreMobileGames();
                 
                 if(currentPos>=window.sessionStorage.getItem("last_game_count")){
                    window.sessionStorage && (document.body.scrollTop = window.sessionStorage.getItem("last_scroll_top"));
                 }
                
            }
          
        }
    
    }
    

   
}

    
   


function mouseEvent(e) { 
    userScroll = true; 
} 



// 隐藏元素
function hideElement(element) {
    element.style.display = 'none';
}

// 显示元素
function showElement(element) {
    element.style.display = 'block'; // 或者之前的值
}

// 导出函数供其他模块使用
window.loadGames = loadGames;
window.loadCategory = loadCategory;
window.LoadMoreMobileGames = LoadMoreMobileGames;