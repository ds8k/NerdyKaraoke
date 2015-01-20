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
        'Ext.Button'
    ],
    
    config: {
        fullscreen: true,
        slideSelector: 'x-toolbar',
        containerSlideDelay: 10,
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

                title: 'Track List',
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
                                placeHolder: 'Nerdy Karaoke'
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
