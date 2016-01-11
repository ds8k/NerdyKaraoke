Ext.define('NerdyKaraoke.store.Karaoke', {
    extend: 'Ext.data.Store',

    config: {
		autoLoad: true,
		model: 'NerdyKaraoke.model.Songs',
		sorters: 'Title',
        proxy: {
            type: 'ajax',
            url: 'karaoke.json',

            reader: {
                type: 'json',
                rootProperty: 'karaoke',
                totalProperty: 'totalCount'
            }
        },
        grouper: {
            groupFn: function(record) {
                return record.data.Artist;
            },
            sortProperty: 'Sort'
        },
	    listeners: {
	        load: {
	            fn: function(){
	                Ext.Viewport.unmask();
	            }
	        }
	    }
    }
});
