Ext.define('NerdyKaraoke.view.CategoryLyrics', {
    extend: 'Ext.Container',
    xtype: 'CategoryLyrics',
    config: {
    	scrollable: false,
        height: '100%',
    	items: [
    		{
    			xtype: 'panel',
                name: 'categorylyricsbox',
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
                        name: 'categoryBack',
    					text: 'Back',
    					right: '50%',
                        left: 0,
                        margin: '0.6em 0.3em 0.6em 0.75em',
                        action: 'goBack'
    				},
    				{
                        name: 'categorySearch',
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
