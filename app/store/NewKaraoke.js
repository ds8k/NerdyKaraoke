Ext.define('NerdyKaraoke.store.NewKaraoke', {
    extend: 'Ext.data.Store',

    config: {
		autoLoad: true,
		model: 'NerdyKaraoke.model.NewSongs',
		sorters: 'Artist',
        grouper: {
            sortProperty: 'index',
            groupFn: function(record) {
                return record.get('addNew');
            }
        },
        proxy: {
            noCache: false,
            enablePagingParams: false,
            type: 'ajax',
            url: 'new.json',

            reader: {
                type: 'json',
                rootProperty: 'karaoke'
            }
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
