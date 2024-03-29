/**
 * @author      Jeremy England
 * @license     MIT
 * @description Adds tabs, views, and controls to specified containers in node.js electron.
 * @requires    electron, jquery, color.js, electron-context-menu, url-regex
 * @see         https://github.com/simply-coded/electron-navigation
 * @tutorial
 *  Add these IDs to your html (containers don't have to be divs).
 *      <div id='nav-body-ctrls'></div>
 *      <div id='nav-body-tabs'></div>
 *      <div id='nav-body-views'></div>
 *  Add these scripts to your html (at the end of the body tag).
 *      <script>
 *          const enav = new (require('electron-navigation'))()
 *      </script>
 *  Add a theme file to your html (at the end of the head tag)(optional).
 *      <link rel="stylesheet" type="text/css" href="location/of/theme.css">
 */
/**
 * DEPENDENCIES
 */
var $ = require("jquery");
var Color = require("color.js");
var urlRegex = require("url-regex");
const contextMenu = require("electron-context-menu");
var globalCloseableTabsOverride;
/**
 * OBJECT
 */

function Navigation(options) {
  /**
   * OPTIONS
   */
  var defaults = {
    showBackButton: true,
    showForwardButton: true,
    showReloadButton: true,
    showUrlBar: true,
    showAddTabButton: true,
    closableTabs: true,
    verticalTabs: false,
    defaultFavicons: false,
    newTabCallback: null,
    changeTabCallback: null,
    newTabParams: null
  };
  options = options ? Object.assign(defaults, options) : defaults;
  /**
   * GLOBALS & ICONS
   */
  globalCloseableTabsOverride = options.closableTabs;
  const NAV = this;
  this.newTabCallback = options.newTabCallback;
  this.changeTabCallback = options.changeTabCallback;
  this.SESSION_ID = 1;
  if (options.defaultFavicons) {
    this.TAB_ICON = "default";
  } else {
    this.TAB_ICON = "clean";
  }
  this.SVG_BACK =
    '<svg height="100%" viewBox="0 0 24 24"><path d="M17.1 6.56251H3.05999L7.83 1.59377C8.19 1.21877 8.19 0.65625 7.83 0.28125C7.47 -0.0937499 6.93 -0.0937499 6.57 0.28125L0.27 6.84375C-0.09 7.21875 -0.09 7.78127 0.27 8.15627L6.57 14.7188C6.75 14.9063 7.02 15 7.2 15C7.47 15 7.65 14.9063 7.83 14.7188C8.19 14.3438 8.19 13.7812 7.83 13.4062L3.05999 8.43751H17.1C17.64 8.43751 18 8.06251 18 7.50001C18 6.93751 17.55 6.56251 17.1 6.56251Z"/></svg>';
  this.SVG_FORWARD =
    '<svg height="100%" viewBox="0 0 24 24"><path d="M0.899999 8.43749H14.94L10.17 13.4062C9.80998 13.7812 9.80998 14.3438 10.17 14.7188C10.53 15.0938 11.07 15.0938 11.43 14.7188L17.73 8.15626C18.09 7.78126 18.09 7.21873 17.73 6.84373L11.43 0.281238C11.25 0.0937385 10.98 0 10.8 0C10.53 0 10.35 0.0937385 10.17 0.281238C9.80998 0.656238 9.80998 1.21876 10.17 1.59376L14.94 6.5625H0.899999C0.36 6.5625 0 6.9375 0 7.49999C0 8.06249 0.45 8.43749 0.899999 8.43749Z"/></svg>';
  this.SVG_RELOAD =
    '<svg height="100%" viewBox="0 0 24 24" id="nav-ready"><path d="M20 1.89001V7.29001C20 7.83001 19.6364 8.19001 19.0909 8.19001H13.6364C13.0909 8.19001 12.7273 7.83001 12.7273 7.29001C12.7273 6.75001 13.0909 6.39001 13.6364 6.39001H16.7273C15.4545 5.22001 14.5455 4.22999 14.2727 3.95999C13.5455 3.23999 12.7273 2.70001 11.9091 2.34001C11 1.98001 10.0909 1.8 9.18182 1.8C8.27273 1.8 7.27273 1.98001 6.45454 2.34001C5.54545 2.70001 4.72727 3.23999 4.09091 3.95999C3.36364 4.67999 2.81818 5.49 2.45455 6.3C2.09091 7.2 1.90909 8.1 1.90909 9C1.90909 9.9 2.09091 10.89 2.45455 11.7C2.81818 12.6 3.36364 13.41 4.09091 14.04C4.81818 14.76 5.63636 15.3 6.45454 15.66C7.36364 16.02 8.27273 16.2 9.18182 16.2C10.0909 16.2 11.0909 16.02 11.9091 15.66C12.8182 15.3 13.6364 14.76 14.2727 14.04C14.6364 13.68 15 13.23 15.2727 12.78C15.5455 12.33 15.8182 11.88 16 11.34C16.1818 10.89 16.7273 10.62 17.1818 10.8C17.6364 10.98 17.9091 11.52 17.7273 11.97C17.5455 12.6 17.1818 13.23 16.8182 13.77C16.4545 14.31 16 14.85 15.5455 15.39C14.6364 16.29 13.6364 16.92 12.5455 17.37C12 17.55 11.4545 17.73 10.8182 17.82C10.2727 17.91 9.63636 18 9.09091 18C8.54545 18 7.90909 17.91 7.36364 17.82C6.81818 17.73 6.18182 17.55 5.63636 17.37C4.54546 16.92 3.45455 16.29 2.63637 15.39C1.72727 14.49 1.09091 13.5 0.636364 12.42C0.454546 11.88 0.272728 11.34 0.181819 10.71C0.0909098 10.17 0 9.54 0 9C0 8.46 0.0909098 7.83001 0.181819 7.29001C0.272728 6.75001 0.454546 6.12001 0.636364 5.58001C1.09091 4.50001 1.72727 3.41999 2.63637 2.60999C3.54546 1.70999 4.54546 1.08001 5.63636 0.630011C6.18182 0.450011 6.72727 0.270011 7.36364 0.180011C7.90909 0.090011 8.54545 0 9.09091 0C9.63636 0 10.2727 0.090011 10.8182 0.180011C11.3636 0.270011 12 0.450011 12.5455 0.630011C13.6364 1.08001 14.7273 1.70999 15.5455 2.60999C15.8182 2.87999 16.9091 3.87002 18.1818 5.22002V1.89001C18.1818 1.35001 18.5455 0.990005 19.0909 0.990005C19.6364 0.990005 20 1.35001 20 1.89001Z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
  this.SVG_FAVICON =
    '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>';
  this.SVG_ADD =
    '<svg height="100%" viewBox="0 0 24 24"><path d="M22.1538 0H1.84615C0.826551 0 0 0.826551 0 1.84615V22.1538C0 23.1734 0.826551 24 1.84615 24H22.1538C23.1734 24 24 23.1734 24 22.1538V1.84615C24 0.826551 23.1734 0 22.1538 0Z"/><path d="M16.6229 10.6421H13.0774V7.09662C13.0774 6.38753 12.6047 5.91481 11.8956 5.91481C11.1865 5.91481 10.7138 6.38753 10.7138 7.09662V10.6421H7.16832C6.45923 10.6421 5.9865 11.1148 5.9865 11.8239C5.9865 12.533 6.45923 13.0057 7.16832 13.0057H10.7138V16.5512C10.7138 17.2603 11.1865 17.733 11.8956 17.733C12.6047 17.733 13.0774 17.2603 13.0774 16.5512V13.0057H16.6229C17.332 13.0057 17.8047 12.533 17.8047 11.8239C17.8047 11.1148 17.332 10.6421 16.6229 10.6421Z" fill="#474646"/></svg>';
  this.SVG_CLEAR =
    '<svg height="100%" viewBox="0 0 24 24"><path d="M10.575 9.00001L17.6625 1.91253C18.1125 1.46253 18.1125 0.787499 17.6625 0.3375C17.2125 -0.1125 16.5375 -0.1125 16.0875 0.3375L9 7.42498L1.91252 0.3375C1.46253 -0.1125 0.787499 -0.1125 0.337499 0.3375C-0.1125 0.787499 -0.1125 1.46253 0.337499 1.91253L7.42501 9.00001L0.337499 16.0875C-0.1125 16.5375 -0.1125 17.2125 0.337499 17.6625C0.562499 17.8875 0.900012 18 1.12501 18C1.46251 18 1.68752 17.8875 1.91252 17.6625L9 10.575L16.0875 17.6625C16.3125 17.8875 16.65 18 16.875 18C17.2125 18 17.4375 17.8875 17.6625 17.6625C18.1125 17.2125 18.1125 16.5375 17.6625 16.0875L10.575 9.00001Z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
  /**
   * ADD ELEMENTS
   */
  if (options.showBackButton) {
    $("#nav-body-ctrls").append(
      '<i id="nav-ctrls-back" class="nav-icons disabled" title="Go back">' +
      this.SVG_BACK +
      "</i>"
    );
  }
  if (options.showForwardButton) {
    $("#nav-body-ctrls").append(
      '<i id="nav-ctrls-forward" class="nav-icons disabled" title="Go forward">' +
      this.SVG_FORWARD +
      "</i>"
    );
  }
  if (options.showReloadButton) {
    $("#nav-body-ctrls").append(
      '<i id="nav-ctrls-reload" class="nav-icons disabled" title="Reload page">' +
      this.SVG_RELOAD +
      "</i>"
    );
  }
  if (options.showUrlBar) {
    $("#nav-body-ctrls").append(
      '<input id="nav-ctrls-url" type="text" title="Enter an address or search term"    />'
    );
    $("#nav-body-ctrls").append(
      '<p style="position: relative;" title="Window transparency (CTRL + 1-9)"> &nbsp;&nbsp;&nbsp;<input type="range"  value="1" min="0.05"  max="1"  step="0.05"  id="slider"  oninput="onChange()"/> <label id="slider-label" for="slider"><img id="eye" src="../img/Transparency.png"/> </label></p>'
    );
  }
  if (options.showAddTabButton) {
    $("#nav-body-tabs").append(
      '<i id="nav-tabs-add" class="nav-icons" title="Add new tab">' +
      this.SVG_ADD +
      "</i>"
    );
  }
  /**
   * ADD CORE STYLE
   */
  if (options.verticalTabs) {
    $("head").append(
      '<style id="nav-core-styles">#nav-body-ctrls,#nav-body-tabs,#nav-body-views,.nav-tabs-tab{display:flex;align-items:center;}#nav-body-tabs{overflow:auto;min-height:32px;flex-direction:column;}#nav-ctrls-url{box-sizing:border-box;}.nav-tabs-tab{min-width:60px;width:100%;min-height:20px;}.nav-icons{fill:#000;width:24px;height:24px}.nav-icons.disabled{pointer-events:none;opacity:.5}#nav-ctrls-url{flex:1;height:24px}.nav-views-view{flex:0 1;width:0;height:0}.nav-views-view.active{flex:1;width:100%;height:100%}.nav-tabs-favicon{align-content:flex-start}.nav-tabs-title{flex:1;cursor:default;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nav-tabs-close{align-content:flex-end}@keyframes nav-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>'
    );
  } else {
    $("head").append(
      '<style id="nav-core-styles">#nav-body-ctrls,#nav-body-tabs,#nav-body-views,.nav-tabs-tab{display:flex;align-items:center}#nav-body-tabs{overflow:auto;min-height:32px;}#nav-ctrls-url{box-sizing:border-box;}.nav-tabs-tab{min-width:60px;width:180px;min-height:20px;}.nav-icons{fill:#000;width:24px;height:24px}.nav-icons.disabled{pointer-events:none;opacity:.5}#nav-ctrls-url{flex:1;height:24px}.nav-views-view{flex:0 1;width:0;height:0}.nav-views-view.active{flex:1;width:100%;height:100%}.nav-tabs-favicon{align-content:flex-start}.nav-tabs-title{flex:1;cursor:default;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nav-tabs-close{align-content:flex-end}@keyframes nav-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>'
    );
  }
  /**
   * EVENTS
   */
  //
  // switch active view and tab on click
  //
  $("#nav-body-tabs")
    .on("click", ".nav-tabs-tab", function () {
      $(".nav-tabs-tab, .nav-views-view").removeClass("active");

      var sessionID = $(this).data("session");
      $(".nav-tabs-tab, .nav-views-view")
        .filter('[data-session="' + sessionID + '"]')
        .addClass("active");

      var session = $('.nav-views-view[data-session="' + sessionID + '"]')[0];
      (NAV.changeTabCallback || (() => { }))(session);
      NAV._updateUrl(session.getURL());
      NAV._updateCtrls();

      //
      // close tab and view
      //
    })
    .on("click", ".nav-tabs-close", function () {
      $("#nav-tabs-add").show();
      var sessionID = $(this)
        .parent(".nav-tabs-tab")
        .data("session");
      var session = $(".nav-tabs-tab, .nav-views-view").filter(
        '[data-session="' + sessionID + '"]'
      );

      if (session.hasClass("active")) {
        if (session.next(".nav-tabs-tab").length) {
          session.next().addClass("active");
          (NAV.changeTabCallback || (() => { }))(session.next()[1]);
        } else {
          session.prev().addClass("active");
          (NAV.changeTabCallback || (() => { }))(session.prev()[1]);
        }
      }
      session.remove();
      NAV._updateUrl();
      NAV._updateCtrls();
      return false;
    });
  //
  // add a tab, default to google.com
  //
  $("#nav-body-tabs").on("click", "#nav-tabs-add", function () {
    let params;
    if (typeof options.newTabParams === "function") {
      params = options.newTabParams();
    } else if (options.newTabParams instanceof Array) {
      params = options.newTabParams;
    } else {
      params = [
        "demos/mainPage.html",
        {
          close: options.closableTabs,
          icon: NAV.TAB_ICON
        }
      ];
    }
    //NAV.newTab("file:///${__dirname}/demos/mainPage.html");
    NAV.newTab(`file:///${__dirname}/demos/mainPage.html`, {
      icon: "../img/site-icon.png",
      title: "New",
      close: "false"
    });
  });
  //
  // go back
  //
  $("#nav-body-ctrls").on("click", "#nav-ctrls-back", function () {
    NAV.back();
  });
  //
  // go forward
  //
  $("#nav-body-ctrls").on("click", "#nav-ctrls-forward", function () {
    NAV.forward();
  });
  //
  // reload page
  //
  $("#nav-body-ctrls").on("click", "#nav-ctrls-reload", function () {
    if ($(this).find("#nav-ready").length) {
      NAV.reload();
    } else {
      NAV.stop();
    }
  });
  //
  // highlight address input text on first select
  //
  $("#nav-ctrls-url").on("focus", function (e) {
    $(this)
      .one("mouseup", function () {
        $(this).select();
        return false;
      })
      .select();
  });
  //
  // load or search address on enter / shift+enter
  //
  $("#nav-ctrls-url").keyup(function (e) {
    if (e.keyCode == 13) {
      if (e.shiftKey) {
        NAV.newTab(this.value, {
          close: options.closableTabs,
          icon: NAV.TAB_ICON
        });
      } else {
        if ($(".nav-tabs-tab").length) {
          NAV.changeTab(this.value);
        } else {
          NAV.newTab(this.value, {
            close: options.closableTabs,
            icon: NAV.TAB_ICON
          });
        }
      }
    }
  });
  /**
   * FUNCTIONS
   */
  //
  // update controls like back, forward, etc...
  //
  this._updateCtrls = function () {
    webview = $(".nav-views-view.active")[0];
    if (!webview) {
      $("#nav-ctrls-back").addClass("disabled");
      $("#nav-ctrls-forward").addClass("disabled");
      $("#nav-ctrls-reload")
        .html(this.SVG_RELOAD)
        .addClass("disabled");
      return;
    }
    if (webview.canGoBack()) {
      $("#nav-ctrls-back").removeClass("disabled");
    } else {
      $("#nav-ctrls-back").addClass("disabled");
    }
    if (webview.canGoForward()) {
      $("#nav-ctrls-forward").removeClass("disabled");
    } else {
      $("#nav-ctrls-forward").addClass("disabled");
    }
    if (webview.isLoading()) {
      this._loading();
    } else {
      this._stopLoading();
    }
    if (webview.getAttribute("data-readonly") == "true") {
      $("#nav-ctrls-url").attr("readonly", "readonly");
    } else {
      $("#nav-ctrls-url").removeAttr("readonly");
    }
  }; //:_updateCtrls()
  //
  // start loading animations
  //
  this._loading = function (tab) {
    tab = tab || null;

    if (tab == null) {
      tab = $(".nav-tabs-tab.active");
    }

    tab
      .find(".nav-tabs-favicon")
      .css("animation", "nav-spin 2s linear infinite");
    $("#nav-ctrls-reload").html(this.SVG_CLEAR);
  }; //:_loading()
  //
  // stop loading animations
  //
  this._stopLoading = function (tab) {
    tab = tab || null;

    if (tab == null) {
      tab = $(".nav-tabs-tab.active");
    }

    tab.find(".nav-tabs-favicon").css("animation", "");
    $("#nav-ctrls-reload").html(this.SVG_RELOAD);
  }; //:_stopLoading()
  //
  // auto add http protocol to url input or do a search
  //
  this._purifyUrl = function (url) {
    if (
      urlRegex({
        strict: false,
        exact: true
      }).test(url)
    ) {
      url = url.match(/^https?:\/\/.*/) ? url : "http://" + url;
    } else {
      url = !url.match(/^[a-zA-Z]+:\/\//)
        ? "https://www.google.com/search?q=" + url.replace(" ", "+")
        : url;
    }
    return url;
  }; //:_purifyUrl()
  //
  // set the color of the tab based on the favicon
  //
  this._setTabColor = function (url, currtab) {
    const getHexColor = new Color(url, {
      amount: 1,
      format: "hex"
    });
    getHexColor.mostUsed(result => {
      currtab.find(".nav-tabs-favicon svg").attr("fill", result);
    });
  }; //:_setTabColor()
  //
  // add event listeners to current webview
  //
  this._addEvents = function (sessionID, options) {
    let currtab = $('.nav-tabs-tab[data-session="' + sessionID + '"]');
    let webview = $('.nav-views-view[data-session="' + sessionID + '"]');

    webview.on("dom-ready", function () {
      if (options.contextMenu) {
        contextMenu({
          window: webview[0],
          labels: {
            cut: "Cut",
            copy: "Copy",
            paste: "Paste",
            save: "Save",
            copyLink: "Copy Link",
            inspect: "Inspect"
          }
        });
      }
    });
    webview.on("page-title-updated", function () {
      if (options.title == "default") {
        currtab.find(".nav-tabs-title").text(webview[0].getTitle());
        currtab.find(".nav-tabs-title").attr("title", webview[0].getTitle());
      }
    });
    webview.on("did-start-loading", function () {
      NAV._loading(currtab);
    });
    webview.on("did-stop-loading", function () {
      NAV._stopLoading(currtab);
    });
    webview.on("enter-html-full-screen", function () {
      $(".nav-views-view.active")
        .siblings()
        .not("script")
        .hide();
      $(".nav-views-view.active")
        .parents()
        .not("script")
        .siblings()
        .hide();
    });
    webview.on("leave-html-full-screen", function () {
      $(".nav-views-view.active")
        .siblings()
        .not("script")
        .show();
      $(".nav-views-view.active")
        .parents()
        .siblings()
        .not("script")
        .show();
    });
    webview.on("load-commit", function () {
      NAV._updateCtrls();
    });
    webview[0].addEventListener("did-navigate", res => {
      NAV._updateUrl(res.url);
    });
    webview[0].addEventListener("did-fail-load", res => {
      NAV._updateUrl(res.validatedUrl);
    });
    webview[0].addEventListener("did-navigate-in-page", res => {
      NAV._updateUrl(res.url);
    });
    webview[0].addEventListener("new-window", res => {
      if (
        !(
          options.newWindowFrameNameBlacklistExpression instanceof RegExp &&
          options.newWindowFrameNameBlacklistExpression.test(res.frameName)
        )
      ) {
        NAV.newTab(res.url, {
          icon: NAV.TAB_ICON
        });
      }
    });
    webview[0].addEventListener("page-favicon-updated", res => {
      if (options.icon == "clean") {
        NAV._setTabColor(res.favicons[0], currtab);
      } else if (options.icon == "default") {
        currtab.find(".nav-tabs-favicon").attr("src", res.favicons[0]);
      }
    });
    webview[0].addEventListener("did-fail-load", res => {
      if (
        res.validatedURL == $("#nav-ctrls-url").val() &&
        res.errorCode != -3
      ) {
        this.executeJavaScript(
          "document.body.innerHTML=" +
          '<div style="background-color:whitesmoke;padding:40px;margin:20px;font-family:consolas;">' +
          "<h2 align=center>Oops, this page failed to load correctly.</h2>" +
          "<p align=center><i>ERROR [ " +
          res.errorCode +
          ", " +
          res.errorDescription +
          " ]</i></p>" +
          "<br/><hr/>" +
          "<h4>Try this</h4>" +
          '<li type=circle>Check your spelling - <b>"' +
          res.validatedURL +
          '".</b></li><br/>' +
          '<li type=circle><a href="javascript:location.reload();">Refresh</a> the page.</li><br/>' +
          '<li type=circle>Perform a <a href=javascript:location.href="https://www.google.com/search?q=' +
          res.validatedURL +
          '">search</a> instead.</li><br/>' +
          "</div>"
        );
      }
    });
    return webview[0];
  }; //:_addEvents()
  //
  // update #nav-ctrls-url to given url or active tab's url
  //
  this._updateUrl = function (url) {
    url = url || null;
    urlInput = $("#nav-ctrls-url");
    if (url == null) {
      if ($(".nav-views-view").length) {
        url = $(".nav-views-view.active")[0].getURL();
      } else {
        url = "";
      }
    }
    urlInput.off("blur");
    if (!urlInput.is(":focus")) {
      urlInput.prop("value", url);
      urlInput.data("last", url);
    } else {
      urlInput.on("blur", function () {
        // if url not edited
        if (urlInput.val() == urlInput.data("last")) {
          urlInput.prop("value", url);
          urlInput.data("last", url);
        }
        urlInput.off("blur");
      });
    }
  }; //:_updateUrl()
} //:Navigation()
/**
 * PROTOTYPES
 */
//
// create a new tab and view with an url and optional id
//
Navigation.prototype.newTab = function (url, options) {
  var tabs = $(".nav-tabs-tab").toArray();
  if (tabs.length < 3) {
    $("#nav-tabs-add").show();
    var defaults = {
      id: null, // null, 'yourIdHere'
      node: false,
      webviewAttributes: {},
      icon: "clean", // 'default', 'clean', 'c:\location\to\image.png'
      title: "default", // 'default', 'your title here'
      close: true,
      readonlyUrl: false,
      contextMenu: true,
      newTabCallback: this.newTabCallback,
      changeTabCallback: this.changeTabCallback
    };
    options = options ? Object.assign(defaults, options) : defaults;
    if (typeof options.newTabCallback === "function") {
      let result = options.newTabCallback(url, options);
      if (!result) {
        return null;
      }
      if (result.url) {
        url = result.url;
      }
      if (result.options) {
        options = result.options;
      }
      if (typeof result.postTabOpenCallback === "function") {
        options.postTabOpenCallback = result.postTabOpenCallback;
      }
    }

    // validate options.id
    $(".nav-tabs-tab, .nav-views-view").removeClass("active");
    if ($("#" + options.id).length) {
      console.log(
        'ERROR[electron-navigation][func "newTab();"]: The ID "' +
        options.id +
        '" already exists. Please use another one.'
      );
      return false;
    }
    if (!/^[A-Za-z]+[\w\-\:\.]*$/.test(options.id)) {
      console.log(
        'ERROR[electron-navigation][func "newTab();"]: The ID "' +
        options.id +
        '" is not valid. Please use another one.'
      );
      return false;
    }
    // build tab
    var tab =
      '<span class="nav-tabs-tab active" data-session="' + this.SESSION_ID + '">';
    // favicon
    if (options.icon == "clean") {
      tab += '<i class="nav-tabs-favicon nav-icons">' + this.SVG_FAVICON + "</i>";
    } else if (options.icon === "default") {
      tab += '<img class="nav-tabs-favicon nav-icons" src=""/>';
    } else {
      tab +=
        '<img class="nav-tabs-favicon nav-icons" src="' + options.icon + '"/>';
    }
    // title
    if (options.title == "default") {
      tab += '<i class="nav-tabs-title"> . . . </i>';
    } else {
      tab += '<i class="nav-tabs-title">' + options.title + "</i>";
    }
    // close
    if (options.close && globalCloseableTabsOverride) {
      tab += '<i class="nav-tabs-close nav-icons">' + this.SVG_CLEAR + "</i>";
    }
    // finish tab
    tab += "</span>";
    // add tab to correct position
    if ($("#nav-body-tabs").has("#nav-tabs-add").length) {
      $("#nav-tabs-add").before(tab);
    } else {
      $("#nav-body-tabs").append(tab);
    }
    // add webview
    let composedWebviewTag = `<webview class="nav-views-view active" data-session="${
      this.SESSION_ID
      }" src="${this._purifyUrl(url)}"`;

    composedWebviewTag += ` data-readonly="${
      options.readonlyUrl ? "true" : "false"
      }"`;
    if (options.id) {
      composedWebviewTag += ` id=${options.id}`;
    }
    if (options.node) {
      composedWebviewTag += " nodeintegration";
    }
    if (options.webviewAttributes) {
      Object.keys(options.webviewAttributes).forEach(key => {
        composedWebviewTag += ` ${key}="${options.webviewAttributes[key]}"`;
      });
    }
    $("#nav-body-views").append(`${composedWebviewTag}></webview>`);
    // enable reload button
    $("#nav-ctrls-reload").removeClass("disabled");

    // update url and add events
    this._updateUrl(this._purifyUrl(url));
    let newWebview = this._addEvents(this.SESSION_ID++, options);
    if (typeof options.postTabOpenCallback === "function") {
      options.postTabOpenCallback(newWebview);
    }
    (this.changeTabCallback || (() => { }))(newWebview);
    var tabs_ = $(".nav-tabs-tab").toArray();
    if (tabs_.length > 2) {
      $("#nav-tabs-add").hide();
    }
    return newWebview;
  } else {
    console.log("tabs already 3");
    $("#nav-tabs-add").hide();
  }

}; //:newTab()
//
// change current or specified tab and view
//
Navigation.prototype.changeTab = function (url, id) {
  id = id || null;
  if (id == null) {
    $(".nav-views-view.active").attr("src", this._purifyUrl(url));
  } else {
    if ($("#" + id).length) {
      $("#" + id).attr("src", this._purifyUrl(url));
    } else {
      console.log(
        'ERROR[electron-navigation][func "changeTab();"]: Cannot find the ID "' +
        id +
        '"'
      );
    }
  }
}; //:changeTab()
//
// close current or specified tab and view
//
Navigation.prototype.closeTab = function (id) {
  $("#nav-tabs-add").show();
  id = id || null;
  console.log("close");
  var session;
  if (id == null) {
    session = $(".nav-tabs-tab.active, .nav-views-view.active");

  } else {
    if ($("#" + id).length) {
      var sessionID = $("#" + id).data("session");
      session = $(".nav-tabs-tab, .nav-views-view").filter(
        '[data-session="' + sessionID + '"]'
      );
    } else {
      console.log(
        'ERROR[electron-navigation][func "closeTab();"]: Cannot find the ID "' +
        id +
        '"'
      );
      return false;
    }
  }
  if (session.next(".nav-tabs-tab").length) {
    session.next().addClass("active");
    (this.changeTabCallback || (() => { }))(session.next()[1]);
  } else {
    session.prev().addClass("active");
    (this.changeTabCallback || (() => { }))(session.prev()[1]);
  }

  session.remove();
  this._updateUrl();
  this._updateCtrls();
}; //:closeTab()
//
// go back on current or specified view
//
Navigation.prototype.back = function (id) {
  id = id || null;
  if (id == null) {
    $(".nav-views-view.active")[0].goBack();
  } else {
    if ($("#" + id).length) {
      $("#" + id)[0].goBack();
    } else {
      console.log(
        'ERROR[electron-navigation][func "back();"]: Cannot find the ID "' +
        id +
        '"'
      );
    }
  }
}; //:back()
//
// go forward on current or specified view
//
Navigation.prototype.forward = function (id) {
  id = id || null;
  if (id == null) {
    $(".nav-views-view.active")[0].goForward();
  } else {
    if ($("#" + id).length) {
      $("#" + id)[0].goForward();
    } else {
      console.log(
        'ERROR[electron-navigation][func "forward();"]: Cannot find the ID "' +
        id +
        '"'
      );
    }
  }
}; //:forward()
//
// reload current or specified view
//
Navigation.prototype.reload = function (id) {
  id = id || null;
  if (id == null) {
    $(".nav-views-view.active")[0].reload();
  } else {
    if ($("#" + id).length) {
      $("#" + id)[0].reload();
    } else {
      console.log(
        'ERROR[electron-navigation][func "reload();"]: Cannot find the ID "' +
        id +
        '"'
      );
    }
  }
}; //:reload()
//
// stop loading current or specified view
//
Navigation.prototype.stop = function (id) {
  id = id || null;
  if (id == null) {
    $(".nav-views-view.active")[0].stop();
  } else {
    if ($("#" + id).length) {
      $("#" + id)[0].stop();
    } else {
      console.log(
        'ERROR[electron-navigation][func "stop();"]: Cannot find the ID "' +
        id +
        '"'
      );
    }
  }
}; //:stop()
//
// listen for a message from webview
//
Navigation.prototype.listen = function (id, callback) {
  let webview = null;

  //check id
  if ($("#" + id).length) {
    webview = document.getElementById(id);
  } else {
    console.log(
      'ERROR[electron-navigation][func "listen();"]: Cannot find the ID "' +
      id +
      '"'
    );
  }

  // listen for message
  if (webview != null) {
    try {
      webview.addEventListener("ipc-message", event => {
        callback(event.channel, event.args, webview);
      });
    } catch (e) {
      webview.addEventListener("dom-ready", function (event) {
        webview.addEventListener("ipc-message", event => {
          callback(event.channel, event.args, webview);
        });
      });
    }
  }
}; //:listen()
//
// send message to webview
//
Navigation.prototype.send = function (id, channel, args) {
  let webview = null;

  // check id
  if ($("#" + id).length) {
    webview = document.getElementById(id);
  } else {
    console.log(
      'ERROR[electron-navigation][func "send();"]: Cannot find the ID "' +
      id +
      '"'
    );
  }

  // send a message
  if (webview != null) {
    try {
      webview.send(channel, args);
    } catch (e) {
      webview.addEventListener("dom-ready", function (event) {
        webview.send(channel, args);
      });
    }
  }
}; //:send()
//
// open developer tools of current or ID'd webview
//
Navigation.prototype.openDevTools = function (id) {
  id = id || null;
  let webview = null;

  // check id
  if (id == null) {
    webview = $(".nav-views-view.active")[0];
  } else {
    if ($("#" + id).length) {
      webview = document.getElementById(id);
    } else {
      console.log(
        'ERROR[electron-navigation][func "openDevTools();"]: Cannot find the ID "' +
        id +
        '"'
      );
    }
  }

  // open dev tools
  if (webview != null) {
    try {
      webview.openDevTools();
    } catch (e) {
      webview.addEventListener("dom-ready", function (event) {
        webview.openDevTools();
      });
    }
  }
}; //:openDevTools()
//
// print current or specified tab and view
//
Navigation.prototype.printTab = function (id, opts) {
  id = id || null;
  let webview = null;

  // check id
  if (id == null) {
    webview = $(".nav-views-view.active")[0];
  } else {
    if ($("#" + id).length) {
      webview = document.getElementById(id);
    } else {
      console.log(
        'ERROR[electron-navigation][func "printTab();"]: Cannot find the ID "' +
        id +
        '"'
      );
    }
  }

  // print
  if (webview != null) {
    webview.print(opts || {});
  }
};
//:nextTab()
//
// toggle next available tab
//
Navigation.prototype.nextTab = function () {
  var tabs = $(".nav-tabs-tab").toArray();
  var activeTabIndex = tabs.indexOf($(".nav-tabs-tab.active")[0]);
  var nexti = activeTabIndex + 1;
  if (nexti > tabs.length - 1) nexti = 0;
  $($(".nav-tabs-tab")[nexti]).trigger("click");
  return false;
}; //:nextTab()
//:prevTab()
//
// toggle previous available tab
//
Navigation.prototype.prevTab = function () {
  var tabs = $(".nav-tabs-tab").toArray();
  var activeTabIndex = tabs.indexOf($(".nav-tabs-tab.active")[0]);
  var nexti = activeTabIndex - 1;
  if (nexti < 0) nexti = tabs.length - 1;
  $($(".nav-tabs-tab")[nexti]).trigger("click");
  return false;
}; //:prevTab()
// go to a tab by index or keyword
//
Navigation.prototype.goToTab = function (index) {
  $activeTabAndView = $(
    "#nav-body-tabs .nav-tabs-tab.active, #nav-body-views .nav-views-view.active"
  );

  if (index == "previous") {
    $tabAndViewToActivate = $activeTabAndView.prev(
      "#nav-body-tabs .nav-tabs-tab, #nav-body-views .nav-views-view"
    );
  } else if (index == "next") {
    $tabAndViewToActivate = $activeTabAndView.next(
      "#nav-body-tabs .nav-tabs-tab, #nav-body-views .nav-views-view"
    );
  } else if (index == "last") {
    $tabAndViewToActivate = $(
      "#nav-body-tabs .nav-tabs-tab:last-of-type, #nav-body-views .nav-views-view:last-of-type"
    );
  } else {
    $tabAndViewToActivate = $(
      "#nav-body-tabs .nav-tabs-tab:nth-of-type(" +
      index +
      "), #nav-body-views .nav-views-view:nth-of-type(" +
      index +
      ")"
    );
  }

  if ($tabAndViewToActivate.length) {
    $("#nav-ctrls-url").blur();
    $activeTabAndView.removeClass("active");
    $tabAndViewToActivate.addClass("active");

    this._updateUrl();
    this._updateCtrls();
  }
}; //:goToTab()
// go to a tab by id of the webview tag
Navigation.prototype.goToTabByWebviewId = function (id) {
  const webviews = document.querySelectorAll("webview.nav-views-view");
  for (let index in webviews) {
    if (webviews[index].id == id) {
      this.goToTab(+index + 1);
      return;
    }
  }
}; //:goToTabByWebviewId()
/**
 * MODULE EXPORTS
 */
module.exports = Navigation;
