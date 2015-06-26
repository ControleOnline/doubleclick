var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
var DFP = function () {
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
    function DFP(slot, size, dfp_id, force_mobile) {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if (force_mobile || (size[0] <= w && size[1] <= h)) {
            var d = document.createElement('div');
            d.setAttribute('id', dfp_id);
            d.setAttribute('style', 'width:' + size[0] + 'px; height:' + size[1] + 'px;');
            var s = document.createElement('script');
            s.setAttribute('type', 'text/javascript');
            s.innerHTML = 'googletag.cmd.push(function() { ' +
                    'googletag.defineSlot(\'' + slot + '\', [' + size[0] + ',' + size[1] + '], \'' + dfp_id + '\').addService(googletag.pubads());' +
                    'googletag.display(\'' + dfp_id + '\');' +
                    '});';
            d.appendChild(s);
            return d;
        }
    }
    function replaceBanners() {
        var dfp = document.getElementsByClassName('dfp');
        for (var i = 0; i < dfp.length; i++) {
            var d = dfp[i];
            var content = DFP(d.getAttribute('data-slot'), JSON.parse(d.getAttribute('data-size')), d.getAttribute('data-id'));
            if (content) {
                d.innerHTML = '<!-- ' + d.getAttribute('data-slot') + ' -->';
                d.appendChild(content);
            }
        }
    }
    replaceBanners();

}
document.addEventListener("DOMContentLoaded", function() {
  DFP();
});