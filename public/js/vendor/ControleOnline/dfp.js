var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];

document.write = function (text) {
    var element = document.getElementById('testekim');
    element.innerHTML = element.innerHTML + text;
}

var DFP = {
    __construct: (function () {
        document.addEventListener("DOMContentLoaded", function () {
            DFP.run();
        });
    })(),
    removeBanners: function () {
        var remove = window.getElementsByClassName('remove-dfp');
        for (var i = 0; i < remove.length; ++i) {
            var r = remove[i];
            r.parentNode.removeChild(r);
        }
    },
    run: function () {
        var gads = document.createElement('script');
        gads.async = true;
        gads.type = 'text/javascript';
        var useSSL = 'https:' == document.location.protocol;
        gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
        document.head.appendChild(gads);

        googletag.cmd.push(function () {
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
        });
        this.replaceBanners();
    },
    adaptSize: function (dfp_id) {
        var iframe = document.getElementById('iframe-' + dfp_id);
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        innerDoc.addEventListener("DOMSubtreeModified", function () {
            var container = innerDoc.getElementById(dfp_id + '_ad_container');
            if (container) {
                console.log(container.offsetLeft);
                console.log(container.offsetWidth);

                var o = container.getElementsByTagName('embed')[0],
                        w = o.offsetWidth,
                        h = o.offsetHeight,
                        style;
                iframe.contentWindow.scrollTo(o.offsetWidth + (w / 2), o.offsetHeight + (h / 2));
                if (w == 0 && h == 0) {
                    style = 'z-index:-999999999;width:0px;height:0px;background-color:transparent !important;';
                } else {
                    style = 'width: ' + w + 'px;' +
                            'height: ' + h + 'px;' +
                            'z-index:999999999; ' +
                            'position: fixed; ' +
                            'top: 50%;' +
                            'left: 50%;' +
                            'margin-left: -' + (w / 2) + 'px;' +
                            'margin-top: -' + (h / 2) + 'px;' +
                            'border: 0px !important;' +
                            'background-color:transparent !important;';
                }
                iframe.style.cssText = style;
            }
        });
    },
    show: function (slot, size, dfp_id, min_width, max_width) {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if (w >= min_width && (max_width === '0' || w <= max_width)) {
            if (size[0] <= w && size[1] <= h) {
                if (size[0] > 1 && size[1] > 1) {
                    googletag.cmd.push(function () {
                        googletag.defineSlot(slot, [size[0], size[1]], dfp_id).addService(googletag.pubads());
                        googletag.display(dfp_id);
                    });
                } else {
                    var iframe = document.createElement('iframe');
                    iframe.style.cssText = 'background-color:transparent!important;z-index:-999999999;height: 100%; position: fixed; top: 0; left: 0; width: 100%; border: 0px !important';
                    iframe.setAttribute('id', 'iframe-' + dfp_id);
                    iframe.setAttribute('scrolling', 'no');
                    document.getElementById(dfp_id).appendChild(iframe);
                    iframe.contentWindow.document.open();
                    iframe.contentWindow.document.write(this.iframe(slot, dfp_id));
                    iframe.contentWindow.document.close();
                    this.adaptSize(dfp_id);
                }
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    iframe: function (slot, dfp_id) {
        var iframe = '<!DOCTYPE HTML>' +
                '<html lang="en-us">' +
                '<head>' +
                '<meta http-equiv="Content-type" content="text/html; charset=utf-8">' +
                '<title>Widgets Magazine</title>' +
                '<style type="text/css" media="screen">' +
                '</style>' +
                '<script type="text/javascript">' +
                '(function() {' +
                'var useSSL = "https:" == document.location.protocol;' +
                'var src = (useSSL ? "https:" : "http:") + "//www.googletagservices.com/tag/js/gpt.js";' +
                'document.write("<scr" + "ipt src=\\"" + src + "\\"></scr" + "ipt>");' +
                '})();' +
                '</script>' +
                '<script type="text/javascript">' +
                'googletag.cmd.push(function() {' +
                'googletag.pubads().enableSingleRequest();' +
                'googletag.pubads().enableSyncRendering();' +
                'googletag.enableServices();' +
                '});' +
                '</script>' +
                '</head>' +
                '<body>' +
                '<!-- ' + slot + ' -->' +
                '<div id="' + dfp_id + '">' +
                '<script type="text/javascript">' +
                'googletag.cmd.push(function() {' +
                'googletag.defineOutOfPageSlot("' + slot + '", "' + dfp_id + '").addService(googletag.pubads());' +
                'googletag.display("' + dfp_id + '");' +
                '});' +
                '</script>' +
                '</div>' +
                '</body>';
        return iframe;
    },
    replaceBanners: function () {
        var banners = document.getElementsByClassName('dfp');
        for (var i = 0; i < banners.length; ++i) {
            var d = banners[i];
            var b = this.show(d.getAttribute('data-slot'), JSON.parse(d.getAttribute('data-size')), d.getAttribute('id'), d.getAttribute('min-width'), d.getAttribute('max-width'));
            if (!b) {
                d.parentNode.classList.add('remove-dfp');
            }
        }
    }
};
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-22026694-1', 'auto');
ga('send', 'pageview');