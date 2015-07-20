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
        ui: 'normal',
        fullscreen: true,
        slideSelector: false,
        containerSlideDelay: 20,
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
                                html: '<center>Hit the menu button to navigate</center>'
                            },
                            {
                                xtype: 'component',
                                styleHtmlContent: true,
                                html: '<center>Tap a song to view the lyrics and sign up</center>'
                            }
                        ]
                    }
                ],
                listeners : {
                    painted: {
                        fn: function() {
                            ga('send', 'pageview', 'Homepage');
                        }
                    }
                }
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
                ],
                listeners : {
                    painted: {
                        fn: function() {
                            ga('send', 'pageview', 'Tracks');
                        }
                    }
                }
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
                        xtype: 'WhatsNewContainer'
                    }
                ],
                listeners : {
                    painted: {
                        fn: function() {
                            ga('send', 'pageview', 'What\'s New');
                        }
                    }
                }
            },
            {
                title: 'Request A Song',
                slideButton: true,
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        minHeight: '50px',
                        title: 'Request A Song'
                    },
                    {
                        xtype: 'Submit'
                    }
                ],
                listeners : {
                    painted: {
                        fn: function() {
                            ga('send', 'pageview', 'Request');
                        }
                    }
                }
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
                ],
                listeners : {
                    painted: {
                        fn: function() {
                            ga('send', 'pageview', 'Issues');
                        }
                    }
                }
            }
        ]
    }
});
