window.AdsSDK = {
  initAds: function () {
    if (adConfig.adsStatus) {
      if (adConfig.adsType === 1) {
        const _script = document.createElement("script");
        _script.setAttribute("async", true);
        _script.setAttribute(
          "src",
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
            adsenseConfig.clientId
        );
        _script.setAttribute("crossorigin", "anonymous");
        document.getElementsByTagName("head")[0].appendChild(_script);
      } else {
        const _script = document.createElement("script");
        _script.setAttribute("async", true);
        _script.setAttribute(
          "src",
          "https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        );
        document.getElementsByTagName("head")[0].appendChild(_script);
        let subScript = document.createElement("script");
        subScript.innerHTML = `window.googletag = window.googletag || {
                    cmd: []
                };
                let banner1Slot;
                let banner2Slot;
                let interSlot;
                googletag.cmd.push(function() {
                    banner1Slot = googletag.defineSlot('/23148459712/banner_1', [320, 50], 'div-gpt-ad-1723167414859-0').addService(googletag.pubads());
                    banner2Slot = googletag.defineSlot('/23148459712/banner_2', [300, 250], 'div-gpt-ad-1723171547114-0').addService(googletag.pubads());
                    interSlot = googletag.defineSlot('/23148459712/insert_1', [300, 250], 'div-gpt-ad-1723167614933-0').addService(googletag.pubads());
                    googletag.pubads().addEventListener("slotRenderEnded", (event) = >{
                        const slot = event.slot;
                        // console.log("Ad response for slot", slot.getSlotElementId(), "received.");
                        // console.log("Is empty?:", event.isEmpty);
                        if (event.isEmpty) {
                            document.getElementById(slot.getSlotElementId()).parentNode.style.display = 'none';
                        }
                    });
                    googletag.pubads().enableSingleRequest();
                    googletag.enableServices();
                });`;
        document.getElementsByTagName("head")[0].appendChild(subScript);
      }
      this.renderOutAds();
    }
  },
  renderOutAds: function () {
    let slotArr =
      adConfig.adsType === 1
        ? adsenseConfig.adOutSlotList
        : adxConfig.adOutSlotList;
    const list = document.querySelectorAll(".out-ads-box");

    for (let i = 0; i < list.length; i++) {
      const styles = list[i].getAttribute("style");
      const ins =
        adConfig.adsType === 1
          ? this.createAdsenseIns(slotArr[i], styles)
          : this.createAdxIns(slotArr[i]);
      if (ins) {
        //console.log("ins", ins, list[i]);
        list[i].appendChild(ins);
      }
    }
  },
  createAdsenseIns: function (id, styles) {
    const _div = document.createElement("div");
    _div.setAttribute("class", "flow-box");
    const _ins = document.createElement("ins");
    _ins.setAttribute("class", "adsbygoogle");
    _ins.setAttribute("style", styles);
    _ins.setAttribute("data-ad-client", adsenseConfig.clientId);
    _ins.setAttribute("data-ad-slot", id);
    _ins.setAttribute("data-ad-format", "auto");
    _ins.setAttribute("data-full-width-responsive", "true");
    const _script = document.createElement("script");
    _script.innerHTML = "(adsbygoogle = window.adsbygoogle || []).push({});";
    _div.appendChild(_ins);
    _div.appendChild(_script);
    return _div;
  },
  createAdxIns: function (item) {
    if (!item) {
      return;
    }
    const _div = document.createElement("div");
    _div.setAttribute("id", item.containerId);
    _div.setAttribute(
      "style",
      `min - width: $ {
            item.size[0]
        }
        px; min - height: $ {
            item.size[1]
        }
        px`
    );
    const _script = document.createElement("script");
    _script.innerHTML = `googletag.cmd.push(function() {
            googletag.display('${item.containerId}');
        });`;
    _div.appendChild(_script);
    return _div;
  },
};

AdsSDK.initAds();
