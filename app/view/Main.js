Ext.define('NerdyKaraoke.view.Main', {
 extend: 'Ext.ux.slidenavigation.View',

    xtype: 'main',
    requires: [
        'Ext.Container',
        'Ext.MessageBox',
        'Ext.Panel',
        'Ext.Toolbar',
        'Ext.field.Search',
        'Ext.field.Email',
        'Ext.form.FieldSet',
        'Ext.form.Panel',
        'Ext.Button',
        'Ext.Img'
    ],
    
    config: {
        fullscreen: true,
        slideSelector: false,
        containerSlideDelay: -1,
        selectSlideDuration: 200,
        itemMask: true,
        slideButtonDefaults: {
            selector: 'toolbar'
        },
        list: {
            maxDrag: 400,
            width: 200,
            items: {
                xtype: 'toolbar',
                docked: 'top',
                minHeight: '50px',
                title: {
                    title: 'Navigation',
                    centered: false,
                    width: 200,
                    left: 0
                }
            }
        },
        
        listPosition: 'left',
        defaults: {
            xtype: 'container'
        },
        
        items: [
            {
                title: 'Home',
                slideButton: true,
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        minHeight: '50px',
                        title: 'Nerdy Karaoke'
                    },
                    {
                        xtype: 'container',
                        scrollable: true,
                        items: [
                            {
                                xtype: 'component',
                                styleHtmlContent: true,
                                html:   '<center><h2>Welcome to<br>Nerdy Karaoke!</h2><p>Hosted by Dick Steel</center>'
                            },
                            {
                                xtype: 'component',
                                styleHtmlContent: true,
                                html: '<center>Hit the menu button to navigate.</center>'
                            },
                            {
                                xtype: 'component',
                                styleHtmlContent: true,
                                html: '<center>Swipe to get back to search options.</center>'
                            },
                            {
                                xtype: 'component',
                                styleHtmlContent: true,
                                html: '<center>Tap a song to view the lyrics.</center>'
                            }
                        ]
                    }
                ]
            },
            {

                title: 'Search',
                slideButton: true,

                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        minHeight: '50px',
                        items: [
                            {
                                centered: true,
                                xtype: 'searchfield',
                                cls: 'customSearch',
                                name: 'search',
                                placeHolder: 'Search All Songs'
                            }
                        ]
                    },
                    {
                        xtype: 'TrackContainer'
                    }
                ]
            },
            {
                title: 'What\'s New',
                slideButton: true,

                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        minHeight: '50px',
                        title: 'What\'s New'
                    },
                    {
                        xtype: 'WhatsNew'
                    }
                ]
            },
            {
                title: 'Send A Request',
                slideButton: true,
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        minHeight: '50px',
                        title: 'Send A Request'
                    },
                    {
                        xtype: 'Submit'
                    }
                ]
            },
            {
                title: 'Issues',
                slideButton: true,
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        minHeight: '50px',
                        title: 'Issues'
                    },
                    {
                        xtype: 'Issues'
                    }
                ]
            }
        ]
    }
});
