Ext.define('NerdyKaraoke.view.TrackLyrics', {
    extend: 'Ext.Container',
    xtype: 'TrackLyrics',
    config: {
    	items: [
    		{

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
    					left: '50%',
                        right: 0,
                        bottom: 0,
                        margin: '0.6em 0.75em 0.6em 0.3em',
    				}
    			]
    		}
    	]
    }
});
