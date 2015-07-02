var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
var DFP = {
    init: function () {
        var gads = document.createElement('script');
        gads.async = true;
        gads.type = 'text/javascript';
        var useSSL = 'https:' == document.location.protocol;
        gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
        var node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(gads, node);

        googletag.cmd.push(function () {
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
        });
        this.replaceBanners();
    },
    show: function (slot, size, dfp_id, min_width, max_width) {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if (w >= min_width && (max_width === '0' || w <= max_width)) {
            if (size[0] <= w && size[1] <= h) {
                var d = document.createElement('div'),
                        s = document.createElement('script'),
                        b = document.getElementsByTagName("body")[0];
                s.setAttribute('type', 'text/javascript');
                d.setAttribute('id', dfp_id);

                if (size[0] > 1 && size[1] > 1) {
                    d.setAttribute('style', 'width:' + size[0] + 'px; height:' + size[1] + 'px;');
                    s.innerHTML = 'googletag.cmd.push(function() { ' +
                            'googletag.defineSlot(\'' + slot + '\', [' + size[0] + ',' + size[1] + '], \'' + dfp_id + '\').addService(googletag.pubads());' +
                            'googletag.display(\'' + dfp_id + '\');' +
                            '});';
                    d.appendChild(s);
                    return d;
                } else {
                    s.innerHTML = 'googletag.cmd.push(function() { ' +
                            'googletag.defineOutOfPageSlot(\'' + slot + '\', \'' + dfp_id + '\').addService(googletag.pubads());' +
                            'googletag.display(\'' + dfp_id + '\');' +
                            '});';
                    d.appendChild(s);
                    b.insertAdjacentHTML('afterbegin', '<!-- ' + slot + ' -->');
                    b.insertBefore(d, b.firstChild.nextSibling);

                }
            }
        }
    },
    replaceBanners: function () {
        var banners = document.getElementsByClassName('dfp'), d, content;
        for (var i = 0; i < banners.length; ++i) {
            d = banners[i];
            content = this.show(d.getAttribute('data-slot'), JSON.parse(d.getAttribute('data-size')), d.getAttribute('data-id'), d.getAttribute('min-width'), d.getAttribute('max-width'));
            if (content) {
                if (!d.innerHTML) {
                    d.innerHTML = '<!-- ' + d.getAttribute('data-slot') + ' -->';
                    d.appendChild(content);
                }
            } else {
                d.innerHTML = '<!-- Nenhum conteúdo para exibir aqui nesta resolução -->';
            }
        }
    }
};
document.addEventListener("DOMContentLoaded", function () {
    DFP.init();
});