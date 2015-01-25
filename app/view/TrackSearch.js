Ext.define('NerdyKaraoke.view.TrackSearch', {
    extend: 'Ext.Container',
    xtype: 'TrackSearch',

    config: {
    	scrollable: true,
	    items: [
	    	{
	    		xtype: 'component',
	    		html: '<center><h3>Search by Artist Letter</h3></center>',
	    		styleHtmlContent: true
	    	},
            // {
            // 	xtype: 'spacer'
            // },
	    	{
	    		xtype: 'dataview',
	    		scrollable: null,
	    		store: 'Alphabet',
	    		action: 'filter',
	    		itemTpl: [ 
	    			'<div class="wrapper">' +
		    			'<div class="item">' +
		    				'<center>{text}</center>' +
		    			'</div>' + 
		    		'</div>'
	    		]
	    	},
	    	{
            	xtype: 'container',
                flex: 1,
                padding: '1em 0em 0em 0em',
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
                    	text: 'View Full List',
                    	ui: 'confirm',
                    	action: 'viewTracks'
                    }
                ]
            }
	    ]
    }
});
