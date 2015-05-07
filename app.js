Ext.Loader.setConfig( 
    {
        enabled: true,
        disableCaching: true
    }
);

Ext.Loader.setPath('Ext.ux', './ux');

Ext.application({
    name: 'NerdyKaraoke',

    requires: [
        'Ext.MessageBox'
    ],

    stores: [
        'Alphabet',
        'Karaoke',
        'NewKaraoke'
    ],

    models: [
        'Songs',
        'NewSongs',
        'RequestForm'
    ],

    controllers: [
        'EventController'
    ],

    views: [
        'Main',
        'WhatsNewContainer',
            'WhatsNew',
            'WhatsNewLyrics',
        'TrackContainer',
            'TrackSearch',
            'TrackList',
            'TrackLyrics',
        'Submit',
        'Issues'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
        

        // Initialize the main view
        Ext.Viewport.add(Ext.create('NerdyKaraoke.view.Main'));
        Ext.Viewport.show({ type: 'fade' });
        Ext.Viewport.setMasked({ xtype:'loadmask', message:'Loading...'} );

        Ext.override(Ext.MessageBox, {
            hide: function() {
                if (this.activeAnimation && this.activeAnimation._onEnd) {
                    this.activeAnimation._onEnd();
                }
                return this.callParent(arguments);
            }
        });

        Ext.override(Ext.util.SizeMonitor, {
           constructor: function(config) {
               var namespace = Ext.util.sizemonitor;

               if (Ext.browser.is.Firefox) {
                   return new namespace.OverflowChange(config);
               } else if (Ext.browser.is.WebKit) {
                   if (!Ext.browser.is.Silk && Ext.browser.engineVersion.gtEq('535') && !Ext.browser.engineVersion.ltEq('537.36')) {
                       return new namespace.OverflowChange(config);
                   } else {
                       return new namespace.Scroll(config);
                   }
               } else if (Ext.browser.is.IE11) {
                   return new namespace.Scroll(config);
               } else {
                   return new namespace.Scroll(config);
               }
           }
       });

       Ext.override(Ext.util.PaintMonitor, {
           constructor: function(config) {
               if (Ext.browser.is.Firefox || (Ext.browser.is.WebKit && Ext.browser.engineVersion.gtEq('536') && !Ext.browser.engineVersion.ltEq('537.36') && !Ext.os.is.Blackberry)) {
                   return new Ext.util.paintmonitor.OverflowChange(config);
               }
               else {
                   return new Ext.util.paintmonitor.CssAnimation(config);
               }
           }
       });
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});

//Let people use their mousewheel or trackpad to scroll
if(Ext.os.deviceType === 'Desktop') {
    document.addEventListener('mousewheel', function(e){ 
        var el = e.target; 
        var offset, scroller, _results; 
        _results = []; 
        while (el !== document.body) { 
            if (el && el.className && el.className.indexOf('x-container') >= 0) { 
                var cmp = Ext.getCmp(el.id); 
                if (cmp && typeof cmp.getScrollable == 'function' && cmp.getScrollable()){ 
                    scroller = cmp.getScrollable().getScroller(); 
                    if (scroller) { 
                        offset = {x:0, y: -e.wheelDelta*0.5}; 
                        scroller.fireEvent('scrollstart', scroller, scroller.position.x, scroller.position.y, e); 
                        scroller.scrollBy(offset.x, offset.y); 
                        scroller.snapToBoundary(); 
                        scroller.fireEvent('scrollend', scroller, scroller.position.x, scroller.position.y-offset.y); 
                        break; 
                    } 
                } 
            } 
            _results.push(el = el.parentNode); 
        }
         
        return _results; 
    }, false);
}
