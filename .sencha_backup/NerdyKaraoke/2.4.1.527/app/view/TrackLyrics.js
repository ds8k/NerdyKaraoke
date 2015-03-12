Ext.define('NerdyKaraoke.view.TrackLyrics', {
    extend: 'Ext.Container',
    xtype: 'TrackLyrics',
    config: {
    	scrollable: false,
        height: '100%',
    	items: [
    		{
    			xtype: 'panel',
                name: 'lyricsbox',
                html: ''
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
                        action: 'goBack'
    				},
    				{
    					xtype: 'button',
                        text: 'Not found?',
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
