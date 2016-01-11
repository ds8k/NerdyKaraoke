Ext.define('NerdyKaraoke.view.WhatsNewLyrics', {
    extend: 'Ext.Container',
    xtype: 'WhatsNewLyrics',
    config: {
    	scrollable: false,
        height: '100%',
    	items: [
    		{
    			xtype: 'panel',
                name: 'newlyricsbox',
                html: ''
    		},
    		{
    			xtype: 'container',
    			layout: 'hbox',
    			docked: 'bottom',
                defaults: {
                    xtype: 'button',
                    cls: 'lyricsButton',
                    bottom: 0
                },
    			items: [
    				{
                        name: 'newBack',
    					text: 'Back',
    					right: '50%',
                        left: 0,
                        margin: '0.6em 0.3em 0.6em 0.75em',
                        action: 'goBack'
    				},
    				{
                        name: 'newSearch',
                        text: 'Not found?',
    					action: 'viewlyrics',
    					left: '50%',
                        right: 0,
                        margin: '0.6em 0.75em 0.6em 0.3em'
    				}
    			]
    		}
    	]
    }
});
