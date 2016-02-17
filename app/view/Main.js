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
                                html: [
                                    '<div style="text-align:center;">',
                                        'Welcome to<br><h2>Nerdy Karaoke!</h2>',
                                        '<div class="secondaryText">',
                                            '<p>Hosted by Dick Steel</p>',
                                            'Hit the menu button to navigate<br>',
                                            'Tap a song to view the lyrics and sign up',
                                        '</div>',
                                    '</div>'
                                ].join('')
                            },
                            {
                                xtype: 'button',
                                margin: '0 0.75em 0.75em',
                                ui: 'confirm',
                                text: 'Changelog',
                                scrollDock: 'bottom',
                                docked: 'bottom'
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
                title: 'Disney!',
                slideButton: true,
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        minHeight: '50px',
                        title: 'Disney Songs'
                    },
                    {
                        xtype: 'CategoryContainer'
                    }
                ],
                listeners : {
                    painted: {
                        fn: function() {
                            ga('send', 'pageview', 'Disney');
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
                title: 'Request New Songs',
                slideButton: true,
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        minHeight: '50px',
                        title: 'Request New Songs'
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
