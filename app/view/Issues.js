Ext.define('NerdyKaraoke.view.Issues', {
    extend: 'Ext.Container',
    xtype: 'Issues',

    config: {
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [
	        {
                xtype: 'component',
                styleHtmlContent: true,
                html: '<h3>Having Problems?</h3>'
            },
            {
                xtype: 'component',
                styleHtmlContent: true,
                margin: '-2em 0em 0em 0em',
                html: 'If you\'re having issues viewing the track list you may need to clear the website data in your mobile browser. Both Chrome and Safari have this option in their Settings menu.<br><br>If you still have problems or want to send suggestions feel free to use the button below:'
            },
            {
            	xtype: 'container',
                flex: 1,
                layout: {
                    type: 'vbox',
                    pack: 'middle',
                    align: 'stretch'
                },
                defaults: {
                    margin: '0 0.75em 0.75em',
                    xtype: 'button'
                },
                items: [
                    {
                    	text: 'Contact Me',
                    	ui: 'confirm',
                    	action: 'contactMe'
                    }
                ]
            }
		],
        listeners: {
            painted: function() {
                    ga('send', 'event', 'view', 'tap', 'Issues');
            }
        }
    }
});
