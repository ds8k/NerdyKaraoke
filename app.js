/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

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
        'WhatsNew',
        'TrackContainer',
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
                    var scroller = cmp.getScrollable().getScroller(); 
                    if (scroller) { 
                        var offset = {x:0, y: -e.wheelDelta*0.5}; 
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
