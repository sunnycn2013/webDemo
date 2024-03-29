/*! mping 21-07-2015 */
 ! 
function(b) {
    function c(a) {
        this._init(),
        "function" == typeof a && (this.ready = a);
        var b = this;
        document.addEventListener("DOMContentLoaded", 
        function() {
            b.ready()
        },
        !1)
    }
    function d(a) {
        this.name = a
    }
    function e() {
        d.call(this, "PV", null),
        this.type = k.Type.PV,
        this.setTs("page_ts"),
        this.setPageParam(),
        this.setSourceParam()
    }
    function f(a) {
        d.call(this, "Click", null),
        this.type = k.Type.CLICK,
        this.event_id = a,
        this.setTs("click_ts"),
        this.setPageParam()
    }
    function g(a, b) {
        f.call(this, a, null),
        this.reportAsOrder(b)
    }
    function h(a) {
        f.call(this, a, null)
    }
    function i(a) {
        d.call(this, "Order", null),
        this.type = k.Type.ORDER,
        this.prod_id = a,
        this.setTs("order_ts")
    }
    function j() {}
    var k = {
        ProjectId: "3",
        Biz: "mba",
        Key: "5YT%aC89$22OI@pQ",
        Method: {
            bpReport: "bp.report",
            bpSearch: "bp.search"
        },
        Client: {
            IOS_M: {
                UAname: "iPhone",
                value: "IOS-M"
            },
            ANDROID_M: {
                UAname: "android",
                value: "ANDROID-M"
            },
            IPAD_M: {
                UAname: "iPad",
                value: "iPad-M"
            },
            MICRO_M: {
                UAname: "MicroMessenger",
                value: "WEIXIN-M"
            },
            MM: {
                UAname: "MM",
                value: "M-M"
            }
        },
        Type: {
            PV: "1",
            PERFORMANCE: "2",
            CLICK: "3",
            ORDER: "4"
        },
        Storage: {
            current: "mba_cur_series",
            cached: "mba_cached_series"
        },
        MCookie: {
            sessionCookieTimeout: 18e5,
            visitorCookieTimeout: 15552e6
        }
    },
    l = {
        common: {
            report_ts: "",
            method: "",
            token: "",
            proj_id: "",
            biz: "",
            uid: "",
            pinid: "",
            guid: "",
            client: "",
            appv: "",
            resolu: "",
            device: "",
            osv: "",
            build: "",
            net_type: "",
            sdkv: "",
            channel: ""
        }
    };
    c.prototype = {
        _init: function() {
            this.initCommonData(),
            this.initUid()
        },
        initCommonData: function() {
            var a = c.tools.Tools,
            d = c.tools.md5,
            e = k.Client,
            f = l.common,
            g = navigator.userAgent;
            if (g.indexOf("jdapp") > -1) {
                var h = g.split(";");
                h[1] == e.IOS_M.UAname ? f.client = e.IOS_M.value: h[1] == e.ANDROID_M.UAname ? f.client = e.ANDROID_M.value: h[1] == e.IPAD_M.UAname && (f.client = e.IPAD_M.value),
                f.device = f.client,
                f.appv = h[2],
                f.osv = h[3],
                f.guid = h[4]
            } else f.client = g.indexOf(e.MICRO_M.UAname) > -1 ? e.MICRO_M.value: e.MM.value,
            f.device = this._getOs();
            f.proj_id = k.ProjectId,
            f.biz = k.Biz,
            f.method = k.Method.bpReport,
            f.report_ts = a.getCurTime(),
            f.resolu = b.innerWidth + "*" + b.innerHeight,
            f.token = d.hex_md5(f.report_ts + k.Key),
            f.reserved1 = this._getShortRefer(document.referrer),
            f.reserved3 = this._reservedCookies()
        },
        _reservedCookies: function() {
            for (var a = c.tools.Tools, b = ["__jda", "__jdv", "__jdb", "__jdu", "__jdb", "mu_subsite", "mt_xid", "unpl"], d = [], e = 0, f = b.length; f > e; e++) d.push(a.getCookie(b[e]));
            return d.join("_").replace(/\|/g, "_")
        },
        _getShortRefer: function(a) {
            if (!a) return "";
            if (a.indexOf("360buy.com") > -1 || a.indexOf("jd.com") > -1 || a.length < 128) return a;
            var b = c.tools.Tools,
            d = ["word", "wd", "text", "p", "keyword", "q"],
            e = [];
            if (a.indexOf("?") > -1) {
                for (var f = 0; f < d.length; f++) {
                    var g = b.getParameter(a, d[f]);
                    g && e.push(d[f] + "=" + g)
                }
                return a.substr(0, a.indexOf("?") + 1) + e.join("&")
            }
            return a
        },
        _getOs: function() {
            var a = navigator.userAgent.toLowerCase(),
            b = /android|iphone|ipad|ipod|windows phone|symbianos|nokia|bb/,
            c = /linux|windows|mac|sunos|solaris/,
            d = b.exec(a) || c.exec(a);
            return null == d ? "other": d[0]
        },
        initUid: function() {
            {
                var a = c.tools.Tools; (new Date).getTime()
            }
            if (a.isEmbedded() || a.isMobile()) {
                var d = new o,
                e = d.getSidSeq();
                this.options.mba_muid = d.getMuid(),
                this.options.mba_sid = e[0],
                this.privates.mba_seq = e[1],
                a.isEmbedded() && (this.privates.pv_sid = e[0], this.privates.pv_seq = e[1])
            }
            var f = a.getCookie("pinId");
            this.options.pinid = f ? f: "",
            this.options.uid = f ? f: "",
            this.options.pin_sid = a.getParameter(b.location.href, "sid") || a.getCookie("sid")
        },
        send: function(a, b) {
            this.isSpider() || this.sendByRequest(a, b)
        },
        sendByRequest: function(a, c) {
            var d = new b.XMLHttpRequest;
            d.open("POST", document.location.protocol + "//stat.m.jd.com/stat/access", !0),
            d.setRequestHeader("Content-Type", "text/plain"),
            d.onreadystatechange = function() {
                4 == d.readyState && (c && c(), d = null)
            };
            var e = JSON.stringify(this.getReportData(a));
            d.send(e)
        },
        getReportData: function(a) {
            var b = c.tools.Tools,
            d = {
                data: []
            };
            if (b.extend(d, l.common), b.extend(d, this.options), a instanceof c.Request) {
                var e = a.getReportObj();
                e.pinid = this.options.pinid,
                e.uid = this.options.uid,
                e.mba_seq = this.privates.mba_seq,
                b.isEmbedded() && (e.pv_sid = this.privates.pv_sid, e.pv_seq = this.privates.pv_seq),
                d.data.push(e)
            }
            return d
        },
        isSpider: function() {
            var a = navigator.userAgent,
            b = /Googlebot|Feedfetcher-Google|Mediapartners-Google|Adsbot-Google|Sogou\s{1}web\s{1}spider|Sogou\s{1}inst\s{1}spider|Sogou\s{1}inst\s{1}spider\/4\.0|HaoSouSpider|360Spider|Baiduspider|bingbot|qihoobot|YoudaoBot|Sosospider|Sogou\s{1}web\s{1}spider|iaskspider|msnbot|Yahoo!\s{1}Slurp|Yahoo!\s{1}Slurp\s{1}China|yisouspider|msnbot/,
            c = b.test(a);
            return c
        }
    },
    c.prototype.options = {
        uid: "",
        pinid: "",
        mba_muid: "",
        mba_sid: "",
        pin_sid: ""
    },
    c.prototype.privates = {
        mba_seq: "",
        pv_sid: "",
        pv_seq: ""
    },
    c.prototype.ready = function() {},
    c.Request = d,
    d.prototype.getReportObj = function() {
        var a = {};
        for (var b in this)"function" != typeof this[b] && "name" !== b && (a[b] = this[b] ? this[b] + "": "");
        return a
    },
    d.prototype.getTime = function() {
        var a = (new Date).valueOf() / 1e3 + "";
        return a
    },
    d.prototype.setTs = function(a) {
        this[a] = this.getTime()
    },
    d.prototype.setPageParam = function() {
        var a = this.getUrlInfo();
        this.page_name = a[0],
        this.page_param = a[1]
    },
    d.prototype.getUrlInfo = function(a) {
        a || (a = b.location.href);
        var c = a.split("#")[0].split("?");
        return c
    },
    e.prototype = new d,
    e.prototype.setSourceParam = function() {
        var a = b.location.search,
        d = c.tools.Tools,
        e = ["utm_source", "utm_medium", "utm_term", "utm_campaign"],
        f = new RegExp(".*(" + e.join("|") + ")=.*");
        if (f.test(a)) for (var g = d.getSearchObj(a), h = 0, i = e.length; i > h; h++) {
            var j = e[h];
            this[j] = g[j]
        }
    },
    f.prototype = new d,
    f.prototype.updateEventSeries = function() {
        c.EventSeries && c.EventSeries.updateSeries(this)
    },
    f.attachEvent = function(a) {
        if (!f.attachedEvent) {
            a || (a = "J_ping");
            var d = "touchstart" in b ? "touchstart": "click",
            e = document.querySelector("body"),
            g = c.tools.Tools;
            e.addEventListener(d, 
            function(d) {
                for (var f, h = d.target; h != e;) {
                    if (h.className && h.className.indexOf(a) > -1) {
                        f = h;
                        break
                    }
                    h = h.parentNode ? h.parentNode: e
                }
                if (f) {
                    var i = g.attr(f, "href"),
                    j = (function() {
                        return function() {
                            i && /http:\/\/.*?/.exec(i) && "_blank" !== g.attr(f, "target") && (b.location.href = i)
                        }
                    } (), f.getAttribute("report-eventid") ? f.getAttribute("report-eventid") : ""),
                    k = f.getAttribute("report-pagename") ? f.getAttribute("report-pagename") : "",
                    l = f.getAttribute("report-pageparam") ? f.getAttribute("report-pageparam") : "",
                    m = new c.inputs.Click(j),
                    n = new c;
                    m.event_param = f.getAttribute("report-eventparam") ? f.getAttribute("report-eventparam") : "",
                    k && (m.page_name = k),
                    l && (m.page_param = l),
                    m.updateEventSeries(),
                    n.sendByRequest(m),
                    i && /http:\/\/.*?/.exec(i) && "_blank" !== g.attr(f, "target") && (d.preventDefault ? d.preventDefault() : d.returnValue = !1, setTimeout(function() {
                        b.location.href = i
                    },
                    100))
                }
            },
            !1),
            f.attachedEvent = !0
        }
    },
    g.prototype = new f,
    g.prototype.addSeries = function(a) {
        c.EventSeries.addSeries(a)
    },
    g.prototype.reportAsOrder = function(a) {
        if (a) {
            var b = new i(a),
            d = new c;
            d.send(b)
        }
    },
    h.prototype = new f,
    h.prototype.deleteSeries = function(a) {
        var b = c.tools.Tools;
        if (b.isArray(a)) for (var d = 0, e = a.length; e > d; d++) c.EventSeries.deleteSeries(a[d]);
        else c.EventSeries.deleteSeries(a)
    },
    i.prototype = new d,
    i.prototype.deleteSeries = function(a) {
        c.EventSeries.deleteSeries(a)
    },
    i.prototype.setPageParam = function() {},
    i.prototype.setParams = function() {
        c.tools.Tools
    },
    c.inputs = {},
    c.inputs.PV = e,
    c.inputs.Click = f,
    c.inputs.AddCart = g,
    c.inputs.RmCart = h,
    c.inputs.Order = i;
    var m = {
        eventSeries: {},
        getSeries: function() {
            var a = c.tools.Tools,
            b = new o,
            d = b.getSidSeq(),
            e = {
                m_source: a.isEmbedded() ? "1": "0",
                mba_muid: b.getMuid(),
                mba_sid: d[0] + "",
                event_series: this.eventSeries,
                jda: a.getCookie("__jda")
            };
            return a.isEmbedded() && (e.pv_sid = d[0] + "", e.pv_seq = d[1] + "", e.pv_timestamp = (new Date).getTime() + ""),
            JSON.stringify(e)
        },
        androidSeries: function() {
            var a = this.getSeries();
            try {
                b.AndriodPing.setSeries(a)
            } catch(c) {}
        },
        writeSeries: function(a) {},
        updateSeries: function(a) {
            if (c.tools.Tools.isEmbedded()) {
                var b = a.event_id,
                d = b && c.events && c.events.map[b];
                d && (this.eventSeries.event_id = b, this.eventSeries.event_level = d, this.eventSeries.event_param = a.event_param, this.eventSeries.page_name = a.page_name, this.eventSeries.page_param = a.page_param)
            }
        },
        addSeries: function(a) {
            var b,
            c,
            d,
            e = this.getCookiePart("mba_cur_com"),
            f = this.getCookiePart("mba_cur_e"),
            g = {};
            if (f || (f = {}), e) for (b = e.split("!"), c = 0, d = b.length; d > c; c++) {
                var h = b[c].split("=");
                g[h[0]] = h[1]
            }
            g[a] = f,
            this.setCookiePart("mba_cur_com", this.param(g, "=", "!"))
        },
        deleteSeries: function() {
            var b,
            c,
            d,
            e = this.getCookiePart("mba_cur_com"),
            f = {};
            if (e) {
                for (b = e.split("!"), c = 0, d = b.length; d > c; c++) {
                    var g = b[c].split("=");
                    g[0] != a && (f[g[0]] = g[1])
                }
                this.setCookiePart("mba_cur_com", this.param(f, "=", "!"))
            }
        },
        subCookieParts: {},
        getCookiePart: function() {
            try {
                var b = "mba_event_series=",
                c = document.cookie.indexOf(b),
                d = null,
                e = "";
                if (! (c > -1)) return null;
                if (d = document.cookie.indexOf(";", c), -1 == d && (d = document.cookie.length), d = document.cookie.substring(c + b.length, d), 0 < d.length) {
                    for (b = d.split("&"), c = 0, d = b.length; d > c; c++) {
                        var f = b[c].split("=");
                        if (decodeURIComponent(f[0]) == a) {
                            e = decodeURIComponent(f[1]);
                            break
                        }
                    }
                    return e
                }
            } catch(g) {
                return null
            }
        },
        setCookiePart: function(a, b) {
            if (b) try {
                this.subCookieParts = this.getAllSubCookies(),
                a = a.toString(),
                b = b.toString(),
                this.subCookieParts[encodeURIComponent(a)] = encodeURIComponent(b),
                this.setSubCookieValue()
            } catch(c) {}
        },
        getAllSubCookies: function() {
            var a = "mba_event_series=",
            b = document.cookie.indexOf(a),
            c = null,
            d = {};
            if (b > -1) {
                if (c = document.cookie.indexOf(";", b), -1 == c && (c = document.cookie.length), c = document.cookie.substring(b + a.length, c), 0 < c.length) for (a = c.split("&"), b = 0, c = a.length; c > b; b++) {
                    var e = a[b].split("=");
                    d[decodeURIComponent(e[0])] = decodeURIComponent(e[1])
                }
                return d
            }
            return {}
        },
        setSubCookieValue: function() {
            var a = "mba_event_series=",
            b = [];
            for (var c in this.subCookieParts) c && "function" != typeof this.subCookieParts[c] && b.push(c + "=" + this.subCookieParts[c]);
            0 < b.length && (a += b.join("&"), a += "; path=/; domain=" + this.getDomain() + ";", document.cookie = a, this.subCookieParts = {})
        },
        getDomain: function() {
            return c.tools.Tools.getTopDomain()
        },
        param: function(a, b, c) { (void 0 === b || null === b) && (b = "="),
            (void 0 === c || null === c) && (c = "&");
            var d = [];
            for (var e in a)"function" != typeof this[e] && d.push(new Array(e, b, this[e]).join(""));
            return d.join(c)
        }
    };
    c.EventSeries = m,
    j.prototype = {
        getCurTime: function() {
            var a = (new Date).valueOf() / 1e3 + "";
            return a
        },
        getUniq: function() {
            for (var a = (new Date).getTime() + "-", b = 1; 18 >= b; b++) {
                var c = Math.floor(16 * Math.random()).toString(16);
                a += c
            }
            return a
        },
        extend: function(a) {
            if (!this.isObject(a)) return a;
            for (var b, c, d = 1, e = arguments.length; e > d; d++) {
                b = arguments[d];
                for (c in b) Object.prototype.hasOwnProperty.call(b, c) && b[c] && (a[c] = b[c])
            }
            return a
        },
        isObject: function(a) {
            var b = typeof a;
            return "object" === b && !!a
        },
        isArray: function(a) {
            return "[object Array]" === Object.prototype.toString.call(a)
        },
        isString: function(a) {
            return "[object String]" === Object.prototype.toString.call(a)
        },
        isFunction: function(a) {
            return "[object Function]" === Object.prototype.toString.call(a)
        },
        isMobile: function() {
            return ! 0
        },
        isEmbedded: function() {
            return navigator.userAgent.indexOf("jdapp") > -1
        },
        attr: function(a, b) {
            var c;
            return a && 1 !== a.nodeType ? void 0: !(c = a.getAttribute(b)) && b in a ? a[b] : c
        },
        getCookie: function(a) {
            var b = document.cookie.match(new RegExp("(^| )" + a + "=([^;]*)(;|$)"));
            return null != b ? decodeURI(b[2]) : null
        },
        setCookie: function(a, b, c) {
            var d = new Date; (null === c || void 0 === c) && (c = 18e5),
            d.setTime(d.getTime() + c),
            document.cookie = a + "=" + encodeURI(b) + ";expires=" + d.toGMTString() + ";path=/;domain=" + this.getRootDomain(this.getDomain()) + ";"
        },
        getRootDomain: function(a) {
            a = a.replace(/\/$/gi, ""),
            a = a.replace(/^(http|ftp|https|ssh):\/\//gi, ""),
            a = a.replace(/(.com|.info|.net|.org|.me|.mobi|.us|.biz|.xxx|.ca|.mx|.tv|.ws|.com.ag|.net.ag|.org.ag|.ag|.am|.asia|.at|.be|.com.br|.net.br|.com.bz|.net.bz|.bz|.cc|.com.co|.net.co|.com.co|.co|.de|.com.es|.nom.es|.org.es|.es|.eu|.fm|.fr|.gs|.co.in|.firm.in|.gen.in|.ind.in|.net.in|.org.in|.in|.it|.jobs|.jp|.ms|.com.mx|.nl|.nu|.co.nz|.net.nz|.org.nz|.se|.tc|.tk|.com.tw|.idv.tw|.org.tw|.tw|.co.uk|.me.uk|.org.uk|.vg|.com.cn|.gov|.gov.cn|.cn)$/gi, "%divide%$1");
            var b = a.split("%divide%")[1];
            "undefined" == typeof b && (b = ""),
            a = a.split("%divide%")[0];
            var c = a.split(".");
            return "." + c[c.length - 1] + b
        },
        getDomain: function() {
            var a = b.location.href;
            return a = a.replace(/^(http|ftp|https|ssh):\/\//gi, ""),
            a.split("/")[0]
        },
        getTopDomain: function() {
            var a = (location.hostname + "/").match(/[\w-]+\.(com|info|net|org|me|mobi|hk|us|biz|xxx|ca|mx|tv|ws|am|asia|at|be|bz|cc|co|de|nom|es|eu|fm|fr|gs|firm|gen|ind|in|it|jobs|jp|ms|nl|nu|se|tc|tk|idv|tw|vg|gov|cn|ha)(\.(cn|hk|jp|tw|kr|mo|uk|ag|es|co|nz|in|br|bz|mx))*\//gi);
            return a ? 0 < a.length ? a[0].substr(0, a[0].length - 1) : void 0: document.domain
        },
        contains: function(a, b) {
            return a.indexOf(b) > -1
        },
        getSearchObj: function(a) {
            a || (a = location.search);
            for (var b = (a + "").replace(/(&amp;|\?)/g, "&").split("&"), c = {},
            d = 0, e = b.length; e > d; d++) {
                var f = b[d].indexOf("="); - 1 != f && (c[b[d].substr(0, f).replace(/[^a-zA-Z0-9_]/g, "")] = decodeURIComponent(b[d].substr(f + 1)))
            }
            return c
        },
        getParameter: function(a, b) {
            var c = a.match(RegExp("(^|&|\\?|#)(" + b + ")=([^&#]*)(&|$|#)", ""));
            return c ? c[3] : null
        },
        compare: function(a, b) {
            var c,
            d = a.split("."),
            e = b.split("."),
            f = parseFloat(d[0]),
            g = parseFloat(d[1]),
            h = parseFloat(e[0]),
            i = parseFloat(e[1]);
            return c = f > h ? a: f == h && g >= i ? a: b
        }
    };
    var n = new j,
    o = function() {
        if (o._instance) return o._instance;
        o._instance = this;
        var a,
        b;
        return this.getMuid = function() {
            return this.setMuid(),
            a[0]
        },
        this.getSidSeq = function() {
            var a;
            this.setSid(),
            a = (b || []).slice(0);
            for (var c = 0; c < a.length; c++) a[c] = a[c] + "";
            return a
        },
        this.setMuid = function() {
            a[0] = n.getCookie("mba_muid") ? n.getCookie("mba_muid").split(".")[0] : n.getUniq(),
            this.setMuidCookie()
        },
        this.setSid = function(a) {
            return n.isEmbedded() ? void this.setPVSid(a) : (n.getCookie("mba_sid") ? (b = n.getCookie("mba_sid").split("."), b[1] = 1 * (void 0 == b[1] ? 1: b[1]) + ("pv" === a ? 1: 0)) : (b[0] = (new Date).getTime() + "" + parseInt(1e16 * Math.random()), b[1] = "pv" === a ? 1: 0), void this.setSidCookie())
        },
        this.setPVSid = function(c) {
            var d,
            e,
            f,
            g = navigator.userAgent,
            h = g.indexOf("pv/");
            if (h > -1) {
                var i = g.indexOf(";", h);
                0 > i && (i = g.length),
                d = g.substring(h + 3, i)
            } else d = "1.0";
            if (n.getCookie("mba_sid")) e = n.getCookie("mba_sid");
            else {
                var j = n.getCookie("mba_muid"),
                l = j.split(".");
                if (3 == l.length) {
                    var m = l[1],
                    o = parseInt(l[2]);
                    e = (new Date).getTime() - o > k.MCookie.sessionCookieTimeout ? [1 * m + 1, 0].join(".") : [m, 0].join(".")
                } else e = "1.0"
            }
            f = n.compare(d, e),
            b[0] = f.split(".")[0],
            b[1] = 1 * (f.split(".")[1] ? f.split(".")[1] : 0) + ("pv" === c ? 1: 0),
            a[1] = b[0],
            a[2] = (new Date).getTime(),
            this.setSidCookie(),
            this.setMuidCookie()
        },
        this.setMuidCookie = function() {
            n.setCookie("mba_muid", a.join("."), k.MCookie.visitorCookieTimeout)
        },
        this.setSidCookie = function() {
            n.setCookie("mba_sid", b.join("."), k.MCookie.sessionCookieTimeout)
        },
        this.initialize = function() {
            return a = [],
            b = [],
            this.setMuid(),
            this.setSid("pv"),
            this
        },
        this.initialize(),
        o._instance
    }; ! 
    function() {
        n.isMobile() && new o
    } (),
    c.tools || (c.tools = {}),
    c.tools.Tools = n,
    b.MPing = c
} (window),
function() {
    var a = {
        MHome_FocusPic: 1,
        Mhome_Classification: 1,
        Mhome_Cart: 1,
        MRecharge_Recharge: 1,
        MHome_Lottery: 1,
        MHome_MyJD: 1,
        MHome_HandSeckill: 1,
        MHome_ActivitiesInFloors: 1,
        MHome_ThemeHall: 1,
        MHome_Searchthi: 2,
        MHome_Search: 1,
        MHome_SearchDropDownAssociationalWords: 1,
        MHome_SearchDropDownHistoryWords: 1,
        MHome_AirTicket: 1,
        MHome_Icons: 1,
        MHomeGuessYouLike_Login: 1,
        MHomeGuessYouLike_Products: 1,
        MHomeGuessYouLike_Similarities: 1,
        MHomeSimilarities_Products: 1,
        MHome_FloatEntrance: 1,
        MHome_BacktoTop: 1,
        MVirtual_ProductDetail_Expose: 1,
        MProductList_Search: 2,
        MSearch_Search: 2,
        MSearch_SearchButton: 2,
        MSearch_Searchthi: 2,
        MSearch_SearchDropDownAssociationalWords: 2,
        MSearch_HistoryRecords: 2,
        MSearch_HotWords: 2,
        MSearch_Productid: 3,
        MCommonHead_NavigateButton: 1,
        MCommonHead_home: 1,
        MCommonHead_CategorySearch: 1,
        MCommonHead_Cart: 1,
        MCommonHead_MYJD: 1,
        MCommonHTail_Account: 1,
        MCommonHTail_ToTop: 1,
        MCommonHTail_ClientApp: 1,
        MDownLoadFloat_OpenNow: 1,
        MGroupBuy_ChannelIcons: 2,
        MJingDouHome_Activity: 2,
        MJingDouHome_JindouExCoupon: 2,
        MJingDouHome_JingdouBuyLottery: 2,
        MJingDouHome_Jump: 2,
        MJingDouHome_Cut: 2,
        MJingDouHome_ProductPic: 2,
        MJingDouShare_GetMyJingdou: 2,
        MJingDouJigsaw_Jigsaw_Expose: 2,
        MMyJDOrders_Categories: 2,
        MMyJDFollowed_Commodities: 2,
        MMyJDFollowed_Shops: 2,
        MMyJDFollowed_Commodity: 2,
        MMyJDFollowed_Shop: 2,
        MMyJDBrowsedHistory_Commodites: 2,
        MMyJDService_Categories: 2,
        MMyJDAccountManage_Categories: 2,
        MMyJD_Ordersnotpay: 2,
        MMyJD_Ordersnotreceiving: 2,
        MMyJD_MyMessages: 2,
        MMyJD_FuntionMenus: 2,
        MMyJD_GuessYouLike: 2,
        MHandSecKill_Commodity: 2,
        MHandSecKill_Tag: 2,
        MHandSecKill_GotoAPPA: 2,
        Jshop_FocusPic: 4,
        Jshop_ProductID: 4,
        Jshop_CategoryTab: 4,
        Jshop_ProductID_Category: 4,
        Jshop_Navigation: 4,
        Jshop_CountDown: 4,
        Jshop_Lottery: 4,
        Jshop_GroupBuy: 4,
        Jshop_ShopRec: 4,
        Jshop_PromoRec: 4,
        Jshop_PromoTurns: 4,
        Jshop_PreSale: 4,
        Jshop_Html_Content: 4,
        Jshop_ImgWord: 4,
        Jshop_PullDown: 4,
        Jshop_PullDown_ProductID: 4,
        Jshop_AddtoCart: 4,
        MActivity_Productid: 4,
        MActivity_Share: 4,
        MActivity_DownloadApp: 4,
        Mactivity_ReturnHome: 4,
        MActivity_Button001: 4,
        MActivity_Button002: 4,
        MActivity_Button003: 4,
        MActivity_Button004: 4,
        MActivity_Button005: 4,
        MActivity_Button006: 4,
        MActivity_Button007: 4,
        ScantoGift_Upload: 4,
        ScantoGift_UploadSuccess: 4,
        ScantoGift_UploadFail: 4,
        "3DStreet_Building": 4,
        "3DStreet_BoardURL": 4,
        "3DStreet_JDButton": 4,
        "3DStreet_CategoryURL": 4,
        "3DStreet_Game": 4,
        "3DStreet_Share": 4,
        BrandStreet_BrandSaleTab: 4,
        BrandStreet_BrandShowTab: 4,
        BrandStreet_BrandNewTab: 4,
        BrandStreetSale_Activityid: 4,
        BrandStreetSale_BrandPic: 4,
        BrandStreetSale_SortbySale: 4,
        BrandStreetSale_SortbyAmount: 4,
        BrandStreetSale_Productid: 4,
        BrandStreetShow_FocusPic: 4,
        BrandStreetShow_Category: 4,
        BrandStreetShow_Activityid: 4,
        Shopping1111A_Bargain: 4,
        Shopping1111A_BrandToday: 4,
        Shopping1111A_Floor: 4,
        Shopping1111B_ToUrl: 4,
        Accessory_CategoryFilter: 4,
        Accessory_Category: 4,
        Accessory_BrandFilter: 4,
        Accessory_Brand: 4,
        Accessory_Filter: 4,
        Accessory_Productid: 4,
        Accessory_ProductMore: 4,
        AccessoryDetail_SortbyAmount: 4,
        AccessoryDetail_SortbyEvaluate: 4,
        AccessoryDetail_SortbyPrice: 4,
        AccessoryDetail_SortbyNew: 4,
        MProductShow_ProductSku: 4,
        MPresell_GetPermission: 4,
        MPresell_Rule: 4,
        MPresell_Reserve: 4,
        MPresell_AddtoCart: 4,
        MPresell_Productid: 4,
        MPresell_Confirm: 4,
        MPresell_Cancel: 4,
        MCutiPhone_StrollMall: 4,
        MCutiPhone_DetailRule: 4,
        MCutiPhone_HelpCutPrice: 4,
        MCutiPhone_HelpShare: 4,
        MCutiPhone_JoinTogether: 4,
        MCutiPhone_InformTa: 4,
        MCutiPhone_StrollButtom: 4,
        MCutiPhone_SharetoAll: 4,
        MTCL_CustomizeTCL: 4,
        MTCL_MyCustomization: 4,
        MTCL_ChoosePanel: 4,
        MTCL_ChooseRemoter: 4,
        MTCL_ChooseLabel: 4,
        MTCL_PersonalLabel: 4,
        MTCL_ThisIsIt: 4,
        MTCL_OrderDetail: 4,
        MMCD_APlanReduce5: 4,
        MMCD_APlanPayOnline: 4,
        MMCD_BPlanReduce5: 4,
        MMCD_BPlanPayOnline: 4,
        MMCDDownLoad_DownloadNow: 4,
        MMCD_AddToCart: 4,
        MMCD_GoRegister: 4,
        MTSWCJingCoupon_GetVouchers: 4,
        MTSWCFirstLinkVote_Submit: 4,
        MTSWCFirstLinkVoteResult_Next: 4,
        MTSWCFirstLinkPersonalCouppon_GetVouchers: 4,
        MTSWCFirstLinkPersonalCouppon_NextLink: 4,
        MTSWCFirstLinkPersonalCouppon_Invite: 4,
        MTSWCSecondLinkVote_Submit: 4,
        MTSWCStarVoteWin_Next: 4,
        MTSWCScore_GetVouchers: 4,
        MTSWCScore_MoreFunInvestment: 4,
        MobileWare_TreasureBoxEntrance: 4,
        MMobileWareLocate_Search: 4,
        MMobileWareLocate_Searchthi: 4,
        MMobileWareLocate_Locating: 4,
        MMobileWareLocate_HistoryAddr: 4,
        MMobileWareLocate_AssociateAddr: 4,
        MMobileWareCommonHead_GoToCart: 4,
        MMobileWareCommonHead_ChangeAddr: 4,
        MMobileWareProductList_BackToTop: 4,
        MMobileWareProductList_Product: 4,
        MMobileWareProductDetail_ProductMsg: 4,
        MMobileWareProductDetail_ProductIntroduction: 4,
        MMobileWareProductDetail_ProductSpecification: 4,
        MMobileWareProductDetail_ProductPackage: 4,
        MMobileWareProductDetail_AddToCart: 4,
        MMobileWareProductDetail_DeliveryAddr: 4,
        MMobileWareCart_DeleteProduct: 4,
        MMobileWareCart_NumIncrease: 4,
        MMobileWareCart_NumDecrease: 4,
        MMobileWareCart_SelectAll: 4,
        MMobileWareCart_CheckOut: 4,
        MMobileWareCheckout_ChangeAddr: 4,
        MMobileWareCheckout_MapCoordinate: 4,
        MMobileWareCheckout_OrderSubmit: 4,
        MMobileWareCheckout_PaperInvoice: 4,
        MYuepao_FireCrackersForFree: 4,
        MYuepao_Share: 4,
        MYuepao_SetoffAndGetPrize: 4,
        MYuepao_AskforGift: 4,
        MYuepao_GotoNewYearShop: 4,
        MYuepao_NewYearRaffle: 4,
        MYuepao_Regulation: 4,
        MYuepao_OnceAgain: 4,
        MYuepao_IGive: 4,
        MYuepao_IWantPlay: 4,
        MYuepao_UpdateNow: 4,
        MYuepao_HelpFriend: 4,
        MYuepao_TellOthers: 4,
        Shopcart_Productid: 5,
        Shopcart_Stroll: 5,
        Shopcart_Label: 5,
        Shopcart_Getresent: 5,
        Shopcart_Warranty: 5,
        Shopcart_Pay: 5,
        Shopcart_AddtoCart: 5,
        Shopcart_Present: 5,
        MProductdetail_Photo: 5,
        MProductdetail_Productinfo: 5,
        MProductdetail_Saleinfo: 5,
        MProductdetail_Shopid: 5,
        MProductdetail_GuessYouLike: 5,
        MProductdetail_Addtocart: 5,
        MProductdetail_Easybuy: 5,
        MProductdetail_GotoCart: 5,
        MProductdetail_AddtoFollowed: 5,
        MNeworder_Submit: 5,
        MNeworder_Function: 5,
        MNeworder_Address: 5,
        MNeworder_PayType: 5,
        MNeworder_ProdictList: 5,
        MPayFinish_OrderList: 5,
        MPayFinish_SecKill: 5,
        MPayFinish_GetJDBean: 5,
        MPayFinish_AllOrders: 5,
        MPayFinish_HandSecKill: 5,
        MHome_OrderSubmit: 5,
        MPayFinish_HomeMain: 5,
        MLOCOffLineProductDetail_BuyNow: 2,
        MLOCShopList_Call: 3,
        MLOCCheckOut_Submit: 4,
        LOCOffLineProductDetail_BuyNow: 2,
        LOCOnLineProductDetail_BuyNow: 2,
        MLOCOnLineProductDetail_BuyNow: 2,
        MLOCShopList_CallMap: 3,
        MFlashbuy_NewArrival: 2,
        MFlashbuy_LastSale: 2,
        MFlashbuy_ActivityForecast: 2,
        Mflashbuy_FocusPic: 2,
        MFlashbuy_NewArrivalFloor: 2,
        MFlashbuy_LastSaleFloor: 2,
        MFlashbuy_ActivityForecastFloor: 2,
        MFlashbuy_ProductPic: 3,
        MPresell_FocusPic: 2,
        MPresell_More: 2,
        MPresell_NewArrivalFloor: 2,
        MPresell_GetFreshFloor: 2,
        MPresell_SmartLifeFloor: 2,
        MPresell_BranchVenues: 2,
        MPresell_ProductList: 3,
        MTopic_FocusPic: 3,
        MTopic_SecKill: 3,
        MTopic_Floors: 3,
        MTopic_Products: 3,
        MTopic_Menus: 3,
        MTopic_Classify: 3,
        MTopic_recommend: 3,
        MTopic_brand: 3,
        Jshop_AD_button: 4,
        "Jshop_AD_TopCarousel ": 4,
        Jshop_AD_Tab: 4,
        Jshop_AD_Picture: 4,
        Jshop_AD_Rolled: 4,
        Jshop_AD_Close: 4,
        Jshop_Hot_Tab: 4,
        Jshop_Hot_ProductID: 4,
        "Jshop_Commended_ProductID ": 4,
        Jshop_Commended_GotoShop: 4,
        Jshop_Commended_Pic: 4,
        Jshop_Commended_Url: 4,
        MShopCheckIn_Pic: 2,
        MShopCheckIn_CheckInGetGift: 2,
        MShopCheckIn_RecommendShopid: 2,
        MShopCheckIn_MoreShops: 2,
        ShopHome_CheckInGetGift: 3,
        ShopCheckIn_Productid: 4,
        MJingDouHome_CouponCenter: 1,
        MWidget_Sign: 1,
        Widget_Operate: 1,
        Widget_Commodity: 1,
        Widget_More: 1,
        MJingDouHome_Checkin: 2,
        MSeckill_SubmitAndAccount: 5,
        MMyJD_MyPurse: 2,
        MMyJD_MyFollows: 2,
        MMyJD_BrowserHistory: 2,
        MMyJD_ServiceManager: 2,
        MMyJD_AccountManager: 2,
        MMyJD_MyAppointment: 2,
        MMyJD_ApplicationRecommend: 2,
        MMyJD_JCode: 2,
        MNeworder_Coupons: 5,
        MNeworder_Jdcard: 5,
        MNeworder_JdBean: 5,
        MNeworder_Invoice: 5,
        MNeworder_RestAccount: 5,
        MNeworder_GuessYouLike: 5,
        MNeworder_UnavaliableCoupons: 5,
        MMyJD_AllOrders: 2,
        MSaleBDCoupon_BannerPic: 3,
        MSaleBDCouponResult_BannerPic: 3,
        MShopcart_Productid: 5,
        MShopcart_EditAmount: 5,
        MShopcart_Amount: 5,
        MShopcart_Stroll: 5,
        MShopcart_CheckProd: 5,
        MShopcart_CheckAll: 5,
        MShopcart_Label: 5,
        MShopcart_Getresent: 5,
        MShopcart_Warranty: 5,
        MShopcart_Delete: 5,
        MShopcart_Pay: 5,
        MShopcart_AddtoCart: 5,
        MShopcart_Present: 5,
        MShopcartDeleteProduct_Sure: 5,
        MShopcartDeleteProduct_Cancel: 5,
        MShopcart_Login: 5,
        MShopcart_ShopEntrance: 5,
        MShopcart_GuessYouLikeFold: 5,
        MShopcart_GuessYouLike: 5,
        MShopcart_SimilaritiesEntrance: 5,
        MShopcart_SimilaritiesProductList: 5,
        MCategory_1st: 2,
        MCategory_3rd: 2,
        MCategory_Banner: 2,
        MCategory_Recommend: 2,
        MList_AdProducts: 3,
        MListFilter_Brand: 3,
        MListFilter_Back: 3,
        MListFilter_Address: 3,
        MShopLIst_JDShop: 3,
        MShopLIst_POPShop: 3,
        MShopcart_LoginEmptyCart: 5,
        MShopcart_LoginFullCart: 5,
        MJDMembersHome_SecKillProducts: 3,
        MJDMembersSecKill_Products: 4,
        MJDMembersHome_MemberProducts: 3,
        MJDMembersHome_MemberProductsToCart: 3,
        MJDMembersHome_AllMemberProducts: 3,
        MJDMembersSpecialSale_Categories: 4,
        MJDMembersSpecialSale_Products: 4,
        MJDMembers_FocusPic: 3,
        MJDMembers_Shopid: 3,
        MJDMembers_GetCoupon: 3
    };
    MPing.events = {},
    MPing.events.map = a
} (window),
function() {
    function a(a) {
        return c(b(d(a)))
    }
    function b(a) {
        return f(g(e(a), 8 * a.length))
    }
    function c(a) {
        try {} catch(b) {
            o = 0
        }
        for (var c, d = o ? "0123456789ABCDEF": "0123456789abcdef", e = "", f = 0; f < a.length; f++) c = a.charCodeAt(f),
        e += d.charAt(c >>> 4 & 15) + d.charAt(15 & c);
        return e
    }
    function d(a) {
        for (var b, c, d = "", e = -1; ++e < a.length;) b = a.charCodeAt(e),
        c = e + 1 < a.length ? a.charCodeAt(e + 1) : 0,
        b >= 55296 && 56319 >= b && c >= 56320 && 57343 >= c && (b = 65536 + ((1023 & b) << 10) + (1023 & c), e++),
        127 >= b ? d += String.fromCharCode(b) : 2047 >= b ? d += String.fromCharCode(192 | b >>> 6 & 31, 128 | 63 & b) : 65535 >= b ? d += String.fromCharCode(224 | b >>> 12 & 15, 128 | b >>> 6 & 63, 128 | 63 & b) : 2097151 >= b && (d += String.fromCharCode(240 | b >>> 18 & 7, 128 | b >>> 12 & 63, 128 | b >>> 6 & 63, 128 | 63 & b));
        return d
    }
    function e(a) {
        for (var b = Array(a.length >> 2), c = 0; c < b.length; c++) b[c] = 0;
        for (var c = 0; c < 8 * a.length; c += 8) b[c >> 5] |= (255 & a.charCodeAt(c / 8)) << c % 32;
        return b
    }
    function f(a) {
        for (var b = "", c = 0; c < 32 * a.length; c += 8) b += String.fromCharCode(a[c >> 5] >>> c % 32 & 255);
        return b
    }
    function g(a, b) {
        a[b >> 5] |= 128 << b % 32,
        a[(b + 64 >>> 9 << 4) + 14] = b;
        for (var c = 1732584193, d = -271733879, e = -1732584194, f = 271733878, g = 0; g < a.length; g += 16) {
            var h = c,
            n = d,
            o = e,
            p = f;
            c = i(c, d, e, f, a[g + 0], 7, -680876936),
            f = i(f, c, d, e, a[g + 1], 12, -389564586),
            e = i(e, f, c, d, a[g + 2], 17, 606105819),
            d = i(d, e, f, c, a[g + 3], 22, -1044525330),
            c = i(c, d, e, f, a[g + 4], 7, -176418897),
            f = i(f, c, d, e, a[g + 5], 12, 1200080426),
            e = i(e, f, c, d, a[g + 6], 17, -1473231341),
            d = i(d, e, f, c, a[g + 7], 22, -45705983),
            c = i(c, d, e, f, a[g + 8], 7, 1770035416),
            f = i(f, c, d, e, a[g + 9], 12, -1958414417),
            e = i(e, f, c, d, a[g + 10], 17, -42063),
            d = i(d, e, f, c, a[g + 11], 22, -1990404162),
            c = i(c, d, e, f, a[g + 12], 7, 1804603682),
            f = i(f, c, d, e, a[g + 13], 12, -40341101),
            e = i(e, f, c, d, a[g + 14], 17, -1502002290),
            d = i(d, e, f, c, a[g + 15], 22, 1236535329),
            c = j(c, d, e, f, a[g + 1], 5, -165796510),
            f = j(f, c, d, e, a[g + 6], 9, -1069501632),
            e = j(e, f, c, d, a[g + 11], 14, 643717713),
            d = j(d, e, f, c, a[g + 0], 20, -373897302),
            c = j(c, d, e, f, a[g + 5], 5, -701558691),
            f = j(f, c, d, e, a[g + 10], 9, 38016083),
            e = j(e, f, c, d, a[g + 15], 14, -660478335),
            d = j(d, e, f, c, a[g + 4], 20, -405537848),
            c = j(c, d, e, f, a[g + 9], 5, 568446438),
            f = j(f, c, d, e, a[g + 14], 9, -1019803690),
            e = j(e, f, c, d, a[g + 3], 14, -187363961),
            d = j(d, e, f, c, a[g + 8], 20, 1163531501),
            c = j(c, d, e, f, a[g + 13], 5, -1444681467),
            f = j(f, c, d, e, a[g + 2], 9, -51403784),
            e = j(e, f, c, d, a[g + 7], 14, 1735328473),
            d = j(d, e, f, c, a[g + 12], 20, -1926607734),
            c = k(c, d, e, f, a[g + 5], 4, -378558),
            f = k(f, c, d, e, a[g + 8], 11, -2022574463),
            e = k(e, f, c, d, a[g + 11], 16, 1839030562),
            d = k(d, e, f, c, a[g + 14], 23, -35309556),
            c = k(c, d, e, f, a[g + 1], 4, -1530992060),
            f = k(f, c, d, e, a[g + 4], 11, 1272893353),
            e = k(e, f, c, d, a[g + 7], 16, -155497632),
            d = k(d, e, f, c, a[g + 10], 23, -1094730640),
            c = k(c, d, e, f, a[g + 13], 4, 681279174),
            f = k(f, c, d, e, a[g + 0], 11, -358537222),
            e = k(e, f, c, d, a[g + 3], 16, -722521979),
            d = k(d, e, f, c, a[g + 6], 23, 76029189),
            c = k(c, d, e, f, a[g + 9], 4, -640364487),
            f = k(f, c, d, e, a[g + 12], 11, -421815835),
            e = k(e, f, c, d, a[g + 15], 16, 530742520),
            d = k(d, e, f, c, a[g + 2], 23, -995338651),
            c = l(c, d, e, f, a[g + 0], 6, -198630844),
            f = l(f, c, d, e, a[g + 7], 10, 1126891415),
            e = l(e, f, c, d, a[g + 14], 15, -1416354905),
            d = l(d, e, f, c, a[g + 5], 21, -57434055),
            c = l(c, d, e, f, a[g + 12], 6, 1700485571),
            f = l(f, c, d, e, a[g + 3], 10, -1894986606),
            e = l(e, f, c, d, a[g + 10], 15, -1051523),
            d = l(d, e, f, c, a[g + 1], 21, -2054922799),
            c = l(c, d, e, f, a[g + 8], 6, 1873313359),
            f = l(f, c, d, e, a[g + 15], 10, -30611744),
            e = l(e, f, c, d, a[g + 6], 15, -1560198380),
            d = l(d, e, f, c, a[g + 13], 21, 1309151649),
            c = l(c, d, e, f, a[g + 4], 6, -145523070),
            f = l(f, c, d, e, a[g + 11], 10, -1120210379),
            e = l(e, f, c, d, a[g + 2], 15, 718787259),
            d = l(d, e, f, c, a[g + 9], 21, -343485551),
            c = m(c, h),
            d = m(d, n),
            e = m(e, o),
            f = m(f, p)
        }
        return Array(c, d, e, f)
    }
    function h(a, b, c, d, e, f) {
        return m(n(m(m(b, a), m(d, f)), e), c)
    }
    function i(a, b, c, d, e, f, g) {
        return h(b & c | ~b & d, a, b, e, f, g)
    }
    function j(a, b, c, d, e, f, g) {
        return h(b & d | c & ~d, a, b, e, f, g)
    }
    function k(a, b, c, d, e, f, g) {
        return h(b ^ c ^ d, a, b, e, f, g)
    }
    function l(a, b, c, d, e, f, g) {
        return h(c ^ (b | ~d), a, b, e, f, g)
    }
    function m(a, b) {
        var c = (65535 & a) + (65535 & b),
        d = (a >> 16) + (b >> 16) + (c >> 16);
        return d << 16 | 65535 & c
    }
    function n(a, b) {
        return a << b | a >>> 32 - b
    }
    var o = 0;
    MPing.tools || (MPing.tools = {}),
    MPing.tools.md5 = {
        hex_md5: a
    }
} (window);