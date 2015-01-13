Ext.define('NerdyKaraoke.view.TrackLyrics', {
    extend: 'Ext.Container',
    xtype: 'TrackLyrics',
    config: {
    	scrollable: true,

    	items: [
    		{
    			xtype: 'container',
    			title: 'Lyrics',
				scrollDock: 'top',
				padding: '0px 0px 40px 0px',
				styleHtmlContent: true,
				html: 'Lyrics'
    		},
    		{
    			xtype: 'container',
    			layout: 'hbox',
    			docked: 'bottom',
    			items: [
    				{
    					xtype: 'button',
    					text: 'Back',
    					right: '50%',
                        left: 0,
                        bottom: 0,
                        margin: '0.6em 0.3em 0.6em 0.75em',
    					handler: function() {
    						Ext.ComponentQuery.query('TrackContainer')[0].setActiveItem(0);
    					}
    				},
    				{
    					xtype: 'button',
    					action: 'viewlyrics',
    					left: '50%',
                        right: 0,
                        bottom: 0,
                        margin: '0.6em 0.75em 0.6em 0.3em'
    				}
    			]
    		}
    	]
    }
});
